const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/sessionSync-mloIEnTd.js", "assets/App-pJGjDiPw.js", "assets/index-BPYJFSVW.js", "assets/vendor-react-BfU3Zn2J.js", "assets/index-CrO6t5EW.css", "assets/vendor-supabase-DAiUAuun.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/vendor-icons-CqruUz7g.js", "assets/vendor-router-CmoTwRnm.js", "assets/QueryProvider-DusNhG9D.js", "assets/vendor-query-Rjz85D0S.js", "assets/groupCache-DVHvdGlY.js"]))) => i.map(i => d[i]);
import {
    _ as Te
} from "./index-BPYJFSVW.js";
import {
    g as x,
    d as Y,
    A as S,
    O as h,
    ac as Ie,
    u as we,
    h as q,
    ad as xe
} from "./App-pJGjDiPw.js";
import {
    u as G,
    N as _
} from "./useNotificationStore-BS4df28T.js";

function ee(r, n) {
    const e = new Date(r);
    switch (n.recurrenceType) {
        case "daily":
            e.setDate(e.getDate() + 1);
            break;
        case "weekly":
            e.setDate(e.getDate() + 7);
            break;
        case "custom":
            n.customDays && n.customDays > 0 ? e.setDate(e.getDate() + n.customDays) : e.setDate(e.getDate() + 1);
            break;
        default:
            e.setDate(e.getDate() + 1)
    }
    return e
}

function ye(r, n) {
    if (!r.isRecurring || !r.recurringConfig) return null;
    const e = r.recurringConfig,
        t = n.filter(l => l.parentTaskId === r.id || l.id === r.id).length;
    if (e.maxOccurrences && t >= e.maxOccurrences) return null;
    if (e.endDate) {
        const l = new Date(e.endDate),
            m = new Date;
        if (m.setHours(0, 0, 0, 0), m > l) return null
    }
    const s = ee(new Date(r.dueDate), e),
        o = r.releaseDate ? ee(new Date(r.releaseDate), e) : void 0;
    if (n.some(l => l.parentTaskId === r.id && new Date(l.dueDate).toDateString() === s.toDateString())) return null;
    const i = e.createNextThreshold || 24,
        d = new Date;
    return !((s.getTime() - d.getTime()) / (1e3 * 60 * 60) <= i) && r.status !== "done" ? null : {
        title: r.title,
        subject: r.subject,
        subjectId: r.subjectId,
        chapterId: r.chapterId,
        topicId: r.topicId,
        status: "backlog",
        priority: r.priority,
        releaseDate: o ?.toISOString(),
        dueDate: s.toISOString(),
        effort: r.effort,
        energy: r.energy,
        description: r.description,
        subtasks: r.subtasks.map(l => ({
            id: x(),
            title: l.title,
            completed: !1
        })),
        parentTaskId: r.id,
        isRecurringInstance: !0,
        isRecurring: !1
    }
}

function Ae(r, n) {
    const e = [],
        t = r.filter(s => s.isRecurring && !s.isRecurringInstance);
    for (const s of t) {
        const o = ye(s, r);
        o && e.push(n(o))
    }
    return e
}

function Ce(r, n) {
    return {
        title: `${r.title} (Copy)`,
        subject: r.subject,
        subjectId: r.subjectId,
        chapterId: r.chapterId,
        topicId: r.topicId,
        status: n ?.resetStatus ? "backlog" : r.status,
        priority: r.priority,
        releaseDate: r.releaseDate,
        dueDate: n ?.newDueDate || r.dueDate,
        effort: r.effort,
        energy: r.energy,
        description: r.description,
        subtasks: r.subtasks.map(t => ({
            id: x(),
            title: t.title,
            completed: !1
        })),
        focusSessionIds: [],
        totalFocusTime: 0,
        isRecurring: !1
    }
}
const ct = 6048e5,
    ve = 864e5,
    De = 6e4,
    Me = 36e5,
    dt = 43200,
    ut = 1440,
    te = Symbol.for("constructDateFrom");

function z(r, n) {
    return typeof r == "function" ? r(n) : r && typeof r == "object" && te in r ? r[te](n) : r instanceof Date ? new r.constructor(n) : new Date(n)
}

function v(r, n) {
    return z(n || r, r)
}

function be(r, n, e) {
    const t = v(r, e ?.in);
    return isNaN(n) ? z(r, NaN) : (n && t.setDate(t.getDate() + n), t)
}

function qe(r, n, e) {
    return z(r, +v(r) + n)
}

function Fe(r, n, e) {
    return qe(r, n * Me)
}
let Le = {};

function Ee() {
    return Le
}

function Be(r, n) {
    const e = Ee(),
        t = n ?.weekStartsOn ?? n ?.locale ?.options ?.weekStartsOn ?? e.weekStartsOn ?? e.locale ?.options ?.weekStartsOn ?? 0,
        s = v(r, n ?.in),
        o = s.getDay(),
        a = (o < t ? 7 : 0) + o - t;
    return s.setDate(s.getDate() - a), s.setHours(0, 0, 0, 0), s
}

function se(r) {
    const n = v(r),
        e = new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds(), n.getMilliseconds()));
    return e.setUTCFullYear(n.getFullYear()), +r - +e
}

function Ne(r, ...n) {
    const e = z.bind(null, r || n.find(t => typeof t == "object"));
    return n.map(e)
}

function oe(r, n) {
    const e = v(r, n ?.in);
    return e.setHours(0, 0, 0, 0), e
}

function Oe(r, n, e) {
    const [t, s] = Ne(e ?.in, r, n), o = oe(t), a = oe(s), i = +o - se(o), d = +a - se(a);
    return Math.round((i - d) / ve)
}

function Pe(r, n, e) {
    const t = v(r, e ?.in);
    return t.setTime(t.getTime() + n * De), t
}

function Re(r, n, e) {
    const t = v(r, e ?.in);
    return t.setHours(n), t
}

function _e(r, n, e) {
    const t = v(r, e ?.in);
    return t.setMilliseconds(n), t
}

function Ue(r, n, e) {
    const t = v(r, e ?.in);
    return t.setMinutes(n), t
}

function Qe(r, n, e) {
    const t = v(r, e ?.in);
    return t.setSeconds(n), t
}

function He(r, n, e) {
    return Fe(r, -n)
}

