import {
    r as n,
    f as F,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as L
} from "./useFocusStore-CX_Nyp1h.js";
import {
    D as j,
    b as O
} from "./subjectBranding-DaDo_h8r.js";
import {
    S as H
} from "./SubjectIcon-CyCDqtel.js";
import {
    A as D,
    m as z
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    S as U,
    X as q,
    a7 as A,
    d as B,
    ab as G,
    ac as J
} from "./vendor-icons-CqruUz7g.js";
const I = [{
        name: "Academic",
        emojis: ["📚", "📖", "📝", "✏️", "🧠", "💡", "🎓", "🏫", "🏛️", "⚖️", "📜", "🎒"]
    }, {
        name: "Science & Tech",
        emojis: ["🧪", "🧬", "🔬", "🔭", "🌍", "💻", "⌨️", "🖱️", "📡", "🚀", "🛰️", "🤖", "⚙️", "🔋"]
    }, {
        name: "Math & Numbers",
        emojis: ["📐", "🔢", "➕", "➖", "✖️", "➗", "♾️", "📉", "📈", "📊", "📋", "🧮"]
    }, {
        name: "Arts & Music",
        emojis: ["🎨", "🎭", "🎬", "🎤", "🎧", "🎸", "🎹", "🎷", "🎻", "🎺", "🥁", "📸"]
    }, {
        name: "Sports & Health",
        emojis: ["🏃", "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🎯", "🏆", "🧘", "🍎", "💧"]
    }, {
        name: "Cosmos",
        emojis: ["🌟", "🔥", "⚡", "🌈", "☀️", "🌙", "⭐", "🍀", "☕", "🔔", "⏳", "⌛", "⏰", "⌚", "🗺️", "🧭", "🚩", "💎"]
    }],
    $ = I.flatMap(c => c.emojis),
    u = [{
        name: "Emerald",
        color: "text-emerald-500",
        gradient: "from-emerald-500 to-teal-600",
        glow: "rgba(16, 185, 129, 0.2)"
    }, {
        name: "Blue",
        color: "text-blue-500",
        gradient: "from-blue-500 to-indigo-600",
        glow: "rgba(59, 130, 246, 0.2)"
    }, {
        name: "Purple",
        color: "text-violet-500",
        gradient: "from-violet-500 to-purple-600",
        glow: "rgba(139, 92, 246, 0.22)"
    }, {
        name: "Amber",
        color: "text-amber-500",
        gradient: "from-amber-500 to-orange-600",
        glow: "rgba(245, 158, 11, 0.2)"
    }, {
        name: "Rose",
        color: "text-rose-500",
        gradient: "from-rose-500 to-pink-600",
        glow: "rgba(244, 63, 94, 0.2)"
    }, {
        name: "Cyan",
        color: "text-cyan-500",
        gradient: "from-cyan-500 to-blue-600",
        glow: "rgba(6, 182, 212, 0.2)"
    }, {
        name: "Lime",
        color: "text-lime-500",
        gradient: "from-lime-500 to-green-600",
        glow: "rgba(132, 204, 22, 0.2)"
    }, {
        name: "Indigo",
        color: "text-indigo-500",
        gradient: "from-indigo-500 to-blue-600",
        glow: "rgba(99, 102, 241, 0.2)"
    }],
    Z = ({
        isOpen: c,
        onClose: d,
        subjectToEdit: a,
        onSave: v,
        onDelete: N
    }) => {
        const {
            addSubject: _,
            updateSubject: y,
            deleteSubject: R
        } = L(), [S, C] = n.useState(!1), [k, p] = n.useState({}), [o, f] = n.useState(""), [h, w] = n.useState($[0]), [i, b] = n.useState(u[0]), [l, g] = n.useState(j), [s, x] = n.useState(!1);
        F.useEffect(() => {
            if (c && a) {
                f(a.name), w(a.icon);
                const t = u.find(r => r.color === a.color);
                if (t) b(t), x(!1);
                else {
                    const m = a.color.match(/#(?:[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/) ?.[0] ?? j;
                    g(m), x(!0), b({
                        name: "Custom",
                        color: a.color,
                        gradient: a.gradient,
                        glow: "rgba(59, 130, 246, 0.2)"
                    })
                }
            } else c && !a && (f(""), w($[0]), b(u[0]), x(!1), g(j), p({}))
        }, [c, a]);
        const M = () => {
                const t = {};
                return o.trim() || (t.name = "Subject name is required"), o.trim().length < 2 && (t.name = "Too short"), p(t), Object.keys(t).length === 0
            },
            P = async t => {
                if (t.preventDefault(), !!M()) {
                    C(!0);
                    try {
                        const r = {
                            name: o.trim(),
                            icon: h,
                            color: s ? l : i.color,
                            gradient: s ? O(l) : i.gradient
                        };
                        if (v) {
                            v({
                                id: a ?.id,
                                ...r
                            }), d();
                            return
                        }
                        if (a) await y(a.id, r);
                        else {
                            const m = await _(o.trim(), h);
                            m && await y(m.id, {
                                color: r.color,
                                gradient: r.gradient
                            })
                        }
                        d()
                    } catch (r) {
                        console.error("Failed to save subject:", r), p({
                            submit: "Failed to save."
                        })
                    } finally {
                        C(!1)
                    }
                }
            };
        return e.jsx(D, {
            children: c && e.jsxs("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
                children: [e.jsx(z.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "absolute inset-0 bg-black/80 backdrop-blur-md",
                    onClick: d
                }), e.jsxs(z.div, {
                    initial: {
                        opacity: 0,
                        scale: .95,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: .95,
                        y: 20
                    },
                    className: "relative w-full max-w-2xl bg-[#0e0e11] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20",
                                children: e.jsx(U, {
                                    className: "w-5 h-5 text-indigo-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h2", {
                                    className: "text-xl font-bold text-white",
                                    children: a ? "Refine Subject" : "Architect Subject"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500",
                                    children: "Organize your knowledge base"
                                })]
                            })]
                        }), e.jsx("button", {
                            onClick: d,
                            className: "p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors",
                            children: e.jsx(q, {
                                className: "w-5 h-5"
                            })
                        })]
                    }), e.jsxs("div", {
                        className: "flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8",
                        children: [e.jsxs("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                            children: [e.jsxs("div", {
                                className: "space-y-4",
                                children: [e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [e.jsx("label", {
                                        className: "text-xs font-bold text-zinc-500 uppercase tracking-wider",
                                        children: "Subject Name"
                                    }), e.jsx("input", {
                                        type: "text",
                                        value: o,
                                        onChange: t => f(t.target.value),
                                        placeholder: "e.g. Physics",
                                        className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-lg font-bold",
                                        autoFocus: !0
                                    }), k.name && e.jsx("p", {
                                        className: "text-red-500 text-xs",
                                        children: k.name
                                    })]
                                }), e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [e.jsx("label", {
                                        className: "text-xs font-bold text-zinc-500 uppercase tracking-wider",
                                        children: "Appearance"
                                    }), e.jsxs("div", {
                                        className: "p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4",
                                        children: [e.jsx("div", {
                                            className: `w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all ${s?"":`bg-gradient-to-br ${i.gradient}`}`,
                                            style: {
                                                background: s ? l : void 0,
                                                boxShadow: s ? `0 10px 20px ${l}40` : `0 10px 20px ${i.glow}`
                                            },
                                            children: e.jsx(H, {
                                                icon: h,
                                                name: o,
                                                className: "w-10 h-10 text-white"
                                            })
                                        }), e.jsxs("div", {
                                            children: [e.jsx("div", {
                                                className: "text-sm font-bold text-zinc-400",
                                                children: "Preview"
                                            }), e.jsx("div", {
                                                className: `text-lg font-bold ${s?"":`bg-gradient-to-r ${i.gradient} bg-clip-text text-transparent`}`,
                                                style: {
                                                    color: s ? l : void 0
                                                },
                                                children: o || "Subject Name"
                                            })]
                                        })]
                                    })]
                                })]
                            }), e.jsxs("div", {
                                className: "space-y-4",
                                children: [e.jsxs("div", {
                                    className: "flex items-center justify-between",
                                    children: [e.jsx("label", {
                                        className: "text-xs font-bold text-zinc-500 uppercase tracking-wider",
                                        children: "Color Theme"
                                    }), e.jsxs("button", {
                                        onClick: () => x(!s),
                                        className: "text-[10px] font-bold text-indigo-500 hover:text-indigo-400 uppercase tracking-widest flex items-center gap-1",
                                        children: [e.jsx(A, {
                                            className: "w-3 h-3"
                                        }), s ? "Use Presets" : "Custom Color"]
                                    })]
                                }), s ? e.jsx("div", {
                                    className: "p-4 rounded-2xl bg-white/[0.02] border border-brand-500/20 space-y-4",
                                    children: e.jsxs("div", {
                                        className: "flex items-center gap-4",
                                        children: [e.jsxs("div", {
                                            className: "w-12 h-12 rounded-xl border border-white/20 relative cursor-pointer group",
                                            style: {
                                                backgroundColor: l
                                            },
                                            children: [e.jsx("input", {
                                                type: "color",
                                                value: l,
                                                onChange: t => g(t.target.value),
                                                className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            }), e.jsx("div", {
                                                className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                                                children: e.jsx(A, {
                                                    className: "w-5 h-5 text-white mix-blend-difference"
                                                })
                                            })]
                                        }), e.jsxs("div", {
                                            className: "flex-1 space-y-1",
                                            children: [e.jsx("input", {
                                                type: "text",
                                                value: l,
                                                onChange: t => g(t.target.value),
                                                className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-indigo-500/50"
                                            }), e.jsx("p", {
                                                className: "text-[10px] text-zinc-500 uppercase",
                                                children: "Enter Hex Code"
                                            })]
                                        })]
                                    })
                                }) : e.jsx("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: u.map(t => e.jsxs("button", {
                                        onClick: () => {
                                            b(t), x(!1)
                                        },
                                        className: `group relative p-3 rounded-xl border transition-all overflow-hidden ${!s&&i.name===t.name?"bg-white/10 border-white/20":"bg-transparent border-white/5 hover:bg-white/5"}`,
                                        children: [e.jsx("div", {
                                            className: `absolute inset-0 bg-gradient-to-r ${t.gradient} opacity-0 group-hover:opacity-10 transition-opacity`
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-3 relative z-10",
                                            children: [e.jsx("div", {
                                                className: `w-4 h-4 rounded-full bg-gradient-to-r ${t.gradient}`
                                            }), e.jsx("span", {
                                                className: `text-xs font-medium ${!s&&i.name===t.name?"text-white":"text-zinc-500"}`,
                                                children: t.name
                                            }), !s && i.name === t.name && e.jsx(B, {
                                                className: "w-3 h-3 text-white ml-auto"
                                            })]
                                        })]
                                    }, t.name))
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "space-y-4",
                            children: [e.jsx("label", {
                                className: "text-xs font-bold text-zinc-500 uppercase tracking-wider",
                                children: "Iconography"
                            }), e.jsx("div", {
                                className: "bg-white/[0.02] border border-white/5 rounded-2xl p-4 max-h-60 overflow-y-auto custom-scrollbar",
                                children: I.map(t => e.jsxs("div", {
                                    className: "mb-6 last:mb-0",
                                    children: [e.jsx("h4", {
                                        className: "text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3",
                                        children: t.name
                                    }), e.jsx("div", {
                                        className: "grid grid-cols-8 sm:grid-cols-10 gap-2",
                                        children: t.emojis.map((r, m) => e.jsx("button", {
                                            onClick: () => w(r),
                                            className: `aspect-square flex items-center justify-center text-xl rounded-xl transition-all ${h===r?"bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-110":"hover:bg-white/5 hover:scale-105 opacity-60 hover:opacity-100"}`,
                                            children: r
                                        }, m))
                                    })]
                                }, t.name))
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-3",
                        children: [e.jsx("div", {
                            children: a && e.jsx("button", {
                                onClick: async () => {
                                    window.confirm("Delete this subject? This will also remove related syllabus data.") && (N ? N(a.id) : await R(a.id), d())
                                },
                                className: "p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors",
                                children: e.jsx(G, {
                                    className: "w-5 h-5"
                                })
                            })
                        }), e.jsxs("div", {
                            className: "flex gap-3",
                            children: [e.jsx("button", {
                                onClick: d,
                                className: "px-6 py-3 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors",
                                children: "Cancel"
                            }), e.jsxs("button", {
                                onClick: P,
                                disabled: S,
                                className: "px-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10 flex items-center gap-2 disabled:opacity-50",
                                children: [S ? e.jsx("div", {
                                    className: "w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"
                                }) : e.jsx(J, {
                                    className: "w-4 h-4"
                                }), a ? "Save Changes" : "Create Subject"]
                            })]
                        })]
                    })]
                })]
            })
        })
    };
export {
    Z as S
};