import {
    r as m,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as B,
    a as L,
    b as v
} from "./useFocusStore-CX_Nyp1h.js";
import {
    S as u
} from "./SubjectIcon-CyCDqtel.js";
import {
    A as P,
    m as h
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    S as A,
    X as G,
    G as N,
    C as I,
    B as M,
    L as g,
    T as R,
    a as _,
    b as F,
    c as H,
    d as j,
    e as O
} from "./vendor-icons-CqruUz7g.js";
const Q = ({
    isOpen: z,
    onClose: f,
    isDark: t
}) => {
    const [o, x] = m.useState(null), [l, r] = m.useState([]), [i, w] = m.useState(!1), [d, b] = m.useState("select"), {
        createSubjectsFromTemplate: y
    } = B(), $ = L(), n = o ? v().find(s => s.id === o) : null, S = s => {
        x(s), b("customize");
        const a = v().find(c => c.id === s);
        a && r(a.subjects.map(c => c.name))
    }, C = s => {
        r(a => a.includes(s) ? a.filter(c => c !== s) : [...a, s])
    }, T = async () => {
        if (!(!o || l.length === 0)) {
            w(!0);
            try {
                await y(o, l), f(), x(null), r([]), b("select")
            } catch (s) {
                console.error("Failed to load template:", s)
            } finally {
                w(!1)
            }
        }
    }, E = () => {
        b("select"), x(null), r([])
    }, p = () => {
        i || (b("select"), x(null), r([]), f())
    };
    return z ? e.jsx(P, {
        children: e.jsxs("div", {
            className: "fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-4",
            children: [e.jsx(h.div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                exit: {
                    opacity: 0
                },
                onClick: p,
                className: `absolute inset-0 backdrop-blur-md ${t?"bg-black/60":"bg-black/40"}`
            }), e.jsxs(h.div, {
                initial: {
                    opacity: 0,
                    scale: .9,
                    y: 40
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                    y: 0
                },
                exit: {
                    opacity: 0,
                    scale: .9,
                    y: 40
                },
                className: `relative w-full max-w-5xl max-h-[min(92dvh,54rem)] flex flex-col overflow-hidden rounded-[28px] sm:rounded-[32px] shadow-2xl ${t?"bg-[#0c0c0e]/95 border border-white/10":"bg-white border border-zinc-200"}`,
                children: [e.jsxs("div", {
                    className: "absolute inset-0 pointer-events-none overflow-hidden",
                    children: [e.jsx("div", {
                        className: "absolute -top-[20%] -right-[10%] w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px]"
                    }), e.jsx("div", {
                        className: "absolute -bottom-[20%] -left-[10%] w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px]"
                    })]
                }), e.jsx("div", {
                    className: `relative z-10 p-4 sm:p-8 border-b ${t?"border-white/5":"border-zinc-100"}`,
                    children: e.jsxs("div", {
                        className: "flex items-start justify-between gap-3",
                        children: [e.jsxs("div", {
                            className: "flex min-w-0 items-center space-x-3 sm:space-x-4",
                            children: [e.jsx("div", {
                                className: `p-3 rounded-2xl ${t?"bg-brand-500/10 border border-brand-500/20":"bg-brand-50 border border-brand-100"}`,
                                children: e.jsx(A, {
                                    className: `w-6 h-6 ${t?"text-brand-400":"text-brand-600"}`
                                })
                            }), e.jsxs("div", {
                                className: "min-w-0",
                                children: [e.jsx("h2", {
                                    className: `text-xl sm:text-3xl font-bold tracking-tight ${t?"text-white":"text-zinc-900"}`,
                                    children: d === "select" ? "Load Exam Syllabus" : "Customize Syllabus"
                                }), e.jsx("p", {
                                    className: `text-sm font-medium mt-1 ${t?"text-zinc-400":"text-zinc-500"}`,
                                    children: d === "select" ? "Choose a professional template to get started" : "Select the subjects you want to add to your plan"
                                })]
                            })]
                        }), e.jsx("button", {
                            onClick: p,
                            disabled: i,
                            className: `p-2 rounded-xl transition-all ${t?"hover:bg-white/5 text-zinc-500 hover:text-white":"hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"} disabled:opacity-50`,
                            children: e.jsx(G, {
                                className: "w-6 h-6"
                            })
                        })]
                    })
                }), e.jsx("div", {
                    className: "relative z-10 flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar",
                    children: d === "select" ? e.jsx("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6 pb-4",
                        children: $.map(s => e.jsxs(h.button, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            whileHover: {
                                y: -4,
                                scale: 1.01
                            },
                            whileTap: {
                                scale: .99
                            },
                            onClick: () => S(s.id),
                            className: `group relative p-6 rounded-[24px] border-2 text-left transition-all duration-300 ${t?"bg-white/[0.02] border-white/5 hover:border-brand-500/50 hover:bg-white/[0.04] shadow-xl shadow-black/20":"bg-white border-zinc-200 hover:border-brand-400 hover:shadow-2xl hover:shadow-brand-500/10"}`,
                            children: [e.jsxs("div", {
                                className: "flex items-start justify-between mb-5",
                                children: [e.jsxs("div", {
                                    className: "flex items-center space-x-4",
                                    children: [e.jsx("div", {
                                        className: `w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform transition-transform group-hover:scale-110 duration-500 ${t?"bg-white/5 border border-white/10":"bg-zinc-50 border border-zinc-100"}`,
                                        children: e.jsx(u, {
                                            icon: s.icon,
                                            name: s.displayName,
                                            className: "w-10 h-10"
                                        })
                                    }), e.jsxs("div", {
                                        children: [e.jsx("h3", {
                                            className: `text-2xl font-bold tracking-tight mb-1 ${t?"text-white":"text-zinc-900 group-hover:text-brand-600"}`,
                                            children: s.displayName
                                        }), e.jsxs("div", {
                                            className: `flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${t?"text-zinc-500":"text-zinc-400"}`,
                                            children: [e.jsx(N, {
                                                className: "w-3 h-3"
                                            }), s.name]
                                        })]
                                    })]
                                }), e.jsx("div", {
                                    className: `p-2 rounded-xl transition-colors ${t?"bg-white/5 text-zinc-500 group-hover:text-white":"bg-zinc-50 text-zinc-400 group-hover:text-brand-500"}`,
                                    children: e.jsx(I, {
                                        className: "w-5 h-5"
                                    })
                                })]
                            }), e.jsx("p", {
                                className: `text-sm leading-relaxed mb-6 line-clamp-2 font-medium ${t?"text-zinc-400":"text-zinc-500"}`,
                                children: s.description
                            }), e.jsxs("div", {
                                className: "grid grid-cols-3 gap-3 mb-6",
                                children: [e.jsxs("div", {
                                    className: `p-3 rounded-2xl border ${t?"bg-black/20 border-white/5":"bg-zinc-50 border-zinc-100"}`,
                                    children: [e.jsxs("div", {
                                        className: "flex items-center gap-2 mb-1",
                                        children: [e.jsx(M, {
                                            className: `w-3 h-3 ${t?"text-brand-400":"text-brand-600"}`
                                        }), e.jsx("span", {
                                            className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500",
                                            children: "Subjects"
                                        })]
                                    }), e.jsx("div", {
                                        className: `text-lg font-bold ${t?"text-white":"text-zinc-900"}`,
                                        children: s.subjectCount
                                    })]
                                }), e.jsxs("div", {
                                    className: `p-3 rounded-2xl border ${t?"bg-black/20 border-white/5":"bg-zinc-50 border-zinc-100"}`,
                                    children: [e.jsxs("div", {
                                        className: "flex items-center gap-2 mb-1",
                                        children: [e.jsx(g, {
                                            className: `w-3 h-3 ${t?"text-violet-400":"text-violet-600"}`
                                        }), e.jsx("span", {
                                            className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500",
                                            children: "Chapters"
                                        })]
                                    }), e.jsx("div", {
                                        className: `text-lg font-bold ${t?"text-white":"text-zinc-900"}`,
                                        children: s.totalChapters
                                    })]
                                }), e.jsxs("div", {
                                    className: `p-3 rounded-2xl border ${t?"bg-black/20 border-white/5":"bg-zinc-50 border-zinc-100"}`,
                                    children: [e.jsxs("div", {
                                        className: "flex items-center gap-2 mb-1",
                                        children: [e.jsx(R, {
                                            className: `w-3 h-3 ${t?"text-fuchsia-400":"text-fuchsia-600"}`
                                        }), e.jsx("span", {
                                            className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500",
                                            children: "Topics"
                                        })]
                                    }), e.jsx("div", {
                                        className: `text-lg font-bold ${t?"text-white":"text-zinc-900"}`,
                                        children: s.totalTopics
                                    })]
                                })]
                            }), e.jsxs("div", {
                                className: "flex items-center justify-between mt-auto pt-2",
                                children: [e.jsxs("div", {
                                    className: `flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold ${t?"bg-brand-500/10 border-brand-500/20 text-brand-400":"bg-brand-50 border-brand-100 text-brand-700"}`,
                                    children: [e.jsx(_, {
                                        className: "w-3 h-3"
                                    }), "Professional Syllabus"]
                                }), s.metadata ?.examPattern && e.jsxs("div", {
                                    className: `text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg ${t?"bg-zinc-800 text-zinc-400 border border-zinc-700":"bg-zinc-100 text-zinc-500 border border-zinc-200"}`,
                                    children: [s.metadata.examPattern.split(" ")[0], " Pattern"]
                                })]
                            }), e.jsx("div", {
                                className: "absolute inset-0 rounded-[22px] border-2 border-brand-500/0 group-hover:border-brand-500/30 transition-all duration-300 pointer-events-none"
                            })]
                        }, s.id))
                    }) : e.jsxs("div", {
                        className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
                        children: [e.jsxs("div", {
                            className: `relative p-8 rounded-[28px] overflow-hidden ${t?"bg-white/[0.03] border border-white/10":"bg-brand-50/50 border border-brand-100"}`,
                            children: [e.jsx("div", {
                                className: "absolute right-0 top-0 p-8 opacity-10 pointer-events-none",
                                children: e.jsx(F, {
                                    className: "w-32 h-32 text-brand-500"
                                })
                            }), e.jsxs("div", {
                                className: "relative z-10 flex items-center space-x-6",
                                children: [e.jsx("div", {
                                    className: `w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-2xl ${t?"bg-black/40 border border-white/5":"bg-white border border-zinc-100"}`,
                                    children: e.jsx(u, {
                                        icon: n ?.icon || "",
                                        name: n ?.displayName || "",
                                        className: "w-12 h-12"
                                    })
                                }), e.jsxs("div", {
                                    children: [e.jsx("h4", {
                                        className: `text-2xl font-bold mb-2 ${t?"text-white":"text-zinc-900"}`,
                                        children: n ?.displayName
                                    }), e.jsxs("div", {
                                        className: "flex items-center gap-4",
                                        children: [e.jsxs("div", {
                                            className: `flex items-center gap-2 text-sm font-medium ${t?"text-zinc-400":"text-zinc-500"}`,
                                            children: [e.jsx(N, {
                                                className: "w-4 h-4 text-brand-500"
                                            }), "Official Syllabus"]
                                        }), e.jsxs("div", {
                                            className: `flex items-center gap-2 text-sm font-medium ${t?"text-zinc-400":"text-zinc-500"}`,
                                            children: [e.jsx(H, {
                                                className: "w-4 h-4 text-brand-500"
                                            }), n ?.subjects.length, " Core Subjects"]
                                        })]
                                    })]
                                })]
                            })]
                        }), e.jsxs("div", {
                            children: [e.jsxs("h3", {
                                className: `text-lg font-bold mb-4 px-2 flex items-center gap-2 ${t?"text-white":"text-zinc-800"}`,
                                children: [e.jsx(g, {
                                    className: "w-5 h-5 text-brand-500"
                                }), "Select Subjects to Import"]
                            }), e.jsx("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                children: n ?.subjects.map(s => {
                                    const a = l.includes(s.name);
                                    return e.jsxs(h.button, {
                                        whileHover: {
                                            scale: 1.02
                                        },
                                        whileTap: {
                                            scale: .98
                                        },
                                        onClick: () => C(s.name),
                                        className: `group relative p-5 rounded-[22px] border-2 transition-all duration-300 ${a?t?"bg-brand-500/10 border-brand-500 shadow-[0_0_20px_rgba(139,92,246,0.1)]":"bg-brand-50 border-brand-500 ":t?"bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]":"bg-white border-zinc-200 hover:border-zinc-300"}`,
                                        children: [e.jsxs("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [e.jsx("div", {
                                                className: `w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${t?"bg-black/20":"bg-zinc-50"}`,
                                                children: e.jsx(u, {
                                                    icon: s.icon,
                                                    name: s.name,
                                                    className: "w-8 h-8"
                                                })
                                            }), e.jsx("div", {
                                                className: `w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${a?"bg-brand-500 border-brand-500":t?"bg-black/20 border-white/10":"bg-zinc-50 border-zinc-200"}`,
                                                children: a && e.jsx(j, {
                                                    className: "w-3.5 h-3.5 text-white"
                                                })
                                            })]
                                        }), e.jsxs("div", {
                                            className: "text-left",
                                            children: [e.jsx("h5", {
                                                className: `font-bold text-lg mb-1 transition-colors ${a?t?"text-white":"text-brand-700":t?"text-zinc-200":"text-zinc-900"}`,
                                                children: s.name
                                            }), e.jsxs("div", {
                                                className: `flex items-center gap-3 text-xs font-bold uppercase tracking-wider ${t?"text-zinc-500":"text-zinc-400"}`,
                                                children: [e.jsx(g, {
                                                    className: "w-3 h-3"
                                                }), s.units.length, " Core Units"]
                                            })]
                                        })]
                                    }, s.name)
                                })
                            })]
                        }), e.jsxs("div", {
                            className: `flex items-center justify-between p-4 rounded-2xl ${t?"bg-black/40 border border-white/5 text-zinc-400":"bg-zinc-50 border border-zinc-100 text-zinc-600"}`,
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2 font-medium",
                                children: [e.jsx(j, {
                                    className: "w-5 h-5 text-emerald-500"
                                }), e.jsxs("span", {
                                    children: [l.length, " of ", n ?.subjects.length, " Subjects Ready"]
                                })]
                            }), e.jsx("div", {
                                className: "text-xs font-bold uppercase tracking-widest text-brand-500",
                                children: "Step 2 of 2"
                            })]
                        })]
                    })
                }), e.jsx("div", {
                    className: `relative z-10 p-4 pt-4 sm:p-8 sm:pt-6 border-t ${t?"border-white/5":"border-zinc-100"} bg-transparent mt-auto`,
                    children: e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [d === "customize" ? e.jsx("button", {
                            onClick: E,
                            disabled: i,
                            className: `flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${t?"bg-white/5 hover:bg-white/10 text-white border border-white/5":"bg-zinc-100 hover:bg-zinc-200 text-zinc-900"} disabled:opacity-50`,
                            children: "Back to Selection"
                        }) : e.jsx("div", {
                            className: "text-sm font-medium text-zinc-500 italic",
                            children: "Expert-curated syllabuses for competitive exams."
                        }), e.jsxs("div", {
                            className: "flex items-center space-x-4",
                            children: [e.jsx("button", {
                                onClick: p,
                                disabled: i,
                                className: `px-6 py-3 rounded-2xl font-bold transition-all ${t?"text-zinc-400 hover:text-white":"text-zinc-500 hover:text-zinc-900"} disabled:opacity-50`,
                                children: "Cancel"
                            }), d === "customize" && e.jsxs("button", {
                                onClick: T,
                                disabled: i || l.length === 0,
                                className: `px-8 py-3 rounded-[20px] font-bold transition-all flex items-center space-x-3 shadow-xl ${t?"bg-brand-500 text-white hover:bg-brand-400 shadow-brand-500/20":"bg-zinc-900 text-white hover:bg-brand-600 shadow-zinc-900/10"} disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95`,
                                children: [i ? e.jsx(O, {
                                    className: "w-5 h-5 animate-spin"
                                }) : e.jsx(j, {
                                    className: "w-5 h-5"
                                }), e.jsx("span", {
                                    children: i ? "Importing..." : "Build My Syllabus"
                                })]
                            })]
                        })]
                    })
                })]
            })]
        })
    }) : null
};
export {
    Q as E
};