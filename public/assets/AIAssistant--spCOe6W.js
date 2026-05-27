import {
    r as h,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as Le,
    A as Me,
    Q as fe,
    p as Be
} from "./useAIStore-B2cv1FZz.js";
import {
    c as i
} from "./utils-D8mZnxMk.js";
import {
    I as D
} from "./IsotopeLogoIcon-oPk5Ru-_.js";
import {
    M as Oe
} from "./MarkdownRenderer-CIV1x0Uq.js";
import {
    A as H,
    m as T
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    aK as Ue,
    aL as Q,
    P as we,
    X as De,
    ab as G,
    S as W,
    al as je,
    Z as Ne,
    l as Re,
    a9 as Fe,
    a1 as Ke,
    J as Ve,
    am as Ye,
    aB as I,
    aM as qe,
    f as ye,
    b as J,
    B as ee,
    a as He,
    L as Qe,
    aN as ze,
    h as Ge,
    aO as We,
    aP as Ze,
    aQ as Xe,
    aR as Je,
    d as et,
    ap as tt
} from "./vendor-icons-CqruUz7g.js";
import {
    u as rt
} from "./vendor-router-CmoTwRnm.js";
import "./App-pJGjDiPw.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./useFocusStore-CX_Nyp1h.js";
import "./useNotificationStore-BS4df28T.js";
import "./vendor-charts-CFLJvnG7.js";
const st = {
        ListTodo: I,
        Calendar: Ye,
        Lightbulb: Ve,
        FileText: Ke,
        Calculator: Fe,
        BarChart3: Re
    },
    o = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
    Z = i("inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white text-zinc-600 transition-colors duration-200", "hover:border-brand-300/70 hover:text-brand-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-brand-500/40 dark:hover:text-white", o),
    at = {
        productivity: "Productivity",
        planning: "Planning",
        study: "Study",
        analysis: "Analysis"
    },
    it = [{
        id: "create_task",
        icon: qe,
        label: "Create Task",
        description: "Add a new task to your board",
        prompt: "Create a task for [Subject] to [Task Title]"
    }, {
        id: "update_syllabus",
        icon: ye,
        label: "Update Syllabus",
        description: "Mark topics as completed",
        prompt: "Mark [Topic] in [Subject] as completed"
    }, {
        id: "create_exam",
        icon: J,
        label: "Schedule Exam",
        description: "Add upcoming exams or tests",
        prompt: "Schedule an exam for [Subject] on [Date]"
    }, {
        id: "add_chapter",
        icon: ee,
        label: "Add Chapter",
        description: "Expand subject syllabus",
        prompt: "Add a chapter called [Chapter Name] to [Subject]"
    }, {
        id: "start_focus",
        icon: He,
        label: "Focus Session",
        description: "Start a timer instantly",
        prompt: "Start a focus session for [Subject]"
    }, {
        id: "bulk_syllabus",
        icon: Qe,
        label: "Bulk Syllabus",
        description: "Add multiple chapters at once",
        prompt: "Create a syllabus for [Subject] with chapters: Chapter 1 (Topic A, Topic B), Chapter 2 (Topic C)"
    }],
    te = a => typeof a == "object" && a !== null && !Array.isArray(a),
    nt = a => a.replace(/([A-Z])/g, " $1").replace(/[_-]+/g, " ").replace(/\b\w/g, d => d.toUpperCase()).trim(),
    b = a => {
        if (a == null || a === "") return "";
        if (typeof a == "boolean") return a ? "Yes" : "No";
        if (typeof a == "number") return String(a);
        if (typeof a == "string") return a;
        if (Array.isArray(a)) {
            if (a.length === 0) return "";
            const d = a.filter(l => typeof l == "string" || typeof l == "number" || typeof l == "boolean");
            return d.length === a.length ? d.map(b).filter(Boolean).join(", ") : `${a.length} item${a.length===1?"":"s"}`
        }
        return te(a) ? b(a.title) || b(a.name) || b(a.taskTitle) || b(a.examTitle) || `${Object.keys(a).length} field${Object.keys(a).length===1?"":"s"}` : String(a)
    },
    E = (a, d = {}) => {
        if (!te(a)) return [];
        const l = new Set(d.skipKeys || []);
        return Object.entries(a).filter(([p, c]) => !l.has(p) && b(c)).slice(0, d.limit ?? 10).map(([p, c]) => `${nt(p)}: ${b(c)}`)
    },
    X = a => E(a, {
        limit: 8
    }).join(" • ") || "Selected records",
    ve = new Set(["create_subject", "update_subject", "delete_subject", "reorder_subjects", "create_chapter", "bulk_create_chapters", "bulk_create_syllabus", "update_chapter", "bulk_update_chapters", "delete_chapter", "reorder_chapters", "create_topic", "bulk_create_topics", "update_topic", "bulk_update_topics", "delete_topic", "reorder_topics", "create_subtopic", "update_subtopic", "delete_subtopic", "complete_topic", "reopen_topic", "bulk_complete_topics", "bulk_reopen_topics", "set_chapter_priority", "bulk_set_chapter_priority", "mark_chapter_revision", "update_chapter_revision", "increment_chapter_revision_count", "update_chapter_metadata", "update_topic_metadata", "create_tracking_column", "update_tracking_column", "delete_tracking_column", "reorder_tracking_columns", "apply_tracking_columns", "set_tracking_checkbox", "bulk_set_tracking_checkbox", "set_tracking_count", "increment_tracking_count", "decrement_tracking_count", "bulk_set_tracking_count", "complete_chapter_tracking", "reset_subject_syllabus_config", "create_syllabus_task", "create_revision_tasks_from_syllabus", "explain_syllabus_coverage", "create_chapter_note", "create_chapter_formula", "create_chapter_key_point", "create_chapter_mistake", "create_chapter_question", "create_chapter_flashcard", "create_chapter_resource", "bulk_create_chapter_artifacts"]),
    Nt = () => {
        const {
            conversations: a,
            currentConversationId: d,
            isLoading: l,
            isStreaming: p,
            isAssistantOpen: c,
            hasApiKey: n,
            settings: z,
            error: f,
            sendMessage: w,
            createConversation: u,
            deleteConversation: re,
            setCurrentConversation: g,
            toggleAssistant: x,
            clearError: _,
            getCurrentConversation: $,
            confirmToolAction: R,
            cancelToolAction: F,
            pendingToolCall: s
        } = Le(), se = rt(), [C, P] = h.useState(""), [j, _e] = h.useState(!1), [Ce, ae] = h.useState(null), ie = h.useRef(null), L = h.useRef(null), M = $(), K = s ?.tool === "bulk_add_syllabus" ? s.params : null, ne = s ?.tool === "bulk_create_exams" ? s.params : null, de = s ?.tool === "bulk_update_exams" ? s.params : null, le = s ?.tool === "bulk_create_tasks" ? s.params : null, N = s ?.tool === "bulk_update_tasks" ? s.params : null, Ae = (t, r) => t.title || t.taskTitle || t.taskId || r, B = t => {
            const r = t && typeof t == "object" ? t : {};
            return [typeof r.dueDate == "string" ? `Due: ${r.dueDate}` : "", typeof r.priority == "string" ? `Priority: ${r.priority}` : "", typeof r.status == "string" ? `Status: ${r.status}` : "", typeof r.subject == "string" || typeof r.subjectId == "string" ? `Subject: ${String(r.subject||r.subjectId)}` : "", typeof r.chapter == "string" || typeof r.chapterId == "string" ? `Chapter: ${String(r.chapter||r.chapterId)}` : "", typeof r.topic == "string" || typeof r.topicId == "string" ? `Topic: ${String(r.topic||r.topicId)}` : "", typeof r.effort == "number" ? `${r.effort} min` : "", typeof r.energy == "string" ? `Energy: ${r.energy}` : "", Array.isArray(r.subtasks) && r.subtasks.length ? `${r.subtasks.length} subtasks` : "", Array.isArray(r.addSubtasks) && r.addSubtasks.length ? `Add ${r.addSubtasks.length} subtasks` : ""].filter(Boolean)
        }, Se = () => {
            if (!s || !ve.has(s.tool)) return null;
            const t = s.params,
                r = Array.isArray(t.chapters) ? t.chapters : [],
                m = Array.isArray(t.subjects) ? t.subjects : [],
                A = Array.isArray(t.topics) ? t.topics : [],
                Y = Array.isArray(t.updates) ? t.updates : [],
                pe = Array.isArray(t.artifacts) ? t.artifacts : [],
                q = /\b(delete|reset)\b/.test(s.tool),
                Pe = s.tool === "bulk_create_chapter_artifacts" ? "Chapter Hub Import" : s.tool.startsWith("create_chapter_") ? "Chapter Hub Item" : "Syllabus Action",
                S = m.length || r.length || A.length || Y.length || pe.length ? m.length ? m : r.length ? r : A.length ? A : Y.length ? Y : pe : [];
            return e.jsxs("div", {
                className: i("mb-6 rounded-3xl border p-5", q ? "border-red-200/80 bg-red-50 dark:border-red-500/20 dark:bg-red-500/[0.08]" : "border-zinc-200/80 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03]"),
                children: [e.jsxs("div", {
                    className: i("mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]", q ? "text-red-700 dark:text-red-300" : "text-brand-700 dark:text-brand-300"),
                    children: [q ? e.jsx(G, {
                        className: "w-4 h-4"
                    }) : e.jsx(ee, {
                        className: "w-4 h-4"
                    }), Pe]
                }), e.jsxs("div", {
                    className: "rounded-2xl border border-zinc-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]",
                    children: [e.jsx("div", {
                        className: "font-semibold text-zinc-900 dark:text-white",
                        children: s.tool.replace(/_/g, " ")
                    }), e.jsxs("div", {
                        className: "mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                        children: [E(t, {
                            skipKeys: ["subjects", "chapters", "topics", "updates", "artifacts"],
                            limit: 10
                        }).map(v => e.jsx("span", {
                            className: "rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 dark:border-white/10 dark:bg-black/20",
                            children: v
                        }, v)), t.selection ? e.jsxs("span", {
                            children: ["Selection: ", X(t.selection)]
                        }) : null]
                    })]
                }), S.length > 0 && e.jsx("div", {
                    className: "mt-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar",
                    children: e.jsxs("div", {
                        className: "space-y-3",
                        children: [S.slice(0, 40).map((v, ue) => {
                            const y = te(v) ? v : {
                                    title: String(v)
                                },
                                ge = b(y.name) || b(y.title) || b(y.chapterTitle) || b(y.topicTitle) || b(y.kind) || `Item ${ue+1}`;
                            return e.jsxs("div", {
                                className: "rounded-2xl border border-zinc-200/80 bg-white p-3 text-sm dark:border-white/10 dark:bg-white/[0.04]",
                                children: [e.jsx("div", {
                                    className: "font-semibold text-zinc-900 dark:text-white",
                                    children: ge
                                }), e.jsx("div", {
                                    className: "mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                                    children: E(y, {
                                        limit: 8
                                    }).map(ke => e.jsx("span", {
                                        children: ke
                                    }, ke))
                                })]
                            }, `${ge}-${ue}`)
                        }), S.length > 40 && e.jsxs("div", {
                            className: "text-xs text-zinc-500 dark:text-zinc-400",
                            children: [S.length - 40, " more item", S.length - 40 === 1 ? "" : "s", " in this batch."]
                        })]
                    })
                })]
            })
        }, O = Array.isArray(a) ? a : [], U = Array.isArray(M ?.messages) ? M.messages : [], V = Me.find(t => t.id === z.preferredModel) ?.name || "AI Model";
        h.useEffect(() => {
            ie.current ?.scrollIntoView({
                behavior: "smooth"
            })
        }, [M ?.messages, p, s]), h.useEffect(() => {
            c && n && setTimeout(() => L.current ?.focus(), 100)
        }, [c, n]), h.useEffect(() => {
            if (!c) return;
            const t = r => {
                r.key === "Escape" && x(!1)
            };
            return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t)
        }, [c, x]), h.useEffect(() => {
            if (f) {
                const t = setTimeout(_, 5e3);
                return () => clearTimeout(t)
            }
        }, [f, _]);
        const ce = () => {
                !C.trim() || l || (w(C.trim(), {
                    currentPath: `${window.location.pathname}${window.location.search}`
                }), P(""))
            },
            Te = t => {
                t.key === "Enter" && !t.shiftKey && (t.preventDefault(), ce())
            },
            Ie = (t, r) => {
                navigator.clipboard.writeText(t), ae(r), setTimeout(() => ae(null), 2e3)
            },
            oe = t => new Date(t).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
            xe = t => {
                P(t), L.current && L.current.focus()
            },
            me = h.useCallback(() => {
                u(), P("")
            }, [u]),
            be = h.useCallback(() => {
                x(!1), se("/settings", {
                    state: {
                        tab: "ai"
                    }
                })
            }, [se, x]),
            he = `${O.length} conversation${O.length===1?"":"s"}`,
            Ee = U.length === 0,
            $e = M ?.title || "Fresh conversation",
            k = j;
        return z.isEnabled ? e.jsxs(e.Fragment, {
            children: [e.jsx(H, {
                children: c && e.jsx(T.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: () => x(!1),
                    className: "fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                })
            }), e.jsx(H, {
                children: c && e.jsx(T.div, {
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
                    onClick: t => t.stopPropagation(),
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "ai-assistant-title",
                    className: "fixed inset-3 z-50 flex items-center justify-center md:inset-8 xl:inset-10",
                    children: e.jsxs("div", {
                        className: "relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950",
                        children: [e.jsx("div", {
                            className: "pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/[0.08] via-transparent to-brand-500/[0.03] dark:from-brand-500/[0.14] dark:via-transparent dark:to-brand-500/[0.06]"
                        }), e.jsx("div", {
                            className: "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-brand-500/10 to-transparent dark:from-brand-500/15"
                        }), e.jsx("div", {
                            className: "relative border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85",
                            children: e.jsxs("div", {
                                className: "flex items-center justify-between gap-3 px-4 py-4 md:px-6",
                                children: [e.jsxs("div", {
                                    className: "flex min-w-0 items-center gap-3 md:gap-4",
                                    children: [e.jsx("button", {
                                        onClick: () => _e(!j),
                                        "aria-controls": "ai-conversation-history",
                                        "aria-expanded": j,
                                        "aria-label": j ? "Hide conversation history" : "Show conversation history",
                                        className: Z,
                                        children: j ? e.jsx(Ue, {
                                            className: "w-5 h-5"
                                        }) : e.jsx(Q, {
                                            className: "w-5 h-5"
                                        })
                                    }), e.jsxs("div", {
                                        className: "flex min-w-0 items-center gap-3",
                                        children: [e.jsxs("div", {
                                            className: "relative flex-shrink-0",
                                            children: [e.jsx("div", {
                                                className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/20",
                                                children: e.jsx(D, {
                                                    className: "w-6 h-6 text-white"
                                                })
                                            }), e.jsx("div", {
                                                className: i("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-950", n ? "bg-emerald-500" : "bg-amber-500")
                                            })]
                                        }), e.jsxs("div", {
                                            className: "min-w-0",
                                            children: [e.jsxs("div", {
                                                className: "flex flex-wrap items-center gap-2",
                                                children: [e.jsx("h2", {
                                                    id: "ai-assistant-title",
                                                    className: "truncate text-base font-semibold text-zinc-950 dark:text-white md:text-lg",
                                                    children: "Isotope Agent"
                                                }), e.jsx("span", {
                                                    className: "rounded-full border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-200",
                                                    children: "AI workspace"
                                                })]
                                            }), e.jsxs("div", {
                                                className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                                                children: [e.jsx("span", {
                                                    className: "truncate font-medium text-zinc-700 dark:text-zinc-200",
                                                    children: $e
                                                }), e.jsx("span", {
                                                    "aria-hidden": "true",
                                                    className: "text-zinc-300 dark:text-zinc-700",
                                                    children: "•"
                                                }), e.jsx("span", {
                                                    children: V
                                                }), e.jsx("span", {
                                                    "aria-hidden": "true",
                                                    className: "text-zinc-300 dark:text-zinc-700",
                                                    children: "•"
                                                }), e.jsx("span", {
                                                    className: i("font-medium", n ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"),
                                                    children: n ? "Connected" : "Setup required"
                                                })]
                                            })]
                                        })]
                                    })]
                                }), e.jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [e.jsx("div", {
                                        className: "hidden rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 md:block",
                                        children: he
                                    }), e.jsx("button", {
                                        onClick: me,
                                        "aria-label": "Start a new conversation",
                                        className: Z,
                                        children: e.jsx(we, {
                                            className: "w-5 h-5"
                                        })
                                    }), e.jsx("button", {
                                        onClick: () => x(!1),
                                        "aria-label": "Close assistant",
                                        className: Z,
                                        children: e.jsx(De, {
                                            className: "w-5 h-5"
                                        })
                                    })]
                                })]
                            })
                        }), e.jsxs("div", {
                            className: "relative flex flex-1 overflow-hidden",
                            children: [e.jsx(H, {
                                children: j && e.jsx(T.div, {
                                    id: "ai-conversation-history",
                                    role: "complementary",
                                    "aria-label": "Conversation history",
                                    initial: {
                                        width: 0,
                                        opacity: 0
                                    },
                                    animate: {
                                        width: 288,
                                        opacity: 1
                                    },
                                    exit: {
                                        width: 0,
                                        opacity: 0
                                    },
                                    className: "h-full overflow-hidden border-r border-zinc-200/80 bg-white/92 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/88",
                                    children: e.jsxs("div", {
                                        className: "flex h-full flex-col",
                                        children: [e.jsxs("div", {
                                            className: "border-b border-zinc-200/80 px-3 py-3 dark:border-white/10 md:px-4",
                                            children: [e.jsxs("div", {
                                                className: "mb-3 flex items-start justify-between gap-3",
                                                children: [e.jsxs("div", {
                                                    children: [e.jsx("p", {
                                                        className: "text-sm font-semibold text-zinc-950 dark:text-white",
                                                        children: "Conversation history"
                                                    }), e.jsx("p", {
                                                        className: "mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400",
                                                        children: "Browse recent threads without losing your place."
                                                    })]
                                                }), e.jsx("div", {
                                                    className: "rounded-full border border-zinc-200/80 bg-zinc-100/80 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-400",
                                                    children: he
                                                })]
                                            }), e.jsxs("button", {
                                                onClick: me,
                                                className: i("flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-colors hover:bg-brand-500", o),
                                                children: [e.jsx(we, {
                                                    className: "w-4 h-4"
                                                }), "New chat"]
                                            })]
                                        }), e.jsx("div", {
                                            className: "flex-1 overflow-y-auto p-2.5 custom-scrollbar md:p-3",
                                            children: e.jsxs("div", {
                                                className: "space-y-1.5",
                                                children: [O.map(t => e.jsxs("div", {
                                                    className: i("group flex items-center gap-1.5 rounded-[22px] border p-1.5 transition-colors", d === t.id ? "border-brand-400/35 bg-brand-500/[0.08] text-zinc-950 shadow-sm shadow-brand-500/10 dark:text-white" : "border-transparent text-zinc-600 hover:border-zinc-200/80 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:border-white/10 dark:hover:bg-white/[0.04] dark:hover:text-white"),
                                                    children: [e.jsxs("button", {
                                                        onClick: () => {
                                                            g(t.id)
                                                        },
                                                        "aria-current": d === t.id,
                                                        className: i("flex min-w-0 flex-1 items-start gap-3 rounded-[18px] px-2 py-2 text-left transition-colors", o),
                                                        children: [e.jsx("div", {
                                                            className: i("mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl text-zinc-500 dark:text-zinc-300", d === t.id ? "bg-brand-500/12 text-brand-700 dark:text-brand-200" : "bg-zinc-100 dark:bg-white/[0.05]"),
                                                            children: e.jsx(Q, {
                                                                className: "w-4 h-4"
                                                            })
                                                        }), e.jsxs("div", {
                                                            className: "min-w-0 flex-1",
                                                            children: [e.jsx("div", {
                                                                className: "truncate text-sm font-medium text-inherit",
                                                                children: t.title
                                                            }), e.jsxs("div", {
                                                                className: "mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400",
                                                                children: [e.jsxs("span", {
                                                                    children: [Array.isArray(t.messages) ? t.messages.length : 0, " ", Array.isArray(t.messages) && t.messages.length === 1 ? "message" : "messages"]
                                                                }), e.jsx("span", {
                                                                    "aria-hidden": "true",
                                                                    className: "text-zinc-300 dark:text-zinc-700",
                                                                    children: "•"
                                                                }), e.jsx("span", {
                                                                    children: d === t.id ? "Current thread" : `Updated ${oe(t.updatedAt)}`
                                                                })]
                                                            })]
                                                        })]
                                                    }), e.jsx("button", {
                                                        onClick: () => re(t.id),
                                                        "aria-label": `Delete conversation ${t.title}`,
                                                        className: i("rounded-xl p-2 text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100", o),
                                                        children: e.jsx(G, {
                                                            className: "w-4 h-4"
                                                        })
                                                    })]
                                                }, t.id)), O.length === 0 && e.jsxs("div", {
                                                    className: "rounded-[24px] border border-dashed border-zinc-200/80 bg-zinc-50/90 px-4 py-6 text-center dark:border-white/10 dark:bg-white/[0.03]",
                                                    children: [e.jsx("div", {
                                                        className: "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-400",
                                                        children: e.jsx(Q, {
                                                            className: "w-4 h-4"
                                                        })
                                                    }), e.jsx("p", {
                                                        className: "text-sm font-medium text-zinc-900 dark:text-white",
                                                        children: "No conversations yet"
                                                    }), e.jsx("p", {
                                                        className: "mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400",
                                                        children: "Your recent threads will appear here once you start chatting."
                                                    })]
                                                })]
                                            })
                                        })]
                                    })
                                })
                            }), e.jsxs("div", {
                                className: "relative flex flex-1 flex-col bg-zinc-50/80 dark:bg-zinc-950/60",
                                children: [e.jsx("div", {
                                    className: "pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-zinc-100/20 dark:from-white/[0.02] dark:via-transparent dark:to-black/20"
                                }), n ? e.jsxs(e.Fragment, {
                                    children: [e.jsxs("div", {
                                        className: "relative flex-1 overflow-y-auto px-4 py-4 custom-scrollbar scroll-smooth md:px-6 md:py-5",
                                        children: [Ee && e.jsxs("div", {
                                            className: i("mx-auto flex w-full flex-col gap-6 py-4 md:py-6", k ? "max-w-4xl" : "max-w-5xl"),
                                            children: [e.jsxs("div", {
                                                className: i("grid gap-4", k ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"),
                                                children: [e.jsxs("section", {
                                                    className: i("rounded-[32px] border border-zinc-200/80 bg-white/90 shadow-lg dark:border-white/10 dark:bg-zinc-950/75", k ? "p-6 md:p-7" : "p-6 md:p-8"),
                                                    children: [e.jsxs("div", {
                                                        className: "inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-200",
                                                        children: [e.jsx(Ne, {
                                                            className: "h-3.5 w-3.5"
                                                        }), "Study cockpit"]
                                                    }), e.jsxs("div", {
                                                        className: "mt-5 max-w-2xl",
                                                        children: [e.jsx(T.div, {
                                                            initial: {
                                                                scale: .9,
                                                                opacity: 0
                                                            },
                                                            animate: {
                                                                scale: 1,
                                                                opacity: 1
                                                            },
                                                            className: "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-brand-500/5",
                                                            children: e.jsx(W, {
                                                                className: "h-7 w-7 text-brand-600 dark:text-brand-300"
                                                            })
                                                        }), e.jsx("h3", {
                                                            className: "text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white md:text-4xl",
                                                            children: "A more focused workspace for planning, doing, and reviewing."
                                                        }), e.jsx("p", {
                                                            className: "mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 md:text-base",
                                                            children: "Use Isotope Agent to turn rough goals into study actions, maintain your syllabus, and pull insights from the rest of the platform without losing context."
                                                        }), e.jsxs("div", {
                                                            className: "mt-5 flex flex-wrap gap-2.5",
                                                            children: [e.jsxs("div", {
                                                                className: "rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300",
                                                                children: ["Model: ", V]
                                                            }), e.jsx("div", {
                                                                className: "rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300",
                                                                children: "Enter to send"
                                                            }), e.jsx("div", {
                                                                className: "rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300",
                                                                children: "Shift + Enter for a new line"
                                                            })]
                                                        })]
                                                    }), e.jsx("div", {
                                                        className: "mt-6 grid gap-3 sm:grid-cols-3",
                                                        children: [{
                                                            title: "Plan",
                                                            description: "Turn goals into concrete study steps."
                                                        }, {
                                                            title: "Organize",
                                                            description: "Update tasks, exams, and syllabus items."
                                                        }, {
                                                            title: "Reflect",
                                                            description: "Ask for analysis and next best actions."
                                                        }].map(t => e.jsxs("div", {
                                                            className: "rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]",
                                                            children: [e.jsx("div", {
                                                                className: "text-sm font-semibold text-zinc-900 dark:text-white",
                                                                children: t.title
                                                            }), e.jsx("p", {
                                                                className: "mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-400",
                                                                children: t.description
                                                            })]
                                                        }, t.title))
                                                    })]
                                                }), e.jsxs("section", {
                                                    className: "rounded-[32px] border border-zinc-200/80 bg-white/90 p-5 shadow-lg dark:border-white/10 dark:bg-zinc-950/75 md:p-6",
                                                    children: [e.jsxs("div", {
                                                        className: "flex items-center justify-between gap-3",
                                                        children: [e.jsxs("div", {
                                                            children: [e.jsx("h4", {
                                                                className: "text-sm font-semibold text-zinc-950 dark:text-white",
                                                                children: "Prompt starters"
                                                            }), e.jsx("p", {
                                                                className: "mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400",
                                                                children: "Prefill a high-signal request and keep momentum."
                                                            })]
                                                        }), e.jsxs("div", {
                                                            className: "rounded-full border border-brand-500/15 bg-brand-500/10 px-2.5 py-1 text-[11px] font-medium text-brand-700 dark:text-brand-200",
                                                            children: [fe.length, " ideas"]
                                                        })]
                                                    }), e.jsx("div", {
                                                        className: "mt-4 space-y-2",
                                                        children: fe.map(t => {
                                                            const r = st[t.icon] || W;
                                                            return e.jsxs("button", {
                                                                onClick: () => xe(t.prompt),
                                                                className: i("flex w-full items-start gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/90 px-4 py-3 text-left transition-colors hover:border-brand-300/70 hover:bg-brand-50/70 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand-500/30 dark:hover:bg-brand-500/[0.08]", o),
                                                                children: [e.jsx("div", {
                                                                    className: "mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700 dark:text-brand-300",
                                                                    children: e.jsx(r, {
                                                                        className: "h-4 w-4"
                                                                    })
                                                                }), e.jsxs("div", {
                                                                    className: "min-w-0 flex-1",
                                                                    children: [e.jsxs("div", {
                                                                        className: "flex flex-wrap items-center gap-2",
                                                                        children: [e.jsx("span", {
                                                                            className: "text-sm font-semibold text-zinc-900 dark:text-white",
                                                                            children: t.label
                                                                        }), e.jsx("span", {
                                                                            className: "rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400",
                                                                            children: at[t.category]
                                                                        })]
                                                                    }), e.jsx("p", {
                                                                        className: "mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-400",
                                                                        children: t.description
                                                                    })]
                                                                })]
                                                            }, t.id)
                                                        })
                                                    })]
                                                })]
                                            }), e.jsxs("div", {
                                                className: "space-y-4",
                                                children: [e.jsxs("h4", {
                                                    className: "flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
                                                    children: [e.jsx(Ne, {
                                                        className: "w-4 h-4 text-amber-400"
                                                    }), "Agent Tools"]
                                                }), e.jsx("div", {
                                                    className: i("grid grid-cols-1 gap-3 md:grid-cols-2", k ? "xl:grid-cols-2" : "xl:grid-cols-3"),
                                                    children: it.map(t => e.jsxs("button", {
                                                        onClick: () => xe(t.prompt),
                                                        className: i("group flex h-full items-start gap-4 rounded-3xl border border-zinc-200/80 bg-white/90 p-5 text-left shadow-sm transition-colors hover:border-brand-300/70 hover:bg-brand-50/60 dark:border-white/10 dark:bg-zinc-950/70 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/[0.06]", o),
                                                        children: [e.jsx("div", {
                                                            className: "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700 transition-colors group-hover:bg-brand-500/15 dark:text-brand-300",
                                                            children: e.jsx(t.icon, {
                                                                className: "w-5 h-5"
                                                            })
                                                        }), e.jsxs("div", {
                                                            className: "min-w-0 flex-1",
                                                            children: [e.jsxs("div", {
                                                                className: "flex items-center justify-between gap-3",
                                                                children: [e.jsx("div", {
                                                                    className: "font-semibold text-zinc-900 transition-colors dark:text-white",
                                                                    children: t.label
                                                                }), e.jsx("span", {
                                                                    className: "rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400",
                                                                    children: "Prompt"
                                                                })]
                                                            }), e.jsx("div", {
                                                                className: "mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-400",
                                                                children: t.description
                                                            }), e.jsx("div", {
                                                                className: "mt-3 text-xs font-medium text-brand-700 dark:text-brand-300",
                                                                children: "Prefill this request →"
                                                            })]
                                                        })]
                                                    }, t.id))
                                                })]
                                            })]
                                        }), e.jsx("div", {
                                            className: i("mx-auto w-full space-y-5 pb-2", k ? "max-w-4xl" : "max-w-5xl"),
                                            children: U.map((t, r) => e.jsx(dt, {
                                                message: t,
                                                showTime: r === U.length - 1 || new Date(U[r + 1] ?.timestamp).getTime() - new Date(t.timestamp).getTime() > 6e4,
                                                onCopy: () => Ie(t.content, t.id),
                                                isCopied: Ce === t.id,
                                                formatTime: oe
                                            }, t.id))
                                        }), s && e.jsxs(T.div, {
                                            initial: {
                                                opacity: 0,
                                                y: 20
                                            },
                                            animate: {
                                                opacity: 1,
                                                y: 0
                                            },
                                            className: i("mx-auto flex w-full items-start gap-3 py-3", k ? "max-w-4xl" : "max-w-5xl"),
                                            children: [e.jsx("div", {
                                                className: "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-700 shadow-lg shadow-brand-900/10 dark:text-brand-300",
                                                children: e.jsx(ze, {
                                                    className: "w-5 h-5 animate-pulse"
                                                })
                                            }), e.jsx("div", {
                                                className: "flex-1",
                                                children: e.jsxs("div", {
                                                    className: "rounded-[28px] border border-brand-500/20 bg-white/95 p-5 shadow-xl backdrop-blur-md dark:bg-zinc-950/85",
                                                    children: [e.jsxs("div", {
                                                        className: "mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white",
                                                        children: [e.jsx(Ge, {
                                                            className: "w-4 h-4 text-brand-700 dark:text-brand-300"
                                                        }), "Approval Requested"]
                                                    }), e.jsx("p", {
                                                        className: "mb-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400",
                                                        children: "I'm ready to perform the following action. Would you like me to proceed?"
                                                    }), ve.has(s.tool) ? Se() : N ?.updates ?.length ? e.jsxs("div", {
                                                        className: "mb-6 rounded-3xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]",
                                                        children: [e.jsxs("div", {
                                                            className: "mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300",
                                                            children: [e.jsx(I, {
                                                                className: "w-4 h-4"
                                                            }), "Per-Task Updates"]
                                                        }), e.jsx("div", {
                                                            className: "max-h-60 overflow-y-auto pr-2 text-sm text-zinc-600 custom-scrollbar dark:text-zinc-300",
                                                            children: e.jsx("div", {
                                                                className: "space-y-3",
                                                                children: N.updates.map((t, r) => e.jsxs("div", {
                                                                    className: "rounded-2xl border border-zinc-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]",
                                                                    children: [e.jsx("div", {
                                                                        className: "font-semibold text-zinc-900 dark:text-white",
                                                                        children: Ae(t, `Task ${r+1}`)
                                                                    }), e.jsx("div", {
                                                                        className: "mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                                                                        children: B(t).map(m => e.jsx("span", {
                                                                            children: m
                                                                        }, m))
                                                                    })]
                                                                }, `${t.taskId||t.taskTitle||"task"}-${r}`))
                                                            })
                                                        })]
                                                    }) : N ? e.jsxs("div", {
                                                        className: "mb-6 rounded-3xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]",
                                                        children: [e.jsxs("div", {
                                                            className: "mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300",
                                                            children: [e.jsx(I, {
                                                                className: "w-4 h-4"
                                                            }), "Bulk Task Update"]
                                                        }), e.jsxs("div", {
                                                            className: "rounded-2xl border border-zinc-200/80 bg-white p-3 text-sm dark:border-white/10 dark:bg-white/[0.04]",
                                                            children: [e.jsx("div", {
                                                                className: "font-semibold text-zinc-900 dark:text-white",
                                                                children: "Selected tasks will receive the same update"
                                                            }), e.jsx("div", {
                                                                className: "mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                                                                children: B(N).map(t => e.jsx("span", {
                                                                    children: t
                                                                }, t))
                                                            }), N.selection && e.jsxs("div", {
                                                                className: "mt-3 rounded-xl bg-zinc-100 px-3 py-2 text-xs text-zinc-500 dark:bg-black/20 dark:text-zinc-400",
                                                                children: ["Selection:", " ", X(N.selection)]
                                                            })]
                                                        })]
                                                    }) : le ? e.jsxs("div", {
                                                        className: "mb-6 rounded-3xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]",
                                                        children: [e.jsxs("div", {
                                                            className: "mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300",
                                                            children: [e.jsx(I, {
                                                                className: "w-4 h-4"
                                                            }), "Bulk Task Creation"]
                                                        }), e.jsx("div", {
                                                            className: "max-h-60 overflow-y-auto pr-2 text-sm text-zinc-600 custom-scrollbar dark:text-zinc-300",
                                                            children: e.jsx("div", {
                                                                className: "space-y-3",
                                                                children: le.tasks.map((t, r) => e.jsxs("div", {
                                                                    className: "rounded-2xl border border-zinc-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]",
                                                                    children: [e.jsxs("div", {
                                                                        className: "flex flex-wrap items-center justify-between gap-2",
                                                                        children: [e.jsx("span", {
                                                                            className: "font-semibold text-zinc-900 dark:text-white",
                                                                            children: t.title || `Untitled item ${r+1}`
                                                                        }), e.jsx("span", {
                                                                            className: "rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:text-brand-300",
                                                                            children: t.status || "todo"
                                                                        })]
                                                                    }), e.jsx("div", {
                                                                        className: "mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                                                                        children: B(t).map(m => e.jsx("span", {
                                                                            children: m
                                                                        }, m))
                                                                    })]
                                                                }, `${t.title||"task"}-${r}`))
                                                            })
                                                        })]
                                                    }) : s.tool === "bulk_delete_tasks" ? e.jsxs("div", {
                                                        className: "mb-6 rounded-3xl border border-red-200/80 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/[0.08]",
                                                        children: [e.jsxs("div", {
                                                            className: "mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700 dark:text-red-300",
                                                            children: [e.jsx(G, {
                                                                className: "w-4 h-4"
                                                            }), "Bulk Task Deletion"]
                                                        }), e.jsx("p", {
                                                            className: "text-sm text-red-700 dark:text-red-200",
                                                            children: "This will delete tasks matching the selected criteria after you approve it."
                                                        }), e.jsxs("div", {
                                                            className: "mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs text-red-700 dark:bg-black/20 dark:text-red-200",
                                                            children: ["Selection:", " ", X(s.params.selection)]
                                                        })]
                                                    }) : s.tool === "create_task" || s.tool === "update_task" || s.tool === "delete_task" || s.tool === "complete_task" || s.tool === "reopen_task" || s.tool === "move_task" || s.tool === "update_task_due_date" || s.tool === "update_task_priority" || s.tool === "add_task_subtasks" || s.tool === "delete_task_subtasks" || s.tool === "start_task_focus_session" ? e.jsxs("div", {
                                                        className: "mb-6 rounded-3xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]",
                                                        children: [e.jsxs("div", {
                                                            className: "mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300",
                                                            children: [e.jsx(I, {
                                                                className: "w-4 h-4"
                                                            }), "Task Action"]
                                                        }), e.jsxs("div", {
                                                            className: "rounded-2xl border border-zinc-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]",
                                                            children: [e.jsx("div", {
                                                                className: "font-semibold text-zinc-900 dark:text-white",
                                                                children: s.tool
                                                            }), e.jsx("div", {
                                                                className: "mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                                                                children: B(s.params).map(t => e.jsx("span", {
                                                                    children: t
                                                                }, t))
                                                            }), "taskTitle" in s.params || "taskId" in s.params ? e.jsxs("div", {
                                                                className: "mt-2 text-xs text-zinc-500 dark:text-zinc-400",
                                                                children: ["Target:", " ", "taskTitle" in s.params ? s.params.taskTitle : s.params.taskId]
                                                            }) : null]
                                                        })]
                                                    }) : de ?.updates ?.length ? e.jsxs("div", {
                                                        className: "mb-6 rounded-3xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]",
                                                        children: [e.jsxs("div", {
                                                            className: "mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300",
                                                            children: [e.jsx(J, {
                                                                className: "w-4 h-4"
                                                            }), "Bulk Exam Updates"]
                                                        }), e.jsx("div", {
                                                            className: "max-h-60 overflow-y-auto pr-2 text-sm text-zinc-600 custom-scrollbar dark:text-zinc-300",
                                                            children: e.jsx("div", {
                                                                className: "space-y-3",
                                                                children: de.updates.map((t, r) => e.jsxs("div", {
                                                                    className: "rounded-2xl border border-zinc-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]",
                                                                    children: [e.jsx("div", {
                                                                        className: "font-semibold text-zinc-900 dark:text-white",
                                                                        children: t.examTitle || t.examId || `Exam ${r+1}`
                                                                    }), e.jsxs("div", {
                                                                        className: "mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                                                                        children: [t.date && e.jsxs("span", {
                                                                            children: ["Date: ", t.date]
                                                                        }), t.startTime && e.jsxs("span", {
                                                                            children: ["Start: ", t.startTime]
                                                                        }), t.durationMinutes && e.jsxs("span", {
                                                                            children: [t.durationMinutes, " min"]
                                                                        }), t.priority && e.jsx("span", {
                                                                            children: t.priority
                                                                        }), t.examType && e.jsx("span", {
                                                                            children: t.examType
                                                                        })]
                                                                    })]
                                                                }, `${t.examId||t.examTitle||"exam"}-${r}`))
                                                            })
                                                        })]
                                                    }) : ne ? e.jsxs("div", {
                                                        className: "mb-6 rounded-3xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]",
                                                        children: [e.jsxs("div", {
                                                            className: "mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300",
                                                            children: [e.jsx(J, {
                                                                className: "w-4 h-4"
                                                            }), "Bulk Exam Scheduling"]
                                                        }), e.jsx("div", {
                                                            className: "max-h-60 overflow-y-auto pr-2 text-sm text-zinc-600 custom-scrollbar dark:text-zinc-300",
                                                            children: e.jsx("div", {
                                                                className: "space-y-3",
                                                                children: ne.exams.map((t, r) => e.jsxs("div", {
                                                                    className: "rounded-2xl border border-zinc-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]",
                                                                    children: [e.jsxs("div", {
                                                                        className: "flex flex-wrap items-center justify-between gap-2",
                                                                        children: [e.jsx("span", {
                                                                            className: "font-semibold text-zinc-900 dark:text-white",
                                                                            children: t.title
                                                                        }), e.jsx("span", {
                                                                            className: "rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:text-brand-300",
                                                                            children: t.examType || "mock"
                                                                        })]
                                                                    }), e.jsxs("div", {
                                                                        className: "mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                                                                        children: [e.jsx("span", {
                                                                            children: t.date
                                                                        }), t.startTime && e.jsx("span", {
                                                                            children: t.startTime
                                                                        }), t.priority && e.jsx("span", {
                                                                            children: t.priority
                                                                        }), t.durationMinutes && e.jsxs("span", {
                                                                            children: [t.durationMinutes, " min"]
                                                                        })]
                                                                    })]
                                                                }, `${t.title}-${r}`))
                                                            })
                                                        })]
                                                    }) : K ? e.jsxs("div", {
                                                        className: "mb-6 rounded-3xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]",
                                                        children: [e.jsxs("div", {
                                                            className: "mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300",
                                                            children: [e.jsx(We, {
                                                                className: "w-4 h-4"
                                                            }), "Bulk Syllabus Construction"]
                                                        }), e.jsxs("div", {
                                                            className: "max-h-60 overflow-y-auto pr-2 text-sm text-zinc-600 custom-scrollbar dark:text-zinc-300",
                                                            children: [e.jsxs("p", {
                                                                className: "mb-3 flex items-center gap-2 font-medium",
                                                                children: [e.jsx("span", {
                                                                    className: "text-zinc-500",
                                                                    children: "Subject:"
                                                                }), e.jsx("span", {
                                                                    className: "text-brand-700 dark:text-brand-300",
                                                                    children: K.subjectId
                                                                })]
                                                            }), e.jsx("div", {
                                                                className: "space-y-3",
                                                                children: K.chapters.map((t, r) => e.jsxs("div", {
                                                                    className: "flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]",
                                                                    children: [e.jsxs("span", {
                                                                        className: "flex items-center gap-2 font-semibold text-zinc-900 dark:text-white",
                                                                        children: [e.jsx(ee, {
                                                                            className: "w-3 h-3 text-zinc-500 dark:text-zinc-400"
                                                                        }), t.title]
                                                                    }), t.topics ?.length > 0 && e.jsx("div", {
                                                                        className: "flex flex-wrap gap-1.5 pl-5",
                                                                        children: t.topics.map((m, A) => e.jsx("span", {
                                                                            className: "rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-black/20 dark:text-zinc-400",
                                                                            children: m
                                                                        }, A))
                                                                    })]
                                                                }, r))
                                                            })]
                                                        })]
                                                    }) : e.jsxs("div", {
                                                        className: "relative mb-6 overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-50 p-5 text-sm dark:border-white/10 dark:bg-white/[0.03]",
                                                        children: [e.jsx("div", {
                                                            className: "absolute left-0 top-0 h-full w-1.5 bg-brand-500"
                                                        }), e.jsx("span", {
                                                            className: "mb-2 block text-sm font-semibold text-brand-700 dark:text-brand-300",
                                                            children: s.tool
                                                        }), e.jsx("div", {
                                                            className: "flex flex-wrap gap-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400",
                                                            children: E(s.params).map(t => e.jsx("span", {
                                                                className: "rounded-full border border-zinc-200 bg-white px-2.5 py-1 dark:border-white/10 dark:bg-black/20",
                                                                children: t
                                                            }, t))
                                                        })]
                                                    }), e.jsxs("div", {
                                                        className: "flex gap-3",
                                                        children: [e.jsxs("button", {
                                                            onClick: () => R(),
                                                            disabled: l,
                                                            className: i("flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-colors hover:bg-brand-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70", o),
                                                            children: [l ? e.jsx("div", {
                                                                className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                            }) : e.jsx(Ze, {
                                                                className: "w-4 h-4 fill-current"
                                                            }), "Execute Command"]
                                                        }), e.jsxs("button", {
                                                            onClick: () => F(),
                                                            disabled: l,
                                                            className: i("flex flex-1 items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70", o),
                                                            children: [e.jsx(Xe, {
                                                                className: "w-4 h-4"
                                                            }), "Cancel"]
                                                        })]
                                                    })]
                                                })
                                            })]
                                        }), p && e.jsxs("div", {
                                            className: "mx-auto flex w-full max-w-5xl items-start gap-3",
                                            children: [e.jsx("div", {
                                                className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-700 dark:text-brand-300",
                                                children: e.jsx(D, {
                                                    className: "w-6 h-6 text-white"
                                                })
                                            }), e.jsx("div", {
                                                className: "flex items-center rounded-[24px] border border-zinc-200/80 bg-white/90 px-5 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-950/80",
                                                children: e.jsxs("div", {
                                                    className: "flex gap-1.5",
                                                    children: [e.jsx("div", {
                                                        className: "w-2 h-2 rounded-full bg-brand-400 animate-bounce",
                                                        style: {
                                                            animationDelay: "0ms"
                                                        }
                                                    }), e.jsx("div", {
                                                        className: "w-2 h-2 rounded-full bg-brand-400 animate-bounce",
                                                        style: {
                                                            animationDelay: "150ms"
                                                        }
                                                    }), e.jsx("div", {
                                                        className: "w-2 h-2 rounded-full bg-brand-400 animate-bounce",
                                                        style: {
                                                            animationDelay: "300ms"
                                                        }
                                                    })]
                                                })
                                            })]
                                        }), e.jsx("div", {
                                            ref: ie
                                        })]
                                    }), e.jsx("div", {
                                        className: "relative border-t border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85",
                                        children: e.jsxs("div", {
                                            className: i("mx-auto flex flex-col gap-3 px-4 py-4 md:px-6", k ? "max-w-4xl" : "max-w-5xl"),
                                            children: [f && e.jsx("div", {
                                                role: "alert",
                                                className: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
                                                children: f
                                            }), e.jsxs("div", {
                                                className: "relative flex items-end gap-3",
                                                children: [e.jsxs("div", {
                                                    className: "relative flex-1",
                                                    children: [e.jsx("label", {
                                                        htmlFor: "ai-assistant-input",
                                                        className: "sr-only",
                                                        children: "Message Isotope Agent"
                                                    }), e.jsx("textarea", {
                                                        id: "ai-assistant-input",
                                                        ref: L,
                                                        value: C,
                                                        onChange: t => P(t.target.value),
                                                        onKeyDown: Te,
                                                        placeholder: "Message your Isotope Agent...",
                                                        rows: 1,
                                                        disabled: !!s,
                                                        className: i("w-full max-h-48 resize-none rounded-[28px] border border-zinc-200/80 bg-white px-4 py-4 pr-14 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-zinc-500 md:text-[15px]", o),
                                                        style: {
                                                            minHeight: "56px"
                                                        }
                                                    }), e.jsx("div", {
                                                        className: "pointer-events-none absolute bottom-3 right-4 flex items-center gap-2",
                                                        children: e.jsx("span", {
                                                            className: "hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 md:block",
                                                            children: "Shift+Enter"
                                                        })
                                                    })]
                                                }), e.jsx("button", {
                                                    onClick: ce,
                                                    disabled: !C.trim() || l || !!s,
                                                    className: i("inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition-all", C.trim() && !l && !s ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 active:scale-95" : "cursor-not-allowed border border-zinc-200/80 bg-zinc-100 text-zinc-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-600", o),
                                                    "aria-label": "Send message",
                                                    children: e.jsx(Je, {
                                                        className: "w-5 h-5"
                                                    })
                                                })]
                                            }), e.jsxs("div", {
                                                className: "flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400",
                                                children: [e.jsxs("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [e.jsx("div", {
                                                        className: i("h-2 w-2 rounded-full", s ? "bg-amber-500" : "bg-emerald-500")
                                                    }), e.jsx("span", {
                                                        className: "font-medium",
                                                        children: s ? "Approval pending before next action" : `${V} ready for your next prompt`
                                                    })]
                                                }), e.jsxs("button", {
                                                    onClick: be,
                                                    className: i("inline-flex items-center gap-2 self-start font-medium text-zinc-600 transition-colors hover:text-brand-700 dark:text-zinc-400 dark:hover:text-white sm:self-auto", o),
                                                    children: [e.jsx(je, {
                                                        className: "w-3.5 h-3.5"
                                                    }), "Model settings"]
                                                })]
                                            })]
                                        })
                                    })]
                                }) : e.jsx("div", {
                                    className: "relative flex flex-1 items-center justify-center px-4 py-8 md:px-6",
                                    children: e.jsxs("div", {
                                        className: "w-full max-w-2xl rounded-[32px] border border-zinc-200/80 bg-white/90 p-6 text-center shadow-xl dark:border-white/10 dark:bg-zinc-950/80 md:p-8",
                                        children: [e.jsx("div", {
                                            className: "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-brand-500/15 to-brand-500/5 ring-1 ring-brand-500/15",
                                            children: e.jsx(D, {
                                                className: "h-10 w-10 text-brand-600 dark:text-brand-300"
                                            })
                                        }), e.jsxs("span", {
                                            className: "inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-200",
                                            children: [e.jsx(W, {
                                                className: "h-3.5 w-3.5"
                                            }), "Unlock AI assistance"]
                                        }), e.jsx("h3", {
                                            className: "mt-4 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white md:text-3xl",
                                            children: "Connect your API key to activate Isotope Agent"
                                        }), e.jsx("p", {
                                            className: "mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 md:text-base",
                                            children: "Once connected, the assistant can help plan study sessions, update your syllabus, break down tasks, and surface insights across the workspace."
                                        }), e.jsx("div", {
                                            className: "mt-6 grid gap-3 text-left sm:grid-cols-3",
                                            children: ["Plan faster", "Execute tasks", "Review progress"].map(t => e.jsx("div", {
                                                className: "rounded-2xl border border-zinc-200/80 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200",
                                                children: t
                                            }, t))
                                        }), e.jsxs("button", {
                                            onClick: be,
                                            className: i("mt-8 inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-colors hover:bg-brand-500", o),
                                            children: [e.jsx(je, {
                                                className: "w-4 h-4"
                                            }), "Configure API key"]
                                        })]
                                    })
                                })]
                            })]
                        })]
                    })
                })
            })]
        }) : null
    },
    dt = ({
        message: a,
        showTime: d,
        onCopy: l,
        isCopied: p,
        formatTime: c
    }) => {
        const n = a.role === "user",
            z = a.role === "system",
            f = (g, x) => {
                if (x) return {
                    thought: x.trim(),
                    response: g
                };
                const _ = /<think>([\s\S]*?)<\/think>/,
                    $ = g.match(_);
                if ($) {
                    const R = $[1].trim(),
                        F = g.replace(_, "").trim();
                    return {
                        thought: R,
                        response: F
                    }
                }
                return {
                    thought: null,
                    response: g
                }
            },
            {
                response: w
            } = f(a.content, a.thoughts),
            u = !n && !z ? Be(w) : null;
        if (z && a.content.startsWith("TOOL EXECUTION RESULT:")) return e.jsx("div", {
            className: "my-4 flex justify-center",
            children: e.jsxs("div", {
                className: "inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm dark:text-emerald-300",
                children: [e.jsx(ye, {
                    className: "h-3.5 w-3.5"
                }), "Action completed"]
            })
        });
        if (u) {
            const g = u.tool === "bulk_add_syllabus";
            return e.jsxs("div", {
                className: "mb-5 flex items-start gap-3 md:gap-4",
                children: [e.jsx("div", {
                    className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white text-brand-700 shadow-sm dark:border-white/10 dark:bg-zinc-950/80 dark:text-brand-300",
                    children: e.jsx(ze, {
                        className: "h-5 w-5"
                    })
                }), e.jsx("div", {
                    className: "flex min-w-0 max-w-3xl flex-1 flex-col gap-2",
                    children: e.jsxs("div", {
                        className: "rounded-[24px] border border-zinc-200/80 bg-white/95 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950/80",
                        children: [e.jsxs("div", {
                            className: "flex flex-wrap items-center justify-between gap-2",
                            children: [e.jsxs("div", {
                                className: "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400",
                                children: [e.jsx("span", {
                                    className: "h-2 w-2 rounded-full bg-emerald-500"
                                }), "Tool executed"]
                            }), d && e.jsx("span", {
                                className: "text-[11px] font-medium text-zinc-500 dark:text-zinc-400",
                                children: c(a.timestamp)
                            })]
                        }), e.jsx("div", {
                            className: "mt-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-3 dark:border-white/10 dark:bg-white/[0.03]",
                            children: g ? e.jsxs("div", {
                                className: "text-sm text-zinc-700 dark:text-zinc-200",
                                children: [e.jsx("span", {
                                    className: "font-semibold text-brand-700 dark:text-brand-300",
                                    children: u.tool
                                }), e.jsxs("span", {
                                    className: "ml-2 text-zinc-500 dark:text-zinc-400",
                                    children: ["(", u.params.chapters ?.length || 0, " chapters added)"]
                                })]
                            }) : e.jsxs("div", {
                                className: "space-y-2 text-xs text-zinc-600 dark:text-zinc-400",
                                children: [e.jsx("div", {
                                    className: "font-semibold text-brand-700 dark:text-brand-300",
                                    children: u.tool
                                }), e.jsx("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: E(u.params, {
                                        limit: 6
                                    }).map(x => e.jsx("span", {
                                        className: "rounded-full border border-zinc-200 bg-white px-2 py-0.5 dark:border-white/10 dark:bg-black/20",
                                        children: x
                                    }, x))
                                })]
                            })
                        })]
                    })
                })]
            })
        }
        return e.jsxs("div", {
            className: i("group mb-5 flex items-start gap-3 md:gap-4", n && "flex-row-reverse"),
            children: [e.jsx("div", {
                className: i("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm", n ? "bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-brand-600/20" : "border border-zinc-200/80 bg-white text-brand-700 dark:border-white/10 dark:bg-zinc-950/80 dark:text-brand-300"),
                children: n ? e.jsx("span", {
                    className: "text-[11px] font-semibold uppercase tracking-[0.2em]",
                    children: "You"
                }) : e.jsx(D, {
                    className: "h-5 w-5"
                })
            }), e.jsxs("div", {
                className: i("flex min-w-0 max-w-[85%] flex-1 flex-col gap-2", n && "items-end"),
                children: [e.jsxs("div", {
                    className: i("flex items-center gap-2 px-1 text-[11px] text-zinc-500 dark:text-zinc-400", n && "flex-row-reverse"),
                    children: [e.jsx("span", {
                        className: "font-semibold text-zinc-700 dark:text-zinc-200",
                        children: n ? "You" : "Isotope Agent"
                    }), d && e.jsx("span", {
                        children: c(a.timestamp)
                    }), !n && e.jsx("button", {
                        onClick: l,
                        "aria-label": p ? "Copied message" : "Copy message",
                        className: i("inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200/80 bg-white text-zinc-500 transition-colors hover:text-brand-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:text-white", o),
                        children: p ? e.jsx(et, {
                            className: "h-3.5 w-3.5 text-emerald-500"
                        }) : e.jsx(tt, {
                            className: "h-3.5 w-3.5"
                        })
                    })]
                }), w && e.jsx("div", {
                    className: i("w-fit max-w-full overflow-hidden rounded-[26px] border px-4 py-3.5 text-sm leading-6 shadow-sm md:px-5 md:py-4 md:text-[15px]", n ? "rounded-tr-md border-transparent bg-gradient-to-br from-brand-600 to-brand-500 text-white" : "rounded-tl-md border-zinc-200/80 bg-white/95 text-zinc-900 dark:border-white/10 dark:bg-zinc-950/80 dark:text-zinc-100"),
                    children: n ? e.jsx("p", {
                        className: "whitespace-pre-wrap break-words text-left font-medium",
                        children: w
                    }) : e.jsx("div", {
                        className: "text-left",
                        children: e.jsx(Oe, {
                            content: w
                        })
                    })
                })]
            })]
        })
    };
export {
    Nt as
    default
};