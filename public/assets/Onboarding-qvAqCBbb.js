const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/Step1Identity-BZBwnoJ8.js", "assets/vendor-react-BfU3Zn2J.js", "assets/OnboardingNavigation-C6kIq5HV.js", "assets/vendor-icons-CqruUz7g.js", "assets/App-pJGjDiPw.js", "assets/index-BPYJFSVW.js", "assets/index-CrO6t5EW.css", "assets/vendor-supabase-DAiUAuun.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/vendor-router-CmoTwRnm.js", "assets/useFocusStore-CX_Nyp1h.js", "assets/useNotificationStore-BS4df28T.js", "assets/Step2Academic-BUGsFsTy.js", "assets/ChipMultiSelect-BU74OOip.js", "assets/SubjectCreateModal-DhD_Cwbk.js", "assets/subjectBranding-DaDo_h8r.js", "assets/SubjectIcon-CyCDqtel.js", "assets/utils-D8mZnxMk.js", "assets/vendor-charts-CFLJvnG7.js", "assets/Step3StudyGoals-CQ0yWK1r.js", "assets/RadioCard-BtzZXn6i.js", "assets/Step4Preferences-D6oDNUqn.js", "assets/Step5Community-BvHWgTaf.js", "assets/Step6Personalization-CNdBQkFI.js", "assets/Toggle-D54hkegy.js", "assets/CompletionCelebration-ngx4eqoP.js"]))) => i.map(i => d[i]);
import {
    _ as u
} from "./index-BPYJFSVW.js";
import {
    j as t,
    r as c
} from "./vendor-react-BfU3Zn2J.js";
import {
    d as k,
    p as z,
    e as _,
    f as P,
    h as j,
    u as N
} from "./App-pJGjDiPw.js";
import {
    u as O
} from "./useFocusStore-CX_Nyp1h.js";
import {
    A as C
} from "./vendor-icons-CqruUz7g.js";
import {
    u as D
} from "./vendor-router-CmoTwRnm.js";
const A = ({
        currentStep: a,
        totalSteps: o
    }) => t.jsxs("div", {
        className: "w-full flex items-center justify-between gap-2",
        children: [Array.from({
            length: o
        }).map((e, r) => {
            const s = r + 1,
                m = s === a,
                i = s < a;
            return t.jsx("div", {
                className: `h-2 rounded-full transition-all duration-300 ${m?"flex-1 bg-brand-500":i?"w-8 bg-zinc-900 dark:bg-zinc-700":"w-2 bg-zinc-200 dark:bg-zinc-800"}`
            }, r)
        }), t.jsxs("span", {
            className: "text-xs font-medium text-zinc-400 ml-2",
            children: [a, "/", o]
        })]
    }),
    g = {
        username: "",
        institution: "",
        grade: "",
        targetExams: [],
        primarySubjects: [],
        customizedSubjects: {},
        weeklyCapacity: 40,
        gpaScale: "4.0",
        dailyGoalHours: 4,
        preferredFocusMethod: "pomodoro",
        soundscapePreference: "lofi",
        studentStatus: "normal",
        taskOrganizationStyle: "kanban",
        studyEnvironment: [],
        notificationsEnabled: !0,
        notificationTypes: {
            taskReminders: !0,
            sessionBreaks: !0,
            dailySummary: !0,
            achievements: !0
        },
        interestedInStudyGroups: !1,
        collaborationStyle: "solo",
        shareProgress: !1,
        theme: "system",
        accentColor: "#f97316",
        dashboardLayout: "comfortable",
        dyslexiaFont: !1
    },
    E = k()(z((a, o) => ({
        currentStep: 1,
        completedSteps: [],
        skippedSteps: [],
        formData: g,
        validationErrors: {},
        isCompleting: !1,
        goToStep: e => a({
            currentStep: e
        }),
        nextStep: () => {
            const {
                currentStep: e,
                completedSteps: r
            } = o();
            r.includes(e) || a({
                completedSteps: [...r, e]
            }), a({
                currentStep: e + 1
            })
        },
        previousStep: () => {
            const {
                currentStep: e
            } = o();
            e > 1 && a({
                currentStep: e - 1
            })
        },
        skipStep: () => {
            const {
                currentStep: e,
                skippedSteps: r,
                completedSteps: s
            } = o();
            r.includes(e) || a({
                skippedSteps: [...r, e]
            }), s.includes(e) || a({
                completedSteps: [...s, e]
            }), a({
                currentStep: e + 1
            })
        },
        updateFormData: e => a(r => ({
            formData: { ...r.formData,
                ...e
            }
        })),
        setValidationError: (e, r) => a(s => ({
            validationErrors: { ...s.validationErrors,
                [e]: r
            }
        })),
        clearValidationError: e => a(r => {
            const s = { ...r.validationErrors
            };
            return delete s[e], {
                validationErrors: s
            }
        }),
        hydrateFromProfile: e => {
            a(r => ({
                formData: { ...r.formData,
                    username: e.username || "",
                    avatar: e.avatar,
                    bio: e.bio,
                    institution: e.academic ?.institution || "",
                    grade: e.academic ?.grade || "",
                    targetExams: e.academic ?.targetExams || [],
                    primarySubjects: e.academic ?.primarySubjects || [],
                    weeklyCapacity: e.academic ?.weeklyCapacity,
                    gpaScale: e.academic ?.gpaScale,
                    semesterStart: e.academic ?.semesterStart,
                    semesterEnd: e.academic ?.semesterEnd,
                    dailyGoalHours: e.studyPreferences ?.dailyGoalHours || 4,
                    preferredFocusMethod: e.studyPreferences ?.preferredFocusMethod || "pomodoro",
                    pomodoroSettings: e.studyPreferences ?.pomodoroSettings,
                    soundscapePreference: e.studyPreferences ?.soundscapePreference,
                    studentStatus: e.studyPreferences ?.studentStatus,
                    taskOrganizationStyle: e.workflowPreferences ?.taskOrganizationStyle || "kanban",
                    studyEnvironment: e.workflowPreferences ?.studyEnvironment || [],
                    notificationsEnabled: e.workflowPreferences ?.notificationsEnabled ?? !0,
                    notificationTypes: e.workflowPreferences ?.notificationTypes || r.formData.notificationTypes,
                    interestedInStudyGroups: e.communityPreferences ?.interestedInStudyGroups ?? !1,
                    collaborationStyle: e.communityPreferences ?.collaborationStyle || "solo",
                    shareProgress: e.communityPreferences ?.shareProgress ?? !1,
                    theme: e.settings ?.theme || "system",
                    accentColor: e.personalization ?.accentColor || "#f97316",
                    dashboardLayout: e.personalization ?.dashboardLayout || "comfortable",
                    dyslexiaFont: e.personalization ?.dyslexiaFont ?? !1
                }
            }))
        },
        completeOnboarding: async () => {
            const {
                formData: e
            } = o();
            a({
                isCompleting: !0
            });
            try {
                const {
                    updateProfile: r
                } = j.getState(), {
                    addSubject: s,
                    updateSubject: m,
                    createSubjectsFromTemplate: i
                } = O.getState(), l = {
                    username: e.username,
                    avatar: e.avatar,
                    bio: e.bio,
                    academic: {
                        institution: e.institution,
                        grade: e.grade,
                        targetExams: e.targetExams,
                        primarySubjects: e.primarySubjects,
                        weeklyCapacity: e.weeklyCapacity,
                        gpaScale: e.gpaScale,
                        semesterStart: e.semesterStart,
                        semesterEnd: e.semesterEnd
                    },
                    studyPreferences: {
                        dailyGoalHours: e.dailyGoalHours,
                        preferredFocusMethod: e.preferredFocusMethod,
                        pomodoroSettings: e.pomodoroSettings,
                        soundscapePreference: e.soundscapePreference,
                        studentStatus: e.studentStatus
                    },
                    workflowPreferences: {
                        taskOrganizationStyle: e.taskOrganizationStyle,
                        studyEnvironment: e.studyEnvironment,
                        notificationsEnabled: e.notificationsEnabled,
                        notificationTypes: e.notificationTypes
                    },
                    communityPreferences: {
                        interestedInStudyGroups: e.interestedInStudyGroups,
                        collaborationStyle: e.collaborationStyle,
                        communitySubjects: e.primarySubjects,
                        shareProgress: e.shareProgress
                    },
                    personalization: {
                        accentColor: e.accentColor,
                        dashboardLayout: e.dashboardLayout,
                        showWelcomeTeaser: !0,
                        dyslexiaFont: e.dyslexiaFont
                    },
                    settings: {
                        theme: e.theme,
                        notifications: e.notificationsEnabled
                    },
                    currentOnboardingStep: 7
                };
                await r(l);
                const p = (e.targetExams || []).some(d => d.toLowerCase().includes("jee")),
                    b = [];
                if (p) {
                    const d = ["Mathematics", "Physics", "Chemistry"],
                        n = e.primarySubjects.filter(f => d.includes(f));
                    if (n.length > 0) {
                        const f = await i("jee-main-advanced", n);
                        for (const h of f) {
                            const S = e.customizedSubjects[h.name];
                            S && await m(h.id, {
                                color: S.color,
                                gradient: S.gradient,
                                icon: S.icon
                            }), b.push(h.name)
                        }
                    }
                }
                const y = e.primarySubjects.filter(d => !b.includes(d));
                for (const d of y) {
                    const n = e.customizedSubjects[d],
                        f = await s(d, n ?.icon);
                    f && n && await m(f.id, {
                        color: n.color,
                        gradient: n.gradient
                    })
                }
                a({
                    currentStep: 7
                }), await r({
                    isOnboarded: !0,
                    onboardingCompletedAt: new Date().toISOString()
                })
            } catch (r) {
                throw console.error("[OnboardingStore] Error completing onboarding:", r), r
            } finally {
                a({
                    isCompleting: !1
                })
            }
        },
        exitOnboarding: () => {
            a({
                currentStep: 1,
                completedSteps: [],
                skippedSteps: [],
                formData: g,
                validationErrors: {}
            })
        },
        resetOnboarding: () => a({
            currentStep: 1,
            completedSteps: [],
            skippedSteps: [],
            formData: g,
            validationErrors: {},
            isCompleting: !1
        })
    }), {
        name: "isotope-onboarding",
        storage: _(() => P)
    })),
    T = ({
        children: a
    }) => {
        const {
            currentStep: o
        } = E(), e = 6, r = () => {
            window.open("https://isotope.featurebase.app/", "_blank", "noopener,noreferrer")
        };
        return t.jsxs("div", {
            className: "min-h-screen bg-[#f4f4f5] dark:bg-[#09090b] text-zinc-900 dark:text-white flex flex-col relative overflow-hidden font-sans selection:bg-brand-500/30 selection:text-white",
            children: [t.jsxs("div", {
                className: "fixed inset-0 z-0 pointer-events-none",
                children: [t.jsx("div", {
                    className: "absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px]"
                }), t.jsx("div", {
                    className: "absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px]"
                })]
            }), t.jsxs("header", {
                className: "relative z-20 flex items-center justify-between px-8 py-6 w-full max-w-4xl mx-auto",
                children: [t.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [t.jsx("div", {
                        className: "w-10 h-10 bg-zinc-900 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-white/10 flex items-center justify-center",
                        children: t.jsx(C, {
                            className: "w-5 h-5 text-zinc-900 dark:text-white"
                        })
                    }), t.jsx("span", {
                        className: "font-bold text-xl tracking-tight text-zinc-900 dark:text-white",
                        children: "IsotopeAI"
                    })]
                }), t.jsx("button", {
                    type: "button",
                    onClick: r,
                    className: "text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors",
                    children: "Help"
                })]
            }), t.jsx("div", {
                className: "flex-1 flex flex-col items-center justify-center px-4 pb-12 z-10 w-full",
                children: t.jsx("div", {
                    className: "w-full max-w-xl",
                    children: t.jsxs("div", {
                        className: "relative",
                        children: [t.jsx("div", {
                            className: "mb-8",
                            children: t.jsx(A, {
                                currentStep: o,
                                totalSteps: e
                            })
                        }), t.jsx("div", {
                            className: "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 md:p-8",
                            children: a
                        })]
                    })
                })
            })]
        })
    },
    v = c.lazy(() => u(() =>
        import ("./Step1Identity-BZBwnoJ8.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).then(a => ({
        default: a.Step1Identity
    }))),
    I = c.lazy(() => u(() =>
        import ("./Step2Academic-BUGsFsTy.js"), __vite__mapDeps([12, 1, 2, 3, 13, 14, 10, 5, 6, 4, 7, 8, 9, 11, 15, 16, 17, 18])).then(a => ({
        default: a.Step2Academic
    }))),
    L = c.lazy(() => u(() =>
        import ("./Step3StudyGoals-CQ0yWK1r.js"), __vite__mapDeps([19, 1, 2, 3, 20, 5, 6, 4, 7, 8, 9, 10, 11])).then(a => ({
        default: a.Step3StudyGoals
    }))),
    F = c.lazy(() => u(() =>
        import ("./Step4Preferences-D6oDNUqn.js"), __vite__mapDeps([21, 1, 2, 3, 20, 13, 5, 6, 4, 7, 8, 9, 10, 11])).then(a => ({
        default: a.Step4Preferences
    }))),
    G = c.lazy(() => u(() =>
        import ("./Step5Community-BvHWgTaf.js"), __vite__mapDeps([22, 1, 2, 3, 20, 5, 6, 4, 7, 8, 9, 10, 11])).then(a => ({
        default: a.Step5Community
    }))),
    H = c.lazy(() => u(() =>
        import ("./Step6Personalization-CNdBQkFI.js"), __vite__mapDeps([23, 1, 2, 3, 24, 4, 5, 6, 7, 8, 9, 10, 11])).then(a => ({
        default: a.Step6Personalization
    }))),
    R = c.lazy(() => u(() =>
        import ("./CompletionCelebration-ngx4eqoP.js"), __vite__mapDeps([25, 1, 4, 5, 6, 7, 8, 3, 9, 10, 11])).then(a => ({
        default: a.CompletionCelebration
    }))),
    w = () => t.jsxs("div", {
        className: "flex flex-col items-center justify-center min-h-[400px]",
        children: [t.jsx("div", {
            className: "w-10 h-10 border-2 border-zinc-200 dark:border-zinc-700 border-t-brand-500 rounded-full animate-spin mb-4"
        }), t.jsx("p", {
            className: "text-zinc-500",
            children: "Loading..."
        })]
    }),
    V = ({
        isDark: a
    }) => {
        const {
            currentStep: o,
            formData: e,
            updateFormData: r,
            hydrateFromProfile: s,
            isCompleting: m
        } = E(), i = j(n => n.profile), l = j(n => n.isProfileLoaded), x = N(n => n.isAuthenticated), p = D(), [b, y] = c.useState(!1);
        c.useEffect(() => {
            l && i && !b && (i.username && !e.username && r({
                username: i.username
            }), (i.username || i.academic ?.institution) && s(i), y(!0))
        }, [l, i, b, e.username, r, s]), c.useEffect(() => {
            l && i ?.isOnboarded && o < 2 && p("/dashboard", {
                replace: !0
            })
        }, [i ?.isOnboarded, o, l, p]), c.useEffect(() => {
            x || p("/auth", {
                replace: !0
            })
        }, [x, p]);
        const d = () => {
            if (o === 7) return t.jsx(c.Suspense, {
                fallback: t.jsx(w, {}),
                children: t.jsx(R, {})
            });
            if (m) return t.jsxs("div", {
                className: "flex flex-col items-center justify-center min-h-[400px]",
                children: [t.jsx("div", {
                    className: "w-10 h-10 border-2 border-zinc-200 dark:border-zinc-700 border-t-brand-500 rounded-full animate-spin mb-4"
                }), t.jsx("p", {
                    className: "text-zinc-500",
                    children: "Setting up your workspace..."
                })]
            });
            const n = {
                1: t.jsx(v, {}),
                2: t.jsx(I, {}),
                3: t.jsx(L, {}),
                4: t.jsx(F, {}),
                5: t.jsx(G, {}),
                6: t.jsx(H, {})
            };
            return t.jsx(c.Suspense, {
                fallback: t.jsx(w, {}),
                children: n[o] || t.jsx(v, {})
            })
        };
        return l ? t.jsx(T, {
            children: d()
        }) : t.jsx("div", {
            className: "min-h-screen bg-[#f4f4f5] dark:bg-[#09090b] flex items-center justify-center",
            children: t.jsx("div", {
                className: "text-zinc-900 dark:text-white font-medium",
                children: "Loading..."
            })
        })
    },
    q = Object.freeze(Object.defineProperty({
        __proto__: null,
        default: V
    }, Symbol.toStringTag, {
        value: "Module"
    }));
export {
    q as O, E as u
};