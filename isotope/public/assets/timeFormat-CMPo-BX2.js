const $ = (t, r) => Math.round(r === "hours" ? t * 3600 : r === "minutes" ? t * 60 : t),
    i = t => Math.max(0, t),
    s = (t, r) => `${t} ${r}${t===1?"":"s"}`,
    f = (t, r = "minutes", o = !0) => {
        const n = i($(t, r)),
            c = Math.floor(n / 3600),
            a = Math.floor(n % 86400 / 3600),
            u = Math.floor(n % 3600 / 60),
            e = n % 60;
        if (n >= 86400) return `${c}h ${u}m`;
        if (n >= 3600) return o ? `${a}h ${u}m ${e}s` : `${a}h ${u}m`;
        if (n >= 60) {
            const h = Math.floor(n / 60);
            return o ? `${h}m ${e}s` : `${h}m`
        }
        return `${e}s`
    },
    m = (t, r = "minutes") => {
        const o = i($(t, r)),
            n = Math.floor(o / 3600),
            c = Math.floor(o % 86400 / 3600),
            a = Math.floor(o % 3600 / 60),
            u = o % 60;
        if (o >= 86400) return `${s(n,"hour")} ${s(a,"minute")}`;
        if (o >= 3600) return `${s(c,"hour")} ${s(a,"minute")} ${s(u,"second")}`;
        if (o >= 60) {
            const e = Math.floor(o / 60);
            return `${s(e,"minute")} ${s(u,"second")}`
        }
        return s(u, "second")
    },
    l = t => f(t, "hours"),
    M = t => {
        const r = i(Math.round(t)),
            o = Math.floor(r / 60),
            n = r % 60;
        return `${o}:${n.toString().padStart(2,"0")}`
    };
export {
    f as a, m as b, M as c, l as f
};