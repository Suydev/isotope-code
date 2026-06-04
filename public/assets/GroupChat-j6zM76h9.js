import {
    r as d,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as P,
    h as R,
    j as z,
    s as g,
    U as E,
    o as T,
    t as D,
    q as G,
    w as A,
    S as H,
    x as O
} from "./App-pJGjDiPw.js";
import {
    G as k,
    C
} from "./groupCache-DVHvdGlY.js";
import {
    g as $
} from "./demoCommunity-DUJ4Y1zo.js";
import {
    bf as F,
    I as K,
    S as U,
    aR as L
} from "./vendor-icons-CqruUz7g.js";
import {
    A as Y,
    m as M
} from "./vendor-motion-Cp_NPzpZ.js";

function q(s, x = {}) {
    const {
        enabled: _ = !0
    } = x, {
        userId: c
    } = P(), {
        profile: i,
        fetchProfile: f
    } = R(), [h, u] = d.useState([]), o = d.useRef(new Set), b = d.useRef(null);
    d.useEffect(() => {
        if (!s) {
            u([]), o.current.clear();
            return
        }
        if (z()) {
            const a = $().messagesByGroup[s] || [];
            a.forEach(n => o.current.add(n.id)), u(a);
            return
        }
        const t = k.get(C.GROUP_CHAT(s)) || [];
        t.forEach(a => o.current.add(a.id)), u(t)
    }, [s]), d.useEffect(() => {
        z() || !s || h.length === 0 || k.set(C.GROUP_CHAT(s), h.slice(-50), "midnight")
    }, [s, h]), d.useEffect(() => {
        if (z() || !g || !s || !_) return;
        (async () => {
            const n = k.get(C.GROUP_CHAT(s));
            if (n && n.length > 0) return;
            const {
                data: l,
                error: p
            } = await g.from("group_chat_messages").select(`
          id,
          content,
          created_at,
          user_id
        `).eq("group_id", s).order("created_at", {
                ascending: !1
            }).limit(50);
            if (p) {
                console.error("Error fetching messages:", p);
                return
            }
            const w = [...l].reverse(),
                y = [...new Set(w.map(r => r.user_id))],
                j = await E.getMultiple(y),
                m = w.map(r => {
                    const N = j.get(r.user_id);
                    return {
                        id: r.id,
                        user_id: r.user_id,
                        user_name: N ?.name || "Student",
                        avatar_url: N ?.avatarUrl,
                        text: r.content,
                        timestamp: r.created_at,
                        is_cheer: r.content.includes("cheered for")
                    }
                });
            m.forEach(r => o.current.add(r.id)), u(m)
        })();
        const a = g.channel(`chat:${s}`, {
            config: {
                broadcast: {
                    self: !1
                }
            }
        }).on("broadcast", {
            event: "message"
        }, ({
            payload: n
        }) => {
            const l = n;
            !l ?.id || o.current.has(l.id) || (o.current.add(l.id), E.updateFromPayload(l.user_id, l.user_name, l.avatar_url), u(p => [...p, { ...l,
                is_optimistic: !1
            }].slice(-50)))
        }).subscribe();
        return b.current = a, () => {
            b.current = null, g.removeChannel(a), o.current.clear()
        }
    }, [_, s]), d.useEffect(() => {
        c && !i && f()
    }, [c, i, f]);
    const v = d.useCallback(async t => {
            if (z()) {
                if (!c || !s) return;
                const m = T(t, "chatMessage", "cloud");
                if (!m) throw new Error("Message cannot be empty.");
                const r = {
                    id: crypto.randomUUID(),
                    user_id: c,
                    user_name: D(i, "You"),
                    avatar_url: i ?.avatar || i ?.avatar_url,
                    text: m,
                    timestamp: new Date().toISOString()
                };
                u(N => [...N, r].slice(-50));
                return
            }
            if (!c || !s || !g) return;
            const a = T(t, "chatMessage", "cloud");
            if (!a) throw new Error("Message cannot be empty.");
            G(a, "Message");
            const n = crypto.randomUUID(),
                l = new Date().toISOString(),
                p = D(i, "You"),
                w = i ?.avatar || i ?.avatar_url,
                y = {
                    id: n,
                    user_id: c,
                    user_name: p,
                    avatar_url: w,
                    text: a,
                    timestamp: l,
                    is_optimistic: !0
                };
            o.current.add(n), u(m => [...m, y].slice(-50));
            const {
                error: j
            } = await g.from("group_chat_messages").insert({
                id: n,
                group_id: s,
                user_id: c,
                content: a
            });
            if (j) {
                console.error("Failed to send message:", j), o.current.delete(n), u(m => m.filter(r => r.id !== n));
                return
            }
            u(m => m.map(r => r.id === n ? { ...r,
                is_optimistic: !1,
                timestamp: l,
                is_cheer: a.includes("cheered for")
            } : r)), await b.current ?.send({
                type: "broadcast",
                event: "message",
                payload: { ...y,
                    is_optimistic: !1,
                    is_cheer: a.includes("cheered for")
                }
            })
        }, [c, s, i]),
        S = d.useCallback(async (t, a) => {
            if (!c || !s || !i) return;
            const n = `cheered for ${a}! 🎉`;
            v(n)
        }, [v, c, s, i]);
    return {
        messages: h,
        sendMessage: v,
        sendCheer: S
    }
}
const Z = ({
    groupId: s
}) => {
    const [x, _] = d.useState(""), [c, i] = d.useState(null), f = d.useRef(null), {
        messages: h,
        sendMessage: u
    } = q(s), o = A(x, "chatMessage");
    if (d.useEffect(() => {
            f.current && f.current.scrollTo({
                top: f.current.scrollHeight,
                behavior: "smooth"
            })
        }, [h]), !s) return null;
    const b = async () => {
            if (x.trim()) try {
                await u(x.trim()), _(""), i(null)
            } catch (t) {
                i(t instanceof Error ? t.message : "Message could not be sent.")
            }
        },
        v = t => {
            t.key === "Enter" && !t.shiftKey && (t.preventDefault(), b())
        },
        S = t => {
            const a = new Date(t),
                n = new Date;
            return a.toDateString() === n.toDateString() ? a.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }) : a.toLocaleDateString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
        };
    return e.jsxs("div", {
        className: "flex flex-col h-full bg-white dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/5 overflow-hidden",
        children: [e.jsx("div", {
            className: "p-4 border-b border-zinc-100 dark:border-white/5",
            children: e.jsxs("div", {
                className: "flex items-center justify-between",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [e.jsx("div", {
                        className: "p-1.5 rounded-lg bg-brand-500/10 dark:bg-brand-500/20",
                        children: e.jsx(F, {
                            className: "w-4 h-4 text-brand-600 dark:text-brand-400"
                        })
                    }), e.jsx("h3", {
                        className: "text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider",
                        children: "Group Chat"
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-1.5 text-[10px] text-zinc-500",
                    children: [e.jsx(K, {
                        className: "w-3 h-3"
                    }), "History saved"]
                })]
            })
        }), e.jsx("div", {
            ref: f,
            className: "flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar",
            children: h.length === 0 ? e.jsxs("div", {
                className: "flex flex-col items-center justify-center h-full text-center py-8",
                children: [e.jsx(U, {
                    className: "w-8 h-8 text-zinc-700 mb-3"
                }), e.jsx("p", {
                    className: "text-sm text-zinc-500",
                    children: "No messages yet"
                }), e.jsx("p", {
                    className: "text-xs text-zinc-600 mt-1",
                    children: "Be the first to say hello!"
                })]
            }) : e.jsx(Y, {
                initial: !1,
                children: h.map(t => e.jsx(M.div, {
                    initial: {
                        opacity: 0,
                        y: 10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    className: `flex gap-3 ${t.is_cheer||t.is_system?"justify-center":""}`,
                    children: t.is_system ? e.jsxs("div", {
                        className: "px-4 py-2 bg-zinc-100 dark:bg-white/5 rounded-full text-xs text-zinc-500 flex items-center gap-2",
                        children: [e.jsx(U, {
                            className: "w-3 h-3 text-brand-500 dark:text-brand-400"
                        }), t.text]
                    }) : t.is_cheer ? e.jsxs(M.div, {
                        initial: {
                            scale: .8
                        },
                        animate: {
                            scale: 1
                        },
                        className: "px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full text-xs text-amber-300 font-medium",
                        children: ["🎉 ", e.jsx("span", {
                            className: "font-bold",
                            children: t.user_name
                        }), " ", t.text]
                    }) : e.jsxs(e.Fragment, {
                        children: [e.jsx("div", {
                            className: "w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0",
                            children: e.jsx("img", {
                                src: t.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.user_id}`,
                                alt: t.user_name,
                                className: "w-full h-full object-cover"
                            })
                        }), e.jsxs("div", {
                            className: "flex-1 min-w-0",
                            children: [e.jsxs("div", {
                                className: "flex items-baseline gap-2 mb-1",
                                children: [e.jsx("span", {
                                    className: "text-xs font-bold text-zinc-900 dark:text-white truncate",
                                    children: t.user_name
                                }), e.jsx("span", {
                                    className: "text-[10px] text-zinc-600",
                                    children: S(t.timestamp)
                                })]
                            }), e.jsx("div", {
                                className: "p-3 bg-zinc-50 dark:bg-white/5 rounded-2xl rounded-tl-md border border-zinc-100 dark:border-white/5 text-sm text-zinc-700 dark:text-zinc-300 break-words",
                                children: t.text
                            })]
                        })]
                    })
                }, t.id))
            })
        }), e.jsxs("div", {
            className: "p-3 border-t border-zinc-100 dark:border-white/5",
            children: [e.jsxs("div", {
                className: "relative flex items-center gap-2",
                children: [e.jsx("input", {
                    type: "text",
                    value: x,
                    onChange: t => {
                        _(t.target.value), c && i(null)
                    },
                    onKeyDown: v,
                    placeholder: "Type a message...",
                    className: "flex-1 px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                }), e.jsx(M.button, {
                    whileHover: {
                        scale: 1.05
                    },
                    whileTap: {
                        scale: .95
                    },
                    onClick: () => void b(),
                    disabled: !x.trim(),
                    className: "p-3 bg-brand-600 hover:bg-brand-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-colors",
                    children: e.jsx(L, {
                        className: "w-4 h-4"
                    })
                })]
            }), o ? e.jsx("p", {
                className: `mt-2 text-xs ${o.tone==="danger"?"text-amber-500":"text-zinc-500"}`,
                children: o.message
            }) : e.jsxs("p", {
                className: "mt-2 text-xs text-zinc-500",
                children: [x.length, "/", H.chatMessage.maxChars, " local chars. First", " ", O("chatMessage", "cloud"), " sync to cloud."]
            }), c ? e.jsx("p", {
                className: "mt-2 text-xs text-red-500",
                children: c
            }) : null]
        })]
    })
};
export {
    Z as G, q as u
};