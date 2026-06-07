const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/Landing-CWRNt7E9.js", "assets/index-BPYJFSVW.js", "assets/vendor-react-BfU3Zn2J.js", "assets/index-CrO6t5EW.css", "assets/Navbar-BJMJUymI.js", "assets/vendor-icons-CqruUz7g.js", "assets/HeadwayUpdatesButton-DUh668tJ.js", "assets/useOnlineStatus-BJOTUERN.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/PremiumEffects-BX6T03yQ.js", "assets/utils-D8mZnxMk.js", "assets/vendor-charts-CFLJvnG7.js", "assets/vendor-router-CmoTwRnm.js", "assets/useSupportModalStore-BkYsnKtG.js", "assets/LazySection-7u6SQGE2.js", "assets/vendor-supabase-DAiUAuun.js", "assets/Dashboard-dypAV-0H.js", "assets/SubjectIcon-CyCDqtel.js", "assets/subjectBranding-DaDo_h8r.js", "assets/MarkdownRenderer-CIV1x0Uq.js", "assets/useAIStore-B2cv1FZz.js", "assets/useFocusStore-CX_Nyp1h.js", "assets/useNotificationStore-BS4df28T.js", "assets/DashboardHeader-DNuRMna8.js", "assets/timeFormat-CMPo-BX2.js", "assets/useSyncStore-vWs_TdIc.js", "assets/IsotopeLogoIcon-oPk5Ru-_.js", "assets/useQuotesStore-C7b4gZp0.js", "assets/TaskCardModal-DZvd1GWt.js", "assets/taskAvailability-B1aDS_ww.js", "assets/AIAnalysisCard-qrpOk1g6.js", "assets/taskCompletion-DkuS3Ybf.js", "assets/Focus-BmgY-9vP.js", "assets/SessionEditModal-CNi_rT0l.js", "assets/studyTimeMaps-B0T_-AX0.js", "assets/focusBackground-t8AknbRg.js", "assets/Analytics-D74gQMjN.js", "assets/sortable.esm-BBuGRz7f.js", "assets/Study-pAdAenIl.js", "assets/ExamCreateEditModal-BdlzfeFO.js", "assets/SubjectCreateModal-DhD_Cwbk.js", "assets/ExamTemplateSelectorModal-DsEPEF5X.js", "assets/endOfMonth-BISTJu4P.js", "assets/Syllabus-DZSnov0t.js", "assets/Exams-C3jymPwe.js", "assets/ExamPrimitives-K6hgnm_l.js", "assets/ExamDetailPage-q_jDT5_x.js", "assets/Tasks-BYRFOrek.js", "assets/studyPreferences-BBZvHe-O.js", "assets/Tasks-COZfGapE.css", "assets/ChapterHub-BXRydU0B.js", "assets/vendor-katex-BSXZKQS3.js", "assets/vendor-katex-ASjZcBK0.css", "assets/vendor-markdown-core-Pkt6xPHa.js", "assets/Community-DIqF5406.js", "assets/Auth-Cw0VAaCZ.js", "assets/ResetPassword-mBBJZV4T.js", "assets/Onboarding-qvAqCBbb.js", "assets/DemoLauncher-CdcwMBr6.js", "assets/SettingsLayout-B4OgCkQ5.js", "assets/Toggle-D54hkegy.js", "assets/messaging-BP0KfJxy.js", "assets/TaskController-BUyiMYKC.js", "assets/ChipMultiSelect-BU74OOip.js", "assets/Subscription-UaefsAtQ.js", "assets/InviteOnlineOnlyRoute-CZgdOWgx.js", "assets/QueryProvider-DusNhG9D.js", "assets/vendor-query-Rjz85D0S.js", "assets/useInvites-D9RLFwf8.js", "assets/NetworkRequiredState-O9ZdVBEy.js", "assets/NotFound-X23NBnde.js", "assets/PageLayout-B8yOy6kS.js", "assets/Terms-BXixZPB6.js", "assets/About-DbJqhVWT.js", "assets/Privacy-ClP3A1gm.js", "assets/AppAccessGate-B975UtK7.js", "assets/index-B45N-99N.js", "assets/endOfDay-CZDDeNMb.js", "assets/PWAManager-DjIYufp2.js", "assets/SupportPromptDialog-Bkl24oin.js", "assets/SupportMessage-BE7j-Ezd.js"]))) => i.map(i => d[i]);
import {
    i as Ja,
    _ as j
} from "./index-BPYJFSVW.js";
import {
    f as xe,
    r as v,
    j as S
} from "./vendor-react-BfU3Zn2J.js";
import {
    c as Va
} from "./vendor-supabase-DAiUAuun.js";
import {
    M as Ya
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    an as Qa,
    aa as Xa
} from "./vendor-icons-CqruUz7g.js";
import {
    b as Za,
    B as es,
    R as ts,
    d as B
} from "./vendor-router-CmoTwRnm.js";
const jt = a => {
        let e;
        const t = new Set,
            s = (d, h) => {
                const A = typeof d == "function" ? d(e) : d;
                if (!Object.is(A, e)) {
                    const u = e;
                    e = h ?? (typeof A != "object" || A === null) ? A : Object.assign({}, e, A), t.forEach(f => f(e, u))
                }
            },
            r = () => e,
            o = {
                setState: s,
                getState: r,
                getInitialState: () => c,
                subscribe: d => (t.add(d), () => t.delete(d))
            },
            c = e = a(s, r, o);
        return o
    },
    as = (a => a ? jt(a) : jt),
    ss = a => a;

