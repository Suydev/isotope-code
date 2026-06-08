import {
    r as v,
    j as N,
    b as At
} from "./vendor-react-BfU3Zn2J.js";
var A = class {
        constructor() {
            this.listeners = new Set, this.subscribe = this.subscribe.bind(this)
        }
        subscribe(t) {
            return this.listeners.add(t), this.onSubscribe(), () => {
                this.listeners.delete(t), this.onUnsubscribe()
            }
        }
        hasListeners() {
            return this.listeners.size > 0
        }
        onSubscribe() {}
        onUnsubscribe() {}
    },
    zt = {
        setTimeout: (t, e) => setTimeout(t, e),
        clearTimeout: t => clearTimeout(t),
        setInterval: (t, e) => setInterval(t, e),
        clearInterval: t => clearInterval(t)
    },
    kt = class {
        #t = zt;
        #e = !1;
        setTimeoutProvider(t) {
            this.#t = t
        }
        setTimeout(t, e) {
            return this.#t.setTimeout(t, e)
        }
        clearTimeout(t) {
            this.#t.clearTimeout(t)
        }
        setInterval(t, e) {
            return this.#t.setInterval(t, e)
        }
        clearInterval(t) {
            this.#t.clearInterval(t)
        }
    },
    F = new kt;

function jt(t) {
    setTimeout(t, 0)
}
var I = typeof window > "u" || "Deno" in globalThis;

function C() {}

function qt(t, e) {
    return typeof t == "function" ? t(e) : t
}

function H(t) {
    return typeof t == "number" && t >= 0 && t !== 1 / 0
}

function gt(t, e) {
    return Math.max(t + (e || 0) - Date.now(), 0)
}

function x(t, e) {
    return typeof t == "function" ? t(e) : t
}

function R(t, e) {
    return typeof t == "function" ? t(e) : t
}

function et(t, e) {
    const {
        type: s = "all",
        exact: i,
        fetchStatus: n,
        predicate: r,
        queryKey: o,
        stale: a
    } = t;
    if (o) {
        if (i) {
            if (e.queryHash !== Z(o, e.options)) return !1
        } else if (!k(e.queryKey, o)) return !1
    }
    if (s !== "all") {
        const u = e.isActive();
        if (s === "active" && !u || s === "inactive" && u) return !1
    }
    return !(typeof a == "boolean" && e.isStale() !== a || n && n !== e.state.fetchStatus || r && !r(e))
}

function st(t, e) {
    const {
        exact: s,
        status: i,
        predicate: n,
        mutationKey: r
    } = t;
    if (r) {
        if (!e.options.mutationKey) return !1;
        if (s) {
            if (D(e.options.mutationKey) !== D(r)) return !1
        } else if (!k(e.options.mutationKey, r)) return !1
    }
    return !(i && e.state.status !== i || n && !n(e))
}

function Z(t, e) {
    return (e ?.queryKeyHashFn || D)(t)
}

function D(t) {
    return JSON.stringify(t, (e, s) => W(s) ? Object.keys(s).sort().reduce((i, n) => (i[n] = s[n], i), {}) : s)
}

function k(t, e) {
    return t === e ? !0 : typeof t != typeof e ? !1 : t && e && typeof t == "object" && typeof e == "object" ? Object.keys(e).every(s => k(t[s], e[s])) : !1
}
var Ut = Object.prototype.hasOwnProperty;

function vt(t, e) {
    if (t === e) return t;
    const s = it(t) && it(e);
    if (!s && !(W(t) && W(e))) return e;
    const n = (s ? t : Object.keys(t)).length,
        r = s ? e : Object.keys(e),
        o = r.length,
        a = s ? new Array(o) : {};
    let u = 0;
    for (let c = 0; c < o; c++) {
        const h = s ? c : r[c],
            f = t[h],
            l = e[h];
        if (f === l) {
            a[h] = f, (s ? c < n : Ut.call(t, h)) && u++;
            continue
        }
        if (f === null || l === null || typeof f != "object" || typeof l != "object") {
            a[h] = l;
            continue
        }
        const y = vt(f, l);
        a[h] = y, y === f && u++
    }
    return n === o && u === n ? t : a
}

function _(t, e) {
    if (!e || Object.keys(t).length !== Object.keys(e).length) return !1;
    for (const s in t)
        if (t[s] !== e[s]) return !1;
    return !0
}

function it(t) {
    return Array.isArray(t) && t.length === Object.keys(t).length
}

function W(t) {
    if (!nt(t)) return !1;
    const e = t.constructor;
    if (e === void 0) return !0;
    const s = e.prototype;
    return !(!nt(s) || !s.hasOwnProperty("isPrototypeOf") || Object.getPrototypeOf(t) !== Object.prototype)
}

function nt(t) {
    return Object.prototype.toString.call(t) === "[object Object]"
}

function _t(t) {
    return new Promise(e => {
        F.setTimeout(e, t)
    })
}

function B(t, e, s) {
    return typeof s.structuralSharing == "function" ? s.structuralSharing(t, e) : s.structuralSharing !== !1 ? vt(t, e) : e
}

function Lt(t, e, s = 0) {
    const i = [...t, e];
    return s && i.length > s ? i.slice(1) : i
}

function Kt(t, e, s = 0) {
    const i = [e, ...t];
    return s && i.length > s ? i.slice(0, -1) : i
}
var X = Symbol();