function Je(r, n, e) {
    return Pe(r, -16666666666666667e-24, e)
}
const L = 0,
    K = 1,
    V = 3,
    X = 30,
    U = (r, n = L) => {
        const e = Z(r);
        return n === 0 ? e : He(e, n)
    },
    Z = r => {
        if (r instanceof Date) return new Date(r.getTime());
        if (typeof r == "string") {
            const n = r.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (n) {
                const [, t, s, o] = n;
                return new Date(Number(t), Number(s) - 1, Number(o), 12, 0, 0, 0)
            }
            const e = r.match(/^(\d{4})-(\d{2})-(\d{2})T00:00:00(?:\.000)?Z$/);
            if (e) {
                const [, t, s, o] = e;
                return new Date(Number(t), Number(s) - 1, Number(o), 12, 0, 0, 0)
            }
        }
        return new Date(r)
    },
    lt = r => {
        const n = r ? Z(r) : new Date,
            e = n.getFullYear(),
            t = String(n.getMonth() + 1).padStart(2, "0"),
            s = String(n.getDate()).padStart(2, "0");
        return `${e}-${t}-${s}`
    },
    pt = r => Z(r).toISOString(),
    re = r => new Date(r.getFullYear(), r.getMonth(), r.getDate(), 12, 0, 0, 0),
    ne = (r, n = L) => {
        const e = U(r, n),
            t = e.getFullYear(),
            s = String(e.getMonth() + 1).padStart(2, "0"),
            o = String(e.getDate()).padStart(2, "0");
        return `${t}-${s}-${o}`
    },
    mt = (r, n, e = L) => {
        const t = U(r, e),
            s = U(n, e);
        return t.getFullYear() === s.getFullYear() && t.getMonth() === s.getMonth() && t.getDate() === s.getDate()
    },
    ft = r => r ?.dayOffset ?? L,
    ge = (r, n = new Date, e = L) => {
        const t = re(U(r, e)),
            s = re(U(n, e));
        return Oe(t, s)
    },
    ht = (r, n = new Date, e = L) => ge(r, n, e) >= 0,
    St = (r, n = new Date, e = L, t = !1) => {
        const s = ge(r, n, e);
        let o = "";
        return s === 0 ? o = "Today" : s === 1 ? o = "Tomorrow" : s === -1 ? o = "Yesterday" : s > 1 ? o = `in ${s} days` : o = `${Math.abs(s)} days ago`, t ? o.toUpperCase() : o
    },
    ke = (r, n = K, e = V, t = X) => {
        const s = new Date(r);
        let o = Be(s, {
            weekStartsOn: n
        });
        return o = Re(o, e), o = Ue(o, t), o = Qe(o, 0), o = _e(o, 0), s < o && (o = be(o, -7)), o
    },
    $e = (r, n = K, e = V, t = X) => {
        const s = ke(r, n, e, t),
            o = be(s, 7);
        return Je(o)
    },
    Tt = (r, n = K, e = V, t = X) => ({
        start: ke(r, n, e, t),
        end: $e(r, n, e, t)
    }),
    yt = r => ({
        weekStartsOn: r ?.weekStartDay ?? K,
        startHour: r ?.weekStartHour ?? V,
        startMinute: r ?.weekStartMinute ?? X
    }),
    O = Y((r, n) => ({
        tasks: [],
        view: "board",
        isLoading: !1,
        hasLoaded: !1,
        setView: e => r({
            view: e
        }),
        fetchTasks: async () => {
            const {
                isLoading: e,
                hasLoaded: t
            } = n();
            if (!(e || t)) {
                r({
                    isLoading: !0
                });
                try {
                    const s = await S.getTasks();
                    r({
                        tasks: s,
                        hasLoaded: !0
                    })
                } catch (s) {
                    console.error("Failed to fetch tasks:", s)
                } finally {
                    r({
                        isLoading: !1
                    })
                }
            }
        },
        addTask: async e => {
            const t = n().tasks.filter(o => o.status === e.status).reduce((o, a) => Math.max(o, a.order ?? 0), -1) + 1,
                s = { ...e,
                    id: x(),
                    createdAt: h(),
                    updatedAt: h(),
                    subtasks: e.subtasks || [],
                    topicId: e.topicId,
                    chapterId: e.chapterId,
                    order: e.order ?? t
                };
            r(o => ({
                tasks: [...o.tasks, s]
            }));
            try {
                await S.saveTask(s);
                const {
                    sendNotification: o
                } = G.getState();
                o(_.TASK_DEADLINE, "📝 New Task Created", {
                    body: `Added "${s.title}" to your tasks.`,
                    data: {
                        url: "/tasks"
                    }
                })
            } catch (o) {
                console.error("Failed to save task:", o)
            }
        },
        updateTask: async (e, t) => {
            r(s => ({
                tasks: s.tasks.map(o => o.id === e ? { ...o,
                    ...t,
                    updatedAt: h()
                } : o)
            }));
            try {
                await S.updateTask(e, t)
            } catch (s) {
                console.error("Failed to update task:", s)
            }
        },
        deleteTask: async e => {
            r(t => ({
                tasks: t.tasks.filter(s => s.id !== e)
            }));
            try {
                await S.softDeleteTask(e)
            } catch (t) {
                console.error("Failed to delete task:", t)
            }
        },
        moveTask: async (e, t, s) => {
            const o = n().tasks.find(f => f.id === e);
            if (!o) return;
            const a = h(),
                i = (f, T) => {
                    const g = (f.order ?? Number.MAX_SAFE_INTEGER) - (T.order ?? Number.MAX_SAFE_INTEGER);
                    return g !== 0 ? g : new Date(f.createdAt).getTime() - new Date(T.createdAt).getTime()
                },
                d = n().tasks,
                c = o.status,
                u = d.filter(f => f.status === c && f.id !== e).sort(i),
                l = (c === t ? u : d.filter(f => f.status === t && f.id !== e)).sort(i);
            let m = l.length;
            if (s) {
                const f = l.findIndex(T => T.id === s);
                f >= 0 && (m = f)
            }
            const b = { ...o,
                    status: t,
                    updatedAt: a,
                    completedAt: t === "done" ? a : void 0
                },
                I = [...l];
            I.splice(m, 0, b);
            const w = I.map((f, T) => ({ ...f,
                    order: T,
                    updatedAt: f.id === e ? a : f.updatedAt
                })),
                A = c === t ? [] : u.map((f, T) => ({ ...f,
                    order: T
                })),
                p = new Map([...A, ...w].map(f => [f.id, f]));
            r(f => ({
                tasks: f.tasks.map(T => p.get(T.id) ?? T)
            }));
            try {
                if (await Promise.all([...p.values()].map(f => S.updateTask(f.id, {
                        status: f.status,
                        order: f.order,
                        updatedAt: f.id === e ? f.updatedAt : void 0,
                        completedAt: f.completedAt
                    }))), t === "done") {
                    const {
                        sendNotification: f
                    } = G.getState();
                    f(_.ACHIEVEMENT, "✅ Task Completed!", {
                        body: `Well done! You completed "${o?.title}".`,
                        data: {
                            url: "/tasks"
                        }
                    })
                }
                if (t === "done" && o ?.isRecurring) {
                    const f = ye(o, n().tasks);
                    f && await n().addTask(f)
                }
            } catch (f) {
                console.error("Failed to move task:", f)
            }
        },
        toggleSubtask: async (e, t) => {
            const s = n().tasks.find(a => a.id === e);
            if (!s) return;
            const o = s.subtasks.map(a => a.id === t ? { ...a,
                completed: !a.completed
            } : a);
            r(a => ({
                tasks: a.tasks.map(i => i.id === e ? { ...i,
                    subtasks: o,
                    updatedAt: h()
                } : i)
            }));
            try {
                await S.updateTask(e, {
                    subtasks: o
                })
            } catch (a) {
                console.error("Failed to toggle subtask:", a)
            }
        },
        linkSessionToTask: async (e, t, s) => {
            const o = n().tasks.find(d => d.id === e);
            if (!o) return;
            const a = [...o.focusSessionIds || [], t],
                i = (o.totalFocusTime || 0) + s;
            r(d => ({
                tasks: d.tasks.map(c => c.id === e ? { ...c,
                    focusSessionIds: a,
                    totalFocusTime: i,
                    updatedAt: h()
                } : c)
            }));
            try {
                await S.updateTask(e, {
                    focusSessionIds: a,
                    totalFocusTime: i
                })
            } catch (d) {
                console.error("Failed to link session to task:", d)
            }
        },
        unlinkSessionFromTask: async (e, t, s) => {
            const o = n().tasks.find(d => d.id === e);
            if (!o) return;
            const a = (o.focusSessionIds || []).filter(d => d !== t),
                i = Math.max(0, (o.totalFocusTime || 0) - s);
            r(d => ({
                tasks: d.tasks.map(c => c.id === e ? { ...c,
                    focusSessionIds: a,
                    totalFocusTime: i,
                    updatedAt: h()
                } : c)
            }));
            try {
                await S.updateTask(e, {
                    focusSessionIds: a,
                    totalFocusTime: i
                })
            } catch (d) {
                console.error("Failed to unlink session from task:", d)
            }
        },
        completeTaskFromSession: async (e, t) => {
            if (!n().tasks.find(a => a.id === e)) return;
            const o = h();
            r(a => ({
                tasks: a.tasks.map(i => i.id === e ? { ...i,
                    status: "done",
                    completedInSession: t,
                    completedAt: o,
                    updatedAt: o
                } : i)
            }));
            try {
                await S.updateTask(e, {
                    status: "done",
                    completedInSession: t,
                    completedAt: o
                })
            } catch (a) {
                console.error("Failed to complete task from session:", a)
            }
        },
        applyTimeAllocation: async (e, t) => {
            const {
                byTask: s
            } = e;
            if (s)
                for (const [o, a] of Object.entries(s)) await n().linkSessionToTask(o, t, a)
        },
        removeTimeAllocation: async (e, t) => {
            const {
                byTask: s
            } = e;
            if (s)
                for (const [o, a] of Object.entries(s)) await n().unlinkSessionFromTask(o, t, a)
        },
        refreshFromStorage: async () => {
            try {
                const e = await S.getTasks();
                r({
                    tasks: e,
                    hasLoaded: !0
                })
            } catch (e) {
                console.error("[TaskStore] Failed to refresh from storage:", e)
            }
        },
        duplicateTask: async (e, t = {
            resetStatus: !0
        }) => {
            const s = n().tasks.find(o => o.id === e);
            if (!s) {
                console.error("[TaskStore] Task not found for duplication:", e);
                return
            }
            try {
                const o = Ce(s, t);
                await n().addTask(o)
            } catch (o) {
                console.error("[TaskStore] Failed to duplicate task:", o)
            }
        },
        checkRecurringTasks: async () => {
            const {
                tasks: e
            } = n(), t = n().addTask;
            try {
                const s = Ae(e, t);
                s.length > 0 && await Promise.all(s)
            } catch (s) {
                console.error("[TaskStore] Failed to check recurring tasks:", s)
            }
        }
    })),
    Ge = Y((r, n) => ({
        tests: [],
        exams: [],
        mockTests: [],
        isLoading: !1,
        hasLoadedTests: !1,
        hasLoadedExams: !1,
        hasLoadedMockTests: !1,
        fetchTests: async () => {
            if (!n().hasLoadedTests) {
                r({
                    isLoading: !0
                });
                try {
                    const e = await S.getTests();
                    r({
                        tests: e,
                        hasLoadedTests: !0
                    })
                } catch (e) {
                    console.error("Failed to fetch tests:", e)
                } finally {
                    r({
                        isLoading: !1
                    })
                }
            }
        },
        fetchExams: async () => {
            if (!n().hasLoadedExams) {
                r({
                    isLoading: !0
                });
                try {
                    const e = await S.getExams();
                    r({
                        exams: e,
                        hasLoadedExams: !0
                    })
                } catch (e) {
                    console.error("Failed to fetch exams:", e)
                } finally {
                    r({
                        isLoading: !1
                    })
                }
            }
        },
        fetchMockTests: async () => {
            if (!n().hasLoadedMockTests) {
                r({
                    isLoading: !0
                });
                try {
                    const e = await S.getMockTests();
                    r({
                        mockTests: e,
                        hasLoadedMockTests: !0
                    })
                } catch (e) {
                    console.error("Failed to fetch mock tests:", e)
                } finally {
                    r({
                        isLoading: !1
                    })
                }
            }
        },
        addTest: async e => {
            const t = { ...e,
                id: x(),
                createdAt: h()
            };
            r(s => ({
                tests: [...s.tests, t]
            }));
            try {
                await S.saveTest(t)
            } catch (s) {
                console.error("Failed to save test:", s), r(o => ({
                    tests: o.tests.filter(a => a.id !== t.id)
                }))
            }
            return t
        },
        updateTest: async (e, t) => {
            r(s => ({
                tests: s.tests.map(o => o.id === e ? { ...o,
                    ...t,
                    updatedAt: h()
                } : o)
            }));
            try {
                const o = { ...n().tests.find(a => a.id === e),
                    ...t,
                    id: e,
                    updatedAt: h()
                };
                await S.saveTest(o)
            } catch (s) {
                console.error("Failed to update test:", s)
            }
        },
        deleteTest: async e => {
            r(t => ({
                tests: t.tests.filter(s => s.id !== e)
            }));
            try {
                await S.softDeleteTest(e)
            } catch (t) {
                console.error("Failed to delete test:", t)
            }
        },
        addExam: async e => {
            const t = { ...e,
                id: x(),
                createdAt: h()
            };
            r(s => ({
                exams: [...s.exams, t]
            }));
            try {
                await S.saveExam(t)
            } catch (s) {
                console.error("Failed to save exam:", s), r(o => ({
                    exams: o.exams.filter(a => a.id !== t.id)
                }))
            }
            return t
        },
        updateExam: async (e, t) => {
            r(s => ({
                exams: s.exams.map(o => o.id === e ? { ...o,
                    ...t,
                    updatedAt: h()
                } : o)
            }));
            try {
                const s = n().exams.find(o => o.id === e);
                s && await S.saveExam(s)
            } catch (s) {
                console.error("Failed to update exam:", s)
            }
        },
        deleteExam: async e => {
            r(t => ({
                exams: t.exams.filter(s => s.id !== e)
            }));
            try {
                await S.softDeleteExam(e)
            } catch (t) {
                console.error("Failed to delete exam:", t)
            }
        },
        duplicateExam: async e => {
            const t = n().exams.find(o => o.id === e);
            if (!t) return console.error("Exam not found for duplication"), null;
            const s = { ...t,
                id: x(),
                title: `${t.title} (Copy)`,
                createdAt: h(),
                updatedAt: h(),
                result: void 0,
                analysis: void 0,
                isDDay: !1,
                linkedMockTestIds: [],
                milestones: t.milestones ?.map(o => ({ ...o,
                    id: x(),
                    completed: !1,
                    completedAt: void 0
                })),
                revisionSchedule: t.revisionSchedule ?.map(o => ({ ...o,
                    id: x(),
                    completed: !1,
                    completedAt: void 0
                }))
            };
            r(o => ({
                exams: [...o.exams, s]
            }));
            try {
                return await S.saveExam(s), s
            } catch (o) {
                return console.error("Failed to duplicate exam:", o), r(a => ({
                    exams: a.exams.filter(i => i.id !== s.id)
                })), null
            }
        },
        addMockTest: async e => {
            const t = { ...e,
                id: x(),
                createdAt: h(),
                updatedAt: h()
            };
            r(s => ({
                mockTests: [...s.mockTests, t]
            }));
            try {
                await S.saveMockTest(t)
            } catch (s) {
                console.error("Failed to save mock test:", s), r(o => ({
                    mockTests: o.mockTests.filter(a => a.id !== t.id)
                }))
            }
            return t
        },
        updateMockTest: async (e, t) => {
            r(s => ({
                mockTests: s.mockTests.map(o => o.id === e ? { ...o,
                    ...t,
                    updatedAt: h()
                } : o)
            }));
            try {
                const s = n().mockTests.find(o => o.id === e);
                s && await S.saveMockTest(s)
            } catch (s) {
                console.error("Failed to update mock test:", s)
            }
        },
        deleteMockTest: async e => {
            r(t => ({
                mockTests: t.mockTests.filter(s => s.id !== e)
            }));
            try {
                await S.softDeleteMockTest(e)
            } catch (t) {
                console.error("Failed to delete mock test:", t)
            }
        },
        updateExamResult: async (e, t) => {
            r(s => ({
                exams: s.exams.map(o => o.id === e ? { ...o,
                    result: t,
                    updatedAt: h()
                } : o)
            }));
            try {
                const s = n().exams.find(o => o.id === e);
                if (s) {
                    const o = { ...s,
                        result: t,
                        updatedAt: h()
                    };
                    await S.saveExam(o)
                }
            } catch (s) {
                console.error("Failed to update exam result:", s)
            }
        },
        linkMockTestToExam: async (e, t) => {
            r(s => ({
                exams: s.exams.map(o => o.id === t ? { ...o,
                    linkedMockTestIds: [...o.linkedMockTestIds || [], e],
                    updatedAt: h()
                } : o)
            }));
            try {
                const s = n().exams.find(o => o.id === t);
                if (s) {
                    const o = { ...s,
                        linkedMockTestIds: [...s.linkedMockTestIds || [], e],
                        updatedAt: h()
                    };
                    await S.saveExam(o)
                }
            } catch (s) {
                console.error("Failed to link mock test to exam:", s)
            }
        },
        unlinkMockTestFromExam: async (e, t) => {
            r(s => ({
                exams: s.exams.map(o => o.id === t ? { ...o,
                    linkedMockTestIds: (o.linkedMockTestIds || []).filter(a => a !== e),
                    updatedAt: h()
                } : o)
            }));
            try {
                const s = n().exams.find(o => o.id === t);
                if (s) {
                    const o = { ...s,
                        linkedMockTestIds: (s.linkedMockTestIds || []).filter(a => a !== e),
                        updatedAt: h()
                    };
                    await S.saveExam(o)
                }
            } catch (s) {
                console.error("Failed to unlink mock test from exam:", s)
            }
        },
        refreshFromStorage: async e => {
            if (!e || e === "exams") try {
                const t = await S.getExams();
                r({
                    exams: t,
                    hasLoadedExams: !0
                })
            } catch (t) {
                console.error("Failed to refresh exams:", t)
            }
            if (!e || e === "tests") try {
                const t = await S.getTests();
                r({
                    tests: t,
                    hasLoadedTests: !0
                })
            } catch (t) {
                console.error("Failed to refresh tests:", t)
            }
            if (!e || e === "mockTests") try {
                const t = await S.getMockTests();
                r({
                    mockTests: t,
                    hasLoadedMockTests: !0
                })
            } catch (t) {
                console.error("Failed to refresh mock tests:", t)
            }
        }
    })),
    je = {
        "jee-main-advanced": Ie
    },
    We = r => je[r],
    Ye = () => Object.values(je),
    bt = () => Ye().map(r => ({
        id: r.id,
        name: r.name,
        displayName: r.displayName,
        description: r.description,
        icon: r.icon,
        metadata: r.metadata,
        subjectCount: r.subjects.length,
        totalChapters: r.subjects.reduce((n, e) => n + e.units.reduce((t, s) => t + s.chapters.length, 0), 0),
        totalTopics: r.subjects.reduce((n, e) => n + e.units.reduce((t, s) => t + s.chapters.reduce((o, a) => o + a.topics.length, 0), 0), 0)
    })),
    Q = [{
        color: "text-violet-500",
        gradient: "from-violet-500 to-purple-600"
    }, {
        color: "text-amber-500",
        gradient: "from-amber-500 to-orange-600"
    }, {
        color: "text-emerald-500",
        gradient: "from-emerald-500 to-teal-600"
    }, {
        color: "text-cyan-500",
        gradient: "from-cyan-500 to-blue-600"
    }, {
        color: "text-rose-500",
        gradient: "from-rose-500 to-pink-600"
    }, {
        color: "text-indigo-500",
        gradient: "from-indigo-500 to-blue-600"
    }],
    ie = r => {
        const n = r.color === "text-brand-500" ? "text-violet-500" : r.color,
            e = r.gradient.replaceAll("from-brand-500", "from-violet-500").replaceAll("to-brand-600", "to-purple-600");
        return n === r.color && e === r.gradient ? r : { ...r,
            color: n,
            gradient: e
        }
    },
    ae = r => [...r].sort((n, e) => {
        const t = (n.order ?? Number.MAX_SAFE_INTEGER) - (e.order ?? Number.MAX_SAFE_INTEGER);
        return t !== 0 ? t : new Date(n.createdAt).getTime() - new Date(e.createdAt).getTime()
    }),
    M = r => {
        if (r.length === 0) return 0;
        const n = r.filter(e => e.completed).length;
        return Math.round(n / r.length * 100)
    },
    F = r => r.trim().toLowerCase().replace(/\s+/g, " "),
    ce = r => {
        if (r.isCustom === !0 || r.deletedAt) return null;
        const n = r.examTemplateId || r.examName ?.trim().toLowerCase();
        return n ? `${n}::${F(r.name)}` : null
    },
    de = r => {
        const n = r.chapters.reduce((a, i) => a + i.topics.filter(d => d.completed).length, 0),
            e = Object.values(r.syllabusConfig ?.checkState || {}).filter(Boolean).length,
            t = Object.values(r.syllabusConfig ?.priorities || {}).filter(Boolean).length,
            s = r.syllabusConfig ?.columns.length || 0,
            o = r.studyTime || 0;
        return n * 1e4 + e * 500 + t * 200 + s * 100 + o
    },
    P = (r, n) => {
        const e = r ? new Date(r).getTime() : Number.NaN,
            t = n ? new Date(n).getTime() : Number.NaN;
        return Number.isNaN(e) && Number.isNaN(t) ? 0 : Number.isNaN(e) ? -1 : Number.isNaN(t) ? 1 : e - t
    },
    ze = r => [...r].sort((n, e) => {
        const t = de(e) - de(n);
        return t !== 0 ? t : P(n.createdAt, e.createdAt)
    })[0],
    Ke = (r, n) => {
        const e = P(r.updatedAt, n.updatedAt) < 0;
        return { ...e ? r : n,
            ...e ? n : r,
            completed: r.completed || n.completed,
            isPinned: !!(r.isPinned || n.isPinned),
            studyTime: Math.max(r.studyTime || 0, n.studyTime || 0),
            repetitions: Math.max(r.repetitions || 0, n.repetitions || 0),
            interval: Math.max(r.interval || 0, n.interval || 0),
            updatedAt: P(r.updatedAt, n.updatedAt) >= 0 ? r.updatedAt : n.updatedAt
        }
    },
    Ve = (r, n) => {
        if (!(!r && !n)) return {
            priority: r ?.priority ?? n ?.priority ?? null,
            needsRevision: !!(r ?.needsRevision || n ?.needsRevision),
            revisionCount: Math.max(r ?.revisionCount || 0, n ?.revisionCount || 0),
            lastRevisionDate: P(r ?.lastRevisionDate, n ?.lastRevisionDate) >= 0 ? r ?.lastRevisionDate ?? n ?.lastRevisionDate ?? null : n ?.lastRevisionDate ?? r ?.lastRevisionDate ?? null,
            revisionStatus: r ?.revisionStatus === "completed" || n ?.revisionStatus === "completed" ? "completed" : r ?.revisionStatus === "in-progress" || n ?.revisionStatus === "in-progress" ? "in-progress" : r ?.revisionStatus ?? n ?.revisionStatus ?? "pending",
            estimatedTime: Math.max(r ?.estimatedTime || 0, n ?.estimatedTime || 0) || void 0,
            studyTime: Math.max(r ?.studyTime || 0, n ?.studyTime || 0) || void 0,
            difficulty: r ?.difficulty ?? n ?.difficulty,
            notes: r ?.notes ?? n ?.notes,
            tags: Array.from(new Set([...r ?.tags || [], ...n ?.tags || []])),
            resources: r ?.resources ?? n ?.resources
        }
    },
    Xe = (r, n, e) => {
        const t = r.syllabusConfig || {
                subjectId: r.id,
                columns: [],
                checkState: {},
                priorities: {}
            },
            s = n.syllabusConfig;
        if (!s) return t;
        const o = [...t.columns],
            a = new Map;
        t.columns.forEach(c => {
            a.set(F(c.name), c.id), a.set(c.id, c.id)
        }), s.columns.forEach(c => {
            const u = F(c.name),
                l = a.get(u);
            if (l) {
                a.set(c.id, l);
                return
            }
            o.push({ ...c,
                order: o.length
            }), a.set(u, c.id), a.set(c.id, c.id)
        });
        const i = { ...t.checkState
        };
        Object.entries(s.checkState).forEach(([c, u]) => {
            if (!u) return;
            const [l, m] = c.split("::"), b = e.get(l), I = a.get(m);
            b && I ? i[`${b}::${I}`] = !0 : b && !m.includes("::") && (i[`${b}::${m}`] = !0)
        });
        const d = { ...t.priorities
        };
        return Object.entries(s.priorities).forEach(([c, u]) => {
            const l = e.get(c);
            if (!l || !u) return;
            const m = d[l],
                b = {
                    high: 3,
                    medium: 2,
                    low: 1
                },
                I = u && b[u] || 0,
                w = m && b[m] || 0;
            I > w && (d[l] = u)
        }), {
            subjectId: r.id,
            columns: o.map((c, u) => ({ ...c,
                order: u
            })),
            checkState: i,
            priorities: d
        }
    },
    B = (r, n) => r && Array.from(new Set(r.map(e => n.get(e) || e))),
    N = (r, n) => r && Object.entries(r).reduce((e, [t, s]) => {
        const o = n.get(t) || t,
            a = e[o];
        if (typeof a == "number" && typeof s == "number") return e[o] = a + s, e;
        if (a && s && typeof a == "object" && typeof s == "object" && !Array.isArray(a) && !Array.isArray(s)) {
            const i = { ...a
            };
            return Object.entries(s).forEach(([d, c]) => {
                const u = i[d];
                i[d] = typeof u == "number" && typeof c == "number" ? u + c : c
            }), e[o] = i, e
        }
        return e[o] = s, e
    }, {}),
    H = Y((r, n) => ({
        subjects: [],
        isLoading: !1,
        hasLoaded: !1,
        fetchSubjects: async () => {
            const {
                isLoading: e,
                hasLoaded: t
            } = n();
            if (!(e || t)) {
                r({
                    isLoading: !0
                });
                try {
                    const s = ae(await S.getSubjects()).map(ie);
                    r({
                        subjects: s,
                        hasLoaded: !0
                    })
                } catch (s) {
                    console.error("Failed to fetch subjects:", s)
                } finally {
                    r({
                        isLoading: !1
                    })
                }
            }
        },
        reorderSubjects: async e => {
            const {
                subjects: t
            } = n(), s = e.map((o, a) => {
                const i = t.find(d => d.id === o);
                return i ? { ...i,
                    order: a,
                    updatedAt: h()
                } : null
            }).filter(Boolean);
            r({
                subjects: s
            });
            try {
                await Promise.all(s.map(o => S.updateSubject(o.id, {
                    order: o.order,
                    updatedAt: o.updatedAt
                })))
            } catch (o) {
                console.error("Failed to persist subject reorder:", o)
            }
        },
        addSubject: async (e, t) => {
            const s = n().subjects.length,
                o = Q[s % Q.length],
                a = {
                    id: x(),
                    name: e,
                    color: o.color,
                    gradient: o.gradient,
                    icon: t || "BookOpen",
                    chapters: [],
                    createdAt: h(),
                    updatedAt: h(),
                    order: s
                };
            r(i => ({
                subjects: [...i.subjects, a]
            }));
            try {
                await S.saveSubject(a)
            } catch (i) {
                console.error("Failed to save subject:", i), r(d => ({
                    subjects: d.subjects.filter(c => c.id !== a.id)
                }))
            }
            return a
        },
        updateSubject: async (e, t) => {
            const o = n().subjects.find(a => a.id === e) ?.name;
            r(a => ({
                subjects: a.subjects.map(i => i.id === e ? { ...i,
                    ...t,
                    updatedAt: h()
                } : i)
            }));
            try {
                if (await S.updateSubject(e, t), t.name && o && t.name !== o) {
                    const [a, i] = await Promise.all([S.getTasks({
                        includeDeleted: !0
                    }), S.getSessions({
                        includeDeleted: !0
                    })]), d = a.filter(u => u.subjectId === e || u.subject === o);
                    for (const u of d) await S.updateTask(u.id, {
                        subject: t.name,
                        subjectId: e
                    });
                    const c = i.filter(u => u.subjectIds && u.subjectIds.includes(e) || u.subjectId === e || u.subject === o);
                    for (const u of c) await S.updateSession(u.id, {
                        subject: t.name,
                        subjectId: e
                    });
                    O.getState().fetchTasks(), Se.getState().fetchSessions()
                }
            } catch (a) {
                console.error("Failed to update subject:", a)
            }
        },
        deleteSubject: async e => {
            r(t => ({
                subjects: t.subjects.filter(s => s.id !== e)
            }));
            try {
                await S.deleteSubject(e)
            } catch (t) {
                console.error("Failed to delete subject:", t)
            }
        },
        addChapter: async (e, t) => {
            const s = n().subjects.find(a => a.id === e);
            if (!s) return;
            const o = {
                id: x(),
                title: t,
                topics: [],
                order: s.chapters.length,
                createdAt: h(),
                updatedAt: h()
            };
            await n().updateSubject(e, {
                chapters: [...s.chapters, o]
            })
        },
        updateChapter: async (e, t, s) => {
            const o = n().subjects.find(i => i.id === e);
            if (!o) return;
            const a = o.chapters.map(i => i.id === t ? { ...i,
                ...s,
                updatedAt: h()
            } : i);
            await n().updateSubject(e, {
                chapters: a
            })
        },
        deleteChapter: async (e, t) => {
            const s = n().subjects.find(o => o.id === e);
            s && await n().updateSubject(e, {
                chapters: s.chapters.filter(o => o.id !== t)
            })
        },
        addTopic: async (e, t, s) => {
            const o = n().subjects.find(l => l.id === e);
            if (!o) return;
            const a = o.chapters.findIndex(l => l.id === t);
            if (a === -1) return;
            const i = o.chapters[a].topics,
                d = {
                    id: x(),
                    title: s,
                    completed: !1,
                    lastStudied: null,
                    nextReview: null,
                    easeFactor: 2.5,
                    interval: 0,
                    repetitions: 0,
                    mastery: "Novice",
                    resources: [],
                    order: i.length,
                    updatedAt: h()
                },
                c = [...o.chapters],
                u = [...c[a].topics, d];
            c[a] = { ...c[a],
                topics: u,
                completionPercentage: M(u),
                updatedAt: h()
            }, await n().updateSubject(e, {
                chapters: c
            })
        },
        updateTopic: async (e, t, s, o) => {
            const a = n().subjects.find(l => l.id === e);
            if (!a) return;
            const i = a.chapters.findIndex(l => l.id === t);
            if (i === -1) return;
            const d = a.chapters[i].topics.findIndex(l => l.id === s);
            if (d === -1) return;
            const c = [...a.chapters],
                u = [...c[i].topics];
            u[d] = { ...u[d],
                ...o,
                updatedAt: h()
            }, c[i] = { ...c[i],
                topics: u,
                completionPercentage: M(u),
                updatedAt: h()
            }, await n().updateSubject(e, {
                chapters: c
            })
        },
        deleteTopic: async (e, t, s) => {
            const o = n().subjects.find(c => c.id === e);
            if (!o) return;
            const a = o.chapters.findIndex(c => c.id === t);
            if (a === -1) return;
            const i = [...o.chapters],
                d = i[a].topics.filter(c => c.id !== s);
            i[a] = { ...i[a],
                topics: d,
                completionPercentage: M(d),
                updatedAt: h()
            }, await n().updateSubject(e, {
                chapters: i
            })
        },
        addSubtopic: async (e, t, s, o) => {
            const a = n().subjects.find(u => u.id === e);
            if (!a) return;
            const i = a.chapters.find(u => u.id === t);
            if (!i) return;
            const d = i.topics.find(u => u.id === s);
            if (!d) return;
            const c = {
                id: x(),
                title: o,
                completed: !1,
                order: d.subtopics ?.length ?? 0
            };
            await n().updateTopic(e, t, s, {
                subtopics: [...d.subtopics ?? [], c]
            })
        },
        updateSubtopic: async (e, t, s, o, a) => {
            const i = n().subjects.find(l => l.id === e);
            if (!i) return;
            const d = i.chapters.find(l => l.id === t);
            if (!d) return;
            const c = d.topics.find(l => l.id === s);
            if (!c) return;
            const u = (c.subtopics ?? []).map(l => l.id === o ? { ...l,
                ...a
            } : l);
            await n().updateTopic(e, t, s, {
                subtopics: u
            })
        },
        deleteSubtopic: async (e, t, s, o) => {
            const a = n().subjects.find(c => c.id === e);
            if (!a) return;
            const i = a.chapters.find(c => c.id === t);
            if (!i) return;
            const d = i.topics.find(c => c.id === s);
            d && await n().updateTopic(e, t, s, {
                subtopics: (d.subtopics ?? []).filter(c => c.id !== o)
            })
        },
        addResource: async (e, t, s, o) => {
            const a = n().subjects.find(l => l.id === e);
            if (!a) return;
            const i = a.chapters.findIndex(l => l.id === t);
            if (i === -1) return;
            const d = a.chapters[i].topics.findIndex(l => l.id === s);
            if (d === -1) return;
            const c = [...a.chapters],
                u = [...c[i].topics];
            u[d] = { ...u[d],
                resources: [...u[d].resources, o],
                updatedAt: h()
            }, c[i] = { ...c[i],
                topics: u,
                completionPercentage: M(u),
                updatedAt: h()
            }, await n().updateSubject(e, {
                chapters: c
            })
        },
        addFlashcard: async (e, t, s, o) => {
            const a = n().subjects.find(m => m.id === e);
            if (!a) return;
            const i = a.chapters.findIndex(m => m.id === t);
            if (i === -1) return;
            const d = a.chapters[i].topics.findIndex(m => m.id === s);
            if (d === -1) return;
            const c = [...a.chapters],
                u = [...c[i].topics],
                l = {
                    id: x(),
                    ...o
                };
            u[d] = { ...u[d],
                flashcards: [...u[d].flashcards || [], l],
                updatedAt: h()
            }, c[i] = { ...c[i],
                topics: u,
                completionPercentage: M(u),
                updatedAt: h()
            }, await n().updateSubject(e, {
                chapters: c
            })
        },
        updateTopicSRS: async (e, t, s, o) => {
            const a = n().subjects.find(T => T.id === e);
            if (!a) return;
            const i = a.chapters.findIndex(T => T.id === t);
            if (i === -1) return;
            const d = a.chapters[i].topics.findIndex(T => T.id === s);
            if (d === -1) return;
            const c = a.chapters[i].topics[d],
                l = {
                    again: 1,
                    hard: 2,
                    good: 4,
                    easy: 5
                }[o];
            let m, b = c.easeFactor,
                I = c.repetitions,
                w = c.mastery;
            l < 3 ? (m = 1, I = 0, w = "Novice") : (I = c.repetitions + 1, c.repetitions === 0 ? m = 1 : c.repetitions === 1 ? m = 6 : m = Math.round(c.interval * b), b = c.easeFactor + (.1 - (5 - l) * (.08 + (5 - l) * .02)), b = Math.max(1.3, b), o === "easy" ? I >= 3 && m > 21 ? w = "Enlightened" : w = "Guru" : I >= 5 && m > 21 ? w = "Master" : I >= 3 && m > 7 ? w = "Guru" : I >= 1 && (w = "Apprentice"));
            const A = new Date;
            A.setDate(A.getDate() + m);
            const p = [...a.chapters],
                f = [...p[i].topics];
            f[d] = { ...c,
                interval: m,
                easeFactor: b,
                mastery: w,
                nextReview: A.toISOString(),
                lastStudied: h(),
                repetitions: I,
                updatedAt: h()
            }, p[i] = { ...p[i],
                topics: f,
                updatedAt: h()
            }, await n().updateSubject(e, {
                chapters: p
            })
        },
        markAllTopicsComplete: async (e, t) => {
            const s = n().subjects.find(d => d.id === e);
            if (!s) return;
            const o = s.chapters.findIndex(d => d.id === t);
            if (o === -1) return;
            const a = [...s.chapters],
                i = a[o].topics.map(d => ({ ...d,
                    completed: !0,
                    lastStudied: h(),
                    updatedAt: h()
                }));
            a[o] = { ...a[o],
                topics: i,
                completionPercentage: M(i),
                updatedAt: h()
            }, await n().updateSubject(e, {
                chapters: a
            })
        },
        getSubjectById: e => n().subjects.find(t => t.id === e),
        getSubjectStats: e => {
            const t = n().subjects.find(i => i.id === e);
            if (!t) return {
                totalTopics: 0,
                completedTopics: 0,
                completionPercent: 0
            };
            const s = t.chapters.reduce((i, d) => i + d.topics.length, 0),
                o = t.chapters.reduce((i, d) => i + d.topics.filter(c => c.completed).length, 0),
                a = s > 0 ? Math.round(o / s * 100) : 0;
            return {
                totalTopics: s,
                completedTopics: o,
                completionPercent: a
            }
        },
        repairTemplateSubjects: async () => {
            const e = n().subjects.filter(p => !p.deletedAt),
                t = new Map;
            e.forEach(p => {
                const f = ce(p);
                if (!f) return;
                const T = t.get(f) || [];
                T.push(p), t.set(f, T)
            });
            const s = Array.from(t.values()).filter(p => p.length > 1);
            if (s.length === 0) return !1;
            const [o, a, i] = await Promise.all([S.getTasks({
                includeDeleted: !0
            }), S.getSessions({
                includeDeleted: !0
            }), S.getExams({
                includeDeleted: !0
            })]), d = new Map, c = new Map, u = new Map, l = new Set, m = new Map, b = h();
            if (s.forEach(p => {
                    const f = ze(p),
                        T = { ...f,
                            chapters: f.chapters.map(g => ({ ...g,
                                topics: g.topics.map(k => ({ ...k
                                })),
                                metadata: g.metadata ? { ...g.metadata
                                } : void 0
                            })),
                            syllabusConfig: f.syllabusConfig ? { ...f.syllabusConfig,
                                columns: f.syllabusConfig.columns.map(g => ({ ...g
                                })),
                                checkState: { ...f.syllabusConfig.checkState
                                },
                                priorities: { ...f.syllabusConfig.priorities
                                }
                            } : f.syllabusConfig
                        };
                    T.chapters.forEach(g => {
                        c.set(g.id, g.id), g.topics.forEach(k => {
                            u.set(k.id, k.id)
                        })
                    }), p.forEach(g => {
                        g.id !== f.id && (d.set(g.id, f.id), l.add(g.id), g.chapters.forEach(k => {
                            const y = T.chapters.find(j => F(j.title) === F(k.title));
                            if (!y) {
                                T.chapters.push({ ...k,
                                    topics: k.topics.map(j => ({ ...j
                                    })),
                                    metadata: k.metadata ? { ...k.metadata
                                    } : void 0
                                }), c.set(k.id, k.id), k.topics.forEach(j => {
                                    u.set(j.id, j.id)
                                });
                                return
                            }
                            c.set(k.id, y.id), k.topics.forEach(j => {
                                const C = y.topics.find(R => F(R.title) === F(j.title));
                                if (!C) {
                                    y.topics.push({ ...j
                                    }), u.set(j.id, j.id);
                                    return
                                }
                                u.set(j.id, C.id);
                                const E = Ke(C, j),
                                    D = y.topics.findIndex(R => R.id === C.id);
                                y.topics[D] = E
                            }), y.metadata = Ve(y.metadata, k.metadata), y.completionPercentage = M(y.topics), y.updatedAt = P(y.updatedAt, k.updatedAt) >= 0 ? y.updatedAt : k.updatedAt
                        }), T.syllabusConfig = Xe(T, g, c), T.studyTime = Math.max(T.studyTime || 0, g.studyTime || 0), T.order = Math.min(T.order ?? Number.MAX_SAFE_INTEGER, g.order ?? Number.MAX_SAFE_INTEGER))
                    }), T.createdAt = p.reduce((g, k) => P(k.createdAt, g) < 0 ? k.createdAt : g, f.createdAt), T.updatedAt = b, m.set(f.id, T)
                }), m.size === 0) return !1;
            for (const p of m.values()) await S.saveSubject(p);
            for (const p of l) await S.deleteSubject(p);
            let I = !1;
            for (const p of o) {
                const f = p.subjectId && d.get(p.subjectId) || p.subjectId,
                    T = p.chapterId && c.get(p.chapterId) || p.chapterId,
                    g = p.topicId && u.get(p.topicId) || p.topicId;
                (f !== p.subjectId || T !== p.chapterId || g !== p.topicId) && (await S.updateTask(p.id, {
                    subjectId: f,
                    chapterId: T,
                    topicId: g
                }), I = !0)
            }
            let w = !1;
            for (const p of a) {
                const f = B(p.subjectIds, d),
                    T = B(p.chapterIds, c),
                    g = B(p.topicIds, u),
                    k = p.subjectId && d.get(p.subjectId) || p.subjectId,
                    y = N(p.questionsBySubject, d),
                    j = N(p.questionsByChapter, c),
                    C = N(p.questionsByTopic, u),
                    E = p.timeAllocation ? { ...p.timeAllocation,
                        bySubject: N(p.timeAllocation.bySubject, d) || p.timeAllocation.bySubject,
                        byChapter: N(p.timeAllocation.byChapter, c) || p.timeAllocation.byChapter,
                        byTopic: N(p.timeAllocation.byTopic, u) || p.timeAllocation.byTopic
                    } : p.timeAllocation;
                (JSON.stringify(f) !== JSON.stringify(p.subjectIds) || JSON.stringify(T) !== JSON.stringify(p.chapterIds) || JSON.stringify(g) !== JSON.stringify(p.topicIds) || k !== p.subjectId || JSON.stringify(y) !== JSON.stringify(p.questionsBySubject) || JSON.stringify(j) !== JSON.stringify(p.questionsByChapter) || JSON.stringify(C) !== JSON.stringify(p.questionsByTopic) || JSON.stringify(E) !== JSON.stringify(p.timeAllocation)) && (await S.updateSession(p.id, {
                    subjectIds: f,
                    chapterIds: T,
                    topicIds: g,
                    subjectId: k,
                    questionsBySubject: y,
                    questionsByChapter: j,
                    questionsByTopic: C,
                    timeAllocation: E
                }), w = !0)
            }
            let A = !1;
            for (const p of i) {
                const f = B(p.syllabusIds, d) || p.syllabusIds,
                    T = B(p.chapterIds, c),
                    g = p.revisionSchedule ?.map(j => ({ ...j,
                        chapterId: c.get(j.chapterId) || j.chapterId
                    })),
                    k = p.analysis ? { ...p.analysis,
                        recommendedChaptersForRevision: B(p.analysis.recommendedChaptersForRevision, c) || p.analysis.recommendedChaptersForRevision
                    } : p.analysis,
                    y = p.result ? { ...p.result,
                        subjectResults: p.result.subjectResults.map(j => ({ ...j,
                            subjectId: d.get(j.subjectId) || j.subjectId,
                            chapterResults: j.chapterResults ?.map(C => ({ ...C,
                                chapterId: c.get(C.chapterId) || C.chapterId
                            }))
                        }))
                    } : p.result;
                (JSON.stringify(f) !== JSON.stringify(p.syllabusIds) || JSON.stringify(T) !== JSON.stringify(p.chapterIds) || JSON.stringify(g) !== JSON.stringify(p.revisionSchedule) || JSON.stringify(k) !== JSON.stringify(p.analysis) || JSON.stringify(y) !== JSON.stringify(p.result)) && (await S.saveExam({ ...p,
                    syllabusIds: f,
                    chapterIds: T,
                    revisionSchedule: g,
                    analysis: k,
                    result: y,
                    updatedAt: b
                }), A = !0)
            }
            return await n().refreshFromStorage(), I && await O.getState().refreshFromStorage ?.(), w && await Se.getState().refreshFromStorage ?.(), A && await Ge.getState().refreshFromStorage ?.("exams"), !0
        },
        createSubjectsFromTemplate: async (e, t) => {
            const s = We(e);
            if (!s) return console.error(`Template not found: ${e}`), [];
            const o = [],
                a = n().subjects.length,
                i = new Set(n().subjects.map(c => ce(c)).filter(Boolean)),
                d = t ? s.subjects.filter(c => t.includes(c.name)) : s.subjects;
            for (let c = 0; c < d.length; c++) {
                const u = d[c],
                    l = `${s.id}::${F(u.name)}`;
                if (i.has(l)) continue;
                const m = a + o.length,
                    b = Q[m % Q.length],
                    I = [];
                let w = 0;
                for (const p of u.units)
                    for (const f of p.chapters) {
                        const T = f.topics.map((k, y) => ({
                                id: x(),
                                title: k,
                                completed: !1,
                                lastStudied: null,
                                nextReview: null,
                                easeFactor: 2.5,
                                interval: 0,
                                repetitions: 0,
                                mastery: "Novice",
                                resources: [],
                                isPinned: !1,
                                studyTime: 0,
                                order: y,
                                updatedAt: h()
                            })),
                            g = M(T);
                        I.push({
                            id: x(),
                            title: f.name,
                            topics: T,
                            completionPercentage: g,
                            metadata: {
                                priority: null,
                                needsRevision: !1,
                                revisionCount: 0,
                                lastRevisionDate: null,
                                revisionStatus: "pending",
                                tags: []
                            },
                            createdAt: h(),
                            updatedAt: h(),
                            order: w++
                        })
                    }
                const A = {
                    id: x(),
                    name: u.name,
                    color: u.color || b.color,
                    gradient: u.gradient || b.gradient,
                    icon: u.icon || "BookOpen",
                    chapters: I,
                    createdAt: h(),
                    updatedAt: h(),
                    examTemplateId: s.id,
                    examName: s.name,
                    isCustom: !1,
                    order: m
                };
                o.push(A), i.add(l)
            }
            r(c => ({
                subjects: [...c.subjects, ...o]
            }));
            try {
                for (const c of o) await S.saveSubject(c)
            } catch (c) {
                console.error("Failed to save subjects from template:", c), r(u => ({
                    subjects: u.subjects.filter(l => !o.some(m => m.id === l.id))
                }))
            }
            return o
        },
        updateChapterMetadata: async (e, t, s) => {
            const o = n().subjects.find(i => i.id === e);
            if (!o) return;
            const a = o.chapters.map(i => i.id === t ? { ...i,
                metadata: { ...i.metadata || {
                        priority: null,
                        needsRevision: !1,
                        revisionCount: 0,
                        lastRevisionDate: null,
                        revisionStatus: "pending"
                    },
                    ...s
                },
                updatedAt: h()
            } : i);
            await n().updateSubject(e, {
                chapters: a
            })
        },
        setChapterPriority: async (e, t, s) => {
            await n().updateChapterMetadata(e, t, {
                priority: s
            })
        },
        markChapterForRevision: async (e, t, s) => {
            await n().updateChapterMetadata(e, t, {
                needsRevision: s,
                revisionStatus: s ? "pending" : "completed"
            })
        },
        incrementRevisionCount: async (e, t) => {
            const s = n().subjects.find(i => i.id === e);
            if (!s) return;
            const o = s.chapters.find(i => i.id === t);
            if (!o) return;
            const a = o.metadata ?.revisionCount || 0;
            await n().updateChapterMetadata(e, t, {
                revisionCount: a + 1,
                lastRevisionDate: h()
            })
        },
        updateRevisionStatus: async (e, t, s) => {
            await n().updateChapterMetadata(e, t, {
                revisionStatus: s,
                ...s === "completed" && {
                    needsRevision: !1
                }
            })
        },
        toggleTopicPin: async (e, t, s) => {
            const o = n().subjects.find(c => c.id === e);
            if (!o) return;
            const a = o.chapters.findIndex(c => c.id === t);
            if (a === -1) return;
            const i = o.chapters[a].topics.findIndex(c => c.id === s);
            if (i === -1) return;
            const d = o.chapters[a].topics[i];
            await n().updateTopic(e, t, s, {
                isPinned: !d.isPinned
            })
        },
        updateTopicStudyTime: async (e, t, s, o) => {
            const a = n().subjects.find(u => u.id === e);
            if (!a) return;
            const i = a.chapters.findIndex(u => u.id === t);
            if (i === -1) return;
            const d = a.chapters[i].topics.findIndex(u => u.id === s);
            if (d === -1) return;
            const c = a.chapters[i].topics[d];
            await n().updateTopic(e, t, s, {
                studyTime: (c.studyTime || 0) + o,
                lastStudied: h()
            })
        },
        updateChapterStudyTime: async (e, t, s) => {
            const o = n().subjects.find(i => i.id === e);
            if (!o) return;
            const a = o.chapters.find(i => i.id === t);
            a && await n().updateChapterMetadata(e, t, {
                studyTime: (a.metadata ?.studyTime || 0) + s
            })
        },
        updateSubjectStudyTime: async (e, t) => {
            const s = n().subjects.find(o => o.id === e);
            s && await n().updateSubject(e, {
                studyTime: (s.studyTime || 0) + t
            })
        },
        getHighPriorityChapters: e => {
            const t = e ? [n().subjects.find(o => o.id === e)].filter(Boolean) : n().subjects,
                s = [];
            for (const o of t) {
                const a = o.chapters.filter(i => i.metadata ?.priority === "high");
                s.push(...a)
            }
            return s
        },
        getChaptersNeedingRevision: e => {
            const t = e ? [n().subjects.find(o => o.id === e)].filter(Boolean) : n().subjects,
                s = [];
            for (const o of t) {
                const a = o.chapters.filter(i => i.metadata ?.needsRevision === !0);
                s.push(...a)
            }
            return s
        },
        getPendingRevisions: e => {
            const t = e ? [n().subjects.find(o => o.id === e)].filter(Boolean) : n().subjects,
                s = [];
            for (const o of t) {
                const a = o.chapters.filter(i => i.metadata ?.revisionStatus === "pending" && i.metadata ?.needsRevision);
                s.push(...a)
            }
            return s
        },
        bulkUpdateChapterPriority: async e => {
            const t = e.reduce((s, o) => (s[o.subjectId] || (s[o.subjectId] = []), s[o.subjectId].push(o), s), {});
            for (const [s, o] of Object.entries(t))
                for (const a of o) await n().setChapterPriority(s, a.chapterId, a.priority)
        },
        applyTimeAllocation: async e => {
            const {
                bySubject: t,
                byChapter: s,
                byTopic: o
            } = e, a = { ...t
            }, i = { ...s
            }, d = { ...o
            };
            for (const [c, u] of Object.entries(o))
                for (const l of n().subjects)
                    for (const m of l.chapters) m.topics.some(b => b.id === c) && (i[m.id] = (i[m.id] || 0) + u, a[l.id] = (a[l.id] || 0) + u);
            for (const [c, u] of Object.entries(s))
                for (const l of n().subjects) l.chapters.some(m => m.id === c) && (a[l.id] = (a[l.id] || 0) + u);
            for (const [c, u] of Object.entries(d))
                for (const l of n().subjects)
                    for (const m of l.chapters) m.topics.some(b => b.id === c) && await n().updateTopicStudyTime(l.id, m.id, c, u);
            for (const [c, u] of Object.entries(i))
                for (const l of n().subjects) l.chapters.some(m => m.id === c) && await n().updateChapterStudyTime(l.id, c, u);
            for (const [c, u] of Object.entries(a)) await n().updateSubjectStudyTime(c, u)
        },
        removeTimeAllocation: async e => {
            const {
                bySubject: t,
                byChapter: s,
                byTopic: o
            } = e, a = {}, i = {}, d = {};
            for (const [c, u] of Object.entries(o)) {
                d[c] = (d[c] || 0) - u;
                for (const l of n().subjects)
                    for (const m of l.chapters) m.topics.some(b => b.id === c) && (i[m.id] = (i[m.id] || 0) - u, a[l.id] = (a[l.id] || 0) - u)
            }
            for (const [c, u] of Object.entries(s)) {
                i[c] = (i[c] || 0) - u;
                for (const l of n().subjects) l.chapters.some(m => m.id === c) && (a[l.id] = (a[l.id] || 0) - u)
            }
            for (const [c, u] of Object.entries(t)) a[c] = (a[c] || 0) - u;
            for (const [c, u] of Object.entries(d))
                for (const l of n().subjects)
                    for (const m of l.chapters) m.topics.some(b => b.id === c) && await n().updateTopicStudyTime(l.id, m.id, c, u);
            for (const [c, u] of Object.entries(i))
                for (const l of n().subjects) l.chapters.some(m => m.id === c) && await n().updateChapterStudyTime(l.id, c, u);
            for (const [c, u] of Object.entries(a)) await n().updateSubjectStudyTime(c, u)
        },
        refreshFromStorage: async () => {
            try {
                const e = ae(await S.getSubjects()).map(ie);
                r({
                    subjects: e,
                    hasLoaded: !0
                })
            } catch (e) {
                console.error("[SubjectStore] Failed to refresh from storage:", e)
            }
        },
        reorderChapters: async (e, t, s) => {
            const o = n().subjects.find(c => c.id === e);
            if (!o) return;
            const a = [...o.chapters],
                i = a.findIndex(c => c.id === t);
            if (i === -1) return;
            const d = s === "up" ? i - 1 : i + 1;
            d < 0 || d >= a.length || ([a[i], a[d]] = [a[d], a[i]], a.forEach((c, u) => {
                c.order = u
            }), await n().updateSubject(e, {
                chapters: a
            }))
        },
        reorderTopics: async (e, t, s, o) => {
            const a = n().subjects.find(m => m.id === e);
            if (!a) return;
            const i = a.chapters.findIndex(m => m.id === t);
            if (i === -1) return;
            const d = [...a.chapters[i].topics],
                c = d.findIndex(m => m.id === s);
            if (c === -1) return;
            const u = o === "up" ? c - 1 : c + 1;
            if (u < 0 || u >= d.length) return;
            [d[c], d[u]] = [d[u], d[c]], d.forEach((m, b) => {
                m.order = b
            });
            const l = [...a.chapters];
            l[i] = { ...l[i],
                topics: d
            }, await n().updateSubject(e, {
                chapters: l
            })
        },
        setChapterOrder: async (e, t) => {
            const s = n().subjects.find(i => i.id === e);
            if (!s) return;
            const o = [...s.chapters],
                a = t.map(i => o.find(d => d.id === i)).filter(Boolean);
            a.forEach((i, d) => {
                i.order = d
            }), await n().updateSubject(e, {
                chapters: a
            })
        },
        setTopicOrder: async (e, t, s) => {
            const o = n().subjects.find(u => u.id === e);
            if (!o) return;
            const a = o.chapters.findIndex(u => u.id === t);
            if (a === -1) return;
            const i = [...o.chapters[a].topics],
                d = s.map(u => i.find(l => l.id === u)).filter(Boolean);
            d.forEach((u, l) => {
                u.order = l
            });
            const c = [...o.chapters];
            c[a] = { ...c[a],
                topics: d
            }, await n().updateSubject(e, {
                chapters: c
            })
        }
    }));

