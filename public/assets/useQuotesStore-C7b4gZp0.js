import {
    d as h,
    p as c,
    e as l,
    f as g,
    g as u
} from "./App-pJGjDiPw.js";
const s = () => new Date().toISOString(),
    d = [{
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    }, {
        text: "Focus is not saying yes. It is saying no to the hundred other good ideas.",
        author: "Steve Jobs"
    }, {
        text: "Discipline is choosing between what you want now and what you want most.",
        author: "Abraham Lincoln"
    }, {
        text: "Success is the sum of small efforts, repeated day in and day out.",
        author: "Robert Collier"
    }, {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    }, {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    }, {
        text: "Quality is not an act, it is a habit.",
        author: "Aristotle"
    }, {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    }, {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    }, {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    }],
    y = h()(c((i, n) => ({
        quotes: [],
        isLoading: !1,
        addQuote: (e, o, t = 1) => {
            const a = {
                id: u(),
                text: e.trim(),
                author: o.trim() || "Unknown",
                priority: Math.max(1, Math.min(10, t)),
                isActive: !0,
                createdAt: s(),
                updatedAt: s()
            };
            i(r => ({
                quotes: [...r.quotes, a]
            }))
        },
        updateQuote: (e, o) => {
            i(t => ({
                quotes: t.quotes.map(a => a.id === e ? { ...a,
                    ...o,
                    updatedAt: s()
                } : a)
            }))
        },
        deleteQuote: e => {
            i(o => ({
                quotes: o.quotes.filter(t => t.id !== e)
            }))
        },
        toggleQuoteActive: e => {
            i(o => ({
                quotes: o.quotes.map(t => t.id === e ? { ...t,
                    isActive: !t.isActive,
                    updatedAt: s()
                } : t)
            }))
        },
        setQuotePriority: (e, o) => {
            i(t => ({
                quotes: t.quotes.map(a => a.id === e ? { ...a,
                    priority: Math.max(1, Math.min(10, o)),
                    updatedAt: s()
                } : a)
            }))
        },
        getActiveQuotes: () => n().quotes.filter(e => e.isActive),
        getRandomQuote: () => {
            const e = n().getActiveQuotes();
            if (e.length === 0) return null;
            const o = e.reduce((a, r) => a + r.priority, 0);
            let t = Math.random() * o;
            for (const a of e)
                if (t -= a.priority, t <= 0) return a;
            return e[0]
        },
        getDailyQuote: () => {
            const e = n().getActiveQuotes();
            if (e.length === 0) return null;
            const o = new Date,
                t = new Date(o.getFullYear(), 0, 0),
                r = Math.floor((o.getTime() - t.getTime()) / (1e3 * 60 * 60 * 24)) % e.length;
            return e[r]
        },
        importDefaultQuotes: () => {
            const e = new Set(n().quotes.map(t => t.text.toLowerCase())),
                o = [];
            d.forEach(({
                text: t,
                author: a
            }) => {
                e.has(t.toLowerCase()) || o.push({
                    id: u(),
                    text: t,
                    author: a,
                    priority: 1,
                    isActive: !0,
                    createdAt: s(),
                    updatedAt: s()
                })
            }), o.length > 0 && i(t => ({
                quotes: [...t.quotes, ...o]
            }))
        },
        resetToDefaults: () => {
            const e = d.map(({
                text: o,
                author: t
            }) => ({
                id: u(),
                text: o,
                author: t,
                priority: 1,
                isActive: !0,
                createdAt: s(),
                updatedAt: s()
            }));
            i({
                quotes: e
            })
        }
    }), {
        name: "isotope-quotes",
        version: 1,
        storage: l(() => g)
    }));
export {
    y as u
};