function bt(t, e) {
    return !t.queryFn && e ?.initialPromise ? () => e.initialPromise : !t.queryFn || t.queryFn === X ? () => Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`)) : t.queryFn
}

function Ct(t, e) {
    return typeof t == "function" ? t(...e) : !!t
}
var Nt = class extends A {
        #t;
        #e;
        #s;
        constructor() {
            super(), this.#s = t => {
                if (!I && window.addEventListener) {
                    const e = () => t();
                    return window.addEventListener("visibilitychange", e, !1), () => {
                        window.removeEventListener("visibilitychange", e)
                    }
                }
            }
        }
        onSubscribe() {
            this.#e || this.setEventListener(this.#s)
        }
        onUnsubscribe() {
            this.hasListeners() || (this.#e ?.(), this.#e = void 0)
        }
        setEventListener(t) {
            this.#s = t, this.#e ?.(), this.#e = t(e => {
                typeof e == "boolean" ? this.setFocused(e) : this.onFocus()
            })
        }
        setFocused(t) {
            this.#t !== t && (this.#t = t, this.onFocus())
        }
        onFocus() {
            const t = this.isFocused();
            this.listeners.forEach(e => {
                e(t)
            })
        }
        isFocused() {
            return typeof this.#t == "boolean" ? this.#t : globalThis.document ?.visibilityState !== "hidden"
        }
    },
    Y = new Nt;

function G() {
    let t, e;
    const s = new Promise((n, r) => {
        t = n, e = r
    });
    s.status = "pending", s.catch(() => {});

    function i(n) {
        Object.assign(s, n), delete s.resolve, delete s.reject
    }
    return s.resolve = n => {
        i({
            status: "fulfilled",
            value: n
        }), t(n)
    }, s.reject = n => {
        i({
            status: "rejected",
            reason: n
        }), e(n)
    }, s
}

function Ht(t) {
    let e;
    if (t.then(s => (e = s, s), C) ?.catch(C), e !== void 0) return {
        data: e
    }
}

function Ot(t) {
    return t
}

function Wt(t) {
    return {
        mutationKey: t.options.mutationKey,
        state: t.state,
        ...t.options.scope && {
            scope: t.options.scope
        },
        ...t.meta && {
            meta: t.meta
        }
    }
}

function Bt(t, e, s) {
    const i = () => {
        const n = t.promise ?.then(e).catch(r => s(r) ? Promise.reject(new Error("redacted")) : Promise.reject(r));
        return n ?.catch(C), n
    };
    return {
        dehydratedAt: Date.now(),
        state: { ...t.state,
            ...t.state.data !== void 0 && {
                data: e(t.state.data)
            }
        },
        queryKey: t.queryKey,
        queryHash: t.queryHash,
        ...t.state.status === "pending" && {
            promise: i()
        },
        ...t.meta && {
            meta: t.meta
        }
    }
}

function Gt(t) {
    return t.state.isPaused
}

function Vt(t) {
    return t.state.status === "success"
}

function $t(t) {
    return !0
}

function Jt(t, e = {}) {
    const s = e.shouldDehydrateMutation ?? t.getDefaultOptions().dehydrate ?.shouldDehydrateMutation ?? Gt,
        i = t.getMutationCache().getAll().flatMap(u => s(u) ? [Wt(u)] : []),
        n = e.shouldDehydrateQuery ?? t.getDefaultOptions().dehydrate ?.shouldDehydrateQuery ?? Vt,
        r = e.shouldRedactErrors ?? t.getDefaultOptions().dehydrate ?.shouldRedactErrors ?? $t,
        o = e.serializeData ?? t.getDefaultOptions().dehydrate ?.serializeData ?? Ot,
        a = t.getQueryCache().getAll().flatMap(u => n(u) ? [Bt(u, o, r)] : []);
    return {
        mutations: i,
        queries: a
    }
}

function Zt(t, e, s) {
    if (typeof e != "object" || e === null) return;
    const i = t.getMutationCache(),
        n = t.getQueryCache(),
        r = s ?.defaultOptions ?.deserializeData ?? t.getDefaultOptions().hydrate ?.deserializeData ?? Ot,
        o = e.mutations || [],
        a = e.queries || [];
    o.forEach(({
        state: u,
        ...c
    }) => {
        i.build(t, { ...t.getDefaultOptions().hydrate ?.mutations,
            ...s ?.defaultOptions ?.mutations,
            ...c
        }, u)
    }), a.forEach(({
        queryKey: u,
        state: c,
        queryHash: h,
        meta: f,
        promise: l,
        dehydratedAt: y
    }) => {
        const p = l ? Ht(l) : void 0,
            d = c.data === void 0 ? p ?.data : c.data,
            g = d === void 0 ? d : r(d);
        let m = n.get(h);
        const b = m ?.state.status === "pending",
            w = m ?.state.fetchStatus === "fetching";
        if (m) {
            const S = p && y !== void 0 && y > m.state.dataUpdatedAt;
            if (c.dataUpdatedAt > m.state.dataUpdatedAt || S) {
                const {
                    fetchStatus: E,
                    ...z
                } = c;
                m.setState({ ...z,
                    data: g
                })
            }
        } else m = n.build(t, { ...t.getDefaultOptions().hydrate ?.queries,
            ...s ?.defaultOptions ?.queries,
            queryKey : u,
            queryHash : h,
            meta : f
        }, { ...c,
            data: g,
            fetchStatus: "idle",
            status: g !== void 0 ? "success" : c.status
        });
        l && !b && !w && (y === void 0 || y > m.state.dataUpdatedAt) && m.fetch(void 0, {
            initialPromise: Promise.resolve(l).then(r)
        }).catch(C)
    })
}
var Xt = jt;

function Yt() {
    let t = [],
        e = 0,
        s = a => {
            a()
        },
        i = a => {
            a()
        },
        n = Xt;
    const r = a => {
            e ? t.push(a) : n(() => {
                s(a)
            })
        },
        o = () => {
            const a = t;
            t = [], a.length && n(() => {
                i(() => {
                    a.forEach(u => {
                        s(u)
                    })
                })
            })
        };
    return {
        batch: a => {
            let u;
            e++;
            try {
                u = a()
            } finally {
                e--, e || o()
            }
            return u
        },
        batchCalls: a => (...u) => {
            r(() => {
                a(...u)
            })
        },
        schedule: r,
        setNotifyFunction: a => {
            s = a
        },
        setBatchNotifyFunction: a => {
            i = a
        },
        setScheduler: a => {
            n = a
        }
    }
}
var O = Yt(),
    te = class extends A {
        #t = !0;
        #e;
        #s;
        constructor() {
            super(), this.#s = t => {
                if (!I && window.addEventListener) {
                    const e = () => t(!0),
                        s = () => t(!1);
                    return window.addEventListener("online", e, !1), window.addEventListener("offline", s, !1), () => {
                        window.removeEventListener("online", e), window.removeEventListener("offline", s)
                    }
                }
            }
        }
        onSubscribe() {
            this.#e || this.setEventListener(this.#s)
        }
        onUnsubscribe() {
            this.hasListeners() || (this.#e ?.(), this.#e = void 0)
        }
        setEventListener(t) {
            this.#s = t, this.#e ?.(), this.#e = t(this.setOnline.bind(this))
        }
        setOnline(t) {
            this.#t !== t && (this.#t = t, this.listeners.forEach(s => {
                s(t)
            }))
        }
        isOnline() {
            return this.#t
        }
    },
    L = new te;

function ee(t) {
    return Math.min(1e3 * 2 ** t, 3e4)
}

function St(t) {
    return (t ?? "online") === "online" ? L.isOnline() : !0
}
var V = class extends Error {
    constructor(t) {
        super("CancelledError"), this.revert = t ?.revert, this.silent = t ?.silent
    }
};

function wt(t) {
    let e = !1,
        s = 0,
        i;
    const n = G(),
        r = () => n.status !== "pending",
        o = d => {
            if (!r()) {
                const g = new V(d);
                l(g), t.onCancel ?.(g)
            }
        },
        a = () => {
            e = !0
        },
        u = () => {
            e = !1
        },
        c = () => Y.isFocused() && (t.networkMode === "always" || L.isOnline()) && t.canRun(),
        h = () => St(t.networkMode) && t.canRun(),
        f = d => {
            r() || (i ?.(), n.resolve(d))
        },
        l = d => {
            r() || (i ?.(), n.reject(d))
        },
        y = () => new Promise(d => {
            i = g => {
                (r() || c()) && d(g)
            }, t.onPause ?.()
        }).then(() => {
            i = void 0, r() || t.onContinue ?.()
        }),
        p = () => {
            if (r()) return;
            let d;
            const g = s === 0 ? t.initialPromise : void 0;
            try {
                d = g ?? t.fn()
            } catch (m) {
                d = Promise.reject(m)
            }
            Promise.resolve(d).then(f).catch(m => {
                if (r()) return;
                const b = t.retry ?? (I ? 0 : 3),
                    w = t.retryDelay ?? ee,
                    S = typeof w == "function" ? w(s, m) : w,
                    E = b === !0 || typeof b == "number" && s < b || typeof b == "function" && b(s, m);
                if (e || !E) {
                    l(m);
                    return
                }
                s++, t.onFail ?.(s, m), _t(S).then(() => c() ? void 0 : y()).then(() => {
                    e ? l(m) : p()
                })
            })
        };
    return {
        promise: n,
        status: () => n.status,
        cancel: o,
        continue: () => (i ?.(), n),
        cancelRetry: a,
        continueRetry: u,
        canStart: h,
        start: () => (h() ? p() : y().then(p), n)
    }
}
var Mt = class {
        #t;
        destroy() {
            this.clearGcTimeout()
        }
        scheduleGc() {
            this.clearGcTimeout(), H(this.gcTime) && (this.#t = F.setTimeout(() => {
                this.optionalRemove()
            }, this.gcTime))
        }
        updateGcTime(t) {
            this.gcTime = Math.max(this.gcTime || 0, t ?? (I ? 1 / 0 : 300 * 1e3))
        }
        clearGcTimeout() {
            this.#t && (F.clearTimeout(this.#t), this.#t = void 0)
        }
    },
    se = class extends Mt {
        #t;
        #e;
        #s;
        #n;
        #i;
        #a;
        #o;
        constructor(t) {
            super(), this.#o = !1, this.#a = t.defaultOptions, this.setOptions(t.options), this.observers = [], this.#n = t.client, this.#s = this.#n.getQueryCache(), this.queryKey = t.queryKey, this.queryHash = t.queryHash, this.#t = at(this.options), this.state = t.state ?? this.#t, this.scheduleGc()
        }
        get meta() {
            return this.options.meta
        }
        get promise() {
            return this.#i ?.promise
        }
        setOptions(t) {
            if (this.options = { ...this.#a,
                    ...t
                }, this.updateGcTime(this.options.gcTime), this.state && this.state.data === void 0) {
                const e = at(this.options);
                e.data !== void 0 && (this.setState(rt(e.data, e.dataUpdatedAt)), this.#t = e)
            }
        }
        optionalRemove() {
            !this.observers.length && this.state.fetchStatus === "idle" && this.#s.remove(this)
        }
        setData(t, e) {
            const s = B(this.state.data, t, this.options);
            return this.#r({
                data: s,
                type: "success",
                dataUpdatedAt: e ?.updatedAt,
                manual: e ?.manual
            }), s
        }
        setState(t, e) {
            this.#r({
                type: "setState",
                state: t,
                setStateOptions: e
            })
        }
        cancel(t) {
            const e = this.#i ?.promise;
            return this.#i ?.cancel(t), e ? e.then(C).catch(C) : Promise.resolve()
        }
        destroy() {
            super.destroy(), this.cancel({
                silent: !0
            })
        }
        reset() {
            this.destroy(), this.setState(this.#t)
        }
        isActive() {
            return this.observers.some(t => R(t.options.enabled, this) !== !1)
        }
        isDisabled() {
            return this.getObserversCount() > 0 ? !this.isActive() : this.options.queryFn === X || this.state.dataUpdateCount + this.state.errorUpdateCount === 0
        }
        isStatic() {
            return this.getObserversCount() > 0 ? this.observers.some(t => x(t.options.staleTime, this) === "static") : !1
        }
        isStale() {
            return this.getObserversCount() > 0 ? this.observers.some(t => t.getCurrentResult().isStale) : this.state.data === void 0 || this.state.isInvalidated
        }
        isStaleByTime(t = 0) {
            return this.state.data === void 0 ? !0 : t === "static" ? !1 : this.state.isInvalidated ? !0 : !gt(this.state.dataUpdatedAt, t)
        }
        onFocus() {
            this.observers.find(e => e.shouldFetchOnWindowFocus()) ?.refetch({
                cancelRefetch: !1
            }), this.#i ?.continue()
        }
        onOnline() {
            this.observers.find(e => e.shouldFetchOnReconnect()) ?.refetch({
                cancelRefetch: !1
            }), this.#i ?.continue()
        }
        addObserver(t) {
            this.observers.includes(t) || (this.observers.push(t), this.clearGcTimeout(), this.#s.notify({
                type: "observerAdded",
                query: this,
                observer: t
            }))
        }
        removeObserver(t) {
            this.observers.includes(t) && (this.observers = this.observers.filter(e => e !== t), this.observers.length || (this.#i && (this.#o ? this.#i.cancel({
                revert: !0
            }) : this.#i.cancelRetry()), this.scheduleGc()), this.#s.notify({
                type: "observerRemoved",
                query: this,
                observer: t
            }))
        }
        getObserversCount() {
            return this.observers.length
        }
        invalidate() {
            this.state.isInvalidated || this.#r({
                type: "invalidate"
            })
        }
        async fetch(t, e) {
            if (this.state.fetchStatus !== "idle" && this.#i ?.status() !== "rejected") {
                if (this.state.data !== void 0 && e ?.cancelRefetch) this.cancel({
                    silent: !0
                });
                else if (this.#i) return this.#i.continueRetry(), this.#i.promise
            }
            if (t && this.setOptions(t), !this.options.queryFn) {
                const a = this.observers.find(u => u.options.queryFn);
                a && this.setOptions(a.options)
            }
            const s = new AbortController,
                i = a => {
                    Object.defineProperty(a, "signal", {
                        enumerable: !0,
                        get: () => (this.#o = !0, s.signal)
                    })
                },
                n = () => {
                    const a = bt(this.options, e),
                        c = (() => {
                            const h = {
                                client: this.#n,
                                queryKey: this.queryKey,
                                meta: this.meta
                            };
                            return i(h), h
                        })();
                    return this.#o = !1, this.options.persister ? this.options.persister(a, c, this) : a(c)
                },
                o = (() => {
                    const a = {
                        fetchOptions: e,
                        options: this.options,
                        queryKey: this.queryKey,
                        client: this.#n,
                        state: this.state,
                        fetchFn: n
                    };
                    return i(a), a
                })();
            this.options.behavior ?.onFetch(o, this), this.#e = this.state, (this.state.fetchStatus === "idle" || this.state.fetchMeta !== o.fetchOptions ?.meta) && this.#r({
                type: "fetch",
                meta: o.fetchOptions ?.meta
            }), this.#i = wt({
                initialPromise: e ?.initialPromise,
                fn: o.fetchFn,
                onCancel: a => {
                    a instanceof V && a.revert && this.setState({ ...this.#e,
                        fetchStatus: "idle"
                    }), s.abort()
                },
                onFail: (a, u) => {
                    this.#r({
                        type: "failed",
                        failureCount: a,
                        error: u
                    })
                },
                onPause: () => {
                    this.#r({
                        type: "pause"
                    })
                },
                onContinue: () => {
                    this.#r({
                        type: "continue"
                    })
                },
                retry: o.options.retry,
                retryDelay: o.options.retryDelay,
                networkMode: o.options.networkMode,
                canRun: () => !0
            });
            try {
                const a = await this.#i.start();
                if (a === void 0) throw new Error(`${this.queryHash} data is undefined`);
                return this.setData(a), this.#s.config.onSuccess ?.(a, this), this.#s.config.onSettled ?.(a, this.state.error, this), a
            } catch (a) {
                if (a instanceof V) {
                    if (a.silent) return this.#i.promise;
                    if (a.revert) {
                        if (this.state.data === void 0) throw a;
                        return this.state.data
                    }
                }
                throw this.#r({
                    type: "error",
                    error: a
                }), this.#s.config.onError ?.(a, this), this.#s.config.onSettled ?.(this.state.data, a, this), a
            } finally {
                this.scheduleGc()
            }
        }
        #r(t) {
            const e = s => {
                switch (t.type) {
                    case "failed":
                        return { ...s,
                            fetchFailureCount: t.failureCount,
                            fetchFailureReason: t.error
                        };
                    case "pause":
                        return { ...s,
                            fetchStatus: "paused"
                        };
                    case "continue":
                        return { ...s,
                            fetchStatus: "fetching"
                        };
                    case "fetch":
                        return { ...s,
                            ...Rt(s.data, this.options),
                            fetchMeta: t.meta ?? null
                        };
                    case "success":
                        const i = { ...s,
                            ...rt(t.data, t.dataUpdatedAt),
                            dataUpdateCount: s.dataUpdateCount + 1,
                            ...!t.manual && {
                                fetchStatus: "idle",
                                fetchFailureCount: 0,
                                fetchFailureReason: null
                            }
                        };
                        return this.#e = t.manual ? i : void 0, i;
                    case "error":
                        const n = t.error;
                        return { ...s,
                            error: n,
                            errorUpdateCount: s.errorUpdateCount + 1,
                            errorUpdatedAt: Date.now(),
                            fetchFailureCount: s.fetchFailureCount + 1,
                            fetchFailureReason: n,
                            fetchStatus: "idle",
                            status: "error"
                        };
                    case "invalidate":
                        return { ...s,
                            isInvalidated: !0
                        };
                    case "setState":
                        return { ...s,
                            ...t.state
                        }
                }
            };
            this.state = e(this.state), O.batch(() => {
                this.observers.forEach(s => {
                    s.onQueryUpdate()
                }), this.#s.notify({
                    query: this,
                    type: "updated",
                    action: t
                })
            })
        }
    };

function Rt(t, e) {
    return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: St(e.networkMode) ? "fetching" : "paused",
        ...t === void 0 && {
            error: null,
            status: "pending"
        }
    }
}

function rt(t, e) {
    return {
        data: t,
        dataUpdatedAt: e ?? Date.now(),
        error: null,
        isInvalidated: !1,
        status: "success"
    }
}

function at(t) {
    const e = typeof t.initialData == "function" ? t.initialData() : t.initialData,
        s = e !== void 0,
        i = s ? typeof t.initialDataUpdatedAt == "function" ? t.initialDataUpdatedAt() : t.initialDataUpdatedAt : 0;
    return {
        data: e,
        dataUpdateCount: 0,
        dataUpdatedAt: s ? i ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: !1,
        status: s ? "success" : "pending",
        fetchStatus: "idle"
    }
}
var Et = class extends A {
    constructor(t, e) {
        super(), this.options = e, this.#t = t, this.#r = null, this.#o = G(), this.bindMethods(), this.setOptions(e)
    }
    #t;
    #e = void 0;
    #s = void 0;
    #n = void 0;
    #i;
    #a;
    #o;
    #r;
    #m;
    #d;
    #f;
    #h;
    #l;
    #u;
    #p = new Set;
    bindMethods() {
        this.refetch = this.refetch.bind(this)
    }
    onSubscribe() {
        this.listeners.size === 1 && (this.#e.addObserver(this), ot(this.#e, this.options) ? this.#c() : this.updateResult(), this.#b())
    }
    onUnsubscribe() {
        this.hasListeners() || this.destroy()
    }
    shouldFetchOnReconnect() {
        return $(this.#e, this.options, this.options.refetchOnReconnect)
    }
    shouldFetchOnWindowFocus() {
        return $(this.#e, this.options, this.options.refetchOnWindowFocus)
    }
    destroy() {
        this.listeners = new Set, this.#C(), this.#O(), this.#e.removeObserver(this)
    }
    setOptions(t) {
        const e = this.options,
            s = this.#e;
        if (this.options = this.#t.defaultQueryOptions(t), this.options.enabled !== void 0 && typeof this.options.enabled != "boolean" && typeof this.options.enabled != "function" && typeof R(this.options.enabled, this.#e) != "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
        this.#S(), this.#e.setOptions(this.options), e._defaulted && !_(this.options, e) && this.#t.getQueryCache().notify({
            type: "observerOptionsUpdated",
            query: this.#e,
            observer: this
        });
        const i = this.hasListeners();
        i && ut(this.#e, s, this.options, e) && this.#c(), this.updateResult(), i && (this.#e !== s || R(this.options.enabled, this.#e) !== R(e.enabled, this.#e) || x(this.options.staleTime, this.#e) !== x(e.staleTime, this.#e)) && this.#y();
        const n = this.#g();
        i && (this.#e !== s || R(this.options.enabled, this.#e) !== R(e.enabled, this.#e) || n !== this.#u) && this.#v(n)
    }
    getOptimisticResult(t) {
        const e = this.#t.getQueryCache().build(this.#t, t),
            s = this.createResult(e, t);
        return ne(this, s) && (this.#n = s, this.#a = this.options, this.#i = this.#e.state), s
    }
    getCurrentResult() {
        return this.#n
    }
    trackResult(t, e) {
        return new Proxy(t, {
            get: (s, i) => (this.trackProp(i), e ?.(i), i === "promise" && (this.trackProp("data"), !this.options.experimental_prefetchInRender && this.#o.status === "pending" && this.#o.reject(new Error("experimental_prefetchInRender feature flag is not enabled"))), Reflect.get(s, i))
        })
    }
    trackProp(t) {
        this.#p.add(t)
    }
    getCurrentQuery() {
        return this.#e
    }
    refetch({ ...t
    } = {}) {
        return this.fetch({ ...t
        })
    }
    fetchOptimistic(t) {
        const e = this.#t.defaultQueryOptions(t),
            s = this.#t.getQueryCache().build(this.#t, e);
        return s.fetch().then(() => this.createResult(s, e))
    }
    fetch(t) {
        return this.#c({ ...t,
            cancelRefetch: t.cancelRefetch ?? !0
        }).then(() => (this.updateResult(), this.#n))
    }
    #c(t) {
        this.#S();
        let e = this.#e.fetch(this.options, t);
        return t ?.throwOnError || (e = e.catch(C)), e
    }
    #y() {
        this.#C();
        const t = x(this.options.staleTime, this.#e);
        if (I || this.#n.isStale || !H(t)) return;
        const s = gt(this.#n.dataUpdatedAt, t) + 1;
        this.#h = F.setTimeout(() => {
            this.#n.isStale || this.updateResult()
        }, s)
    }
    #g() {
        return (typeof this.options.refetchInterval == "function" ? this.options.refetchInterval(this.#e) : this.options.refetchInterval) ?? !1
    }
    #v(t) {
        this.#O(), this.#u = t, !(I || R(this.options.enabled, this.#e) === !1 || !H(this.#u) || this.#u === 0) && (this.#l = F.setInterval(() => {
            (this.options.refetchIntervalInBackground || Y.isFocused()) && this.#c()
        }, this.#u))
    }
    #b() {
        this.#y(), this.#v(this.#g())
    }
    #C() {
        this.#h && (F.clearTimeout(this.#h), this.#h = void 0)
    }
    #O() {
        this.#l && (F.clearInterval(this.#l), this.#l = void 0)
    }
    createResult(t, e) {
        const s = this.#e,
            i = this.options,
            n = this.#n,
            r = this.#i,
            o = this.#a,
            u = t !== s ? t.state : this.#s,
            {
                state: c
            } = t;
        let h = { ...c
            },
            f = !1,
            l;
        if (e._optimisticResults) {
            const M = this.hasListeners(),
                j = !M && ot(t, e),
                Q = M && ut(t, s, e, i);
            (j || Q) && (h = { ...h,
                ...Rt(c.data, t.options)
            }), e._optimisticResults === "isRestoring" && (h.fetchStatus = "idle")
        }
        let {
            error: y,
            errorUpdatedAt: p,
            status: d
        } = h;
        l = h.data;
        let g = !1;
        if (e.placeholderData !== void 0 && l === void 0 && d === "pending") {
            let M;
            n ?.isPlaceholderData && e.placeholderData === o ?.placeholderData ? (M = n.data, g = !0) : M = typeof e.placeholderData == "function" ? e.placeholderData(this.#f ?.state.data, this.#f) : e.placeholderData, M !== void 0 && (d = "success", l = B(n ?.data, M, e), f = !0)
        }
        if (e.select && l !== void 0 && !g)
            if (n && l === r ?.data && e.select === this.#m) l = this.#d;
            else try {
                this.#m = e.select, l = e.select(l), l = B(n ?.data, l, e), this.#d = l, this.#r = null
            } catch (M) {
                this.#r = M
            }
        this.#r && (y = this.#r, l = this.#d, p = Date.now(), d = "error");
        const m = h.fetchStatus === "fetching",
            b = d === "pending",
            w = d === "error",
            S = b && m,
            E = l !== void 0,
            P = {
                status: d,
                fetchStatus: h.fetchStatus,
                isPending: b,
                isSuccess: d === "success",
                isError: w,
                isInitialLoading: S,
                isLoading: S,
                data: l,
                dataUpdatedAt: h.dataUpdatedAt,
                error: y,
                errorUpdatedAt: p,
                failureCount: h.fetchFailureCount,
                failureReason: h.fetchFailureReason,
                errorUpdateCount: h.errorUpdateCount,
                isFetched: h.dataUpdateCount > 0 || h.errorUpdateCount > 0,
                isFetchedAfterMount: h.dataUpdateCount > u.dataUpdateCount || h.errorUpdateCount > u.errorUpdateCount,
                isFetching: m,
                isRefetching: m && !b,
                isLoadingError: w && !E,
                isPaused: h.fetchStatus === "paused",
                isPlaceholderData: f,
                isRefetchError: w && E,
                isStale: tt(t, e),
                refetch: this.refetch,
                promise: this.#o,
                isEnabled: R(e.enabled, t) !== !1
            };
        if (this.options.experimental_prefetchInRender) {
            const M = q => {
                    P.status === "error" ? q.reject(P.error) : P.data !== void 0 && q.resolve(P.data)
                },
                j = () => {
                    const q = this.#o = P.promise = G();
                    M(q)
                },
                Q = this.#o;
            switch (Q.status) {
                case "pending":
                    t.queryHash === s.queryHash && M(Q);
                    break;
                case "fulfilled":
                    (P.status === "error" || P.data !== Q.value) && j();
                    break;
                case "rejected":
                    (P.status !== "error" || P.error !== Q.reason) && j();
                    break
            }
        }
        return P
    }
    updateResult() {
        const t = this.#n,
            e = this.createResult(this.#e, this.options);
        if (this.#i = this.#e.state, this.#a = this.options, this.#i.data !== void 0 && (this.#f = this.#e), _(e, t)) return;
        this.#n = e;
        const s = () => {
            if (!t) return !0;
            const {
                notifyOnChangeProps: i
            } = this.options, n = typeof i == "function" ? i() : i;
            if (n === "all" || !n && !this.#p.size) return !0;
            const r = new Set(n ?? this.#p);
            return this.options.throwOnError && r.add("error"), Object.keys(this.#n).some(o => {
                const a = o;
                return this.#n[a] !== t[a] && r.has(a)
            })
        };
        this.#w({
            listeners: s()
        })
    }
    #S() {
        const t = this.#t.getQueryCache().build(this.#t, this.options);
        if (t === this.#e) return;
        const e = this.#e;
        this.#e = t, this.#s = t.state, this.hasListeners() && (e ?.removeObserver(this), t.addObserver(this))
    }
    onQueryUpdate() {
        this.updateResult(), this.hasListeners() && this.#b()
    }
    #w(t) {
        O.batch(() => {
            t.listeners && this.listeners.forEach(e => {
                e(this.#n)
            }), this.#t.getQueryCache().notify({
                query: this.#e,
                type: "observerResultsUpdated"
            })
        })
    }
};

function ie(t, e) {
    return R(e.enabled, t) !== !1 && t.state.data === void 0 && !(t.state.status === "error" && e.retryOnMount === !1)
}

function ot(t, e) {
    return ie(t, e) || t.state.data !== void 0 && $(t, e, e.refetchOnMount)
}

function $(t, e, s) {
    if (R(e.enabled, t) !== !1 && x(e.staleTime, t) !== "static") {
        const i = typeof s == "function" ? s(t) : s;
        return i === "always" || i !== !1 && tt(t, e)
    }
    return !1
}

function ut(t, e, s, i) {
    return (t !== e || R(i.enabled, t) === !1) && (!s.suspense || t.state.status !== "error") && tt(t, s)
}

function tt(t, e) {
    return R(e.enabled, t) !== !1 && t.isStaleByTime(x(e.staleTime, t))
}

function ne(t, e) {
    return !_(t.getCurrentResult(), e)
}

function K(t) {
    return {
        onFetch: (e, s) => {
            const i = e.options,
                n = e.fetchOptions ?.meta ?.fetchMore ?.direction,
                r = e.state.data ?.pages || [],
                o = e.state.data ?.pageParams || [];
            let a = {
                    pages: [],
                    pageParams: []
                },
                u = 0;
            const c = async () => {
                let h = !1;
                const f = p => {
                        Object.defineProperty(p, "signal", {
                            enumerable: !0,
                            get: () => (e.signal.aborted ? h = !0 : e.signal.addEventListener("abort", () => {
                                h = !0
                            }), e.signal)
                        })
                    },
                    l = bt(e.options, e.fetchOptions),
                    y = async (p, d, g) => {
                        if (h) return Promise.reject();
                        if (d == null && p.pages.length) return Promise.resolve(p);
                        const b = (() => {
                                const z = {
                                    client: e.client,
                                    queryKey: e.queryKey,
                                    pageParam: d,
                                    direction: g ? "backward" : "forward",
                                    meta: e.options.meta
                                };
                                return f(z), z
                            })(),
                            w = await l(b),
                            {
                                maxPages: S
                            } = e.options,
                            E = g ? Kt : Lt;
                        return {
                            pages: E(p.pages, w, S),
                            pageParams: E(p.pageParams, d, S)
                        }
                    };
                if (n && r.length) {
                    const p = n === "backward",
                        d = p ? Pt : J,
                        g = {
                            pages: r,
                            pageParams: o
                        },
                        m = d(i, g);
                    a = await y(g, m, p)
                } else {
                    const p = t ?? r.length;
                    do {
                        const d = u === 0 ? o[0] ?? i.initialPageParam : J(i, a);
                        if (u > 0 && d == null) break;
                        a = await y(a, d), u++
                    } while (u < p)
                }
                return a
            };
            e.options.persister ? e.fetchFn = () => e.options.persister ?.(c, {
                client: e.client,
                queryKey: e.queryKey,
                meta: e.options.meta,
                signal: e.signal
            }, s) : e.fetchFn = c
        }
    }
}

function J(t, {
    pages: e,
    pageParams: s
}) {
    const i = e.length - 1;
    return e.length > 0 ? t.getNextPageParam(e[i], e, s[i], s) : void 0
}

function Pt(t, {
    pages: e,
    pageParams: s
}) {
    return e.length > 0 ? t.getPreviousPageParam ?.(e[0], e, s[0], s) : void 0
}

function re(t, e) {
    return e ? J(t, e) != null : !1
}

function ae(t, e) {
    return !e || !t.getPreviousPageParam ? !1 : Pt(t, e) != null
}
var oe = class extends Et {
        constructor(t, e) {
            super(t, e)
        }
        bindMethods() {
            super.bindMethods(), this.fetchNextPage = this.fetchNextPage.bind(this), this.fetchPreviousPage = this.fetchPreviousPage.bind(this)
        }
        setOptions(t) {
            super.setOptions({ ...t,
                behavior: K()
            })
        }
        getOptimisticResult(t) {
            return t.behavior = K(), super.getOptimisticResult(t)
        }
        fetchNextPage(t) {
            return this.fetch({ ...t,
                meta: {
                    fetchMore: {
                        direction: "forward"
                    }
                }
            })
        }
        fetchPreviousPage(t) {
            return this.fetch({ ...t,
                meta: {
                    fetchMore: {
                        direction: "backward"
                    }
                }
            })
        }
        createResult(t, e) {
            const {
                state: s
            } = t, i = super.createResult(t, e), {
                isFetching: n,
                isRefetching: r,
                isError: o,
                isRefetchError: a
            } = i, u = s.fetchMeta ?.fetchMore ?.direction, c = o && u === "forward", h = n && u === "forward", f = o && u === "backward", l = n && u === "backward";
            return { ...i,
                fetchNextPage: this.fetchNextPage,
                fetchPreviousPage: this.fetchPreviousPage,
                hasNextPage: re(e, s.data),
                hasPreviousPage: ae(e, s.data),
                isFetchNextPageError: c,
                isFetchingNextPage: h,
                isFetchPreviousPageError: f,
                isFetchingPreviousPage: l,
                isRefetchError: a && !c && !f,
                isRefetching: r && !h && !l
            }
        }
    },
    ue = class extends Mt {
        #t;
        #e;
        #s;
        #n;
        constructor(t) {
            super(), this.#t = t.client, this.mutationId = t.mutationId, this.#s = t.mutationCache, this.#e = [], this.state = t.state || xt(), this.setOptions(t.options), this.scheduleGc()
        }
        setOptions(t) {
            this.options = t, this.updateGcTime(this.options.gcTime)
        }
        get meta() {
            return this.options.meta
        }
        addObserver(t) {
            this.#e.includes(t) || (this.#e.push(t), this.clearGcTimeout(), this.#s.notify({
                type: "observerAdded",
                mutation: this,
                observer: t
            }))
        }
        removeObserver(t) {
            this.#e = this.#e.filter(e => e !== t), this.scheduleGc(), this.#s.notify({
                type: "observerRemoved",
                mutation: this,
                observer: t
            })
        }
        optionalRemove() {
            this.#e.length || (this.state.status === "pending" ? this.scheduleGc() : this.#s.remove(this))
        }
        continue () {
            return this.#n ?.continue() ?? this.execute(this.state.variables)
        }
        async execute(t) {
            const e = () => {
                    this.#i({
                        type: "continue"
                    })
                },
                s = {
                    client: this.#t,
                    meta: this.options.meta,
                    mutationKey: this.options.mutationKey
                };
            this.#n = wt({
                fn: () => this.options.mutationFn ? this.options.mutationFn(t, s) : Promise.reject(new Error("No mutationFn found")),
                onFail: (r, o) => {
                    this.#i({
                        type: "failed",
                        failureCount: r,
                        error: o
                    })
                },
                onPause: () => {
                    this.#i({
                        type: "pause"
                    })
                },
                onContinue: e,
                retry: this.options.retry ?? 0,
                retryDelay: this.options.retryDelay,
                networkMode: this.options.networkMode,
                canRun: () => this.#s.canRun(this)
            });
            const i = this.state.status === "pending",
                n = !this.#n.canStart();
            try {
                if (i) e();
                else {
                    this.#i({
                        type: "pending",
                        variables: t,
                        isPaused: n
                    }), await this.#s.config.onMutate ?.(t, this, s);
                    const o = await this.options.onMutate ?.(t, s);
                    o !== this.state.context && this.#i({
                        type: "pending",
                        context: o,
                        variables: t,
                        isPaused: n
                    })
                }
                const r = await this.#n.start();
                return await this.#s.config.onSuccess ?.(r, t, this.state.context, this, s), await this.options.onSuccess ?.(r, t, this.state.context, s), await this.#s.config.onSettled ?.(r, null, this.state.variables, this.state.context, this, s), await this.options.onSettled ?.(r, null, t, this.state.context, s), this.#i({
                    type: "success",
                    data: r
                }), r
            } catch (r) {
                try {
                    throw await this.#s.config.onError ?.(r, t, this.state.context, this, s), await this.options.onError ?.(r, t, this.state.context, s), await this.#s.config.onSettled ?.(void 0, r, this.state.variables, this.state.context, this, s), await this.options.onSettled ?.(void 0, r, t, this.state.context, s), r
                } finally {
                    this.#i({
                        type: "error",
                        error: r
                    })
                }
            } finally {
                this.#s.runNext(this)
            }
        }
        #i(t) {
            const e = s => {
                switch (t.type) {
                    case "failed":
                        return { ...s,
                            failureCount: t.failureCount,
                            failureReason: t.error
                        };
                    case "pause":
                        return { ...s,
                            isPaused: !0
                        };
                    case "continue":
                        return { ...s,
                            isPaused: !1
                        };
                    case "pending":
                        return { ...s,
                            context: t.context,
                            data: void 0,
                            failureCount: 0,
                            failureReason: null,
                            error: null,
                            isPaused: t.isPaused,
                            status: "pending",
                            variables: t.variables,
                            submittedAt: Date.now()
                        };
                    case "success":
                        return { ...s,
                            data: t.data,
                            failureCount: 0,
                            failureReason: null,
                            error: null,
                            status: "success",
                            isPaused: !1
                        };
                    case "error":
                        return { ...s,
                            data: void 0,
                            error: t.error,
                            failureCount: s.failureCount + 1,
                            failureReason: t.error,
                            isPaused: !1,
                            status: "error"
                        }
                }
            };
            this.state = e(this.state), O.batch(() => {
                this.#e.forEach(s => {
                    s.onMutationUpdate(t)
                }), this.#s.notify({
                    mutation: this,
                    type: "updated",
                    action: t
                })
            })
        }
    };

function xt() {
    return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: !1,
        status: "idle",
        variables: void 0,
        submittedAt: 0
    }
}
var he = class extends A {
    constructor(t = {}) {
        super(), this.config = t, this.#t = new Set, this.#e = new Map, this.#s = 0
    }
    #t;
    #e;
    #s;
    build(t, e, s) {
        const i = new ue({
            client: t,
            mutationCache: this,
            mutationId: ++this.#s,
            options: t.defaultMutationOptions(e),
            state: s
        });
        return this.add(i), i
    }
    add(t) {
        this.#t.add(t);
        const e = U(t);
        if (typeof e == "string") {
            const s = this.#e.get(e);
            s ? s.push(t) : this.#e.set(e, [t])
        }
        this.notify({
            type: "added",
            mutation: t
        })
    }
    remove(t) {
        if (this.#t.delete(t)) {
            const e = U(t);
            if (typeof e == "string") {
                const s = this.#e.get(e);
                if (s)
                    if (s.length > 1) {
                        const i = s.indexOf(t);
                        i !== -1 && s.splice(i, 1)
                    } else s[0] === t && this.#e.delete(e)
            }
        }
        this.notify({
            type: "removed",
            mutation: t
        })
    }
    canRun(t) {
        const e = U(t);
        if (typeof e == "string") {
            const i = this.#e.get(e) ?.find(n => n.state.status === "pending");
            return !i || i === t
        } else return !0
    }
    runNext(t) {
        const e = U(t);
        return typeof e == "string" ? this.#e.get(e) ?.find(i => i !== t && i.state.isPaused) ?.continue() ?? Promise.resolve() : Promise.resolve()
    }
    clear() {
        O.batch(() => {
            this.#t.forEach(t => {
                this.notify({
                    type: "removed",
                    mutation: t
                })
            }), this.#t.clear(), this.#e.clear()
        })
    }
    getAll() {
        return Array.from(this.#t)
    }
    find(t) {
        const e = {
            exact: !0,
            ...t
        };
        return this.getAll().find(s => st(e, s))
    }
    findAll(t = {}) {
        return this.getAll().filter(e => st(t, e))
    }
    notify(t) {
        O.batch(() => {
            this.listeners.forEach(e => {
                e(t)
            })
        })
    }
    resumePausedMutations() {
        const t = this.getAll().filter(e => e.state.isPaused);
        return O.batch(() => Promise.all(t.map(e => e.continue().catch(C))))
    }
};

function U(t) {
    return t.options.scope ?.id
}
var le = class extends A {
        #t;
        #e = void 0;
        #s;
        #n;
        constructor(t, e) {
            super(), this.#t = t, this.setOptions(e), this.bindMethods(), this.#i()
        }
        bindMethods() {
            this.mutate = this.mutate.bind(this), this.reset = this.reset.bind(this)
        }
        setOptions(t) {
            const e = this.options;
            this.options = this.#t.defaultMutationOptions(t), _(this.options, e) || this.#t.getMutationCache().notify({
                type: "observerOptionsUpdated",
                mutation: this.#s,
                observer: this
            }), e ?.mutationKey && this.options.mutationKey && D(e.mutationKey) !== D(this.options.mutationKey) ? this.reset() : this.#s ?.state.status === "pending" && this.#s.setOptions(this.options)
        }
        onUnsubscribe() {
            this.hasListeners() || this.#s ?.removeObserver(this)
        }
        onMutationUpdate(t) {
            this.#i(), this.#a(t)
        }
        getCurrentResult() {
            return this.#e
        }
        reset() {
            this.#s ?.removeObserver(this), this.#s = void 0, this.#i(), this.#a()
        }
        mutate(t, e) {
            return this.#n = e, this.#s ?.removeObserver(this), this.#s = this.#t.getMutationCache().build(this.#t, this.options), this.#s.addObserver(this), this.#s.execute(t)
        }
        #i() {
            const t = this.#s ?.state ?? xt();
            this.#e = { ...t,
                isPending: t.status === "pending",
                isSuccess: t.status === "success",
                isError: t.status === "error",
                isIdle: t.status === "idle",
                mutate: this.mutate,
                reset: this.reset
            }
        }
        #a(t) {
            O.batch(() => {
                if (this.#n && this.hasListeners()) {
                    const e = this.#e.variables,
                        s = this.#e.context,
                        i = {
                            client: this.#t,
                            meta: this.options.meta,
                            mutationKey: this.options.mutationKey
                        };
                    t ?.type === "success" ? (this.#n.onSuccess ?.(t.data, e, s, i), this.#n.onSettled ?.(t.data, null, e, s, i)) : t ?.type === "error" && (this.#n.onError ?.(t.error, e, s, i), this.#n.onSettled ?.(void 0, t.error, e, s, i))
                }
                this.listeners.forEach(e => {
                    e(this.#e)
                })
            })
        }
    },
    ce = class extends A {
        constructor(t = {}) {
            super(), this.config = t, this.#t = new Map
        }
        #t;
        build(t, e, s) {
            const i = e.queryKey,
                n = e.queryHash ?? Z(i, e);
            let r = this.get(n);
            return r || (r = new se({
                client: t,
                queryKey: i,
                queryHash: n,
                options: t.defaultQueryOptions(e),
                state: s,
                defaultOptions: t.getQueryDefaults(i)
            }), this.add(r)), r
        }
        add(t) {
            this.#t.has(t.queryHash) || (this.#t.set(t.queryHash, t), this.notify({
                type: "added",
                query: t
            }))
        }
        remove(t) {
            const e = this.#t.get(t.queryHash);
            e && (t.destroy(), e === t && this.#t.delete(t.queryHash), this.notify({
                type: "removed",
                query: t
            }))
        }
        clear() {
            O.batch(() => {
                this.getAll().forEach(t => {
                    this.remove(t)
                })
            })
        }
        get(t) {
            return this.#t.get(t)
        }
        getAll() {
            return [...this.#t.values()]
        }
        find(t) {
            const e = {
                exact: !0,
                ...t
            };
            return this.getAll().find(s => et(e, s))
        }
        findAll(t = {}) {
            const e = this.getAll();
            return Object.keys(t).length > 0 ? e.filter(s => et(t, s)) : e
        }
        notify(t) {
            O.batch(() => {
                this.listeners.forEach(e => {
                    e(t)
                })
            })
        }
        onFocus() {
            O.batch(() => {
                this.getAll().forEach(t => {
                    t.onFocus()
                })
            })
        }
        onOnline() {
            O.batch(() => {
                this.getAll().forEach(t => {
                    t.onOnline()
                })
            })
        }
    },
    Ue = class {
        #t;
        #e;
        #s;
        #n;
        #i;
        #a;
        #o;
        #r;
        constructor(t = {}) {
            this.#t = t.queryCache || new ce, this.#e = t.mutationCache || new he, this.#s = t.defaultOptions || {}, this.#n = new Map, this.#i = new Map, this.#a = 0
        }
        mount() {
            this.#a++, this.#a === 1 && (this.#o = Y.subscribe(async t => {
                t && (await this.resumePausedMutations(), this.#t.onFocus())
            }), this.#r = L.subscribe(async t => {
                t && (await this.resumePausedMutations(), this.#t.onOnline())
            }))
        }
        unmount() {
            this.#a--, this.#a === 0 && (this.#o ?.(), this.#o = void 0, this.#r ?.(), this.#r = void 0)
        }
        isFetching(t) {
            return this.#t.findAll({ ...t,
                fetchStatus: "fetching"
            }).length
        }
        isMutating(t) {
            return this.#e.findAll({ ...t,
                status: "pending"
            }).length
        }
        getQueryData(t) {
            const e = this.defaultQueryOptions({
                queryKey: t
            });
            return this.#t.get(e.queryHash) ?.state.data
        }
        ensureQueryData(t) {
            const e = this.defaultQueryOptions(t),
                s = this.#t.build(this, e),
                i = s.state.data;
            return i === void 0 ? this.fetchQuery(t) : (t.revalidateIfStale && s.isStaleByTime(x(e.staleTime, s)) && this.prefetchQuery(e), Promise.resolve(i))
        }
        getQueriesData(t) {
            return this.#t.findAll(t).map(({
                queryKey: e,
                state: s
            }) => {
                const i = s.data;
                return [e, i]
            })
        }
        setQueryData(t, e, s) {
            const i = this.defaultQueryOptions({
                    queryKey: t
                }),
                r = this.#t.get(i.queryHash) ?.state.data,
                o = qt(e, r);
            if (o !== void 0) return this.#t.build(this, i).setData(o, { ...s,
                manual: !0
            })
        }
        setQueriesData(t, e, s) {
            return O.batch(() => this.#t.findAll(t).map(({
                queryKey: i
            }) => [i, this.setQueryData(i, e, s)]))
        }
        getQueryState(t) {
            const e = this.defaultQueryOptions({
                queryKey: t
            });
            return this.#t.get(e.queryHash) ?.state
        }
        removeQueries(t) {
            const e = this.#t;
            O.batch(() => {
                e.findAll(t).forEach(s => {
                    e.remove(s)
                })
            })
        }
        resetQueries(t, e) {
            const s = this.#t;
            return O.batch(() => (s.findAll(t).forEach(i => {
                i.reset()
            }), this.refetchQueries({
                type: "active",
                ...t
            }, e)))
        }
        cancelQueries(t, e = {}) {
            const s = {
                    revert: !0,
                    ...e
                },
                i = O.batch(() => this.#t.findAll(t).map(n => n.cancel(s)));
            return Promise.all(i).then(C).catch(C)
        }
        invalidateQueries(t, e = {}) {
            return O.batch(() => (this.#t.findAll(t).forEach(s => {
                s.invalidate()
            }), t ?.refetchType === "none" ? Promise.resolve() : this.refetchQueries({ ...t,
                type: t ?.refetchType ?? t ?.type ?? "active"
            }, e)))
        }
        refetchQueries(t, e = {}) {
            const s = { ...e,
                    cancelRefetch: e.cancelRefetch ?? !0
                },
                i = O.batch(() => this.#t.findAll(t).filter(n => !n.isDisabled() && !n.isStatic()).map(n => {
                    let r = n.fetch(void 0, s);
                    return s.throwOnError || (r = r.catch(C)), n.state.fetchStatus === "paused" ? Promise.resolve() : r
                }));
            return Promise.all(i).then(C)
        }
        fetchQuery(t) {
            const e = this.defaultQueryOptions(t);
            e.retry === void 0 && (e.retry = !1);
            const s = this.#t.build(this, e);
            return s.isStaleByTime(x(e.staleTime, s)) ? s.fetch(e) : Promise.resolve(s.state.data)
        }
        prefetchQuery(t) {
            return this.fetchQuery(t).then(C).catch(C)
        }
        fetchInfiniteQuery(t) {
            return t.behavior = K(t.pages), this.fetchQuery(t)
        }
        prefetchInfiniteQuery(t) {
            return this.fetchInfiniteQuery(t).then(C).catch(C)
        }
        ensureInfiniteQueryData(t) {
            return t.behavior = K(t.pages), this.ensureQueryData(t)
        }
        resumePausedMutations() {
            return L.isOnline() ? this.#e.resumePausedMutations() : Promise.resolve()
        }
        getQueryCache() {
            return this.#t
        }
        getMutationCache() {
            return this.#e
        }
        getDefaultOptions() {
            return this.#s
        }
        setDefaultOptions(t) {
            this.#s = t
        }
        setQueryDefaults(t, e) {
            this.#n.set(D(t), {
                queryKey: t,
                defaultOptions: e
            })
        }
        getQueryDefaults(t) {
            const e = [...this.#n.values()],
                s = {};
            return e.forEach(i => {
                k(t, i.queryKey) && Object.assign(s, i.defaultOptions)
            }), s
        }
        setMutationDefaults(t, e) {
            this.#i.set(D(t), {
                mutationKey: t,
                defaultOptions: e
            })
        }
        getMutationDefaults(t) {
            const e = [...this.#i.values()],
                s = {};
            return e.forEach(i => {
                k(t, i.mutationKey) && Object.assign(s, i.defaultOptions)
            }), s
        }
        defaultQueryOptions(t) {
            if (t._defaulted) return t;
            const e = { ...this.#s.queries,
                ...this.getQueryDefaults(t.queryKey),
                ...t,
                _defaulted: !0
            };
            return e.queryHash || (e.queryHash = Z(e.queryKey, e)), e.refetchOnReconnect === void 0 && (e.refetchOnReconnect = e.networkMode !== "always"), e.throwOnError === void 0 && (e.throwOnError = !!e.suspense), !e.networkMode && e.persister && (e.networkMode = "offlineFirst"), e.queryFn === X && (e.enabled = !1), e
        }
        defaultMutationOptions(t) {
            return t ?._defaulted ? t : { ...this.#s.mutations,
                ...t ?.mutationKey && this.getMutationDefaults(t.mutationKey),
                ...t,
                _defaulted : !0
            }
        }
        clear() {
            this.#t.clear(), this.#e.clear()
        }
    },
    Ft = v.createContext(void 0),
    It = t => {
        const e = v.useContext(Ft);
        if (!e) throw new Error("No QueryClient set, use QueryClientProvider to set one");
        return e
    },
    de = ({
        client: t,
        children: e
    }) => (v.useEffect(() => (t.mount(), () => {
        t.unmount()
    }), [t]), N.jsx(Ft.Provider, {
        value: t,
        children: e
    })),
    Dt = v.createContext(!1),
    fe = () => v.useContext(Dt),
    pe = Dt.Provider;

function me() {
    let t = !1;
    return {
        clearReset: () => {
            t = !1
        },
        reset: () => {
            t = !0
        },
        isReset: () => t
    }
}
var ye = v.createContext(me()),
    ge = () => v.useContext(ye),
    ve = (t, e) => {
        (t.suspense || t.throwOnError || t.experimental_prefetchInRender) && (e.isReset() || (t.retryOnMount = !1))
    },
    be = t => {
        v.useEffect(() => {
            t.clearReset()
        }, [t])
    },
    Ce = ({
        result: t,
        errorResetBoundary: e,
        throwOnError: s,
        query: i,
        suspense: n
    }) => t.isError && !e.isReset() && !t.isFetching && i && (n && t.data === void 0 || Ct(s, [t.error, i])),
    Oe = t => {
        if (t.suspense) {
            const s = n => n === "static" ? n : Math.max(n ?? 1e3, 1e3),
                i = t.staleTime;
            t.staleTime = typeof i == "function" ? (...n) => s(i(...n)) : s(i), typeof t.gcTime == "number" && (t.gcTime = Math.max(t.gcTime, 1e3))
        }
    },
    Se = (t, e) => t.isLoading && t.isFetching && !e,
    we = (t, e) => t ?.suspense && e.isPending,
    ht = (t, e, s) => e.fetchOptimistic(t).catch(() => {
        s.clearReset()
    });

function Qt(t, e, s) {
    const i = fe(),
        n = ge(),
        r = It(),
        o = r.defaultQueryOptions(t);
    r.getDefaultOptions().queries ?._experimental_beforeQuery ?.(o), o._optimisticResults = i ? "isRestoring" : "optimistic", Oe(o), ve(o, n), be(n);
    const a = !r.getQueryCache().get(o.queryHash),
        [u] = v.useState(() => new e(r, o)),
        c = u.getOptimisticResult(o),
        h = !i && t.subscribed !== !1;
    if (v.useSyncExternalStore(v.useCallback(f => {
            const l = h ? u.subscribe(O.batchCalls(f)) : C;
            return u.updateResult(), l
        }, [u, h]), () => u.getCurrentResult(), () => u.getCurrentResult()), v.useEffect(() => {
            u.setOptions(o)
        }, [o, u]), we(o, c)) throw ht(o, u, n);
    if (Ce({
            result: c,
            errorResetBoundary: n,
            throwOnError: o.throwOnError,
            query: r.getQueryCache().get(o.queryHash),
            suspense: o.suspense
        })) throw c.error;
    return r.getDefaultOptions().queries ?._experimental_afterQuery ?.(o, c), o.experimental_prefetchInRender && !I && Se(c, i) && (a ? ht(o, u, n) : r.getQueryCache().get(o.queryHash) ?.promise) ?.catch(C).finally(() => {
        u.updateResult()
    }), o.notifyOnChangeProps ? c : u.trackResult(c)
}

function _e(t, e) {
    return Qt(t, Et)
}

function Le(t, e) {
    const s = It(),
        [i] = v.useState(() => new le(s, t));
    v.useEffect(() => {
        i.setOptions(t)
    }, [i, t]);
    const n = v.useSyncExternalStore(v.useCallback(o => i.subscribe(O.batchCalls(o)), [i]), () => i.getCurrentResult(), () => i.getCurrentResult()),
        r = v.useCallback((o, a) => {
            i.mutate(o, a).catch(C)
        }, [i]);
    if (n.error && Ct(i.options.throwOnError, [n.error])) throw n.error;
    return { ...n,
        mutate: r,
        mutateAsync: n.mutate
    }
}

function Ke(t, e) {
    return Qt(t, oe)
}
var Me = ["added", "removed", "updated"];

function lt(t) {
    return Me.includes(t)
}
async function Re({
    queryClient: t,
    persister: e,
    maxAge: s = 1e3 * 60 * 60 * 24,
    buster: i = "",
    hydrateOptions: n
}) {
    try {
        const r = await e.restoreClient();
        if (r)
            if (r.timestamp) {
                const o = Date.now() - r.timestamp > s,
                    a = r.buster !== i;
                if (o || a) return e.removeClient();
                Zt(t, r.clientState, n)
            } else return e.removeClient()
    } catch (r) {
        throw await e.removeClient(), r
    }
}
async function ct({
    queryClient: t,
    persister: e,
    buster: s = "",
    dehydrateOptions: i
}) {
    const n = {
        buster: s,
        timestamp: Date.now(),
        clientState: Jt(t, i)
    };
    await e.persistClient(n)
}

function Ee(t) {
    const e = t.queryClient.getQueryCache().subscribe(i => {
            lt(i.type) && ct(t)
        }),
        s = t.queryClient.getMutationCache().subscribe(i => {
            lt(i.type) && ct(t)
        });
    return () => {
        e(), s()
    }
}
var Ne = ({
    children: t,
    persistOptions: e,
    onSuccess: s,
    onError: i,
    ...n
}) => {
    const [r, o] = v.useState(!0), a = v.useRef({
        persistOptions: e,
        onSuccess: s,
        onError: i
    }), u = v.useRef(!1);
    return v.useEffect(() => {
        a.current = {
            persistOptions: e,
            onSuccess: s,
            onError: i
        }
    }), v.useEffect(() => {
        const c = { ...a.current.persistOptions,
            queryClient: n.client
        };
        return u.current || (u.current = !0, Re(c).then(() => a.current.onSuccess ?.()).catch(() => a.current.onError ?.()).finally(() => {
            o(!1)
        })), r ? void 0 : Ee(c)
    }, [n.client, r]), N.jsx(de, { ...n,
        children: N.jsx(pe, {
            value: r,
            children: t
        })
    })
};

function T(t, e, s) {
    let i = s.initialDeps ?? [],
        n, r = !0;

    function o() {
        var a, u, c;
        let h;
        s.key && ((a = s.debug) != null && a.call(s)) && (h = Date.now());
        const f = t();
        if (!(f.length !== i.length || f.some((p, d) => i[d] !== p))) return n;
        i = f;
        let y;
        if (s.key && ((u = s.debug) != null && u.call(s)) && (y = Date.now()), n = e(...f), s.key && ((c = s.debug) != null && c.call(s))) {
            const p = Math.round((Date.now() - h) * 100) / 100,
                d = Math.round((Date.now() - y) * 100) / 100,
                g = d / 16,
                m = (b, w) => {
                    for (b = String(b); b.length < w;) b = " " + b;
                    return b
                };
            console.info(`%c⏱ ${m(d,5)} /${m(p,5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0,Math.min(120-120*g,120))}deg 100% 31%);`, s ?.key)
        }
        return s ?.onChange && !(r && s.skipInitialOnChange) && s.onChange(n), r = !1, n
    }
    return o.updateDeps = a => {
        i = a
    }, o
}

function dt(t, e) {
    if (t === void 0) throw new Error("Unexpected undefined");
    return t
}
const Pe = (t, e) => Math.abs(t - e) < 1.01,
    xe = (t, e, s) => {
        let i;
        return function(...n) {
            t.clearTimeout(i), i = t.setTimeout(() => e.apply(this, n), s)
        }
    },
    ft = t => {
        const {
            offsetWidth: e,
            offsetHeight: s
        } = t;
        return {
            width: e,
            height: s
        }
    },
    Fe = t => t,
    Ie = t => {
        const e = Math.max(t.startIndex - t.overscan, 0),
            s = Math.min(t.endIndex + t.overscan, t.count - 1),
            i = [];
        for (let n = e; n <= s; n++) i.push(n);
        return i
    },
    De = (t, e) => {
        const s = t.scrollElement;
        if (!s) return;
        const i = t.targetWindow;
        if (!i) return;
        const n = o => {
            const {
                width: a,
                height: u
            } = o;
            e({
                width: Math.round(a),
                height: Math.round(u)
            })
        };
        if (n(ft(s)), !i.ResizeObserver) return () => {};
        const r = new i.ResizeObserver(o => {
            const a = () => {
                const u = o[0];
                if (u ?.borderBoxSize) {
                    const c = u.borderBoxSize[0];
                    if (c) {
                        n({
                            width: c.inlineSize,
                            height: c.blockSize
                        });
                        return
                    }
                }
                n(ft(s))
            };
            t.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(a) : a()
        });
        return r.observe(s, {
            box: "border-box"
        }), () => {
            r.unobserve(s)
        }
    },
    pt = {
        passive: !0
    },
    mt = typeof window > "u" ? !0 : "onscrollend" in window,
    Qe = (t, e) => {
        const s = t.scrollElement;
        if (!s) return;
        const i = t.targetWindow;
        if (!i) return;
        let n = 0;
        const r = t.options.useScrollendEvent && mt ? () => {} : xe(i, () => {
                e(n, !1)
            }, t.options.isScrollingResetDelay),
            o = h => () => {
                const {
                    horizontal: f,
                    isRtl: l
                } = t.options;
                n = f ? s.scrollLeft * (l && -1 || 1) : s.scrollTop, r(), e(n, h)
            },
            a = o(!0),
            u = o(!1);
        u(), s.addEventListener("scroll", a, pt);
        const c = t.options.useScrollendEvent && mt;
        return c && s.addEventListener("scrollend", u, pt), () => {
            s.removeEventListener("scroll", a), c && s.removeEventListener("scrollend", u)
        }
    },
    Te = (t, e, s) => {
        if (e ?.borderBoxSize) {
            const i = e.borderBoxSize[0];
            if (i) return Math.round(i[s.options.horizontal ? "inlineSize" : "blockSize"])
        }
        return t[s.options.horizontal ? "offsetWidth" : "offsetHeight"]
    },
    Ae = (t, {
        adjustments: e = 0,
        behavior: s
    }, i) => {
        var n, r;
        const o = t + e;
        (r = (n = i.scrollElement) == null ? void 0 : n.scrollTo) == null || r.call(n, {
            [i.options.horizontal ? "left" : "top"]: o,
            behavior: s
        })
    };
class ze {
    constructor(e) {
        this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = !1, this.measurementsCache = [], this.itemSizeCache = new Map, this.laneAssignments = new Map, this.pendingMeasuredCacheIndexes = [], this.prevLanes = void 0, this.lanesChangedFlag = !1, this.lanesSettling = !1, this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this.elementsCache = new Map, this.observer = (() => {
            let s = null;
            const i = () => s || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : s = new this.targetWindow.ResizeObserver(n => {
                n.forEach(r => {
                    const o = () => {
                        this._measureElement(r.target, r)
                    };
                    this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(o) : o()
                })
            }));
            return {
                disconnect: () => {
                    var n;
                    (n = i()) == null || n.disconnect(), s = null
                },
                observe: n => {
                    var r;
                    return (r = i()) == null ? void 0 : r.observe(n, {
                        box: "border-box"
                    })
                },
                unobserve: n => {
                    var r;
                    return (r = i()) == null ? void 0 : r.unobserve(n)
                }
            }
        })(), this.range = null, this.setOptions = s => {
            Object.entries(s).forEach(([i, n]) => {
                typeof n > "u" && delete s[i]
            }), this.options = {
                debug: !1,
                initialOffset: 0,
                overscan: 1,
                paddingStart: 0,
                paddingEnd: 0,
                scrollPaddingStart: 0,
                scrollPaddingEnd: 0,
                horizontal: !1,
                getItemKey: Fe,
                rangeExtractor: Ie,
                onChange: () => {},
                measureElement: Te,
                initialRect: {
                    width: 0,
                    height: 0
                },
                scrollMargin: 0,
                gap: 0,
                indexAttribute: "data-index",
                initialMeasurementsCache: [],
                lanes: 1,
                isScrollingResetDelay: 150,
                enabled: !0,
                isRtl: !1,
                useScrollendEvent: !1,
                useAnimationFrameWithResizeObserver: !1,
                ...s
            }
        }, this.notify = s => {
            var i, n;
            (n = (i = this.options).onChange) == null || n.call(i, this, s)
        }, this.maybeNotify = T(() => (this.calculateRange(), [this.isScrolling, this.range ? this.range.startIndex : null, this.range ? this.range.endIndex : null]), s => {
            this.notify(s)
        }, {
            key: !1,
            debug: () => this.options.debug,
            initialDeps: [this.isScrolling, this.range ? this.range.startIndex : null, this.range ? this.range.endIndex : null]
        }), this.cleanup = () => {
            this.unsubs.filter(Boolean).forEach(s => s()), this.unsubs = [], this.observer.disconnect(), this.scrollElement = null, this.targetWindow = null
        }, this._didMount = () => () => {
            this.cleanup()
        }, this._willUpdate = () => {
            var s;
            const i = this.options.enabled ? this.options.getScrollElement() : null;
            if (this.scrollElement !== i) {
                if (this.cleanup(), !i) {
                    this.maybeNotify();
                    return
                }
                this.scrollElement = i, this.scrollElement && "ownerDocument" in this.scrollElement ? this.targetWindow = this.scrollElement.ownerDocument.defaultView : this.targetWindow = ((s = this.scrollElement) == null ? void 0 : s.window) ?? null, this.elementsCache.forEach(n => {
                    this.observer.observe(n)
                }), this._scrollToOffset(this.getScrollOffset(), {
                    adjustments: void 0,
                    behavior: void 0
                }), this.unsubs.push(this.options.observeElementRect(this, n => {
                    this.scrollRect = n, this.maybeNotify()
                })), this.unsubs.push(this.options.observeElementOffset(this, (n, r) => {
                    this.scrollAdjustments = 0, this.scrollDirection = r ? this.getScrollOffset() < n ? "forward" : "backward" : null, this.scrollOffset = n, this.isScrolling = r, this.maybeNotify()
                }))
            }
        }, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getFurthestMeasurement = (s, i) => {
            const n = new Map,
                r = new Map;
            for (let o = i - 1; o >= 0; o--) {
                const a = s[o];
                if (n.has(a.lane)) continue;
                const u = r.get(a.lane);
                if (u == null || a.end > u.end ? r.set(a.lane, a) : a.end < u.end && n.set(a.lane, !0), n.size === this.options.lanes) break
            }
            return r.size === this.options.lanes ? Array.from(r.values()).sort((o, a) => o.end === a.end ? o.index - a.index : o.end - a.end)[0] : void 0
        }, this.getMeasurementOptions = T(() => [this.options.count, this.options.paddingStart, this.options.scrollMargin, this.options.getItemKey, this.options.enabled, this.options.lanes], (s, i, n, r, o, a) => (this.prevLanes !== void 0 && this.prevLanes !== a && (this.lanesChangedFlag = !0), this.prevLanes = a, this.pendingMeasuredCacheIndexes = [], {
            count: s,
            paddingStart: i,
            scrollMargin: n,
            getItemKey: r,
            enabled: o,
            lanes: a
        }), {
            key: !1,
            skipInitialOnChange: !0,
            onChange: () => {
                this.notify(this.isScrolling)
            }
        }), this.getMeasurements = T(() => [this.getMeasurementOptions(), this.itemSizeCache], ({
            count: s,
            paddingStart: i,
            scrollMargin: n,
            getItemKey: r,
            enabled: o,
            lanes: a
        }, u) => {
            if (!o) return this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
            if (this.laneAssignments.size > s)
                for (const l of this.laneAssignments.keys()) l >= s && this.laneAssignments.delete(l);
            this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMeasuredCacheIndexes = []), this.measurementsCache.length === 0 && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach(l => {
                this.itemSizeCache.set(l.key, l.size)
            }));
            const c = this.lanesSettling ? 0 : this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
            this.pendingMeasuredCacheIndexes = [], this.lanesSettling && this.measurementsCache.length === s && (this.lanesSettling = !1);
            const h = this.measurementsCache.slice(0, c),
                f = new Array(a).fill(void 0);
            for (let l = 0; l < c; l++) {
                const y = h[l];
                y && (f[y.lane] = l)
            }
            for (let l = c; l < s; l++) {
                const y = r(l),
                    p = this.laneAssignments.get(l);
                let d, g;
                if (p !== void 0 && this.options.lanes > 1) {
                    d = p;
                    const S = f[d],
                        E = S !== void 0 ? h[S] : void 0;
                    g = E ? E.end + this.options.gap : i + n
                } else {
                    const S = this.options.lanes === 1 ? h[l - 1] : this.getFurthestMeasurement(h, l);
                    g = S ? S.end + this.options.gap : i + n, d = S ? S.lane : l % this.options.lanes, this.options.lanes > 1 && this.laneAssignments.set(l, d)
                }
                const m = u.get(y),
                    b = typeof m == "number" ? m : this.options.estimateSize(l),
                    w = g + b;
                h[l] = {
                    index: l,
                    start: g,
                    size: b,
                    end: w,
                    key: y,
                    lane: d
                }, f[d] = l
            }
            return this.measurementsCache = h, h
        }, {
            key: !1,
            debug: () => this.options.debug
        }), this.calculateRange = T(() => [this.getMeasurements(), this.getSize(), this.getScrollOffset(), this.options.lanes], (s, i, n, r) => this.range = s.length > 0 && i > 0 ? ke({
            measurements: s,
            outerSize: i,
            scrollOffset: n,
            lanes: r
        }) : null, {
            key: !1,
            debug: () => this.options.debug
        }), this.getVirtualIndexes = T(() => {
            let s = null,
                i = null;
            const n = this.calculateRange();
            return n && (s = n.startIndex, i = n.endIndex), this.maybeNotify.updateDeps([this.isScrolling, s, i]), [this.options.rangeExtractor, this.options.overscan, this.options.count, s, i]
        }, (s, i, n, r, o) => r === null || o === null ? [] : s({
            startIndex: r,
            endIndex: o,
            overscan: i,
            count: n
        }), {
            key: !1,
            debug: () => this.options.debug
        }), this.indexFromElement = s => {
            const i = this.options.indexAttribute,
                n = s.getAttribute(i);
            return n ? parseInt(n, 10) : (console.warn(`Missing attribute name '${i}={index}' on measured element.`), -1)
        }, this._measureElement = (s, i) => {
            const n = this.indexFromElement(s),
                r = this.measurementsCache[n];
            if (!r) return;
            const o = r.key,
                a = this.elementsCache.get(o);
            a !== s && (a && this.observer.unobserve(a), this.observer.observe(s), this.elementsCache.set(o, s)), s.isConnected && this.resizeItem(n, this.options.measureElement(s, i, this))
        }, this.resizeItem = (s, i) => {
            const n = this.measurementsCache[s];
            if (!n) return;
            const r = this.itemSizeCache.get(n.key) ?? n.size,
                o = i - r;
            o !== 0 && ((this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(n, o, this) : n.start < this.getScrollOffset() + this.scrollAdjustments) && this._scrollToOffset(this.getScrollOffset(), {
                adjustments: this.scrollAdjustments += o,
                behavior: void 0
            }), this.pendingMeasuredCacheIndexes.push(n.index), this.itemSizeCache = new Map(this.itemSizeCache.set(n.key, i)), this.notify(!1))
        }, this.measureElement = s => {
            if (!s) {
                this.elementsCache.forEach((i, n) => {
                    i.isConnected || (this.observer.unobserve(i), this.elementsCache.delete(n))
                });
                return
            }
            this._measureElement(s, void 0)
        }, this.getVirtualItems = T(() => [this.getVirtualIndexes(), this.getMeasurements()], (s, i) => {
            const n = [];
            for (let r = 0, o = s.length; r < o; r++) {
                const a = s[r],
                    u = i[a];
                n.push(u)
            }
            return n
        }, {
            key: !1,
            debug: () => this.options.debug
        }), this.getVirtualItemForOffset = s => {
            const i = this.getMeasurements();
            if (i.length !== 0) return dt(i[Tt(0, i.length - 1, n => dt(i[n]).start, s)])
        }, this.getOffsetForAlignment = (s, i, n = 0) => {
            const r = this.getSize(),
                o = this.getScrollOffset();
            i === "auto" && (i = s >= o + r ? "end" : "start"), i === "center" ? s += (n - r) / 2 : i === "end" && (s -= r);
            const a = this.getTotalSize() + this.options.scrollMargin - r;
            return Math.max(Math.min(a, s), 0)
        }, this.getOffsetForIndex = (s, i = "auto") => {
            s = Math.max(0, Math.min(s, this.options.count - 1));
            const n = this.measurementsCache[s];
            if (!n) return;
            const r = this.getSize(),
                o = this.getScrollOffset();
            if (i === "auto")
                if (n.end >= o + r - this.options.scrollPaddingEnd) i = "end";
                else if (n.start <= o + this.options.scrollPaddingStart) i = "start";
            else return [o, i];
            const a = i === "end" ? n.end + this.options.scrollPaddingEnd : n.start - this.options.scrollPaddingStart;
            return [this.getOffsetForAlignment(a, i, n.size), i]
        }, this.isDynamicMode = () => this.elementsCache.size > 0, this.scrollToOffset = (s, {
            align: i = "start",
            behavior: n
        } = {}) => {
            n === "smooth" && this.isDynamicMode() && console.warn("The `smooth` scroll behavior is not fully supported with dynamic size."), this._scrollToOffset(this.getOffsetForAlignment(s, i), {
                adjustments: void 0,
                behavior: n
            })
        }, this.scrollToIndex = (s, {
            align: i = "auto",
            behavior: n
        } = {}) => {
            n === "smooth" && this.isDynamicMode() && console.warn("The `smooth` scroll behavior is not fully supported with dynamic size."), s = Math.max(0, Math.min(s, this.options.count - 1));
            let r = 0;
            const o = 10,
                a = c => {
                    if (!this.targetWindow) return;
                    const h = this.getOffsetForIndex(s, c);
                    if (!h) {
                        console.warn("Failed to get offset for index:", s);
                        return
                    }
                    const [f, l] = h;
                    this._scrollToOffset(f, {
                        adjustments: void 0,
                        behavior: n
                    }), this.targetWindow.requestAnimationFrame(() => {
                        const y = this.getScrollOffset(),
                            p = this.getOffsetForIndex(s, l);
                        if (!p) {
                            console.warn("Failed to get offset for index:", s);
                            return
                        }
                        Pe(p[0], y) || u(l)
                    })
                },
                u = c => {
                    this.targetWindow && (r++, r < o ? this.targetWindow.requestAnimationFrame(() => a(c)) : console.warn(`Failed to scroll to index ${s} after ${o} attempts.`))
                };
            a(i)
        }, this.scrollBy = (s, {
            behavior: i
        } = {}) => {
            i === "smooth" && this.isDynamicMode() && console.warn("The `smooth` scroll behavior is not fully supported with dynamic size."), this._scrollToOffset(this.getScrollOffset() + s, {
                adjustments: void 0,
                behavior: i
            })
        }, this.getTotalSize = () => {
            var s;
            const i = this.getMeasurements();
            let n;
            if (i.length === 0) n = this.options.paddingStart;
            else if (this.options.lanes === 1) n = ((s = i[i.length - 1]) == null ? void 0 : s.end) ?? 0;
            else {
                const r = Array(this.options.lanes).fill(null);
                let o = i.length - 1;
                for (; o >= 0 && r.some(a => a === null);) {
                    const a = i[o];
                    r[a.lane] === null && (r[a.lane] = a.end), o--
                }
                n = Math.max(...r.filter(a => a !== null))
            }
            return Math.max(n - this.options.scrollMargin + this.options.paddingEnd, 0)
        }, this._scrollToOffset = (s, {
            adjustments: i,
            behavior: n
        }) => {
            this.options.scrollToFn(s, {
                behavior: n,
                adjustments: i
            }, this)
        }, this.measure = () => {
            this.itemSizeCache = new Map, this.laneAssignments = new Map, this.notify(!1)
        }, this.setOptions(e)
    }
}
const Tt = (t, e, s, i) => {
    for (; t <= e;) {
        const n = (t + e) / 2 | 0,
            r = s(n);
        if (r < i) t = n + 1;
        else if (r > i) e = n - 1;
        else return n
    }
    return t > 0 ? t - 1 : 0
};

function ke({
    measurements: t,
    outerSize: e,
    scrollOffset: s,
    lanes: i
}) {
    const n = t.length - 1,
        r = u => t[u].start;
    if (t.length <= i) return {
        startIndex: 0,
        endIndex: n
    };
    let o = Tt(0, n, r, s),
        a = o;
    if (i === 1)
        for (; a < n && t[a].end < s + e;) a++;
    else if (i > 1) {
        const u = Array(i).fill(0);
        for (; a < n && u.some(h => h < s + e);) {
            const h = t[a];
            u[h.lane] = h.end, a++
        }
        const c = Array(i).fill(s + e);
        for (; o >= 0 && c.some(h => h >= s);) {
            const h = t[o];
            c[h.lane] = h.start, o--
        }
        o = Math.max(0, o - o % i), a = Math.min(n, a + (i - 1 - a % i))
    }
    return {
        startIndex: o,
        endIndex: a
    }
}
const yt = typeof document < "u" ? v.useLayoutEffect : v.useEffect;

function je(t) {
    const e = v.useReducer(() => ({}), {})[1],
        s = { ...t,
            onChange: (n, r) => {
                var o;
                r ? At.flushSync(e) : e(), (o = t.onChange) == null || o.call(t, n, r)
            }
        },
        [i] = v.useState(() => new ze(s));
    return i.setOptions(s), yt(() => i._didMount(), []), yt(() => i._willUpdate()), i
}

function He(t) {
    return je({
        observeElementRect: De,
        observeElementOffset: Qe,
        scrollToFn: Ae,
        ...t
    })
}
export {
    Ne as P, Ue as Q, It as a, Le as b, Ke as c, He as d, _e as u
};