function ue(r) {
    const {
        durationMinutes: n,
        taskIds: e = [],
        topicIds: t = [],
        chapterIds: s = [],
        subjectIds: o
    } = r, a = {
        bySubject: {},
        byChapter: {},
        byTopic: {},
        byTask: {}
    };
    if (e.length > 0) {
        const i = Math.floor(n / e.length),
            d = n - i * e.length;
        return e.forEach((c, u) => {
            a.byTask[c] = i + (u === 0 ? d : 0)
        }), a
    }
    if (t.length > 0) {
        const i = Math.floor(n / t.length),
            d = n - i * t.length;
        return t.forEach((c, u) => {
            a.byTopic[c] = i + (u === 0 ? d : 0)
        }), a
    }
    if (s.length > 0) {
        const i = Math.floor(n / s.length),
            d = n - i * s.length;
        return s.forEach((c, u) => {
            a.byChapter[c] = i + (u === 0 ? d : 0)
        }), a
    }
    if (o.length > 0) {
        const i = Math.floor(n / o.length),
            d = n - i * o.length;
        o.forEach((c, u) => {
            a.bySubject[c] = i + (u === 0 ? d : 0)
        })
    }
    return a
}
const Ze = (r, n) => r && r !== "manual" ? r : n || "focus",
    et = () => {
        const r = we.getState();
        return r.isAuthenticated && !!r.userId && !r.userId ?.startsWith("local-") && r.isPremium()
    };

