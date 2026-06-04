const d = f => Object.entries(f || {}).filter(([n, c]) => !!n && typeof c == "number" && c > 0),
    p = (f, n) => {
        if (n.length === 0 || f <= 0) return [];
        const c = Math.floor(f / n.length),
            h = f - c * n.length;
        return n.map((u, l) => [u, c + (l === 0 ? h : 0)])
    },
    s = (f, n) => {
        const c = {
                bySubject: {},
                byChapter: {},
                byTopic: {}
            },
            h = new Set(n.map(t => t.id)),
            u = new Map(n.map(t => [t.name.toLowerCase(), t.id])),
            l = new Map,
            i = new Map;
        n.forEach(t => {
            (t.chapters || []).forEach(e => {
                l.set(e.id, t.id), (e.topics || []).forEach(a => {
                    i.set(a.id, {
                        chapterId: e.id,
                        subjectId: t.id
                    })
                })
            })
        });
        const b = (t, e) => {
                !t || e <= 0 || (c.bySubject[t] = (c.bySubject[t] || 0) + e)
            },
            y = (t, e) => {
                const a = l.get(t);
                !t || !a || e <= 0 || (c.byChapter[t] = (c.byChapter[t] || 0) + e, b(a, e))
            },
            E = (t, e) => {
                const a = i.get(t);
                !t || !a || e <= 0 || (c.byTopic[t] = (c.byTopic[t] || 0) + e, c.byChapter[a.chapterId] = (c.byChapter[a.chapterId] || 0) + e, b(a.subjectId, e))
            },
            m = t => {
                if (t.subjectIds ?.length) {
                    const e = Array.from(new Set(t.subjectIds.filter(a => h.has(a))));
                    if (e.length > 0) return e
                }
                if (t.subjectId && h.has(t.subjectId)) return [t.subjectId];
                if (t.subject) {
                    const e = u.get(t.subject.toLowerCase());
                    if (e) return [e]
                }
                return []
            };
        return f.filter(t => !t.deletedAt && t.completed !== !1 && t.duration > 0).forEach(t => {
            const e = d(t.timeAllocation ?.byTopic).filter(([r]) => i.has(r));
            if (e.length > 0) {
                e.forEach(([r, o]) => E(r, o));
                return
            }
            const a = p(t.duration, Array.from(new Set((t.topicIds || []).filter(r => i.has(r)))));
            if (a.length > 0) {
                a.forEach(([r, o]) => E(r, o));
                return
            }
            const j = d(t.timeAllocation ?.byChapter).filter(([r]) => l.has(r));
            if (j.length > 0) {
                j.forEach(([r, o]) => y(r, o));
                return
            }
            const g = p(t.duration, Array.from(new Set((t.chapterIds || []).filter(r => l.has(r)))));
            if (g.length > 0) {
                g.forEach(([r, o]) => y(r, o));
                return
            }
            const S = d(t.timeAllocation ?.bySubject).filter(([r]) => h.has(r));
            if (S.length > 0) {
                S.forEach(([r, o]) => b(r, o));
                return
            }
            p(t.duration, m(t)).forEach(([r, o]) => b(r, o))
        }), c
    };
export {
    s as b
};