function rs(a, e = ss) {
    const t = xe.useSyncExternalStore(a.subscribe, xe.useCallback(() => e(a.getState()), [a, e]), xe.useCallback(() => e(a.getInitialState()), [a, e]));
    return xe.useDebugValue(t), t
}
const Bt = a => {
        const e = as(a),
            t = s => rs(e, s);
        return Object.assign(t, e), t
    },
    ca = (a => a ? Bt(a) : Bt),
    wn = () => typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, a => {
        const e = Math.random() * 16 | 0;
        return (a === "x" ? e : e & 3 | 8).toString(16)
    }),
    L = () => new Date().toISOString(),
    l = {
        TASKS: "isotope_tasks_v2",
        SESSIONS: "isotope_sessions_v2",
        SUBJECTS: "isotope_subjects_v2",
        HABITS: "isotope_habits_v2",
        USER_PROFILE: "isotope_user_profile_v2",
        TIMER_STATE: "isotope_timer_state",
        DAILY_LOGS: "isotope_daily_logs_v2",
        TESTS: "isotope_tests_v2",
        EXAMS: "isotope_exams_v2",
        MOCK_TESTS: "isotope_mock_tests_v2",
        SCHEMA_VERSION: "isotope_schema_version",
        SYNC_METADATA: "isotope_sync_metadata"
    },
    is = 28,
    ns = 4,
    nt = [{
        id: "theory",
        label: "Theory",
        icon: "📚",
        trackQuestions: !1
    }, {
        id: "questions",
        label: "Questions",
        icon: "❓",
        trackQuestions: !0
    }, {
        id: "lecture",
        label: "Lecture",
        icon: "🎓",
        trackQuestions: !1
    }, {
        id: "revision",
        label: "Revision",
        icon: "📝",
        trackQuestions: !0
    }, {
        id: "practice",
        label: "Practice",
        icon: "💪",
        trackQuestions: !0
    }, {
        id: "other",
        label: "Other",
        icon: "📌",
        trackQuestions: !1
    }],
    os = a => a.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `focus-${Date.now()}`,
    cs = a => {
        const e = a.label ?.trim().slice(0, is);
        if (!e) return null;
        const t = (a.id ?.trim() || os(e)).toLowerCase(),
            s = (a.icon ?.trim() || "📌").slice(0, ns),
            r = Math.max(0, Math.floor(a.defaultQuestionTarget || 0));
        return {
            id: t,
            label: e,
            icon: s,
            trackQuestions: !!a.trackQuestions,
            ...r > 0 ? {
                defaultQuestionTarget: r
            } : {}
        }
    },
    la = a => {
        const e = a && a.length > 0 ? a : nt,
            t = new Set,
            s = [];
        return e.forEach(r => {
            const i = cs(r);
            !i || t.has(i.id) || (t.add(i.id), s.push(i))
        }), s.length > 0 ? s : nt
    },
    Ze = (a, e) => {
        if (!e) return;
        const t = e.toLowerCase();
        return la(a).find(s => s.id === t)
    },
    In = (a, e, t) => {
        const s = Ze(a, e) || Ze(a, t) || Ze(a, t ?.toLowerCase());
        return s ?.trackQuestions ? s : void 0
    },
    Te = "system",
    Oe = "#f97316",
    da = "comfortable",
    pt = "standard",
    Ve = !1,
    ls = /^#(?:[0-9a-fA-F]{6})$/,
    ua = a => a && ls.test(a) ? a : Oe,
    We = {
        defaultDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStartBreaks: !1,
        dailyGoalMinutes: 360,
        notificationSound: !0,
        sessionEndSound: !0,
        pomodorosUntilLongBreak: 4,
        notificationInterval: 195,
        showPauseReasonPicker: !0,
        showSessionCompletionCard: !0,
        showQuestionTrackingInTimerPip: !0,
        showSessionProductivityRating: !0,
        focusTypes: nt
    },
    ma = () => ({
        name: "",
        swot: {
            strengths: [],
            weaknesses: [],
            opportunities: [],
            threats: []
        },
        settings: {
            theme: Te,
            notifications: !0,
            performanceMode: pt
        },
        focusSettings: We,
        createdAt: L(),
        updatedAt: L(),
        isOnboarded: !1,
        currentOnboardingStep: 1,
        personalization: {
            accentColor: Oe,
            dashboardLayout: da,
            showWelcomeTeaser: !0,
            dyslexiaFont: Ve
        }
    }),
    pe = a => {
        const e = ma(),
            t = typeof a ?.username == "string" ? a.username.trim() : "",
            s = typeof a ?.name == "string" ? a.name.trim() : "",
            r = t || s;
        return { ...e,
            ...a,
            name: r || "",
            username: r || void 0,
            swot: { ...e.swot,
                ...a ?.swot
            },
            settings: { ...e.settings,
                ...a ?.settings
            },
            focusSettings: { ...We,
                ...a ?.focusSettings,
                focusTypes : la(a ?.focusSettings ?.focusTypes)
            },
            personalization: { ...e.personalization,
                ...a ?.personalization,
                accentColor : ua(a ?.personalization ?.accentColor)
            },
            createdAt: a ?.createdAt || e.createdAt,
            updatedAt: a ?.updatedAt || e.updatedAt
        }
    },
    et = (a, e) => {
        const t = pe(a);
        return pe({ ...t,
            ...e,
            swot: e.swot ? { ...t.swot,
                ...e.swot
            } : t.swot,
            settings: e.settings ? { ...t.settings,
                ...e.settings
            } : t.settings,
            focusSettings: e.focusSettings ? { ...t.focusSettings,
                ...e.focusSettings
            } : t.focusSettings,
            personalization: e.personalization ? { ...t.personalization,
                ...e.personalization
            } : t.personalization
        })
    },
    ds = new Set(["http:", "https:"]),
    us = new Set(["http:", "https:", "mailto:", "tel:"]),
    ms = /^(\/(?!\/)|#|\.{1,2}\/)/,
    ps = /^(\/(?!\/)|\.{1,2}\/)/,
    fs = /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i;

function ft(a) {
    if (typeof a != "string") return;
    const e = a.trim();
    return e.length > 0 ? e : void 0
}

function pa(a) {
    const e = ft(a);
    if (e) try {
        const t = new URL(e);
        return ds.has(t.protocol) ? t.toString() : void 0
    } catch {
        return
    }
}

function hs(a) {
    const e = ft(a);
    if (e) {
        if (ms.test(e)) return e;
        try {
            const t = new URL(e);
            return us.has(t.protocol) ? t.toString() : void 0
        } catch {
            return
        }
    }
}

function ys(a, e = {}) {
    const t = ft(a);
    if (t) return e.allowDataImage && fs.test(t) || ps.test(t) ? t : pa(t)
}
const gs = 150,
    Ss = 200,
    ht = {
        taskTitle: {
            maxChars: 140,
            maxWords: 20
        },
        taskDescription: {
            maxChars: 2e3,
            maxWords: 320,
            preserveNewlines: !0
        },
        subtaskTitle: {
            maxChars: 140,
            maxWords: 20
        },
        sessionDescription: {
            maxChars: 240,
            maxWords: 40,
            preserveNewlines: !0
        },
        sessionNotes: {
            maxChars: 1500,
            maxWords: 240,
            preserveNewlines: !0
        },
        subjectName: {
            maxChars: 80,
            maxWords: 10
        },
        chapterTitle: {
            maxChars: 120,
            maxWords: 16
        },
        topicTitle: {
            maxChars: 140,
            maxWords: 20
        },
        resourceTitle: {
            maxChars: 160,
            maxWords: 20
        },
        flashcardFace: {
            maxChars: 500,
            maxWords: 80,
            preserveNewlines: !0
        },
        flashcardBack: {
            maxChars: 1500,
            maxWords: 240,
            preserveNewlines: !0
        },
        scratchpad: {
            maxChars: 5e3,
            maxWords: 800,
            preserveNewlines: !0
        },
        chapterNotes: {
            maxChars: 2e3,
            maxWords: 320,
            preserveNewlines: !0
        },
        habitName: {
            maxChars: 80,
            maxWords: 10
        },
        username: {
            maxChars: 32,
            maxWords: 4
        },
        bio: {
            maxChars: 160,
            maxWords: 30,
            preserveNewlines: !0
        },
        institution: {
            maxChars: 120,
            maxWords: 20
        },
        grade: {
            maxChars: 60,
            maxWords: 10
        },
        targetExam: {
            maxChars: 80,
            maxWords: 10
        },
        studyEnvironment: {
            maxChars: 40,
            maxWords: 4
        },
        swotItem: {
            maxChars: 120,
            maxWords: 18
        },
        dailyLogNotes: {
            maxChars: 1500,
            maxWords: 240,
            preserveNewlines: !0
        },
        testTitle: {
            maxChars: 140,
            maxWords: 20
        },
        analysisText: {
            maxChars: 3e3,
            maxWords: 480,
            preserveNewlines: !0
        },
        examTitle: {
            maxChars: 140,
            maxWords: 20
        },
        milestoneTitle: {
            maxChars: 140,
            maxWords: 20
        },
        mockTestName: {
            maxChars: 140,
            maxWords: 20
        },
        mistakeTopic: {
            maxChars: 120,
            maxWords: 18
        },
        mistakeDescription: {
            maxChars: 500,
            maxWords: 80,
            preserveNewlines: !0
        },
        solutionText: {
            maxChars: 1200,
            maxWords: 200,
            preserveNewlines: !0
        },
        takeawayContent: {
            maxChars: 400,
            maxWords: 60,
            preserveNewlines: !0
        },
        groupName: {
            maxChars: 80,
            maxWords: 10
        },
        groupDescription: {
            maxChars: 500,
            maxWords: 80,
            preserveNewlines: !0
        },
        discussionTitle: {
            maxChars: 160,
            maxWords: 24
        },
        discussionContent: {
            maxChars: 3e3,
            maxWords: 480,
            preserveNewlines: !0
        },
        discussionTag: {
            maxChars: 24,
            maxWords: 3
        },
        chatMessage: {
            maxChars: 300,
            maxWords: 50
        },
        challengeTitle: {
            maxChars: 120,
            maxWords: 16
        },
        challengeDescription: {
            maxChars: 500,
            maxWords: 80,
            preserveNewlines: !0
        },
        announcementContent: {
            maxChars: 1e3,
            maxWords: 160,
            preserveNewlines: !0
        }
    },
    bs = /[\u200B-\u200D\u2060\uFEFF]/g,
    _s = /<(script|style)[^>]*>[\s\S]*?<\/\1>/gi,
    As = /<\/?[^>]+>/g,
    ks = ["ass", "asshole", "arse", "arsehole", "bastard", "bitch", "bitches", "bollocks", "bullshit", "cock", "cocksucker", "crap", "cunt", "damn", "dick", "dildo", "fag", "faggot", "fuck", "fucker", "fucking", "fuckoff", "fuckface", "goddamn", "jackass", "jerkoff", "motherfucker", "mf", "piss", "pissed", "pissing", "prick", "pussy", "retard", "retarded", "shit", "shithead", "shitty", "slut", "twat", "whore", "nigger", "nigga", "chink", "spic", "kike", "madarchod", "mc", "bhenchod", "bc", "behenchod", "bhosdike", "bsdk", "chutiya", "chut", "chutiyapa", "gaand", "gaandmar", "gaandmara", "lund", "randi", "harami", "kutta", "kutti", "saala", "saali", "bakchod", "bakchodi", "jhantu", "lavde", "lawde", "loda", "lodu", "tatti", "f*ck", "f**k", "fu*k", "sh*t", "s**t", "b!tch", "biatch", "a$$", "a$$hole", "d!ck", "c*nt", "mfk", "mfs", "wtf", "stfu", "cum", "cumming", "jerk", "jerking", "porn", "pornhub", "sex", "sexy", "idiot", "stupid", "dumb", "loser", "trash"],
    ws = new RegExp(`\\b(?:${ks.map(a=>a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")})\\b`, "i");

function Is(a) {
    const e = typeof a.normalize == "function" ? a.normalize("NFKC") : a;
    return Array.from(e, s => {
        const r = s.charCodeAt(0),
            i = r >= 0 && r <= 8 || r === 11 || r === 12 || r >= 14 && r <= 31,
            n = r >= 127 && r <= 159;
        return i || n ? " " : s
    }).join("").replace(/\r\n?/g, `
`).replace(bs, "").replace(_s, " ").replace(As, " ")
}

function vs(a, e) {
    return e ? a.split(`
`).map(t => t.replace(/[^\S\n]+/g, " ").trim()).join(`
`).replace(/\n{3,}/g, `

`).trim() : a.replace(/\s+/g, " ").trim()
}

function Es(a, e) {
    if (!e || e <= 0) return a;
    const t = Array.from(a.matchAll(/\S+/g));
    if (t.length <= e) return a;
    const s = t[e] ?.index ?? a.length;
    return a.slice(0, s).trim()
}

function Ts(a, e) {
    return a.length <= e ? a : a.slice(0, e).trim()
}

function yt(a, e = "local") {
    const t = ht[a];
    return e === "local" ? t.maxChars : Math.min(t.cloudMaxChars ?? Ss, t.maxChars)
}

function Cs(a) {
    const e = ht[a];
    return Math.min(e.warningChars ?? gs, yt(a, "cloud"))
}

function vn(a, e) {
    if (typeof a != "string") return null;
    const t = a.length,
        s = Cs(e),
        r = yt(e, "cloud");
    return t > r ? {
        tone: "danger",
        message: `Saved locally in full. Only the first ${r} characters sync to cloud.`
    } : t >= s ? {
        tone: "warning",
        message: `${t}/${r} characters used for cloud sync.`
    } : null
}

function p(a, e, t = "local") {
    if (typeof a != "string") return;
    const s = ht[e],
        r = vs(Is(a), !!s.preserveNewlines);
    if (!r) return;
    const i = Es(r, s.maxWords);
    return Ts(i, yt(e, t)) || void 0
}

function Ps(a) {
    return typeof a != "string" ? !1 : ws.test(a)
}

function Ut(a, e) {
    if (a && Ps(a)) throw new Error(`${e} contains language that is not allowed in community spaces.`)
}

function gt(a) {
    return { ...a,
        title: p(a.title, "taskTitle") || "Untitled Task",
        subject: p(a.subject, "subjectName") || "General",
        description: p(a.description, "taskDescription"),
        subtasks: Array.isArray(a.subtasks) ? a.subtasks.slice(0, 100).map(e => ({ ...e,
            title: p(e.title, "subtaskTitle") || "Untitled Subtask"
        })) : []
    }
}

function ot(a) {
    return Array.isArray(a) ? a.slice(0, 50).map(e => ({ ...e,
        title: p(e.title, "resourceTitle") || "Untitled Resource",
        link: hs(e.link)
    })) : []
}

function St(a) {
    return { ...a,
        name: p(a.name, "subjectName") || "Untitled Subject",
        examName: p(a.examName, "examTitle"),
        chapters: Array.isArray(a.chapters) ? a.chapters.slice(0, 200).map(e => ({ ...e,
            title: p(e.title, "chapterTitle") || "Untitled Chapter",
            metadata: e.metadata ? { ...e.metadata,
                notes: p(e.metadata.notes, "chapterNotes"),
                tags: Array.isArray(e.metadata.tags) ? e.metadata.tags.map(t => p(t, "discussionTag")).filter(t => !!t).slice(0, 20) : void 0,
                resources: ot(e.metadata.resources)
            } : void 0,
            topics: Array.isArray(e.topics) ? e.topics.slice(0, 500).map(t => ({ ...t,
                title: p(t.title, "topicTitle") || "Untitled Topic",
                scratchpad: p(t.scratchpad, "scratchpad"),
                resources: ot(t.resources),
                flashcards: Array.isArray(t.flashcards) ? t.flashcards.slice(0, 300).map(s => ({ ...s,
                    front: p(s.front, "flashcardFace") || "Untitled Card",
                    back: p(s.back, "flashcardBack") || ""
                })) : void 0
            })) : []
        })) : []
    }
}

function fa(a) {
    const e = St(a);
    return { ...e,
        name: p(a.name, "subjectName", "cloud") || "Untitled Subject",
        examName: p(a.examName, "examTitle", "cloud"),
        chapters: Array.isArray(e.chapters) ? e.chapters.map(t => ({ ...t,
            title: p(t.title, "chapterTitle", "cloud") || "Untitled Chapter",
            metadata: t.metadata ? { ...t.metadata,
                notes: p(t.metadata.notes, "chapterNotes", "cloud"),
                tags: Array.isArray(t.metadata.tags) ? t.metadata.tags.map(s => p(s, "discussionTag", "cloud")).filter(s => !!s).slice(0, 20) : void 0
            } : void 0,
            topics: Array.isArray(t.topics) ? t.topics.map(s => ({ ...s,
                title: p(s.title, "topicTitle", "cloud") || "Untitled Topic",
                scratchpad: p(s.scratchpad, "scratchpad", "cloud"),
                resources: ot(s.resources).map(r => ({ ...r,
                    title: p(r.title, "resourceTitle", "cloud") || "Untitled Resource"
                })),
                flashcards: Array.isArray(s.flashcards) ? s.flashcards.map(r => ({ ...r,
                    front: p(r.front, "flashcardFace", "cloud") || "Untitled Card",
                    back: p(r.back, "flashcardBack", "cloud") || ""
                })) : void 0
            })) : []
        })) : []
    }
}

function Ms(a) {
    return { ...gt(a),
        title: p(a.title, "taskTitle", "cloud") || "Untitled Task",
        subject: p(a.subject, "subjectName", "cloud") || "General",
        description: p(a.description, "taskDescription", "cloud"),
        subtasks: Array.isArray(a.subtasks) ? a.subtasks.slice(0, 100).map(e => ({ ...e,
            title: p(e.title, "subtaskTitle", "cloud") || "Untitled Subtask"
        })) : []
    }
}

function bt(a) {
    return { ...a,
        subject: p(a.subject, "subjectName"),
        topic: p(a.topic, "topicTitle") || "General",
        sessionType: p(a.sessionType, "subjectName"),
        description: p(a.description, "sessionDescription"),
        notes: p(a.notes, "sessionNotes"),
        pauseLogs: Array.isArray(a.pauseLogs) ? a.pauseLogs.slice(0, 200).map(e => ({ ...e,
            reason: p(e.reason, "sessionDescription") || "Paused"
        })) : []
    }
}

function xs(a) {
    return { ...bt(a),
        subject: p(a.subject, "subjectName", "cloud"),
        topic: p(a.topic, "topicTitle", "cloud") || "General",
        sessionType: p(a.sessionType, "subjectName", "cloud"),
        description: p(a.description, "sessionDescription", "cloud"),
        notes: p(a.notes, "sessionNotes", "cloud"),
        pauseLogs: Array.isArray(a.pauseLogs) ? a.pauseLogs.slice(0, 200).map(e => ({ ...e,
            reason: p(e.reason, "sessionDescription", "cloud") || "Paused"
        })) : []
    }
}

function ha(a) {
    return { ...a,
        name: p(a.name, "habitName") || "Untitled Habit",
        icon: p(a.icon, "discussionTag") || a.icon
    }
}

function _t(a) {
    return { ...a,
        notes: p(a.notes, "dailyLogNotes")
    }
}

function Ds(a) {
    return { ..._t(a),
        notes: p(a.notes, "dailyLogNotes", "cloud")
    }
}

function At(a) {
    return { ...a,
        title: p(a.title, "testTitle") || "Untitled Test",
        analysis: p(a.analysis, "analysisText"),
        subjects: Array.isArray(a.subjects) ? a.subjects.slice(0, 50).map(e => ({ ...e,
            subjectName: p(e.subjectName, "subjectName") || "Subject"
        })) : [],
        mistakes: Array.isArray(a.mistakes) ? a.mistakes.slice(0, 500).map(e => ({ ...e,
            topicId: e.topicId
        })) : []
    }
}

function Os(a) {
    return { ...At(a),
        title: p(a.title, "testTitle", "cloud") || "Untitled Test",
        analysis: p(a.analysis, "analysisText", "cloud"),
        subjects: Array.isArray(a.subjects) ? a.subjects.slice(0, 50).map(e => ({ ...e,
            subjectName: p(e.subjectName, "subjectName", "cloud") || "Subject"
        })) : []
    }
}

function kt(a) {
    return { ...a,
        title: p(a.title, "examTitle") || "Untitled Exam",
        milestones: Array.isArray(a.milestones) ? a.milestones.slice(0, 200).map(e => ({ ...e,
            title: p(e.title, "milestoneTitle") || "Milestone"
        })) : a.milestones,
        revisionSchedule: Array.isArray(a.revisionSchedule) ? a.revisionSchedule.slice(0, 500).map(e => ({ ...e,
            chapterTitle: p(e.chapterTitle, "chapterTitle"),
            notes: p(e.notes, "chapterNotes")
        })) : a.revisionSchedule,
        result: a.result ? { ...a.result,
            subjectResults: Array.isArray(a.result.subjectResults) ? a.result.subjectResults.slice(0, 100).map(e => ({ ...e,
                subjectName: p(e.subjectName, "subjectName") || "Subject",
                chapterResults: Array.isArray(e.chapterResults) ? e.chapterResults.slice(0, 300).map(t => ({ ...t,
                    chapterTitle: p(t.chapterTitle, "chapterTitle") || "Chapter"
                })) : e.chapterResults
            })) : []
        } : a.result,
        analysis: a.analysis ? { ...a.analysis,
            strengths: Array.isArray(a.analysis.strengths) ? a.analysis.strengths.map(e => p(e, "swotItem")).filter(e => !!e).slice(0, 50) : [],
            weaknesses: Array.isArray(a.analysis.weaknesses) ? a.analysis.weaknesses.map(e => p(e, "swotItem")).filter(e => !!e).slice(0, 50) : [],
            improvementAreas: Array.isArray(a.analysis.improvementAreas) ? a.analysis.improvementAreas.map(e => p(e, "swotItem")).filter(e => !!e).slice(0, 50) : [],
            notes: p(a.analysis.notes, "analysisText") || ""
        } : a.analysis
    }
}

function Ls(a) {
    const e = kt(a);
    return { ...e,
        title: p(a.title, "examTitle", "cloud") || "Untitled Exam",
        milestones: Array.isArray(e.milestones) ? e.milestones.map(t => ({ ...t,
            title: p(t.title, "milestoneTitle", "cloud") || "Milestone"
        })) : e.milestones,
        revisionSchedule: Array.isArray(e.revisionSchedule) ? e.revisionSchedule.map(t => ({ ...t,
            chapterTitle: p(t.chapterTitle, "chapterTitle", "cloud"),
            notes: p(t.notes, "chapterNotes", "cloud")
        })) : e.revisionSchedule,
        analysis: e.analysis ? { ...e.analysis,
            notes: p(e.analysis.notes, "analysisText", "cloud") || ""
        } : e.analysis
    }
}

function wt(a) {
    return { ...a,
        name: p(a.name, "mockTestName") || "Untitled Mock Test",
        categories: Array.isArray(a.categories) ? a.categories.map(e => p(e, "discussionTag")).filter(e => !!e).slice(0, 20) : void 0,
        paperUrl: pa(a.paperUrl),
        notes: p(a.notes, "analysisText"),
        subjectPerformance: Array.isArray(a.subjectPerformance) ? a.subjectPerformance.slice(0, 100).map(e => ({ ...e,
            subjectName: p(e.subjectName, "subjectName") || "Subject"
        })) : [],
        mistakes: Array.isArray(a.mistakes) ? a.mistakes.slice(0, 500).map(e => ({ ...e,
            subject: p(e.subject, "subjectName") || "Subject",
            topic: p(e.topic, "mistakeTopic") || "Topic",
            description: p(e.description, "mistakeDescription") || "",
            solution: p(e.solution, "solutionText") || ""
        })) : [],
        takeaways: Array.isArray(a.takeaways) ? a.takeaways.slice(0, 300).map(e => ({ ...e,
            content: p(e.content, "takeawayContent") || ""
        })) : []
    }
}

function Rs(a) {
    const e = wt(a);
    return { ...e,
        name: p(a.name, "mockTestName", "cloud") || "Untitled Mock Test",
        notes: p(a.notes, "analysisText", "cloud"),
        subjectPerformance: Array.isArray(e.subjectPerformance) ? e.subjectPerformance.map(t => ({ ...t,
            subjectName: p(t.subjectName, "subjectName", "cloud") || "Subject"
        })) : [],
        mistakes: Array.isArray(e.mistakes) ? e.mistakes.map(t => ({ ...t,
            subject: p(t.subject, "subjectName", "cloud") || "Subject",
            topic: p(t.topic, "mistakeTopic", "cloud") || "Topic",
            description: p(t.description, "mistakeDescription", "cloud") || "",
            solution: p(t.solution, "solutionText", "cloud") || ""
        })) : [],
        takeaways: Array.isArray(e.takeaways) ? e.takeaways.map(t => ({ ...t,
            content: p(t.content, "takeawayContent", "cloud") || ""
        })) : []
    }
}

function Ye(a) {
    const e = p(a.name, "username"),
        s = p(a.username, "username") || e || "";
    return { ...a,
        name: s,
        username: s || void 0,
        avatar: ys(a.avatar, {
            allowDataImage: !0
        }),
        bio: p(a.bio, "bio"),
        swot: {
            strengths: a.swot ?.strengths ?.map(r => p(r, "swotItem")).filter(r => !!r).slice(0, 20) || [],
            weaknesses: a.swot ?.weaknesses ?.map(r => p(r, "swotItem")).filter(r => !!r).slice(0, 20) || [],
            opportunities: a.swot ?.opportunities ?.map(r => p(r, "swotItem")).filter(r => !!r).slice(0, 20) || [],
            threats: a.swot ?.threats ?.map(r => p(r, "swotItem")).filter(r => !!r).slice(0, 20) || []
        },
        academic: a.academic ? { ...a.academic,
            institution: p(a.academic.institution, "institution") || "",
            grade: p(a.academic.grade, "grade") || "",
            targetExams: Array.isArray(a.academic.targetExams) ? a.academic.targetExams.map(r => p(r, "targetExam")).filter(r => !!r).slice(0, 20) : [],
            primarySubjects: Array.isArray(a.academic.primarySubjects) ? a.academic.primarySubjects.map(r => p(r, "subjectName")).filter(r => !!r).slice(0, 30) : []
        } : a.academic,
        workflowPreferences: a.workflowPreferences ? { ...a.workflowPreferences,
            studyEnvironment: Array.isArray(a.workflowPreferences.studyEnvironment) ? a.workflowPreferences.studyEnvironment.map(r => p(r, "studyEnvironment")).filter(r => !!r).slice(0, 12) : []
        } : a.workflowPreferences,
        communityPreferences: a.communityPreferences ? { ...a.communityPreferences,
            communitySubjects: Array.isArray(a.communityPreferences.communitySubjects) ? a.communityPreferences.communitySubjects.map(r => p(r, "subjectName")).filter(r => !!r).slice(0, 30) : []
        } : a.communityPreferences
    }
}

function Ns(a) {
    const e = Ye(a),
        t = p(e.name, "username", "cloud"),
        r = p(e.username, "username", "cloud") || t || "";
    return { ...e,
        name: r,
        username: r || void 0,
        bio: p(a.bio, "bio", "cloud"),
        academic: e.academic ? { ...e.academic,
            institution: p(e.academic.institution, "institution", "cloud") || "",
            grade: p(e.academic.grade, "grade", "cloud") || "",
            targetExams: Array.isArray(e.academic.targetExams) ? e.academic.targetExams.map(i => p(i, "targetExam", "cloud") || "").filter(Boolean) : [],
            primarySubjects: Array.isArray(e.academic.primarySubjects) ? e.academic.primarySubjects.map(i => p(i, "subjectName", "cloud") || "").filter(Boolean) : []
        } : e.academic,
        workflowPreferences: e.workflowPreferences ? { ...e.workflowPreferences,
            studyEnvironment: Array.isArray(e.workflowPreferences.studyEnvironment) ? e.workflowPreferences.studyEnvironment.map(i => p(i, "studyEnvironment", "cloud") || "").filter(Boolean) : []
        } : e.workflowPreferences,
        communityPreferences: e.communityPreferences ? { ...e.communityPreferences,
            communitySubjects: Array.isArray(e.communityPreferences.communitySubjects) ? e.communityPreferences.communitySubjects.map(i => p(i, "subjectName", "cloud") || "").filter(Boolean) : []
        } : e.communityPreferences
    }
}

function De(a, e, t = "local") {
    switch (a) {
        case l.TASKS:
        case "tasks":
            return t === "cloud" ? Ms(e) : gt(e);
        case l.SESSIONS:
        case "focus_sessions":
            return t === "cloud" ? xs(e) : bt(e);
        case l.SUBJECTS:
        case "subjects":
            return t === "cloud" ? fa(e) : St(e);
        case l.HABITS:
        case "habits":
            return ha(e);
        case l.DAILY_LOGS:
        case "daily_logs":
            return t === "cloud" ? Ds(e) : _t(e);
        case l.TESTS:
        case "tests":
            return t === "cloud" ? Os(e) : At(e);
        case l.EXAMS:
        case "exams":
            return t === "cloud" ? Ls(e) : kt(e);
        case l.MOCK_TESTS:
        case "mock_tests":
            return t === "cloud" ? Rs(e) : wt(e);
        default:
            return e
    }
}

function js(a) {
    const e = Ye({
        name: a.name || "",
        swot: {
            strengths: a.swot ?.strengths || [],
            weaknesses: a.swot ?.weaknesses || [],
            opportunities: a.swot ?.opportunities || [],
            threats: a.swot ?.threats || []
        },
        settings: a.settings || {
            theme: "system",
            notifications: !0
        },
        focusSettings: a.focusSettings || {
            defaultDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            autoStartBreaks: !1,
            dailyGoalMinutes: 240,
            notificationSound: !0,
            sessionEndSound: !0,
            pomodorosUntilLongBreak: 4
        },
        createdAt: a.createdAt || new Date(0).toISOString(),
        updatedAt: a.updatedAt || new Date(0).toISOString(),
        isOnboarded: a.isOnboarded ?? !1,
        currentOnboardingStep: a.currentOnboardingStep ?? 1,
        username: a.username,
        avatar: a.avatar,
        bio: a.bio,
        academic: a.academic,
        studyPreferences: a.studyPreferences,
        workflowPreferences: a.workflowPreferences,
        communityPreferences: a.communityPreferences,
        personalization: a.personalization
    });
    a.username !== void 0 && Ut(e.username, "Username"), a.bio !== void 0 && Ut(e.bio, "Bio");
    const t = { ...a
    };
    return a.name !== void 0 && (t.name = e.name, a.username === void 0 && (t.username = e.name || void 0)), a.username !== void 0 && (t.username = e.username), a.avatar !== void 0 && (t.avatar = e.avatar), a.bio !== void 0 && (t.bio = e.bio), a.academic !== void 0 && (t.academic = e.academic), a.workflowPreferences !== void 0 && (t.workflowPreferences = e.workflowPreferences), a.communityPreferences !== void 0 && (t.communityPreferences = e.communityPreferences), a.swot !== void 0 && (t.swot = e.swot), t
}
const Ft = "2",
    q = () => typeof globalThis > "u" || typeof globalThis.localStorage > "u" ? !1 : typeof globalThis.localStorage.getItem == "function" && typeof globalThis.localStorage.setItem == "function" && typeof globalThis.localStorage.removeItem == "function",
    ya = (a, e) => a ? `${a}${e}` : e,
    Bs = a => typeof DOMException < "u" && a instanceof DOMException && (a.name === "QuotaExceededError" || a.name === "NS_ERROR_DOM_QUOTA_REACHED") ? !0 : a instanceof Error && (a.name === "QuotaExceededError" || a.name === "NS_ERROR_DOM_QUOTA_REACHED" || /quota/i.test(a.message));
class It {
    constructor(e = "") {
        this.keyPrefix = e
    }
    resolveKey(e) {
        return ya(this.keyPrefix, e)
    }
    getItem(e) {
        if (!q()) return null;
        const t = localStorage.getItem(this.resolveKey(e));
        if (t === null) return null;
        try {
            return JSON.parse(t)
        } catch {
            return t
        }
    }
    setItem(e, t) {
        q() && localStorage.setItem(this.resolveKey(e), JSON.stringify(t))
    }
    removeItem(e) {
        q() && localStorage.removeItem(this.resolveKey(e))
    }
    getAllKeys() {
        if (!q()) return [];
        const e = [];
        for (let t = 0; t < localStorage.length; t += 1) {
            const s = localStorage.key(t);
            s && (!this.keyPrefix || s.startsWith(this.keyPrefix)) && e.push(this.keyPrefix ? s.slice(this.keyPrefix.length) : s)
        }
        return e
    }
    clear() {
        if (q())
            for (const e of this.getAllKeys()) localStorage.removeItem(this.resolveKey(e))
    }
}
class Us {
    constructor(e = {}) {
        this.keyPrefix = e.keyPrefix ?? "", this.runMigration = e.runMigration ?? this.keyPrefix.length === 0, this.runMigration && this.migrateIfNeeded()
    }
    getStorageKey(e) {
        return ya(this.keyPrefix, e)
    }
    migrateIfNeeded() {
        localStorage.getItem(this.getStorageKey(l.SCHEMA_VERSION)) !== Ft && (this.migrateFromV1(), localStorage.setItem(this.getStorageKey(l.SCHEMA_VERSION), Ft))
    }
    migrateFromV1() {
        const e = ["isotope_tasks", "isotope_sessions", "isotope_subjects", "isotope_habits", "isotope_user_profile", "isotope_daily_logs"],
            t = [l.TASKS, l.SESSIONS, l.SUBJECTS, l.HABITS, l.USER_PROFILE, l.DAILY_LOGS];
        e.forEach((s, r) => {
            const i = localStorage.getItem(s),
                n = t[r];
            if (i && !localStorage.getItem(this.getStorageKey(n))) try {
                const o = JSON.parse(i);
                if (Array.isArray(o)) {
                    const c = o.map(d => (n === l.DAILY_LOGS && !d.id && d.date && (d.id = `log-${d.date}`), { ...d,
                        deletedAt: d.deletedAt ?? null,
                        updatedAt: d.updatedAt ?? d.createdAt ?? L(),
                        createdAt: d.createdAt ?? L()
                    }));
                    localStorage.setItem(this.getStorageKey(n), JSON.stringify(c))
                } else localStorage.setItem(this.getStorageKey(n), i)
            } catch {}
        })
    }
    async getItem(e, t) {
        return (await this.listItems(e)).find(r => r.id === t) || null
    }
    async listItems(e) {
        if (!q()) return [];
        try {
            const t = localStorage.getItem(this.getStorageKey(e));
            return t ? JSON.parse(t) : []
        } catch (t) {
            return console.error(`Failed to parse data for key ${e}:`, t), []
        }
    }
    async upsertItem(e, t, s) {
        if (!q()) return;
        const r = await this.listItems(e),
            i = r.findIndex(c => c.id === t.id),
            n = { ...t,
                updatedAt: L(),
                createdAt: t.createdAt || L()
            },
            o = De(e, n);
        i !== -1 ? r[i] = { ...r[i],
            ...o
        } : r.push(o), localStorage.setItem(this.getStorageKey(e), JSON.stringify(r))
    }
    async softDeleteItem(e, t, s) {
        if (!q()) return;
        const r = await this.listItems(e),
            i = r.findIndex(n => n.id === t);
        i !== -1 && (r[i] = { ...r[i],
            deletedAt: L(),
            updatedAt: L()
        }, localStorage.setItem(this.getStorageKey(e), JSON.stringify(r)))
    }
    async getLastSync(e) {
        if (!q()) return null;
        try {
            return JSON.parse(localStorage.getItem(this.getStorageKey(l.SYNC_METADATA)) || "{}")[e] || null
        } catch {
            return null
        }
    }
    async setLastSync(e, t) {
        if (q()) try {
            const s = JSON.parse(localStorage.getItem(this.getStorageKey(l.SYNC_METADATA)) || "{}");
            s[e] = t, localStorage.setItem(this.getStorageKey(l.SYNC_METADATA), JSON.stringify(s))
        } catch {}
    }
    async getTasks(e) {
        const t = await this.listItems(l.TASKS);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveTask(e, t) {
        await this.upsertItem(l.TASKS, e, t)
    }
    async updateTask(e, t, s) {
        const r = await this.getItem(l.TASKS, e);
        r && await this.upsertItem(l.TASKS, { ...r,
            ...t
        }, s)
    }
    async deleteTask(e, t) {
        if (!q()) return;
        const r = (await this.listItems(l.TASKS)).filter(i => i.id !== e);
        localStorage.setItem(this.getStorageKey(l.TASKS), JSON.stringify(r))
    }
    async softDeleteTask(e, t) {
        await this.softDeleteItem(l.TASKS, e, t)
    }
    async getSessions(e) {
        const t = await this.listItems(l.SESSIONS);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveSession(e, t) {
        await this.upsertItem(l.SESSIONS, e, t)
    }
    async updateSession(e, t, s) {
        const r = await this.getItem(l.SESSIONS, e);
        r && await this.upsertItem(l.SESSIONS, { ...r,
            ...t
        }, s)
    }
    async deleteSession(e, t) {
        if (!q()) return;
        const r = (await this.listItems(l.SESSIONS)).filter(i => i.id !== e);
        localStorage.setItem(this.getStorageKey(l.SESSIONS), JSON.stringify(r))
    }
    async softDeleteSession(e, t) {
        await this.softDeleteItem(l.SESSIONS, e, t)
    }
    async getSubjects(e) {
        const t = await this.listItems(l.SUBJECTS);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveSubject(e, t) {
        await this.upsertItem(l.SUBJECTS, e, t)
    }
    async updateSubject(e, t, s) {
        const r = await this.getItem(l.SUBJECTS, e);
        r && await this.upsertItem(l.SUBJECTS, { ...r,
            ...t
        }, s)
    }
    async deleteSubject(e, t) {
        await this.softDeleteItem(l.SUBJECTS, e, t)
    }
    async getHabits(e) {
        const t = await this.listItems(l.HABITS);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveHabit(e, t) {
        await this.upsertItem(l.HABITS, e, t)
    }
    async updateHabit(e, t, s) {
        const r = await this.getItem(l.HABITS, e);
        r && await this.upsertItem(l.HABITS, { ...r,
            ...t
        }, s)
    }
    async deleteHabit(e, t) {
        await this.softDeleteItem(l.HABITS, e, t)
    }
    async getUserProfile() {
        if (!q()) return null;
        try {
            const e = localStorage.getItem(this.getStorageKey(l.USER_PROFILE));
            return e ? pe(JSON.parse(e)) : null
        } catch {
            return null
        }
    }
    async saveUserProfile(e, t) {
        if (!q()) return;
        const s = pe({ ...Ye(e),
            updatedAt: L(),
            createdAt: e.createdAt || L()
        });
        localStorage.setItem(this.getStorageKey(l.USER_PROFILE), JSON.stringify(s))
    }
    async getTimerState() {
        if (!q()) return null;
        try {
            const e = localStorage.getItem(this.getStorageKey(l.TIMER_STATE));
            return e ? JSON.parse(e) : null
        } catch {
            return null
        }
    }
    async saveTimerState(e, t) {
        if (!q()) return;
        const s = { ...e,
            lastPersistedAt: L()
        };
        localStorage.setItem(this.getStorageKey(l.TIMER_STATE), JSON.stringify(s))
    }
    async clearTimerState() {
        q() && localStorage.removeItem(this.getStorageKey(l.TIMER_STATE))
    }
    async getDailyLogs(e) {
        const t = await this.listItems(l.DAILY_LOGS);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveDailyLog(e, t) {
        const s = { ...e,
            id: e.id || `log-${e.date}`
        };
        await this.upsertItem(l.DAILY_LOGS, s, t)
    }
    async softDeleteDailyLog(e, t) {
        await this.softDeleteItem(l.DAILY_LOGS, e, t)
    }
    async getTests(e) {
        const t = await this.listItems(l.TESTS);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveTest(e, t) {
        await this.upsertItem(l.TESTS, e, t)
    }
    async deleteTest(e, t) {
        if (!q()) return;
        const r = (await this.listItems(l.TESTS)).filter(i => i.id !== e);
        localStorage.setItem(this.getStorageKey(l.TESTS), JSON.stringify(r))
    }
    async softDeleteTest(e, t) {
        await this.softDeleteItem(l.TESTS, e, t)
    }
    async getExams(e) {
        const t = await this.listItems(l.EXAMS);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveExam(e, t) {
        await this.upsertItem(l.EXAMS, e, t)
    }
    async deleteExam(e, t) {
        if (!q()) return;
        const r = (await this.listItems(l.EXAMS)).filter(i => i.id !== e);
        localStorage.setItem(this.getStorageKey(l.EXAMS), JSON.stringify(r))
    }
    async softDeleteExam(e, t) {
        await this.softDeleteItem(l.EXAMS, e, t)
    }
    async getMockTests(e) {
        const t = await this.listItems(l.MOCK_TESTS);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveMockTest(e, t) {
        await this.upsertItem(l.MOCK_TESTS, e, t)
    }
    async updateMockTest(e, t, s) {
        const r = await this.getItem(l.MOCK_TESTS, e);
        r && await this.upsertItem(l.MOCK_TESTS, { ...r,
            ...t,
            updatedAt: L()
        }, s)
    }
    async deleteMockTest(e, t) {
        if (!q()) return;
        const r = (await this.listItems(l.MOCK_TESTS)).filter(i => i.id !== e);
        localStorage.setItem(this.getStorageKey(l.MOCK_TESTS), JSON.stringify(r))
    }
    async softDeleteMockTest(e, t) {
        await this.softDeleteItem(l.MOCK_TESTS, e, t)
    }
    async clearAll() {
        q() && Object.values(l).forEach(e => localStorage.removeItem(this.getStorageKey(e)))
    }
}
const zt = "isotope_main",
    vt = {
        tasks: {
            keyPath: "id",
            indexes: [{
                name: "status",
                keyPath: "status"
            }, {
                name: "dueDate",
                keyPath: "dueDate"
            }, {
                name: "subjectId",
                keyPath: "subjectId"
            }, {
                name: "deletedAt",
                keyPath: "deletedAt"
            }, {
                name: "updatedAt",
                keyPath: "updatedAt"
            }]
        },
        subjects: {
            keyPath: "id",
            indexes: [{
                name: "deletedAt",
                keyPath: "deletedAt"
            }, {
                name: "updatedAt",
                keyPath: "updatedAt"
            }]
        },
        sessions: {
            keyPath: "id",
            indexes: [{
                name: "startTime",
                keyPath: "startTime"
            }, {
                name: "subjectIds",
                keyPath: "subjectIds",
                options: {
                    multiEntry: !0
                }
            }, {
                name: "deletedAt",
                keyPath: "deletedAt"
            }, {
                name: "updatedAt",
                keyPath: "updatedAt"
            }]
        },
        habits: {
            keyPath: "id",
            indexes: [{
                name: "deletedAt",
                keyPath: "deletedAt"
            }, {
                name: "updatedAt",
                keyPath: "updatedAt"
            }]
        },
        tests: {
            keyPath: "id",
            indexes: [{
                name: "subjectId",
                keyPath: "subjectId"
            }, {
                name: "date",
                keyPath: "date"
            }, {
                name: "deletedAt",
                keyPath: "deletedAt"
            }, {
                name: "updatedAt",
                keyPath: "updatedAt"
            }]
        },
        exams: {
            keyPath: "id",
            indexes: [{
                name: "targetDate",
                keyPath: "targetDate"
            }, {
                name: "deletedAt",
                keyPath: "deletedAt"
            }, {
                name: "updatedAt",
                keyPath: "updatedAt"
            }]
        },
        mockTests: {
            keyPath: "id",
            indexes: [{
                name: "examId",
                keyPath: "examId"
            }, {
                name: "date",
                keyPath: "date"
            }, {
                name: "deletedAt",
                keyPath: "deletedAt"
            }, {
                name: "updatedAt",
                keyPath: "updatedAt"
            }]
        },
        dailyLogs: {
            keyPath: "id",
            indexes: [{
                name: "date",
                keyPath: "date"
            }, {
                name: "deletedAt",
                keyPath: "deletedAt"
            }, {
                name: "updatedAt",
                keyPath: "updatedAt"
            }]
        },
        userProfile: {
            keyPath: "id"
        },
        timerState: {
            keyPath: "id"
        },
        syncMetadata: {
            keyPath: "collection"
        },
        migrationMeta: {
            keyPath: "key"
        },
        kv: {
            keyPath: "key"
        }
    },
    ga = () => typeof window < "u" && typeof window.indexedDB < "u",
    Be = a => new Promise((e, t) => {
        a.onsuccess = () => e(a.result), a.onerror = () => t(a.error ?? new Error("IndexedDB request failed"))
    }),
    oe = a => new Promise((e, t) => {
        a.oncomplete = () => e(), a.onerror = () => t(a.error ?? new Error("IndexedDB transaction failed")), a.onabort = () => t(a.error ?? new Error("IndexedDB transaction aborted"))
    });
let ue = null,
    ae = null,
    ct = 0;
const Fs = 5e3,
    zs = a => {
        const e = a.result,
            t = a.transaction;
        if (t)
            for (const [s, r] of Object.entries(vt)) {
                let i;
                e.objectStoreNames.contains(s) ? i = t.objectStore(s) : i = e.createObjectStore(s, {
                    keyPath: r.keyPath
                });
                for (const n of r.indexes ?? []) i.indexNames.contains(n.name) || i.createIndex(n.name, n.keyPath, n.options)
            }
    },
    qt = a => new Promise((e, t) => {
        const s = a ? window.indexedDB.open(zt, a) : window.indexedDB.open(zt);
        s.onupgradeneeded = () => zs(s), s.onsuccess = () => e(s.result), s.onerror = () => t(s.error ?? new Error("Failed to open IndexedDB")), s.onblocked = () => t(new Error("IndexedDB open request blocked"))
    }),
    Gt = a => Object.keys(vt).every(e => a.objectStoreNames.contains(e)),
    qs = async () => {
        const a = await qt();
        if (Gt(a)) return a;
        const e = a.version + 1;
        a.close();
        const t = await qt(e);
        if (!Gt(t)) throw t.close(), new Error("IndexedDB schema initialization failed");
        return t
    },
    Ht = () => {
        if (!ae || ae.version === void 0) return !1;
        const a = Date.now();
        if (a - ct > Fs) {
            ct = a;
            try {
                return ae.transaction("kv", "readonly").abort(), !0
            } catch {
                return !1
            }
        }
        return !0
    },
    ee = async () => {
        if (!ga()) throw new Error("IndexedDB is not available in this environment");
        return ae && Ht() && ue ? ae : (ae && !Ht() && (ue = null, ae = null), ue || (ue = qs().then(a => (ae = a, ct = Date.now(), a.onclose = () => {
            ue = null, ae = null
        }, a.onversionchange = () => {
            a.close(), ue = null, ae = null
        }, a)).catch(a => {
            throw ue = null, ae = null, a
        })), ue)
    },
    P = {
        async isAvailable() {
            if (!ga()) return !1;
            try {
                return await ee(), !0
            } catch {
                return !1
            }
        },
        async get(a, e) {
            const s = (await ee()).transaction(a, "readonly"),
                r = s.objectStore(a),
                i = await Be(r.get(e));
            return await oe(s), i ?? null
        },
        async getAll(a) {
            const t = (await ee()).transaction(a, "readonly"),
                s = t.objectStore(a),
                r = await Be(s.getAll());
            return await oe(t), r
        },
        async getAllKeys(a) {
            const t = (await ee()).transaction(a, "readonly"),
                s = t.objectStore(a),
                r = await Be(s.getAllKeys());
            return await oe(t), r.map(i => String(i))
        },
        async put(a, e) {
            const s = (await ee()).transaction(a, "readwrite");
            s.objectStore(a).put(e), await oe(s)
        },
        async bulkPut(a, e) {
            if (e.length === 0) return {
                success: [],
                failures: []
            };
            const s = (await ee()).transaction(a, "readwrite"),
                r = s.objectStore(a),
                i = [],
                n = [];
            for (const o of e) try {
                const c = o ?.id ?? o ?.key ?? "unknown",
                    d = r.put(o);
                d.onsuccess = () => i.push(String(c)), d.onerror = () => {
                    const h = d.error ?? new Error(`Failed to put ${c}`);
                    n.push({
                        key: String(c),
                        error: h
                    })
                }
            } catch (c) {
                const d = o ?.id ?? o ?.key ?? "unknown";
                n.push({
                    key: String(d),
                    error: c instanceof Error ? c : new Error(String(c))
                })
            }
            return await oe(s), n.length > 0 && console.error(`[mainDb] bulkPut failed for ${n.length} items in ${a}:`, n), {
                success: i,
                failures: n
            }
        },
        async delete(a, e) {
            const s = (await ee()).transaction(a, "readwrite");
            s.objectStore(a).delete(e), await oe(s)
        },
        async clear(a) {
            const t = (await ee()).transaction(a, "readwrite");
            t.objectStore(a).clear(), await oe(t)
        },
        async count(a) {
            const t = (await ee()).transaction(a, "readonly"),
                s = await Be(t.objectStore(a).count());
            return await oe(t), s
        },
        async clearAllMainStores() {
            const a = await ee(),
                e = Object.keys(vt),
                t = a.transaction(e, "readwrite");
            for (const s of e) t.objectStore(s).clear();
            await oe(t)
        },
        async runTransaction(a, e, t) {
            const r = (await ee()).transaction(a, e),
                i = await t(r);
            return await oe(r), i
        }
    },
    Gs = {
        indexedDbAvailable: null,
        persistentStorageGranted: null,
        backupModeActive: !1,
        lastIssue: null,
        lastIssueAt: null,
        lastRecoveryAt: null,
        recoveredCollections: []
    };
let fe = Gs;
const lt = new Set,
    Hs = () => {
        lt.forEach(a => a(fe))
    },
    Ne = a => {
        fe = { ...fe,
            ...a
        }, Hs()
    },
    En = () => fe,
    Tn = a => (lt.add(a), a(fe), () => {
        lt.delete(a)
    }),
    V = a => {
        Ne({
            backupModeActive: !0,
            indexedDbAvailable: !1,
            lastIssue: a,
            lastIssueAt: L()
        })
    },
    Y = () => {
        Ne({
            backupModeActive: !1,
            indexedDbAvailable: !0
        })
    },
    Kt = a => {
        const e = fe.recoveredCollections.includes(a) ? fe.recoveredCollections : [...fe.recoveredCollections, a];
        Ne({
            backupModeActive: !1,
            indexedDbAvailable: !0,
            lastRecoveryAt: L(),
            recoveredCollections: e
        })
    },
    Cn = async () => {
        const a = typeof navigator < "u" ? navigator.storage : void 0;
        if (!a ?.persist) return !1;
        try {
            const e = await a.persist();
            return Ne({
                persistentStorageGranted: e
            }), e
        } catch (e) {
            return console.error("[StorageHealth] Failed to request persistent storage:", e), !1
        }
    },
    Pn = async () => {
        const a = await P.isAvailable().catch(() => !1);
        let e = null;
        const t = typeof navigator < "u" ? navigator.storage : void 0;
        if (t ?.persisted) try {
            e = await t.persisted()
        } catch {
            e = null
        }
        Ne({
            indexedDbAvailable: a,
            persistentStorageGranted: e
        })
    },
    Ks = "__isotope_shadow__:",
    Ws = {
        [l.TASKS]: "tasks",
        [l.SESSIONS]: "sessions",
        [l.SUBJECTS]: "subjects",
        [l.HABITS]: "habits",
        [l.DAILY_LOGS]: "dailyLogs",
        [l.TESTS]: "tests",
        [l.EXAMS]: "exams",
        [l.MOCK_TESTS]: "mockTests"
    },
    K = new Us({
        keyPrefix: Ks,
        runMigration: !1
    }),
    Ue = a => pe({ ...Ye(a),
        createdAt: a.createdAt || L(),
        updatedAt: L()
    }),
    $s = (a, e) => {
        const t = new Map;
        for (const s of a) t.set(s.id, s);
        for (const s of e) {
            const r = t.get(s.id);
            if (!r) {
                t.set(s.id, s);
                continue
            }
            const i = new Date(String(r.updatedAt ?? r.createdAt ?? 0)).getTime(),
                n = new Date(String(s.updatedAt ?? s.createdAt ?? 0)).getTime();
            (Number.isNaN(i) || n > i) && t.set(s.id, s)
        }
        return Array.from(t.values())
    };
class Js {
    constructor() {
        this.disabledShadowCollections = new Set
    }
    getStoreFromCollection(e) {
        const t = Ws[e];
        if (!t) throw new Error(`Unsupported collection: ${e}`);
        return t
    }
    async mirrorPrimaryWrite(e, t) {
        if (this.disabledShadowCollections.has(e)) return null;
        try {
            return await t(), null
        } catch (s) {
            return Bs(s) ? (this.disabledShadowCollections.add(e), s) : (console.error("[IndexedDBAdapter] Shadow backup write failed:", s), s)
        }
    }
    async runCollectionRead(e, t) {
        try {
            const s = await P.getAll(t),
                r = await K.listItems(e);
            Y();
            const i = r.length > 0 ? $s(s, r) : s;
            return r.length > 0 && (s.length === 0 || i.length !== s.length) && (await P.bulkPut(t, i), Kt(e)), i
        } catch (s) {
            const r = await K.listItems(e);
            if (r.length > 0) return V(`Recovered ${e} from local backup after IndexedDB failed.`), r;
            throw s
        }
    }
    async runSingletonRead(e, t, s, r) {
        try {
            const i = await e(),
                n = await t();
            Y();
            const o = i && typeof i == "object" ? new Date(String(i.updatedAt ?? i.createdAt ?? 0)).getTime() : Number.NaN,
                c = n && typeof n == "object" ? new Date(String(n.updatedAt ?? n.createdAt ?? 0)).getTime() : Number.NaN;
            return n !== null && (i === null || !Number.isNaN(c) && c > o) ? (await s(n), Kt(r), n) : i
        } catch (i) {
            const n = await t();
            if (n !== null) return V(`Recovered ${r} from local backup after IndexedDB failed.`), n;
            throw i
        }
    }
    async putWithShadow(e, t, s, r) {
        let i = !1,
            n = null;
        try {
            await P.put(t, s), i = !0, Y()
        } catch (c) {
            n = c, V("IndexedDB is unavailable, saving data to local backup.")
        }
        const o = await this.mirrorPrimaryWrite(e, r);
        if (!i && o) throw n instanceof Error ? n : o
    }
    async getItem(e, t) {
        return (await this.listItems(e)).find(r => r.id === t) ?? null
    }
    async listItems(e) {
        const t = this.getStoreFromCollection(e);
        return this.runCollectionRead(e, t)
    }
    async upsertItem(e, t, s) {
        const r = this.getStoreFromCollection(e),
            i = await this.getItem(e, t.id),
            n = { ...i ?? {},
                ...t,
                createdAt : t.createdAt ?? i ?.createdAt ?? L(),
                updatedAt : L()
            },
            o = De(e, n);
        await this.putWithShadow(e, r, o, () => K.upsertItem(e, o))
    }
    async softDeleteItem(e, t, s) {
        const r = await this.getItem(e, t);
        r && await this.upsertItem(e, { ...r,
            id: t,
            deletedAt: L(),
            updatedAt: L()
        })
    }
    async getLastSync(e) {
        return this.runSingletonRead(async () => (await P.get("syncMetadata", e)) ?.lastSync ?? null, () => K.getLastSync(e), async t => {
            await P.put("syncMetadata", {
                collection: e,
                lastSync: t
            })
        }, `sync metadata (${e})`)
    }
    async setLastSync(e, t) {
        await this.putWithShadow("syncMetadata", "syncMetadata", {
            collection: e,
            lastSync: t
        }, () => K.setLastSync(e, t))
    }
    async getTasks(e) {
        const t = await this.runCollectionRead(l.TASKS, "tasks");
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveTask(e, t) {
        await this.upsertItem(l.TASKS, e, t)
    }
    async updateTask(e, t, s) {
        const r = await this.getItem(l.TASKS, e);
        r && await this.upsertItem(l.TASKS, { ...r,
            ...t,
            id: e
        }, s)
    }
    async deleteTask(e, t) {
        let s = !1;
        try {
            await P.delete("tasks", e), s = !0, Y()
        } catch {
            V("IndexedDB is unavailable, deleting task from backup storage only.")
        }
        await K.deleteTask(e)
    }
    async softDeleteTask(e, t) {
        await this.softDeleteItem(l.TASKS, e, t)
    }
    async getSessions(e) {
        const t = await this.runCollectionRead(l.SESSIONS, "sessions");
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveSession(e, t) {
        await this.upsertItem(l.SESSIONS, e, t)
    }
    async updateSession(e, t, s) {
        const r = await this.getItem(l.SESSIONS, e);
        r && await this.upsertItem(l.SESSIONS, { ...r,
            ...t,
            id: e
        }, s)
    }
    async deleteSession(e, t) {
        let s = !1;
        try {
            await P.delete("sessions", e), s = !0, Y()
        } catch {
            V("IndexedDB is unavailable, deleting session from backup storage only.")
        }
        await K.deleteSession(e)
    }
    async softDeleteSession(e, t) {
        await this.softDeleteItem(l.SESSIONS, e, t)
    }
    async getSubjects(e) {
        const t = await this.runCollectionRead(l.SUBJECTS, "subjects");
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveSubject(e, t) {
        await this.upsertItem(l.SUBJECTS, e, t)
    }
    async updateSubject(e, t, s) {
        const r = await this.getItem(l.SUBJECTS, e);
        r && await this.upsertItem(l.SUBJECTS, { ...r,
            ...t,
            id: e
        }, s)
    }
    async deleteSubject(e, t) {
        await this.softDeleteItem(l.SUBJECTS, e, t)
    }
    async getHabits(e) {
        const t = await this.runCollectionRead(l.HABITS, "habits");
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveHabit(e, t) {
        await this.upsertItem(l.HABITS, e, t)
    }
    async updateHabit(e, t, s) {
        const r = await this.getItem(l.HABITS, e);
        r && await this.upsertItem(l.HABITS, { ...r,
            ...t,
            id: e
        }, s)
    }
    async deleteHabit(e, t) {
        await this.softDeleteItem(l.HABITS, e, t)
    }
    async getUserProfile() {
        const e = await this.runSingletonRead(async () => {
            const t = await P.getAll("userProfile");
            return t.length === 0 ? null : Ue(t[0])
        }, () => K.getUserProfile(), async t => {
            const s = Ue(t);
            await P.put("userProfile", { ...s,
                id: s.id || "primary"
            })
        }, "user profile");
        return e ? Ue(e) : null
    }
    async saveUserProfile(e, t) {
        const s = Ue(e);
        await this.putWithShadow("userProfile", "userProfile", { ...s,
            id: s.id || "primary"
        }, () => K.saveUserProfile(s))
    }
    async getTimerState() {
        return this.runSingletonRead(async () => await P.get("timerState", "current") ?? null, () => K.getTimerState(), async e => {
            await P.put("timerState", { ...e,
                id: "current"
            })
        }, "timer state")
    }
    async saveTimerState(e, t) {
        await this.putWithShadow("timerState", "timerState", { ...e,
            id: "current",
            lastPersistedAt: L()
        }, () => K.saveTimerState(e))
    }
    async clearTimerState() {
        let e = !1;
        try {
            await P.delete("timerState", "current"), e = !0, Y()
        } catch {
            V("IndexedDB is unavailable, clearing timer state from backup storage.")
        }
        await K.clearTimerState()
    }
    async getDailyLogs(e) {
        const t = await this.runCollectionRead(l.DAILY_LOGS, "dailyLogs");
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveDailyLog(e, t) {
        await this.upsertItem(l.DAILY_LOGS, { ...e,
            id: e.id || `log-${e.date}`
        }, t)
    }
    async softDeleteDailyLog(e, t) {
        await this.softDeleteItem(l.DAILY_LOGS, e, t)
    }
    async getTests(e) {
        const t = await this.runCollectionRead(l.TESTS, "tests");
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveTest(e, t) {
        await this.upsertItem(l.TESTS, e, t)
    }
    async deleteTest(e, t) {
        let s = !1;
        try {
            await P.delete("tests", e), s = !0, Y()
        } catch {
            V("IndexedDB is unavailable, deleting test from backup storage only.")
        }
        await K.deleteTest(e)
    }
    async softDeleteTest(e, t) {
        await this.softDeleteItem(l.TESTS, e, t)
    }
    async getExams(e) {
        const t = await this.runCollectionRead(l.EXAMS, "exams");
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveExam(e, t) {
        await this.upsertItem(l.EXAMS, e, t)
    }
    async deleteExam(e, t) {
        let s = !1;
        try {
            await P.delete("exams", e), s = !0, Y()
        } catch {
            V("IndexedDB is unavailable, deleting exam from backup storage only.")
        }
        await K.deleteExam(e)
    }
    async softDeleteExam(e, t) {
        await this.softDeleteItem(l.EXAMS, e, t)
    }
    async getMockTests(e) {
        const t = await this.runCollectionRead(l.MOCK_TESTS, "mockTests");
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveMockTest(e, t) {
        await this.upsertItem(l.MOCK_TESTS, e, t)
    }
    async updateMockTest(e, t, s) {
        const r = await this.getItem(l.MOCK_TESTS, e);
        r && await this.upsertItem(l.MOCK_TESTS, { ...r,
            ...t,
            id: e,
            updatedAt: L()
        }, s)
    }
    async deleteMockTest(e, t) {
        let s = !1;
        try {
            await P.delete("mockTests", e), s = !0, Y()
        } catch {
            V("IndexedDB is unavailable, deleting mock test from backup storage only.")
        }
        await K.deleteMockTest(e)
    }
    async softDeleteMockTest(e, t) {
        await this.softDeleteItem(l.MOCK_TESTS, e, t)
    }
    async clearAll() {
        let e = !1;
        try {
            await P.clearAllMainStores(), e = !0, Y()
        } catch {
            V("IndexedDB is unavailable, clearing backup storage only.")
        }
        await K.clearAll()
    }
}
const Et = "isotope-demo-mode",
    X = "demo-jee-ranker",
    Vs = "demo@isotope.local",
    Ys = a => a === "/demo" || a.startsWith("/demo/"),
    ge = () => typeof window > "u" ? !1 : Ys(window.location.pathname) || window.sessionStorage.getItem(Et) === "1",
    Mn = () => {
        typeof window > "u" || window.sessionStorage.setItem(Et, "1")
    },
    Qs = () => {
        typeof window > "u" || window.sessionStorage.removeItem(Et)
    },
    Tt = a => `demo:${a}`,
    tt = {
        id: "jee-main-advanced",
        name: "JEE",
        displayName: "JEE (Joint Entrance Examination)",
        description: "Complete syllabus for JEE Main and Advanced covering Physics, Chemistry, and Mathematics",
        icon: "🎓",
        createdAt: L(),
        metadata: {
            examPattern: "Multiple Choice Questions (MCQs) and Numerical Answer Type",
            totalMarks: 300,
            duration: 180,
            officialWebsite: "https://jeemain.nta.nic.in/"
        },
        subjects: [{
            name: "Physics",
            icon: "⚛️",
            color: "text-blue-500",
            gradient: "from-blue-500 to-cyan-600",
            units: [{
                name: "Mechanics 1",
                chapters: [{
                    number: 1,
                    name: "Mathematics in Physics",
                    topics: ["Fundamentals of Vectors", "Addition and Subtraction of Vectors", "Multiplication of Vectors", "Lami's Theorem", "Errors of Measurement"]
                }, {
                    number: 2,
                    name: "Units and Dimensions",
                    topics: ["Units", "Dimensions"]
                }, {
                    number: 3,
                    name: "Motion In One Dimension",
                    topics: ["Rest and Motion", "Uniform Motion", "Graphs of motion in one dimension", "Non-uniform Motion", "Relative Motion", "Motion Under Gravity"]
                }, {
                    number: 4,
                    name: "Motion In Two Dimensions",
                    topics: ["Projectile motion", "Relative motion", "Uniform circular motion"]
                }, {
                    number: 5,
                    name: "Laws of Motion",
                    topics: ["Newton's laws of motion", "Equilibrium of Forces", "Spring force", "Frictional force", "Non-uniform Circular Motion"]
                }, {
                    number: 6,
                    name: "Work Power Energy",
                    topics: ["Work done", "Energy", "Power", "Circular motion"]
                }, {
                    number: 7,
                    name: "Center of Mass Momentum and Collision",
                    topics: ["Momentum", "Centre of mass of discrete particles", "Centre of mass of continuous mass distribution", "Motion of centre of mass", "Impulse", "Collisions", "Variable mass system"]
                }, {
                    number: 8,
                    name: "Rotational Motion",
                    topics: ["Moment of inertia of rigid bodies", "Torque", "Rotational kinematics", "Angular momentum and Angular impulse", "Rolling without Slipping", "Combination of translation and rotation", "Collisions in rotation"]
                }, {
                    number: 9,
                    name: "Gravitation",
                    topics: ["Newton's law of gravitation", "Gravitational field", "Acceleration Due to Gravity", "Gravitational potential and Potential Energy", "Motion of satellite", "Kepler laws"]
                }]
            }, {
                name: "Mechanics 2",
                chapters: [{
                    number: 10,
                    name: "Mechanical Properties of Solids",
                    topics: ["Elasticity", "Young's Modulus and Breaking Stress", "Bulk Modulus", "Shearing stress", "Work Done in Stretching a Wire"]
                }, {
                    number: 11,
                    name: "Mechanical Properties of Fluids",
                    topics: ["Density", "Pressure and thrust", "Pascal's Law", "Archimedes Principle", "Hydrodynamics", "Efflux of liquid", "Surface tension", "Viscosity"]
                }, {
                    number: 12,
                    name: "Oscillations",
                    topics: ["Simple Harmonic Motion", "Energy of Simple Harmonic Motion", "Time Period and Frequency", "Applications of SHM", "Superposition of S.H.M's and Resonance", "Angular oscillations"]
                }, {
                    number: 13,
                    name: "Waves and Sound",
                    topics: ["Basics of Mechanical Waves", "Travelling Waves", "Interference and Superposition of Waves", "Stationary waves", "Vibration of String", "Organ Pipe", "Beats", "Doppler's Effect", "Speed of Sound Waves", "Properties of Sound Waves"]
                }]
            }, {
                name: "Thermodynamics",
                chapters: [{
                    number: 14,
                    name: "Thermal Properties of Matter",
                    topics: ["Thermometry", "Thermal Expansion", "Calorimetry", "Conduction", "Convection", "Radiation"]
                }, {
                    number: 15,
                    name: "Thermodynamics",
                    topics: ["Thermodynamic Systems", "First Law of Thermodynamics", "Thermodynamic Processes", "Heat Engine", "Refrigerator", "Second Law of Thermodynamics"]
                }, {
                    number: 16,
                    name: "Kinetic Theory of Gases",
                    topics: ["Gas Laws", "Speed of Gas", "Degree of Freedom and Specific Heat", "Pressure and Energy of gas"]
                }]
            }, {
                name: "Electromagnetism",
                chapters: [{
                    number: 17,
                    name: "Electrostatics",
                    topics: ["Electric Charge and Coulomb's law", "Electric Field and Electric Field Lines", "Electric Potential and Potential Energy", "Electric Dipole", "Electric Flux and Gauss Law"]
                }, {
                    number: 18,
                    name: "Capacitance",
                    topics: ["Capacitance", "Grouping of capacitors", "Capacitors with Dielectric", "Force and Energy stored in capacitor", "Charging and Discharging of capacitors"]
                }, {
                    number: 19,
                    name: "Current Electricity",
                    topics: ["Electric Current and Drift of Electrons", "Resistance and Resistivity", "Color coding of resistors", "Combination of Resistances", "Electric Cell or Battery", "Kirchoffs Laws", "Electric Power and Heating Effect of Current", "Wheatstone Bridge", "Electric Instruments"]
                }, {
                    number: 20,
                    name: "Magnetic Properties of Matter",
                    topics: ["Magnetism and Properties of Magnet", "Earths magnetic field", "Magnetic Equipments", "Magnetic Materials and their Properties"]
                }, {
                    number: 21,
                    name: "Magnetic Effects of Current",
                    topics: ["Magnetic Field", "Motion of Charged Particle in Magnetic Field", "Force and Torque on Current Carrying Conductor", "Magnetic Moment", "Magnetic Dipole", "Biot-Savart's Law", "Ampere's Circuital Law"]
                }, {
                    number: 22,
                    name: "Electromagnetic Induction",
                    topics: ["Magnetic Flux", "Faraday's and Lenz law", "Induced Electric Field", "Motional and Rotational EMF", "Inductance", "Self and Mutual Inductance", "LR Circuit"]
                }, {
                    number: 23,
                    name: "Alternating Current",
                    topics: ["Alternating Current", "Voltage and Power", "AC Circuits", "Quality and Power Factor", "Transformers", "Parallel AC Circuits"]
                }]
            }, {
                name: "Optics",
                chapters: [{
                    number: 24,
                    name: "Ray Optics",
                    topics: ["Reflection of Light from Plane Mirror", "Mirror Formula", "Reflection in Spherical Mirror", "Critical angle and total internal reflection", "Refraction of light from plane surface", "Lens Formula", "Refraction of light from curved surface", "Combination of Lens and Mirrors", "Prism and Dispersion of Light", "Optical Instruments", "Human eye"]
                }, {
                    number: 25,
                    name: "Wave Optics",
                    topics: ["Wave Theory and Wavefronts", "Interference of Light", "Youngs Double Slit Experiment", "Special Cases in YDSE", "Diffraction of Light", "Polarization of Light"]
                }]
            }, {
                name: "Modern Physics",
                chapters: [{
                    number: 26,
                    name: "Dual Nature of Matter",
                    topics: ["Cathode Rays and Positive Rays", "Matter Waves", "Photoelectric Effect", "Davison and Germer Experiment"]
                }, {
                    number: 27,
                    name: "Atomic Physics",
                    topics: ["Atomic Models", "Atomic Structure", "Bohr's Atomic Model", "Atomic Spectrum", "Thomson Atomic Model"]
                }, {
                    number: 28,
                    name: "Nuclear Physics",
                    topics: ["Nuclear structure", "Nuclear energy", "Nuclear reactions", "Radioactivity"]
                }]
            }, {
                name: "Miscellaneous Physics",
                chapters: [{
                    number: 29,
                    name: "Electromagnetic Waves",
                    topics: ["Electromagnetic Spectrum", "Electromagnetic Waves and Maxwell's equations", "X-Rays"]
                }, {
                    number: 30,
                    name: "Semiconductors",
                    topics: ["Energy Bands in Solids", "Semiconductors", "Diodes", "Special purpose diodes", "Logic gates", "Rectifier", "Junction Transistors"]
                }, {
                    number: 31,
                    name: "Communication System",
                    topics: ["Communication System", "Propagation of EM Waves", "Modulation"]
                }, {
                    number: 32,
                    name: "Experimental Physics",
                    topics: ["Experimental Physics", "Vernier Caliper", "Screw Gauge"]
                }]
            }]
        }, {
            name: "Chemistry",
            icon: "🧪",
            color: "text-green-500",
            gradient: "from-green-500 to-emerald-600",
            units: [{
                name: "Physical Chemistry",
                chapters: [{
                    number: 1,
                    name: "Some Basic Concepts of Chemistry",
                    topics: ["Laws of chemical combination", "Mole concept", "Quantitative measures in chemical equations", "Concentration terms", "Significant Figures"]
                }, {
                    number: 2,
                    name: "Structure of Atom",
                    topics: ["Atomic Models", "Atomic Mass and Atomic Size", "Bohr's model", "Hydrogen spectrum", "Dual Behaviour of Matter and Heisenberg Uncertainty Principle", "Quantum mechanical model", "Electronic configuration"]
                }, {
                    number: 3,
                    name: "States of Matter",
                    topics: ["Gas laws and Ideal Gas Equation", "Mixture of gases", "Kinetic theory of gases", "Real Gases and Van der Waal's Equation", "Critical phenomena and liquefaction", "Liquid State"]
                }, {
                    number: 4,
                    name: "Thermodynamics",
                    topics: ["System and surrounding", "First Law and Basic Fundamentals of Thermodynamics", "Entropy and Second law of thermodynamics", "Third law of thermodynamics", "Carnot engine", "Laws of Thermochemistry and Enthalpy Change"]
                }, {
                    number: 5,
                    name: "Chemical Equilibrium",
                    topics: []
                }, {
                    number: 6,
                    name: "Ionic Equilibrium",
                    topics: ["Theories of Acids and Bases", "Ionic Product of Water", "PH of solutions", "Salt Hydrolysis", "Buffer solutions", "Solubility", "Indicators"]
                }, {
                    number: 7,
                    name: "Redox Reactions",
                    topics: ["Oxidation number", "Oxidation and Reduction Reactions", "Types of redox reactions", "Balancing of redox reactions", "Equivalence concept", "Redox titration"]
                }, {
                    number: 8,
                    name: "Solid State",
                    topics: ["Properties and Types of Solids", "Crystal Structure of Solids", "Cubic system", "Ionic structure", "Stoichiometric defects", "Non-stoichiometric defects", "Electrical and Magnetic properties"]
                }, {
                    number: 9,
                    name: "Solutions",
                    topics: ["Solubility and Concentration of Solutions", "Vapour pressure and raoult's law", "Henry's law", "Colligative Properties and Abnormal Molecular Masses"]
                }, {
                    number: 10,
                    name: "Electrochemistry",
                    topics: ["Cells and Electrode Potential", "Nernst Equation", "Faraday's Law", "Commercial Cells and Batteries", "Corrosion", "Conductance and Conductivity"]
                }, {
                    number: 11,
                    name: "Chemical Kinetics",
                    topics: ["Rate of reaction", "Rate law and rate constant", "Integrated rate laws", "Methods to determine order of reaction", "Parallel and Sequencial rate laws", "Arrhenius theory", "Radioactivity"]
                }, {
                    number: 12,
                    name: "Surface Chemistry",
                    topics: ["Adsorption", "Adsorption isotherms", "Catalysis", "Colloids", "Preparation and Purification of colloids", "Properties of colloidal solution", "Emulsions and Gels", "Nanostructures"]
                }]
            }, {
                name: "Inorganic Chemistry",
                chapters: [{
                    number: 13,
                    name: "Classification of Elements and Periodicity in Properties",
                    topics: ["Earlier attempts of periodic classification", "Modern periodic table", "Periodic properties"]
                }, {
                    number: 14,
                    name: "Chemical Bonding and Molecular Structure",
                    topics: ["Covalent and Co-ordinate Bonding", "Hybridisation and VSEPR Theory", "Back Bonding", "Molecular Orbital Theory", "Characteristics of covalent compound", "Ionic bond", "Polarization", "Properties of ionic compounds", "Dipole moment", "Van Der Waals Forces", "Hydrogen Bonding and Metallic Bonding"]
                }, {
                    number: 15,
                    name: "Hydrogen",
                    topics: ["Preparation and Properties of Hydrogen", "Chemical properties of hydrogen", "Hydrides", "Preparation and Properties of Hydrogen Peroxide", "Chemical properties of hydrogen peroxide", "Preparation and Properties of Water", "Chemical properties of heavy water"]
                }, {
                    number: 16,
                    name: "s Block Elements",
                    topics: ["Properties of S-block elements", "General Characteristics of Alkali Metals", "Compounds of Alkali Metals", "Alkaline Earth Metals", "Compounds of Alkaline Earth Metals"]
                }, {
                    number: 17,
                    name: "General Principles and Processes of Isolation of Metals",
                    topics: ["Minerals and ores", "Concentration of the Ore", "Reduction to Crude Metal", "Refining of Crude Metal", "Flux and Refractory materials", "Extraction of Metals"]
                }, {
                    number: 18,
                    name: "p Block Elements (Group 13 & 14)",
                    topics: ["Boron and Its Compounds", "Aluminium and Its Compounds", "Carbon and Its Compounds", "Silicon and Its Compounds", "Tin and Lead Containing Compounds"]
                }, {
                    number: 19,
                    name: "p Block Elements (Group 15, 16, 17 & 18)",
                    topics: ["Nitrogen and Its Compounds", "Phosphorus and Its Compounds", "Oxygen and Its Compounds", "Sulphur and Its Compounds", "Halogens and Its Compounds", "Noble Gases"]
                }, {
                    number: 20,
                    name: "d and f Block Elements",
                    topics: ["Properties of D-block elements", "Compounds of Transition Metals", "F-Block elements"]
                }, {
                    number: 21,
                    name: "Coordination Compounds",
                    topics: ["Terminology of coordination compounds", "Nomenclature of coordination compounds", "Isomerism of coordination compounds", "Werner's theory and Valence Bond Theory", "Crystal Field Theory", "Stability of complex ion", "Carbonyl Compounds"]
                }, {
                    number: 22,
                    name: "Practical Chemistry",
                    topics: ["Radicals", "Preliminary Tests", "Identification of Acid Radicals", "Identification of Basic Radicals"]
                }]
            }, {
                name: "Organic Chemistry",
                chapters: [{
                    number: 23,
                    name: "General Organic Chemistry",
                    topics: ["IUPAC Nomenclature", "Classification of organic compounds", "Bond Cleavage", "Reaction Intermediates", "Electron displacement effects", "Conjugation and Aromaticity", "Attacking reagents", "Isomerism of Organic Compounds", "Purification of Organic Compounds", "Qualitative analysis of organic compounds", "Quantitative analysis of organic compounds"]
                }, {
                    number: 24,
                    name: "Hydrocarbons",
                    topics: ["Reactions of alkanes", "Properties and Preparation of Alkenes", "Reactions of alkenes", "Properties and Preparation of Alkynes", "Reactions of alkynes", "Preparation and Reactions of cycloalkanes and cycloalkenes", "Preparation and Reactions of Conjugate Dienes", "Preparation and Properties of Benzene", "Reactions of Benzene", "Reactions of aromatic compounds"]
                }, {
                    number: 25,
                    name: "Environmental Chemistry",
                    topics: ["Pollution and its Types", "Depletion of Ozone Layer"]
                }, {
                    number: 26,
                    name: "Haloalkanes and Haloarenes",
                    topics: ["Preparation and Properties of Monohalides", "Preparation and Properties of Geminal and Vicinal Dihalides", "Preparation and Properties of Aryl Halides", "Grignard Reagent"]
                }, {
                    number: 27,
                    name: "Alcohols Phenols and Ethers",
                    topics: ["Preparation and Properties of Alcohols", "Reactions of Alcohols", "Preparation of Phenols", "Properties of Phenol", "Reactions of Phenol", "Preparation of Ethers", "Reactions of Ethers", "Preparation of Oxiranes", "Reactions of Oxiranes", "Dihydric alcohols", "Preparation and Reactions of Glycol", "Reactions of Carbonyl Compounds"]
                }, {
                    number: 28,
                    name: "Aldehydes and Ketones",
                    topics: ["Method of preparation for both aldehydes and ketones", "Method of preparation for Aldehydes", "Method of preparation for Ketones", "Chemical reactions for aldehydes and ketones", "Reactions for aldehydes", "Reactions for ketones", "Tests for aldehyde and ketones"]
                }, {
                    number: 29,
                    name: "Carboxylic Acid Derivatives",
                    topics: ["Acidity of Carboxylic Acids", "Preparation of Carboxylic Acid", "Reactions Involving Cleavage of –OH Group", "Reactions Involving Acid Group", "Abnormal Behaviour of Formic Acid", "Preparation and Properties of Acid Derivatives", "Preparation and Properties of Esters"]
                }, {
                    number: 30,
                    name: "Amines",
                    topics: ["Preparation and Properties of Amines", "Reactions of Amines", "Separation of mixture of amines", "Nitrenes", "Preparation and Properties of Amides", "Preparation and Properties of Cyanides", "Preparation and Properties of Isocyanides"]
                }, {
                    number: 31,
                    name: "Biomolecules",
                    topics: ["Carbohydrates", "Preparation and Reactions of Glucose", "Disaccharides and Polysaccharides", "Properties and Preparation of Amino Acids", "Proteins", "Nucleic Acids", "Vitamins", "Fats"]
                }, {
                    number: 32,
                    name: "Polymers",
                    topics: ["Classification of Polymers", "Preparation and Properties of Polymers"]
                }, {
                    number: 33,
                    name: "Chemistry in Everyday Life",
                    topics: ["Drugs and It's Classification", "Cleansing Agents", "Enzymes and Receptors", "Artificial Sweetning Agents and Food Preservatives"]
                }]
            }]
        }, {
            name: "Mathematics",
            icon: "📐",
            color: "text-brand-500",
            gradient: "from-brand-500 to-pink-600",
            units: [{
                name: "Algebra",
                chapters: [{
                    number: 1,
                    name: "Basic of Mathematics",
                    topics: ["Logarithm", "Inequalities"]
                }, {
                    number: 2,
                    name: "Quadratic Equation",
                    topics: ["Relation between Roots and Coefficients", "Graph and Sign of Quadratic", "Range of Quadratic Function", "Common Roots", "Location of Roots", "N degree equation"]
                }, {
                    number: 3,
                    name: "Complex Number",
                    topics: ["Power of iota", "Algebra of complex numbers", "Conjugate, modulus and argument", "Euler Form and De Moivres Theorem", "Cube Root of Unity", "Locus Based on Distance Formula", "Geometry of Complex Number", "Rotation Theorem", "nth roots of unity"]
                }, {
                    number: 4,
                    name: "Sequences and Series",
                    topics: ["Arithmetic Progression", "Geometric Progression", "Harmonic Progression", "Means", "Arithmetic Geometric Progression", "Summation of Series", "Inequalities", "Mixed AP and GP", "Exponential and Logarithmic Series", "Recursive Relations", "Vn Method"]
                }, {
                    number: 5,
                    name: "Permutation Combination",
                    topics: ["Factorial", "Permutation", "Combination", "Arrangement under constraints", "Selection of one or more item", "Division and Distribution of Distinct Items", "Division of Identical items", "Exponent of prime", "Summation of Numbers", "Geometric Permutation", "Circular Permutation", "Dearrangement", "Number of Integral Solutions"]
                }, {
                    number: 6,
                    name: "Binomial Theorem",
                    topics: ["General Term", "Remainder and Divisibility Problems", "Comparison between two numbers", "Integral and Fractional Part of a Number", "Properties of Binomial Coefficients", "Sum of Series", "Series involving Product of Coefficients", "Multinomial Theorem", "Binomial Theorem for Negative Index"]
                }, {
                    number: 7,
                    name: "Mathematical Reasoning",
                    topics: ["Mathematical Reasoning"]
                }, {
                    number: 8,
                    name: "Statistics",
                    topics: ["Mean, Median, Mode", "Measures of Dispersion", "Mean Square Deviation", "Relation Between Variance and Mean Deviation"]
                }, {
                    number: 9,
                    name: "Matrices",
                    topics: ["Formation and Basic of Matrix", "Basic Algebra of Matrices", "Symmetric & Skew Symmetric Matrices", "Trace of a Matrix", "Product of Matrices", "Adjoint and its Properties", "Inverse of a Matrix"]
                }, {
                    number: 10,
                    name: "Determinants",
                    topics: ["Expansion of Determinant", "Properties of Determinants", "Application of Determinants", "System of Linear Equations", "Differentiation and Integration of Determinants", "Summation of Determinants", "Miscellaneous"]
                }, {
                    number: 11,
                    name: "Probability",
                    topics: ["Classical Definition of Probability", "Addition and Subtraction Theorems", "Conditional Probability and Multiplication Theorem", "Independent Events", "Total Probability", "Baye's Theorem", "Bernoulli Trial and Binomial Distribution", "Random Variable and its Probability Distribution", "Geometric Probability"]
                }]
            }, {
                name: "Calculus",
                chapters: [{
                    number: 12,
                    name: "Sets and Relations",
                    topics: ["Questions on Venn Diagram", "Questions on number of relations and sets", "Questions on Symmetric Transitive and Reflexive Properties"]
                }, {
                    number: 13,
                    name: "Functions",
                    topics: ["Domain", "Range", "Odd and Even Functions", "Composite Function", "Periodicity", "Types of Function", "Inverse of a Function", "Functional Equation", "Number of Solutions", "Definition of Function"]
                }, {
                    number: 14,
                    name: "Limits",
                    topics: ["Existance of Limit", "Algebraic and Rational Limits", "Trigonometric and Inverse Trigonometric limits", "Exponential and logarithmic limits", "Special Forms", "Miscellaneous"]
                }, {
                    number: 15,
                    name: "Continuity and Differentiability",
                    topics: ["Continuity", "Differentiability"]
                }, {
                    number: 16,
                    name: "Differentiation",
                    topics: ["Differentiation of composite functions", "Differentiation of implicit functions", "Parametric differentiation", "Logarithmic differentiation", "Derivative of f(x) wrt g(x)", "Differentiation of Inverse Trigonometric Functions", "Derivative of function and its inverse", "Higher order derivatives", "Functional Equation"]
                }, {
                    number: 17,
                    name: "Application of Derivatives",
                    topics: ["Rate Measure Error and Approximation", "Monotonicity", "Maxima Minima", "Tangent Normal", "Mean Value Theorem"]
                }, {
                    number: 18,
                    name: "Indefinite Integration",
                    topics: ["Fundamental of Indefinite Integration", "Integration by Substitution", "Integration by Parts", "Integration using Partial Fraction"]
                }, {
                    number: 19,
                    name: "Definite Integration",
                    topics: ["Basic Definite Integrals", "Definite Integration by Substitution", "Definite Integration by Parts", "Properties of Definite Integration", "Properties of Periodic Functions", "Leibnitz Rule of Differentiation", "Definite as Limit of Sum", "Definite Integration by Reduction Formula", "Properties Involving Inequalities", "Miscellaneous"]
                }, {
                    number: 20,
                    name: "Area Under Curves",
                    topics: ["Area of Curve along axis", "Area bounded by two curves", "Area bounded by Miscellaneous Curves"]
                }, {
                    number: 21,
                    name: "Differential Equations",
                    topics: ["Order and Degree", "Formation of Differential Equation", "Variable Separable Form", "Homogeneous DE", "Linear Differential Equation", "Exact Forms", "Applications of DE"]
                }]
            }, {
                name: "Coordinate Geometry",
                chapters: [{
                    number: 22,
                    name: "Straight Lines",
                    topics: ["Coordinate System", "Basic Forms of Straight Line", "Position of a point", "Angle between Lines", "Derived Forms of Line", "Point and Line", "Concurrency & Family of Lines", "Angle bisector", "Locus", "Pair of Lines"]
                }, {
                    number: 23,
                    name: "Circle",
                    topics: ["Equation of Circle & its intercept", "Point and Circle", "Line and Circle", "Tangent to Circle", "Normal to Circle", "Chord of Circle", "Intersection of Circles", "Common Chord", "Family of Circle", "Locus"]
                }, {
                    number: 24,
                    name: "Parabola",
                    topics: ["Equation of Parabola", "Tangent to Parabola", "Normal to Parabola", "Chord of Contact", "Chord with given Middle Point", "Locus", "Reflection property"]
                }, {
                    number: 25,
                    name: "Ellipse",
                    topics: ["Equation of Ellipse", "Tangent to Ellipse", "Normal to Ellipse", "Chord of Contact", "Chord with given Middle Point", "Locus", "Reflection property"]
                }, {
                    number: 26,
                    name: "Hyperbola",
                    topics: ["Mixed Questions of Ellipse and Hyperbola", "Equation of hyperbola", "Tangent to hyperbola", "Normal to hyperbola", "Chord of Contact", "Chord with given Middle Point", "Locus"]
                }]
            }, {
                name: "Trigonometry and Vector Algebra",
                chapters: [{
                    number: 27,
                    name: "Trigonometric Ratios & Identities",
                    topics: ["Basic Identities & T Ratios", "Sum and Difference & Multiple angle Formula", "T-Ratios of Multiple & sub multiple angles", "Transformation Formulas", "Maximum and Minimum Values", "Trigonometric Series"]
                }, {
                    number: 28,
                    name: "Trigonometric Equations",
                    topics: ["Principal Value and Basics", "T inverse T property", "Sum of complementary angles", "Sum and difference of angles", "Multiple Angles", "Infinite Series"]
                }, {
                    number: 29,
                    name: "Inverse Trigonometric Functions",
                    topics: []
                }, {
                    number: 30,
                    name: "Heights and Distances",
                    topics: ["Heights and Distances"]
                }, {
                    number: 31,
                    name: "Properties of Triangles",
                    topics: ["Sine Rule and its application", "Cosine Rule and Projection Formula", "Napiers Analogy", "Area of Triangle & Half angle Formulae", "Circle Connected to Triangle"]
                }, {
                    number: 32,
                    name: "Vector Algebra",
                    topics: ["Algebra of Vectors", "Product of 2 vectors", "Scalar Triple Product", "Vector Triple Product"]
                }, {
                    number: 33,
                    name: "Three Dimensional Geometry",
                    topics: ["Direction Cosines and Direction Ratios", "Line in Space", "Plane in Space", "Line and Plane"]
                }]
            }]
        }]
    },
    Xs = a => a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    ie = (a, e = 1) => {
        const t = 10 ** e;
        return Math.round(a * t) / t
    },
    $ = a => a.toISOString().slice(0, 10),
    _ = (a, e) => {
        const t = new Date(a);
        return t.setDate(a.getDate() + e), t
    },
    W = (a, e, t = 0) => {
        const s = new Date(a);
        return s.setHours(e, t, 0, 0), s
    },
    C = (a, e = 9, t = 0) => {
        const [s, r, i] = a.split("-").map(Number);
        return new Date(s, r - 1, i, e, t, 0, 0)
    },
    b = (...a) => `demo-${a.map(e=>Xs(String(e))).join("-")}`,
    Zs = a => a >= 92 ? "Enlightened" : a >= 78 ? "Master" : a >= 58 ? "Guru" : a >= 34 ? "Apprentice" : "Novice",
    er = a => [`${a} fundamentals`, `${a} formula and definitions`, `${a} graph and interpretation`, `${a} JEE Main PYQ patterns`, `${a} mixed objective practice`],
    tr = a => {
        const e = [{
                id: "concepts",
                name: "Concepts",
                color: "brand",
                order: 0,
                trackingMode: "check"
            }, {
                id: "notes",
                name: "Notes",
                color: "sky",
                order: 1,
                trackingMode: "check"
            }, {
                id: "pyq",
                name: "PYQ Sets",
                color: "emerald",
                order: 2,
                trackingMode: "count",
                targetCount: 4
            }, {
                id: "revision",
                name: "Revision",
                color: "amber",
                order: 3,
                trackingMode: "count",
                targetCount: 3
            }, {
                id: "mistakes",
                name: "Mistakes Fixed",
                color: "rose",
                order: 4,
                trackingMode: "check"
            }],
            t = {},
            s = {},
            r = {};
        return a.chapters.forEach((i, n) => {
            const o = n % 10;
            r[i.id] = o <= 2 ? "high" : o <= 6 ? "medium" : "low", e.forEach(c => {
                const d = `${i.id}::${c.id}`;
                c.trackingMode === "count" ? s[d] = Math.min(c.targetCount || 3, Math.max(0, 1 + (n + c.order) % 4)) : t[d] = (n + c.order) % 5 !== 0
            })
        }), {
            subjectId: a.id,
            columns: e,
            checkState: t,
            countState: s,
            priorities: r
        }
    },
    ar = a => tt.subjects.map((e, t) => {
        const s = b("subject", e.name);
        let r = 0;
        const i = e.units.flatMap(o => o.chapters.map(c => {
                const d = b("chapter", e.name, c.number, c.name),
                    h = (c.number * 13 + t * 17) % 100,
                    A = Math.max(18, Math.min(96, 30 + h)),
                    f = (c.topics.length > 0 ? c.topics : er(c.name)).map((I, T) => {
                        const k = Math.max(12, Math.min(98, A + (T % 5 - 2) * 9)),
                            E = k >= 58;
                        return {
                            id: b("topic", e.name, c.number, I),
                            title: I,
                            completed: E,
                            lastStudied: $(_(a, -((T + c.number) % 28))),
                            nextReview: $(_(a, 1 + (T + c.number) % 12)),
                            easeFactor: ie(2.1 + k / 100 * .9, 2),
                            interval: Math.max(1, Math.round(k / 8)),
                            repetitions: Math.max(0, Math.round(k / 18)),
                            mastery: Zs(k),
                            resources: [{
                                type: "quiz",
                                title: `${I} PYQ Drill`
                            }],
                            difficulty: k < 45 ? "hard" : k < 70 ? "medium" : "easy",
                            updatedAt: a.toISOString(),
                            isPinned: T === 0 && A < 65,
                            studyTime: Math.round(35 + k * 1.8),
                            successRate: Math.round(k),
                            order: T
                        }
                    }),
                    g = Math.round(f.reduce((I, T) => I + (T.completed ? 1 : 0), 0) / f.length * 100);
                return {
                    id: d,
                    title: c.name,
                    topics: f,
                    completionPercentage: g,
                    metadata: {
                        priority: g < 45 ? "high" : g < 72 ? "medium" : "low",
                        needsRevision: g < 78,
                        revisionCount: Math.max(0, Math.round(g / 28)),
                        lastRevisionDate: $(_(a, -(c.number % 18 + 1))),
                        revisionStatus: g > 76 ? "completed" : g > 42 ? "in-progress" : "pending",
                        estimatedTime: Math.max(120, f.length * 55),
                        studyTime: f.reduce((I, T) => I + (T.studyTime || 0), 0),
                        difficulty: g < 46 ? "hard" : g < 74 ? "medium" : "easy",
                        tags: [o.name, g < 55 ? "weak-area" : "active-revision"]
                    },
                    createdAt: _(a, -100).toISOString(),
                    updatedAt: a.toISOString(),
                    order: r++
                }
            })),
            n = {
                id: s,
                name: e.name,
                color: e.color || ["text-blue-500", "text-emerald-500", "text-violet-500"][t],
                gradient: e.gradient || ["from-blue-500 to-cyan-600", "from-emerald-500 to-teal-600", "from-violet-500 to-fuchsia-600"][t],
                icon: e.icon || "BookOpen",
                chapters: i,
                createdAt: _(a, -120).toISOString(),
                updatedAt: a.toISOString(),
                examTemplateId: tt.id,
                examName: tt.name,
                isCustom: !1,
                studyTime: i.reduce((o, c) => o + (c.metadata ?.studyTime || 0), 0),
                order: t
            };
        return { ...n,
            syllabusConfig: tr(n)
        }
    }),
    Sa = (a, e) => {
        const t = a[e % a.length],
            s = t.chapters[e * 3 % t.chapters.length],
            r = s.topics[e * 5 % s.topics.length];
        return {
            subject: t,
            chapter: s,
            topic: r
        }
    },
    sr = (a, e) => {
        const t = [],
            s = [],
            r = new Set;
        for (let i = -91; i <= 0; i += 1) {
            const n = _(e, i),
                o = $(n);
            if ([6, 18, 29].includes(n.getDate()) || i % 37 === 0 && i < -2) {
                r.add(o), s.push({
                    id: `log-${o}`,
                    date: o,
                    sleepHours: 7.8,
                    sleepQuality: "good",
                    mood: "Recharge day",
                    energyLevel: 7,
                    questionsSolved: 12 + Math.abs(i % 11),
                    questionsAttempted: 18 + Math.abs(i % 17),
                    questionsTarget: 120,
                    notes: "Light review day with no tracked deep-work block.",
                    createdAt: W(n, 22).toISOString(),
                    updatedAt: W(n, 22, 15).toISOString()
                });
                continue
            }
            let d = 180 + Math.abs(i * 47 % 181);
            Math.abs(i) % 13 === 0 && (d = 480 + Math.abs(i * 29 % 151)), Math.abs(i) % 31 === 0 && (d = 690 + Math.abs(i * 11 % 31)), d = Math.min(720, Math.max(180, d));
            const h = d > 540 ? 4 : d > 330 ? 3 : 2,
                A = Array.from({
                    length: h
                }, (y, I) => Math.floor(d / h) + (I % 2 === 0 ? 12 : -8));
            A[A.length - 1] += d - A.reduce((y, I) => y + I, 0);
            let u = 0,
                f = 0;
            const g = {};
            A.forEach((y, I) => {
                const T = Math.abs(i * 7 + I * 11),
                    {
                        subject: k,
                        chapter: E,
                        topic: z
                    } = Sa(a, T),
                    R = W(n, [6, 14, 18, 21][I] || 20, T * 7 % 45),
                    H = new Date(R.getTime() + y * 60 * 1e3),
                    N = Math.max(12, Math.round(y / 2.6 + T % 12)),
                    D = .58 + T % 30 / 100,
                    ne = Math.min(N, Math.round(N * D)),
                    be = Math.round(N * .08),
                    Ce = Math.max(0, N - ne - be);
                u += ne, f += N, g[k.id] = {
                    attempted: (g[k.id] ?.attempted || 0) + N,
                    correct: (g[k.id] ?.correct || 0) + ne,
                    incorrect: (g[k.id] ?.incorrect || 0) + Ce,
                    skipped: (g[k.id] ?.skipped || 0) + be
                }, t.push({
                    id: b("session", o, I),
                    subjectIds: [k.id],
                    chapterIds: [E.id],
                    topicIds: [z.id],
                    taskIds: [],
                    subject: k.name,
                    subjectId: k.id,
                    topic: z.title,
                    duration: y,
                    plannedDuration: Math.ceil(y / 25) * 25,
                    startTime: R.toISOString(),
                    endTime: H.toISOString(),
                    type: I % 3 === 0 ? "Practice" : I % 3 === 1 ? "Revision" : "Lecture",
                    taskType: I % 3 === 0 ? "questions" : I % 3 === 1 ? "revision" : "lecture",
                    sessionType: I % 3 === 0 ? "PYQ practice" : I % 3 === 1 ? "Formula revision" : "Concept build",
                    description: `${k.name}: ${E.title}`,
                    mode: I % 2 === 0 ? "pomodoro" : "stopwatch",
                    timeAllocation: {
                        bySubject: {
                            [k.id]: y
                        },
                        byChapter: {
                            [E.id]: y
                        },
                        byTopic: {
                            [z.id]: y
                        },
                        byTask: {}
                    },
                    allocationStrategy: "hierarchical",
                    pauseLogs: [],
                    totalPauseTime: T % 4 * 60,
                    interruptions: T % 3,
                    efficiency: Math.min(98, Math.max(62, Math.round(72 + T % 24))),
                    productivityRating: Math.min(5, Math.max(3, 3 + T % 3)),
                    notes: `Solved targeted ${k.name} questions and tagged weak spots for revision.`,
                    completedTaskIds: [],
                    questionsAttempted: N,
                    questionsCorrect: ne,
                    questionsIncorrect: Ce,
                    questionsSkipped: be,
                    targetQuestions: Math.max(25, N + 8),
                    questionsBySubject: {
                        [k.id]: {
                            attempted: N,
                            correct: ne,
                            incorrect: Ce,
                            skipped: be
                        }
                    },
                    questionsByChapter: {
                        [E.id]: {
                            attempted: N,
                            correct: ne,
                            incorrect: Ce,
                            skipped: be
                        }
                    },
                    questionsByTopic: {
                        [z.id]: {
                            attempted: N,
                            correct: ne,
                            incorrect: Ce,
                            skipped: be
                        }
                    },
                    completed: !0,
                    createdAt: R.toISOString(),
                    updatedAt: H.toISOString(),
                    timeAllocationSynced: !1
                })
            }), s.push({
                id: `log-${o}`,
                date: o,
                sleepHours: ie(6.4 + Math.abs(i % 18) / 10, 1),
                sleepQuality: d > 600 ? "fair" : d > 300 ? "good" : "excellent",
                mood: d > 600 ? "Intense prep" : "Steady",
                energyLevel: Math.min(10, Math.max(5, 6 + Math.abs(i % 5))),
                questionsSolved: u,
                questionsAttempted: f,
                questionsTarget: 120,
                questionsBySubject: g,
                notes: `${ie(d/60,1)} study hours logged for JEE Main demo analytics.`,
                createdAt: W(n, 22).toISOString(),
                updatedAt: W(n, 22, 20).toISOString()
            })
        }
        return {
            sessions: t,
            dailyLogs: s,
            offDays: r
        }
    },
    rr = (a, e) => {
        const t = ["backlog", "todo", "in-progress", "review", "done"],
            s = ["p1", "p2", "p3", "p4"],
            r = ["Revise error notebook for", "Complete PYQ set from", "Make formula sheet for", "Retest weak topic in", "Watch final concept recap for", "Solve timed drill on", "Convert mistakes into flashcards for", "Finish NCERT quick scan for"];
        return Array.from({
            length: 32
        }, (i, n) => {
            const {
                subject: o,
                chapter: c,
                topic: d
            } = Sa(a, n + 3), h = t[n % t.length], A = _(e, n - 11), u = h === "done" ? _(e, -Math.max(1, n % 14)).toISOString() : void 0;
            return {
                id: b("task", n),
                title: `${r[n%r.length]} ${c.title}`,
                subject: o.name,
                subjectId: o.id,
                chapterId: c.id,
                topicId: d.id,
                status: h,
                priority: s[n % s.length],
                dueDate: A.toISOString(),
                effort: [35, 45, 60, 75, 90][n % 5],
                energy: n % 3 === 0 ? "high" : n % 3 === 1 ? "medium" : "low",
                description: `Demo task connected to ${d.title} so teachers can inspect task-to-study analytics.`,
                subtasks: [{
                    id: b("task", n, "subtask", 1),
                    title: "Attempt questions",
                    completed: h === "done"
                }, {
                    id: b("task", n, "subtask", 2),
                    title: "Mark mistakes",
                    completed: h === "done" || h === "review"
                }, {
                    id: b("task", n, "subtask", 3),
                    title: "Schedule revision",
                    completed: h === "done"
                }],
                createdAt: _(e, -45 + n).toISOString(),
                updatedAt: _(e, -Math.max(0, 10 - n)).toISOString(),
                completedAt: u,
                linkedSessionIds: [],
                focusSessionIds: [],
                totalFocusTime: h === "done" ? 120 + n * 7 : n % 4 === 0 ? 35 : 0,
                order: n
            }
        })
    },
    ir = a => {
        const e = $(a),
            t = s => Array.from({
                length: 42
            }, (r, i) => $(_(a, -i))).filter((r, i) => i % s !== 0).reverse();
        return [{
            id: b("habit", "formula-revision"),
            name: "Formula revision",
            completed: !0,
            streak: 11,
            longestStreak: 24,
            icon: "BookOpen",
            frequency: "daily",
            completionHistory: t(9),
            createdAt: _(a, -80).toISOString(),
            updatedAt: a.toISOString(),
            lastCompletedDate: e
        }, {
            id: b("habit", "mock-analysis"),
            name: "Mock analysis",
            completed: !1,
            streak: 4,
            longestStreak: 9,
            icon: "BarChart3",
            frequency: "weekly",
            targetDays: [0, 3, 6],
            completionHistory: t(5),
            createdAt: _(a, -76).toISOString(),
            updatedAt: a.toISOString(),
            lastCompletedDate: $(_(a, -2))
        }, {
            id: b("habit", "error-log"),
            name: "Error log cleanup",
            completed: !0,
            streak: 8,
            longestStreak: 17,
            icon: "Target",
            frequency: "daily",
            completionHistory: t(7),
            createdAt: _(a, -69).toISOString(),
            updatedAt: a.toISOString(),
            lastCompletedDate: e
        }]
    },
    nr = (a, e, t, s) => {
        const r = Math.round(e / a.length),
            i = a.map((d, h) => h === a.length - 1 ? e - r * (a.length - 1) : r),
            n = [.34 + s % 3 * .01, .35 - s % 2 * .01, .31];
        let o = t;
        const c = a.map((d, h) => {
            const A = i[h] || r,
                u = h === a.length - 1 ? o : Math.round(t * (n[h] || 1 / a.length)),
                f = Math.max(0, Math.min(A, u));
            o -= f;
            const g = A >= 100 ? 30 : Math.max(15, Math.round(A / 4)),
                y = Math.min(g, Math.max(0, Math.round(f / 4))),
                I = Math.min(g - y, Math.max(0, 2 + (s + h) % 6)),
                T = Math.max(0, g - y - I);
            return {
                subjectId: d.id,
                subjectName: d.name,
                totalMarks: A,
                scoredMarks: f,
                percentage: ie(f / A * 100, 1),
                chapterResults: d.chapters.slice(0, 5).map((k, E) => ({
                    chapterId: k.id,
                    chapterTitle: k.title,
                    questionsAttempted: 4 + (s + E) % 3,
                    questionsCorrect: 2 + (s + E + h) % 4,
                    marksObtained: Math.max(6, Math.round(f / 6) + E),
                    totalMarks: Math.max(12, Math.round(A / 7))
                })),
                correct: y,
                incorrect: I,
                unattempted: T,
                timeTaken: Math.round(180 / a.length + h * 6 + s % 5)
            }
        });
        return {
            subjectResults: c,
            subjectScores: c.map((d, h) => ({
                subject_id: d.subjectId,
                subject_name: d.subjectName,
                marks_obtained: d.scoredMarks,
                total_marks: d.totalMarks,
                correct: d.correct,
                incorrect: d.incorrect,
                unattempted: d.unattempted,
                time_taken_minutes: d.timeTaken,
                highest_score: Math.min(d.totalMarks, d.scoredMarks + 11 + h * 3),
                average_score: Math.max(30, d.scoredMarks - 18 - h * 2)
            }))
        }
    },
    Pe = ({
        subjects: a,
        totalMarks: e,
        scoredMarks: t,
        targetScore: s,
        resultDate: r,
        rank: i,
        percentile: n,
        totalCandidates: o,
        cutoffScore: c,
        highestScore: d,
        averageScore: h,
        notes: A,
        seed: u
    }) => {
        const {
            subjectResults: f,
            subjectScores: g
        } = nr(a, e, t, u), y = g.reduce((E, z) => E + z.correct, 0), I = g.reduce((E, z) => E + z.incorrect, 0), T = y + I > 0 ? ie(y / (y + I) * 100, 1) : 0, k = t - s;
        return {
            totalMarks: e,
            scoredMarks: t,
            percentage: ie(t / e * 100, 1),
            rank: i,
            percentile: n,
            subjectResults: f,
            resultDate: r,
            resultDeclared: !0,
            targetComparison: {
                difference: k,
                percentageDifference: ie(k / Math.max(1, s) * 100, 1),
                targetAchieved: k >= 0
            },
            logged_at: W(C(r), 19).toISOString(),
            score_obtained: t,
            accuracy_percentage: T,
            total_candidates: o,
            cutoff_score: c,
            highest_score: d,
            average_score: h,
            total_time_taken_minutes: 180,
            negative_marks_lost: Math.round(I * .8),
            error_breakdown: {
                conceptual: 4 + u % 5,
                silly: 6 + u % 4,
                memory: 3 + u % 3,
                guesswork: 2 + u % 2
            },
            subject_scores: g,
            post_exam_notes: A
        }
    },
    or = (a, e) => {
        const t = [],
            s = [],
            r = b("exam", "jee-main-2027-jan-22"),
            i = a.flatMap(u => u.chapters.map(f => f.id)),
            n = a.map(u => u.id),
            o = ["2026-02-02", "2026-02-16", "2026-03-02", "2026-03-16", "2026-04-01", "2026-04-18", "2026-05-05", "2026-06-01", "2026-07-01", "2026-08-01", "2026-09-01", "2026-10-01", "2026-11-01", "2026-12-01", "2027-01-10"],
            c = [162, 171, 184, 196, 205, 214, 222, 228, 234, 238, 242, 246, 250, 254, 258],
            d = [];
        for (let u = 0; u < o.length; u += 1) {
            const f = C(o[u]),
                g = c[u],
                y = f.getTime() <= e.getTime(),
                I = b("mock", "jee-main-2027", u + 1),
                T = b("exam", "jee-main-full-mock", u + 1);
            s.push(I);
            const k = a.map((R, H) => {
                    const N = Math.min(100, Math.max(38, Math.round(g / 3 + (H - 1) * 6 + u % 4 * 2)));
                    return {
                        subjectId: R.id,
                        subjectName: R.name,
                        timeSpent: 55 + H * 5 + u % 4,
                        marksObtained: N,
                        totalMarks: 100,
                        questionsAttempted: 22 + H * 2 + u % 5,
                        totalQuestions: 30,
                        percentage: N,
                        chapterIds: R.chapters.slice(u % 5, u % 5 + 6).map(D => D.id)
                    }
                }),
                E = a.map((R, H) => {
                    const N = R.chapters[(u + H * 3) % R.chapters.length],
                        D = N.topics[(u + H) % N.topics.length];
                    return {
                        id: b("mock", u, "mistake", R.name),
                        subject: R.name,
                        topic: D.title,
                        description: `Lost marks in ${D.title} under timed pressure.`,
                        solution: `Redo 12 mixed questions and add one formula cue card for ${N.title}.`,
                        type: H === 0 ? "conceptual" : H === 1 ? "silly" : "time",
                        severity: u < 4 ? "major" : "minor",
                        linkedChapterId: N.id,
                        linkedTopicId: D.id
                    }
                }),
                z = [{
                    id: b("mock", u, "takeaway", 1),
                    category: "strategy",
                    priority: "high",
                    content: "Attempt Chemistry first, then Physics numericals, then Mathematics marked questions.",
                    actionable: !0
                }, {
                    id: b("mock", u, "takeaway", 2),
                    category: "time_management",
                    priority: "medium",
                    content: "Cap first-pass time at 85 minutes and reserve 22 minutes for flagged review.",
                    actionable: !0
                }];
            t.push({
                id: I,
                name: `JEE Main 2027 Full Mock ${u+1}`,
                testType: "mock",
                date: f.toISOString(),
                time: "09:00",
                categories: ["JEE Main 2027", "PCM", u >= 11 ? "Final Phase" : u >= 7 ? "Upcoming Plan" : "Completed Analysis"],
                environment: u % 3 === 0 ? "coaching" : u % 3 === 1 ? "library" : "home",
                duration: 180,
                totalQuestions: 90,
                expectedDifficulty: u % 4 === 0 ? "very_hard" : u % 4 === 1 ? "hard" : "medium",
                subjectPerformance: k,
                totalMarks: 300,
                scoredMarks: g,
                percentage: ie(g / 300 * 100, 1),
                rank: Math.max(340, 2100 - u * 135),
                targetScore: 240,
                preparationTime: 12 + u * 3,
                confidenceLevel: Math.min(5, Math.max(2, 2 + Math.floor(u / 3))),
                notes: "Demo mock data for Ranker analytics, calibration, and weak-topic workflows.",
                enableMistakeTracking: !0,
                enableTakeawayCollection: !0,
                enableReviewReminders: !0,
                syllabusCovered: k.flatMap(R => R.chapterIds || []),
                chaptersCovered: k.flatMap(R => R.chapterIds || []),
                mistakes: E,
                takeaways: z,
                status: y ? "analyzed" : "scheduled",
                completedAt: y ? W(f, 12).toISOString() : void 0,
                analyzedAt: y ? W(f, 18).toISOString() : void 0,
                createdAt: W(f, 8).toISOString(),
                updatedAt: y ? W(f, 18).toISOString() : e.toISOString(),
                examId: r
            }), d.push({
                id: T,
                title: `JEE Main Full Mock ${u+1}`,
                description: y ? "Completed Ranker-plan full mock linked to the January D-Day exam." : "Upcoming Ranker-plan full mock scheduled for D-Day calibration.",
                date: f.toISOString(),
                start_time: "09:00",
                duration_minutes: 180,
                targetScore: 240,
                totalMarks: 300,
                total_marks: 300,
                syllabusIds: n,
                chapterIds: i,
                chapter_ids: i,
                priority: u >= 11 ? "high" : "medium",
                exam_type: "mock",
                dday_exam_id: r,
                color: "#38bdf8",
                tags: ["JEE Main", "Full Mock", "PCM", u >= 7 ? "Upcoming" : "Analyzed"],
                tag_colors: {
                    "JEE Main": "#38bdf8",
                    "Full Mock": "#6366f1",
                    PCM: "#22c55e",
                    Upcoming: "#f59e0b",
                    Analyzed: "#10b981"
                },
                marking_scheme: {
                    correct_marks: 4,
                    negative_marks: 1
                },
                preparationProgress: y ? 100 : Math.min(92, 52 + u * 3),
                dailyStudyGoal: 720,
                totalPrepTime: (42 + u * 18) * 60,
                linkedMockTestIds: [I],
                result: y ? Pe({
                    subjects: a,
                    totalMarks: 300,
                    scoredMarks: g,
                    targetScore: 240,
                    resultDate: $(_(f, 1)),
                    rank: Math.max(420, 4200 - u * 340),
                    percentile: ie(94.2 + u * .62, 2),
                    totalCandidates: 12e5,
                    cutoffScore: 93,
                    highestScore: 294,
                    averageScore: 122,
                    notes: "Mock result logged with subject scores, accuracy, error breakdown, and D-Day linkage.",
                    seed: u
                }) : void 0,
                analysis: {
                    strengths: ["Full paper stamina", "Chemistry first-pass accuracy", "Marked-question review discipline"],
                    weaknesses: u < 7 ? ["Maths time bleed", "Modern physics recall"] : ["Pending attempt"],
                    improvementAreas: ["Keep final 20 minutes for flagged questions", "Reduce guesswork negatives"],
                    notes: y ? "Linked completed mock feeds D-Day attempt trend analytics." : "Upcoming mock keeps the D-Day prep calendar full without fake completed results.",
                    recommendedChaptersForRevision: a.flatMap(R => R.chapters.slice(u % 3, u % 3 + 2).map(H => H.id)),
                    estimatedPreparationGap: Math.max(8, 44 - u * 2)
                },
                createdAt: _(f, -12).toISOString(),
                updatedAt: y ? W(f, 18).toISOString() : e.toISOString(),
                created_at: _(f, -12).toISOString(),
                updated_at: y ? W(f, 18).toISOString() : e.toISOString(),
                deletedAt: null,
                deleted_at: null,
                archived_at: null
            })
        }
        const h = [{
            id: r,
            title: "JEE Main 2027 Session 1 (D-Day)",
            description: "Primary Ranker demo target: JEE Main PCM attempt on 22 January 2027.",
            date: C("2027-01-22", 9).toISOString(),
            start_time: "09:00",
            duration_minutes: 180,
            targetScore: 255,
            totalMarks: 300,
            total_marks: 300,
            syllabusIds: n,
            chapterIds: i,
            chapter_ids: i,
            priority: "high",
            isDDay: !0,
            exam_type: "dday",
            color: "#f59e0b",
            tags: ["JEE Main", "D-Day", "PCM", "Ranker"],
            tag_colors: {
                "JEE Main": "#38bdf8",
                "D-Day": "#f59e0b",
                PCM: "#22c55e",
                Ranker: "#a855f7"
            },
            marking_scheme: {
                correct_marks: 4,
                negative_marks: 1
            },
            preparationProgress: 58,
            dailyStudyGoal: 720,
            totalPrepTime: 640 * 60,
            linkedMockTestIds: s,
            result_declaration_date: C("2027-02-10", 10).toISOString(),
            milestones: [{
                id: b("milestone", "main", 1),
                title: "Stabilize mock average above 235",
                dueDate: "2026-08-15",
                completed: !1
            }, {
                id: b("milestone", "main", 2),
                title: "Complete 15 linked full mocks",
                dueDate: "2027-01-10",
                completed: !1
            }, {
                id: b("milestone", "main", 3),
                title: "Final inorganic and formula pass",
                dueDate: "2027-01-18",
                completed: !1
            }],
            revisionSchedule: a.flatMap((u, f) => u.chapters.slice(0, 7).map((g, y) => ({
                id: b("revision", "main", u.name, y),
                chapterId: g.id,
                chapterTitle: g.title,
                scheduledDate: $(_(e, f * 3 + y + 1)),
                completed: y < 3,
                completedAt: y < 2 ? $(_(e, -y - 1)) : void 0,
                notes: `Ranker demo revision item for ${g.title}.`
            }))),
            analysis: {
                strengths: ["Chemistry scoring stability", "Mechanics accuracy", "Mock analysis consistency"],
                weaknesses: ["Lengthy calculus problems", "Modern physics recall under pressure"],
                improvementAreas: ["Timed Mathematics section", "Silly-error audit before submission"],
                notes: "D-Day analytics intentionally show 7 analyzed mocks and 8 scheduled mocks leading to 22 Jan 2027.",
                recommendedChaptersForRevision: a.flatMap(u => u.chapters.slice(0, 2).map(f => f.id)),
                estimatedPreparationGap: 116
            },
            createdAt: _(e, -120).toISOString(),
            updatedAt: e.toISOString(),
            created_at: _(e, -120).toISOString(),
            updated_at: e.toISOString(),
            deletedAt: null,
            deleted_at: null,
            archived_at: null
        }, {
            id: b("exam", "jee-main-2026-april-result"),
            title: "JEE Main 2026 April Attempt Result",
            description: "Past official-attempt style benchmark result to power exam trend analytics.",
            date: C("2026-04-06", 9).toISOString(),
            start_time: "09:00",
            duration_minutes: 180,
            targetScore: 225,
            totalMarks: 300,
            total_marks: 300,
            syllabusIds: n,
            chapterIds: i,
            chapter_ids: i,
            priority: "high",
            isDDay: !1,
            exam_type: "practice",
            color: "#6366f1",
            tags: ["JEE Main", "Result Logged", "PCM"],
            tag_colors: {
                "JEE Main": "#38bdf8",
                "Result Logged": "#10b981",
                PCM: "#22c55e"
            },
            marking_scheme: {
                correct_marks: 4,
                negative_marks: 1
            },
            preparationProgress: 100,
            dailyStudyGoal: 720,
            totalPrepTime: 420 * 60,
            linkedMockTestIds: s.slice(0, 5),
            result_declaration_date: C("2026-04-19", 10).toISOString(),
            result: Pe({
                subjects: a,
                totalMarks: 300,
                scoredMarks: 232,
                targetScore: 225,
                resultDate: "2026-04-19",
                rank: 6400,
                percentile: 98.74,
                totalCandidates: 124e4,
                cutoffScore: 93,
                highestScore: 300,
                averageScore: 118,
                notes: "Strong Chemistry carried the attempt; Maths pacing still needs improvement before Jan 2027.",
                seed: 16
            }),
            analysis: {
                strengths: ["Chemistry percentile", "Low unattempted count", "Better second-half stamina"],
                weaknesses: ["Coordinate geometry timing", "Two avoidable negative-mark clusters"],
                improvementAreas: ["Timed coordinate drills", "Question selection before minute 120"],
                notes: "Logged result exists so exam analytics, weak chapters, and score deltas render in demo mode.",
                recommendedChaptersForRevision: a.flatMap(u => u.chapters.slice(1, 4).map(f => f.id)),
                estimatedPreparationGap: 84
            },
            createdAt: C("2026-01-20").toISOString(),
            updatedAt: C("2026-04-19", 19).toISOString(),
            created_at: C("2026-01-20").toISOString(),
            updated_at: C("2026-04-19", 19).toISOString(),
            deletedAt: null,
            deleted_at: null,
            archived_at: null
        }, {
            id: b("exam", "jee-main-2026-jan-result"),
            title: "JEE Main 2026 January Attempt Result",
            description: "Earlier logged JEE Main benchmark for before/after comparison.",
            date: C("2026-01-29", 9).toISOString(),
            start_time: "09:00",
            duration_minutes: 180,
            targetScore: 215,
            totalMarks: 300,
            total_marks: 300,
            syllabusIds: n,
            chapterIds: i,
            chapter_ids: i,
            priority: "medium",
            isDDay: !1,
            exam_type: "practice",
            color: "#0ea5e9",
            tags: ["JEE Main", "Result Logged", "Baseline"],
            tag_colors: {
                "JEE Main": "#38bdf8",
                "Result Logged": "#10b981",
                Baseline: "#f97316"
            },
            marking_scheme: {
                correct_marks: 4,
                negative_marks: 1
            },
            preparationProgress: 100,
            dailyStudyGoal: 720,
            totalPrepTime: 310 * 60,
            result_declaration_date: C("2026-02-12", 10).toISOString(),
            result: Pe({
                subjects: a,
                totalMarks: 300,
                scoredMarks: 219,
                targetScore: 215,
                resultDate: "2026-02-12",
                rank: 8200,
                percentile: 98.1,
                totalCandidates: 121e4,
                cutoffScore: 91,
                highestScore: 300,
                averageScore: 116,
                notes: "Baseline result used to show improvement from January to April and into the D-Day plan.",
                seed: 12
            }),
            analysis: {
                strengths: ["Inorganic retention", "Mechanics fundamentals", "Steady attempt order"],
                weaknesses: ["Calculus speed", "Heat and thermodynamics recall"],
                improvementAreas: ["Mixed calculus sets", "Formula flashcards"],
                notes: "Baseline result gives exam analytics a historical anchor.",
                recommendedChaptersForRevision: a.flatMap(u => u.chapters.slice(0, 3).map(f => f.id)),
                estimatedPreparationGap: 122
            },
            createdAt: C("2025-12-15").toISOString(),
            updatedAt: C("2026-02-12", 19).toISOString(),
            created_at: C("2025-12-15").toISOString(),
            updated_at: C("2026-02-12", 19).toISOString(),
            deletedAt: null,
            deleted_at: null,
            archived_at: null
        }, {
            id: b("exam", "jee-advanced-2027"),
            title: "JEE Advanced 2027",
            description: "Secondary high-stakes target after the January JEE Main D-Day attempt.",
            date: C("2027-05-17", 9).toISOString(),
            start_time: "09:00",
            duration_minutes: 360,
            targetScore: 190,
            totalMarks: 360,
            total_marks: 360,
            syllabusIds: n,
            chapterIds: i,
            chapter_ids: i,
            priority: "high",
            isDDay: !1,
            exam_type: "practice",
            color: "#ef4444",
            tags: ["JEE Advanced", "PCM", "Future"],
            tag_colors: {
                "JEE Advanced": "#ef4444",
                PCM: "#22c55e",
                Future: "#f59e0b"
            },
            marking_scheme: {
                correct_marks: 4,
                negative_marks: 2
            },
            preparationProgress: 34,
            dailyStudyGoal: 720,
            totalPrepTime: 12600,
            milestones: [{
                id: b("milestone", "advanced", 1),
                title: "Start integer-type weekly sets",
                dueDate: "2026-09-15",
                completed: !1
            }, {
                id: b("milestone", "advanced", 2),
                title: "Shift to advanced mixed mocks",
                dueDate: "2027-02-01",
                completed: !1
            }],
            analysis: {
                strengths: ["Mechanics base", "Physical chemistry numericals"],
                weaknesses: ["Proof-heavy maths", "Multi-concept physics questions"],
                improvementAreas: ["Advanced-level mixed problem selection", "Long-form solution review"],
                notes: "Future JEE Advanced target keeps the exam calendar realistic for Ranker students.",
                recommendedChaptersForRevision: a.flatMap(u => u.chapters.slice(4, 7).map(f => f.id)),
                estimatedPreparationGap: 210
            },
            createdAt: _(e, -45).toISOString(),
            updatedAt: e.toISOString(),
            created_at: _(e, -45).toISOString(),
            updated_at: e.toISOString(),
            deletedAt: null,
            deleted_at: null,
            archived_at: null
        }, {
            id: b("exam", "ugee-2027"),
            title: "UGEE 2027",
            description: "Backup research-track entrance with a separate readiness target.",
            date: C("2027-05-03", 9).toISOString(),
            start_time: "09:00",
            duration_minutes: 180,
            targetScore: 128,
            totalMarks: 180,
            total_marks: 180,
            syllabusIds: n,
            chapterIds: i.slice(0, 42),
            chapter_ids: i.slice(0, 42),
            priority: "medium",
            isDDay: !1,
            exam_type: "practice",
            color: "#8b5cf6",
            tags: ["UGEE", "Backup", "Future"],
            tag_colors: {
                UGEE: "#8b5cf6",
                Backup: "#6366f1",
                Future: "#f59e0b"
            },
            marking_scheme: {
                correct_marks: 4,
                negative_marks: 1
            },
            preparationProgress: 29,
            dailyStudyGoal: 720,
            totalPrepTime: 9600,
            analysis: {
                strengths: ["Logical reasoning speed", "Physics intuition"],
                weaknesses: ["Long comprehension stamina"],
                improvementAreas: ["Weekly SUPR-style mixed sets", "Timed comprehension review"],
                notes: "UGEE stays visible as an alternate pathway in the demo calendar.",
                recommendedChaptersForRevision: a.flatMap(u => u.chapters.slice(2, 4).map(f => f.id)),
                estimatedPreparationGap: 96
            },
            createdAt: _(e, -30).toISOString(),
            updatedAt: e.toISOString(),
            created_at: _(e, -30).toISOString(),
            updated_at: e.toISOString(),
            deletedAt: null,
            deleted_at: null,
            archived_at: null
        }, {
            id: b("exam", "comedk-2027"),
            title: "COMEDK 2027",
            description: "Engineering backup exam kept in the same Ranker prep calendar.",
            date: C("2027-05-09", 9).toISOString(),
            start_time: "09:00",
            duration_minutes: 180,
            targetScore: 152,
            totalMarks: 180,
            total_marks: 180,
            syllabusIds: n,
            chapterIds: i,
            chapter_ids: i,
            priority: "medium",
            isDDay: !1,
            exam_type: "practice",
            color: "#22c55e",
            tags: ["COMEDK", "Backup", "Future"],
            tag_colors: {
                COMEDK: "#22c55e",
                Backup: "#6366f1",
                Future: "#f59e0b"
            },
            marking_scheme: {
                correct_marks: 1,
                negative_marks: 0
            },
            preparationProgress: 37,
            dailyStudyGoal: 720,
            totalPrepTime: 10500,
            analysis: {
                strengths: ["High-speed objective solving", "Class 12 chemistry"],
                weaknesses: ["Sustaining accuracy across 180 questions"],
                improvementAreas: ["Daily 60-question speed block", "Error log by subject"],
                notes: "COMEDK is included so visitors see multiple exam tracks, not a single thin schedule.",
                recommendedChaptersForRevision: a.flatMap(u => u.chapters.slice(3, 5).map(f => f.id)),
                estimatedPreparationGap: 74
            },
            createdAt: _(e, -24).toISOString(),
            updatedAt: e.toISOString(),
            created_at: _(e, -24).toISOString(),
            updated_at: e.toISOString(),
            deletedAt: null,
            deleted_at: null,
            archived_at: null
        }, {
            id: b("exam", "bitsat-2027-session-1"),
            title: "BITSAT 2027 Session 1",
            description: "Additional PCM entrance track to make the demo calendar feel complete.",
            date: C("2027-05-24", 9).toISOString(),
            start_time: "09:00",
            duration_minutes: 180,
            targetScore: 310,
            totalMarks: 390,
            total_marks: 390,
            syllabusIds: n,
            chapterIds: i,
            chapter_ids: i,
            priority: "medium",
            isDDay: !1,
            exam_type: "practice",
            color: "#06b6d4",
            tags: ["BITSAT", "PCM", "Future"],
            tag_colors: {
                BITSAT: "#06b6d4",
                PCM: "#22c55e",
                Future: "#f59e0b"
            },
            marking_scheme: {
                correct_marks: 3,
                negative_marks: 1
            },
            preparationProgress: 31,
            dailyStudyGoal: 720,
            totalPrepTime: 9e3,
            analysis: {
                strengths: ["Speed-first chemistry", "Short physics questions"],
                weaknesses: ["English and LR blocks need consistency"],
                improvementAreas: ["Daily speed set", "Formula recall under timer"],
                notes: "Extra backup track adds depth for investors and teachers exploring the demo.",
                recommendedChaptersForRevision: a.flatMap(u => u.chapters.slice(5, 7).map(f => f.id)),
                estimatedPreparationGap: 88
            },
            createdAt: _(e, -20).toISOString(),
            updatedAt: e.toISOString(),
            created_at: _(e, -20).toISOString(),
            updated_at: e.toISOString(),
            deletedAt: null,
            deleted_at: null,
            archived_at: null
        }, {
            id: b("exam", "ugee-2026-benchmark"),
            title: "UGEE 2026 Benchmark Result",
            description: "Logged alternate-exam result so backup-exam analytics are not empty.",
            date: C("2026-05-04", 9).toISOString(),
            start_time: "09:00",
            duration_minutes: 180,
            targetScore: 124,
            totalMarks: 180,
            total_marks: 180,
            syllabusIds: n,
            chapterIds: i.slice(0, 42),
            chapter_ids: i.slice(0, 42),
            priority: "medium",
            isDDay: !1,
            exam_type: "practice",
            color: "#8b5cf6",
            tags: ["UGEE", "Result Logged", "Benchmark"],
            tag_colors: {
                UGEE: "#8b5cf6",
                "Result Logged": "#10b981",
                Benchmark: "#f97316"
            },
            marking_scheme: {
                correct_marks: 4,
                negative_marks: 1
            },
            preparationProgress: 100,
            dailyStudyGoal: 720,
            totalPrepTime: 8700,
            result_declaration_date: C("2026-05-10", 10).toISOString(),
            result: Pe({
                subjects: a,
                totalMarks: 180,
                scoredMarks: 132,
                targetScore: 124,
                resultDate: "2026-05-10",
                rank: 610,
                percentile: 96.2,
                totalCandidates: 16e3,
                cutoffScore: 104,
                highestScore: 171,
                averageScore: 82,
                notes: "UGEE benchmark result logged with full subject split for analytics.",
                seed: 22
            }),
            analysis: {
                strengths: ["Reasoning accuracy", "Short physics choices"],
                weaknesses: ["Comprehension pacing"],
                improvementAreas: ["Timed paragraph analysis", "Mixed SUPR sets"],
                notes: "Logged backup-exam result fills exam analytics beyond JEE Main.",
                recommendedChaptersForRevision: a.flatMap(u => u.chapters.slice(2, 5).map(f => f.id)),
                estimatedPreparationGap: 62
            },
            createdAt: C("2026-03-20").toISOString(),
            updatedAt: C("2026-05-10", 19).toISOString(),
            created_at: C("2026-03-20").toISOString(),
            updated_at: C("2026-05-10", 19).toISOString(),
            deletedAt: null,
            deleted_at: null,
            archived_at: null
        }, {
            id: b("exam", "comedk-2026-benchmark"),
            title: "COMEDK 2026 Benchmark Result",
            description: "Recent logged backup benchmark for score distribution and weak chapter panels.",
            date: C("2026-05-10", 9).toISOString(),
            start_time: "09:00",
            duration_minutes: 180,
            targetScore: 145,
            totalMarks: 180,
            total_marks: 180,
            syllabusIds: n,
            chapterIds: i,
            chapter_ids: i,
            priority: "medium",
            isDDay: !1,
            exam_type: "practice",
            color: "#22c55e",
            tags: ["COMEDK", "Result Logged", "Benchmark"],
            tag_colors: {
                COMEDK: "#22c55e",
                "Result Logged": "#10b981",
                Benchmark: "#f97316"
            },
            marking_scheme: {
                correct_marks: 1,
                negative_marks: 0
            },
            preparationProgress: 100,
            dailyStudyGoal: 720,
            totalPrepTime: 9240,
            result_declaration_date: C("2026-05-11", 10).toISOString(),
            result: Pe({
                subjects: a,
                totalMarks: 180,
                scoredMarks: 151,
                targetScore: 145,
                resultDate: "2026-05-11",
                rank: 920,
                percentile: 95.4,
                totalCandidates: 72e3,
                cutoffScore: 96,
                highestScore: 176,
                averageScore: 88,
                notes: "COMEDK benchmark shows high speed accuracy and supports backup track analytics.",
                seed: 24
            }),
            analysis: {
                strengths: ["Speed accuracy", "Class 12 chemistry coverage"],
                weaknesses: ["Late-paper fatigue"],
                improvementAreas: ["Fast mixed sets", "Rest-day placement before exam week"],
                notes: "Recent benchmark keeps the Exams analytics populated for visitors.",
                recommendedChaptersForRevision: a.flatMap(u => u.chapters.slice(6, 8).map(f => f.id)),
                estimatedPreparationGap: 48
            },
            createdAt: C("2026-03-26").toISOString(),
            updatedAt: C("2026-05-11", 19).toISOString(),
            created_at: C("2026-03-26").toISOString(),
            updated_at: C("2026-05-11", 19).toISOString(),
            deletedAt: null,
            deleted_at: null,
            archived_at: null
        }];
        h.push(...d);
        const A = t.filter(u => u.status === "analyzed").slice(0, 6).map((u, f) => ({
            id: b("test", f),
            title: `${a[f%a.length].name} Chapter Test ${f+1}`,
            date: u.date,
            totalMarks: 100,
            scoredMarks: u.subjectPerformance[f % 3].marksObtained,
            percentage: u.subjectPerformance[f % 3].percentage,
            subjects: [u.subjectPerformance[f % 3]].map(g => ({
                subjectId: g.subjectId,
                subjectName: g.subjectName,
                totalMarks: g.totalMarks,
                scoredMarks: g.marksObtained,
                percentage: g.percentage,
                chapterIds: g.chapterIds || []
            })),
            subjectId: u.subjectPerformance[f % 3].subjectId,
            analysis: "Chapter test added to make subject analytics non-empty in demo mode.",
            mistakes: u.mistakes.map(g => ({
                topicId: g.linkedTopicId || b("topic", "fallback"),
                count: 1 + f % 3,
                type: g.type === "skipped" ? "time" : g.type
            })),
            createdAt: u.createdAt
        }));
        return {
            exams: h,
            mockTests: t,
            tests: A
        }
    },
    cr = (a, e) => {
        const t = {
            chapter_meta: [],
            topics_log: [],
            resources: [],
            files_blobs: [],
            notes_content: [],
            key_points: [],
            mistakes_vault: [],
            questions_bank: [],
            dpp_test_records: [],
            flashcards: [],
            spaced_rep_queue: [],
            concept_map: [],
            activity_feed: [],
            chapter_settings: []
        };
        return a.forEach(s => {
            s.chapters.forEach((r, i) => {
                t.chapter_meta.push({
                    id: r.id,
                    globalStatus: r.completionPercentage && r.completionPercentage > 72 ? "Completed" : "In Progress",
                    difficulty: Math.min(5, Math.max(2, Math.round((r.metadata ?.estimatedTime || 180) / 120))),
                    streakDays: 3 + i % 9,
                    lastOpened: _(e, -(i % 7)).toISOString(),
                    lastStreakDate: $(_(e, -(i % 2))),
                    iconEmoji: s.name === "Physics" ? "P" : s.name === "Chemistry" ? "C" : "M"
                }), t.chapter_settings.push({
                    chapterId: r.id,
                    defaultSection: "overview"
                }), r.topics.forEach((n, o) => {
                    t.topics_log.push({
                        id: b("topic-log", n.id),
                        chapterId: r.id,
                        topicId: n.id,
                        masteryState: n.mastery === "Master" || n.mastery === "Enlightened" ? "mastered" : n.mastery === "Novice" ? "not-started" : "in-progress",
                        timeSpent: n.studyTime || 0,
                        notes: `Demo topic log for ${n.title}.`,
                        linkedResourceIds: [b("resource", r.id, 1)],
                        linkedQuestionIds: [b("question", n.id)],
                        updatedAt: e.toISOString()
                    })
                }), t.resources.push({
                    id: b("resource", r.id, 1),
                    chapterId: r.id,
                    title: `${r.title} Ranker Notes`,
                    type: "text",
                    url: "",
                    topicIds: r.topics.slice(0, 3).map(n => n.id),
                    tags: ["demo", s.name, "ranker"],
                    timestamps: [],
                    createdAt: _(e, -20).toISOString(),
                    updatedAt: e.toISOString()
                }, {
                    id: b("resource", r.id, 2),
                    chapterId: r.id,
                    title: `${r.title} PYQ Sprint`,
                    type: "link",
                    url: "",
                    topicIds: r.topics.slice(2, 6).map(n => n.id),
                    tags: ["pyq", "timed"],
                    timestamps: [],
                    createdAt: _(e, -15).toISOString(),
                    updatedAt: e.toISOString()
                }), t.notes_content.push({
                    id: b("notes", r.id, "chapter"),
                    chapterId: r.id,
                    layerType: "chapter",
                    markdown: `# ${r.title}

- High-yield formulas and exception cases.
- Common JEE Main traps from the last three demo mocks.
- Revision cue: solve a timed mixed set before marking this chapter strong.`,
                    lastModified: e.toISOString()
                }), r.topics.slice(0, 2).forEach(n => {
                    t.notes_content.push({
                        id: b("notes", r.id, n.id),
                        chapterId: r.id,
                        layerType: "topic",
                        topicId: n.id,
                        markdown: `## ${n.title}

- One-page summary.
- Two solved examples.
- Mistake pattern: rushing the final substitution.`,
                        lastModified: e.toISOString()
                    })
                }), r.topics.slice(0, 3).forEach((n, o) => {
                    t.key_points.push({
                        id: b("key-point", n.id),
                        chapterId: r.id,
                        topicId: n.id,
                        category: o === 0 ? "Formula" : o === 1 ? "Trap" : "Concept",
                        content: `${n.title}: remember the boundary condition before applying the shortcut.`,
                        isCritical: o === 0,
                        order: o,
                        createdAt: _(e, -10 + o).toISOString()
                    }), t.flashcards.push({
                        id: b("flashcard", n.id),
                        chapterId: r.id,
                        front: `What is the fastest check for ${n.title}?`,
                        back: `State the knowns, eliminate impossible options, then apply the standard ${s.name} relation.`,
                        topicId: n.id,
                        sourceType: "manual",
                        createdAt: _(e, -8).toISOString(),
                        smEaseFactor: 2.4,
                        smInterval: 3 + o,
                        smRepetitions: 2 + o,
                        nextReviewDate: $(_(e, o + 1))
                    }), t.spaced_rep_queue.push({
                        id: b("spaced", n.id),
                        chapterId: r.id,
                        itemType: "flashcard",
                        itemId: b("flashcard", n.id),
                        nextReviewDate: $(_(e, o + 1)),
                        easeFactor: 2.4,
                        interval: 3 + o,
                        repetitions: 2 + o
                    })
                }), r.topics.slice(0, 2).forEach((n, o) => {
                    t.mistakes_vault.push({
                        id: b("mistake", n.id),
                        chapterId: r.id,
                        topicId: n.id,
                        source: "JEE Main Full Mock",
                        questionText: `${n.title} sign/condition error`,
                        myAnswer: "Used shortcut without checking condition.",
                        correctAnswer: "Check limiting condition, then substitute.",
                        reflection: "Demo mistake from a timed mock: correct idea, wrong final condition. Fix: write the limiting case before solving the next 10 questions.",
                        errorType: o === 0 ? "Conceptual Gap" : "Silly Mistake",
                        severity: o === 0 ? "Moderate" : "Minor",
                        status: o === 0 ? "not_reviewed" : "conquered",
                        createdAt: _(e, -9).toISOString(),
                        updatedAt: e.toISOString()
                    })
                }), r.topics.slice(0, 6).forEach((n, o) => {
                    t.questions_bank.push({
                        id: b("question", n.id),
                        chapterId: r.id,
                        topicIds: [n.id],
                        content: `${n.title} mixed objective ${o+1}`,
                        source: o % 2 === 0 ? "JEE Main PYQ" : "Coaching DPP",
                        type: o % 3 === 0 ? "numerical" : "mcq",
                        difficulty: o % 3 === 0 ? "Hard" : o % 3 === 1 ? "Medium" : "Easy",
                        status: o % 4 === 0 ? "wrong" : "correct",
                        attemptHistory: [{
                            date: _(e, -o - 1).toISOString(),
                            status: o % 4 === 0 ? "wrong" : "correct"
                        }],
                        createdAt: _(e, -12).toISOString(),
                        updatedAt: e.toISOString()
                    })
                }), t.dpp_test_records.push({
                    id: b("dpp", r.id),
                    chapterId: r.id,
                    type: "DPP",
                    name: `${r.title} DPP - Accuracy Sprint`,
                    date: $(_(e, -(i % 12))),
                    score: 16 + i % 7,
                    maxScore: 25,
                    duration: 55,
                    questionIds: r.topics.slice(0, 4).map(n => b("question", n.id))
                }), t.concept_map.push({
                    chapterId: r.id,
                    nodes: r.topics.slice(0, 5).map((n, o) => ({
                        id: n.id,
                        label: n.title,
                        x: 120 + o * 120,
                        y: 120 + o % 2 * 80
                    })),
                    edges: r.topics.slice(0, 4).map((n, o) => ({
                        id: b("edge", n.id),
                        from: n.id,
                        to: r.topics[o + 1] ?.id || n.id,
                        label: "builds into"
                    })),
                    lastModified: e.toISOString()
                }), t.activity_feed.push({
                    id: b("activity", r.id, 1),
                    chapterId: r.id,
                    eventType: "question_attempted",
                    description: "Completed PYQ sprint",
                    timestamp: _(e, -1 - i % 5).toISOString()
                }, {
                    id: b("activity", r.id, 2),
                    chapterId: r.id,
                    eventType: "note_updated",
                    description: "Updated Ranker notes",
                    timestamp: _(e, -2 - i % 7).toISOString()
                })
            })
        }), t
    },
    lr = a => {
        const e = {
                id: b("group", "jee-ranker-room"),
                name: "JEE Ranker Room",
                description: "A focused PCM accountability room with mock review, PYQ sprints, and daily deep-work goals.",
                cover_url: null,
                logo_url: null,
                category: "JEE",
                slug: "jee-ranker-room",
                member_count: 128,
                owner_id: X,
                is_public: !0,
                created_at: _(a, -120).toISOString()
            },
            t = {
                id: b("group", "pcm-pyq-sprint"),
                name: "PCM PYQ Sprint",
                description: "Daily subject-wise PYQ challenges for JEE Main aspirants.",
                cover_url: null,
                logo_url: null,
                category: "Practice",
                slug: "pcm-pyq-sprint",
                member_count: 86,
                owner_id: b("user", "isha"),
                is_public: !0,
                created_at: _(a, -90).toISOString()
            },
            s = [{
                user_id: X,
                name: "Arnav Demo",
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${X}`,
                role: "owner",
                joined_at: _(a, -80).toISOString(),
                total_hours: 286
            }, {
                user_id: b("user", "isha"),
                name: "Isha",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=isha",
                role: "admin",
                joined_at: _(a, -72).toISOString(),
                total_hours: 242
            }, {
                user_id: b("user", "kabir"),
                name: "Kabir",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=kabir",
                role: "member",
                joined_at: _(a, -60).toISOString(),
                total_hours: 229
            }, {
                user_id: b("user", "meera"),
                name: "Meera",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
                role: "member",
                joined_at: _(a, -54).toISOString(),
                total_hours: 214
            }],
            r = s.map((c, d) => ({
                user_id: c.user_id,
                name: c.name,
                avatar_url: c.avatar_url || void 0,
                hours: [38.5, 35.25, 31.75, 28.4][d],
                rank: d + 1
            })).sort((c, d) => d.hours - c.hours),
            i = {
                trends: Array.from({
                    length: 7
                }, (c, d) => ({
                    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d],
                    hours: ie(22 + d * 2.8 + d % 2 * 4, 1),
                    sessions: 10 + d
                })),
                heatmap: Array.from({
                    length: 7
                }, (c, d) => Array.from({
                    length: 24
                }, (h, A) => A >= 6 && A <= 22 ? Math.max(0, Math.round((d + A) % 7 / 2)) : 0))
            },
            n = [{
                id: b("challenge", "ninety-pyq"),
                group_id: e.id,
                title: "90 PYQs in 72 hours",
                description: "Physics, Chemistry, and Mathematics mixed set.",
                goal: "90 tasks",
                goal_type: "tasks",
                goal_value: 90,
                start_time: _(a, -1).toISOString(),
                end_time: _(a, 2).toISOString(),
                participants_count: 42,
                color: "tasks",
                is_active: !0,
                created_at: _(a, -2).toISOString(),
                created_by: X,
                user_progress: 61,
                user_completed: !1,
                is_joined: !0,
                time_remaining: "2 days left"
            }, {
                id: b("challenge", "mock-analysis"),
                group_id: e.id,
                title: "Mock Analysis Night",
                description: "Analyze one full mock and publish three corrective actions.",
                goal: "3 sessions",
                goal_type: "sessions",
                goal_value: 3,
                start_time: _(a, -2).toISOString(),
                end_time: _(a, 1).toISOString(),
                participants_count: 29,
                color: "sessions",
                is_active: !0,
                created_at: _(a, -3).toISOString(),
                created_by: b("user", "isha"),
                user_progress: 2,
                user_completed: !1,
                is_joined: !0,
                time_remaining: "1 day left"
            }],
            o = [{
                id: b("discussion", "maths-time"),
                group_id: e.id,
                user_id: b("user", "kabir"),
                title: "How are you cutting Mathematics time below 65 minutes?",
                content: "I am losing time in coordinate geometry. Sharing a timer split helped in the last mock.",
                tags: ["mathematics", "mock-analysis"],
                likes_count: 18,
                replies_count: 2,
                is_solved: !1,
                created_at: _(a, -2).toISOString(),
                updated_at: _(a, -1).toISOString(),
                author: {
                    name: "Kabir",
                    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=kabir"
                }
            }, {
                id: b("discussion", "chemistry-memory"),
                group_id: e.id,
                user_id: b("user", "meera"),
                title: "Inorganic revision loop that finally stuck",
                content: "NCERT line scan, 20 assertion-reason questions, then error flashcards. Repeating every fourth day.",
                tags: ["chemistry", "revision"],
                likes_count: 31,
                replies_count: 3,
                is_solved: !0,
                created_at: _(a, -5).toISOString(),
                updated_at: _(a, -4).toISOString(),
                author: {
                    name: "Meera",
                    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera"
                }
            }];
        return {
            groups: [e, t],
            myGroups: [e, t],
            memberships: {
                [e.id]: {
                    id: b("membership", e.id, X),
                    role: "owner",
                    joined_at: _(a, -80).toISOString()
                },
                [t.id]: {
                    id: b("membership", t.id, X),
                    role: "member",
                    joined_at: _(a, -30).toISOString()
                }
            },
            membersByGroup: {
                [e.id]: s,
                [t.id]: s.slice(0, 3).map(c => ({ ...c,
                    role: c.role === "owner" ? "member" : c.role
                }))
            },
            statsByGroup: {
                [e.id]: {
                    total_hours: 1248.5,
                    weekly_hours: 134.2,
                    monthly_hours: 486.8,
                    total_sessions: 612,
                    group_streak: 27,
                    members_active_today: 18,
                    avg_session_minutes: 64,
                    peak_hour: 20,
                    top_contributor: {
                        user_id: X,
                        name: "Arnav Demo",
                        hours: 38.5
                    }
                },
                [t.id]: {
                    total_hours: 734.1,
                    weekly_hours: 92.6,
                    monthly_hours: 301.4,
                    total_sessions: 388,
                    group_streak: 19,
                    members_active_today: 11,
                    avg_session_minutes: 58,
                    peak_hour: 18,
                    top_contributor: {
                        user_id: b("user", "isha"),
                        name: "Isha",
                        hours: 35.25
                    }
                }
            },
            trendsByGroup: {
                [e.id]: i,
                [t.id]: i
            },
            milestonesByGroup: {
                [e.id]: [{
                    milestone_type: "1000_group_hours",
                    earned_at: _(a, -18).toISOString()
                }, {
                    milestone_type: "25_day_streak",
                    earned_at: _(a, -2).toISOString()
                }],
                [t.id]: [{
                    milestone_type: "500_group_hours",
                    earned_at: _(a, -12).toISOString()
                }]
            },
            announcementsByGroup: {
                [e.id]: [{
                    id: b("announcement", 1),
                    content: "Tonight: 9 PM mock analysis room. Bring one mistake pattern and one fix.",
                    pinned: !0,
                    author_id: X,
                    author_name: "Arnav Demo",
                    created_at: _(a, -1).toISOString()
                }],
                [t.id]: []
            },
            leaderboardsByGroup: {
                [e.id]: r,
                [t.id]: r.slice().reverse().map((c, d) => ({ ...c,
                    rank: d + 1,
                    hours: ie(c.hours * .8, 1)
                }))
            },
            globalLeaderboard: {
                rankings: r,
                period: "weekly",
                source: "redis",
                currentUserRank: r[0],
                display_names_resolved: !0
            },
            challenges: n,
            myChallenges: n,
            messagesByGroup: {
                [e.id]: [{
                    id: b("message", 1),
                    user_id: b("user", "isha"),
                    user_name: "Isha",
                    text: "Mock review thread is live. Drop one fix, not just the score.",
                    timestamp: _(a, -1).toISOString()
                }, {
                    id: b("message", 2),
                    user_id: X,
                    user_name: "Arnav Demo",
                    text: "Physics silly errors down from 8 to 3 after formula pre-check.",
                    timestamp: W(a, 19, 10).toISOString()
                }, {
                    id: b("message", 3),
                    user_id: b("user", "kabir"),
                    user_name: "Kabir",
                    text: "Starting a 50 minute coordinate drill now.",
                    timestamp: W(a, 19, 22).toISOString()
                }]
            },
            activeStudiersByGroup: {
                [e.id]: [{
                    userId: b("user", "isha"),
                    name: "Isha",
                    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=isha",
                    status: "focus",
                    startedAt: W(a, 19).toISOString(),
                    focusSubject: "Chemistry",
                    groupId: e.id,
                    sessionMinutes: 42,
                    topic: "Coordination Compounds",
                    chapter: "Coordination Compounds",
                    sessionType: "PYQ practice",
                    plannedDuration: "50m",
                    examTag: "JEE"
                }, {
                    userId: b("user", "kabir"),
                    name: "Kabir",
                    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=kabir",
                    status: "break",
                    startedAt: W(a, 18, 30).toISOString(),
                    focusSubject: "Mathematics",
                    groupId: e.id,
                    sessionMinutes: 51,
                    topic: "Straight Lines",
                    chapter: "Coordinate Geometry",
                    sessionType: "Timed drill",
                    plannedDuration: "60m",
                    examTag: "JEE"
                }]
            },
            discussions: o,
            repliesByDiscussion: {
                [o[0].id]: [{
                    id: b("reply", 1),
                    discussion_id: o[0].id,
                    user_id: X,
                    content: "I cap coordinate questions at 7 minutes, mark, and return after Chemistry.",
                    is_solution: !1,
                    likes_count: 7,
                    created_at: _(a, -1).toISOString(),
                    author: {
                        name: "Arnav Demo"
                    }
                }],
                [o[1].id]: [{
                    id: b("reply", 2),
                    discussion_id: o[1].id,
                    user_id: b("user", "isha"),
                    content: "The fourth-day repeat is the part that makes it stick.",
                    is_solution: !0,
                    likes_count: 12,
                    created_at: _(a, -4).toISOString(),
                    author: {
                        name: "Isha"
                    }
                }]
            },
            events: [{
                id: b("event", "mock-night"),
                title: "JEE Main Mock Analysis Night",
                description: "Break down one mock into weak chapters, action items, and next-week schedule.",
                event_type: "study_session",
                host_name: "Isotope Ranker Mentors",
                start_time: _(a, 2).toISOString(),
                end_time: _(a, 2).toISOString(),
                attendees_count: 56,
                max_attendees: 80,
                image_gradient: "from-blue-500 to-cyan-500",
                tags: ["JEE", "Mock Analysis"],
                is_featured: !0,
                created_at: _(a, -5).toISOString(),
                is_registered: !0
            }]
        }
    },
    Wt = () => {
        const a = new Date,
            e = ar(a),
            {
                sessions: t,
                dailyLogs: s
            } = sr(e, a),
            r = rr(e, a),
            i = ir(a),
            {
                exams: n,
                mockTests: o,
                tests: c
            } = or(e, a);
        return {
            profile: {
                id: X,
                name: "Arnav Demo",
                username: "jee-ranker-demo",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${X}`,
                bio: "Demo Ranker workspace for exploring IsotopeAI with JEE Main PCM data.",
                swot: {
                    strengths: ["Consistent Chemistry accuracy", "Strong mechanics base", "High mock review discipline"],
                    weaknesses: ["Calculus speed", "Modern physics recall", "Late-night fatigue after 10 PM"],
                    opportunities: ["Push mock average above 240", "Turn weak chapters into spaced repetition loops"],
                    threats: ["Skipping rest days", "Over-solving without post-mock correction"]
                },
                settings: {
                    theme: "system",
                    notifications: !0,
                    performanceMode: "standard"
                },
                focusSettings: {
                    defaultDuration: 50,
                    shortBreakDuration: 10,
                    longBreakDuration: 25,
                    autoStartBreaks: !1,
                    dailyGoalMinutes: 720,
                    notificationSound: !0,
                    sessionEndSound: !0,
                    pomodorosUntilLongBreak: 3,
                    notificationInterval: 30,
                    showPauseReasonPicker: !0,
                    showSessionCompletionCard: !0,
                    showQuestionTrackingInTimerPip: !0
                },
                createdAt: _(a, -120).toISOString(),
                updatedAt: a.toISOString(),
                isOnboarded: !0,
                currentOnboardingStep: 6,
                onboardingCompletedAt: _(a, -119).toISOString(),
                academic: {
                    institution: "IsotopeAI Demo School",
                    grade: "Class 12",
                    targetExams: ["JEE Main 2027", "JEE Advanced 2027", "UGEE 2027", "COMEDK 2027", "BITSAT 2027"],
                    primarySubjects: ["Physics", "Chemistry", "Mathematics"],
                    weeklyCapacity: 72,
                    gpaScale: "100",
                    semesterStart: $(_(a, -120)),
                    semesterEnd: $(_(a, 60))
                },
                studyPreferences: {
                    dailyGoalHours: 12,
                    preferredFocusMethod: "pomodoro",
                    pomodoroSettings: {
                        workDuration: 50,
                        shortBreakDuration: 10,
                        longBreakDuration: 25,
                        sessionsUntilLongBreak: 3
                    },
                    soundscapePreference: "lofi",
                    studentStatus: "exam",
                    dayOffset: 3,
                    weekStartDay: 1,
                    weekStartHour: 3,
                    weekStartMinute: 30,
                    dailyQuestionGoal: 120,
                    subjectQuestionGoals: Object.fromEntries(e.map(h => [h.id, 40]))
                },
                workflowPreferences: {
                    taskOrganizationStyle: "kanban",
                    studyEnvironment: ["quiet", "music", "library"],
                    notificationsEnabled: !0,
                    notificationTypes: {
                        taskReminders: !0,
                        sessionBreaks: !0,
                        dailySummary: !0,
                        achievements: !0
                    }
                },
                communityPreferences: {
                    interestedInStudyGroups: !0,
                    collaborationStyle: "group",
                    communitySubjects: ["Physics", "Chemistry", "Mathematics"],
                    shareProgress: !0
                },
                personalization: {
                    accentColor: "#84cc16",
                    dashboardLayout: "comfortable",
                    showWelcomeTeaser: !1,
                    dyslexiaFont: !1
                }
            },
            subjects: e,
            tasks: r,
            sessions: t,
            habits: i,
            dailyLogs: s,
            tests: c,
            exams: n,
            mockTests: o,
            timerState: null,
            chapterHub: cr(e, a),
            community: lr(a)
        }
    },
    J = a => typeof structuredClone == "function" ? structuredClone(a) : JSON.parse(JSON.stringify(a));
class dr {
    constructor() {
        this.data = Wt(), this.syncMetadata = new Map
    }
    reset() {
        this.data = Wt(), this.syncMetadata.clear()
    }
    getData() {
        return this.data
    }
    getCollection(e) {
        switch (e) {
            case l.TASKS:
                return this.data.tasks;
            case l.SESSIONS:
                return this.data.sessions;
            case l.SUBJECTS:
                return this.data.subjects;
            case l.HABITS:
                return this.data.habits;
            case l.DAILY_LOGS:
                return this.data.dailyLogs;
            case l.TESTS:
                return this.data.tests;
            case l.EXAMS:
                return this.data.exams;
            case l.MOCK_TESTS:
                return this.data.mockTests;
            default:
                throw new Error(`Unsupported demo collection: ${e}`)
        }
    }
    replaceCollection(e, t) {
        switch (e) {
            case l.TASKS:
                this.data.tasks = t;
                return;
            case l.SESSIONS:
                this.data.sessions = t;
                return;
            case l.SUBJECTS:
                this.data.subjects = t;
                return;
            case l.HABITS:
                this.data.habits = t;
                return;
            case l.DAILY_LOGS:
                this.data.dailyLogs = t;
                return;
            case l.TESTS:
                this.data.tests = t;
                return;
            case l.EXAMS:
                this.data.exams = t;
                return;
            case l.MOCK_TESTS:
                this.data.mockTests = t;
                return;
            default:
                throw new Error(`Unsupported demo collection: ${e}`)
        }
    }
    upsertIntoCollection(e, t) {
        const s = this.getCollection(e),
            r = s.findIndex(o => o.id === t.id),
            i = r >= 0 ? s[r] : null,
            n = { ...i ?? {},
                ...t,
                createdAt : t.createdAt ?? i ?.createdAt ?? L(),
                updatedAt : L()
            };
        r >= 0 ? s[r] = n : s.push(n)
    }
    async getItem(e, t) {
        return J(this.getCollection(e).find(s => s.id === t) ?? null)
    }
    async listItems(e) {
        return J(this.getCollection(e))
    }
    async upsertItem(e, t, s) {
        this.upsertIntoCollection(e, J(t))
    }
    async softDeleteItem(e, t, s) {
        const i = this.getCollection(e).find(n => n.id === t);
        i && (i.deletedAt = L())
    }
    async getLastSync(e) {
        return this.syncMetadata.get(e) ?? null
    }
    async setLastSync(e, t) {
        this.syncMetadata.set(e, t)
    }
    async getTasks(e) {
        const t = J(this.data.tasks);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveTask(e, t) {
        await this.upsertItem(l.TASKS, e, t)
    }
    async updateTask(e, t, s) {
        const r = await this.getItem(l.TASKS, e);
        r && await this.upsertItem(l.TASKS, { ...r,
            ...t,
            id: e
        }, s)
    }
    async deleteTask(e) {
        this.replaceCollection(l.TASKS, this.data.tasks.filter(t => t.id !== e))
    }
    async softDeleteTask(e, t) {
        await this.softDeleteItem(l.TASKS, e, t)
    }
    async getSessions(e) {
        const t = J(this.data.sessions);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveSession(e, t) {
        await this.upsertItem(l.SESSIONS, e, t)
    }
    async updateSession(e, t, s) {
        const r = await this.getItem(l.SESSIONS, e);
        r && await this.upsertItem(l.SESSIONS, { ...r,
            ...t,
            id: e
        }, s)
    }
    async deleteSession(e) {
        this.replaceCollection(l.SESSIONS, this.data.sessions.filter(t => t.id !== e))
    }
    async softDeleteSession(e, t) {
        await this.softDeleteItem(l.SESSIONS, e, t)
    }
    async getSubjects(e) {
        const t = J(this.data.subjects);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveSubject(e, t) {
        await this.upsertItem(l.SUBJECTS, e, t)
    }
    async updateSubject(e, t, s) {
        const r = await this.getItem(l.SUBJECTS, e);
        r && await this.upsertItem(l.SUBJECTS, { ...r,
            ...t,
            id: e
        }, s)
    }
    async deleteSubject(e, t) {
        await this.softDeleteItem(l.SUBJECTS, e, t)
    }
    async getHabits(e) {
        const t = J(this.data.habits);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveHabit(e, t) {
        await this.upsertItem(l.HABITS, e, t)
    }
    async updateHabit(e, t, s) {
        const r = await this.getItem(l.HABITS, e);
        r && await this.upsertItem(l.HABITS, { ...r,
            ...t,
            id: e
        }, s)
    }
    async deleteHabit(e, t) {
        await this.softDeleteItem(l.HABITS, e, t)
    }
    async getUserProfile() {
        return J(this.data.profile)
    }
    async saveUserProfile(e) {
        this.data.profile = J(e)
    }
    async getTimerState() {
        return J(this.data.timerState)
    }
    async saveTimerState(e) {
        this.data.timerState = J(e)
    }
    async clearTimerState() {
        this.data.timerState = null
    }
    async getDailyLogs(e) {
        const t = J(this.data.dailyLogs);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveDailyLog(e, t) {
        await this.upsertItem(l.DAILY_LOGS, { ...e,
            id: e.id || `log-${e.date}`
        }, t)
    }
    async softDeleteDailyLog(e, t) {
        await this.softDeleteItem(l.DAILY_LOGS, e, t)
    }
    async getTests(e) {
        const t = J(this.data.tests);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveTest(e, t) {
        await this.upsertItem(l.TESTS, e, t)
    }
    async deleteTest(e) {
        this.replaceCollection(l.TESTS, this.data.tests.filter(t => t.id !== e))
    }
    async softDeleteTest(e, t) {
        await this.softDeleteItem(l.TESTS, e, t)
    }
    async getExams(e) {
        const t = J(this.data.exams);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveExam(e, t) {
        await this.upsertItem(l.EXAMS, e, t)
    }
    async deleteExam(e) {
        this.replaceCollection(l.EXAMS, this.data.exams.filter(t => t.id !== e))
    }
    async softDeleteExam(e, t) {
        await this.softDeleteItem(l.EXAMS, e, t)
    }
    async getMockTests(e) {
        const t = J(this.data.mockTests);
        return e ?.includeDeleted ? t : t.filter(s => !s.deletedAt)
    }
    async saveMockTest(e, t) {
        await this.upsertItem(l.MOCK_TESTS, e, t)
    }
    async updateMockTest(e, t, s) {
        const r = await this.getItem(l.MOCK_TESTS, e);
        r && await this.upsertItem(l.MOCK_TESTS, { ...r,
            ...t,
            id: e
        }, s)
    }
    async deleteMockTest(e) {
        this.replaceCollection(l.MOCK_TESTS, this.data.mockTests.filter(t => t.id !== e))
    }
    async softDeleteMockTest(e, t) {
        await this.softDeleteItem(l.MOCK_TESTS, e, t)
    }
    async clearAll() {
        this.reset()
    }
}
const ba = new dr,
    xn = () => {
        ba.reset()
    },
    ur = "__isotope_kv_shadow__:";
class mr {
    constructor() {
        this.memoryFallback = new Map, this.forceBackupFallback = !1, this.lastAvailabilityCheck = 0, this.availabilityCheckInterval = 3e4, this.backupStore = new It(ur)
    }
    readFallbackValue(e) {
        const t = this.backupStore.getItem(e);
        return t !== null ? t : this.memoryFallback.has(e) ? this.memoryFallback.get(e) : null
    }
    async runRead(e, t) {
        if (this.forceBackupFallback && !await this.tryRecoverFromFallback()) return this.readFallbackValue(e);
        try {
            if (!await P.isAvailable()) return this.forceBackupFallback = !0, this.lastAvailabilityCheck = Date.now(), V("IndexedDB is unavailable, using backup storage for preferences."), this.readFallbackValue(e);
            const r = await t();
            if (Y(), r === null) {
                const i = this.backupStore.getItem(e);
                if (i !== null) return P.put("kv", {
                    key: e,
                    value: i
                }).catch(() => {}), i
            }
            return r
        } catch {
            return this.forceBackupFallback = !0, this.lastAvailabilityCheck = Date.now(), V("IndexedDB failed while reading preferences, using backup storage."), this.readFallbackValue(e)
        }
    }
    async runWrite(e, t, s, r) {
        let i = null;
        try {
            if (!await P.isAvailable()) throw new Error("IndexedDB unavailable");
            await s(), Y(), this.forceBackupFallback = !1
        } catch (n) {
            i = n, this.forceBackupFallback = !0, this.lastAvailabilityCheck = Date.now(), V("IndexedDB is unavailable, saving preferences to backup storage.")
        }
        try {
            r(), t !== void 0 ? this.memoryFallback.set(e, t) : this.memoryFallback.delete(e)
        } catch (n) {
            if (i) throw i instanceof Error ? i : n;
            console.error("[kvStore] Shadow backup write failed:", n)
        }
    }
    async tryRecoverFromFallback() {
        if (!this.forceBackupFallback) return !0;
        const e = Date.now();
        if (e - this.lastAvailabilityCheck < this.availabilityCheckInterval) return !1;
        this.lastAvailabilityCheck = e;
        try {
            if (!await P.isAvailable()) return !1;
            const s = this.backupStore.getAllKeys();
            for (const r of s) {
                const i = this.backupStore.getItem(r);
                i !== null && await P.put("kv", {
                    key: r,
                    value: i
                })
            }
            for (const [r, i] of this.memoryFallback.entries()) await P.put("kv", {
                key: r,
                value: i
            });
            return this.forceBackupFallback = !1, Y(), !0
        } catch {
            return !1
        }
    }
    async getItem(e) {
        return this.runRead(e, async () => (await P.get("kv", e)) ?.value ?? null)
    }
    async setItem(e, t) {
        await this.runWrite(e, t, async () => {
            await P.put("kv", {
                key: e,
                value: t
            })
        }, () => {
            this.backupStore.setItem(e, t)
        })
    }
    async removeItem(e) {
        await this.runWrite(e, void 0, async () => {
            await P.delete("kv", e)
        }, () => {
            this.backupStore.removeItem(e)
        })
    }
    async getAllKeys() {
        if (this.forceBackupFallback && !await this.tryRecoverFromFallback()) return Array.from(new Set([...this.backupStore.getAllKeys(), ...this.memoryFallback.keys()]));
        try {
            if (!await P.isAvailable()) throw new Error("IndexedDB unavailable");
            const t = await P.getAllKeys("kv"),
                s = this.backupStore.getAllKeys();
            return Y(), Array.from(new Set([...t, ...s]))
        } catch {
            return this.forceBackupFallback = !0, this.lastAvailabilityCheck = Date.now(), V("IndexedDB is unavailable, using backup storage for preferences."), Array.from(new Set([...this.backupStore.getAllKeys(), ...this.memoryFallback.keys()]))
        }
    }
    async clear() {
        let e = null;
        try {
            if (!await P.isAvailable()) throw new Error("IndexedDB unavailable");
            await P.clear("kv"), Y(), this.forceBackupFallback = !1
        } catch (t) {
            e = t, this.forceBackupFallback = !0, this.lastAvailabilityCheck = Date.now(), V("IndexedDB is unavailable, clearing backup storage instead.")
        }
        try {
            this.backupStore.clear(), this.memoryFallback.clear()
        } catch (t) {
            if (e) throw e instanceof Error ? e : t;
            console.error("[kvStore] Shadow backup clear failed:", t)
        }
    }
    async getByPrefix(e) {
        const s = (await this.getAllKeys()).filter(n => n.startsWith(e)),
            r = await Promise.all(s.map(async n => {
                const o = await this.getItem(n);
                return [n, o]
            })),
            i = {};
        for (const [n, o] of r) o !== null && (i[n] = o);
        return i
    }
    async removeByPrefix(e) {
        const s = (await this.getAllKeys()).filter(r => r.startsWith(e));
        await Promise.all(s.map(r => this.removeItem(r)))
    }
}
const x = new mr,
    pr = new Js,
    $t = () => ge() ? ba : pr,
    m = new Proxy({}, {
        get(a, e) {
            const t = $t()[e];
            return typeof t == "function" ? t.bind($t()) : t
        }
    }),
    fr = {
        getItem: async a => {
            const e = await x.getItem(a);
            return typeof e == "string" ? e : null
        },
        setItem: async (a, e) => {
            await x.setItem(a, e)
        },
        removeItem: async a => {
            await x.removeItem(a)
        }
    },
    hr = new Set([408, 429, 500, 502, 503, 504, 522, 524]),
    yr = new Set(["429", "ECONNABORTED", "ECONNREFUSED", "ECONNRESET", "ENETDOWN", "ENETUNREACH", "ETIMEDOUT", "UND_ERR_CONNECT_TIMEOUT", "UND_ERR_HEADERS_TIMEOUT", "UND_ERR_SOCKET"]),
    gr = ["network request failed", "network error", "failed to fetch", "fetch failed", "load failed", "timed out", "timeout", "gateway timeout", "service unavailable", "temporarily unavailable", "too many requests", "rate limit", "rate-limit", "connection reset", "connection refused"];

function _a(a) {
    if (typeof a == "string") return a;
    if (a && typeof a == "object") {
        const e = ["message", "details", "hint", "error_description", "statusText", "name"].map(t => a[t]).find(t => typeof t == "string" && t.trim().length > 0);
        if (typeof e == "string") return e
    }
    return "Unexpected cloud error"
}

function se(a, e = "Unexpected cloud error") {
    return _a(a) || e
}

function Z(a = "Cloud sync") {
    return `${a} is temporarily unavailable. Continuing in local mode and retrying later.`
}

function O(a) {
    if (!a) return !1;
    if (typeof a == "object") {
        const t = a.status ?? a.statusCode;
        if (typeof t == "number" && hr.has(t)) return !0;
        const s = a.code;
        if (typeof s == "string") {
            const r = s.toUpperCase();
            if (yr.has(r)) return !0
        }
    }
    const e = _a(a).toLowerCase();
    return gr.some(t => e.includes(t))
}
const Sr = 300 * 1e3,
    br = new Set([408, 429, 500, 502, 503, 504, 522, 524]),
    le = {
        blockedUntil: 0,
        reason: null,
        failureCount: 0
    },
    Aa = () => Date.now(),
    ka = () => Math.max(0, le.blockedUntil - Aa()),
    _r = a => a instanceof Error ? a.message : typeof a == "string" ? a : a && typeof a == "object" && typeof a.message == "string" ? a.message : Z("Cloud service");

function ye() {
    return ka() > 0
}

function Ar() {
    const a = ka(),
        e = new Error(le.reason || Z("Cloud service"));
    return e.name = "SupabaseCircuitBreakerError", e.code = "SUPABASE_CLOUD_DEGRADED", e.status = 503, e.statusCode = 503, e.retryAfterMs = a, e
}

function Jt(a) {
    O(a) && (le.failureCount += 1, le.blockedUntil = Aa() + Sr, le.reason = _r(a))
}

function wa() {
    le.failureCount === 0 && !le.reason || (le.failureCount = 0, le.blockedUntil = 0, le.reason = null)
}

function at() {
    wa()
}

function kr(a, e) {
    return ye() ? Promise.reject(Ar()) : fetch(a, e).then(t => (br.has(t.status) ? Jt({
        status: t.status,
        message: `Supabase request failed with status ${t.status}`
    }) : wa(), t)).catch(t => {
        throw Jt(t), t
    })
}
const wr = "__ISOTOPE_SUPABASE_URL__",
    Ia = "__ISOTOPE_SUPABASE_ANON_KEY__",
    M = () => !ge() && !!Ia,
    w = M() ? Va(wr, Ia, {
        global: {
            fetch: kr
        },
        auth: {
            autoRefreshToken: !1,
            persistSession: !0,
            detectSessionInUrl: !0,
            storage: fr,
            storageKey: "isotope-auth-token"
        }
    }) : null,
    st = "isotope_device_id",
    Vt = "device_id";
let rt = null;

function Ir() {
    const e = Date.now().toString(16).padStart(12, "0"),
        t = new Uint8Array(10);
    crypto.getRandomValues(t);
    const s = Array.from(t).map(r => r.toString(16).padStart(2, "0")).join("");
    return `${e.slice(0,8)}-${e.slice(8,12)}-7${s.slice(0,3)}-${s.slice(3,7)}-${s.slice(7,19)}`
}
async function dt() {
    return rt || (rt = (async () => {
        const a = await x.getItem(st);
        if (a) return a;
        const e = await x.getItem(Vt);
        if (e) return await x.setItem(st, e), e;
        const t = Ir();
        return await x.setItem(st, t), await x.setItem(Vt, t), t
    })()), rt
}

function G() {
    return new Date().toISOString()
}

function we(a, e) {
    const t = a ? new Date(a).getTime() : 0;
    return (e ? new Date(e).getTime() : 0) > t ? "remote" : "local"
}
const Yt = "isotope:sync:omitted-columns:v1",
    vr = {
        subjects: ["study_time"]
    },
    Qt = ["chapter_ids", "topic_ids", "time_allocation", "allocation_strategy", "time_allocation_synced"],
    Xt = ["questions_attempted", "questions_correct", "questions_incorrect", "questions_skipped", "target_questions", "questions_by_subject", "questions_by_chapter"],
    Zt = ["mode", "interruptions", "duration_minutes"],
    Er = ["id", "updated_at", "deleted_at"],
    re = {
        tasks: ["id", "user_id", "title", "subject", "subject_id", "chapter_id", "topic_id", "status", "priority", "due_date", "effort", "energy", "description", "subtasks", "linked_session_ids", "focus_session_ids", "total_focus_time", "completed_in_session", "completed_at", "created_at", "updated_at", "deleted_at", "device_id", "energy_level", "estimated_time", "is_recurring", "recurring_config", "parent_task_id", "is_recurring_instance"],
        subjects: ["id", "user_id", "name", "color", "gradient", "icon", "chapters", "exam_template_id", "exam_name", "is_custom", "topics", "syllabus_config", "created_at", "updated_at", "deleted_at", "study_time"],
        focus_sessions: ["id", "user_id", "subject_ids", "chapter_ids", "topic_ids", "task_ids", "subject", "subject_id", "topic", "duration", "planned_duration", "start_time", "end_time", "type", "task_type", "session_type", "description", "mode", "time_allocation", "allocation_strategy", "pause_logs", "total_pause_time", "interruptions", "efficiency", "productivity_rating", "notes", "completed_task_ids", "questions_attempted", "questions_correct", "questions_incorrect", "questions_skipped", "target_questions", "questions_by_subject", "questions_by_chapter", "completed", "created_at", "updated_at", "deleted_at", "duration_minutes", "device_id", "time_allocation_synced"],
        habits: ["id", "user_id", "name", "icon", "completed", "streak", "longest_streak", "frequency", "target_days", "completion_history", "last_completed_date", "created_at", "updated_at", "deleted_at"],
        exams: ["id", "user_id", "title", "date", "target_score", "total_marks", "syllabus_ids", "chapter_ids", "priority", "is_d_day", "preparation_progress", "daily_study_goal", "total_prep_time", "linked_mock_test_ids", "milestones", "revision_schedule", "result", "analysis", "created_at", "updated_at", "deleted_at", "type", "reminders"],
        daily_logs: ["id", "user_id", "date", "sleep_hours", "sleep_quality", "mood", "energy_level", "questions_solved", "questions_attempted", "questions_target", "questions_by_subject", "notes", "created_at", "updated_at", "deleted_at", "device_id"],
        tests: ["id", "user_id", "title", "date", "total_marks", "scored_marks", "percentage", "subjects", "subject_id", "analysis", "mistakes", "created_at", "updated_at", "deleted_at", "device_id"],
        mock_tests: ["id", "user_id", "name", "test_type", "date", "time", "categories", "environment", "duration", "total_questions", "expected_difficulty", "paper_url", "subject_performance", "total_marks", "scored_marks", "percentage", "rank", "target_score", "preparation_time", "confidence_level", "notes", "enable_mistake_tracking", "enable_takeaway_collection", "enable_review_reminders", "syllabus_covered", "chapters_covered", "mistakes", "takeaways", "status", "completed_at", "analyzed_at", "created_at", "updated_at", "deleted_at", "exam_id", "device_id"]
    },
    Tr = {
        tasks: [...re.tasks],
        subjects: re.subjects.filter(a => a !== "study_time"),
        focus_sessions: [...re.focus_sessions],
        habits: [...re.habits],
        exams: [...re.exams],
        daily_logs: [...re.daily_logs],
        tests: [...re.tests],
        mock_tests: [...re.mock_tests]
    },
    Cr = ["id", "user_id", "device_id", "updated_at"];
class Pr {
    constructor() {
        this.state = {
            status: "idle",
            lastSyncAt: null,
            error: null,
            collectionStatus: {
                profile: "idle",
                tasks: "idle",
                subjects: "idle",
                focus_sessions: "idle",
                habits: "idle",
                exams: "idle",
                daily_logs: "idle",
                tests: "idle",
                mock_tests: "idle"
            }
        }, this.listeners = new Set, this.storeRefreshCallbacks = new Set, this.isSyncing = !1, this.unsupportedTables = new Set, this.omittedColumnsByTable = {}, this.persistedOmittedColumnsByTable = {}, this.deviceIdPromise = dt().catch(e => `temp-${Date.now()}-${Math.random().toString(36).slice(2,11)}`), this.initializeAdaptiveOmittedColumns(), this.adaptiveColumnsReady = this.loadPersistedOmittedColumns()
    }
    onStoreRefresh(e) {
        return this.storeRefreshCallbacks.add(e), () => this.storeRefreshCallbacks.delete(e)
    }
    notifyStoreRefresh(e) {
        this.storeRefreshCallbacks.forEach(t => {
            try {
                t(e)
            } catch {}
        });
        try {
            window.dispatchEvent(new CustomEvent("isotope:sync_refresh", {
                detail: {
                    collection: e
                }
            }))
        } catch {}
    }
    subscribe(e) {
        return this.listeners.add(e), e(this.state), () => this.listeners.delete(e)
    }
    updateState(e) {
        this.state = { ...this.state,
            ...e
        }, this.listeners.forEach(t => t(this.state))
    }
    setCollectionStatus(e, t) {
        this.state.collectionStatus[e] = t, this.listeners.forEach(s => s(this.state))
    }
    getState() {
        return this.state
    }
    setDegradedMode(e, t = Z("Cloud sync")) {
        this.updateState({
            status: "degraded",
            error: O(e) ? t : se(e, t)
        })
    }
    getFailureStatus(e) {
        return O(e) ? "degraded" : "error"
    }
    markSyncFailure(e, t = "Sync failed") {
        if (O(e)) {
            this.setDegradedMode(e, Z("Cloud sync"));
            return
        }
        this.updateState({
            status: "error",
            error: se(e, t)
        })
    }
    async runSyncOperation(e) {
        if (!this.isSyncing) {
            this.isSyncing = !0, this.updateState({
                status: "syncing",
                error: null
            });
            try {
                await e(), this.updateState({
                    status: "success",
                    lastSyncAt: G(),
                    error: null
                })
            } catch (t) {
                this.markSyncFailure(t, "Sync failed")
            } finally {
                this.isSyncing = !1
            }
        }
    }
    async pullCloudSnapshot(e, t) {
        await this.pullProfile(e), t && await Promise.all([this.pullTasks(e), this.pullSubjects(e), this.pullFocusSessions(e), this.pullHabits(e), this.pullExams(e), this.pullDailyLogs(e), this.pullTests(e), this.pullMockTests(e)])
    }
    async canBootstrapFromCloud(e, t) {
        if (!M() || !w || !t || !e || e.startsWith("local-")) return !1;
        try {
            const [s, r, i, n, o, c, d, h, A] = await Promise.all([m.getTasks(), m.getSubjects(), m.getSessions(), m.getHabits(), m.getExams(), m.getDailyLogs ? m.getDailyLogs() : Promise.resolve([]), m.getTests ? m.getTests() : Promise.resolve([]), m.getMockTests ? m.getMockTests() : Promise.resolve([]), m.getUserProfile()]);
            return !(!!A || s.length > 0 || r.length > 0 || i.length > 0 || n.length > 0 || o.length > 0 || c.length > 0 || d.length > 0 || h.length > 0)
        } catch {
            return !1
        }
    }
    async downloadCloudSnapshot(e, t) {
        !M() || !w || !e || e.startsWith("local-") || await this.runSyncOperation(async () => {
            await this.pullCloudSnapshot(e, t)
        })
    }
    async uploadDirtyLocal(e, t) {
        !M() || !w || !e || e.startsWith("local-") || await this.runSyncOperation(async () => {
            const s = await m.getUserProfile();
            s && await this.pushProfile(e, s), t && await this.pushAllDataDelta(e)
        })
    }
    async fullManualSync(e, t) {
        !M() || !w || !e || e.startsWith("local-") || await this.runSyncOperation(async () => {
            const s = await m.getUserProfile();
            s && await this.pushProfile(e, s), t && await this.pushAllDataDelta(e), await this.pullCloudSnapshot(e, t)
        })
    }
    async syncOnLogin(e, t) {
        await this.downloadCloudSnapshot(e, t)
    }
    async syncDelta(e, t) {
        await this.fullManualSync(e, t)
    }
    async pushAllDataDelta(e) {
        if (w) try {
            const [t, s, r, i, n, o, c, d, h, A, u, f, g, y, I, T] = await Promise.all([m.getTasks({
                includeDeleted: !0
            }), m.getSubjects({
                includeDeleted: !0
            }), m.getSessions({
                includeDeleted: !0
            }), m.getHabits({
                includeDeleted: !0
            }), m.getExams({
                includeDeleted: !0
            }), m.getDailyLogs({
                includeDeleted: !0
            }), m.getTests({
                includeDeleted: !0
            }), m.getMockTests({
                includeDeleted: !0
            }), m.getLastSync("tasks"), m.getLastSync("subjects"), m.getLastSync("focus_sessions"), m.getLastSync("habits"), m.getLastSync("exams"), m.getLastSync("daily_logs"), m.getLastSync("tests"), m.getLastSync("mock_tests")]), k = this.filterItemsChangedSinceLastSync(t, h), E = this.filterItemsChangedSinceLastSync(s, A), z = this.filterItemsChangedSinceLastSync(r, u), R = this.filterItemsChangedSinceLastSync(i, f), H = this.filterItemsChangedSinceLastSync(n, g), N = this.filterItemsChangedSinceLastSync(o, y), D = this.filterItemsChangedSinceLastSync(c, I), ne = this.filterItemsChangedSinceLastSync(d, T);
            k.length > 0 && await this.batchUpsert("tasks", k, e), E.length > 0 && await this.batchUpsert("subjects", E, e), z.length > 0 && await this.batchUpsert("focus_sessions", z, e), R.length > 0 && await this.batchUpsert("habits", R, e), H.length > 0 && await this.batchUpsert("exams", H, e), N.length > 0 && await this.batchUpsert("daily_logs", N, e), D.length > 0 && await this.batchUpsert("tests", D, e), ne.length > 0 && await this.batchUpsert("mock_tests", ne, e)
        } catch (t) {
            if (O(t)) throw t
        }
    }
    filterItemsChangedSinceLastSync(e = [], t) {
        if (!t || e.length === 0) return e;
        const s = new Date(t).getTime();
        return Number.isNaN(s) ? e : e.filter(r => {
            const i = r.updatedAt || r.updated_at || r.deletedAt || r.deleted_at || r.createdAt || r.created_at;
            if (!i) return !0;
            const n = new Date(i).getTime();
            return Number.isNaN(n) || n >= s
        })
    }
    async batchUpsert(e, t, s) {
        if (!w || t.length === 0 || this.unsupportedTables.has(e)) return;
        const r = 50;
        let i = 0,
            n = 0,
            o = null;
        const c = await this.deviceIdPromise;
        for (let d = 0; d < t.length; d += r) {
            const h = t.slice(d, d + r),
                u = h.map(f => e === "focus_sessions" ? this.sanitizeFocusSession(f) : e === "tasks" ? this.sanitizeTask(f) : e === "subjects" ? this.sanitizeSubject(f) : e === "exams" ? this.sanitizeExam(f) : f).map(f => ({ ...this.buildCloudPayload(e, f, s, c)
                }));
            try {
                const f = await this.upsertAdaptive(e, u, {
                    onConflict: "id",
                    ignoreDuplicates: !1
                });
                if (f.success) {
                    if (f.skipped) return;
                    i += h.length
                } else {
                    !o && O(f.error) && (o = f.error);
                    for (const g of u) try {
                        const y = await this.upsertAdaptive(e, g);
                        y.success ? i++ : (n++, !o && O(y.error) && (o = y.error))
                    } catch (y) {
                        n++, !o && O(y) && (o = y)
                    }
                }
            } catch (f) {
                n += h.length, !o && O(f) && (o = f)
            }
        }
        if (o) throw o
    }
    async pullProfile(e) {
        this.setCollectionStatus("profile", "syncing");
        try {
            const {
                data: t,
                error: s
            } = await w.from("user_profiles").select("profile_data, updated_at").eq("user_id", e).single();
            if (s) {
                if (s.code === "PGRST116") return this.setCollectionStatus("profile", "success"), null;
                throw s
            }
            return t ?.profile_data ? (await m.saveUserProfile(t.profile_data), this.setCollectionStatus("profile", "success"), this.notifyStoreRefresh("profile"), t.profile_data) : (this.setCollectionStatus("profile", "success"), null)
        } catch (t) {
            throw this.setCollectionStatus("profile", this.getFailureStatus(t)), t
        }
    }
    async pullTasks(e) {
        this.setCollectionStatus("tasks", "syncing");
        try {
            const t = G(),
                {
                    data: s,
                    skipped: r,
                    degraded: i
                } = await this.pullRemoteRows("tasks", e);
            if (r) {
                this.setCollectionStatus("tasks", "success");
                return
            }
            if (s && s.length > 0) {
                const n = await m.getTasks({
                        includeDeleted: !0
                    }),
                    o = this.mergeById(n, s, "updatedAt", "updated_at");
                for (const c of o) await m.saveTask(this.normalizeTask(c))
            }
            await this.maybeAdvanceLastSync("tasks", t, i), this.setCollectionStatus("tasks", "success"), this.notifyStoreRefresh("tasks")
        } catch (t) {
            throw this.setCollectionStatus("tasks", this.getFailureStatus(t)), t
        }
    }
    async pullSubjects(e) {
        this.setCollectionStatus("subjects", "syncing");
        try {
            const t = G(),
                {
                    data: s,
                    skipped: r,
                    degraded: i
                } = await this.pullRemoteRows("subjects", e);
            if (r) {
                this.setCollectionStatus("subjects", "success");
                return
            }
            if (s && s.length > 0) {
                const n = await m.getSubjects({
                        includeDeleted: !0
                    }),
                    o = this.mergeSubjects(n, s);
                for (const c of o) await m.saveSubject(this.normalizeSubject(c))
            }
            await this.maybeAdvanceLastSync("subjects", t, i), this.setCollectionStatus("subjects", "success"), this.notifyStoreRefresh("subjects")
        } catch (t) {
            throw this.setCollectionStatus("subjects", this.getFailureStatus(t)), t
        }
    }
    async pullFocusSessions(e) {
        this.setCollectionStatus("focus_sessions", "syncing");
        try {
            const t = G(),
                {
                    data: s,
                    skipped: r,
                    degraded: i
                } = await this.pullRemoteRows("focus_sessions", e);
            if (r) {
                this.setCollectionStatus("focus_sessions", "success");
                return
            }
            if (s && s.length > 0) {
                const n = await m.getSessions({
                        includeDeleted: !0
                    }),
                    o = this.mergeById(n, s, "updatedAt", "updated_at");
                for (const c of o) await m.saveSession(this.normalizeSession(c))
            }
            await this.maybeAdvanceLastSync("focus_sessions", t, i), this.setCollectionStatus("focus_sessions", "success"), this.notifyStoreRefresh("focus_sessions")
        } catch (t) {
            throw this.setCollectionStatus("focus_sessions", this.getFailureStatus(t)), t
        }
    }
    async pullHabits(e) {
        this.setCollectionStatus("habits", "syncing");
        try {
            const t = G(),
                {
                    data: s,
                    skipped: r,
                    degraded: i
                } = await this.pullRemoteRows("habits", e);
            if (r) {
                this.setCollectionStatus("habits", "success");
                return
            }
            if (s && s.length > 0) {
                const n = await m.getHabits({
                        includeDeleted: !0
                    }),
                    o = this.mergeById(n, s, "updatedAt", "updated_at");
                for (const c of o) await m.saveHabit(this.normalizeHabit(c))
            }
            await this.maybeAdvanceLastSync("habits", t, i), this.setCollectionStatus("habits", "success"), this.notifyStoreRefresh("habits")
        } catch (t) {
            throw this.setCollectionStatus("habits", this.getFailureStatus(t)), t
        }
    }
    async pullExams(e) {
        this.setCollectionStatus("exams", "syncing");
        try {
            const t = G(),
                {
                    data: s,
                    skipped: r,
                    degraded: i
                } = await this.pullRemoteRows("exams", e);
            if (r) {
                this.setCollectionStatus("exams", "success");
                return
            }
            if (s && s.length > 0) {
                const n = await m.getExams({
                        includeDeleted: !0
                    }),
                    o = this.mergeById(n, s, "updatedAt", "updated_at");
                for (const c of o) await m.saveExam(this.normalizeExam(c))
            }
            await this.maybeAdvanceLastSync("exams", t, i), this.setCollectionStatus("exams", "success"), this.notifyStoreRefresh("exams")
        } catch (t) {
            throw this.setCollectionStatus("exams", this.getFailureStatus(t)), t
        }
    }
    async pullDailyLogs(e) {
        this.setCollectionStatus("daily_logs", "syncing");
        try {
            const t = G(),
                {
                    data: s,
                    skipped: r,
                    degraded: i
                } = await this.pullRemoteRows("daily_logs", e);
            if (r) {
                this.setCollectionStatus("daily_logs", "success");
                return
            }
            if (s && s.length > 0 && m.saveDailyLog) {
                const n = await m.getDailyLogs({
                        includeDeleted: !0
                    }),
                    o = this.mergeById(n, s, "updatedAt", "updated_at");
                for (const c of o) await m.saveDailyLog(this.normalizeDailyLog(c))
            }
            await this.maybeAdvanceLastSync("daily_logs", t, i), this.setCollectionStatus("daily_logs", "success"), this.notifyStoreRefresh("daily_logs")
        } catch (t) {
            const s = this.getFailureStatus(t);
            if (this.setCollectionStatus("daily_logs", s), s === "degraded") throw t
        }
    }
    async pullTests(e) {
        this.setCollectionStatus("tests", "syncing");
        try {
            const t = G(),
                {
                    data: s,
                    skipped: r,
                    degraded: i
                } = await this.pullRemoteRows("tests", e);
            if (r) {
                this.setCollectionStatus("tests", "success");
                return
            }
            if (s && s.length > 0 && m.saveTest) {
                const n = await m.getTests({
                        includeDeleted: !0
                    }),
                    o = this.mergeById(n, s, "updatedAt", "updated_at");
                for (const c of o) await m.saveTest(this.normalizeTest(c))
            }
            await this.maybeAdvanceLastSync("tests", t, i), this.setCollectionStatus("tests", "success"), this.notifyStoreRefresh("tests")
        } catch (t) {
            const s = this.getFailureStatus(t);
            if (this.setCollectionStatus("tests", s), s === "degraded") throw t
        }
    }
    async pullMockTests(e) {
        if (this.unsupportedTables.has("mock_tests")) {
            this.setCollectionStatus("mock_tests", "success");
            return
        }
        this.setCollectionStatus("mock_tests", "syncing");
        try {
            const t = G(),
                {
                    data: s,
                    skipped: r,
                    degraded: i
                } = await this.pullRemoteRows("mock_tests", e);
            if (r) {
                this.setCollectionStatus("mock_tests", "success");
                return
            }
            if (s && s.length > 0 && m.saveMockTest) {
                const n = await m.getMockTests({
                        includeDeleted: !0
                    }),
                    o = this.mergeById(n, s, "updatedAt", "updated_at");
                for (const c of o) await m.saveMockTest(this.normalizeMockTest(c))
            }
            await this.maybeAdvanceLastSync("mock_tests", t, i), this.setCollectionStatus("mock_tests", "success"), this.notifyStoreRefresh("mock_tests")
        } catch (t) {
            if (this.isTableMissingError(t, "mock_tests")) {
                this.markTableUnsupported("mock_tests"), this.setCollectionStatus("mock_tests", "success");
                return
            }
            const s = this.getFailureStatus(t);
            if (this.setCollectionStatus("mock_tests", s), s === "degraded") throw t
        }
    }
    async pushProfile(e, t, s) {
        if (!(!M() || !w) && !(!e || e.startsWith("local-"))) try {
            const r = Ns(t),
                {
                    error: i
                } = await w.from("user_profiles").upsert({
                    user_id: e,
                    profile_data: r,
                    updated_at: G()
                });
            if (i) throw i;
            const n = this.buildPublicUserUpdates(r, s);
            if (n) {
                const {
                    error: o
                } = await w.from("users").update(n).eq("id", e);
                if (o) throw o
            }
        } catch (r) {
            O(r) && this.setDegradedMode(r, Z("Cloud profile sync"))
        }
    }
    async pushPublicProfileFields(e, t, s) {
        if (!(!M() || !w) && !(!e || e.startsWith("local-"))) try {
            const r = this.buildPublicUserUpdates(t, s, {
                includeAvatar: !1
            });
            if (!r) return;
            const {
                error: i
            } = await w.from("users").update(r).eq("id", e);
            if (i) throw i
        } catch (r) {
            O(r) && this.setDegradedMode(r, Z("Public profile sync"))
        }
    }
    async pushRecord(e, t, s, r) {
        if (!(!M() || !w) && !(!e || e.startsWith("local-")) && t && !this.unsupportedTables.has(s)) try {
            const i = await this.deviceIdPromise,
                n = this.buildCloudPayload(s, r, e, i),
                o = await this.upsertAdaptive(s, n);
            if (!o.success) throw o.error
        } catch (i) {
            if (this.isTableMissingError(i, s)) {
                this.markTableUnsupported(s);
                return
            }
        }
    }
    async deleteRecord(e, t, s, r) {
        if (!(!M() || !w) && !(!e || e.startsWith("local-")) && t && !this.unsupportedTables.has(s)) try {
            const {
                error: i
            } = await w.from(s).update({
                deleted_at: G(),
                updated_at: G()
            }).eq("id", r).eq("user_id", e);
            if (i) throw i
        } catch (i) {
            if (this.isTableMissingError(i, s)) {
                this.markTableUnsupported(s);
                return
            }
        }
    }
    async pushAllData(e) {
        if (!(!M() || !w) && !(!e || e.startsWith("local-"))) {
            this.updateState({
                status: "syncing"
            });
            try {
                const [t, s, r, i, n, o, c, d, h] = await Promise.all([m.getTasks({
                    includeDeleted: !0
                }), m.getSubjects({
                    includeDeleted: !0
                }), m.getSessions({
                    includeDeleted: !0
                }), m.getHabits({
                    includeDeleted: !0
                }), m.getExams({
                    includeDeleted: !0
                }), m.getDailyLogs ? m.getDailyLogs({
                    includeDeleted: !0
                }) : Promise.resolve([]), m.getTests ? m.getTests({
                    includeDeleted: !0
                }) : Promise.resolve([]), m.getMockTests ? m.getMockTests({
                    includeDeleted: !0
                }) : Promise.resolve([]), m.getUserProfile()]);
                h && await this.pushProfile(e, h), t.length > 0 && await this.batchUpsert("tasks", t, e), s.length > 0 && await this.batchUpsert("subjects", s, e), r.length > 0 && await this.batchUpsert("focus_sessions", r, e), i.length > 0 && await this.batchUpsert("habits", i, e), n.length > 0 && await this.batchUpsert("exams", n, e), o && o.length > 0 && await this.batchUpsert("daily_logs", o, e), c && c.length > 0 && await this.batchUpsert("tests", c, e), d && d.length > 0 && await this.batchUpsert("mock_tests", d, e), this.updateState({
                    status: "success",
                    lastSyncAt: G()
                })
            } catch (t) {
                if (O(t)) {
                    this.setDegradedMode(t, Z("Cloud sync"));
                    return
                }
                throw this.updateState({
                    status: "error",
                    error: se(t, "Sync failed")
                }), t
            }
        }
    }
    mergeById(e, t, s, r) {
        const i = new Map;
        for (const n of e) i.set(n.id, n);
        for (const n of t) {
            const o = i.get(n.id);
            if (!o) i.set(n.id, n);
            else {
                const c = o[s] || o.updated_at || o.createdAt,
                    d = n[r] || n.updated_at;
                we(c, d) === "remote" && i.set(n.id, n)
            }
        }
        return Array.from(i.values())
    }
    mergeSubjects(e, t) {
        const s = new Map;
        for (const r of e) s.set(r.id, { ...r
        });
        for (const r of t) {
            const i = s.get(r.id);
            if (!i) s.set(r.id, r);
            else {
                const n = this.mergeChapters(i.chapters || [], r.chapters || []),
                    o = this.mergeSubjectSyllabusConfig(i, r),
                    c = i.updatedAt || i.updated_at || i.createdAt,
                    d = r.updatedAt || r.updated_at;
                we(c, d) === "remote" ? s.set(r.id, { ...r,
                    chapters: n,
                    syllabusConfig: o
                }) : s.set(i.id, { ...i,
                    chapters: n,
                    syllabusConfig: o
                })
            }
        }
        return Array.from(s.values())
    }
    mergeSubjectSyllabusConfig(e, t) {
        const s = e.syllabusConfig ?? e.syllabus_config,
            r = t.syllabusConfig ?? t.syllabus_config;
        if (!s) return r;
        if (!r) return s;
        const i = e.updatedAt || e.updated_at || e.createdAt || e.created_at,
            n = t.updatedAt || t.updated_at || t.createdAt || t.created_at,
            o = we(i, n) === "remote",
            c = o ? r : s,
            d = o ? s : r,
            h = [...c.columns || []],
            A = new Map;
        h.forEach(g => {
            const y = g.name ?.trim().toLowerCase();
            y && A.set(y, g.id), A.set(g.id, g.id)
        });
        for (const g of d.columns || []) {
            const y = g.name ?.trim().toLowerCase(),
                I = y ? A.get(y) : void 0;
            if (I) {
                A.set(g.id, I);
                continue
            }
            h.push({ ...g,
                order: h.length
            }), y && A.set(y, g.id), A.set(g.id, g.id)
        }
        const u = g => g ? Object.entries(g).reduce((y, [I, T]) => {
                if (!T) return y;
                const [k, E] = I.split("::");
                if (!k || !E) return y;
                const z = A.get(E) || E;
                return y[`${k}::${z}`] = !0, y
            }, {}) : {},
            f = { ...d.priorities || {}
            };
        return Object.entries(c.priorities || {}).forEach(([g, y]) => {
            y != null && (f[g] = y)
        }), {
            subjectId: c.subjectId || e.id || t.id,
            columns: h.map((g, y) => ({ ...g,
                order: y
            })),
            checkState: { ...u(d.checkState),
                ...u(c.checkState)
            },
            priorities: f
        }
    }
    mergeChapters(e, t) {
        const s = new Map;
        for (const r of e) s.set(r.id, { ...r
        });
        for (const r of t) {
            const i = s.get(r.id);
            if (!i) s.set(r.id, r);
            else {
                const n = this.mergeTopics(i.topics || [], r.topics || []),
                    o = i.updatedAt || i.updated_at || i.createdAt,
                    c = r.updatedAt || r.updated_at;
                we(o, c) === "remote" ? s.set(r.id, { ...r,
                    topics: n
                }) : s.set(i.id, { ...i,
                    topics: n
                })
            }
        }
        return Array.from(s.values())
    }
    mergeTopics(e, t) {
        const s = new Map;
        for (const r of e) s.set(r.id, { ...r
        });
        for (const r of t) {
            const i = s.get(r.id);
            if (!i) s.set(r.id, r);
            else {
                const n = i.updatedAt || i.updated_at || i.createdAt,
                    o = r.updatedAt || r.updated_at;
                we(n, o) === "remote" && s.set(r.id, r)
            }
        }
        return Array.from(s.values())
    }
    normalizeTask(e) {
        return gt({
            id: e.id,
            title: e.title,
            subject: e.subject,
            subjectId: e.subject_id || e.subjectId,
            chapterId: e.chapter_id || e.chapterId,
            topicId: e.topic_id || e.topicId,
            status: e.status,
            priority: e.priority,
            dueDate: e.due_date || e.dueDate,
            effort: e.effort,
            energy: e.energy,
            description: e.description,
            subtasks: e.subtasks,
            linkedSessionIds: e.linked_session_ids || e.linkedSessionIds,
            focusSessionIds: e.focus_session_ids || e.focusSessionIds,
            totalFocusTime: e.total_focus_time || e.totalFocusTime || 0,
            completedInSession: e.completed_in_session || e.completedInSession,
            completedAt: e.completed_at || e.completedAt,
            createdAt: e.created_at || e.createdAt,
            updatedAt: e.updated_at || e.updatedAt,
            deletedAt: e.deleted_at || e.deletedAt,
            deviceId: e.device_id || e.deviceId,
            energyLevel: e.energy_level ?? e.energyLevel,
            estimatedTime: e.estimated_time ?? e.estimatedTime,
            isRecurring: e.is_recurring ?? e.isRecurring,
            recurringConfig: e.recurring_config ?? e.recurringConfig,
            parentTaskId: e.parent_task_id ?? e.parentTaskId,
            isRecurringInstance: e.is_recurring_instance ?? e.isRecurringInstance
        })
    }
    normalizeSubject(e) {
        return St({
            id: e.id,
            name: e.name,
            color: e.color,
            gradient: e.gradient,
            icon: e.icon,
            chapters: e.chapters,
            examTemplateId: e.exam_template_id || e.examTemplateId,
            examName: e.exam_name || e.examName,
            isCustom: e.is_custom ?? e.isCustom ?? !0,
            createdAt: e.created_at || e.createdAt,
            updatedAt: e.updated_at || e.updatedAt,
            deletedAt: e.deleted_at || e.deletedAt,
            topics: e.topics,
            syllabusConfig: e.syllabus_config ?? e.syllabusConfig
        })
    }
    normalizeSession(e) {
        return bt({
            id: e.id,
            subjectIds: e.subject_ids ?? e.subjectIds,
            chapterIds: e.chapter_ids ?? e.chapterIds,
            topicIds: e.topic_ids ?? e.topicIds,
            taskIds: e.task_ids ?? e.taskIds,
            subject: e.subject,
            subjectId: e.subject_id ?? e.subjectId,
            topic: e.topic,
            duration: e.duration,
            plannedDuration: e.planned_duration ?? e.plannedDuration,
            startTime: e.start_time ?? e.startTime,
            endTime: e.end_time ?? e.endTime,
            type: e.type,
            taskType: e.task_type ?? e.taskType,
            sessionType: e.session_type ?? e.sessionType,
            description: e.description,
            mode: e.mode,
            timeAllocation: e.time_allocation ?? e.timeAllocation,
            allocationStrategy: e.allocation_strategy ?? e.allocationStrategy,
            pauseLogs: e.pause_logs ?? e.pauseLogs,
            totalPauseTime: e.total_pause_time ?? e.totalPauseTime ?? 0,
            interruptions: e.interruptions,
            efficiency: e.efficiency,
            productivityRating: e.productivity_rating ?? e.productivityRating,
            notes: e.notes,
            completedTaskIds: e.completed_task_ids ?? e.completedTaskIds,
            questionsAttempted: e.questions_attempted ?? e.questionsAttempted,
            questionsCorrect: e.questions_correct ?? e.questionsCorrect,
            questionsIncorrect: e.questions_incorrect ?? e.questionsIncorrect,
            questionsSkipped: e.questions_skipped ?? e.questionsSkipped,
            targetQuestions: e.target_questions ?? e.targetQuestions,
            questionsBySubject: e.questions_by_subject ?? e.questionsBySubject,
            questionsByChapter: e.questions_by_chapter ?? e.questionsByChapter,
            completed: e.completed,
            createdAt: e.created_at ?? e.createdAt,
            updatedAt: e.updated_at ?? e.updatedAt,
            deletedAt: e.deleted_at ?? e.deletedAt,
            durationMinutes: e.duration_minutes ?? e.durationMinutes,
            timeAllocationSynced: e.time_allocation_synced ?? e.timeAllocationSynced
        })
    }
    normalizeHabit(e) {
        return ha({
            id: e.id,
            name: e.name,
            icon: e.icon,
            completed: e.completed,
            streak: e.streak,
            longestStreak: e.longest_streak || e.longestStreak,
            frequency: e.frequency,
            targetDays: e.target_days || e.targetDays,
            completionHistory: e.completion_history || e.completionHistory,
            lastCompletedDate: e.last_completed_date || e.lastCompletedDate,
            createdAt: e.created_at || e.createdAt,
            updatedAt: e.updated_at || e.updatedAt,
            deletedAt: e.deleted_at || e.deletedAt
        })
    }
    normalizeExam(e) {
        return kt({
            id: e.id,
            title: e.title,
            date: e.date,
            targetScore: e.target_score ?? e.targetScore,
            totalMarks: e.total_marks ?? e.totalMarks,
            syllabusIds: e.syllabus_ids ?? e.syllabusIds,
            chapterIds: e.chapter_ids ?? e.chapterIds,
            createdAt: e.created_at || e.createdAt,
            updatedAt: e.updated_at || e.updatedAt,
            deletedAt: e.deleted_at || e.deletedAt,
            priority: e.priority,
            isDDay: e.is_d_day ?? e.isDDay,
            preparationProgress: e.preparation_progress ?? e.preparationProgress,
            dailyStudyGoal: e.daily_study_goal ?? e.dailyStudyGoal,
            totalPrepTime: e.total_prep_time ?? e.totalPrepTime,
            linkedMockTestIds: e.linked_mock_test_ids ?? e.linkedMockTestIds,
            milestones: e.milestones,
            revisionSchedule: e.revision_schedule ?? e.revisionSchedule,
            result: e.result,
            analysis: e.analysis,
            type: e.type,
            reminders: e.reminders
        })
    }
    normalizeDailyLog(e) {
        return _t({
            id: e.id,
            date: e.date,
            sleepHours: Number(e.sleep_hours ?? e.sleepHours ?? 0),
            sleepQuality: e.sleep_quality ?? e.sleepQuality,
            mood: e.mood,
            energyLevel: e.energy_level ?? e.energyLevel,
            questionsSolved: e.questions_solved ?? e.questionsSolved,
            questionsAttempted: e.questions_attempted ?? e.questionsAttempted,
            questionsTarget: e.questions_target ?? e.questionsTarget,
            questionsBySubject: e.questions_by_subject ?? e.questionsBySubject,
            notes: e.notes,
            createdAt: e.created_at || e.createdAt,
            updatedAt: e.updated_at || e.updatedAt,
            deletedAt: e.deleted_at || e.deletedAt,
            deviceId: e.device_id || e.deviceId
        })
    }
    normalizeTest(e) {
        return At({
            id: e.id,
            title: e.title,
            date: e.date,
            totalMarks: e.total_marks ?? e.totalMarks,
            scoredMarks: e.scored_marks ?? e.scoredMarks,
            percentage: Number(e.percentage ?? 0),
            subjects: e.subjects,
            subjectId: e.subject_id ?? e.subjectId,
            analysis: e.analysis,
            mistakes: e.mistakes,
            createdAt: e.created_at || e.createdAt,
            updatedAt: e.updated_at || e.updatedAt,
            deletedAt: e.deleted_at || e.deletedAt,
            deviceId: e.device_id || e.deviceId
        })
    }
    normalizeMockTest(e) {
        return wt({
            id: e.id,
            name: e.name,
            testType: e.test_type ?? e.testType,
            date: e.date,
            time: e.time,
            categories: e.categories,
            environment: e.environment,
            duration: e.duration,
            totalQuestions: e.total_questions ?? e.totalQuestions,
            expectedDifficulty: e.expected_difficulty ?? e.expectedDifficulty,
            paperUrl: e.paper_url ?? e.paperUrl,
            subjectPerformance: e.subject_performance ?? e.subjectPerformance,
            totalMarks: e.total_marks ?? e.totalMarks,
            scoredMarks: e.scored_marks ?? e.scoredMarks,
            percentage: Number(e.percentage ?? 0),
            rank: e.rank,
            targetScore: e.target_score ?? e.targetScore,
            preparationTime: e.preparation_time ?? e.preparationTime,
            confidenceLevel: e.confidence_level ?? e.confidenceLevel,
            notes: e.notes,
            enableMistakeTracking: e.enable_mistake_tracking ?? e.enableMistakeTracking,
            enableTakeawayCollection: e.enable_takeaway_collection ?? e.enableTakeawayCollection,
            enableReviewReminders: e.enable_review_reminders ?? e.enableReviewReminders,
            syllabusCovered: e.syllabus_covered ?? e.syllabusCovered,
            chaptersCovered: e.chapters_covered ?? e.chaptersCovered,
            mistakes: e.mistakes,
            takeaways: e.takeaways,
            status: e.status,
            completedAt: e.completed_at ?? e.completedAt,
            analyzedAt: e.analyzed_at ?? e.analyzedAt,
            createdAt: e.created_at || e.createdAt,
            updatedAt: e.updated_at || e.updatedAt,
            deletedAt: e.deleted_at || e.deletedAt,
            examId: e.exam_id ?? e.examId
        })
    }
    getPublicDisplayName(e) {
        const t = typeof e ?.username == "string" ? e.username.trim() : "";
        return t || (typeof e ?.name == "string" ? e.name.trim() : "")
    }
    buildPublicUserUpdates(e, t, s = {}) {
        const r = s.includeAvatar ?? !0,
            i = this.getPublicDisplayName(e),
            n = this.getPublicDisplayName(t),
            o = typeof e.avatar == "string" && e.avatar !== "" ? e.avatar : null,
            c = typeof t ?.avatar == "string" && t.avatar !== "" ? t.avatar : null,
            d = {};
        return t ? (i !== n && i && (d.name = i), r && o !== c && (d.avatar_url = o)) : (i && (d.name = i), r && o && (d.avatar_url = o)), Object.keys(d).length === 0 ? null : { ...d,
            updated_at: G()
        }
    }
    toSnakeCase(e) {
        const t = {};
        for (const s in e)
            if (Object.prototype.hasOwnProperty.call(e, s)) {
                const r = s.replace(/[A-Z]/g, i => `_${i.toLowerCase()}`);
                t[r] = e[s]
            }
        return t
    }
    sanitizeTask(e) {
        return De("tasks", e, "cloud")
    }
    sanitizeSubject(e) {
        return fa(e)
    }
    sanitizeExam(e) {
        return De("exams", e, "cloud")
    }
    initializeAdaptiveOmittedColumns() {
        Object.keys(re).forEach(e => {
            this.resetAdaptiveOmittedColumns(e)
        })
    }
    async loadPersistedOmittedColumns() {
        try {
            const e = await x.getItem(Yt);
            if (!e) return;
            const t = JSON.parse(e);
            this.persistedOmittedColumnsByTable = Object.fromEntries(Object.entries(t).map(([s, r]) => [s, new Set(r || [])])), this.initializeAdaptiveOmittedColumns()
        } catch {}
    }
    async ensureAdaptiveColumnsReady() {
        await this.adaptiveColumnsReady
    }
    persistAdaptiveOmittedColumns() {
        try {
            const e = Object.fromEntries(Object.entries(this.persistedOmittedColumnsByTable).map(([t, s]) => [t, Array.from(s || [])]));
            x.setItem(Yt, JSON.stringify(e))
        } catch {}
    }
    compactPayload(e) {
        return Object.fromEntries(Object.entries(e).filter(([, t]) => t !== void 0))
    }
    pickWriteColumns(e, t) {
        const s = new Set([...Tr[e], ...Cr]);
        return Object.fromEntries(Object.entries(t).filter(([r]) => s.has(r)))
    }
    sanitizeFocusSession(e) {
        return { ...e,
            duration: e.duration != null ? Math.round(e.duration) : e.duration,
            plannedDuration: e.plannedDuration != null ? Math.round(e.plannedDuration) : e.plannedDuration,
            totalPauseTime: e.totalPauseTime != null ? Math.round(e.totalPauseTime) : 0,
            efficiency: e.efficiency != null ? Math.round(e.efficiency) : e.efficiency,
            productivityRating: e.productivityRating != null ? Math.round(e.productivityRating) : e.productivityRating,
            durationMinutes: e.durationMinutes != null ? Math.round(e.durationMinutes) : e.durationMinutes,
            interruptions: e.interruptions != null ? Math.round(e.interruptions) : e.interruptions,
            pauseLogs: Array.isArray(e.pauseLogs) ? e.pauseLogs.map(t => ({ ...t,
                duration: t.duration != null ? Math.round(t.duration) : 0
            })) : e.pauseLogs
        }
    }
    getSelectColumns(e) {
        const t = this.getOmittedColumnSet(e),
            s = re[e].filter(r => !t.has(r));
        return s.length > 0 ? s.join(", ") : Er.filter(r => !t.has(r)).join(", ") || "id"
    }
    resetAdaptiveOmittedColumns(e) {
        const t = vr[e] || [],
            s = Array.from(this.persistedOmittedColumnsByTable[e] || []);
        this.omittedColumnsByTable[e] = new Set([...t, ...s])
    }
    async maybeAdvanceLastSync(e, t, s) {
        s || await m.setLastSync(e, t)
    }
    async selectAdaptive(e, t) {
        if (!w) return {
            data: [],
            skipped: !1,
            degraded: !1
        };
        const s = this.getAdaptiveAttemptLimit(e);
        let r = !1;
        for (let i = 0; i < s; i++) {
            const {
                data: n,
                error: o
            } = await t(this.getSelectColumns(e));
            if (!o) return {
                data: n || [],
                skipped: !1,
                degraded: r
            };
            if (this.isTableMissingError(o, e)) return this.markTableUnsupported(e), {
                data: [],
                skipped: !0,
                degraded: !1
            };
            const c = this.getMissingColumnName(o);
            if (c) {
                if (r = !0, !this.omitMissingColumns(e, c)) throw o;
                continue
            }
            throw o
        }
        throw new Error(`Adaptive select exceeded retry budget for ${e}`)
    }
    async pullRemoteRows(e, t) {
        await this.ensureAdaptiveColumnsReady(), this.resetAdaptiveOmittedColumns(e);
        const s = await m.getLastSync(e);
        return this.selectAdaptive(e, async r => {
            let i = w.from(e).select(r).eq("user_id", t);
            s && (i = i.gt("updated_at", s));
            const {
                data: n,
                error: o
            } = await i.order("updated_at", {
                ascending: !0
            });
            return {
                data: n || null,
                error: o
            }
        })
    }
    getOmittedColumnSet(e) {
        return this.omittedColumnsByTable[e] || (this.omittedColumnsByTable[e] = new Set), this.omittedColumnsByTable[e]
    }
    getAdaptiveAttemptLimit(e, t) {
        const s = t ? Array.from(new Set((Array.isArray(t) ? t : [t]).flatMap(r => Object.keys(r)))) : re[e];
        return Math.max(6, s.length + 1)
    }
    omitMissingColumns(e, t) {
        const s = this.getOmittedColumnSet(e);
        let r = !1;
        return this.getRelatedMissingColumns(e, t).forEach(i => {
            s.has(i) || (s.add(i), this.persistedOmittedColumnsByTable[e] || (this.persistedOmittedColumnsByTable[e] = new Set), this.persistedOmittedColumnsByTable[e].add(i), r = !0)
        }), r && this.persistAdaptiveOmittedColumns(), r
    }
    getRelatedMissingColumns(e, t) {
        if (e === "focus_sessions") {
            if (Qt.includes(t)) return Qt;
            if (Xt.includes(t)) return Xt;
            if (Zt.includes(t)) return Zt
        }
        return [t]
    }
    omitKnownUnsupportedColumns(e, t) {
        const s = this.getOmittedColumnSet(e);
        if (s.size === 0) return t;
        const r = { ...t
        };
        return s.forEach(i => {
            delete r[i]
        }), r
    }
    buildCloudPayload(e, t, s, r) {
        let i = De(e, t, "cloud");
        e === "focus_sessions" && (i = this.sanitizeFocusSession(i)), e === "tasks" && (i = this.sanitizeTask(i)), e === "subjects" && (i = this.sanitizeSubject(i)), e === "exams" && (i = this.sanitizeExam(i));
        const n = { ...this.toSnakeCase(i),
            user_id: s,
            device_id: r,
            updated_at: t.updatedAt || t.updated_at || G()
        };
        return this.omitKnownUnsupportedColumns(e, this.compactPayload(this.pickWriteColumns(e, n)))
    }
    getMissingColumnName(e) {
        const t = typeof e ?.message == "string" ? e.message : "",
            s = [/Could not find the '([^']+)' column/, /column ['"]([^'"]+)['"](?: of relation ['"][^'"]+['"])? does not exist/i, /record ['"][^'"]+['"] has no field ['"]([^'"]+)['"]/i];
        for (const r of s) {
            const i = t.match(r);
            if (i ?.[1]) return i[1]
        }
        return null
    }
    isTableMissingError(e, t) {
        return !e || e.code !== "PGRST205" ? !1 : t ? (typeof e.message == "string" ? e.message : "").includes(`public.${t}`) : !0
    }
    markTableUnsupported(e) {
        this.unsupportedTables.has(e) || this.unsupportedTables.add(e)
    }
    async upsertAdaptive(e, t, s) {
        if (!w) return {
            success: !0,
            skipped: !1
        };
        if (await this.ensureAdaptiveColumnsReady(), this.unsupportedTables.has(e)) return {
            success: !0,
            skipped: !0
        };
        const r = this.getAdaptiveAttemptLimit(e, t);
        let i = Array.isArray(t) ? t.map(n => this.omitKnownUnsupportedColumns(e, n)) : this.omitKnownUnsupportedColumns(e, t);
        for (let n = 0; n < r; n++) {
            const {
                error: o
            } = await w.from(e).upsert(i, s);
            if (!o) return {
                success: !0,
                skipped: !1
            };
            if (this.isTableMissingError(o, e)) return this.markTableUnsupported(e), {
                success: !0,
                skipped: !0
            };
            const c = this.getMissingColumnName(o);
            if (c) {
                if (!this.omitMissingColumns(e, c)) return {
                    success: !1,
                    skipped: !1,
                    error: o
                };
                i = Array.isArray(i) ? i.map(h => this.omitKnownUnsupportedColumns(e, h)) : this.omitKnownUnsupportedColumns(e, i);
                continue
            }
            return {
                success: !1,
                skipped: !1,
                error: o
            }
        }
        return {
            success: !1,
            skipped: !1,
            error: new Error(`Adaptive upsert exceeded retry budget for ${e}`)
        }
    }
}
const va = new Pr;

function ea(a) {
    return typeof a == "string" ? a.trim() : ""
}

function Ea(a, e = "Student") {
    const t = ea(a ?.username),
        s = ea(a ?.name);
    return t || s || e
}

function Mr(a) {
    return Ea(a, "").length > 0
}
const Ta = 1440 * 60 * 1e3,
    xr = 120 * 1e3,
    Le = "isotope:user:",
    Se = new Map;
let ta = !1;
const je = () => {
        ta || (ta = !0, (async () => {
            const a = await x.getByPrefix(Le);
            Object.entries(a).forEach(([e, t]) => {
                try {
                    if (typeof t != "string") return;
                    const s = JSON.parse(t),
                        r = e.slice(Le.length);
                    r && Se.set(r, s)
                } catch {}
            })
        })())
    },
    Dr = a => {
        je(), Se.set(a.userId, a), x.setItem(`${Le}${a.userId}`, JSON.stringify(a))
    },
    Ca = a => {
        je(), Se.delete(a), x.removeItem(`${Le}${a}`)
    };

function Ct(a) {
    je();
    const e = Se.get(a);
    if (!e) return null;
    const s = e.name === "Student" || e.name === "Study Buddy" ? xr : Ta;
    return Date.now() - e.fetchedAt > s ? (Ca(a), null) : e
}

function Pt(a) {
    try {
        Dr(a)
    } catch {}
}

function Or(a) {
    const e = new Map,
        t = [];
    return a.forEach(s => {
        const r = Ct(s);
        r ? e.set(s, r) : t.push(s)
    }), {
        cached: e,
        missing: t
    }
}
async function Pa(a) {
    const e = new Map;
    if (!w || a.length === 0) return e;
    const t = new Map,
        s = new Map,
        r = new Set(a);
    try {
        const {
            data: i,
            error: n
        } = await w.from("user_profiles").select("user_id, profile_data").in("user_id", a);
        !n && i && i.forEach(o => {
            if (o.profile_data) {
                t.set(o.user_id, o.profile_data);
                const c = Mr(o.profile_data),
                    d = typeof o.profile_data ?.avatar == "string" || typeof o.profile_data ?.avatarUrl == "string";
                c && d && r.delete(o.user_id)
            }
        })
    } catch {}
    if (r.size > 0) try {
        const {
            data: i,
            error: n
        } = await w.from("users").select("id, name, avatar_url").in("id", Array.from(r));
        !n && i && i.forEach(o => {
            s.set(o.id, o)
        })
    } catch {}
    return a.forEach(i => {
        const n = t.get(i),
            o = s.get(i),
            c = typeof o ?.name == "string" && o.name.trim() ? o.name.trim() : "Student",
            d = Ea(n, c),
            h = n ?.avatar || n ?.avatarUrl || o ?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
            A = {
                userId: i,
                name: d,
                avatarUrl: h,
                fetchedAt: Date.now()
            };
        e.set(i, A), Pt(A)
    }), e
}
async function Mt(a) {
    const e = [...new Set(a)].filter(i => i);
    if (e.length === 0) return new Map;
    const {
        cached: t,
        missing: s
    } = Or(e);
    return s.length === 0 || (await Pa(s)).forEach((i, n) => {
        t.set(n, i)
    }), t
}
async function Lr(a) {
    if (!a) return null;
    const e = Ct(a);
    return e || (await Mt([a])).get(a) || null
}

function Rr(a, e, t) {
    if (!a) return !1;
    je();
    const s = Se.get(a),
        r = o => !o || o === "Student" || o === "Study Buddy" || o === "Anonymous",
        i = o => !o || o.includes("dicebear.com");
    let n = !1;
    if (!s)(!r(e) || !i(t) || e || t) && (n = !0);
    else {
        const o = e && e !== s.name && !r(e),
            c = t && t !== s.avatarUrl && !i(t);
        (o || c || Date.now() - s.fetchedAt > Ta / 2) && (n = !0)
    }
    if (n) {
        const o = {
            userId: a,
            name: (r(e) ? s ?.name : e) || e || "Student",
            avatarUrl: (i(t) ? s ?.avatarUrl : t) || t || `https://api.dicebear.com/7.x/avataaars/svg?seed=${a}`,
            fetchedAt: Date.now()
        };
        return Pt(o), !0
    }
    return !1
}
async function Nr(a) {
    return a.forEach(e => {
        Ca(e)
    }), Pa(a)
}

function jr() {
    je();
    const a = Array.from(Se.keys());
    Se.clear(), a.forEach(e => {
        x.removeItem(`${Le}${e}`)
    })
}
async function Br(a) {
    if (a.length === 0) return a;
    const e = a.map(s => s.user_id),
        t = await Mt(e);
    return a.forEach(s => {
        const r = t.get(s.user_id);
        r && (r.name && r.name !== "Student" ? s.name = r.name : s.name || (s.name = "Student"), r.avatarUrl && (s.avatar_url = r.avatarUrl))
    }), a
}
const Ur = {
    get: Ct,
    set: Pt,
    getMultiple: Mt,
    getSingle: Lr,
    refresh: Nr,
    clearAll: jr,
    enrich: Br,
    updateFromPayload: Rr
};

function Ma(a, e) {
    let t;
    try {
        t = a()
    } catch {
        return
    }
    return {
        getItem: r => {
            var i;
            const n = c => c === null ? null : JSON.parse(c, void 0),
                o = (i = t.getItem(r)) != null ? i : null;
            return o instanceof Promise ? o.then(n) : n(o)
        },
        setItem: (r, i) => t.setItem(r, JSON.stringify(i, void 0)),
        removeItem: r => t.removeItem(r)
    }
}
const ut = a => e => {
        try {
            const t = a(e);
            return t instanceof Promise ? t : {
                then(s) {
                    return ut(s)(t)
                },
                catch (s) {
                    return this
                }
            }
        } catch (t) {
            return {
                then(s) {
                    return this
                },
                catch (s) {
                    return ut(s)(t)
                }
            }
        }
    },
    Fr = (a, e) => (t, s, r) => {
        let i = {
                storage: Ma(() => localStorage),
                partialize: y => y,
                version: 0,
                merge: (y, I) => ({ ...I,
                    ...y
                }),
                ...e
            },
            n = !1;
        const o = new Set,
            c = new Set;
        let d = i.storage;
        if (!d) return a((...y) => {
            console.warn(`[zustand persist middleware] Unable to update item '${i.name}', the given storage is currently unavailable.`), t(...y)
        }, s, r);
        const h = () => {
                const y = i.partialize({ ...s()
                });
                return d.setItem(i.name, {
                    state: y,
                    version: i.version
                })
            },
            A = r.setState;
        r.setState = (y, I) => (A(y, I), h());
        const u = a((...y) => (t(...y), h()), s, r);
        r.getInitialState = () => u;
        let f;
        const g = () => {
            var y, I;
            if (!d) return;
            n = !1, o.forEach(k => {
                var E;
                return k((E = s()) != null ? E : u)
            });
            const T = ((I = i.onRehydrateStorage) == null ? void 0 : I.call(i, (y = s()) != null ? y : u)) || void 0;
            return ut(d.getItem.bind(d))(i.name).then(k => {
                if (k)
                    if (typeof k.version == "number" && k.version !== i.version) {
                        if (i.migrate) {
                            const E = i.migrate(k.state, k.version);
                            return E instanceof Promise ? E.then(z => [!0, z]) : [!0, E]
                        }
                        console.error("State loaded from storage couldn't be migrated since no migrate function was provided")
                    } else return [!1, k.state];
                return [!1, void 0]
            }).then(k => {
                var E;
                const [z, R] = k;
                if (f = i.merge(R, (E = s()) != null ? E : u), t(f, !0), z) return h()
            }).then(() => {
                T ?.(f, void 0), f = s(), n = !0, c.forEach(k => k(f))
            }).catch(k => {
                T ?.(void 0, k)
            })
        };
        return r.persist = {
            setOptions: y => {
                i = { ...i,
                    ...y
                }, y.storage && (d = y.storage)
            },
            clearStorage: () => {
                d ?.removeItem(i.name)
            },
            getOptions: () => i,
            rehydrate: () => g(),
            hasHydrated: () => n,
            onHydrate: y => (o.add(y), () => {
                o.delete(y)
            }),
            onFinishHydration: y => (c.add(y), () => {
                c.delete(y)
            })
        }, i.skipHydration || g(), f || u
    },
    zr = Fr,
    xa = /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    qr = ["gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com", "msn.com", "yahoo.com", "ymail.com", "rocketmail.com", "icloud.com", "me.com", "mac.com", "proton.me", "protonmail.com", "pm.me", "aol.com", "gmx.com", "mail.com", "zoho.com", "rediffmail.com", "hey.com"],
    Gr = new Set(qr),
    xt = a => a.trim().toLowerCase(),
    Hr = a => {
        const e = xt(a);
        if (!xa.test(e)) return null;
        const [, t] = e.split("@");
        return t || null
    },
    Da = a => {
        const e = Hr(a);
        return !!(e && Gr.has(e))
    },
    Oa = a => {
        const e = xt(a);
        return e ? xa.test(e) ? Da(e) ? null : "Use a mainstream inbox like Gmail, Outlook, Yahoo, iCloud, or Proton Mail. Disposable and uncommon domains are blocked for new signups." : "Enter a valid email address." : "Email is required."
    },
    Me = "isotope:auth:user-data:",
    Kr = 720 * 60 * 1e3;
class Wr {
    constructor() {
        this.userDataCache = new Map, this.userDataInFlight = new Map
    }
    invalidateUserData(e) {
        if (e) {
            this.userDataCache.delete(e), x.removeItem(`${Me}${e}`);
            return
        }
        this.userDataCache.clear(), (async () => {
            const t = await x.getByPrefix(Me);
            await Promise.all(Object.keys(t).map(s => x.removeItem(s)))
        })()
    }
    createLocalUser(e) {
        return {
            id: `local-${Date.now()}-${Math.random().toString(36).slice(2,11)}`,
            email: e,
            created_at: G()
        }
    }
    createTemporaryLocalFallback(e, t) {
        const s = t === "sign-up" ? "Cloud sign up is temporarily unavailable, so you’re in a temporary local-only session. Your cloud account was not created. Local study tools still work, but community, invites, billing, and cloud sync stay unavailable until you sign up again after service recovers." : "Cloud sign in is temporarily unavailable, so you’re in a temporary local-only session. Local study tools still work, but community, invites, billing, and cloud sync stay unavailable until you sign in again after service recovers.";
        return {
            success: !0,
            user: this.createLocalUser(e),
            sessionMode: "temporary-local",
            sessionNotice: s
        }
    }
    async getPersistedUserData(e) {
        try {
            const t = await x.getItem(`${Me}${e}`);
            if (!t) return null;
            const s = JSON.parse(t);
            return !s ?.expiresAt || s.expiresAt <= Date.now() ? (await x.removeItem(`${Me}${e}`), null) : (this.userDataCache.set(e, {
                data: s.data,
                expiresAt: s.expiresAt
            }), s.data)
        } catch {
            return null
        }
    }
    persistUserData(e, t) {
        const s = {
            data: t,
            expiresAt: Date.now() + Kr
        };
        this.userDataCache.set(e, s), x.setItem(`${Me}${e}`, JSON.stringify(s))
    }
    async restoreLocalWorkspaceSession() {
        try {
            const [e, t, s, r] = await Promise.all([m.getUserProfile().catch(() => null), m.getTasks().catch(() => []), m.getSessions().catch(() => []), m.getSubjects().catch(() => [])]);
            return !!e || t.length > 0 || s.length > 0 || r.length > 0 ? {
                success: !0,
                user: {
                    id: `local-${await dt()}`,
                    email: null,
                    created_at: e ?.createdAt || G()
                },
                sessionMode: "temporary-local",
                sessionNotice: "Cloud auth is temporarily unavailable, so your existing study data has been restored in a temporary local-only session. Local study tools stay available, while community, billing, and cloud sync remain paused until the service recovers."
            } : null
        } catch (e) {
            return console.error("[AuthService] restoreLocalWorkspaceSession error:", e), null
        }
    }
    async getSession() {
        if (!M() || !w) return {
            session: null
        };
        try {
            const {
                data: e,
                error: t
            } = await w.auth.getSession();
            if (t) {
                const s = O(t) ? Z("Cloud session refresh") : se(t, "Failed to refresh session");
                return console.error("[AuthService] getSession error:", s), {
                    session: null,
                    error: s
                }
            }
            return {
                session: e.session
            }
        } catch (e) {
            const t = O(e) ? Z("Cloud session refresh") : se(e, "Failed to refresh session");
            return console.error("[AuthService] getSession exception:", e), {
                session: null,
                error: t
            }
        }
    }
    async recoverCloudSession() {
        if (!M() || !w) return {
            success: !1,
            error: "Cloud auth is not configured"
        };
        try {
            at();
            const {
                data: e,
                error: t
            } = await w.auth.getSession();
            if (t && O(t)) return {
                success: !1,
                error: Z("Cloud session recovery")
            };
            if (e.session ?.user) return {
                success: !0,
                user: e.session.user,
                session: e.session,
                sessionMode: "cloud"
            };
            const {
                data: s,
                error: r
            } = await w.auth.refreshSession();
            return r ? O(r) ? {
                success: !1,
                error: Z("Cloud session recovery")
            } : {
                success: !1,
                error: se(r, "No recoverable cloud session found")
            } : s.session ?.user ? {
                success: !0,
                user: s.session.user,
                session: s.session,
                sessionMode: "cloud"
            } : {
                success: !1,
                error: "No recoverable cloud session found"
            }
        } catch (e) {
            return O(e) ? {
                success: !1,
                error: Z("Cloud session recovery")
            } : {
                success: !1,
                error: se(e, "No recoverable cloud session found")
            }
        }
    }
    async signUp(e, t, s) {
        const r = xt(t),
            i = Oa(r);
        if (i) return {
            success: !1,
            error: i
        };
        if (!M() || !w) return {
            success: !0,
            user: this.createLocalUser(r)
        };
        if (ye()) return this.createTemporaryLocalFallback(r, "sign-up");
        try {
            at();
            const {
                data: n,
                error: o
            } = await w.auth.signUp({
                email: r,
                password: s,
                options: {
                    data: {
                        name: e
                    }
                }
            });
            return o ? (console.error("[AuthService] signUp error:", o.message), O(o) ? this.createTemporaryLocalFallback(r, "sign-up") : {
                success: !1,
                error: se(o, "Sign up failed. Please try again.")
            }) : n.user ? (await this.ensureUserRecord(n.user, e), {
                success: !0,
                user: n.user,
                session: n.session || void 0
            }) : {
                success: !1,
                error: "Sign up failed. Please try again."
            }
        } catch (n) {
            return console.error("[AuthService] signUp exception:", n), O(n) ? this.createTemporaryLocalFallback(r, "sign-up") : {
                success: !1,
                error: se(n, "An unexpected error occurred")
            }
        }
    }
    async signInWithOAuth(e) {
        if (!M() || !w) return {
            success: !1,
            error: "OAuth requires cloud connection"
        };
        try {
            const {
                data: t,
                error: s
            } = await w.auth.signInWithOAuth({
                provider: e,
                options: {
                    redirectTo: `${window.__ISO_ORIGIN__||window.location.origin}/dashboard`
                }
            });
            return s ? (console.error(`[AuthService] signInWithOAuth (${e}) error:`, s.message), {
                success: !1,
                error: s.message
            }) : {
                success: !0
            }
        } catch (t) {
            return console.error("[AuthService] signInWithOAuth exception:", t), {
                success: !1,
                error: t.message || "An unexpected error occurred"
            }
        }
    }
    async signIn(e, t) {
        if (!M() || !w) return {
            success: !0,
            user: this.createLocalUser(e)
        };
        if (ye()) return this.createTemporaryLocalFallback(e, "sign-in");
        try {
            at();
            const {
                data: s,
                error: r
            } = await w.auth.signInWithPassword({
                email: e,
                password: t
            });
            return r ? (console.error("[AuthService] signIn error:", r.message), O(r) ? this.createTemporaryLocalFallback(e, "sign-in") : {
                success: !1,
                error: se(r, "Sign in failed. Please try again.")
            }) : s.user ? {
                success: !0,
                user: s.user,
                session: s.session,
                sessionMode: "cloud"
            } : {
                success: !1,
                error: "Login failed. Please try again."
            }
        } catch (s) {
            return console.error("[AuthService] signIn exception:", s), O(s) ? this.createTemporaryLocalFallback(e, "sign-in") : {
                success: !1,
                error: se(s, "An unexpected error occurred")
            }
        }
    }
    async signOut() {
        if (!M() || !w) return {
            success: !0
        };
        try {
            const {
                error: e
            } = await w.auth.signOut();
            return e ? (console.error("[AuthService] signOut error:", e.message), {
                success: !1,
                error: e.message
            }) : {
                success: !0
            }
        } catch (e) {
            return console.error("[AuthService] signOut exception:", e), {
                success: !1,
                error: e.message
            }
        }
    }
    async resetPassword(e) {
        if (!M() || !w) return {
            success: !1,
            error: "Password reset requires cloud connection"
        };
        try {
            const {
                error: t
            } = await w.auth.resetPasswordForEmail(e, {
                redirectTo: `${window.__ISO_ORIGIN__||window.location.origin}/reset-password`
            });
            return t ? {
                success: !1,
                error: t.message
            } : {
                success: !0
            }
        } catch (t) {
            return {
                success: !1,
                error: t instanceof Error ? t.message : "Failed to send password reset link"
            }
        }
    }
    async updatePassword(e) {
        if (!M() || !w) return {
            success: !1,
            error: "Password update requires cloud connection"
        };
        try {
            const {
                error: t
            } = await w.auth.updateUser({
                password: e
            });
            return t ? {
                success: !1,
                error: t.message
            } : {
                success: !0
            }
        } catch (t) {
            return {
                success: !1,
                error: t instanceof Error ? t.message : "Failed to update password"
            }
        }
    }
    async fetchUserData(e, t) {
        if (!M() || !w) return null;
        const s = ye();
        t ?.forceFresh && !s && this.userDataCache.delete(e);
        const r = this.userDataCache.get(e);
        if (r && r.expiresAt > Date.now()) return r.data;
        if (!t ?.forceFresh || s) {
            const o = await this.getPersistedUserData(e);
            if (o) return o
        }
        if (s) return null;
        const i = this.userDataInFlight.get(e);
        if (i && !t ?.forceFresh) return i;
        const n = (async () => {
            try {
                const [o, c, d] = await Promise.all([w.from("users").select("id, email, name, plan_type, plan_expires_at, created_at").eq("id", e).maybeSingle(), w.from("user_profiles").select("profile_data").eq("user_id", e).maybeSingle(), w.rpc("get_membership_snapshot", {
                    p_user_id: e
                })]), {
                    data: h,
                    error: A
                } = o, {
                    data: u,
                    error: f
                } = c, {
                    data: g,
                    error: y
                } = d;
                if (A) return O(A), null;
                if (!h) return null;
                const I = u ?.profile_data ?.isOnboarded || !1,
                    k = (Array.isArray(g) ? g[0] : g) || null;
                y && console.error("[AuthService] get_membership_snapshot error:", y);
                const E = {
                    id: h.id,
                    email: h.email,
                    name: h.name,
                    planType: "scholar",
                    planExpiresAt: k ?.access_ends_at ?? h.plan_expires_at ?? null,
                    accessSource: "grandfathered",
                    billingStatus: "active",
                    cancelAtPeriodEnd: k ?.cancel_at_period_end || !1,
                    portalEligible: k ?.portal_eligible || !1,
                    isOnboarded: I,
                    emailVerified: !0,
                    createdAt: h.created_at
                };
                return this.persistUserData(e, E), E
            } catch (o) {
                return console.error("[AuthService] fetchUserData error:", o), null
            } finally {
                this.userDataInFlight.delete(e)
            }
        })();
        return this.userDataInFlight.set(e, n), n
    }
    async ensureUserRecord(e, t) {
        if (!M() || !w || ye()) return;
        const s = await dt();
        try {
            await w.from("users").upsert({
                id: e.id,
                email: e.email || "",
                name: t || e.user_metadata ?.name || null,
                device_id: s,
                updated_at: G()
            }, {
                onConflict: "id",
                ignoreDuplicates: !1
            })
        } catch (r) {
            console.error("[AuthService] ensureUserRecord error:", r)
        }
    }
    onAuthStateChange(e) {
        if (!M() || !w) return () => {};
        const {
            data: {
                subscription: t
            }
        } = w.auth.onAuthStateChange((s, r) => {
            e(s, r)
        });
        return () => {
            t.unsubscribe()
        }
    }
    async linkIdentity(e) {
        if (!M() || !w) return {
            success: !1,
            error: "Linking requires cloud connection"
        };
        try {
            const {
                data: t,
                error: s
            } = await w.auth.linkIdentity({
                provider: e,
                options: {
                    redirectTo: `${window.__ISO_ORIGIN__||window.location.origin}/dashboard`
                }
            });
            return s ? (console.error("[AuthService] linkIdentity error:", s.message), {
                success: !1,
                error: s.message
            }) : {
                success: !0,
                data: t
            }
        } catch (t) {
            return console.error("[AuthService] linkIdentity exception:", t), {
                success: !1,
                error: t.message
            }
        }
    }
    async unlinkIdentity(e) {
        if (!M() || !w) return {
            success: !1,
            error: "Unlinking requires cloud connection"
        };
        try {
            const {
                error: t
            } = await w.auth.unlinkIdentity(e);
            return t ? (console.error("[AuthService] unlinkIdentity error:", t.message), {
                success: !1,
                error: t.message
            }) : {
                success: !0
            }
        } catch (t) {
            return console.error("[AuthService] unlinkIdentity exception:", t), {
                success: !1,
                error: t.message
            }
        }
    }
}
const U = new Wr,
    $r = a => typeof window > "u" ? null : window.sessionStorage.getItem(Tt(a)),
    Jr = (a, e) => {
        typeof window > "u" || window.sessionStorage.setItem(Tt(a), e)
    },
    Vr = a => {
        typeof window > "u" || window.sessionStorage.removeItem(Tt(a))
    },
    Yr = {
        getItem: async a => {
            if (ge()) return $r(a);
            const e = await x.getItem(a);
            return typeof e == "string" ? e : null
        },
        setItem: async (a, e) => {
            if (ge()) {
                Jr(a, e);
                return
            }
            await x.setItem(a, e)
        },
        removeItem: async a => {
            if (ge()) {
                Vr(a);
                return
            }
            await x.removeItem(a)
        }
    },
    Ie = a => a ? new Date(a).getTime() : Number.NaN,
    me = (a, e) => {
        const t = new Map;
        for (const s of a) t.set(s.id, s);
        for (const s of e) {
            const r = t.get(s.id);
            if (!r) {
                t.set(s.id, s);
                continue
            }
            const i = Ie(r.updatedAt ?? r.createdAt),
                n = Ie(s.updatedAt ?? s.createdAt);
            (Number.isNaN(i) || n >= i) && t.set(s.id, s)
        }
        return Array.from(t.values())
    },
    Qr = a => {
        const e = JSON.parse(a);
        if (!(e.source === "isotopeai" || e.source === "isotope-study") || e.version !== 1 || !e.data) throw new Error("This file is not a valid Isotope backup.");
        return {
            version: 1,
            source: "isotopeai",
            exportedAt: typeof e.exportedAt == "string" ? e.exportedAt : new Date().toISOString(),
            appVersion: typeof e.appVersion == "string" ? e.appVersion : "unknown",
            data: {
                profile: e.data.profile ?? null,
                timerState: e.data.timerState ?? null,
                tasks: Array.isArray(e.data.tasks) ? e.data.tasks : [],
                sessions: Array.isArray(e.data.sessions) ? e.data.sessions : [],
                subjects: Array.isArray(e.data.subjects) ? e.data.subjects : [],
                habits: Array.isArray(e.data.habits) ? e.data.habits : [],
                dailyLogs: Array.isArray(e.data.dailyLogs) ? e.data.dailyLogs : [],
                tests: Array.isArray(e.data.tests) ? e.data.tests : [],
                exams: Array.isArray(e.data.exams) ? e.data.exams : [],
                mockTests: Array.isArray(e.data.mockTests) ? e.data.mockTests : []
            }
        }
    },
    ce = async (a, e) => {
        try {
            return await a()
        } catch {
            return e
        }
    },
    Dt = async () => {
        const [a, e, t, s, r, i, n, o, c, d] = await Promise.all([ce(() => m.getUserProfile(), null), ce(() => m.getTimerState(), null), ce(() => m.getTasks({
            includeDeleted: !0
        }), []), ce(() => m.getSessions({
            includeDeleted: !0
        }), []), ce(() => m.getSubjects({
            includeDeleted: !0
        }), []), ce(() => m.getHabits({
            includeDeleted: !0
        }), []), ce(() => m.getDailyLogs({
            includeDeleted: !0
        }), []), ce(() => m.getTests({
            includeDeleted: !0
        }), []), ce(() => m.getExams({
            includeDeleted: !0
        }), []), ce(() => m.getMockTests({
            includeDeleted: !0
        }), [])]);
        return {
            version: 1,
            source: "isotopeai",
            exportedAt: new Date().toISOString(),
            appVersion: "0.9.0",
            data: {
                profile: a,
                timerState: e,
                tasks: t,
                sessions: s,
                subjects: r,
                habits: i,
                dailyLogs: n,
                tests: o,
                exams: c,
                mockTests: d
            }
        }
    },
    Dn = async () => {
        const a = await Dt();
        return JSON.stringify(a, null, 2)
    },
    Xr = async (a, e = {}) => {
        const t = Qr(a),
            s = e.mode ?? "merge";
        let r = [],
            i = [],
            n = [],
            o = [],
            c = [],
            d = [],
            h = [],
            A = [],
            u = null,
            f = null;
        s === "replace" ? await m.clearAll() : [r, i, n, o, c, d, h, A, u, f] = await Promise.all([m.getTasks({
            includeDeleted: !0
        }), m.getSessions({
            includeDeleted: !0
        }), m.getSubjects({
            includeDeleted: !0
        }), m.getHabits({
            includeDeleted: !0
        }), m.getDailyLogs({
            includeDeleted: !0
        }), m.getTests({
            includeDeleted: !0
        }), m.getExams({
            includeDeleted: !0
        }), m.getMockTests({
            includeDeleted: !0
        }), m.getUserProfile(), m.getTimerState()]);
        const g = s === "merge" ? me(r, t.data.tasks) : t.data.tasks,
            y = s === "merge" ? me(i, t.data.sessions) : t.data.sessions,
            I = s === "merge" ? me(n, t.data.subjects) : t.data.subjects,
            T = s === "merge" ? me(o, t.data.habits) : t.data.habits,
            k = s === "merge" ? me(c, t.data.dailyLogs) : t.data.dailyLogs,
            E = s === "merge" ? me(d, t.data.tests) : t.data.tests,
            z = s === "merge" ? me(h, t.data.exams) : t.data.exams,
            R = s === "merge" ? me(A, t.data.mockTests) : t.data.mockTests,
            H = s === "merge" && u && t.data.profile ? Ie(u.updatedAt) > Ie(t.data.profile.updatedAt) ? u : t.data.profile : t.data.profile ?? u,
            N = s === "merge" && f && t.data.timerState ? Ie(f.lastPersistedAt) > Ie(t.data.timerState.lastPersistedAt) ? f : t.data.timerState : t.data.timerState ?? f;
        return await Promise.all(g.map(D => m.saveTask(D))), await Promise.all(y.map(D => m.saveSession(D))), await Promise.all(I.map(D => m.saveSubject(D))), await Promise.all(T.map(D => m.saveHabit(D))), await Promise.all(k.map(D => m.saveDailyLog(D))), await Promise.all(E.map(D => m.saveTest(D))), await Promise.all(z.map(D => m.saveExam(D))), await Promise.all(R.map(D => m.saveMockTest(D))), H && await m.saveUserProfile(H), N && await m.saveTimerState(N), t
    },
    ve = "isotope:workspace-safety-backups:v1",
    Zr = "__isotope_workspace_safety__:",
    ei = 3,
    Ot = new It(Zr),
    $e = new It,
    ti = {
        tasks: 0,
        sessions: 0,
        subjects: 0,
        habits: 0,
        dailyLogs: 0,
        tests: 0,
        exams: 0,
        mockTests: 0
    },
    Lt = a => ({
        profile: a.data.profile ? 1 : 0,
        timerState: a.data.timerState ? 1 : 0,
        tasks: a.data.tasks.length,
        sessions: a.data.sessions.length,
        subjects: a.data.subjects.length,
        habits: a.data.habits.length,
        dailyLogs: a.data.dailyLogs.length,
        tests: a.data.tests.length,
        exams: a.data.exams.length,
        mockTests: a.data.mockTests.length
    }),
    mt = a => a.tasks + a.sessions + a.subjects + a.habits + a.dailyLogs + a.tests + a.exams + a.mockTests,
    Rt = a => mt(a) > 0 || a.profile > 0 || a.timerState > 0,
    ai = (a, e, t, s) => {
        if (mt(e) > mt(a)) return !0;
        if (!t) return Rt(e);
        const r = new Set(aa(t));
        return aa(s).some(i => !r.has(i))
    },
    aa = a => [
        ["tasks", a.data.tasks],
        ["sessions", a.data.sessions],
        ["subjects", a.data.subjects],
        ["habits", a.data.habits],
        ["dailyLogs", a.data.dailyLogs],
        ["tests", a.data.tests],
        ["exams", a.data.exams],
        ["mockTests", a.data.mockTests]
    ].flatMap(([t, s]) => s.map(r => r.id).filter(r => !!r).map(r => `${t}:${r}`)),
    sa = a => {
        if (!a) return null;
        try {
            return JSON.parse(a)
        } catch {
            return null
        }
    },
    La = async () => {
        const a = [];
        try {
            const e = await x.getItem(ve),
                t = sa(e);
            Array.isArray(t) && a.push(...t)
        } catch {}
        try {
            const e = Ot.getItem(ve),
                t = sa(e);
            Array.isArray(t) && a.push(...t)
        } catch {}
        return a
    },
    Ra = a => {
        const e = new Map;
        for (const t of a) !t ?.id || !t.backup ?.data || !t.summary || e.set(t.id, t);
        return Array.from(e.values()).sort((t, s) => new Date(s.createdAt).getTime() - new Date(t.createdAt).getTime())
    },
    si = async a => {
        const e = Ra(a).slice(0, ei),
            t = JSON.stringify(e);
        try {
            await x.setItem(ve, t)
        } catch {}
        try {
            Ot.setItem(ve, t)
        } catch {}
    },
    Na = a => {
        const e = a.match(/^__migrated__(\d+)__(.+)$/);
        if (!e) return null;
        const t = Number(e[1]);
        return Number.isNaN(t) ? null : {
            timestamp: t,
            originalKey: e[2]
        }
    },
    ri = a => ({
        version: 1,
        source: "isotopeai",
        exportedAt: a,
        appVersion: "0.9.0",
        data: {
            profile: null,
            timerState: null,
            tasks: [],
            sessions: [],
            subjects: [],
            habits: [],
            dailyLogs: [],
            tests: [],
            exams: [],
            mockTests: []
        }
    }),
    ii = () => {
        const a = new Map;
        try {
            for (const e of $e.getAllKeys()) {
                const t = Na(e);
                if (!t) continue;
                const s = $e.getItem(e);
                if (s === null) continue;
                const r = new Date(t.timestamp).toISOString(),
                    i = a.get(t.timestamp) ?? ri(r);
                switch (t.originalKey) {
                    case l.TASKS:
                        i.data.tasks = Array.isArray(s) ? s : [];
                        break;
                    case l.SESSIONS:
                        i.data.sessions = Array.isArray(s) ? s : [];
                        break;
                    case l.SUBJECTS:
                        i.data.subjects = Array.isArray(s) ? s : [];
                        break;
                    case l.HABITS:
                        i.data.habits = Array.isArray(s) ? s : [];
                        break;
                    case l.DAILY_LOGS:
                        i.data.dailyLogs = Array.isArray(s) ? s : [];
                        break;
                    case l.TESTS:
                        i.data.tests = Array.isArray(s) ? s : [];
                        break;
                    case l.EXAMS:
                        i.data.exams = Array.isArray(s) ? s : [];
                        break;
                    case l.MOCK_TESTS:
                        i.data.mockTests = Array.isArray(s) ? s : [];
                        break;
                    case l.USER_PROFILE:
                        i.data.profile = s && typeof s == "object" ? s : null;
                        break;
                    case l.TIMER_STATE:
                        i.data.timerState = s && typeof s == "object" ? s : null;
                        break;
                    default:
                        break
                }
                a.set(t.timestamp, i)
            }
        } catch {
            return []
        }
        return Array.from(a.entries()).map(([e, t]) => ({
            id: `legacy-${e}`,
            reason: "legacy-migration",
            createdAt: new Date(e).toISOString(),
            summary: Lt(t),
            backup: t
        })).filter(e => Rt(e.summary))
    },
    ni = async () => Ra([...await La(), ...ii()]),
    Fe = async (a = "manual") => {
        try {
            const e = await Dt(),
                t = Lt(e);
            if (!Rt(t)) return null;
            const s = new Date().toISOString(),
                r = {
                    id: `${Date.now()}-${a}`,
                    reason: a,
                    createdAt: s,
                    summary: t,
                    backup: { ...e,
                        exportedAt: s
                    }
                },
                i = await La();
            return await si([r, ...i]), r
        } catch (e) {
            return console.error("[workspaceSafety] Failed to create local safety backup:", e), null
        }
    },
    On = async (a = {}) => {
        const e = await ni();
        if (e.length === 0) return {
            restored: !1,
            source: null,
            summary: null
        };
        const t = await Dt().catch(() => null),
            s = t ? Lt(t) : ti,
            r = e[0];
        return !a.force && !ai(s, r.summary, t, r.backup) ? {
            restored: !1,
            source: null,
            summary: r.summary
        } : (await Xr(JSON.stringify(r.backup), {
            mode: "merge"
        }), {
            restored: !0,
            source: r.reason === "legacy-migration" ? "legacy-migration" : "safety-backup",
            summary: r.summary
        })
    },
    Ln = async () => {
        try {
            await x.removeItem(ve)
        } catch {}
        try {
            Ot.removeItem(ve)
        } catch {}
        try {
            for (const a of $e.getAllKeys()) Na(a) && $e.removeItem(a)
        } catch {}
    };
let _e = null,
    ra = null;
const Ae = {
        isAuthenticated: !1,
        isInitialized: !1,
        isLoading: !1,
        userId: null,
        email: null,
        emailVerified: !1,
        planType: "scholar",
        planExpiresAt: null,
        accessSource: "grandfathered",
        billingStatus: "active",
        cancelAtPeriodEnd: !1,
        portalEligible: !1,
        authMethod: null,
        identities: [],
        createdAt: "",
        isTemporaryLocalSession: !1,
        temporaryLocalMessage: null,
        temporaryLocalNoticeSeenFingerprint: null,
        temporaryLocalWarningDismissedFingerprint: null,
        error: null
    },
    oi = "You’re working in a local-only workspace. Your study data stays on this device. Sign in again to enable community, billing, and cloud sync.",
    ci = ca()(zr((a, e) => ({ ...Ae,
        setLoading: t => a({
            isLoading: t
        }),
        setError: t => a({
            error: t
        }),
        clearError: () => a({
            error: null
        }),
        setPlanType: (t, s = null) => a({
            planType: t,
            planExpiresAt: s
        }),
        acknowledgeTemporaryLocalNotice: () => {
            const {
                temporaryLocalMessage: t
            } = e();
            t && a({
                temporaryLocalNoticeSeenFingerprint: t
            })
        },
        dismissTemporaryLocalWarning: () => {
            const {
                temporaryLocalMessage: t
            } = e();
            t && a({
                temporaryLocalWarningDismissedFingerprint: t
            })
        },
        isPremium: () => true,
        recoverCloudSession: async () => {
            const {
                isTemporaryLocalSession: t
            } = e();
            if (!t) return {
                success: !1,
                error: "Not in temporary local mode"
            };
            const s = await U.recoverCloudSession();
            if (!s.success || !s.session ?.user) return {
                success: !1,
                error: s.error
            };
            const r = s.session,
                i = await U.fetchUserData(r.user.id),
                n = r.user.identities ?.find(o => o.provider === "google") ? "google" : "email";
            return Ee.getState().resetProfile(), a({
                isAuthenticated: !0,
                isInitialized: !0,
                isLoading: !1,
                userId: r.user.id,
                email: r.user.email || null,
                emailVerified: r.user.email_confirmed_at !== null,
                planType: i ?.planType || "free",
                planExpiresAt: i ?.planExpiresAt || null,
                accessSource: i ?.accessSource || "free",
                billingStatus: i ?.billingStatus || "free",
                cancelAtPeriodEnd: i ?.cancelAtPeriodEnd || !1,
                portalEligible: i ?.portalEligible || !1,
                authMethod: n,
                identities: r.user.identities || [],
                createdAt: r.user.created_at,
                isTemporaryLocalSession: !1,
                temporaryLocalMessage: null,
                error: null
            }), {
                success: !0
            }
        },
        initializeAuth: async () => _e || (_e = (async () => {
            if (ge()) {
                a({
                    isAuthenticated: !0,
                    isInitialized: !0,
                    isLoading: !1,
                    userId: X,
                    email: Vs,
                    emailVerified: !0,
                    planType: "ranker",
                    planExpiresAt: null,
                    accessSource: "manual",
                    billingStatus: "gifted",
                    cancelAtPeriodEnd: !1,
                    portalEligible: !1,
                    authMethod: null,
                    identities: [],
                    createdAt: new Date().toISOString(),
                    isTemporaryLocalSession: !1,
                    temporaryLocalMessage: null,
                    error: null
                }), _e = null;
                return
            }
            a({
                isLoading: !0
            });
            const t = typeof U.restoreLocalWorkspaceSession == "function" ? U.restoreLocalWorkspaceSession.bind(U) : async () => null,
                s = async () => {
                    const r = await t();
                    return !r ?.success || !r.user ? !1 : (a({
                        isAuthenticated: !0,
                        isInitialized: !0,
                        isLoading: !1,
                        userId: r.user.id,
                        email: r.user.email || null,
                        emailVerified: !1,
                        planType: "free",
                        planExpiresAt: null,
                        accessSource: "free",
                        billingStatus: "free",
                        cancelAtPeriodEnd: !1,
                        portalEligible: !1,
                        authMethod: null,
                        identities: [],
                        createdAt: r.user.created_at,
                        isTemporaryLocalSession: !0,
                        temporaryLocalMessage: r.sessionNotice || null,
                        error: null
                    }), !0)
                };
            try {
                const {
                    session: r,
                    error: i
                } = await U.getSession();
                if (i) {
                    console.error("[AuthStore] Session error:", i);
                    const n = O(i);
                    if (e().isAuthenticated && !!e().userId && n) {
                        a({
                            isInitialized: !0,
                            isLoading: !1,
                            error: null
                        });
                        return
                    }
                    if (n ? await s() : !1) return;
                    a({ ...Ae,
                        isInitialized: !0,
                        isLoading: !1
                    });
                    return
                }
                if (r ?.user) {
                    const n = e().planType,
                        o = e().planExpiresAt;
                    a({
                        isAuthenticated: !0,
                        isInitialized: !0,
                        isLoading: !1,
                        userId: r.user.id,
                        email: r.user.email || null,
                        emailVerified: r.user.email_confirmed_at !== null,
                        planType: n,
                        planExpiresAt: o,
                        accessSource: e().accessSource,
                        billingStatus: e().billingStatus,
                        cancelAtPeriodEnd: e().cancelAtPeriodEnd,
                        portalEligible: e().portalEligible,
                        authMethod: "email",
                        identities: r.user.identities || [],
                        createdAt: r.user.created_at,
                        isTemporaryLocalSession: !1,
                        temporaryLocalMessage: null,
                        error: null
                    }), U.fetchUserData(r.user.id).then(c => {
                        c && a(d => d.isAuthenticated && d.userId === r.user.id ? {
                            planType: c.planType || "free",
                            planExpiresAt: c.planExpiresAt || null,
                            accessSource: c.accessSource || "free",
                            billingStatus: c.billingStatus || "free",
                            cancelAtPeriodEnd: c.cancelAtPeriodEnd || !1,
                            portalEligible: c.portalEligible || !1
                        } : {})
                    }).catch(() => {})
                } else if (e().isAuthenticated && e().isTemporaryLocalSession && e().userId ?.startsWith("local-")) {
                    const n = await e().recoverCloudSession();
                    if (n.success) return;
                    if (n.error && !O(n.error)) {
                        a({
                            isInitialized: !0,
                            isLoading: !1,
                            temporaryLocalMessage: oi,
                            error: null
                        });
                        return
                    }
                    a({
                        isInitialized: !0,
                        isLoading: !1,
                        error: null
                    })
                } else(M() ? !1 : await s()) || a({ ...Ae,
                    isInitialized: !0,
                    isLoading: !1
                });
                M() && w && !ra && (ra = U.onAuthStateChange(async (n, o) => {
                    if (n === "SIGNED_IN" && o ?.user) {
                        const c = o.user.email || null,
                            d = o.user.identities || [],
                            h = d.find(f => f.provider === "google") ? "google" : "email";
                        let A = await U.fetchUserData(o.user.id);
                        if (!A && c) {
                            if (!Da(c)) {
                                await U.signOut(), a({
                                    isLoading: !1,
                                    error: Oa(c) || "This email domain is not allowed for new signups."
                                });
                                return
                            }
                            await U.ensureUserRecord(o.user, o.user.user_metadata ?.name), A = await U.fetchUserData(o.user.id, {
                                forceFresh: !0
                            })
                        }
                        a({
                            isAuthenticated: !0,
                            userId: o.user.id,
                            email: c,
                            emailVerified: o.user.email_confirmed_at !== null,
                            planType: A ?.planType || "free",
                            planExpiresAt: A ?.planExpiresAt || null,
                            accessSource: A ?.accessSource || "free",
                            billingStatus: A ?.billingStatus || "free",
                            cancelAtPeriodEnd: A ?.cancelAtPeriodEnd || !1,
                            portalEligible: A ?.portalEligible || !1,
                            authMethod: h,
                            identities: d,
                            createdAt: o.user.created_at,
                            isTemporaryLocalSession: !1,
                            temporaryLocalMessage: null,
                            isInitialized: !0,
                            isLoading: !1,
                            error: null
                        })
                    } else if (n === "SIGNED_OUT") {
                        const c = await Promise.all([m.getUserProfile().catch(() => null), m.getTasks().catch(() => []), m.getSessions().catch(() => []), m.getSubjects().catch(() => [])]).then(([d, h, A, u]) => !!d || h.length > 0 || A.length > 0 || u.length > 0);
                        a({
                            isAuthenticated: !1,
                            userId: null,
                            email: null,
                            emailVerified: !1,
                            planType: "free",
                            planExpiresAt: null,
                            accessSource: "free",
                            billingStatus: "free",
                            cancelAtPeriodEnd: !1,
                            portalEligible: !1,
                            authMethod: null,
                            identities: [],
                            createdAt: "",
                            isTemporaryLocalSession: !1,
                            temporaryLocalMessage: null,
                            isInitialized: !0,
                            isLoading: !1,
                            error: c ? "Cloud session ended. Your local study data is still available." : null
                        })
                    }
                }))
            } catch (r) {
                if (console.error("[AuthStore] Init error:", r), e().isAuthenticated && !!e().userId) a({
                    isInitialized: !0,
                    isLoading: !1,
                    error: null
                });
                else {
                    const n = O(r) || !M() ? await t() : null;
                    n ?.success && n.user ? a({
                        isAuthenticated: !0,
                        isInitialized: !0,
                        isLoading: !1,
                        userId: n.user.id,
                        email: n.user.email || null,
                        emailVerified: !1,
                        planType: "free",
                        planExpiresAt: null,
                        accessSource: "free",
                        billingStatus: "free",
                        cancelAtPeriodEnd: !1,
                        portalEligible: !1,
                        authMethod: null,
                        identities: [],
                        createdAt: n.user.created_at,
                        isTemporaryLocalSession: !0,
                        temporaryLocalMessage: n.sessionNotice || null,
                        error: null
                    }) : a({ ...Ae,
                        isInitialized: !0,
                        isLoading: !1
                    })
                }
            } finally {
                _e = null
            }
        })(), _e),
        signUp: async (t, s, r) => {
            a({
                isLoading: !0,
                error: null
            }), await Fe("pre-sign-in");
            const i = await U.signUp(t, s, r);
            if (i.success && i.user) {
                const n = i.sessionMode === "temporary-local";
                return a({
                    isAuthenticated: !0,
                    userId: i.user.id,
                    email: i.user.email || null,
                    emailVerified: !1,
                    planType: "free",
                    planExpiresAt: null,
                    accessSource: "free",
                    billingStatus: "free",
                    cancelAtPeriodEnd: !1,
                    portalEligible: !1,
                    authMethod: "email",
                    identities: i.user.identities || [],
                    createdAt: i.user.created_at,
                    isTemporaryLocalSession: n,
                    temporaryLocalMessage: n && i.sessionNotice || null,
                    isLoading: !1,
                    error: null
                }), {
                    success: !0
                }
            }
            return a({
                isLoading: !1,
                error: i.error || null
            }), {
                success: !1,
                error: i.error
            }
        },
        signInWithGoogle: async () => {
            a({
                isLoading: !0,
                error: null
            }), await Fe("pre-sign-in");
            const t = await U.signInWithOAuth("google");
            return t.success || a({
                isLoading: !1,
                error: t.error
            }), t
        },
        linkGoogleAccount: async () => {
            a({
                isLoading: !0,
                error: null
            });
            const t = await U.linkIdentity("google");
            return t.success || a({
                isLoading: !1,
                error: t.error
            }), {
                success: t.success,
                error: t.error
            }
        },
        unlinkGoogleAccount: async () => {
            a({
                isLoading: !0,
                error: null
            });
            const {
                identities: t
            } = e(), s = t.find(i => i.provider === "google");
            if (!s) return a({
                isLoading: !1,
                error: "Google account not linked"
            }), {
                success: !1,
                error: "Google account not linked"
            };
            const r = await U.unlinkIdentity(s);
            return r.success ? await e().initializeAuth() : a({
                isLoading: !1,
                error: r.error
            }), r
        },
        signIn: async (t, s) => {
            a({
                isLoading: !0,
                error: null
            }), await Fe("pre-sign-in");
            const r = await U.signIn(t, s);
            if (r.success && r.user) {
                if (r.sessionMode === "temporary-local") return a({
                    isAuthenticated: !0,
                    userId: r.user.id,
                    email: r.user.email || null,
                    emailVerified: !1,
                    planType: "free",
                    planExpiresAt: null,
                    accessSource: "free",
                    billingStatus: "free",
                    cancelAtPeriodEnd: !1,
                    portalEligible: !1,
                    authMethod: "email",
                    identities: r.user.identities || [],
                    createdAt: r.user.created_at,
                    isTemporaryLocalSession: !0,
                    temporaryLocalMessage: r.sessionNotice || null,
                    isLoading: !1,
                    error: null
                }), {
                    success: !0
                };
                const n = await U.fetchUserData(r.user.id),
                    o = n ?.planType || "free",
                    c = r.user.id;
                return Ee.getState().resetProfile(), a({
                    isAuthenticated: !0,
                    userId: c,
                    email: r.user.email || null,
                    emailVerified: r.user.email_confirmed_at !== null,
                    planType: o,
                    planExpiresAt: n ?.planExpiresAt || null,
                    accessSource: n ?.accessSource || "free",
                    billingStatus: n ?.billingStatus || "free",
                    cancelAtPeriodEnd: n ?.cancelAtPeriodEnd || !1,
                    portalEligible: n ?.portalEligible || !1,
                    authMethod: "email",
                    identities: r.user.identities || [],
                    createdAt: r.user.created_at,
                    isTemporaryLocalSession: !1,
                    temporaryLocalMessage: null,
                    error: null,
                    isLoading: !1
                }), {
                    success: !0
                }
            }
            return a({
                isLoading: !1,
                error: r.error || null
            }), {
                success: !1,
                error: r.error
            }
        },
        signOut: async () => {
            if (ge()) {
                Qs(), a({ ...Ae,
                    isInitialized: !0,
                    isLoading: !1
                });
                return
            }
            a({
                isLoading: !0
            }), await Fe("pre-sign-out"), await U.signOut(), U.invalidateUserData(), a({ ...Ae,
                isInitialized: !0,
                isLoading: !1
            })
        },
        resetPassword: async t => {
            a({
                isLoading: !0,
                error: null
            });
            const s = await U.resetPassword(t);
            return a({
                isLoading: !1
            }), s
        },
        refreshPlanStatus: async () => {
            const {
                userId: t
            } = e();
            if (!t || t.startsWith("local-")) return;
            U.invalidateUserData(t);
            const s = await U.fetchUserData(t, {
                forceFresh: !0
            });
            s && a({
                planType: s.planType,
                planExpiresAt: s.planExpiresAt,
                accessSource: s.accessSource,
                billingStatus: s.billingStatus,
                cancelAtPeriodEnd: s.cancelAtPeriodEnd,
                portalEligible: s.portalEligible
            })
        }
    }), {
        name: "isotope-auth",
        storage: Ma(() => Yr),
        partialize: a => ({
            isAuthenticated: a.isAuthenticated,
            userId: a.userId,
            email: a.email,
            emailVerified: a.emailVerified,
            planType: a.planType,
            planExpiresAt: a.planExpiresAt,
            accessSource: a.accessSource,
            billingStatus: a.billingStatus,
            cancelAtPeriodEnd: a.cancelAtPeriodEnd,
            portalEligible: a.portalEligible,
            authMethod: a.authMethod,
            identities: a.identities,
            createdAt: a.createdAt,
            isTemporaryLocalSession: a.isTemporaryLocalSession,
            temporaryLocalMessage: a.temporaryLocalMessage,
            temporaryLocalNoticeSeenFingerprint: a.temporaryLocalNoticeSeenFingerprint,
            temporaryLocalWarningDismissedFingerprint: a.temporaryLocalWarningDismissedFingerprint
        })
    })),
    ke = ma(),
    li = "isotope:cloud-profile:",
    di = new Set(["dailyGoalHours", "preferredFocusMethod", "pomodoroSettings", "soundscapePreference", "dayOffset", "weekStartDay", "weekStartHour", "weekStartMinute", "dailyQuestionGoal", "subjectQuestionGoals"]),
    ui = 5e3;
let it = null,
    ze = null;

function ja(a) {
    return `${li}${a}`
}
async function mi(a) {
    try {
        const e = await x.getItem(ja(a));
        return e ? JSON.parse(e) : null
    } catch {
        return null
    }
}
async function qe(a, e) {
    await x.setItem(ja(a), JSON.stringify(e))
}

function pi(a) {
    return a === "free" ? 10080 * 60 * 1e3 : 1440 * 60 * 1e3
}

function fi(a) {
    return a ? Object.keys(a).some(e => !di.has(e)) : !1
}

function hi(a) {
    return "name" in a || "username" in a || "avatar" in a || "bio" in a || "academic" in a || "communityPreferences" in a || "swot" in a || "isOnboarded" in a || "currentOnboardingStep" in a || "onboardingCompletedAt" in a || fi(a.studyPreferences) ? "full" : "none"
}

function yi(a, e, t, s) {
    s === "none" || ye() || (it = {
        userId: a,
        profile: e,
        previousProfile: t,
        mode: s
    }, ze && clearTimeout(ze), ze = setTimeout(() => {
        const r = it;
        it = null, ze = null, !(!r || r.mode === "none") && va.pushProfile(r.userId, r.profile, r.previousProfile)
    }, ui))
}
const Ee = ca((a, e) => ({
    profile: null,
    isLoading: !1,
    isProfileLoaded: !1,
    hasLocalProfile: !1,
    cloudProfileFetched: !1,
    refreshFromStorage: async () => {
        try {
            const t = await m.getUserProfile();
            if (t) {
                const s = pe(t);
                a({
                    profile: s,
                    hasLocalProfile: !0
                })
            }
        } catch (t) {
            console.error("[UserStore] Failed to refresh profile:", t)
        }
    },
    fetchProfile: async () => {
        const t = e();
        if (!(t.isLoading || t.isProfileLoaded)) {
            a({
                isLoading: !0
            });
            try {
                const s = await m.getUserProfile(),
                    r = !!s,
                    i = s ? pe(s) : ke;
                a({
                    profile: i,
                    isLoading: !1,
                    isProfileLoaded: !0,
                    hasLocalProfile: r
                })
            } catch (s) {
                console.error("[UserStore] Error fetching profile:", s), a({
                    profile: ke,
                    isLoading: !1,
                    isProfileLoaded: !0,
                    hasLocalProfile: !1
                })
            }
        }
    },
    fetchCloudProfile: async (t, s = {}) => {
        if (!M() || !w || !t || t.startsWith("local-")) return null;
        if (ye()) return a({
            cloudProfileFetched: !0
        }), e().profile;
        try {
            const r = e().profile,
                i = await mi(t),
                n = pi(s.planType);
            if (!s.force && !!r ?.isOnboarded && !!i ?.fetchedAt && Date.now() - i.fetchedAt < n) return a({
                cloudProfileFetched: !0
            }), r;
            const {
                data: c,
                error: d
            } = await w.from("user_profiles").select("profile_data, updated_at").eq("user_id", t).single();
            if (d) {
                if (d.code === "PGRST116") return await qe(t, {
                    fetchedAt: Date.now()
                }), a({
                    cloudProfileFetched: !0
                }), null;
                throw d
            }
            if (c ?.profile_data) {
                let h = c.profile_data;
                const A = e().profile || ke,
                    f = we(A.updatedAt, h.updatedAt) === "remote" || !A.isOnboarded && h.isOnboarded;
                if ((!h.name || !h.avatar) && (!h.name && A.name && (h = { ...h,
                        name: A.name
                    }), !h.avatar && A.avatar && (h = { ...h,
                        avatar: A.avatar
                    }), !h.name || !h.avatar)) try {
                    const {
                        data: g
                    } = await w.from("users").select("name, avatar_url").eq("id", t).maybeSingle();
                    g && (h = { ...h,
                        name: h.name || g.name || "",
                        avatar: h.avatar || g.avatar_url || void 0
                    })
                } catch {}
                if (f) {
                    const g = pe({ ...h,
                        focusSettings: { ...We,
                            ...A.focusSettings,
                            ...h.focusSettings
                        }
                    });
                    return a({
                        profile: g,
                        cloudProfileFetched: !0,
                        hasLocalProfile: !0
                    }), await m.saveUserProfile(g), await qe(t, {
                        fetchedAt: Date.now()
                    }), g
                } else return await qe(t, {
                    fetchedAt: Date.now()
                }), a({
                    cloudProfileFetched: !0
                }), A
            }
            return await qe(t, {
                fetchedAt: Date.now()
            }), a({
                cloudProfileFetched: !0
            }), null
        } catch (r) {
            return O(r) && va.setDegradedMode(r, Z("Cloud profile sync")), console.error("[UserStore] Error fetching cloud profile:", r), a({
                cloudProfileFetched: !0
            }), null
        }
    },
    updateProfile: async t => {
        const s = e().profile || ke,
            r = js(t),
            i = et(s, r);
        i.updatedAt = G(), a({
            profile: i
        }), await m.saveUserProfile(i);
        const n = ci.getState().userId;
        if (n && (Ur.updateFromPayload(n, i.username || i.name, i.avatar), !n.startsWith("local-") && M())) {
            const o = hi(r);
            yi(n, i, s, o)
        }
    },
    updateSWOT: async (t, s) => {
        const r = e().profile || ke,
            i = et(r, {});
        i.swot = { ...r.swot,
            [t]: s
        }, i.updatedAt = G(), a({
            profile: i
        }), await m.saveUserProfile(i)
    },
    updateFocusSettings: async t => {
        const s = e().profile || ke,
            r = et(s, {
                focusSettings: { ...s.focusSettings,
                    ...t
                }
            });
        r.updatedAt = G(), a({
            profile: r
        }), await m.saveUserProfile(r)
    },
    getFocusSettings: () => e().profile ?.focusSettings || We,
    setProfileLoaded: t => {
        a({
            isProfileLoaded: t
        })
    },
    resetProfile: () => {
        a({
            profile: null,
            isLoading: !1,
            isProfileLoaded: !1,
            hasLocalProfile: !1,
            cloudProfileFetched: !1
        })
    }
}));

function gi(a) {
    const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
    return e ? {
        r: parseInt(e[1], 16),
        g: parseInt(e[2], 16),
        b: parseInt(e[3], 16)
    } : null
}

function Si(a, e, t) {
    a /= 255, e /= 255, t /= 255;
    const s = Math.max(a, e, t),
        r = Math.min(a, e, t),
        i = (s + r) / 2;
    let n = 0,
        o = 0;
    if (s !== r) {
        const c = s - r;
        switch (o = i > .5 ? c / (2 - s - r) : c / (s + r), s) {
            case a:
                n = (e - t) / c + (e < t ? 6 : 0);
                break;
            case e:
                n = (t - a) / c + 2;
                break;
            case t:
                n = (a - e) / c + 4;
                break
        }
        n /= 6
    }
    return {
        h: n * 360,
        s: o * 100,
        l: i * 100
    }
}

function te(a, e, t) {
    e /= 100, t /= 100;
    const s = d => (d + a / 30) % 12,
        r = e * Math.min(t, 1 - t),
        i = d => t - r * Math.max(-1, Math.min(s(d) - 3, Math.min(9 - s(d), 1))),
        n = Math.round(i(0) * 255),
        o = Math.round(i(8) * 255),
        c = Math.round(i(4) * 255);
    return `${n} ${o} ${c}`
}
const bi = a => {
        const e = gi(a);
        if (!e) return null;
        const t = Si(e.r, e.g, e.b),
            {
                h: s,
                s: r
            } = t;
        return {
            50: te(s, r, 98),
            100: te(s, r, 95),
            200: te(s, r, 90),
            300: te(s, r, 82),
            400: te(s, r, 64),
            500: te(s, r, 50),
            600: te(s, r, 40),
            700: te(s, r, 30),
            800: te(s, r, 20),
            900: te(s, r, 10),
            950: te(s, r, 5)
        }
    },
    Ba = a => {
        const e = ua(a),
            t = bi(e);
        if (!t) return;
        const s = document.documentElement;
        Object.entries(t).forEach(([r, i]) => {
            s.style.setProperty(`--brand-${r}`, i)
        }), s.style.setProperty("--brand-primary", t[500])
    },
    _i = [{
        name: "Violet",
        color: "#8b5cf6"
    }, {
        name: "Emerald",
        color: "#10b981"
    }, {
        name: "Blue",
        color: "#3b82f6"
    }, {
        name: "Amber",
        color: "#f59e0b"
    }, {
        name: "Rose",
        color: "#f43f5e"
    }, {
        name: "Cyan",
        color: "#06b6d4"
    }, {
        name: "Pink",
        color: "#ec4899"
    }, {
        name: "Orange",
        color: "#f97316"
    }],
    Je = (a = Te) => a === "dark" ? !0 : a === "light" || typeof window > "u" || typeof window.matchMedia != "function" ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches,
    Ua = (a = Te) => {
        if (typeof document > "u") return Je(a);
        const e = Je(a);
        return document.documentElement.classList.toggle("dark", e), e
    },
    Ai = (a = pt) => {
        typeof document > "u" || (document.documentElement.dataset.performance = a)
    },
    Fa = (a = Ve) => {
        typeof document > "u" || (document.documentElement.dataset.dyslexiaFont = a ? "enabled" : "disabled")
    },
    Rn = ({
        accentColor: a = Oe,
        dyslexiaFont: e = Ve,
        performanceMode: t = pt,
        theme: s = Te
    } = {}) => {
        Ba(a), Ua(s), Ai(t), Fa(e)
    },
    Nn = _i.map(a => a.color),
    ki = () => {
        const a = Ee(i => i.profile),
            e = a ?.settings ?.theme || Te,
            t = a ?.personalization ?.accentColor || Oe,
            s = a ?.personalization ?.dashboardLayout || da,
            r = a ?.personalization ?.dyslexiaFont ?? Ve;
        return v.useLayoutEffect(() => {
            Ba(t)
        }, [t]), v.useLayoutEffect(() => {
            const i = () => {
                Ua(e)
            };
            if (i(), e === "system") {
                const n = window.matchMedia("(prefers-color-scheme: dark)"),
                    o = () => i();
                return n.addEventListener("change", o), () => n.removeEventListener("change", o)
            }
        }, [e]), v.useLayoutEffect(() => {
            document.documentElement.dataset.density = s
        }, [s]), v.useLayoutEffect(() => {
            Fa(r)
        }, [r]), null
    },
    za = v.createContext({
        performanceMode: "standard",
        isPerformanceMode: !1,
        shouldReduceMotion: !1,
        chartAnimationsEnabled: !0,
        isLowEndDevice: !1
    }),
    qa = "(prefers-reduced-motion: reduce)",
    wi = () => typeof window > "u" || typeof window.matchMedia != "function" ? !1 : window.matchMedia(qa).matches,
    Ii = () => {
        if (typeof navigator > "u") return !1;
        const a = navigator.hardwareConcurrency ?? 8,
            e = "deviceMemory" in navigator ? Number(navigator.deviceMemory) : 8;
        return a <= 4 || e <= 4
    },
    vi = ({
        children: a
    }) => {
        const e = Ee(o => o.profile ?.settings ?.performanceMode || "standard"),
            [t, s] = v.useState(wi),
            [r] = v.useState(Ii);
        v.useEffect(() => {
            if (typeof window > "u" || typeof window.matchMedia != "function") return;
            const o = window.matchMedia(qa),
                c = () => {
                    s(o.matches)
                };
            return o.addEventListener("change", c), () => o.removeEventListener("change", c)
        }, []), v.useEffect(() => (document.documentElement.dataset.performance = e, () => {
            delete document.documentElement.dataset.performance
        }), [e]);
        const i = v.useMemo(() => {
                const o = e === "optimized",
                    c = o || t;
                return {
                    performanceMode: e,
                    isPerformanceMode: o,
                    shouldReduceMotion: c,
                    chartAnimationsEnabled: !c,
                    isLowEndDevice: r
                }
            }, [r, e, t]),
            n = i.isPerformanceMode ? "always" : "user";
        return S.jsx(za.Provider, {
            value: i,
            children: S.jsx(Ya, {
                reducedMotion: n,
                children: a
            })
        })
    },
    jn = () => v.useContext(za);
class Ei extends xe.Component {
    constructor() {
        super(...arguments), this.state = {
            error: null
        }, this.handleReload = () => {
            window.location.reload()
        }
    }
    static getDerivedStateFromError(e) {
        return {
            error: e
        }
    }
    render() {
        const {
            error: e
        } = this.state;
        if (!e) return this.props.children;
        if (!Ja(e)) throw e;
        const t = !navigator.onLine,
            s = t ? "This screen is not cached offline yet" : "The app needs a refresh",
            r = t ? "Your saved data is still on this device, but this route bundle was not available in the offline cache. Reconnect once, let the app refresh, and this signed-in screen will open offline next time." : "A page bundle failed to load. Refresh once to pick up the latest cached app files.";
        return S.jsx("div", {
            className: "min-h-screen bg-[#f4f4f5] px-4 py-10 text-zinc-900 dark:bg-[#09090b] dark:text-white",
            children: S.jsx("div", {
                className: "mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center",
                children: S.jsxs("div", {
                    className: "w-full rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-white/5",
                    children: [S.jsx("div", {
                        className: "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500",
                        children: S.jsx(Qa, {
                            className: "h-7 w-7"
                        })
                    }), S.jsx("p", {
                        className: "mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-500",
                        children: t ? "Offline cache missing" : "Refresh required"
                    }), S.jsx("h1", {
                        className: "mb-3 text-3xl font-display font-bold",
                        children: s
                    }), S.jsx("p", {
                        className: "mx-auto mb-8 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300",
                        children: r
                    }), S.jsxs("button", {
                        type: "button",
                        onClick: this.handleReload,
                        className: "inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black",
                        children: [S.jsx(Xa, {
                            className: "h-4 w-4"
                        }), "Refresh app"]
                    })]
                })
            })
        })
    }
}
const Ti = "/landingpage.jpg",
    Ci = 1600,
    Pi = 966,
    Ge = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    He = "noindex, nofollow, noarchive, nosnippet, noimageindex",
    Re = "IsotopeAI",
    de = "https://isotopeai.in",
    Qe = "All-in-one AI study planner for JEE and NEET aspirants with syllabus tracking, focus timer, study time tracking, question tracking, mock test analyzer, exam analytics, revision planning, task management, progress tracking, AI insights, study groups, and offline support.",
    ia = "isotopeai@icloud.com",
    na = {
        discord: "https://discord.gg/QfmQGmKJUD",
        reddit: "https://www.reddit.com/r/Isotope/"
    },
    Ga = `${de}${Ti}`,
    Mi = ["AI study planner for JEE and NEET aspirants", "syllabus tracker for subjects, chapters, and topics", "focus timer with Pomodoro, stopwatch, and custom sessions", "study time tracker with session history and subject-wise logs", "question tracker and question analytics", "mock test analyzer and exam analytics", "revision planner with spaced repetition support", "task manager with boards, lists, habits, recurring tasks, and subtasks", "exam countdowns, D-day tracking, and prep insights", "dashboard with daily overview and study progress", "calendar planning and study scheduling", "study groups, leaderboards, group chat, and challenges", "AI insights and AI task planning based on study data", "offline-ready PWA with optional cloud sync"],
    Ha = ["jee study tracker", "jee syllabus tracker", "neet study tracker", "neet syllabus tracker", "website to record study time for jee", "website to record study time for neet", "jee mock test analyzer", "neet mock test analyzer", "jee question tracker", "neet question tracker", "jee revision planner", "neet revision planner", "jee task planner", "neet task planner", "jee focus timer", "neet focus timer", "jee study planner", "neet study planner"],
    Ka = ["AI study planner", "student productivity app", "focus timer for students", "study tracker", "study analytics", "JEE preparation app", "NEET preparation app", "BITSAT preparation app", "student dashboard", "study planner India", "exam preparation platform", "jee study tracker", "jee syllabus tracker", "neet study tracker", "neet syllabus tracker", "bitsat study tracker", "bitsat study planner", "study time tracker for students", "website to record study time", "online study planner for jee", "online study planner for neet", "online study planner for bitsat", "focus timer for study", "study tracker for neet", "study tracker for bitsat", "syllabus tracking website", "mock test analyzer", "jee mock test analyzer", "neet mock test analyzer", "bitsat mock test analyzer", "mock analysis for students", "study analytics for jee", "study analytics for neet", "study analytics for bitsat", "revision planner for jee", "revision planner for neet", "revision planner for bitsat", "task planner for students", "study task manager", "website to record study time for neet", "website to record study time for bitsat", "neet syllabus tracking website", "bitsat syllabus tracking website", ...Ha],
    xi = [{
        question: "Is IsotopeAI really free?",
        answer: "Yes. The core product stays free for everyone, while paid plans unlock premium community access, sync, and extra perks."
    }, {
        question: "Which exams does this support?",
        answer: "Students can use IsotopeAI for JEE, NEET, UPSC, SAT, GRE, university finals, and other curriculum-based exams by creating their own syllabus structure."
    }, {
        question: "Do I have to join a study group?",
        answer: "No. IsotopeAI works for solo study, but students can also join community features like silent study rooms and group accountability."
    }, {
        question: "How secure is my performance data?",
        answer: "Student performance data is kept private, and IsotopeAI does not sell personal student profiles to advertisers or coaching institutes."
    }, {
        question: "Can I use IsotopeAI as a JEE study tracker?",
        answer: "Yes. Students can use IsotopeAI to track JEE study time, plan daily work, manage tasks, review study analytics, and monitor preparation progress across subjects."
    }, {
        question: "Can I use IsotopeAI as a NEET study tracker?",
        answer: "Yes. Students preparing for NEET can use IsotopeAI to track study hours, manage syllabus coverage, plan revision, review question and mock performance, and analyze preparation across Physics, Chemistry, and Biology."
    }, {
        question: "Can I use IsotopeAI for BITSAT preparation?",
        answer: "Yes. IsotopeAI can be used for BITSAT preparation as a study planner, study time tracker, syllabus tracker, and focus system for PCM practice and revision."
    }, {
        question: "Does IsotopeAI include mock test analysis?",
        answer: "Yes. Students can use IsotopeAI to review mock performance alongside study tracking, question analytics, planning, and exam insights so test results are easier to act on."
    }, {
        question: "Does IsotopeAI work as a syllabus tracker?",
        answer: "Yes. Students can organize subjects, chapters, and topics, then use the platform as a syllabus tracker for JEE, NEET, BITSAT, boards, and other exams."
    }, {
        question: "Can I record study time online with IsotopeAI?",
        answer: "Yes. IsotopeAI can be used as a study time tracker to record focus sessions, manual sessions, and subject-wise study hours in one place."
    }, {
        question: "Does IsotopeAI help with revision planning for JEE and NEET?",
        answer: "Yes. IsotopeAI supports revision planning with syllabus organization, study tracking, and spaced repetition-oriented workflows so students can revisit weak topics more systematically."
    }, {
        question: "Does IsotopeAI include task planning and daily study management?",
        answer: "Yes. Students can manage tasks with boards, lists, habits, recurring tasks, subtasks, and AI-assisted planning inside the same platform used for focus and analytics."
    }, {
        question: "Can I track questions, not just hours?",
        answer: "Yes. IsotopeAI includes question tracking and question analytics so JEE and NEET aspirants can review attempt volume and performance alongside study time."
    }],
    Wa = `${de}/#website`,
    Xe = `${de}/#organization`,
    Di = `${de}/#application`,
    Nt = a => {
        if (!a || a === "/") return "/";
        const e = a.replace(/\/+$/, "");
        return e.startsWith("/") ? e : `/${e}`
    },
    $a = a => {
        const e = Nt(a);
        return e === "/" ? `${de}/` : `${de}${e}`
    },
    Oi = () => ({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": Xe,
        name: Re,
        url: de,
        logo: `${de}/icons/icon-512x512.png`,
        email: ia,
        description: Qe,
        sameAs: [na.discord, na.reddit],
        contactPoint: [{
            "@type": "ContactPoint",
            contactType: "customer support",
            email: ia,
            availableLanguage: ["en", "hi"]
        }]
    }),
    Li = () => ({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": Wa,
        name: Re,
        url: de,
        description: Qe,
        inLanguage: "en-IN",
        publisher: {
            "@id": Xe
        },
        keywords: Ha.join(", ")
    }),
    Ri = () => ({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": Di,
        name: Re,
        url: de,
        description: Qe,
        applicationCategory: "EducationalApplication",
        applicationSubCategory: "JEE and NEET study planner",
        operatingSystem: "Web",
        image: Ga,
        featureList: [...Mi],
        audience: {
            "@type": "Audience",
            audienceType: "JEE and NEET aspirants"
        },
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock"
        },
        publisher: {
            "@id": Xe
        }
    }),
    Ni = () => ({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: xi.map(a => ({
            "@type": "Question",
            name: a.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: a.answer
            }
        }))
    }),
    ji = (a, e, t, s) => ({
        "@context": "https://schema.org",
        "@type": e,
        name: t,
        description: s,
        url: $a(a),
        isPartOf: {
            "@id": Wa
        },
        about: {
            "@id": Xe
        }
    }),
    Ke = (a, e, t, s) => [ji(a, e, t, s)],
    Bi = [{
        match: /^\/$/,
        build: () => ({
            title: "IsotopeAI | JEE & NEET Tracker, Focus Timer, Mock Analytics",
            description: Qe,
            canonicalPath: "/",
            keywords: Ka,
            robots: Ge,
            ogType: "website",
            structuredData: [Li(), Oi(), Ri(), Ni()]
        })
    }, {
        match: /^\/about\/?$/,
        build: () => {
            const a = "About IsotopeAI | All-in-One Productivity Platform for Students",
                e = "IsotopeAI is an all-in-one productivity ecosystem for students and serious learners. Track focus, manage syllabus, analyze mocks, plan tasks, join study groups, and improve consistently from one platform.";
            return {
                title: a,
                description: e,
                canonicalPath: "/about",
                keywords: ["about IsotopeAI", "student productivity platform", "all-in-one study app", "exam preparation system", "study analytics for students"],
                robots: Ge,
                ogType: "website",
                structuredData: Ke("/about", "AboutPage", a, e)
            }
        }
    }, {
        match: /^\/privacy\/?$/,
        build: () => {
            const a = "Privacy Policy | IsotopeAI",
                e = "Read the IsotopeAI privacy policy, including how student data, analytics, subscriptions, and AI-powered features are handled.";
            return {
                title: a,
                description: e,
                canonicalPath: "/privacy",
                keywords: ["IsotopeAI privacy policy", "student data privacy", "AI privacy policy"],
                robots: Ge,
                ogType: "article",
                structuredData: Ke("/privacy", "PrivacyPolicy", a, e)
            }
        }
    }, {
        match: /^\/terms\/?$/,
        build: () => {
            const a = "Terms of Service | IsotopeAI",
                e = "Review the IsotopeAI terms of service covering eligibility, subscriptions, acceptable use, and platform access.";
            return {
                title: a,
                description: e,
                canonicalPath: "/terms",
                keywords: ["IsotopeAI terms", "terms of service", "student app terms"],
                robots: Ge,
                ogType: "article",
                structuredData: Ke("/terms", "TermsOfService", a, e)
            }
        }
    }, {
        match: /^\/(?:auth|reset-password)\/?$/,
        build: () => ({
            title: "Sign In to IsotopeAI",
            description: "Create your IsotopeAI account or sign in to access your study dashboard.",
            canonicalPath: "/auth",
            robots: He,
            ogType: "website",
            structuredData: []
        })
    }, {
        match: /^\/invite\/[^/]+\/?$/,
        build: () => ({
            title: "Study Group Invite | IsotopeAI",
            description: "Open your private IsotopeAI group invite and continue inside the app.",
            canonicalPath: "/",
            robots: He,
            ogType: "website",
            structuredData: []
        })
    }, {
        match: /^\/(dashboard|onboarding|community|focus|analytics|study|syllabus|exams|tasks|settings|subscription)(\/.*)?$/,
        build: a => ({
            title: "IsotopeAI App",
            description: "Private IsotopeAI application workspace.",
            canonicalPath: Nt(a),
            robots: He,
            ogType: "website",
            structuredData: []
        })
    }],
    Ui = a => {
        const e = Nt(a),
            t = Bi.find(i => i.match.test(e));
        if (t) return t.build(e);
        const s = "Page Not Found | IsotopeAI",
            r = "The page you requested could not be found. Explore IsotopeAI to plan study sessions, track progress, and stay focused.";
        return {
            title: s,
            description: r,
            canonicalPath: e,
            robots: He,
            ogType: "website",
            structuredData: Ke(e, "WebPage", s, r)
        }
    },
    Fi = () => ({
        url: Ga,
        alt: "IsotopeAI landing page preview",
        width: String(Ci),
        height: String(Pi)
    }),
    he = Fi(),
    F = (a, e) => {
        if (!e) return;
        const t = a.name ? `meta[name="${a.name}"]` : `meta[property="${a.property}"]`;
        let s = document.head.querySelector(t);
        s || (s = document.createElement("meta"), a.name && s.setAttribute("name", a.name), a.property && s.setAttribute("property", a.property), document.head.appendChild(s)), s.setAttribute("content", e)
    },
    zi = (a, e) => {
        let t = document.head.querySelector(`link[rel="${a}"]`);
        t || (t = document.createElement("link"), t.setAttribute("rel", a), document.head.appendChild(t)), t.setAttribute("href", e)
    },
    qi = a => {
        document.querySelectorAll('script[data-seo-structured-data="true"]').forEach(e => e.remove()), a.forEach((e, t) => {
            const s = document.createElement("script");
            s.type = "application/ld+json", s.dataset.seoStructuredData = "true", s.id = `seo-structured-data-${t}`, s.text = JSON.stringify(e), document.head.appendChild(s)
        })
    },
    Gi = () => {
        const a = Za();
        return v.useEffect(() => {
            const e = Ui(a.pathname),
                t = $a(e.canonicalPath),
                s = e.keywords ?? Ka;
            document.title = e.title, document.documentElement.lang = "en", F({
                name: "description"
            }, e.description), F({
                name: "keywords"
            }, s.join(", ")), F({
                name: "robots"
            }, e.robots), F({
                name: "googlebot"
            }, e.robots), F({
                name: "author"
            }, Re), F({
                property: "og:type"
            }, e.ogType), F({
                property: "og:site_name"
            }, Re), F({
                property: "og:locale"
            }, "en_IN"), F({
                property: "og:title"
            }, e.title), F({
                property: "og:description"
            }, e.description), F({
                property: "og:url"
            }, t), F({
                property: "og:image"
            }, he.url), F({
                property: "og:image:secure_url"
            }, he.url), F({
                property: "og:image:alt"
            }, he.alt), F({
                property: "og:image:width"
            }, he.width), F({
                property: "og:image:height"
            }, he.height), F({
                name: "twitter:card"
            }, "summary_large_image"), F({
                name: "twitter:title"
            }, e.title), F({
                name: "twitter:description"
            }, e.description), F({
                name: "twitter:url"
            }, t), F({
                name: "twitter:image"
            }, he.url), F({
                name: "twitter:image:alt"
            }, he.alt), zi("canonical", t), qi(e.structuredData)
        }, [a.pathname]), null
    },
    Hi = v.lazy(() => j(() =>
        import ("./Landing-CWRNt7E9.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]))),
    Ki = v.lazy(() => j(() =>
        import ("./Dashboard-dypAV-0H.js"), __vite__mapDeps([16, 2, 17, 18, 10, 11, 5, 19, 1, 3, 20, 21, 22, 23, 6, 7, 8, 24, 12, 25, 26, 27, 28, 29, 30, 31, 9, 15]))),
    Wi = v.lazy(() => j(() =>
        import ("./Focus-BmgY-9vP.js"), __vite__mapDeps([32, 2, 23, 6, 7, 5, 8, 21, 1, 3, 22, 24, 20, 19, 12, 25, 26, 33, 34, 29, 10, 11, 18, 17, 9, 35, 15]))),
    $i = v.lazy(() => j(() =>
        import ("./Analytics-D74gQMjN.js").then(a => a.A), __vite__mapDeps([36, 1, 2, 3, 23, 6, 7, 5, 8, 21, 22, 24, 20, 19, 12, 25, 26, 14, 31, 18, 10, 11, 37]))),
    Ji = v.lazy(() => j(() =>
        import ("./Study-pAdAenIl.js"), __vite__mapDeps([38, 2, 23, 6, 7, 5, 8, 21, 1, 3, 22, 24, 20, 19, 12, 25, 26, 39, 10, 11, 40, 18, 17, 28, 29, 41, 34, 42, 15]))),
    Vi = v.lazy(() => j(() =>
        import ("./Syllabus-DZSnov0t.js"), __vite__mapDeps([43, 2, 17, 18, 10, 11, 5, 23, 6, 7, 8, 21, 1, 3, 22, 24, 20, 19, 12, 25, 26, 37, 28, 29, 40, 41, 34, 15]))),
    Yi = v.lazy(() => j(() =>
        import ("./Exams-C3jymPwe.js"), __vite__mapDeps([44, 2, 10, 11, 23, 6, 7, 5, 8, 21, 1, 3, 22, 24, 20, 19, 12, 25, 26, 39, 45, 15]))),
    Qi = v.lazy(() => j(() =>
        import ("./ExamDetailPage-q_jDT5_x.js"), __vite__mapDeps([46, 2, 10, 11, 20, 21, 1, 3, 22, 39, 5, 8, 23, 6, 7, 24, 19, 12, 25, 26, 45, 15])).then(a => ({
        default: a.default
    }))),
    Xi = v.lazy(() => j(() =>
        import ("./Tasks-BYRFOrek.js"), __vite__mapDeps([47, 2, 21, 1, 3, 22, 37, 28, 20, 10, 11, 8, 5, 24, 29, 12, 18, 23, 6, 7, 19, 25, 26, 9, 48, 30, 15, 49]))),
    Zi = v.lazy(() => j(() =>
        import ("./ChapterHub-BXRydU0B.js"), __vite__mapDeps([50, 2, 10, 11, 26, 21, 1, 3, 22, 20, 5, 12, 8, 51, 52, 53, 15]))),
    oa = v.lazy(() => j(() =>
        import ("./Community-DIqF5406.js").then(a => a.a), __vite__mapDeps([54, 1, 2, 3, 23, 6, 7, 5, 8, 21, 22, 24, 20, 19, 12, 25, 26]))),
    en = v.lazy(() => j(() =>
        import ("./Auth-Cw0VAaCZ.js"), __vite__mapDeps([55, 2, 12, 8, 5, 1, 3, 15]))),
    tn = v.lazy(() => j(() =>
        import ("./ResetPassword-mBBJZV4T.js"), __vite__mapDeps([56, 2, 5, 12, 1, 3, 15, 8]))),
    an = v.lazy(() => j(() =>
        import ("./Onboarding-qvAqCBbb.js").then(a => a.O), __vite__mapDeps([57, 1, 2, 3, 21, 22, 5, 12]))),
    sn = v.lazy(() => j(() =>
        import ("./DemoLauncher-CdcwMBr6.js"), __vite__mapDeps([58, 2, 1, 3, 15, 8, 5, 12]))),
    rn = v.lazy(() => j(() =>
        import ("./SettingsLayout-B4OgCkQ5.js"), __vite__mapDeps([59, 2, 23, 6, 7, 5, 8, 21, 1, 3, 22, 24, 20, 19, 12, 25, 26, 60, 61, 15, 62, 35, 63, 40, 18, 17, 10, 11, 48, 27]))),
    nn = v.lazy(() => j(() =>
        import ("./Subscription-UaefsAtQ.js"), __vite__mapDeps([64, 2, 23, 6, 7, 5, 8, 21, 1, 3, 22, 24, 20, 19, 12, 25, 26, 15, 13]))),
    on = v.lazy(() => j(() =>
        import ("./InviteOnlineOnlyRoute-CZgdOWgx.js"), __vite__mapDeps([65, 2, 7, 66, 67, 68, 69, 10, 11, 5, 12, 8, 1, 3, 15]))),
    cn = v.lazy(() => j(() =>
        import ("./NotFound-X23NBnde.js"), __vite__mapDeps([70, 2, 71, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 3, 15]))),
    ln = v.lazy(() => j(() =>
        import ("./Terms-BXixZPB6.js"), __vite__mapDeps([72, 2, 71, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 3, 15]))),
    dn = v.lazy(() => j(() =>
        import ("./About-DbJqhVWT.js"), __vite__mapDeps([73, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 3, 15]))),
    un = v.lazy(() => j(() =>
        import ("./Privacy-ClP3A1gm.js"), __vite__mapDeps([74, 2, 71, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 3, 15]))),
    Q = v.lazy(() => j(() =>
        import ("./AppAccessGate-B975UtK7.js").then(a => a.A), __vite__mapDeps([75, 2, 1, 3, 7, 62, 20, 21, 22, 76, 77, 15, 8, 5, 12, 25, 66, 67, 69, 10, 11]))),
    mn = v.lazy(() => j(() =>
        import ("./PWAManager-DjIYufp2.js"), __vite__mapDeps([78, 2, 61, 1, 3, 15, 8, 5, 12, 22]))),
    pn = v.lazy(() => j(() =>
        import ("./SupportPromptDialog-Bkl24oin.js"), __vite__mapDeps([79, 2, 80, 10, 11, 8, 5, 13, 12, 1, 3, 15])).then(a => ({
        default: a.SupportPromptDialog
    }))),
    fn = (a, e = 2e3) => {
        if (typeof window > "u") return a(), () => {};
        const t = window;
        if (typeof t.requestIdleCallback == "function") {
            const r = t.requestIdleCallback(a, {
                timeout: e
            });
            return () => {
                t.cancelIdleCallback ?.(r)
            }
        }
        const s = window.setTimeout(a, e);
        return () => {
            window.clearTimeout(s)
        }
    },
    hn = ({
        isDark: a,
        toggleTheme: e
    }) => S.jsx(v.Suspense, {
        fallback: S.jsx("div", {
            className: `min-h-screen flex items-center justify-center ${a?"bg-[#09090b] text-white":"bg-[#f4f4f5] text-zinc-900"}`,
            children: S.jsx("div", {
                className: "animate-pulse font-display text-xl",
                children: "Loading..."
            })
        }),
        children: S.jsxs(ts, {
            children: [S.jsx(B, {
                path: "/",
                element: S.jsx(Hi, {
                    isDark: a,
                    toggleTheme: e
                })
            }), S.jsx(B, {
                path: "/demo",
                element: S.jsx(sn, {})
            }), S.jsx(B, {
                path: "/auth",
                element: S.jsx(en, {})
            }), S.jsx(B, {
                path: "/reset-password",
                element: S.jsx(tn, {})
            }), S.jsx(B, {
                path: "/onboarding",
                element: S.jsx(Q, {
                    mode: "private",
                    children: S.jsx(an, {
                        isDark: a
                    })
                })
            }), S.jsx(B, {
                path: "/dashboard",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx(Ki, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/community",
                element: S.jsx(Q, {
                    mode: "protected",
                    onlineOnly: {
                        title: "Community is unavailable offline",
                        description: "Groups, leaderboards, live presence, and challenges need an internet connection. Reconnect to browse the community or join a study room.",
                        ctaLabel: "Back to dashboard",
                        ctaTo: "/dashboard"
                    },
                    children: S.jsx(oa, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/community/group/:slug",
                element: S.jsx(Q, {
                    mode: "protected",
                    onlineOnly: {
                        title: "Community is unavailable offline",
                        description: "Group pages depend on live community data. Reconnect to view members, chat, invites, and presence updates.",
                        ctaLabel: "Back to dashboard",
                        ctaTo: "/dashboard"
                    },
                    children: S.jsx(oa, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/invite/:token",
                element: S.jsx(on, {})
            }), S.jsx(B, {
                path: "/focus",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx(Wi, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/analytics",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx($i, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/study",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx(Ji, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/syllabus",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx(Vi, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/syllabus/chapter/:chapterId",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx(Zi, {})
                })
            }), S.jsx(B, {
                path: "/exams",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx(Yi, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/exams/:examId",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx(Qi, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/tasks",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx(Xi, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/settings",
                element: S.jsx(Q, {
                    mode: "protected",
                    children: S.jsx(rn, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/subscription",
                element: S.jsx(Q, {
                    mode: "protected",
                    onlineOnly: {
                        title: "Billing is unavailable offline",
                        description: "Checkout, invoices, and billing management require an internet connection. Reconnect to upgrade your plan or manage payments safely.",
                        ctaLabel: "Back to dashboard",
                        ctaTo: "/dashboard"
                    },
                    children: S.jsx(nn, {
                        isDark: a,
                        toggleTheme: e
                    })
                })
            }), S.jsx(B, {
                path: "/terms",
                element: S.jsx(ln, {
                    isDark: a,
                    toggleTheme: e
                })
            }), S.jsx(B, {
                path: "/privacy",
                element: S.jsx(un, {
                    isDark: a,
                    toggleTheme: e
                })
            }), S.jsx(B, {
                path: "/about",
                element: S.jsx(dn, {
                    isDark: a,
                    toggleTheme: e
                })
            }), S.jsx(B, {
                path: "*",
                element: S.jsx(cn, {
                    isDark: a,
                    toggleTheme: e
                })
            })]
        })
    }),
    yn = () => {
        const a = Ee(c => c.profile),
            e = Ee(c => c.updateProfile),
            t = a ?.settings ?.theme,
            [s, r] = v.useState(!1),
            [i, n] = v.useState(() => typeof document < "u" ? document.documentElement.classList.contains("dark") : Je(Te));
        v.useEffect(() => fn(() => {
            r(!0)
        }, 1500), []), v.useEffect(() => {
            if (!t) {
                n(typeof document < "u" && document.documentElement.classList.contains("dark"));
                return
            }
            const c = () => {
                n(Je(t))
            };
            if (c(), t === "system") {
                const d = window.matchMedia("(prefers-color-scheme: dark)"),
                    h = () => c();
                return d.addEventListener("change", h), () => d.removeEventListener("change", h)
            }
        }, [t]);
        const o = async () => {
            const c = i ? "light" : "dark";
            await e({
                settings: { ...a ?.settings,
                    theme : c,
                    notifications: a ?.settings ?.notifications ?? !0
                }
            })
        };
        return S.jsx(vi, {
            children: S.jsxs(es, {
                children: [S.jsx(Gi, {}), S.jsx(ki, {}), S.jsx(Ei, {
                    children: S.jsx(hn, {
                        isDark: i,
                        toggleTheme: o
                    })
                }), s && S.jsxs(v.Suspense, {
                    fallback: null,
                    children: [S.jsx(mn, {}), S.jsx(pn, {})]
                })]
            })
        })
    },
    Bn = Object.freeze(Object.defineProperty({
        __proto__: null,
        default: yn
    }, Symbol.toStringTag, {
        value: "Module"
    }));
export {
    In as $, m as A, Rn as B, pt as C, Te as D, Ve as E, Oe as F, Oa as G, ys as H, pa as I, ye as J, Ar as K, va as L, Z as M, se as N, L as O, Br as P, Ba as Q, Fa as R, ht as S, Nn as T, Ur as U, Ct as V, Pt as W, En as X, Tn as Y, Cn as Z, la as _, U as a, Qs as a0, P as a1, l as a2, V as a3, We as a4, _i as a5, nt as a6, os as a7, cs as a8, Dn as a9, Xr as aa, Ln as ab, tt as ac, Ze as ad, Bn as ae, Mn as b, jn as c, ca as d, Ma as e, Yr as f, wn as g, Ee as h, M as i, ge as j, x as k, Tt as l, O as m, hs as n, p as o, zr as p, Ut as q, xn as r, w as s, Ea as t, ci as u, ba as v, vn as w, yt as x, On as y, Pn as z
};
