import {
    r as y
} from "./vendor-react-BfU3Zn2J.js";
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const M = t => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
    _ = t => t.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, c, o) => o ? o.toUpperCase() : c.toLowerCase()),
    s = t => {
        const e = _(t);
        return e.charAt(0).toUpperCase() + e.slice(1)
    },
    k = (...t) => t.filter((e, c, o) => !!e && e.trim() !== "" && o.indexOf(e) === c).join(" ").trim(),
    x = t => {
        for (const e in t)
            if (e.startsWith("aria-") || e === "role" || e === "title") return !0
    };
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var m = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const v = y.forwardRef(({
    color: t = "currentColor",
    size: e = 24,
    strokeWidth: c = 2,
    absoluteStrokeWidth: o,
    className: d = "",
    children: h,
    iconNode: p,
    ...n
}, i) => y.createElement("svg", {
    ref: i,
    ...m,
    width: e,
    height: e,
    stroke: t,
    strokeWidth: o ? Number(c) * 24 / Number(e) : c,
    className: k("lucide", d),
    ...!h && !x(n) && {
        "aria-hidden": "true"
    },
    ...n
}, [...p.map(([r, l]) => y.createElement(r, l)), ...Array.isArray(h) ? h : [h]]));
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const a = (t, e) => {
    const c = y.forwardRef(({
        className: o,
        ...d
    }, h) => y.createElement(v, {
        ref: h,
        iconNode: e,
        className: k(`lucide-${M(s(t))}`, `lucide-${t}`, o),
        ...d
    }));
    return c.displayName = s(t), c
};
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const g = [
        ["path", {
            d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
            key: "169zse"
        }]
    ],
    Ia = a("activity", g);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const u = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "m14.31 8 5.74 9.94",
            key: "1y6ab4"
        }],
        ["path", {
            d: "M9.69 8h11.48",
            key: "1wxppr"
        }],
        ["path", {
            d: "m7.38 12 5.74-9.94",
            key: "1grp0k"
        }],
        ["path", {
            d: "M9.69 16 3.95 6.06",
            key: "libnyf"
        }],
        ["path", {
            d: "M14.31 16H2.83",
            key: "x5fava"
        }],
        ["path", {
            d: "m16.62 12-5.74 9.94",
            key: "1vwawt"
        }]
    ],
    Oa = a("aperture", u);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const w = [
        ["rect", {
            width: "20",
            height: "5",
            x: "2",
            y: "3",
            rx: "1",
            key: "1wp1u1"
        }],
        ["path", {
            d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",
            key: "1s80jp"
        }],
        ["path", {
            d: "M10 12h4",
            key: "a56b0p"
        }]
    ],
    Wa = a("archive", w);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const N = [
        ["path", {
            d: "m3 16 4 4 4-4",
            key: "1co6wj"
        }],
        ["path", {
            d: "M7 20V4",
            key: "1yoxec"
        }],
        ["path", {
            d: "M20 8h-5",
            key: "1vsyxs"
        }],
        ["path", {
            d: "M15 10V6.5a2.5 2.5 0 0 1 5 0V10",
            key: "ag13bf"
        }],
        ["path", {
            d: "M15 14h5l-5 6h5",
            key: "ur5jdg"
        }]
    ],
    Ka = a("arrow-down-a-z", N);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $ = [
        ["path", {
            d: "m7 7 10 10",
            key: "1fmybs"
        }],
        ["path", {
            d: "M17 7v10H7",
            key: "6fjiku"
        }]
    ],
    Ja = a("arrow-down-right", $);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const f = [
        ["path", {
            d: "m3 16 4 4 4-4",
            key: "1co6wj"
        }],
        ["path", {
            d: "M7 20V4",
            key: "1yoxec"
        }],
        ["path", {
            d: "m21 8-4-4-4 4",
            key: "1c9v7m"
        }],
        ["path", {
            d: "M17 4v16",
            key: "7dpous"
        }]
    ],
    Qa = a("arrow-down-up", f);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b = [
        ["path", {
            d: "M12 5v14",
            key: "s699le"
        }],
        ["path", {
            d: "m19 12-7 7-7-7",
            key: "1idqje"
        }]
    ],
    Xa = a("arrow-down", b);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const z = [
        ["path", {
            d: "m12 19-7-7 7-7",
            key: "1l729n"
        }],
        ["path", {
            d: "M19 12H5",
            key: "x3x0zl"
        }]
    ],
    Ya = a("arrow-left", z);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const j = [
        ["path", {
            d: "M5 12h14",
            key: "1ays0h"
        }],
        ["path", {
            d: "m12 5 7 7-7 7",
            key: "xquz4c"
        }]
    ],
    ae = a("arrow-right", j);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const q = [
        ["path", {
            d: "m21 16-4 4-4-4",
            key: "f6ql7i"
        }],
        ["path", {
            d: "M17 20V4",
            key: "1ejh1v"
        }],
        ["path", {
            d: "m3 8 4-4 4 4",
            key: "11wl7u"
        }],
        ["path", {
            d: "M7 4v16",
            key: "1glfcx"
        }]
    ],
    ee = a("arrow-up-down", q);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const A = [
        ["path", {
            d: "M7 7h10v10",
            key: "1tivn9"
        }],
        ["path", {
            d: "M7 17 17 7",
            key: "1vkiza"
        }]
    ],
    te = a("arrow-up-right", A);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const C = [
        ["path", {
            d: "m5 12 7-7 7 7",
            key: "hav0vg"
        }],
        ["path", {
            d: "M12 19V5",
            key: "x0mq9r"
        }]
    ],
    ce = a("arrow-up", C);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const H = [
        ["path", {
            d: "m3 8 4-4 4 4",
            key: "11wl7u"
        }],
        ["path", {
            d: "M7 4v16",
            key: "1glfcx"
        }],
        ["path", {
            d: "M15 4h5l-5 6h5",
            key: "8asdl1"
        }],
        ["path", {
            d: "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20",
            key: "r6l5cz"
        }],
        ["path", {
            d: "M20 18h-5",
            key: "18j1r2"
        }]
    ],
    oe = a("arrow-up-z-a", H);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const L = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "1",
            key: "41hilf"
        }],
        ["path", {
            d: "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",
            key: "1l2ple"
        }],
        ["path", {
            d: "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",
            key: "1wam0m"
        }]
    ],
    he = a("atom", L);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const V = [
        ["path", {
            d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
            key: "1yiouv"
        }],
        ["circle", {
            cx: "12",
            cy: "8",
            r: "6",
            key: "1vp47v"
        }]
    ],
    ye = a("award", V);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const S = [
        ["path", {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
            key: "3c2336"
        }],
        ["path", {
            d: "m9 12 2 2 4-4",
            key: "dzmm74"
        }]
    ],
    de = a("badge-check", S);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const P = [
        ["path", {
            d: "M4.929 4.929 19.07 19.071",
            key: "196cmz"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }]
    ],
    ne = a("ban", P);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const T = [
        ["path", {
            d: "M22 14v-4",
            key: "14q9d5"
        }],
        ["path", {
            d: "M6 14v-4",
            key: "14a6bd"
        }],
        ["rect", {
            x: "2",
            y: "6",
            width: "16",
            height: "12",
            rx: "2",
            key: "13zb55"
        }]
    ],
    se = a("battery-low", T);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const B = [
        ["path", {
            d: "M10 14v-4",
            key: "suye4c"
        }],
        ["path", {
            d: "M22 14v-4",
            key: "14q9d5"
        }],
        ["path", {
            d: "M6 14v-4",
            key: "14a6bd"
        }],
        ["rect", {
            x: "2",
            y: "6",
            width: "16",
            height: "12",
            rx: "2",
            key: "13zb55"
        }]
    ],
    ke = a("battery-medium", B);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Z = [
        ["path", {
            d: "M10.268 21a2 2 0 0 0 3.464 0",
            key: "vwvbt9"
        }],
        ["path", {
            d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
            key: "11g9vi"
        }]
    ],
    pe = a("bell", Z);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const R = [
        ["path", {
            d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",
            key: "mg9rjx"
        }]
    ],
    ie = a("bold", R);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const U = [
        ["path", {
            d: "M12 7v14",
            key: "1akyts"
        }],
        ["path", {
            d: "M16 12h2",
            key: "7q9ll5"
        }],
        ["path", {
            d: "M16 8h2",
            key: "msurwy"
        }],
        ["path", {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
            key: "ruj8y"
        }],
        ["path", {
            d: "M6 12h2",
            key: "32wvfc"
        }],
        ["path", {
            d: "M6 8h2",
            key: "30oboj"
        }]
    ],
    re = a("book-open-text", U);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const D = [
        ["path", {
            d: "M12 7v14",
            key: "1akyts"
        }],
        ["path", {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
            key: "ruj8y"
        }]
    ],
    le = a("book-open", D);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const F = [
        ["path", {
            d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",
            key: "1fy3hk"
        }]
    ],
    Me = a("bookmark", F);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const G = [
        ["path", {
            d: "M12 8V4H8",
            key: "hb8ula"
        }],
        ["rect", {
            width: "16",
            height: "12",
            x: "4",
            y: "8",
            rx: "2",
            key: "enze0r"
        }],
        ["path", {
            d: "M2 14h2",
            key: "vft8re"
        }],
        ["path", {
            d: "M20 14h2",
            key: "4cs60a"
        }],
        ["path", {
            d: "M15 13v2",
            key: "1xurst"
        }],
        ["path", {
            d: "M9 13v2",
            key: "rq6x2g"
        }]
    ],
    _e = a("bot", G);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const E = [
        ["path", {
            d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
            key: "l5xja"
        }],
        ["path", {
            d: "M9 13a4.5 4.5 0 0 0 3-4",
            key: "10igwf"
        }],
        ["path", {
            d: "M6.003 5.125A3 3 0 0 0 6.401 6.5",
            key: "105sqy"
        }],
        ["path", {
            d: "M3.477 10.896a4 4 0 0 1 .585-.396",
            key: "ql3yin"
        }],
        ["path", {
            d: "M6 18a4 4 0 0 1-1.967-.516",
            key: "2e4loj"
        }],
        ["path", {
            d: "M12 13h4",
            key: "1ku699"
        }],
        ["path", {
            d: "M12 18h6a2 2 0 0 1 2 2v1",
            key: "105ag5"
        }],
        ["path", {
            d: "M12 8h8",
            key: "1lhi5i"
        }],
        ["path", {
            d: "M16 8V5a2 2 0 0 1 2-2",
            key: "u6izg6"
        }],
        ["circle", {
            cx: "16",
            cy: "13",
            r: ".5",
            key: "ry7gng"
        }],
        ["circle", {
            cx: "18",
            cy: "3",
            r: ".5",
            key: "1aiba7"
        }],
        ["circle", {
            cx: "20",
            cy: "21",
            r: ".5",
            key: "yhc1fs"
        }],
        ["circle", {
            cx: "20",
            cy: "8",
            r: ".5",
            key: "1e43v0"
        }]
    ],
    xe = a("brain-circuit", E);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const I = [
        ["path", {
            d: "M12 18V5",
            key: "adv99a"
        }],
        ["path", {
            d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",
            key: "1e3is1"
        }],
        ["path", {
            d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",
            key: "1gqd8o"
        }],
        ["path", {
            d: "M17.997 5.125a4 4 0 0 1 2.526 5.77",
            key: "iwvgf7"
        }],
        ["path", {
            d: "M18 18a4 4 0 0 0 2-7.464",
            key: "efp6ie"
        }],
        ["path", {
            d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",
            key: "1gq6am"
        }],
        ["path", {
            d: "M6 18a4 4 0 0 1-2-7.464",
            key: "k1g0md"
        }],
        ["path", {
            d: "M6.003 5.125a4 4 0 0 0-2.526 5.77",
            key: "q97ue3"
        }]
    ],
    me = a("brain", I);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const O = [
        ["path", {
            d: "M12 20v-9",
            key: "1qisl0"
        }],
        ["path", {
            d: "M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z",
            key: "uouzyp"
        }],
        ["path", {
            d: "M14.12 3.88 16 2",
            key: "qol33r"
        }],
        ["path", {
            d: "M21 21a4 4 0 0 0-3.81-4",
            key: "1b0z45"
        }],
        ["path", {
            d: "M21 5a4 4 0 0 1-3.55 3.97",
            key: "5cxbf6"
        }],
        ["path", {
            d: "M22 13h-4",
            key: "1jl80f"
        }],
        ["path", {
            d: "M3 21a4 4 0 0 1 3.81-4",
            key: "1fjd4g"
        }],
        ["path", {
            d: "M3 5a4 4 0 0 0 3.55 3.97",
            key: "1d7oge"
        }],
        ["path", {
            d: "M6 13H2",
            key: "82j7cp"
        }],
        ["path", {
            d: "m8 2 1.88 1.88",
            key: "fmnt4t"
        }],
        ["path", {
            d: "M9 7.13V6a3 3 0 1 1 6 0v1.13",
            key: "1vgav8"
        }]
    ],
    ve = a("bug", O);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const W = [
        ["rect", {
            width: "16",
            height: "20",
            x: "4",
            y: "2",
            rx: "2",
            key: "1nb95v"
        }],
        ["line", {
            x1: "8",
            x2: "16",
            y1: "6",
            y2: "6",
            key: "x4nwl0"
        }],
        ["line", {
            x1: "16",
            x2: "16",
            y1: "14",
            y2: "18",
            key: "wjye3r"
        }],
        ["path", {
            d: "M16 10h.01",
            key: "1m94wz"
        }],
        ["path", {
            d: "M12 10h.01",
            key: "1nrarc"
        }],
        ["path", {
            d: "M8 10h.01",
            key: "19clt8"
        }],
        ["path", {
            d: "M12 14h.01",
            key: "1etili"
        }],
        ["path", {
            d: "M8 14h.01",
            key: "6423bh"
        }],
        ["path", {
            d: "M12 18h.01",
            key: "mhygvu"
        }],
        ["path", {
            d: "M8 18h.01",
            key: "lrp35t"
        }]
    ],
    ge = a("calculator", W);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const K = [
        ["path", {
            d: "M8 2v4",
            key: "1cmpym"
        }],
        ["path", {
            d: "M16 2v4",
            key: "4m81vk"
        }],
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "4",
            rx: "2",
            key: "1hopcy"
        }],
        ["path", {
            d: "M3 10h18",
            key: "8toen8"
        }],
        ["path", {
            d: "m9 16 2 2 4-4",
            key: "19s6y9"
        }]
    ],
    ue = a("calendar-check", K);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const J = [
        ["path", {
            d: "M16 14v2.2l1.6 1",
            key: "fo4ql5"
        }],
        ["path", {
            d: "M16 2v4",
            key: "4m81vk"
        }],
        ["path", {
            d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",
            key: "1osxxc"
        }],
        ["path", {
            d: "M3 10h5",
            key: "r794hk"
        }],
        ["path", {
            d: "M8 2v4",
            key: "1cmpym"
        }],
        ["circle", {
            cx: "16",
            cy: "16",
            r: "6",
            key: "qoo3c4"
        }]
    ],
    we = a("calendar-clock", J);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Q = [
        ["path", {
            d: "M8 2v4",
            key: "1cmpym"
        }],
        ["path", {
            d: "M16 2v4",
            key: "4m81vk"
        }],
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "4",
            rx: "2",
            key: "1hopcy"
        }],
        ["path", {
            d: "M3 10h18",
            key: "8toen8"
        }],
        ["path", {
            d: "M8 14h.01",
            key: "6423bh"
        }],
        ["path", {
            d: "M12 14h.01",
            key: "1etili"
        }],
        ["path", {
            d: "M16 14h.01",
            key: "1gbofw"
        }],
        ["path", {
            d: "M8 18h.01",
            key: "lrp35t"
        }],
        ["path", {
            d: "M12 18h.01",
            key: "mhygvu"
        }],
        ["path", {
            d: "M16 18h.01",
            key: "kzsmim"
        }]
    ],
    Ne = a("calendar-days", Q);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X = [
        ["path", {
            d: "M8 2v4",
            key: "1cmpym"
        }],
        ["path", {
            d: "M16 2v4",
            key: "4m81vk"
        }],
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "4",
            rx: "2",
            key: "1hopcy"
        }],
        ["path", {
            d: "M3 10h18",
            key: "8toen8"
        }]
    ],
    $e = a("calendar", X);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Y = [
        ["path", {
            d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
            key: "18u6gg"
        }],
        ["circle", {
            cx: "12",
            cy: "13",
            r: "3",
            key: "1vg3eu"
        }]
    ],
    fe = a("camera", Y);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const a1 = [
        ["path", {
            d: "M3 3v16a2 2 0 0 0 2 2h16",
            key: "c24i48"
        }],
        ["path", {
            d: "M18 17V9",
            key: "2bz60n"
        }],
        ["path", {
            d: "M13 17V5",
            key: "1frdt8"
        }],
        ["path", {
            d: "M8 17v-3",
            key: "17ska0"
        }]
    ],
    be = a("chart-column", a1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const e1 = [
        ["path", {
            d: "M3 3v16a2 2 0 0 0 2 2h16",
            key: "c24i48"
        }],
        ["path", {
            d: "m19 9-5 5-4-4-3 3",
            key: "2osh9i"
        }]
    ],
    ze = a("chart-line", e1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const t1 = [
        ["path", {
            d: "M5 21v-6",
            key: "1hz6c0"
        }],
        ["path", {
            d: "M12 21V9",
            key: "uvy0l4"
        }],
        ["path", {
            d: "M19 21V3",
            key: "11j9sm"
        }]
    ],
    je = a("chart-no-axes-column-increasing", t1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const c1 = [
        ["path", {
            d: "M5 21v-6",
            key: "1hz6c0"
        }],
        ["path", {
            d: "M12 21V3",
            key: "1lcnhd"
        }],
        ["path", {
            d: "M19 21V9",
            key: "unv183"
        }]
    ],
    qe = a("chart-no-axes-column", c1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o1 = [
        ["path", {
            d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",
            key: "pzmjnu"
        }],
        ["path", {
            d: "M21.21 15.89A10 10 0 1 1 8 2.83",
            key: "k2fpak"
        }]
    ],
    Ae = a("chart-pie", o1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const h1 = [
        ["path", {
            d: "M18 6 7 17l-5-5",
            key: "116fxf"
        }],
        ["path", {
            d: "m22 10-7.5 7.5L13 16",
            key: "ke71qq"
        }]
    ],
    Ce = a("check-check", h1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const y1 = [
        ["path", {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }]
    ],
    He = a("check", y1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const d1 = [
        ["path", {
            d: "m6 9 6 6 6-6",
            key: "qrunsl"
        }]
    ],
    Le = a("chevron-down", d1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const n1 = [
        ["path", {
            d: "m15 18-6-6 6-6",
            key: "1wnfg3"
        }]
    ],
    Ve = a("chevron-left", n1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const s1 = [
        ["path", {
            d: "m9 18 6-6-6-6",
            key: "mthhwq"
        }]
    ],
    Se = a("chevron-right", s1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const k1 = [
        ["path", {
            d: "m18 15-6-6-6 6",
            key: "153udz"
        }]
    ],
    Pe = a("chevron-up", k1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const p1 = [
        ["path", {
            d: "m6 17 5-5-5-5",
            key: "xnjwq"
        }],
        ["path", {
            d: "m13 17 5-5-5-5",
            key: "17xmmf"
        }]
    ],
    Te = a("chevrons-right", p1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const i1 = [
        ["path", {
            d: "M10.88 21.94 15.46 14",
            key: "xkve6t"
        }],
        ["path", {
            d: "M21.17 8H12",
            key: "19dcdn"
        }],
        ["path", {
            d: "M3.95 6.06 8.54 14",
            key: "g8jz9m"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "4",
            key: "4exip2"
        }]
    ],
    Be = a("chromium", i1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r1 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["line", {
            x1: "12",
            x2: "12",
            y1: "8",
            y2: "12",
            key: "1pkeuh"
        }],
        ["line", {
            x1: "12",
            x2: "12.01",
            y1: "16",
            y2: "16",
            key: "4dfq90"
        }]
    ],
    Ze = a("circle-alert", r1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const l1 = [
        ["path", {
            d: "M21.801 10A10 10 0 1 1 17 3.335",
            key: "yps3ct"
        }],
        ["path", {
            d: "m9 11 3 3L22 4",
            key: "1pflzl"
        }]
    ],
    Re = a("circle-check-big", l1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const M1 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "m9 12 2 2 4-4",
            key: "dzmm74"
        }]
    ],
    Ue = a("circle-check", M1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _1 = [
        ["path", {
            d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
            key: "kmsa83"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }]
    ],
    De = a("circle-play", _1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const x1 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "M8 12h8",
            key: "1wcyev"
        }],
        ["path", {
            d: "M12 8v8",
            key: "napkw2"
        }]
    ],
    Fe = a("circle-plus", x1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const m1 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
            key: "1u773s"
        }],
        ["path", {
            d: "M12 17h.01",
            key: "p32p05"
        }]
    ],
    Ge = a("circle-question-mark", m1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const v1 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "m15 9-6 6",
            key: "1uzhvr"
        }],
        ["path", {
            d: "m9 9 6 6",
            key: "z0biqf"
        }]
    ],
    Ee = a("circle-x", v1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const g1 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }]
    ],
    Ie = a("circle", g1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const u1 = [
        ["rect", {
            width: "8",
            height: "4",
            x: "8",
            y: "2",
            rx: "1",
            ry: "1",
            key: "tgr4d6"
        }],
        ["path", {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
            key: "116196"
        }],
        ["path", {
            d: "M12 11h4",
            key: "1jrz19"
        }],
        ["path", {
            d: "M12 16h4",
            key: "n85exb"
        }],
        ["path", {
            d: "M8 11h.01",
            key: "1dfujw"
        }],
        ["path", {
            d: "M8 16h.01",
            key: "18s6g9"
        }]
    ],
    Oe = a("clipboard-list", u1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const w1 = [
        ["path", {
            d: "M12 6v6h4",
            key: "135r8i"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }]
    ],
    We = a("clock-3", w1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const N1 = [
        ["path", {
            d: "M12 6v6l4 2",
            key: "mmk7yg"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }]
    ],
    Ke = a("clock", N1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $1 = [
        ["path", {
            d: "M12 13v8l-4-4",
            key: "1f5nwf"
        }],
        ["path", {
            d: "m12 21 4-4",
            key: "1lfcce"
        }],
        ["path", {
            d: "M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284",
            key: "ui1hmy"
        }]
    ],
    Je = a("cloud-download", $1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const f1 = [
        ["path", {
            d: "m2 2 20 20",
            key: "1ooewy"
        }],
        ["path", {
            d: "M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193",
            key: "yfwify"
        }],
        ["path", {
            d: "M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07",
            key: "jlfiyv"
        }]
    ],
    Qe = a("cloud-off", f1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b1 = [
        ["path", {
            d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
            key: "1pljnt"
        }],
        ["path", {
            d: "M16 14v6",
            key: "1j4efv"
        }],
        ["path", {
            d: "M8 14v6",
            key: "17c4r9"
        }],
        ["path", {
            d: "M12 16v6",
            key: "c8a4gj"
        }]
    ],
    Xe = a("cloud-rain", b1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const z1 = [
        ["path", {
            d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
            key: "p7xjir"
        }]
    ],
    Ye = a("cloud", z1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const j1 = [
        ["path", {
            d: "m16 18 6-6-6-6",
            key: "eg8j8"
        }],
        ["path", {
            d: "m8 6-6 6 6 6",
            key: "ppft3o"
        }]
    ],
    at = a("code", j1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const q1 = [
        ["path", {
            d: "M10 2v2",
            key: "7u0qdc"
        }],
        ["path", {
            d: "M14 2v2",
            key: "6buw04"
        }],
        ["path", {
            d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
            key: "pwadti"
        }],
        ["path", {
            d: "M6 2v2",
            key: "colzsn"
        }]
    ],
    et = a("coffee", q1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const A1 = [
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            key: "afitv7"
        }],
        ["path", {
            d: "M12 3v18",
            key: "108xh3"
        }]
    ],
    tt = a("columns-2", A1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const C1 = [
        ["path", {
            d: "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",
            key: "11bfej"
        }]
    ],
    ct = a("command", C1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const H1 = [
        ["path", {
            d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
            key: "9ktpf1"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }]
    ],
    ot = a("compass", H1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const L1 = [
        ["rect", {
            width: "14",
            height: "14",
            x: "8",
            y: "8",
            rx: "2",
            ry: "2",
            key: "17jyea"
        }],
        ["path", {
            d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
            key: "zix9uf"
        }]
    ],
    ht = a("copy", L1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const V1 = [
        ["path", {
            d: "M12 20v2",
            key: "1lh1kg"
        }],
        ["path", {
            d: "M12 2v2",
            key: "tus03m"
        }],
        ["path", {
            d: "M17 20v2",
            key: "1rnc9c"
        }],
        ["path", {
            d: "M17 2v2",
            key: "11trls"
        }],
        ["path", {
            d: "M2 12h2",
            key: "1t8f8n"
        }],
        ["path", {
            d: "M2 17h2",
            key: "7oei6x"
        }],
        ["path", {
            d: "M2 7h2",
            key: "asdhe0"
        }],
        ["path", {
            d: "M20 12h2",
            key: "1q8mjw"
        }],
        ["path", {
            d: "M20 17h2",
            key: "1fpfkl"
        }],
        ["path", {
            d: "M20 7h2",
            key: "1o8tra"
        }],
        ["path", {
            d: "M7 20v2",
            key: "4gnj0m"
        }],
        ["path", {
            d: "M7 2v2",
            key: "1i4yhu"
        }],
        ["rect", {
            x: "4",
            y: "4",
            width: "16",
            height: "16",
            rx: "2",
            key: "1vbyd7"
        }],
        ["rect", {
            x: "8",
            y: "8",
            width: "8",
            height: "8",
            rx: "1",
            key: "z9xiuo"
        }]
    ],
    yt = a("cpu", V1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const S1 = [
        ["rect", {
            width: "20",
            height: "14",
            x: "2",
            y: "5",
            rx: "2",
            key: "ynyp8z"
        }],
        ["line", {
            x1: "2",
            x2: "22",
            y1: "10",
            y2: "10",
            key: "1b3vmo"
        }]
    ],
    dt = a("credit-card", S1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const P1 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["line", {
            x1: "22",
            x2: "18",
            y1: "12",
            y2: "12",
            key: "l9bcsi"
        }],
        ["line", {
            x1: "6",
            x2: "2",
            y1: "12",
            y2: "12",
            key: "13hhkx"
        }],
        ["line", {
            x1: "12",
            x2: "12",
            y1: "6",
            y2: "2",
            key: "10w3f3"
        }],
        ["line", {
            x1: "12",
            x2: "12",
            y1: "22",
            y2: "18",
            key: "15g9kq"
        }]
    ],
    nt = a("crosshair", P1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const T1 = [
        ["path", {
            d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
            key: "1vdc57"
        }],
        ["path", {
            d: "M5 21h14",
            key: "11awu3"
        }]
    ],
    st = a("crown", T1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const B1 = [
        ["ellipse", {
            cx: "12",
            cy: "5",
            rx: "9",
            ry: "3",
            key: "msslwz"
        }],
        ["path", {
            d: "M3 5V19A9 3 0 0 0 21 19V5",
            key: "1wlel7"
        }],
        ["path", {
            d: "M3 12A9 3 0 0 0 21 12",
            key: "mv7ke4"
        }]
    ],
    kt = a("database", B1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Z1 = [
        ["path", {
            d: "m10 16 1.5 1.5",
            key: "11lckj"
        }],
        ["path", {
            d: "m14 8-1.5-1.5",
            key: "1ohn8i"
        }],
        ["path", {
            d: "M15 2c-1.798 1.998-2.518 3.995-2.807 5.993",
            key: "80uv8i"
        }],
        ["path", {
            d: "m16.5 10.5 1 1",
            key: "696xn5"
        }],
        ["path", {
            d: "m17 6-2.891-2.891",
            key: "xu6p2f"
        }],
        ["path", {
            d: "M2 15c6.667-6 13.333 0 20-6",
            key: "1pyr53"
        }],
        ["path", {
            d: "m20 9 .891.891",
            key: "3xwk7g"
        }],
        ["path", {
            d: "M3.109 14.109 4 15",
            key: "q76aoh"
        }],
        ["path", {
            d: "m6.5 12.5 1 1",
            key: "cs35ky"
        }],
        ["path", {
            d: "m7 18 2.891 2.891",
            key: "1sisit"
        }],
        ["path", {
            d: "M9 22c1.798-1.998 2.518-3.995 2.807-5.993",
            key: "q3hbxp"
        }]
    ],
    pt = a("dna", Z1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const R1 = [
        ["path", {
            d: "M12 15V3",
            key: "m9g1x1"
        }],
        ["path", {
            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
            key: "ih7n3h"
        }],
        ["path", {
            d: "m7 10 5 5 5-5",
            key: "brsn70"
        }]
    ],
    it = a("download", R1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const U1 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "1",
            key: "41hilf"
        }],
        ["circle", {
            cx: "12",
            cy: "5",
            r: "1",
            key: "gxeob9"
        }],
        ["circle", {
            cx: "12",
            cy: "19",
            r: "1",
            key: "lyex9k"
        }]
    ],
    rt = a("ellipsis-vertical", U1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const D1 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "1",
            key: "41hilf"
        }],
        ["circle", {
            cx: "19",
            cy: "12",
            r: "1",
            key: "1wjl8i"
        }],
        ["circle", {
            cx: "5",
            cy: "12",
            r: "1",
            key: "1pcz8c"
        }]
    ],
    lt = a("ellipsis", D1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const F1 = [
        ["path", {
            d: "M15 3h6v6",
            key: "1q9fwt"
        }],
        ["path", {
            d: "M10 14 21 3",
            key: "gplh6r"
        }],
        ["path", {
            d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
            key: "a6xqqp"
        }]
    ],
    Mt = a("external-link", F1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const G1 = [
        ["path", {
            d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
            key: "ct8e1f"
        }],
        ["path", {
            d: "M14.084 14.158a3 3 0 0 1-4.242-4.242",
            key: "151rxh"
        }],
        ["path", {
            d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
            key: "13bj9a"
        }],
        ["path", {
            d: "m2 2 20 20",
            key: "1ooewy"
        }]
    ],
    _t = a("eye-off", G1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const E1 = [
        ["path", {
            d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
            key: "1nclc0"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "3",
            key: "1v7zrd"
        }]
    ],
    xt = a("eye", E1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const I1 = [
        ["path", {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6"
        }],
        ["path", {
            d: "M14 2v5a1 1 0 0 0 1 1h5",
            key: "wfsgrz"
        }],
        ["path", {
            d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",
            key: "1oajmo"
        }],
        ["path", {
            d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",
            key: "mpwhp6"
        }]
    ],
    mt = a("file-braces", I1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const O1 = [
        ["path", {
            d: "M11 21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1",
            key: "likhh7"
        }],
        ["path", {
            d: "M16 16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1",
            key: "17ky3x"
        }],
        ["path", {
            d: "M21 6a2 2 0 0 0-.586-1.414l-2-2A2 2 0 0 0 17 2h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z",
            key: "1hyeo0"
        }]
    ],
    vt = a("file-stack", O1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const W1 = [
        ["path", {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6"
        }],
        ["path", {
            d: "M14 2v5a1 1 0 0 0 1 1h5",
            key: "wfsgrz"
        }],
        ["path", {
            d: "M10 9H8",
            key: "b1mrlr"
        }],
        ["path", {
            d: "M16 13H8",
            key: "t4e002"
        }],
        ["path", {
            d: "M16 17H8",
            key: "z1uh3a"
        }]
    ],
    gt = a("file-text", W1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const K1 = [
        ["path", {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6"
        }],
        ["path", {
            d: "M14 2v5a1 1 0 0 0 1 1h5",
            key: "wfsgrz"
        }],
        ["path", {
            d: "M11 18h2",
            key: "12mj7e"
        }],
        ["path", {
            d: "M12 12v6",
            key: "3ahymv"
        }],
        ["path", {
            d: "M9 13v-.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v.5",
            key: "qbrxap"
        }]
    ],
    ut = a("file-type", K1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const J1 = [
        ["path", {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6"
        }],
        ["path", {
            d: "M14 2v5a1 1 0 0 0 1 1h5",
            key: "wfsgrz"
        }],
        ["path", {
            d: "M12 12v6",
            key: "3ahymv"
        }],
        ["path", {
            d: "m15 15-3-3-3 3",
            key: "15xj92"
        }]
    ],
    wt = a("file-up", J1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Q1 = [
        ["path", {
            d: "M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528",
            key: "1jaruq"
        }]
    ],
    Nt = a("flag", Q1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X1 = [
        ["path", {
            d: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
            key: "1slcih"
        }]
    ],
    $t = a("flame", X1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Y1 = [
        ["path", {
            d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
            key: "18mbvz"
        }],
        ["path", {
            d: "M6.453 15h11.094",
            key: "3shlmq"
        }],
        ["path", {
            d: "M8.5 2h7",
            key: "csnxdl"
        }]
    ],
    ft = a("flask-conical", Y1);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const a2 = [
        ["path", {
            d: "M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1",
            key: "3pnvol"
        }],
        ["circle", {
            cx: "12",
            cy: "8",
            r: "2",
            key: "1822b1"
        }],
        ["path", {
            d: "M12 10v12",
            key: "6ubwww"
        }],
        ["path", {
            d: "M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z",
            key: "9hd38g"
        }],
        ["path", {
            d: "M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z",
            key: "ufn41s"
        }]
    ],
    bt = a("flower-2", a2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const e2 = [
        ["path", {
            d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
            key: "sc7q7i"
        }]
    ],
    zt = a("funnel", e2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const t2 = [
        ["path", {
            d: "m12 14 4-4",
            key: "9kzdfg"
        }],
        ["path", {
            d: "M3.34 19a10 10 0 1 1 17.32 0",
            key: "19p75a"
        }]
    ],
    jt = a("gauge", t2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const c2 = [
        ["path", {
            d: "M9 10h.01",
            key: "qbtxuw"
        }],
        ["path", {
            d: "M15 10h.01",
            key: "1qmjsl"
        }],
        ["path", {
            d: "M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",
            key: "uwwb07"
        }]
    ],
    qt = a("ghost", c2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o2 = [
        ["rect", {
            x: "3",
            y: "8",
            width: "18",
            height: "4",
            rx: "1",
            key: "bkv52"
        }],
        ["path", {
            d: "M12 8v13",
            key: "1c76mn"
        }],
        ["path", {
            d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",
            key: "6wjy6b"
        }],
        ["path", {
            d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
            key: "1ihvrl"
        }]
    ],
    At = a("gift", o2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const h2 = [
        ["line", {
            x1: "6",
            x2: "6",
            y1: "3",
            y2: "15",
            key: "17qcm7"
        }],
        ["circle", {
            cx: "18",
            cy: "6",
            r: "3",
            key: "1h7g24"
        }],
        ["circle", {
            cx: "6",
            cy: "18",
            r: "3",
            key: "fqmcym"
        }],
        ["path", {
            d: "M18 9a9 9 0 0 1-9 9",
            key: "n2h4wq"
        }]
    ],
    Ct = a("git-branch", h2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const y2 = [
        ["path", {
            d: "M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z",
            key: "p55z4y"
        }],
        ["path", {
            d: "M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0",
            key: "mjntcy"
        }]
    ],
    Ht = a("glass-water", y2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const d2 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
            key: "13o1zl"
        }],
        ["path", {
            d: "M2 12h20",
            key: "9i4pu4"
        }]
    ],
    Lt = a("globe", d2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const n2 = [
        ["path", {
            d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
            key: "j76jl0"
        }],
        ["path", {
            d: "M22 10v6",
            key: "1lu8f3"
        }],
        ["path", {
            d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5",
            key: "1r8lef"
        }]
    ],
    Vt = a("graduation-cap", n2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const s2 = [
        ["path", {
            d: "M12 3v18",
            key: "108xh3"
        }],
        ["path", {
            d: "M3 12h18",
            key: "1i2n21"
        }],
        ["rect", {
            x: "3",
            y: "3",
            width: "18",
            height: "18",
            rx: "2",
            key: "h1oib"
        }]
    ],
    St = a("grid-2x2", s2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const k2 = [
        ["circle", {
            cx: "9",
            cy: "12",
            r: "1",
            key: "1vctgf"
        }],
        ["circle", {
            cx: "9",
            cy: "5",
            r: "1",
            key: "hp0tcf"
        }],
        ["circle", {
            cx: "9",
            cy: "19",
            r: "1",
            key: "fkjjf6"
        }],
        ["circle", {
            cx: "15",
            cy: "12",
            r: "1",
            key: "1tmaij"
        }],
        ["circle", {
            cx: "15",
            cy: "5",
            r: "1",
            key: "19l28e"
        }],
        ["circle", {
            cx: "15",
            cy: "19",
            r: "1",
            key: "f4zoj3"
        }]
    ],
    Pt = a("grip-vertical", k2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const p2 = [
        ["path", {
            d: "m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9",
            key: "1hayfq"
        }],
        ["path", {
            d: "m18 15 4-4",
            key: "16gjal"
        }],
        ["path", {
            d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5",
            key: "15ts47"
        }]
    ],
    Tt = a("hammer", p2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const i2 = [
        ["line", {
            x1: "22",
            x2: "2",
            y1: "12",
            y2: "12",
            key: "1y58io"
        }],
        ["path", {
            d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
            key: "oot6mr"
        }],
        ["line", {
            x1: "6",
            x2: "6.01",
            y1: "16",
            y2: "16",
            key: "sgf278"
        }],
        ["line", {
            x1: "10",
            x2: "10.01",
            y1: "16",
            y2: "16",
            key: "1l4acy"
        }]
    ],
    Bt = a("hard-drive", i2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r2 = [
        ["line", {
            x1: "4",
            x2: "20",
            y1: "9",
            y2: "9",
            key: "4lhtct"
        }],
        ["line", {
            x1: "4",
            x2: "20",
            y1: "15",
            y2: "15",
            key: "vyu0kd"
        }],
        ["line", {
            x1: "10",
            x2: "8",
            y1: "3",
            y2: "21",
            key: "1ggp8o"
        }],
        ["line", {
            x1: "16",
            x2: "14",
            y1: "3",
            y2: "21",
            key: "weycgp"
        }]
    ],
    Zt = a("hash", r2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const l2 = [
        ["path", {
            d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
            key: "mvr1a0"
        }]
    ],
    Rt = a("heart", l2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const M2 = [
        ["path", {
            d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
            key: "yt0hxn"
        }]
    ],
    Ut = a("hexagon", M2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _2 = [
        ["path", {
            d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
            key: "1357e3"
        }],
        ["path", {
            d: "M3 3v5h5",
            key: "1xhq8a"
        }],
        ["path", {
            d: "M12 7v5l4 2",
            key: "1fdv2h"
        }]
    ],
    Dt = a("history", _2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const x2 = [
        ["path", {
            d: "M5 22h14",
            key: "ehvnwv"
        }],
        ["path", {
            d: "M5 2h14",
            key: "pdyrp9"
        }],
        ["path", {
            d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",
            key: "1d314k"
        }],
        ["path", {
            d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",
            key: "1vvvr6"
        }]
    ],
    Ft = a("hourglass", x2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const m2 = [
        ["path", {
            d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
            key: "5wwlr5"
        }],
        ["path", {
            d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
            key: "r6nss1"
        }]
    ],
    Gt = a("house", m2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const v2 = [
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            ry: "2",
            key: "1m3agn"
        }],
        ["circle", {
            cx: "9",
            cy: "9",
            r: "2",
            key: "af1f0g"
        }],
        ["path", {
            d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
            key: "1xmnt7"
        }]
    ],
    Et = a("image", v2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const g2 = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "M12 16v-4",
            key: "1dtifu"
        }],
        ["path", {
            d: "M12 8h.01",
            key: "e9boi3"
        }]
    ],
    It = a("info", g2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const u2 = [
        ["line", {
            x1: "19",
            x2: "10",
            y1: "4",
            y2: "4",
            key: "15jd3p"
        }],
        ["line", {
            x1: "14",
            x2: "5",
            y1: "20",
            y2: "20",
            key: "bu0au3"
        }],
        ["line", {
            x1: "15",
            x2: "9",
            y1: "4",
            y2: "20",
            key: "uljnxc"
        }]
    ],
    Ot = a("italic", u2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const w2 = [
        ["path", {
            d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",
            key: "g0fldk"
        }],
        ["path", {
            d: "m21 2-9.6 9.6",
            key: "1j0ho8"
        }],
        ["circle", {
            cx: "7.5",
            cy: "15.5",
            r: "5.5",
            key: "yqb3hr"
        }]
    ],
    Wt = a("key", w2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const N2 = [
        ["path", {
            d: "M10 8h.01",
            key: "1r9ogq"
        }],
        ["path", {
            d: "M12 12h.01",
            key: "1mp3jc"
        }],
        ["path", {
            d: "M14 8h.01",
            key: "1primd"
        }],
        ["path", {
            d: "M16 12h.01",
            key: "1l6xoz"
        }],
        ["path", {
            d: "M18 8h.01",
            key: "emo2bl"
        }],
        ["path", {
            d: "M6 8h.01",
            key: "x9i8wu"
        }],
        ["path", {
            d: "M7 16h10",
            key: "wp8him"
        }],
        ["path", {
            d: "M8 12h.01",
            key: "czm47f"
        }],
        ["rect", {
            width: "20",
            height: "16",
            x: "2",
            y: "4",
            rx: "2",
            key: "18n3k1"
        }]
    ],
    Kt = a("keyboard", N2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $2 = [
        ["path", {
            d: "m5 8 6 6",
            key: "1wu5hv"
        }],
        ["path", {
            d: "m4 14 6-6 2-3",
            key: "1k1g8d"
        }],
        ["path", {
            d: "M2 5h12",
            key: "or177f"
        }],
        ["path", {
            d: "M7 2h1",
            key: "1t2jsx"
        }],
        ["path", {
            d: "m22 22-5-10-5 10",
            key: "don7ne"
        }],
        ["path", {
            d: "M14 18h6",
            key: "1m8k6r"
        }]
    ],
    Jt = a("languages", $2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const f2 = [
        ["path", {
            d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
            key: "zw3jo"
        }],
        ["path", {
            d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
            key: "1wduqc"
        }],
        ["path", {
            d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
            key: "kqbvx6"
        }]
    ],
    Qt = a("layers", f2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b2 = [
        ["rect", {
            width: "7",
            height: "9",
            x: "3",
            y: "3",
            rx: "1",
            key: "10lvy0"
        }],
        ["rect", {
            width: "7",
            height: "5",
            x: "14",
            y: "3",
            rx: "1",
            key: "16une8"
        }],
        ["rect", {
            width: "7",
            height: "9",
            x: "14",
            y: "12",
            rx: "1",
            key: "1hutg5"
        }],
        ["rect", {
            width: "7",
            height: "5",
            x: "3",
            y: "16",
            rx: "1",
            key: "ldoo1y"
        }]
    ],
    Xt = a("layout-dashboard", b2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const z2 = [
        ["rect", {
            width: "7",
            height: "7",
            x: "3",
            y: "3",
            rx: "1",
            key: "1g98yp"
        }],
        ["rect", {
            width: "7",
            height: "7",
            x: "3",
            y: "14",
            rx: "1",
            key: "1bb6yr"
        }],
        ["path", {
            d: "M14 4h7",
            key: "3xa0d5"
        }],
        ["path", {
            d: "M14 9h7",
            key: "1icrd9"
        }],
        ["path", {
            d: "M14 15h7",
            key: "1mj8o2"
        }],
        ["path", {
            d: "M14 20h7",
            key: "11slyb"
        }]
    ],
    Yt = a("layout-list", z2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const j2 = [
        ["rect", {
            width: "7",
            height: "7",
            x: "3",
            y: "3",
            rx: "1",
            key: "1g98yp"
        }],
        ["rect", {
            width: "7",
            height: "7",
            x: "14",
            y: "3",
            rx: "1",
            key: "6d4xhi"
        }],
        ["rect", {
            width: "7",
            height: "7",
            x: "14",
            y: "14",
            rx: "1",
            key: "nxv5o0"
        }],
        ["rect", {
            width: "7",
            height: "7",
            x: "3",
            y: "14",
            rx: "1",
            key: "1bb6yr"
        }]
    ],
    ac = a("layout-grid", j2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const q2 = [
        ["rect", {
            width: "18",
            height: "7",
            x: "3",
            y: "3",
            rx: "1",
            key: "f1a2em"
        }],
        ["rect", {
            width: "9",
            height: "7",
            x: "3",
            y: "14",
            rx: "1",
            key: "jqznyg"
        }],
        ["rect", {
            width: "5",
            height: "7",
            x: "16",
            y: "14",
            rx: "1",
            key: "q5h2i8"
        }]
    ],
    ec = a("layout-template", q2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const A2 = [
        ["path", {
            d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
            key: "nnexq3"
        }],
        ["path", {
            d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
            key: "mt58a7"
        }]
    ],
    tc = a("leaf", A2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const C2 = [
        ["path", {
            d: "m16 6 4 14",
            key: "ji33uf"
        }],
        ["path", {
            d: "M12 6v14",
            key: "1n7gus"
        }],
        ["path", {
            d: "M8 8v12",
            key: "1gg7y9"
        }],
        ["path", {
            d: "M4 4v16",
            key: "6qkkli"
        }]
    ],
    cc = a("library", C2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const H2 = [
        ["path", {
            d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
            key: "1gvzjb"
        }],
        ["path", {
            d: "M9 18h6",
            key: "x1upvd"
        }],
        ["path", {
            d: "M10 22h4",
            key: "ceow96"
        }]
    ],
    oc = a("lightbulb", H2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const L2 = [
        ["path", {
            d: "M9 17H7A5 5 0 0 1 7 7h2",
            key: "8i5ue5"
        }],
        ["path", {
            d: "M15 7h2a5 5 0 1 1 0 10h-2",
            key: "1b9ql8"
        }],
        ["line", {
            x1: "8",
            x2: "16",
            y1: "12",
            y2: "12",
            key: "1jonct"
        }]
    ],
    hc = a("link-2", L2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const V2 = [
        ["path", {
            d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
            key: "1cjeqo"
        }],
        ["path", {
            d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
            key: "19qd67"
        }]
    ],
    yc = a("link", V2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const S2 = [
        ["path", {
            d: "M13 5h8",
            key: "a7qcls"
        }],
        ["path", {
            d: "M13 12h8",
            key: "h98zly"
        }],
        ["path", {
            d: "M13 19h8",
            key: "c3s6r1"
        }],
        ["path", {
            d: "m3 17 2 2 4-4",
            key: "1jhpwq"
        }],
        ["path", {
            d: "m3 7 2 2 4-4",
            key: "1obspn"
        }]
    ],
    dc = a("list-checks", S2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const P2 = [
        ["path", {
            d: "M13 5h8",
            key: "a7qcls"
        }],
        ["path", {
            d: "M13 12h8",
            key: "h98zly"
        }],
        ["path", {
            d: "M13 19h8",
            key: "c3s6r1"
        }],
        ["path", {
            d: "m3 17 2 2 4-4",
            key: "1jhpwq"
        }],
        ["rect", {
            x: "3",
            y: "4",
            width: "6",
            height: "6",
            rx: "1",
            key: "cif1o7"
        }]
    ],
    nc = a("list-todo", P2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const T2 = [
        ["path", {
            d: "M3 5h.01",
            key: "18ugdj"
        }],
        ["path", {
            d: "M3 12h.01",
            key: "nlz23k"
        }],
        ["path", {
            d: "M3 19h.01",
            key: "noohij"
        }],
        ["path", {
            d: "M8 5h13",
            key: "1pao27"
        }],
        ["path", {
            d: "M8 12h13",
            key: "1za7za"
        }],
        ["path", {
            d: "M8 19h13",
            key: "m83p4d"
        }]
    ],
    sc = a("list", T2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const B2 = [
        ["path", {
            d: "M21 12a9 9 0 1 1-6.219-8.56",
            key: "13zald"
        }]
    ],
    kc = a("loader-circle", B2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Z2 = [
        ["path", {
            d: "M12 2v4",
            key: "3427ic"
        }],
        ["path", {
            d: "m16.2 7.8 2.9-2.9",
            key: "r700ao"
        }],
        ["path", {
            d: "M18 12h4",
            key: "wj9ykh"
        }],
        ["path", {
            d: "m16.2 16.2 2.9 2.9",
            key: "1bxg5t"
        }],
        ["path", {
            d: "M12 18v4",
            key: "jadmvz"
        }],
        ["path", {
            d: "m4.9 19.1 2.9-2.9",
            key: "bwix9q"
        }],
        ["path", {
            d: "M2 12h4",
            key: "j09sii"
        }],
        ["path", {
            d: "m4.9 4.9 2.9 2.9",
            key: "giyufr"
        }]
    ],
    pc = a("loader", Z2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const R2 = [
        ["circle", {
            cx: "12",
            cy: "16",
            r: "1",
            key: "1au0dj"
        }],
        ["rect", {
            x: "3",
            y: "10",
            width: "18",
            height: "12",
            rx: "2",
            key: "6s8ecr"
        }],
        ["path", {
            d: "M7 10V7a5 5 0 0 1 10 0v3",
            key: "1pqi11"
        }]
    ],
    ic = a("lock-keyhole", R2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const U2 = [
        ["path", {
            d: "m10 17 5-5-5-5",
            key: "1bsop3"
        }],
        ["path", {
            d: "M15 12H3",
            key: "6jk70r"
        }],
        ["path", {
            d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",
            key: "u53s6r"
        }]
    ],
    rc = a("log-in", U2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const D2 = [
        ["rect", {
            width: "18",
            height: "11",
            x: "3",
            y: "11",
            rx: "2",
            ry: "2",
            key: "1w4ew1"
        }],
        ["path", {
            d: "M7 11V7a5 5 0 0 1 10 0v4",
            key: "fwvmzm"
        }]
    ],
    lc = a("lock", D2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const F2 = [
        ["path", {
            d: "m16 17 5-5-5-5",
            key: "1bji2h"
        }],
        ["path", {
            d: "M21 12H9",
            key: "dn1m92"
        }],
        ["path", {
            d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
            key: "1uf3rs"
        }]
    ],
    Mc = a("log-out", F2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const G2 = [
        ["path", {
            d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
            key: "132q7q"
        }],
        ["rect", {
            x: "2",
            y: "4",
            width: "20",
            height: "16",
            rx: "2",
            key: "izxlao"
        }]
    ],
    _c = a("mail", G2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const E2 = [
        ["path", {
            d: "M15 3h6v6",
            key: "1q9fwt"
        }],
        ["path", {
            d: "m21 3-7 7",
            key: "1l2asr"
        }],
        ["path", {
            d: "m3 21 7-7",
            key: "tjx5ai"
        }],
        ["path", {
            d: "M9 21H3v-6",
            key: "wtvkvv"
        }]
    ],
    xc = a("maximize-2", E2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const I2 = [
        ["path", {
            d: "M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15",
            key: "143lza"
        }],
        ["path", {
            d: "M11 12 5.12 2.2",
            key: "qhuxz6"
        }],
        ["path", {
            d: "m13 12 5.88-9.8",
            key: "hbye0f"
        }],
        ["path", {
            d: "M8 7h8",
            key: "i86dvs"
        }],
        ["circle", {
            cx: "12",
            cy: "17",
            r: "5",
            key: "qbz8iq"
        }],
        ["path", {
            d: "M12 18v-2h-.5",
            key: "fawc4q"
        }]
    ],
    mc = a("medal", I2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const O2 = [
        ["path", {
            d: "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
            key: "q8bfy3"
        }],
        ["path", {
            d: "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14",
            key: "1853fq"
        }],
        ["path", {
            d: "M8 6v8",
            key: "15ugcq"
        }]
    ],
    vc = a("megaphone", O2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const W2 = [
        ["path", {
            d: "M4 5h16",
            key: "1tepv9"
        }],
        ["path", {
            d: "M4 12h16",
            key: "1lakjw"
        }],
        ["path", {
            d: "M4 19h16",
            key: "1djgab"
        }]
    ],
    gc = a("menu", W2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const K2 = [
        ["path", {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
            key: "1sd12s"
        }]
    ],
    uc = a("message-circle", K2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const J2 = [
        ["path", {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
            key: "18887p"
        }],
        ["path", {
            d: "M12 8v6",
            key: "1ib9pf"
        }],
        ["path", {
            d: "M9 11h6",
            key: "1fldmi"
        }]
    ],
    wc = a("message-square-plus", J2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Q2 = [
        ["path", {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
            key: "18887p"
        }]
    ],
    Nc = a("message-square", Q2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X2 = [
        ["path", {
            d: "M6 18h8",
            key: "1borvv"
        }],
        ["path", {
            d: "M3 22h18",
            key: "8prr45"
        }],
        ["path", {
            d: "M14 22a7 7 0 1 0 0-14h-1",
            key: "1jwaiy"
        }],
        ["path", {
            d: "M9 14h2",
            key: "197e7h"
        }],
        ["path", {
            d: "M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z",
            key: "1bmzmy"
        }],
        ["path", {
            d: "M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3",
            key: "1drr47"
        }]
    ],
    $c = a("microscope", X2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Y2 = [
        ["path", {
            d: "M12 13v8",
            key: "1l5pq0"
        }],
        ["path", {
            d: "M12 3v3",
            key: "1n5kay"
        }],
        ["path", {
            d: "M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z",
            key: "1btarq"
        }]
    ],
    fc = a("milestone", Y2);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const a0 = [
        ["path", {
            d: "m14 10 7-7",
            key: "oa77jy"
        }],
        ["path", {
            d: "M20 10h-6V4",
            key: "mjg0md"
        }],
        ["path", {
            d: "m3 21 7-7",
            key: "tjx5ai"
        }],
        ["path", {
            d: "M4 14h6v6",
            key: "rmj7iw"
        }]
    ],
    bc = a("minimize-2", a0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const e0 = [
        ["path", {
            d: "M5 12h14",
            key: "1ays0h"
        }]
    ],
    zc = a("minus", e0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const t0 = [
        ["path", {
            d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",
            key: "10dyio"
        }],
        ["path", {
            d: "M10 19v-3.96 3.15",
            key: "1irgej"
        }],
        ["path", {
            d: "M7 19h5",
            key: "qswx4l"
        }],
        ["rect", {
            width: "6",
            height: "10",
            x: "16",
            y: "12",
            rx: "2",
            key: "1egngj"
        }]
    ],
    jc = a("monitor-smartphone", t0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const c0 = [
        ["rect", {
            width: "20",
            height: "14",
            x: "2",
            y: "3",
            rx: "2",
            key: "48i651"
        }],
        ["line", {
            x1: "8",
            x2: "16",
            y1: "21",
            y2: "21",
            key: "1svkeh"
        }],
        ["line", {
            x1: "12",
            x2: "12",
            y1: "17",
            y2: "21",
            key: "vw1qmm"
        }]
    ],
    qc = a("monitor", c0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o0 = [
        ["path", {
            d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
            key: "kfwtm"
        }]
    ],
    Ac = a("moon", o0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const h0 = [
        ["path", {
            d: "m8 3 4 8 5-5 5 15H2L8 3z",
            key: "otkl63"
        }]
    ],
    Cc = a("mountain", h0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const y0 = [
        ["path", {
            d: "M12 2v20",
            key: "t6zp3m"
        }],
        ["path", {
            d: "m15 19-3 3-3-3",
            key: "11eu04"
        }],
        ["path", {
            d: "m19 9 3 3-3 3",
            key: "1mg7y2"
        }],
        ["path", {
            d: "M2 12h20",
            key: "9i4pu4"
        }],
        ["path", {
            d: "m5 9-3 3 3 3",
            key: "j64kie"
        }],
        ["path", {
            d: "m9 5 3-3 3 3",
            key: "l8vdw6"
        }]
    ],
    Hc = a("move", y0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const d0 = [
        ["path", {
            d: "M9 18V5l12-2v13",
            key: "1jmyc2"
        }],
        ["circle", {
            cx: "6",
            cy: "18",
            r: "3",
            key: "fqmcym"
        }],
        ["circle", {
            cx: "18",
            cy: "16",
            r: "3",
            key: "1hluhg"
        }]
    ],
    Lc = a("music", d0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const n0 = [
        ["rect", {
            x: "16",
            y: "16",
            width: "6",
            height: "6",
            rx: "1",
            key: "4q2zg0"
        }],
        ["rect", {
            x: "2",
            y: "16",
            width: "6",
            height: "6",
            rx: "1",
            key: "8cvhb9"
        }],
        ["rect", {
            x: "9",
            y: "2",
            width: "6",
            height: "6",
            rx: "1",
            key: "1egb70"
        }],
        ["path", {
            d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",
            key: "1jsf9p"
        }],
        ["path", {
            d: "M12 12V8",
            key: "2874zd"
        }]
    ],
    Vc = a("network", n0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const s0 = [
        ["path", {
            d: "M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4",
            key: "re6nr2"
        }],
        ["path", {
            d: "M2 6h4",
            key: "aawbzj"
        }],
        ["path", {
            d: "M2 10h4",
            key: "l0bgd4"
        }],
        ["path", {
            d: "M2 14h4",
            key: "1gsvsf"
        }],
        ["path", {
            d: "M2 18h4",
            key: "1bu2t1"
        }],
        ["path", {
            d: "M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
            key: "pqwjuv"
        }]
    ],
    Sc = a("notebook-pen", s0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const k0 = [
        ["path", {
            d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
            key: "e79jfc"
        }],
        ["circle", {
            cx: "13.5",
            cy: "6.5",
            r: ".5",
            fill: "currentColor",
            key: "1okk4w"
        }],
        ["circle", {
            cx: "17.5",
            cy: "10.5",
            r: ".5",
            fill: "currentColor",
            key: "f64h9f"
        }],
        ["circle", {
            cx: "6.5",
            cy: "12.5",
            r: ".5",
            fill: "currentColor",
            key: "qy21gx"
        }],
        ["circle", {
            cx: "8.5",
            cy: "7.5",
            r: ".5",
            fill: "currentColor",
            key: "fotxhn"
        }]
    ],
    Pc = a("palette", k0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const p0 = [
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            key: "afitv7"
        }],
        ["path", {
            d: "M9 3v18",
            key: "fh3hqa"
        }],
        ["path", {
            d: "m16 15-3-3 3-3",
            key: "14y99z"
        }]
    ],
    Tc = a("panel-left-close", p0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const i0 = [
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            key: "afitv7"
        }],
        ["path", {
            d: "M9 3v18",
            key: "fh3hqa"
        }],
        ["path", {
            d: "m14 9 3 3-3 3",
            key: "8010ee"
        }]
    ],
    Bc = a("panel-left-open", i0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r0 = [
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            key: "afitv7"
        }],
        ["path", {
            d: "M3 9h18",
            key: "1pudct"
        }]
    ],
    Zc = a("panel-top", r0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const l0 = [
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            key: "afitv7"
        }],
        ["path", {
            d: "M3 9h18",
            key: "1pudct"
        }],
        ["path", {
            d: "M9 21V9",
            key: "1oto5p"
        }]
    ],
    Rc = a("panels-top-left", l0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const M0 = [
        ["path", {
            d: "M5.8 11.3 2 22l10.7-3.79",
            key: "gwxi1d"
        }],
        ["path", {
            d: "M4 3h.01",
            key: "1vcuye"
        }],
        ["path", {
            d: "M22 8h.01",
            key: "1mrtc2"
        }],
        ["path", {
            d: "M15 2h.01",
            key: "1cjtqr"
        }],
        ["path", {
            d: "M22 20h.01",
            key: "1mrys2"
        }],
        ["path", {
            d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
            key: "hbicv8"
        }],
        ["path", {
            d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17",
            key: "1i94pl"
        }],
        ["path", {
            d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7",
            key: "1cofks"
        }],
        ["path", {
            d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
            key: "4kbmks"
        }]
    ],
    Uc = a("party-popper", M0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _0 = [
        ["rect", {
            x: "14",
            y: "3",
            width: "5",
            height: "18",
            rx: "1",
            key: "kaeet6"
        }],
        ["rect", {
            x: "5",
            y: "3",
            width: "5",
            height: "18",
            rx: "1",
            key: "1wsw3u"
        }]
    ],
    Dc = a("pause", _0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const x0 = [
        ["path", {
            d: "M13 21h8",
            key: "1jsn5i"
        }],
        ["path", {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
            key: "1a8usu"
        }]
    ],
    Fc = a("pen-line", x0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const m0 = [
        ["path", {
            d: "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z",
            key: "nt11vn"
        }],
        ["path", {
            d: "m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18",
            key: "15qc1e"
        }],
        ["path", {
            d: "m2.3 2.3 7.286 7.286",
            key: "1wuzzi"
        }],
        ["circle", {
            cx: "11",
            cy: "11",
            r: "2",
            key: "xmgehs"
        }]
    ],
    Gc = a("pen-tool", m0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const v0 = [
        ["path", {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
            key: "1a8usu"
        }]
    ],
    Ec = a("pen", v0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const g0 = [
        ["path", {
            d: "M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13",
            key: "orapub"
        }],
        ["path", {
            d: "m8 6 2-2",
            key: "115y1s"
        }],
        ["path", {
            d: "m18 16 2-2",
            key: "ee94s4"
        }],
        ["path", {
            d: "m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17",
            key: "cfq27r"
        }],
        ["path", {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
            key: "1a8usu"
        }],
        ["path", {
            d: "m15 5 4 4",
            key: "1mk7zo"
        }]
    ],
    Ic = a("pencil-ruler", g0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const u0 = [
        ["path", {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
            key: "1a8usu"
        }],
        ["path", {
            d: "m15 5 4 4",
            key: "1mk7zo"
        }]
    ],
    Oc = a("pencil", u0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const w0 = [
        ["path", {
            d: "M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4",
            key: "daa4of"
        }],
        ["rect", {
            width: "10",
            height: "7",
            x: "12",
            y: "13",
            rx: "2",
            key: "1nb8gs"
        }]
    ],
    Wc = a("picture-in-picture-2", w0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const N0 = [
        ["path", {
            d: "M12 17v5",
            key: "bb1du9"
        }],
        ["path", {
            d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
            key: "1nkz8b"
        }]
    ],
    Kc = a("pin", N0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $0 = [
        ["path", {
            d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
            key: "10ikf1"
        }]
    ],
    Jc = a("play", $0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const f0 = [
        ["path", {
            d: "M12 22v-5",
            key: "1ega77"
        }],
        ["path", {
            d: "M9 8V2",
            key: "14iosj"
        }],
        ["path", {
            d: "M15 8V2",
            key: "18g5xt"
        }],
        ["path", {
            d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",
            key: "osxo6l"
        }]
    ],
    Qc = a("plug", f0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b0 = [
        ["path", {
            d: "M5 12h14",
            key: "1ays0h"
        }],
        ["path", {
            d: "M12 5v14",
            key: "s699le"
        }]
    ],
    Xc = a("plus", b0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const z0 = [
        ["path", {
            d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
            key: "rib7q0"
        }],
        ["path", {
            d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
            key: "1ymkrd"
        }]
    ],
    Yc = a("quote", z0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const j0 = [
        ["path", {
            d: "M16.247 7.761a6 6 0 0 1 0 8.478",
            key: "1fwjs5"
        }],
        ["path", {
            d: "M19.075 4.933a10 10 0 0 1 0 14.134",
            key: "ehdyv1"
        }],
        ["path", {
            d: "M4.925 19.067a10 10 0 0 1 0-14.134",
            key: "1q22gi"
        }],
        ["path", {
            d: "M7.753 16.239a6 6 0 0 1 0-8.478",
            key: "r2q7qm"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "2",
            key: "1c9p78"
        }]
    ],
    ao = a("radio", j0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const q0 = [
        ["path", {
            d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
            key: "14sxne"
        }],
        ["path", {
            d: "M3 3v5h5",
            key: "1xhq8a"
        }],
        ["path", {
            d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",
            key: "1hlbsb"
        }],
        ["path", {
            d: "M16 16h5v5",
            key: "ccwih5"
        }]
    ],
    eo = a("refresh-ccw", q0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const A0 = [
        ["path", {
            d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
            key: "v9h5vc"
        }],
        ["path", {
            d: "M21 3v5h-5",
            key: "1q7to0"
        }],
        ["path", {
            d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
            key: "3uifl3"
        }],
        ["path", {
            d: "M8 16H3v5",
            key: "1cv678"
        }]
    ],
    to = a("refresh-cw", A0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const C0 = [
        ["path", {
            d: "m2 9 3-3 3 3",
            key: "1ltn5i"
        }],
        ["path", {
            d: "M13 18H7a2 2 0 0 1-2-2V6",
            key: "1r6tfw"
        }],
        ["path", {
            d: "m22 15-3 3-3-3",
            key: "4rnwn2"
        }],
        ["path", {
            d: "M11 6h6a2 2 0 0 1 2 2v10",
            key: "2f72bc"
        }]
    ],
    co = a("repeat-2", C0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const H0 = [
        ["path", {
            d: "m17 2 4 4-4 4",
            key: "nntrym"
        }],
        ["path", {
            d: "M3 11v-1a4 4 0 0 1 4-4h14",
            key: "84bu3i"
        }],
        ["path", {
            d: "m7 22-4-4 4-4",
            key: "1wqhfi"
        }],
        ["path", {
            d: "M21 13v1a4 4 0 0 1-4 4H3",
            key: "1rx37r"
        }]
    ],
    oo = a("repeat", H0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const L0 = [
        ["path", {
            d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
            key: "m3kijz"
        }],
        ["path", {
            d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
            key: "1fmvmk"
        }],
        ["path", {
            d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",
            key: "1f8sc4"
        }],
        ["path", {
            d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
            key: "qeys4"
        }]
    ],
    ho = a("rocket", L0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const V0 = [
        ["path", {
            d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
            key: "1357e3"
        }],
        ["path", {
            d: "M3 3v5h5",
            key: "1xhq8a"
        }]
    ],
    yo = a("rotate-ccw", V0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const S0 = [
        ["path", {
            d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",
            key: "1p45f6"
        }],
        ["path", {
            d: "M21 3v5h-5",
            key: "1q7to0"
        }]
    ],
    no = a("rotate-cw", S0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const P0 = [
        ["path", {
            d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
            key: "1c8476"
        }],
        ["path", {
            d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
            key: "1ydtos"
        }],
        ["path", {
            d: "M7 3v4a1 1 0 0 0 1 1h7",
            key: "t51u73"
        }]
    ],
    so = a("save", P0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const T0 = [
        ["path", {
            d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",
            key: "7g6ntu"
        }],
        ["path", {
            d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",
            key: "ijws7r"
        }],
        ["path", {
            d: "M7 21h10",
            key: "1b0cd5"
        }],
        ["path", {
            d: "M12 3v18",
            key: "108xh3"
        }],
        ["path", {
            d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",
            key: "3gwbw2"
        }]
    ],
    ko = a("scale", T0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const B0 = [
        ["path", {
            d: "M19 17V5a2 2 0 0 0-2-2H4",
            key: "zz82l3"
        }],
        ["path", {
            d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
            key: "1ph1d7"
        }]
    ],
    po = a("scroll", B0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Z0 = [
        ["path", {
            d: "m21 21-4.34-4.34",
            key: "14j7rj"
        }],
        ["circle", {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }]
    ],
    io = a("search", Z0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const R0 = [
        ["path", {
            d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
            key: "1ffxy3"
        }],
        ["path", {
            d: "m21.854 2.147-10.94 10.939",
            key: "12cjpa"
        }]
    ],
    ro = a("send", R0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const U0 = [
        ["rect", {
            width: "20",
            height: "8",
            x: "2",
            y: "2",
            rx: "2",
            ry: "2",
            key: "ngkwjq"
        }],
        ["rect", {
            width: "20",
            height: "8",
            x: "2",
            y: "14",
            rx: "2",
            ry: "2",
            key: "iecqi9"
        }],
        ["line", {
            x1: "6",
            x2: "6.01",
            y1: "6",
            y2: "6",
            key: "16zg32"
        }],
        ["line", {
            x1: "6",
            x2: "6.01",
            y1: "18",
            y2: "18",
            key: "nzw8ys"
        }]
    ],
    lo = a("server", U0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const D0 = [
        ["path", {
            d: "M14 17H5",
            key: "gfn3mx"
        }],
        ["path", {
            d: "M19 7h-9",
            key: "6i9tg"
        }],
        ["circle", {
            cx: "17",
            cy: "17",
            r: "3",
            key: "18b49y"
        }],
        ["circle", {
            cx: "7",
            cy: "7",
            r: "3",
            key: "dfmy0x"
        }]
    ],
    Mo = a("settings-2", D0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const F0 = [
        ["path", {
            d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
            key: "1i5ecw"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "3",
            key: "1v7zrd"
        }]
    ],
    _o = a("settings", F0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const G0 = [
        ["circle", {
            cx: "18",
            cy: "5",
            r: "3",
            key: "gq8acd"
        }],
        ["circle", {
            cx: "6",
            cy: "12",
            r: "3",
            key: "w7nqdw"
        }],
        ["circle", {
            cx: "18",
            cy: "19",
            r: "3",
            key: "1xt0gg"
        }],
        ["line", {
            x1: "8.59",
            x2: "15.42",
            y1: "13.51",
            y2: "17.49",
            key: "47mynk"
        }],
        ["line", {
            x1: "15.41",
            x2: "8.59",
            y1: "6.51",
            y2: "10.49",
            key: "1n3mei"
        }]
    ],
    xo = a("share-2", G0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const E0 = [
        ["path", {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }],
        ["path", {
            d: "M12 8v4",
            key: "1got3b"
        }],
        ["path", {
            d: "M12 16h.01",
            key: "1drbdi"
        }]
    ],
    mo = a("shield-alert", E0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const I0 = [
        ["path", {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }],
        ["path", {
            d: "m9 12 2 2 4-4",
            key: "dzmm74"
        }]
    ],
    vo = a("shield-check", I0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const O0 = [
        ["path", {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }],
        ["path", {
            d: "m14.5 9.5-5 5",
            key: "17q4r4"
        }],
        ["path", {
            d: "m9.5 9.5 5 5",
            key: "18nt4w"
        }]
    ],
    go = a("shield-x", O0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const W0 = [
        ["path", {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }]
    ],
    uo = a("shield", W0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const K0 = [
        ["path", {
            d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",
            key: "1wgbhj"
        }]
    ],
    wo = a("shirt", K0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const J0 = [
        ["path", {
            d: "M16 10a4 4 0 0 1-8 0",
            key: "1ltviw"
        }],
        ["path", {
            d: "M3.103 6.034h17.794",
            key: "awc11p"
        }],
        ["path", {
            d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
            key: "o988cm"
        }]
    ],
    No = a("shopping-bag", J0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Q0 = [
        ["path", {
            d: "m18 14 4 4-4 4",
            key: "10pe0f"
        }],
        ["path", {
            d: "m18 2 4 4-4 4",
            key: "pucp1d"
        }],
        ["path", {
            d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",
            key: "1ailkh"
        }],
        ["path", {
            d: "M2 6h1.972a4 4 0 0 1 3.6 2.2",
            key: "km57vx"
        }],
        ["path", {
            d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45",
            key: "os18l9"
        }]
    ],
    $o = a("shuffle", Q0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X0 = [
        ["path", {
            d: "M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2",
            key: "wuwx1p"
        }]
    ],
    fo = a("sigma", X0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Y0 = [
        ["path", {
            d: "M21 4v16",
            key: "7j8fe9"
        }],
        ["path", {
            d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
            key: "zs4d6"
        }]
    ],
    bo = a("skip-forward", Y0);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const aa = [
        ["path", {
            d: "M10 5H3",
            key: "1qgfaw"
        }],
        ["path", {
            d: "M12 19H3",
            key: "yhmn1j"
        }],
        ["path", {
            d: "M14 3v4",
            key: "1sua03"
        }],
        ["path", {
            d: "M16 17v4",
            key: "1q0r14"
        }],
        ["path", {
            d: "M21 12h-9",
            key: "1o4lsq"
        }],
        ["path", {
            d: "M21 19h-5",
            key: "1rlt1p"
        }],
        ["path", {
            d: "M21 5h-7",
            key: "1oszz2"
        }],
        ["path", {
            d: "M8 10v4",
            key: "tgpxqk"
        }],
        ["path", {
            d: "M8 12H3",
            key: "a7s4jb"
        }]
    ],
    zo = a("sliders-horizontal", aa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ea = [
        ["rect", {
            width: "14",
            height: "20",
            x: "5",
            y: "2",
            rx: "2",
            ry: "2",
            key: "1yt0o3"
        }],
        ["path", {
            d: "M12 18h.01",
            key: "mhygvu"
        }]
    ],
    jo = a("smartphone", ea);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ta = [
        ["path", {
            d: "m10 20-1.25-2.5L6 18",
            key: "18frcb"
        }],
        ["path", {
            d: "M10 4 8.75 6.5 6 6",
            key: "7mghy3"
        }],
        ["path", {
            d: "m14 20 1.25-2.5L18 18",
            key: "1chtki"
        }],
        ["path", {
            d: "m14 4 1.25 2.5L18 6",
            key: "1b4wsy"
        }],
        ["path", {
            d: "m17 21-3-6h-4",
            key: "15hhxa"
        }],
        ["path", {
            d: "m17 3-3 6 1.5 3",
            key: "11697g"
        }],
        ["path", {
            d: "M2 12h6.5L10 9",
            key: "kv9z4n"
        }],
        ["path", {
            d: "m20 10-1.5 2 1.5 2",
            key: "1swlpi"
        }],
        ["path", {
            d: "M22 12h-6.5L14 15",
            key: "1mxi28"
        }],
        ["path", {
            d: "m4 10 1.5 2L4 14",
            key: "k9enpj"
        }],
        ["path", {
            d: "m7 21 3-6-1.5-3",
            key: "j8hb9u"
        }],
        ["path", {
            d: "m7 3 3 6h4",
            key: "1otusx"
        }]
    ],
    qo = a("snowflake", ta);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ca = [
        ["path", {
            d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
            key: "1s2grr"
        }],
        ["path", {
            d: "M20 2v4",
            key: "1rf3ol"
        }],
        ["path", {
            d: "M22 4h-4",
            key: "gwowj6"
        }],
        ["circle", {
            cx: "4",
            cy: "20",
            r: "2",
            key: "6kqj1y"
        }]
    ],
    Ao = a("sparkles", ca);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const oa = [
        ["path", {
            d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",
            key: "2acyp4"
        }],
        ["path", {
            d: "m9 11 3 3L22 4",
            key: "1pflzl"
        }]
    ],
    Co = a("square-check-big", oa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ha = [
        ["rect", {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            ry: "2",
            key: "1m3agn"
        }],
        ["path", {
            d: "M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3",
            key: "m1af9g"
        }],
        ["path", {
            d: "M9 11.2h5.7",
            key: "3zgcl2"
        }]
    ],
    Ho = a("square-function", ha);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ya = [
        ["path", {
            d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
            key: "1m0v6g"
        }],
        ["path", {
            d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
            key: "ohrbg2"
        }]
    ],
    Lo = a("square-pen", ya);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const da = [
        ["path", {
            d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
            key: "r04s7s"
        }]
    ],
    Vo = a("star", da);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const na = [
        ["path", {
            d: "M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z",
            key: "1dfntj"
        }],
        ["path", {
            d: "M15 3v5a1 1 0 0 0 1 1h5",
            key: "6s6qgf"
        }]
    ],
    So = a("sticky-note", na);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sa = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "4",
            key: "4exip2"
        }],
        ["path", {
            d: "M12 2v2",
            key: "tus03m"
        }],
        ["path", {
            d: "M12 20v2",
            key: "1lh1kg"
        }],
        ["path", {
            d: "m4.93 4.93 1.41 1.41",
            key: "149t6j"
        }],
        ["path", {
            d: "m17.66 17.66 1.41 1.41",
            key: "ptbguv"
        }],
        ["path", {
            d: "M2 12h2",
            key: "1t8f8n"
        }],
        ["path", {
            d: "M20 12h2",
            key: "1q8mjw"
        }],
        ["path", {
            d: "m6.34 17.66-1.41 1.41",
            key: "1m8zz5"
        }],
        ["path", {
            d: "m19.07 4.93-1.41 1.41",
            key: "1shlcs"
        }]
    ],
    Po = a("sun", sa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ka = [
        ["path", {
            d: "M12 10V2",
            key: "16sf7g"
        }],
        ["path", {
            d: "m4.93 10.93 1.41 1.41",
            key: "2a7f42"
        }],
        ["path", {
            d: "M2 18h2",
            key: "j10viu"
        }],
        ["path", {
            d: "M20 18h2",
            key: "wocana"
        }],
        ["path", {
            d: "m19.07 10.93-1.41 1.41",
            key: "15zs5n"
        }],
        ["path", {
            d: "M22 22H2",
            key: "19qnx5"
        }],
        ["path", {
            d: "m16 6-4 4-4-4",
            key: "6wukr"
        }],
        ["path", {
            d: "M16 18a4 4 0 0 0-8 0",
            key: "1lzouq"
        }]
    ],
    To = a("sunset", ka);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pa = [
        ["polyline", {
            points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5",
            key: "1hfsw2"
        }],
        ["line", {
            x1: "13",
            x2: "19",
            y1: "19",
            y2: "13",
            key: "1vrmhu"
        }],
        ["line", {
            x1: "16",
            x2: "20",
            y1: "16",
            y2: "20",
            key: "1bron3"
        }],
        ["line", {
            x1: "19",
            x2: "21",
            y1: "21",
            y2: "19",
            key: "13pww6"
        }],
        ["polyline", {
            points: "14.5 6.5 18 3 21 3 21 6 17.5 9.5",
            key: "hbey2j"
        }],
        ["line", {
            x1: "5",
            x2: "9",
            y1: "14",
            y2: "18",
            key: "1hf58s"
        }],
        ["line", {
            x1: "7",
            x2: "4",
            y1: "17",
            y2: "20",
            key: "pidxm4"
        }],
        ["line", {
            x1: "3",
            x2: "5",
            y1: "19",
            y2: "21",
            key: "1pehsh"
        }]
    ],
    Bo = a("swords", pa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ia = [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "6",
            key: "1vlfrh"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "2",
            key: "1c9p78"
        }]
    ],
    Zo = a("target", ia);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ra = [
        ["path", {
            d: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2",
            key: "125lnx"
        }],
        ["path", {
            d: "M8.5 2h7",
            key: "csnxdl"
        }],
        ["path", {
            d: "M14.5 16h-5",
            key: "1ox875"
        }]
    ],
    Ro = a("test-tube", ra);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const la = [
        ["path", {
            d: "M3 5h18",
            key: "1u36vt"
        }],
        ["path", {
            d: "M3 12h18",
            key: "1i2n21"
        }],
        ["path", {
            d: "M3 19h18",
            key: "awlh7x"
        }]
    ],
    Uo = a("text-align-justify", la);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ma = [
        ["path", {
            d: "M21 5H3",
            key: "1fi0y6"
        }],
        ["path", {
            d: "M15 12H3",
            key: "6jk70r"
        }],
        ["path", {
            d: "M17 19H3",
            key: "z6ezky"
        }]
    ],
    Do = a("text-align-start", Ma);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _a = [
        ["path", {
            d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
            key: "qn84l0"
        }],
        ["path", {
            d: "M13 5v2",
            key: "dyzc3o"
        }],
        ["path", {
            d: "M13 17v2",
            key: "1ont0d"
        }],
        ["path", {
            d: "M13 11v2",
            key: "1wjjxi"
        }]
    ],
    Fo = a("ticket", _a);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xa = [
        ["path", {
            d: "M10 2h4",
            key: "n1abiw"
        }],
        ["path", {
            d: "M12 14v-4",
            key: "1evpnu"
        }],
        ["path", {
            d: "M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6",
            key: "1ts96g"
        }],
        ["path", {
            d: "M9 17H4v5",
            key: "8t5av"
        }]
    ],
    Go = a("timer-reset", xa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ma = [
        ["line", {
            x1: "10",
            x2: "14",
            y1: "2",
            y2: "2",
            key: "14vaq8"
        }],
        ["line", {
            x1: "12",
            x2: "15",
            y1: "14",
            y2: "11",
            key: "17fdiu"
        }],
        ["circle", {
            cx: "12",
            cy: "14",
            r: "8",
            key: "1e1u0o"
        }]
    ],
    Eo = a("timer", ma);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const va = [
        ["path", {
            d: "M10 11v6",
            key: "nco0om"
        }],
        ["path", {
            d: "M14 11v6",
            key: "outv1u"
        }],
        ["path", {
            d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
            key: "miytrc"
        }],
        ["path", {
            d: "M3 6h18",
            key: "d0wm0j"
        }],
        ["path", {
            d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
            key: "e791ji"
        }]
    ],
    Io = a("trash-2", va);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ga = [
        ["path", {
            d: "M16 17h6v-6",
            key: "t6n2it"
        }],
        ["path", {
            d: "m22 17-8.5-8.5-5 5L2 7",
            key: "x473p"
        }]
    ],
    Oo = a("trending-down", ga);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ua = [
        ["path", {
            d: "M16 7h6v6",
            key: "box55l"
        }],
        ["path", {
            d: "m22 7-8.5 8.5-5-5L2 17",
            key: "1t1m79"
        }]
    ],
    Wo = a("trending-up", ua);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wa = [
        ["path", {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
        }],
        ["path", {
            d: "M12 9v4",
            key: "juzpu7"
        }],
        ["path", {
            d: "M12 17h.01",
            key: "p32p05"
        }]
    ],
    Ko = a("triangle-alert", wa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Na = [
        ["path", {
            d: "M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
            key: "14u9p9"
        }]
    ],
    Jo = a("triangle", Na);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $a = [
        ["path", {
            d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",
            key: "1n3hpd"
        }],
        ["path", {
            d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",
            key: "rfe1zi"
        }],
        ["path", {
            d: "M18 9h1.5a1 1 0 0 0 0-5H18",
            key: "7xy6bh"
        }],
        ["path", {
            d: "M4 22h16",
            key: "57wxv0"
        }],
        ["path", {
            d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
            key: "1mhfuq"
        }],
        ["path", {
            d: "M6 9H4.5a1 1 0 0 1 0-5H6",
            key: "tex48p"
        }]
    ],
    Qo = a("trophy", $a);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fa = [
        ["path", {
            d: "M12 4v16",
            key: "1654pz"
        }],
        ["path", {
            d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",
            key: "e0r10z"
        }],
        ["path", {
            d: "M9 20h6",
            key: "s66wpe"
        }]
    ],
    Xo = a("type", fa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ba = [
        ["path", {
            d: "M9 14 4 9l5-5",
            key: "102s5s"
        }],
        ["path", {
            d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
            key: "f3b9sd"
        }]
    ],
    Yo = a("undo-2", ba);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const za = [
        ["path", {
            d: "M12 3v12",
            key: "1x0j5s"
        }],
        ["path", {
            d: "m17 8-5-5-5 5",
            key: "7q97r8"
        }],
        ["path", {
            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
            key: "ih7n3h"
        }]
    ],
    ah = a("upload", za);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ja = [
        ["path", {
            d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
            key: "1yyitq"
        }],
        ["circle", {
            cx: "9",
            cy: "7",
            r: "4",
            key: "nufk8"
        }],
        ["line", {
            x1: "22",
            x2: "16",
            y1: "11",
            y2: "11",
            key: "1shjgl"
        }]
    ],
    eh = a("user-minus", ja);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qa = [
        ["path", {
            d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
            key: "1yyitq"
        }],
        ["circle", {
            cx: "9",
            cy: "7",
            r: "4",
            key: "nufk8"
        }],
        ["line", {
            x1: "19",
            x2: "19",
            y1: "8",
            y2: "14",
            key: "1bvyxn"
        }],
        ["line", {
            x1: "22",
            x2: "16",
            y1: "11",
            y2: "11",
            key: "1shjgl"
        }]
    ],
    th = a("user-plus", qa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Aa = [
        ["circle", {
            cx: "12",
            cy: "8",
            r: "5",
            key: "1hypcn"
        }],
        ["path", {
            d: "M20 21a8 8 0 0 0-16 0",
            key: "rfgkzh"
        }]
    ],
    ch = a("user-round", Aa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ca = [
        ["path", {
            d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
            key: "975kel"
        }],
        ["circle", {
            cx: "12",
            cy: "7",
            r: "4",
            key: "17ys0d"
        }]
    ],
    oh = a("user", Ca);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ha = [
        ["path", {
            d: "M18 21a8 8 0 0 0-16 0",
            key: "3ypg7q"
        }],
        ["circle", {
            cx: "10",
            cy: "8",
            r: "5",
            key: "o932ke"
        }],
        ["path", {
            d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",
            key: "10s06x"
        }]
    ],
    hh = a("users-round", Ha);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const La = [
        ["path", {
            d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
            key: "1yyitq"
        }],
        ["path", {
            d: "M16 3.128a4 4 0 0 1 0 7.744",
            key: "16gr8j"
        }],
        ["path", {
            d: "M22 21v-2a4 4 0 0 0-3-3.87",
            key: "kshegd"
        }],
        ["circle", {
            cx: "9",
            cy: "7",
            r: "4",
            key: "nufk8"
        }]
    ],
    yh = a("users", La);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Va = [
        ["path", {
            d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
            key: "ftymec"
        }],
        ["rect", {
            x: "2",
            y: "6",
            width: "14",
            height: "12",
            rx: "2",
            key: "158x01"
        }]
    ],
    dh = a("video", Va);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sa = [
        ["path", {
            d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
            key: "uqj9uw"
        }],
        ["path", {
            d: "M16 9a5 5 0 0 1 0 6",
            key: "1q6k2b"
        }],
        ["path", {
            d: "M19.364 18.364a9 9 0 0 0 0-12.728",
            key: "ijwkga"
        }]
    ],
    nh = a("volume-2", Sa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pa = [
        ["path", {
            d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
            key: "uqj9uw"
        }],
        ["line", {
            x1: "22",
            x2: "16",
            y1: "9",
            y2: "15",
            key: "1ewh16"
        }],
        ["line", {
            x1: "16",
            x2: "22",
            y1: "9",
            y2: "15",
            key: "5ykzw1"
        }]
    ],
    sh = a("volume-x", Pa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ta = [
        ["path", {
            d: "M12 10v2.2l1.6 1",
            key: "n3r21l"
        }],
        ["path", {
            d: "m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05",
            key: "18k57s"
        }],
        ["path", {
            d: "m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05",
            key: "16ny36"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "6",
            key: "1vlfrh"
        }]
    ],
    kh = a("watch", Ta);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ba = [
        ["path", {
            d: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
            key: "knzxuh"
        }],
        ["path", {
            d: "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
            key: "2jd2cc"
        }],
        ["path", {
            d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
            key: "rd2r6e"
        }]
    ],
    ph = a("waves", Ba);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Za = [
        ["path", {
            d: "M12 20h.01",
            key: "zekei9"
        }],
        ["path", {
            d: "M8.5 16.429a5 5 0 0 1 7 0",
            key: "1bycff"
        }],
        ["path", {
            d: "M5 12.859a10 10 0 0 1 5.17-2.69",
            key: "1dl1wf"
        }],
        ["path", {
            d: "M19 12.859a10 10 0 0 0-2.007-1.523",
            key: "4k23kn"
        }],
        ["path", {
            d: "M2 8.82a15 15 0 0 1 4.177-2.643",
            key: "1grhjp"
        }],
        ["path", {
            d: "M22 8.82a15 15 0 0 0-11.288-3.764",
            key: "z3jwby"
        }],
        ["path", {
            d: "m2 2 20 20",
            key: "1ooewy"
        }]
    ],
    ih = a("wifi-off", Za);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ra = [
        ["path", {
            d: "M12.8 19.6A2 2 0 1 0 14 16H2",
            key: "148xed"
        }],
        ["path", {
            d: "M17.5 8a2.5 2.5 0 1 1 2 4H2",
            key: "1u4tom"
        }],
        ["path", {
            d: "M9.8 4.4A2 2 0 1 1 11 8H2",
            key: "75valh"
        }]
    ],
    rh = a("wind", Ra);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ua = [
        ["path", {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }],
        ["path", {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }]
    ],
    lh = a("x", Ua);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Da = [
        ["path", {
            d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
            key: "1xq2db"
        }]
    ],
    Mh = a("zap", Da);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fa = [
        ["circle", {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }],
        ["line", {
            x1: "21",
            x2: "16.65",
            y1: "21",
            y2: "16.65",
            key: "13gj7c"
        }],
        ["line", {
            x1: "11",
            x2: "11",
            y1: "8",
            y2: "14",
            key: "1vmskp"
        }],
        ["line", {
            x1: "8",
            x2: "14",
            y1: "11",
            y2: "11",
            key: "durymu"
        }]
    ],
    _h = a("zoom-in", Fa);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ga = [
        ["circle", {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }],
        ["line", {
            x1: "21",
            x2: "16.65",
            y1: "21",
            y2: "16.65",
            key: "13gj7c"
        }],
        ["line", {
            x1: "8",
            x2: "14",
            y1: "11",
            y2: "11",
            key: "durymu"
        }]
    ],
    xh = a("zoom-out", Ga);
export {
    Jt as $, he as A, le as B, Se as C, fo as D, pt as E, po as F, Lt as G, Gt as H, It as I, oc as J, me as K, Qt as L, zc as M, Jo as N, Ro as O, Xc as P, ko as Q, ho as R, Ao as S, Zo as T, yh as U, Oc as V, ph as W, lh as X, $c as Y, Mh as Z, tc as _, Ke as a, te as a$, Dt as a0, gt as a1, kt as a2, yt as a3, at as a4, fe as a5, Lc as a6, Pc as a7, ft as a8, ge as a9, Nt as aA, nc as aB, Wo as aC, io as aD, Re as aE, Fo as aF, $t as aG, oh as aH, hh as aI, $o as aJ, Ve as aK, uc as aL, Fe as aM, Tt as aN, vt as aO, Jc as aP, ne as aQ, ro as aR, Zt as aS, ve as aT, Ut as aU, oo as aV, ye as aW, Oo as aX, vo as aY, Mt as aZ, rc as a_, to as aa, Io as ab, so as ac, lo as ad, et as ae, Ee as af, Yc as ag, de as ah, Xt as ai, Eo as aj, Co as ak, _o as al, $e as am, ih as an, jc as ao, ht as ap, Pt as aq, ce as ar, Xa as as, Qo as at, qe as au, mc as av, Le as aw, Go as ax, xe as ay, bo as az, Vt as b, we as b$, Po as b0, Ac as b1, gc as b2, Ko as b3, Rc as b4, sc as b5, Do as b6, Ct as b7, So as b8, Ho as b9, jt as bA, hc as bB, fc as bC, Ne as bD, lc as bE, nt as bF, ze as bG, Ye as bH, dt as bI, Gc as bJ, wo as bK, it as bL, Dc as bM, yo as bN, Oe as bO, Mc as bP, Tc as bQ, Bc as bR, ct as bS, wc as bT, rt as bU, Fc as bV, yc as bW, Te as bX, Ce as bY, co as bZ, xt as b_, Ia as ba, xo as bb, Ec as bc, Ja as bd, zt as be, Nc as bf, ah as bg, kh as bh, Mo as bi, pe as bj, Xo as bk, qc as bl, Yt as bm, ac as bn, No as bo, re as bp, Sc as bq, lt as br, Ae as bs, mo as bt, Wa as bu, Ft as bv, Pe as bw, qt as bx, Bo as by, Cc as bz, Me as c, zo as c0, Ka as c1, oe as c2, Je as c3, Zc as c4, Hc as c5, xc as c6, _t as c7, Ic as c8, Yo as c9, Qc as cA, Qe as cB, go as cC, wt as cD, qo as cE, Uc as cF, vc as cG, Kc as cH, ec as cI, eh as cJ, Qa as cK, dh as cL, ut as cM, De as cN, _h as cO, tt as cP, ie as cQ, Ot as cR, Vc as cS, xh as cT, Bt as cU, mt as cV, To as cW, Xe as ca, rh as cb, nh as cc, sh as cd, Ht as ce, Et as cf, Wc as cg, bc as ch, cc as ci, se as cj, ke as ck, Lo as cl, no as cm, Ie as cn, St as co, ee as cp, Uo as cq, bt as cr, Kt as cs, _c as ct, ch as cu, Wt as cv, Be as cw, jo as cx, ao as cy, eo as cz, He as d, pc as e, Ue as f, ic as g, Ze as h, kc as i, Ya as j, We as k, be as l, dc as m, ue as n, _e as o, ot as p, Rt as q, ae as r, Ge as s, th as t, je as u, Oa as v, Vo as w, st as x, uo as y, At as z
};