function le({
    sessionId: r,
    durationMinutes: n,
    sessionType: e,
    taskType: t,
    notes: s,
    endedAt: o
}) {
    return et() ? Te(async () => {
        const {
            reportSessionComplete: a
        } = await
        import ("./sessionSync-mloIEnTd.js");
        return {
            reportSessionComplete: a
        }
    }, __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).then(({
        reportSessionComplete: a
    }) => a({
        sessionId: r,
        durationMinutes: n,
        sessionType: Ze(e, t),
        notes: s,
        endedAt: o
    })).then(() => {}) : Promise.resolve()
}
const pe = () => {
        if (typeof window > "u") return;
        const r = window.AudioContext || window.webkitAudioContext;
        if (!r) return;
        const n = new r,
            e = (o, a, i, d = .1) => {
                const c = n.createOscillator(),
                    u = n.createGain();
                c.type = "sine", c.frequency.setValueAtTime(o, a), u.gain.setValueAtTime(0, a), u.gain.linearRampToValueAtTime(d, a + .1), u.gain.exponentialRampToValueAtTime(1e-4, a + i), c.connect(u), u.connect(n.destination), c.start(a), c.stop(a + i)
            },
            t = n.currentTime;
        [{
            freq: 440,
            time: 0
        }, {
            freq: 523.25,
            time: .5
        }, {
            freq: 587.33,
            time: 1
        }, {
            freq: 659.25,
            time: 1.5
        }, {
            freq: 783.99,
            time: 2
        }, {
            freq: 659.25,
            time: 2.5
        }, {
            freq: 587.33,
            time: 3
        }, {
            freq: 523.25,
            time: 3.5
        }, {
            freq: 440,
            time: 4
        }].forEach(o => {
            e(o.freq, t + o.time, 1.5)
        })
    },
    me = async () => Te(() =>
        import ("./sessionSync-mloIEnTd.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])),
    tt = (r, n) => ["duration", "startTime", "endTime", "taskType", "sessionType", "completed", "deletedAt"].some(t => r[t] !== n[t]),
    J = (r = []) => Array.from(new Set(r.filter(n => !!n))),
    st = r => {
        const n = r.subjectIds.length > 0 ? r.subjectIds : r.subjectId ? [r.subjectId] : [];
        return {
            subjectIds: J(n),
            chapterIds: J(r.chapterIds || []),
            topicIds: J(r.topicIds || []),
            taskIds: J(r.taskIds || [])
        }
    },
    fe = r => new Date(r.endTime || r.updatedAt || r.createdAt).getTime(),
    gt = (r, n, e = []) => {
        const t = new Map(n.map(a => [a.id, a])),
            s = new Set(e),
            o = [...r].filter(a => a.completed).sort((a, i) => fe(i) - fe(a));
        for (const a of o) {
            const i = st(a),
                d = i.subjectIds.map(l => t.get(l)).filter(l => !!l);
            if (d.length === 0) continue;
            const c = new Set(d.flatMap(l => l.chapters.map(m => m.id))),
                u = new Set(d.flatMap(l => l.chapters.flatMap(m => m.topics.map(b => b.id))));
            return {
                subjectIds: d.map(l => l.id),
                chapterIds: i.chapterIds.filter(l => c.has(l)),
                topicIds: i.topicIds.filter(l => u.has(l)),
                taskIds: i.taskIds.filter(l => s.has(l))
            }
        }
        return null
    },
    W = () => {
        const n = q.getState().profile ?.studyPreferences ?.pomodoroSettings;
        return {
            workDuration: n ?.workDuration || 25,
            shortBreakDuration: n ?.shortBreakDuration || 5,
            longBreakDuration: n ?.longBreakDuration || 15,
            sessionsUntilLongBreak: n ?.sessionsUntilLongBreak || 4
        }
    },
    $ = () => W().workDuration * 60,
    he = r => {
        const n = W(),
            e = r % n.sessionsUntilLongBreak === 0;
        return {
            breakSeconds: (e ? n.longBreakDuration : n.shortBreakDuration) * 60,
            isLongBreak: e
        }
    },
    ot = (r, n) => n || (r === "break" ? "break" : r === "running" || r === "paused" ? "focus" : null),
    rt = () => (q.getState().profile ?.studyPreferences ?.dailyGoalHours || 6) * 60,
    Se = Y((r, n) => ({
        sessions: [],
        isLoading: !1,
        hasLoaded: !1,
        timerState: "idle",
        activePhase: null,
        mode: "pomodoro",
        timeLeft: 1500,
        totalTime: 1500,
        stopwatchTime: 0,
        pomodoroCycle: 1,
        currentSubjectIds: [],
        currentChapterIds: [],
        currentTopicIds: [],
        currentTaskIds: [],
        currentTopic: null,
        sessionStartTime: null,
        sessionDescription: void 0,
        taskType: void 0,
        sessionType: void 0,
        pauseLogs: [],
        questionsAttempted: 0,
        questionsCorrect: 0,
        questionsIncorrect: 0,
        questionsSkipped: 0,
        targetQuestions: 0,
        questionsBySubject: {},
        questionsByChapter: {},
        questionActionHistory: [],
        manualStatus: "offline",
        currentSubjectId: null,
        currentSubject: null,
        todayMinutes: 0,
        dailyGoalMinutes: 360,
        initializeFromUserProfile: () => {
            if (!q.getState().profile) return;
            const t = W(),
                s = rt(),
                o = n(),
                a = {
                    dailyGoalMinutes: s
                };
            if (o.timerState === "idle") {
                const i = t.workDuration * 60;
                (o.totalTime !== i || o.timeLeft !== i) && (a.timeLeft = i, a.totalTime = i)
            }
            Object.keys(a).length > 0 && r(a)
        },
        fetchSessions: async () => {
            const {
                isLoading: e,
                hasLoaded: t
            } = n();
            if (!(e || t)) {
                r({
                    isLoading: !0
                });
                try {
                    const s = await S.getSessions(),
                        o = n().calculateTodayMinutes(s);
                    r({
                        sessions: s,
                        todayMinutes: o,
                        hasLoaded: !0
                    })
                } catch (s) {
                    console.error("Failed to fetch sessions:", s)
                } finally {
                    r({
                        isLoading: !1
                    })
                }
            }
        },
        addSession: async e => {
            r(t => ({
                sessions: [...t.sessions, e]
            })), r({
                todayMinutes: n().calculateTodayMinutes()
            });
            try {
                e.timeAllocation && (await O.getState().applyTimeAllocation(e.timeAllocation, e.id), await H.getState().applyTimeAllocation(e.timeAllocation))
            } catch (t) {
                console.error("[FocusStore] Failed to apply time allocation for session:", t)
            }
            try {
                await S.saveSession(e)
            } catch (t) {
                console.error("Failed to save session:", t)
            }
        },
        updateSession: async (e, t) => {
            const s = n().sessions.find(c => c.id === e);
            if (!s) return;
            const o = { ...s,
                ...t,
                updatedAt: h()
            };
            r(c => ({
                sessions: c.sessions.map(u => u.id === e ? o : u)
            })), r({
                todayMinutes: n().calculateTodayMinutes()
            });
            const a = s.timeAllocation,
                i = o.timeAllocation;
            if (JSON.stringify(a || {}) !== JSON.stringify(i || {})) {
                if (a) try {
                    await H.getState().removeTimeAllocation(a), await O.getState().removeTimeAllocation(a, e)
                } catch (c) {
                    console.error("[FocusStore] Failed to remove previous time allocation while updating session:", c)
                }
                if (i) try {
                    await H.getState().applyTimeAllocation(i), await O.getState().applyTimeAllocation(i, e)
                } catch (c) {
                    console.error("[FocusStore] Failed to apply updated time allocation while updating session:", c)
                }
            }
            try {
                await S.updateSession(e, { ...t,
                    updatedAt: h()
                })
            } catch (c) {
                console.error("Failed to update session:", c)
            }
            if (tt(s, o)) try {
                const {
                    reportSessionComplete: c,
                    reportSessionDeleted: u
                } = await me();
                s.completed && !s.deletedAt && await u(s.id), o.completed && !o.deletedAt && await c({
                    sessionId: o.id,
                    durationMinutes: o.duration,
                    sessionType: o.sessionType || o.taskType || "focus",
                    notes: o.notes,
                    endedAt: o.endTime
                })
            } catch (c) {
                console.error("[FocusStore] Failed to reconcile community sync after edit:", c)
            }
        },
        deleteSession: async e => {
            const t = n().sessions.find(s => s.id === e);
            if (t) {
                if (t.timeAllocation) try {
                    await H.getState().removeTimeAllocation(t.timeAllocation)
                } catch (s) {
                    console.error("[FocusStore] Failed to remove time allocation from subjects:", s)
                }
                if (t.timeAllocation) try {
                    await O.getState().removeTimeAllocation(t.timeAllocation, t.id)
                } catch (s) {
                    console.error("[FocusStore] Failed to remove time allocation from tasks:", s)
                }
                r(s => {
                    const o = s.sessions.filter(a => a.id !== e);
                    return {
                        sessions: o,
                        todayMinutes: n().calculateTodayMinutes(o)
                    }
                });
                try {
                    await S.softDeleteSession(e)
                } catch (s) {
                    console.error("Failed to delete session:", s)
                }
                me().then(({
                    reportSessionDeleted: s
                }) => s(e))
            }
        },
        setManualStatus: e => {
            r({
                manualStatus: e
            })
        },
        setMode: e => {
            const t = W(),
                s = e === "pomodoro" ? t.workDuration : 0;
            r({
                mode: e,
                timerState: "idle",
                activePhase: null,
                timeLeft: e === "pomodoro" ? s * 60 : 0,
                totalTime: s * 60,
                stopwatchTime: 0
            })
        },
        setTimerDuration: e => {
            r({
                timeLeft: e * 60,
                totalTime: e * 60
            })
        },
        setCurrentContext: async (e, t, s, o, a) => {
            let i = null;
            if (e && e.length > 0) try {
                const c = (await S.getSubjects()).find(u => u.id === e[0]);
                c && (i = c.name)
            } catch (d) {
                console.error("[FocusStore] Error resolving subject name:", d)
            }
            r({
                currentSubjectIds: e,
                currentChapterIds: t || [],
                currentTopicIds: s || [],
                currentTaskIds: o || [],
                currentTopic: a || null,
                currentSubjectId: e.length > 0 ? e[0] : null,
                currentSubject: i
            }), n().persistTimerState()
        },
        setCurrentContextLegacy: (e, t, s, o) => {
            r({
                currentSubjectIds: t ? [t] : [],
                currentChapterIds: [],
                currentTopicIds: [],
                currentTaskIds: s || [],
                currentTopic: o || null,
                currentSubject: e,
                currentSubjectId: t || null
            }), n().persistTimerState()
        },
        startTimer: (e, t) => {
            const s = n(),
                o = q.getState().profile ?.focusSettings ?.focusTypes,
                a = xe(o, e),
                i = a ?.trackQuestions && a.defaultQuestionTarget ? a.defaultQuestionTarget : 0;
            r({
                timerState: "running",
                activePhase: "focus",
                sessionStartTime: h(),
                stopwatchTime: s.mode === "stopwatch" ? 0 : s.stopwatchTime,
                taskType: e,
                sessionType: e,
                sessionDescription: t,
                pauseLogs: [],
                questionsAttempted: 0,
                questionsCorrect: 0,
                questionsIncorrect: 0,
                questionsSkipped: 0,
                targetQuestions: i,
                questionsBySubject: {},
                questionsByChapter: {},
                questionActionHistory: []
            }), n().persistTimerState()
        },
        pauseTimer: (e = "Pause") => {
            r(t => ({
                timerState: "paused",
                pauseLogs: [...t.pauseLogs, {
                    reason: e,
                    startTime: h(),
                    duration: 0,
                    endTime: void 0
                }]
            })), n().persistTimerState()
        },
        resumeTimer: () => {
            r(e => {
                const t = [...e.pauseLogs],
                    s = t[t.length - 1];
                return s && !s.endTime && (s.endTime = h(), s.duration = (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 1e3), {
                    timerState: e.activePhase === "break" ? "break" : "running",
                    pauseLogs: t
                }
            }), n().persistTimerState()
        },
        resetTimer: () => {
            const e = n(),
                t = e.activePhase === "break" ? $() : e.totalTime;
            r({
                timerState: "idle",
                activePhase: null,
                timeLeft: t,
                totalTime: t,
                stopwatchTime: 0,
                sessionStartTime: null,
                currentSubjectIds: [],
                currentChapterIds: [],
                currentTopicIds: [],
                currentTaskIds: [],
                currentSubjectId: null,
                currentSubject: null,
                currentTopic: null,
                questionsAttempted: 0,
                questionsCorrect: 0,
                questionsIncorrect: 0,
                questionsSkipped: 0,
                targetQuestions: 0,
                questionsBySubject: {},
                questionsByChapter: {},
                questionActionHistory: []
            }), S.clearTimerState()
        },
        skipToBreak: async () => {
            const e = n();
            if (e.activePhase === "break") {
                await n().finishBreak();
                return
            }
            if (e.sessionStartTime) {
                await n().completeSession(void 0, void 0, void 0, void 0, {
                    transitionToBreak: !0
                });
                return
            }
            const {
                breakSeconds: t
            } = he(e.pomodoroCycle);
            r({
                timerState: "break",
                activePhase: "break",
                timeLeft: t,
                totalTime: t,
                sessionStartTime: h(),
                sessionDescription: void 0,
                taskType: void 0,
                sessionType: void 0,
                pauseLogs: []
            }), await n().persistTimerState()
        },
        finishBreak: async () => {
            const e = n(),
                t = $();
            r({
                timerState: "idle",
                activePhase: null,
                timeLeft: t,
                totalTime: t,
                stopwatchTime: 0,
                sessionStartTime: null,
                sessionDescription: void 0,
                taskType: void 0,
                sessionType: void 0,
                pauseLogs: [],
                questionsAttempted: 0,
                questionsCorrect: 0,
                questionsIncorrect: 0,
                questionsSkipped: 0,
                targetQuestions: 0,
                questionsBySubject: {},
                questionsByChapter: {},
                questionActionHistory: [],
                pomodoroCycle: e.pomodoroCycle
            }), q.getState().getFocusSettings().sessionEndSound && pe();
            const {
                sendNotification: o
            } = G.getState();
            o(_.FOCUS_SESSION, "☕ Break Over!", {
                body: "Your break has ended. Ready to get back to work?",
                data: {
                    url: "/focus"
                }
            }), await S.clearTimerState()
        },
        addTime: e => {
            r(t => ({
                timeLeft: Math.max(0, t.timeLeft + e),
                totalTime: Math.max(0, t.totalTime + e)
            }))
        },
        tick: () => {
            const e = n();
            if (e.timerState !== "running" && e.timerState !== "break" || !e.sessionStartTime) return;
            const t = new Date().getTime(),
                s = new Date(e.sessionStartTime).getTime(),
                o = e.pauseLogs.reduce((d, c) => d + c.duration, 0) * 1e3,
                a = t - s - o,
                i = Math.floor(a / 1e3);
            if (e.mode === "pomodoro" || e.activePhase === "break") {
                const d = Math.max(0, e.totalTime - i);
                d === 0 && e.timeLeft > 0 ? e.activePhase === "break" ? (r({
                    timeLeft: 0
                }), n().finishBreak()) : (r({
                    timeLeft: 0
                }), n().completeSession()) : d !== e.timeLeft && r({
                    timeLeft: d
                })
            } else i !== e.stopwatchTime && r({
                stopwatchTime: i
            });
            i % 30 === 0 && n().persistTimerState()
        },
        setTargetQuestions: e => {
            r({
                targetQuestions: e
            }), n().persistTimerState()
        },
        updateQuestionStats: e => {
            r(t => ({
                questionsAttempted: e.attempted ?? t.questionsAttempted,
                questionsCorrect: e.correct ?? t.questionsCorrect,
                questionsIncorrect: e.incorrect ?? t.questionsIncorrect,
                questionsSkipped: e.skipped ?? t.questionsSkipped
            })), n().persistTimerState()
        },
        updateQuestionStatsBySubject: (e, t) => {
            r(s => {
                const o = s.questionsBySubject[e] || {
                    attempted: 0,
                    correct: 0,
                    incorrect: 0,
                    skipped: 0
                };
                return {
                    questionsBySubject: { ...s.questionsBySubject,
                        [e]: {
                            attempted: (o.attempted || 0) + (t.attempted || 0),
                            correct: (o.correct || 0) + (t.correct || 0),
                            incorrect: (o.incorrect || 0) + (t.incorrect || 0),
                            skipped: (o.skipped || 0) + (t.skipped || 0)
                        }
                    }
                }
            }), n().persistTimerState()
        },
        updateQuestionStatsByChapter: (e, t) => {
            r(s => {
                const o = s.questionsByChapter[e] || {
                    attempted: 0,
                    correct: 0,
                    incorrect: 0,
                    skipped: 0
                };
                return {
                    questionsByChapter: { ...s.questionsByChapter,
                        [e]: {
                            attempted: (o.attempted || 0) + (t.attempted || 0),
                            correct: (o.correct || 0) + (t.correct || 0),
                            incorrect: (o.incorrect || 0) + (t.incorrect || 0),
                            skipped: (o.skipped || 0) + (t.skipped || 0)
                        }
                    }
                }
            }), n().persistTimerState()
        },
        recordQuestionResult: e => {
            r(t => {
                const s = {
                        attempted: 1,
                        correct: e === "correct" ? 1 : 0,
                        incorrect: e === "incorrect" ? 1 : 0,
                        skipped: e === "skipped" ? 1 : 0
                    },
                    o = { ...t.questionsBySubject
                    };
                t.currentSubjectIds.forEach(i => {
                    const d = o[i] || {
                        attempted: 0,
                        correct: 0,
                        incorrect: 0,
                        skipped: 0
                    };
                    o[i] = {
                        attempted: Math.max(0, d.attempted + s.attempted),
                        correct: Math.max(0, d.correct + s.correct),
                        incorrect: Math.max(0, d.incorrect + s.incorrect),
                        skipped: Math.max(0, d.skipped + s.skipped)
                    }
                });
                const a = { ...t.questionsByChapter
                };
                return t.currentChapterIds.forEach(i => {
                    const d = a[i] || {
                        attempted: 0,
                        correct: 0,
                        incorrect: 0,
                        skipped: 0
                    };
                    a[i] = {
                        attempted: Math.max(0, d.attempted + s.attempted),
                        correct: Math.max(0, d.correct + s.correct),
                        incorrect: Math.max(0, d.incorrect + s.incorrect),
                        skipped: Math.max(0, d.skipped + s.skipped)
                    }
                }), {
                    questionsAttempted: t.questionsAttempted + s.attempted,
                    questionsCorrect: t.questionsCorrect + s.correct,
                    questionsIncorrect: t.questionsIncorrect + s.incorrect,
                    questionsSkipped: t.questionsSkipped + s.skipped,
                    questionsBySubject: o,
                    questionsByChapter: a,
                    questionActionHistory: [...t.questionActionHistory, {
                        action: e,
                        subjectIds: [...t.currentSubjectIds],
                        chapterIds: [...t.currentChapterIds]
                    }]
                }
            }), n().persistTimerState()
        },
        undoLastQuestionResult: () => {
            r(e => {
                const t = e.questionActionHistory[e.questionActionHistory.length - 1];
                if (!t) return e;
                const s = {
                        attempted: -1,
                        correct: t.action === "correct" ? -1 : 0,
                        incorrect: t.action === "incorrect" ? -1 : 0,
                        skipped: t.action === "skipped" ? -1 : 0
                    },
                    o = { ...e.questionsBySubject
                    };
                t.subjectIds.forEach(i => {
                    const d = o[i];
                    d && (o[i] = {
                        attempted: Math.max(0, d.attempted + s.attempted),
                        correct: Math.max(0, d.correct + s.correct),
                        incorrect: Math.max(0, d.incorrect + s.incorrect),
                        skipped: Math.max(0, d.skipped + s.skipped)
                    })
                });
                const a = { ...e.questionsByChapter
                };
                return t.chapterIds.forEach(i => {
                    const d = a[i];
                    d && (a[i] = {
                        attempted: Math.max(0, d.attempted + s.attempted),
                        correct: Math.max(0, d.correct + s.correct),
                        incorrect: Math.max(0, d.incorrect + s.incorrect),
                        skipped: Math.max(0, d.skipped + s.skipped)
                    })
                }), {
                    questionsAttempted: Math.max(0, e.questionsAttempted + s.attempted),
                    questionsCorrect: Math.max(0, e.questionsCorrect + s.correct),
                    questionsIncorrect: Math.max(0, e.questionsIncorrect + s.incorrect),
                    questionsSkipped: Math.max(0, e.questionsSkipped + s.skipped),
                    questionsBySubject: o,
                    questionsByChapter: a,
                    questionActionHistory: e.questionActionHistory.slice(0, -1)
                }
            }), n().persistTimerState()
        },
        completeSession: async (e, t = 80, s, o, a) => {
            const i = n();
            if (!i.sessionStartTime || i.activePhase === "break") return null;
            r({
                sessionStartTime: null
            });
            const d = h(),
                c = [...i.pauseLogs];
            if (i.timerState === "paused") {
                const y = c[c.length - 1];
                y && !y.endTime && (y.endTime = d, y.duration = (new Date(y.endTime).getTime() - new Date(y.startTime).getTime()) / 1e3)
            }
            const u = Math.round(c.reduce((y, j) => y + j.duration, 0)),
                l = i.mode === "pomodoro" ? i.totalTime - i.timeLeft : i.stopwatchTime,
                m = Math.max(1, Math.round(l / 60)),
                b = c.map(y => ({ ...y,
                    duration: Math.round(y.duration)
                })),
                I = ue({
                    durationMinutes: m,
                    subjectIds: i.currentSubjectIds,
                    chapterIds: i.currentChapterIds,
                    topicIds: i.currentTopicIds,
                    taskIds: i.currentTaskIds
                }),
                w = {
                    id: x(),
                    subjectIds: i.currentSubjectIds.length > 0 ? i.currentSubjectIds : [],
                    chapterIds: i.currentChapterIds.length > 0 ? i.currentChapterIds : void 0,
                    topicIds: i.currentTopicIds.length > 0 ? i.currentTopicIds : void 0,
                    taskIds: i.currentTaskIds.length > 0 ? i.currentTaskIds : void 0,
                    subject: i.currentSubject || "General",
                    subjectId: i.currentSubjectId || void 0,
                    topic: i.currentTopic || i.currentSubject || "Focus Session",
                    duration: m,
                    plannedDuration: i.mode === "pomodoro" && i.totalTime > 0 ? Math.round(i.totalTime / 60) : void 0,
                    startTime: i.sessionStartTime,
                    endTime: d,
                    type: i.taskType || i.sessionType || "Practice",
                    taskType: i.taskType,
                    sessionType: i.sessionType,
                    mode: i.mode,
                    description: i.sessionDescription,
                    timeAllocation: I,
                    allocationStrategy: "hierarchical",
                    pauseLogs: b,
                    totalPauseTime: u,
                    efficiency: Math.round(t),
                    productivityRating: s ? Math.round(s) : void 0,
                    notes: e,
                    completedTaskIds: o,
                    questionsAttempted: i.questionsAttempted,
                    questionsCorrect: i.questionsCorrect,
                    questionsIncorrect: i.questionsIncorrect,
                    questionsSkipped: i.questionsSkipped,
                    targetQuestions: i.targetQuestions,
                    questionsBySubject: i.questionsBySubject,
                    questionsByChapter: i.questionsByChapter,
                    completed: !0,
                    createdAt: h(),
                    updatedAt: h(),
                    timeAllocationSynced: !1
                };
            await n().addSession(w), q.getState().getFocusSettings().sessionEndSound && pe();
            const {
                sendNotification: p
            } = G.getState();
            if (p(_.FOCUS_SESSION, "🎯 Session Complete!", {
                    body: `You focused for ${m} minutes on ${w.subject}.`,
                    data: {
                        url: "/analytics"
                    }
                }), i.questionsAttempted > 0) {
                const j = n().sessions.filter(D => D.id !== w.id).reduce((D, R) => D + (R.questionsAttempted || 0), 0),
                    C = j + i.questionsAttempted,
                    E = [100, 500, 1e3, 2500, 5e3, 1e4];
                for (const D of E)
                    if (j < D && C >= D) {
                        p(_.FOCUS_SESSION, "🏆 Milestone Unlocked!", {
                            body: `Incredible! You just passed ${D} total questions solved. Keep up the amazing work!`,
                            data: {
                                url: "/analytics"
                            }
                        });
                        break
                    }
            }
            le({
                sessionId: w.id,
                durationMinutes: m,
                sessionType: i.sessionType,
                taskType: i.taskType,
                notes: e,
                endedAt: d
            });
            const T = q.getState().profile ?.focusSettings ?.autoStartBreaks ?? !1,
                g = i.mode === "pomodoro" ? i.pomodoroCycle + 1 : 1;
            if (i.mode === "pomodoro" && (T || a ?.transitionToBreak === !0)) {
                const {
                    breakSeconds: y
                } = he(i.pomodoroCycle);
                r({
                    timerState: "break",
                    activePhase: "break",
                    timeLeft: y,
                    totalTime: y,
                    stopwatchTime: 0,
                    sessionStartTime: h(),
                    sessionDescription: void 0,
                    taskType: void 0,
                    sessionType: void 0,
                    pauseLogs: [],
                    questionsAttempted: 0,
                    questionsCorrect: 0,
                    questionsIncorrect: 0,
                    questionsSkipped: 0,
                    targetQuestions: 0,
                    questionsBySubject: {},
                    questionsByChapter: {},
                    questionActionHistory: [],
                    pomodoroCycle: g
                }), await n().persistTimerState()
            } else {
                const y = i.mode === "pomodoro" ? $() : i.totalTime;
                r({
                    timerState: "idle",
                    activePhase: null,
                    timeLeft: y,
                    totalTime: y,
                    stopwatchTime: 0,
                    sessionStartTime: null,
                    sessionDescription: void 0,
                    taskType: void 0,
                    sessionType: void 0,
                    pauseLogs: [],
                    questionsAttempted: 0,
                    questionsCorrect: 0,
                    questionsIncorrect: 0,
                    questionsSkipped: 0,
                    targetQuestions: 0,
                    questionsBySubject: {},
                    questionsByChapter: {},
                    questionActionHistory: [],
                    pomodoroCycle: g
                }), await S.clearTimerState()
            }
            return w
        },
        cancelSession: () => {
            const e = n(),
                t = e.activePhase === "break" ? $() : e.totalTime;
            r({
                timerState: "idle",
                activePhase: null,
                timeLeft: t,
                totalTime: t,
                stopwatchTime: 0,
                sessionStartTime: null,
                pauseLogs: [],
                questionsAttempted: 0,
                questionsCorrect: 0,
                questionsIncorrect: 0,
                questionsSkipped: 0,
                targetQuestions: 0,
                questionsBySubject: {},
                questionsByChapter: {}
            }), S.clearTimerState()
        },
        persistTimerState: async () => {
            const e = n(),
                t = {
                    timerState: e.timerState,
                    activePhase: e.activePhase,
                    mode: e.mode,
                    timeLeft: e.timeLeft,
                    totalTime: e.totalTime,
                    stopwatchTime: e.stopwatchTime,
                    pomodoroCycle: e.pomodoroCycle,
                    currentSubjectIds: e.currentSubjectIds,
                    currentChapterIds: e.currentChapterIds,
                    currentTopicIds: e.currentTopicIds,
                    currentTaskIds: e.currentTaskIds,
                    currentSubjectId: e.currentSubjectId,
                    currentSubject: e.currentSubject,
                    currentTopic: e.currentTopic,
                    sessionStartTime: e.sessionStartTime,
                    sessionDescription: e.sessionDescription,
                    taskType: e.taskType,
                    sessionType: e.sessionType,
                    pauseLogs: e.pauseLogs,
                    questionsAttempted: e.questionsAttempted,
                    questionsCorrect: e.questionsCorrect,
                    questionsIncorrect: e.questionsIncorrect,
                    questionsSkipped: e.questionsSkipped,
                    targetQuestions: e.targetQuestions,
                    lastPersistedAt: h()
                };
            await S.saveTimerState(t)
        },
        restoreTimerState: async () => {
            if (n().timerState !== "idle") return;
            const e = await S.getTimerState();
            if (!e) return;
            const t = e.currentSubjectIds || (e.currentSubjectId ? [e.currentSubjectId] : []),
                s = e.currentChapterIds || [],
                o = e.currentTopicIds || [],
                a = e.currentTaskIds || [],
                i = e.pauseLogs || [],
                d = ot(e.timerState, e.activePhase),
                c = e.questionsAttempted || 0,
                u = e.questionsCorrect || 0,
                l = e.questionsIncorrect || 0,
                m = e.questionsSkipped || 0,
                b = e.targetQuestions || 0,
                I = await S.getSubjects().catch(() => []),
                w = t.length > 0 && I.find(p => p.id === t[0]) ?.name || e.currentSubject,
                A = o.length > 0 && I.flatMap(p => p.chapters).flatMap(p => p.topics).find(p => p.id === o[0]) ?.title || e.currentTopic;
            if ((e.timerState === "running" || e.timerState === "break") && e.sessionStartTime) {
                const p = new Date(e.lastPersistedAt).getTime(),
                    f = Math.floor((Date.now() - p) / 1e3);
                if (e.mode === "pomodoro" || d === "break") {
                    const T = Math.max(0, e.timeLeft - f);
                    r({ ...e,
                        activePhase: d,
                        currentSubjectIds: t,
                        currentChapterIds: s,
                        currentTopicIds: o,
                        currentTaskIds: a,
                        currentSubject: w,
                        currentTopic: A,
                        pauseLogs: i,
                        questionsAttempted: c,
                        questionsCorrect: u,
                        questionsIncorrect: l,
                        questionsSkipped: m,
                        targetQuestions: b,
                        timeLeft: T,
                        timerState: T <= 0 ? d === "break" ? "break" : "running" : "paused"
                    }), T <= 0 && (d === "break" ? await n().finishBreak() : await n().completeSession())
                } else r({ ...e,
                    activePhase: d,
                    currentSubjectIds: t,
                    currentChapterIds: s,
                    currentTopicIds: o,
                    currentTaskIds: a,
                    currentSubject: w,
                    currentTopic: A,
                    pauseLogs: i,
                    questionsAttempted: c,
                    questionsCorrect: u,
                    questionsIncorrect: l,
                    questionsSkipped: m,
                    targetQuestions: b,
                    stopwatchTime: e.stopwatchTime + f,
                    timerState: "paused"
                })
            } else r({ ...e,
                activePhase: d,
                currentSubjectIds: t,
                currentChapterIds: s,
                currentTopicIds: o,
                currentTaskIds: a,
                currentSubject: w,
                currentTopic: A,
                pauseLogs: i,
                questionsAttempted: c,
                questionsCorrect: u,
                questionsIncorrect: l,
                questionsSkipped: m,
                targetQuestions: b
            })
        },
        calculateTodayMinutes: e => {
            const t = e || n().sessions,
                o = q.getState().profile ?.studyPreferences ?.dayOffset || 0,
                a = ne(new Date, o);
            return t.filter(i => i.completed && ne(i.startTime, o) === a).reduce((i, d) => i + d.duration, 0)
        },
        addManualSession: async e => {
            const t = new Date(e.endTime).getTime() - new Date(e.startTime).getTime(),
                s = Math.max(1, Math.round(t / 6e4));
            let o = "General";
            try {
                const u = (await S.getSubjects()).find(l => l.id === e.subjectId);
                u && (o = u.name)
            } catch {}
            const a = (e.taskType || "practice").toLowerCase(),
                i = a === "lecture" ? "Lecture" : a === "revision" ? "Revision" : a === "questions" || a === "practice" ? "Practice" : "Other",
                d = {
                    id: x(),
                    subjectIds: [e.subjectId],
                    taskIds: e.taskId ? [e.taskId] : void 0,
                    subject: o,
                    subjectId: e.subjectId,
                    topic: "Manual Session",
                    duration: s,
                    startTime: e.startTime,
                    endTime: e.endTime,
                    type: i,
                    taskType: a,
                    sessionType: a,
                    mode: "manual",
                    description: e.description,
                    notes: e.notes,
                    timeAllocation: ue({
                        durationMinutes: s,
                        subjectIds: [e.subjectId],
                        taskIds: e.taskId ? [e.taskId] : void 0
                    }),
                    allocationStrategy: "hierarchical",
                    pauseLogs: [],
                    totalPauseTime: 0,
                    efficiency: 100,
                    productivityRating: 5,
                    completed: !0,
                    createdAt: h(),
                    updatedAt: h()
                };
            await n().addSession(d), le({
                sessionId: d.id,
                durationMinutes: s,
                sessionType: d.sessionType,
                taskType: d.taskType,
                notes: e.notes,
                endedAt: e.endTime
            })
        },
        refreshFromStorage: async () => {
            try {
                const e = await S.getSessions(),
                    t = n().calculateTodayMinutes(e);
                r({
                    sessions: e,
                    todayMinutes: t,
                    hasLoaded: !0
                })
            } catch (e) {
                console.error("[FocusStore] Failed to refresh from storage:", e)
            }
        }
    }));
export {
    gt as A, ue as B, le as C, Be as D, Oe as E, ct as F, be as G, oe as H, bt as a, Ye as b, yt as c, Tt as d, ge as e, ft as f, ne as g, Se as h, mt as i, O as j, Ge as k, lt as l, pt as m, ht as n, St as o, Z as p, ke as q, U as r, z as s, v as t, H as u, Ne as v, se as w, Ee as x, ut as y, dt as z
};