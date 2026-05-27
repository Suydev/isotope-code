import {
    k as Xe
} from "./App-pJGjDiPw.js";
import "./index-BPYJFSVW.js";
import "./vendor-react-BfU3Zn2J.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-motion-Cp_NPzpZ.js";
import "./vendor-icons-CqruUz7g.js";
import "./vendor-router-CmoTwRnm.js";
const Wt = () => {};
var Te = {};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Qe = function(e) {
        const t = [];
        let n = 0;
        for (let r = 0; r < e.length; r++) {
            let i = e.charCodeAt(r);
            i < 128 ? t[n++] = i : i < 2048 ? (t[n++] = i >> 6 | 192, t[n++] = i & 63 | 128) : (i & 64512) === 55296 && r + 1 < e.length && (e.charCodeAt(r + 1) & 64512) === 56320 ? (i = 65536 + ((i & 1023) << 10) + (e.charCodeAt(++r) & 1023), t[n++] = i >> 18 | 240, t[n++] = i >> 12 & 63 | 128, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128) : (t[n++] = i >> 12 | 224, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128)
        }
        return t
    },
    zt = function(e) {
        const t = [];
        let n = 0,
            r = 0;
        for (; n < e.length;) {
            const i = e[n++];
            if (i < 128) t[r++] = String.fromCharCode(i);
            else if (i > 191 && i < 224) {
                const a = e[n++];
                t[r++] = String.fromCharCode((i & 31) << 6 | a & 63)
            } else if (i > 239 && i < 365) {
                const a = e[n++],
                    s = e[n++],
                    o = e[n++],
                    u = ((i & 7) << 18 | (a & 63) << 12 | (s & 63) << 6 | o & 63) - 65536;
                t[r++] = String.fromCharCode(55296 + (u >> 10)), t[r++] = String.fromCharCode(56320 + (u & 1023))
            } else {
                const a = e[n++],
                    s = e[n++];
                t[r++] = String.fromCharCode((i & 15) << 12 | (a & 63) << 6 | s & 63)
            }
        }
        return t.join("")
    },
    Ze = {
        byteToCharMap_: null,
        charToByteMap_: null,
        byteToCharMapWebSafe_: null,
        charToByteMapWebSafe_: null,
        ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        get ENCODED_VALS() {
            return this.ENCODED_VALS_BASE + "+/="
        },
        get ENCODED_VALS_WEBSAFE() {
            return this.ENCODED_VALS_BASE + "-_."
        },
        HAS_NATIVE_SUPPORT: typeof atob == "function",
        encodeByteArray(e, t) {
            if (!Array.isArray(e)) throw Error("encodeByteArray takes an array as a parameter");
            this.init_();
            const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
                r = [];
            for (let i = 0; i < e.length; i += 3) {
                const a = e[i],
                    s = i + 1 < e.length,
                    o = s ? e[i + 1] : 0,
                    u = i + 2 < e.length,
                    c = u ? e[i + 2] : 0,
                    p = a >> 2,
                    g = (a & 3) << 4 | o >> 4;
                let h = (o & 15) << 2 | c >> 6,
                    L = c & 63;
                u || (L = 64, s || (h = 64)), r.push(n[p], n[g], n[h], n[L])
            }
            return r.join("")
        },
        encodeString(e, t) {
            return this.HAS_NATIVE_SUPPORT && !t ? btoa(e) : this.encodeByteArray(Qe(e), t)
        },
        decodeString(e, t) {
            return this.HAS_NATIVE_SUPPORT && !t ? atob(e) : zt(this.decodeStringToByteArray(e, t))
        },
        decodeStringToByteArray(e, t) {
            this.init_();
            const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
                r = [];
            for (let i = 0; i < e.length;) {
                const a = n[e.charAt(i++)],
                    o = i < e.length ? n[e.charAt(i)] : 0;
                ++i;
                const c = i < e.length ? n[e.charAt(i)] : 64;
                ++i;
                const g = i < e.length ? n[e.charAt(i)] : 64;
                if (++i, a == null || o == null || c == null || g == null) throw new qt;
                const h = a << 2 | o >> 4;
                if (r.push(h), c !== 64) {
                    const L = o << 4 & 240 | c >> 2;
                    if (r.push(L), g !== 64) {
                        const Kt = c << 6 & 192 | g;
                        r.push(Kt)
                    }
                }
            }
            return r
        },
        init_() {
            if (!this.byteToCharMap_) {
                this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
                for (let e = 0; e < this.ENCODED_VALS.length; e++) this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e), this.charToByteMap_[this.byteToCharMap_[e]] = e, this.byteToCharMapWebSafe_[e] = this.ENCODED_VALS_WEBSAFE.charAt(e), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e, e >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e)
            }
        }
    };
class qt extends Error {
    constructor() {
        super(...arguments), this.name = "DecodeBase64StringError"
    }
}
const Gt = function(e) {
        const t = Qe(e);
        return Ze.encodeByteArray(t, !0)
    },
    et = function(e) {
        return Gt(e).replace(/\./g, "")
    },
    Yt = function(e) {
        try {
            return Ze.decodeString(e, !0)
        } catch (t) {
            console.error("base64Decode failed: ", t)
        }
        return null
    };
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Jt() {
    if (typeof self < "u") return self;
    if (typeof window < "u") return window;
    if (typeof global < "u") return global;
    throw new Error("Unable to locate global object.")
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Xt = () => Jt().__FIREBASE_DEFAULTS__,
    Qt = () => {
        if (typeof process > "u" || typeof Te > "u") return;
        const e = Te.__FIREBASE_DEFAULTS__;
        if (e) return JSON.parse(e)
    },
    Zt = () => {
        if (typeof document > "u") return;
        let e;
        try {
            e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)
        } catch {
            return
        }
        const t = e && Yt(e[1]);
        return t && JSON.parse(t)
    },
    en = () => {
        try {
            return Wt() || Xt() || Qt() || Zt()
        } catch (e) {
            console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
            return
        }
    },
    tt = () => en() ?.config;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class tn {
    constructor() {
        this.reject = () => {}, this.resolve = () => {}, this.promise = new Promise((t, n) => {
            this.resolve = t, this.reject = n
        })
    }
    wrapCallback(t) {
        return (n, r) => {
            n ? this.reject(n) : this.resolve(r), typeof t == "function" && (this.promise.catch(() => {}), t.length === 1 ? t(n) : t(n, r))
        }
    }
}

function nn() {
    const e = typeof chrome == "object" ? chrome.runtime : typeof browser == "object" ? browser.runtime : void 0;
    return typeof e == "object" && e.id !== void 0
}

function de() {
    try {
        return typeof indexedDB == "object"
    } catch {
        return !1
    }
}

function fe() {
    return new Promise((e, t) => {
        try {
            let n = !0;
            const r = "validate-browser-context-for-indexeddb-analytics-module",
                i = self.indexedDB.open(r);
            i.onsuccess = () => {
                i.result.close(), n || self.indexedDB.deleteDatabase(r), e(!0)
            }, i.onupgradeneeded = () => {
                n = !1
            }, i.onerror = () => {
                t(i.error ?.message || "")
            }
        } catch (n) {
            t(n)
        }
    })
}

function nt() {
    return !(typeof navigator > "u" || !navigator.cookieEnabled)
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const rn = "FirebaseError";
class C extends Error {
    constructor(t, n, r) {
        super(n), this.code = t, this.customData = r, this.name = rn, Object.setPrototypeOf(this, C.prototype), Error.captureStackTrace && Error.captureStackTrace(this, $.prototype.create)
    }
}
class $ {
    constructor(t, n, r) {
        this.service = t, this.serviceName = n, this.errors = r
    }
    create(t, ...n) {
        const r = n[0] || {},
            i = `${this.service}/${t}`,
            a = this.errors[t],
            s = a ? an(a, r) : "Error",
            o = `${this.serviceName}: ${s} (${i}).`;
        return new C(i, o, r)
    }
}

function an(e, t) {
    return e.replace(sn, (n, r) => {
        const i = t[r];
        return i != null ? String(i) : `<${r}?>`
    })
}
const sn = /\{\$([^}]+)}/g;

function ie(e, t) {
    if (e === t) return !0;
    const n = Object.keys(e),
        r = Object.keys(t);
    for (const i of n) {
        if (!r.includes(i)) return !1;
        const a = e[i],
            s = t[i];
        if (Ae(a) && Ae(s)) {
            if (!ie(a, s)) return !1
        } else if (a !== s) return !1
    }
    for (const i of r)
        if (!n.includes(i)) return !1;
    return !0
}

