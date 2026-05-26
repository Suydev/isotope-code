import {
    c as M,
    d as w,
    p as m
} from "./useFocusStore-CX_Nyp1h.js";
const k = (a, n) => ({
        capacityHours: null,
        capacityMinutes: 0,
        plannedMinutes: 0,
        loggedMinutes: 0,
        projectedMinutes: 0,
        remainingMinutes: 0,
        overloadMinutes: 0,
        utilizationPercent: 0,
        isConfigured: !1,
        isOverCapacity: !1,
        weekStart: a,
        weekEnd: n
    }),
    C = a => {
        switch (a) {
            case "list":
                return {
                    view: "table",
                    sortBy: "priority",
                    groupBy: "none",
                    description: "List view opens with a clean queue for rapid task clearing."
                };
            case "calendar":
                return {
                    view: "table",
                    sortBy: "dueDate",
                    groupBy: "dueDate",
                    description: "Calendar planning opens a date-first task queue grouped by due date."
                };
            case "kanban":
            default:
                return {
                    view: "board",
                    sortBy: "priority",
                    groupBy: "status",
                    description: "Kanban opens your board with status columns and priority-first sorting."
                }
        }
    },
    h = (a, n) => {
        const r = C(a);
        return n.setView(r.view), n.setSortBy(r.sortBy), n.setGroupBy(r.groupBy), r
    },
    v = ({
        tasks: a,
        sessions: n,
        profile: r,
        referenceDate: g = new Date
    }) => {
        const d = M(r ?.studyPreferences),
            {
                start: i,
                end: o
            } = w(g, d.weekStartsOn, d.startHour, d.startMinute),
            u = r ?.academic ?.weeklyCapacity ?? null;
        if (!u || u <= 0) return k(i, o);
        const s = u * 60,
            p = a.filter(e => e.status !== "done" && !e.deletedAt).filter(e => {
                const t = m(e.dueDate);
                return t >= i && t <= o
            }).reduce((e, t) => e + Math.max(t.effort || 0, 0), 0),
            l = n.filter(e => e.completed && !e.deletedAt).filter(e => {
                const t = new Date(e.startTime);
                return t >= i && t <= o
            }).reduce((e, t) => e + Math.max(t.duration || 0, 0), 0),
            c = p + l,
            y = Math.max(c - s, 0),
            f = Math.max(s - c, 0);
        return {
            capacityHours: u,
            capacityMinutes: s,
            plannedMinutes: p,
            loggedMinutes: l,
            projectedMinutes: c,
            remainingMinutes: f,
            overloadMinutes: y,
            utilizationPercent: s > 0 ? Math.round(c / s * 100) : 0,
            isConfigured: !0,
            isOverCapacity: y > 0,
            weekStart: i,
            weekEnd: o
        }
    };
export {
    h as a, C as b, v as g
};