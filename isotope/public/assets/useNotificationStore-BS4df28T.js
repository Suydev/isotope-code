const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/messaging-BP0KfJxy.js", "assets/App-pJGjDiPw.js", "assets/index-BPYJFSVW.js", "assets/vendor-react-BfU3Zn2J.js", "assets/index-CrO6t5EW.css", "assets/vendor-supabase-DAiUAuun.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/vendor-icons-CqruUz7g.js", "assets/vendor-router-CmoTwRnm.js"]))) => i.map(i => d[i]);
import {
    _ as p
} from "./index-BPYJFSVW.js";
import {
    d as l,
    p as N,
    e as m,
    f as b
} from "./App-pJGjDiPw.js";
const f = "/icons/icon-192x192.svg",
    u = "/icons/icon-96x96.svg";
var g = (r => (r.STUDY_REMINDER = "study_reminder", r.FOCUS_SESSION = "focus_session", r.HABIT_REMINDER = "habit_reminder", r.TASK_DEADLINE = "task_deadline", r.ACHIEVEMENT = "achievement", r.SYSTEM = "system", r))(g || {});
const A = {
        enabled: !0,
        categories: {
            study_reminder: {
                enabled: !0,
                sound: !0,
                vibrate: !0
            },
            focus_session: {
                enabled: !0,
                sound: !0,
                vibrate: !1
            },
            habit_reminder: {
                enabled: !0,
                sound: !0,
                vibrate: !0
            },
            task_deadline: {
                enabled: !0,
                sound: !0,
                vibrate: !0
            },
            achievement: {
                enabled: !0,
                sound: !1,
                vibrate: !1
            },
            system: {
                enabled: !0,
                sound: !1,
                vibrate: !1
            }
        },
        doNotDisturb: {
            enabled: !1,
            startTime: "22:00",
            endTime: "08:00"
        },
        frequency: "all"
    },
    D = l()(N((r, c) => ({
        permission: typeof Notification < "u" ? Notification.permission : "default",
        preferences: A,
        scheduledNotifications: [],
        inAppNotifications: [],
        requestPermission: async () => {
            if (typeof Notification > "u") return console.warn("Notifications not supported"), !1;
            if (Notification.permission === "granted") return r({
                permission: "granted"
            }), !0;
            if (Notification.permission === "denied") return !1;
            try {
                const e = await Notification.requestPermission();
                return r({
                    permission: e
                }), e === "granted" ? (r(i => ({
                    preferences: { ...i.preferences,
                        enabled: !0
                    }
                })), p(async () => {
                    const {
                        ensureMessagingToken: i
                    } = await
                    import ("./messaging-BP0KfJxy.js");
                    return {
                        ensureMessagingToken: i
                    }
                }, __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8])).then(({
                    ensureMessagingToken: i
                }) => i()).catch(i => {
                    console.error("[NotificationStore] Failed to register browser notification token:", i)
                }), !0) : !1
            } catch (e) {
                return console.error("Error requesting notification permission:", e), !1
            }
        },
        updatePreferences: e => {
            r(i => ({
                preferences: { ...i.preferences,
                    ...e
                }
            }))
        },
        updateCategoryPreference: (e, i) => {
            r(t => ({
                preferences: { ...t.preferences,
                    categories: { ...t.preferences.categories,
                        [e]: { ...t.preferences.categories[e],
                            enabled: i
                        }
                    }
                }
            }))
        },
        scheduleNotification: e => {
            const i = `notif-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
                t = { ...e,
                    id: i
                };
            r(n => ({
                scheduledNotifications: [...n.scheduledNotifications, t]
            }));
            const o = new Date,
                s = new Date(e.scheduledFor).getTime() - o.getTime();
            return s > 0 && setTimeout(() => {
                const n = c();
                n.sendNotification(e.category, e.title, {
                    body: e.body,
                    icon: e.icon || f,
                    badge: e.badge || u,
                    tag: e.tag,
                    requireInteraction: e.requireInteraction,
                    data: e.data
                }), n.cancelNotification(i)
            }, s), i
        },
        cancelNotification: e => {
            r(i => ({
                scheduledNotifications: i.scheduledNotifications.filter(t => t.id !== e)
            }))
        },
        sendNotification: async (e, i, t = {}) => {
            const a = {
                id: `notif-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
                category: e,
                title: i,
                body: t.body || "",
                timestamp: new Date().toISOString(),
                read: !1,
                data: t.data
            };
            r(n => ({
                inAppNotifications: [a, ...n.inAppNotifications].slice(0, 50)
            }));
            const s = c();
            if (s.preferences.enabled && s.preferences.categories[e] ?.enabled && !(s.isInDoNotDisturb() && e !== "system") && !(s.preferences.frequency === "important" && ["achievement", "system"].includes(e)) && !(s.preferences.frequency === "critical" && e !== "task_deadline") && s.permission === "granted") try {
                const n = s.preferences.categories[e],
                    d = { ...t,
                        icon: t.icon || f,
                        badge: t.badge || u,
                        vibrate: n.vibrate ? [200, 100, 200] : void 0,
                        silent: !n.sound,
                        data: { ...t.data,
                            category: e,
                            url: t.data ?.url || window.location.origin
                        }
                    };
                "serviceWorker" in navigator && navigator.serviceWorker.controller ? await (await navigator.serviceWorker.ready).showNotification(i, d) : typeof Notification < "u" && new Notification(i, d)
            } catch (n) {
                console.error("Error sending notification:", n)
            }
        },
        isInDoNotDisturb: () => {
            const e = c();
            if (!e.preferences.doNotDisturb.enabled) return !1;
            const i = new Date,
                t = `${i.getHours().toString().padStart(2,"0")}:${i.getMinutes().toString().padStart(2,"0")}`,
                {
                    startTime: o,
                    endTime: a
                } = e.preferences.doNotDisturb;
            return o > a ? t >= o || t <= a : t >= o && t <= a
        },
        markAsRead: e => {
            r(i => ({
                inAppNotifications: i.inAppNotifications.map(t => t.id === e ? { ...t,
                    read: !0
                } : t)
            }))
        },
        markAllAsRead: () => {
            r(e => ({
                inAppNotifications: e.inAppNotifications.map(i => ({ ...i,
                    read: !0
                }))
            }))
        },
        clearNotification: e => {
            r(i => ({
                inAppNotifications: i.inAppNotifications.filter(t => t.id !== e)
            }))
        },
        clearAll: () => {
            r({
                inAppNotifications: []
            })
        }
    }), {
        name: "isotope-notifications",
        storage: m(() => b),
        partialize: r => ({
            preferences: r.preferences,
            scheduledNotifications: r.scheduledNotifications,
            inAppNotifications: r.inAppNotifications
        })
    }));
export {
    g as N, D as u
};