function Ae(e) {
    return e !== null && typeof e == "object"
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const on = 1e3,
    cn = 2,
    un = 14400 * 1e3,
    ln = .5;

function ve(e, t = on, n = cn) {
    const r = t * Math.pow(n, e),
        i = Math.round(ln * r * (Math.random() - .5) * 2);
    return Math.min(un, r + i)
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function F(e) {
    return e && e._delegate ? e._delegate : e
}
class w {
    constructor(t, n, r) {
        this.name = t, this.instanceFactory = n, this.type = r, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null
    }
    setInstantiationMode(t) {
        return this.instantiationMode = t, this
    }
    setMultipleInstances(t) {
        return this.multipleInstances = t, this
    }
    setServiceProps(t) {
        return this.serviceProps = t, this
    }
    setInstanceCreatedCallback(t) {
        return this.onInstanceCreated = t, this
    }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const T = "[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class dn {
    constructor(t, n) {
        this.name = t, this.container = n, this.component = null, this.instances = new Map, this.instancesDeferred = new Map, this.instancesOptions = new Map, this.onInitCallbacks = new Map
    }
    get(t) {
        const n = this.normalizeInstanceIdentifier(t);
        if (!this.instancesDeferred.has(n)) {
            const r = new tn;
            if (this.instancesDeferred.set(n, r), this.isInitialized(n) || this.shouldAutoInitialize()) try {
                const i = this.getOrInitializeService({
                    instanceIdentifier: n
                });
                i && r.resolve(i)
            } catch {}
        }
        return this.instancesDeferred.get(n).promise
    }
    getImmediate(t) {
        const n = this.normalizeInstanceIdentifier(t ?.identifier),
            r = t ?.optional ?? !1;
        if (this.isInitialized(n) || this.shouldAutoInitialize()) try {
            return this.getOrInitializeService({
                instanceIdentifier: n
            })
        } catch (i) {
            if (r) return null;
            throw i
        } else {
            if (r) return null;
            throw Error(`Service ${this.name} is not available`)
        }
    }
    getComponent() {
        return this.component
    }
    setComponent(t) {
        if (t.name !== this.name) throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);
        if (this.component) throw Error(`Component for ${this.name} has already been provided`);
        if (this.component = t, !!this.shouldAutoInitialize()) {
            if (pn(t)) try {
                this.getOrInitializeService({
                    instanceIdentifier: T
                })
            } catch {}
            for (const [n, r] of this.instancesDeferred.entries()) {
                const i = this.normalizeInstanceIdentifier(n);
                try {
                    const a = this.getOrInitializeService({
                        instanceIdentifier: i
                    });
                    r.resolve(a)
                } catch {}
            }
        }
    }
    clearInstance(t = T) {
        this.instancesDeferred.delete(t), this.instancesOptions.delete(t), this.instances.delete(t)
    }
    async delete() {
        const t = Array.from(this.instances.values());
        await Promise.all([...t.filter(n => "INTERNAL" in n).map(n => n.INTERNAL.delete()), ...t.filter(n => "_delete" in n).map(n => n._delete())])
    }
    isComponentSet() {
        return this.component != null
    }
    isInitialized(t = T) {
        return this.instances.has(t)
    }
    getOptions(t = T) {
        return this.instancesOptions.get(t) || {}
    }
    initialize(t = {}) {
        const {
            options: n = {}
        } = t, r = this.normalizeInstanceIdentifier(t.instanceIdentifier);
        if (this.isInitialized(r)) throw Error(`${this.name}(${r}) has already been initialized`);
        if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
        const i = this.getOrInitializeService({
            instanceIdentifier: r,
            options: n
        });
        for (const [a, s] of this.instancesDeferred.entries()) {
            const o = this.normalizeInstanceIdentifier(a);
            r === o && s.resolve(i)
        }
        return i
    }
    onInit(t, n) {
        const r = this.normalizeInstanceIdentifier(n),
            i = this.onInitCallbacks.get(r) ?? new Set;
        i.add(t), this.onInitCallbacks.set(r, i);
        const a = this.instances.get(r);
        return a && t(a, r), () => {
            i.delete(t)
        }
    }
    invokeOnInitCallbacks(t, n) {
        const r = this.onInitCallbacks.get(n);
        if (r)
            for (const i of r) try {
                i(t, n)
            } catch {}
    }
    getOrInitializeService({
        instanceIdentifier: t,
        options: n = {}
    }) {
        let r = this.instances.get(t);
        if (!r && this.component && (r = this.component.instanceFactory(this.container, {
                instanceIdentifier: fn(t),
                options: n
            }), this.instances.set(t, r), this.instancesOptions.set(t, n), this.invokeOnInitCallbacks(r, t), this.component.onInstanceCreated)) try {
            this.component.onInstanceCreated(this.container, t, r)
        } catch {}
        return r || null
    }
    normalizeInstanceIdentifier(t = T) {
        return this.component ? this.component.multipleInstances ? t : T : t
    }
    shouldAutoInitialize() {
        return !!this.component && this.component.instantiationMode !== "EXPLICIT"
    }
}

function fn(e) {
    return e === T ? void 0 : e
}

function pn(e) {
    return e.instantiationMode === "EAGER"
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class hn {
    constructor(t) {
        this.name = t, this.providers = new Map
    }
    addComponent(t) {
        const n = this.getProvider(t.name);
        if (n.isComponentSet()) throw new Error(`Component ${t.name} has already been registered with ${this.name}`);
        n.setComponent(t)
    }
    addOrOverwriteComponent(t) {
        this.getProvider(t.name).isComponentSet() && this.providers.delete(t.name), this.addComponent(t)
    }
    getProvider(t) {
        if (this.providers.has(t)) return this.providers.get(t);
        const n = new dn(t, this);
        return this.providers.set(t, n), n
    }
    getProviders() {
        return Array.from(this.providers.values())
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var l;
(function(e) {
    e[e.DEBUG = 0] = "DEBUG", e[e.VERBOSE = 1] = "VERBOSE", e[e.INFO = 2] = "INFO", e[e.WARN = 3] = "WARN", e[e.ERROR = 4] = "ERROR", e[e.SILENT = 5] = "SILENT"
})(l || (l = {}));
const gn = {
        debug: l.DEBUG,
        verbose: l.VERBOSE,
        info: l.INFO,
        warn: l.WARN,
        error: l.ERROR,
        silent: l.SILENT
    },
    mn = l.INFO,
    bn = {
        [l.DEBUG]: "log",
        [l.VERBOSE]: "log",
        [l.INFO]: "info",
        [l.WARN]: "warn",
        [l.ERROR]: "error"
    },
    wn = (e, t, ...n) => {
        if (t < e.logLevel) return;
        const r = new Date().toISOString(),
            i = bn[t];
        if (i) console[i](`[${r}]  ${e.name}:`, ...n);
        else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)
    };
class rt {
    constructor(t) {
        this.name = t, this._logLevel = mn, this._logHandler = wn, this._userLogHandler = null
    }
    get logLevel() {
        return this._logLevel
    }
    set logLevel(t) {
        if (!(t in l)) throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);
        this._logLevel = t
    }
    setLogLevel(t) {
        this._logLevel = typeof t == "string" ? gn[t] : t
    }
    get logHandler() {
        return this._logHandler
    }
    set logHandler(t) {
        if (typeof t != "function") throw new TypeError("Value assigned to `logHandler` must be a function");
        this._logHandler = t
    }
    get userLogHandler() {
        return this._userLogHandler
    }
    set userLogHandler(t) {
        this._userLogHandler = t
    }
    debug(...t) {
        this._userLogHandler && this._userLogHandler(this, l.DEBUG, ...t), this._logHandler(this, l.DEBUG, ...t)
    }
    log(...t) {
        this._userLogHandler && this._userLogHandler(this, l.VERBOSE, ...t), this._logHandler(this, l.VERBOSE, ...t)
    }
    info(...t) {
        this._userLogHandler && this._userLogHandler(this, l.INFO, ...t), this._logHandler(this, l.INFO, ...t)
    }
    warn(...t) {
        this._userLogHandler && this._userLogHandler(this, l.WARN, ...t), this._logHandler(this, l.WARN, ...t)
    }
    error(...t) {
        this._userLogHandler && this._userLogHandler(this, l.ERROR, ...t), this._logHandler(this, l.ERROR, ...t)
    }
}
const yn = (e, t) => t.some(n => e instanceof n);
let De, Ce;

function In() {
    return De || (De = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
}

function En() {
    return Ce || (Ce = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey])
}
const it = new WeakMap,
    ae = new WeakMap,
    at = new WeakMap,
    W = new WeakMap,
    pe = new WeakMap;

function Sn(e) {
    const t = new Promise((n, r) => {
        const i = () => {
                e.removeEventListener("success", a), e.removeEventListener("error", s)
            },
            a = () => {
                n(I(e.result)), i()
            },
            s = () => {
                r(e.error), i()
            };
        e.addEventListener("success", a), e.addEventListener("error", s)
    });
    return t.then(n => {
        n instanceof IDBCursor && it.set(n, e)
    }).catch(() => {}), pe.set(t, e), t
}

function _n(e) {
    if (ae.has(e)) return;
    const t = new Promise((n, r) => {
        const i = () => {
                e.removeEventListener("complete", a), e.removeEventListener("error", s), e.removeEventListener("abort", s)
            },
            a = () => {
                n(), i()
            },
            s = () => {
                r(e.error || new DOMException("AbortError", "AbortError")), i()
            };
        e.addEventListener("complete", a), e.addEventListener("error", s), e.addEventListener("abort", s)
    });
    ae.set(e, t)
}
let se = {
    get(e, t, n) {
        if (e instanceof IDBTransaction) {
            if (t === "done") return ae.get(e);
            if (t === "objectStoreNames") return e.objectStoreNames || at.get(e);
            if (t === "store") return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0])
        }
        return I(e[t])
    },
    set(e, t, n) {
        return e[t] = n, !0
    },
    has(e, t) {
        return e instanceof IDBTransaction && (t === "done" || t === "store") ? !0 : t in e
    }
};

