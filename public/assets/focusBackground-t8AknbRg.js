import {
    k as e
} from "./App-pJGjDiPw.js";
const o = "focus-bg-image",
    n = "focus-bg-blur",
    s = 0,
    c = 24,
    a = t => typeof t != "number" || Number.isNaN(t) ? s : Math.min(c, Math.max(0, Math.round(t))),
    u = t => {
        const r = t ?.trim();
        return r && /^https?:\/\/.+/i.test(r) ? r : null
    },
    i = async () => {
        const [t, r] = await Promise.all([e.getItem(o), e.getItem(n)]), m = r ? Number(r) : s;
        return {
            imageUrl: u(t),
            blurAmount: a(m)
        }
    },
    g = async t => {
        const r = {
            imageUrl: u(t.imageUrl),
            blurAmount: a(t.blurAmount)
        };
        return await Promise.all([r.imageUrl ? e.setItem(o, r.imageUrl) : e.removeItem(o), e.setItem(n, String(r.blurAmount))]), r
    },
    U = async () => {
        await e.removeItem(o)
    };
export {
    s as D, g as a, U as c, i as g, u as s
};