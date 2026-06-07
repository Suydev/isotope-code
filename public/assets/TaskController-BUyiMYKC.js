import {
    k as c,
    h as l,
    s as f
} from "./App-pJGjDiPw.js";
import {
    i as u
} from "./useAIStore-B2cv1FZz.js";
import {
    f as d,
    g as y
} from "./useFocusStore-CX_Nyp1h.js";
class h {
    constructor() {
        this.workers = [], this.isRunning = !1
    }
    registerWorker(t) {
        this.workers.find(e => e.id === t.id) || this.workers.push(t)
    }
    async init(t, e) {
        if (!e || !t || t.startsWith("local-") || !u()) return;
        const r = new Date;
        if (r.getHours() < 8) return;
        const s = `last_premium_sync_${t}`,
            o = await c.getItem(s),
            n = d(l.getState().profile ?.studyPreferences),
            i = y(r, n);
        o !== i && await this.runAll(t, i, s)
    }
    async runManual(t, e) {
        if (!e || !t || t.startsWith("local-") || !u()) return;
        const r = d(l.getState().profile ?.studyPreferences),
            a = y(new Date, r),
            s = `last_premium_sync_${t}`;
        await this.runAll(t, a, s)
    }
    async runAll(t, e, r) {
        if (this.isRunning) return {
            succeeded: 0,
            failed: 0
        };
        this.isRunning = !0;
        try {
            if (!f) return {
                succeeded: 0,
                failed: 0
            };
            const {
                data: {
                    session: a
                }
            } = await f.auth.getSession(), s = a ?.provider_token;
            if (!s) return {
                succeeded: 0,
                failed: 0
            };
            let o = 0,
                n = 0;
            for (const i of this.workers)
                if (i.isEnabled()) try {
                    if (!(await i.run(t, s)).success) {
                        n++;
                        continue
                    }
                    o++
                } catch {
                    n++
                }
            return n === 0 && await c.setItem(r, e), {
                succeeded: o,
                failed: n
            }
        } catch {
            return {
                succeeded: 0,
                failed: this.workers.length
            }
        } finally {
            this.isRunning = !1
        }
    }
}
const S = new h;
export {
    S as t
};