function Tn(e) {
    se = e(se)
}

function An(e) {
    return e === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(t, ...n) {
        const r = e.call(z(this), t, ...n);
        return at.set(r, t.sort ? t.sort() : [t]), I(r)
    } : En().includes(e) ? function(...t) {
        return e.apply(z(this), t), I(it.get(this))
    } : function(...t) {
        return I(e.apply(z(this), t))
    }
}

function vn(e) {
    return typeof e == "function" ? An(e) : (e instanceof IDBTransaction && _n(e), yn(e, In()) ? new Proxy(e, se) : e)
}

function I(e) {
    if (e instanceof IDBRequest) return Sn(e);
    if (W.has(e)) return W.get(e);
    const t = vn(e);
    return t !== e && (W.set(e, t), pe.set(t, e)), t
}
const z = e => pe.get(e);

function V(e, t, {
    blocked: n,
    upgrade: r,
    blocking: i,
    terminated: a
} = {}) {
    const s = indexedDB.open(e, t),
        o = I(s);
    return r && s.addEventListener("upgradeneeded", u => {
        r(I(s.result), u.oldVersion, u.newVersion, I(s.transaction), u)
    }), n && s.addEventListener("blocked", u => n(u.oldVersion, u.newVersion, u)), o.then(u => {
        a && u.addEventListener("close", () => a()), i && u.addEventListener("versionchange", c => i(c.oldVersion, c.newVersion, c))
    }).catch(() => {}), o
}

function q(e, {
    blocked: t
} = {}) {
    const n = indexedDB.deleteDatabase(e);
    return t && n.addEventListener("blocked", r => t(r.oldVersion, r)), I(n).then(() => {})
}
const Dn = ["get", "getKey", "getAll", "getAllKeys", "count"],
    Cn = ["put", "add", "delete", "clear"],
    G = new Map;

