import {
    A as m
} from "./App-pJGjDiPw.js";
import {
    L as x
} from "./App-pJGjDiPw.js";
import {
    t as E
} from "./TaskController-BUyiMYKC.js";
import {
    n as y
} from "./useAIStore-B2cv1FZz.js";
import {
    H as f
} from "./useFocusStore-CX_Nyp1h.js";
import {
    e as k
} from "./endOfDay-CZDDeNMb.js";
import "./index-BPYJFSVW.js";
import "./vendor-react-BfU3Zn2J.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-motion-Cp_NPzpZ.js";
import "./vendor-icons-CqruUz7g.js";
import "./vendor-router-CmoTwRnm.js";
import "./useNotificationStore-BS4df28T.js";
class u {
    isEnabled() {
        return !0
    }
}
class G extends u {
    constructor() {
        super(...arguments), this.name = "Google Calendar Sync", this.id = "google-calendar-worker"
    }
    async run(n, r) {
        try {
            const t = y(new Date, 1),
                o = f(t).toISOString(),
                a = k(t).toISOString(),
                e = (await m.getSessions()).filter(s => s.completed && s.endTime && s.endTime >= o && s.endTime <= a);
            if (e.length === 0) return {
                success: !0,
                message: "No sessions to sync for yesterday."
            };
            let c = 0;
            for (const s of e) {
                const p = {
                        summary: `Focus: ${s.subject||"Study Session"}`,
                        description: `Focus session recorded via IsotopeAI.
Efficiency: ${s.efficiency}%
Notes: ${s.notes||"None"}`,
                        start: {
                            dateTime: s.startTime,
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        },
                        end: {
                            dateTime: s.endTime,
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        }
                    },
                    d = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${r}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(p)
                    });
                if (d.ok) c++;
                else {
                    const g = await d.json();
                    console.error("[GoogleCalendarWorker] API Error:", g)
                }
            }
            return {
                success: !0,
                message: `Successfully synced ${c}/${e.length} sessions to Google Calendar.`
            }
        } catch (t) {
            return {
                success: !1,
                message: t.message || "Unknown error occurred during calendar sync."
            }
        }
    }
}
class j extends u {
    constructor() {
        super(...arguments), this.name = "Google Tasks Sync", this.id = "google-tasks-worker"
    }
    async run(n, r) {
        try {
            const o = (await m.getTasks()).filter(e => !e.completedAt && !e.deletedAt);
            if (o.length === 0) return {
                success: !0,
                message: "No planned tasks to sync."
            };
            const a = await this.getOrCreateTaskList(r);
            let i = 0;
            for (const e of o) {
                const c = {
                    title: e.title,
                    notes: e.description || `Priority: ${e.priority}`,
                    due: e.dueDate ? new Date(e.dueDate).toISOString() : void 0
                };
                (await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${a}/tasks`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${r}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(c)
                })).ok && i++
            }
            return {
                success: !0,
                message: `Successfully synced ${i}/${o.length} tasks to Google Tasks.`
            }
        } catch (t) {
            return {
                success: !1,
                message: t.message || "Error occurred during Google Tasks sync."
            }
        }
    }
    async getOrCreateTaskList(n) {
        const o = (await (await fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
            headers: {
                Authorization: `Bearer ${n}`
            }
        })).json()).items ?.find(e => e.title === "IsotopeAI");
        return o ? o.id : (await (await fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${n}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "IsotopeAI"
            })
        })).json()).id
    }
}
export {
    G as GoogleCalendarWorker, j as GoogleTasksWorker, u as TaskWorker, x as syncEngine, E as taskController
};