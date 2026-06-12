import {
    r as s,
    j as e,
    f as ne
} from "./vendor-react-BfU3Zn2J.js";
import {
    h as Z,
    u as ae,
    w as ht,
    S as Le,
    x as bt,
    Q as De,
    R as Me,
    E as ut,
    a5 as gt,
    a4 as Ye,
    a6 as be,
    _ as ue,
    a7 as pt,
    a8 as ft,
    X as wt,
    Y as jt,
    Z as kt,
    a9 as Nt,
    aa as vt,
    A as yt,
    k as zt,
    ab as St,
    c as Ct
} from "./App-pJGjDiPw.js";
import {
    S as Pt,
    D as At
} from "./DashboardHeader-DNuRMna8.js";
import {
    a5 as It,
    aH as Je,
    ct as Ve,
    b as Se,
    B as fe,
    Z as te,
    ae as Et,
    U as we,
    cu as Tt,
    aI as Ft,
    aJ as Lt,
    cv as Dt,
    bB as Mt,
    cw as Bt,
    i as de,
    b3 as qe,
    b0 as Gt,
    b1 as je,
    bl as Rt,
    d as _,
    bm as Ut,
    bn as Ot,
    b4 as $t,
    b_ as me,
    bk as _t,
    bA as Xe,
    a7 as Ze,
    bj as re,
    f as Be,
    cc as ke,
    cx as Qt,
    cy as Ht,
    cz as Kt,
    ap as et,
    am as Ce,
    aa as tt,
    cA as st,
    T as ce,
    aj as Ne,
    bh as Wt,
    bi as Ge,
    bN as Yt,
    ab as se,
    P as at,
    bM as Jt,
    w as rt,
    cf as Vt,
    aZ as Pe,
    a6 as Re,
    k as qt,
    bH as ve,
    cB as Ue,
    h as Ae,
    bE as it,
    c7 as Ie,
    a2 as Oe,
    aY as le,
    cC as Xt,
    bL as ye,
    cD as Zt,
    aG as es,
    cE as ts,
    at as nt,
    S as oe,
    bf as dt,
    J as ss,
    aT as as,
    z as rs,
    o as is,
    R as $e,
    bw as ns,
    aw as ds,
    a3 as cs,
    bg as ls,
    X as ge,
    ag as ze,
    bc as os,
    as as xs,
    ar as ms,
    y as hs,
    bI as bs,
    aD as us,
    C as _e
} from "./vendor-icons-CqruUz7g.js";
import {
    T as D
} from "./Toggle-D54hkegy.js";
import {
    getFcmAvailability as gs,
    ensureMessagingToken as ps,
    getStoredMessagingToken as fs
} from "./messaging-BP0KfJxy.js";
import {
    t as ws
} from "./TaskController-BUyiMYKC.js";
import {
    u as js
} from "./useOnlineStatus-BJOTUERN.js";
import {
    h as Ee,
    j as ct,
    u as ie,
    k as ks
} from "./useFocusStore-CX_Nyp1h.js";
import {
    D as Ns,
    g as vs,
    s as ys,
    c as zs,
    a as Ss
} from "./focusBackground-t8AknbRg.js";
import {
    C as Qe
} from "./ChipMultiSelect-BU74OOip.js";
import {
    S as Cs
} from "./SubjectCreateModal-DhD_Cwbk.js";
import {
    g as Ps,
    b as As
} from "./studyPreferences-BBZvHe-O.js";
import {
    a as Is,
    b as Es,
    u as lt,
    A as He,
    j as Ts
} from "./useAIStore-B2cv1FZz.js";
import {
    u as Fs
} from "./useSyncStore-vWs_TdIc.js";
import {
    m as K,
    A as xe
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    c as $
} from "./utils-D8mZnxMk.js";
import {
    I as Ls
} from "./IsotopeLogoIcon-oPk5Ru-_.js";
import {
    u as Ds
} from "./useQuotesStore-C7b4gZp0.js";
import {
    b as Ms,
    u as Bs
} from "./vendor-router-CmoTwRnm.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./HeadwayUpdatesButton-DUh668tJ.js";
import "./timeFormat-CMPo-BX2.js";
import "./MarkdownRenderer-CIV1x0Uq.js";
import "./useNotificationStore-BS4df28T.js";
import "./subjectBranding-DaDo_h8r.js";
import "./SubjectIcon-CyCDqtel.js";
import "./vendor-charts-CFLJvnG7.js";
const Gs = () => {
        const {
            profile: t,
            updateProfile: j
        } = Z(), {
            email: g,
            userId: y
        } = ae(), h = s.useRef(null), [r, m] = s.useState({
            username: "",
            email: "",
            bio: "",
            institution: "",
            grade: "",
            studentStatus: "normal",
            interestedInStudyGroups: !1,
            collaborationStyle: "solo",
            shareProgress: !1
        }), [b, f] = s.useState(null), v = ht(r.bio, "bio");
        s.useEffect(() => {
            t && m({
                username: t.username || "",
                email: g || "",
                bio: t.bio || "",
                institution: t.academic ?.institution || "",
                grade: t.academic ?.grade || "",
                studentStatus: t.studyPreferences ?.studentStatus || "normal",
                interestedInStudyGroups: t.communityPreferences ?.interestedInStudyGroups ?? !1,
                collaborationStyle: t.communityPreferences ?.collaborationStyle || "solo",
                shareProgress: t.communityPreferences ?.shareProgress ?? !1
            })
        }, [t, g]);
        const l = (d = {}) => ({
                name: r.username,
                username: r.username,
                bio: r.bio,
                academic: { ...t ?.academic,
                    institution : r.institution,
                    grade: r.grade,
                    targetExams: t ?.academic ?.targetExams || [],
                    primarySubjects: t ?.academic ?.primarySubjects || []
                },
                studyPreferences: { ...t ?.studyPreferences,
                    dailyGoalHours : t ?.studyPreferences ?.dailyGoalHours || 4,
                    preferredFocusMethod: t ?.studyPreferences ?.preferredFocusMethod || "pomodoro",
                    studentStatus: r.studentStatus
                },
                communityPreferences: { ...t ?.communityPreferences,
                    interestedInStudyGroups : r.interestedInStudyGroups,
                    collaborationStyle: r.collaborationStyle,
                    communitySubjects: t ?.communityPreferences ?.communitySubjects || t ?.academic ?.primarySubjects || [],
                    shareProgress: r.shareProgress
                },
                ...d
            }),
            z = async () => {
                f(null);
                try {
                    await j(l())
                } catch (d) {
                    f(d.message || "Failed to save profile. Please check for restricted terms."), console.error("[ProfileSettings] Save failed:", d)
                }
            },
            N = (d, p) => {
                m(w => ({ ...w,
                    [d]: p
                }))
            },
            i = d => {
                const p = d.target.files ?.[0];
                if (!p) return;
                f(null);
                const w = new FileReader;
                w.onloadend = async () => {
                    const S = typeof w.result == "string" ? w.result : void 0;
                    if (S && S !== t ?.avatar) try {
                        await j(l({
                            avatar: S
                        }))
                    } catch (C) {
                        f(C.message || "Failed to update avatar."), console.error("[ProfileSettings] Avatar update failed:", C)
                    }
                }, w.readAsDataURL(p), d.target.value = ""
            },
            I = async () => {
                t ?.avatar && (await j(l({
                    avatar: void 0
                })), h.current && (h.current.value = ""))
            },
            o = y || t ?.id || "User";
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsxs("div", {
                className: "relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm",
                children: [e.jsx("div", {
                    className: "h-32 bg-gradient-to-r from-brand-500/20 to-brand-500/20 dark:from-brand-500/10 dark:to-brand-500/10"
                }), e.jsxs("div", {
                    className: "px-8 pb-8",
                    children: [e.jsxs("div", {
                        className: "relative flex justify-between items-end -mt-12 mb-6",
                        children: [e.jsxs("div", {
                            className: "relative group cursor-pointer",
                            children: [e.jsx("div", {
                                className: "w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-4 ring-white dark:ring-[#09090b] shadow-xl",
                                children: e.jsx("img", {
                                    src: t ?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${o}`,
                                    alt: "Profile",
                                    className: "w-full h-full object-cover"
                                })
                            }), e.jsx("div", {
                                className: "absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity",
                                children: e.jsx(It, {
                                    className: "w-6 h-6 text-white"
                                })
                            })]
                        }), e.jsxs("div", {
                            className: "flex gap-3",
                            children: [e.jsx("button", {
                                type: "button",
                                onClick: I,
                                disabled: !t ?.avatar,
                                className: "px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                children: "Remove"
                            }), e.jsx("button", {
                                type: "button",
                                onClick: () => h.current ?.click(),
                                className: "px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors shadow-lg shadow-brand-500/20",
                                children: "Upload New"
                            }), e.jsx("input", {
                                ref: h,
                                type: "file",
                                accept: "image/*",
                                className: "hidden",
                                onChange: i
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                        children: [e.jsxs("div", {
                            className: "space-y-6",
                            children: [e.jsxs("div", {
                                className: "space-y-2",
                                children: [e.jsx("label", {
                                    className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                    children: "Full Name"
                                }), e.jsxs("div", {
                                    className: "relative",
                                    children: [e.jsx(Je, {
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                                    }), e.jsx("input", {
                                        type: "text",
                                        value: r.username,
                                        onChange: d => N("username", d.target.value),
                                        placeholder: "Enter your name",
                                        maxLength: Le.username.maxChars,
                                        className: "w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                                    })]
                                })]
                            }), e.jsxs("div", {
                                className: "space-y-2",
                                children: [e.jsx("label", {
                                    className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                    children: "Email Address"
                                }), e.jsxs("div", {
                                    className: "relative",
                                    children: [e.jsx(Ve, {
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                                    }), e.jsx("input", {
                                        type: "email",
                                        value: r.email,
                                        onChange: d => N("email", d.target.value),
                                        placeholder: "your@email.com",
                                        disabled: !0,
                                        className: "w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                                    })]
                                })]
                            }), e.jsxs("div", {
                                className: "space-y-2",
                                children: [e.jsx("label", {
                                    className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                    children: "Bio"
                                }), e.jsx("textarea", {
                                    rows: 3,
                                    value: r.bio,
                                    onChange: d => N("bio", d.target.value),
                                    placeholder: "Tell us about yourself...",
                                    className: "w-full p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white resize-none"
                                }), e.jsx("p", {
                                    className: `text-xs ${v?.tone==="danger"?"text-amber-500":"text-zinc-500"}`,
                                    children: v ?.message || `${r.bio.length}/${Le.bio.maxChars} local chars. First ${bt("bio","cloud")} sync to cloud.`
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "space-y-6",
                            children: [e.jsxs("div", {
                                className: "space-y-2",
                                children: [e.jsx("label", {
                                    className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                    children: "University / School"
                                }), e.jsxs("div", {
                                    className: "relative",
                                    children: [e.jsx(Se, {
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                                    }), e.jsx("input", {
                                        type: "text",
                                        value: r.institution,
                                        onChange: d => N("institution", d.target.value),
                                        placeholder: "Your institution",
                                        className: "w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                                    })]
                                })]
                            }), e.jsxs("div", {
                                className: "space-y-2",
                                children: [e.jsx("label", {
                                    className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                    children: "Grade / Year"
                                }), e.jsxs("div", {
                                    className: "relative",
                                    children: [e.jsx(fe, {
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                                    }), e.jsx("input", {
                                        type: "text",
                                        value: r.grade,
                                        onChange: d => N("grade", d.target.value),
                                        placeholder: "e.g., Grade 12, Undergraduate",
                                        className: "w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                                    })]
                                })]
                            }), e.jsxs("div", {
                                className: "space-y-2",
                                children: [e.jsx("label", {
                                    className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                    children: "Student Status"
                                }), e.jsx("div", {
                                    className: "grid grid-cols-3 gap-2",
                                    children: [{
                                        id: "normal",
                                        label: "Normal",
                                        icon: fe
                                    }, {
                                        id: "exam",
                                        label: "Exam Mode",
                                        icon: te
                                    }, {
                                        id: "vacation",
                                        label: "Vacation",
                                        icon: Et
                                    }].map(d => e.jsxs("button", {
                                        onClick: () => m(p => ({ ...p,
                                            studentStatus: d.id
                                        })),
                                        className: `
                        flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all
                        ${r.studentStatus===d.id?"bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400":"bg-zinc-50 dark:bg-black/20 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"}
                      `,
                                        children: [e.jsx(d.icon, {
                                            className: "w-5 h-5"
                                        }), e.jsx("span", {
                                            className: "text-xs font-medium",
                                            children: d.label
                                        })]
                                    }, d.id))
                                }), e.jsxs("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                                    children: [r.studentStatus === "exam" && "Notifications silenced, focus mode prioritized.", r.studentStatus === "vacation" && "Daily goals paused, streaks frozen.", r.studentStatus === "normal" && "Standard productivity settings applied."]
                                })]
                            })]
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-sky-500/10 text-sky-500",
                        children: e.jsx(we, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Community Preferences"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Manage the collaboration settings you picked during onboarding."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5",
                    children: [e.jsxs("div", {
                        children: [e.jsx("h4", {
                            className: "font-medium text-zinc-900 dark:text-white",
                            children: "Interested in Study Groups"
                        }), e.jsx("p", {
                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                            children: "We use this for group recommendations and collaborative prompts."
                        })]
                    }), e.jsx("button", {
                        type: "button",
                        onClick: () => m(d => ({ ...d,
                            interestedInStudyGroups: !d.interestedInStudyGroups
                        })),
                        className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50
              ${r.interestedInStudyGroups?"bg-zinc-900 dark:bg-white":"bg-zinc-300 dark:bg-zinc-600"}`,
                        children: e.jsx("span", {
                            className: `inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-900 transition-transform
                ${r.interestedInStudyGroups?"translate-x-6":"translate-x-1"}`
                        })
                    })]
                }), e.jsx("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 gap-3",
                    children: [{
                        id: "solo",
                        label: "Solo",
                        icon: Tt
                    }, {
                        id: "partner",
                        label: "Partner",
                        icon: we
                    }, {
                        id: "group",
                        label: "Group",
                        icon: Ft
                    }, {
                        id: "flexible",
                        label: "Flexible",
                        icon: Lt
                    }].map(d => e.jsxs("button", {
                        type: "button",
                        onClick: () => m(p => ({ ...p,
                            collaborationStyle: d.id
                        })),
                        className: `flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${r.collaborationStyle===d.id?"border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400":"border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20"}`,
                        children: [e.jsx(d.icon, {
                            className: "w-5 h-5"
                        }), e.jsx("span", {
                            className: "font-medium",
                            children: d.label
                        })]
                    }, d.id))
                }), e.jsxs("label", {
                    className: "flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 cursor-pointer",
                    children: [e.jsx("input", {
                        type: "checkbox",
                        checked: r.shareProgress,
                        onChange: d => m(p => ({ ...p,
                            shareProgress: d.target.checked
                        })),
                        className: "w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white focus:ring-brand-500"
                    }), e.jsxs("div", {
                        children: [e.jsx("div", {
                            className: "font-medium text-zinc-900 dark:text-white",
                            children: "Share progress with study buddies"
                        }), e.jsx("p", {
                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                            children: "Controls whether achievements and streak activity can be shown in community contexts."
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "flex justify-end items-center gap-4",
                children: [b && e.jsx("p", {
                    className: "text-sm font-medium text-rose-500 animate-in fade-in slide-in-from-right-2",
                    children: b
                }), e.jsx("button", {
                    onClick: z,
                    className: "px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all",
                    children: "Save Changes"
                })]
            })]
        })
    },
    Rs = () => {
        const {
            identities: t,
            linkGoogleAccount: j,
            unlinkGoogleAccount: g,
            isLoading: y
        } = ae(), h = t.find(m => m.provider === "google"), r = !!h;
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-brand-500/10 text-brand-500",
                        children: e.jsx(Dt, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Password & Security"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Manage your password and security preferences"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "grid grid-cols-1 gap-6 max-w-xl",
                    children: [e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Current Password"
                        }), e.jsx("input", {
                            type: "password",
                            autoComplete: "current-password",
                            className: "w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "New Password"
                        }), e.jsx("input", {
                            type: "password",
                            autoComplete: "new-password",
                            className: "w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Confirm New Password"
                        }), e.jsx("input", {
                            type: "password",
                            autoComplete: "new-password",
                            className: "w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                        })]
                    })]
                }), e.jsx("div", {
                    className: "pt-2",
                    children: e.jsx("button", {
                        className: "px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95",
                        children: "Update Password"
                    })
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-blue-500/10 text-blue-500",
                        children: e.jsx(Mt, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Connected Accounts"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Manage your linked sign-in providers"
                        })]
                    })]
                }), e.jsx("div", {
                    className: "space-y-4",
                    children: e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700",
                                children: e.jsx(Bt, {
                                    className: "w-5 h-5 text-zinc-900 dark:text-white"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Google"
                                }), e.jsx("p", {
                                    className: "text-sm text-zinc-500 dark:text-zinc-400",
                                    children: r ? `Connected as ${h.identity_data?.email||"Google User"}` : "Link your Google account"
                                })]
                            })]
                        }), e.jsx("button", {
                            onClick: r ? g : j,
                            disabled: y,
                            className: `px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${r?"bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700":"bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 active:scale-95 shadow-lg"}`,
                            children: y ? e.jsx(de, {
                                className: "w-4 h-4 animate-spin"
                            }) : r ? e.jsx(e.Fragment, {
                                children: "Disconnect"
                            }) : e.jsx(e.Fragment, {
                                children: "Connect"
                            })
                        })]
                    })
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-red-500/10 text-red-500",
                        children: e.jsx(qe, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-red-600 dark:text-red-400",
                            children: "Danger Zone"
                        }), e.jsx("p", {
                            className: "text-sm text-red-500/80 dark:text-red-400/80",
                            children: "Irreversible account actions"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between p-4 rounded-xl bg-white dark:bg-black/20 border border-red-100 dark:border-red-500/10",
                    children: [e.jsxs("div", {
                        children: [e.jsx("h4", {
                            className: "font-medium text-zinc-900 dark:text-white",
                            children: "Delete Account"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400 mt-1",
                            children: "Permanently delete your account and all of your content."
                        })]
                    }), e.jsx("button", {
                        className: "px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-lg shadow-red-500/20",
                        children: "Delete Account"
                    })]
                })]
            })]
        })
    },
    Us = () => {
        const {
            profile: t,
            updateProfile: j
        } = Z(), [g, y] = s.useState("system"), [h, r] = s.useState("#f97316"), [m, b] = s.useState(!1), [f, v] = s.useState("standard"), [l, z] = s.useState("comfortable");
        s.useEffect(() => {
            t && (y(t.settings ?.theme || "system"), r(t.personalization ?.accentColor || "#f97316"), b(t.personalization ?.dyslexiaFont || !1), v(t.settings ?.performanceMode || "standard"), z(t.personalization ?.dashboardLayout || "comfortable"))
        }, [t]), s.useEffect(() => (De(h), () => {
            t ?.personalization ?.accentColor && De(t.personalization.accentColor)
        }), [h, t ?.personalization ?.accentColor]), s.useEffect(() => (Me(m), () => {
            Me(t ?.personalization ?.dyslexiaFont ?? ut)
        }), [m, t ?.personalization ?.dyslexiaFont]);
        const N = async () => {
            await j({
                settings: { ...t ?.settings,
                    theme : g,
                    notifications: t ?.settings ?.notifications ?? !0,
                    performanceMode: f
                },
                personalization: { ...t ?.personalization,
                    accentColor : h,
                    dashboardLayout: l,
                    showWelcomeTeaser: t ?.personalization ?.showWelcomeTeaser ?? !0,
                    dyslexiaFont: m
                }
            })
        };
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    children: [e.jsx("h3", {
                        className: "text-lg font-bold text-zinc-900 dark:text-white",
                        children: "Theme Preference"
                    }), e.jsx("p", {
                        className: "text-sm text-zinc-500 dark:text-zinc-400 mt-1",
                        children: "Choose how IsotopeAI looks to you."
                    })]
                }), e.jsx("div", {
                    className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
                    children: [{
                        id: "light",
                        icon: Gt,
                        label: "Light",
                        desc: "Always light mode"
                    }, {
                        id: "dark",
                        icon: je,
                        label: "Dark",
                        desc: "Always dark mode"
                    }, {
                        id: "system",
                        icon: Rt,
                        label: "System",
                        desc: "Follows system"
                    }].map(i => e.jsxs("button", {
                        onClick: () => y(i.id),
                        className: `
                relative p-4 rounded-xl border-2 text-left transition-all group
                ${g===i.id?"border-brand-500 bg-brand-50/50 dark:bg-brand-500/10":"border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"}
              `,
                        children: [e.jsx("div", {
                            className: `
                w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors
                ${i.id==="dark"?"bg-zinc-900 text-white":i.id==="light"?"bg-zinc-100 text-zinc-900":"bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400"}
              `,
                            children: e.jsx(i.icon, {
                                className: "w-5 h-5"
                            })
                        }), e.jsx("div", {
                            className: "font-medium text-zinc-900 dark:text-white",
                            children: i.label
                        }), e.jsx("div", {
                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                            children: i.desc
                        }), g === i.id && e.jsx("div", {
                            className: "absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center",
                            children: e.jsx(_, {
                                className: "w-3 h-3 text-white"
                            })
                        })]
                    }, i.id))
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    children: [e.jsx("h3", {
                        className: "text-lg font-bold text-zinc-900 dark:text-white",
                        children: "Dashboard Layout"
                    }), e.jsx("p", {
                        className: "text-sm text-zinc-500 dark:text-zinc-400 mt-1",
                        children: "This is the layout preference chosen during onboarding for your dashboard density."
                    })]
                }), e.jsx("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                    children: [{
                        id: "compact",
                        icon: Ut,
                        label: "Compact",
                        desc: "High density and tighter spacing."
                    }, {
                        id: "comfortable",
                        icon: Ot,
                        label: "Comfortable",
                        desc: "Balanced spacing and readability."
                    }, {
                        id: "spacious",
                        icon: $t,
                        label: "Spacious",
                        desc: "Larger cards with more breathing room."
                    }].map(i => e.jsxs("button", {
                        type: "button",
                        onClick: () => z(i.id),
                        className: `relative rounded-2xl border p-4 text-left transition-all ${l===i.id?"border-brand-500 bg-brand-50/70 dark:bg-brand-500/10":"border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"}`,
                        children: [e.jsx(i.icon, {
                            className: `w-5 h-5 mb-3 ${l===i.id?"text-brand-500":"text-zinc-500 dark:text-zinc-400"}`
                        }), e.jsx("div", {
                            className: "font-semibold text-zinc-900 dark:text-white",
                            children: i.label
                        }), e.jsx("p", {
                            className: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
                            children: i.desc
                        }), l === i.id && e.jsx("div", {
                            className: "absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center",
                            children: e.jsx(_, {
                                className: "w-3 h-3 text-white"
                            })
                        })]
                    }, i.id))
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-emerald-500/10 text-emerald-500",
                        children: e.jsx(me, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Accessibility"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Customize readability and visual aids"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-4",
                        children: [e.jsx("div", {
                            className: "p-3 rounded-full bg-white dark:bg-white/10 text-zinc-500 shadow-sm",
                            children: e.jsx(_t, {
                                className: "w-6 h-6"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsx("h4", {
                                className: "font-bold text-zinc-900 dark:text-white",
                                children: "Dyslexia Friendly Font"
                            }), e.jsx("p", {
                                className: "text-xs text-zinc-600 dark:text-zinc-300 mt-0.5",
                                children: "Switch to a readability-first font stack across the whole app."
                            })]
                        })]
                    }), e.jsx(D, {
                        checked: m,
                        onChange: () => b(!m),
                        ariaLabel: "Dyslexia Friendly Font"
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-amber-500/10 text-amber-500",
                        children: e.jsx(Xe, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Potato PC Mode (Performance Mode)"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Reduce motion and heavy visual effects for smoother performance on weaker devices."
                        })]
                    })]
                }), e.jsx("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [{
                        id: "standard",
                        label: "Standard",
                        description: "Full visuals with normal motion. Still respects your OS reduced-motion setting."
                    }, {
                        id: "optimized",
                        label: "Optimized",
                        description: "Cuts motion, blur, shimmer, particles, and chart animation to improve FPS."
                    }].map(i => e.jsx("button", {
                        onClick: () => v(i.id),
                        className: `
                relative rounded-2xl border p-4 text-left transition-all
                ${f===i.id?"border-amber-500 bg-amber-50/70 dark:bg-amber-500/10":"border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"}
              `,
                        children: e.jsxs("div", {
                            className: "flex items-start justify-between gap-3",
                            children: [e.jsxs("div", {
                                children: [e.jsx("div", {
                                    className: "font-semibold text-zinc-900 dark:text-white",
                                    children: i.label
                                }), e.jsx("p", {
                                    className: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
                                    children: i.description
                                })]
                            }), f === i.id && e.jsx("div", {
                                className: "flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white",
                                children: e.jsx(_, {
                                    className: "w-3.5 h-3.5"
                                })
                            })]
                        })
                    }, i.id))
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    children: [e.jsxs("h3", {
                        className: "text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2",
                        children: [e.jsx(Ze, {
                            className: "w-5 h-5 text-brand-500"
                        }), "Theme Studio"]
                    }), e.jsx("p", {
                        className: "text-sm text-zinc-500 dark:text-zinc-400 mt-1",
                        children: "Select your preferred accent color or create a custom one."
                    })]
                }), e.jsxs("div", {
                    className: "flex flex-wrap gap-4",
                    children: [gt.slice(0, 6).map(i => e.jsxs("button", {
                        onClick: () => r(i.color),
                        className: `
                group relative w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110
                ${h===i.color?"ring-4 ring-offset-2 ring-brand-500 ring-offset-white dark:ring-offset-[#09090b]":""}
              `,
                        style: {
                            backgroundColor: i.color
                        },
                        children: [h === i.color && e.jsx(_, {
                            className: "w-6 h-6 text-white"
                        }), e.jsx("span", {
                            className: "absolute -bottom-8 text-xs font-medium text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity",
                            children: i.name
                        })]
                    }, i.name)), e.jsxs("div", {
                        className: "relative group",
                        children: [e.jsx("div", {
                            className: "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[2px] cursor-pointer overflow-hidden",
                            children: e.jsxs("div", {
                                className: "relative w-full h-full rounded-full bg-white dark:bg-[#0c0c0e] flex items-center justify-center overflow-hidden",
                                children: [e.jsx("div", {
                                    className: "absolute inset-0 opacity-20",
                                    style: {
                                        background: h
                                    }
                                }), !["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#f43f5e", "#06b6d4"].includes(h) && e.jsx(_, {
                                    className: "w-5 h-5 text-zinc-900 dark:text-white relative z-10"
                                }), e.jsx("input", {
                                    type: "color",
                                    value: h,
                                    onChange: i => r(i.target.value),
                                    className: "absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0 opacity-0"
                                })]
                            })
                        }), e.jsx("span", {
                            className: "absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",
                            children: "Custom"
                        })]
                    })]
                })]
            }), e.jsx("div", {
                className: "flex justify-end",
                children: e.jsx("button", {
                    onClick: N,
                    className: "px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all",
                    children: "Save Changes"
                })
            })]
        })
    },
    Os = ["Quiet Space", "Background Music", "Study Group", "Outdoors", "Café Ambience", "At Home", "Library", "White Noise"],
    $s = () => {
        const {
            profile: t,
            updateProfile: j
        } = Z(), [g, y] = s.useState({
            marketing: !1,
            security: !0,
            updates: !0
        }), [h, r] = s.useState({
            taskReminders: !0,
            sessionBreaks: !0,
            dailySummary: !0,
            achievements: !0
        }), [m, b] = s.useState(!0), [f, v] = s.useState(!0), [l, z] = s.useState([]), [N, i] = s.useState("Notification" in window ? Notification.permission : "denied"), [I, o] = s.useState("checking"), [d, p] = s.useState(null), [w, S] = s.useState(!1), [C, u] = s.useState("idle");
        s.useEffect(() => {
            t ?.workflowPreferences ?.notificationTypes && r(t.workflowPreferences.notificationTypes), b(t ?.workflowPreferences ?.notificationsEnabled ?? !0), v(t ?.focusSettings ?.sessionEndSound ?? !0), z(t ?.workflowPreferences ?.studyEnvironment || [])
        }, [t]), s.useEffect(() => {
            P()
        }, [N]);
        const E = async () => {
                if ("Notification" in window) {
                    const x = await Notification.requestPermission();
                    i(x)
                }
            },
            P = async () => {
                S(!0);
                try {
                    const x = await gs();
                    if (!x.supported || !x.configured) {
                        o("unsupported"), p(null);
                        return
                    }
                    if (!x.hasVapidKey) {
                        o("missing-vapid"), p(null);
                        return
                    }
                    if (x.permission === "denied") {
                        o("blocked"), p(null);
                        return
                    }
                    if (x.permission !== "granted") {
                        o("permission-required"), p(null);
                        return
                    }
                    const k = await ps() ?? await fs();
                    p(k), o(k ? "ready" : "error")
                } catch (x) {
                    console.error("[NotificationSettings] Error loading Firebase broadcast status:", x), o("error"), p(null)
                } finally {
                    S(!1)
                }
            },
            F = async () => {
                !d || !navigator.clipboard || (await navigator.clipboard.writeText(d), u("copied"), window.setTimeout(() => {
                    u("idle")
                }, 2e3))
            },
            A = () => {
                switch (I) {
                    case "ready":
                        return "Broadcast pushes are ready on this device.";
                    case "permission-required":
                        return "Enable browser notifications to register this device with FCM.";
                    case "blocked":
                        return "Browser notifications are blocked, so Firebase broadcasts cannot reach this device.";
                    case "missing-vapid":
                        return "Add VITE_FIREBASE_VAPID_KEY to enable Firebase web push registration.";
                    case "unsupported":
                        return "Firebase web push is not available in this browser or environment.";
                    case "error":
                        return "We could not finish Firebase push registration on this device.";
                    case "checking":
                    default:
                        return "Checking Firebase broadcast push availability..."
                }
            },
            L = async () => {
                await j({
                    workflowPreferences: { ...t ?.workflowPreferences,
                        taskOrganizationStyle : t ?.workflowPreferences ?.taskOrganizationStyle || "kanban",
                        studyEnvironment: l,
                        notificationsEnabled: m,
                        notificationTypes: h
                    }
                }), await Z.getState().updateFocusSettings({
                    notificationInterval: Ye.notificationInterval,
                    sessionEndSound: f
                })
            },
            G = x => {
                z(k => k.includes(x) ? k.filter(R => R !== x) : [...k, x])
            };
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsx("div", {
                className: "p-6 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-500/10 border border-brand-500/20 shadow-sm space-y-4",
                children: e.jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx("div", {
                            className: "p-2 rounded-lg bg-brand-500 text-white shadow-lg shadow-brand-500/20",
                            children: e.jsx(re, {
                                className: "w-5 h-5"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsx("h3", {
                                className: "text-lg font-bold text-zinc-900 dark:text-white",
                                children: "Browser Notifications"
                            }), e.jsx("p", {
                                className: "text-sm text-zinc-500 dark:text-zinc-400",
                                children: N === "granted" ? "Notifications are enabled" : N === "denied" ? "Notifications are blocked by your browser" : "Grand permission to receive alerts"
                            })]
                        })]
                    }), N !== "granted" && e.jsx("button", {
                        onClick: E,
                        className: "px-4 py-2 bg-brand-500 text-white text-sm font-bold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20",
                        children: "Enable Now"
                    }), N === "granted" && e.jsxs("div", {
                        className: "flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20",
                        children: [e.jsx(Be, {
                            className: "w-4 h-4"
                        }), "Active"]
                    })]
                })
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-brand-500/10 text-brand-500",
                        children: e.jsx(re, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Workflow Alerts"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Onboarding preferences for reminders and your typical study environment."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5",
                    children: [e.jsxs("div", {
                        children: [e.jsx("h4", {
                            className: "font-medium text-zinc-900 dark:text-white",
                            children: "Enable Notifications"
                        }), e.jsx("p", {
                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                            children: "Master switch for task reminders, summaries, and achievement nudges."
                        })]
                    }), e.jsx(D, {
                        checked: m,
                        onChange: () => b(!m)
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5",
                    children: [e.jsxs("div", {
                        children: [e.jsx("h4", {
                            className: "font-medium text-zinc-900 dark:text-white",
                            children: "Session End Sound"
                        }), e.jsx("p", {
                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                            children: "Play a gentle chime when focus sessions or breaks complete."
                        })]
                    }), e.jsx(D, {
                        checked: f,
                        onChange: () => v(!f)
                    })]
                }), e.jsxs("div", {
                    className: "space-y-3",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [e.jsx(ke, {
                            className: "w-4 h-4 text-zinc-500 dark:text-zinc-400"
                        }), e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Study Environment"
                        })]
                    }), e.jsx("div", {
                        className: "flex flex-wrap gap-2",
                        children: Os.map(x => {
                            const k = l.includes(x);
                            return e.jsx("button", {
                                type: "button",
                                onClick: () => G(x),
                                className: `px-3 py-2 rounded-full text-sm font-medium border transition-all ${k?"border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400":"border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20"}`,
                                children: x
                            }, x)
                        })
                    }), e.jsx("p", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: "Kept here so your work-style inputs from onboarding remain editable in settings."
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-blue-500/10 text-blue-500",
                        children: e.jsx(Ve, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Email Notifications"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Manage what emails you receive"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10",
                                children: e.jsx(te, {
                                    className: "w-4 h-4 text-zinc-500 dark:text-zinc-400"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Product Updates"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "New features and improvements"
                                })]
                            })]
                        }), e.jsx(D, {
                            checked: g.updates,
                            onChange: () => y(x => ({ ...x,
                                updates: !x.updates
                            }))
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10",
                                children: e.jsx(_s, {
                                    className: "w-4 h-4 text-zinc-500 dark:text-zinc-400"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Security Alerts"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "Login attempts and password changes"
                                })]
                            })]
                        }), e.jsx(D, {
                            checked: g.security,
                            onChange: () => y(x => ({ ...x,
                                security: !x.security
                            }))
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-emerald-500/10 text-emerald-500",
                        children: e.jsx(Qt, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Push Notifications"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Manage mobile and web alerts"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 space-y-4",
                    children: [e.jsxs("div", {
                        className: "flex items-start justify-between gap-4",
                        children: [e.jsxs("div", {
                            className: "flex items-start gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10",
                                children: e.jsx(Ht, {
                                    className: "w-4 h-4 text-zinc-500 dark:text-zinc-400"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Firebase Broadcast Push"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                                    children: A()
                                })]
                            })]
                        }), e.jsxs("button", {
                            type: "button",
                            onClick: () => void P(),
                            disabled: w,
                            className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/5 transition-colors disabled:opacity-60",
                            children: [e.jsx(Kt, {
                                className: `w-3.5 h-3.5 ${w?"animate-spin":""}`
                            }), "Refresh"]
                        })]
                    }), d && e.jsxs("div", {
                        className: "space-y-3",
                        children: [e.jsxs("div", {
                            className: "rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-3 py-2",
                            children: [e.jsx("p", {
                                className: "text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
                                children: "Test Device Token"
                            }), e.jsx("p", {
                                className: "mt-2 text-xs text-zinc-700 dark:text-zinc-300 break-all",
                                children: d
                            })]
                        }), e.jsxs("button", {
                            type: "button",
                            onClick: () => void F(),
                            className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors",
                            children: [e.jsx(et, {
                                className: "w-3.5 h-3.5"
                            }), C === "copied" ? "Copied" : "Copy Test Token"]
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10",
                                children: e.jsx(Be, {
                                    className: "w-4 h-4 text-zinc-500 dark:text-zinc-400"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Task Reminders"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "When tasks are due or completed"
                                })]
                            })]
                        }), e.jsx(D, {
                            checked: h.taskReminders,
                            onChange: () => r(x => ({ ...x,
                                taskReminders: !x.taskReminders
                            }))
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10",
                                children: e.jsx(Ce, {
                                    className: "w-4 h-4 text-zinc-500 dark:text-zinc-400"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Session Breaks"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "Break reminders during focus sessions"
                                })]
                            })]
                        }), e.jsx(D, {
                            checked: h.sessionBreaks,
                            onChange: () => r(x => ({ ...x,
                                sessionBreaks: !x.sessionBreaks
                            }))
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10",
                                children: e.jsx(re, {
                                    className: "w-4 h-4 text-zinc-500 dark:text-zinc-400"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Daily Summary"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "End of day productivity summary"
                                })]
                            })]
                        }), e.jsx(D, {
                            checked: h.dailySummary,
                            onChange: () => r(x => ({ ...x,
                                dailySummary: !x.dailySummary
                            }))
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10",
                                children: e.jsx(te, {
                                    className: "w-4 h-4 text-zinc-500 dark:text-zinc-400"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Achievements"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "Streaks and milestones"
                                })]
                            })]
                        }), e.jsx(D, {
                            checked: h.achievements,
                            onChange: () => r(x => ({ ...x,
                                achievements: !x.achievements
                            }))
                        })]
                    })]
                })]
            }), e.jsx("div", {
                className: "flex justify-end",
                children: e.jsx("button", {
                    onClick: L,
                    className: "px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all",
                    children: "Save Changes"
                })
            })]
        })
    },
    _s = ({
        className: t
    }) => e.jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: t,
        children: e.jsx("path", {
            d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        })
    }),
    Qs = () => {
        const [t, j] = ne.useState(!1), {
            identities: g,
            linkGoogleAccount: y,
            unlinkGoogleAccount: h,
            isPremium: r,
            userId: m
        } = ae(), [b, f] = ne.useState(!1), {
            isOnline: v
        } = js(), l = g.some(o => o.provider === "google"), z = r(), N = async () => {
            v && (l ? confirm("Are you sure you want to disconnect your Google account? This will stop all synchronization.") && await h() : await y())
        }, i = async () => {
            if (!(!m || b || !v)) {
                f(!0);
                try {
                    await ws.runManual(m, !0)
                } finally {
                    f(!1)
                }
            }
        }, I = () => {
            j(!0), setTimeout(() => j(!1), 2e3)
        };
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-blue-500/10 text-blue-500",
                        children: e.jsx(Ce, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Calendar Sync"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Bi-directional sync with your calendars"
                        })]
                    })]
                }), !v && e.jsx("div", {
                    className: "rounded-xl border border-blue-500/30 bg-blue-500/10 p-4",
                    children: e.jsx("p", {
                        className: "text-sm text-blue-700 dark:text-blue-300",
                        children: "Google Calendar and Google Tasks need an internet connection. The rest of your study workflow still works offline."
                    })
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group border border-zinc-200 dark:border-white/5",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-4",
                            children: [e.jsx("div", {
                                className: "w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm p-2",
                                children: e.jsx("img", {
                                    src: "https://www.google.com/favicon.ico",
                                    alt: "Google",
                                    className: "w-full h-full object-contain"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Google Workspace"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "Sync Calendar & Tasks (Premium)"
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [l && z && e.jsx("button", {
                                onClick: i,
                                disabled: b || !v,
                                className: "p-2 rounded-lg bg-zinc-200 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-white/10 transition-colors",
                                title: v ? "Sync Now" : "Sync requires internet access",
                                children: b ? e.jsx(de, {
                                    className: "w-4 h-4 animate-spin"
                                }) : e.jsx(tt, {
                                    className: "w-4 h-4"
                                })
                            }), e.jsx("button", {
                                onClick: N,
                                disabled: !v,
                                className: `
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${l?"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20":"bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-white/20"}
                `,
                                children: v ? l ? "Connected" : "Connect" : "Offline"
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 opacity-50 grayscale cursor-not-allowed border border-zinc-200 dark:border-white/5",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-4",
                            children: [e.jsx("div", {
                                className: "w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm p-2",
                                children: e.jsx("img", {
                                    src: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg",
                                    alt: "Outlook",
                                    className: "w-full h-full object-contain"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: "Outlook Calendar"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "Coming Soon"
                                })]
                            })]
                        }), e.jsx("button", {
                            disabled: !0,
                            className: "px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-200 dark:bg-white/10 text-zinc-400",
                            children: "Unavailable"
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-red-500/10 text-red-500",
                        children: e.jsx(fe, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "LMS Integration"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Connect your Learning Management System"
                        })]
                    })]
                }), e.jsx("div", {
                    className: "space-y-4",
                    children: [{
                        name: "Canvas",
                        icon: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Canvas_logo.png",
                        status: "Not Connected"
                    }, {
                        name: "Blackboard",
                        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Blackboard_Learn_logo.png/600px-Blackboard_Learn_logo.png",
                        status: "Not Connected"
                    }].map(o => e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group border border-zinc-200 dark:border-white/5",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-4",
                            children: [e.jsx("div", {
                                className: "w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm p-2",
                                children: e.jsx("img", {
                                    src: o.icon,
                                    alt: o.name,
                                    className: "w-full h-full object-contain"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: o.name
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "Import courses and assignments"
                                })]
                            })]
                        }), e.jsx("button", {
                            className: `
                px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${o.status==="Connected"?"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20":"bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-white/20"}
              `,
                            children: o.status === "Connected" ? "Connected" : "Connect"
                        })]
                    }, o.name))
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-amber-500/10 text-amber-500",
                        children: e.jsx(st, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "API Access"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Manage your API keys and access tokens"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsxs("div", {
                        className: "p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10",
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between mb-2",
                            children: [e.jsx("h4", {
                                className: "text-sm font-medium text-zinc-900 dark:text-white",
                                children: "Production Key"
                            }), e.jsx("span", {
                                className: "px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider",
                                children: "Active"
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("code", {
                                className: "flex-1 p-2.5 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 font-mono text-xs text-zinc-600 dark:text-zinc-400 truncate",
                                children: "sk_live_51Mz...92xY"
                            }), e.jsx("button", {
                                onClick: I,
                                className: "p-2.5 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400",
                                children: t ? e.jsx(_, {
                                    className: "w-4 h-4 text-emerald-500"
                                }) : e.jsx(et, {
                                    className: "w-4 h-4"
                                })
                            })]
                        }), e.jsx("p", {
                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-2",
                            children: "Created on Nov 23, 2025. Last used just now."
                        })]
                    }), e.jsx("button", {
                        className: "w-full py-2.5 border border-dashed border-zinc-300 dark:border-white/20 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all",
                        children: "Generate New Key"
                    })]
                })]
            })]
        })
    },
    Hs = () => {
        const {
            profile: t,
            updateProfile: j,
            updateFocusSettings: g
        } = Z(), [y, h] = s.useState(25), [r, m] = s.useState(5), [b, f] = s.useState(15), [v, l] = s.useState(4), [z, N] = s.useState("lofi"), [i, I] = s.useState(!1), [o, d] = s.useState(!0), [p, w] = s.useState(!0), [S, C] = s.useState(!0), [u, E] = s.useState(0), [P, F] = s.useState(4), [A, L] = s.useState("pomodoro"), [G, x] = s.useState(""), [k, R] = s.useState(Ns), [W, J] = s.useState(null), [T, Q] = s.useState(be), [V, q] = s.useState(""), [c, n] = s.useState("📌");
        s.useEffect(() => {
            if (t) {
                const a = t.studyPreferences ?.pomodoroSettings;
                a && (h(a.workDuration || 25), m(a.shortBreakDuration || 5), f(a.longBreakDuration || 15), l(a.sessionsUntilLongBreak || 4)), I(t.focusSettings ?.autoStartBreaks || !1), d(t.focusSettings ?.showPauseReasonPicker ?? !0), w(t.focusSettings ?.showSessionCompletionCard ?? t.focusSettings ?.showSessionProductivityRating ?? !0), C(t.focusSettings ?.showQuestionTrackingInTimerPip ?? !0), N(t.studyPreferences ?.soundscapePreference || "lofi"), E(t.studyPreferences ?.dayOffset || 0), F(t.studyPreferences ?.dailyGoalHours || 4), L(t.studyPreferences ?.preferredFocusMethod || "pomodoro"), Q(ue(t.focusSettings ?.focusTypes))
            }
        }, [t]), s.useEffect(() => {
            (async () => {
                const a = await vs();
                x(a.imageUrl || ""), J(a.imageUrl), R(a.blurAmount)
            })()
        }, []);
        const U = async () => {
                await j({
                    studyPreferences: { ...t ?.studyPreferences,
                        dailyGoalHours : P,
                        preferredFocusMethod: A,
                        pomodoroSettings: {
                            workDuration: y,
                            shortBreakDuration: r,
                            longBreakDuration: b,
                            sessionsUntilLongBreak: v
                        },
                        soundscapePreference: z,
                        dayOffset: u
                    }
                }), await g({
                    autoStartBreaks: i,
                    showPauseReasonPicker: o,
                    showSessionCompletionCard: p,
                    showQuestionTrackingInTimerPip: S,
                    showSessionProductivityRating: p,
                    focusTypes: ue(T),
                    defaultDuration: y,
                    shortBreakDuration: r,
                    longBreakDuration: b,
                    pomodorosUntilLongBreak: v,
                    notificationInterval: Ye.notificationInterval
                });
                const a = await Ss({
                    imageUrl: G,
                    blurAmount: k
                });
                x(a.imageUrl || ""), J(a.imageUrl), Ee.getState().initializeFromUserProfile()
            },
            M = async () => {
                await zs(), x(""), J(null)
            },
            O = ys(G),
            Y = (a, B) => {
                Q(ee => ue(ee.map(H => H.id === a ? { ...H,
                    ...B,
                    id: a
                } : H)))
            },
            X = () => {
                const a = V.trim();
                if (!a) return;
                const B = pt(a),
                    ee = new Set(T.map(he => he.id));
                let H = B,
                    Te = 2;
                for (; ee.has(H);) H = `${B}-${Te}`, Te += 1;
                const Fe = ft({
                    id: H,
                    label: a,
                    icon: c,
                    trackQuestions: !1
                });
                Fe && (Q(he => [...he, Fe]), q(""), n("📌"))
            },
            ot = a => {
                Q(B => {
                    const ee = B.filter(H => H.id !== a);
                    return ee.length > 0 ? ee : be
                })
            },
            xt = [{
                id: "lofi",
                name: "Lo-Fi Beats",
                icon: Re,
                color: "bg-brand-500"
            }, {
                id: "white",
                name: "White Noise",
                icon: ke,
                color: "bg-zinc-500"
            }, {
                id: "rain",
                name: "Rain Sounds",
                icon: je,
                color: "bg-blue-500"
            }, {
                id: "none",
                name: "No Sound",
                icon: ke,
                color: "bg-zinc-400"
            }],
            mt = [{
                id: "pomodoro",
                label: "Pomodoro",
                description: "Structured intervals and breaks.",
                icon: Ne
            }, {
                id: "stopwatch",
                label: "Stopwatch",
                description: "Flexible timing for long sessions.",
                icon: Wt
            }, {
                id: "custom",
                label: "Custom",
                description: "Use your own interval rhythm.",
                icon: Ge
            }];
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-brand-500/10 text-brand-500",
                        children: e.jsx(ce, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Goals & Focus Style"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "These are the Step 3 onboarding defaults that shape analytics and focus mode."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsxs("div", {
                        className: "flex justify-between items-end",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Daily Goal"
                        }), e.jsxs("span", {
                            className: "text-2xl font-bold text-brand-500",
                            children: [P, "h"]
                        })]
                    }), e.jsx("input", {
                        type: "range",
                        min: "1",
                        max: "12",
                        step: "1",
                        value: P,
                        onChange: a => F(parseInt(a.target.value, 10)),
                        className: "w-full h-2 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    }), e.jsxs("div", {
                        className: "flex justify-between text-xs text-zinc-400",
                        children: [e.jsx("span", {
                            children: "1h"
                        }), e.jsx("span", {
                            children: "12h"
                        })]
                    })]
                }), e.jsx("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-3",
                    children: mt.map(a => e.jsxs("button", {
                        type: "button",
                        onClick: () => L(a.id),
                        className: `rounded-xl border p-4 text-left transition-all ${A===a.id?"border-brand-500 bg-brand-50 dark:bg-brand-500/10":"border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 hover:border-zinc-300 dark:hover:border-white/20"}`,
                        children: [e.jsx(a.icon, {
                            className: `w-5 h-5 mb-3 ${A===a.id?"text-brand-500":"text-zinc-500 dark:text-zinc-400"}`
                        }), e.jsx("div", {
                            className: "font-semibold text-zinc-900 dark:text-white",
                            children: a.label
                        }), e.jsx("p", {
                            className: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
                            children: a.description
                        })]
                    }, a.id))
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx("div", {
                            className: "p-2 rounded-lg bg-amber-500/10 text-amber-500",
                            children: e.jsx(Ge, {
                                className: "w-5 h-5"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsx("h3", {
                                className: "text-lg font-bold text-zinc-900 dark:text-white",
                                children: "Focus Types"
                            }), e.jsx("p", {
                                className: "text-sm text-zinc-500 dark:text-zinc-400",
                                children: "Customize session categories and decide which ones show question tracking."
                            })]
                        })]
                    }), e.jsxs("button", {
                        type: "button",
                        onClick: () => Q(be),
                        className: "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors",
                        children: [e.jsx(Yt, {
                            className: "w-4 h-4"
                        }), "Reset"]
                    })]
                }), e.jsx("div", {
                    className: "space-y-3",
                    children: T.map(a => e.jsxs("div", {
                        className: "grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 p-4 md:grid-cols-[72px_minmax(160px,1fr)_minmax(140px,180px)_auto_auto]",
                        children: [e.jsxs("div", {
                            children: [e.jsx("label", {
                                className: "text-xs font-semibold text-zinc-500 dark:text-zinc-400",
                                children: "Icon"
                            }), e.jsx("input", {
                                value: a.icon,
                                onChange: B => Y(a.id, {
                                    icon: B.target.value
                                }),
                                className: "mt-1 w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black/30 px-3 py-2 text-center text-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30",
                                maxLength: 4
                            })]
                        }), e.jsxs("div", {
                            children: [e.jsx("label", {
                                className: "text-xs font-semibold text-zinc-500 dark:text-zinc-400",
                                children: "Label"
                            }), e.jsx("input", {
                                value: a.label,
                                onChange: B => Y(a.id, {
                                    label: B.target.value
                                }),
                                className: "mt-1 w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black/30 px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30",
                                maxLength: 28
                            })]
                        }), e.jsxs("div", {
                            children: [e.jsx("label", {
                                className: "text-xs font-semibold text-zinc-500 dark:text-zinc-400",
                                children: "Default Target"
                            }), e.jsx("input", {
                                type: "number",
                                min: 0,
                                disabled: !a.trackQuestions,
                                value: a.defaultQuestionTarget || "",
                                onChange: B => Y(a.id, {
                                    defaultQuestionTarget: parseInt(B.target.value, 10) || 0
                                }),
                                placeholder: "None",
                                className: "mt-1 w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black/30 px-3 py-2 text-sm text-zinc-900 disabled:opacity-40 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                            })]
                        }), e.jsx("div", {
                            className: "flex items-end",
                            children: e.jsxs("label", {
                                className: "flex min-h-10 items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black/30 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200",
                                children: [e.jsx("input", {
                                    type: "checkbox",
                                    checked: a.trackQuestions,
                                    onChange: B => Y(a.id, {
                                        trackQuestions: B.target.checked,
                                        defaultQuestionTarget: B.target.checked ? a.defaultQuestionTarget : void 0
                                    }),
                                    className: "h-4 w-4 rounded border-zinc-300 accent-brand-500"
                                }), "Count questions"]
                            })
                        }), e.jsx("div", {
                            className: "flex items-end",
                            children: e.jsx("button", {
                                type: "button",
                                onClick: () => ot(a.id),
                                className: "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10 transition-colors",
                                "aria-label": `Delete ${a.label}`,
                                children: e.jsx(se, {
                                    className: "w-4 h-4"
                                })
                            })
                        })]
                    }, a.id))
                }), e.jsxs("div", {
                    className: "grid grid-cols-1 gap-3 rounded-2xl border border-dashed border-zinc-300 dark:border-white/15 p-4 md:grid-cols-[72px_minmax(160px,1fr)_auto]",
                    children: [e.jsx("input", {
                        value: c,
                        onChange: a => n(a.target.value),
                        className: "rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 px-3 py-2 text-center text-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30",
                        maxLength: 4,
                        "aria-label": "New focus type icon"
                    }), e.jsx("input", {
                        value: V,
                        onChange: a => q(a.target.value),
                        onKeyDown: a => {
                            a.key === "Enter" && (a.preventDefault(), X())
                        },
                        placeholder: "Add a focus type",
                        className: "rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 px-4 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    }), e.jsxs("button", {
                        type: "button",
                        onClick: X,
                        className: "inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors",
                        children: [e.jsx(at, {
                            className: "w-4 h-4"
                        }), "Add Type"]
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-violet-500/10 text-violet-500",
                        children: e.jsx(Ne, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Timer Configuration"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Customize your Pomodoro intervals"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                    children: [e.jsxs("div", {
                        className: "space-y-3",
                        children: [e.jsxs("div", {
                            className: "flex justify-between",
                            children: [e.jsx("label", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Focus Duration"
                            }), e.jsxs("span", {
                                className: "text-sm font-bold text-violet-500",
                                children: [y, " min"]
                            })]
                        }), e.jsx("input", {
                            type: "range",
                            min: "15",
                            max: "300",
                            step: "5",
                            value: y,
                            onChange: a => h(parseInt(a.target.value)),
                            className: "w-full h-2 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                        }), e.jsxs("div", {
                            className: "flex justify-between text-xs text-zinc-400",
                            children: [e.jsx("span", {
                                children: "15m"
                            }), e.jsx("span", {
                                children: "300m"
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-3",
                        children: [e.jsxs("div", {
                            className: "flex justify-between",
                            children: [e.jsx("label", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Short Break"
                            }), e.jsxs("span", {
                                className: "text-sm font-bold text-emerald-500",
                                children: [r, " min"]
                            })]
                        }), e.jsx("input", {
                            type: "range",
                            min: "2",
                            max: "15",
                            step: "1",
                            value: r,
                            onChange: a => m(parseInt(a.target.value)),
                            className: "w-full h-2 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        }), e.jsxs("div", {
                            className: "flex justify-between text-xs text-zinc-400",
                            children: [e.jsx("span", {
                                children: "2m"
                            }), e.jsx("span", {
                                children: "15m"
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-3",
                        children: [e.jsxs("div", {
                            className: "flex justify-between",
                            children: [e.jsx("label", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Long Break"
                            }), e.jsxs("span", {
                                className: "text-sm font-bold text-blue-500",
                                children: [b, " min"]
                            })]
                        }), e.jsx("input", {
                            type: "range",
                            min: "10",
                            max: "45",
                            step: "5",
                            value: b,
                            onChange: a => f(parseInt(a.target.value)),
                            className: "w-full h-2 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        }), e.jsx("div", {
                            className: "flex justify-between text-xs text-zinc-400",
                            children: e.jsx("span", {
                                children: "10m"
                            })
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-3 pt-4 border-t border-zinc-100 dark:border-white/5",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx("div", {
                            className: "p-2 rounded-lg bg-orange-500/10 text-orange-500",
                            children: e.jsx(je, {
                                className: "w-4 h-4"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [e.jsx("h4", {
                                    className: "text-sm font-medium text-zinc-900 dark:text-white",
                                    children: "Day Extension (Late Night Study)"
                                }), e.jsx("span", {
                                    className: "text-sm font-bold text-orange-500",
                                    children: u === 0 ? "Midnight" : `${u}:00 AM`
                                })]
                            }), e.jsx("p", {
                                className: "text-xs text-zinc-500 dark:text-zinc-400",
                                children: "Sessions recorded before this time count towards the previous day."
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "pl-14",
                        children: [e.jsx("input", {
                            type: "range",
                            min: "0",
                            max: "6",
                            step: "1",
                            value: u,
                            onChange: a => E(parseInt(a.target.value)),
                            className: "w-full h-2 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        }), e.jsxs("div", {
                            className: "flex justify-between text-xs text-zinc-400 mt-1",
                            children: [e.jsx("span", {
                                children: "12 AM"
                            }), e.jsx("span", {
                                children: "6 AM"
                            })]
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx("div", {
                            className: "p-2 rounded-lg bg-zinc-100 dark:bg-white/5",
                            children: e.jsx(te, {
                                className: "w-4 h-4 text-zinc-500"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsx("h4", {
                                className: "text-sm font-medium text-zinc-900 dark:text-white",
                                children: "Auto-start Breaks"
                            }), e.jsx("p", {
                                className: "text-xs text-zinc-500 dark:text-zinc-400",
                                children: "Automatically start break timer when focus ends"
                            })]
                        })]
                    }), e.jsx(D, {
                        checked: i,
                        onChange: () => I(!i)
                    })]
                }), e.jsxs("div", {
                    className: "space-y-4 pt-4 border-t border-zinc-100 dark:border-white/5",
                    children: [e.jsx("h4", {
                        className: "text-sm font-medium text-zinc-900 dark:text-white",
                        children: "Session Prompts"
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-zinc-100 dark:bg-white/5",
                                children: e.jsx(Jt, {
                                    className: "w-4 h-4 text-zinc-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h5", {
                                    className: "text-sm font-medium text-zinc-900 dark:text-white",
                                    children: "Pause Reason Options"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "Show pause reasons before pausing a session."
                                })]
                            })]
                        }), e.jsx(D, {
                            checked: o,
                            onChange: () => d(!o)
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-zinc-100 dark:bg-white/5",
                                children: e.jsx(rt, {
                                    className: "w-4 h-4 text-zinc-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h5", {
                                    className: "text-sm font-medium text-zinc-900 dark:text-white",
                                    children: "Session Complete Card"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "Shows end-of-session inputs (rating, efficiency, notes, question split) used for analytics and AI coaching quality."
                                })]
                            })]
                        }), e.jsx(D, {
                            checked: p,
                            onChange: () => w(!p)
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-zinc-100 dark:bg-white/5",
                                children: e.jsx(ce, {
                                    className: "w-4 h-4 text-zinc-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h5", {
                                    className: "text-sm font-medium text-zinc-900 dark:text-white",
                                    children: "Timer PiP Question Tracking"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: "Show correct, incorrect, skipped, and target controls in the minimized timer window."
                                })]
                            })]
                        }), e.jsx(D, {
                            checked: S,
                            onChange: () => C(!S)
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-3 pt-4 border-t border-zinc-100 dark:border-white/5",
                    children: [e.jsxs("div", {
                        className: "flex justify-between",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Sessions until Long Break"
                        }), e.jsx("span", {
                            className: "text-sm font-bold text-violet-500",
                            children: v
                        })]
                    }), e.jsx("input", {
                        type: "range",
                        min: "2",
                        max: "8",
                        step: "1",
                        value: v,
                        onChange: a => l(parseInt(a.target.value)),
                        className: "w-full h-2 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    }), e.jsxs("div", {
                        className: "flex justify-between text-xs text-zinc-400",
                        children: [e.jsx("span", {
                            children: "2"
                        }), e.jsx("span", {
                            children: "8"
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-sky-500/10 text-sky-500",
                        children: e.jsx(Vt, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Focus Background"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Add a local-only background image and control how much blur appears behind the focus controls."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-3",
                    children: [e.jsx("label", {
                        htmlFor: "focus-background-image-url",
                        className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                        children: "Background Image URL"
                    }), e.jsx("input", {
                        id: "focus-background-image-url",
                        type: "url",
                        value: G,
                        onChange: a => x(a.target.value),
                        placeholder: "https://example.com/focus-background.jpg",
                        className: "w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    }), e.jsx("p", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: "Stored only on this device. It won't be synced to the cloud database."
                    }), G && !O && e.jsx("p", {
                        className: "text-xs text-rose-500",
                        children: "Enter a valid `http://` or `https://` image URL before saving."
                    })]
                }), e.jsxs("div", {
                    className: "space-y-3 pt-2",
                    children: [e.jsxs("div", {
                        className: "flex justify-between",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Background Blur on Focus Page"
                        }), e.jsxs("span", {
                            className: "text-sm font-bold text-sky-500",
                            children: [k, "px"]
                        })]
                    }), e.jsx("input", {
                        type: "range",
                        min: "0",
                        max: "24",
                        step: "1",
                        value: k,
                        onChange: a => R(parseInt(a.target.value, 10)),
                        className: "w-full h-2 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    }), e.jsxs("div", {
                        className: "flex justify-between text-xs text-zinc-400",
                        children: [e.jsx("span", {
                            children: "0px"
                        }), e.jsx("span", {
                            children: "24px"
                        })]
                    })]
                }), (W || O) && e.jsxs("div", {
                    className: "rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                    children: [e.jsxs("div", {
                        className: "min-w-0",
                        children: [e.jsx("div", {
                            className: "text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400",
                            children: "Current Image Link"
                        }), e.jsx("p", {
                            className: "mt-1 truncate text-sm text-zinc-700 dark:text-zinc-200",
                            children: W || O
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [e.jsxs("a", {
                            href: W || O || "#",
                            target: "_blank",
                            rel: "noreferrer",
                            className: "inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/5 transition-colors",
                            children: [e.jsx(Pe, {
                                className: "w-4 h-4"
                            }), "Open Link"]
                        }), (W || G) && e.jsxs("button", {
                            type: "button",
                            onClick: () => void M(),
                            className: "inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-500/20 px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors",
                            children: [e.jsx(se, {
                                className: "w-4 h-4"
                            }), "Remove"]
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-pink-500/10 text-pink-500",
                        children: e.jsx(Re, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Soundscapes"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Ambient sounds for deep work"
                        })]
                    })]
                }), e.jsx("div", {
                    className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                    children: xt.map(a => e.jsxs("button", {
                        onClick: () => N(a.id),
                        className: `
                relative p-4 rounded-xl border-2 text-left transition-all group overflow-hidden
                ${z===a.id?"border-brand-500 bg-brand-50/50 dark:bg-brand-500/10":"border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"}
              `,
                        children: [e.jsx("div", {
                            className: `
                w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors
                ${z===a.id?"bg-brand-500 text-white":"bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400"}
              `,
                            children: e.jsx(a.icon, {
                                className: "w-5 h-5"
                            })
                        }), e.jsx("div", {
                            className: "font-medium text-zinc-900 dark:text-white",
                            children: a.name
                        }), z === a.id && e.jsx("div", {
                            className: "absolute inset-0 border-2 border-brand-500 rounded-xl pointer-events-none"
                        })]
                    }, a.id))
                })]
            }), e.jsx("div", {
                className: "flex justify-end",
                children: e.jsx("button", {
                    onClick: U,
                    className: "px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all",
                    children: "Save Changes"
                })
            })]
        })
    },
    Ks = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11 (Science)", "Grade 11 (Commerce)", "Grade 11 (Arts)", "Grade 12 (Science)", "Grade 12 (Commerce)", "Grade 12 (Arts)", "Undergraduate Year 1", "Undergraduate Year 2", "Undergraduate Year 3", "Undergraduate Year 4", "Postgraduate", "Other"],
    Ws = ["JEE Mains", "JEE Advanced", "NEET", "CAT", "GATE", "GRE", "GMAT", "SAT", "ACT", "AP Exams", "IB Exams", "CBSE Boards", "ICSE Boards", "State Boards", "UPSC", "Other"],
    Ys = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "History", "Geography", "Economics", "Business Studies", "Accountancy", "Psychology", "Sociology", "Political Science", "Other"],
    Js = [{
        value: "kanban",
        label: "Kanban",
        description: "Status columns with a board-first workflow."
    }, {
        value: "list",
        label: "List",
        description: "Single queue for fast triage and task clearing."
    }, {
        value: "calendar",
        label: "Calendar",
        description: "Date-first planning with due-date grouping."
    }],
    pe = t => {
        const j = t / 60;
        return `${j%1===0?j.toFixed(0):j.toFixed(1)}h`
    },
    Ke = (t, j) => {
        const g = j.trim();
        return g ? t.some(h => h.toLowerCase() === g.toLowerCase()) ? t : [...t, g] : t
    },
    Vs = () => {
        const {
            profile: t,
            updateProfile: j
        } = Z(), g = ct(c => c.tasks), y = Ee(c => c.sessions), h = ie(c => c.subjects), r = ie(c => c.addSubject), m = ie(c => c.updateSubject), [b, f] = s.useState(""), [v, l] = s.useState(""), [z, N] = s.useState([]), [i, I] = s.useState([]), [o, d] = s.useState(4), [p, w] = s.useState(40), [S, C] = s.useState("kanban"), [u, E] = s.useState(1), [P, F] = s.useState(3), [A, L] = s.useState(30), [G, x] = s.useState(!1), [k, R] = s.useState(null);
        s.useEffect(() => {
            t && (f(t.academic ?.institution || ""), l(t.academic ?.grade || ""), N(t.academic ?.targetExams || []), I(t.academic ?.primarySubjects || []), d(t.studyPreferences ?.dailyGoalHours || 4), w(t.academic ?.weeklyCapacity || 40), C(t.workflowPreferences ?.taskOrganizationStyle || "kanban"), E(t.studyPreferences ?.weekStartDay ?? 1), F(t.studyPreferences ?.weekStartHour ?? 3), L(t.studyPreferences ?.weekStartMinute ?? 30))
        }, [t]);
        const W = As(S),
            J = t ? { ...t,
                academic: { ...t.academic,
                    weeklyCapacity: p
                },
                studyPreferences: { ...t.studyPreferences,
                    weekStartDay: u,
                    weekStartHour: P,
                    weekStartMinute: A
                }
            } : null,
            T = Ps({
                tasks: g,
                sessions: y,
                profile: J
            }),
            Q = async () => {
                await j({
                    academic: { ...t ?.academic,
                        institution : b,
                        grade: v,
                        targetExams: z,
                        primarySubjects: i,
                        weeklyCapacity: p
                    },
                    studyPreferences: { ...t ?.studyPreferences,
                        dailyGoalHours : o,
                        preferredFocusMethod: t ?.studyPreferences ?.preferredFocusMethod || "pomodoro",
                        weekStartDay: u,
                        weekStartHour: P,
                        weekStartMinute: A
                    },
                    workflowPreferences: { ...t ?.workflowPreferences,
                        taskOrganizationStyle : S
                    }
                });
                const c = new Set(h.map(n => n.name.trim().toLowerCase()));
                for (const n of i) c.has(n.trim().toLowerCase()) || (await r(n), c.add(n.trim().toLowerCase()))
            },
            V = c => {
                const n = h.find(U => U.name.trim().toLowerCase() === c.trim().toLowerCase()) || null;
                R(n || {
                    id: "settings-preview-subject",
                    name: c,
                    icon: "📚",
                    color: "text-emerald-500",
                    gradient: "from-emerald-500 to-teal-600",
                    chapters: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }), x(!0)
            },
            q = async c => {
                if (!c.name) return;
                const n = h.find(M => M.name.trim().toLowerCase() === c.name.trim().toLowerCase());
                if (n) {
                    await m(n.id, {
                        icon: c.icon || n.icon,
                        color: c.color || n.color,
                        gradient: c.gradient || n.gradient
                    });
                    return
                }
                const U = await r(c.name, c.icon);
                await m(U.id, {
                    color: c.color || U.color,
                    gradient: c.gradient || U.gradient
                })
            };
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-indigo-500/10 text-indigo-500",
                        children: e.jsx(Se, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Study Setup"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Core study context first collected during onboarding and reused across the app."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                    children: [e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Institution"
                        }), e.jsx("input", {
                            type: "text",
                            value: b,
                            onChange: c => f(c.target.value),
                            placeholder: "e.g., Delhi Public School",
                            className: "w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Grade / Level"
                        }), e.jsxs("select", {
                            value: v,
                            onChange: c => l(c.target.value),
                            className: "w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white appearance-none",
                            children: [e.jsx("option", {
                                value: "",
                                children: "Select your grade..."
                            }), Ks.map(c => e.jsx("option", {
                                value: c,
                                children: c
                            }, c))]
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-2",
                    children: [e.jsx("label", {
                        className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                        children: "Target Exams"
                    }), e.jsx(Qe, {
                        options: Array.from(new Set([...Ws, ...z])),
                        selected: z,
                        onChange: N,
                        placeholder: "Search exams...",
                        onCreate: c => N(n => Ke(n, c))
                    }), e.jsx("p", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: "Used by dashboard insights, AI context, and exam-oriented study suggestions."
                    })]
                }), e.jsxs("div", {
                    className: "space-y-2",
                    children: [e.jsx("label", {
                        className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                        children: "Primary Subjects"
                    }), e.jsx(Qe, {
                        options: Array.from(new Set([...Ys, ...i])),
                        selected: i,
                        onChange: I,
                        placeholder: "Select subjects...",
                        maxSelections: 12,
                        onChipClick: V,
                        onCreate: c => I(n => Ke(n, c))
                    }), e.jsx("p", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: "Click a selected subject to edit its icon and color. Saving here also creates any missing subjects so your study workspace stays in sync."
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-teal-500/10 text-teal-500",
                        children: e.jsx(qt, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Planning Constraints"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "These settings now affect your tasks workflow, weekly load feedback, and planner context."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                    children: [e.jsxs("div", {
                        className: "space-y-4",
                        children: [e.jsxs("div", {
                            className: "flex justify-between items-end",
                            children: [e.jsx("label", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Daily Goal"
                            }), e.jsxs("span", {
                                className: "text-2xl font-bold text-brand-500",
                                children: [o, "h"]
                            })]
                        }), e.jsx("input", {
                            type: "range",
                            min: "1",
                            max: "12",
                            step: "1",
                            value: o,
                            onChange: c => d(parseInt(c.target.value, 10)),
                            className: "w-full h-2 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                        }), e.jsxs("div", {
                            className: "flex justify-between text-xs text-zinc-400",
                            children: [e.jsx("span", {
                                children: "1h"
                            }), e.jsx("span", {
                                children: "12h"
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-4",
                        children: [e.jsxs("div", {
                            className: "flex justify-between items-end",
                            children: [e.jsx("label", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Weekly Work Capacity"
                            }), e.jsxs("span", {
                                className: "text-2xl font-bold text-teal-500",
                                children: [p, "h"]
                            })]
                        }), e.jsx("input", {
                            type: "range",
                            min: "10",
                            max: "100",
                            step: "5",
                            value: p,
                            onChange: c => w(parseInt(c.target.value, 10)),
                            className: "w-full h-2 bg-zinc-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        }), e.jsxs("div", {
                            className: "flex justify-between text-xs text-zinc-400",
                            children: [e.jsx("span", {
                                children: "Light (10h)"
                            }), e.jsx("span", {
                                children: "Intense (100h)"
                            })]
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-3 pt-2 border-t border-zinc-100 dark:border-white/5",
                    children: [e.jsx("label", {
                        className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                        children: "Default Task Experience"
                    }), e.jsx("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-3",
                        children: Js.map(c => e.jsxs("button", {
                            type: "button",
                            onClick: () => C(c.value),
                            className: `p-4 rounded-xl border text-left transition-all ${S===c.value?"border-brand-500 bg-brand-50 dark:bg-brand-500/10":"border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 hover:border-zinc-300 dark:hover:border-white/20"}`,
                            children: [e.jsx("div", {
                                className: "font-semibold text-zinc-900 dark:text-white",
                                children: c.label
                            }), e.jsx("p", {
                                className: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
                                children: c.description
                            })]
                        }, c.value))
                    }), e.jsx("div", {
                        className: "p-4 rounded-xl bg-brand-500/5 border border-brand-500/20",
                        children: e.jsxs("p", {
                            className: "text-sm text-zinc-600 dark:text-zinc-300",
                            children: [e.jsx("span", {
                                className: "font-semibold",
                                children: "Current behavior:"
                            }), " ", W.description]
                        })
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-emerald-500/10 text-emerald-500",
                        children: e.jsx(ce, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Current Weekly Load"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Capacity now checks this week's logged focus time plus active task duration due before your next week reset."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                    children: [e.jsxs("div", {
                        className: "p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10",
                        children: [e.jsx("div", {
                            className: "text-xs uppercase tracking-[0.18em] text-zinc-400",
                            children: "Capacity"
                        }), e.jsx("div", {
                            className: "mt-2 text-2xl font-bold text-zinc-900 dark:text-white",
                            children: T.isConfigured ? `${T.capacityHours}h` : "Not set"
                        })]
                    }), e.jsxs("div", {
                        className: "p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10",
                        children: [e.jsx("div", {
                            className: "text-xs uppercase tracking-[0.18em] text-zinc-400",
                            children: "Logged"
                        }), e.jsx("div", {
                            className: "mt-2 text-2xl font-bold text-zinc-900 dark:text-white",
                            children: pe(T.loggedMinutes)
                        })]
                    }), e.jsxs("div", {
                        className: "p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10",
                        children: [e.jsx("div", {
                            className: "text-xs uppercase tracking-[0.18em] text-zinc-400",
                            children: "Planned"
                        }), e.jsx("div", {
                            className: "mt-2 text-2xl font-bold text-zinc-900 dark:text-white",
                            children: pe(T.plannedMinutes)
                        })]
                    }), e.jsxs("div", {
                        className: "p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10",
                        children: [e.jsx("div", {
                            className: "text-xs uppercase tracking-[0.18em] text-zinc-400",
                            children: T.isOverCapacity ? "Overloaded By" : "Headroom"
                        }), e.jsx("div", {
                            className: `mt-2 text-2xl font-bold ${T.isOverCapacity?"text-rose-500":"text-emerald-500"}`,
                            children: pe(T.isOverCapacity ? T.overloadMinutes : T.remainingMinutes)
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-3",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between text-sm",
                        children: [e.jsx("span", {
                            className: "text-zinc-600 dark:text-zinc-300",
                            children: "Projected load this week"
                        }), e.jsx("span", {
                            className: "font-semibold text-zinc-900 dark:text-white",
                            children: T.isConfigured ? `${T.utilizationPercent}% of capacity` : "Set weekly capacity to enable"
                        })]
                    }), e.jsx("div", {
                        className: "h-3 rounded-full bg-zinc-100 dark:bg-white/10 overflow-hidden",
                        children: e.jsx("div", {
                            className: `h-full transition-all ${T.isOverCapacity?"bg-rose-500":"bg-emerald-500"}`,
                            style: {
                                width: `${Math.min(T.utilizationPercent,100)}%`
                            }
                        })
                    }), e.jsx("p", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: T.isOverCapacity ? "You are carrying more work than your weekly capacity allows. The tasks planner now uses this to flag overload." : "Your current combination of completed focus time and due-this-week task duration is within capacity."
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-brand-500/10 text-brand-500",
                        children: e.jsx(Ce, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Week Start Time"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Configure when your week begins for analytics and weekly planning."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-6",
                    children: [e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Week Starts On"
                        }), e.jsxs("select", {
                            value: u,
                            onChange: c => E(parseInt(c.target.value, 10)),
                            className: "w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white appearance-none",
                            children: [e.jsx("option", {
                                value: 1,
                                children: "Monday"
                            }), e.jsx("option", {
                                value: 0,
                                children: "Sunday"
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "grid grid-cols-2 gap-4",
                        children: [e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx("label", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Hour (24h format)"
                            }), e.jsx("input", {
                                type: "number",
                                min: "0",
                                max: "23",
                                value: P,
                                onChange: c => F(Math.min(23, Math.max(0, parseInt(c.target.value, 10) || 0))),
                                className: "w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                            })]
                        }), e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx("label", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Minute"
                            }), e.jsx("input", {
                                type: "number",
                                min: "0",
                                max: "59",
                                value: A,
                                onChange: c => L(Math.min(59, Math.max(0, parseInt(c.target.value, 10) || 0))),
                                className: "w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "p-4 rounded-xl bg-brand-500/5 border border-brand-500/20",
                        children: [e.jsxs("p", {
                            className: "text-sm text-zinc-600 dark:text-zinc-300",
                            children: [e.jsx("span", {
                                className: "font-semibold",
                                children: "Current setting:"
                            }), " Week starts on", " ", e.jsx("span", {
                                className: "font-bold text-brand-600 dark:text-brand-400",
                                children: u === 1 ? "Monday" : "Sunday"
                            }), " ", "at", " ", e.jsxs("span", {
                                className: "font-bold text-brand-600 dark:text-brand-400",
                                children: [String(P).padStart(2, "0"), ":", String(A).padStart(2, "0")]
                            })]
                        }), e.jsx("p", {
                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-2",
                            children: "This continues to drive weekly analytics, streak grouping, and the weekly workload snapshot above."
                        })]
                    })]
                })]
            }), e.jsx("div", {
                className: "flex justify-end",
                children: e.jsx("button", {
                    onClick: Q,
                    className: "px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all",
                    children: "Save Changes"
                })
            }), e.jsx(Cs, {
                isOpen: G,
                onClose: () => x(!1),
                subjectToEdit: k,
                onSave: q
            })]
        })
    },
    qs = ({
        showLabel: t = !1,
        compact: j = !1
    }) => {
        const {
            status: g,
            lastSyncAt: y,
            triggerSync: h,
            downloadCloudSnapshot: r,
            error: m,
            needsCloudBootstrap: b
        } = Fs(), {
            isPremium: f,
            isAuthenticated: v
        } = ae(), l = f(), __isoMeta = (() => {
            try {
                return JSON.parse(localStorage.getItem("isotope_sync_metadata") || "{}") || {}
            } catch {
                return {}
            }
        })(), __isoSnapshotOk = __isoMeta.last_sync_status === "synced" && !!__isoMeta.last_snapshot_at && !__isoMeta.last_error, __isoBusyStates = ["syncing", "selecting_backup", "restoring_cloud", "verifying_restore", "uploading_local"], __isoDisplayStatus = __isoBusyStates.includes(__isoMeta.last_sync_status) ? "syncing" : __isoMeta.last_sync_status === "blocked_empty_overwrite" ? "error" : g, [z, N] = ne.useState(!1);
        if (!v) return null;
        const i = async () => {
                if (__isoDisplayStatus !== "syncing") {
                    if (b) {
                        await r();
                        return
                    }
                    await h()
                }
            },
            o = (w => {
                if (b) return {
                    icon: w === "syncing" ? de : ve,
                    color: "text-sky-400",
                    bgColor: "bg-sky-500/10",
                    borderColor: "border-sky-500/30",
                    label: w === "syncing" ? "Downloading..." : "Download cloud data",
                    animate: w === "syncing",
                    description: "This premium account has cloud data available, but this device has not downloaded it yet."
                };
                switch (w) {
                    case "syncing":
                        return {
                            icon: de,
                            color: "text-blue-400",
                            bgColor: "bg-blue-500/10",
                            borderColor: "border-blue-500/30",
                            label: "Syncing...",
                            animate: !0,
                            description: "Manual cloud sync is currently running."
                        };
                    case "success":
                        return {
                            icon: _,
                            color: "text-green-400",
                            bgColor: "bg-green-500/10",
                            borderColor: "border-green-500/30",
                            label: "Synced manually",
                            animate: !1,
                            description: "Local data and cloud data were synced successfully."
                        };
                    case "degraded":
                        return {
                            icon: Ue,
                            color: "text-amber-400",
                            bgColor: "bg-amber-500/10",
                            borderColor: "border-amber-500/30",
                            label: "Local mode",
                            animate: !1,
                            description: m || "Cloud sync is temporarily unavailable. Your local data remains available."
                        };
                    case "error":
                        return {
                            icon: Ae,
                            color: "text-red-400",
                            bgColor: "bg-red-500/10",
                            borderColor: "border-red-500/30",
                            label: "Sync failed",
                            animate: !1,
                            description: m || "Cloud sync failed."
                        };
                    default:
                        return {
                            icon: l ? ve : Ue,
                            color: l ? "text-zinc-400" : "text-zinc-600",
                            bgColor: "bg-zinc-500/10",
                            borderColor: "border-zinc-500/30",
                            label: l ? "Ready to sync" : "Local only",
                            animate: !1,
                            description: l ? "Manual sync is available when you press the sync button." : "Cloud sync is unavailable on the free plan."
                        }
                }
            })(__isoDisplayStatus),
            d = o.icon,
            p = w => {
                if (!w) return "Never synced";
                const S = new Date(w),
                    u = new Date().getTime() - S.getTime();
                return u < 6e4 ? "Just now" : u < 36e5 ? `${Math.floor(u/6e4)}m ago` : u < 864e5 ? `${Math.floor(u/36e5)}h ago` : S.toLocaleDateString()
            };
        return j ? e.jsx(K.button, {
            onClick: i,
            disabled: __isoDisplayStatus === "syncing" || !l,
            className: `relative p-2 rounded-lg transition-colors ${o.bgColor} ${o.borderColor} border hover:bg-opacity-20 disabled:opacity-50`,
            whileHover: {
                scale: 1.05
            },
            whileTap: {
                scale: .95
            },
            title: l ? o.description : "Premium required for sync",
            children: e.jsx(d, {
                className: `w-4 h-4 ${o.color} ${o.animate?"animate-spin":""}`
            })
        }) : e.jsxs("div", {
            className: "relative",
            children: [e.jsxs(K.button, {
                onClick: i,
                onMouseEnter: () => N(!0),
                onMouseLeave: () => N(!1),
                disabled: __isoDisplayStatus === "syncing" || !l,
                className: `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${o.bgColor} ${o.borderColor} border hover:bg-opacity-20 disabled:cursor-not-allowed`,
                whileHover: {
                    scale: 1.02
                },
                whileTap: {
                    scale: .98
                },
                children: [e.jsx(d, {
                    className: `w-4 h-4 ${o.color} ${o.animate?"animate-spin":""}`
                }), t && e.jsx("span", {
                    className: `text-xs font-medium ${o.color}`,
                    children: o.label
                })]
            }), e.jsx(xe, {
                children: z && e.jsx(K.div, {
                    initial: {
                        opacity: 0,
                        y: 5
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: 5
                    },
                    className: "absolute top-full mt-2 right-0 z-50 w-48 p-3 bg-[#0a0a0a] border border-zinc-800 rounded-lg shadow-xl",
                    children: e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [e.jsx("span", {
                                className: "text-xs text-zinc-500",
                                children: "Status"
                            }), e.jsx("span", {
                                className: `text-xs font-medium ${o.color}`,
                                children: o.label
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [e.jsx("span", {
                                className: "text-xs text-zinc-500",
                                children: "Last sync"
                            }), e.jsx("span", {
                                className: "text-xs text-zinc-300",
                                children: b ? "Not downloaded" : p(y)
                            })]
                        }), (b || g === "degraded" || g === "error") && e.jsx("div", {
                            className: "pt-2 border-t border-zinc-800",
                            children: e.jsx("p", {
                                className: "text-[10px] leading-relaxed text-zinc-400",
                                children: o.description
                            })
                        }), !l && e.jsx("div", {
                            className: "pt-2 border-t border-zinc-800",
                            children: e.jsx("p", {
                                className: "text-[10px] text-zinc-500",
                                children: "Upgrade to Premium for cloud sync"
                            })
                        })]
                    })
                })
            })]
        })
    },
    Xs = async () => {
        await Promise.all([Z.getState().refreshFromStorage(), ie.getState().refreshFromStorage(), ct.getState().refreshFromStorage(), Ee.getState().refreshFromStorage(), Is.getState().refreshFromStorage(), ks.getState().refreshFromStorage(), Es.getState().refreshFromStorage()])
    },
    Zs = () => {
        const [t, j] = s.useState(!1), [g, y] = s.useState(!1), [h, r] = s.useState(!1), [m, b] = s.useState(null), [f, v] = s.useState(() => wt()), l = s.useRef(null), z = ae(w => w.signOut);
        s.useEffect(() => jt(w => {
            v(w)
        }), []);
        const N = async () => {
                window.confirm("Delete all local data on this browser? This clears IndexedDB storage and signs you out, but it does not delete your Supabase cloud data.") && (await yt.clearAll(), await zt.clear(), await St(), await z(), window.location.reload())
            },
            i = async () => {
                y(!0), b(null);
                try {
                    const w = await Nt(),
                        S = new Blob([w], {
                            type: "application/json"
                        }),
                        C = window.URL.createObjectURL(S),
                        u = document.createElement("a"),
                        E = new Date().toISOString().slice(0, 10);
                    u.href = C, u.download = `isotope-backup-${E}.json`, u.click(), window.URL.revokeObjectURL(C), b("JSON backup exported successfully.")
                } catch (w) {
                    console.error("[DataPrivacySettings] Failed to export backup:", w), b("Could not export your JSON backup. Please try again.")
                } finally {
                    y(!1)
                }
            },
            I = () => {
                l.current ?.click()
            },
            o = async w => {
                const S = w.target.files ?.[0];
                if (w.target.value = "", !!S) {
                    r(!0), b(null);
                    try {
                        const C = await S.text();
                        await vt(C, {
                            mode: "merge"
                        }), await Xs(), b("Backup imported successfully. Newer local entries were preserved.")
                    } catch (C) {
                        console.error("[DataPrivacySettings] Failed to import backup:", C), b(C instanceof Error ? C.message : "Could not import that backup file. Please verify the file and try again.")
                    } finally {
                        r(!1)
                    }
                }
            },
            d = f.persistentStorageGranted ? "Persistent storage active" : f.persistentStorageGranted === !1 ? "Browser may evict local data" : "Storage protection unknown",
            p = f.persistentStorageGranted ? "text-emerald-600 dark:text-emerald-300" : "text-amber-600 dark:text-amber-300";
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-rose-500/10 text-rose-500",
                        children: e.jsx(it, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Privacy & Visibility"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Control who sees your activity"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-4",
                        children: [e.jsx("div", {
                            className: `p-3 rounded-full transition-colors ${t?"bg-zinc-800 text-white":"bg-zinc-200 dark:bg-white/10 text-zinc-500"}`,
                            children: t ? e.jsx(Ie, {
                                className: "w-6 h-6"
                            }) : e.jsx(me, {
                                className: "w-6 h-6"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsx("h4", {
                                className: "font-bold text-zinc-900 dark:text-white",
                                children: "Ghost Mode"
                            }), e.jsx("p", {
                                className: "text-xs text-zinc-600 dark:text-zinc-300 mt-0.5",
                                children: "Hide your online status and activity from the community."
                            })]
                        })]
                    }), e.jsx(D, {
                        checked: t,
                        onChange: () => j(!t)
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-blue-500/10 text-blue-500",
                        children: e.jsx(ve, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Sync & Backup"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Manual cloud backup only. Nothing syncs until you press the button."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5",
                    children: [e.jsxs("div", {
                        className: "flex flex-col gap-1",
                        children: [e.jsx("span", {
                            className: "font-medium text-zinc-900 dark:text-white",
                            children: "Cloud Sync"
                        }), e.jsx("span", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Download or sync your premium cloud backup on demand"
                        })]
                    }), e.jsx(qs, {
                        showLabel: !0
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-cyan-500/10 text-cyan-500",
                        children: e.jsx(Oe, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Data Export"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Keep an offline JSON backup so browser storage issues cannot trap your data."
                        })]
                    })]
                }), e.jsx("div", {
                    className: "rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 p-4",
                    children: e.jsxs("div", {
                        className: "flex items-start gap-3",
                        children: [e.jsx("div", {
                            className: `mt-0.5 rounded-full p-2 ${f.persistentStorageGranted?"bg-emerald-500/10 text-emerald-600 dark:text-emerald-300":"bg-amber-500/10 text-amber-600 dark:text-amber-300"}`,
                            children: f.persistentStorageGranted ? e.jsx(le, {
                                className: "h-4 w-4"
                            }) : e.jsx(Xt, {
                                className: "h-4 w-4"
                            })
                        }), e.jsxs("div", {
                            className: "space-y-1",
                            children: [e.jsx("p", {
                                className: `text-sm font-semibold ${p}`,
                                children: d
                            }), e.jsx("p", {
                                className: "text-xs text-zinc-600 dark:text-zinc-300",
                                children: f.lastRecoveryAt ? "A backup recovery happened on this device, so exporting a fresh JSON backup is strongly recommended." : f.persistentStorageGranted ? "This browser granted stronger local-storage protection, and your data is also mirrored to a local shadow backup." : "Some browsers still clear IndexedDB under pressure. Isotope now keeps a shadow backup, but a JSON export is the safest recovery option."
                            }), f.persistentStorageGranted === !1 && e.jsxs("button", {
                                type: "button",
                                onClick: async () => {
                                    await kt()
                                },
                                className: "mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors",
                                children: [e.jsx(le, {
                                    className: "h-3.5 w-3.5"
                                }), "Request storage protection"]
                            })]
                        })]
                    })
                }), e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [e.jsxs("button", {
                        onClick: i,
                        disabled: g,
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors border border-zinc-200 dark:border-white/5 group disabled:opacity-60 disabled:cursor-not-allowed",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx(Oe, {
                                className: "w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors"
                            }), e.jsxs("div", {
                                className: "text-left",
                                children: [e.jsx("div", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: g ? "Exporting backup..." : "Export JSON backup"
                                }), e.jsx("div", {
                                    className: "text-xs text-zinc-500",
                                    children: "Full local data dump"
                                })]
                            })]
                        }), e.jsx(ye, {
                            className: "w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
                        })]
                    }), e.jsxs("button", {
                        onClick: I,
                        disabled: h,
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors border border-zinc-200 dark:border-white/5 group disabled:opacity-60 disabled:cursor-not-allowed",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx(Zt, {
                                className: "w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors"
                            }), e.jsxs("div", {
                                className: "text-left",
                                children: [e.jsx("div", {
                                    className: "font-medium text-zinc-900 dark:text-white",
                                    children: h ? "Importing backup..." : "Import JSON backup"
                                }), e.jsx("div", {
                                    className: "text-xs text-zinc-500",
                                    children: "Merge backup with current local data"
                                })]
                            })]
                        }), e.jsx(ye, {
                            className: "w-4 h-4 rotate-180 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
                        })]
                    })]
                }), e.jsx("input", {
                    ref: l,
                    type: "file",
                    accept: "application/json,.json",
                    className: "hidden",
                    onChange: o
                }), m && e.jsx("div", {
                    className: "rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200",
                    children: m
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-red-200 dark:border-red-500/20 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-red-500/10 text-red-500",
                        children: e.jsx(qe, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-red-600 dark:text-red-400",
                            children: "Danger Zone"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Irreversible actions"
                        })]
                    })]
                }), e.jsx("div", {
                    className: "p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10",
                    children: e.jsxs("div", {
                        className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
                        children: [e.jsxs("div", {
                            children: [e.jsx("h4", {
                                className: "font-bold text-zinc-900 dark:text-white",
                                children: "Delete All Data"
                            }), e.jsx("p", {
                                className: "text-xs text-zinc-600 dark:text-zinc-300 mt-1",
                                children: "Deletes only this browser's local IndexedDB cache and signs you out. Cloud data in your account is not deleted."
                            })]
                        }), e.jsxs("button", {
                            onClick: N,
                            className: "flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20 whitespace-nowrap",
                            children: [e.jsx(se, {
                                className: "w-4 h-4"
                            }), "Delete Everything"]
                        })]
                    })
                })]
            })]
        })
    },
    ea = () => {
        const [t, j] = s.useState(!1), [g, y] = s.useState(!0);
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-orange-500/10 text-orange-500",
                        children: e.jsx(es, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Streak Management"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Protect your hard-earned progress"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-4",
                        children: [e.jsx("div", {
                            className: "p-3 rounded-full bg-white dark:bg-white/10 text-blue-500 shadow-sm",
                            children: e.jsx(ts, {
                                className: "w-6 h-6"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsx("h4", {
                                className: "font-bold text-zinc-900 dark:text-white",
                                children: "Streak Freeze"
                            }), e.jsx("p", {
                                className: "text-xs text-zinc-600 dark:text-zinc-300 mt-0.5",
                                children: "Missed a day? Use a freeze to keep your streak alive."
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "flex flex-col items-end gap-2",
                        children: [e.jsx(D, {
                            checked: t,
                            onChange: () => j(!t)
                        }), e.jsx("span", {
                            className: `text-[10px] font-bold uppercase tracking-wider ${t?"text-brand-600 dark:text-brand-400":"text-zinc-500"}`,
                            children: t ? "Active" : "Inactive"
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-yellow-500/10 text-yellow-500",
                        children: e.jsx(nt, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Gamification Preferences"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Customize your reward experience"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx(ce, {
                                className: "w-4 h-4 text-zinc-400"
                            }), e.jsx("span", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Daily Goals Popup"
                            })]
                        }), e.jsx(D, {
                            checked: !0,
                            onChange: () => {}
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx(rt, {
                                className: "w-4 h-4 text-zinc-400"
                            }), e.jsx("span", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Show Leaderboard Rank"
                            })]
                        }), e.jsx(D, {
                            checked: g,
                            onChange: () => y(!g)
                        })]
                    })]
                })]
            })]
        })
    },
    ta = () => e.jsxs("div", {
        className: "space-y-8",
        children: [e.jsxs("div", {
            className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-8 text-white shadow-lg",
            children: [e.jsxs("div", {
                className: "relative z-10",
                children: [e.jsx("h2", {
                    className: "text-3xl font-bold font-display mb-2",
                    children: "Help Shape Isotope"
                }), e.jsx("p", {
                    className: "text-brand-100 max-w-xl text-lg",
                    children: "Your feedback drives our innovation. Share your thoughts, report issues, or suggest the next big feature."
                })]
            }), e.jsx("div", {
                className: "absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            }), e.jsx("div", {
                className: "absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"
            })]
        }), e.jsxs("div", {
            className: "grid grid-cols-1 gap-6",
            children: [e.jsxs("div", {
                className: "p-8 rounded-3xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-xl relative overflow-hidden group",
                children: [e.jsx("div", {
                    className: "absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity",
                    children: e.jsx(oe, {
                        className: "w-64 h-64 text-brand-500"
                    })
                }), e.jsxs("div", {
                    className: "relative z-10",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-4 mb-6",
                        children: [e.jsx("div", {
                            className: "p-3 rounded-2xl bg-brand-500/10 text-brand-500",
                            children: e.jsx(dt, {
                                className: "w-8 h-8"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsx("h3", {
                                className: "text-2xl font-bold text-zinc-900 dark:text-white",
                                children: "Feedback & Support"
                            }), e.jsx("p", {
                                className: "text-zinc-500 dark:text-zinc-400",
                                children: "Share your thoughts, report issues, or suggest new features."
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8",
                        children: [e.jsxs("div", {
                            className: "p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5",
                            children: [e.jsx(ss, {
                                className: "w-5 h-5 text-amber-500 mb-2"
                            }), e.jsx("h4", {
                                className: "font-bold text-zinc-900 dark:text-white mb-1",
                                children: "Feature Requests"
                            }), e.jsx("p", {
                                className: "text-sm text-zinc-500 dark:text-zinc-400",
                                children: "Suggest new tools or improvements."
                            })]
                        }), e.jsxs("div", {
                            className: "p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5",
                            children: [e.jsx(as, {
                                className: "w-5 h-5 text-rose-500 mb-2"
                            }), e.jsx("h4", {
                                className: "font-bold text-zinc-900 dark:text-white mb-1",
                                children: "Bug Reports"
                            }), e.jsx("p", {
                                className: "text-sm text-zinc-500 dark:text-zinc-400",
                                children: "Tell us if something isn't working."
                            })]
                        }), e.jsxs("div", {
                            className: "p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5",
                            children: [e.jsx(oe, {
                                className: "w-5 h-5 text-brand-500 mb-2"
                            }), e.jsx("h4", {
                                className: "font-bold text-zinc-900 dark:text-white mb-1",
                                children: "General Feedback"
                            }), e.jsx("p", {
                                className: "text-sm text-zinc-500 dark:text-zinc-400",
                                children: "Share your overall experience."
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-brand-500/5 border border-brand-500/10",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-4",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-full bg-brand-500/20",
                                children: e.jsx(rs, {
                                    className: "w-5 h-5 text-brand-500"
                                })
                            }), e.jsxs("p", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                                children: ["Valuable contributions earn", " ", e.jsx("span", {
                                    className: "text-brand-500 font-bold uppercase tracking-wider text-xs",
                                    children: "Free Scholar Subscription"
                                }), " ", "& Badges."]
                            })]
                        }), e.jsxs("a", {
                            href: "https://isotope.featurebase.app",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "w-full sm:w-auto whitespace-nowrap px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3",
                            children: ["Go to Feedback Portal ", e.jsx(Pe, {
                                className: "w-5 h-5"
                            })]
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "p-8 rounded-3xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-xl",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-4 mb-6",
                    children: [e.jsx("div", {
                        className: "p-3 rounded-2xl bg-emerald-500/10 text-emerald-500",
                        children: e.jsx(we, {
                            className: "w-8 h-8"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-2xl font-bold text-zinc-900 dark:text-white",
                            children: "Community & Socials"
                        }), e.jsx("p", {
                            className: "text-zinc-500 dark:text-zinc-400",
                            children: "Stay close to product updates, discussions, and launch announcements."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                    children: [e.jsxs("a", {
                        href: "https://discord.gg/QfmQGmKJUD",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-5 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]",
                        children: [e.jsx("div", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Discord"
                        }), e.jsx("p", {
                            className: "mt-2 text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Join the main Isotope community server."
                        })]
                    }), e.jsxs("a", {
                        href: "https://www.reddit.com/r/Isotope/",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-5 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]",
                        children: [e.jsx("div", {
                            className: "text-lg font-bold text-zinc-900 dark:text-white",
                            children: "Reddit"
                        }), e.jsx("p", {
                            className: "mt-2 text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Follow discussions, updates, and community posts."
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "rounded-2xl border border-brand-500/15 bg-brand-500/5 px-5 py-4",
                    children: [e.jsx("p", {
                        className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                        children: "Upcoming socials:"
                    }), e.jsx("p", {
                        className: "mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400",
                        children: "Instagram after BITSAT. YouTube after BITSAT. X is still a maybe."
                    })]
                })]
            })]
        })]
    }),
    sa = () => {
        const {
            settings: t,
            hasGroqKey: j,
            hasGeminiKey: g,
            error: y,
            setApiKey: h,
            removeApiKey: r,
            validateApiKey: m,
            setPreferredModel: b,
            setProvider: f,
            toggleAI: v
        } = lt(), [l, z] = s.useState(null), N = () => {
            !t.isEnabled && !j && !g || v(!t.isEnabled)
        };
        return e.jsxs("div", {
            className: "max-w-5xl mx-auto space-y-8 pb-32",
            children: [e.jsxs("section", {
                className: "relative group",
                children: [e.jsx("div", {
                    className: "absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-cyan-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"
                }), e.jsxs("div", {
                    className: "relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8",
                    children: [e.jsx("div", {
                        className: "absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none",
                        children: e.jsx(Ls, {
                            className: "w-48 h-48 rotate-12"
                        })
                    }), e.jsxs("div", {
                        className: "flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10",
                        children: [e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [e.jsx("div", {
                                    className: "p-2 rounded-lg bg-brand-500/10 border border-brand-500/20",
                                    children: e.jsx(is, {
                                        className: "w-6 h-6 text-brand-500"
                                    })
                                }), e.jsx("h2", {
                                    className: "text-3xl font-black text-zinc-900 dark:text-white tracking-tight",
                                    children: "Intelligence Hub"
                                })]
                            }), e.jsx("p", {
                                className: "text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed",
                                children: "Connect and manage your AI engines. All credentials stay on your device, encrypted with AES-256 for military-grade security."
                            })]
                        }), e.jsxs("div", {
                            className: "flex flex-col items-center md:items-end gap-3",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-3 bg-zinc-100 dark:bg-white/5 p-2 rounded-2xl border border-zinc-200 dark:border-white/10",
                                children: [e.jsx("span", {
                                    className: "text-sm font-bold px-3 text-zinc-500 uppercase tracking-widest",
                                    children: "AI Active"
                                }), e.jsx("button", {
                                    onClick: N,
                                    className: $("relative inline-flex h-10 w-20 items-center rounded-xl transition-all duration-500 ease-spring", t.isEnabled ? "bg-brand-600 shadow-lg shadow-brand-600/20" : "bg-zinc-300 dark:bg-zinc-800"),
                                    children: e.jsx("span", {
                                        className: $("inline-block h-8 w-8 transform rounded-lg bg-white shadow-sm transition-all duration-500 ease-spring", t.isEnabled ? "translate-x-11 rotate-0" : "translate-x-1 rotate-180")
                                    })
                                })]
                            }), !j && !g && e.jsx("span", {
                                className: "text-[10px] font-black uppercase tracking-tighter text-amber-500 animate-pulse",
                                children: "Setup Required to Activate"
                            })]
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
                children: [e.jsx(We, {
                    provider: "groq",
                    name: "Groq LPU",
                    tagline: "Ultra-fast inference engine",
                    description: "Powered by Groq's Language Processing Unit technology. Best for real-time interactions.",
                    icon: e.jsx(te, {
                        className: "w-6 h-6"
                    }),
                    accentColor: "amber",
                    hasKey: j,
                    isActive: t.provider === "groq",
                    isExpanded: l === "groq",
                    onExpand: () => z(l === "groq" ? null : "groq")
                }), e.jsx(We, {
                    provider: "gemini",
                    name: "Google Gemini",
                    tagline: "Advanced reasoning engine",
                    description: "State-of-the-art models from Google. Best for complex analysis and large context.",
                    icon: e.jsx(oe, {
                        className: "w-6 h-6"
                    }),
                    accentColor: "blue",
                    hasKey: g,
                    isActive: t.provider === "gemini",
                    isExpanded: l === "gemini",
                    onExpand: () => z(l === "gemini" ? null : "gemini")
                })]
            }), e.jsxs("div", {
                className: "flex items-center justify-center gap-2 p-6 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-dashed border-zinc-300 dark:border-white/10 text-zinc-500 text-sm italic",
                children: [e.jsx(le, {
                    className: "w-4 h-4 text-emerald-500"
                }), "Zero-knowledge architecture. Isotope never sees your API keys."]
            })]
        })
    },
    We = ({
        provider: t,
        name: j,
        tagline: g,
        description: y,
        icon: h,
        accentColor: r,
        hasKey: m,
        isActive: b,
        isExpanded: f,
        onExpand: v
    }) => {
        const {
            settings: l,
            setApiKey: z,
            removeApiKey: N,
            validateApiKey: i,
            setProvider: I,
            setPreferredModel: o,
            error: d
        } = lt(), [p, w] = s.useState(""), [S, C] = s.useState(!1), [u, E] = s.useState(!1), [P, F] = s.useState(null), A = He.find(k => k.id === l.preferredModel), L = He.filter(k => k.provider === t), G = async () => {
            if (!p.trim()) return;
            E(!0), F(null);
            const k = await z(p.trim(), t);
            k.success ? (w(""), F({
                valid: !0
            }), l.provider || I(t)) : F({
                valid: !1,
                error: k.error
            }), E(!1)
        }, x = () => {
            if (m && (I(t), A ?.provider !== t)) {
                const k = L.find(R => R.isRecommended) || L[0];
                k && o(k.id)
            }
        };
        return e.jsxs(K.div, {
            layout: !0,
            className: $("relative flex flex-col rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden", b ? r === "amber" ? "border-amber-500/50 bg-amber-500/[0.02] shadow-[0_0_40px_rgba(245,158,11,0.1)]" : "border-blue-500/50 bg-blue-500/[0.02] shadow-[0_0_40px_rgba(59,130,246,0.1)]" : "border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50"),
            children: [b && e.jsx("div", {
                className: $("absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none", r === "amber" ? "bg-amber-500" : "bg-blue-500")
            }), e.jsxs("div", {
                className: "p-8 space-y-6",
                children: [e.jsxs("div", {
                    className: "flex items-start justify-between gap-4",
                    children: [e.jsxs("div", {
                        className: "flex gap-4",
                        children: [e.jsx("div", {
                            className: $("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300", b ? r === "amber" ? "bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20" : "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20" : "bg-zinc-100 dark:bg-white/5 text-zinc-500 border-zinc-200 dark:border-white/10"),
                            children: h
                        }), e.jsxs("div", {
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2 mb-0.5",
                                children: [e.jsx("h3", {
                                    className: "text-xl font-bold text-zinc-900 dark:text-white",
                                    children: j
                                }), b && e.jsx("span", {
                                    className: $("px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border animate-in zoom-in-90", r === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"),
                                    children: "Primary Engine"
                                })]
                            }), e.jsx("p", {
                                className: "text-sm font-semibold text-zinc-500 uppercase tracking-tight",
                                children: g
                            })]
                        })]
                    }), e.jsx("button", {
                        onClick: x,
                        disabled: !m || b,
                        className: $("p-3 rounded-xl transition-all duration-300", b ? "bg-emerald-500 text-white cursor-default" : m ? "bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:scale-110" : "bg-zinc-100 dark:bg-white/5 text-zinc-300 dark:text-zinc-700 cursor-not-allowed"),
                        children: b ? e.jsx(_, {
                            className: "w-5 h-5 stroke-[3px]"
                        }) : e.jsx($e, {
                            className: "w-5 h-5"
                        })
                    })]
                }), m ? e.jsxs("div", {
                    className: "space-y-6",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 group/status",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20",
                                children: e.jsx(le, {
                                    className: "w-4 h-4 text-emerald-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("div", {
                                    className: "text-sm font-bold text-zinc-900 dark:text-white",
                                    children: "Active Connection"
                                }), e.jsx("div", {
                                    className: "text-[10px] text-zinc-500 uppercase tracking-wider font-bold",
                                    children: "Encrypted & Secure"
                                })]
                            })]
                        }), e.jsx("button", {
                            onClick: () => N(t),
                            className: "p-2 rounded-lg opacity-0 group-hover/status:opacity-100 hover:bg-red-500/10 text-red-500 transition-all",
                            title: "Remove Credentials",
                            children: e.jsx(se, {
                                className: "w-4 h-4"
                            })
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-3",
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between px-1",
                            children: [e.jsx("label", {
                                className: "text-xs font-black text-zinc-500 uppercase tracking-widest",
                                children: "Model Intelligence"
                            }), e.jsxs("button", {
                                onClick: v,
                                className: "text-xs font-bold text-brand-500 hover:text-brand-400 flex items-center gap-1 transition-colors",
                                children: [f ? "Collapse" : "Change Model", f ? e.jsx(ns, {
                                    className: "w-3 h-3"
                                }) : e.jsx(ds, {
                                    className: "w-3 h-3"
                                })]
                            })]
                        }), e.jsx("div", {
                            className: $("p-4 rounded-2xl transition-all border", b ? "bg-white dark:bg-white/5 border-brand-500/30" : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10"),
                            children: e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [e.jsx("div", {
                                    className: "p-2.5 rounded-xl bg-zinc-100 dark:bg-white/10",
                                    children: e.jsx(cs, {
                                        className: "w-5 h-5 text-zinc-400"
                                    })
                                }), e.jsxs("div", {
                                    children: [e.jsx("div", {
                                        className: "text-sm font-bold text-zinc-900 dark:text-white",
                                        children: (A ?.provider === t ? A : L.find(k => k.isRecommended) || L[0]) ?.name
                                    }), e.jsx("div", {
                                        className: "text-[10px] text-zinc-500 font-medium",
                                        children: Ts((A ?.provider === t ? A : L.find(k => k.isRecommended) || L[0]) ?.rateLimits || {
                                            rpm: 0,
                                            rpd: 0
                                        })
                                    })]
                                })]
                            })
                        })]
                    })]
                }) : e.jsxs("div", {
                    className: "space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
                    children: [e.jsx("p", {
                        className: "text-sm text-zinc-500 leading-relaxed",
                        children: y
                    }), e.jsxs("div", {
                        className: "relative group/input",
                        children: [e.jsx("input", {
                            type: S ? "text" : "password",
                            value: p,
                            onChange: k => w(k.target.value),
                            placeholder: `Enter ${j} API Key...`,
                            className: "w-full bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-mono outline-none focus:ring-2 ring-brand-500/20 focus:border-brand-500/50 transition-all"
                        }), e.jsx("button", {
                            onClick: () => C(!S),
                            className: "absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors",
                            children: S ? e.jsx(Ie, {
                                className: "w-4 h-4"
                            }) : e.jsx(me, {
                                className: "w-4 h-4"
                            })
                        })]
                    }), e.jsxs("div", {
                        className: "flex flex-col gap-3",
                        children: [e.jsx("button", {
                            onClick: G,
                            disabled: !p.trim() || u,
                            className: $("w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all", p.trim() && !u ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl" : "bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-700 cursor-not-allowed"),
                            children: u ? "Verifying..." : "Initialize Engine"
                        }), e.jsxs("a", {
                            href: t === "groq" ? "https://console.groq.com/keys" : "https://aistudio.google.com/app/apikey",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-center text-xs text-zinc-400 hover:text-brand-500 transition-colors flex items-center justify-center gap-1.5",
                            children: ["Get ", j, " API Key ", e.jsx(Pe, {
                                className: "w-3 h-3"
                            })]
                        })]
                    }), P && !P.valid && e.jsxs("div", {
                        className: "p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-2",
                        children: [e.jsx(Ae, {
                            className: "w-4 h-4 shrink-0"
                        }), P.error || "Invalid API key. Please check and try again."]
                    })]
                })]
            }), e.jsx(xe, {
                children: f && m && e.jsx(K.div, {
                    initial: {
                        height: 0,
                        opacity: 0
                    },
                    animate: {
                        height: "auto",
                        opacity: 1
                    },
                    exit: {
                        height: 0,
                        opacity: 0
                    },
                    transition: {
                        duration: .4,
                        ease: [.22, 1, .36, 1]
                    },
                    className: "overflow-hidden border-t border-zinc-200 dark:border-white/10",
                    children: e.jsx("div", {
                        className: "p-6 bg-zinc-50/50 dark:bg-black/20 space-y-4",
                        children: e.jsx("div", {
                            className: "grid grid-cols-1 gap-3",
                            children: L.map(k => {
                                const R = l.preferredModel === k.id;
                                return e.jsxs("button", {
                                    onClick: () => o(k.id),
                                    className: $("flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group", R ? "bg-white dark:bg-white/10 border-brand-500 shadow-md" : "bg-white/50 dark:bg-white/5 border-transparent hover:border-zinc-300 dark:hover:border-white/20"),
                                    children: [e.jsx("div", {
                                        className: $("p-2 rounded-xl transition-colors", R ? "bg-brand-500 text-white" : "bg-zinc-100 dark:bg-white/10 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200"),
                                        children: k.id.includes("flash") || k.id.includes("versatile") ? e.jsx($e, {
                                            className: "w-4 h-4"
                                        }) : e.jsx(Xe, {
                                            className: "w-4 h-4"
                                        })
                                    }), e.jsxs("div", {
                                        className: "flex-1 min-w-0",
                                        children: [e.jsxs("div", {
                                            className: "flex items-center gap-2",
                                            children: [e.jsx("span", {
                                                className: "text-sm font-bold text-zinc-900 dark:text-white",
                                                children: k.name
                                            }), k.isRecommended && e.jsx("span", {
                                                className: "text-[9px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20",
                                                children: "Recommended"
                                            })]
                                        }), e.jsx("p", {
                                            className: "text-[11px] text-zinc-500 truncate",
                                            children: k.description
                                        })]
                                    }), R && e.jsx(_, {
                                        className: "w-4 h-4 text-brand-500"
                                    })]
                                }, k.id)
                            })
                        })
                    })
                })
            })]
        })
    },
    aa = () => {
        const {
            quotes: t,
            addQuote: j,
            updateQuote: g,
            deleteQuote: y,
            toggleQuoteActive: h,
            setQuotePriority: r,
            importDefaultQuotes: m,
            resetToDefaults: b,
            getActiveQuotes: f
        } = Ds(), [v, l] = s.useState(!1), [z, N] = s.useState(null), [i, I] = s.useState(""), [o, d] = s.useState(""), [p, w] = s.useState(1), [S, C] = s.useState(""), [u, E] = s.useState(""), [P, F] = s.useState(1), [A, L] = s.useState(!0), [G, x] = s.useState(null);
        s.useEffect(() => {
            t.length === 0 && m()
        }, [t.length, m]);
        const k = () => {
                i.trim() && (j(i, o, p), I(""), d(""), w(1), l(!1))
            },
            R = n => {
                N(n.id), C(n.text), E(n.author), F(n.priority)
            },
            W = () => {
                z && S.trim() && (g(z, {
                    text: S,
                    author: u,
                    priority: P
                }), N(null))
            },
            J = () => {
                N(null), C(""), E(""), F(1)
            },
            T = () => {
                const n = JSON.stringify(t, null, 2),
                    U = new Blob([n], {
                        type: "application/json"
                    }),
                    M = URL.createObjectURL(U),
                    O = document.createElement("a");
                O.href = M, O.download = `isotope-quotes-${new Date().toISOString().split("T")[0]}.json`, document.body.appendChild(O), O.click(), document.body.removeChild(O), URL.revokeObjectURL(M)
            },
            Q = n => {
                const U = n.target.files ?.[0];
                if (!U) return;
                const M = new FileReader;
                M.onload = O => {
                    try {
                        const Y = JSON.parse(O.target ?.result);
                        Array.isArray(Y) ? (Y.forEach(X => {
                            X.text && j(X.text, X.author || "Unknown", X.priority || 1)
                        }), x(null)) : x("Invalid file format. Expected an array of quotes.")
                    } catch {
                        x("Failed to parse JSON file.")
                    }
                }, M.readAsText(U), n.target.value = ""
            },
            V = A ? t : t.filter(n => n.isActive),
            q = f().length,
            c = t.length;
        return e.jsxs("div", {
            className: "space-y-6",
            children: [e.jsxs("div", {
                className: "grid grid-cols-3 gap-4",
                children: [e.jsxs("div", {
                    className: "p-4 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20",
                    children: [e.jsx("div", {
                        className: "text-2xl font-bold text-brand-500",
                        children: c
                    }), e.jsx("div", {
                        className: "text-sm text-zinc-500",
                        children: "Total Quotes"
                    })]
                }), e.jsxs("div", {
                    className: "p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20",
                    children: [e.jsx("div", {
                        className: "text-2xl font-bold text-emerald-500",
                        children: q
                    }), e.jsx("div", {
                        className: "text-sm text-zinc-500",
                        children: "Active Quotes"
                    })]
                }), e.jsxs("div", {
                    className: "p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20",
                    children: [e.jsx("div", {
                        className: "text-2xl font-bold text-amber-500",
                        children: c - q
                    }), e.jsx("div", {
                        className: "text-sm text-zinc-500",
                        children: "Inactive"
                    })]
                })]
            }), e.jsxs("div", {
                className: "flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [e.jsxs("button", {
                        onClick: () => l(!v),
                        className: "flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium transition-all",
                        children: [e.jsx(at, {
                            className: "w-4 h-4"
                        }), "Add Quote"]
                    }), e.jsxs("button", {
                        onClick: m,
                        className: "flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-300 rounded-xl font-medium transition-all",
                        children: [e.jsx(tt, {
                            className: "w-4 h-4"
                        }), "Import Defaults"]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [e.jsxs("label", {
                        className: "flex items-center gap-2 text-sm text-zinc-500 cursor-pointer",
                        children: [e.jsx("input", {
                            type: "checkbox",
                            checked: A,
                            onChange: n => L(n.target.checked),
                            className: "rounded border-zinc-300 dark:border-zinc-600"
                        }), "Show Inactive"]
                    }), e.jsx("div", {
                        className: "w-px h-6 bg-zinc-200 dark:bg-white/10"
                    }), e.jsx("button", {
                        onClick: T,
                        className: "p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors",
                        title: "Export Quotes",
                        children: e.jsx(ye, {
                            className: "w-5 h-5"
                        })
                    }), e.jsxs("label", {
                        className: "p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer",
                        title: "Import Quotes",
                        children: [e.jsx(ls, {
                            className: "w-5 h-5"
                        }), e.jsx("input", {
                            type: "file",
                            accept: ".json",
                            onChange: Q,
                            className: "hidden"
                        })]
                    })]
                })]
            }), e.jsx(xe, {
                children: G && e.jsxs(K.div, {
                    initial: {
                        opacity: 0,
                        y: -10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -10
                    },
                    className: "p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-2",
                    children: [e.jsx(Ae, {
                        className: "w-5 h-5"
                    }), G, e.jsx("button", {
                        onClick: () => x(null),
                        className: "ml-auto",
                        children: e.jsx(ge, {
                            className: "w-4 h-4"
                        })
                    })]
                })
            }), e.jsx(xe, {
                children: v && e.jsx(K.div, {
                    initial: {
                        opacity: 0,
                        height: 0
                    },
                    animate: {
                        opacity: 1,
                        height: "auto"
                    },
                    exit: {
                        opacity: 0,
                        height: 0
                    },
                    className: "overflow-hidden",
                    children: e.jsxs("div", {
                        className: "p-6 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-4",
                        children: [e.jsx("h3", {
                            className: "text-lg font-semibold text-zinc-900 dark:text-white",
                            children: "Add New Quote"
                        }), e.jsxs("div", {
                            className: "space-y-3",
                            children: [e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-sm font-medium text-zinc-500 mb-1",
                                    children: "Quote Text"
                                }), e.jsx("textarea", {
                                    value: i,
                                    onChange: n => I(n.target.value),
                                    placeholder: "Enter the quote text...",
                                    rows: 3,
                                    className: "w-full px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none"
                                })]
                            }), e.jsxs("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "block text-sm font-medium text-zinc-500 mb-1",
                                        children: "Author"
                                    }), e.jsx("input", {
                                        type: "text",
                                        value: o,
                                        onChange: n => d(n.target.value),
                                        placeholder: "Author name...",
                                        className: "w-full px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                    })]
                                }), e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "block text-sm font-medium text-zinc-500 mb-1",
                                        children: "Priority (1-10)"
                                    }), e.jsx("input", {
                                        type: "number",
                                        min: 1,
                                        max: 10,
                                        value: p,
                                        onChange: n => w(parseInt(n.target.value) || 1),
                                        className: "w-full px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                    })]
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsxs("button", {
                                onClick: k,
                                disabled: !i.trim(),
                                className: "flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all",
                                children: [e.jsx(_, {
                                    className: "w-4 h-4"
                                }), "Add Quote"]
                            }), e.jsxs("button", {
                                onClick: () => l(!1),
                                className: "flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-300 rounded-xl font-medium transition-all",
                                children: [e.jsx(ge, {
                                    className: "w-4 h-4"
                                }), "Cancel"]
                            })]
                        })]
                    })
                })
            }), e.jsx("div", {
                className: "space-y-3",
                children: V.length === 0 ? e.jsxs("div", {
                    className: "text-center py-12 text-zinc-500",
                    children: [e.jsx(ze, {
                        className: "w-12 h-12 mx-auto mb-4 opacity-30"
                    }), e.jsx("p", {
                        children: "No quotes found."
                    }), e.jsx("button", {
                        onClick: m,
                        className: "mt-4 text-brand-500 hover:text-brand-600 font-medium",
                        children: "Import Default Quotes"
                    })]
                }) : V.map((n, U) => e.jsxs(K.div, {
                    initial: {
                        opacity: 0,
                        y: 10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: U * .05
                    },
                    className: `p-4 rounded-2xl border transition-all ${n.isActive?"bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10":"bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/5 opacity-60"}`,
                    children: [z === n.id ? e.jsxs("div", {
                        className: "space-y-3",
                        children: [e.jsx("textarea", {
                            value: S,
                            onChange: M => C(M.target.value),
                            rows: 3,
                            className: "w-full px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none"
                        }), e.jsxs("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [e.jsx("input", {
                                type: "text",
                                value: u,
                                onChange: M => E(M.target.value),
                                placeholder: "Author...",
                                className: "px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                            }), e.jsx("input", {
                                type: "number",
                                min: 1,
                                max: 10,
                                value: P,
                                onChange: M => F(parseInt(M.target.value) || 1),
                                className: "px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsxs("button", {
                                onClick: W,
                                className: "flex items-center gap-2 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium text-sm transition-all",
                                children: [e.jsx(_, {
                                    className: "w-4 h-4"
                                }), "Save"]
                            }), e.jsxs("button", {
                                onClick: J,
                                className: "flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium text-sm transition-all",
                                children: [e.jsx(ge, {
                                    className: "w-4 h-4"
                                }), "Cancel"]
                            })]
                        })]
                    }) : e.jsxs("div", {
                        className: "flex items-start gap-4",
                        children: [e.jsx("div", {
                            className: "flex-1 min-w-0",
                            children: e.jsxs("div", {
                                className: "flex items-start gap-3",
                                children: [e.jsx(ze, {
                                    className: "w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5"
                                }), e.jsxs("div", {
                                    className: "flex-1",
                                    children: [e.jsxs("p", {
                                        className: `text-zinc-900 dark:text-white font-medium leading-relaxed ${!n.isActive&&"line-through opacity-60"}`,
                                        children: ['"', n.text, '"']
                                    }), e.jsxs("p", {
                                        className: "text-sm text-zinc-500 mt-2",
                                        children: ["— ", n.author]
                                    })]
                                })]
                            })
                        }), e.jsxs("div", {
                            className: "flex items-center gap-1",
                            children: [e.jsx("button", {
                                onClick: () => R(n),
                                className: "p-2 text-zinc-400 hover:text-brand-500 transition-colors",
                                title: "Edit",
                                children: e.jsx(os, {
                                    className: "w-4 h-4"
                                })
                            }), e.jsx("button", {
                                onClick: () => h(n.id),
                                className: `p-2 transition-colors ${n.isActive?"text-emerald-500 hover:text-emerald-600":"text-zinc-400 hover:text-emerald-500"}`,
                                title: n.isActive ? "Deactivate" : "Activate",
                                children: n.isActive ? e.jsx(me, {
                                    className: "w-4 h-4"
                                }) : e.jsx(Ie, {
                                    className: "w-4 h-4"
                                })
                            }), e.jsx("button", {
                                onClick: () => y(n.id),
                                className: "p-2 text-zinc-400 hover:text-red-500 transition-colors",
                                title: "Delete",
                                children: e.jsx(se, {
                                    className: "w-4 h-4"
                                })
                            })]
                        })]
                    }), !z && e.jsxs("div", {
                        className: "mt-3 flex items-center gap-2",
                        children: [e.jsxs("span", {
                            className: `text-xs px-2 py-1 rounded-lg font-medium ${n.priority>=8?"bg-red-500/10 text-red-500":n.priority>=5?"bg-amber-500/10 text-amber-500":"bg-zinc-500/10 text-zinc-500"}`,
                            children: ["Priority: ", n.priority]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-1",
                            children: [e.jsx("button", {
                                onClick: () => r(n.id, Math.max(1, n.priority - 1)),
                                disabled: n.priority <= 1,
                                className: "p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 transition-colors",
                                children: e.jsx(xs, {
                                    className: "w-3 h-3"
                                })
                            }), e.jsx("button", {
                                onClick: () => r(n.id, Math.min(10, n.priority + 1)),
                                disabled: n.priority >= 10,
                                className: "p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 transition-colors",
                                children: e.jsx(ms, {
                                    className: "w-3 h-3"
                                })
                            })]
                        })]
                    })]
                }, n.id))
            }), t.length > 0 && e.jsx("div", {
                className: "pt-6 border-t border-zinc-200 dark:border-white/10",
                children: e.jsxs("div", {
                    className: "flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10",
                    children: [e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "font-medium text-zinc-900 dark:text-white",
                            children: "Reset to Defaults"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500",
                            children: "This will replace all your quotes with the default set"
                        })]
                    }), e.jsx("button", {
                        onClick: b,
                        className: "px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-medium transition-all",
                        children: "Reset"
                    })]
                })
            })]
        })
    },
    Fa = ({
        isDark: t,
        toggleTheme: j
    }) => {
        const {
            isPerformanceMode: g,
            shouldReduceMotion: y
        } = Ct(), h = Ms(), r = Bs(), [m, b] = s.useState("Settings"), [f, v] = s.useState(!1), [l, z] = s.useState("Profile"), [N, i] = s.useState(""), [I, o] = s.useState("menu");
        s.useEffect(() => {
            h.state ?.tab === "ai" && z("AI")
        }, [h.state]);
        const d = [{
                category: "General",
                items: [{
                    id: "Profile",
                    icon: Je,
                    label: "Profile",
                    component: Gs,
                    description: "Manage your personal info"
                }, {
                    id: "Account",
                    icon: hs,
                    label: "Account",
                    component: Rs,
                    description: "Security & password"
                }, {
                    id: "Subscription",
                    icon: bs,
                    label: "Subscription",
                    component: () => null,
                    description: "Manage Pro plan"
                }]
            }, {
                category: "Productivity",
                items: [{
                    id: "Focus",
                    icon: Ne,
                    label: "Focus",
                    component: Hs,
                    description: "Timer & soundscapes"
                }, {
                    id: "Academic",
                    icon: Se,
                    label: "Academic",
                    component: Vs,
                    description: "Study setup & planning"
                }, {
                    id: "Gamification",
                    icon: nt,
                    label: "Gamification",
                    component: ea,
                    description: "Streaks & rewards"
                }, {
                    id: "Quotes",
                    icon: ze,
                    label: "Quotes",
                    component: aa,
                    description: "Manage motivational quotes"
                }]
            }, {
                category: "AI Features",
                items: [{
                    id: "AI",
                    icon: oe,
                    label: "AI Assistant",
                    component: sa,
                    description: "Configure AI & API key"
                }]
            }, {
                category: "App Preferences",
                items: [{
                    id: "Appearance",
                    icon: Ze,
                    label: "Appearance",
                    component: Us,
                    description: "Theme & accessibility"
                }, {
                    id: "Notifications",
                    icon: re,
                    label: "Notifications",
                    component: $s,
                    description: "Email & push alerts"
                }, {
                    id: "Integrations",
                    icon: st,
                    label: "Integrations",
                    component: Qs,
                    description: "Connected apps"
                }, {
                    id: "DataPrivacy",
                    icon: it,
                    label: "Data & Privacy",
                    component: Zs,
                    description: "Export & ghost mode"
                }]
            }, {
                category: "Support",
                items: [{
                    id: "Feedback",
                    icon: dt,
                    label: "Feedback & Requests",
                    component: ta,
                    description: "Bugs, features & ideas"
                }]
            }],
            p = d.flatMap(u => u.items),
            w = d.map(u => ({ ...u,
                items: u.items.filter(E => E.label.toLowerCase().includes(N.toLowerCase()) || E.description.toLowerCase().includes(N.toLowerCase()))
            })).filter(u => u.items.length > 0),
            S = p.find(u => u.id === l) ?.component || (() => e.jsx("div", {
                children: "Not Found"
            })),
            C = p.find(u => u.id === l);
        return e.jsxs("div", {
            className: "app-shell h-screen bg-[#f4f4f5] dark:bg-[#09090b] text-zinc-900 dark:text-white flex overflow-hidden selection:bg-brand-500/30",
            children: [!g && e.jsxs("div", {
                className: "app-ambient fixed inset-0 z-0 pointer-events-none",
                children: [e.jsx("div", {
                    className: "absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px]"
                }), e.jsx("div", {
                    className: "absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]"
                })]
            }), e.jsx(Pt, {
                activeTab: m,
                setActiveTab: b,
                isDark: t,
                toggleTheme: j,
                mobileMenuOpen: f,
                setMobileMenuOpen: v
            }), e.jsxs("main", {
                className: "app-main-shell flex-1 relative flex flex-col h-screen overflow-hidden bg-[#f4f4f5] dark:bg-[#09090b]",
                children: [e.jsx(At, {
                    activeTab: m,
                    mobileMenuOpen: f,
                    setMobileMenuOpen: v
                }), e.jsxs("div", {
                    className: "flex-1 overflow-hidden flex flex-col lg:flex-row density-app-width w-full min-h-0",
                    children: [e.jsxs("aside", {
                        className: `
            app-card-soft w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm overflow-y-auto flex flex-col min-h-0
            ${I==="content"?"hidden lg:flex":"flex"}
          `,
                        children: [e.jsxs("div", {
                            className: "app-header density-card-surface sticky top-0 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md z-10 border-b border-zinc-200 dark:border-white/5",
                            children: [e.jsx("h2", {
                                className: "text-xl font-display font-bold text-zinc-900 dark:text-white mb-4 px-2",
                                children: "Settings"
                            }), e.jsxs("div", {
                                className: "relative",
                                children: [e.jsx(us, {
                                    className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                                }), e.jsx("input", {
                                    type: "search",
                                    placeholder: "Search settings...",
                                    value: N,
                                    onChange: u => i(u.target.value),
                                    autoComplete: "off",
                                    autoCorrect: "off",
                                    autoCapitalize: "off",
                                    spellCheck: "false",
                                    className: "w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                                })]
                            })]
                        }), e.jsx("nav", {
                            className: "flex-1 p-[var(--density-card-padding)] lg:p-[var(--density-card-padding-lg)] space-y-[var(--density-stack-gap)]",
                            children: w.map((u, E) => e.jsxs("div", {
                                children: [e.jsx("h3", {
                                    className: "px-3 text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mb-2",
                                    children: u.category
                                }), e.jsx("div", {
                                    className: "space-y-1",
                                    children: u.items.map(P => {
                                        const F = P.icon,
                                            A = l === P.id;
                                        return e.jsxs("button", {
                                            onClick: () => {
                                                if (P.id === "Subscription") {
                                                    r("/subscription");
                                                    return
                                                }
                                                z(P.id), o("content")
                                            },
                                            className: `
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                            ${A?"bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm":"text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"}
                          `,
                                            children: [e.jsx(F, {
                                                className: `w-4 h-4 transition-colors ${A?"text-brand-500 dark:text-brand-400":"text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}`
                                            }), e.jsx("div", {
                                                className: "flex-1 text-left",
                                                children: e.jsx("div", {
                                                    className: A ? "font-semibold" : "",
                                                    children: P.label
                                                })
                                            }), A && e.jsx(_e, {
                                                className: "w-4 h-4 text-zinc-400"
                                            }), A && e.jsx("div", {
                                                className: "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-r-full"
                                            })]
                                        }, P.id)
                                    })
                                })]
                            }, E))
                        })]
                    }), e.jsx("div", {
                        className: `
            app-main-shell flex-1 overflow-y-auto density-app-shell-x pt-[var(--density-page-y)] lg:pt-[var(--density-page-y-lg)] custom-scrollbar bg-zinc-50/50 dark:bg-[#09090b] safe-bottom
            ${I==="menu"?"hidden lg:block":"block"}
          `,
                        children: e.jsx("div", {
                            className: "max-w-3xl mx-auto w-full pb-20",
                            children: e.jsxs(K.div, {
                                initial: y ? !1 : {
                                    opacity: 0,
                                    y: 10
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: y ? 0 : .3
                                },
                                children: [e.jsxs("button", {
                                    onClick: () => o("menu"),
                                    className: "lg:hidden mb-4 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors",
                                    children: [e.jsx(_e, {
                                        className: "w-4 h-4 rotate-180"
                                    }), e.jsx("span", {
                                        className: "text-sm font-medium",
                                        children: "Back to Settings"
                                    })]
                                }), e.jsxs("div", {
                                    className: "mb-[var(--density-stack-gap-lg)] flex items-start sm:items-center gap-3 sm:gap-4",
                                    children: [e.jsx("div", {
                                        className: "density-card-surface rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm",
                                        children: C && ne.createElement(C.icon, {
                                            className: "w-6 h-6 text-brand-500"
                                        })
                                    }), e.jsxs("div", {
                                        children: [e.jsx("h1", {
                                            className: "text-2xl font-bold text-zinc-900 dark:text-white",
                                            children: C ?.label
                                        }), e.jsx("p", {
                                            className: "text-zinc-500 dark:text-zinc-400 mt-1",
                                            children: C ?.description
                                        })]
                                    })]
                                }), e.jsx("div", {
                                    className: "settings-density-root",
                                    children: e.jsx(S, {})
                                })]
                            }, l)
                        })
                    })]
                })]
            })]
        })
    };
export {
    Fa as
    default
};