function ke(e, t) {
    if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string")) return;
    if (G.get(t)) return G.get(t);
    const n = t.replace(/FromIndex$/, ""),
        r = t !== n,
        i = Cn.includes(n);
    if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(i || Dn.includes(n))) return;
    const a = async function(s, ...o) {
        const u = this.transaction(s, i ? "readwrite" : "readonly");
        let c = u.store;
        return r && (c = c.index(o.shift())), (await Promise.all([c[n](...o), i && u.done]))[0]
    };
    return G.set(t, a), a
}
Tn(e => ({ ...e,
    get: (t, n, r) => ke(t, n) || e.get(t, n, r),
    has: (t, n) => !!ke(t, n) || e.has(t, n)
}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class kn {
    constructor(t) {
        this.container = t
    }
    getPlatformInfoString() {
        return this.container.getProviders().map(n => {
            if (Mn(n)) {
                const r = n.getImmediate();
                return `${r.library}/${r.version}`
            } else return null
        }).filter(n => n).join(" ")
    }
}

function Mn(e) {
    return e.getComponent() ?.type === "VERSION"
}
const oe = "@firebase/app",
    Me = "0.14.10";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const E = new rt("@firebase/app"),
    On = "@firebase/app-compat",
    Rn = "@firebase/analytics-compat",
    Nn = "@firebase/analytics",
    Bn = "@firebase/app-check-compat",
    Pn = "@firebase/app-check",
    $n = "@firebase/auth",
    Fn = "@firebase/auth-compat",
    Ln = "@firebase/database",
    xn = "@firebase/data-connect",
    Hn = "@firebase/database-compat",
    jn = "@firebase/functions",
    Vn = "@firebase/functions-compat",
    Un = "@firebase/installations",
    Kn = "@firebase/installations-compat",
    Wn = "@firebase/messaging",
    zn = "@firebase/messaging-compat",
    qn = "@firebase/performance",
    Gn = "@firebase/performance-compat",
    Yn = "@firebase/remote-config",
    Jn = "@firebase/remote-config-compat",
    Xn = "@firebase/storage",
    Qn = "@firebase/storage-compat",
    Zn = "@firebase/firestore",
    er = "@firebase/ai",
    tr = "@firebase/firestore-compat",
    nr = "firebase";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ce = "[DEFAULT]",
    rr = {
        [oe]: "fire-core",
        [On]: "fire-core-compat",
        [Nn]: "fire-analytics",
        [Rn]: "fire-analytics-compat",
        [Pn]: "fire-app-check",
        [Bn]: "fire-app-check-compat",
        [$n]: "fire-auth",
        [Fn]: "fire-auth-compat",
        [Ln]: "fire-rtdb",
        [xn]: "fire-data-connect",
        [Hn]: "fire-rtdb-compat",
        [jn]: "fire-fn",
        [Vn]: "fire-fn-compat",
        [Un]: "fire-iid",
        [Kn]: "fire-iid-compat",
        [Wn]: "fire-fcm",
        [zn]: "fire-fcm-compat",
        [qn]: "fire-perf",
        [Gn]: "fire-perf-compat",
        [Yn]: "fire-rc",
        [Jn]: "fire-rc-compat",
        [Xn]: "fire-gcs",
        [Qn]: "fire-gcs-compat",
        [Zn]: "fire-fst",
        [tr]: "fire-fst-compat",
        [er]: "fire-vertex",
        "fire-js": "fire-js",
        [nr]: "fire-js-all"
    };
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const R = new Map,
    ir = new Map,
    ue = new Map;

function Oe(e, t) {
    try {
        e.container.addComponent(t)
    } catch (n) {
        E.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`, n)
    }
}

function S(e) {
    const t = e.name;
    if (ue.has(t)) return E.debug(`There were multiple attempts to register component ${t}.`), !1;
    ue.set(t, e);
    for (const n of R.values()) Oe(n, e);
    for (const n of ir.values()) Oe(n, e);
    return !0
}

function he(e, t) {
    const n = e.container.getProvider("heartbeat").getImmediate({
        optional: !0
    });
    return n && n.triggerHeartbeat(), e.container.getProvider(t)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ar = {
        "no-app": "No Firebase App '{$appName}' has been created - call initializeApp() first",
        "bad-app-name": "Illegal App name: '{$appName}'",
        "duplicate-app": "Firebase App named '{$appName}' already exists with different options or config",
        "app-deleted": "Firebase App named '{$appName}' already deleted",
        "server-app-deleted": "Firebase Server App has been deleted",
        "no-options": "Need to provide options, when not being deployed to hosting via source.",
        "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
        "invalid-log-argument": "First argument to `onLog` must be null or a function.",
        "idb-open": "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
        "idb-get": "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
        "idb-set": "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
        "idb-delete": "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
        "finalization-registry-not-supported": "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
        "invalid-server-app-environment": "FirebaseServerApp is not for use in browser environments."
    },
    _ = new $("app", "Firebase", ar);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class sr {
    constructor(t, n, r) {
        this._isDeleted = !1, this._options = { ...t
        }, this._config = { ...n
        }, this._name = n.name, this._automaticDataCollectionEnabled = n.automaticDataCollectionEnabled, this._container = r, this.container.addComponent(new w("app", () => this, "PUBLIC"))
    }
    get automaticDataCollectionEnabled() {
        return this.checkDestroyed(), this._automaticDataCollectionEnabled
    }
    set automaticDataCollectionEnabled(t) {
        this.checkDestroyed(), this._automaticDataCollectionEnabled = t
    }
    get name() {
        return this.checkDestroyed(), this._name
    }
    get options() {
        return this.checkDestroyed(), this._options
    }
    get config() {
        return this.checkDestroyed(), this._config
    }
    get container() {
        return this._container
    }
    get isDeleted() {
        return this._isDeleted
    }
    set isDeleted(t) {
        this._isDeleted = t
    }
    checkDestroyed() {
        if (this.isDeleted) throw _.create("app-deleted", {
            appName: this._name
        })
    }
}

function st(e, t = {}) {
    let n = e;
    typeof t != "object" && (t = {
        name: t
    });
    const r = {
            name: ce,
            automaticDataCollectionEnabled: !0,
            ...t
        },
        i = r.name;
    if (typeof i != "string" || !i) throw _.create("bad-app-name", {
        appName: String(i)
    });
    if (n || (n = tt()), !n) throw _.create("no-options");
    const a = R.get(i);
    if (a) {
        if (ie(n, a.options) && ie(r, a.config)) return a;
        throw _.create("duplicate-app", {
            appName: i
        })
    }
    const s = new hn(i);
    for (const u of ue.values()) s.addComponent(u);
    const o = new sr(n, r, s);
    return R.set(i, o), o
}

function ot(e = ce) {
    const t = R.get(e);
    if (!t && e === ce && tt()) return st();
    if (!t) throw _.create("no-app", {
        appName: e
    });
    return t
}

function or() {
    return Array.from(R.values())
}

function b(e, t, n) {
    let r = rr[e] ?? e;
    n && (r += `-${n}`);
    const i = r.match(/\s|\//),
        a = t.match(/\s|\//);
    if (i || a) {
        const s = [`Unable to register library "${r}" with version "${t}":`];
        i && s.push(`library name "${r}" contains illegal characters (whitespace or "/")`), i && a && s.push("and"), a && s.push(`version name "${t}" contains illegal characters (whitespace or "/")`), E.warn(s.join(" "));
        return
    }
    S(new w(`${r}-version`, () => ({
        library: r,
        version: t
    }), "VERSION"))
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const cr = "firebase-heartbeat-database",
    ur = 1,
    N = "firebase-heartbeat-store";
let Y = null;

function ct() {
    return Y || (Y = V(cr, ur, {
        upgrade: (e, t) => {
            switch (t) {
                case 0:
                    try {
                        e.createObjectStore(N)
                    } catch (n) {
                        console.warn(n)
                    }
            }
        }
    }).catch(e => {
        throw _.create("idb-open", {
            originalErrorMessage: e.message
        })
    })), Y
}
async function lr(e) {
    try {
        const n = (await ct()).transaction(N),
            r = await n.objectStore(N).get(ut(e));
        return await n.done, r
    } catch (t) {
        if (t instanceof C) E.warn(t.message);
        else {
            const n = _.create("idb-get", {
                originalErrorMessage: t ?.message
            });
            E.warn(n.message)
        }
    }
}
async function Re(e, t) {
    try {
        const r = (await ct()).transaction(N, "readwrite");
        await r.objectStore(N).put(t, ut(e)), await r.done
    } catch (n) {
        if (n instanceof C) E.warn(n.message);
        else {
            const r = _.create("idb-set", {
                originalErrorMessage: n ?.message
            });
            E.warn(r.message)
        }
    }
}

function ut(e) {
    return `${e.name}!${e.options.appId}`
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const dr = 1024,
    fr = 30;
class pr {
    constructor(t) {
        this.container = t, this._heartbeatsCache = null;
        const n = this.container.getProvider("app").getImmediate();
        this._storage = new gr(n), this._heartbeatsCachePromise = this._storage.read().then(r => (this._heartbeatsCache = r, r))
    }
    async triggerHeartbeat() {
        try {
            const n = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),
                r = Ne();
            if (this._heartbeatsCache ?.heartbeats == null && (this._heartbeatsCache = await this._heartbeatsCachePromise, this._heartbeatsCache ?.heartbeats == null) || this._heartbeatsCache.lastSentHeartbeatDate === r || this._heartbeatsCache.heartbeats.some(i => i.date === r)) return;
            if (this._heartbeatsCache.heartbeats.push({
                    date: r,
                    agent: n
                }), this._heartbeatsCache.heartbeats.length > fr) {
                const i = mr(this._heartbeatsCache.heartbeats);
                this._heartbeatsCache.heartbeats.splice(i, 1)
            }
            return this._storage.overwrite(this._heartbeatsCache)
        } catch (t) {
            E.warn(t)
        }
    }
    async getHeartbeatsHeader() {
        try {
            if (this._heartbeatsCache === null && await this._heartbeatsCachePromise, this._heartbeatsCache ?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) return "";
            const t = Ne(),
                {
                    heartbeatsToSend: n,
                    unsentEntries: r
                } = hr(this._heartbeatsCache.heartbeats),
                i = et(JSON.stringify({
                    version: 2,
                    heartbeats: n
                }));
            return this._heartbeatsCache.lastSentHeartbeatDate = t, r.length > 0 ? (this._heartbeatsCache.heartbeats = r, await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [], this._storage.overwrite(this._heartbeatsCache)), i
        } catch (t) {
            return E.warn(t), ""
        }
    }
}

function Ne() {
    return new Date().toISOString().substring(0, 10)
}

function hr(e, t = dr) {
    const n = [];
    let r = e.slice();
    for (const i of e) {
        const a = n.find(s => s.agent === i.agent);
        if (a) {
            if (a.dates.push(i.date), Be(n) > t) {
                a.dates.pop();
                break
            }
        } else if (n.push({
                agent: i.agent,
                dates: [i.date]
            }), Be(n) > t) {
            n.pop();
            break
        }
        r = r.slice(1)
    }
    return {
        heartbeatsToSend: n,
        unsentEntries: r
    }
}
class gr {
    constructor(t) {
        this.app = t, this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck()
    }
    async runIndexedDBEnvironmentCheck() {
        return de() ? fe().then(() => !0).catch(() => !1) : !1
    }
    async read() {
        if (await this._canUseIndexedDBPromise) {
            const n = await lr(this.app);
            return n ?.heartbeats ? n : {
                heartbeats: []
            }
        } else return {
            heartbeats: []
        }
    }
    async overwrite(t) {
        if (await this._canUseIndexedDBPromise) {
            const r = await this.read();
            return Re(this.app, {
                lastSentHeartbeatDate: t.lastSentHeartbeatDate ?? r.lastSentHeartbeatDate,
                heartbeats: t.heartbeats
            })
        } else return
    }
    async add(t) {
        if (await this._canUseIndexedDBPromise) {
            const r = await this.read();
            return Re(this.app, {
                lastSentHeartbeatDate: t.lastSentHeartbeatDate ?? r.lastSentHeartbeatDate,
                heartbeats: [...r.heartbeats, ...t.heartbeats]
            })
        } else return
    }
}

function Be(e) {
    return et(JSON.stringify({
        version: 2,
        heartbeats: e
    })).length
}

function mr(e) {
    if (e.length === 0) return -1;
    let t = 0,
        n = e[0].date;
    for (let r = 1; r < e.length; r++) e[r].date < n && (n = e[r].date, t = r);
    return t
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function br(e) {
    S(new w("platform-logger", t => new kn(t), "PRIVATE")), S(new w("heartbeat", t => new pr(t), "PRIVATE")), b(oe, Me, e), b(oe, Me, "esm2020"), b("fire-js", "")
}
br("");
const lt = "@firebase/installations",
    ge = "0.6.21";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const dt = 1e4,
    ft = `w:${ge}`,
    pt = "FIS_v2",
    wr = "https://firebaseinstallations.googleapis.com/v1",
    yr = 3600 * 1e3,
    Ir = "installations",
    Er = "Installations";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Sr = {
        "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
        "not-registered": "Firebase Installation is not registered.",
        "installation-not-found": "Firebase Installation not found.",
        "request-failed": '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
        "app-offline": "Could not process request. Application offline.",
        "delete-pending-registration": "Can't delete installation while there is a pending registration request."
    },
    v = new $(Ir, Er, Sr);

function ht(e) {
    return e instanceof C && e.code.includes("request-failed")
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function gt({
    projectId: e
}) {
    return `${wr}/projects/${e}/installations`
}

function mt(e) {
    return {
        token: e.token,
        requestStatus: 2,
        expiresIn: Tr(e.expiresIn),
        creationTime: Date.now()
    }
}
async function bt(e, t) {
    const r = (await t.json()).error;
    return v.create("request-failed", {
        requestName: e,
        serverCode: r.code,
        serverMessage: r.message,
        serverStatus: r.status
    })
}

function wt({
    apiKey: e
}) {
    return new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-goog-api-key": e
    })
}

function _r(e, {
    refreshToken: t
}) {
    const n = wt(e);
    return n.append("Authorization", Ar(t)), n
}
async function yt(e) {
    const t = await e();
    return t.status >= 500 && t.status < 600 ? e() : t
}

function Tr(e) {
    return Number(e.replace("s", "000"))
}

function Ar(e) {
    return `${pt} ${e}`
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function vr({
    appConfig: e,
    heartbeatServiceProvider: t
}, {
    fid: n
}) {
    const r = gt(e),
        i = wt(e),
        a = t.getImmediate({
            optional: !0
        });
    if (a) {
        const c = await a.getHeartbeatsHeader();
        c && i.append("x-firebase-client", c)
    }
    const s = {
            fid: n,
            authVersion: pt,
            appId: e.appId,
            sdkVersion: ft
        },
        o = {
            method: "POST",
            headers: i,
            body: JSON.stringify(s)
        },
        u = await yt(() => fetch(r, o));
    if (u.ok) {
        const c = await u.json();
        return {
            fid: c.fid || n,
            registrationStatus: 2,
            refreshToken: c.refreshToken,
            authToken: mt(c.authToken)
        }
    } else throw await bt("Create Installation", u)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function It(e) {
    return new Promise(t => {
        setTimeout(t, e)
    })
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Dr(e) {
    return btoa(String.fromCharCode(...e)).replace(/\+/g, "-").replace(/\//g, "_")
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Cr = /^[cdef][\w-]{21}$/,
    le = "";

function kr() {
    try {
        const e = new Uint8Array(17);
        (self.crypto || self.msCrypto).getRandomValues(e), e[0] = 112 + e[0] % 16;
        const n = Mr(e);
        return Cr.test(n) ? n : le
    } catch {
        return le
    }
}

function Mr(e) {
    return Dr(e).substr(0, 22)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function U(e) {
    return `${e.appName}!${e.appId}`
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Et = new Map;

function St(e, t) {
    const n = U(e);
    _t(n, t), Or(n, t)
}

function _t(e, t) {
    const n = Et.get(e);
    if (n)
        for (const r of n) r(t)
}

function Or(e, t) {
    const n = Rr();
    n && n.postMessage({
        key: e,
        fid: t
    }), Nr()
}
let A = null;

function Rr() {
    return !A && "BroadcastChannel" in self && (A = new BroadcastChannel("[Firebase] FID Change"), A.onmessage = e => {
        _t(e.data.key, e.data.fid)
    }), A
}

function Nr() {
    Et.size === 0 && A && (A.close(), A = null)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Br = "firebase-installations-database",
    Pr = 1,
    D = "firebase-installations-store";
let J = null;

function me() {
    return J || (J = V(Br, Pr, {
        upgrade: (e, t) => {
            switch (t) {
                case 0:
                    e.createObjectStore(D)
            }
        }
    })), J
}
async function j(e, t) {
    const n = U(e),
        i = (await me()).transaction(D, "readwrite"),
        a = i.objectStore(D),
        s = await a.get(n);
    return await a.put(t, n), await i.done, (!s || s.fid !== t.fid) && St(e, t.fid), t
}
async function Tt(e) {
    const t = U(e),
        r = (await me()).transaction(D, "readwrite");
    await r.objectStore(D).delete(t), await r.done
}
async function K(e, t) {
    const n = U(e),
        i = (await me()).transaction(D, "readwrite"),
        a = i.objectStore(D),
        s = await a.get(n),
        o = t(s);
    return o === void 0 ? await a.delete(n) : await a.put(o, n), await i.done, o && (!s || s.fid !== o.fid) && St(e, o.fid), o
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function be(e) {
    let t;
    const n = await K(e.appConfig, r => {
        const i = $r(r),
            a = Fr(e, i);
        return t = a.registrationPromise, a.installationEntry
    });
    return n.fid === le ? {
        installationEntry: await t
    } : {
        installationEntry: n,
        registrationPromise: t
    }
}

function $r(e) {
    const t = e || {
        fid: kr(),
        registrationStatus: 0
    };
    return At(t)
}

function Fr(e, t) {
    if (t.registrationStatus === 0) {
        if (!navigator.onLine) {
            const i = Promise.reject(v.create("app-offline"));
            return {
                installationEntry: t,
                registrationPromise: i
            }
        }
        const n = {
                fid: t.fid,
                registrationStatus: 1,
                registrationTime: Date.now()
            },
            r = Lr(e, n);
        return {
            installationEntry: n,
            registrationPromise: r
        }
    } else return t.registrationStatus === 1 ? {
        installationEntry: t,
        registrationPromise: xr(e)
    } : {
        installationEntry: t
    }
}
async function Lr(e, t) {
    try {
        const n = await vr(e, t);
        return j(e.appConfig, n)
    } catch (n) {
        throw ht(n) && n.customData.serverCode === 409 ? await Tt(e.appConfig) : await j(e.appConfig, {
            fid: t.fid,
            registrationStatus: 0
        }), n
    }
}
async function xr(e) {
    let t = await Pe(e.appConfig);
    for (; t.registrationStatus === 1;) await It(100), t = await Pe(e.appConfig);
    if (t.registrationStatus === 0) {
        const {
            installationEntry: n,
            registrationPromise: r
        } = await be(e);
        return r || n
    }
    return t
}

function Pe(e) {
    return K(e, t => {
        if (!t) throw v.create("installation-not-found");
        return At(t)
    })
}

function At(e) {
    return Hr(e) ? {
        fid: e.fid,
        registrationStatus: 0
    } : e
}

function Hr(e) {
    return e.registrationStatus === 1 && e.registrationTime + dt < Date.now()
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function jr({
    appConfig: e,
    heartbeatServiceProvider: t
}, n) {
    const r = Vr(e, n),
        i = _r(e, n),
        a = t.getImmediate({
            optional: !0
        });
    if (a) {
        const c = await a.getHeartbeatsHeader();
        c && i.append("x-firebase-client", c)
    }
    const s = {
            installation: {
                sdkVersion: ft,
                appId: e.appId
            }
        },
        o = {
            method: "POST",
            headers: i,
            body: JSON.stringify(s)
        },
        u = await yt(() => fetch(r, o));
    if (u.ok) {
        const c = await u.json();
        return mt(c)
    } else throw await bt("Generate Auth Token", u)
}

function Vr(e, {
    fid: t
}) {
    return `${gt(e)}/${t}/authTokens:generate`
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function we(e, t = !1) {
    let n;
    const r = await K(e.appConfig, a => {
        if (!vt(a)) throw v.create("not-registered");
        const s = a.authToken;
        if (!t && Wr(s)) return a;
        if (s.requestStatus === 1) return n = Ur(e, t), a; {
            if (!navigator.onLine) throw v.create("app-offline");
            const o = qr(a);
            return n = Kr(e, o), o
        }
    });
    return n ? await n : r.authToken
}
async function Ur(e, t) {
    let n = await $e(e.appConfig);
    for (; n.authToken.requestStatus === 1;) await It(100), n = await $e(e.appConfig);
    const r = n.authToken;
    return r.requestStatus === 0 ? we(e, t) : r
}

function $e(e) {
    return K(e, t => {
        if (!vt(t)) throw v.create("not-registered");
        const n = t.authToken;
        return Gr(n) ? { ...t,
            authToken: {
                requestStatus: 0
            }
        } : t
    })
}
async function Kr(e, t) {
    try {
        const n = await jr(e, t),
            r = { ...t,
                authToken: n
            };
        return await j(e.appConfig, r), n
    } catch (n) {
        if (ht(n) && (n.customData.serverCode === 401 || n.customData.serverCode === 404)) await Tt(e.appConfig);
        else {
            const r = { ...t,
                authToken: {
                    requestStatus: 0
                }
            };
            await j(e.appConfig, r)
        }
        throw n
    }
}

function vt(e) {
    return e !== void 0 && e.registrationStatus === 2
}

function Wr(e) {
    return e.requestStatus === 2 && !zr(e)
}

function zr(e) {
    const t = Date.now();
    return t < e.creationTime || e.creationTime + e.expiresIn < t + yr
}

function qr(e) {
    const t = {
        requestStatus: 1,
        requestTime: Date.now()
    };
    return { ...e,
        authToken: t
    }
}

function Gr(e) {
    return e.requestStatus === 1 && e.requestTime + dt < Date.now()
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Yr(e) {
    const t = e,
        {
            installationEntry: n,
            registrationPromise: r
        } = await be(t);
    return r ? r.catch(console.error) : we(t).catch(console.error), n.fid
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Jr(e, t = !1) {
    const n = e;
    return await Xr(n), (await we(n, t)).token
}
async function Xr(e) {
    const {
        registrationPromise: t
    } = await be(e);
    t && await t
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Qr(e) {
    if (!e || !e.options) throw X("App Configuration");
    if (!e.name) throw X("App Name");
    const t = ["projectId", "apiKey", "appId"];
    for (const n of t)
        if (!e.options[n]) throw X(n);
    return {
        appName: e.name,
        projectId: e.options.projectId,
        apiKey: e.options.apiKey,
        appId: e.options.appId
    }
}

function X(e) {
    return v.create("missing-app-config-values", {
        valueName: e
    })
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Dt = "installations",
    Zr = "installations-internal",
    ei = e => {
        const t = e.getProvider("app").getImmediate(),
            n = Qr(t),
            r = he(t, "heartbeat");
        return {
            app: t,
            appConfig: n,
            heartbeatServiceProvider: r,
            _delete: () => Promise.resolve()
        }
    },
    ti = e => {
        const t = e.getProvider("app").getImmediate(),
            n = he(t, Dt).getImmediate();
        return {
            getId: () => Yr(n),
            getToken: i => Jr(n, i)
        }
    };

function ni() {
    S(new w(Dt, ei, "PUBLIC")), S(new w(Zr, ti, "PRIVATE"))
}
ni();
b(lt, ge);
b(lt, ge, "esm2020");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ri = "/firebase-messaging-sw.js",
    ii = "/firebase-cloud-messaging-push-scope",
    Ct = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",
    ai = "https://fcmregistrations.googleapis.com/v1",
    kt = "google.c.a.c_id",
    si = "google.c.a.c_l",
    oi = "google.c.a.ts",
    ci = "google.c.a.e",
    Fe = 1e4;
var Le;
(function(e) {
    e[e.DATA_MESSAGE = 1] = "DATA_MESSAGE", e[e.DISPLAY_NOTIFICATION = 3] = "DISPLAY_NOTIFICATION"
})(Le || (Le = {}));
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
var B;
(function(e) {
    e.PUSH_RECEIVED = "push-received", e.NOTIFICATION_CLICKED = "notification-clicked"
})(B || (B = {}));
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function y(e) {
    const t = new Uint8Array(e);
    return btoa(String.fromCharCode(...t)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function ui(e) {
    const t = "=".repeat((4 - e.length % 4) % 4),
        n = (e + t).replace(/\-/g, "+").replace(/_/g, "/"),
        r = atob(n),
        i = new Uint8Array(r.length);
    for (let a = 0; a < r.length; ++a) i[a] = r.charCodeAt(a);
    return i
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Q = "fcm_token_details_db",
    li = 5,
    xe = "fcm_token_object_Store";
async function di(e) {
    if ("databases" in indexedDB && !(await indexedDB.databases()).map(a => a.name).includes(Q)) return null;
    let t = null;
    return (await V(Q, li, {
        upgrade: async (r, i, a, s) => {
            if (i < 2 || !r.objectStoreNames.contains(xe)) return;
            const o = s.objectStore(xe),
                u = await o.index("fcmSenderId").get(e);
            if (await o.clear(), !!u) {
                if (i === 2) {
                    const c = u;
                    if (!c.auth || !c.p256dh || !c.endpoint) return;
                    t = {
                        token: c.fcmToken,
                        createTime: c.createTime ?? Date.now(),
                        subscriptionOptions: {
                            auth: c.auth,
                            p256dh: c.p256dh,
                            endpoint: c.endpoint,
                            swScope: c.swScope,
                            vapidKey: typeof c.vapidKey == "string" ? c.vapidKey : y(c.vapidKey)
                        }
                    }
                } else if (i === 3) {
                    const c = u;
                    t = {
                        token: c.fcmToken,
                        createTime: c.createTime,
                        subscriptionOptions: {
                            auth: y(c.auth),
                            p256dh: y(c.p256dh),
                            endpoint: c.endpoint,
                            swScope: c.swScope,
                            vapidKey: y(c.vapidKey)
                        }
                    }
                } else if (i === 4) {
                    const c = u;
                    t = {
                        token: c.fcmToken,
                        createTime: c.createTime,
                        subscriptionOptions: {
                            auth: y(c.auth),
                            p256dh: y(c.p256dh),
                            endpoint: c.endpoint,
                            swScope: c.swScope,
                            vapidKey: y(c.vapidKey)
                        }
                    }
                }
            }
        }
    })).close(), await q(Q), await q("fcm_vapid_details_db"), await q("undefined"), fi(t) ? t : null
}

function fi(e) {
    if (!e || !e.subscriptionOptions) return !1;
    const {
        subscriptionOptions: t
    } = e;
    return typeof e.createTime == "number" && e.createTime > 0 && typeof e.token == "string" && e.token.length > 0 && typeof t.auth == "string" && t.auth.length > 0 && typeof t.p256dh == "string" && t.p256dh.length > 0 && typeof t.endpoint == "string" && t.endpoint.length > 0 && typeof t.swScope == "string" && t.swScope.length > 0 && typeof t.vapidKey == "string" && t.vapidKey.length > 0
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const pi = "firebase-messaging-database",
    hi = 1,
    P = "firebase-messaging-store";
let Z = null;

function Mt() {
    return Z || (Z = V(pi, hi, {
        upgrade: (e, t) => {
            switch (t) {
                case 0:
                    e.createObjectStore(P)
            }
        }
    })), Z
}
async function gi(e) {
    const t = Ot(e),
        r = await (await Mt()).transaction(P).objectStore(P).get(t);
    if (r) return r; {
        const i = await di(e.appConfig.senderId);
        if (i) return await ye(e, i), i
    }
}
async function ye(e, t) {
    const n = Ot(e),
        i = (await Mt()).transaction(P, "readwrite");
    return await i.objectStore(P).put(t, n), await i.done, t
}

function Ot({
    appConfig: e
}) {
    return e.appId
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mi = {
        "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
        "only-available-in-window": "This method is available in a Window context.",
        "only-available-in-sw": "This method is available in a service worker context.",
        "permission-default": "The notification permission was not granted and dismissed instead.",
        "permission-blocked": "The notification permission was not granted and blocked instead.",
        "unsupported-browser": "This browser doesn't support the API's required to use the Firebase SDK.",
        "indexed-db-unsupported": "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
        "failed-service-worker-registration": "We are unable to register the default service worker. {$browserErrorMessage}",
        "token-subscribe-failed": "A problem occurred while subscribing the user to FCM: {$errorInfo}",
        "token-subscribe-no-token": "FCM returned no token when subscribing the user to push.",
        "token-unsubscribe-failed": "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
        "token-update-failed": "A problem occurred while updating the user from FCM: {$errorInfo}",
        "token-update-no-token": "FCM returned no token when updating the user to push.",
        "use-sw-after-get-token": "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
        "invalid-sw-registration": "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
        "invalid-bg-handler": "The input to setBackgroundMessageHandler() must be a function.",
        "invalid-vapid-key": "The public VAPID key must be a string.",
        "use-vapid-key-after-get-token": "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."
    },
    d = new $("messaging", "Messaging", mi);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function bi(e, t) {
    const n = await Ee(e),
        r = Rt(t),
        i = {
            method: "POST",
            headers: n,
            body: JSON.stringify(r)
        };
    let a;
    try {
        a = await (await fetch(Ie(e.appConfig), i)).json()
    } catch (s) {
        throw d.create("token-subscribe-failed", {
            errorInfo: s ?.toString()
        })
    }
    if (a.error) {
        const s = a.error.message;
        throw d.create("token-subscribe-failed", {
            errorInfo: s
        })
    }
    if (!a.token) throw d.create("token-subscribe-no-token");
    return a.token
}
async function wi(e, t) {
    const n = await Ee(e),
        r = Rt(t.subscriptionOptions),
        i = {
            method: "PATCH",
            headers: n,
            body: JSON.stringify(r)
        };
    let a;
    try {
        a = await (await fetch(`${Ie(e.appConfig)}/${t.token}`, i)).json()
    } catch (s) {
        throw d.create("token-update-failed", {
            errorInfo: s ?.toString()
        })
    }
    if (a.error) {
        const s = a.error.message;
        throw d.create("token-update-failed", {
            errorInfo: s
        })
    }
    if (!a.token) throw d.create("token-update-no-token");
    return a.token
}
async function yi(e, t) {
    const r = {
        method: "DELETE",
        headers: await Ee(e)
    };
    try {
        const a = await (await fetch(`${Ie(e.appConfig)}/${t}`, r)).json();
        if (a.error) {
            const s = a.error.message;
            throw d.create("token-unsubscribe-failed", {
                errorInfo: s
            })
        }
    } catch (i) {
        throw d.create("token-unsubscribe-failed", {
            errorInfo: i ?.toString()
        })
    }
}

function Ie({
    projectId: e
}) {
    return `${ai}/projects/${e}/registrations`
}
async function Ee({
    appConfig: e,
    installations: t
}) {
    const n = await t.getToken();
    return new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-goog-api-key": e.apiKey,
        "x-goog-firebase-installations-auth": `FIS ${n}`
    })
}

function Rt({
    p256dh: e,
    auth: t,
    endpoint: n,
    vapidKey: r
}) {
    const i = {
        web: {
            endpoint: n,
            auth: t,
            p256dh: e
        }
    };
    return r !== Ct && (i.web.applicationPubKey = r), i
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ii = 10080 * 60 * 1e3;
async function Ei(e) {
    const t = await _i(e.swRegistration, e.vapidKey),
        n = {
            vapidKey: e.vapidKey,
            swScope: e.swRegistration.scope,
            endpoint: t.endpoint,
            auth: y(t.getKey("auth")),
            p256dh: y(t.getKey("p256dh"))
        },
        r = await gi(e.firebaseDependencies);
    if (r) {
        if (Ti(r.subscriptionOptions, n)) return Date.now() >= r.createTime + Ii ? Si(e, {
            token: r.token,
            createTime: Date.now(),
            subscriptionOptions: n
        }) : r.token;
        try {
            await yi(e.firebaseDependencies, r.token)
        } catch (i) {
            console.warn(i)
        }
        return He(e.firebaseDependencies, n)
    } else return He(e.firebaseDependencies, n)
}
async function Si(e, t) {
    try {
        const n = await wi(e.firebaseDependencies, t),
            r = { ...t,
                token: n,
                createTime: Date.now()
            };
        return await ye(e.firebaseDependencies, r), n
    } catch (n) {
        throw n
    }
}
async function He(e, t) {
    const r = {
        token: await bi(e, t),
        createTime: Date.now(),
        subscriptionOptions: t
    };
    return await ye(e, r), r.token
}
async function _i(e, t) {
    const n = await e.pushManager.getSubscription();
    return n || e.pushManager.subscribe({
        userVisibleOnly: !0,
        applicationServerKey: ui(t)
    })
}

function Ti(e, t) {
    const n = t.vapidKey === e.vapidKey,
        r = t.endpoint === e.endpoint,
        i = t.auth === e.auth,
        a = t.p256dh === e.p256dh;
    return n && r && i && a
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function je(e) {
    const t = {
        from: e.from,
        collapseKey: e.collapse_key,
        messageId: e.fcmMessageId
    };
    return Ai(t, e), vi(t, e), Di(t, e), t
}

function Ai(e, t) {
    if (!t.notification) return;
    e.notification = {};
    const n = t.notification.title;
    n && (e.notification.title = n);
    const r = t.notification.body;
    r && (e.notification.body = r);
    const i = t.notification.image;
    i && (e.notification.image = i);
    const a = t.notification.icon;
    a && (e.notification.icon = a)
}

function vi(e, t) {
    t.data && (e.data = t.data)
}

function Di(e, t) {
    if (!t.fcmOptions && !t.notification ?.click_action) return;
    e.fcmOptions = {};
    const n = t.fcmOptions ?.link ?? t.notification ?.click_action;
    n && (e.fcmOptions.link = n);
    const r = t.fcmOptions ?.analytics_label;
    r && (e.fcmOptions.analyticsLabel = r)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ci(e) {
    return typeof e == "object" && !!e && kt in e
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ki(e) {
    if (!e || !e.options) throw ee("App Configuration Object");
    if (!e.name) throw ee("App Name");
    const t = ["projectId", "apiKey", "appId", "messagingSenderId"],
        {
            options: n
        } = e;
    for (const r of t)
        if (!n[r]) throw ee(r);
    return {
        appName: e.name,
        projectId: n.projectId,
        apiKey: n.apiKey,
        appId: n.appId,
        senderId: n.messagingSenderId
    }
}

function ee(e) {
    return d.create("missing-app-config-values", {
        valueName: e
    })
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Mi {
    constructor(t, n, r) {
        this.deliveryMetricsExportedToBigQueryEnabled = !1, this.onBackgroundMessageHandler = null, this.onMessageHandler = null, this.logEvents = [], this.isLogServiceStarted = !1;
        const i = ki(t);
        this.firebaseDependencies = {
            app: t,
            appConfig: i,
            installations: n,
            analyticsProvider: r
        }
    }
    _delete() {
        return Promise.resolve()
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Oi(e) {
    try {
        e.swRegistration = await navigator.serviceWorker.register(ri, {
            scope: ii
        }), e.swRegistration.update().catch(() => {}), await Ri(e.swRegistration)
    } catch (t) {
        throw d.create("failed-service-worker-registration", {
            browserErrorMessage: t ?.message
        })
    }
}
async function Ri(e) {
    return new Promise((t, n) => {
        const r = setTimeout(() => n(new Error(`Service worker not registered after ${Fe} ms`)), Fe),
            i = e.installing || e.waiting;
        e.active ? (clearTimeout(r), t()) : i ? i.onstatechange = a => {
            a.target ?.state === "activated" && (i.onstatechange = null, clearTimeout(r), t())
        } : (clearTimeout(r), n(new Error("No incoming service worker found.")))
    })
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Ni(e, t) {
    if (!t && !e.swRegistration && await Oi(e), !(!t && e.swRegistration)) {
        if (!(t instanceof ServiceWorkerRegistration)) throw d.create("invalid-sw-registration");
        e.swRegistration = t
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Bi(e, t) {
    t ? e.vapidKey = t : e.vapidKey || (e.vapidKey = Ct)
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Nt(e, t) {
    if (!navigator) throw d.create("only-available-in-window");
    if (Notification.permission === "default" && await Notification.requestPermission(), Notification.permission !== "granted") throw d.create("permission-blocked");
    return await Bi(e, t ?.vapidKey), await Ni(e, t ?.serviceWorkerRegistration), Ei(e)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Pi(e, t, n) {
    const r = $i(t);
    (await e.firebaseDependencies.analyticsProvider.get()).logEvent(r, {
        message_id: n[kt],
        message_name: n[si],
        message_time: n[oi],
        message_device_time: Math.floor(Date.now() / 1e3)
    })
}

function $i(e) {
    switch (e) {
        case B.NOTIFICATION_CLICKED:
            return "notification_open";
        case B.PUSH_RECEIVED:
            return "notification_foreground";
        default:
            throw new Error
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Fi(e, t) {
    const n = t.data;
    if (!n.isFirebaseMessaging) return;
    e.onMessageHandler && n.messageType === B.PUSH_RECEIVED && (typeof e.onMessageHandler == "function" ? e.onMessageHandler(je(n)) : e.onMessageHandler.next(je(n)));
    const r = n.data;
    Ci(r) && r[ci] === "1" && await Pi(e, n.messageType, r)
}
const Ve = "@firebase/messaging",
    Ue = "0.12.25";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Li = e => {
        const t = new Mi(e.getProvider("app").getImmediate(), e.getProvider("installations-internal").getImmediate(), e.getProvider("analytics-internal"));
        return navigator.serviceWorker.addEventListener("message", n => Fi(t, n)), t
    },
    xi = e => {
        const t = e.getProvider("messaging").getImmediate();
        return {
            getToken: r => Nt(t, r)
        }
    };

function Hi() {
    S(new w("messaging", Li, "PUBLIC")), S(new w("messaging-internal", xi, "PRIVATE")), b(Ve, Ue), b(Ve, Ue, "esm2020")
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Bt() {
    try {
        await fe()
    } catch {
        return !1
    }
    return typeof window < "u" && de() && nt() && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && "fetch" in window && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey")
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ji(e, t) {
    if (!navigator) throw d.create("only-available-in-window");
    return e.onMessageHandler = t, () => {
        e.onMessageHandler = null
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Vi(e = ot()) {
    return Bt().then(t => {
        if (!t) throw d.create("unsupported-browser")
    }, t => {
        throw d.create("indexed-db-unsupported")
    }), he(F(e), "messaging").getImmediate()
}
async function Ui(e, t) {
    return e = F(e), Nt(e, t)
}

function Ki(e, t) {
    return e = F(e), ji(e, t)
}
Hi();
var Wi = "firebase",
    zi = "12.11.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
b(Wi, zi, "app");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ke = "analytics",
    qi = "firebase_id",
    Gi = "origin",
    Yi = 60 * 1e3,
    Ji = "https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",
    Se = "https://www.googletagmanager.com/gtag/js";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const f = new rt("@firebase/analytics");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Xi = {
        "already-exists": "A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.",
        "already-initialized": "initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.",
        "already-initialized-settings": "Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.",
        "interop-component-reg-failed": "Firebase Analytics Interop Component failed to instantiate: {$reason}",
        "invalid-analytics-context": "Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
        "indexeddb-unavailable": "IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
        "fetch-throttle": "The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.",
        "config-fetch-failed": "Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}",
        "no-api-key": 'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',
        "no-app-id": 'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',
        "no-client-id": 'The "client_id" field is empty.',
        "invalid-gtag-resource": "Trusted Types detected an invalid gtag resource: {$gtagURL}."
    },
    m = new $("analytics", "Analytics", Xi);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Qi(e) {
    if (!e.startsWith(Se)) {
        const t = m.create("invalid-gtag-resource", {
            gtagURL: e
        });
        return f.warn(t.message), ""
    }
    return e
}

function Pt(e) {
    return Promise.all(e.map(t => t.catch(n => n)))
}

function Zi(e, t) {
    let n;
    return window.trustedTypes && (n = window.trustedTypes.createPolicy(e, t)), n
}

function ea(e, t) {
    const n = Zi("firebase-js-sdk-policy", {
            createScriptURL: Qi
        }),
        r = document.createElement("script"),
        i = `${Se}?l=${e}&id=${t}`;
    r.src = n ? n ?.createScriptURL(i) : i, r.async = !0, document.head.appendChild(r)
}

function ta(e) {
    let t = [];
    return Array.isArray(window[e]) ? t = window[e] : window[e] = t, t
}
async function na(e, t, n, r, i, a) {
    const s = r[i];
    try {
        if (s) await t[s];
        else {
            const u = (await Pt(n)).find(c => c.measurementId === i);
            u && await t[u.appId]
        }
    } catch (o) {
        f.error(o)
    }
    e("config", i, a)
}
async function ra(e, t, n, r, i) {
    try {
        let a = [];
        if (i && i.send_to) {
            let s = i.send_to;
            Array.isArray(s) || (s = [s]);
            const o = await Pt(n);
            for (const u of s) {
                const c = o.find(g => g.measurementId === u),
                    p = c && t[c.appId];
                if (p) a.push(p);
                else {
                    a = [];
                    break
                }
            }
        }
        a.length === 0 && (a = Object.values(t)), await Promise.all(a), e("event", r, i || {})
    } catch (a) {
        f.error(a)
    }
}

function ia(e, t, n, r) {
    async function i(a, ...s) {
        try {
            if (a === "event") {
                const [o, u] = s;
                await ra(e, t, n, o, u)
            } else if (a === "config") {
                const [o, u] = s;
                await na(e, t, n, r, o, u)
            } else if (a === "consent") {
                const [o, u] = s;
                e("consent", o, u)
            } else if (a === "get") {
                const [o, u, c] = s;
                e("get", o, u, c)
            } else if (a === "set") {
                const [o] = s;
                e("set", o)
            } else e(a, ...s)
        } catch (o) {
            f.error(o)
        }
    }
    return i
}

function aa(e, t, n, r, i) {
    let a = function(...s) {
        window[r].push(arguments)
    };
    return window[i] && typeof window[i] == "function" && (a = window[i]), window[i] = ia(a, e, t, n), {
        gtagCore: a,
        wrappedGtag: window[i]
    }
}

function sa(e) {
    const t = window.document.getElementsByTagName("script");
    for (const n of Object.values(t))
        if (n.src && n.src.includes(Se) && n.src.includes(e)) return n;
    return null
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const oa = 30,
    ca = 1e3;
class ua {
    constructor(t = {}, n = ca) {
        this.throttleMetadata = t, this.intervalMillis = n
    }
    getThrottleMetadata(t) {
        return this.throttleMetadata[t]
    }
    setThrottleMetadata(t, n) {
        this.throttleMetadata[t] = n
    }
    deleteThrottleMetadata(t) {
        delete this.throttleMetadata[t]
    }
}
const $t = new ua;

function la(e) {
    return new Headers({
        Accept: "application/json",
        "x-goog-api-key": e
    })
}
async function da(e) {
    const {
        appId: t,
        apiKey: n
    } = e, r = {
        method: "GET",
        headers: la(n)
    }, i = Ji.replace("{app-id}", t), a = await fetch(i, r);
    if (a.status !== 200 && a.status !== 304) {
        let s = "";
        try {
            const o = await a.json();
            o.error ?.message && (s = o.error.message)
        } catch {}
        throw m.create("config-fetch-failed", {
            httpStatus: a.status,
            responseMessage: s
        })
    }
    return a.json()
}
async function fa(e, t = $t, n) {
    const {
        appId: r,
        apiKey: i,
        measurementId: a
    } = e.options;
    if (!r) throw m.create("no-app-id");
    if (!i) {
        if (a) return {
            measurementId: a,
            appId: r
        };
        throw m.create("no-api-key")
    }
    const s = t.getThrottleMetadata(r) || {
            backoffCount: 0,
            throttleEndTimeMillis: Date.now()
        },
        o = new ga;
    return setTimeout(async () => {
        o.abort()
    }, Yi), Ft({
        appId: r,
        apiKey: i,
        measurementId: a
    }, s, o, t)
}
async function Ft(e, {
    throttleEndTimeMillis: t,
    backoffCount: n
}, r, i = $t) {
    const {
        appId: a,
        measurementId: s
    } = e;
    try {
        await pa(r, t)
    } catch (o) {
        if (s) return f.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${o?.message}]`), {
            appId: a,
            measurementId: s
        };
        throw o
    }
    try {
        const o = await da(e);
        return i.deleteThrottleMetadata(a), o
    } catch (o) {
        const u = o;
        if (!ha(u)) {
            if (i.deleteThrottleMetadata(a), s) return f.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${u?.message}]`), {
                appId: a,
                measurementId: s
            };
            throw o
        }
        const c = Number(u ?.customData ?.httpStatus) === 503 ? ve(n, i.intervalMillis, oa) : ve(n, i.intervalMillis),
            p = {
                throttleEndTimeMillis: Date.now() + c,
                backoffCount: n + 1
            };
        return i.setThrottleMetadata(a, p), f.debug(`Calling attemptFetch again in ${c} millis`), Ft(e, p, r, i)
    }
}

function pa(e, t) {
    return new Promise((n, r) => {
        const i = Math.max(t - Date.now(), 0),
            a = setTimeout(n, i);
        e.addEventListener(() => {
            clearTimeout(a), r(m.create("fetch-throttle", {
                throttleEndTimeMillis: t
            }))
        })
    })
}

function ha(e) {
    if (!(e instanceof C) || !e.customData) return !1;
    const t = Number(e.customData.httpStatus);
    return t === 429 || t === 500 || t === 503 || t === 504
}
class ga {
    constructor() {
        this.listeners = []
    }
    addEventListener(t) {
        this.listeners.push(t)
    }
    abort() {
        this.listeners.forEach(t => t())
    }
}
async function ma(e, t, n, r, i) {
    if (i && i.global) {
        e("event", n, r);
        return
    } else {
        const a = await t,
            s = { ...r,
                send_to: a
            };
        e("event", n, s)
    }
}
async function ba(e, t, n, r) {
    if (r && r.global) {
        const i = {};
        for (const a of Object.keys(n)) i[`user_properties.${a}`] = n[a];
        return e("set", i), Promise.resolve()
    } else {
        const i = await t;
        e("config", i, {
            update: !0,
            user_properties: n
        })
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function wa() {
    if (de()) try {
        await fe()
    } catch (e) {
        return f.warn(m.create("indexeddb-unavailable", {
            errorInfo: e ?.toString()
        }).message), !1
    } else return f.warn(m.create("indexeddb-unavailable", {
        errorInfo: "IndexedDB is not available in this environment."
    }).message), !1;
    return !0
}
async function ya(e, t, n, r, i, a, s) {
    const o = fa(e);
    o.then(h => {
        n[h.measurementId] = h.appId, e.options.measurementId && h.measurementId !== e.options.measurementId && f.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${h.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)
    }).catch(h => f.error(h)), t.push(o);
    const u = wa().then(h => {
            if (h) return r.getId()
        }),
        [c, p] = await Promise.all([o, u]);
    sa(a) || ea(a, c.measurementId), i("js", new Date);
    const g = s ?.config ?? {};
    return g[Gi] = "firebase", g.update = !0, p != null && (g[qi] = p), i("config", c.measurementId, g), c.measurementId
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ia {
    constructor(t) {
        this.app = t
    }
    _delete() {
        return delete k[this.app.options.appId], Promise.resolve()
    }
}
let k = {},
    We = [];
const ze = {};
let te = "dataLayer",
    Ea = "gtag",
    qe, _e, Ge = !1;

function Sa() {
    const e = [];
    if (nn() && e.push("This is a browser extension environment."), nt() || e.push("Cookies are not available."), e.length > 0) {
        const t = e.map((r, i) => `(${i+1}) ${r}`).join(" "),
            n = m.create("invalid-analytics-context", {
                errorInfo: t
            });
        f.warn(n.message)
    }
}

function _a(e, t, n) {
    Sa();
    const r = e.options.appId;
    if (!r) throw m.create("no-app-id");
    if (!e.options.apiKey)
        if (e.options.measurementId) f.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);
        else throw m.create("no-api-key");
    if (k[r] != null) throw m.create("already-exists", {
        id: r
    });
    if (!Ge) {
        ta(te);
        const {
            wrappedGtag: a,
            gtagCore: s
        } = aa(k, We, ze, te, Ea);
        _e = a, qe = s, Ge = !0
    }
    return k[r] = ya(e, We, ze, t, qe, te, n), new Ia(e)
}

function Ta(e, t, n) {
    e = F(e), ba(_e, k[e.app.options.appId], t, n).catch(r => f.error(r))
}

function Aa(e, t, n, r) {
    e = F(e), ma(_e, k[e.app.options.appId], t, n, r).catch(i => f.error(i))
}
const Ye = "@firebase/analytics",
    Je = "0.10.21";

function va() {
    S(new w(Ke, (t, {
        options: n
    }) => {
        const r = t.getProvider("app").getImmediate(),
            i = t.getProvider("installations-internal").getImmediate();
        return _a(r, i, n)
    }, "PUBLIC")), S(new w("analytics-internal", e, "PRIVATE")), b(Ye, Je), b(Ye, Je, "esm2020");

    function e(t) {
        try {
            const n = t.getProvider(Ke).getImmediate();
            return {
                logEvent: (r, i, a) => Aa(n, r, i, a),
                setUserProperties: (r, i) => Ta(n, r, i)
            }
        } catch (n) {
            throw m.create("interop-component-reg-failed", {
                reason: n
            })
        }
    }
}
va();
const M = {
        apiKey: "AIzaSyBPtwDQLub-rW6ijzbggx5zQkdgXIwNsmQ",
        authDomain: "isotope-study.firebaseapp.com",
        projectId: "isotope-study",
        storageBucket: "isotope-study.firebasestorage.app",
        messagingSenderId: "219061524041",
        appId: "1:219061524041:web:5b10cc849f176e542fd198",
        measurementId: "G-EL7DF3S8C9"
    },
    Lt = "BIYVkmTA7tGrbpyGIbxuSfj4xrBgpGL27e5Yo_uPo3JSbRR_syzZ9q6BbB_b9nNbNaCnC56Y8LuItVsaLQwdhZ8".trim() ?? "";
let ne = null;
const Da = () => typeof window < "u",
    xt = () => !!(M.apiKey && M.appId && M.messagingSenderId && M.projectId),
    Ht = () => Lt.length > 0,
    Ca = () => Ht() ? Lt : null,
    ka = () => or().length > 0 ? ot() : st(M),
    jt = async () => !Da() || typeof Notification > "u" || !("serviceWorker" in navigator) || typeof PushManager > "u" ? !1 : (ne || (ne = Bt().catch(() => !1)), ne),
    Vt = async () => !xt() || !await jt() ? null : Vi(ka()),
    Ut = "firebase:fcm-token",
    Ma = "/firebase-messaging-sw.js",
    Oa = "/firebase-cloud-messaging-push-scope";
let re = null,
    x = null,
    O = null;
const H = new Set,
    Ra = async () => typeof window > "u" || !("serviceWorker" in navigator) ? null : (re || (re = navigator.serviceWorker.register(Ma, {
        scope: Oa
    }).catch(e => (console.error("[FirebaseMessaging] Service worker registration failed:", e), null))), re),
    ja = async () => ({
        configured: xt(),
        supported: await jt(),
        hasVapidKey: Ht(),
        permission: typeof Notification > "u" ? "unsupported" : Notification.permission
    }),
    Va = async () => Xe.getItem(Ut),
    Ua = async () => {
        const e = Ca();
        if (!e || typeof Notification > "u" || Notification.permission !== "granted") return null;
        const t = await Vt();
        if (!t) return null;
        const n = await Ra();
        if (!n) return null;
        const r = await Ui(t, {
            vapidKey: e,
            serviceWorkerRegistration: n
        });
        return r ? (await Xe.setItem(Ut, r), r) : null
    },
    Na = async () => {
        O || (x || (x = (async () => {
            const e = await Vt();
            e && (O = Ki(e, t => {
                H.forEach(n => {
                    try {
                        n(t)
                    } catch (r) {
                        console.error("[FirebaseMessaging] Foreground message handler failed:", r)
                    }
                })
            }))
        })().finally(() => {
            x = null
        })), await x)
    },
    Ka = async e => (H.add(e), await Na(), () => {
        H.delete(e), H.size === 0 && O && (O(), O = null)
    });
export {
    Ua as ensureMessagingToken, ja as getFcmAvailability, Va as getStoredMessagingToken, Ka as onForegroundMessage
};