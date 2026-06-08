const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/index-B45N-99N.js", "assets/App-pJGjDiPw.js", "assets/index-BPYJFSVW.js", "assets/vendor-react-BfU3Zn2J.js", "assets/index-CrO6t5EW.css", "assets/vendor-supabase-DAiUAuun.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/vendor-icons-CqruUz7g.js", "assets/vendor-router-CmoTwRnm.js", "assets/TaskController-BUyiMYKC.js", "assets/useAIStore-B2cv1FZz.js", "assets/useFocusStore-CX_Nyp1h.js", "assets/useNotificationStore-BS4df28T.js", "assets/endOfDay-CZDDeNMb.js"]))) => i.map(i => d[i]);
import {
    _ as c
} from "./index-BPYJFSVW.js";
import {
    d,
    u,
    h as S
} from "./App-pJGjDiPw.js";
import {
    u as g,
    j as m,
    h as f,
    k as h
} from "./useFocusStore-CX_Nyp1h.js";
import {
    a as p,
    b as y
} from "./useAIStore-B2cv1FZz.js";
let i = null;
const n = async () => (i || (i = c(() =>
        import ("./index-B45N-99N.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])).then(e => e.syncEngine)), i),
    l = async () => {
        await Promise.all([S.getState().refreshFromStorage(), g.getState().refreshFromStorage(), m.getState().refreshFromStorage(), f.getState().refreshFromStorage(), p.getState().refreshFromStorage(), h.getState().refreshFromStorage(), y.getState().refreshFromStorage()])
    },
    w = d(e => ({
        status: "idle",
        lastSyncAt: null,
        error: null,
        needsCloudBootstrap: !1,
        bootstrapChecked: !1,
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
        },
        subscribe: () => {
            let t = () => {};
            return n().then(r => {
                t = r.subscribe(s => {
                    e({
                        status: s.status,
                        lastSyncAt: s.lastSyncAt,
                        error: s.error,
                        collectionStatus: s.collectionStatus
                    })
                })
            }), () => t()
        },
        triggerSync: async () => {
            const t = u.getState(),
                {
                    userId: r,
                    isAuthenticated: s
                } = t,
                a = t.isPremium();
            if (!s || !r || !a) return;
            const o = await n();
            await o.fullManualSync(r, a), await l(), o.getState().status === "success" && e({
                needsCloudBootstrap: !1,
                bootstrapChecked: !0
            })
        },
        downloadCloudSnapshot: async () => {
            const t = u.getState(),
                {
                    userId: r,
                    isAuthenticated: s
                } = t,
                a = t.isPremium();
            if (!s || !r || !a) return;
            const o = await n();
            await o.downloadCloudSnapshot(r, a), await l(), o.getState().status === "success" && e({
                needsCloudBootstrap: !1,
                bootstrapChecked: !0
            })
        },
        markBootstrapPending: () => e({
            needsCloudBootstrap: !1,
            bootstrapChecked: !1
        }),
        setBootstrapState: t => e({
            needsCloudBootstrap: t,
            bootstrapChecked: !0
        }),
        clearDegradedStatus: () => e(t => t.status === "degraded" ? {
            status: "idle",
            error: null
        } : {})
    }));
export {
    n as g, w as u
};