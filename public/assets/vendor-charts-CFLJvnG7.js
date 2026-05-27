import {
    r as d,
    g as _t,
    a as lc,
    b as cc,
    c as hx,
    R as mx
} from "./vendor-react-BfU3Zn2J.js";

function lm(e) {
    var t, r, n = "";
    if (typeof e == "string" || typeof e == "number") n += e;
    else if (typeof e == "object")
        if (Array.isArray(e)) {
            var i = e.length;
            for (t = 0; t < i; t++) e[t] && (r = lm(e[t])) && (n && (n += " "), n += r)
        } else
            for (r in e) e[r] && (n && (n += " "), n += r);
    return n
}

function z() {
    for (var e, t, r = 0, n = "", i = arguments.length; r < i; r++)(e = arguments[r]) && (t = lm(e)) && (n && (n += " "), n += t);
    return n
}
var yx = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"];

function sc(e) {
    if (typeof e != "string") return !1;
    var t = yx;
    return t.includes(e)
}
var gx = ["aria-activedescendant", "aria-atomic", "aria-autocomplete", "aria-busy", "aria-checked", "aria-colcount", "aria-colindex", "aria-colspan", "aria-controls", "aria-current", "aria-describedby", "aria-details", "aria-disabled", "aria-errormessage", "aria-expanded", "aria-flowto", "aria-haspopup", "aria-hidden", "aria-invalid", "aria-keyshortcuts", "aria-label", "aria-labelledby", "aria-level", "aria-live", "aria-modal", "aria-multiline", "aria-multiselectable", "aria-orientation", "aria-owns", "aria-placeholder", "aria-posinset", "aria-pressed", "aria-readonly", "aria-relevant", "aria-required", "aria-roledescription", "aria-rowcount", "aria-rowindex", "aria-rowspan", "aria-selected", "aria-setsize", "aria-sort", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext", "className", "color", "height", "id", "lang", "max", "media", "method", "min", "name", "style", "target", "width", "role", "tabIndex", "accentHeight", "accumulate", "additive", "alignmentBaseline", "allowReorder", "alphabetic", "amplitude", "arabicForm", "ascent", "attributeName", "attributeType", "autoReverse", "azimuth", "baseFrequency", "baselineShift", "baseProfile", "bbox", "begin", "bias", "by", "calcMode", "capHeight", "clip", "clipPath", "clipPathUnits", "clipRule", "colorInterpolation", "colorInterpolationFilters", "colorProfile", "colorRendering", "contentScriptType", "contentStyleType", "cursor", "cx", "cy", "d", "decelerate", "descent", "diffuseConstant", "direction", "display", "divisor", "dominantBaseline", "dur", "dx", "dy", "edgeMode", "elevation", "enableBackground", "end", "exponent", "externalResourcesRequired", "fill", "fillOpacity", "fillRule", "filter", "filterRes", "filterUnits", "floodColor", "floodOpacity", "focusable", "fontFamily", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontWeight", "format", "from", "fx", "fy", "g1", "g2", "glyphName", "glyphOrientationHorizontal", "glyphOrientationVertical", "glyphRef", "gradientTransform", "gradientUnits", "hanging", "horizAdvX", "horizOriginX", "href", "ideographic", "imageRendering", "in2", "in", "intercept", "k1", "k2", "k3", "k4", "k", "kernelMatrix", "kernelUnitLength", "kerning", "keyPoints", "keySplines", "keyTimes", "lengthAdjust", "letterSpacing", "lightingColor", "limitingConeAngle", "local", "markerEnd", "markerHeight", "markerMid", "markerStart", "markerUnits", "markerWidth", "mask", "maskContentUnits", "maskUnits", "mathematical", "mode", "numOctaves", "offset", "opacity", "operator", "order", "orient", "orientation", "origin", "overflow", "overlinePosition", "overlineThickness", "paintOrder", "panose1", "pathLength", "patternContentUnits", "patternTransform", "patternUnits", "pointerEvents", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "preserveAspectRatio", "primitiveUnits", "r", "radius", "refX", "refY", "renderingIntent", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "result", "rotate", "rx", "ry", "seed", "shapeRendering", "slope", "spacing", "specularConstant", "specularExponent", "speed", "spreadMethod", "startOffset", "stdDeviation", "stemh", "stemv", "stitchTiles", "stopColor", "stopOpacity", "strikethroughPosition", "strikethroughThickness", "string", "stroke", "strokeDasharray", "strokeDashoffset", "strokeLinecap", "strokeLinejoin", "strokeMiterlimit", "strokeOpacity", "strokeWidth", "surfaceScale", "systemLanguage", "tableValues", "targetX", "targetY", "textAnchor", "textDecoration", "textLength", "textRendering", "to", "transform", "u1", "u2", "underlinePosition", "underlineThickness", "unicode", "unicodeBidi", "unicodeRange", "unitsPerEm", "vAlphabetic", "values", "vectorEffect", "version", "vertAdvY", "vertOriginX", "vertOriginY", "vHanging", "vIdeographic", "viewTarget", "visibility", "vMathematical", "widths", "wordSpacing", "writingMode", "x1", "x2", "x", "xChannelSelector", "xHeight", "xlinkActuate", "xlinkArcrole", "xlinkHref", "xlinkRole", "xlinkShow", "xlinkTitle", "xlinkType", "xmlBase", "xmlLang", "xmlns", "xmlnsXlink", "xmlSpace", "y1", "y2", "y", "yChannelSelector", "z", "zoomAndPan", "ref", "key", "angle"],
    bx = new Set(gx);

function cm(e) {
    return typeof e != "string" ? !1 : bx.has(e)
}

function sm(e) {
    return typeof e == "string" && e.startsWith("data-")
}

function re(e) {
    if (typeof e != "object" || e === null) return {};
    var t = {};
    for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (cm(r) || sm(r)) && (t[r] = e[r]);
    return t
}

function At(e) {
    if (e == null) return null;
    if (d.isValidElement(e) && typeof e.props == "object" && e.props !== null) {
        var t = e.props;
        return re(t)
    }
    return typeof e == "object" && !Array.isArray(e) ? re(e) : null
}

function ye(e) {
    var t = {};
    for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (cm(r) || sm(r) || sc(r)) && (t[r] = e[r]);
    return t
}

function xx(e) {
    return e == null ? null : d.isValidElement(e) ? ye(e.props) : typeof e == "object" && !Array.isArray(e) ? ye(e) : null
}
var wx = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];

function pl() {
    return pl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, pl.apply(null, arguments)
}

function Px(e, t) {
    if (e == null) return {};
    var r, n, i = Ox(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function Ox(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var fc = d.forwardRef((e, t) => {
        var {
            children: r,
            width: n,
            height: i,
            viewBox: a,
            className: o,
            style: u,
            title: l,
            desc: s
        } = e, c = Px(e, wx), f = a || {
            width: n,
            height: i,
            x: 0,
            y: 0
        }, v = z("recharts-surface", o);
        return d.createElement("svg", pl({}, ye(c), {
            className: v,
            width: n,
            height: i,
            style: u,
            viewBox: "".concat(f.x, " ").concat(f.y, " ").concat(f.width, " ").concat(f.height),
            ref: t
        }), d.createElement("title", null, l), d.createElement("desc", null, s), r)
    }),
    Ax = ["children", "className"];

function hl() {
    return hl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, hl.apply(null, arguments)
}

function Sx(e, t) {
    if (e == null) return {};
    var r, n, i = Ex(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function Ex(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var G = d.forwardRef((e, t) => {
        var {
            children: r,
            className: n
        } = e, i = Sx(e, Ax), a = z("recharts-layer", n);
        return d.createElement("g", hl({
            className: a
        }, ye(i), {
            ref: t
        }), r)
    }),
    fm = d.createContext(null),
    jx = () => d.useContext(fm);

function le(e) {
    return function() {
        return e
    }
}
const dm = Math.cos,
    qi = Math.sin,
    mt = Math.sqrt,
    Ui = Math.PI,
    Ra = 2 * Ui,
    ml = Math.PI,
    yl = 2 * ml,
    yr = 1e-6,
    Ix = yl - yr;

function vm(e) {
    this._ += e[0];
    for (let t = 1, r = e.length; t < r; ++t) this._ += arguments[t] + e[t]
}

function _x(e) {
    let t = Math.floor(e);
    if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
    if (t > 15) return vm;
    const r = 10 ** t;
    return function(n) {
        this._ += n[0];
        for (let i = 1, a = n.length; i < a; ++i) this._ += Math.round(arguments[i] * r) / r + n[i]
    }
}
class kx {
    constructor(t) {
        this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = t == null ? vm : _x(t)
    }
    moveTo(t, r) {
        this._append `M${this._x0=this._x1=+t},${this._y0=this._y1=+r}`
    }
    closePath() {
        this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append `Z`)
    }
    lineTo(t, r) {
        this._append `L${this._x1=+t},${this._y1=+r}`
    }
    quadraticCurveTo(t, r, n, i) {
        this._append `Q${+t},${+r},${this._x1=+n},${this._y1=+i}`
    }
    bezierCurveTo(t, r, n, i, a, o) {
        this._append `C${+t},${+r},${+n},${+i},${this._x1=+a},${this._y1=+o}`
    }
    arcTo(t, r, n, i, a) {
        if (t = +t, r = +r, n = +n, i = +i, a = +a, a < 0) throw new Error(`negative radius: ${a}`);
        let o = this._x1,
            u = this._y1,
            l = n - t,
            s = i - r,
            c = o - t,
            f = u - r,
            v = c * c + f * f;
        if (this._x1 === null) this._append `M${this._x1=t},${this._y1=r}`;
        else if (v > yr)
            if (!(Math.abs(f * l - s * c) > yr) || !a) this._append `L${this._x1=t},${this._y1=r}`;
            else {
                let p = n - o,
                    h = i - u,
                    m = l * l + s * s,
                    y = p * p + h * h,
                    g = Math.sqrt(m),
                    b = Math.sqrt(v),
                    x = a * Math.tan((ml - Math.acos((m + v - y) / (2 * g * b))) / 2),
                    P = x / b,
                    w = x / g;
                Math.abs(P - 1) > yr && this._append `L${t+P*c},${r+P*f}`, this._append `A${a},${a},0,0,${+(f*p>c*h)},${this._x1=t+w*l},${this._y1=r+w*s}`
            }
    }
    arc(t, r, n, i, a, o) {
        if (t = +t, r = +r, n = +n, o = !!o, n < 0) throw new Error(`negative radius: ${n}`);
        let u = n * Math.cos(i),
            l = n * Math.sin(i),
            s = t + u,
            c = r + l,
            f = 1 ^ o,
            v = o ? i - a : a - i;
        this._x1 === null ? this._append `M${s},${c}` : (Math.abs(this._x1 - s) > yr || Math.abs(this._y1 - c) > yr) && this._append `L${s},${c}`, n && (v < 0 && (v = v % yl + yl), v > Ix ? this._append `A${n},${n},0,1,${f},${t-u},${r-l}A${n},${n},0,1,${f},${this._x1=s},${this._y1=c}` : v > yr && this._append `A${n},${n},0,${+(v>=ml)},${f},${this._x1=t+n*Math.cos(a)},${this._y1=r+n*Math.sin(a)}`)
    }
    rect(t, r, n, i) {
        this._append `M${this._x0=this._x1=+t},${this._y0=this._y1=+r}h${n=+n}v${+i}h${-n}Z`
    }
    toString() {
        return this._
    }
}

function dc(e) {
    let t = 3;
    return e.digits = function(r) {
        if (!arguments.length) return t;
        if (r == null) t = null;
        else {
            const n = Math.floor(r);
            if (!(n >= 0)) throw new RangeError(`invalid digits: ${r}`);
            t = n
        }
        return e
    }, () => new kx(t)
}

function vc(e) {
    return typeof e == "object" && "length" in e ? e : Array.from(e)
}

function pm(e) {
    this._context = e
}
pm.prototype = {
    areaStart: function() {
        this._line = 0
    },
    areaEnd: function() {
        this._line = NaN
    },
    lineStart: function() {
        this._point = 0
    },
    lineEnd: function() {
        (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line
    },
    point: function(e, t) {
        switch (e = +e, t = +t, this._point) {
            case 0:
                this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
                break;
            case 1:
                this._point = 2;
            default:
                this._context.lineTo(e, t);
                break
        }
    }
};

function $a(e) {
    return new pm(e)
}

function hm(e) {
    return e[0]
}

function mm(e) {
    return e[1]
}

function ym(e, t) {
    var r = le(!0),
        n = null,
        i = $a,
        a = null,
        o = dc(u);
    e = typeof e == "function" ? e : e === void 0 ? hm : le(e), t = typeof t == "function" ? t : t === void 0 ? mm : le(t);

    function u(l) {
        var s, c = (l = vc(l)).length,
            f, v = !1,
            p;
        for (n == null && (a = i(p = o())), s = 0; s <= c; ++s) !(s < c && r(f = l[s], s, l)) === v && ((v = !v) ? a.lineStart() : a.lineEnd()), v && a.point(+e(f, s, l), +t(f, s, l));
        if (p) return a = null, p + "" || null
    }
    return u.x = function(l) {
        return arguments.length ? (e = typeof l == "function" ? l : le(+l), u) : e
    }, u.y = function(l) {
        return arguments.length ? (t = typeof l == "function" ? l : le(+l), u) : t
    }, u.defined = function(l) {
        return arguments.length ? (r = typeof l == "function" ? l : le(!!l), u) : r
    }, u.curve = function(l) {
        return arguments.length ? (i = l, n != null && (a = i(n)), u) : i
    }, u.context = function(l) {
        return arguments.length ? (l == null ? n = a = null : a = i(n = l), u) : n
    }, u
}

function Si(e, t, r) {
    var n = null,
        i = le(!0),
        a = null,
        o = $a,
        u = null,
        l = dc(s);
    e = typeof e == "function" ? e : e === void 0 ? hm : le(+e), t = typeof t == "function" ? t : le(t === void 0 ? 0 : +t), r = typeof r == "function" ? r : r === void 0 ? mm : le(+r);

    function s(f) {
        var v, p, h, m = (f = vc(f)).length,
            y, g = !1,
            b, x = new Array(m),
            P = new Array(m);
        for (a == null && (u = o(b = l())), v = 0; v <= m; ++v) {
            if (!(v < m && i(y = f[v], v, f)) === g)
                if (g = !g) p = v, u.areaStart(), u.lineStart();
                else {
                    for (u.lineEnd(), u.lineStart(), h = v - 1; h >= p; --h) u.point(x[h], P[h]);
                    u.lineEnd(), u.areaEnd()
                }
            g && (x[v] = +e(y, v, f), P[v] = +t(y, v, f), u.point(n ? +n(y, v, f) : x[v], r ? +r(y, v, f) : P[v]))
        }
        if (b) return u = null, b + "" || null
    }

    function c() {
        return ym().defined(i).curve(o).context(a)
    }
    return s.x = function(f) {
        return arguments.length ? (e = typeof f == "function" ? f : le(+f), n = null, s) : e
    }, s.x0 = function(f) {
        return arguments.length ? (e = typeof f == "function" ? f : le(+f), s) : e
    }, s.x1 = function(f) {
        return arguments.length ? (n = f == null ? null : typeof f == "function" ? f : le(+f), s) : n
    }, s.y = function(f) {
        return arguments.length ? (t = typeof f == "function" ? f : le(+f), r = null, s) : t
    }, s.y0 = function(f) {
        return arguments.length ? (t = typeof f == "function" ? f : le(+f), s) : t
    }, s.y1 = function(f) {
        return arguments.length ? (r = f == null ? null : typeof f == "function" ? f : le(+f), s) : r
    }, s.lineX0 = s.lineY0 = function() {
        return c().x(e).y(t)
    }, s.lineY1 = function() {
        return c().x(e).y(r)
    }, s.lineX1 = function() {
        return c().x(n).y(t)
    }, s.defined = function(f) {
        return arguments.length ? (i = typeof f == "function" ? f : le(!!f), s) : i
    }, s.curve = function(f) {
        return arguments.length ? (o = f, a != null && (u = o(a)), s) : o
    }, s.context = function(f) {
        return arguments.length ? (f == null ? a = u = null : u = o(a = f), s) : a
    }, s
}
class gm {
    constructor(t, r) {
        this._context = t, this._x = r
    }
    areaStart() {
        this._line = 0
    }
    areaEnd() {
        this._line = NaN
    }
    lineStart() {
        this._point = 0
    }
    lineEnd() {
        (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line
    }
    point(t, r) {
        switch (t = +t, r = +r, this._point) {
            case 0:
                {
                    this._point = 1,
                    this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r);
                    break
                }
            case 1:
                this._point = 2;
            default:
                {
                    this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + t) / 2, this._y0, this._x0, r, t, r) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + r) / 2, t, this._y0, t, r);
                    break
                }
        }
        this._x0 = t, this._y0 = r
    }
}

function Cx(e) {
    return new gm(e, !0)
}

function Tx(e) {
    return new gm(e, !1)
}
const pc = {
        draw(e, t) {
            const r = mt(t / Ui);
            e.moveTo(r, 0), e.arc(0, 0, r, 0, Ra)
        }
    },
    Mx = {
        draw(e, t) {
            const r = mt(t / 5) / 2;
            e.moveTo(-3 * r, -r), e.lineTo(-r, -r), e.lineTo(-r, -3 * r), e.lineTo(r, -3 * r), e.lineTo(r, -r), e.lineTo(3 * r, -r), e.lineTo(3 * r, r), e.lineTo(r, r), e.lineTo(r, 3 * r), e.lineTo(-r, 3 * r), e.lineTo(-r, r), e.lineTo(-3 * r, r), e.closePath()
        }
    },
    bm = mt(1 / 3),
    Dx = bm * 2,
    Nx = {
        draw(e, t) {
            const r = mt(t / Dx),
                n = r * bm;
            e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath()
        }
    },
    Rx = {
        draw(e, t) {
            const r = mt(t),
                n = -r / 2;
            e.rect(n, n, r, r)
        }
    },
    $x = .8908130915292852,
    xm = qi(Ui / 10) / qi(7 * Ui / 10),
    Lx = qi(Ra / 10) * xm,
    Bx = -dm(Ra / 10) * xm,
    zx = {
        draw(e, t) {
            const r = mt(t * $x),
                n = Lx * r,
                i = Bx * r;
            e.moveTo(0, -r), e.lineTo(n, i);
            for (let a = 1; a < 5; ++a) {
                const o = Ra * a / 5,
                    u = dm(o),
                    l = qi(o);
                e.lineTo(l * r, -u * r), e.lineTo(u * n - l * i, l * n + u * i)
            }
            e.closePath()
        }
    },
    Co = mt(3),
    Kx = {
        draw(e, t) {
            const r = -mt(t / (Co * 3));
            e.moveTo(0, r * 2), e.lineTo(-Co * r, -r), e.lineTo(Co * r, -r), e.closePath()
        }
    },
    et = -.5,
    tt = mt(3) / 2,
    gl = 1 / mt(12),
    Wx = (gl / 2 + 1) * 3,
    Fx = {
        draw(e, t) {
            const r = mt(t / Wx),
                n = r / 2,
                i = r * gl,
                a = n,
                o = r * gl + r,
                u = -a,
                l = o;
            e.moveTo(n, i), e.lineTo(a, o), e.lineTo(u, l), e.lineTo(et * n - tt * i, tt * n + et * i), e.lineTo(et * a - tt * o, tt * a + et * o), e.lineTo(et * u - tt * l, tt * u + et * l), e.lineTo(et * n + tt * i, et * i - tt * n), e.lineTo(et * a + tt * o, et * o - tt * a), e.lineTo(et * u + tt * l, et * l - tt * u), e.closePath()
        }
    };

function qx(e, t) {
    let r = null,
        n = dc(i);
    e = typeof e == "function" ? e : le(e || pc), t = typeof t == "function" ? t : le(t === void 0 ? 64 : +t);

    function i() {
        let a;
        if (r || (r = a = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), a) return r = null, a + "" || null
    }
    return i.type = function(a) {
        return arguments.length ? (e = typeof a == "function" ? a : le(a), i) : e
    }, i.size = function(a) {
        return arguments.length ? (t = typeof a == "function" ? a : le(+a), i) : t
    }, i.context = function(a) {
        return arguments.length ? (r = a ?? null, i) : r
    }, i
}

function Hi() {}

function Gi(e, t, r) {
    e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + r) / 6)
}

function wm(e) {
    this._context = e
}
wm.prototype = {
    areaStart: function() {
        this._line = 0
    },
    areaEnd: function() {
        this._line = NaN
    },
    lineStart: function() {
        this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0
    },
    lineEnd: function() {
        switch (this._point) {
            case 3:
                Gi(this, this._x1, this._y1);
            case 2:
                this._context.lineTo(this._x1, this._y1);
                break
        }(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line
    },
    point: function(e, t) {
        switch (e = +e, t = +t, this._point) {
            case 0:
                this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
            default:
                Gi(this, e, t);
                break
        }
        this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t
    }
};

function Ux(e) {
    return new wm(e)
}

function Pm(e) {
    this._context = e
}
Pm.prototype = {
    areaStart: Hi,
    areaEnd: Hi,
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0
    },
    lineEnd: function() {
        switch (this._point) {
            case 1:
                {
                    this._context.moveTo(this._x2, this._y2),
                    this._context.closePath();
                    break
                }
            case 2:
                {
                    this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3),
                    this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3),
                    this._context.closePath();
                    break
                }
            case 3:
                {
                    this.point(this._x2, this._y2),
                    this.point(this._x3, this._y3),
                    this.point(this._x4, this._y4);
                    break
                }
        }
    },
    point: function(e, t) {
        switch (e = +e, t = +t, this._point) {
            case 0:
                this._point = 1, this._x2 = e, this._y2 = t;
                break;
            case 1:
                this._point = 2, this._x3 = e, this._y3 = t;
                break;
            case 2:
                this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
                break;
            default:
                Gi(this, e, t);
                break
        }
        this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t
    }
};

function Hx(e) {
    return new Pm(e)
}

function Om(e) {
    this._context = e
}
Om.prototype = {
    areaStart: function() {
        this._line = 0
    },
    areaEnd: function() {
        this._line = NaN
    },
    lineStart: function() {
        this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0
    },
    lineEnd: function() {
        (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line
    },
    point: function(e, t) {
        switch (e = +e, t = +t, this._point) {
            case 0:
                this._point = 1;
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                var r = (this._x0 + 4 * this._x1 + e) / 6,
                    n = (this._y0 + 4 * this._y1 + t) / 6;
                this._line ? this._context.lineTo(r, n) : this._context.moveTo(r, n);
                break;
            case 3:
                this._point = 4;
            default:
                Gi(this, e, t);
                break
        }
        this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t
    }
};

function Gx(e) {
    return new Om(e)
}

function Am(e) {
    this._context = e
}
Am.prototype = {
    areaStart: Hi,
    areaEnd: Hi,
    lineStart: function() {
        this._point = 0
    },
    lineEnd: function() {
        this._point && this._context.closePath()
    },
    point: function(e, t) {
        e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t))
    }
};

function Vx(e) {
    return new Am(e)
}

function af(e) {
    return e < 0 ? -1 : 1
}

function of (e, t, r) {
    var n = e._x1 - e._x0,
        i = t - e._x1,
        a = (e._y1 - e._y0) / (n || i < 0 && -0),
        o = (r - e._y1) / (i || n < 0 && -0),
        u = (a * i + o * n) / (n + i);
    return (af(a) + af(o)) * Math.min(Math.abs(a), Math.abs(o), .5 * Math.abs(u)) || 0
}

function uf(e, t) {
    var r = e._x1 - e._x0;
    return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t
}

function To(e, t, r) {
    var n = e._x0,
        i = e._y0,
        a = e._x1,
        o = e._y1,
        u = (a - n) / 3;
    e._context.bezierCurveTo(n + u, i + u * t, a - u, o - u * r, a, o)
}

function Vi(e) {
    this._context = e
}
Vi.prototype = {
    areaStart: function() {
        this._line = 0
    },
    areaEnd: function() {
        this._line = NaN
    },
    lineStart: function() {
        this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0
    },
    lineEnd: function() {
        switch (this._point) {
            case 2:
                this._context.lineTo(this._x1, this._y1);
                break;
            case 3:
                To(this, this._t0, uf(this, this._t0));
                break
        }(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line
    },
    point: function(e, t) {
        var r = NaN;
        if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
            switch (this._point) {
                case 0:
                    this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
                    break;
                case 1:
                    this._point = 2;
                    break;
                case 2:
                    this._point = 3, To(this, uf(this, r = of (this, e, t)), r);
                    break;
                default:
                    To(this, this._t0, r = of (this, e, t));
                    break
            }
            this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r
        }
    }
};

function Sm(e) {
    this._context = new Em(e)
}(Sm.prototype = Object.create(Vi.prototype)).point = function(e, t) {
    Vi.prototype.point.call(this, t, e)
};

function Em(e) {
    this._context = e
}
Em.prototype = {
    moveTo: function(e, t) {
        this._context.moveTo(t, e)
    },
    closePath: function() {
        this._context.closePath()
    },
    lineTo: function(e, t) {
        this._context.lineTo(t, e)
    },
    bezierCurveTo: function(e, t, r, n, i, a) {
        this._context.bezierCurveTo(t, e, n, r, a, i)
    }
};

function Yx(e) {
    return new Vi(e)
}

function Xx(e) {
    return new Sm(e)
}

function jm(e) {
    this._context = e
}
jm.prototype = {
    areaStart: function() {
        this._line = 0
    },
    areaEnd: function() {
        this._line = NaN
    },
    lineStart: function() {
        this._x = [], this._y = []
    },
    lineEnd: function() {
        var e = this._x,
            t = this._y,
            r = e.length;
        if (r)
            if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2) this._context.lineTo(e[1], t[1]);
            else
                for (var n = lf(e), i = lf(t), a = 0, o = 1; o < r; ++a, ++o) this._context.bezierCurveTo(n[0][a], i[0][a], n[1][a], i[1][a], e[o], t[o]);
        (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null
    },
    point: function(e, t) {
        this._x.push(+e), this._y.push(+t)
    }
};

function lf(e) {
    var t, r = e.length - 1,
        n, i = new Array(r),
        a = new Array(r),
        o = new Array(r);
    for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) i[t] = 1, a[t] = 4, o[t] = 4 * e[t] + 2 * e[t + 1];
    for (i[r - 1] = 2, a[r - 1] = 7, o[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) n = i[t] / a[t - 1], a[t] -= n, o[t] -= n * o[t - 1];
    for (i[r - 1] = o[r - 1] / a[r - 1], t = r - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
    for (a[r - 1] = (e[r] + i[r - 1]) / 2, t = 0; t < r - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
    return [i, a]
}

function Zx(e) {
    return new jm(e)
}

function La(e, t) {
    this._context = e, this._t = t
}
La.prototype = {
    areaStart: function() {
        this._line = 0
    },
    areaEnd: function() {
        this._line = NaN
    },
    lineStart: function() {
        this._x = this._y = NaN, this._point = 0
    },
    lineEnd: function() {
        0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line)
    },
    point: function(e, t) {
        switch (e = +e, t = +t, this._point) {
            case 0:
                this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
                break;
            case 1:
                this._point = 2;
            default:
                {
                    if (this._t <= 0) this._context.lineTo(this._x, t),
                    this._context.lineTo(e, t);
                    else {
                        var r = this._x * (1 - this._t) + e * this._t;
                        this._context.lineTo(r, this._y), this._context.lineTo(r, t)
                    }
                    break
                }
        }
        this._x = e, this._y = t
    }
};

function Jx(e) {
    return new La(e, .5)
}

function Qx(e) {
    return new La(e, 0)
}

function ew(e) {
    return new La(e, 1)
}

function kr(e, t) {
    if ((o = e.length) > 1)
        for (var r = 1, n, i, a = e[t[0]], o, u = a.length; r < o; ++r)
            for (i = a, a = e[t[r]], n = 0; n < u; ++n) a[n][1] += a[n][0] = isNaN(i[n][1]) ? i[n][0] : i[n][1]
}

function bl(e) {
    for (var t = e.length, r = new Array(t); --t >= 0;) r[t] = t;
    return r
}

function tw(e, t) {
    return e[t]
}

function rw(e) {
    const t = [];
    return t.key = e, t
}

function nw() {
    var e = le([]),
        t = bl,
        r = kr,
        n = tw;

    function i(a) {
        var o = Array.from(e.apply(this, arguments), rw),
            u, l = o.length,
            s = -1,
            c;
        for (const f of a)
            for (u = 0, ++s; u < l; ++u)(o[u][s] = [0, +n(f, o[u].key, s, a)]).data = f;
        for (u = 0, c = vc(t(o)); u < l; ++u) o[c[u]].index = u;
        return r(o, c), o
    }
    return i.keys = function(a) {
        return arguments.length ? (e = typeof a == "function" ? a : le(Array.from(a)), i) : e
    }, i.value = function(a) {
        return arguments.length ? (n = typeof a == "function" ? a : le(+a), i) : n
    }, i.order = function(a) {
        return arguments.length ? (t = a == null ? bl : typeof a == "function" ? a : le(Array.from(a)), i) : t
    }, i.offset = function(a) {
        return arguments.length ? (r = a ?? kr, i) : r
    }, i
}

function iw(e, t) {
    if ((n = e.length) > 0) {
        for (var r, n, i = 0, a = e[0].length, o; i < a; ++i) {
            for (o = r = 0; r < n; ++r) o += e[r][i][1] || 0;
            if (o)
                for (r = 0; r < n; ++r) e[r][i][1] /= o
        }
        kr(e, t)
    }
}

function aw(e, t) {
    if ((i = e.length) > 0) {
        for (var r = 0, n = e[t[0]], i, a = n.length; r < a; ++r) {
            for (var o = 0, u = 0; o < i; ++o) u += e[o][r][1] || 0;
            n[r][1] += n[r][0] = -u / 2
        }
        kr(e, t)
    }
}

function ow(e, t) {
    if (!(!((o = e.length) > 0) || !((a = (i = e[t[0]]).length) > 0))) {
        for (var r = 0, n = 1, i, a, o; n < a; ++n) {
            for (var u = 0, l = 0, s = 0; u < o; ++u) {
                for (var c = e[t[u]], f = c[n][1] || 0, v = c[n - 1][1] || 0, p = (f - v) / 2, h = 0; h < u; ++h) {
                    var m = e[t[h]],
                        y = m[n][1] || 0,
                        g = m[n - 1][1] || 0;
                    p += y - g
                }
                l += f, s += p * f
            }
            i[n - 1][1] += i[n - 1][0] = r, l && (r -= s / l)
        }
        i[n - 1][1] += i[n - 1][0] = r, kr(e, t)
    }
}
var Mo = {},
    Do = {},
    cf;

function uw() {
    return cf || (cf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return r === "__proto__"
        }
        e.isUnsafeProperty = t
    })(Do)), Do
}
var No = {},
    sf;

function Im() {
    return sf || (sf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            switch (typeof r) {
                case "number":
                case "symbol":
                    return !1;
                case "string":
                    return r.includes(".") || r.includes("[") || r.includes("]")
            }
        }
        e.isDeepKey = t
    })(No)), No
}
var Ro = {},
    ff;

function hc() {
    return ff || (ff = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return typeof r == "string" || typeof r == "symbol" ? r : Object.is(r ?.valueOf ?.(), -0) ? "-0" : String(r)
        }
        e.toKey = t
    })(Ro)), Ro
}
var $o = {},
    Lo = {},
    df;

function lw() {
    return df || (df = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            if (r == null) return "";
            if (typeof r == "string") return r;
            if (Array.isArray(r)) return r.map(t).join(",");
            const n = String(r);
            return n === "0" && Object.is(Number(r), -0) ? "-0" : n
        }
        e.toString = t
    })(Lo)), Lo
}
var vf;

function mc() {
    return vf || (vf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = lw(),
            r = hc();

        function n(i) {
            if (Array.isArray(i)) return i.map(r.toKey);
            if (typeof i == "symbol") return [i];
            i = t.toString(i);
            const a = [],
                o = i.length;
            if (o === 0) return a;
            let u = 0,
                l = "",
                s = "",
                c = !1;
            for (i.charCodeAt(0) === 46 && (a.push(""), u++); u < o;) {
                const f = i[u];
                s ? f === "\\" && u + 1 < o ? (u++, l += i[u]) : f === s ? s = "" : l += f : c ? f === '"' || f === "'" ? s = f : f === "]" ? (c = !1, a.push(l), l = "") : l += f : f === "[" ? (c = !0, l && (a.push(l), l = "")) : f === "." ? l && (a.push(l), l = "") : l += f, u++
            }
            return l && a.push(l), a
        }
        e.toPath = n
    })($o)), $o
}
var pf;

function yc() {
    return pf || (pf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = uw(),
            r = Im(),
            n = hc(),
            i = mc();

        function a(u, l, s) {
            if (u == null) return s;
            switch (typeof l) {
                case "string":
                    {
                        if (t.isUnsafeProperty(l)) return s;
                        const c = u[l];
                        return c === void 0 ? r.isDeepKey(l) ? a(u, i.toPath(l), s) : s : c
                    }
                case "number":
                case "symbol":
                    {
                        typeof l == "number" && (l = n.toKey(l));
                        const c = u[l];
                        return c === void 0 ? s : c
                    }
                default:
                    {
                        if (Array.isArray(l)) return o(u, l, s);
                        if (Object.is(l ?.valueOf(), -0) ? l = "-0" : l = String(l), t.isUnsafeProperty(l)) return s;
                        const c = u[l];
                        return c === void 0 ? s : c
                    }
            }
        }

        function o(u, l, s) {
            if (l.length === 0) return s;
            let c = u;
            for (let f = 0; f < l.length; f++) {
                if (c == null || t.isUnsafeProperty(l[f])) return s;
                c = c[l[f]]
            }
            return c === void 0 ? s : c
        }
        e.get = a
    })(Mo)), Mo
}
var Bo, hf;

function cw() {
    return hf || (hf = 1, Bo = yc().get), Bo
}
var sw = cw();
const Cr = _t(sw);
var fw = 4;

function ir(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : fw,
        r = 10 ** t,
        n = Math.round(e * r) / r;
    return Object.is(n, -0) ? 0 : n
}

function de(e) {
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) r[n - 1] = arguments[n];
    return e.reduce((i, a, o) => {
        var u = r[o - 1];
        return typeof u == "string" ? i + u + a : u !== void 0 ? i + ir(u) + a : i + a
    }, "")
}
var _e = e => e === 0 ? 0 : e > 0 ? 1 : -1,
    at = e => typeof e == "number" && e != +e,
    zt = e => typeof e == "string" && e.indexOf("%") === e.length - 1,
    D = e => (typeof e == "number" || e instanceof Number) && !at(e),
    St = e => D(e) || typeof e == "string",
    dw = 0,
    Rn = e => {
        var t = ++dw;
        return "".concat(e || "").concat(t)
    },
    $e = function(t, r) {
        var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0,
            i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
        if (!D(t) && typeof t != "string") return n;
        var a;
        if (zt(t)) {
            if (r == null) return n;
            var o = t.indexOf("%");
            a = r * parseFloat(t.slice(0, o)) / 100
        } else a = +t;
        return at(a) && (a = n), i && r != null && a > r && (a = r), a
    },
    _m = e => {
        if (!Array.isArray(e)) return !1;
        for (var t = e.length, r = {}, n = 0; n < t; n++)
            if (!r[String(e[n])]) r[String(e[n])] = !0;
            else return !0;
        return !1
    };

function F(e, t, r) {
    return D(e) && D(t) ? ir(e + r * (t - e)) : t
}

function km(e, t, r) {
    if (!(!e || !e.length)) return e.find(n => n && (typeof t == "function" ? t(n) : Cr(n, t)) === r)
}
var vw = e => {
        for (var t = e.length, r = 0, n = 0, i = 0, a = 0, o = 1 / 0, u = -1 / 0, l = 0, s = 0, c = 0; c < t; c++) {
            var f, v;
            l = ((f = e[c]) === null || f === void 0 ? void 0 : f.cx) || 0, s = ((v = e[c]) === null || v === void 0 ? void 0 : v.cy) || 0, r += l, n += s, i += l * s, a += l * l, o = Math.min(o, l), u = Math.max(u, l)
        }
        var p = t * a !== r * r ? (t * i - r * n) / (t * a - r * r) : 0;
        return {
            xmin: o,
            xmax: u,
            a: p,
            b: (n - p * r) / t
        }
    },
    X = e => e === null || typeof e > "u",
    Qn = e => X(e) ? e : "".concat(e.charAt(0).toUpperCase()).concat(e.slice(1));

function pw(e) {
    return e != null
}

function ei() {}
var hw = ["type", "size", "sizeType"];

function xl() {
    return xl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, xl.apply(null, arguments)
}

function mf(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function yf(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? mf(Object(r), !0).forEach(function(n) {
            mw(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : mf(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function mw(e, t, r) {
    return (t = yw(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function yw(e) {
    var t = gw(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function gw(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function bw(e, t) {
    if (e == null) return {};
    var r, n, i = xw(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function xw(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var Cm = {
        symbolCircle: pc,
        symbolCross: Mx,
        symbolDiamond: Nx,
        symbolSquare: Rx,
        symbolStar: zx,
        symbolTriangle: Kx,
        symbolWye: Fx
    },
    ww = Math.PI / 180,
    Pw = e => {
        var t = "symbol".concat(Qn(e));
        return Cm[t] || pc
    },
    Ow = (e, t, r) => {
        if (t === "area") return e;
        switch (r) {
            case "cross":
                return 5 * e * e / 9;
            case "diamond":
                return .5 * e * e / Math.sqrt(3);
            case "square":
                return e * e;
            case "star":
                {
                    var n = 18 * ww;
                    return 1.25 * e * e * (Math.tan(n) - Math.tan(n * 2) * Math.tan(n) ** 2)
                }
            case "triangle":
                return Math.sqrt(3) * e * e / 4;
            case "wye":
                return (21 - 10 * Math.sqrt(3)) * e * e / 8;
            default:
                return Math.PI * e * e / 4
        }
    },
    Aw = (e, t) => {
        Cm["symbol".concat(Qn(e))] = t
    },
    Ba = e => {
        var {
            type: t = "circle",
            size: r = 64,
            sizeType: n = "area"
        } = e, i = bw(e, hw), a = yf(yf({}, i), {}, {
            type: t,
            size: r,
            sizeType: n
        }), o = "circle";
        typeof t == "string" && (o = t);
        var u = () => {
                var v = Pw(o),
                    p = qx().type(v).size(Ow(r, n, o)),
                    h = p();
                if (h !== null) return h
            },
            {
                className: l,
                cx: s,
                cy: c
            } = a,
            f = ye(a);
        return D(s) && D(c) && D(r) ? d.createElement("path", xl({}, f, {
            className: z("recharts-symbols", l),
            transform: "translate(".concat(s, ", ").concat(c, ")"),
            d: u()
        })) : null
    };
Ba.registerSymbol = Aw;
var Tm = e => "radius" in e && "startAngle" in e && "endAngle" in e,
    gc = (e, t) => {
        if (!e || typeof e == "function" || typeof e == "boolean") return null;
        var r = e;
        if (d.isValidElement(e) && (r = e.props), typeof r != "object" && typeof r != "function") return null;
        var n = {};
        return Object.keys(r).forEach(i => {
            sc(i) && (n[i] = (a => r[i](r, a)))
        }), n
    },
    Sw = (e, t, r) => n => (e(t, r, n), null),
    lr = (e, t, r) => {
        if (e === null || typeof e != "object" && typeof e != "function") return null;
        var n = null;
        return Object.keys(e).forEach(i => {
            var a = e[i];
            sc(i) && typeof a == "function" && (n || (n = {}), n[i] = Sw(a, t, r))
        }), n
    },
    Ew = e => Array.isArray(e) && e.length > 0;

function gf(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function jw(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? gf(Object(r), !0).forEach(function(n) {
            Iw(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : gf(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function Iw(e, t, r) {
    return (t = _w(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function _w(e) {
    var t = kw(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function kw(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function ee(e, t) {
    var r = jw({}, e),
        n = t,
        i = Object.keys(t),
        a = i.reduce((o, u) => (o[u] === void 0 && n[u] !== void 0 && (o[u] = n[u]), o), r);
    return a
}

function Yi() {
    return Yi = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Yi.apply(null, arguments)
}

function bf(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Cw(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? bf(Object(r), !0).forEach(function(n) {
            Tw(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : bf(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function Tw(e, t, r) {
    return (t = Mw(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function Mw(e) {
    var t = Dw(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function Dw(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var nt = 32,
    Nw = {
        align: "center",
        iconSize: 14,
        inactiveColor: "#ccc",
        layout: "horizontal",
        verticalAlign: "middle"
    };

function Rw(e) {
    var {
        data: t,
        iconType: r,
        inactiveColor: n
    } = e, i = nt / 2, a = nt / 6, o = nt / 3, u = t.inactive ? n : t.color, l = r ?? t.type;
    if (l === "none") return null;
    if (l === "plainline") {
        var s;
        return d.createElement("line", {
            strokeWidth: 4,
            fill: "none",
            stroke: u,
            strokeDasharray: (s = t.payload) === null || s === void 0 ? void 0 : s.strokeDasharray,
            x1: 0,
            y1: i,
            x2: nt,
            y2: i,
            className: "recharts-legend-icon"
        })
    }
    if (l === "line") return d.createElement("path", {
        strokeWidth: 4,
        fill: "none",
        stroke: u,
        d: "M0,".concat(i, "h").concat(o, `
            A`).concat(a, ",").concat(a, ",0,1,1,").concat(2 * o, ",").concat(i, `
            H`).concat(nt, "M").concat(2 * o, ",").concat(i, `
            A`).concat(a, ",").concat(a, ",0,1,1,").concat(o, ",").concat(i),
        className: "recharts-legend-icon"
    });
    if (l === "rect") return d.createElement("path", {
        stroke: "none",
        fill: u,
        d: "M0,".concat(nt / 8, "h").concat(nt, "v").concat(nt * 3 / 4, "h").concat(-nt, "z"),
        className: "recharts-legend-icon"
    });
    if (d.isValidElement(t.legendIcon)) {
        var c = Cw({}, t);
        return delete c.legendIcon, d.cloneElement(t.legendIcon, c)
    }
    return d.createElement(Ba, {
        fill: u,
        cx: i,
        cy: i,
        size: nt,
        sizeType: "diameter",
        type: l
    })
}

function $w(e) {
    var {
        payload: t,
        iconSize: r,
        layout: n,
        formatter: i,
        inactiveColor: a,
        iconType: o
    } = e, u = {
        x: 0,
        y: 0,
        width: nt,
        height: nt
    }, l = {
        display: n === "horizontal" ? "inline-block" : "block",
        marginRight: 10
    }, s = {
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: 4
    };
    return t.map((c, f) => {
        var v = c.formatter || i,
            p = z({
                "recharts-legend-item": !0,
                ["legend-item-".concat(f)]: !0,
                inactive: c.inactive
            });
        if (c.type === "none") return null;
        var h = c.inactive ? a : c.color,
            m = v ? v(c.value, c, f) : c.value;
        return d.createElement("li", Yi({
            className: p,
            style: l,
            key: "legend-item-".concat(f)
        }, lr(e, c, f)), d.createElement(fc, {
            width: r,
            height: r,
            viewBox: u,
            style: s,
            "aria-label": "".concat(m, " legend icon")
        }, d.createElement(Rw, {
            data: c,
            iconType: o,
            inactiveColor: a
        })), d.createElement("span", {
            className: "recharts-legend-item-text",
            style: {
                color: h
            }
        }, m))
    })
}
var Lw = e => {
        var t = ee(e, Nw),
            {
                payload: r,
                layout: n,
                align: i
            } = t;
        if (!r || !r.length) return null;
        var a = {
            padding: 0,
            margin: 0,
            textAlign: n === "horizontal" ? i : "left"
        };
        return d.createElement("ul", {
            className: "recharts-default-legend",
            style: a
        }, d.createElement($w, Yi({}, t, {
            payload: r
        })))
    },
    zo = {},
    Ko = {},
    xf;

function Bw() {
    return xf || (xf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r, n) {
            const i = new Map;
            for (let a = 0; a < r.length; a++) {
                const o = r[a],
                    u = n(o);
                i.has(u) || i.set(u, o)
            }
            return Array.from(i.values())
        }
        e.uniqBy = t
    })(Ko)), Ko
}
var Wo = {},
    wf;

function za() {
    return wf || (wf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return r
        }
        e.identity = t
    })(Wo)), Wo
}
var Fo = {},
    qo = {},
    Uo = {},
    Pf;

function zw() {
    return Pf || (Pf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return Number.isSafeInteger(r) && r >= 0
        }
        e.isLength = t
    })(Uo)), Uo
}
var Of;

function bc() {
    return Of || (Of = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = zw();

        function r(n) {
            return n != null && typeof n != "function" && t.isLength(n.length)
        }
        e.isArrayLike = r
    })(qo)), qo
}
var Ho = {},
    Af;

function Kw() {
    return Af || (Af = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return typeof r == "object" && r !== null
        }
        e.isObjectLike = t
    })(Ho)), Ho
}
var Sf;

function Ww() {
    return Sf || (Sf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = bc(),
            r = Kw();

        function n(i) {
            return r.isObjectLike(i) && t.isArrayLike(i)
        }
        e.isArrayLikeObject = n
    })(Fo)), Fo
}
var Go = {},
    Vo = {},
    Ef;

function Fw() {
    return Ef || (Ef = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = yc();

        function r(n) {
            return function(i) {
                return t.get(i, n)
            }
        }
        e.property = r
    })(Vo)), Vo
}
var Yo = {},
    Xo = {},
    Zo = {},
    Jo = {},
    jf;

function Mm() {
    return jf || (jf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return r !== null && (typeof r == "object" || typeof r == "function")
        }
        e.isObject = t
    })(Jo)), Jo
}
var Qo = {},
    If;

function Dm() {
    return If || (If = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return r == null || typeof r != "object" && typeof r != "function"
        }
        e.isPrimitive = t
    })(Qo)), Qo
}
var eu = {},
    _f;

function Nm() {
    return _f || (_f = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r, n) {
            return r === n || Number.isNaN(r) && Number.isNaN(n)
        }
        e.eq = t
    })(eu)), eu
}
var kf;

function qw() {
    return kf || (kf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Mm(),
            r = Dm(),
            n = Nm();

        function i(c, f, v) {
            return typeof v != "function" ? i(c, f, () => {}) : a(c, f, function p(h, m, y, g, b, x) {
                const P = v(h, m, y, g, b, x);
                return P !== void 0 ? !!P : a(h, m, p, x)
            }, new Map)
        }

        function a(c, f, v, p) {
            if (f === c) return !0;
            switch (typeof f) {
                case "object":
                    return o(c, f, v, p);
                case "function":
                    return Object.keys(f).length > 0 ? a(c, { ...f
                    }, v, p) : n.eq(c, f);
                default:
                    return t.isObject(c) ? typeof f == "string" ? f === "" : !0 : n.eq(c, f)
            }
        }

        function o(c, f, v, p) {
            if (f == null) return !0;
            if (Array.isArray(f)) return l(c, f, v, p);
            if (f instanceof Map) return u(c, f, v, p);
            if (f instanceof Set) return s(c, f, v, p);
            const h = Object.keys(f);
            if (c == null) return h.length === 0;
            if (h.length === 0) return !0;
            if (p ?.has(f)) return p.get(f) === c;
            p ?.set(f, c);
            try {
                for (let m = 0; m < h.length; m++) {
                    const y = h[m];
                    if (!r.isPrimitive(c) && !(y in c) || f[y] === void 0 && c[y] !== void 0 || f[y] === null && c[y] !== null || !v(c[y], f[y], y, c, f, p)) return !1
                }
                return !0
            } finally {
                p ?.delete(f)
            }
        }

        function u(c, f, v, p) {
            if (f.size === 0) return !0;
            if (!(c instanceof Map)) return !1;
            for (const [h, m] of f.entries()) {
                const y = c.get(h);
                if (v(y, m, h, c, f, p) === !1) return !1
            }
            return !0
        }

        function l(c, f, v, p) {
            if (f.length === 0) return !0;
            if (!Array.isArray(c)) return !1;
            const h = new Set;
            for (let m = 0; m < f.length; m++) {
                const y = f[m];
                let g = !1;
                for (let b = 0; b < c.length; b++) {
                    if (h.has(b)) continue;
                    const x = c[b];
                    let P = !1;
                    if (v(x, y, m, c, f, p) && (P = !0), P) {
                        h.add(b), g = !0;
                        break
                    }
                }
                if (!g) return !1
            }
            return !0
        }

        function s(c, f, v, p) {
            return f.size === 0 ? !0 : c instanceof Set ? l([...c], [...f], v, p) : !1
        }
        e.isMatchWith = i, e.isSetMatch = s
    })(Zo)), Zo
}
var Cf;

function Rm() {
    return Cf || (Cf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = qw();

        function r(n, i) {
            return t.isMatchWith(n, i, () => {})
        }
        e.isMatch = r
    })(Xo)), Xo
}
var tu = {},
    ru = {},
    nu = {},
    Tf;

function Uw() {
    return Tf || (Tf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return Object.getOwnPropertySymbols(r).filter(n => Object.prototype.propertyIsEnumerable.call(r, n))
        }
        e.getSymbols = t
    })(nu)), nu
}
var iu = {},
    Mf;

function $m() {
    return Mf || (Mf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return r == null ? r === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(r)
        }
        e.getTag = t
    })(iu)), iu
}
var au = {},
    Df;

function Lm() {
    return Df || (Df = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = "[object RegExp]",
            r = "[object String]",
            n = "[object Number]",
            i = "[object Boolean]",
            a = "[object Arguments]",
            o = "[object Symbol]",
            u = "[object Date]",
            l = "[object Map]",
            s = "[object Set]",
            c = "[object Array]",
            f = "[object Function]",
            v = "[object ArrayBuffer]",
            p = "[object Object]",
            h = "[object Error]",
            m = "[object DataView]",
            y = "[object Uint8Array]",
            g = "[object Uint8ClampedArray]",
            b = "[object Uint16Array]",
            x = "[object Uint32Array]",
            P = "[object BigUint64Array]",
            w = "[object Int8Array]",
            O = "[object Int16Array]",
            S = "[object Int32Array]",
            E = "[object BigInt64Array]",
            _ = "[object Float32Array]",
            C = "[object Float64Array]";
        e.argumentsTag = a, e.arrayBufferTag = v, e.arrayTag = c, e.bigInt64ArrayTag = E, e.bigUint64ArrayTag = P, e.booleanTag = i, e.dataViewTag = m, e.dateTag = u, e.errorTag = h, e.float32ArrayTag = _, e.float64ArrayTag = C, e.functionTag = f, e.int16ArrayTag = O, e.int32ArrayTag = S, e.int8ArrayTag = w, e.mapTag = l, e.numberTag = n, e.objectTag = p, e.regexpTag = t, e.setTag = s, e.stringTag = r, e.symbolTag = o, e.uint16ArrayTag = b, e.uint32ArrayTag = x, e.uint8ArrayTag = y, e.uint8ClampedArrayTag = g
    })(au)), au
}
var ou = {},
    Nf;

function Hw() {
    return Nf || (Nf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return ArrayBuffer.isView(r) && !(r instanceof DataView)
        }
        e.isTypedArray = t
    })(ou)), ou
}
var Rf;

function Bm() {
    return Rf || (Rf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Uw(),
            r = $m(),
            n = Lm(),
            i = Dm(),
            a = Hw();

        function o(c, f) {
            return u(c, void 0, c, new Map, f)
        }

        function u(c, f, v, p = new Map, h = void 0) {
            const m = h ?.(c, f, v, p);
            if (m !== void 0) return m;
            if (i.isPrimitive(c)) return c;
            if (p.has(c)) return p.get(c);
            if (Array.isArray(c)) {
                const y = new Array(c.length);
                p.set(c, y);
                for (let g = 0; g < c.length; g++) y[g] = u(c[g], g, v, p, h);
                return Object.hasOwn(c, "index") && (y.index = c.index), Object.hasOwn(c, "input") && (y.input = c.input), y
            }
            if (c instanceof Date) return new Date(c.getTime());
            if (c instanceof RegExp) {
                const y = new RegExp(c.source, c.flags);
                return y.lastIndex = c.lastIndex, y
            }
            if (c instanceof Map) {
                const y = new Map;
                p.set(c, y);
                for (const [g, b] of c) y.set(g, u(b, g, v, p, h));
                return y
            }
            if (c instanceof Set) {
                const y = new Set;
                p.set(c, y);
                for (const g of c) y.add(u(g, void 0, v, p, h));
                return y
            }
            if (typeof Buffer < "u" && Buffer.isBuffer(c)) return c.subarray();
            if (a.isTypedArray(c)) {
                const y = new(Object.getPrototypeOf(c)).constructor(c.length);
                p.set(c, y);
                for (let g = 0; g < c.length; g++) y[g] = u(c[g], g, v, p, h);
                return y
            }
            if (c instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && c instanceof SharedArrayBuffer) return c.slice(0);
            if (c instanceof DataView) {
                const y = new DataView(c.buffer.slice(0), c.byteOffset, c.byteLength);
                return p.set(c, y), l(y, c, v, p, h), y
            }
            if (typeof File < "u" && c instanceof File) {
                const y = new File([c], c.name, {
                    type: c.type
                });
                return p.set(c, y), l(y, c, v, p, h), y
            }
            if (typeof Blob < "u" && c instanceof Blob) {
                const y = new Blob([c], {
                    type: c.type
                });
                return p.set(c, y), l(y, c, v, p, h), y
            }
            if (c instanceof Error) {
                const y = new c.constructor;
                return p.set(c, y), y.message = c.message, y.name = c.name, y.stack = c.stack, y.cause = c.cause, l(y, c, v, p, h), y
            }
            if (c instanceof Boolean) {
                const y = new Boolean(c.valueOf());
                return p.set(c, y), l(y, c, v, p, h), y
            }
            if (c instanceof Number) {
                const y = new Number(c.valueOf());
                return p.set(c, y), l(y, c, v, p, h), y
            }
            if (c instanceof String) {
                const y = new String(c.valueOf());
                return p.set(c, y), l(y, c, v, p, h), y
            }
            if (typeof c == "object" && s(c)) {
                const y = Object.create(Object.getPrototypeOf(c));
                return p.set(c, y), l(y, c, v, p, h), y
            }
            return c
        }

        function l(c, f, v = c, p, h) {
            const m = [...Object.keys(f), ...t.getSymbols(f)];
            for (let y = 0; y < m.length; y++) {
                const g = m[y],
                    b = Object.getOwnPropertyDescriptor(c, g);
                (b == null || b.writable) && (c[g] = u(f[g], g, v, p, h))
            }
        }

        function s(c) {
            switch (r.getTag(c)) {
                case n.argumentsTag:
                case n.arrayTag:
                case n.arrayBufferTag:
                case n.dataViewTag:
                case n.booleanTag:
                case n.dateTag:
                case n.float32ArrayTag:
                case n.float64ArrayTag:
                case n.int8ArrayTag:
                case n.int16ArrayTag:
                case n.int32ArrayTag:
                case n.mapTag:
                case n.numberTag:
                case n.objectTag:
                case n.regexpTag:
                case n.setTag:
                case n.stringTag:
                case n.symbolTag:
                case n.uint8ArrayTag:
                case n.uint8ClampedArrayTag:
                case n.uint16ArrayTag:
                case n.uint32ArrayTag:
                    return !0;
                default:
                    return !1
            }
        }
        e.cloneDeepWith = o, e.cloneDeepWithImpl = u, e.copyProperties = l
    })(ru)), ru
}
var $f;

function Gw() {
    return $f || ($f = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Bm();

        function r(n) {
            return t.cloneDeepWithImpl(n, void 0, n, new Map, void 0)
        }
        e.cloneDeep = r
    })(tu)), tu
}
var Lf;

function Vw() {
    return Lf || (Lf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Rm(),
            r = Gw();

        function n(i) {
            return i = r.cloneDeep(i), a => t.isMatch(a, i)
        }
        e.matches = n
    })(Yo)), Yo
}
var uu = {},
    lu = {},
    cu = {},
    Bf;

function Yw() {
    return Bf || (Bf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Bm(),
            r = Lm();

        function n(i, a) {
            return t.cloneDeepWith(i, (o, u, l, s) => {
                const c = a ?.(o, u, l, s);
                if (c !== void 0) return c;
                if (typeof i == "object") switch (Object.prototype.toString.call(i)) {
                    case r.numberTag:
                    case r.stringTag:
                    case r.booleanTag:
                        {
                            const f = new i.constructor(i ?.valueOf());
                            return t.copyProperties(f, i),
                            f
                        }
                    case r.argumentsTag:
                        {
                            const f = {};
                            return t.copyProperties(f, i),
                            f.length = i.length,
                            f[Symbol.iterator] = i[Symbol.iterator],
                            f
                        }
                    default:
                        return
                }
            })
        }
        e.cloneDeepWith = n
    })(cu)), cu
}
var zf;

function Xw() {
    return zf || (zf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Yw();

        function r(n) {
            return t.cloneDeepWith(n)
        }
        e.cloneDeep = r
    })(lu)), lu
}
var su = {},
    fu = {},
    Kf;

function zm() {
    return Kf || (Kf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = /^(?:0|[1-9]\d*)$/;

        function r(n, i = Number.MAX_SAFE_INTEGER) {
            switch (typeof n) {
                case "number":
                    return Number.isInteger(n) && n >= 0 && n < i;
                case "symbol":
                    return !1;
                case "string":
                    return t.test(n)
            }
        }
        e.isIndex = r
    })(fu)), fu
}
var du = {},
    Wf;

function Zw() {
    return Wf || (Wf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = $m();

        function r(n) {
            return n !== null && typeof n == "object" && t.getTag(n) === "[object Arguments]"
        }
        e.isArguments = r
    })(du)), du
}
var Ff;

function Jw() {
    return Ff || (Ff = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Im(),
            r = zm(),
            n = Zw(),
            i = mc();

        function a(o, u) {
            let l;
            if (Array.isArray(u) ? l = u : typeof u == "string" && t.isDeepKey(u) && o ?.[u] == null ? l = i.toPath(u) : l = [u], l.length === 0) return !1;
            let s = o;
            for (let c = 0; c < l.length; c++) {
                const f = l[c];
                if ((s == null || !Object.hasOwn(s, f)) && !((Array.isArray(s) || n.isArguments(s)) && r.isIndex(f) && f < s.length)) return !1;
                s = s[f]
            }
            return !0
        }
        e.has = a
    })(su)), su
}
var qf;

function Qw() {
    return qf || (qf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Rm(),
            r = hc(),
            n = Xw(),
            i = yc(),
            a = Jw();

        function o(u, l) {
            switch (typeof u) {
                case "object":
                    {
                        Object.is(u ?.valueOf(), -0) && (u = "-0");
                        break
                    }
                case "number":
                    {
                        u = r.toKey(u);
                        break
                    }
            }
            return l = n.cloneDeep(l),
                function(s) {
                    const c = i.get(s, u);
                    return c === void 0 ? a.has(s, u) : l === void 0 ? c === void 0 : t.isMatch(c, l)
                }
        }
        e.matchesProperty = o
    })(uu)), uu
}
var Uf;

function xc() {
    return Uf || (Uf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = za(),
            r = Fw(),
            n = Vw(),
            i = Qw();

        function a(o) {
            if (o == null) return t.identity;
            switch (typeof o) {
                case "function":
                    return o;
                case "object":
                    return Array.isArray(o) && o.length === 2 ? i.matchesProperty(o[0], o[1]) : n.matches(o);
                case "string":
                case "symbol":
                case "number":
                    return r.property(o)
            }
        }
        e.iteratee = a
    })(Go)), Go
}
var Hf;

function eP() {
    return Hf || (Hf = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Bw(),
            r = za(),
            n = Ww(),
            i = xc();

        function a(o, u = r.identity) {
            return n.isArrayLikeObject(o) ? t.uniqBy(Array.from(o), i.iteratee(u)) : []
        }
        e.uniqBy = a
    })(zo)), zo
}
var vu, Gf;

function tP() {
    return Gf || (Gf = 1, vu = eP().uniqBy), vu
}
var rP = tP();
const Vf = _t(rP);

function Km(e, t, r) {
    return t === !0 ? Vf(e, r) : typeof t == "function" ? Vf(e, t) : e
}
var pu = {
        exports: {}
    },
    hu = {},
    mu = {
        exports: {}
    },
    yu = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Yf;

function nP() {
    if (Yf) return yu;
    Yf = 1;
    var e = lc();

    function t(f, v) {
        return f === v && (f !== 0 || 1 / f === 1 / v) || f !== f && v !== v
    }
    var r = typeof Object.is == "function" ? Object.is : t,
        n = e.useState,
        i = e.useEffect,
        a = e.useLayoutEffect,
        o = e.useDebugValue;

    function u(f, v) {
        var p = v(),
            h = n({
                inst: {
                    value: p,
                    getSnapshot: v
                }
            }),
            m = h[0].inst,
            y = h[1];
        return a(function() {
            m.value = p, m.getSnapshot = v, l(m) && y({
                inst: m
            })
        }, [f, p, v]), i(function() {
            return l(m) && y({
                inst: m
            }), f(function() {
                l(m) && y({
                    inst: m
                })
            })
        }, [f]), o(p), p
    }

    function l(f) {
        var v = f.getSnapshot;
        f = f.value;
        try {
            var p = v();
            return !r(f, p)
        } catch {
            return !0
        }
    }

    function s(f, v) {
        return v()
    }
    var c = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? s : u;
    return yu.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : c, yu
}
var Xf;

function iP() {
    return Xf || (Xf = 1, mu.exports = nP()), mu.exports
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Zf;

function aP() {
    if (Zf) return hu;
    Zf = 1;
    var e = lc(),
        t = iP();

    function r(s, c) {
        return s === c && (s !== 0 || 1 / s === 1 / c) || s !== s && c !== c
    }
    var n = typeof Object.is == "function" ? Object.is : r,
        i = t.useSyncExternalStore,
        a = e.useRef,
        o = e.useEffect,
        u = e.useMemo,
        l = e.useDebugValue;
    return hu.useSyncExternalStoreWithSelector = function(s, c, f, v, p) {
        var h = a(null);
        if (h.current === null) {
            var m = {
                hasValue: !1,
                value: null
            };
            h.current = m
        } else m = h.current;
        h = u(function() {
            function g(O) {
                if (!b) {
                    if (b = !0, x = O, O = v(O), p !== void 0 && m.hasValue) {
                        var S = m.value;
                        if (p(S, O)) return P = S
                    }
                    return P = O
                }
                if (S = P, n(x, O)) return S;
                var E = v(O);
                return p !== void 0 && p(S, E) ? (x = O, S) : (x = O, P = E)
            }
            var b = !1,
                x, P, w = f === void 0 ? null : f;
            return [function() {
                return g(c())
            }, w === null ? void 0 : function() {
                return g(w())
            }]
        }, [c, f, v, p]);
        var y = i(s, h[0], h[1]);
        return o(function() {
            m.hasValue = !0, m.value = y
        }, [y]), l(y), y
    }, hu
}
var Jf;

function oP() {
    return Jf || (Jf = 1, pu.exports = aP()), pu.exports
}
var uP = oP(),
    wc = d.createContext(null),
    lP = e => e,
    te = () => {
        var e = d.useContext(wc);
        return e ? e.store.dispatch : lP
    },
    Ki = () => {},
    cP = () => Ki,
    sP = (e, t) => e === t;

function M(e) {
    var t = d.useContext(wc);
    return uP.useSyncExternalStoreWithSelector(t ? t.subscription.addNestedSub : cP, t ? t.store.getState : Ki, t ? t.store.getState : Ki, t ? e : Ki, sP)
}

function fP(e, t = `expected a function, instead received ${typeof e}`) {
    if (typeof e != "function") throw new TypeError(t)
}

function dP(e, t = `expected an object, instead received ${typeof e}`) {
    if (typeof e != "object") throw new TypeError(t)
}

function vP(e, t = "expected all items to be functions, instead received the following types: ") {
    if (!e.every(r => typeof r == "function")) {
        const r = e.map(n => typeof n == "function" ? `function ${n.name||"unnamed"}()` : typeof n).join(", ");
        throw new TypeError(`${t}[${r}]`)
    }
}
var Qf = e => Array.isArray(e) ? e : [e];

function pP(e) {
    const t = Array.isArray(e[0]) ? e[0] : e;
    return vP(t, "createSelector expects all input-selectors to be functions, but received the following types: "), t
}

function hP(e, t) {
    const r = [],
        {
            length: n
        } = e;
    for (let i = 0; i < n; i++) r.push(e[i].apply(null, t));
    return r
}
var mP = class {
        constructor(e) {
            this.value = e
        }
        deref() {
            return this.value
        }
    },
    yP = typeof WeakRef < "u" ? WeakRef : mP,
    gP = 0,
    ed = 1;

function Ei() {
    return {
        s: gP,
        v: void 0,
        o: null,
        p: null
    }
}

function Wm(e, t = {}) {
    let r = Ei();
    const {
        resultEqualityCheck: n
    } = t;
    let i, a = 0;

    function o() {
        let u = r;
        const {
            length: l
        } = arguments;
        for (let f = 0, v = l; f < v; f++) {
            const p = arguments[f];
            if (typeof p == "function" || typeof p == "object" && p !== null) {
                let h = u.o;
                h === null && (u.o = h = new WeakMap);
                const m = h.get(p);
                m === void 0 ? (u = Ei(), h.set(p, u)) : u = m
            } else {
                let h = u.p;
                h === null && (u.p = h = new Map);
                const m = h.get(p);
                m === void 0 ? (u = Ei(), h.set(p, u)) : u = m
            }
        }
        const s = u;
        let c;
        if (u.s === ed) c = u.v;
        else if (c = e.apply(null, arguments), a++, n) {
            const f = i ?.deref ?.() ?? i;
            f != null && n(f, c) && (c = f, a !== 0 && a--), i = typeof c == "object" && c !== null || typeof c == "function" ? new yP(c) : c
        }
        return s.s = ed, s.v = c, c
    }
    return o.clearCache = () => {
        r = Ei(), o.resetResultsCount()
    }, o.resultsCount = () => a, o.resetResultsCount = () => {
        a = 0
    }, o
}

function bP(e, ...t) {
    const r = typeof e == "function" ? {
            memoize: e,
            memoizeOptions: t
        } : e,
        n = (...i) => {
            let a = 0,
                o = 0,
                u, l = {},
                s = i.pop();
            typeof s == "object" && (l = s, s = i.pop()), fP(s, `createSelector expects an output function after the inputs, but received: [${typeof s}]`);
            const c = { ...r,
                    ...l
                },
                {
                    memoize: f,
                    memoizeOptions: v = [],
                    argsMemoize: p = Wm,
                    argsMemoizeOptions: h = []
                } = c,
                m = Qf(v),
                y = Qf(h),
                g = pP(i),
                b = f(function() {
                    return a++, s.apply(null, arguments)
                }, ...m),
                x = p(function() {
                    o++;
                    const w = hP(g, arguments);
                    return u = b.apply(null, w), u
                }, ...y);
            return Object.assign(x, {
                resultFunc: s,
                memoizedResultFunc: b,
                dependencies: g,
                dependencyRecomputations: () => o,
                resetDependencyRecomputations: () => {
                    o = 0
                },
                lastResult: () => u,
                recomputations: () => a,
                resetRecomputations: () => {
                    a = 0
                },
                memoize: f,
                argsMemoize: p
            })
        };
    return Object.assign(n, {
        withTypes: () => n
    }), n
}
var A = bP(Wm),
    xP = Object.assign((e, t = A) => {
        dP(e, `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof e}`);
        const r = Object.keys(e),
            n = r.map(a => e[a]);
        return t(n, (...a) => a.reduce((o, u, l) => (o[r[l]] = u, o), {}))
    }, {
        withTypes: () => xP
    }),
    gu = {},
    bu = {},
    xu = {},
    td;

function wP() {
    return td || (td = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(n) {
            return typeof n == "symbol" ? 1 : n === null ? 2 : n === void 0 ? 3 : n !== n ? 4 : 0
        }
        const r = (n, i, a) => {
            if (n !== i) {
                const o = t(n),
                    u = t(i);
                if (o === u && o === 0) {
                    if (n < i) return a === "desc" ? 1 : -1;
                    if (n > i) return a === "desc" ? -1 : 1
                }
                return a === "desc" ? u - o : o - u
            }
            return 0
        };
        e.compareValues = r
    })(xu)), xu
}
var wu = {},
    Pu = {},
    rd;

function Fm() {
    return rd || (rd = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return typeof r == "symbol" || r instanceof Symbol
        }
        e.isSymbol = t
    })(Pu)), Pu
}
var nd;

function PP() {
    return nd || (nd = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Fm(),
            r = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
            n = /^\w*$/;

        function i(a, o) {
            return Array.isArray(a) ? !1 : typeof a == "number" || typeof a == "boolean" || a == null || t.isSymbol(a) ? !0 : typeof a == "string" && (n.test(a) || !r.test(a)) || o != null && Object.hasOwn(o, a)
        }
        e.isKey = i
    })(wu)), wu
}
var id;

function OP() {
    return id || (id = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = wP(),
            r = PP(),
            n = mc();

        function i(a, o, u, l) {
            if (a == null) return [];
            u = l ? void 0 : u, Array.isArray(a) || (a = Object.values(a)), Array.isArray(o) || (o = o == null ? [null] : [o]), o.length === 0 && (o = [null]), Array.isArray(u) || (u = u == null ? [] : [u]), u = u.map(p => String(p));
            const s = (p, h) => {
                    let m = p;
                    for (let y = 0; y < h.length && m != null; ++y) m = m[h[y]];
                    return m
                },
                c = (p, h) => h == null || p == null ? h : typeof p == "object" && "key" in p ? Object.hasOwn(h, p.key) ? h[p.key] : s(h, p.path) : typeof p == "function" ? p(h) : Array.isArray(p) ? s(h, p) : typeof h == "object" ? h[p] : h,
                f = o.map(p => (Array.isArray(p) && p.length === 1 && (p = p[0]), p == null || typeof p == "function" || Array.isArray(p) || r.isKey(p) ? p : {
                    key: p,
                    path: n.toPath(p)
                }));
            return a.map(p => ({
                original: p,
                criteria: f.map(h => c(h, p))
            })).slice().sort((p, h) => {
                for (let m = 0; m < f.length; m++) {
                    const y = t.compareValues(p.criteria[m], h.criteria[m], u[m]);
                    if (y !== 0) return y
                }
                return 0
            }).map(p => p.original)
        }
        e.orderBy = i
    })(bu)), bu
}
var Ou = {},
    ad;

function AP() {
    return ad || (ad = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r, n = 1) {
            const i = [],
                a = Math.floor(n),
                o = (u, l) => {
                    for (let s = 0; s < u.length; s++) {
                        const c = u[s];
                        Array.isArray(c) && l < a ? o(c, l + 1) : i.push(c)
                    }
                };
            return o(r, 0), i
        }
        e.flatten = t
    })(Ou)), Ou
}
var Au = {},
    od;

function qm() {
    return od || (od = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = zm(),
            r = bc(),
            n = Mm(),
            i = Nm();

        function a(o, u, l) {
            return n.isObject(l) && (typeof u == "number" && r.isArrayLike(l) && t.isIndex(u) && u < l.length || typeof u == "string" && u in l) ? i.eq(l[u], o) : !1
        }
        e.isIterateeCall = a
    })(Au)), Au
}
var ud;

function SP() {
    return ud || (ud = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = OP(),
            r = AP(),
            n = qm();

        function i(a, ...o) {
            const u = o.length;
            return u > 1 && n.isIterateeCall(a, o[0], o[1]) ? o = [] : u > 2 && n.isIterateeCall(o[0], o[1], o[2]) && (o = [o[0]]), t.orderBy(a, r.flatten(o), ["asc"])
        }
        e.sortBy = i
    })(gu)), gu
}
var Su, ld;

function EP() {
    return ld || (ld = 1, Su = SP().sortBy), Su
}
var jP = EP();
const Ka = _t(jP);
var Um = e => e.legend.settings,
    IP = e => e.legend.size,
    _P = e => e.legend.payload,
    kP = A([_P, Um], (e, t) => {
        var {
            itemSorter: r
        } = t, n = e.flat(1);
        return r ? Ka(n, r) : n
    });

function CP() {
    return M(kP)
}
var ji = 1;

function Hm() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
        [t, r] = d.useState({
            height: 0,
            left: 0,
            top: 0,
            width: 0
        }),
        n = d.useCallback(i => {
            if (i != null) {
                var a = i.getBoundingClientRect(),
                    o = {
                        height: a.height,
                        left: a.left,
                        top: a.top,
                        width: a.width
                    };
                (Math.abs(o.height - t.height) > ji || Math.abs(o.left - t.left) > ji || Math.abs(o.top - t.top) > ji || Math.abs(o.width - t.width) > ji) && r({
                    height: o.height,
                    left: o.left,
                    top: o.top,
                    width: o.width
                })
            }
        }, [t.width, t.height, t.top, t.left, ...e]);
    return [t, n]
}

function Ce(e) {
    return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `
}
var TP = typeof Symbol == "function" && Symbol.observable || "@@observable",
    cd = TP,
    Eu = () => Math.random().toString(36).substring(7).split("").join("."),
    MP = {
        INIT: `@@redux/INIT${Eu()}`,
        REPLACE: `@@redux/REPLACE${Eu()}`,
        PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${Eu()}`
    },
    Xi = MP;

function Pc(e) {
    if (typeof e != "object" || e === null) return !1;
    let t = e;
    for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
    return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null
}

function Gm(e, t, r) {
    if (typeof e != "function") throw new Error(Ce(2));
    if (typeof t == "function" && typeof r == "function" || typeof r == "function" && typeof arguments[3] == "function") throw new Error(Ce(0));
    if (typeof t == "function" && typeof r > "u" && (r = t, t = void 0), typeof r < "u") {
        if (typeof r != "function") throw new Error(Ce(1));
        return r(Gm)(e, t)
    }
    let n = e,
        i = t,
        a = new Map,
        o = a,
        u = 0,
        l = !1;

    function s() {
        o === a && (o = new Map, a.forEach((y, g) => {
            o.set(g, y)
        }))
    }

    function c() {
        if (l) throw new Error(Ce(3));
        return i
    }

    function f(y) {
        if (typeof y != "function") throw new Error(Ce(4));
        if (l) throw new Error(Ce(5));
        let g = !0;
        s();
        const b = u++;
        return o.set(b, y),
            function() {
                if (g) {
                    if (l) throw new Error(Ce(6));
                    g = !1, s(), o.delete(b), a = null
                }
            }
    }

    function v(y) {
        if (!Pc(y)) throw new Error(Ce(7));
        if (typeof y.type > "u") throw new Error(Ce(8));
        if (typeof y.type != "string") throw new Error(Ce(17));
        if (l) throw new Error(Ce(9));
        try {
            l = !0, i = n(i, y)
        } finally {
            l = !1
        }
        return (a = o).forEach(b => {
            b()
        }), y
    }

    function p(y) {
        if (typeof y != "function") throw new Error(Ce(10));
        n = y, v({
            type: Xi.REPLACE
        })
    }

    function h() {
        const y = f;
        return {
            subscribe(g) {
                if (typeof g != "object" || g === null) throw new Error(Ce(11));

                function b() {
                    const P = g;
                    P.next && P.next(c())
                }
                return b(), {
                    unsubscribe: y(b)
                }
            },
            [cd]() {
                return this
            }
        }
    }
    return v({
        type: Xi.INIT
    }), {
        dispatch: v,
        subscribe: f,
        getState: c,
        replaceReducer: p,
        [cd]: h
    }
}

function DP(e) {
    Object.keys(e).forEach(t => {
        const r = e[t];
        if (typeof r(void 0, {
                type: Xi.INIT
            }) > "u") throw new Error(Ce(12));
        if (typeof r(void 0, {
                type: Xi.PROBE_UNKNOWN_ACTION()
            }) > "u") throw new Error(Ce(13))
    })
}

function Vm(e) {
    const t = Object.keys(e),
        r = {};
    for (let a = 0; a < t.length; a++) {
        const o = t[a];
        typeof e[o] == "function" && (r[o] = e[o])
    }
    const n = Object.keys(r);
    let i;
    try {
        DP(r)
    } catch (a) {
        i = a
    }
    return function(o = {}, u) {
        if (i) throw i;
        let l = !1;
        const s = {};
        for (let c = 0; c < n.length; c++) {
            const f = n[c],
                v = r[f],
                p = o[f],
                h = v(p, u);
            if (typeof h > "u") throw u && u.type, new Error(Ce(14));
            s[f] = h, l = l || h !== p
        }
        return l = l || n.length !== Object.keys(o).length, l ? s : o
    }
}

function Zi(...e) {
    return e.length === 0 ? t => t : e.length === 1 ? e[0] : e.reduce((t, r) => (...n) => t(r(...n)))
}

function NP(...e) {
    return t => (r, n) => {
        const i = t(r, n);
        let a = () => {
            throw new Error(Ce(15))
        };
        const o = {
                getState: i.getState,
                dispatch: (l, ...s) => a(l, ...s)
            },
            u = e.map(l => l(o));
        return a = Zi(...u)(i.dispatch), { ...i,
            dispatch: a
        }
    }
}

function Ym(e) {
    return Pc(e) && "type" in e && typeof e.type == "string"
}
var Xm = Symbol.for("immer-nothing"),
    sd = Symbol.for("immer-draftable"),
    Je = Symbol.for("immer-state");

function dt(e, ...t) {
    throw new Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`)
}
var $n = Object.getPrototypeOf;

function Tr(e) {
    return !!e && !!e[Je]
}

function Kt(e) {
    return e ? Zm(e) || Array.isArray(e) || !!e[sd] || !!e.constructor ?.[sd] || ti(e) || Fa(e) : !1
}
var RP = Object.prototype.constructor.toString(),
    fd = new WeakMap;

function Zm(e) {
    if (!e || typeof e != "object") return !1;
    const t = Object.getPrototypeOf(e);
    if (t === null || t === Object.prototype) return !0;
    const r = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
    if (r === Object) return !0;
    if (typeof r != "function") return !1;
    let n = fd.get(r);
    return n === void 0 && (n = Function.toString.call(r), fd.set(r, n)), n === RP
}

function Ji(e, t, r = !0) {
    Wa(e) === 0 ? (r ? Reflect.ownKeys(e) : Object.keys(e)).forEach(i => {
        t(i, e[i], e)
    }) : e.forEach((n, i) => t(i, n, e))
}

function Wa(e) {
    const t = e[Je];
    return t ? t.type_ : Array.isArray(e) ? 1 : ti(e) ? 2 : Fa(e) ? 3 : 0
}

function wl(e, t) {
    return Wa(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t)
}

function Jm(e, t, r) {
    const n = Wa(e);
    n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r
}

function $P(e, t) {
    return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t
}

function ti(e) {
    return e instanceof Map
}

function Fa(e) {
    return e instanceof Set
}

function gr(e) {
    return e.copy_ || e.base_
}

function Pl(e, t) {
    if (ti(e)) return new Map(e);
    if (Fa(e)) return new Set(e);
    if (Array.isArray(e)) return Array.prototype.slice.call(e);
    const r = Zm(e);
    if (t === !0 || t === "class_only" && !r) {
        const n = Object.getOwnPropertyDescriptors(e);
        delete n[Je];
        let i = Reflect.ownKeys(n);
        for (let a = 0; a < i.length; a++) {
            const o = i[a],
                u = n[o];
            u.writable === !1 && (u.writable = !0, u.configurable = !0), (u.get || u.set) && (n[o] = {
                configurable: !0,
                writable: !0,
                enumerable: u.enumerable,
                value: e[o]
            })
        }
        return Object.create($n(e), n)
    } else {
        const n = $n(e);
        if (n !== null && r) return { ...e
        };
        const i = Object.create(n);
        return Object.assign(i, e)
    }
}

function Oc(e, t = !1) {
    return qa(e) || Tr(e) || !Kt(e) || (Wa(e) > 1 && Object.defineProperties(e, {
        set: Ii,
        add: Ii,
        clear: Ii,
        delete: Ii
    }), Object.freeze(e), t && Object.values(e).forEach(r => Oc(r, !0))), e
}

function LP() {
    dt(2)
}
var Ii = {
    value: LP
};

function qa(e) {
    return e === null || typeof e != "object" ? !0 : Object.isFrozen(e)
}
var BP = {};

function Mr(e) {
    const t = BP[e];
    return t || dt(0, e), t
}
var Ln;

function Qm() {
    return Ln
}

function zP(e, t) {
    return {
        drafts_: [],
        parent_: e,
        immer_: t,
        canAutoFreeze_: !0,
        unfinalizedDrafts_: 0
    }
}

function dd(e, t) {
    t && (Mr("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t)
}

function Ol(e) {
    Al(e), e.drafts_.forEach(KP), e.drafts_ = null
}

function Al(e) {
    e === Ln && (Ln = e.parent_)
}

function vd(e) {
    return Ln = zP(Ln, e)
}

function KP(e) {
    const t = e[Je];
    t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0
}

function pd(e, t) {
    t.unfinalizedDrafts_ = t.drafts_.length;
    const r = t.drafts_[0];
    return e !== void 0 && e !== r ? (r[Je].modified_ && (Ol(t), dt(4)), Kt(e) && (e = Qi(t, e), t.parent_ || ea(t, e)), t.patches_ && Mr("Patches").generateReplacementPatches_(r[Je].base_, e, t.patches_, t.inversePatches_)) : e = Qi(t, r, []), Ol(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== Xm ? e : void 0
}

function Qi(e, t, r) {
    if (qa(t)) return t;
    const n = e.immer_.shouldUseStrictIteration(),
        i = t[Je];
    if (!i) return Ji(t, (a, o) => hd(e, i, t, a, o, r), n), t;
    if (i.scope_ !== e) return t;
    if (!i.modified_) return ea(e, i.base_, !0), i.base_;
    if (!i.finalized_) {
        i.finalized_ = !0, i.scope_.unfinalizedDrafts_--;
        const a = i.copy_;
        let o = a,
            u = !1;
        i.type_ === 3 && (o = new Set(a), a.clear(), u = !0), Ji(o, (l, s) => hd(e, i, a, l, s, r, u), n), ea(e, a, !1), r && e.patches_ && Mr("Patches").generatePatches_(i, r, e.patches_, e.inversePatches_)
    }
    return i.copy_
}

function hd(e, t, r, n, i, a, o) {
    if (i == null || typeof i != "object" && !o) return;
    const u = qa(i);
    if (!(u && !o)) {
        if (Tr(i)) {
            const l = a && t && t.type_ !== 3 && !wl(t.assigned_, n) ? a.concat(n) : void 0,
                s = Qi(e, i, l);
            if (Jm(r, n, s), Tr(s)) e.canAutoFreeze_ = !1;
            else return
        } else o && r.add(i);
        if (Kt(i) && !u) {
            if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1 || t && t.base_ && t.base_[n] === i && u) return;
            Qi(e, i), (!t || !t.scope_.parent_) && typeof n != "symbol" && (ti(r) ? r.has(n) : Object.prototype.propertyIsEnumerable.call(r, n)) && ea(e, i)
        }
    }
}

function ea(e, t, r = !1) {
    !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && Oc(t, r)
}

function WP(e, t) {
    const r = Array.isArray(e),
        n = {
            type_: r ? 1 : 0,
            scope_: t ? t.scope_ : Qm(),
            modified_: !1,
            finalized_: !1,
            assigned_: {},
            parent_: t,
            base_: e,
            draft_: null,
            copy_: null,
            revoke_: null,
            isManual_: !1
        };
    let i = n,
        a = Ac;
    r && (i = [n], a = Bn);
    const {
        revoke: o,
        proxy: u
    } = Proxy.revocable(i, a);
    return n.draft_ = u, n.revoke_ = o, u
}
var Ac = {
        get(e, t) {
            if (t === Je) return e;
            const r = gr(e);
            if (!wl(r, t)) return FP(e, r, t);
            const n = r[t];
            return e.finalized_ || !Kt(n) ? n : n === ju(e.base_, t) ? (Iu(e), e.copy_[t] = El(n, e)) : n
        },
        has(e, t) {
            return t in gr(e)
        },
        ownKeys(e) {
            return Reflect.ownKeys(gr(e))
        },
        set(e, t, r) {
            const n = ey(gr(e), t);
            if (n ?.set) return n.set.call(e.draft_, r), !0;
            if (!e.modified_) {
                const i = ju(gr(e), t),
                    a = i ?.[Je];
                if (a && a.base_ === r) return e.copy_[t] = r, e.assigned_[t] = !1, !0;
                if ($P(r, i) && (r !== void 0 || wl(e.base_, t))) return !0;
                Iu(e), Sl(e)
            }
            return e.copy_[t] === r && (r !== void 0 || t in e.copy_) || Number.isNaN(r) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = r, e.assigned_[t] = !0), !0
        },
        deleteProperty(e, t) {
            return ju(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, Iu(e), Sl(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0
        },
        getOwnPropertyDescriptor(e, t) {
            const r = gr(e),
                n = Reflect.getOwnPropertyDescriptor(r, t);
            return n && {
                writable: !0,
                configurable: e.type_ !== 1 || t !== "length",
                enumerable: n.enumerable,
                value: r[t]
            }
        },
        defineProperty() {
            dt(11)
        },
        getPrototypeOf(e) {
            return $n(e.base_)
        },
        setPrototypeOf() {
            dt(12)
        }
    },
    Bn = {};
Ji(Ac, (e, t) => {
    Bn[e] = function() {
        return arguments[0] = arguments[0][0], t.apply(this, arguments)
    }
});
Bn.deleteProperty = function(e, t) {
    return Bn.set.call(this, e, t, void 0)
};
Bn.set = function(e, t, r) {
    return Ac.set.call(this, e[0], t, r, e[0])
};

function ju(e, t) {
    const r = e[Je];
    return (r ? gr(r) : e)[t]
}

function FP(e, t, r) {
    const n = ey(t, r);
    return n ? "value" in n ? n.value : n.get ?.call(e.draft_) : void 0
}

function ey(e, t) {
    if (!(t in e)) return;
    let r = $n(e);
    for (; r;) {
        const n = Object.getOwnPropertyDescriptor(r, t);
        if (n) return n;
        r = $n(r)
    }
}

function Sl(e) {
    e.modified_ || (e.modified_ = !0, e.parent_ && Sl(e.parent_))
}

function Iu(e) {
    e.copy_ || (e.copy_ = Pl(e.base_, e.scope_.immer_.useStrictShallowCopy_))
}
var qP = class {
    constructor(e) {
        this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !0, this.produce = (t, r, n) => {
            if (typeof t == "function" && typeof r != "function") {
                const a = r;
                r = t;
                const o = this;
                return function(l = a, ...s) {
                    return o.produce(l, c => r.call(this, c, ...s))
                }
            }
            typeof r != "function" && dt(6), n !== void 0 && typeof n != "function" && dt(7);
            let i;
            if (Kt(t)) {
                const a = vd(this),
                    o = El(t, void 0);
                let u = !0;
                try {
                    i = r(o), u = !1
                } finally {
                    u ? Ol(a) : Al(a)
                }
                return dd(a, n), pd(i, a)
            } else if (!t || typeof t != "object") {
                if (i = r(t), i === void 0 && (i = t), i === Xm && (i = void 0), this.autoFreeze_ && Oc(i, !0), n) {
                    const a = [],
                        o = [];
                    Mr("Patches").generateReplacementPatches_(t, i, a, o), n(a, o)
                }
                return i
            } else dt(1, t)
        }, this.produceWithPatches = (t, r) => {
            if (typeof t == "function") return (o, ...u) => this.produceWithPatches(o, l => t(l, ...u));
            let n, i;
            return [this.produce(t, r, (o, u) => {
                n = o, i = u
            }), n, i]
        }, typeof e ?.autoFreeze == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof e ?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy), typeof e ?.useStrictIteration == "boolean" && this.setUseStrictIteration(e.useStrictIteration)
    }
    createDraft(e) {
        Kt(e) || dt(8), Tr(e) && (e = ht(e));
        const t = vd(this),
            r = El(e, void 0);
        return r[Je].isManual_ = !0, Al(t), r
    }
    finishDraft(e, t) {
        const r = e && e[Je];
        (!r || !r.isManual_) && dt(9);
        const {
            scope_: n
        } = r;
        return dd(n, t), pd(void 0, n)
    }
    setAutoFreeze(e) {
        this.autoFreeze_ = e
    }
    setUseStrictShallowCopy(e) {
        this.useStrictShallowCopy_ = e
    }
    setUseStrictIteration(e) {
        this.useStrictIteration_ = e
    }
    shouldUseStrictIteration() {
        return this.useStrictIteration_
    }
    applyPatches(e, t) {
        let r;
        for (r = t.length - 1; r >= 0; r--) {
            const i = t[r];
            if (i.path.length === 0 && i.op === "replace") {
                e = i.value;
                break
            }
        }
        r > -1 && (t = t.slice(r + 1));
        const n = Mr("Patches").applyPatches_;
        return Tr(e) ? n(e, t) : this.produce(e, i => n(i, t))
    }
};

function El(e, t) {
    const r = ti(e) ? Mr("MapSet").proxyMap_(e, t) : Fa(e) ? Mr("MapSet").proxySet_(e, t) : WP(e, t);
    return (t ? t.scope_ : Qm()).drafts_.push(r), r
}

function ht(e) {
    return Tr(e) || dt(10, e), ty(e)
}

function ty(e) {
    if (!Kt(e) || qa(e)) return e;
    const t = e[Je];
    let r, n = !0;
    if (t) {
        if (!t.modified_) return t.base_;
        t.finalized_ = !0, r = Pl(e, t.scope_.immer_.useStrictShallowCopy_), n = t.scope_.immer_.shouldUseStrictIteration()
    } else r = Pl(e, !0);
    return Ji(r, (i, a) => {
        Jm(r, i, ty(a))
    }, n), t && (t.finalized_ = !1), r
}
var jl = new qP,
    ry = jl.produce,
    UP = jl.setUseStrictIteration.bind(jl);

function ny(e) {
    return ({
        dispatch: r,
        getState: n
    }) => i => a => typeof a == "function" ? a(r, n, e) : i(a)
}
var HP = ny(),
    GP = ny,
    VP = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
        if (arguments.length !== 0) return typeof arguments[0] == "object" ? Zi : Zi.apply(null, arguments)
    };

function ot(e, t) {
    function r(...n) {
        if (t) {
            let i = t(...n);
            if (!i) throw new Error(Ze(0));
            return {
                type: e,
                payload: i.payload,
                ..."meta" in i && {
                    meta: i.meta
                },
                ..."error" in i && {
                    error: i.error
                }
            }
        }
        return {
            type: e,
            payload: n[0]
        }
    }
    return r.toString = () => `${e}`, r.type = e, r.match = n => Ym(n) && n.type === e, r
}
var iy = class Cn extends Array {
    constructor(...t) {
        super(...t), Object.setPrototypeOf(this, Cn.prototype)
    }
    static get[Symbol.species]() {
        return Cn
    }
    concat(...t) {
        return super.concat.apply(this, t)
    }
    prepend(...t) {
        return t.length === 1 && Array.isArray(t[0]) ? new Cn(...t[0].concat(this)) : new Cn(...t.concat(this))
    }
};

function md(e) {
    return Kt(e) ? ry(e, () => {}) : e
}

function _i(e, t, r) {
    return e.has(t) ? e.get(t) : e.set(t, r(t)).get(t)
}

function YP(e) {
    return typeof e == "boolean"
}
var XP = () => function(t) {
        const {
            thunk: r = !0,
            immutableCheck: n = !0,
            serializableCheck: i = !0,
            actionCreatorCheck: a = !0
        } = t ?? {};
        let o = new iy;
        return r && (YP(r) ? o.push(HP) : o.push(GP(r.extraArgument))), o
    },
    ay = "RTK_autoBatch",
    se = () => e => ({
        payload: e,
        meta: {
            [ay]: !0
        }
    }),
    yd = e => t => {
        setTimeout(t, e)
    },
    oy = (e = {
        type: "raf"
    }) => t => (...r) => {
        const n = t(...r);
        let i = !0,
            a = !1,
            o = !1;
        const u = new Set,
            l = e.type === "tick" ? queueMicrotask : e.type === "raf" ? typeof window < "u" && window.requestAnimationFrame ? window.requestAnimationFrame : yd(10) : e.type === "callback" ? e.queueNotification : yd(e.timeout),
            s = () => {
                o = !1, a && (a = !1, u.forEach(c => c()))
            };
        return Object.assign({}, n, {
            subscribe(c) {
                const f = () => i && c(),
                    v = n.subscribe(f);
                return u.add(c), () => {
                    v(), u.delete(c)
                }
            },
            dispatch(c) {
                try {
                    return i = !c ?.meta ?.[ay], a = !i, a && (o || (o = !0, l(s))), n.dispatch(c)
                } finally {
                    i = !0
                }
            }
        })
    },
    ZP = e => function(r) {
        const {
            autoBatch: n = !0
        } = r ?? {};
        let i = new iy(e);
        return n && i.push(oy(typeof n == "object" ? n : void 0)), i
    };

function JP(e) {
    const t = XP(),
        {
            reducer: r = void 0,
            middleware: n,
            devTools: i = !0,
            preloadedState: a = void 0,
            enhancers: o = void 0
        } = e || {};
    let u;
    if (typeof r == "function") u = r;
    else if (Pc(r)) u = Vm(r);
    else throw new Error(Ze(1));
    let l;
    typeof n == "function" ? l = n(t) : l = t();
    let s = Zi;
    i && (s = VP({
        trace: !1,
        ...typeof i == "object" && i
    }));
    const c = NP(...l),
        f = ZP(c);
    let v = typeof o == "function" ? o(f) : f();
    const p = s(...v);
    return Gm(u, a, p)
}

function uy(e) {
    const t = {},
        r = [];
    let n;
    const i = {
        addCase(a, o) {
            const u = typeof a == "string" ? a : a.type;
            if (!u) throw new Error(Ze(28));
            if (u in t) throw new Error(Ze(29));
            return t[u] = o, i
        },
        addAsyncThunk(a, o) {
            return o.pending && (t[a.pending.type] = o.pending), o.rejected && (t[a.rejected.type] = o.rejected), o.fulfilled && (t[a.fulfilled.type] = o.fulfilled), o.settled && r.push({
                matcher: a.settled,
                reducer: o.settled
            }), i
        },
        addMatcher(a, o) {
            return r.push({
                matcher: a,
                reducer: o
            }), i
        },
        addDefaultCase(a) {
            return n = a, i
        }
    };
    return e(i), [t, r, n]
}
UP(!1);

function QP(e) {
    return typeof e == "function"
}

function eO(e, t) {
    let [r, n, i] = uy(t), a;
    if (QP(e)) a = () => md(e());
    else {
        const u = md(e);
        a = () => u
    }

    function o(u = a(), l) {
        let s = [r[l.type], ...n.filter(({
            matcher: c
        }) => c(l)).map(({
            reducer: c
        }) => c)];
        return s.filter(c => !!c).length === 0 && (s = [i]), s.reduce((c, f) => {
            if (f)
                if (Tr(c)) {
                    const p = f(c, l);
                    return p === void 0 ? c : p
                } else {
                    if (Kt(c)) return ry(c, v => f(v, l)); {
                        const v = f(c, l);
                        if (v === void 0) {
                            if (c === null) return c;
                            throw Error("A case reducer on a non-draftable value must not return undefined")
                        }
                        return v
                    }
                }
            return c
        }, u)
    }
    return o.getInitialState = a, o
}
var tO = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW",
    rO = (e = 21) => {
        let t = "",
            r = e;
        for (; r--;) t += tO[Math.random() * 64 | 0];
        return t
    },
    nO = Symbol.for("rtk-slice-createasyncthunk");

function iO(e, t) {
    return `${e}/${t}`
}

function aO({
    creators: e
} = {}) {
    const t = e ?.asyncThunk ?.[nO];
    return function(n) {
        const {
            name: i,
            reducerPath: a = i
        } = n;
        if (!i) throw new Error(Ze(11));
        const o = (typeof n.reducers == "function" ? n.reducers(uO()) : n.reducers) || {},
            u = Object.keys(o),
            l = {
                sliceCaseReducersByName: {},
                sliceCaseReducersByType: {},
                actionCreators: {},
                sliceMatchers: []
            },
            s = {
                addCase(x, P) {
                    const w = typeof x == "string" ? x : x.type;
                    if (!w) throw new Error(Ze(12));
                    if (w in l.sliceCaseReducersByType) throw new Error(Ze(13));
                    return l.sliceCaseReducersByType[w] = P, s
                },
                addMatcher(x, P) {
                    return l.sliceMatchers.push({
                        matcher: x,
                        reducer: P
                    }), s
                },
                exposeAction(x, P) {
                    return l.actionCreators[x] = P, s
                },
                exposeCaseReducer(x, P) {
                    return l.sliceCaseReducersByName[x] = P, s
                }
            };
        u.forEach(x => {
            const P = o[x],
                w = {
                    reducerName: x,
                    type: iO(i, x),
                    createNotation: typeof n.reducers == "function"
                };
            cO(P) ? fO(w, P, s, t) : lO(w, P, s)
        });

        function c() {
            const [x = {}, P = [], w = void 0] = typeof n.extraReducers == "function" ? uy(n.extraReducers) : [n.extraReducers], O = { ...x,
                ...l.sliceCaseReducersByType
            };
            return eO(n.initialState, S => {
                for (let E in O) S.addCase(E, O[E]);
                for (let E of l.sliceMatchers) S.addMatcher(E.matcher, E.reducer);
                for (let E of P) S.addMatcher(E.matcher, E.reducer);
                w && S.addDefaultCase(w)
            })
        }
        const f = x => x,
            v = new Map,
            p = new WeakMap;
        let h;

        function m(x, P) {
            return h || (h = c()), h(x, P)
        }

        function y() {
            return h || (h = c()), h.getInitialState()
        }

        function g(x, P = !1) {
            function w(S) {
                let E = S[x];
                return typeof E > "u" && P && (E = _i(p, w, y)), E
            }

            function O(S = f) {
                const E = _i(v, P, () => new WeakMap);
                return _i(E, S, () => {
                    const _ = {};
                    for (const [C, j] of Object.entries(n.selectors ?? {})) _[C] = oO(j, S, () => _i(p, S, y), P);
                    return _
                })
            }
            return {
                reducerPath: x,
                getSelectors: O,
                get selectors() {
                    return O(w)
                },
                selectSlice: w
            }
        }
        const b = {
            name: i,
            reducer: m,
            actions: l.actionCreators,
            caseReducers: l.sliceCaseReducersByName,
            getInitialState: y,
            ...g(a),
            injectInto(x, {
                reducerPath: P,
                ...w
            } = {}) {
                const O = P ?? a;
                return x.inject({
                    reducerPath: O,
                    reducer: m
                }, w), { ...b,
                    ...g(O, !0)
                }
            }
        };
        return b
    }
}

function oO(e, t, r, n) {
    function i(a, ...o) {
        let u = t(a);
        return typeof u > "u" && n && (u = r()), e(u, ...o)
    }
    return i.unwrapped = e, i
}
var Ge = aO();

function uO() {
    function e(t, r) {
        return {
            _reducerDefinitionType: "asyncThunk",
            payloadCreator: t,
            ...r
        }
    }
    return e.withTypes = () => e, {
        reducer(t) {
            return Object.assign({
                [t.name](...r) {
                    return t(...r)
                }
            }[t.name], {
                _reducerDefinitionType: "reducer"
            })
        },
        preparedReducer(t, r) {
            return {
                _reducerDefinitionType: "reducerWithPrepare",
                prepare: t,
                reducer: r
            }
        },
        asyncThunk: e
    }
}

function lO({
    type: e,
    reducerName: t,
    createNotation: r
}, n, i) {
    let a, o;
    if ("reducer" in n) {
        if (r && !sO(n)) throw new Error(Ze(17));
        a = n.reducer, o = n.prepare
    } else a = n;
    i.addCase(e, a).exposeCaseReducer(t, a).exposeAction(t, o ? ot(e, o) : ot(e))
}

function cO(e) {
    return e._reducerDefinitionType === "asyncThunk"
}

function sO(e) {
    return e._reducerDefinitionType === "reducerWithPrepare"
}

function fO({
    type: e,
    reducerName: t
}, r, n, i) {
    if (!i) throw new Error(Ze(18));
    const {
        payloadCreator: a,
        fulfilled: o,
        pending: u,
        rejected: l,
        settled: s,
        options: c
    } = r, f = i(e, a, c);
    n.exposeAction(t, f), o && n.addCase(f.fulfilled, o), u && n.addCase(f.pending, u), l && n.addCase(f.rejected, l), s && n.addMatcher(f.settled, s), n.exposeCaseReducer(t, {
        fulfilled: o || ki,
        pending: u || ki,
        rejected: l || ki,
        settled: s || ki
    })
}

function ki() {}
var dO = "task",
    ly = "listener",
    cy = "completed",
    Sc = "cancelled",
    vO = `task-${Sc}`,
    pO = `task-${cy}`,
    Il = `${ly}-${Sc}`,
    hO = `${ly}-${cy}`,
    Ua = class {
        constructor(e) {
            this.code = e, this.message = `${dO} ${Sc} (reason: ${e})`
        }
        name = "TaskAbortError";
        message
    },
    Ec = (e, t) => {
        if (typeof e != "function") throw new TypeError(Ze(32))
    },
    ta = () => {},
    sy = (e, t = ta) => (e.catch(t), e),
    fy = (e, t) => (e.addEventListener("abort", t, {
        once: !0
    }), () => e.removeEventListener("abort", t)),
    Ar = (e, t) => {
        const r = e.signal;
        r.aborted || ("reason" in r || Object.defineProperty(r, "reason", {
            enumerable: !0,
            value: t,
            configurable: !0,
            writable: !0
        }), e.abort(t))
    },
    Sr = e => {
        if (e.aborted) {
            const {
                reason: t
            } = e;
            throw new Ua(t)
        }
    };

function dy(e, t) {
    let r = ta;
    return new Promise((n, i) => {
        const a = () => i(new Ua(e.reason));
        if (e.aborted) {
            a();
            return
        }
        r = fy(e, a), t.finally(() => r()).then(n, i)
    }).finally(() => {
        r = ta
    })
}
var mO = async (e, t) => {
        try {
            return await Promise.resolve(), {
                status: "ok",
                value: await e()
            }
        } catch (r) {
            return {
                status: r instanceof Ua ? "cancelled" : "rejected",
                error: r
            }
        } finally {
            t ?.()
        }
    },
    ra = e => t => sy(dy(e, t).then(r => (Sr(e), r))),
    vy = e => {
        const t = ra(e);
        return r => t(new Promise(n => setTimeout(n, r)))
    },
    {
        assign: Vr
    } = Object,
    gd = {},
    Ha = "listenerMiddleware",
    yO = (e, t) => {
        const r = n => fy(e, () => Ar(n, e.reason));
        return (n, i) => {
            Ec(n);
            const a = new AbortController;
            r(a);
            const o = mO(async () => {
                Sr(e), Sr(a.signal);
                const u = await n({
                    pause: ra(a.signal),
                    delay: vy(a.signal),
                    signal: a.signal
                });
                return Sr(a.signal), u
            }, () => Ar(a, pO));
            return i ?.autoJoin && t.push(o.catch(ta)), {
                result: ra(e)(o),
                cancel() {
                    Ar(a, vO)
                }
            }
        }
    },
    gO = (e, t) => {
        const r = async (n, i) => {
            Sr(t);
            let a = () => {};
            const u = [new Promise((l, s) => {
                let c = e({
                    predicate: n,
                    effect: (f, v) => {
                        v.unsubscribe(), l([f, v.getState(), v.getOriginalState()])
                    }
                });
                a = () => {
                    c(), s()
                }
            })];
            i != null && u.push(new Promise(l => setTimeout(l, i, null)));
            try {
                const l = await dy(t, Promise.race(u));
                return Sr(t), l
            } finally {
                a()
            }
        };
        return (n, i) => sy(r(n, i))
    },
    py = e => {
        let {
            type: t,
            actionCreator: r,
            matcher: n,
            predicate: i,
            effect: a
        } = e;
        if (t) i = ot(t).match;
        else if (r) t = r.type, i = r.match;
        else if (n) i = n;
        else if (!i) throw new Error(Ze(21));
        return Ec(a), {
            predicate: i,
            type: t,
            effect: a
        }
    },
    hy = Vr(e => {
        const {
            type: t,
            predicate: r,
            effect: n
        } = py(e);
        return {
            id: rO(),
            effect: n,
            type: t,
            predicate: r,
            pending: new Set,
            unsubscribe: () => {
                throw new Error(Ze(22))
            }
        }
    }, {
        withTypes: () => hy
    }),
    bd = (e, t) => {
        const {
            type: r,
            effect: n,
            predicate: i
        } = py(t);
        return Array.from(e.values()).find(a => (typeof r == "string" ? a.type === r : a.predicate === i) && a.effect === n)
    },
    _l = e => {
        e.pending.forEach(t => {
            Ar(t, Il)
        })
    },
    bO = (e, t) => () => {
        for (const r of t.keys()) _l(r);
        e.clear()
    },
    xd = (e, t, r) => {
        try {
            e(t, r)
        } catch (n) {
            setTimeout(() => {
                throw n
            }, 0)
        }
    },
    my = Vr(ot(`${Ha}/add`), {
        withTypes: () => my
    }),
    xO = ot(`${Ha}/removeAll`),
    yy = Vr(ot(`${Ha}/remove`), {
        withTypes: () => yy
    }),
    wO = (...e) => {
        console.error(`${Ha}/error`, ...e)
    },
    ri = (e = {}) => {
        const t = new Map,
            r = new Map,
            n = p => {
                const h = r.get(p) ?? 0;
                r.set(p, h + 1)
            },
            i = p => {
                const h = r.get(p) ?? 1;
                h === 1 ? r.delete(p) : r.set(p, h - 1)
            },
            {
                extra: a,
                onError: o = wO
            } = e;
        Ec(o);
        const u = p => (p.unsubscribe = () => t.delete(p.id), t.set(p.id, p), h => {
                p.unsubscribe(), h ?.cancelActive && _l(p)
            }),
            l = p => {
                const h = bd(t, p) ?? hy(p);
                return u(h)
            };
        Vr(l, {
            withTypes: () => l
        });
        const s = p => {
            const h = bd(t, p);
            return h && (h.unsubscribe(), p.cancelActive && _l(h)), !!h
        };
        Vr(s, {
            withTypes: () => s
        });
        const c = async (p, h, m, y) => {
                const g = new AbortController,
                    b = gO(l, g.signal),
                    x = [];
                try {
                    p.pending.add(g), n(p), await Promise.resolve(p.effect(h, Vr({}, m, {
                        getOriginalState: y,
                        condition: (P, w) => b(P, w).then(Boolean),
                        take: b,
                        delay: vy(g.signal),
                        pause: ra(g.signal),
                        extra: a,
                        signal: g.signal,
                        fork: yO(g.signal, x),
                        unsubscribe: p.unsubscribe,
                        subscribe: () => {
                            t.set(p.id, p)
                        },
                        cancelActiveListeners: () => {
                            p.pending.forEach((P, w, O) => {
                                P !== g && (Ar(P, Il), O.delete(P))
                            })
                        },
                        cancel: () => {
                            Ar(g, Il), p.pending.delete(g)
                        },
                        throwIfCancelled: () => {
                            Sr(g.signal)
                        }
                    })))
                } catch (P) {
                    P instanceof Ua || xd(o, P, {
                        raisedBy: "effect"
                    })
                } finally {
                    await Promise.all(x), Ar(g, hO), i(p), p.pending.delete(g)
                }
            },
            f = bO(t, r);
        return {
            middleware: p => h => m => {
                if (!Ym(m)) return h(m);
                if (my.match(m)) return l(m.payload);
                if (xO.match(m)) {
                    f();
                    return
                }
                if (yy.match(m)) return s(m.payload);
                let y = p.getState();
                const g = () => {
                    if (y === gd) throw new Error(Ze(23));
                    return y
                };
                let b;
                try {
                    if (b = h(m), t.size > 0) {
                        const x = p.getState(),
                            P = Array.from(t.values());
                        for (const w of P) {
                            let O = !1;
                            try {
                                O = w.predicate(m, x, y)
                            } catch (S) {
                                O = !1, xd(o, S, {
                                    raisedBy: "predicate"
                                })
                            }
                            O && c(w, m, p, g)
                        }
                    }
                } finally {
                    y = gd
                }
                return b
            },
            startListening: l,
            stopListening: s,
            clearListeners: f
        }
    };

function Ze(e) {
    return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `
}
var PO = {
        layoutType: "horizontal",
        width: 0,
        height: 0,
        margin: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        },
        scale: 1
    },
    gy = Ge({
        name: "chartLayout",
        initialState: PO,
        reducers: {
            setLayout(e, t) {
                e.layoutType = t.payload
            },
            setChartSize(e, t) {
                e.width = t.payload.width, e.height = t.payload.height
            },
            setMargin(e, t) {
                var r, n, i, a;
                e.margin.top = (r = t.payload.top) !== null && r !== void 0 ? r : 0, e.margin.right = (n = t.payload.right) !== null && n !== void 0 ? n : 0, e.margin.bottom = (i = t.payload.bottom) !== null && i !== void 0 ? i : 0, e.margin.left = (a = t.payload.left) !== null && a !== void 0 ? a : 0
            },
            setScale(e, t) {
                e.scale = t.payload
            }
        }
    }),
    {
        setMargin: OO,
        setLayout: AO,
        setChartSize: SO,
        setScale: EO
    } = gy.actions,
    jO = gy.reducer;

function by(e, t, r) {
    return Array.isArray(e) && e && t + r !== 0 ? e.slice(t, r + 1) : e
}

function ae(e) {
    return Number.isFinite(e)
}

function Et(e) {
    return typeof e == "number" && e > 0 && Number.isFinite(e)
}

function wd(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function qr(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? wd(Object(r), !0).forEach(function(n) {
            IO(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : wd(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function IO(e, t, r) {
    return (t = _O(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function _O(e) {
    var t = kO(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function kO(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function H(e, t, r) {
    return X(e) || X(t) ? r : St(t) ? Cr(e, t, r) : typeof t == "function" ? t(e) : r
}
var CO = (e, t, r) => {
        if (t && r) {
            var {
                width: n,
                height: i
            } = r, {
                align: a,
                verticalAlign: o,
                layout: u
            } = t;
            if ((u === "vertical" || u === "horizontal" && o === "middle") && a !== "center" && D(e[a])) return qr(qr({}, e), {}, {
                [a]: e[a] + (n || 0)
            });
            if ((u === "horizontal" || u === "vertical" && a === "center") && o !== "middle" && D(e[o])) return qr(qr({}, e), {}, {
                [o]: e[o] + (i || 0)
            })
        }
        return e
    },
    yt = (e, t) => e === "horizontal" && t === "xAxis" || e === "vertical" && t === "yAxis" || e === "centric" && t === "angleAxis" || e === "radial" && t === "radiusAxis",
    xy = (e, t, r, n) => {
        if (n) return e.map(u => u.coordinate);
        var i, a, o = e.map(u => (u.coordinate === t && (i = !0), u.coordinate === r && (a = !0), u.coordinate));
        return i || o.push(t), a || o.push(r), o
    },
    wy = (e, t, r) => {
        if (!e) return null;
        var {
            duplicateDomain: n,
            type: i,
            range: a,
            scale: o,
            realScaleType: u,
            isCategorical: l,
            categoricalDomain: s,
            tickCount: c,
            ticks: f,
            niceTicks: v,
            axisType: p
        } = e;
        if (!o) return null;
        var h = u === "scaleBand" && o.bandwidth ? o.bandwidth() / 2 : 2,
            m = i === "category" && o.bandwidth ? o.bandwidth() / h : 0;
        if (m = p === "angleAxis" && a && a.length >= 2 ? _e(a[0] - a[1]) * 2 * m : m, f || v) {
            var y = (f || v || []).map((g, b) => {
                var x = n ? n.indexOf(g) : g;
                return {
                    coordinate: o(x) + m,
                    value: g,
                    offset: m,
                    index: b
                }
            });
            return y.filter(g => !at(g.coordinate))
        }
        return l && s ? s.map((g, b) => ({
            coordinate: o(g) + m,
            value: g,
            index: b,
            offset: m
        })) : o.ticks && c != null ? o.ticks(c).map((g, b) => ({
            coordinate: o(g) + m,
            value: g,
            offset: m,
            index: b
        })) : o.domain().map((g, b) => ({
            coordinate: o(g) + m,
            value: n ? n[g] : g,
            index: b,
            offset: m
        }))
    },
    Pd = 1e-4,
    TO = e => {
        var t = e.domain();
        if (!(!t || t.length <= 2)) {
            var r = t.length,
                n = e.range(),
                i = Math.min(n[0], n[1]) - Pd,
                a = Math.max(n[0], n[1]) + Pd,
                o = e(t[0]),
                u = e(t[r - 1]);
            (o < i || o > a || u < i || u > a) && e.domain([t[0], t[r - 1]])
        }
    },
    MO = (e, t) => {
        if (!t || t.length !== 2 || !D(t[0]) || !D(t[1])) return e;
        var r = Math.min(t[0], t[1]),
            n = Math.max(t[0], t[1]),
            i = [e[0], e[1]];
        return (!D(e[0]) || e[0] < r) && (i[0] = r), (!D(e[1]) || e[1] > n) && (i[1] = n), i[0] > n && (i[0] = n), i[1] < r && (i[1] = r), i
    },
    DO = e => {
        var t, r = e.length;
        if (!(r <= 0)) {
            var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
            if (!(n == null || n <= 0))
                for (var i = 0; i < n; ++i)
                    for (var a = 0, o = 0, u = 0; u < r; ++u) {
                        var l = e[u],
                            s = l ?.[i];
                        if (s != null) {
                            var c = s[1],
                                f = s[0],
                                v = at(c) ? f : c;
                            v >= 0 ? (s[0] = a, s[1] = a + v, a = c) : (s[0] = o, s[1] = o + v, o = c)
                        }
                    }
        }
    },
    NO = e => {
        var t, r = e.length;
        if (!(r <= 0)) {
            var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
            if (!(n == null || n <= 0))
                for (var i = 0; i < n; ++i)
                    for (var a = 0, o = 0; o < r; ++o) {
                        var u = e[o],
                            l = u ?.[i];
                        if (l != null) {
                            var s = at(l[1]) ? l[0] : l[1];
                            s >= 0 ? (l[0] = a, l[1] = a + s, a = l[1]) : (l[0] = 0, l[1] = 0)
                        }
                    }
        }
    },
    RO = {
        sign: DO,
        expand: iw,
        none: kr,
        silhouette: aw,
        wiggle: ow,
        positive: NO
    },
    $O = (e, t, r) => {
        var n, i = (n = RO[r]) !== null && n !== void 0 ? n : kr,
            a = nw().keys(t).value((u, l) => Number(H(u, l, 0))).order(bl).offset(i),
            o = a(e);
        return o.forEach((u, l) => {
            u.forEach((s, c) => {
                var f = H(e[c], t[l], 0);
                Array.isArray(f) && f.length === 2 && D(f[0]) && D(f[1]) && (s[0] = f[0], s[1] = f[1])
            })
        }), o
    };

function Py(e) {
    return e == null ? void 0 : String(e)
}

function Xr(e) {
    var {
        axis: t,
        ticks: r,
        bandSize: n,
        entry: i,
        index: a,
        dataKey: o
    } = e;
    if (t.type === "category") {
        if (!t.allowDuplicatedCategory && t.dataKey && !X(i[t.dataKey])) {
            var u = km(r, "value", i[t.dataKey]);
            if (u) return u.coordinate + n / 2
        }
        return r[a] ? r[a].coordinate + n / 2 : null
    }
    var l = H(i, X(o) ? t.dataKey : o);
    return X(l) ? null : t.scale(l)
}
var Od = e => {
        var {
            axis: t,
            ticks: r,
            offset: n,
            bandSize: i,
            entry: a,
            index: o
        } = e;
        if (t.type === "category") return r[o] ? r[o].coordinate + n : null;
        var u = H(a, t.dataKey, t.scale.domain()[o]);
        return X(u) ? null : t.scale(u) - i / 2 + n
    },
    LO = e => {
        var {
            numericAxis: t
        } = e, r = t.scale.domain();
        if (t.type === "number") {
            var n = Math.min(r[0], r[1]),
                i = Math.max(r[0], r[1]);
            return n <= 0 && i >= 0 ? 0 : i < 0 ? i : n
        }
        return r[0]
    },
    BO = e => {
        var t = e.flat(2).filter(D);
        return [Math.min(...t), Math.max(...t)]
    },
    zO = e => [e[0] === 1 / 0 ? 0 : e[0], e[1] === -1 / 0 ? 0 : e[1]],
    KO = (e, t, r) => {
        if (e != null) return zO(Object.keys(e).reduce((n, i) => {
            var a = e[i];
            if (!a) return n;
            var {
                stackedData: o
            } = a, u = o.reduce((l, s) => {
                var c = by(s, t, r),
                    f = BO(c);
                return !ae(f[0]) || !ae(f[1]) ? l : [Math.min(l[0], f[0]), Math.max(l[1], f[1])]
            }, [1 / 0, -1 / 0]);
            return [Math.min(u[0], n[0]), Math.max(u[1], n[1])]
        }, [1 / 0, -1 / 0]))
    },
    Ad = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
    Sd = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
    jt = (e, t, r) => {
        if (e && e.scale && e.scale.bandwidth) {
            var n = e.scale.bandwidth();
            if (!r || n > 0) return n
        }
        if (e && t && t.length >= 2) {
            for (var i = Ka(t, c => c.coordinate), a = 1 / 0, o = 1, u = i.length; o < u; o++) {
                var l = i[o],
                    s = i[o - 1];
                a = Math.min((l ?.coordinate || 0) - (s ?.coordinate || 0), a)
            }
            return a === 1 / 0 ? 0 : a
        }
        return r ? void 0 : 0
    };

function Ed(e) {
    var {
        tooltipEntrySettings: t,
        dataKey: r,
        payload: n,
        value: i,
        name: a
    } = e;
    return qr(qr({}, t), {}, {
        dataKey: r,
        payload: n,
        value: i,
        name: a
    })
}

function st(e, t) {
    if (e) return String(e);
    if (typeof t == "string") return t
}
var WO = (e, t) => {
        if (t === "horizontal") return e.chartX;
        if (t === "vertical") return e.chartY
    },
    FO = (e, t) => t === "centric" ? e.angle : e.radius,
    Vt = e => e.layout.width,
    Yt = e => e.layout.height,
    qO = e => e.layout.scale,
    Oy = e => e.layout.margin,
    Ga = A(e => e.cartesianAxis.xAxis, e => Object.values(e)),
    Va = A(e => e.cartesianAxis.yAxis, e => Object.values(e)),
    jc = "data-recharts-item-index",
    Ic = "data-recharts-item-id",
    ni = 60;

function jd(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Ci(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? jd(Object(r), !0).forEach(function(n) {
            UO(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jd(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function UO(e, t, r) {
    return (t = HO(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function HO(e) {
    var t = GO(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function GO(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var VO = e => e.brush.height;

function YO(e) {
    var t = Va(e);
    return t.reduce((r, n) => {
        if (n.orientation === "left" && !n.mirror && !n.hide) {
            var i = typeof n.width == "number" ? n.width : ni;
            return r + i
        }
        return r
    }, 0)
}

function XO(e) {
    var t = Va(e);
    return t.reduce((r, n) => {
        if (n.orientation === "right" && !n.mirror && !n.hide) {
            var i = typeof n.width == "number" ? n.width : ni;
            return r + i
        }
        return r
    }, 0)
}

function ZO(e) {
    var t = Ga(e);
    return t.reduce((r, n) => n.orientation === "top" && !n.mirror && !n.hide ? r + n.height : r, 0)
}

function JO(e) {
    var t = Ga(e);
    return t.reduce((r, n) => n.orientation === "bottom" && !n.mirror && !n.hide ? r + n.height : r, 0)
}
var Pe = A([Vt, Yt, Oy, VO, YO, XO, ZO, JO, Um, IP], (e, t, r, n, i, a, o, u, l, s) => {
        var c = {
                left: (r.left || 0) + i,
                right: (r.right || 0) + a
            },
            f = {
                top: (r.top || 0) + o,
                bottom: (r.bottom || 0) + u
            },
            v = Ci(Ci({}, f), c),
            p = v.bottom;
        v.bottom += n, v = CO(v, l, s);
        var h = e - v.left - v.right,
            m = t - v.top - v.bottom;
        return Ci(Ci({
            brushBottom: p
        }, v), {}, {
            width: Math.max(h, 0),
            height: Math.max(m, 0)
        })
    }),
    QO = A(Pe, e => ({
        x: e.left,
        y: e.top,
        width: e.width,
        height: e.height
    })),
    _c = A(Vt, Yt, (e, t) => ({
        x: 0,
        y: 0,
        width: e,
        height: t
    })),
    eA = d.createContext(null),
    he = () => d.useContext(eA) != null,
    Ya = e => e.brush,
    Xa = A([Ya, Pe, Oy], (e, t, r) => ({
        height: e.height,
        x: D(e.x) ? e.x : t.left,
        y: D(e.y) ? e.y : t.top + t.height + t.brushBottom - (r ?.bottom || 0),
        width: D(e.width) ? e.width : t.width
    })),
    _u = {},
    ku = {},
    Cu = {},
    Id;

function tA() {
    return Id || (Id = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r, n, {
            signal: i,
            edges: a
        } = {}) {
            let o, u = null;
            const l = a != null && a.includes("leading"),
                s = a == null || a.includes("trailing"),
                c = () => {
                    u !== null && (r.apply(o, u), o = void 0, u = null)
                },
                f = () => {
                    s && c(), m()
                };
            let v = null;
            const p = () => {
                    v != null && clearTimeout(v), v = setTimeout(() => {
                        v = null, f()
                    }, n)
                },
                h = () => {
                    v !== null && (clearTimeout(v), v = null)
                },
                m = () => {
                    h(), o = void 0, u = null
                },
                y = () => {
                    c()
                },
                g = function(...b) {
                    if (i ?.aborted) return;
                    o = this, u = b;
                    const x = v == null;
                    p(), l && x && c()
                };
            return g.schedule = p, g.cancel = m, g.flush = y, i ?.addEventListener("abort", m, {
                once: !0
            }), g
        }
        e.debounce = t
    })(Cu)), Cu
}
var _d;

function rA() {
    return _d || (_d = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = tA();

        function r(n, i = 0, a = {}) {
            typeof a != "object" && (a = {});
            const {
                leading: o = !1,
                trailing: u = !0,
                maxWait: l
            } = a, s = Array(2);
            o && (s[0] = "leading"), u && (s[1] = "trailing");
            let c, f = null;
            const v = t.debounce(function(...m) {
                    c = n.apply(this, m), f = null
                }, i, {
                    edges: s
                }),
                p = function(...m) {
                    return l != null && (f === null && (f = Date.now()), Date.now() - f >= l) ? (c = n.apply(this, m), f = Date.now(), v.cancel(), v.schedule(), c) : (v.apply(this, m), c)
                },
                h = () => (v.flush(), c);
            return p.cancel = v.cancel, p.flush = h, p
        }
        e.debounce = r
    })(ku)), ku
}
var kd;

function nA() {
    return kd || (kd = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = rA();

        function r(n, i = 0, a = {}) {
            const {
                leading: o = !0,
                trailing: u = !0
            } = a;
            return t.debounce(n, i, {
                leading: o,
                maxWait: i,
                trailing: u
            })
        }
        e.throttle = r
    })(_u)), _u
}
var Tu, Cd;

function iA() {
    return Cd || (Cd = 1, Tu = nA().throttle), Tu
}
var aA = iA();
const oA = _t(aA);
var na = function(t, r) {
        for (var n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), a = 2; a < n; a++) i[a - 2] = arguments[a];
        if (typeof console < "u" && console.warn && (r === void 0 && console.warn("LogUtils requires an error message argument"), !t))
            if (r === void 0) console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
            else {
                var o = 0;
                console.warn(r.replace(/%s/g, () => i[o++]))
            }
    },
    Ay = (e, t, r) => {
        var {
            width: n = "100%",
            height: i = "100%",
            aspect: a,
            maxHeight: o
        } = r, u = zt(n) ? e : Number(n), l = zt(i) ? t : Number(i);
        return a && a > 0 && (u ? l = u / a : l && (u = l * a), o && l != null && l > o && (l = o)), {
            calculatedWidth: u,
            calculatedHeight: l
        }
    },
    uA = {
        width: 0,
        height: 0,
        overflow: "visible"
    },
    lA = {
        width: 0,
        overflowX: "visible"
    },
    cA = {
        height: 0,
        overflowY: "visible"
    },
    sA = {},
    fA = e => {
        var {
            width: t,
            height: r
        } = e, n = zt(t), i = zt(r);
        return n && i ? uA : n ? lA : i ? cA : sA
    };

function dA(e) {
    var {
        width: t,
        height: r,
        aspect: n
    } = e, i = t, a = r;
    return i === void 0 && a === void 0 ? (i = "100%", a = "100%") : i === void 0 ? i = n && n > 0 ? void 0 : "100%" : a === void 0 && (a = n && n > 0 ? void 0 : "100%"), {
        width: i,
        height: a
    }
}

function kl() {
    return kl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, kl.apply(null, arguments)
}

function Td(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Md(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Td(Object(r), !0).forEach(function(n) {
            vA(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Td(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function vA(e, t, r) {
    return (t = pA(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function pA(e) {
    var t = hA(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function hA(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var Sy = d.createContext({
    width: -1,
    height: -1
});

function mA(e) {
    return Et(e.width) && Et(e.height)
}

function Ey(e) {
    var {
        children: t,
        width: r,
        height: n
    } = e, i = d.useMemo(() => ({
        width: r,
        height: n
    }), [r, n]);
    return mA(i) ? d.createElement(Sy.Provider, {
        value: i
    }, t) : null
}
var kc = () => d.useContext(Sy),
    yA = d.forwardRef((e, t) => {
        var {
            aspect: r,
            initialDimension: n = {
                width: -1,
                height: -1
            },
            width: i,
            height: a,
            minWidth: o = 0,
            minHeight: u,
            maxHeight: l,
            children: s,
            debounce: c = 0,
            id: f,
            className: v,
            onResize: p,
            style: h = {}
        } = e, m = d.useRef(null), y = d.useRef();
        y.current = p, d.useImperativeHandle(t, () => m.current);
        var [g, b] = d.useState({
            containerWidth: n.width,
            containerHeight: n.height
        }), x = d.useCallback((E, _) => {
            b(C => {
                var j = Math.round(E),
                    I = Math.round(_);
                return C.containerWidth === j && C.containerHeight === I ? C : {
                    containerWidth: j,
                    containerHeight: I
                }
            })
        }, []);
        d.useEffect(() => {
            if (m.current == null || typeof ResizeObserver > "u") return ei;
            var E = I => {
                var R, {
                    width: $,
                    height: B
                } = I[0].contentRect;
                x($, B), (R = y.current) === null || R === void 0 || R.call(y, $, B)
            };
            c > 0 && (E = oA(E, c, {
                trailing: !0,
                leading: !1
            }));
            var _ = new ResizeObserver(E),
                {
                    width: C,
                    height: j
                } = m.current.getBoundingClientRect();
            return x(C, j), _.observe(m.current), () => {
                _.disconnect()
            }
        }, [x, c]);
        var {
            containerWidth: P,
            containerHeight: w
        } = g;
        na(!r || r > 0, "The aspect(%s) must be greater than zero.", r);
        var {
            calculatedWidth: O,
            calculatedHeight: S
        } = Ay(P, w, {
            width: i,
            height: a,
            aspect: r,
            maxHeight: l
        });
        return na(O != null && O > 0 || S != null && S > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, O, S, i, a, o, u, r), d.createElement("div", {
            id: f ? "".concat(f) : void 0,
            className: z("recharts-responsive-container", v),
            style: Md(Md({}, h), {}, {
                width: i,
                height: a,
                minWidth: o,
                minHeight: u,
                maxHeight: l
            }),
            ref: m
        }, d.createElement("div", {
            style: fA({
                width: i,
                height: a
            })
        }, d.createElement(Ey, {
            width: O,
            height: S
        }, s)))
    }),
    Ez = d.forwardRef((e, t) => {
        var r = kc();
        if (Et(r.width) && Et(r.height)) return e.children;
        var {
            width: n,
            height: i
        } = dA({
            width: e.width,
            height: e.height,
            aspect: e.aspect
        }), {
            calculatedWidth: a,
            calculatedHeight: o
        } = Ay(void 0, void 0, {
            width: n,
            height: i,
            aspect: e.aspect,
            maxHeight: e.maxHeight
        });
        return D(a) && D(o) ? d.createElement(Ey, {
            width: a,
            height: o
        }, e.children) : d.createElement(yA, kl({}, e, {
            width: n,
            height: i,
            ref: t
        }))
    });

function jy(e) {
    if (e) return {
        x: e.x,
        y: e.y,
        upperWidth: "upperWidth" in e ? e.upperWidth : e.width,
        lowerWidth: "lowerWidth" in e ? e.lowerWidth : e.width,
        width: e.width,
        height: e.height
    }
}
var ii = () => {
        var e, t = he(),
            r = M(QO),
            n = M(Xa),
            i = (e = M(Ya)) === null || e === void 0 ? void 0 : e.padding;
        return !t || !n || !i ? r : {
            width: n.width - i.left - i.right,
            height: n.height - i.top - i.bottom,
            x: i.left,
            y: i.top
        }
    },
    gA = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        brushBottom: 0
    },
    Iy = () => {
        var e;
        return (e = M(Pe)) !== null && e !== void 0 ? e : gA
    },
    Cc = () => M(Vt),
    Tc = () => M(Yt),
    bA = () => M(e => e.layout.margin),
    K = e => e.layout.layoutType,
    cr = () => M(K),
    xA = () => {
        var e = cr();
        if (e === "horizontal" || e === "vertical") return e
    },
    wA = () => {
        var e = cr();
        return e !== void 0
    },
    Za = e => {
        var t = te(),
            r = he(),
            {
                width: n,
                height: i
            } = e,
            a = kc(),
            o = n,
            u = i;
        return a && (o = a.width > 0 ? a.width : n, u = a.height > 0 ? a.height : i), d.useEffect(() => {
            !r && Et(o) && Et(u) && t(SO({
                width: o,
                height: u
            }))
        }, [t, r, o, u]), null
    },
    PA = {
        settings: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "middle",
            itemSorter: "value"
        },
        size: {
            width: 0,
            height: 0
        },
        payload: []
    },
    _y = Ge({
        name: "legend",
        initialState: PA,
        reducers: {
            setLegendSize(e, t) {
                e.size.width = t.payload.width, e.size.height = t.payload.height
            },
            setLegendSettings(e, t) {
                e.settings.align = t.payload.align, e.settings.layout = t.payload.layout, e.settings.verticalAlign = t.payload.verticalAlign, e.settings.itemSorter = t.payload.itemSorter
            },
            addLegendPayload: {
                reducer(e, t) {
                    e.payload.push(t.payload)
                },
                prepare: se()
            },
            replaceLegendPayload: {
                reducer(e, t) {
                    var {
                        prev: r,
                        next: n
                    } = t.payload, i = ht(e).payload.indexOf(r);
                    i > -1 && (e.payload[i] = n)
                },
                prepare: se()
            },
            removeLegendPayload: {
                reducer(e, t) {
                    var r = ht(e).payload.indexOf(t.payload);
                    r > -1 && e.payload.splice(r, 1)
                },
                prepare: se()
            }
        }
    }),
    {
        setLegendSize: Dd,
        setLegendSettings: OA,
        addLegendPayload: ky,
        replaceLegendPayload: Cy,
        removeLegendPayload: Ty
    } = _y.actions,
    AA = _y.reducer,
    SA = ["contextPayload"];

function Cl() {
    return Cl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Cl.apply(null, arguments)
}

function Nd(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Zr(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Nd(Object(r), !0).forEach(function(n) {
            EA(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Nd(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function EA(e, t, r) {
    return (t = jA(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function jA(e) {
    var t = IA(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function IA(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function _A(e, t) {
    if (e == null) return {};
    var r, n, i = kA(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function kA(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function CA(e) {
    return e.value
}

function TA(e) {
    var {
        contextPayload: t
    } = e, r = _A(e, SA), n = Km(t, e.payloadUniqBy, CA), i = Zr(Zr({}, r), {}, {
        payload: n
    });
    return d.isValidElement(e.content) ? d.cloneElement(e.content, i) : typeof e.content == "function" ? d.createElement(e.content, i) : d.createElement(Lw, i)
}

function MA(e, t, r, n, i, a) {
    var {
        layout: o,
        align: u,
        verticalAlign: l
    } = t, s, c;
    return (!e || (e.left === void 0 || e.left === null) && (e.right === void 0 || e.right === null)) && (u === "center" && o === "vertical" ? s = {
        left: ((n || 0) - a.width) / 2
    } : s = u === "right" ? {
        right: r && r.right || 0
    } : {
        left: r && r.left || 0
    }), (!e || (e.top === void 0 || e.top === null) && (e.bottom === void 0 || e.bottom === null)) && (l === "middle" ? c = {
        top: ((i || 0) - a.height) / 2
    } : c = l === "bottom" ? {
        bottom: r && r.bottom || 0
    } : {
        top: r && r.top || 0
    }), Zr(Zr({}, s), c)
}

function DA(e) {
    var t = te();
    return d.useEffect(() => {
        t(OA(e))
    }, [t, e]), null
}

function NA(e) {
    var t = te();
    return d.useEffect(() => (t(Dd(e)), () => {
        t(Dd({
            width: 0,
            height: 0
        }))
    }), [t, e]), null
}

function RA(e, t, r, n) {
    return e === "vertical" && D(t) ? {
        height: t
    } : e === "horizontal" ? {
        width: r || n
    } : null
}
var $A = {
    align: "center",
    iconSize: 14,
    itemSorter: "value",
    layout: "horizontal",
    verticalAlign: "bottom"
};

function LA(e) {
    var t = ee(e, $A),
        r = CP(),
        n = jx(),
        i = bA(),
        {
            width: a,
            height: o,
            wrapperStyle: u,
            portal: l
        } = t,
        [s, c] = Hm([r]),
        f = Cc(),
        v = Tc();
    if (f == null || v == null) return null;
    var p = f - (i ?.left || 0) - (i ?.right || 0),
        h = RA(t.layout, o, a, p),
        m = l ? u : Zr(Zr({
            position: "absolute",
            width: h ?.width || a || "auto",
            height: h ?.height || o || "auto"
        }, MA(u, t, i, f, v, s)), u),
        y = l ?? n;
    if (y == null || r == null) return null;
    var g = d.createElement("div", {
        className: "recharts-legend-wrapper",
        style: m,
        ref: c
    }, d.createElement(DA, {
        layout: t.layout,
        align: t.align,
        verticalAlign: t.verticalAlign,
        itemSorter: t.itemSorter
    }), !l && d.createElement(NA, {
        width: s.width,
        height: s.height
    }), d.createElement(TA, Cl({}, t, h, {
        margin: i,
        chartWidth: f,
        chartHeight: v,
        contextPayload: r
    })));
    return cc.createPortal(g, y)
}
LA.displayName = "Legend";

function Tl() {
    return Tl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Tl.apply(null, arguments)
}

function Rd(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Mu(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Rd(Object(r), !0).forEach(function(n) {
            BA(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Rd(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function BA(e, t, r) {
    return (t = zA(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function zA(e) {
    var t = KA(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function KA(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function WA(e) {
    return Array.isArray(e) && St(e[0]) && St(e[1]) ? e.join(" ~ ") : e
}
var FA = e => {
        var {
            separator: t = " : ",
            contentStyle: r = {},
            itemStyle: n = {},
            labelStyle: i = {},
            payload: a,
            formatter: o,
            itemSorter: u,
            wrapperClassName: l,
            labelClassName: s,
            label: c,
            labelFormatter: f,
            accessibilityLayer: v = !1
        } = e, p = () => {
            if (a && a.length) {
                var w = {
                        padding: 0,
                        margin: 0
                    },
                    O = (u ? Ka(a, u) : a).map((S, E) => {
                        if (S.type === "none") return null;
                        var _ = S.formatter || o || WA,
                            {
                                value: C,
                                name: j
                            } = S,
                            I = C,
                            R = j;
                        if (_) {
                            var $ = _(C, j, S, E, a);
                            if (Array.isArray($))[I, R] = $;
                            else if ($ != null) I = $;
                            else return null
                        }
                        var B = Mu({
                            display: "block",
                            paddingTop: 4,
                            paddingBottom: 4,
                            color: S.color || "#000"
                        }, n);
                        return d.createElement("li", {
                            className: "recharts-tooltip-item",
                            key: "tooltip-item-".concat(E),
                            style: B
                        }, St(R) ? d.createElement("span", {
                            className: "recharts-tooltip-item-name"
                        }, R) : null, St(R) ? d.createElement("span", {
                            className: "recharts-tooltip-item-separator"
                        }, t) : null, d.createElement("span", {
                            className: "recharts-tooltip-item-value"
                        }, I), d.createElement("span", {
                            className: "recharts-tooltip-item-unit"
                        }, S.unit || ""))
                    });
                return d.createElement("ul", {
                    className: "recharts-tooltip-item-list",
                    style: w
                }, O)
            }
            return null
        }, h = Mu({
            margin: 0,
            padding: 10,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            whiteSpace: "nowrap"
        }, r), m = Mu({
            margin: 0
        }, i), y = !X(c), g = y ? c : "", b = z("recharts-default-tooltip", l), x = z("recharts-tooltip-label", s);
        y && f && a !== void 0 && a !== null && (g = f(c, a));
        var P = v ? {
            role: "status",
            "aria-live": "assertive"
        } : {};
        return d.createElement("div", Tl({
            className: b,
            style: h
        }, P), d.createElement("p", {
            className: x,
            style: m
        }, d.isValidElement(g) ? g : "".concat(g)), p())
    },
    On = "recharts-tooltip-wrapper",
    qA = {
        visibility: "hidden"
    };

function UA(e) {
    var {
        coordinate: t,
        translateX: r,
        translateY: n
    } = e;
    return z(On, {
        ["".concat(On, "-right")]: D(r) && t && D(t.x) && r >= t.x,
        ["".concat(On, "-left")]: D(r) && t && D(t.x) && r < t.x,
        ["".concat(On, "-bottom")]: D(n) && t && D(t.y) && n >= t.y,
        ["".concat(On, "-top")]: D(n) && t && D(t.y) && n < t.y
    })
}

function $d(e) {
    var {
        allowEscapeViewBox: t,
        coordinate: r,
        key: n,
        offsetTopLeft: i,
        position: a,
        reverseDirection: o,
        tooltipDimension: u,
        viewBox: l,
        viewBoxDimension: s
    } = e;
    if (a && D(a[n])) return a[n];
    var c = r[n] - u - (i > 0 ? i : 0),
        f = r[n] + i;
    if (t[n]) return o[n] ? c : f;
    var v = l[n];
    if (v == null) return 0;
    if (o[n]) {
        var p = c,
            h = v;
        return p < h ? Math.max(f, v) : Math.max(c, v)
    }
    if (s == null) return 0;
    var m = f + u,
        y = v + s;
    return m > y ? Math.max(c, v) : Math.max(f, v)
}

function HA(e) {
    var {
        translateX: t,
        translateY: r,
        useTranslate3d: n
    } = e;
    return {
        transform: n ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)") : "translate(".concat(t, "px, ").concat(r, "px)")
    }
}

function GA(e) {
    var {
        allowEscapeViewBox: t,
        coordinate: r,
        offsetTopLeft: n,
        position: i,
        reverseDirection: a,
        tooltipBox: o,
        useTranslate3d: u,
        viewBox: l
    } = e, s, c, f;
    return o.height > 0 && o.width > 0 && r ? (c = $d({
        allowEscapeViewBox: t,
        coordinate: r,
        key: "x",
        offsetTopLeft: n,
        position: i,
        reverseDirection: a,
        tooltipDimension: o.width,
        viewBox: l,
        viewBoxDimension: l.width
    }), f = $d({
        allowEscapeViewBox: t,
        coordinate: r,
        key: "y",
        offsetTopLeft: n,
        position: i,
        reverseDirection: a,
        tooltipDimension: o.height,
        viewBox: l,
        viewBoxDimension: l.height
    }), s = HA({
        translateX: c,
        translateY: f,
        useTranslate3d: u
    })) : s = qA, {
        cssProperties: s,
        cssClasses: UA({
            translateX: c,
            translateY: f,
            coordinate: r
        })
    }
}

function Ld(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Ti(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Ld(Object(r), !0).forEach(function(n) {
            Ml(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ld(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function Ml(e, t, r) {
    return (t = VA(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function VA(e) {
    var t = YA(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function YA(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
class XA extends d.PureComponent {
    constructor() {
        super(...arguments), Ml(this, "state", {
            dismissed: !1,
            dismissedAtCoordinate: {
                x: 0,
                y: 0
            }
        }), Ml(this, "handleKeyDown", t => {
            if (t.key === "Escape") {
                var r, n, i, a;
                this.setState({
                    dismissed: !0,
                    dismissedAtCoordinate: {
                        x: (r = (n = this.props.coordinate) === null || n === void 0 ? void 0 : n.x) !== null && r !== void 0 ? r : 0,
                        y: (i = (a = this.props.coordinate) === null || a === void 0 ? void 0 : a.y) !== null && i !== void 0 ? i : 0
                    }
                })
            }
        })
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown)
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown)
    }
    componentDidUpdate() {
        var t, r;
        this.state.dismissed && (((t = this.props.coordinate) === null || t === void 0 ? void 0 : t.x) !== this.state.dismissedAtCoordinate.x || ((r = this.props.coordinate) === null || r === void 0 ? void 0 : r.y) !== this.state.dismissedAtCoordinate.y) && (this.state.dismissed = !1)
    }
    render() {
        var {
            active: t,
            allowEscapeViewBox: r,
            animationDuration: n,
            animationEasing: i,
            children: a,
            coordinate: o,
            hasPayload: u,
            isAnimationActive: l,
            offset: s,
            position: c,
            reverseDirection: f,
            useTranslate3d: v,
            viewBox: p,
            wrapperStyle: h,
            lastBoundingBox: m,
            innerRef: y,
            hasPortalFromProps: g
        } = this.props, {
            cssClasses: b,
            cssProperties: x
        } = GA({
            allowEscapeViewBox: r,
            coordinate: o,
            offsetTopLeft: s,
            position: c,
            reverseDirection: f,
            tooltipBox: {
                height: m.height,
                width: m.width
            },
            useTranslate3d: v,
            viewBox: p
        }), P = g ? {} : Ti(Ti({
            transition: l && t ? "transform ".concat(n, "ms ").concat(i) : void 0
        }, x), {}, {
            pointerEvents: "none",
            visibility: !this.state.dismissed && t && u ? "visible" : "hidden",
            position: "absolute",
            top: 0,
            left: 0
        }), w = Ti(Ti({}, P), {}, {
            visibility: !this.state.dismissed && t && u ? "visible" : "hidden"
        }, h);
        return d.createElement("div", {
            xmlns: "http://www.w3.org/1999/xhtml",
            tabIndex: -1,
            className: b,
            style: w,
            ref: y
        }, a)
    }
}
var My = () => {
    var e;
    return (e = M(t => t.rootProps.accessibilityLayer)) !== null && e !== void 0 ? e : !0
};

function Dl() {
    return Dl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Dl.apply(null, arguments)
}

function Bd(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function zd(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Bd(Object(r), !0).forEach(function(n) {
            ZA(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Bd(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function ZA(e, t, r) {
    return (t = JA(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function JA(e) {
    var t = QA(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function QA(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var Kd = {
        curveBasisClosed: Hx,
        curveBasisOpen: Gx,
        curveBasis: Ux,
        curveBumpX: Cx,
        curveBumpY: Tx,
        curveLinearClosed: Vx,
        curveLinear: $a,
        curveMonotoneX: Yx,
        curveMonotoneY: Xx,
        curveNatural: Zx,
        curveStep: Jx,
        curveStepAfter: ew,
        curveStepBefore: Qx
    },
    ia = e => ae(e.x) && ae(e.y),
    Wd = e => e.base != null && ia(e.base) && ia(e),
    An = e => e.x,
    Sn = e => e.y,
    e1 = (e, t) => {
        if (typeof e == "function") return e;
        var r = "curve".concat(Qn(e));
        return (r === "curveMonotone" || r === "curveBump") && t ? Kd["".concat(r).concat(t === "vertical" ? "Y" : "X")] : Kd[r] || $a
    },
    t1 = e => {
        var {
            type: t = "linear",
            points: r = [],
            baseLine: n,
            layout: i,
            connectNulls: a = !1
        } = e, o = e1(t, i), u = a ? r.filter(ia) : r, l;
        if (Array.isArray(n)) {
            var s = r.map((p, h) => zd(zd({}, p), {}, {
                base: n[h]
            }));
            i === "vertical" ? l = Si().y(Sn).x1(An).x0(p => p.base.x) : l = Si().x(An).y1(Sn).y0(p => p.base.y);
            var c = l.defined(Wd).curve(o),
                f = a ? s.filter(Wd) : s;
            return c(f)
        }
        i === "vertical" && D(n) ? l = Si().y(Sn).x1(An).x0(n) : D(n) ? l = Si().x(An).y1(Sn).y0(n) : l = ym().x(An).y(Sn);
        var v = l.defined(ia).curve(o);
        return v(u)
    },
    Er = e => {
        var {
            className: t,
            points: r,
            path: n,
            pathRef: i
        } = e, a = cr();
        if ((!r || !r.length) && !n) return null;
        var o = {
                type: e.type,
                points: e.points,
                baseLine: e.baseLine,
                layout: e.layout || a,
                connectNulls: e.connectNulls
            },
            u = r && r.length ? t1(o) : n;
        return d.createElement("path", Dl({}, re(e), gc(e), {
            className: z("recharts-curve", t),
            d: u === null ? void 0 : u,
            ref: i
        }))
    },
    r1 = ["x", "y", "top", "left", "width", "height", "className"];

function Nl() {
    return Nl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Nl.apply(null, arguments)
}

function Fd(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function n1(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Fd(Object(r), !0).forEach(function(n) {
            i1(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Fd(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function i1(e, t, r) {
    return (t = a1(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function a1(e) {
    var t = o1(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function o1(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function u1(e, t) {
    if (e == null) return {};
    var r, n, i = l1(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function l1(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var c1 = (e, t, r, n, i, a) => "M".concat(e, ",").concat(i, "v").concat(n, "M").concat(a, ",").concat(t, "h").concat(r),
    s1 = e => {
        var {
            x: t = 0,
            y: r = 0,
            top: n = 0,
            left: i = 0,
            width: a = 0,
            height: o = 0,
            className: u
        } = e, l = u1(e, r1), s = n1({
            x: t,
            y: r,
            top: n,
            left: i,
            width: a,
            height: o
        }, l);
        return !D(t) || !D(r) || !D(a) || !D(o) || !D(n) || !D(i) ? null : d.createElement("path", Nl({}, ye(s), {
            className: z("recharts-cross", u),
            d: c1(t, r, a, o, n, i)
        }))
    };

function f1(e, t, r, n) {
    var i = n / 2;
    return {
        stroke: "none",
        fill: "#ccc",
        x: e === "horizontal" ? t.x - i : r.left + .5,
        y: e === "horizontal" ? r.top + .5 : t.y - i,
        width: e === "horizontal" ? n : r.width - 1,
        height: e === "horizontal" ? r.height - 1 : n
    }
}

function qd(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Ud(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? qd(Object(r), !0).forEach(function(n) {
            d1(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : qd(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function d1(e, t, r) {
    return (t = v1(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function v1(e) {
    var t = p1(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function p1(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var h1 = e => e.replace(/([A-Z])/g, t => "-".concat(t.toLowerCase())),
    Dy = (e, t, r) => e.map(n => "".concat(h1(n), " ").concat(t, "ms ").concat(r)).join(","),
    m1 = (e, t) => [Object.keys(e), Object.keys(t)].reduce((r, n) => r.filter(i => n.includes(i))),
    zn = (e, t) => Object.keys(t).reduce((r, n) => Ud(Ud({}, r), {}, {
        [n]: e(n, t[n])
    }), {});

function Hd(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function we(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Hd(Object(r), !0).forEach(function(n) {
            y1(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Hd(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function y1(e, t, r) {
    return (t = g1(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function g1(e) {
    var t = b1(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function b1(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var aa = (e, t, r) => e + (t - e) * r,
    Rl = e => {
        var {
            from: t,
            to: r
        } = e;
        return t !== r
    },
    Ny = (e, t, r) => {
        var n = zn((i, a) => {
            if (Rl(a)) {
                var [o, u] = e(a.from, a.to, a.velocity);
                return we(we({}, a), {}, {
                    from: o,
                    velocity: u
                })
            }
            return a
        }, t);
        return r < 1 ? zn((i, a) => Rl(a) && n[i] != null ? we(we({}, a), {}, {
            velocity: aa(a.velocity, n[i].velocity, r),
            from: aa(a.from, n[i].from, r)
        }) : a, t) : Ny(e, n, r - 1)
    };

function x1(e, t, r, n, i, a) {
    var o, u = n.reduce((v, p) => we(we({}, v), {}, {
            [p]: {
                from: e[p],
                velocity: 0,
                to: t[p]
            }
        }), {}),
        l = () => zn((v, p) => p.from, u),
        s = () => !Object.values(u).filter(Rl).length,
        c = null,
        f = v => {
            o || (o = v);
            var p = v - o,
                h = p / r.dt;
            u = Ny(r, u, h), i(we(we(we({}, e), t), l())), o = v, s() || (c = a.setTimeout(f))
        };
    return () => (c = a.setTimeout(f), () => {
        var v;
        (v = c) === null || v === void 0 || v()
    })
}

function w1(e, t, r, n, i, a, o) {
    var u = null,
        l = i.reduce((f, v) => {
            var p = e[v],
                h = t[v];
            return p == null || h == null ? f : we(we({}, f), {}, {
                [v]: [p, h]
            })
        }, {}),
        s, c = f => {
            s || (s = f);
            var v = (f - s) / n,
                p = zn((m, y) => aa(...y, r(v)), l);
            if (a(we(we(we({}, e), t), p)), v < 1) u = o.setTimeout(c);
            else {
                var h = zn((m, y) => aa(...y, r(1)), l);
                a(we(we(we({}, e), t), h))
            }
        };
    return () => (u = o.setTimeout(c), () => {
        var f;
        (f = u) === null || f === void 0 || f()
    })
}
const P1 = (e, t, r, n, i, a) => {
    var o = m1(e, t);
    return r == null ? () => (i(we(we({}, e), t)), () => {}) : r.isStepper === !0 ? x1(e, t, r, o, i, a) : w1(e, t, r, n, o, i, a)
};
var oa = 1e-4,
    Ry = (e, t) => [0, 3 * e, 3 * t - 6 * e, 3 * e - 3 * t + 1],
    $y = (e, t) => e.map((r, n) => r * t ** n).reduce((r, n) => r + n),
    Gd = (e, t) => r => {
        var n = Ry(e, t);
        return $y(n, r)
    },
    O1 = (e, t) => r => {
        var n = Ry(e, t),
            i = [...n.map((a, o) => a * o).slice(1), 0];
        return $y(i, r)
    },
    A1 = e => {
        var t, r = e.split("(");
        if (r.length !== 2 || r[0] !== "cubic-bezier") return null;
        var n = (t = r[1]) === null || t === void 0 || (t = t.split(")")[0]) === null || t === void 0 ? void 0 : t.split(",");
        if (n == null || n.length !== 4) return null;
        var i = n.map(a => parseFloat(a));
        return [i[0], i[1], i[2], i[3]]
    },
    S1 = function() {
        for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
        if (r.length === 1) switch (r[0]) {
            case "linear":
                return [0, 0, 1, 1];
            case "ease":
                return [.25, .1, .25, 1];
            case "ease-in":
                return [.42, 0, 1, 1];
            case "ease-out":
                return [.42, 0, .58, 1];
            case "ease-in-out":
                return [0, 0, .58, 1];
            default:
                {
                    var i = A1(r[0]);
                    if (i) return i
                }
        }
        return r.length === 4 ? r : [0, 0, 1, 1]
    },
    E1 = (e, t, r, n) => {
        var i = Gd(e, r),
            a = Gd(t, n),
            o = O1(e, r),
            u = s => s > 1 ? 1 : s < 0 ? 0 : s,
            l = s => {
                for (var c = s > 1 ? 1 : s, f = c, v = 0; v < 8; ++v) {
                    var p = i(f) - c,
                        h = o(f);
                    if (Math.abs(p - c) < oa || h < oa) return a(f);
                    f = u(f - p / h)
                }
                return a(f)
            };
        return l.isStepper = !1, l
    },
    Vd = function() {
        return E1(...S1(...arguments))
    },
    j1 = function() {
        var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
            {
                stiff: r = 100,
                damping: n = 8,
                dt: i = 17
            } = t,
            a = (o, u, l) => {
                var s = -(o - u) * r,
                    c = l * n,
                    f = l + (s - c) * i / 1e3,
                    v = l * i / 1e3 + o;
                return Math.abs(v - u) < oa && Math.abs(f) < oa ? [u, 0] : [v, f]
            };
        return a.isStepper = !0, a.dt = i, a
    },
    I1 = e => {
        if (typeof e == "string") switch (e) {
            case "ease":
            case "ease-in-out":
            case "ease-out":
            case "ease-in":
            case "linear":
                return Vd(e);
            case "spring":
                return j1();
            default:
                if (e.split("(")[0] === "cubic-bezier") return Vd(e)
        }
        return typeof e == "function" ? e : null
    };

function _1(e) {
    var t, r = () => null,
        n = !1,
        i = null,
        a = o => {
            if (!n) {
                if (Array.isArray(o)) {
                    if (!o.length) return;
                    var u = o,
                        [l, ...s] = u;
                    if (typeof l == "number") {
                        i = e.setTimeout(a.bind(null, s), l);
                        return
                    }
                    a(l), i = e.setTimeout(a.bind(null, s));
                    return
                }
                typeof o == "string" && (t = o, r(t)), typeof o == "object" && (t = o, r(t)), typeof o == "function" && o()
            }
        };
    return {
        stop: () => {
            n = !0
        },
        start: o => {
            n = !1, i && (i(), i = null), a(o)
        },
        subscribe: o => (r = o, () => {
            r = () => null
        }),
        getTimeoutController: () => e
    }
}
class k1 {
    setTimeout(t) {
        var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
            n = performance.now(),
            i = null,
            a = o => {
                o - n >= r ? t(o) : typeof requestAnimationFrame == "function" && (i = requestAnimationFrame(a))
            };
        return i = requestAnimationFrame(a), () => {
            i != null && cancelAnimationFrame(i)
        }
    }
}

function C1() {
    return _1(new k1)
}
var T1 = d.createContext(C1);

function M1(e, t) {
    var r = d.useContext(T1);
    return d.useMemo(() => t ?? r(e), [e, t, r])
}
var D1 = () => !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout),
    ai = {
        isSsr: D1()
    },
    N1 = {
        begin: 0,
        duration: 1e3,
        easing: "ease",
        isActive: !0,
        canBegin: !0,
        onAnimationEnd: () => {},
        onAnimationStart: () => {}
    },
    Yd = {
        t: 0
    },
    Du = {
        t: 1
    };

function sr(e) {
    var t = ee(e, N1),
        {
            isActive: r,
            canBegin: n,
            duration: i,
            easing: a,
            begin: o,
            onAnimationEnd: u,
            onAnimationStart: l,
            children: s
        } = t,
        c = r === "auto" ? !ai.isSsr : r,
        f = M1(t.animationId, t.animationManager),
        [v, p] = d.useState(c ? Yd : Du),
        h = d.useRef(null);
    return d.useEffect(() => {
        c || p(Du)
    }, [c]), d.useEffect(() => {
        if (!c || !n) return ei;
        var m = P1(Yd, Du, I1(a), i, p, f.getTimeoutController()),
            y = () => {
                h.current = m()
            };
        return f.start([l, o, y, i, u]), () => {
            f.stop(), h.current && h.current(), u()
        }
    }, [c, n, i, a, o, l, u, f]), s(v.t)
}

function fr(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "animation-",
        r = d.useRef(Rn(t)),
        n = d.useRef(e);
    return n.current !== e && (r.current = Rn(t), n.current = e), r.current
}
var R1 = ["radius"],
    $1 = ["radius"],
    Xd, Zd, Jd, Qd, ev, tv, rv, nv, iv, av;

function ov(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function uv(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? ov(Object(r), !0).forEach(function(n) {
            L1(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ov(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function L1(e, t, r) {
    return (t = B1(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function B1(e) {
    var t = z1(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function z1(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function ua() {
    return ua = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, ua.apply(null, arguments)
}

function lv(e, t) {
    if (e == null) return {};
    var r, n, i = K1(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function K1(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function gt(e, t) {
    return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
        raw: {
            value: Object.freeze(t)
        }
    }))
}
var cv = (e, t, r, n, i) => {
        var a = ir(r),
            o = ir(n),
            u = Math.min(Math.abs(a) / 2, Math.abs(o) / 2),
            l = o >= 0 ? 1 : -1,
            s = a >= 0 ? 1 : -1,
            c = o >= 0 && a >= 0 || o < 0 && a < 0 ? 1 : 0,
            f;
        if (u > 0 && i instanceof Array) {
            for (var v = [0, 0, 0, 0], p = 0, h = 4; p < h; p++) v[p] = i[p] > u ? u : i[p];
            f = de(Xd || (Xd = gt(["M", ",", ""])), e, t + l * v[0]), v[0] > 0 && (f += de(Zd || (Zd = gt(["A ", ",", ",0,0,", ",", ",", ""])), v[0], v[0], c, e + s * v[0], t)), f += de(Jd || (Jd = gt(["L ", ",", ""])), e + r - s * v[1], t), v[1] > 0 && (f += de(Qd || (Qd = gt(["A ", ",", ",0,0,", `,
        `, ",", ""])), v[1], v[1], c, e + r, t + l * v[1])), f += de(ev || (ev = gt(["L ", ",", ""])), e + r, t + n - l * v[2]), v[2] > 0 && (f += de(tv || (tv = gt(["A ", ",", ",0,0,", `,
        `, ",", ""])), v[2], v[2], c, e + r - s * v[2], t + n)), f += de(rv || (rv = gt(["L ", ",", ""])), e + s * v[3], t + n), v[3] > 0 && (f += de(nv || (nv = gt(["A ", ",", ",0,0,", `,
        `, ",", ""])), v[3], v[3], c, e, t + n - l * v[3])), f += "Z"
        } else if (u > 0 && i === +i && i > 0) {
            var m = Math.min(u, i);
            f = de(iv || (iv = gt(["M ", ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", " Z"])), e, t + l * m, m, m, c, e + s * m, t, e + r - s * m, t, m, m, c, e + r, t + l * m, e + r, t + n - l * m, m, m, c, e + r - s * m, t + n, e + s * m, t + n, m, m, c, e, t + n - l * m)
        } else f = de(av || (av = gt(["M ", ",", " h ", " v ", " h ", " Z"])), e, t, r, n, -r);
        return f
    },
    sv = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        radius: 0,
        isAnimationActive: !1,
        isUpdateAnimationActive: !1,
        animationBegin: 0,
        animationDuration: 1500,
        animationEasing: "ease"
    },
    Ly = e => {
        var t = ee(e, sv),
            r = d.useRef(null),
            [n, i] = d.useState(-1);
        d.useEffect(() => {
            if (r.current && r.current.getTotalLength) try {
                var W = r.current.getTotalLength();
                W && i(W)
            } catch {}
        }, []);
        var {
            x: a,
            y: o,
            width: u,
            height: l,
            radius: s,
            className: c
        } = t, {
            animationEasing: f,
            animationDuration: v,
            animationBegin: p,
            isAnimationActive: h,
            isUpdateAnimationActive: m
        } = t, y = d.useRef(u), g = d.useRef(l), b = d.useRef(a), x = d.useRef(o), P = d.useMemo(() => ({
            x: a,
            y: o,
            width: u,
            height: l,
            radius: s
        }), [a, o, u, l, s]), w = fr(P, "rectangle-");
        if (a !== +a || o !== +o || u !== +u || l !== +l || u === 0 || l === 0) return null;
        var O = z("recharts-rectangle", c);
        if (!m) {
            var S = ye(t),
                {
                    radius: E
                } = S,
                _ = lv(S, R1);
            return d.createElement("path", ua({}, _, {
                x: ir(a),
                y: ir(o),
                width: ir(u),
                height: ir(l),
                radius: typeof s == "number" ? s : void 0,
                className: O,
                d: cv(a, o, u, l, s)
            }))
        }
        var C = y.current,
            j = g.current,
            I = b.current,
            R = x.current,
            $ = "0px ".concat(n === -1 ? 1 : n, "px"),
            B = "".concat(n, "px 0px"),
            q = Dy(["strokeDasharray"], v, typeof f == "string" ? f : sv.animationEasing);
        return d.createElement(sr, {
            animationId: w,
            key: w,
            canBegin: n > 0,
            duration: v,
            easing: f,
            isActive: m,
            begin: p
        }, W => {
            var V = F(C, u, W),
                L = F(j, l, W),
                Me = F(I, a, W),
                Le = F(R, o, W);
            r.current && (y.current = V, g.current = L, b.current = Me, x.current = Le);
            var De;
            h ? W > 0 ? De = {
                transition: q,
                strokeDasharray: B
            } : De = {
                strokeDasharray: $
            } : De = {
                strokeDasharray: B
            };
            var Tt = ye(t),
                {
                    radius: Qe
                } = Tt,
                hr = lv(Tt, $1);
            return d.createElement("path", ua({}, hr, {
                radius: typeof s == "number" ? s : void 0,
                className: O,
                d: cv(Me, Le, V, L, s),
                ref: r,
                style: uv(uv({}, De), t.style)
            }))
        })
    };

function fv(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function dv(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? fv(Object(r), !0).forEach(function(n) {
            W1(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : fv(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function W1(e, t, r) {
    return (t = F1(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function F1(e) {
    var t = q1(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function q1(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var la = Math.PI / 180,
    ca = e => e * Math.PI / 180,
    U1 = e => e * 180 / Math.PI,
    J = (e, t, r, n) => ({
        x: e + Math.cos(-la * n) * r,
        y: t + Math.sin(-la * n) * r
    }),
    By = function(t, r) {
        var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
        return Math.min(Math.abs(t - (n.left || 0) - (n.right || 0)), Math.abs(r - (n.top || 0) - (n.bottom || 0))) / 2
    },
    H1 = (e, t) => {
        var {
            x: r,
            y: n
        } = e, {
            x: i,
            y: a
        } = t;
        return Math.sqrt((r - i) ** 2 + (n - a) ** 2)
    },
    G1 = (e, t) => {
        var {
            x: r,
            y: n
        } = e, {
            cx: i,
            cy: a
        } = t, o = H1({
            x: r,
            y: n
        }, {
            x: i,
            y: a
        });
        if (o <= 0) return {
            radius: o,
            angle: 0
        };
        var u = (r - i) / o,
            l = Math.acos(u);
        return n > a && (l = 2 * Math.PI - l), {
            radius: o,
            angle: U1(l),
            angleInRadian: l
        }
    },
    V1 = e => {
        var {
            startAngle: t,
            endAngle: r
        } = e, n = Math.floor(t / 360), i = Math.floor(r / 360), a = Math.min(n, i);
        return {
            startAngle: t - a * 360,
            endAngle: r - a * 360
        }
    },
    Y1 = (e, t) => {
        var {
            startAngle: r,
            endAngle: n
        } = t, i = Math.floor(r / 360), a = Math.floor(n / 360), o = Math.min(i, a);
        return e + o * 360
    },
    X1 = (e, t) => {
        var {
            chartX: r,
            chartY: n
        } = e, {
            radius: i,
            angle: a
        } = G1({
            x: r,
            y: n
        }, t), {
            innerRadius: o,
            outerRadius: u
        } = t;
        if (i < o || i > u || i === 0) return null;
        var {
            startAngle: l,
            endAngle: s
        } = V1(t), c = a, f;
        if (l <= s) {
            for (; c > s;) c -= 360;
            for (; c < l;) c += 360;
            f = c >= l && c <= s
        } else {
            for (; c > l;) c -= 360;
            for (; c < s;) c += 360;
            f = c >= s && c <= l
        }
        return f ? dv(dv({}, t), {}, {
            radius: i,
            angle: Y1(c, t)
        }) : null
    },
    zy = e => !d.isValidElement(e) && typeof e != "function" && typeof e != "boolean" && e != null ? e.className : "";

function Ky(e) {
    var {
        cx: t,
        cy: r,
        radius: n,
        startAngle: i,
        endAngle: a
    } = e, o = J(t, r, n, i), u = J(t, r, n, a);
    return {
        points: [o, u],
        cx: t,
        cy: r,
        radius: n,
        startAngle: i,
        endAngle: a
    }
}
var vv, pv, hv, mv, yv, gv, bv;

function $l() {
    return $l = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, $l.apply(null, arguments)
}

function xr(e, t) {
    return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
        raw: {
            value: Object.freeze(t)
        }
    }))
}
var Z1 = (e, t) => {
        var r = _e(t - e),
            n = Math.min(Math.abs(t - e), 359.999);
        return r * n
    },
    Mi = e => {
        var {
            cx: t,
            cy: r,
            radius: n,
            angle: i,
            sign: a,
            isExternal: o,
            cornerRadius: u,
            cornerIsExternal: l
        } = e, s = u * (o ? 1 : -1) + n, c = Math.asin(u / s) / la, f = l ? i : i + a * c, v = J(t, r, s, f), p = J(t, r, n, f), h = l ? i - a * c : i, m = J(t, r, s * Math.cos(c * la), h);
        return {
            center: v,
            circleTangency: p,
            lineTangency: m,
            theta: c
        }
    },
    Wy = e => {
        var {
            cx: t,
            cy: r,
            innerRadius: n,
            outerRadius: i,
            startAngle: a,
            endAngle: o
        } = e, u = Z1(a, o), l = a + u, s = J(t, r, i, a), c = J(t, r, i, l), f = de(vv || (vv = xr(["M ", ",", `
    A `, ",", `,0,
    `, ",", `,
    `, ",", `
  `])), s.x, s.y, i, i, +(Math.abs(u) > 180), +(a > l), c.x, c.y);
        if (n > 0) {
            var v = J(t, r, n, a),
                p = J(t, r, n, l);
            f += de(pv || (pv = xr(["L ", ",", `
            A `, ",", `,0,
            `, ",", `,
            `, ",", " Z"])), p.x, p.y, n, n, +(Math.abs(u) > 180), +(a <= l), v.x, v.y)
        } else f += de(hv || (hv = xr(["L ", ",", " Z"])), t, r);
        return f
    },
    J1 = e => {
        var {
            cx: t,
            cy: r,
            innerRadius: n,
            outerRadius: i,
            cornerRadius: a,
            forceCornerRadius: o,
            cornerIsExternal: u,
            startAngle: l,
            endAngle: s
        } = e, c = _e(s - l), {
            circleTangency: f,
            lineTangency: v,
            theta: p
        } = Mi({
            cx: t,
            cy: r,
            radius: i,
            angle: l,
            sign: c,
            cornerRadius: a,
            cornerIsExternal: u
        }), {
            circleTangency: h,
            lineTangency: m,
            theta: y
        } = Mi({
            cx: t,
            cy: r,
            radius: i,
            angle: s,
            sign: -c,
            cornerRadius: a,
            cornerIsExternal: u
        }), g = u ? Math.abs(l - s) : Math.abs(l - s) - p - y;
        if (g < 0) return o ? de(mv || (mv = xr(["M ", ",", `
        a`, ",", ",0,0,1,", `,0
        a`, ",", ",0,0,1,", `,0
      `])), v.x, v.y, a, a, a * 2, a, a, -a * 2) : Wy({
            cx: t,
            cy: r,
            innerRadius: n,
            outerRadius: i,
            startAngle: l,
            endAngle: s
        });
        var b = de(yv || (yv = xr(["M ", ",", `
    A`, ",", ",0,0,", ",", ",", `
    A`, ",", ",0,", ",", ",", ",", `
    A`, ",", ",0,0,", ",", ",", `
  `])), v.x, v.y, a, a, +(c < 0), f.x, f.y, i, i, +(g > 180), +(c < 0), h.x, h.y, a, a, +(c < 0), m.x, m.y);
        if (n > 0) {
            var {
                circleTangency: x,
                lineTangency: P,
                theta: w
            } = Mi({
                cx: t,
                cy: r,
                radius: n,
                angle: l,
                sign: c,
                isExternal: !0,
                cornerRadius: a,
                cornerIsExternal: u
            }), {
                circleTangency: O,
                lineTangency: S,
                theta: E
            } = Mi({
                cx: t,
                cy: r,
                radius: n,
                angle: s,
                sign: -c,
                isExternal: !0,
                cornerRadius: a,
                cornerIsExternal: u
            }), _ = u ? Math.abs(l - s) : Math.abs(l - s) - w - E;
            if (_ < 0 && a === 0) return "".concat(b, "L").concat(t, ",").concat(r, "Z");
            b += de(gv || (gv = xr(["L", ",", `
      A`, ",", ",0,0,", ",", ",", `
      A`, ",", ",0,", ",", ",", ",", `
      A`, ",", ",0,0,", ",", ",", "Z"])), S.x, S.y, a, a, +(c < 0), O.x, O.y, n, n, +(_ > 180), +(c > 0), x.x, x.y, a, a, +(c < 0), P.x, P.y)
        } else b += de(bv || (bv = xr(["L", ",", "Z"])), t, r);
        return b
    },
    Q1 = {
        cx: 0,
        cy: 0,
        innerRadius: 0,
        outerRadius: 0,
        startAngle: 0,
        endAngle: 0,
        cornerRadius: 0,
        forceCornerRadius: !1,
        cornerIsExternal: !1
    },
    Fy = e => {
        var t = ee(e, Q1),
            {
                cx: r,
                cy: n,
                innerRadius: i,
                outerRadius: a,
                cornerRadius: o,
                forceCornerRadius: u,
                cornerIsExternal: l,
                startAngle: s,
                endAngle: c,
                className: f
            } = t;
        if (a < i || s === c) return null;
        var v = z("recharts-sector", f),
            p = a - i,
            h = $e(o, p, 0, !0),
            m;
        return h > 0 && Math.abs(s - c) < 360 ? m = J1({
            cx: r,
            cy: n,
            innerRadius: i,
            outerRadius: a,
            cornerRadius: Math.min(h, p / 2),
            forceCornerRadius: u,
            cornerIsExternal: l,
            startAngle: s,
            endAngle: c
        }) : m = Wy({
            cx: r,
            cy: n,
            innerRadius: i,
            outerRadius: a,
            startAngle: s,
            endAngle: c
        }), d.createElement("path", $l({}, ye(t), {
            className: v,
            d: m
        }))
    };

function eS(e, t, r) {
    if (e === "horizontal") return [{
        x: t.x,
        y: r.top
    }, {
        x: t.x,
        y: r.top + r.height
    }];
    if (e === "vertical") return [{
        x: r.left,
        y: t.y
    }, {
        x: r.left + r.width,
        y: t.y
    }];
    if (Tm(t)) {
        if (e === "centric") {
            var {
                cx: n,
                cy: i,
                innerRadius: a,
                outerRadius: o,
                angle: u
            } = t, l = J(n, i, a, u), s = J(n, i, o, u);
            return [{
                x: l.x,
                y: l.y
            }, {
                x: s.x,
                y: s.y
            }]
        }
        return Ky(t)
    }
}
var Nu = {},
    Ru = {},
    $u = {},
    xv;

function tS() {
    return xv || (xv = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = Fm();

        function r(n) {
            return t.isSymbol(n) ? NaN : Number(n)
        }
        e.toNumber = r
    })($u)), $u
}
var wv;

function rS() {
    return wv || (wv = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = tS();

        function r(n) {
            return n ? (n = t.toNumber(n), n === 1 / 0 || n === -1 / 0 ? (n < 0 ? -1 : 1) * Number.MAX_VALUE : n === n ? n : 0) : n === 0 ? n : 0
        }
        e.toFinite = r
    })(Ru)), Ru
}
var Pv;

function nS() {
    return Pv || (Pv = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = qm(),
            r = rS();

        function n(i, a, o) {
            o && typeof o != "number" && t.isIterateeCall(i, a, o) && (a = o = void 0), i = r.toFinite(i), a === void 0 ? (a = i, i = 0) : a = r.toFinite(a), o = o === void 0 ? i < a ? 1 : -1 : r.toFinite(o);
            const u = Math.max(Math.ceil((a - i) / (o || 1)), 0),
                l = new Array(u);
            for (let s = 0; s < u; s++) l[s] = i, i += o;
            return l
        }
        e.range = n
    })(Nu)), Nu
}
var Lu, Ov;

function iS() {
    return Ov || (Ov = 1, Lu = nS().range), Lu
}
var aS = iS();
const qy = _t(aS);

function ar(e, t) {
    return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN
}

function oS(e, t) {
    return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN
}

function Mc(e) {
    let t, r, n;
    e.length !== 2 ? (t = ar, r = (u, l) => ar(e(u), l), n = (u, l) => e(u) - l) : (t = e === ar || e === oS ? e : uS, r = e, n = e);

    function i(u, l, s = 0, c = u.length) {
        if (s < c) {
            if (t(l, l) !== 0) return c;
            do {
                const f = s + c >>> 1;
                r(u[f], l) < 0 ? s = f + 1 : c = f
            } while (s < c)
        }
        return s
    }

    function a(u, l, s = 0, c = u.length) {
        if (s < c) {
            if (t(l, l) !== 0) return c;
            do {
                const f = s + c >>> 1;
                r(u[f], l) <= 0 ? s = f + 1 : c = f
            } while (s < c)
        }
        return s
    }

    function o(u, l, s = 0, c = u.length) {
        const f = i(u, l, s, c - 1);
        return f > s && n(u[f - 1], l) > -n(u[f], l) ? f - 1 : f
    }
    return {
        left: i,
        center: o,
        right: a
    }
}

function uS() {
    return 0
}

function Uy(e) {
    return e === null ? NaN : +e
}

function* lS(e, t) {
    for (let r of e) r != null && (r = +r) >= r && (yield r)
}
const cS = Mc(ar),
    oi = cS.right;
Mc(Uy).center;
class Av extends Map {
    constructor(t, r = dS) {
        if (super(), Object.defineProperties(this, {
                _intern: {
                    value: new Map
                },
                _key: {
                    value: r
                }
            }), t != null)
            for (const [n, i] of t) this.set(n, i)
    }
    get(t) {
        return super.get(Sv(this, t))
    }
    has(t) {
        return super.has(Sv(this, t))
    }
    set(t, r) {
        return super.set(sS(this, t), r)
    }
    delete(t) {
        return super.delete(fS(this, t))
    }
}

function Sv({
    _intern: e,
    _key: t
}, r) {
    const n = t(r);
    return e.has(n) ? e.get(n) : r
}

function sS({
    _intern: e,
    _key: t
}, r) {
    const n = t(r);
    return e.has(n) ? e.get(n) : (e.set(n, r), r)
}

function fS({
    _intern: e,
    _key: t
}, r) {
    const n = t(r);
    return e.has(n) && (r = e.get(n), e.delete(n)), r
}

function dS(e) {
    return e !== null && typeof e == "object" ? e.valueOf() : e
}

function vS(e = ar) {
    if (e === ar) return Hy;
    if (typeof e != "function") throw new TypeError("compare is not a function");
    return (t, r) => {
        const n = e(t, r);
        return n || n === 0 ? n : (e(r, r) === 0) - (e(t, t) === 0)
    }
}

function Hy(e, t) {
    return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0)
}
const pS = Math.sqrt(50),
    hS = Math.sqrt(10),
    mS = Math.sqrt(2);

function sa(e, t, r) {
    const n = (t - e) / Math.max(0, r),
        i = Math.floor(Math.log10(n)),
        a = n / Math.pow(10, i),
        o = a >= pS ? 10 : a >= hS ? 5 : a >= mS ? 2 : 1;
    let u, l, s;
    return i < 0 ? (s = Math.pow(10, -i) / o, u = Math.round(e * s), l = Math.round(t * s), u / s < e && ++u, l / s > t && --l, s = -s) : (s = Math.pow(10, i) * o, u = Math.round(e / s), l = Math.round(t / s), u * s < e && ++u, l * s > t && --l), l < u && .5 <= r && r < 2 ? sa(e, t, r * 2) : [u, l, s]
}

function Ll(e, t, r) {
    if (t = +t, e = +e, r = +r, !(r > 0)) return [];
    if (e === t) return [e];
    const n = t < e,
        [i, a, o] = n ? sa(t, e, r) : sa(e, t, r);
    if (!(a >= i)) return [];
    const u = a - i + 1,
        l = new Array(u);
    if (n)
        if (o < 0)
            for (let s = 0; s < u; ++s) l[s] = (a - s) / -o;
        else
            for (let s = 0; s < u; ++s) l[s] = (a - s) * o;
    else if (o < 0)
        for (let s = 0; s < u; ++s) l[s] = (i + s) / -o;
    else
        for (let s = 0; s < u; ++s) l[s] = (i + s) * o;
    return l
}

function Bl(e, t, r) {
    return t = +t, e = +e, r = +r, sa(e, t, r)[2]
}

function zl(e, t, r) {
    t = +t, e = +e, r = +r;
    const n = t < e,
        i = n ? Bl(t, e, r) : Bl(e, t, r);
    return (n ? -1 : 1) * (i < 0 ? 1 / -i : i)
}

function Ev(e, t) {
    let r;
    for (const n of e) n != null && (r < n || r === void 0 && n >= n) && (r = n);
    return r
}

function jv(e, t) {
    let r;
    for (const n of e) n != null && (r > n || r === void 0 && n >= n) && (r = n);
    return r
}

function Gy(e, t, r = 0, n = 1 / 0, i) {
    if (t = Math.floor(t), r = Math.floor(Math.max(0, r)), n = Math.floor(Math.min(e.length - 1, n)), !(r <= t && t <= n)) return e;
    for (i = i === void 0 ? Hy : vS(i); n > r;) {
        if (n - r > 600) {
            const l = n - r + 1,
                s = t - r + 1,
                c = Math.log(l),
                f = .5 * Math.exp(2 * c / 3),
                v = .5 * Math.sqrt(c * f * (l - f) / l) * (s - l / 2 < 0 ? -1 : 1),
                p = Math.max(r, Math.floor(t - s * f / l + v)),
                h = Math.min(n, Math.floor(t + (l - s) * f / l + v));
            Gy(e, t, p, h, i)
        }
        const a = e[t];
        let o = r,
            u = n;
        for (En(e, r, t), i(e[n], a) > 0 && En(e, r, n); o < u;) {
            for (En(e, o, u), ++o, --u; i(e[o], a) < 0;) ++o;
            for (; i(e[u], a) > 0;) --u
        }
        i(e[r], a) === 0 ? En(e, r, u) : (++u, En(e, u, n)), u <= t && (r = u + 1), t <= u && (n = u - 1)
    }
    return e
}

function En(e, t, r) {
    const n = e[t];
    e[t] = e[r], e[r] = n
}

function yS(e, t, r) {
    if (e = Float64Array.from(lS(e)), !(!(n = e.length) || isNaN(t = +t))) {
        if (t <= 0 || n < 2) return jv(e);
        if (t >= 1) return Ev(e);
        var n, i = (n - 1) * t,
            a = Math.floor(i),
            o = Ev(Gy(e, a).subarray(0, a + 1)),
            u = jv(e.subarray(a + 1));
        return o + (u - o) * (i - a)
    }
}

function gS(e, t, r = Uy) {
    if (!(!(n = e.length) || isNaN(t = +t))) {
        if (t <= 0 || n < 2) return +r(e[0], 0, e);
        if (t >= 1) return +r(e[n - 1], n - 1, e);
        var n, i = (n - 1) * t,
            a = Math.floor(i),
            o = +r(e[a], a, e),
            u = +r(e[a + 1], a + 1, e);
        return o + (u - o) * (i - a)
    }
}

function bS(e, t, r) {
    e = +e, t = +t, r = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +r;
    for (var n = -1, i = Math.max(0, Math.ceil((t - e) / r)) | 0, a = new Array(i); ++n < i;) a[n] = e + n * r;
    return a
}

function ft(e, t) {
    switch (arguments.length) {
        case 0:
            break;
        case 1:
            this.range(e);
            break;
        default:
            this.range(t).domain(e);
            break
    }
    return this
}

function Xt(e, t) {
    switch (arguments.length) {
        case 0:
            break;
        case 1:
            {
                typeof e == "function" ? this.interpolator(e) : this.range(e);
                break
            }
        default:
            {
                this.domain(e),
                typeof t == "function" ? this.interpolator(t) : this.range(t);
                break
            }
    }
    return this
}
const Kl = Symbol("implicit");

function Dc() {
    var e = new Av,
        t = [],
        r = [],
        n = Kl;

    function i(a) {
        let o = e.get(a);
        if (o === void 0) {
            if (n !== Kl) return n;
            e.set(a, o = t.push(a) - 1)
        }
        return r[o % r.length]
    }
    return i.domain = function(a) {
        if (!arguments.length) return t.slice();
        t = [], e = new Av;
        for (const o of a) e.has(o) || e.set(o, t.push(o) - 1);
        return i
    }, i.range = function(a) {
        return arguments.length ? (r = Array.from(a), i) : r.slice()
    }, i.unknown = function(a) {
        return arguments.length ? (n = a, i) : n
    }, i.copy = function() {
        return Dc(t, r).unknown(n)
    }, ft.apply(i, arguments), i
}

function Nc() {
    var e = Dc().unknown(void 0),
        t = e.domain,
        r = e.range,
        n = 0,
        i = 1,
        a, o, u = !1,
        l = 0,
        s = 0,
        c = .5;
    delete e.unknown;

    function f() {
        var v = t().length,
            p = i < n,
            h = p ? i : n,
            m = p ? n : i;
        a = (m - h) / Math.max(1, v - l + s * 2), u && (a = Math.floor(a)), h += (m - h - a * (v - l)) * c, o = a * (1 - l), u && (h = Math.round(h), o = Math.round(o));
        var y = bS(v).map(function(g) {
            return h + a * g
        });
        return r(p ? y.reverse() : y)
    }
    return e.domain = function(v) {
        return arguments.length ? (t(v), f()) : t()
    }, e.range = function(v) {
        return arguments.length ? ([n, i] = v, n = +n, i = +i, f()) : [n, i]
    }, e.rangeRound = function(v) {
        return [n, i] = v, n = +n, i = +i, u = !0, f()
    }, e.bandwidth = function() {
        return o
    }, e.step = function() {
        return a
    }, e.round = function(v) {
        return arguments.length ? (u = !!v, f()) : u
    }, e.padding = function(v) {
        return arguments.length ? (l = Math.min(1, s = +v), f()) : l
    }, e.paddingInner = function(v) {
        return arguments.length ? (l = Math.min(1, v), f()) : l
    }, e.paddingOuter = function(v) {
        return arguments.length ? (s = +v, f()) : s
    }, e.align = function(v) {
        return arguments.length ? (c = Math.max(0, Math.min(1, v)), f()) : c
    }, e.copy = function() {
        return Nc(t(), [n, i]).round(u).paddingInner(l).paddingOuter(s).align(c)
    }, ft.apply(f(), arguments)
}

function Vy(e) {
    var t = e.copy;
    return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
        return Vy(t())
    }, e
}

function xS() {
    return Vy(Nc.apply(null, arguments).paddingInner(1))
}

function Rc(e, t, r) {
    e.prototype = t.prototype = r, r.constructor = e
}

function Yy(e, t) {
    var r = Object.create(e.prototype);
    for (var n in t) r[n] = t[n];
    return r
}

function ui() {}
var Kn = .7,
    fa = 1 / Kn,
    Yr = "\\s*([+-]?\\d+)\\s*",
    Wn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    Ot = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    wS = /^#([0-9a-f]{3,8})$/,
    PS = new RegExp(`^rgb\\(${Yr},${Yr},${Yr}\\)$`),
    OS = new RegExp(`^rgb\\(${Ot},${Ot},${Ot}\\)$`),
    AS = new RegExp(`^rgba\\(${Yr},${Yr},${Yr},${Wn}\\)$`),
    SS = new RegExp(`^rgba\\(${Ot},${Ot},${Ot},${Wn}\\)$`),
    ES = new RegExp(`^hsl\\(${Wn},${Ot},${Ot}\\)$`),
    jS = new RegExp(`^hsla\\(${Wn},${Ot},${Ot},${Wn}\\)$`),
    Iv = {
        aliceblue: 15792383,
        antiquewhite: 16444375,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 15794175,
        beige: 16119260,
        bisque: 16770244,
        black: 0,
        blanchedalmond: 16772045,
        blue: 255,
        blueviolet: 9055202,
        brown: 10824234,
        burlywood: 14596231,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 13789470,
        coral: 16744272,
        cornflowerblue: 6591981,
        cornsilk: 16775388,
        crimson: 14423100,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 12092939,
        darkgray: 11119017,
        darkgreen: 25600,
        darkgrey: 11119017,
        darkkhaki: 12433259,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 16747520,
        darkorchid: 10040012,
        darkred: 9109504,
        darksalmon: 15308410,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 16716947,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 11674146,
        floralwhite: 16775920,
        forestgreen: 2263842,
        fuchsia: 16711935,
        gainsboro: 14474460,
        ghostwhite: 16316671,
        gold: 16766720,
        goldenrod: 14329120,
        gray: 8421504,
        green: 32768,
        greenyellow: 11403055,
        grey: 8421504,
        honeydew: 15794160,
        hotpink: 16738740,
        indianred: 13458524,
        indigo: 4915330,
        ivory: 16777200,
        khaki: 15787660,
        lavender: 15132410,
        lavenderblush: 16773365,
        lawngreen: 8190976,
        lemonchiffon: 16775885,
        lightblue: 11393254,
        lightcoral: 15761536,
        lightcyan: 14745599,
        lightgoldenrodyellow: 16448210,
        lightgray: 13882323,
        lightgreen: 9498256,
        lightgrey: 13882323,
        lightpink: 16758465,
        lightsalmon: 16752762,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 11584734,
        lightyellow: 16777184,
        lime: 65280,
        limegreen: 3329330,
        linen: 16445670,
        magenta: 16711935,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 12211667,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 13047173,
        midnightblue: 1644912,
        mintcream: 16121850,
        mistyrose: 16770273,
        moccasin: 16770229,
        navajowhite: 16768685,
        navy: 128,
        oldlace: 16643558,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 16753920,
        orangered: 16729344,
        orchid: 14315734,
        palegoldenrod: 15657130,
        palegreen: 10025880,
        paleturquoise: 11529966,
        palevioletred: 14381203,
        papayawhip: 16773077,
        peachpuff: 16767673,
        peru: 13468991,
        pink: 16761035,
        plum: 14524637,
        powderblue: 11591910,
        purple: 8388736,
        rebeccapurple: 6697881,
        red: 16711680,
        rosybrown: 12357519,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 16416882,
        sandybrown: 16032864,
        seagreen: 3050327,
        seashell: 16774638,
        sienna: 10506797,
        silver: 12632256,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 16775930,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 13808780,
        teal: 32896,
        thistle: 14204888,
        tomato: 16737095,
        turquoise: 4251856,
        violet: 15631086,
        wheat: 16113331,
        white: 16777215,
        whitesmoke: 16119285,
        yellow: 16776960,
        yellowgreen: 10145074
    };
Rc(ui, Fn, {
    copy(e) {
        return Object.assign(new this.constructor, this, e)
    },
    displayable() {
        return this.rgb().displayable()
    },
    hex: _v,
    formatHex: _v,
    formatHex8: IS,
    formatHsl: _S,
    formatRgb: kv,
    toString: kv
});

function _v() {
    return this.rgb().formatHex()
}

function IS() {
    return this.rgb().formatHex8()
}

function _S() {
    return Xy(this).formatHsl()
}

function kv() {
    return this.rgb().formatRgb()
}

function Fn(e) {
    var t, r;
    return e = (e + "").trim().toLowerCase(), (t = wS.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? Cv(t) : r === 3 ? new qe(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? Di(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? Di(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = PS.exec(e)) ? new qe(t[1], t[2], t[3], 1) : (t = OS.exec(e)) ? new qe(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = AS.exec(e)) ? Di(t[1], t[2], t[3], t[4]) : (t = SS.exec(e)) ? Di(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = ES.exec(e)) ? Dv(t[1], t[2] / 100, t[3] / 100, 1) : (t = jS.exec(e)) ? Dv(t[1], t[2] / 100, t[3] / 100, t[4]) : Iv.hasOwnProperty(e) ? Cv(Iv[e]) : e === "transparent" ? new qe(NaN, NaN, NaN, 0) : null
}

function Cv(e) {
    return new qe(e >> 16 & 255, e >> 8 & 255, e & 255, 1)
}

function Di(e, t, r, n) {
    return n <= 0 && (e = t = r = NaN), new qe(e, t, r, n)
}

function kS(e) {
    return e instanceof ui || (e = Fn(e)), e ? (e = e.rgb(), new qe(e.r, e.g, e.b, e.opacity)) : new qe
}

function Wl(e, t, r, n) {
    return arguments.length === 1 ? kS(e) : new qe(e, t, r, n ?? 1)
}

function qe(e, t, r, n) {
    this.r = +e, this.g = +t, this.b = +r, this.opacity = +n
}
Rc(qe, Wl, Yy(ui, {
    brighter(e) {
        return e = e == null ? fa : Math.pow(fa, e), new qe(this.r * e, this.g * e, this.b * e, this.opacity)
    },
    darker(e) {
        return e = e == null ? Kn : Math.pow(Kn, e), new qe(this.r * e, this.g * e, this.b * e, this.opacity)
    },
    rgb() {
        return this
    },
    clamp() {
        return new qe(jr(this.r), jr(this.g), jr(this.b), da(this.opacity))
    },
    displayable() {
        return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1
    },
    hex: Tv,
    formatHex: Tv,
    formatHex8: CS,
    formatRgb: Mv,
    toString: Mv
}));

function Tv() {
    return `#${wr(this.r)}${wr(this.g)}${wr(this.b)}`
}

function CS() {
    return `#${wr(this.r)}${wr(this.g)}${wr(this.b)}${wr((isNaN(this.opacity)?1:this.opacity)*255)}`
}

function Mv() {
    const e = da(this.opacity);
    return `${e===1?"rgb(":"rgba("}${jr(this.r)}, ${jr(this.g)}, ${jr(this.b)}${e===1?")":`, ${e})`}`
}

function da(e) {
    return isNaN(e) ? 1 : Math.max(0, Math.min(1, e))
}

function jr(e) {
    return Math.max(0, Math.min(255, Math.round(e) || 0))
}

function wr(e) {
    return e = jr(e), (e < 16 ? "0" : "") + e.toString(16)
}

function Dv(e, t, r, n) {
    return n <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new vt(e, t, r, n)
}

function Xy(e) {
    if (e instanceof vt) return new vt(e.h, e.s, e.l, e.opacity);
    if (e instanceof ui || (e = Fn(e)), !e) return new vt;
    if (e instanceof vt) return e;
    e = e.rgb();
    var t = e.r / 255,
        r = e.g / 255,
        n = e.b / 255,
        i = Math.min(t, r, n),
        a = Math.max(t, r, n),
        o = NaN,
        u = a - i,
        l = (a + i) / 2;
    return u ? (t === a ? o = (r - n) / u + (r < n) * 6 : r === a ? o = (n - t) / u + 2 : o = (t - r) / u + 4, u /= l < .5 ? a + i : 2 - a - i, o *= 60) : u = l > 0 && l < 1 ? 0 : o, new vt(o, u, l, e.opacity)
}

function TS(e, t, r, n) {
    return arguments.length === 1 ? Xy(e) : new vt(e, t, r, n ?? 1)
}

function vt(e, t, r, n) {
    this.h = +e, this.s = +t, this.l = +r, this.opacity = +n
}
Rc(vt, TS, Yy(ui, {
    brighter(e) {
        return e = e == null ? fa : Math.pow(fa, e), new vt(this.h, this.s, this.l * e, this.opacity)
    },
    darker(e) {
        return e = e == null ? Kn : Math.pow(Kn, e), new vt(this.h, this.s, this.l * e, this.opacity)
    },
    rgb() {
        var e = this.h % 360 + (this.h < 0) * 360,
            t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
            r = this.l,
            n = r + (r < .5 ? r : 1 - r) * t,
            i = 2 * r - n;
        return new qe(Bu(e >= 240 ? e - 240 : e + 120, i, n), Bu(e, i, n), Bu(e < 120 ? e + 240 : e - 120, i, n), this.opacity)
    },
    clamp() {
        return new vt(Nv(this.h), Ni(this.s), Ni(this.l), da(this.opacity))
    },
    displayable() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1
    },
    formatHsl() {
        const e = da(this.opacity);
        return `${e===1?"hsl(":"hsla("}${Nv(this.h)}, ${Ni(this.s)*100}%, ${Ni(this.l)*100}%${e===1?")":`, ${e})`}`
    }
}));

function Nv(e) {
    return e = (e || 0) % 360, e < 0 ? e + 360 : e
}

function Ni(e) {
    return Math.max(0, Math.min(1, e || 0))
}

function Bu(e, t, r) {
    return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255
}
const $c = e => () => e;

function MS(e, t) {
    return function(r) {
        return e + r * t
    }
}

function DS(e, t, r) {
    return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r,
        function(n) {
            return Math.pow(e + n * t, r)
        }
}

function NS(e) {
    return (e = +e) == 1 ? Zy : function(t, r) {
        return r - t ? DS(t, r, e) : $c(isNaN(t) ? r : t)
    }
}

function Zy(e, t) {
    var r = t - e;
    return r ? MS(e, r) : $c(isNaN(e) ? t : e)
}
const Rv = (function e(t) {
    var r = NS(t);

    function n(i, a) {
        var o = r((i = Wl(i)).r, (a = Wl(a)).r),
            u = r(i.g, a.g),
            l = r(i.b, a.b),
            s = Zy(i.opacity, a.opacity);
        return function(c) {
            return i.r = o(c), i.g = u(c), i.b = l(c), i.opacity = s(c), i + ""
        }
    }
    return n.gamma = e, n
})(1);

function RS(e, t) {
    t || (t = []);
    var r = e ? Math.min(t.length, e.length) : 0,
        n = t.slice(),
        i;
    return function(a) {
        for (i = 0; i < r; ++i) n[i] = e[i] * (1 - a) + t[i] * a;
        return n
    }
}

function $S(e) {
    return ArrayBuffer.isView(e) && !(e instanceof DataView)
}

function LS(e, t) {
    var r = t ? t.length : 0,
        n = e ? Math.min(r, e.length) : 0,
        i = new Array(n),
        a = new Array(r),
        o;
    for (o = 0; o < n; ++o) i[o] = tn(e[o], t[o]);
    for (; o < r; ++o) a[o] = t[o];
    return function(u) {
        for (o = 0; o < n; ++o) a[o] = i[o](u);
        return a
    }
}

function BS(e, t) {
    var r = new Date;
    return e = +e, t = +t,
        function(n) {
            return r.setTime(e * (1 - n) + t * n), r
        }
}

function va(e, t) {
    return e = +e, t = +t,
        function(r) {
            return e * (1 - r) + t * r
        }
}

function zS(e, t) {
    var r = {},
        n = {},
        i;
    (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
    for (i in t) i in e ? r[i] = tn(e[i], t[i]) : n[i] = t[i];
    return function(a) {
        for (i in r) n[i] = r[i](a);
        return n
    }
}
var Fl = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    zu = new RegExp(Fl.source, "g");

function KS(e) {
    return function() {
        return e
    }
}

function WS(e) {
    return function(t) {
        return e(t) + ""
    }
}

function FS(e, t) {
    var r = Fl.lastIndex = zu.lastIndex = 0,
        n, i, a, o = -1,
        u = [],
        l = [];
    for (e = e + "", t = t + "";
        (n = Fl.exec(e)) && (i = zu.exec(t));)(a = i.index) > r && (a = t.slice(r, a), u[o] ? u[o] += a : u[++o] = a), (n = n[0]) === (i = i[0]) ? u[o] ? u[o] += i : u[++o] = i : (u[++o] = null, l.push({
        i: o,
        x: va(n, i)
    })), r = zu.lastIndex;
    return r < t.length && (a = t.slice(r), u[o] ? u[o] += a : u[++o] = a), u.length < 2 ? l[0] ? WS(l[0].x) : KS(t) : (t = l.length, function(s) {
        for (var c = 0, f; c < t; ++c) u[(f = l[c]).i] = f.x(s);
        return u.join("")
    })
}

function tn(e, t) {
    var r = typeof t,
        n;
    return t == null || r === "boolean" ? $c(t) : (r === "number" ? va : r === "string" ? (n = Fn(t)) ? (t = n, Rv) : FS : t instanceof Fn ? Rv : t instanceof Date ? BS : $S(t) ? RS : Array.isArray(t) ? LS : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? zS : va)(e, t)
}

function Lc(e, t) {
    return e = +e, t = +t,
        function(r) {
            return Math.round(e * (1 - r) + t * r)
        }
}

function qS(e, t) {
    t === void 0 && (t = e, e = tn);
    for (var r = 0, n = t.length - 1, i = t[0], a = new Array(n < 0 ? 0 : n); r < n;) a[r] = e(i, i = t[++r]);
    return function(o) {
        var u = Math.max(0, Math.min(n - 1, Math.floor(o *= n)));
        return a[u](o - u)
    }
}

function US(e) {
    return function() {
        return e
    }
}

function pa(e) {
    return +e
}
var $v = [0, 1];

function ze(e) {
    return e
}

function ql(e, t) {
    return (t -= e = +e) ? function(r) {
        return (r - e) / t
    } : US(isNaN(t) ? NaN : .5)
}

function HS(e, t) {
    var r;
    return e > t && (r = e, e = t, t = r),
        function(n) {
            return Math.max(e, Math.min(t, n))
        }
}

function GS(e, t, r) {
    var n = e[0],
        i = e[1],
        a = t[0],
        o = t[1];
    return i < n ? (n = ql(i, n), a = r(o, a)) : (n = ql(n, i), a = r(a, o)),
        function(u) {
            return a(n(u))
        }
}

function VS(e, t, r) {
    var n = Math.min(e.length, t.length) - 1,
        i = new Array(n),
        a = new Array(n),
        o = -1;
    for (e[n] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++o < n;) i[o] = ql(e[o], e[o + 1]), a[o] = r(t[o], t[o + 1]);
    return function(u) {
        var l = oi(e, u, 1, n) - 1;
        return a[l](i[l](u))
    }
}

function li(e, t) {
    return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown())
}

function Ja() {
    var e = $v,
        t = $v,
        r = tn,
        n, i, a, o = ze,
        u, l, s;

    function c() {
        var v = Math.min(e.length, t.length);
        return o !== ze && (o = HS(e[0], e[v - 1])), u = v > 2 ? VS : GS, l = s = null, f
    }

    function f(v) {
        return v == null || isNaN(v = +v) ? a : (l || (l = u(e.map(n), t, r)))(n(o(v)))
    }
    return f.invert = function(v) {
            return o(i((s || (s = u(t, e.map(n), va)))(v)))
        }, f.domain = function(v) {
            return arguments.length ? (e = Array.from(v, pa), c()) : e.slice()
        }, f.range = function(v) {
            return arguments.length ? (t = Array.from(v), c()) : t.slice()
        }, f.rangeRound = function(v) {
            return t = Array.from(v), r = Lc, c()
        }, f.clamp = function(v) {
            return arguments.length ? (o = v ? !0 : ze, c()) : o !== ze
        }, f.interpolate = function(v) {
            return arguments.length ? (r = v, c()) : r
        }, f.unknown = function(v) {
            return arguments.length ? (a = v, f) : a
        },
        function(v, p) {
            return n = v, i = p, c()
        }
}

function Bc() {
    return Ja()(ze, ze)
}

function YS(e) {
    return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10)
}

function ha(e, t) {
    if ((r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0) return null;
    var r, n = e.slice(0, r);
    return [n.length > 1 ? n[0] + n.slice(2) : n, +e.slice(r + 1)]
}

function Jr(e) {
    return e = ha(Math.abs(e)), e ? e[1] : NaN
}

function XS(e, t) {
    return function(r, n) {
        for (var i = r.length, a = [], o = 0, u = e[0], l = 0; i > 0 && u > 0 && (l + u + 1 > n && (u = Math.max(1, n - l)), a.push(r.substring(i -= u, i + u)), !((l += u + 1) > n));) u = e[o = (o + 1) % e.length];
        return a.reverse().join(t)
    }
}

function ZS(e) {
    return function(t) {
        return t.replace(/[0-9]/g, function(r) {
            return e[+r]
        })
    }
}
var JS = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function qn(e) {
    if (!(t = JS.exec(e))) throw new Error("invalid format: " + e);
    var t;
    return new zc({
        fill: t[1],
        align: t[2],
        sign: t[3],
        symbol: t[4],
        zero: t[5],
        width: t[6],
        comma: t[7],
        precision: t[8] && t[8].slice(1),
        trim: t[9],
        type: t[10]
    })
}
qn.prototype = zc.prototype;

function zc(e) {
    this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + ""
}
zc.prototype.toString = function() {
    return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type
};

function QS(e) {
    e: for (var t = e.length, r = 1, n = -1, i; r < t; ++r) switch (e[r]) {
        case ".":
            n = i = r;
            break;
        case "0":
            n === 0 && (n = r), i = r;
            break;
        default:
            if (!+e[r]) break e;
            n > 0 && (n = 0);
            break
    }
    return n > 0 ? e.slice(0, n) + e.slice(i + 1) : e
}
var Jy;

function eE(e, t) {
    var r = ha(e, t);
    if (!r) return e + "";
    var n = r[0],
        i = r[1],
        a = i - (Jy = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1,
        o = n.length;
    return a === o ? n : a > o ? n + new Array(a - o + 1).join("0") : a > 0 ? n.slice(0, a) + "." + n.slice(a) : "0." + new Array(1 - a).join("0") + ha(e, Math.max(0, t + a - 1))[0]
}

function Lv(e, t) {
    var r = ha(e, t);
    if (!r) return e + "";
    var n = r[0],
        i = r[1];
    return i < 0 ? "0." + new Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + new Array(i - n.length + 2).join("0")
}
const Bv = {
    "%": (e, t) => (e * 100).toFixed(t),
    b: e => Math.round(e).toString(2),
    c: e => e + "",
    d: YS,
    e: (e, t) => e.toExponential(t),
    f: (e, t) => e.toFixed(t),
    g: (e, t) => e.toPrecision(t),
    o: e => Math.round(e).toString(8),
    p: (e, t) => Lv(e * 100, t),
    r: Lv,
    s: eE,
    X: e => Math.round(e).toString(16).toUpperCase(),
    x: e => Math.round(e).toString(16)
};

function zv(e) {
    return e
}
var Kv = Array.prototype.map,
    Wv = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

function tE(e) {
    var t = e.grouping === void 0 || e.thousands === void 0 ? zv : XS(Kv.call(e.grouping, Number), e.thousands + ""),
        r = e.currency === void 0 ? "" : e.currency[0] + "",
        n = e.currency === void 0 ? "" : e.currency[1] + "",
        i = e.decimal === void 0 ? "." : e.decimal + "",
        a = e.numerals === void 0 ? zv : ZS(Kv.call(e.numerals, String)),
        o = e.percent === void 0 ? "%" : e.percent + "",
        u = e.minus === void 0 ? "−" : e.minus + "",
        l = e.nan === void 0 ? "NaN" : e.nan + "";

    function s(f) {
        f = qn(f);
        var v = f.fill,
            p = f.align,
            h = f.sign,
            m = f.symbol,
            y = f.zero,
            g = f.width,
            b = f.comma,
            x = f.precision,
            P = f.trim,
            w = f.type;
        w === "n" ? (b = !0, w = "g") : Bv[w] || (x === void 0 && (x = 12), P = !0, w = "g"), (y || v === "0" && p === "=") && (y = !0, v = "0", p = "=");
        var O = m === "$" ? r : m === "#" && /[boxX]/.test(w) ? "0" + w.toLowerCase() : "",
            S = m === "$" ? n : /[%p]/.test(w) ? o : "",
            E = Bv[w],
            _ = /[defgprs%]/.test(w);
        x = x === void 0 ? 6 : /[gprs]/.test(w) ? Math.max(1, Math.min(21, x)) : Math.max(0, Math.min(20, x));

        function C(j) {
            var I = O,
                R = S,
                $, B, q;
            if (w === "c") R = E(j) + R, j = "";
            else {
                j = +j;
                var W = j < 0 || 1 / j < 0;
                if (j = isNaN(j) ? l : E(Math.abs(j), x), P && (j = QS(j)), W && +j == 0 && h !== "+" && (W = !1), I = (W ? h === "(" ? h : u : h === "-" || h === "(" ? "" : h) + I, R = (w === "s" ? Wv[8 + Jy / 3] : "") + R + (W && h === "(" ? ")" : ""), _) {
                    for ($ = -1, B = j.length; ++$ < B;)
                        if (q = j.charCodeAt($), 48 > q || q > 57) {
                            R = (q === 46 ? i + j.slice($ + 1) : j.slice($)) + R, j = j.slice(0, $);
                            break
                        }
                }
            }
            b && !y && (j = t(j, 1 / 0));
            var V = I.length + j.length + R.length,
                L = V < g ? new Array(g - V + 1).join(v) : "";
            switch (b && y && (j = t(L + j, L.length ? g - R.length : 1 / 0), L = ""), p) {
                case "<":
                    j = I + j + R + L;
                    break;
                case "=":
                    j = I + L + j + R;
                    break;
                case "^":
                    j = L.slice(0, V = L.length >> 1) + I + j + R + L.slice(V);
                    break;
                default:
                    j = L + I + j + R;
                    break
            }
            return a(j)
        }
        return C.toString = function() {
            return f + ""
        }, C
    }

    function c(f, v) {
        var p = s((f = qn(f), f.type = "f", f)),
            h = Math.max(-8, Math.min(8, Math.floor(Jr(v) / 3))) * 3,
            m = Math.pow(10, -h),
            y = Wv[8 + h / 3];
        return function(g) {
            return p(m * g) + y
        }
    }
    return {
        format: s,
        formatPrefix: c
    }
}
var Ri, Kc, Qy;
rE({
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
});

function rE(e) {
    return Ri = tE(e), Kc = Ri.format, Qy = Ri.formatPrefix, Ri
}

function nE(e) {
    return Math.max(0, -Jr(Math.abs(e)))
}

function iE(e, t) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Jr(t) / 3))) * 3 - Jr(Math.abs(e)))
}

function aE(e, t) {
    return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, Jr(t) - Jr(e)) + 1
}

function eg(e, t, r, n) {
    var i = zl(e, t, r),
        a;
    switch (n = qn(n ?? ",f"), n.type) {
        case "s":
            {
                var o = Math.max(Math.abs(e), Math.abs(t));
                return n.precision == null && !isNaN(a = iE(i, o)) && (n.precision = a),
                Qy(n, o)
            }
        case "":
        case "e":
        case "g":
        case "p":
        case "r":
            {
                n.precision == null && !isNaN(a = aE(i, Math.max(Math.abs(e), Math.abs(t)))) && (n.precision = a - (n.type === "e"));
                break
            }
        case "f":
        case "%":
            {
                n.precision == null && !isNaN(a = nE(i)) && (n.precision = a - (n.type === "%") * 2);
                break
            }
    }
    return Kc(n)
}

function dr(e) {
    var t = e.domain;
    return e.ticks = function(r) {
        var n = t();
        return Ll(n[0], n[n.length - 1], r ?? 10)
    }, e.tickFormat = function(r, n) {
        var i = t();
        return eg(i[0], i[i.length - 1], r ?? 10, n)
    }, e.nice = function(r) {
        r == null && (r = 10);
        var n = t(),
            i = 0,
            a = n.length - 1,
            o = n[i],
            u = n[a],
            l, s, c = 10;
        for (u < o && (s = o, o = u, u = s, s = i, i = a, a = s); c-- > 0;) {
            if (s = Bl(o, u, r), s === l) return n[i] = o, n[a] = u, t(n);
            if (s > 0) o = Math.floor(o / s) * s, u = Math.ceil(u / s) * s;
            else if (s < 0) o = Math.ceil(o * s) / s, u = Math.floor(u * s) / s;
            else break;
            l = s
        }
        return e
    }, e
}

function tg() {
    var e = Bc();
    return e.copy = function() {
        return li(e, tg())
    }, ft.apply(e, arguments), dr(e)
}

function rg(e) {
    var t;

    function r(n) {
        return n == null || isNaN(n = +n) ? t : n
    }
    return r.invert = r, r.domain = r.range = function(n) {
        return arguments.length ? (e = Array.from(n, pa), r) : e.slice()
    }, r.unknown = function(n) {
        return arguments.length ? (t = n, r) : t
    }, r.copy = function() {
        return rg(e).unknown(t)
    }, e = arguments.length ? Array.from(e, pa) : [0, 1], dr(r)
}

function ng(e, t) {
    e = e.slice();
    var r = 0,
        n = e.length - 1,
        i = e[r],
        a = e[n],
        o;
    return a < i && (o = r, r = n, n = o, o = i, i = a, a = o), e[r] = t.floor(i), e[n] = t.ceil(a), e
}

function Fv(e) {
    return Math.log(e)
}

function qv(e) {
    return Math.exp(e)
}

function oE(e) {
    return -Math.log(-e)
}

function uE(e) {
    return -Math.exp(-e)
}

function lE(e) {
    return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e
}

function cE(e) {
    return e === 10 ? lE : e === Math.E ? Math.exp : t => Math.pow(e, t)
}

function sE(e) {
    return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), t => Math.log(t) / e)
}

function Uv(e) {
    return (t, r) => -e(-t, r)
}

function Wc(e) {
    const t = e(Fv, qv),
        r = t.domain;
    let n = 10,
        i, a;

    function o() {
        return i = sE(n), a = cE(n), r()[0] < 0 ? (i = Uv(i), a = Uv(a), e(oE, uE)) : e(Fv, qv), t
    }
    return t.base = function(u) {
        return arguments.length ? (n = +u, o()) : n
    }, t.domain = function(u) {
        return arguments.length ? (r(u), o()) : r()
    }, t.ticks = u => {
        const l = r();
        let s = l[0],
            c = l[l.length - 1];
        const f = c < s;
        f && ([s, c] = [c, s]);
        let v = i(s),
            p = i(c),
            h, m;
        const y = u == null ? 10 : +u;
        let g = [];
        if (!(n % 1) && p - v < y) {
            if (v = Math.floor(v), p = Math.ceil(p), s > 0) {
                for (; v <= p; ++v)
                    for (h = 1; h < n; ++h)
                        if (m = v < 0 ? h / a(-v) : h * a(v), !(m < s)) {
                            if (m > c) break;
                            g.push(m)
                        }
            } else
                for (; v <= p; ++v)
                    for (h = n - 1; h >= 1; --h)
                        if (m = v > 0 ? h / a(-v) : h * a(v), !(m < s)) {
                            if (m > c) break;
                            g.push(m)
                        }
            g.length * 2 < y && (g = Ll(s, c, y))
        } else g = Ll(v, p, Math.min(p - v, y)).map(a);
        return f ? g.reverse() : g
    }, t.tickFormat = (u, l) => {
        if (u == null && (u = 10), l == null && (l = n === 10 ? "s" : ","), typeof l != "function" && (!(n % 1) && (l = qn(l)).precision == null && (l.trim = !0), l = Kc(l)), u === 1 / 0) return l;
        const s = Math.max(1, n * u / t.ticks().length);
        return c => {
            let f = c / a(Math.round(i(c)));
            return f * n < n - .5 && (f *= n), f <= s ? l(c) : ""
        }
    }, t.nice = () => r(ng(r(), {
        floor: u => a(Math.floor(i(u))),
        ceil: u => a(Math.ceil(i(u)))
    })), t
}

function ig() {
    const e = Wc(Ja()).domain([1, 10]);
    return e.copy = () => li(e, ig()).base(e.base()), ft.apply(e, arguments), e
}

function Hv(e) {
    return function(t) {
        return Math.sign(t) * Math.log1p(Math.abs(t / e))
    }
}

function Gv(e) {
    return function(t) {
        return Math.sign(t) * Math.expm1(Math.abs(t)) * e
    }
}

function Fc(e) {
    var t = 1,
        r = e(Hv(t), Gv(t));
    return r.constant = function(n) {
        return arguments.length ? e(Hv(t = +n), Gv(t)) : t
    }, dr(r)
}

function ag() {
    var e = Fc(Ja());
    return e.copy = function() {
        return li(e, ag()).constant(e.constant())
    }, ft.apply(e, arguments)
}

function Vv(e) {
    return function(t) {
        return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e)
    }
}

function fE(e) {
    return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e)
}

function dE(e) {
    return e < 0 ? -e * e : e * e
}

function qc(e) {
    var t = e(ze, ze),
        r = 1;

    function n() {
        return r === 1 ? e(ze, ze) : r === .5 ? e(fE, dE) : e(Vv(r), Vv(1 / r))
    }
    return t.exponent = function(i) {
        return arguments.length ? (r = +i, n()) : r
    }, dr(t)
}

function Uc() {
    var e = qc(Ja());
    return e.copy = function() {
        return li(e, Uc()).exponent(e.exponent())
    }, ft.apply(e, arguments), e
}

function vE() {
    return Uc.apply(null, arguments).exponent(.5)
}

function Yv(e) {
    return Math.sign(e) * e * e
}

function pE(e) {
    return Math.sign(e) * Math.sqrt(Math.abs(e))
}

function og() {
    var e = Bc(),
        t = [0, 1],
        r = !1,
        n;

    function i(a) {
        var o = pE(e(a));
        return isNaN(o) ? n : r ? Math.round(o) : o
    }
    return i.invert = function(a) {
        return e.invert(Yv(a))
    }, i.domain = function(a) {
        return arguments.length ? (e.domain(a), i) : e.domain()
    }, i.range = function(a) {
        return arguments.length ? (e.range((t = Array.from(a, pa)).map(Yv)), i) : t.slice()
    }, i.rangeRound = function(a) {
        return i.range(a).round(!0)
    }, i.round = function(a) {
        return arguments.length ? (r = !!a, i) : r
    }, i.clamp = function(a) {
        return arguments.length ? (e.clamp(a), i) : e.clamp()
    }, i.unknown = function(a) {
        return arguments.length ? (n = a, i) : n
    }, i.copy = function() {
        return og(e.domain(), t).round(r).clamp(e.clamp()).unknown(n)
    }, ft.apply(i, arguments), dr(i)
}

function ug() {
    var e = [],
        t = [],
        r = [],
        n;

    function i() {
        var o = 0,
            u = Math.max(1, t.length);
        for (r = new Array(u - 1); ++o < u;) r[o - 1] = gS(e, o / u);
        return a
    }

    function a(o) {
        return o == null || isNaN(o = +o) ? n : t[oi(r, o)]
    }
    return a.invertExtent = function(o) {
        var u = t.indexOf(o);
        return u < 0 ? [NaN, NaN] : [u > 0 ? r[u - 1] : e[0], u < r.length ? r[u] : e[e.length - 1]]
    }, a.domain = function(o) {
        if (!arguments.length) return e.slice();
        e = [];
        for (let u of o) u != null && !isNaN(u = +u) && e.push(u);
        return e.sort(ar), i()
    }, a.range = function(o) {
        return arguments.length ? (t = Array.from(o), i()) : t.slice()
    }, a.unknown = function(o) {
        return arguments.length ? (n = o, a) : n
    }, a.quantiles = function() {
        return r.slice()
    }, a.copy = function() {
        return ug().domain(e).range(t).unknown(n)
    }, ft.apply(a, arguments)
}

function lg() {
    var e = 0,
        t = 1,
        r = 1,
        n = [.5],
        i = [0, 1],
        a;

    function o(l) {
        return l != null && l <= l ? i[oi(n, l, 0, r)] : a
    }

    function u() {
        var l = -1;
        for (n = new Array(r); ++l < r;) n[l] = ((l + 1) * t - (l - r) * e) / (r + 1);
        return o
    }
    return o.domain = function(l) {
        return arguments.length ? ([e, t] = l, e = +e, t = +t, u()) : [e, t]
    }, o.range = function(l) {
        return arguments.length ? (r = (i = Array.from(l)).length - 1, u()) : i.slice()
    }, o.invertExtent = function(l) {
        var s = i.indexOf(l);
        return s < 0 ? [NaN, NaN] : s < 1 ? [e, n[0]] : s >= r ? [n[r - 1], t] : [n[s - 1], n[s]]
    }, o.unknown = function(l) {
        return arguments.length && (a = l), o
    }, o.thresholds = function() {
        return n.slice()
    }, o.copy = function() {
        return lg().domain([e, t]).range(i).unknown(a)
    }, ft.apply(dr(o), arguments)
}

function cg() {
    var e = [.5],
        t = [0, 1],
        r, n = 1;

    function i(a) {
        return a != null && a <= a ? t[oi(e, a, 0, n)] : r
    }
    return i.domain = function(a) {
        return arguments.length ? (e = Array.from(a), n = Math.min(e.length, t.length - 1), i) : e.slice()
    }, i.range = function(a) {
        return arguments.length ? (t = Array.from(a), n = Math.min(e.length, t.length - 1), i) : t.slice()
    }, i.invertExtent = function(a) {
        var o = t.indexOf(a);
        return [e[o - 1], e[o]]
    }, i.unknown = function(a) {
        return arguments.length ? (r = a, i) : r
    }, i.copy = function() {
        return cg().domain(e).range(t).unknown(r)
    }, ft.apply(i, arguments)
}
const Ku = new Date,
    Wu = new Date;

function Oe(e, t, r, n) {
    function i(a) {
        return e(a = arguments.length === 0 ? new Date : new Date(+a)), a
    }
    return i.floor = a => (e(a = new Date(+a)), a), i.ceil = a => (e(a = new Date(a - 1)), t(a, 1), e(a), a), i.round = a => {
        const o = i(a),
            u = i.ceil(a);
        return a - o < u - a ? o : u
    }, i.offset = (a, o) => (t(a = new Date(+a), o == null ? 1 : Math.floor(o)), a), i.range = (a, o, u) => {
        const l = [];
        if (a = i.ceil(a), u = u == null ? 1 : Math.floor(u), !(a < o) || !(u > 0)) return l;
        let s;
        do l.push(s = new Date(+a)), t(a, u), e(a); while (s < a && a < o);
        return l
    }, i.filter = a => Oe(o => {
        if (o >= o)
            for (; e(o), !a(o);) o.setTime(o - 1)
    }, (o, u) => {
        if (o >= o)
            if (u < 0)
                for (; ++u <= 0;)
                    for (; t(o, -1), !a(o););
            else
                for (; --u >= 0;)
                    for (; t(o, 1), !a(o););
    }), r && (i.count = (a, o) => (Ku.setTime(+a), Wu.setTime(+o), e(Ku), e(Wu), Math.floor(r(Ku, Wu))), i.every = a => (a = Math.floor(a), !isFinite(a) || !(a > 0) ? null : a > 1 ? i.filter(n ? o => n(o) % a === 0 : o => i.count(0, o) % a === 0) : i)), i
}
const ma = Oe(() => {}, (e, t) => {
    e.setTime(+e + t)
}, (e, t) => t - e);
ma.every = e => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? Oe(t => {
    t.setTime(Math.floor(t / e) * e)
}, (t, r) => {
    t.setTime(+t + r * e)
}, (t, r) => (r - t) / e) : ma);
ma.range;
const Dt = 1e3,
    it = Dt * 60,
    Nt = it * 60,
    Wt = Nt * 24,
    Hc = Wt * 7,
    Xv = Wt * 30,
    Fu = Wt * 365,
    Pr = Oe(e => {
        e.setTime(e - e.getMilliseconds())
    }, (e, t) => {
        e.setTime(+e + t * Dt)
    }, (e, t) => (t - e) / Dt, e => e.getUTCSeconds());
Pr.range;
const Gc = Oe(e => {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * Dt)
}, (e, t) => {
    e.setTime(+e + t * it)
}, (e, t) => (t - e) / it, e => e.getMinutes());
Gc.range;
const Vc = Oe(e => {
    e.setUTCSeconds(0, 0)
}, (e, t) => {
    e.setTime(+e + t * it)
}, (e, t) => (t - e) / it, e => e.getUTCMinutes());
Vc.range;
const Yc = Oe(e => {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * Dt - e.getMinutes() * it)
}, (e, t) => {
    e.setTime(+e + t * Nt)
}, (e, t) => (t - e) / Nt, e => e.getHours());
Yc.range;
const Xc = Oe(e => {
    e.setUTCMinutes(0, 0, 0)
}, (e, t) => {
    e.setTime(+e + t * Nt)
}, (e, t) => (t - e) / Nt, e => e.getUTCHours());
Xc.range;
const ci = Oe(e => e.setHours(0, 0, 0, 0), (e, t) => e.setDate(e.getDate() + t), (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * it) / Wt, e => e.getDate() - 1);
ci.range;
const Qa = Oe(e => {
    e.setUTCHours(0, 0, 0, 0)
}, (e, t) => {
    e.setUTCDate(e.getUTCDate() + t)
}, (e, t) => (t - e) / Wt, e => e.getUTCDate() - 1);
Qa.range;
const sg = Oe(e => {
    e.setUTCHours(0, 0, 0, 0)
}, (e, t) => {
    e.setUTCDate(e.getUTCDate() + t)
}, (e, t) => (t - e) / Wt, e => Math.floor(e / Wt));
sg.range;

function Br(e) {
    return Oe(t => {
        t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0)
    }, (t, r) => {
        t.setDate(t.getDate() + r * 7)
    }, (t, r) => (r - t - (r.getTimezoneOffset() - t.getTimezoneOffset()) * it) / Hc)
}
const eo = Br(0),
    ya = Br(1),
    hE = Br(2),
    mE = Br(3),
    Qr = Br(4),
    yE = Br(5),
    gE = Br(6);
eo.range;
ya.range;
hE.range;
mE.range;
Qr.range;
yE.range;
gE.range;

function zr(e) {
    return Oe(t => {
        t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0)
    }, (t, r) => {
        t.setUTCDate(t.getUTCDate() + r * 7)
    }, (t, r) => (r - t) / Hc)
}
const to = zr(0),
    ga = zr(1),
    bE = zr(2),
    xE = zr(3),
    en = zr(4),
    wE = zr(5),
    PE = zr(6);
to.range;
ga.range;
bE.range;
xE.range;
en.range;
wE.range;
PE.range;
const Zc = Oe(e => {
    e.setDate(1), e.setHours(0, 0, 0, 0)
}, (e, t) => {
    e.setMonth(e.getMonth() + t)
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, e => e.getMonth());
Zc.range;
const Jc = Oe(e => {
    e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0)
}, (e, t) => {
    e.setUTCMonth(e.getUTCMonth() + t)
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, e => e.getUTCMonth());
Jc.range;
const Ft = Oe(e => {
    e.setMonth(0, 1), e.setHours(0, 0, 0, 0)
}, (e, t) => {
    e.setFullYear(e.getFullYear() + t)
}, (e, t) => t.getFullYear() - e.getFullYear(), e => e.getFullYear());
Ft.every = e => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Oe(t => {
    t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0)
}, (t, r) => {
    t.setFullYear(t.getFullYear() + r * e)
});
Ft.range;
const qt = Oe(e => {
    e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0)
}, (e, t) => {
    e.setUTCFullYear(e.getUTCFullYear() + t)
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), e => e.getUTCFullYear());
qt.every = e => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Oe(t => {
    t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0)
}, (t, r) => {
    t.setUTCFullYear(t.getUTCFullYear() + r * e)
});
qt.range;

function fg(e, t, r, n, i, a) {
    const o = [
        [Pr, 1, Dt],
        [Pr, 5, 5 * Dt],
        [Pr, 15, 15 * Dt],
        [Pr, 30, 30 * Dt],
        [a, 1, it],
        [a, 5, 5 * it],
        [a, 15, 15 * it],
        [a, 30, 30 * it],
        [i, 1, Nt],
        [i, 3, 3 * Nt],
        [i, 6, 6 * Nt],
        [i, 12, 12 * Nt],
        [n, 1, Wt],
        [n, 2, 2 * Wt],
        [r, 1, Hc],
        [t, 1, Xv],
        [t, 3, 3 * Xv],
        [e, 1, Fu]
    ];

    function u(s, c, f) {
        const v = c < s;
        v && ([s, c] = [c, s]);
        const p = f && typeof f.range == "function" ? f : l(s, c, f),
            h = p ? p.range(s, +c + 1) : [];
        return v ? h.reverse() : h
    }

    function l(s, c, f) {
        const v = Math.abs(c - s) / f,
            p = Mc(([, , y]) => y).right(o, v);
        if (p === o.length) return e.every(zl(s / Fu, c / Fu, f));
        if (p === 0) return ma.every(Math.max(zl(s, c, f), 1));
        const [h, m] = o[v / o[p - 1][2] < o[p][2] / v ? p - 1 : p];
        return h.every(m)
    }
    return [u, l]
}
const [OE, AE] = fg(qt, Jc, to, sg, Xc, Vc), [SE, EE] = fg(Ft, Zc, eo, ci, Yc, Gc);

function qu(e) {
    if (0 <= e.y && e.y < 100) {
        var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
        return t.setFullYear(e.y), t
    }
    return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L)
}

function Uu(e) {
    if (0 <= e.y && e.y < 100) {
        var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
        return t.setUTCFullYear(e.y), t
    }
    return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L))
}

function jn(e, t, r) {
    return {
        y: e,
        m: t,
        d: r,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    }
}

function jE(e) {
    var t = e.dateTime,
        r = e.date,
        n = e.time,
        i = e.periods,
        a = e.days,
        o = e.shortDays,
        u = e.months,
        l = e.shortMonths,
        s = In(i),
        c = _n(i),
        f = In(a),
        v = _n(a),
        p = In(o),
        h = _n(o),
        m = In(u),
        y = _n(u),
        g = In(l),
        b = _n(l),
        x = {
            a: W,
            A: V,
            b: L,
            B: Me,
            c: null,
            d: rp,
            e: rp,
            f: XE,
            g: oj,
            G: lj,
            H: GE,
            I: VE,
            j: YE,
            L: dg,
            m: ZE,
            M: JE,
            p: Le,
            q: De,
            Q: ap,
            s: op,
            S: QE,
            u: ej,
            U: tj,
            V: rj,
            w: nj,
            W: ij,
            x: null,
            X: null,
            y: aj,
            Y: uj,
            Z: cj,
            "%": ip
        },
        P = {
            a: Tt,
            A: Qe,
            b: hr,
            B: Pn,
            c: null,
            d: np,
            e: np,
            f: vj,
            g: Oj,
            G: Sj,
            H: sj,
            I: fj,
            j: dj,
            L: pg,
            m: pj,
            M: hj,
            p: Ke,
            q: ko,
            Q: ap,
            s: op,
            S: mj,
            u: yj,
            U: gj,
            V: bj,
            w: xj,
            W: wj,
            x: null,
            X: null,
            y: Pj,
            Y: Aj,
            Z: Ej,
            "%": ip
        },
        w = {
            a: C,
            A: j,
            b: I,
            B: R,
            c: $,
            d: ep,
            e: ep,
            f: FE,
            g: Qv,
            G: Jv,
            H: tp,
            I: tp,
            j: BE,
            L: WE,
            m: LE,
            M: zE,
            p: _,
            q: $E,
            Q: UE,
            s: HE,
            S: KE,
            u: TE,
            U: ME,
            V: DE,
            w: CE,
            W: NE,
            x: B,
            X: q,
            y: Qv,
            Y: Jv,
            Z: RE,
            "%": qE
        };
    x.x = O(r, x), x.X = O(n, x), x.c = O(t, x), P.x = O(r, P), P.X = O(n, P), P.c = O(t, P);

    function O(k, U) {
        return function(Y) {
            var T = [],
                We = -1,
                ue = 0,
                Ve = k.length,
                Ye, mr, nf;
            for (Y instanceof Date || (Y = new Date(+Y)); ++We < Ve;) k.charCodeAt(We) === 37 && (T.push(k.slice(ue, We)), (mr = Zv[Ye = k.charAt(++We)]) != null ? Ye = k.charAt(++We) : mr = Ye === "e" ? " " : "0", (nf = U[Ye]) && (Ye = nf(Y, mr)), T.push(Ye), ue = We + 1);
            return T.push(k.slice(ue, We)), T.join("")
        }
    }

    function S(k, U) {
        return function(Y) {
            var T = jn(1900, void 0, 1),
                We = E(T, k, Y += "", 0),
                ue, Ve;
            if (We != Y.length) return null;
            if ("Q" in T) return new Date(T.Q);
            if ("s" in T) return new Date(T.s * 1e3 + ("L" in T ? T.L : 0));
            if (U && !("Z" in T) && (T.Z = 0), "p" in T && (T.H = T.H % 12 + T.p * 12), T.m === void 0 && (T.m = "q" in T ? T.q : 0), "V" in T) {
                if (T.V < 1 || T.V > 53) return null;
                "w" in T || (T.w = 1), "Z" in T ? (ue = Uu(jn(T.y, 0, 1)), Ve = ue.getUTCDay(), ue = Ve > 4 || Ve === 0 ? ga.ceil(ue) : ga(ue), ue = Qa.offset(ue, (T.V - 1) * 7), T.y = ue.getUTCFullYear(), T.m = ue.getUTCMonth(), T.d = ue.getUTCDate() + (T.w + 6) % 7) : (ue = qu(jn(T.y, 0, 1)), Ve = ue.getDay(), ue = Ve > 4 || Ve === 0 ? ya.ceil(ue) : ya(ue), ue = ci.offset(ue, (T.V - 1) * 7), T.y = ue.getFullYear(), T.m = ue.getMonth(), T.d = ue.getDate() + (T.w + 6) % 7)
            } else("W" in T || "U" in T) && ("w" in T || (T.w = "u" in T ? T.u % 7 : "W" in T ? 1 : 0), Ve = "Z" in T ? Uu(jn(T.y, 0, 1)).getUTCDay() : qu(jn(T.y, 0, 1)).getDay(), T.m = 0, T.d = "W" in T ? (T.w + 6) % 7 + T.W * 7 - (Ve + 5) % 7 : T.w + T.U * 7 - (Ve + 6) % 7);
            return "Z" in T ? (T.H += T.Z / 100 | 0, T.M += T.Z % 100, Uu(T)) : qu(T)
        }
    }

    function E(k, U, Y, T) {
        for (var We = 0, ue = U.length, Ve = Y.length, Ye, mr; We < ue;) {
            if (T >= Ve) return -1;
            if (Ye = U.charCodeAt(We++), Ye === 37) {
                if (Ye = U.charAt(We++), mr = w[Ye in Zv ? U.charAt(We++) : Ye], !mr || (T = mr(k, Y, T)) < 0) return -1
            } else if (Ye != Y.charCodeAt(T++)) return -1
        }
        return T
    }

    function _(k, U, Y) {
        var T = s.exec(U.slice(Y));
        return T ? (k.p = c.get(T[0].toLowerCase()), Y + T[0].length) : -1
    }

    function C(k, U, Y) {
        var T = p.exec(U.slice(Y));
        return T ? (k.w = h.get(T[0].toLowerCase()), Y + T[0].length) : -1
    }

    function j(k, U, Y) {
        var T = f.exec(U.slice(Y));
        return T ? (k.w = v.get(T[0].toLowerCase()), Y + T[0].length) : -1
    }

    function I(k, U, Y) {
        var T = g.exec(U.slice(Y));
        return T ? (k.m = b.get(T[0].toLowerCase()), Y + T[0].length) : -1
    }

    function R(k, U, Y) {
        var T = m.exec(U.slice(Y));
        return T ? (k.m = y.get(T[0].toLowerCase()), Y + T[0].length) : -1
    }

    function $(k, U, Y) {
        return E(k, t, U, Y)
    }

    function B(k, U, Y) {
        return E(k, r, U, Y)
    }

    function q(k, U, Y) {
        return E(k, n, U, Y)
    }

    function W(k) {
        return o[k.getDay()]
    }

    function V(k) {
        return a[k.getDay()]
    }

    function L(k) {
        return l[k.getMonth()]
    }

    function Me(k) {
        return u[k.getMonth()]
    }

    function Le(k) {
        return i[+(k.getHours() >= 12)]
    }

    function De(k) {
        return 1 + ~~(k.getMonth() / 3)
    }

    function Tt(k) {
        return o[k.getUTCDay()]
    }

    function Qe(k) {
        return a[k.getUTCDay()]
    }

    function hr(k) {
        return l[k.getUTCMonth()]
    }

    function Pn(k) {
        return u[k.getUTCMonth()]
    }

    function Ke(k) {
        return i[+(k.getUTCHours() >= 12)]
    }

    function ko(k) {
        return 1 + ~~(k.getUTCMonth() / 3)
    }
    return {
        format: function(k) {
            var U = O(k += "", x);
            return U.toString = function() {
                return k
            }, U
        },
        parse: function(k) {
            var U = S(k += "", !1);
            return U.toString = function() {
                return k
            }, U
        },
        utcFormat: function(k) {
            var U = O(k += "", P);
            return U.toString = function() {
                return k
            }, U
        },
        utcParse: function(k) {
            var U = S(k += "", !0);
            return U.toString = function() {
                return k
            }, U
        }
    }
}
var Zv = {
        "-": "",
        _: " ",
        0: "0"
    },
    ke = /^\s*\d+/,
    IE = /^%/,
    _E = /[\\^$*+?|[\]().{}]/g;

function Z(e, t, r) {
    var n = e < 0 ? "-" : "",
        i = (n ? -e : e) + "",
        a = i.length;
    return n + (a < r ? new Array(r - a + 1).join(t) + i : i)
}

function kE(e) {
    return e.replace(_E, "\\$&")
}

function In(e) {
    return new RegExp("^(?:" + e.map(kE).join("|") + ")", "i")
}

function _n(e) {
    return new Map(e.map((t, r) => [t.toLowerCase(), r]))
}

function CE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 1));
    return n ? (e.w = +n[0], r + n[0].length) : -1
}

function TE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 1));
    return n ? (e.u = +n[0], r + n[0].length) : -1
}

function ME(e, t, r) {
    var n = ke.exec(t.slice(r, r + 2));
    return n ? (e.U = +n[0], r + n[0].length) : -1
}

function DE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 2));
    return n ? (e.V = +n[0], r + n[0].length) : -1
}

function NE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 2));
    return n ? (e.W = +n[0], r + n[0].length) : -1
}

function Jv(e, t, r) {
    var n = ke.exec(t.slice(r, r + 4));
    return n ? (e.y = +n[0], r + n[0].length) : -1
}

function Qv(e, t, r) {
    var n = ke.exec(t.slice(r, r + 2));
    return n ? (e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3), r + n[0].length) : -1
}

function RE(e, t, r) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
    return n ? (e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), r + n[0].length) : -1
}

function $E(e, t, r) {
    var n = ke.exec(t.slice(r, r + 1));
    return n ? (e.q = n[0] * 3 - 3, r + n[0].length) : -1
}

function LE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 2));
    return n ? (e.m = n[0] - 1, r + n[0].length) : -1
}

function ep(e, t, r) {
    var n = ke.exec(t.slice(r, r + 2));
    return n ? (e.d = +n[0], r + n[0].length) : -1
}

function BE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 3));
    return n ? (e.m = 0, e.d = +n[0], r + n[0].length) : -1
}

function tp(e, t, r) {
    var n = ke.exec(t.slice(r, r + 2));
    return n ? (e.H = +n[0], r + n[0].length) : -1
}

function zE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 2));
    return n ? (e.M = +n[0], r + n[0].length) : -1
}

function KE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 2));
    return n ? (e.S = +n[0], r + n[0].length) : -1
}

function WE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 3));
    return n ? (e.L = +n[0], r + n[0].length) : -1
}

function FE(e, t, r) {
    var n = ke.exec(t.slice(r, r + 6));
    return n ? (e.L = Math.floor(n[0] / 1e3), r + n[0].length) : -1
}

function qE(e, t, r) {
    var n = IE.exec(t.slice(r, r + 1));
    return n ? r + n[0].length : -1
}

function UE(e, t, r) {
    var n = ke.exec(t.slice(r));
    return n ? (e.Q = +n[0], r + n[0].length) : -1
}

function HE(e, t, r) {
    var n = ke.exec(t.slice(r));
    return n ? (e.s = +n[0], r + n[0].length) : -1
}

function rp(e, t) {
    return Z(e.getDate(), t, 2)
}

function GE(e, t) {
    return Z(e.getHours(), t, 2)
}

function VE(e, t) {
    return Z(e.getHours() % 12 || 12, t, 2)
}

function YE(e, t) {
    return Z(1 + ci.count(Ft(e), e), t, 3)
}

function dg(e, t) {
    return Z(e.getMilliseconds(), t, 3)
}

function XE(e, t) {
    return dg(e, t) + "000"
}

function ZE(e, t) {
    return Z(e.getMonth() + 1, t, 2)
}

function JE(e, t) {
    return Z(e.getMinutes(), t, 2)
}

function QE(e, t) {
    return Z(e.getSeconds(), t, 2)
}

function ej(e) {
    var t = e.getDay();
    return t === 0 ? 7 : t
}

function tj(e, t) {
    return Z(eo.count(Ft(e) - 1, e), t, 2)
}

function vg(e) {
    var t = e.getDay();
    return t >= 4 || t === 0 ? Qr(e) : Qr.ceil(e)
}

function rj(e, t) {
    return e = vg(e), Z(Qr.count(Ft(e), e) + (Ft(e).getDay() === 4), t, 2)
}

function nj(e) {
    return e.getDay()
}

function ij(e, t) {
    return Z(ya.count(Ft(e) - 1, e), t, 2)
}

function aj(e, t) {
    return Z(e.getFullYear() % 100, t, 2)
}

function oj(e, t) {
    return e = vg(e), Z(e.getFullYear() % 100, t, 2)
}

function uj(e, t) {
    return Z(e.getFullYear() % 1e4, t, 4)
}

function lj(e, t) {
    var r = e.getDay();
    return e = r >= 4 || r === 0 ? Qr(e) : Qr.ceil(e), Z(e.getFullYear() % 1e4, t, 4)
}

function cj(e) {
    var t = e.getTimezoneOffset();
    return (t > 0 ? "-" : (t *= -1, "+")) + Z(t / 60 | 0, "0", 2) + Z(t % 60, "0", 2)
}

function np(e, t) {
    return Z(e.getUTCDate(), t, 2)
}

function sj(e, t) {
    return Z(e.getUTCHours(), t, 2)
}

function fj(e, t) {
    return Z(e.getUTCHours() % 12 || 12, t, 2)
}

function dj(e, t) {
    return Z(1 + Qa.count(qt(e), e), t, 3)
}

function pg(e, t) {
    return Z(e.getUTCMilliseconds(), t, 3)
}

function vj(e, t) {
    return pg(e, t) + "000"
}

function pj(e, t) {
    return Z(e.getUTCMonth() + 1, t, 2)
}

function hj(e, t) {
    return Z(e.getUTCMinutes(), t, 2)
}

function mj(e, t) {
    return Z(e.getUTCSeconds(), t, 2)
}

function yj(e) {
    var t = e.getUTCDay();
    return t === 0 ? 7 : t
}

function gj(e, t) {
    return Z(to.count(qt(e) - 1, e), t, 2)
}

function hg(e) {
    var t = e.getUTCDay();
    return t >= 4 || t === 0 ? en(e) : en.ceil(e)
}

function bj(e, t) {
    return e = hg(e), Z(en.count(qt(e), e) + (qt(e).getUTCDay() === 4), t, 2)
}

function xj(e) {
    return e.getUTCDay()
}

function wj(e, t) {
    return Z(ga.count(qt(e) - 1, e), t, 2)
}

function Pj(e, t) {
    return Z(e.getUTCFullYear() % 100, t, 2)
}

function Oj(e, t) {
    return e = hg(e), Z(e.getUTCFullYear() % 100, t, 2)
}

function Aj(e, t) {
    return Z(e.getUTCFullYear() % 1e4, t, 4)
}

function Sj(e, t) {
    var r = e.getUTCDay();
    return e = r >= 4 || r === 0 ? en(e) : en.ceil(e), Z(e.getUTCFullYear() % 1e4, t, 4)
}

function Ej() {
    return "+0000"
}

function ip() {
    return "%"
}

function ap(e) {
    return +e
}

function op(e) {
    return Math.floor(+e / 1e3)
}
var Kr, mg, yg;
jj({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function jj(e) {
    return Kr = jE(e), mg = Kr.format, Kr.parse, yg = Kr.utcFormat, Kr.utcParse, Kr
}

function Ij(e) {
    return new Date(e)
}

function _j(e) {
    return e instanceof Date ? +e : +new Date(+e)
}

function Qc(e, t, r, n, i, a, o, u, l, s) {
    var c = Bc(),
        f = c.invert,
        v = c.domain,
        p = s(".%L"),
        h = s(":%S"),
        m = s("%I:%M"),
        y = s("%I %p"),
        g = s("%a %d"),
        b = s("%b %d"),
        x = s("%B"),
        P = s("%Y");

    function w(O) {
        return (l(O) < O ? p : u(O) < O ? h : o(O) < O ? m : a(O) < O ? y : n(O) < O ? i(O) < O ? g : b : r(O) < O ? x : P)(O)
    }
    return c.invert = function(O) {
        return new Date(f(O))
    }, c.domain = function(O) {
        return arguments.length ? v(Array.from(O, _j)) : v().map(Ij)
    }, c.ticks = function(O) {
        var S = v();
        return e(S[0], S[S.length - 1], O ?? 10)
    }, c.tickFormat = function(O, S) {
        return S == null ? w : s(S)
    }, c.nice = function(O) {
        var S = v();
        return (!O || typeof O.range != "function") && (O = t(S[0], S[S.length - 1], O ?? 10)), O ? v(ng(S, O)) : c
    }, c.copy = function() {
        return li(c, Qc(e, t, r, n, i, a, o, u, l, s))
    }, c
}

function kj() {
    return ft.apply(Qc(SE, EE, Ft, Zc, eo, ci, Yc, Gc, Pr, mg).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments)
}

function Cj() {
    return ft.apply(Qc(OE, AE, qt, Jc, to, Qa, Xc, Vc, Pr, yg).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments)
}

function ro() {
    var e = 0,
        t = 1,
        r, n, i, a, o = ze,
        u = !1,
        l;

    function s(f) {
        return f == null || isNaN(f = +f) ? l : o(i === 0 ? .5 : (f = (a(f) - r) * i, u ? Math.max(0, Math.min(1, f)) : f))
    }
    s.domain = function(f) {
        return arguments.length ? ([e, t] = f, r = a(e = +e), n = a(t = +t), i = r === n ? 0 : 1 / (n - r), s) : [e, t]
    }, s.clamp = function(f) {
        return arguments.length ? (u = !!f, s) : u
    }, s.interpolator = function(f) {
        return arguments.length ? (o = f, s) : o
    };

    function c(f) {
        return function(v) {
            var p, h;
            return arguments.length ? ([p, h] = v, o = f(p, h), s) : [o(0), o(1)]
        }
    }
    return s.range = c(tn), s.rangeRound = c(Lc), s.unknown = function(f) {
            return arguments.length ? (l = f, s) : l
        },
        function(f) {
            return a = f, r = f(e), n = f(t), i = r === n ? 0 : 1 / (n - r), s
        }
}

function vr(e, t) {
    return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown())
}

function gg() {
    var e = dr(ro()(ze));
    return e.copy = function() {
        return vr(e, gg())
    }, Xt.apply(e, arguments)
}

function bg() {
    var e = Wc(ro()).domain([1, 10]);
    return e.copy = function() {
        return vr(e, bg()).base(e.base())
    }, Xt.apply(e, arguments)
}

function xg() {
    var e = Fc(ro());
    return e.copy = function() {
        return vr(e, xg()).constant(e.constant())
    }, Xt.apply(e, arguments)
}

function es() {
    var e = qc(ro());
    return e.copy = function() {
        return vr(e, es()).exponent(e.exponent())
    }, Xt.apply(e, arguments)
}

function Tj() {
    return es.apply(null, arguments).exponent(.5)
}

function wg() {
    var e = [],
        t = ze;

    function r(n) {
        if (n != null && !isNaN(n = +n)) return t((oi(e, n, 1) - 1) / (e.length - 1))
    }
    return r.domain = function(n) {
        if (!arguments.length) return e.slice();
        e = [];
        for (let i of n) i != null && !isNaN(i = +i) && e.push(i);
        return e.sort(ar), r
    }, r.interpolator = function(n) {
        return arguments.length ? (t = n, r) : t
    }, r.range = function() {
        return e.map((n, i) => t(i / (e.length - 1)))
    }, r.quantiles = function(n) {
        return Array.from({
            length: n + 1
        }, (i, a) => yS(e, a / n))
    }, r.copy = function() {
        return wg(t).domain(e)
    }, Xt.apply(r, arguments)
}

function no() {
    var e = 0,
        t = .5,
        r = 1,
        n = 1,
        i, a, o, u, l, s = ze,
        c, f = !1,
        v;

    function p(m) {
        return isNaN(m = +m) ? v : (m = .5 + ((m = +c(m)) - a) * (n * m < n * a ? u : l), s(f ? Math.max(0, Math.min(1, m)) : m))
    }
    p.domain = function(m) {
        return arguments.length ? ([e, t, r] = m, i = c(e = +e), a = c(t = +t), o = c(r = +r), u = i === a ? 0 : .5 / (a - i), l = a === o ? 0 : .5 / (o - a), n = a < i ? -1 : 1, p) : [e, t, r]
    }, p.clamp = function(m) {
        return arguments.length ? (f = !!m, p) : f
    }, p.interpolator = function(m) {
        return arguments.length ? (s = m, p) : s
    };

    function h(m) {
        return function(y) {
            var g, b, x;
            return arguments.length ? ([g, b, x] = y, s = qS(m, [g, b, x]), p) : [s(0), s(.5), s(1)]
        }
    }
    return p.range = h(tn), p.rangeRound = h(Lc), p.unknown = function(m) {
            return arguments.length ? (v = m, p) : v
        },
        function(m) {
            return c = m, i = m(e), a = m(t), o = m(r), u = i === a ? 0 : .5 / (a - i), l = a === o ? 0 : .5 / (o - a), n = a < i ? -1 : 1, p
        }
}

function Pg() {
    var e = dr(no()(ze));
    return e.copy = function() {
        return vr(e, Pg())
    }, Xt.apply(e, arguments)
}

function Og() {
    var e = Wc(no()).domain([.1, 1, 10]);
    return e.copy = function() {
        return vr(e, Og()).base(e.base())
    }, Xt.apply(e, arguments)
}

function Ag() {
    var e = Fc(no());
    return e.copy = function() {
        return vr(e, Ag()).constant(e.constant())
    }, Xt.apply(e, arguments)
}

function ts() {
    var e = qc(no());
    return e.copy = function() {
        return vr(e, ts()).exponent(e.exponent())
    }, Xt.apply(e, arguments)
}

function Mj() {
    return ts.apply(null, arguments).exponent(.5)
}
const Tn = Object.freeze(Object.defineProperty({
    __proto__: null,
    scaleBand: Nc,
    scaleDiverging: Pg,
    scaleDivergingLog: Og,
    scaleDivergingPow: ts,
    scaleDivergingSqrt: Mj,
    scaleDivergingSymlog: Ag,
    scaleIdentity: rg,
    scaleImplicit: Kl,
    scaleLinear: tg,
    scaleLog: ig,
    scaleOrdinal: Dc,
    scalePoint: xS,
    scalePow: Uc,
    scaleQuantile: ug,
    scaleQuantize: lg,
    scaleRadial: og,
    scaleSequential: gg,
    scaleSequentialLog: bg,
    scaleSequentialPow: es,
    scaleSequentialQuantile: wg,
    scaleSequentialSqrt: Tj,
    scaleSequentialSymlog: xg,
    scaleSqrt: vE,
    scaleSymlog: ag,
    scaleThreshold: cg,
    scaleTime: kj,
    scaleUtc: Cj,
    tickFormat: eg
}, Symbol.toStringTag, {
    value: "Module"
}));
var Zt = e => e.chartData,
    si = A([Zt], e => {
        var t = e.chartData != null ? e.chartData.length - 1 : 0;
        return {
            chartData: e.chartData,
            computedData: e.computedData,
            dataEndIndex: t,
            dataStartIndex: 0
        }
    }),
    io = (e, t, r, n) => n ? si(e) : Zt(e),
    Sg = (e, t, r) => r ? si(e) : Zt(e);

function or(e) {
    if (Array.isArray(e) && e.length === 2) {
        var [t, r] = e;
        if (ae(t) && ae(r)) return !0
    }
    return !1
}

function up(e, t, r) {
    return r ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])]
}

function Eg(e, t) {
    if (t && typeof e != "function" && Array.isArray(e) && e.length === 2) {
        var [r, n] = e, i, a;
        if (ae(r)) i = r;
        else if (typeof r == "function") return;
        if (ae(n)) a = n;
        else if (typeof n == "function") return;
        var o = [i, a];
        if (or(o)) return o
    }
}

function Dj(e, t, r) {
    if (!(!r && t == null)) {
        if (typeof e == "function" && t != null) try {
            var n = e(t, r);
            if (or(n)) return up(n, t, r)
        } catch {}
        if (Array.isArray(e) && e.length === 2) {
            var [i, a] = e, o, u;
            if (i === "auto") t != null && (o = Math.min(...t));
            else if (D(i)) o = i;
            else if (typeof i == "function") try {
                t != null && (o = i(t ?.[0]))
            } catch {} else if (typeof i == "string" && Ad.test(i)) {
                var l = Ad.exec(i);
                if (l == null || l[1] == null || t == null) o = void 0;
                else {
                    var s = +l[1];
                    o = t[0] - s
                }
            } else o = t ?.[0];
            if (a === "auto") t != null && (u = Math.max(...t));
            else if (D(a)) u = a;
            else if (typeof a == "function") try {
                t != null && (u = a(t ?.[1]))
            } catch {} else if (typeof a == "string" && Sd.test(a)) {
                var c = Sd.exec(a);
                if (c == null || c[1] == null || t == null) u = void 0;
                else {
                    var f = +c[1];
                    u = t[1] + f
                }
            } else u = t ?.[1];
            var v = [o, u];
            if (or(v)) return t == null ? v : up(v, t, r)
        }
    }
}
var rn = 1e9,
    Nj = {
        precision: 20,
        rounding: 4,
        toExpNeg: -7,
        toExpPos: 21,
        LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286"
    },
    ns, fe = !0,
    ut = "[DecimalError] ",
    Ir = ut + "Invalid argument: ",
    rs = ut + "Exponent out of range: ",
    nn = Math.floor,
    br = Math.pow,
    Rj = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
    Xe, Ie = 1e7,
    ce = 7,
    jg = 9007199254740991,
    ba = nn(jg / ce),
    N = {};
N.absoluteValue = N.abs = function() {
    var e = new this.constructor(this);
    return e.s && (e.s = 1), e
};
N.comparedTo = N.cmp = function(e) {
    var t, r, n, i, a = this;
    if (e = new a.constructor(e), a.s !== e.s) return a.s || -e.s;
    if (a.e !== e.e) return a.e > e.e ^ a.s < 0 ? 1 : -1;
    for (n = a.d.length, i = e.d.length, t = 0, r = n < i ? n : i; t < r; ++t)
        if (a.d[t] !== e.d[t]) return a.d[t] > e.d[t] ^ a.s < 0 ? 1 : -1;
    return n === i ? 0 : n > i ^ a.s < 0 ? 1 : -1
};
N.decimalPlaces = N.dp = function() {
    var e = this,
        t = e.d.length - 1,
        r = (t - e.e) * ce;
    if (t = e.d[t], t)
        for (; t % 10 == 0; t /= 10) r--;
    return r < 0 ? 0 : r
};
N.dividedBy = N.div = function(e) {
    return Lt(this, new this.constructor(e))
};
N.dividedToIntegerBy = N.idiv = function(e) {
    var t = this,
        r = t.constructor;
    return ne(Lt(t, new r(e), 0, 1), r.precision)
};
N.equals = N.eq = function(e) {
    return !this.cmp(e)
};
N.exponent = function() {
    return xe(this)
};
N.greaterThan = N.gt = function(e) {
    return this.cmp(e) > 0
};
N.greaterThanOrEqualTo = N.gte = function(e) {
    return this.cmp(e) >= 0
};
N.isInteger = N.isint = function() {
    return this.e > this.d.length - 2
};
N.isNegative = N.isneg = function() {
    return this.s < 0
};
N.isPositive = N.ispos = function() {
    return this.s > 0
};
N.isZero = function() {
    return this.s === 0
};
N.lessThan = N.lt = function(e) {
    return this.cmp(e) < 0
};
N.lessThanOrEqualTo = N.lte = function(e) {
    return this.cmp(e) < 1
};
N.logarithm = N.log = function(e) {
    var t, r = this,
        n = r.constructor,
        i = n.precision,
        a = i + 5;
    if (e === void 0) e = new n(10);
    else if (e = new n(e), e.s < 1 || e.eq(Xe)) throw Error(ut + "NaN");
    if (r.s < 1) throw Error(ut + (r.s ? "NaN" : "-Infinity"));
    return r.eq(Xe) ? new n(0) : (fe = !1, t = Lt(Un(r, a), Un(e, a), a), fe = !0, ne(t, i))
};
N.minus = N.sub = function(e) {
    var t = this;
    return e = new t.constructor(e), t.s == e.s ? kg(t, e) : Ig(t, (e.s = -e.s, e))
};
N.modulo = N.mod = function(e) {
    var t, r = this,
        n = r.constructor,
        i = n.precision;
    if (e = new n(e), !e.s) throw Error(ut + "NaN");
    return r.s ? (fe = !1, t = Lt(r, e, 0, 1).times(e), fe = !0, r.minus(t)) : ne(new n(r), i)
};
N.naturalExponential = N.exp = function() {
    return _g(this)
};
N.naturalLogarithm = N.ln = function() {
    return Un(this)
};
N.negated = N.neg = function() {
    var e = new this.constructor(this);
    return e.s = -e.s || 0, e
};
N.plus = N.add = function(e) {
    var t = this;
    return e = new t.constructor(e), t.s == e.s ? Ig(t, e) : kg(t, (e.s = -e.s, e))
};
N.precision = N.sd = function(e) {
    var t, r, n, i = this;
    if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(Ir + e);
    if (t = xe(i) + 1, n = i.d.length - 1, r = n * ce + 1, n = i.d[n], n) {
        for (; n % 10 == 0; n /= 10) r--;
        for (n = i.d[0]; n >= 10; n /= 10) r++
    }
    return e && t > r ? t : r
};
N.squareRoot = N.sqrt = function() {
    var e, t, r, n, i, a, o, u = this,
        l = u.constructor;
    if (u.s < 1) {
        if (!u.s) return new l(0);
        throw Error(ut + "NaN")
    }
    for (e = xe(u), fe = !1, i = Math.sqrt(+u), i == 0 || i == 1 / 0 ? (t = Pt(u.d), (t.length + e) % 2 == 0 && (t += "0"), i = Math.sqrt(t), e = nn((e + 1) / 2) - (e < 0 || e % 2), i == 1 / 0 ? t = "5e" + e : (t = i.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), n = new l(t)) : n = new l(i.toString()), r = l.precision, i = o = r + 3;;)
        if (a = n, n = a.plus(Lt(u, a, o + 2)).times(.5), Pt(a.d).slice(0, o) === (t = Pt(n.d)).slice(0, o)) {
            if (t = t.slice(o - 3, o + 1), i == o && t == "4999") {
                if (ne(a, r + 1, 0), a.times(a).eq(u)) {
                    n = a;
                    break
                }
            } else if (t != "9999") break;
            o += 4
        }
    return fe = !0, ne(n, r)
};
N.times = N.mul = function(e) {
    var t, r, n, i, a, o, u, l, s, c = this,
        f = c.constructor,
        v = c.d,
        p = (e = new f(e)).d;
    if (!c.s || !e.s) return new f(0);
    for (e.s *= c.s, r = c.e + e.e, l = v.length, s = p.length, l < s && (a = v, v = p, p = a, o = l, l = s, s = o), a = [], o = l + s, n = o; n--;) a.push(0);
    for (n = s; --n >= 0;) {
        for (t = 0, i = l + n; i > n;) u = a[i] + p[n] * v[i - n - 1] + t, a[i--] = u % Ie | 0, t = u / Ie | 0;
        a[i] = (a[i] + t) % Ie | 0
    }
    for (; !a[--o];) a.pop();
    return t ? ++r : a.shift(), e.d = a, e.e = r, fe ? ne(e, f.precision) : e
};
N.toDecimalPlaces = N.todp = function(e, t) {
    var r = this,
        n = r.constructor;
    return r = new n(r), e === void 0 ? r : (It(e, 0, rn), t === void 0 ? t = n.rounding : It(t, 0, 8), ne(r, e + xe(r) + 1, t))
};
N.toExponential = function(e, t) {
    var r, n = this,
        i = n.constructor;
    return e === void 0 ? r = Dr(n, !0) : (It(e, 0, rn), t === void 0 ? t = i.rounding : It(t, 0, 8), n = ne(new i(n), e + 1, t), r = Dr(n, !0, e + 1)), r
};
N.toFixed = function(e, t) {
    var r, n, i = this,
        a = i.constructor;
    return e === void 0 ? Dr(i) : (It(e, 0, rn), t === void 0 ? t = a.rounding : It(t, 0, 8), n = ne(new a(i), e + xe(i) + 1, t), r = Dr(n.abs(), !1, e + xe(n) + 1), i.isneg() && !i.isZero() ? "-" + r : r)
};
N.toInteger = N.toint = function() {
    var e = this,
        t = e.constructor;
    return ne(new t(e), xe(e) + 1, t.rounding)
};
N.toNumber = function() {
    return +this
};
N.toPower = N.pow = function(e) {
    var t, r, n, i, a, o, u = this,
        l = u.constructor,
        s = 12,
        c = +(e = new l(e));
    if (!e.s) return new l(Xe);
    if (u = new l(u), !u.s) {
        if (e.s < 1) throw Error(ut + "Infinity");
        return u
    }
    if (u.eq(Xe)) return u;
    if (n = l.precision, e.eq(Xe)) return ne(u, n);
    if (t = e.e, r = e.d.length - 1, o = t >= r, a = u.s, o) {
        if ((r = c < 0 ? -c : c) <= jg) {
            for (i = new l(Xe), t = Math.ceil(n / ce + 4), fe = !1; r % 2 && (i = i.times(u), cp(i.d, t)), r = nn(r / 2), r !== 0;) u = u.times(u), cp(u.d, t);
            return fe = !0, e.s < 0 ? new l(Xe).div(i) : ne(i, n)
        }
    } else if (a < 0) throw Error(ut + "NaN");
    return a = a < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1, u.s = 1, fe = !1, i = e.times(Un(u, n + s)), fe = !0, i = _g(i), i.s = a, i
};
N.toPrecision = function(e, t) {
    var r, n, i = this,
        a = i.constructor;
    return e === void 0 ? (r = xe(i), n = Dr(i, r <= a.toExpNeg || r >= a.toExpPos)) : (It(e, 1, rn), t === void 0 ? t = a.rounding : It(t, 0, 8), i = ne(new a(i), e, t), r = xe(i), n = Dr(i, e <= r || r <= a.toExpNeg, e)), n
};
N.toSignificantDigits = N.tosd = function(e, t) {
    var r = this,
        n = r.constructor;
    return e === void 0 ? (e = n.precision, t = n.rounding) : (It(e, 1, rn), t === void 0 ? t = n.rounding : It(t, 0, 8)), ne(new n(r), e, t)
};
N.toString = N.valueOf = N.val = N.toJSON = N[Symbol.for("nodejs.util.inspect.custom")] = function() {
    var e = this,
        t = xe(e),
        r = e.constructor;
    return Dr(e, t <= r.toExpNeg || t >= r.toExpPos)
};

function Ig(e, t) {
    var r, n, i, a, o, u, l, s, c = e.constructor,
        f = c.precision;
    if (!e.s || !t.s) return t.s || (t = new c(e)), fe ? ne(t, f) : t;
    if (l = e.d, s = t.d, o = e.e, i = t.e, l = l.slice(), a = o - i, a) {
        for (a < 0 ? (n = l, a = -a, u = s.length) : (n = s, i = o, u = l.length), o = Math.ceil(f / ce), u = o > u ? o + 1 : u + 1, a > u && (a = u, n.length = 1), n.reverse(); a--;) n.push(0);
        n.reverse()
    }
    for (u = l.length, a = s.length, u - a < 0 && (a = u, n = s, s = l, l = n), r = 0; a;) r = (l[--a] = l[a] + s[a] + r) / Ie | 0, l[a] %= Ie;
    for (r && (l.unshift(r), ++i), u = l.length; l[--u] == 0;) l.pop();
    return t.d = l, t.e = i, fe ? ne(t, f) : t
}

function It(e, t, r) {
    if (e !== ~~e || e < t || e > r) throw Error(Ir + e)
}

function Pt(e) {
    var t, r, n, i = e.length - 1,
        a = "",
        o = e[0];
    if (i > 0) {
        for (a += o, t = 1; t < i; t++) n = e[t] + "", r = ce - n.length, r && (a += tr(r)), a += n;
        o = e[t], n = o + "", r = ce - n.length, r && (a += tr(r))
    } else if (o === 0) return "0";
    for (; o % 10 === 0;) o /= 10;
    return a + o
}
var Lt = (function() {
    function e(n, i) {
        var a, o = 0,
            u = n.length;
        for (n = n.slice(); u--;) a = n[u] * i + o, n[u] = a % Ie | 0, o = a / Ie | 0;
        return o && n.unshift(o), n
    }

    function t(n, i, a, o) {
        var u, l;
        if (a != o) l = a > o ? 1 : -1;
        else
            for (u = l = 0; u < a; u++)
                if (n[u] != i[u]) {
                    l = n[u] > i[u] ? 1 : -1;
                    break
                } return l
    }

    function r(n, i, a) {
        for (var o = 0; a--;) n[a] -= o, o = n[a] < i[a] ? 1 : 0, n[a] = o * Ie + n[a] - i[a];
        for (; !n[0] && n.length > 1;) n.shift()
    }
    return function(n, i, a, o) {
        var u, l, s, c, f, v, p, h, m, y, g, b, x, P, w, O, S, E, _ = n.constructor,
            C = n.s == i.s ? 1 : -1,
            j = n.d,
            I = i.d;
        if (!n.s) return new _(n);
        if (!i.s) throw Error(ut + "Division by zero");
        for (l = n.e - i.e, S = I.length, w = j.length, p = new _(C), h = p.d = [], s = 0; I[s] == (j[s] || 0);) ++s;
        if (I[s] > (j[s] || 0) && --l, a == null ? b = a = _.precision : o ? b = a + (xe(n) - xe(i)) + 1 : b = a, b < 0) return new _(0);
        if (b = b / ce + 2 | 0, s = 0, S == 1)
            for (c = 0, I = I[0], b++;
                (s < w || c) && b--; s++) x = c * Ie + (j[s] || 0), h[s] = x / I | 0, c = x % I | 0;
        else {
            for (c = Ie / (I[0] + 1) | 0, c > 1 && (I = e(I, c), j = e(j, c), S = I.length, w = j.length), P = S, m = j.slice(0, S), y = m.length; y < S;) m[y++] = 0;
            E = I.slice(), E.unshift(0), O = I[0], I[1] >= Ie / 2 && ++O;
            do c = 0, u = t(I, m, S, y), u < 0 ? (g = m[0], S != y && (g = g * Ie + (m[1] || 0)), c = g / O | 0, c > 1 ? (c >= Ie && (c = Ie - 1), f = e(I, c), v = f.length, y = m.length, u = t(f, m, v, y), u == 1 && (c--, r(f, S < v ? E : I, v))) : (c == 0 && (u = c = 1), f = I.slice()), v = f.length, v < y && f.unshift(0), r(m, f, y), u == -1 && (y = m.length, u = t(I, m, S, y), u < 1 && (c++, r(m, S < y ? E : I, y))), y = m.length) : u === 0 && (c++, m = [0]), h[s++] = c, u && m[0] ? m[y++] = j[P] || 0 : (m = [j[P]], y = 1); while ((P++ < w || m[0] !== void 0) && b--)
        }
        return h[0] || h.shift(), p.e = l, ne(p, o ? a + xe(p) + 1 : a)
    }
})();

function _g(e, t) {
    var r, n, i, a, o, u, l = 0,
        s = 0,
        c = e.constructor,
        f = c.precision;
    if (xe(e) > 16) throw Error(rs + xe(e));
    if (!e.s) return new c(Xe);
    for (fe = !1, u = f, o = new c(.03125); e.abs().gte(.1);) e = e.times(o), s += 5;
    for (n = Math.log(br(2, s)) / Math.LN10 * 2 + 5 | 0, u += n, r = i = a = new c(Xe), c.precision = u;;) {
        if (i = ne(i.times(e), u), r = r.times(++l), o = a.plus(Lt(i, r, u)), Pt(o.d).slice(0, u) === Pt(a.d).slice(0, u)) {
            for (; s--;) a = ne(a.times(a), u);
            return c.precision = f, t == null ? (fe = !0, ne(a, f)) : a
        }
        a = o
    }
}

function xe(e) {
    for (var t = e.e * ce, r = e.d[0]; r >= 10; r /= 10) t++;
    return t
}

function Hu(e, t, r) {
    if (t > e.LN10.sd()) throw fe = !0, r && (e.precision = r), Error(ut + "LN10 precision limit exceeded");
    return ne(new e(e.LN10), t)
}

function tr(e) {
    for (var t = ""; e--;) t += "0";
    return t
}

function Un(e, t) {
    var r, n, i, a, o, u, l, s, c, f = 1,
        v = 10,
        p = e,
        h = p.d,
        m = p.constructor,
        y = m.precision;
    if (p.s < 1) throw Error(ut + (p.s ? "NaN" : "-Infinity"));
    if (p.eq(Xe)) return new m(0);
    if (t == null ? (fe = !1, s = y) : s = t, p.eq(10)) return t == null && (fe = !0), Hu(m, s);
    if (s += v, m.precision = s, r = Pt(h), n = r.charAt(0), a = xe(p), Math.abs(a) < 15e14) {
        for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3;) p = p.times(e), r = Pt(p.d), n = r.charAt(0), f++;
        a = xe(p), n > 1 ? (p = new m("0." + r), a++) : p = new m(n + "." + r.slice(1))
    } else return l = Hu(m, s + 2, y).times(a + ""), p = Un(new m(n + "." + r.slice(1)), s - v).plus(l), m.precision = y, t == null ? (fe = !0, ne(p, y)) : p;
    for (u = o = p = Lt(p.minus(Xe), p.plus(Xe), s), c = ne(p.times(p), s), i = 3;;) {
        if (o = ne(o.times(c), s), l = u.plus(Lt(o, new m(i), s)), Pt(l.d).slice(0, s) === Pt(u.d).slice(0, s)) return u = u.times(2), a !== 0 && (u = u.plus(Hu(m, s + 2, y).times(a + ""))), u = Lt(u, new m(f), s), m.precision = y, t == null ? (fe = !0, ne(u, y)) : u;
        u = l, i += 2
    }
}

function lp(e, t) {
    var r, n, i;
    for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48;) ++n;
    for (i = t.length; t.charCodeAt(i - 1) === 48;) --i;
    if (t = t.slice(n, i), t) {
        if (i -= n, r = r - n - 1, e.e = nn(r / ce), e.d = [], n = (r + 1) % ce, r < 0 && (n += ce), n < i) {
            for (n && e.d.push(+t.slice(0, n)), i -= ce; n < i;) e.d.push(+t.slice(n, n += ce));
            t = t.slice(n), n = ce - t.length
        } else n -= i;
        for (; n--;) t += "0";
        if (e.d.push(+t), fe && (e.e > ba || e.e < -ba)) throw Error(rs + r)
    } else e.s = 0, e.e = 0, e.d = [0];
    return e
}

function ne(e, t, r) {
    var n, i, a, o, u, l, s, c, f = e.d;
    for (o = 1, a = f[0]; a >= 10; a /= 10) o++;
    if (n = t - o, n < 0) n += ce, i = t, s = f[c = 0];
    else {
        if (c = Math.ceil((n + 1) / ce), a = f.length, c >= a) return e;
        for (s = a = f[c], o = 1; a >= 10; a /= 10) o++;
        n %= ce, i = n - ce + o
    }
    if (r !== void 0 && (a = br(10, o - i - 1), u = s / a % 10 | 0, l = t < 0 || f[c + 1] !== void 0 || s % a, l = r < 4 ? (u || l) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : u > 5 || u == 5 && (r == 4 || l || r == 6 && (n > 0 ? i > 0 ? s / br(10, o - i) : 0 : f[c - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7))), t < 1 || !f[0]) return l ? (a = xe(e), f.length = 1, t = t - a - 1, f[0] = br(10, (ce - t % ce) % ce), e.e = nn(-t / ce) || 0) : (f.length = 1, f[0] = e.e = e.s = 0), e;
    if (n == 0 ? (f.length = c, a = 1, c--) : (f.length = c + 1, a = br(10, ce - n), f[c] = i > 0 ? (s / br(10, o - i) % br(10, i) | 0) * a : 0), l)
        for (;;)
            if (c == 0) {
                (f[0] += a) == Ie && (f[0] = 1, ++e.e);
                break
            } else {
                if (f[c] += a, f[c] != Ie) break;
                f[c--] = 0, a = 1
            }
    for (n = f.length; f[--n] === 0;) f.pop();
    if (fe && (e.e > ba || e.e < -ba)) throw Error(rs + xe(e));
    return e
}

function kg(e, t) {
    var r, n, i, a, o, u, l, s, c, f, v = e.constructor,
        p = v.precision;
    if (!e.s || !t.s) return t.s ? t.s = -t.s : t = new v(e), fe ? ne(t, p) : t;
    if (l = e.d, f = t.d, n = t.e, s = e.e, l = l.slice(), o = s - n, o) {
        for (c = o < 0, c ? (r = l, o = -o, u = f.length) : (r = f, n = s, u = l.length), i = Math.max(Math.ceil(p / ce), u) + 2, o > i && (o = i, r.length = 1), r.reverse(), i = o; i--;) r.push(0);
        r.reverse()
    } else {
        for (i = l.length, u = f.length, c = i < u, c && (u = i), i = 0; i < u; i++)
            if (l[i] != f[i]) {
                c = l[i] < f[i];
                break
            }
        o = 0
    }
    for (c && (r = l, l = f, f = r, t.s = -t.s), u = l.length, i = f.length - u; i > 0; --i) l[u++] = 0;
    for (i = f.length; i > o;) {
        if (l[--i] < f[i]) {
            for (a = i; a && l[--a] === 0;) l[a] = Ie - 1;
            --l[a], l[i] += Ie
        }
        l[i] -= f[i]
    }
    for (; l[--u] === 0;) l.pop();
    for (; l[0] === 0; l.shift()) --n;
    return l[0] ? (t.d = l, t.e = n, fe ? ne(t, p) : t) : new v(0)
}

function Dr(e, t, r) {
    var n, i = xe(e),
        a = Pt(e.d),
        o = a.length;
    return t ? (r && (n = r - o) > 0 ? a = a.charAt(0) + "." + a.slice(1) + tr(n) : o > 1 && (a = a.charAt(0) + "." + a.slice(1)), a = a + (i < 0 ? "e" : "e+") + i) : i < 0 ? (a = "0." + tr(-i - 1) + a, r && (n = r - o) > 0 && (a += tr(n))) : i >= o ? (a += tr(i + 1 - o), r && (n = r - i - 1) > 0 && (a = a + "." + tr(n))) : ((n = i + 1) < o && (a = a.slice(0, n) + "." + a.slice(n)), r && (n = r - o) > 0 && (i + 1 === o && (a += "."), a += tr(n))), e.s < 0 ? "-" + a : a
}

function cp(e, t) {
    if (e.length > t) return e.length = t, !0
}

function Cg(e) {
    var t, r, n;

    function i(a) {
        var o = this;
        if (!(o instanceof i)) return new i(a);
        if (o.constructor = i, a instanceof i) {
            o.s = a.s, o.e = a.e, o.d = (a = a.d) ? a.slice() : a;
            return
        }
        if (typeof a == "number") {
            if (a * 0 !== 0) throw Error(Ir + a);
            if (a > 0) o.s = 1;
            else if (a < 0) a = -a, o.s = -1;
            else {
                o.s = 0, o.e = 0, o.d = [0];
                return
            }
            if (a === ~~a && a < 1e7) {
                o.e = 0, o.d = [a];
                return
            }
            return lp(o, a.toString())
        } else if (typeof a != "string") throw Error(Ir + a);
        if (a.charCodeAt(0) === 45 ? (a = a.slice(1), o.s = -1) : o.s = 1, Rj.test(a)) lp(o, a);
        else throw Error(Ir + a)
    }
    if (i.prototype = N, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.clone = Cg, i.config = i.set = $j, e === void 0 && (e = {}), e)
        for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], t = 0; t < n.length;) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
    return i.config(e), i
}

function $j(e) {
    if (!e || typeof e != "object") throw Error(ut + "Object expected");
    var t, r, n, i = ["precision", 1, rn, "rounding", 0, 8, "toExpNeg", -1 / 0, 0, "toExpPos", 0, 1 / 0];
    for (t = 0; t < i.length; t += 3)
        if ((n = e[r = i[t]]) !== void 0)
            if (nn(n) === n && n >= i[t + 1] && n <= i[t + 2]) this[r] = n;
            else throw Error(Ir + r + ": " + n);
    if ((n = e[r = "LN10"]) !== void 0)
        if (n == Math.LN10) this[r] = new this(n);
        else throw Error(Ir + r + ": " + n);
    return this
}
var ns = Cg(Nj);
Xe = new ns(1);
const Q = ns;
var Lj = e => e,
    Tg = {},
    Mg = e => e === Tg,
    sp = e => function t() {
        return arguments.length === 0 || arguments.length === 1 && Mg(arguments.length <= 0 ? void 0 : arguments[0]) ? t : e(...arguments)
    },
    Dg = (e, t) => e === 1 ? t : sp(function() {
        for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++) n[i] = arguments[i];
        var a = n.filter(o => o !== Tg).length;
        return a >= e ? t(...n) : Dg(e - a, sp(function() {
            for (var o = arguments.length, u = new Array(o), l = 0; l < o; l++) u[l] = arguments[l];
            var s = n.map(c => Mg(c) ? u.shift() : c);
            return t(...s, ...u)
        }))
    }),
    Bj = e => Dg(e.length, e),
    Ul = (e, t) => {
        for (var r = [], n = e; n < t; ++n) r[n - e] = n;
        return r
    },
    zj = Bj((e, t) => Array.isArray(t) ? t.map(e) : Object.keys(t).map(r => t[r]).map(e)),
    Kj = function() {
        for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
        if (!r.length) return Lj;
        var i = r.reverse(),
            a = i[0],
            o = i.slice(1);
        return function() {
            return o.reduce((u, l) => l(u), a(...arguments))
        }
    };

function Ng(e) {
    var t;
    return e === 0 ? t = 1 : t = Math.floor(new Q(e).abs().log(10).toNumber()) + 1, t
}

function Rg(e, t, r) {
    for (var n = new Q(e), i = 0, a = []; n.lt(t) && i < 1e5;) a.push(n.toNumber()), n = n.add(r), i++;
    return a
}
var $g = e => {
        var [t, r] = e, [n, i] = [t, r];
        return t > r && ([n, i] = [r, t]), [n, i]
    },
    Lg = (e, t, r) => {
        if (e.lte(0)) return new Q(0);
        var n = Ng(e.toNumber()),
            i = new Q(10).pow(n),
            a = e.div(i),
            o = n !== 1 ? .05 : .1,
            u = new Q(Math.ceil(a.div(o).toNumber())).add(r).mul(o),
            l = u.mul(i);
        return t ? new Q(l.toNumber()) : new Q(Math.ceil(l.toNumber()))
    },
    Wj = (e, t, r) => {
        var n = new Q(1),
            i = new Q(e);
        if (!i.isint() && r) {
            var a = Math.abs(e);
            a < 1 ? (n = new Q(10).pow(Ng(e) - 1), i = new Q(Math.floor(i.div(n).toNumber())).mul(n)) : a > 1 && (i = new Q(Math.floor(e)))
        } else e === 0 ? i = new Q(Math.floor((t - 1) / 2)) : r || (i = new Q(Math.floor(e)));
        var o = Math.floor((t - 1) / 2),
            u = Kj(zj(l => i.add(new Q(l - o).mul(n)).toNumber()), Ul);
        return u(0, t)
    },
    Bg = function(t, r, n, i) {
        var a = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0;
        if (!Number.isFinite((r - t) / (n - 1))) return {
            step: new Q(0),
            tickMin: new Q(0),
            tickMax: new Q(0)
        };
        var o = Lg(new Q(r).sub(t).div(n - 1), i, a),
            u;
        t <= 0 && r >= 0 ? u = new Q(0) : (u = new Q(t).add(r).div(2), u = u.sub(new Q(u).mod(o)));
        var l = Math.ceil(u.sub(t).div(o).toNumber()),
            s = Math.ceil(new Q(r).sub(u).div(o).toNumber()),
            c = l + s + 1;
        return c > n ? Bg(t, r, n, i, a + 1) : (c < n && (s = r > 0 ? s + (n - c) : s, l = r > 0 ? l : l + (n - c)), {
            step: o,
            tickMin: u.sub(new Q(l).mul(o)),
            tickMax: u.add(new Q(s).mul(o))
        })
    },
    Fj = function(t) {
        var [r, n] = t, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, o = Math.max(i, 2), [u, l] = $g([r, n]);
        if (u === -1 / 0 || l === 1 / 0) {
            var s = l === 1 / 0 ? [u, ...Ul(0, i - 1).map(() => 1 / 0)] : [...Ul(0, i - 1).map(() => -1 / 0), l];
            return r > n ? s.reverse() : s
        }
        if (u === l) return Wj(u, i, a);
        var {
            step: c,
            tickMin: f,
            tickMax: v
        } = Bg(u, l, o, a, 0), p = Rg(f, v.add(new Q(.1).mul(c)), c);
        return r > n ? p.reverse() : p
    },
    qj = function(t, r) {
        var [n, i] = t, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, [o, u] = $g([n, i]);
        if (o === -1 / 0 || u === 1 / 0) return [n, i];
        if (o === u) return [o];
        var l = Math.max(r, 2),
            s = Lg(new Q(u).sub(o).div(l - 1), a, 0),
            c = [...Rg(new Q(o), new Q(u), s), u];
        return a === !1 && (c = c.map(f => Math.round(f))), n > i ? c.reverse() : c
    },
    zg = e => e.rootProps.maxBarSize,
    Uj = e => e.rootProps.barGap,
    Kg = e => e.rootProps.barCategoryGap,
    Hj = e => e.rootProps.barSize,
    fi = e => e.rootProps.stackOffset,
    Wg = e => e.rootProps.reverseStackOrder,
    is = e => e.options.chartName,
    as = e => e.rootProps.syncId,
    Fg = e => e.rootProps.syncMethod,
    os = e => e.options.eventEmitter,
    Gj = e => e.rootProps.baseValue,
    ie = {
        grid: -100,
        barBackground: -50,
        area: 100,
        cursorRectangle: 200,
        bar: 300,
        line: 400,
        axis: 500,
        scatter: 600,
        activeBar: 1e3,
        cursorLine: 1100,
        activeDot: 1200,
        label: 2e3
    },
    xt = {
        allowDecimals: !1,
        allowDuplicatedCategory: !0,
        angleAxisId: 0,
        axisLine: !0,
        axisLineType: "polygon",
        cx: 0,
        cy: 0,
        orientation: "outer",
        reversed: !1,
        scale: "auto",
        tick: !0,
        tickLine: !0,
        tickSize: 8,
        type: "category",
        zIndex: ie.axis
    },
    Fe = {
        allowDataOverflow: !1,
        allowDecimals: !1,
        allowDuplicatedCategory: !0,
        angle: 0,
        axisLine: !0,
        includeHidden: !1,
        hide: !1,
        label: !1,
        orientation: "right",
        radiusAxisId: 0,
        reversed: !1,
        scale: "auto",
        stroke: "#ccc",
        tick: !0,
        tickCount: 5,
        type: "number",
        zIndex: ie.axis
    },
    ao = (e, t) => {
        if (!(!e || !t)) return e != null && e.reversed ? [t[1], t[0]] : t
    },
    Vj = {
        allowDataOverflow: !1,
        allowDecimals: !1,
        allowDuplicatedCategory: !1,
        dataKey: void 0,
        domain: void 0,
        id: xt.angleAxisId,
        includeHidden: !1,
        name: void 0,
        reversed: xt.reversed,
        scale: xt.scale,
        tick: xt.tick,
        tickCount: void 0,
        ticks: void 0,
        type: xt.type,
        unit: void 0
    },
    Yj = {
        allowDataOverflow: Fe.allowDataOverflow,
        allowDecimals: !1,
        allowDuplicatedCategory: Fe.allowDuplicatedCategory,
        dataKey: void 0,
        domain: void 0,
        id: Fe.radiusAxisId,
        includeHidden: !1,
        name: void 0,
        reversed: !1,
        scale: Fe.scale,
        tick: Fe.tick,
        tickCount: Fe.tickCount,
        ticks: void 0,
        type: Fe.type,
        unit: void 0
    },
    Xj = {
        allowDataOverflow: !1,
        allowDecimals: !1,
        allowDuplicatedCategory: xt.allowDuplicatedCategory,
        dataKey: void 0,
        domain: void 0,
        id: xt.angleAxisId,
        includeHidden: !1,
        name: void 0,
        reversed: !1,
        scale: xt.scale,
        tick: xt.tick,
        tickCount: void 0,
        ticks: void 0,
        type: "number",
        unit: void 0
    },
    Zj = {
        allowDataOverflow: Fe.allowDataOverflow,
        allowDecimals: !1,
        allowDuplicatedCategory: Fe.allowDuplicatedCategory,
        dataKey: void 0,
        domain: void 0,
        id: Fe.radiusAxisId,
        includeHidden: !1,
        name: void 0,
        reversed: !1,
        scale: Fe.scale,
        tick: Fe.tick,
        tickCount: Fe.tickCount,
        ticks: void 0,
        type: "category",
        unit: void 0
    },
    an = (e, t) => e.polarAxis.angleAxis[t] != null ? e.polarAxis.angleAxis[t] : e.layout.layoutType === "radial" ? Xj : Vj,
    di = (e, t) => e.polarAxis.radiusAxis[t] != null ? e.polarAxis.radiusAxis[t] : e.layout.layoutType === "radial" ? Zj : Yj,
    oo = e => e.polarOptions,
    us = A([Vt, Yt, Pe], By),
    qg = A([oo, us], (e, t) => {
        if (e != null) return $e(e.innerRadius, t, 0)
    }),
    Ug = A([oo, us], (e, t) => {
        if (e != null) return $e(e.outerRadius, t, t * .8)
    }),
    Jj = e => {
        if (e == null) return [0, 0];
        var {
            startAngle: t,
            endAngle: r
        } = e;
        return [t, r]
    },
    Hg = A([oo], Jj),
    Qj = A([an, Hg], ao),
    Gg = A([us, qg, Ug], (e, t, r) => {
        if (!(e == null || t == null || r == null)) return [t, r]
    }),
    eI = A([di, Gg], ao),
    on = A([K, oo, qg, Ug, Vt, Yt], (e, t, r, n, i, a) => {
        if (!(e !== "centric" && e !== "radial" || t == null || r == null || n == null)) {
            var {
                cx: o,
                cy: u,
                startAngle: l,
                endAngle: s
            } = t;
            return {
                cx: $e(o, i, i / 2),
                cy: $e(u, a, a / 2),
                innerRadius: r,
                outerRadius: n,
                startAngle: l,
                endAngle: s,
                clockWise: !1
            }
        }
    }),
    oe = (e, t) => t,
    vi = (e, t, r) => r;

function uo(e) {
    return e ?.id
}

function Vg(e, t, r) {
    var {
        chartData: n = []
    } = t, {
        allowDuplicatedCategory: i,
        dataKey: a
    } = r, o = new Map;
    return e.forEach(u => {
        var l, s = (l = u.data) !== null && l !== void 0 ? l : n;
        if (!(s == null || s.length === 0)) {
            var c = uo(u);
            s.forEach((f, v) => {
                var p = a == null || i ? v : String(H(f, a, null)),
                    h = H(f, u.dataKey, 0),
                    m;
                o.has(p) ? m = o.get(p) : m = {}, Object.assign(m, {
                    [c]: h
                }), o.set(p, m)
            })
        }
    }), Array.from(o.values())
}

function lo(e) {
    return "stackId" in e && e.stackId != null && e.dataKey != null
}
var co = (e, t) => e === t ? !0 : e == null || t == null ? !1 : e[0] === t[0] && e[1] === t[1];

function so(e, t) {
    return Array.isArray(e) && Array.isArray(t) && e.length === 0 && t.length === 0 ? !0 : e === t
}

function tI(e, t) {
    if (e.length === t.length) {
        for (var r = 0; r < e.length; r++)
            if (e[r] !== t[r]) return !1;
        return !0
    }
    return !1
}
var Ae = e => {
        var t = K(e);
        return t === "horizontal" ? "xAxis" : t === "vertical" ? "yAxis" : t === "centric" ? "angleAxis" : "radiusAxis"
    },
    un = e => e.tooltip.settings.axisId;

function fp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function xa(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? fp(Object(r), !0).forEach(function(n) {
            rI(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : fp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function rI(e, t, r) {
    return (t = nI(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function nI(e) {
    var t = iI(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function iI(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var Hl = [0, "auto"],
    Ee = {
        allowDataOverflow: !1,
        allowDecimals: !0,
        allowDuplicatedCategory: !0,
        angle: 0,
        dataKey: void 0,
        domain: void 0,
        height: 30,
        hide: !0,
        id: 0,
        includeHidden: !1,
        interval: "preserveEnd",
        minTickGap: 5,
        mirror: !1,
        name: void 0,
        orientation: "bottom",
        padding: {
            left: 0,
            right: 0
        },
        reversed: !1,
        scale: "auto",
        tick: !0,
        tickCount: 5,
        tickFormatter: void 0,
        ticks: void 0,
        type: "category",
        unit: void 0
    },
    Yg = (e, t) => e.cartesianAxis.xAxis[t],
    Jt = (e, t) => {
        var r = Yg(e, t);
        return r ?? Ee
    },
    je = {
        allowDataOverflow: !1,
        allowDecimals: !0,
        allowDuplicatedCategory: !0,
        angle: 0,
        dataKey: void 0,
        domain: Hl,
        hide: !0,
        id: 0,
        includeHidden: !1,
        interval: "preserveEnd",
        minTickGap: 5,
        mirror: !1,
        name: void 0,
        orientation: "left",
        padding: {
            top: 0,
            bottom: 0
        },
        reversed: !1,
        scale: "auto",
        tick: !0,
        tickCount: 5,
        tickFormatter: void 0,
        ticks: void 0,
        type: "number",
        unit: void 0,
        width: ni
    },
    Xg = (e, t) => e.cartesianAxis.yAxis[t],
    Qt = (e, t) => {
        var r = Xg(e, t);
        return r ?? je
    },
    Rt = {
        domain: [0, "auto"],
        includeHidden: !1,
        reversed: !1,
        allowDataOverflow: !1,
        allowDuplicatedCategory: !1,
        dataKey: void 0,
        id: 0,
        name: "",
        range: [64, 64],
        scale: "auto",
        type: "number",
        unit: ""
    },
    ls = (e, t) => {
        var r = e.cartesianAxis.zAxis[t];
        return r ?? Rt
    },
    ve = (e, t, r) => {
        switch (t) {
            case "xAxis":
                return Jt(e, r);
            case "yAxis":
                return Qt(e, r);
            case "zAxis":
                return ls(e, r);
            case "angleAxis":
                return an(e, r);
            case "radiusAxis":
                return di(e, r);
            default:
                throw new Error("Unexpected axis type: ".concat(t))
        }
    },
    aI = (e, t, r) => {
        switch (t) {
            case "xAxis":
                return Jt(e, r);
            case "yAxis":
                return Qt(e, r);
            default:
                throw new Error("Unexpected axis type: ".concat(t))
        }
    },
    ln = (e, t, r) => {
        switch (t) {
            case "xAxis":
                return Jt(e, r);
            case "yAxis":
                return Qt(e, r);
            case "angleAxis":
                return an(e, r);
            case "radiusAxis":
                return di(e, r);
            default:
                throw new Error("Unexpected axis type: ".concat(t))
        }
    },
    Zg = e => e.graphicalItems.cartesianItems.some(t => t.type === "bar") || e.graphicalItems.polarItems.some(t => t.type === "radialBar");

function cs(e, t) {
    return r => {
        switch (e) {
            case "xAxis":
                return "xAxisId" in r && r.xAxisId === t;
            case "yAxis":
                return "yAxisId" in r && r.yAxisId === t;
            case "zAxis":
                return "zAxisId" in r && r.zAxisId === t;
            case "angleAxis":
                return "angleAxisId" in r && r.angleAxisId === t;
            case "radiusAxis":
                return "radiusAxisId" in r && r.radiusAxisId === t;
            default:
                return !1
        }
    }
}
var cn = e => e.graphicalItems.cartesianItems,
    oI = A([oe, vi], cs),
    ss = (e, t, r) => e.filter(r).filter(n => t ?.includeHidden === !0 ? !0 : !n.hide),
    pi = A([cn, ve, oI], ss, {
        memoizeOptions: {
            resultEqualityCheck: so
        }
    }),
    Jg = A([pi], e => e.filter(t => t.type === "area" || t.type === "bar").filter(lo)),
    Qg = e => e.filter(t => !("stackId" in t) || t.stackId === void 0),
    uI = A([pi], Qg),
    fs = e => e.map(t => t.data).filter(Boolean).flat(1),
    lI = A([pi], fs, {
        memoizeOptions: {
            resultEqualityCheck: so
        }
    }),
    ds = (e, t) => {
        var {
            chartData: r = [],
            dataStartIndex: n,
            dataEndIndex: i
        } = t;
        return e.length > 0 ? e : r.slice(n, i + 1)
    },
    vs = A([lI, io], ds),
    ps = (e, t, r) => t ?.dataKey != null ? e.map(n => ({
        value: H(n, t.dataKey)
    })) : r.length > 0 ? r.map(n => n.dataKey).flatMap(n => e.map(i => ({
        value: H(i, n)
    }))) : e.map(n => ({
        value: n
    })),
    fo = A([vs, ve, pi], ps);

function eb(e, t) {
    switch (e) {
        case "xAxis":
            return t.direction === "x";
        case "yAxis":
            return t.direction === "y";
        default:
            return !1
    }
}

function Wi(e) {
    if (St(e) || e instanceof Date) {
        var t = Number(e);
        if (ae(t)) return t
    }
}

function dp(e) {
    if (Array.isArray(e)) {
        var t = [Wi(e[0]), Wi(e[1])];
        return or(t) ? t : void 0
    }
    var r = Wi(e);
    if (r != null) return [r, r]
}

function Ut(e) {
    return e.map(Wi).filter(pw)
}

function cI(e, t, r) {
    return !r || typeof t != "number" || at(t) ? [] : r.length ? Ut(r.flatMap(n => {
        var i = H(e, n.dataKey),
            a, o;
        if (Array.isArray(i) ? [a, o] = i : a = o = i, !(!ae(a) || !ae(o))) return [t - a, t + o]
    })) : []
}
var Se = e => {
        var t = Ae(e),
            r = un(e);
        return ln(e, t, r)
    },
    hi = A([Se], e => e ?.dataKey),
    sI = A([Jg, io, Se], Vg),
    tb = (e, t, r, n) => {
        var i = {},
            a = t.reduce((o, u) => {
                if (u.stackId == null) return o;
                var l = o[u.stackId];
                return l == null && (l = []), l.push(u), o[u.stackId] = l, o
            }, i);
        return Object.fromEntries(Object.entries(a).map(o => {
            var [u, l] = o, s = n ? [...l].reverse() : l, c = s.map(uo);
            return [u, {
                stackedData: $O(e, c, r),
                graphicalItems: s
            }]
        }))
    },
    wa = A([sI, Jg, fi, Wg], tb),
    rb = (e, t, r, n) => {
        var {
            dataStartIndex: i,
            dataEndIndex: a
        } = t;
        if (n == null && r !== "zAxis") {
            var o = KO(e, i, a);
            if (!(o != null && o[0] === 0 && o[1] === 0)) return o
        }
    },
    fI = A([ve], e => e.allowDataOverflow),
    hs = e => {
        var t;
        if (e == null || !("domain" in e)) return Hl;
        if (e.domain != null) return e.domain;
        if ("ticks" in e && e.ticks != null) {
            if (e.type === "number") {
                var r = Ut(e.ticks);
                return [Math.min(...r), Math.max(...r)]
            }
            if (e.type === "category") return e.ticks.map(String)
        }
        return (t = e ?.domain) !== null && t !== void 0 ? t : Hl
    },
    ms = A([ve], hs),
    ys = A([ms, fI], Eg),
    dI = A([wa, Zt, oe, ys], rb, {
        memoizeOptions: {
            resultEqualityCheck: co
        }
    }),
    vo = e => e.errorBars,
    vI = (e, t, r) => e.flatMap(n => t[n.id]).filter(Boolean).filter(n => eb(r, n)),
    Pa = function() {
        for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
        var i = r.filter(Boolean);
        if (i.length !== 0) {
            var a = i.flat(),
                o = Math.min(...a),
                u = Math.max(...a);
            return [o, u]
        }
    },
    gs = (e, t, r, n, i) => {
        var a, o;
        if (r.length > 0 && e.forEach(u => {
                r.forEach(l => {
                    var s, c, f = (s = n[l.id]) === null || s === void 0 ? void 0 : s.filter(g => eb(i, g)),
                        v = H(u, (c = t.dataKey) !== null && c !== void 0 ? c : l.dataKey),
                        p = cI(u, v, f);
                    if (p.length >= 2) {
                        var h = Math.min(...p),
                            m = Math.max(...p);
                        (a == null || h < a) && (a = h), (o == null || m > o) && (o = m)
                    }
                    var y = dp(v);
                    y != null && (a = a == null ? y[0] : Math.min(a, y[0]), o = o == null ? y[1] : Math.max(o, y[1]))
                })
            }), t ?.dataKey != null && e.forEach(u => {
                var l = dp(H(u, t.dataKey));
                l != null && (a = a == null ? l[0] : Math.min(a, l[0]), o = o == null ? l[1] : Math.max(o, l[1]))
            }), ae(a) && ae(o)) return [a, o]
    },
    pI = A([vs, ve, uI, vo, oe], gs, {
        memoizeOptions: {
            resultEqualityCheck: co
        }
    });

function hI(e) {
    var {
        value: t
    } = e;
    if (St(t) || t instanceof Date) return t
}
var mI = (e, t, r) => {
        var n = e.map(hI).filter(i => i != null);
        return r && (t.dataKey == null || t.allowDuplicatedCategory && _m(n)) ? qy(0, e.length) : t.allowDuplicatedCategory ? n : Array.from(new Set(n))
    },
    nb = e => e.referenceElements.dots,
    sn = (e, t, r) => e.filter(n => n.ifOverflow === "extendDomain").filter(n => t === "xAxis" ? n.xAxisId === r : n.yAxisId === r),
    yI = A([nb, oe, vi], sn),
    ib = e => e.referenceElements.areas,
    gI = A([ib, oe, vi], sn),
    ab = e => e.referenceElements.lines,
    bI = A([ab, oe, vi], sn),
    ob = (e, t) => {
        if (e != null) {
            var r = Ut(e.map(n => t === "xAxis" ? n.x : n.y));
            if (r.length !== 0) return [Math.min(...r), Math.max(...r)]
        }
    },
    xI = A(yI, oe, ob),
    ub = (e, t) => {
        if (e != null) {
            var r = Ut(e.flatMap(n => [t === "xAxis" ? n.x1 : n.y1, t === "xAxis" ? n.x2 : n.y2]));
            if (r.length !== 0) return [Math.min(...r), Math.max(...r)]
        }
    },
    wI = A([gI, oe], ub);

function PI(e) {
    var t;
    if (e.x != null) return Ut([e.x]);
    var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map(n => n.x);
    return r == null || r.length === 0 ? [] : Ut(r)
}

function OI(e) {
    var t;
    if (e.y != null) return Ut([e.y]);
    var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map(n => n.y);
    return r == null || r.length === 0 ? [] : Ut(r)
}
var lb = (e, t) => {
        if (e != null) {
            var r = e.flatMap(n => t === "xAxis" ? PI(n) : OI(n));
            if (r.length !== 0) return [Math.min(...r), Math.max(...r)]
        }
    },
    AI = A([bI, oe], lb),
    SI = A(xI, AI, wI, (e, t, r) => Pa(e, r, t)),
    bs = (e, t, r, n, i, a, o, u) => {
        if (r != null) return r;
        var l = o === "vertical" && u === "xAxis" || o === "horizontal" && u === "yAxis",
            s = l ? Pa(n, a, i) : Pa(a, i);
        return Dj(t, s, e.allowDataOverflow)
    },
    EI = A([ve, ms, ys, dI, pI, SI, K, oe], bs, {
        memoizeOptions: {
            resultEqualityCheck: co
        }
    }),
    jI = [0, 1],
    xs = (e, t, r, n, i, a, o) => {
        if (!((e == null || r == null || r.length === 0) && o === void 0)) {
            var {
                dataKey: u,
                type: l
            } = e, s = yt(t, a);
            if (s && u == null) {
                var c;
                return qy(0, (c = r ?.length) !== null && c !== void 0 ? c : 0)
            }
            return l === "category" ? mI(n, e, s) : i === "expand" ? jI : o
        }
    },
    ws = A([ve, K, vs, fo, fi, oe, EI], xs),
    cb = (e, t, r, n, i) => {
        if (e != null) {
            var {
                scale: a,
                type: o
            } = e;
            if (a === "auto") return t === "radial" && i === "radiusAxis" ? "band" : t === "radial" && i === "angleAxis" ? "linear" : o === "category" && n && (n.indexOf("LineChart") >= 0 || n.indexOf("AreaChart") >= 0 || n.indexOf("ComposedChart") >= 0 && !r) ? "point" : o === "category" ? "band" : "linear";
            if (typeof a == "string") {
                var u = "scale".concat(Qn(a));
                return u in Tn ? u : "point"
            }
        }
    },
    pr = A([ve, K, Zg, is, oe], cb);

function II(e) {
    if (e != null) {
        if (e in Tn) return Tn[e]();
        var t = "scale".concat(Qn(e));
        if (t in Tn) return Tn[t]()
    }
}

function po(e, t, r, n) {
    if (!(r == null || n == null)) {
        if (typeof e.scale == "function") return e.scale.copy().domain(r).range(n);
        var i = II(t);
        if (i != null) {
            var a = i.domain(r).range(n);
            return TO(a), a
        }
    }
}
var Ps = (e, t, r) => {
        var n = hs(t);
        if (!(r !== "auto" && r !== "linear")) {
            if (t != null && t.tickCount && Array.isArray(n) && (n[0] === "auto" || n[1] === "auto") && or(e)) return Fj(e, t.tickCount, t.allowDecimals);
            if (t != null && t.tickCount && t.type === "number" && or(e)) return qj(e, t.tickCount, t.allowDecimals)
        }
    },
    Os = A([ws, ln, pr], Ps),
    As = (e, t, r, n) => {
        if (n !== "angleAxis" && e ?.type === "number" && or(t) && Array.isArray(r) && r.length > 0) {
            var i = t[0],
                a = r[0],
                o = t[1],
                u = r[r.length - 1];
            return [Math.min(i, a), Math.max(o, u)]
        }
        return t
    },
    _I = A([ve, ws, Os, oe], As),
    kI = A(fo, ve, (e, t) => {
        if (!(!t || t.type !== "number")) {
            var r = 1 / 0,
                n = Array.from(Ut(e.map(f => f.value))).sort((f, v) => f - v),
                i = n[0],
                a = n[n.length - 1];
            if (i == null || a == null) return 1 / 0;
            var o = a - i;
            if (o === 0) return 1 / 0;
            for (var u = 0; u < n.length - 1; u++) {
                var l = n[u],
                    s = n[u + 1];
                if (!(l == null || s == null)) {
                    var c = s - l;
                    r = Math.min(r, c)
                }
            }
            return r / o
        }
    }),
    sb = A(kI, K, Kg, Pe, (e, t, r, n, i) => i, (e, t, r, n, i) => {
        if (!ae(e)) return 0;
        var a = t === "vertical" ? n.height : n.width;
        if (i === "gap") return e * a / 2;
        if (i === "no-gap") {
            var o = $e(r, e * a),
                u = e * a / 2;
            return u - o - (u - o) / a * o
        }
        return 0
    }),
    CI = (e, t, r) => {
        var n = Jt(e, t);
        return n == null || typeof n.padding != "string" ? 0 : sb(e, "xAxis", t, r, n.padding)
    },
    TI = (e, t, r) => {
        var n = Qt(e, t);
        return n == null || typeof n.padding != "string" ? 0 : sb(e, "yAxis", t, r, n.padding)
    },
    MI = A(Jt, CI, (e, t) => {
        var r, n;
        if (e == null) return {
            left: 0,
            right: 0
        };
        var {
            padding: i
        } = e;
        return typeof i == "string" ? {
            left: t,
            right: t
        } : {
            left: ((r = i.left) !== null && r !== void 0 ? r : 0) + t,
            right: ((n = i.right) !== null && n !== void 0 ? n : 0) + t
        }
    }),
    DI = A(Qt, TI, (e, t) => {
        var r, n;
        if (e == null) return {
            top: 0,
            bottom: 0
        };
        var {
            padding: i
        } = e;
        return typeof i == "string" ? {
            top: t,
            bottom: t
        } : {
            top: ((r = i.top) !== null && r !== void 0 ? r : 0) + t,
            bottom: ((n = i.bottom) !== null && n !== void 0 ? n : 0) + t
        }
    }),
    NI = A([Pe, MI, Xa, Ya, (e, t, r) => r], (e, t, r, n, i) => {
        var {
            padding: a
        } = n;
        return i ? [a.left, r.width - a.right] : [e.left + t.left, e.left + e.width - t.right]
    }),
    RI = A([Pe, K, DI, Xa, Ya, (e, t, r) => r], (e, t, r, n, i, a) => {
        var {
            padding: o
        } = i;
        return a ? [n.height - o.bottom, o.top] : t === "horizontal" ? [e.top + e.height - r.bottom, e.top + r.top] : [e.top + r.top, e.top + e.height - r.bottom]
    }),
    mi = (e, t, r, n) => {
        var i;
        switch (t) {
            case "xAxis":
                return NI(e, r, n);
            case "yAxis":
                return RI(e, r, n);
            case "zAxis":
                return (i = ls(e, r)) === null || i === void 0 ? void 0 : i.range;
            case "angleAxis":
                return Hg(e);
            case "radiusAxis":
                return Gg(e, r);
            default:
                return
        }
    },
    fb = A([ve, mi], ao),
    ho = A([ve, pr, _I, fb], po);
A([pi, vo, oe], vI);

function db(e, t) {
    return e.id < t.id ? -1 : e.id > t.id ? 1 : 0
}
var mo = (e, t) => t,
    yo = (e, t, r) => r,
    $I = A(Ga, mo, yo, (e, t, r) => e.filter(n => n.orientation === t).filter(n => n.mirror === r).sort(db)),
    LI = A(Va, mo, yo, (e, t, r) => e.filter(n => n.orientation === t).filter(n => n.mirror === r).sort(db)),
    vb = (e, t) => ({
        width: e.width,
        height: t.height
    }),
    BI = (e, t) => {
        var r = typeof t.width == "number" ? t.width : ni;
        return {
            width: r,
            height: e.height
        }
    },
    pb = A(Pe, Jt, vb),
    zI = (e, t, r) => {
        switch (t) {
            case "top":
                return e.top;
            case "bottom":
                return r - e.bottom;
            default:
                return 0
        }
    },
    KI = (e, t, r) => {
        switch (t) {
            case "left":
                return e.left;
            case "right":
                return r - e.right;
            default:
                return 0
        }
    },
    WI = A(Yt, Pe, $I, mo, yo, (e, t, r, n, i) => {
        var a = {},
            o;
        return r.forEach(u => {
            var l = vb(t, u);
            o == null && (o = zI(t, n, e));
            var s = n === "top" && !i || n === "bottom" && i;
            a[u.id] = o - Number(s) * l.height, o += (s ? -1 : 1) * l.height
        }), a
    }),
    FI = A(Vt, Pe, LI, mo, yo, (e, t, r, n, i) => {
        var a = {},
            o;
        return r.forEach(u => {
            var l = BI(t, u);
            o == null && (o = KI(t, n, e));
            var s = n === "left" && !i || n === "right" && i;
            a[u.id] = o - Number(s) * l.width, o += (s ? -1 : 1) * l.width
        }), a
    }),
    qI = (e, t) => {
        var r = Jt(e, t);
        if (r != null) return WI(e, r.orientation, r.mirror)
    },
    UI = A([Pe, Jt, qI, (e, t) => t], (e, t, r, n) => {
        if (t != null) {
            var i = r ?.[n];
            return i == null ? {
                x: e.left,
                y: 0
            } : {
                x: e.left,
                y: i
            }
        }
    }),
    HI = (e, t) => {
        var r = Qt(e, t);
        if (r != null) return FI(e, r.orientation, r.mirror)
    },
    GI = A([Pe, Qt, HI, (e, t) => t], (e, t, r, n) => {
        if (t != null) {
            var i = r ?.[n];
            return i == null ? {
                x: 0,
                y: e.top
            } : {
                x: i,
                y: e.top
            }
        }
    }),
    hb = A(Pe, Qt, (e, t) => {
        var r = typeof t.width == "number" ? t.width : ni;
        return {
            width: r,
            height: e.height
        }
    }),
    vp = (e, t, r) => {
        switch (t) {
            case "xAxis":
                return pb(e, r).width;
            case "yAxis":
                return hb(e, r).height;
            default:
                return
        }
    },
    mb = (e, t, r, n) => {
        if (r != null) {
            var {
                allowDuplicatedCategory: i,
                type: a,
                dataKey: o
            } = r, u = yt(e, n), l = t.map(s => s.value);
            if (o && u && a === "category" && i && _m(l)) return l
        }
    },
    yi = A([K, fo, ve, oe], mb),
    Ss = (e, t, r, n) => {
        if (!(r == null || r.dataKey == null)) {
            var {
                type: i,
                scale: a
            } = r, o = yt(e, n);
            if (o && (i === "number" || a !== "auto")) return t.map(u => u.value)
        }
    },
    Es = A([K, fo, ln, oe], Ss),
    pp = A([K, aI, pr, ho, yi, Es, mi, Os, oe], (e, t, r, n, i, a, o, u, l) => {
        if (t != null) {
            var s = yt(e, l);
            return {
                angle: t.angle,
                interval: t.interval,
                minTickGap: t.minTickGap,
                orientation: t.orientation,
                tick: t.tick,
                tickCount: t.tickCount,
                tickFormatter: t.tickFormatter,
                ticks: t.ticks,
                type: t.type,
                unit: t.unit,
                axisType: l,
                categoricalDomain: a,
                duplicateDomain: i,
                isCategorical: s,
                niceTicks: u,
                range: o,
                realScaleType: r,
                scale: n
            }
        }
    }),
    yb = (e, t, r, n, i, a, o, u, l) => {
        if (!(t == null || n == null)) {
            var s = yt(e, l),
                {
                    type: c,
                    ticks: f,
                    tickCount: v
                } = t,
                p = r === "scaleBand" && typeof n.bandwidth == "function" ? n.bandwidth() / 2 : 2,
                h = c === "category" && n.bandwidth ? n.bandwidth() / p : 0;
            h = l === "angleAxis" && a != null && a.length >= 2 ? _e(a[0] - a[1]) * 2 * h : h;
            var m = f || i;
            if (m) {
                var y = m.map((g, b) => {
                    var x = o ? o.indexOf(g) : g;
                    return {
                        index: b,
                        coordinate: n(x) + h,
                        value: g,
                        offset: h
                    }
                });
                return y.filter(g => ae(g.coordinate))
            }
            return s && u ? u.map((g, b) => ({
                coordinate: n(g) + h,
                value: g,
                index: b,
                offset: h
            })).filter(g => ae(g.coordinate)) : n.ticks ? n.ticks(v).map(g => ({
                coordinate: n(g) + h,
                value: g,
                offset: h
            })) : n.domain().map((g, b) => ({
                coordinate: n(g) + h,
                value: o ? o[g] : g,
                index: b,
                offset: h
            }))
        }
    },
    gb = A([K, ln, pr, ho, Os, mi, yi, Es, oe], yb),
    bb = (e, t, r, n, i, a, o) => {
        if (!(t == null || r == null || n == null || n[0] === n[1])) {
            var u = yt(e, o),
                {
                    tickCount: l
                } = t,
                s = 0;
            return s = o === "angleAxis" && n ?.length >= 2 ? _e(n[0] - n[1]) * 2 * s : s, u && a ? a.map((c, f) => ({
                coordinate: r(c) + s,
                value: c,
                index: f,
                offset: s
            })) : r.ticks ? r.ticks(l).map(c => ({
                coordinate: r(c) + s,
                value: c,
                offset: s
            })) : r.domain().map((c, f) => ({
                coordinate: r(c) + s,
                value: i ? i[c] : c,
                index: f,
                offset: s
            }))
        }
    },
    lt = A([K, ln, ho, mi, yi, Es, oe], bb),
    ct = A(ve, ho, (e, t) => {
        if (!(e == null || t == null)) return xa(xa({}, e), {}, {
            scale: t
        })
    }),
    VI = A([ve, pr, ws, fb], po),
    YI = A((e, t, r) => ls(e, r), VI, (e, t) => {
        if (!(e == null || t == null)) return xa(xa({}, e), {}, {
            scale: t
        })
    }),
    XI = A([K, Ga, Va], (e, t, r) => {
        switch (e) {
            case "horizontal":
                return t.some(n => n.reversed) ? "right-to-left" : "left-to-right";
            case "vertical":
                return r.some(n => n.reversed) ? "bottom-to-top" : "top-to-bottom";
            case "centric":
            case "radial":
                return "left-to-right";
            default:
                return
        }
    }),
    xb = e => e.options.defaultTooltipEventType,
    wb = e => e.options.validateTooltipEventTypes;

function Pb(e, t, r) {
    if (e == null) return t;
    var n = e ? "axis" : "item";
    return r == null ? t : r.includes(n) ? n : t
}

function js(e, t) {
    var r = xb(e),
        n = wb(e);
    return Pb(t, r, n)
}

function ZI(e) {
    return M(t => js(t, e))
}
var Ob = (e, t) => {
        var r, n = Number(t);
        if (!(at(n) || t == null)) return n >= 0 ? e == null || (r = e[n]) === null || r === void 0 ? void 0 : r.value : void 0
    },
    JI = e => e.tooltip.settings,
    nr = {
        active: !1,
        index: null,
        dataKey: void 0,
        graphicalItemId: void 0,
        coordinate: void 0
    },
    QI = {
        itemInteraction: {
            click: nr,
            hover: nr
        },
        axisInteraction: {
            click: nr,
            hover: nr
        },
        keyboardInteraction: nr,
        syncInteraction: {
            active: !1,
            index: null,
            dataKey: void 0,
            label: void 0,
            coordinate: void 0,
            sourceViewBox: void 0,
            graphicalItemId: void 0
        },
        tooltipItemPayloads: [],
        settings: {
            shared: void 0,
            trigger: "hover",
            axisId: 0,
            active: !1,
            defaultIndex: void 0
        }
    },
    Ab = Ge({
        name: "tooltip",
        initialState: QI,
        reducers: {
            addTooltipEntrySettings: {
                reducer(e, t) {
                    e.tooltipItemPayloads.push(t.payload)
                },
                prepare: se()
            },
            replaceTooltipEntrySettings: {
                reducer(e, t) {
                    var {
                        prev: r,
                        next: n
                    } = t.payload, i = ht(e).tooltipItemPayloads.indexOf(r);
                    i > -1 && (e.tooltipItemPayloads[i] = n)
                },
                prepare: se()
            },
            removeTooltipEntrySettings: {
                reducer(e, t) {
                    var r = ht(e).tooltipItemPayloads.indexOf(t.payload);
                    r > -1 && e.tooltipItemPayloads.splice(r, 1)
                },
                prepare: se()
            },
            setTooltipSettingsState(e, t) {
                e.settings = t.payload
            },
            setActiveMouseOverItemIndex(e, t) {
                e.syncInteraction.active = !1, e.keyboardInteraction.active = !1, e.itemInteraction.hover.active = !0, e.itemInteraction.hover.index = t.payload.activeIndex, e.itemInteraction.hover.dataKey = t.payload.activeDataKey, e.itemInteraction.hover.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.hover.coordinate = t.payload.activeCoordinate
            },
            mouseLeaveChart(e) {
                e.itemInteraction.hover.active = !1, e.axisInteraction.hover.active = !1
            },
            mouseLeaveItem(e) {
                e.itemInteraction.hover.active = !1
            },
            setActiveClickItemIndex(e, t) {
                e.syncInteraction.active = !1, e.itemInteraction.click.active = !0, e.keyboardInteraction.active = !1, e.itemInteraction.click.index = t.payload.activeIndex, e.itemInteraction.click.dataKey = t.payload.activeDataKey, e.itemInteraction.click.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.click.coordinate = t.payload.activeCoordinate
            },
            setMouseOverAxisIndex(e, t) {
                e.syncInteraction.active = !1, e.axisInteraction.hover.active = !0, e.keyboardInteraction.active = !1, e.axisInteraction.hover.index = t.payload.activeIndex, e.axisInteraction.hover.dataKey = t.payload.activeDataKey, e.axisInteraction.hover.coordinate = t.payload.activeCoordinate
            },
            setMouseClickAxisIndex(e, t) {
                e.syncInteraction.active = !1, e.keyboardInteraction.active = !1, e.axisInteraction.click.active = !0, e.axisInteraction.click.index = t.payload.activeIndex, e.axisInteraction.click.dataKey = t.payload.activeDataKey, e.axisInteraction.click.coordinate = t.payload.activeCoordinate
            },
            setSyncInteraction(e, t) {
                e.syncInteraction = t.payload
            },
            setKeyboardInteraction(e, t) {
                e.keyboardInteraction.active = t.payload.active, e.keyboardInteraction.index = t.payload.activeIndex, e.keyboardInteraction.coordinate = t.payload.activeCoordinate
            }
        }
    }),
    {
        addTooltipEntrySettings: e_,
        replaceTooltipEntrySettings: t_,
        removeTooltipEntrySettings: r_,
        setTooltipSettingsState: n_,
        setActiveMouseOverItemIndex: Sb,
        mouseLeaveItem: i_,
        mouseLeaveChart: Eb,
        setActiveClickItemIndex: a_,
        setMouseOverAxisIndex: jb,
        setMouseClickAxisIndex: o_,
        setSyncInteraction: Gl,
        setKeyboardInteraction: Vl
    } = Ab.actions,
    u_ = Ab.reducer;

function hp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function $i(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? hp(Object(r), !0).forEach(function(n) {
            l_(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : hp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function l_(e, t, r) {
    return (t = c_(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function c_(e) {
    var t = s_(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function s_(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function f_(e, t, r) {
    return t === "axis" ? r === "click" ? e.axisInteraction.click : e.axisInteraction.hover : r === "click" ? e.itemInteraction.click : e.itemInteraction.hover
}

function d_(e) {
    return e.index != null
}
var Ib = (e, t, r, n) => {
    if (t == null) return nr;
    var i = f_(e, t, r);
    if (i == null) return nr;
    if (i.active) return i;
    if (e.keyboardInteraction.active) return e.keyboardInteraction;
    if (e.syncInteraction.active && e.syncInteraction.index != null) return e.syncInteraction;
    var a = e.settings.active === !0;
    if (d_(i)) {
        if (a) return $i($i({}, i), {}, {
            active: !0
        })
    } else if (n != null) return {
        active: !0,
        coordinate: void 0,
        dataKey: void 0,
        index: n,
        graphicalItemId: void 0
    };
    return $i($i({}, nr), {}, {
        coordinate: i.coordinate
    })
};

function v_(e) {
    if (typeof e == "number") return Number.isFinite(e) ? e : void 0;
    if (e instanceof Date) {
        var t = e.valueOf();
        return Number.isFinite(t) ? t : void 0
    }
    var r = Number(e);
    return Number.isFinite(r) ? r : void 0
}

function p_(e, t) {
    var r = v_(e),
        n = t[0],
        i = t[1];
    if (r === void 0) return !1;
    var a = Math.min(n, i),
        o = Math.max(n, i);
    return r >= a && r <= o
}

function h_(e, t, r) {
    if (r == null || t == null) return !0;
    var n = H(e, t);
    return n == null || !or(r) ? !0 : p_(n, r)
}
var Is = (e, t, r, n) => {
        var i = e ?.index;
        if (i == null) return null;
        var a = Number(i);
        if (!ae(a)) return i;
        var o = 0,
            u = 1 / 0;
        t.length > 0 && (u = t.length - 1);
        var l = Math.max(o, Math.min(a, u)),
            s = t[l];
        return s == null || h_(s, r, n) ? String(l) : null
    },
    _b = (e, t, r, n, i, a, o, u) => {
        if (!(a == null || u == null)) {
            var l = o[0],
                s = l == null ? void 0 : u(l.positions, a);
            if (s != null) return s;
            var c = i ?.[Number(a)];
            if (c) switch (r) {
                case "horizontal":
                    return {
                        x: c.coordinate,
                        y: (n.top + t) / 2
                    };
                default:
                    return {
                        x: (n.left + e) / 2,
                        y: c.coordinate
                    }
            }
        }
    },
    kb = (e, t, r, n) => {
        if (t === "axis") return e.tooltipItemPayloads;
        if (e.tooltipItemPayloads.length === 0) return [];
        var i;
        if (r === "hover" ? i = e.itemInteraction.hover.graphicalItemId : i = e.itemInteraction.click.graphicalItemId, i == null && n != null) {
            var a = e.tooltipItemPayloads[0];
            return a != null ? [a] : []
        }
        return e.tooltipItemPayloads.filter(o => {
            var u;
            return ((u = o.settings) === null || u === void 0 ? void 0 : u.graphicalItemId) === i
        })
    },
    gi = e => e.options.tooltipPayloadSearcher,
    fn = e => e.tooltip;

function mp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function yp(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? mp(Object(r), !0).forEach(function(n) {
            m_(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : mp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function m_(e, t, r) {
    return (t = y_(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function y_(e) {
    var t = g_(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function g_(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function b_(e, t) {
    return e ?? t
}
var Cb = (e, t, r, n, i, a, o) => {
        if (!(t == null || a == null)) {
            var {
                chartData: u,
                computedData: l,
                dataStartIndex: s,
                dataEndIndex: c
            } = r, f = [];
            return e.reduce((v, p) => {
                var h, {
                        dataDefinedOnItem: m,
                        settings: y
                    } = p,
                    g = b_(m, u),
                    b = Array.isArray(g) ? by(g, s, c) : g,
                    x = (h = y ?.dataKey) !== null && h !== void 0 ? h : n,
                    P = y ?.nameKey,
                    w;
                if (n && Array.isArray(b) && !Array.isArray(b[0]) && o === "axis" ? w = km(b, n, i) : w = a(b, t, l, P), Array.isArray(w)) w.forEach(S => {
                    var E = yp(yp({}, y), {}, {
                        name: S.name,
                        unit: S.unit,
                        color: void 0,
                        fill: void 0
                    });
                    v.push(Ed({
                        tooltipEntrySettings: E,
                        dataKey: S.dataKey,
                        payload: S.payload,
                        value: H(S.payload, S.dataKey),
                        name: S.name
                    }))
                });
                else {
                    var O;
                    v.push(Ed({
                        tooltipEntrySettings: y,
                        dataKey: x,
                        payload: w,
                        value: H(w, x),
                        name: (O = H(w, P)) !== null && O !== void 0 ? O : y ?.name
                    }))
                }
                return v
            }, f)
        }
    },
    _s = A([Se, K, Zg, is, Ae], cb),
    x_ = A([e => e.graphicalItems.cartesianItems, e => e.graphicalItems.polarItems], (e, t) => [...e, ...t]),
    w_ = A([Ae, un], cs),
    dn = A([x_, Se, w_], ss, {
        memoizeOptions: {
            resultEqualityCheck: so
        }
    }),
    P_ = A([dn], e => e.filter(lo)),
    O_ = A([dn], fs, {
        memoizeOptions: {
            resultEqualityCheck: so
        }
    }),
    vn = A([O_, Zt], ds),
    A_ = A([P_, Zt, Se], Vg),
    ks = A([vn, Se, dn], ps),
    Tb = A([Se], hs),
    S_ = A([Se], e => e.allowDataOverflow),
    Mb = A([Tb, S_], Eg),
    E_ = A([dn], e => e.filter(lo)),
    j_ = A([A_, E_, fi, Wg], tb),
    I_ = A([j_, Zt, Ae, Mb], rb),
    __ = A([dn], Qg),
    k_ = A([vn, Se, __, vo, Ae], gs, {
        memoizeOptions: {
            resultEqualityCheck: co
        }
    }),
    C_ = A([nb, Ae, un], sn),
    T_ = A([C_, Ae], ob),
    M_ = A([ib, Ae, un], sn),
    D_ = A([M_, Ae], ub),
    N_ = A([ab, Ae, un], sn),
    R_ = A([N_, Ae], lb),
    $_ = A([T_, R_, D_], Pa),
    L_ = A([Se, Tb, Mb, I_, k_, $_, K, Ae], bs),
    bi = A([Se, K, vn, ks, fi, Ae, L_], xs),
    B_ = A([bi, Se, _s], Ps),
    z_ = A([Se, bi, B_, Ae], As),
    Db = e => {
        var t = Ae(e),
            r = un(e),
            n = !1;
        return mi(e, t, r, n)
    },
    Nb = A([Se, Db], ao),
    Rb = A([Se, _s, z_, Nb], po),
    K_ = A([K, ks, Se, Ae], mb),
    W_ = A([K, ks, Se, Ae], Ss),
    F_ = (e, t, r, n, i, a, o, u) => {
        if (t) {
            var {
                type: l
            } = t, s = yt(e, u);
            if (n) {
                var c = r === "scaleBand" && n.bandwidth ? n.bandwidth() / 2 : 2,
                    f = l === "category" && n.bandwidth ? n.bandwidth() / c : 0;
                return f = u === "angleAxis" && i != null && i ?.length >= 2 ? _e(i[0] - i[1]) * 2 * f : f, s && o ? o.map((v, p) => ({
                    coordinate: n(v) + f,
                    value: v,
                    index: p,
                    offset: f
                })) : n.domain().map((v, p) => ({
                    coordinate: n(v) + f,
                    value: a ? a[v] : v,
                    index: p,
                    offset: f
                }))
            }
        }
    },
    er = A([K, Se, _s, Rb, Db, K_, W_, Ae], F_),
    Cs = A([xb, wb, JI], (e, t, r) => Pb(r.shared, e, t)),
    $b = e => e.tooltip.settings.trigger,
    Ts = e => e.tooltip.settings.defaultIndex,
    xi = A([fn, Cs, $b, Ts], Ib),
    Ht = A([xi, vn, hi, bi], Is),
    Lb = A([er, Ht], Ob),
    Ms = A([xi], e => {
        if (e) return e.dataKey
    }),
    q_ = A([xi], e => {
        if (e) return e.graphicalItemId
    }),
    Bb = A([fn, Cs, $b, Ts], kb),
    U_ = A([Vt, Yt, K, Pe, er, Ts, Bb, gi], _b),
    H_ = A([xi, U_], (e, t) => e != null && e.coordinate ? e.coordinate : t),
    G_ = A([xi], e => {
        var t;
        return (t = e ?.active) !== null && t !== void 0 ? t : !1
    }),
    V_ = A([Bb, Ht, Zt, hi, Lb, gi, Cs], Cb),
    Y_ = A([V_], e => {
        if (e != null) {
            var t = e.map(r => r.payload).filter(r => r != null);
            return Array.from(new Set(t))
        }
    });

function gp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function bp(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? gp(Object(r), !0).forEach(function(n) {
            X_(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : gp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function X_(e, t, r) {
    return (t = Z_(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function Z_(e) {
    var t = J_(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function J_(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var Q_ = () => M(Se),
    ek = () => {
        var e = Q_(),
            t = M(er),
            r = M(Rb);
        return jt(!e || !r ? void 0 : bp(bp({}, e), {}, {
            scale: r
        }), t)
    };

function xp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Wr(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? xp(Object(r), !0).forEach(function(n) {
            tk(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : xp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function tk(e, t, r) {
    return (t = rk(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function rk(e) {
    var t = nk(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function nk(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var ik = (e, t, r, n) => {
        var i = t.find(a => a && a.index === r);
        if (i) {
            if (e === "horizontal") return {
                x: i.coordinate,
                y: n.chartY
            };
            if (e === "vertical") return {
                x: n.chartX,
                y: i.coordinate
            }
        }
        return {
            x: 0,
            y: 0
        }
    },
    ak = (e, t, r, n) => {
        var i = t.find(s => s && s.index === r);
        if (i) {
            if (e === "centric") {
                var a = i.coordinate,
                    {
                        radius: o
                    } = n;
                return Wr(Wr(Wr({}, n), J(n.cx, n.cy, o, a)), {}, {
                    angle: a,
                    radius: o
                })
            }
            var u = i.coordinate,
                {
                    angle: l
                } = n;
            return Wr(Wr(Wr({}, n), J(n.cx, n.cy, u, l)), {}, {
                angle: l,
                radius: u
            })
        }
        return {
            angle: 0,
            clockWise: !1,
            cx: 0,
            cy: 0,
            endAngle: 0,
            innerRadius: 0,
            outerRadius: 0,
            radius: 0,
            startAngle: 0,
            x: 0,
            y: 0
        }
    };

function ok(e, t) {
    var {
        chartX: r,
        chartY: n
    } = e;
    return r >= t.left && r <= t.left + t.width && n >= t.top && n <= t.top + t.height
}
var zb = (e, t, r, n, i) => {
        var a, o = (a = t ?.length) !== null && a !== void 0 ? a : 0;
        if (o <= 1 || e == null) return 0;
        if (n === "angleAxis" && i != null && Math.abs(Math.abs(i[1] - i[0]) - 360) <= 1e-6)
            for (var u = 0; u < o; u++) {
                var l, s, c, f, v, p = u > 0 ? (l = r[u - 1]) === null || l === void 0 ? void 0 : l.coordinate : (s = r[o - 1]) === null || s === void 0 ? void 0 : s.coordinate,
                    h = (c = r[u]) === null || c === void 0 ? void 0 : c.coordinate,
                    m = u >= o - 1 ? (f = r[0]) === null || f === void 0 ? void 0 : f.coordinate : (v = r[u + 1]) === null || v === void 0 ? void 0 : v.coordinate,
                    y = void 0;
                if (!(p == null || h == null || m == null))
                    if (_e(h - p) !== _e(m - h)) {
                        var g = [];
                        if (_e(m - h) === _e(i[1] - i[0])) {
                            y = m;
                            var b = h + i[1] - i[0];
                            g[0] = Math.min(b, (b + p) / 2), g[1] = Math.max(b, (b + p) / 2)
                        } else {
                            y = p;
                            var x = m + i[1] - i[0];
                            g[0] = Math.min(h, (x + h) / 2), g[1] = Math.max(h, (x + h) / 2)
                        }
                        var P = [Math.min(h, (y + h) / 2), Math.max(h, (y + h) / 2)];
                        if (e > P[0] && e <= P[1] || e >= g[0] && e <= g[1]) {
                            var w;
                            return (w = r[u]) === null || w === void 0 ? void 0 : w.index
                        }
                    } else {
                        var O = Math.min(p, m),
                            S = Math.max(p, m);
                        if (e > (O + h) / 2 && e <= (S + h) / 2) {
                            var E;
                            return (E = r[u]) === null || E === void 0 ? void 0 : E.index
                        }
                    }
            } else if (t)
                for (var _ = 0; _ < o; _++) {
                    var C = t[_];
                    if (C != null) {
                        var j = t[_ + 1],
                            I = t[_ - 1];
                        if (_ === 0 && j != null && e <= (C.coordinate + j.coordinate) / 2 || _ === o - 1 && I != null && e > (C.coordinate + I.coordinate) / 2 || _ > 0 && _ < o - 1 && I != null && j != null && e > (C.coordinate + I.coordinate) / 2 && e <= (C.coordinate + j.coordinate) / 2) return C.index
                    }
                }
        return -1
    },
    Kb = () => M(is),
    Ds = (e, t) => t,
    Wb = (e, t, r) => r,
    Ns = (e, t, r, n) => n,
    uk = A(er, e => Ka(e, t => t.coordinate)),
    Rs = A([fn, Ds, Wb, Ns], Ib),
    $s = A([Rs, vn, hi, bi], Is),
    lk = (e, t, r) => {
        if (t != null) {
            var n = fn(e);
            return t === "axis" ? r === "hover" ? n.axisInteraction.hover.dataKey : n.axisInteraction.click.dataKey : r === "hover" ? n.itemInteraction.hover.dataKey : n.itemInteraction.click.dataKey
        }
    },
    Fb = A([fn, Ds, Wb, Ns], kb),
    Oa = A([Vt, Yt, K, Pe, er, Ns, Fb, gi], _b),
    ck = A([Rs, Oa], (e, t) => {
        var r;
        return (r = e.coordinate) !== null && r !== void 0 ? r : t
    }),
    qb = A([er, $s], Ob),
    sk = A([Fb, $s, Zt, hi, qb, gi, Ds], Cb),
    fk = A([Rs, $s], (e, t) => ({
        isActive: e.active && t != null,
        activeIndex: t
    })),
    dk = (e, t, r, n, i, a, o) => {
        if (!(!e || !r || !n || !i) && ok(e, o)) {
            var u = WO(e, t),
                l = zb(u, a, i, r, n),
                s = ik(t, i, l, e);
            return {
                activeIndex: String(l),
                activeCoordinate: s
            }
        }
    },
    vk = (e, t, r, n, i, a, o) => {
        if (!(!e || !n || !i || !a || !r)) {
            var u = X1(e, r);
            if (u) {
                var l = FO(u, t),
                    s = zb(l, o, a, n, i),
                    c = ak(t, a, s, u);
                return {
                    activeIndex: String(s),
                    activeCoordinate: c
                }
            }
        }
    },
    pk = (e, t, r, n, i, a, o, u) => {
        if (!(!e || !t || !n || !i || !a)) return t === "horizontal" || t === "vertical" ? dk(e, t, n, i, a, o, u) : vk(e, t, r, n, i, a, o)
    },
    hk = A(e => e.zIndex.zIndexMap, (e, t) => t, (e, t, r) => r, (e, t, r) => {
        if (t != null) {
            var n = e[t];
            if (n != null) return r ? n.panoramaElement : n.element
        }
    }),
    mk = A(e => e.zIndex.zIndexMap, e => {
        var t = Object.keys(e).map(n => parseInt(n, 10)).concat(Object.values(ie)),
            r = Array.from(new Set(t));
        return r.sort((n, i) => n - i)
    }, {
        memoizeOptions: {
            resultEqualityCheck: tI
        }
    });

function wp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Pp(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? wp(Object(r), !0).forEach(function(n) {
            yk(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : wp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function yk(e, t, r) {
    return (t = gk(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function gk(e) {
    var t = bk(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function bk(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var xk = {},
    wk = {
        zIndexMap: Object.values(ie).reduce((e, t) => Pp(Pp({}, e), {}, {
            [t]: {
                element: void 0,
                panoramaElement: void 0,
                consumers: 0
            }
        }), xk)
    },
    Pk = new Set(Object.values(ie));

function Ok(e) {
    return Pk.has(e)
}
var Ub = Ge({
        name: "zIndex",
        initialState: wk,
        reducers: {
            registerZIndexPortal: {
                reducer: (e, t) => {
                    var {
                        zIndex: r
                    } = t.payload;
                    e.zIndexMap[r] ? e.zIndexMap[r].consumers += 1 : e.zIndexMap[r] = {
                        consumers: 1,
                        element: void 0,
                        panoramaElement: void 0
                    }
                },
                prepare: se()
            },
            unregisterZIndexPortal: {
                reducer: (e, t) => {
                    var {
                        zIndex: r
                    } = t.payload;
                    e.zIndexMap[r] && (e.zIndexMap[r].consumers -= 1, e.zIndexMap[r].consumers <= 0 && !Ok(r) && delete e.zIndexMap[r])
                },
                prepare: se()
            },
            registerZIndexPortalElement: {
                reducer: (e, t) => {
                    var {
                        zIndex: r,
                        element: n,
                        isPanorama: i
                    } = t.payload;
                    e.zIndexMap[r] ? i ? e.zIndexMap[r].panoramaElement = n : e.zIndexMap[r].element = n : e.zIndexMap[r] = {
                        consumers: 0,
                        element: i ? void 0 : n,
                        panoramaElement: i ? n : void 0
                    }
                },
                prepare: se()
            },
            unregisterZIndexPortalElement: {
                reducer: (e, t) => {
                    var {
                        zIndex: r
                    } = t.payload;
                    e.zIndexMap[r] && (t.payload.isPanorama ? e.zIndexMap[r].panoramaElement = void 0 : e.zIndexMap[r].element = void 0)
                },
                prepare: se()
            }
        }
    }),
    {
        registerZIndexPortal: Ak,
        unregisterZIndexPortal: Sk,
        registerZIndexPortalElement: Ek,
        unregisterZIndexPortalElement: jk
    } = Ub.actions,
    Ik = Ub.reducer;

function ge(e) {
    var {
        zIndex: t,
        children: r
    } = e, n = wA(), i = n && t !== void 0 && t !== 0, a = he(), o = te();
    d.useLayoutEffect(() => i ? (o(Ak({
        zIndex: t
    })), () => {
        o(Sk({
            zIndex: t
        }))
    }) : ei, [o, t, i]);
    var u = M(l => hk(l, t, a));
    return i ? u ? cc.createPortal(r, u) : null : r
}

function Yl() {
    return Yl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Yl.apply(null, arguments)
}

function Op(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Li(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Op(Object(r), !0).forEach(function(n) {
            _k(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Op(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function _k(e, t, r) {
    return (t = kk(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function kk(e) {
    var t = Ck(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function Ck(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function Tk(e) {
    var {
        cursor: t,
        cursorComp: r,
        cursorProps: n
    } = e;
    return d.isValidElement(t) ? d.cloneElement(t, n) : d.createElement(r, n)
}

function Mk(e) {
    var t, {
            coordinate: r,
            payload: n,
            index: i,
            offset: a,
            tooltipAxisBandSize: o,
            layout: u,
            cursor: l,
            tooltipEventType: s,
            chartName: c
        } = e,
        f = r,
        v = n,
        p = i;
    if (!l || !f || c !== "ScatterChart" && s !== "axis") return null;
    var h, m, y;
    if (c === "ScatterChart") h = f, m = s1, y = ie.cursorLine;
    else if (c === "BarChart") h = f1(u, f, a, o), m = Ly, y = ie.cursorRectangle;
    else if (u === "radial" && Tm(f)) {
        var {
            cx: g,
            cy: b,
            radius: x,
            startAngle: P,
            endAngle: w
        } = Ky(f);
        h = {
            cx: g,
            cy: b,
            startAngle: P,
            endAngle: w,
            innerRadius: x,
            outerRadius: x
        }, m = Fy, y = ie.cursorLine
    } else h = {
        points: eS(u, f, a)
    }, m = Er, y = ie.cursorLine;
    var O = typeof l == "object" && "className" in l ? l.className : void 0,
        S = Li(Li(Li(Li({
            stroke: "#ccc",
            pointerEvents: "none"
        }, a), h), At(l)), {}, {
            payload: v,
            payloadIndex: p,
            className: z("recharts-tooltip-cursor", O)
        });
    return d.createElement(ge, {
        zIndex: (t = e.zIndex) !== null && t !== void 0 ? t : y
    }, d.createElement(Tk, {
        cursor: l,
        cursorComp: m,
        cursorProps: S
    }))
}

function Dk(e) {
    var t = ek(),
        r = Iy(),
        n = cr(),
        i = Kb();
    return t == null || r == null || n == null || i == null ? null : d.createElement(Mk, Yl({}, e, {
        offset: r,
        layout: n,
        tooltipAxisBandSize: t,
        chartName: i
    }))
}
var Hb = d.createContext(null),
    Nk = () => d.useContext(Hb),
    Gu = {
        exports: {}
    },
    Ap;

function Rk() {
    return Ap || (Ap = 1, (function(e) {
        var t = Object.prototype.hasOwnProperty,
            r = "~";

        function n() {}
        Object.create && (n.prototype = Object.create(null), new n().__proto__ || (r = !1));

        function i(l, s, c) {
            this.fn = l, this.context = s, this.once = c || !1
        }

        function a(l, s, c, f, v) {
            if (typeof c != "function") throw new TypeError("The listener must be a function");
            var p = new i(c, f || l, v),
                h = r ? r + s : s;
            return l._events[h] ? l._events[h].fn ? l._events[h] = [l._events[h], p] : l._events[h].push(p) : (l._events[h] = p, l._eventsCount++), l
        }

        function o(l, s) {
            --l._eventsCount === 0 ? l._events = new n : delete l._events[s]
        }

        function u() {
            this._events = new n, this._eventsCount = 0
        }
        u.prototype.eventNames = function() {
            var s = [],
                c, f;
            if (this._eventsCount === 0) return s;
            for (f in c = this._events) t.call(c, f) && s.push(r ? f.slice(1) : f);
            return Object.getOwnPropertySymbols ? s.concat(Object.getOwnPropertySymbols(c)) : s
        }, u.prototype.listeners = function(s) {
            var c = r ? r + s : s,
                f = this._events[c];
            if (!f) return [];
            if (f.fn) return [f.fn];
            for (var v = 0, p = f.length, h = new Array(p); v < p; v++) h[v] = f[v].fn;
            return h
        }, u.prototype.listenerCount = function(s) {
            var c = r ? r + s : s,
                f = this._events[c];
            return f ? f.fn ? 1 : f.length : 0
        }, u.prototype.emit = function(s, c, f, v, p, h) {
            var m = r ? r + s : s;
            if (!this._events[m]) return !1;
            var y = this._events[m],
                g = arguments.length,
                b, x;
            if (y.fn) {
                switch (y.once && this.removeListener(s, y.fn, void 0, !0), g) {
                    case 1:
                        return y.fn.call(y.context), !0;
                    case 2:
                        return y.fn.call(y.context, c), !0;
                    case 3:
                        return y.fn.call(y.context, c, f), !0;
                    case 4:
                        return y.fn.call(y.context, c, f, v), !0;
                    case 5:
                        return y.fn.call(y.context, c, f, v, p), !0;
                    case 6:
                        return y.fn.call(y.context, c, f, v, p, h), !0
                }
                for (x = 1, b = new Array(g - 1); x < g; x++) b[x - 1] = arguments[x];
                y.fn.apply(y.context, b)
            } else {
                var P = y.length,
                    w;
                for (x = 0; x < P; x++) switch (y[x].once && this.removeListener(s, y[x].fn, void 0, !0), g) {
                    case 1:
                        y[x].fn.call(y[x].context);
                        break;
                    case 2:
                        y[x].fn.call(y[x].context, c);
                        break;
                    case 3:
                        y[x].fn.call(y[x].context, c, f);
                        break;
                    case 4:
                        y[x].fn.call(y[x].context, c, f, v);
                        break;
                    default:
                        if (!b)
                            for (w = 1, b = new Array(g - 1); w < g; w++) b[w - 1] = arguments[w];
                        y[x].fn.apply(y[x].context, b)
                }
            }
            return !0
        }, u.prototype.on = function(s, c, f) {
            return a(this, s, c, f, !1)
        }, u.prototype.once = function(s, c, f) {
            return a(this, s, c, f, !0)
        }, u.prototype.removeListener = function(s, c, f, v) {
            var p = r ? r + s : s;
            if (!this._events[p]) return this;
            if (!c) return o(this, p), this;
            var h = this._events[p];
            if (h.fn) h.fn === c && (!v || h.once) && (!f || h.context === f) && o(this, p);
            else {
                for (var m = 0, y = [], g = h.length; m < g; m++)(h[m].fn !== c || v && !h[m].once || f && h[m].context !== f) && y.push(h[m]);
                y.length ? this._events[p] = y.length === 1 ? y[0] : y : o(this, p)
            }
            return this
        }, u.prototype.removeAllListeners = function(s) {
            var c;
            return s ? (c = r ? r + s : s, this._events[c] && o(this, c)) : (this._events = new n, this._eventsCount = 0), this
        }, u.prototype.off = u.prototype.removeListener, u.prototype.addListener = u.prototype.on, u.prefixed = r, u.EventEmitter = u, e.exports = u
    })(Gu)), Gu.exports
}
var $k = Rk();
const Lk = _t($k);
var Hn = new Lk,
    Xl = "recharts.syncEvent.tooltip",
    Sp = "recharts.syncEvent.brush";

function pn(e, t) {
    if (t) {
        var r = Number.parseInt(t, 10);
        if (!at(r)) return e ?.[r]
    }
}
var Bk = {
        chartName: "",
        tooltipPayloadSearcher: void 0,
        eventEmitter: void 0,
        defaultTooltipEventType: "axis"
    },
    Gb = Ge({
        name: "options",
        initialState: Bk,
        reducers: {
            createEventEmitter: e => {
                e.eventEmitter == null && (e.eventEmitter = Symbol("rechartsEventEmitter"))
            }
        }
    }),
    zk = Gb.reducer,
    {
        createEventEmitter: Kk
    } = Gb.actions;

function Wk(e) {
    return e.tooltip.syncInteraction
}
var Fk = {
        chartData: void 0,
        computedData: void 0,
        dataStartIndex: 0,
        dataEndIndex: 0
    },
    Vb = Ge({
        name: "chartData",
        initialState: Fk,
        reducers: {
            setChartData(e, t) {
                if (e.chartData = t.payload, t.payload == null) {
                    e.dataStartIndex = 0, e.dataEndIndex = 0;
                    return
                }
                t.payload.length > 0 && e.dataEndIndex !== t.payload.length - 1 && (e.dataEndIndex = t.payload.length - 1)
            },
            setComputedData(e, t) {
                e.computedData = t.payload
            },
            setDataStartEndIndexes(e, t) {
                var {
                    startIndex: r,
                    endIndex: n
                } = t.payload;
                r != null && (e.dataStartIndex = r), n != null && (e.dataEndIndex = n)
            }
        }
    }),
    {
        setChartData: Ep,
        setDataStartEndIndexes: qk,
        setComputedData: jz
    } = Vb.actions,
    Uk = Vb.reducer,
    Hk = ["x", "y"];

function jp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Fr(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? jp(Object(r), !0).forEach(function(n) {
            Gk(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function Gk(e, t, r) {
    return (t = Vk(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function Vk(e) {
    var t = Yk(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function Yk(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function Xk(e, t) {
    if (e == null) return {};
    var r, n, i = Zk(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function Zk(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function Jk() {
    var e = M(as),
        t = M(os),
        r = te(),
        n = M(Fg),
        i = M(er),
        a = cr(),
        o = ii(),
        u = M(l => l.rootProps.className);
    d.useEffect(() => {
        if (e == null) return ei;
        var l = (s, c, f) => {
            if (t !== f && e === s) {
                if (n === "index") {
                    var v;
                    if (o && c !== null && c !== void 0 && (v = c.payload) !== null && v !== void 0 && v.coordinate && c.payload.sourceViewBox) {
                        var p = c.payload.coordinate,
                            {
                                x: h,
                                y: m
                            } = p,
                            y = Xk(p, Hk),
                            {
                                x: g,
                                y: b,
                                width: x,
                                height: P
                            } = c.payload.sourceViewBox,
                            w = Fr(Fr({}, y), {}, {
                                x: o.x + (x ? (h - g) / x : 0) * o.width,
                                y: o.y + (P ? (m - b) / P : 0) * o.height
                            });
                        r(Fr(Fr({}, c), {}, {
                            payload: Fr(Fr({}, c.payload), {}, {
                                coordinate: w
                            })
                        }))
                    } else r(c);
                    return
                }
                if (i != null) {
                    var O;
                    if (typeof n == "function") {
                        var S = {
                                activeTooltipIndex: c.payload.index == null ? void 0 : Number(c.payload.index),
                                isTooltipActive: c.payload.active,
                                activeIndex: c.payload.index == null ? void 0 : Number(c.payload.index),
                                activeLabel: c.payload.label,
                                activeDataKey: c.payload.dataKey,
                                activeCoordinate: c.payload.coordinate
                            },
                            E = n(i, S);
                        O = i[E]
                    } else n === "value" && (O = i.find(q => String(q.value) === c.payload.label));
                    var {
                        coordinate: _
                    } = c.payload;
                    if (O == null || c.payload.active === !1 || _ == null || o == null) {
                        r(Gl({
                            active: !1,
                            coordinate: void 0,
                            dataKey: void 0,
                            index: null,
                            label: void 0,
                            sourceViewBox: void 0,
                            graphicalItemId: void 0
                        }));
                        return
                    }
                    var {
                        x: C,
                        y: j
                    } = _, I = Math.min(C, o.x + o.width), R = Math.min(j, o.y + o.height), $ = {
                        x: a === "horizontal" ? O.coordinate : I,
                        y: a === "horizontal" ? R : O.coordinate
                    }, B = Gl({
                        active: c.payload.active,
                        coordinate: $,
                        dataKey: c.payload.dataKey,
                        index: String(O.index),
                        label: c.payload.label,
                        sourceViewBox: c.payload.sourceViewBox,
                        graphicalItemId: c.payload.graphicalItemId
                    });
                    r(B)
                }
            }
        };
        return Hn.on(Xl, l), () => {
            Hn.off(Xl, l)
        }
    }, [u, r, t, e, n, i, a, o])
}

function Qk() {
    var e = M(as),
        t = M(os),
        r = te();
    d.useEffect(() => {
        if (e == null) return ei;
        var n = (i, a, o) => {
            t !== o && e === i && r(qk(a))
        };
        return Hn.on(Sp, n), () => {
            Hn.off(Sp, n)
        }
    }, [r, t, e])
}

function eC() {
    var e = te();
    d.useEffect(() => {
        e(Kk())
    }, [e]), Jk(), Qk()
}

function tC(e, t, r, n, i, a) {
    var o = M(p => lk(p, e, t)),
        u = M(os),
        l = M(as),
        s = M(Fg),
        c = M(Wk),
        f = c ?.active,
        v = ii();
    d.useEffect(() => {
        if (!f && l != null && u != null) {
            var p = Gl({
                active: a,
                coordinate: r,
                dataKey: o,
                index: i,
                label: typeof n == "number" ? String(n) : n,
                sourceViewBox: v,
                graphicalItemId: void 0
            });
            Hn.emit(Xl, l, p, u)
        }
    }, [f, r, o, i, n, u, l, s, a, v])
}

function Ip(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function _p(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Ip(Object(r), !0).forEach(function(n) {
            rC(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ip(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function rC(e, t, r) {
    return (t = nC(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function nC(e) {
    var t = iC(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function iC(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function aC(e) {
    return e.dataKey
}

function oC(e, t) {
    return d.isValidElement(e) ? d.cloneElement(e, t) : typeof e == "function" ? d.createElement(e, t) : d.createElement(FA, t)
}
var kp = [],
    uC = {
        allowEscapeViewBox: {
            x: !1,
            y: !1
        },
        animationDuration: 400,
        animationEasing: "ease",
        axisId: 0,
        contentStyle: {},
        cursor: !0,
        filterNull: !0,
        includeHidden: !1,
        isAnimationActive: "auto",
        itemSorter: "name",
        itemStyle: {},
        labelStyle: {},
        offset: 10,
        reverseDirection: {
            x: !1,
            y: !1
        },
        separator: " : ",
        trigger: "hover",
        useTranslate3d: !1,
        wrapperStyle: {}
    };

function Iz(e) {
    var t, r, n = ee(e, uC),
        {
            active: i,
            allowEscapeViewBox: a,
            animationDuration: o,
            animationEasing: u,
            content: l,
            filterNull: s,
            isAnimationActive: c,
            offset: f,
            payloadUniqBy: v,
            position: p,
            reverseDirection: h,
            useTranslate3d: m,
            wrapperStyle: y,
            cursor: g,
            shared: b,
            trigger: x,
            defaultIndex: P,
            portal: w,
            axisId: O
        } = n,
        S = te(),
        E = typeof P == "number" ? String(P) : P;
    d.useEffect(() => {
        S(n_({
            shared: b,
            trigger: x,
            axisId: O,
            active: i,
            defaultIndex: E
        }))
    }, [S, b, x, O, i, E]);
    var _ = ii(),
        C = My(),
        j = ZI(b),
        {
            activeIndex: I,
            isActive: R
        } = (t = M(Ke => fk(Ke, j, x, E))) !== null && t !== void 0 ? t : {},
        $ = M(Ke => sk(Ke, j, x, E)),
        B = M(Ke => qb(Ke, j, x, E)),
        q = M(Ke => ck(Ke, j, x, E)),
        W = $,
        V = Nk(),
        L = (r = i ?? R) !== null && r !== void 0 ? r : !1,
        [Me, Le] = Hm([W, L]),
        De = j === "axis" ? B : void 0;
    tC(j, x, q, De, I, L);
    var Tt = w ?? V;
    if (Tt == null || _ == null || j == null) return null;
    var Qe = W ?? kp;
    L || (Qe = kp), s && Qe.length && (Qe = Km(Qe.filter(Ke => Ke.value != null && (Ke.hide !== !0 || n.includeHidden)), v, aC));
    var hr = Qe.length > 0,
        Pn = d.createElement(XA, {
            allowEscapeViewBox: a,
            animationDuration: o,
            animationEasing: u,
            isAnimationActive: c,
            active: L,
            coordinate: q,
            hasPayload: hr,
            offset: f,
            position: p,
            reverseDirection: h,
            useTranslate3d: m,
            viewBox: _,
            wrapperStyle: y,
            lastBoundingBox: Me,
            innerRef: Le,
            hasPortalFromProps: !!w
        }, oC(l, _p(_p({}, n), {}, {
            payload: Qe,
            label: De,
            active: L,
            activeIndex: I,
            coordinate: q,
            accessibilityLayer: C
        })));
    return d.createElement(d.Fragment, null, cc.createPortal(Pn, Tt), L && d.createElement(Dk, {
        cursor: g,
        tooltipEventType: j,
        coordinate: q,
        payload: Qe,
        index: I
    }))
}
var wi = e => null;
wi.displayName = "Cell";

function lC(e, t, r) {
    return (t = cC(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function cC(e) {
    var t = sC(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function sC(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
class fC {
    constructor(t) {
        lC(this, "cache", new Map), this.maxSize = t
    }
    get(t) {
        var r = this.cache.get(t);
        return r !== void 0 && (this.cache.delete(t), this.cache.set(t, r)), r
    }
    set(t, r) {
        if (this.cache.has(t)) this.cache.delete(t);
        else if (this.cache.size >= this.maxSize) {
            var n = this.cache.keys().next().value;
            n != null && this.cache.delete(n)
        }
        this.cache.set(t, r)
    }
    clear() {
        this.cache.clear()
    }
    size() {
        return this.cache.size
    }
}

function Cp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function dC(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Cp(Object(r), !0).forEach(function(n) {
            vC(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Cp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function vC(e, t, r) {
    return (t = pC(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function pC(e) {
    var t = hC(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function hC(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var mC = {
        cacheSize: 2e3,
        enableCache: !0
    },
    Yb = dC({}, mC),
    Tp = new fC(Yb.cacheSize),
    yC = {
        position: "absolute",
        top: "-20000px",
        left: 0,
        padding: 0,
        margin: 0,
        border: "none",
        whiteSpace: "pre"
    },
    Mp = "recharts_measurement_span";

function gC(e, t) {
    var r = t.fontSize || "",
        n = t.fontFamily || "",
        i = t.fontWeight || "",
        a = t.fontStyle || "",
        o = t.letterSpacing || "",
        u = t.textTransform || "";
    return "".concat(e, "|").concat(r, "|").concat(n, "|").concat(i, "|").concat(a, "|").concat(o, "|").concat(u)
}
var Dp = (e, t) => {
        try {
            var r = document.getElementById(Mp);
            r || (r = document.createElement("span"), r.setAttribute("id", Mp), r.setAttribute("aria-hidden", "true"), document.body.appendChild(r)), Object.assign(r.style, yC, t), r.textContent = "".concat(e);
            var n = r.getBoundingClientRect();
            return {
                width: n.width,
                height: n.height
            }
        } catch {
            return {
                width: 0,
                height: 0
            }
        }
    },
    Mn = function(t) {
        var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (t == null || ai.isSsr) return {
            width: 0,
            height: 0
        };
        if (!Yb.enableCache) return Dp(t, r);
        var n = gC(t, r),
            i = Tp.get(n);
        if (i) return i;
        var a = Dp(t, r);
        return Tp.set(n, a), a
    },
    Xb;

function bC(e, t, r) {
    return (t = xC(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function xC(e) {
    var t = wC(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function wC(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var Np = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
    Rp = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
    PC = /^px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q$/,
    OC = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/,
    AC = {
        cm: 96 / 2.54,
        mm: 96 / 25.4,
        pt: 96 / 72,
        pc: 96 / 6,
        in: 96,
        Q: 96 / (2.54 * 40),
        px: 1
    },
    SC = ["cm", "mm", "pt", "pc", "in", "Q", "px"];

function EC(e) {
    return SC.includes(e)
}
var Ur = "NaN";

function jC(e, t) {
    return e * AC[t]
}
class Te {
    static parse(t) {
        var r, [, n, i] = (r = OC.exec(t)) !== null && r !== void 0 ? r : [];
        return n == null ? Te.NaN : new Te(parseFloat(n), i ?? "")
    }
    constructor(t, r) {
        this.num = t, this.unit = r, this.num = t, this.unit = r, at(t) && (this.unit = ""), r !== "" && !PC.test(r) && (this.num = NaN, this.unit = ""), EC(r) && (this.num = jC(t, r), this.unit = "px")
    }
    add(t) {
        return this.unit !== t.unit ? new Te(NaN, "") : new Te(this.num + t.num, this.unit)
    }
    subtract(t) {
        return this.unit !== t.unit ? new Te(NaN, "") : new Te(this.num - t.num, this.unit)
    }
    multiply(t) {
        return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new Te(NaN, "") : new Te(this.num * t.num, this.unit || t.unit)
    }
    divide(t) {
        return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new Te(NaN, "") : new Te(this.num / t.num, this.unit || t.unit)
    }
    toString() {
        return "".concat(this.num).concat(this.unit)
    }
    isNaN() {
        return at(this.num)
    }
}
Xb = Te;
bC(Te, "NaN", new Xb(NaN, ""));

function Zb(e) {
    if (e == null || e.includes(Ur)) return Ur;
    for (var t = e; t.includes("*") || t.includes("/");) {
        var r, [, n, i, a] = (r = Np.exec(t)) !== null && r !== void 0 ? r : [],
            o = Te.parse(n ?? ""),
            u = Te.parse(a ?? ""),
            l = i === "*" ? o.multiply(u) : o.divide(u);
        if (l.isNaN()) return Ur;
        t = t.replace(Np, l.toString())
    }
    for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t);) {
        var s, [, c, f, v] = (s = Rp.exec(t)) !== null && s !== void 0 ? s : [],
            p = Te.parse(c ?? ""),
            h = Te.parse(v ?? ""),
            m = f === "+" ? p.add(h) : p.subtract(h);
        if (m.isNaN()) return Ur;
        t = t.replace(Rp, m.toString())
    }
    return t
}
var $p = /\(([^()]*)\)/;

function IC(e) {
    for (var t = e, r;
        (r = $p.exec(t)) != null;) {
        var [, n] = r;
        t = t.replace($p, Zb(n))
    }
    return t
}

function _C(e) {
    var t = e.replace(/\s+/g, "");
    return t = IC(t), t = Zb(t), t
}

function kC(e) {
    try {
        return _C(e)
    } catch {
        return Ur
    }
}

function Vu(e) {
    var t = kC(e.slice(5, -1));
    return t === Ur ? "" : t
}
var CC = ["x", "y", "lineHeight", "capHeight", "fill", "scaleToFit", "textAnchor", "verticalAnchor"],
    TC = ["dx", "dy", "angle", "className", "breakAll"];

function Zl() {
    return Zl = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Zl.apply(null, arguments)
}

function Lp(e, t) {
    if (e == null) return {};
    var r, n, i = MC(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function MC(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var Jb = /[ \f\n\r\t\v\u2028\u2029]+/,
    Qb = e => {
        var {
            children: t,
            breakAll: r,
            style: n
        } = e;
        try {
            var i = [];
            X(t) || (r ? i = t.toString().split("") : i = t.toString().split(Jb));
            var a = i.map(u => ({
                    word: u,
                    width: Mn(u, n).width
                })),
                o = r ? 0 : Mn(" ", n).width;
            return {
                wordsWithComputedWidth: a,
                spaceWidth: o
            }
        } catch {
            return null
        }
    };

function DC(e) {
    return e === "start" || e === "middle" || e === "end" || e === "inherit"
}
var e0 = (e, t, r, n) => e.reduce((i, a) => {
        var {
            word: o,
            width: u
        } = a, l = i[i.length - 1];
        if (l && u != null && (t == null || n || l.width + u + r < Number(t))) l.words.push(o), l.width += u + r;
        else {
            var s = {
                words: [o],
                width: u
            };
            i.push(s)
        }
        return i
    }, []),
    t0 = e => e.reduce((t, r) => t.width > r.width ? t : r),
    NC = "…",
    Bp = (e, t, r, n, i, a, o, u) => {
        var l = e.slice(0, t),
            s = Qb({
                breakAll: r,
                style: n,
                children: l + NC
            });
        if (!s) return [!1, []];
        var c = e0(s.wordsWithComputedWidth, a, o, u),
            f = c.length > i || t0(c).width > Number(a);
        return [f, c]
    },
    RC = (e, t, r, n, i) => {
        var {
            maxLines: a,
            children: o,
            style: u,
            breakAll: l
        } = e, s = D(a), c = String(o), f = e0(t, n, r, i);
        if (!s || i) return f;
        var v = f.length > a || t0(f).width > Number(n);
        if (!v) return f;
        for (var p = 0, h = c.length - 1, m = 0, y; p <= h && m <= c.length - 1;) {
            var g = Math.floor((p + h) / 2),
                b = g - 1,
                [x, P] = Bp(c, b, l, u, a, n, r, i),
                [w] = Bp(c, g, l, u, a, n, r, i);
            if (!x && !w && (p = g + 1), x && w && (h = g - 1), !x && w) {
                y = P;
                break
            }
            m++
        }
        return y || f
    },
    zp = e => {
        var t = X(e) ? [] : e.toString().split(Jb);
        return [{
            words: t,
            width: void 0
        }]
    },
    $C = e => {
        var {
            width: t,
            scaleToFit: r,
            children: n,
            style: i,
            breakAll: a,
            maxLines: o
        } = e;
        if ((t || r) && !ai.isSsr) {
            var u, l, s = Qb({
                breakAll: a,
                children: n,
                style: i
            });
            if (s) {
                var {
                    wordsWithComputedWidth: c,
                    spaceWidth: f
                } = s;
                u = c, l = f
            } else return zp(n);
            return RC({
                breakAll: a,
                children: n,
                maxLines: o,
                style: i
            }, u, l, t, !!r)
        }
        return zp(n)
    },
    r0 = "#808080",
    LC = {
        angle: 0,
        breakAll: !1,
        capHeight: "0.71em",
        fill: r0,
        lineHeight: "1em",
        scaleToFit: !1,
        textAnchor: "start",
        verticalAnchor: "end",
        x: 0,
        y: 0
    },
    hn = d.forwardRef((e, t) => {
        var r = ee(e, LC),
            {
                x: n,
                y: i,
                lineHeight: a,
                capHeight: o,
                fill: u,
                scaleToFit: l,
                textAnchor: s,
                verticalAnchor: c
            } = r,
            f = Lp(r, CC),
            v = d.useMemo(() => $C({
                breakAll: f.breakAll,
                children: f.children,
                maxLines: f.maxLines,
                scaleToFit: l,
                style: f.style,
                width: f.width
            }), [f.breakAll, f.children, f.maxLines, l, f.style, f.width]),
            {
                dx: p,
                dy: h,
                angle: m,
                className: y,
                breakAll: g
            } = f,
            b = Lp(f, TC);
        if (!St(n) || !St(i) || v.length === 0) return null;
        var x = Number(n) + (D(p) ? p : 0),
            P = Number(i) + (D(h) ? h : 0);
        if (!ae(x) || !ae(P)) return null;
        var w;
        switch (c) {
            case "start":
                w = Vu("calc(".concat(o, ")"));
                break;
            case "middle":
                w = Vu("calc(".concat((v.length - 1) / 2, " * -").concat(a, " + (").concat(o, " / 2))"));
                break;
            default:
                w = Vu("calc(".concat(v.length - 1, " * -").concat(a, ")"));
                break
        }
        var O = [];
        if (l) {
            var S = v[0].width,
                {
                    width: E
                } = f;
            O.push("scale(".concat(D(E) && D(S) ? E / S : 1, ")"))
        }
        return m && O.push("rotate(".concat(m, ", ").concat(x, ", ").concat(P, ")")), O.length && (b.transform = O.join(" ")), d.createElement("text", Zl({}, ye(b), {
            ref: t,
            x,
            y: P,
            className: z("recharts-text", y),
            textAnchor: s,
            fill: u.includes("url") ? r0 : u
        }), v.map((_, C) => {
            var j = _.words.join(g ? "" : " ");
            return d.createElement("tspan", {
                x,
                dy: C === 0 ? w : a,
                key: "".concat(j, "-").concat(C)
            }, j)
        }))
    });
hn.displayName = "Text";
var BC = ["labelRef"],
    zC = ["content"];

function Kp(e, t) {
    if (e == null) return {};
    var r, n, i = KC(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function KC(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function Wp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function me(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Wp(Object(r), !0).forEach(function(n) {
            WC(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Wp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function WC(e, t, r) {
    return (t = FC(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function FC(e) {
    var t = qC(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function qC(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function Mt() {
    return Mt = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Mt.apply(null, arguments)
}
var n0 = d.createContext(null),
    UC = e => {
        var {
            x: t,
            y: r,
            upperWidth: n,
            lowerWidth: i,
            width: a,
            height: o,
            children: u
        } = e, l = d.useMemo(() => ({
            x: t,
            y: r,
            upperWidth: n,
            lowerWidth: i,
            width: a,
            height: o
        }), [t, r, n, i, a, o]);
        return d.createElement(n0.Provider, {
            value: l
        }, u)
    },
    i0 = () => {
        var e = d.useContext(n0),
            t = ii();
        return e || jy(t)
    },
    a0 = d.createContext(null),
    HC = e => {
        var {
            cx: t,
            cy: r,
            innerRadius: n,
            outerRadius: i,
            startAngle: a,
            endAngle: o,
            clockWise: u,
            children: l
        } = e, s = d.useMemo(() => ({
            cx: t,
            cy: r,
            innerRadius: n,
            outerRadius: i,
            startAngle: a,
            endAngle: o,
            clockWise: u
        }), [t, r, n, i, a, o, u]);
        return d.createElement(a0.Provider, {
            value: s
        }, l)
    },
    o0 = () => {
        var e = d.useContext(a0),
            t = M(on);
        return e || t
    },
    GC = e => {
        var {
            value: t,
            formatter: r
        } = e, n = X(e.children) ? t : e.children;
        return typeof r == "function" ? r(n) : n
    },
    Ls = e => e != null && typeof e == "function",
    VC = (e, t) => {
        var r = _e(t - e),
            n = Math.min(Math.abs(t - e), 360);
        return r * n
    },
    YC = (e, t, r, n, i) => {
        var {
            offset: a,
            className: o
        } = e, {
            cx: u,
            cy: l,
            innerRadius: s,
            outerRadius: c,
            startAngle: f,
            endAngle: v,
            clockWise: p
        } = i, h = (s + c) / 2, m = VC(f, v), y = m >= 0 ? 1 : -1, g, b;
        switch (t) {
            case "insideStart":
                g = f + y * a, b = p;
                break;
            case "insideEnd":
                g = v - y * a, b = !p;
                break;
            case "end":
                g = v + y * a, b = p;
                break;
            default:
                throw new Error("Unsupported position ".concat(t))
        }
        b = m <= 0 ? b : !b;
        var x = J(u, l, h, g),
            P = J(u, l, h, g + (b ? 1 : -1) * 359),
            w = "M".concat(x.x, ",").concat(x.y, `
    A`).concat(h, ",").concat(h, ",0,1,").concat(b ? 0 : 1, `,
    `).concat(P.x, ",").concat(P.y),
            O = X(e.id) ? Rn("recharts-radial-line-") : e.id;
        return d.createElement("text", Mt({}, n, {
            dominantBaseline: "central",
            className: z("recharts-radial-bar-label", o)
        }), d.createElement("defs", null, d.createElement("path", {
            id: O,
            d: w
        })), d.createElement("textPath", {
            xlinkHref: "#".concat(O)
        }, r))
    },
    XC = (e, t, r) => {
        var {
            cx: n,
            cy: i,
            innerRadius: a,
            outerRadius: o,
            startAngle: u,
            endAngle: l
        } = e, s = (u + l) / 2;
        if (r === "outside") {
            var {
                x: c,
                y: f
            } = J(n, i, o + t, s);
            return {
                x: c,
                y: f,
                textAnchor: c >= n ? "start" : "end",
                verticalAnchor: "middle"
            }
        }
        if (r === "center") return {
            x: n,
            y: i,
            textAnchor: "middle",
            verticalAnchor: "middle"
        };
        if (r === "centerTop") return {
            x: n,
            y: i,
            textAnchor: "middle",
            verticalAnchor: "start"
        };
        if (r === "centerBottom") return {
            x: n,
            y: i,
            textAnchor: "middle",
            verticalAnchor: "end"
        };
        var v = (a + o) / 2,
            {
                x: p,
                y: h
            } = J(n, i, v, s);
        return {
            x: p,
            y: h,
            textAnchor: "middle",
            verticalAnchor: "middle"
        }
    },
    Jl = e => "cx" in e && D(e.cx),
    ZC = (e, t) => {
        var {
            parentViewBox: r,
            offset: n,
            position: i
        } = e, a;
        r != null && !Jl(r) && (a = r);
        var {
            x: o,
            y: u,
            upperWidth: l,
            lowerWidth: s,
            height: c
        } = t, f = o, v = o + (l - s) / 2, p = (f + v) / 2, h = (l + s) / 2, m = f + l / 2, y = c >= 0 ? 1 : -1, g = y * n, b = y > 0 ? "end" : "start", x = y > 0 ? "start" : "end", P = l >= 0 ? 1 : -1, w = P * n, O = P > 0 ? "end" : "start", S = P > 0 ? "start" : "end";
        if (i === "top") {
            var E = {
                x: f + l / 2,
                y: u - g,
                textAnchor: "middle",
                verticalAnchor: b
            };
            return me(me({}, E), a ? {
                height: Math.max(u - a.y, 0),
                width: l
            } : {})
        }
        if (i === "bottom") {
            var _ = {
                x: v + s / 2,
                y: u + c + g,
                textAnchor: "middle",
                verticalAnchor: x
            };
            return me(me({}, _), a ? {
                height: Math.max(a.y + a.height - (u + c), 0),
                width: s
            } : {})
        }
        if (i === "left") {
            var C = {
                x: p - w,
                y: u + c / 2,
                textAnchor: O,
                verticalAnchor: "middle"
            };
            return me(me({}, C), a ? {
                width: Math.max(C.x - a.x, 0),
                height: c
            } : {})
        }
        if (i === "right") {
            var j = {
                x: p + h + w,
                y: u + c / 2,
                textAnchor: S,
                verticalAnchor: "middle"
            };
            return me(me({}, j), a ? {
                width: Math.max(a.x + a.width - j.x, 0),
                height: c
            } : {})
        }
        var I = a ? {
            width: h,
            height: c
        } : {};
        return i === "insideLeft" ? me({
            x: p + w,
            y: u + c / 2,
            textAnchor: S,
            verticalAnchor: "middle"
        }, I) : i === "insideRight" ? me({
            x: p + h - w,
            y: u + c / 2,
            textAnchor: O,
            verticalAnchor: "middle"
        }, I) : i === "insideTop" ? me({
            x: f + l / 2,
            y: u + g,
            textAnchor: "middle",
            verticalAnchor: x
        }, I) : i === "insideBottom" ? me({
            x: v + s / 2,
            y: u + c - g,
            textAnchor: "middle",
            verticalAnchor: b
        }, I) : i === "insideTopLeft" ? me({
            x: f + w,
            y: u + g,
            textAnchor: S,
            verticalAnchor: x
        }, I) : i === "insideTopRight" ? me({
            x: f + l - w,
            y: u + g,
            textAnchor: O,
            verticalAnchor: x
        }, I) : i === "insideBottomLeft" ? me({
            x: v + w,
            y: u + c - g,
            textAnchor: S,
            verticalAnchor: b
        }, I) : i === "insideBottomRight" ? me({
            x: v + s - w,
            y: u + c - g,
            textAnchor: O,
            verticalAnchor: b
        }, I) : i && typeof i == "object" && (D(i.x) || zt(i.x)) && (D(i.y) || zt(i.y)) ? me({
            x: o + $e(i.x, h),
            y: u + $e(i.y, c),
            textAnchor: "end",
            verticalAnchor: "end"
        }, I) : me({
            x: m,
            y: u + c / 2,
            textAnchor: "middle",
            verticalAnchor: "middle"
        }, I)
    },
    JC = {
        angle: 0,
        offset: 5,
        zIndex: ie.label,
        position: "middle",
        textBreakAll: !1
    };

function rr(e) {
    var t = ee(e, JC),
        {
            viewBox: r,
            position: n,
            value: i,
            children: a,
            content: o,
            className: u = "",
            textBreakAll: l,
            labelRef: s
        } = t,
        c = o0(),
        f = i0(),
        v = n === "center" ? f : c ?? f,
        p, h, m;
    if (r == null ? p = v : Jl(r) ? p = r : p = jy(r), !p || X(i) && X(a) && !d.isValidElement(o) && typeof o != "function") return null;
    var y = me(me({}, t), {}, {
        viewBox: p
    });
    if (d.isValidElement(o)) {
        var {
            labelRef: g
        } = y, b = Kp(y, BC);
        return d.cloneElement(o, b)
    }
    if (typeof o == "function") {
        var {
            content: x
        } = y, P = Kp(y, zC);
        if (h = d.createElement(o, P), d.isValidElement(h)) return h
    } else h = GC(t);
    var w = ye(t);
    if (Jl(p)) {
        if (n === "insideStart" || n === "insideEnd" || n === "end") return YC(t, n, h, w, p);
        m = XC(p, t.offset, t.position)
    } else m = ZC(t, p);
    return d.createElement(ge, {
        zIndex: t.zIndex
    }, d.createElement(hn, Mt({
        ref: s,
        className: z("recharts-label", u)
    }, w, m, {
        textAnchor: DC(w.textAnchor) ? w.textAnchor : m.textAnchor,
        breakAll: l
    }), h))
}
rr.displayName = "Label";
var u0 = (e, t, r) => {
    if (!e) return null;
    var n = {
        viewBox: t,
        labelRef: r
    };
    return e === !0 ? d.createElement(rr, Mt({
        key: "label-implicit"
    }, n)) : St(e) ? d.createElement(rr, Mt({
        key: "label-implicit",
        value: e
    }, n)) : d.isValidElement(e) ? e.type === rr ? d.cloneElement(e, me({
        key: "label-implicit"
    }, n)) : d.createElement(rr, Mt({
        key: "label-implicit",
        content: e
    }, n)) : Ls(e) ? d.createElement(rr, Mt({
        key: "label-implicit",
        content: e
    }, n)) : e && typeof e == "object" ? d.createElement(rr, Mt({}, e, {
        key: "label-implicit"
    }, n)) : null
};

function QC(e) {
    var {
        label: t,
        labelRef: r
    } = e, n = i0();
    return u0(t, n, r) || null
}

function eT(e) {
    var {
        label: t
    } = e, r = o0();
    return u0(t, r) || null
}
var Yu = {},
    Xu = {},
    Fp;

function tT() {
    return Fp || (Fp = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return r[r.length - 1]
        }
        e.last = t
    })(Xu)), Xu
}
var Zu = {},
    qp;

function rT() {
    return qp || (qp = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            return Array.isArray(r) ? r : Array.from(r)
        }
        e.toArray = t
    })(Zu)), Zu
}
var Up;

function nT() {
    return Up || (Up = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = tT(),
            r = rT(),
            n = bc();

        function i(a) {
            if (n.isArrayLike(a)) return t.last(r.toArray(a))
        }
        e.last = i
    })(Yu)), Yu
}
var Ju, Hp;

function iT() {
    return Hp || (Hp = 1, Ju = nT().last), Ju
}
var aT = iT();
const l0 = _t(aT);
var oT = ["valueAccessor"],
    uT = ["dataKey", "clockWise", "id", "textBreakAll", "zIndex"];

function Aa() {
    return Aa = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Aa.apply(null, arguments)
}

function Gp(e, t) {
    if (e == null) return {};
    var r, n, i = lT(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function lT(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var cT = e => Array.isArray(e.value) ? l0(e.value) : e.value,
    c0 = d.createContext(void 0),
    Pi = c0.Provider,
    s0 = d.createContext(void 0),
    sT = s0.Provider;

function fT() {
    return d.useContext(c0)
}

function dT() {
    return d.useContext(s0)
}

function Fi(e) {
    var {
        valueAccessor: t = cT
    } = e, r = Gp(e, oT), {
        dataKey: n,
        clockWise: i,
        id: a,
        textBreakAll: o,
        zIndex: u
    } = r, l = Gp(r, uT), s = fT(), c = dT(), f = s || c;
    return !f || !f.length ? null : d.createElement(ge, {
        zIndex: u ?? ie.label
    }, d.createElement(G, {
        className: "recharts-label-list"
    }, f.map((v, p) => {
        var h, m = X(n) ? t(v, p) : H(v && v.payload, n),
            y = X(a) ? {} : {
                id: "".concat(a, "-").concat(p)
            };
        return d.createElement(rr, Aa({
            key: "label-".concat(p)
        }, ye(v), l, y, {
            fill: (h = r.fill) !== null && h !== void 0 ? h : v.fill,
            parentViewBox: v.parentViewBox,
            value: m,
            textBreakAll: o,
            viewBox: v.viewBox,
            index: p,
            zIndex: 0
        }))
    })))
}
Fi.displayName = "LabelList";

function mn(e) {
    var {
        label: t
    } = e;
    return t ? t === !0 ? d.createElement(Fi, {
        key: "labelList-implicit"
    }) : d.isValidElement(t) || Ls(t) ? d.createElement(Fi, {
        key: "labelList-implicit",
        content: t
    }) : typeof t == "object" ? d.createElement(Fi, Aa({
        key: "labelList-implicit"
    }, t, {
        type: String(t.type)
    })) : null : null
}
var vT = ["points", "className", "baseLinePoints", "connectNulls"],
    Vp;

function Hr() {
    return Hr = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Hr.apply(null, arguments)
}

function pT(e, t) {
    if (e == null) return {};
    var r, n, i = hT(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function hT(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function mT(e, t) {
    return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
        raw: {
            value: Object.freeze(t)
        }
    }))
}
var Yp = e => e && e.x === +e.x && e.y === +e.y,
    yT = function() {
        var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
            r = [
                []
            ];
        return t.forEach(n => {
            Yp(n) ? r[r.length - 1].push(n) : r[r.length - 1].length > 0 && r.push([])
        }), Yp(t[0]) && r[r.length - 1].push(t[0]), r[r.length - 1].length <= 0 && (r = r.slice(0, -1)), r
    },
    Dn = (e, t) => {
        var r = yT(e);
        t && (r = [r.reduce((i, a) => [...i, ...a], [])]);
        var n = r.map(i => i.reduce((a, o, u) => de(Vp || (Vp = mT(["", "", "", ",", ""])), a, u === 0 ? "M" : "L", o.x, o.y), "")).join("");
        return r.length === 1 ? "".concat(n, "Z") : n
    },
    gT = (e, t, r) => {
        var n = Dn(e, r);
        return "".concat(n.slice(-1) === "Z" ? n.slice(0, -1) : n, "L").concat(Dn(Array.from(t).reverse(), r).slice(1))
    },
    f0 = e => {
        var {
            points: t,
            className: r,
            baseLinePoints: n,
            connectNulls: i
        } = e, a = pT(e, vT);
        if (!t || !t.length) return null;
        var o = z("recharts-polygon", r);
        if (n && n.length) {
            var u = a.stroke && a.stroke !== "none",
                l = gT(t, n, i);
            return d.createElement("g", {
                className: o
            }, d.createElement("path", Hr({}, ye(a), {
                fill: l.slice(-1) === "Z" ? a.fill : "none",
                stroke: "none",
                d: l
            })), u ? d.createElement("path", Hr({}, ye(a), {
                fill: "none",
                d: Dn(t, i)
            })) : null, u ? d.createElement("path", Hr({}, ye(a), {
                fill: "none",
                d: Dn(n, i)
            })) : null)
        }
        var s = Dn(t, i);
        return d.createElement("path", Hr({}, ye(a), {
            fill: s.slice(-1) === "Z" ? a.fill : "none",
            className: o,
            d: s
        }))
    };

function Ql() {
    return Ql = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Ql.apply(null, arguments)
}
var Bs = e => {
        var {
            cx: t,
            cy: r,
            r: n,
            className: i
        } = e, a = z("recharts-dot", i);
        return D(t) && D(r) && D(n) ? d.createElement("circle", Ql({}, re(e), gc(e), {
            className: a,
            cx: t,
            cy: r,
            r: n
        })) : null
    },
    zs = e => e.graphicalItems.polarItems,
    bT = A([oe, vi], cs),
    go = A([zs, ve, bT], ss),
    xT = A([go], fs),
    bo = A([xT, si], ds),
    d0 = A([bo, ve, go], ps);
A([bo, ve, go], (e, t, r) => r.length > 0 ? e.flatMap(n => r.flatMap(i => {
    var a, o = H(n, (a = t.dataKey) !== null && a !== void 0 ? a : i.dataKey);
    return {
        value: o,
        errorDomain: []
    }
})).filter(Boolean) : t ?.dataKey != null ? e.map(n => ({
    value: H(n, t.dataKey),
    errorDomain: []
})) : e.map(n => ({
    value: n,
    errorDomain: []
})));
var Xp = () => {},
    wT = A([bo, ve, go, vo, oe], gs),
    PT = A([ve, ms, ys, Xp, wT, Xp, K, oe], bs),
    v0 = A([ve, K, bo, d0, fi, oe, PT], xs),
    p0 = A([v0, ve, pr], Ps),
    OT = A([ve, v0, p0, oe], As),
    Ks = (e, t, r) => {
        switch (t) {
            case "angleAxis":
                return an(e, r);
            case "radiusAxis":
                return di(e, r);
            default:
                throw new Error("Unexpected axis type: ".concat(t))
        }
    },
    Ws = (e, t, r) => {
        switch (t) {
            case "angleAxis":
                return Qj(e, r);
            case "radiusAxis":
                return eI(e, r);
            default:
                throw new Error("Unexpected axis type: ".concat(t))
        }
    },
    yn = A([Ks, pr, OT, Ws], po),
    h0 = A([K, d0, ln, oe], Ss),
    gn = A([K, Ks, pr, yn, p0, Ws, yi, h0, oe], yb),
    AT = A([gn], e => {
        if (e) {
            var t = new Map;
            return e.forEach(r => {
                var n = (r.coordinate + 360) % 360;
                t.has(n) || t.set(n, r)
            }), Array.from(t.values())
        }
    });
A([K, Ks, yn, Ws, yi, h0, oe], bb);
var ST = (e, t) => gn(e, "angleAxis", t, !1),
    ET = A([ST], e => {
        if (e) return e.map(t => t.coordinate)
    }),
    jT = (e, t) => gn(e, "radiusAxis", t, !1),
    IT = A([jT], e => {
        if (e) return e.map(t => t.coordinate)
    }),
    _T = ["gridType", "radialLines", "angleAxisId", "radiusAxisId", "cx", "cy", "innerRadius", "outerRadius", "polarAngles", "polarRadius"];

function kT(e, t) {
    if (e == null) return {};
    var r, n, i = CT(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function CT(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function pt() {
    return pt = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, pt.apply(null, arguments)
}

function Zp(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Gn(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Zp(Object(r), !0).forEach(function(n) {
            TT(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Zp(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function TT(e, t, r) {
    return (t = MT(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function MT(e) {
    var t = DT(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function DT(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var NT = (e, t, r, n) => {
        var i = "";
        return n.forEach((a, o) => {
            var u = J(t, r, e, a);
            o ? i += "L ".concat(u.x, ",").concat(u.y) : i += "M ".concat(u.x, ",").concat(u.y)
        }), i += "Z", i
    },
    RT = e => {
        var {
            cx: t,
            cy: r,
            innerRadius: n,
            outerRadius: i,
            polarAngles: a,
            radialLines: o
        } = e;
        if (!a || !a.length || !o) return null;
        var u = Gn({
            stroke: "#ccc"
        }, re(e));
        return d.createElement("g", {
            className: "recharts-polar-grid-angle"
        }, a.map(l => {
            var s = J(t, r, n, l),
                c = J(t, r, i, l);
            return d.createElement("line", pt({
                key: "line-".concat(l)
            }, u, {
                x1: s.x,
                y1: s.y,
                x2: c.x,
                y2: c.y
            }))
        }))
    },
    Jp = e => {
        var {
            cx: t,
            cy: r,
            radius: n
        } = e, i = Gn({
            stroke: "#ccc",
            fill: "none"
        }, re(e));
        return d.createElement("circle", pt({}, i, {
            className: z("recharts-polar-grid-concentric-circle", e.className),
            cx: t,
            cy: r,
            r: n
        }))
    },
    Qp = e => {
        var {
            radius: t
        } = e, r = Gn({
            stroke: "#ccc",
            fill: "none"
        }, re(e));
        return d.createElement("path", pt({}, r, {
            className: z("recharts-polar-grid-concentric-polygon", e.className),
            d: NT(t, e.cx, e.cy, e.polarAngles)
        }))
    },
    $T = e => {
        var {
            polarRadius: t,
            gridType: r
        } = e;
        if (!t || !t.length) return null;
        var n = Math.max(...t),
            i = e.fill && e.fill !== "none";
        return d.createElement("g", {
            className: "recharts-polar-grid-concentric"
        }, i && r === "circle" && d.createElement(Jp, pt({}, e, {
            radius: n
        })), i && r !== "circle" && d.createElement(Qp, pt({}, e, {
            radius: n
        })), t.map((a, o) => {
            var u = o;
            return r === "circle" ? d.createElement(Jp, pt({
                key: u
            }, e, {
                fill: "none",
                radius: a
            })) : d.createElement(Qp, pt({
                key: u
            }, e, {
                fill: "none",
                radius: a
            }))
        }))
    },
    LT = e => {
        var t, r, n, i, a, o, u, l, s, {
                gridType: c = "polygon",
                radialLines: f = !0,
                angleAxisId: v = 0,
                radiusAxisId: p = 0,
                cx: h,
                cy: m,
                innerRadius: y,
                outerRadius: g,
                polarAngles: b,
                polarRadius: x
            } = e,
            P = kT(e, _T),
            w = M(on),
            O = M(I => ET(I, v)),
            S = M(I => IT(I, p)),
            E = Array.isArray(b) ? b : O,
            _ = Array.isArray(x) ? x : S;
        if (E == null || _ == null) return null;
        var C = Gn(Gn({
                cx: (t = (r = w ?.cx) !== null && r !== void 0 ? r : h) !== null && t !== void 0 ? t : 0,
                cy: (n = (i = w ?.cy) !== null && i !== void 0 ? i : m) !== null && n !== void 0 ? n : 0,
                innerRadius: (a = (o = w ?.innerRadius) !== null && o !== void 0 ? o : y) !== null && a !== void 0 ? a : 0,
                outerRadius: (u = (l = w ?.outerRadius) !== null && l !== void 0 ? l : g) !== null && u !== void 0 ? u : 0,
                polarAngles: E,
                polarRadius: _
            }, P), {}, {
                zIndex: (s = P.zIndex) !== null && s !== void 0 ? s : ie.grid
            }),
            {
                outerRadius: j
            } = C;
        return j <= 0 ? null : d.createElement(ge, {
            zIndex: C.zIndex
        }, d.createElement("g", {
            className: "recharts-polar-grid"
        }, d.createElement($T, pt({
            gridType: c,
            radialLines: f
        }, C, {
            polarAngles: E,
            polarRadius: _
        })), d.createElement(RT, pt({
            gridType: c,
            radialLines: f
        }, C, {
            polarAngles: E,
            polarRadius: _
        }))))
    };
LT.displayName = "PolarGrid";
var Qu = {},
    el = {},
    eh;

function BT() {
    return eh || (eh = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r, n) {
            if (r.length === 0) return;
            let i = r[0],
                a = n(i);
            for (let o = 1; o < r.length; o++) {
                const u = r[o],
                    l = n(u);
                l > a && (a = l, i = u)
            }
            return i
        }
        e.maxBy = t
    })(el)), el
}
var th;

function zT() {
    return th || (th = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = BT(),
            r = za(),
            n = xc();

        function i(a, o) {
            if (a != null) return t.maxBy(Array.from(a), n.iteratee(o ?? r.identity))
        }
        e.maxBy = i
    })(Qu)), Qu
}
var tl, rh;

function KT() {
    return rh || (rh = 1, tl = zT().maxBy), tl
}
var WT = KT();
const FT = _t(WT);
var rl = {},
    nl = {},
    nh;

function qT() {
    return nh || (nh = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r, n) {
            if (r.length === 0) return;
            let i = r[0],
                a = n(i);
            for (let o = 1; o < r.length; o++) {
                const u = r[o],
                    l = n(u);
                l < a && (a = l, i = u)
            }
            return i
        }
        e.minBy = t
    })(nl)), nl
}
var ih;

function UT() {
    return ih || (ih = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });
        const t = qT(),
            r = za(),
            n = xc();

        function i(a, o) {
            if (a != null) return t.minBy(Array.from(a), n.iteratee(o ?? r.identity))
        }
        e.minBy = i
    })(rl)), rl
}
var il, ah;

function HT() {
    return ah || (ah = 1, il = UT().minBy), il
}
var GT = HT();
const VT = _t(GT);
var YT = {
        radiusAxis: {},
        angleAxis: {}
    },
    m0 = Ge({
        name: "polarAxis",
        initialState: YT,
        reducers: {
            addRadiusAxis(e, t) {
                e.radiusAxis[t.payload.id] = t.payload
            },
            removeRadiusAxis(e, t) {
                delete e.radiusAxis[t.payload.id]
            },
            addAngleAxis(e, t) {
                e.angleAxis[t.payload.id] = t.payload
            },
            removeAngleAxis(e, t) {
                delete e.angleAxis[t.payload.id]
            }
        }
    }),
    {
        addRadiusAxis: XT,
        removeRadiusAxis: ZT,
        addAngleAxis: JT,
        removeAngleAxis: QT
    } = m0.actions,
    eM = m0.reducer,
    tM = ["cx", "cy", "angle", "axisLine"],
    rM = ["angle", "tickFormatter", "stroke", "tick"];

function Vn() {
    return Vn = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Vn.apply(null, arguments)
}

function oh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function $t(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? oh(Object(r), !0).forEach(function(n) {
            nM(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : oh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function nM(e, t, r) {
    return (t = iM(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function iM(e) {
    var t = aM(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function aM(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function y0(e, t) {
    if (e == null) return {};
    var r, n, i = oM(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function oM(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var uM = "radiusAxis";

function lM(e) {
    var t = te();
    return d.useEffect(() => (t(XT(e)), () => {
        t(ZT(e))
    })), null
}
var cM = (e, t, r, n) => {
        var {
            coordinate: i
        } = e;
        return J(r, n, i, t)
    },
    sM = e => {
        var t;
        switch (e) {
            case "left":
                t = "end";
                break;
            case "right":
                t = "start";
                break;
            default:
                t = "middle";
                break
        }
        return t
    },
    fM = (e, t, r, n) => {
        var i = FT(n, o => o.coordinate || 0),
            a = VT(n, o => o.coordinate || 0);
        return {
            cx: t,
            cy: r,
            startAngle: e,
            endAngle: e,
            innerRadius: a ?.coordinate || 0,
            outerRadius: i ?.coordinate || 0,
            clockWise: !1
        }
    },
    dM = (e, t) => {
        var {
            cx: r,
            cy: n,
            angle: i,
            axisLine: a
        } = e, o = y0(e, tM), u = t.reduce((f, v) => [Math.min(f[0], v.coordinate), Math.max(f[1], v.coordinate)], [1 / 0, -1 / 0]), l = J(r, n, u[0], i), s = J(r, n, u[1], i), c = $t($t($t({}, re(o)), {}, {
            fill: "none"
        }, re(a)), {}, {
            x1: l.x,
            y1: l.y,
            x2: s.x,
            y2: s.y
        });
        return d.createElement("line", Vn({
            className: "recharts-polar-radius-axis-line"
        }, c))
    },
    vM = (e, t, r) => {
        var n;
        return d.isValidElement(e) ? n = d.cloneElement(e, t) : typeof e == "function" ? n = e(t) : n = d.createElement(hn, Vn({}, t, {
            className: "recharts-polar-radius-axis-tick-value"
        }), r), n
    },
    pM = (e, t) => {
        var {
            angle: r,
            tickFormatter: n,
            stroke: i,
            tick: a
        } = e, o = y0(e, rM), u = sM(e.orientation), l = re(o), s = At(a), c = t.map((f, v) => {
            var p = cM(f, e.angle, e.cx, e.cy),
                h = $t($t($t($t({
                    textAnchor: u,
                    transform: "rotate(".concat(90 - r, ", ").concat(p.x, ", ").concat(p.y, ")")
                }, l), {}, {
                    stroke: "none",
                    fill: i
                }, s), {}, {
                    index: v
                }, p), {}, {
                    payload: f
                });
            return d.createElement(G, Vn({
                className: z("recharts-polar-radius-axis-tick", zy(a)),
                key: "tick-".concat(f.coordinate)
            }, lr(e, f, v)), vM(a, h, n ? n(f.value, v) : f.value))
        });
        return d.createElement(G, {
            className: "recharts-polar-radius-axis-ticks"
        }, c)
    },
    hM = e => {
        var {
            radiusAxisId: t
        } = e, r = M(on), n = M(l => yn(l, "radiusAxis", t)), i = M(l => gn(l, "radiusAxis", t, !1));
        if (r == null || !i || !i.length || n == null) return null;
        var a = $t($t({}, e), {}, {
                scale: n
            }, r),
            {
                tick: o,
                axisLine: u
            } = a;
        return d.createElement(ge, {
            zIndex: a.zIndex
        }, d.createElement(G, {
            className: z("recharts-polar-radius-axis", uM, a.className)
        }, u && dM(a, i), o && pM(a, i), d.createElement(HC, fM(a.angle, a.cx, a.cy, i), d.createElement(eT, {
            label: a.label
        }), a.children)))
    };

function mM(e) {
    var t = ee(e, Fe);
    return d.createElement(d.Fragment, null, d.createElement(lM, {
        domain: t.domain,
        id: t.radiusAxisId,
        scale: t.scale,
        type: t.type,
        dataKey: t.dataKey,
        unit: void 0,
        name: t.name,
        allowDuplicatedCategory: t.allowDuplicatedCategory,
        allowDataOverflow: t.allowDataOverflow,
        reversed: t.reversed,
        includeHidden: t.includeHidden,
        allowDecimals: t.allowDecimals,
        ticks: t.ticks,
        tickCount: t.tickCount,
        tick: t.tick
    }), d.createElement(hM, t))
}
mM.displayName = "PolarRadiusAxis";
var yM = ["children"];

function Nr() {
    return Nr = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Nr.apply(null, arguments)
}

function uh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function wt(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? uh(Object(r), !0).forEach(function(n) {
            gM(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : uh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function gM(e, t, r) {
    return (t = bM(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function bM(e) {
    var t = xM(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function xM(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function wM(e, t) {
    if (e == null) return {};
    var r, n, i = PM(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function PM(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var lh = 1e-5,
    OM = Math.cos(ca(45)),
    AM = "angleAxis";

function SM(e) {
    var t = te(),
        r = d.useMemo(() => {
            var {
                children: a
            } = e, o = wM(e, yM);
            return o
        }, [e]),
        n = M(a => an(a, r.id)),
        i = r === n;
    return d.useEffect(() => (t(JT(r)), () => {
        t(QT(r))
    }), [t, r]), i ? e.children : null
}
var EM = (e, t) => {
        var {
            cx: r,
            cy: n,
            radius: i,
            orientation: a,
            tickSize: o
        } = t, u = o || 8, l = J(r, n, i, e.coordinate), s = J(r, n, i + (a === "inner" ? -1 : 1) * u, e.coordinate);
        return {
            x1: l.x,
            y1: l.y,
            x2: s.x,
            y2: s.y
        }
    },
    jM = (e, t) => {
        var r = Math.cos(ca(-e.coordinate));
        return r > lh ? t === "outer" ? "start" : "end" : r < -lh ? t === "outer" ? "end" : "start" : "middle"
    },
    IM = e => {
        var t = Math.cos(ca(-e.coordinate)),
            r = Math.sin(ca(-e.coordinate));
        return Math.abs(t) <= OM ? r > 0 ? "start" : "end" : "middle"
    },
    _M = e => {
        var {
            cx: t,
            cy: r,
            radius: n,
            axisLineType: i,
            axisLine: a,
            ticks: o
        } = e;
        if (!a) return null;
        var u = wt(wt({}, re(e)), {}, {
            fill: "none"
        }, re(a));
        if (i === "circle") return d.createElement(Bs, Nr({
            className: "recharts-polar-angle-axis-line"
        }, u, {
            cx: t,
            cy: r,
            r: n
        }));
        var l = o.map(s => J(t, r, n, s.coordinate));
        return d.createElement(f0, Nr({
            className: "recharts-polar-angle-axis-line"
        }, u, {
            points: l
        }))
    },
    kM = e => {
        var {
            tick: t,
            tickProps: r,
            value: n
        } = e;
        return t ? d.isValidElement(t) ? d.cloneElement(t, r) : typeof t == "function" ? t(r) : d.createElement(hn, Nr({}, r, {
            className: "recharts-polar-angle-axis-tick-value"
        }), n) : null
    },
    CM = e => {
        var {
            tick: t,
            tickLine: r,
            tickFormatter: n,
            stroke: i,
            ticks: a
        } = e, o = re(e), u = At(t), l = wt(wt({}, o), {}, {
            fill: "none"
        }, re(r)), s = a.map((c, f) => {
            var v = EM(c, e),
                p = jM(c, e.orientation),
                h = IM(c),
                m = wt(wt(wt({}, o), {}, {
                    textAnchor: p,
                    verticalAnchor: h,
                    stroke: "none",
                    fill: i
                }, u), {}, {
                    index: f,
                    payload: c,
                    x: v.x2,
                    y: v.y2
                });
            return d.createElement(G, Nr({
                className: z("recharts-polar-angle-axis-tick", zy(t)),
                key: "tick-".concat(c.coordinate)
            }, lr(e, c, f)), r && d.createElement("line", Nr({
                className: "recharts-polar-angle-axis-tick-line"
            }, l, v)), d.createElement(kM, {
                tick: t,
                tickProps: m,
                value: n ? n(c.value, f) : c.value
            }))
        });
        return d.createElement(G, {
            className: "recharts-polar-angle-axis-ticks"
        }, s)
    },
    TM = e => {
        var {
            angleAxisId: t
        } = e, r = M(on), n = M(u => yn(u, "angleAxis", t)), i = he(), a = M(u => AT(u, "angleAxis", t, i));
        if (r == null || !a || !a.length || n == null) return null;
        var o = wt(wt(wt({}, e), {}, {
            scale: n
        }, r), {}, {
            radius: r.outerRadius,
            ticks: a
        });
        return d.createElement(ge, {
            zIndex: o.zIndex
        }, d.createElement(G, {
            className: z("recharts-polar-angle-axis", AM, o.className)
        }, d.createElement(_M, o), d.createElement(CM, o)))
    };

function MM(e) {
    var t = ee(e, xt);
    return d.createElement(SM, {
        id: t.angleAxisId,
        scale: t.scale,
        type: t.type,
        dataKey: t.dataKey,
        unit: void 0,
        name: t.name,
        allowDuplicatedCategory: !1,
        allowDataOverflow: !1,
        reversed: t.reversed,
        includeHidden: !1,
        allowDecimals: t.allowDecimals,
        tickCount: t.tickCount,
        ticks: t.ticks,
        tick: t.tick,
        domain: t.domain
    }, d.createElement(TM, t))
}
MM.displayName = "PolarAngleAxis";

function ch(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function sh(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? ch(Object(r), !0).forEach(function(n) {
            DM(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ch(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function DM(e, t, r) {
    return (t = NM(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function NM(e) {
    var t = RM(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function RM(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var $M = (e, t) => t,
    Fs = A([zs, $M], (e, t) => e.filter(r => r.type === "pie").find(r => r.id === t)),
    LM = [],
    qs = (e, t, r) => r ?.length === 0 ? LM : r,
    g0 = A([si, Fs, qs], (e, t, r) => {
        var {
            chartData: n
        } = e;
        if (t != null) {
            var i;
            if (t ?.data != null && t.data.length > 0 ? i = t.data : i = n, (!i || !i.length) && r != null && (i = r.map(a => sh(sh({}, t.presentationProps), a.props))), i != null) return i
        }
    }),
    BM = A([g0, Fs, qs], (e, t, r) => {
        if (!(e == null || t == null)) return e.map((n, i) => {
            var a, o = H(n, t.nameKey, t.name),
                u;
            return r != null && (a = r[i]) !== null && a !== void 0 && (a = a.props) !== null && a !== void 0 && a.fill ? u = r[i].props.fill : typeof n == "object" && n != null && "fill" in n ? u = n.fill : u = t.fill, {
                value: st(o, t.dataKey),
                color: u,
                payload: n,
                type: t.legendType
            }
        })
    }),
    zM = A([g0, Fs, qs, Pe], (e, t, r, n) => {
        if (!(t == null || e == null)) return $D({
            offset: n,
            pieSettings: t,
            displayedData: e,
            cells: r
        })
    }),
    fh = e => typeof e == "string" ? e : e ? e.displayName || e.name || "Component" : "",
    dh = null,
    al = null,
    b0 = e => {
        if (e === dh && Array.isArray(al)) return al;
        var t = [];
        return d.Children.forEach(e, r => {
            X(r) || (hx.isFragment(r) ? t = t.concat(b0(r.props.children)) : t.push(r))
        }), al = t, dh = e, t
    };

function xo(e, t) {
    var r = [],
        n = [];
    return Array.isArray(t) ? n = t.map(i => fh(i)) : n = [fh(t)], b0(e).forEach(i => {
        var a = Cr(i, "type.displayName") || Cr(i, "type.name");
        a && n.indexOf(a) !== -1 && r.push(i)
    }), r
}
var Us = e => e && typeof e == "object" && "clipDot" in e ? !!e.clipDot : !0,
    ol = {},
    vh;

function KM() {
    return vh || (vh = 1, (function(e) {
        Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        });

        function t(r) {
            if (typeof r != "object" || r == null) return !1;
            if (Object.getPrototypeOf(r) === null) return !0;
            if (Object.prototype.toString.call(r) !== "[object Object]") {
                const i = r[Symbol.toStringTag];
                return i == null || !Object.getOwnPropertyDescriptor(r, Symbol.toStringTag) ?.writable ? !1 : r.toString() === `[object ${i}]`
            }
            let n = r;
            for (; Object.getPrototypeOf(n) !== null;) n = Object.getPrototypeOf(n);
            return Object.getPrototypeOf(r) === n
        }
        e.isPlainObject = t
    })(ol)), ol
}
var ul, ph;

function WM() {
    return ph || (ph = 1, ul = KM().isPlainObject), ul
}
var FM = WM();
const qM = _t(FM);
var hh, mh, yh, gh, bh;

function xh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function wh(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? xh(Object(r), !0).forEach(function(n) {
            UM(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : xh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function UM(e, t, r) {
    return (t = HM(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function HM(e) {
    var t = GM(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function GM(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function Sa() {
    return Sa = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Sa.apply(null, arguments)
}

function kn(e, t) {
    return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
        raw: {
            value: Object.freeze(t)
        }
    }))
}
var Ph = (e, t, r, n, i) => {
        var a = r - n,
            o;
        return o = de(hh || (hh = kn(["M ", ",", ""])), e, t), o += de(mh || (mh = kn(["L ", ",", ""])), e + r, t), o += de(yh || (yh = kn(["L ", ",", ""])), e + r - a / 2, t + i), o += de(gh || (gh = kn(["L ", ",", ""])), e + r - a / 2 - n, t + i), o += de(bh || (bh = kn(["L ", ",", " Z"])), e, t), o
    },
    VM = {
        x: 0,
        y: 0,
        upperWidth: 0,
        lowerWidth: 0,
        height: 0,
        isUpdateAnimationActive: !1,
        animationBegin: 0,
        animationDuration: 1500,
        animationEasing: "ease"
    },
    YM = e => {
        var t = ee(e, VM),
            {
                x: r,
                y: n,
                upperWidth: i,
                lowerWidth: a,
                height: o,
                className: u
            } = t,
            {
                animationEasing: l,
                animationDuration: s,
                animationBegin: c,
                isUpdateAnimationActive: f
            } = t,
            v = d.useRef(null),
            [p, h] = d.useState(-1),
            m = d.useRef(i),
            y = d.useRef(a),
            g = d.useRef(o),
            b = d.useRef(r),
            x = d.useRef(n),
            P = fr(e, "trapezoid-");
        if (d.useEffect(() => {
                if (v.current && v.current.getTotalLength) try {
                    var $ = v.current.getTotalLength();
                    $ && h($)
                } catch {}
            }, []), r !== +r || n !== +n || i !== +i || a !== +a || o !== +o || i === 0 && a === 0 || o === 0) return null;
        var w = z("recharts-trapezoid", u);
        if (!f) return d.createElement("g", null, d.createElement("path", Sa({}, ye(t), {
            className: w,
            d: Ph(r, n, i, a, o)
        })));
        var O = m.current,
            S = y.current,
            E = g.current,
            _ = b.current,
            C = x.current,
            j = "0px ".concat(p === -1 ? 1 : p, "px"),
            I = "".concat(p, "px 0px"),
            R = Dy(["strokeDasharray"], s, l);
        return d.createElement(sr, {
            animationId: P,
            key: P,
            canBegin: p > 0,
            duration: s,
            easing: l,
            isActive: f,
            begin: c
        }, $ => {
            var B = F(O, i, $),
                q = F(S, a, $),
                W = F(E, o, $),
                V = F(_, r, $),
                L = F(C, n, $);
            v.current && (m.current = B, y.current = q, g.current = W, b.current = V, x.current = L);
            var Me = $ > 0 ? {
                transition: R,
                strokeDasharray: I
            } : {
                strokeDasharray: j
            };
            return d.createElement("path", Sa({}, ye(t), {
                className: w,
                d: Ph(V, L, B, q, W),
                ref: v,
                style: wh(wh({}, Me), t.style)
            }))
        })
    },
    XM = ["option", "shapeType", "activeClassName"];

function ZM(e, t) {
    if (e == null) return {};
    var r, n, i = JM(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function JM(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function Oh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Ea(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Oh(Object(r), !0).forEach(function(n) {
            QM(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Oh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function QM(e, t, r) {
    return (t = eD(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function eD(e) {
    var t = tD(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function tD(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function rD(e, t) {
    return Ea(Ea({}, t), e)
}

function nD(e, t) {
    return e === "symbols"
}

function Ah(e) {
    var {
        shapeType: t,
        elementProps: r
    } = e;
    switch (t) {
        case "rectangle":
            return d.createElement(Ly, r);
        case "trapezoid":
            return d.createElement(YM, r);
        case "sector":
            return d.createElement(Fy, r);
        case "symbols":
            if (nD(t)) return d.createElement(Ba, r);
            break;
        case "curve":
            return d.createElement(Er, r);
        default:
            return null
    }
}

function iD(e) {
    return d.isValidElement(e) ? e.props : e
}

function Yn(e) {
    var {
        option: t,
        shapeType: r,
        activeClassName: n = "recharts-active-shape"
    } = e, i = ZM(e, XM), a;
    if (d.isValidElement(t)) a = d.cloneElement(t, Ea(Ea({}, i), iD(t)));
    else if (typeof t == "function") a = t(i, i.index);
    else if (qM(t) && typeof t != "boolean") {
        var o = rD(t, i);
        a = d.createElement(Ah, {
            shapeType: r,
            elementProps: o
        })
    } else {
        var u = i;
        a = d.createElement(Ah, {
            shapeType: r,
            elementProps: u
        })
    }
    return i.isActive ? d.createElement(G, {
        className: n
    }, a) : a
}
var wo = (e, t, r) => {
        var n = te();
        return (i, a) => o => {
            e ?.(i, a, o), n(Sb({
                activeIndex: String(a),
                activeDataKey: t,
                activeCoordinate: i.tooltipPosition,
                activeGraphicalItemId: r
            }))
        }
    },
    Po = e => {
        var t = te();
        return (r, n) => i => {
            e ?.(r, n, i), t(i_())
        }
    },
    Oo = (e, t, r) => {
        var n = te();
        return (i, a) => o => {
            e ?.(i, a, o), n(a_({
                activeIndex: String(a),
                activeDataKey: t,
                activeCoordinate: i.tooltipPosition,
                activeGraphicalItemId: r
            }))
        }
    };

function bn(e) {
    var {
        tooltipEntrySettings: t
    } = e, r = te(), n = he(), i = d.useRef(null);
    return d.useLayoutEffect(() => {
        n || (i.current === null ? r(e_(t)) : i.current !== t && r(t_({
            prev: i.current,
            next: t
        })), i.current = t)
    }, [t, r, n]), d.useLayoutEffect(() => () => {
        i.current && (r(r_(i.current)), i.current = null)
    }, [r]), null
}

function Ao(e) {
    var {
        legendPayload: t
    } = e, r = te(), n = he(), i = d.useRef(null);
    return d.useLayoutEffect(() => {
        n || (i.current === null ? r(ky(t)) : i.current !== t && r(Cy({
            prev: i.current,
            next: t
        })), i.current = t)
    }, [r, n, t]), d.useLayoutEffect(() => () => {
        i.current && (r(Ty(i.current)), i.current = null)
    }, [r]), null
}

function x0(e) {
    var {
        legendPayload: t
    } = e, r = te(), n = M(K), i = d.useRef(null);
    return d.useLayoutEffect(() => {
        n !== "centric" && n !== "radial" || (i.current === null ? r(ky(t)) : i.current !== t && r(Cy({
            prev: i.current,
            next: t
        })), i.current = t)
    }, [r, n, t]), d.useLayoutEffect(() => () => {
        i.current && (r(Ty(i.current)), i.current = null)
    }, [r]), null
}
var ll, aD = () => {
        var [e] = d.useState(() => Rn("uid-"));
        return e
    },
    oD = (ll = mx.useId) !== null && ll !== void 0 ? ll : aD;

function uD(e, t) {
    var r = oD();
    return t || (e ? "".concat(e, "-").concat(r) : r)
}
var lD = d.createContext(void 0),
    xn = e => {
        var {
            id: t,
            type: r,
            children: n
        } = e, i = uD("recharts-".concat(r), t);
        return d.createElement(lD.Provider, {
            value: i
        }, n(i))
    },
    cD = {
        cartesianItems: [],
        polarItems: []
    },
    w0 = Ge({
        name: "graphicalItems",
        initialState: cD,
        reducers: {
            addCartesianGraphicalItem: {
                reducer(e, t) {
                    e.cartesianItems.push(t.payload)
                },
                prepare: se()
            },
            replaceCartesianGraphicalItem: {
                reducer(e, t) {
                    var {
                        prev: r,
                        next: n
                    } = t.payload, i = ht(e).cartesianItems.indexOf(r);
                    i > -1 && (e.cartesianItems[i] = n)
                },
                prepare: se()
            },
            removeCartesianGraphicalItem: {
                reducer(e, t) {
                    var r = ht(e).cartesianItems.indexOf(t.payload);
                    r > -1 && e.cartesianItems.splice(r, 1)
                },
                prepare: se()
            },
            addPolarGraphicalItem: {
                reducer(e, t) {
                    e.polarItems.push(t.payload)
                },
                prepare: se()
            },
            removePolarGraphicalItem: {
                reducer(e, t) {
                    var r = ht(e).polarItems.indexOf(t.payload);
                    r > -1 && e.polarItems.splice(r, 1)
                },
                prepare: se()
            }
        }
    }),
    {
        addCartesianGraphicalItem: sD,
        replaceCartesianGraphicalItem: fD,
        removeCartesianGraphicalItem: dD,
        addPolarGraphicalItem: vD,
        removePolarGraphicalItem: pD
    } = w0.actions,
    hD = w0.reducer,
    mD = e => {
        var t = te(),
            r = d.useRef(null);
        return d.useLayoutEffect(() => {
            r.current === null ? t(sD(e)) : r.current !== e && t(fD({
                prev: r.current,
                next: e
            })), r.current = e
        }, [t, e]), d.useLayoutEffect(() => () => {
            r.current && (t(dD(r.current)), r.current = null)
        }, [t]), null
    },
    So = d.memo(mD);

function P0(e) {
    var t = te();
    return d.useLayoutEffect(() => (t(vD(e)), () => {
        t(pD(e))
    }), [t, e]), null
}
var yD = ["key"],
    gD = ["onMouseEnter", "onClick", "onMouseLeave"],
    bD = ["id"],
    xD = ["id"];

function Sh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function pe(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Sh(Object(r), !0).forEach(function(n) {
            wD(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Sh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function wD(e, t, r) {
    return (t = PD(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function PD(e) {
    var t = OD(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function OD(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function ur() {
    return ur = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, ur.apply(null, arguments)
}

function Eo(e, t) {
    if (e == null) return {};
    var r, n, i = AD(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function AD(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function SD(e) {
    var t = d.useMemo(() => xo(e.children, wi), [e.children]),
        r = M(n => BM(n, e.id, t));
    return r == null ? null : d.createElement(x0, {
        legendPayload: r
    })
}
var ED = d.memo(e => {
        var {
            dataKey: t,
            nameKey: r,
            sectors: n,
            stroke: i,
            strokeWidth: a,
            fill: o,
            name: u,
            hide: l,
            tooltipType: s,
            id: c
        } = e, f = {
            dataDefinedOnItem: n.map(v => v.tooltipPayload),
            positions: n.map(v => v.tooltipPosition),
            settings: {
                stroke: i,
                strokeWidth: a,
                fill: o,
                dataKey: t,
                nameKey: r,
                name: st(u, t),
                hide: l,
                type: s,
                color: o,
                unit: "",
                graphicalItemId: c
            }
        };
        return d.createElement(bn, {
            tooltipEntrySettings: f
        })
    }),
    jD = (e, t) => e > t ? "start" : e < t ? "end" : "middle",
    ID = (e, t, r) => $e(typeof t == "function" ? t(e) : t, r, r * .8),
    _D = (e, t, r) => {
        var {
            top: n,
            left: i,
            width: a,
            height: o
        } = t, u = By(a, o), l = i + $e(e.cx, a, a / 2), s = n + $e(e.cy, o, o / 2), c = $e(e.innerRadius, u, 0), f = ID(r, e.outerRadius, u), v = e.maxRadius || Math.sqrt(a * a + o * o) / 2;
        return {
            cx: l,
            cy: s,
            innerRadius: c,
            outerRadius: f,
            maxRadius: v
        }
    },
    kD = (e, t) => {
        var r = _e(t - e),
            n = Math.min(Math.abs(t - e), 360);
        return r * n
    };

function CD(e) {
    return e && typeof e == "object" && "className" in e && typeof e.className == "string" ? e.className : ""
}
var TD = (e, t) => {
        if (d.isValidElement(e)) return d.cloneElement(e, t);
        if (typeof e == "function") return e(t);
        var r = z("recharts-pie-label-line", typeof e != "boolean" ? e.className : ""),
            {
                key: n
            } = t,
            i = Eo(t, yD);
        return d.createElement(Er, ur({}, i, {
            type: "linear",
            className: r
        }))
    },
    MD = (e, t, r) => {
        if (d.isValidElement(e)) return d.cloneElement(e, t);
        var n = r;
        if (typeof e == "function" && (n = e(t), d.isValidElement(n))) return n;
        var i = z("recharts-pie-label-text", CD(e));
        return d.createElement(hn, ur({}, t, {
            alignmentBaseline: "middle",
            className: i
        }), n)
    };

function DD(e) {
    var {
        sectors: t,
        props: r,
        showLabels: n
    } = e, {
        label: i,
        labelLine: a,
        dataKey: o
    } = r;
    if (!n || !i || !t) return null;
    var u = re(r),
        l = At(i),
        s = At(a),
        c = typeof i == "object" && "offsetRadius" in i && typeof i.offsetRadius == "number" && i.offsetRadius || 20,
        f = t.map((v, p) => {
            var h = (v.startAngle + v.endAngle) / 2,
                m = J(v.cx, v.cy, v.outerRadius + c, h),
                y = pe(pe(pe(pe({}, u), v), {}, {
                    stroke: "none"
                }, l), {}, {
                    index: p,
                    textAnchor: jD(m.x, v.cx)
                }, m),
                g = pe(pe(pe(pe({}, u), v), {}, {
                    fill: "none",
                    stroke: v.fill
                }, s), {}, {
                    index: p,
                    points: [J(v.cx, v.cy, v.outerRadius, h), m],
                    key: "line"
                });
            return d.createElement(ge, {
                zIndex: ie.label,
                key: "label-".concat(v.startAngle, "-").concat(v.endAngle, "-").concat(v.midAngle, "-").concat(p)
            }, d.createElement(G, null, a && TD(a, g), MD(i, y, H(v, o))))
        });
    return d.createElement(G, {
        className: "recharts-pie-labels"
    }, f)
}

function ND(e) {
    var {
        sectors: t,
        props: r,
        showLabels: n
    } = e, {
        label: i
    } = r;
    return typeof i == "object" && i != null && "position" in i ? d.createElement(mn, {
        label: i
    }) : d.createElement(DD, {
        sectors: t,
        props: r,
        showLabels: n
    })
}

function RD(e) {
    var {
        sectors: t,
        activeShape: r,
        inactiveShape: n,
        allOtherPieProps: i,
        shape: a,
        id: o
    } = e, u = M(Ht), l = M(Ms), s = M(q_), {
        onMouseEnter: c,
        onClick: f,
        onMouseLeave: v
    } = i, p = Eo(i, gD), h = wo(c, i.dataKey, o), m = Po(v), y = Oo(f, i.dataKey, o);
    return t == null || t.length === 0 ? null : d.createElement(d.Fragment, null, t.map((g, b) => {
        if (g ?.startAngle === 0 && g ?.endAngle === 0 && t.length !== 1) return null;
        var x = s == null || s === o,
            P = String(b) === u && (l == null || i.dataKey === l) && x,
            w = u ? n : null,
            O = r && P ? r : w,
            S = pe(pe({}, g), {}, {
                stroke: g.stroke,
                tabIndex: -1,
                [jc]: b,
                [Ic]: o
            });
        return d.createElement(G, ur({
            key: "sector-".concat(g ?.startAngle, "-").concat(g ?.endAngle, "-").concat(g.midAngle, "-").concat(b),
            tabIndex: -1,
            className: "recharts-pie-sector"
        }, lr(p, g, b), {
            onMouseEnter: h(g, b),
            onMouseLeave: m(g, b),
            onClick: y(g, b)
        }), d.createElement(Yn, ur({
            option: a ?? O,
            index: b,
            shapeType: "sector",
            isActive: P
        }, S)))
    }))
}

function $D(e) {
    var t, {
            pieSettings: r,
            displayedData: n,
            cells: i,
            offset: a
        } = e,
        {
            cornerRadius: o,
            startAngle: u,
            endAngle: l,
            dataKey: s,
            nameKey: c,
            tooltipType: f
        } = r,
        v = Math.abs(r.minAngle),
        p = kD(u, l),
        h = Math.abs(p),
        m = n.length <= 1 ? 0 : (t = r.paddingAngle) !== null && t !== void 0 ? t : 0,
        y = n.filter(O => H(O, s, 0) !== 0).length,
        g = (h >= 360 ? y : y - 1) * m,
        b = h - y * v - g,
        x = n.reduce((O, S) => {
            var E = H(S, s, 0);
            return O + (D(E) ? E : 0)
        }, 0),
        P;
    if (x > 0) {
        var w;
        P = n.map((O, S) => {
            var E = H(O, s, 0),
                _ = H(O, c, S),
                C = _D(r, a, O),
                j = (D(E) ? E : 0) / x,
                I, R = pe(pe({}, O), i && i[S] && i[S].props);
            S ? I = w.endAngle + _e(p) * m * (E !== 0 ? 1 : 0) : I = u;
            var $ = I + _e(p) * ((E !== 0 ? v : 0) + j * b),
                B = (I + $) / 2,
                q = (C.innerRadius + C.outerRadius) / 2,
                W = [{
                    name: _,
                    value: E,
                    payload: R,
                    dataKey: s,
                    type: f,
                    graphicalItemId: r.id
                }],
                V = J(C.cx, C.cy, q, B);
            return w = pe(pe(pe(pe({}, r.presentationProps), {}, {
                percent: j,
                cornerRadius: typeof o == "string" ? parseFloat(o) : o,
                name: _,
                tooltipPayload: W,
                midAngle: B,
                middleRadius: q,
                tooltipPosition: V
            }, R), C), {}, {
                value: E,
                dataKey: s,
                startAngle: I,
                endAngle: $,
                payload: R,
                paddingAngle: _e(p) * m
            }), w
        })
    }
    return P
}

function LD(e) {
    var {
        showLabels: t,
        sectors: r,
        children: n
    } = e, i = d.useMemo(() => !t || !r ? [] : r.map(a => ({
        value: a.value,
        payload: a.payload,
        clockWise: !1,
        parentViewBox: void 0,
        viewBox: {
            cx: a.cx,
            cy: a.cy,
            innerRadius: a.innerRadius,
            outerRadius: a.outerRadius,
            startAngle: a.startAngle,
            endAngle: a.endAngle,
            clockWise: !1
        },
        fill: a.fill
    })), [r, t]);
    return d.createElement(sT, {
        value: t ? i : void 0
    }, n)
}

function BD(e) {
    var {
        props: t,
        previousSectorsRef: r,
        id: n
    } = e, {
        sectors: i,
        isAnimationActive: a,
        animationBegin: o,
        animationDuration: u,
        animationEasing: l,
        activeShape: s,
        inactiveShape: c,
        onAnimationStart: f,
        onAnimationEnd: v
    } = t, p = fr(t, "recharts-pie-"), h = r.current, [m, y] = d.useState(!1), g = d.useCallback(() => {
        typeof v == "function" && v(), y(!1)
    }, [v]), b = d.useCallback(() => {
        typeof f == "function" && f(), y(!0)
    }, [f]);
    return d.createElement(LD, {
        showLabels: !m,
        sectors: i
    }, d.createElement(sr, {
        animationId: p,
        begin: o,
        duration: u,
        isActive: a,
        easing: l,
        onAnimationStart: b,
        onAnimationEnd: g,
        key: p
    }, x => {
        var P = [],
            w = i && i[0],
            O = w ?.startAngle;
        return i ?.forEach((S, E) => {
            var _ = h && h[E],
                C = E > 0 ? Cr(S, "paddingAngle", 0) : 0;
            if (_) {
                var j = F(_.endAngle - _.startAngle, S.endAngle - S.startAngle, x),
                    I = pe(pe({}, S), {}, {
                        startAngle: O + C,
                        endAngle: O + j + C
                    });
                P.push(I), O = I.endAngle
            } else {
                var {
                    endAngle: R,
                    startAngle: $
                } = S, B = F(0, R - $, x), q = pe(pe({}, S), {}, {
                    startAngle: O + C,
                    endAngle: O + B + C
                });
                P.push(q), O = q.endAngle
            }
        }), r.current = P, d.createElement(G, null, d.createElement(RD, {
            sectors: P,
            activeShape: s,
            inactiveShape: c,
            allOtherPieProps: t,
            shape: t.shape,
            id: n
        }))
    }), d.createElement(ND, {
        showLabels: !m,
        sectors: i,
        props: t
    }), t.children)
}
var zD = {
    animationBegin: 400,
    animationDuration: 1500,
    animationEasing: "ease",
    cx: "50%",
    cy: "50%",
    dataKey: "value",
    endAngle: 360,
    fill: "#808080",
    hide: !1,
    innerRadius: 0,
    isAnimationActive: "auto",
    label: !1,
    labelLine: !0,
    legendType: "rect",
    minAngle: 0,
    nameKey: "name",
    outerRadius: "80%",
    paddingAngle: 0,
    rootTabIndex: 0,
    startAngle: 0,
    stroke: "#fff",
    zIndex: ie.area
};

function KD(e) {
    var {
        id: t
    } = e, r = Eo(e, bD), {
        hide: n,
        className: i,
        rootTabIndex: a
    } = e, o = d.useMemo(() => xo(e.children, wi), [e.children]), u = M(c => zM(c, t, o)), l = d.useRef(null), s = z("recharts-pie", i);
    return n || u == null ? (l.current = null, d.createElement(G, {
        tabIndex: a,
        className: s
    })) : d.createElement(ge, {
        zIndex: e.zIndex
    }, d.createElement(ED, {
        dataKey: e.dataKey,
        nameKey: e.nameKey,
        sectors: u,
        stroke: e.stroke,
        strokeWidth: e.strokeWidth,
        fill: e.fill,
        name: e.name,
        hide: e.hide,
        tooltipType: e.tooltipType,
        id: t
    }), d.createElement(G, {
        tabIndex: a,
        className: s
    }, d.createElement(BD, {
        props: pe(pe({}, r), {}, {
            sectors: u
        }),
        previousSectorsRef: l,
        id: t
    })))
}

function WD(e) {
    var t = ee(e, zD),
        {
            id: r
        } = t,
        n = Eo(t, xD),
        i = re(n);
    return d.createElement(xn, {
        id: r,
        type: "pie"
    }, a => d.createElement(d.Fragment, null, d.createElement(P0, {
        type: "pie",
        id: a,
        data: n.data,
        dataKey: n.dataKey,
        hide: n.hide,
        angleAxisId: 0,
        radiusAxisId: 0,
        name: n.name,
        nameKey: n.nameKey,
        tooltipType: n.tooltipType,
        legendType: n.legendType,
        fill: n.fill,
        cx: n.cx,
        cy: n.cy,
        startAngle: n.startAngle,
        endAngle: n.endAngle,
        paddingAngle: n.paddingAngle,
        minAngle: n.minAngle,
        innerRadius: n.innerRadius,
        outerRadius: n.outerRadius,
        cornerRadius: n.cornerRadius,
        presentationProps: i,
        maxRadius: t.maxRadius
    }), d.createElement(SD, ur({}, n, {
        id: a
    })), d.createElement(KD, ur({}, n, {
        id: a
    }))))
}
WD.displayName = "Pie";
var FD = ["points"];

function Eh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function cl(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Eh(Object(r), !0).forEach(function(n) {
            qD(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Eh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function qD(e, t, r) {
    return (t = UD(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function UD(e) {
    var t = HD(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function HD(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function ja() {
    return ja = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, ja.apply(null, arguments)
}

function GD(e, t) {
    if (e == null) return {};
    var r, n, i = VD(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function VD(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function YD(e) {
    var {
        option: t,
        dotProps: r,
        className: n
    } = e;
    if (d.isValidElement(t)) return d.cloneElement(t, r);
    if (typeof t == "function") return t(r);
    var i = z(n, typeof t != "boolean" ? t.className : ""),
        a = r ?? {},
        {
            points: o
        } = a,
        u = GD(a, FD);
    return d.createElement(Bs, ja({}, u, {
        className: i
    }))
}

function XD(e, t) {
    return e == null ? !1 : t ? !0 : e.length === 1
}

function Hs(e) {
    var {
        points: t,
        dot: r,
        className: n,
        dotClassName: i,
        dataKey: a,
        baseProps: o,
        needClip: u,
        clipPathId: l,
        zIndex: s = ie.scatter
    } = e;
    if (!XD(t, r)) return null;
    var c = Us(r),
        f = xx(r),
        v = t.map((h, m) => {
            var y, g, b = cl(cl(cl({
                r: 3
            }, o), f), {}, {
                index: m,
                cx: (y = h.x) !== null && y !== void 0 ? y : void 0,
                cy: (g = h.y) !== null && g !== void 0 ? g : void 0,
                dataKey: a,
                value: h.value,
                payload: h.payload,
                points: t
            });
            return d.createElement(YD, {
                key: "dot-".concat(m),
                option: r,
                dotProps: b,
                className: i
            })
        }),
        p = {};
    return u && l != null && (p.clipPath = "url(#clipPath-".concat(c ? "" : "dots-").concat(l, ")")), d.createElement(ge, {
        zIndex: s
    }, d.createElement(G, ja({
        className: n
    }, p), v))
}

function jh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Ih(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? jh(Object(r), !0).forEach(function(n) {
            ZD(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function ZD(e, t, r) {
    return (t = JD(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function JD(e) {
    var t = QD(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function QD(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var O0 = 0,
    eN = {
        xAxis: {},
        yAxis: {},
        zAxis: {}
    },
    A0 = Ge({
        name: "cartesianAxis",
        initialState: eN,
        reducers: {
            addXAxis: {
                reducer(e, t) {
                    e.xAxis[t.payload.id] = t.payload
                },
                prepare: se()
            },
            replaceXAxis: {
                reducer(e, t) {
                    var {
                        prev: r,
                        next: n
                    } = t.payload;
                    e.xAxis[r.id] !== void 0 && (r.id !== n.id && delete e.xAxis[r.id], e.xAxis[n.id] = n)
                },
                prepare: se()
            },
            removeXAxis: {
                reducer(e, t) {
                    delete e.xAxis[t.payload.id]
                },
                prepare: se()
            },
            addYAxis: {
                reducer(e, t) {
                    e.yAxis[t.payload.id] = t.payload
                },
                prepare: se()
            },
            replaceYAxis: {
                reducer(e, t) {
                    var {
                        prev: r,
                        next: n
                    } = t.payload;
                    e.yAxis[r.id] !== void 0 && (r.id !== n.id && delete e.yAxis[r.id], e.yAxis[n.id] = n)
                },
                prepare: se()
            },
            removeYAxis: {
                reducer(e, t) {
                    delete e.yAxis[t.payload.id]
                },
                prepare: se()
            },
            addZAxis: {
                reducer(e, t) {
                    e.zAxis[t.payload.id] = t.payload
                },
                prepare: se()
            },
            replaceZAxis: {
                reducer(e, t) {
                    var {
                        prev: r,
                        next: n
                    } = t.payload;
                    e.zAxis[r.id] !== void 0 && (r.id !== n.id && delete e.zAxis[r.id], e.zAxis[n.id] = n)
                },
                prepare: se()
            },
            removeZAxis: {
                reducer(e, t) {
                    delete e.zAxis[t.payload.id]
                },
                prepare: se()
            },
            updateYAxisWidth(e, t) {
                var {
                    id: r,
                    width: n
                } = t.payload, i = e.yAxis[r];
                if (i) {
                    var a = i.widthHistory || [];
                    if (a.length === 3 && a[0] === a[2] && n === a[1] && n !== i.width && Math.abs(n - a[0]) <= 1) return;
                    var o = [...a, n].slice(-3);
                    e.yAxis[r] = Ih(Ih({}, e.yAxis[r]), {}, {
                        width: n,
                        widthHistory: o
                    })
                }
            }
        }
    }),
    {
        addXAxis: tN,
        replaceXAxis: rN,
        removeXAxis: nN,
        addYAxis: iN,
        replaceYAxis: aN,
        removeYAxis: oN,
        addZAxis: uN,
        replaceZAxis: lN,
        removeZAxis: cN,
        updateYAxisWidth: sN
    } = A0.actions,
    fN = A0.reducer,
    dN = A([Pe], e => ({
        top: e.top,
        bottom: e.bottom,
        left: e.left,
        right: e.right
    })),
    vN = A([dN, Vt, Yt], (e, t, r) => {
        if (!(!e || t == null || r == null)) return {
            x: e.left,
            y: e.top,
            width: Math.max(0, t - e.left - e.right),
            height: Math.max(0, r - e.top - e.bottom)
        }
    }),
    jo = () => M(vN),
    pN = () => M(Y_);

function _h(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function sl(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? _h(Object(r), !0).forEach(function(n) {
            hN(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : _h(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function hN(e, t, r) {
    return (t = mN(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function mN(e) {
    var t = yN(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function yN(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var gN = e => {
    var {
        point: t,
        childIndex: r,
        mainColor: n,
        activeDot: i,
        dataKey: a,
        clipPath: o
    } = e;
    if (i === !1 || t.x == null || t.y == null) return null;
    var u = {
            index: r,
            dataKey: a,
            cx: t.x,
            cy: t.y,
            r: 4,
            fill: n ?? "none",
            strokeWidth: 2,
            stroke: "#fff",
            payload: t.payload,
            value: t.value
        },
        l = sl(sl(sl({}, u), At(i)), gc(i)),
        s;
    return d.isValidElement(i) ? s = d.cloneElement(i, l) : typeof i == "function" ? s = i(l) : s = d.createElement(Bs, l), d.createElement(G, {
        className: "recharts-active-dot",
        clipPath: o
    }, s)
};

function Ia(e) {
    var {
        points: t,
        mainColor: r,
        activeDot: n,
        itemDataKey: i,
        clipPath: a,
        zIndex: o = ie.activeDot
    } = e, u = M(Ht), l = pN();
    if (t == null || l == null) return null;
    var s = t.find(c => l.includes(c.payload));
    return X(s) ? null : d.createElement(ge, {
        zIndex: o
    }, d.createElement(gN, {
        point: s,
        childIndex: Number(u),
        mainColor: r,
        dataKey: i,
        activeDot: n,
        clipPath: a
    }))
}

function kh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function _a(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? kh(Object(r), !0).forEach(function(n) {
            bN(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : kh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function bN(e, t, r) {
    return (t = xN(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function xN(e) {
    var t = wN(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function wN(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var S0 = (e, t) => yn(e, "radiusAxis", t),
    PN = A([S0], e => {
        if (e != null) return {
            scale: e
        }
    }),
    ON = A([di, S0], (e, t) => {
        if (!(e == null || t == null)) return _a(_a({}, e), {}, {
            scale: t
        })
    }),
    AN = (e, t, r, n) => gn(e, "radiusAxis", t, n),
    E0 = (e, t, r) => an(e, r),
    j0 = (e, t, r) => yn(e, "angleAxis", r),
    SN = A([E0, j0], (e, t) => {
        if (!(e == null || t == null)) return _a(_a({}, e), {}, {
            scale: t
        })
    }),
    EN = (e, t, r, n) => gn(e, "angleAxis", r, n),
    jN = A([E0, j0, on], (e, t, r) => {
        if (!(r == null || t == null)) return {
            scale: t,
            type: e.type,
            dataKey: e.dataKey,
            cx: r.cx,
            cy: r.cy
        }
    }),
    IN = (e, t, r, n, i) => i,
    _N = A([K, ON, AN, SN, EN], (e, t, r, n, i) => yt(e, "radiusAxis") ? jt(t, r, !1) : jt(n, i, !1)),
    kN = A([zs, IN], (e, t) => {
        if (e != null) {
            var r = e.find(n => n.type === "radar" && t === n.id);
            return r ?.dataKey
        }
    }),
    CN = A([PN, jN, si, kN, _N], (e, t, r, n, i) => {
        var {
            chartData: a,
            dataStartIndex: o,
            dataEndIndex: u
        } = r;
        if (!(e == null || t == null || a == null || i == null || n == null)) {
            var l = a.slice(o, u + 1);
            return KN({
                radiusAxis: e,
                angleAxis: t,
                displayedData: l,
                dataKey: n,
                bandSize: i
            })
        }
    }),
    TN = ["id"];

function Xn() {
    return Xn = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Xn.apply(null, arguments)
}

function Ch(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Ue(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Ch(Object(r), !0).forEach(function(n) {
            MN(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ch(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function MN(e, t, r) {
    return (t = DN(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function DN(e) {
    var t = NN(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function NN(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function RN(e, t) {
    if (e == null) return {};
    var r, n, i = $N(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function $N(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function Gs(e, t) {
    return e && e !== "none" ? e : t
}
var LN = e => {
        var {
            dataKey: t,
            name: r,
            stroke: n,
            fill: i,
            legendType: a,
            hide: o
        } = e;
        return [{
            inactive: o,
            dataKey: t,
            type: a,
            color: Gs(n, i),
            value: st(r, t),
            payload: e
        }]
    },
    BN = d.memo(e => {
        var {
            dataKey: t,
            stroke: r,
            strokeWidth: n,
            fill: i,
            name: a,
            hide: o,
            tooltipType: u,
            id: l
        } = e, s = {
            dataDefinedOnItem: void 0,
            positions: void 0,
            settings: {
                stroke: r,
                strokeWidth: n,
                fill: i,
                nameKey: void 0,
                dataKey: t,
                name: st(a, t),
                hide: o,
                type: u,
                color: Gs(r, i),
                unit: "",
                graphicalItemId: l
            }
        };
        return d.createElement(bn, {
            tooltipEntrySettings: s
        })
    });

function zN(e) {
    var {
        points: t,
        props: r
    } = e, {
        dot: n,
        dataKey: i
    } = r, {
        id: a
    } = r, o = RN(r, TN), u = re(o);
    return d.createElement(Hs, {
        points: t,
        dot: n,
        className: "recharts-radar-dots",
        dotClassName: "recharts-radar-dot",
        dataKey: i,
        baseProps: u
    })
}

function KN(e) {
    var {
        radiusAxis: t,
        angleAxis: r,
        displayedData: n,
        dataKey: i,
        bandSize: a
    } = e, {
        cx: o,
        cy: u
    } = r, l = !1, s = [], c = r.type !== "number" ? a ?? 0 : 0;
    n.forEach((v, p) => {
        var h = H(v, r.dataKey, p),
            m = H(v, i),
            y = r.scale(h) + c,
            g = Array.isArray(m) ? l0(m) : m,
            b = X(g) ? 0 : t.scale(g);
        Array.isArray(m) && m.length >= 2 && (l = !0), s.push(Ue(Ue({}, J(o, u, b, y)), {}, {
            name: h,
            value: m,
            cx: o,
            cy: u,
            radius: b,
            angle: y,
            payload: v
        }))
    });
    var f = [];
    return l && s.forEach(v => {
        if (Array.isArray(v.value)) {
            var p = v.value[0],
                h = X(p) ? 0 : t.scale(p);
            f.push(Ue(Ue({}, v), {}, {
                radius: h
            }, J(o, u, h, v.angle)))
        } else f.push(v)
    }), {
        points: s,
        isRange: l,
        baseLinePoints: f
    }
}

function WN(e) {
    var {
        showLabels: t,
        points: r,
        children: n
    } = e, i = r.map(a => {
        var o, u = {
            x: a.x,
            y: a.y,
            width: 0,
            lowerWidth: 0,
            upperWidth: 0,
            height: 0
        };
        return Ue(Ue({}, u), {}, {
            value: (o = a.value) !== null && o !== void 0 ? o : "",
            payload: a.payload,
            parentViewBox: void 0,
            viewBox: u,
            fill: void 0
        })
    });
    return d.createElement(Pi, {
        value: t ? i : void 0
    }, n)
}

function FN(e) {
    var {
        points: t,
        baseLinePoints: r,
        props: n
    } = e;
    if (t == null) return null;
    var {
        shape: i,
        isRange: a,
        connectNulls: o
    } = n, u = c => {
        var {
            onMouseEnter: f
        } = n;
        f && f(n, c)
    }, l = c => {
        var {
            onMouseLeave: f
        } = n;
        f && f(n, c)
    }, s;
    return d.isValidElement(i) ? s = d.cloneElement(i, Ue(Ue({}, n), {}, {
        points: t
    })) : typeof i == "function" ? s = i(Ue(Ue({}, n), {}, {
        points: t
    })) : s = d.createElement(f0, Xn({}, ye(n), {
        onMouseEnter: u,
        onMouseLeave: l,
        points: t,
        baseLinePoints: a ? r : void 0,
        connectNulls: o
    })), d.createElement(G, {
        className: "recharts-radar-polygon"
    }, s, d.createElement(zN, {
        props: n,
        points: t
    }))
}
var Th = (e, t, r) => (n, i) => {
    var a = e && e[Math.floor(i * t)];
    return a ? Ue(Ue({}, n), {}, {
        x: F(a.x, n.x, r),
        y: F(a.y, n.y, r)
    }) : Ue(Ue({}, n), {}, {
        x: F(n.cx, n.x, r),
        y: F(n.cy, n.y, r)
    })
};

function qN(e) {
    var {
        props: t,
        previousPointsRef: r,
        previousBaseLinePointsRef: n
    } = e, {
        points: i,
        baseLinePoints: a,
        isAnimationActive: o,
        animationBegin: u,
        animationDuration: l,
        animationEasing: s,
        onAnimationEnd: c,
        onAnimationStart: f
    } = t, v = r.current, p = n.current, h = v ? v.length / i.length : 1, m = p ? p.length / a.length : 1, y = fr(t, "recharts-radar-"), [g, b] = d.useState(!1), x = !g, P = d.useCallback(() => {
        typeof c == "function" && c(), b(!1)
    }, [c]), w = d.useCallback(() => {
        typeof f == "function" && f(), b(!0)
    }, [f]);
    return d.createElement(WN, {
        showLabels: x,
        points: i
    }, d.createElement(sr, {
        animationId: y,
        begin: u,
        duration: l,
        isActive: o,
        easing: s,
        key: "radar-".concat(y),
        onAnimationEnd: P,
        onAnimationStart: w
    }, O => {
        var S = O === 1 ? i : i.map(Th(v, h, O)),
            E = O === 1 ? a : a ?.map(Th(p, m, O));
        return O > 0 && (r.current = S, n.current = E), d.createElement(FN, {
            points: S,
            baseLinePoints: E,
            props: t
        })
    }), d.createElement(mn, {
        label: t.label
    }), t.children)
}

function UN(e) {
    var t = d.useRef(void 0),
        r = d.useRef(void 0);
    return d.createElement(qN, {
        props: e,
        previousPointsRef: t,
        previousBaseLinePointsRef: r
    })
}
var HN = {
    activeDot: !0,
    angleAxisId: 0,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: "ease",
    dot: !1,
    hide: !1,
    isAnimationActive: "auto",
    label: !1,
    legendType: "rect",
    radiusAxisId: 0,
    zIndex: ie.area
};

function GN(e) {
    var {
        hide: t,
        className: r,
        points: n
    } = e;
    if (t) return null;
    var i = z("recharts-radar", r);
    return d.createElement(ge, {
        zIndex: e.zIndex
    }, d.createElement(G, {
        className: i
    }, d.createElement(UN, e)), d.createElement(Ia, {
        points: n,
        mainColor: Gs(e.stroke, e.fill),
        itemDataKey: e.dataKey,
        activeDot: e.activeDot
    }))
}

function VN(e) {
    var t = he(),
        r = M(n => CN(n, e.radiusAxisId, e.angleAxisId, t, e.id));
    return r ?.points == null ? null : d.createElement(GN, Xn({}, e, {
        points: r ?.points,
        baseLinePoints: r ?.baseLinePoints,
        isRange: r ?.isRange
    }))
}

function YN(e) {
    var t = ee(e, HN);
    return d.createElement(xn, {
        id: t.id,
        type: "radar"
    }, r => d.createElement(d.Fragment, null, d.createElement(P0, {
        type: "radar",
        id: r,
        data: void 0,
        dataKey: t.dataKey,
        hide: t.hide,
        angleAxisId: t.angleAxisId,
        radiusAxisId: t.radiusAxisId
    }), d.createElement(x0, {
        legendPayload: LN(t)
    }), d.createElement(BN, {
        dataKey: t.dataKey,
        stroke: t.stroke,
        strokeWidth: t.strokeWidth,
        fill: t.fill,
        name: t.name,
        hide: t.hide,
        tooltipType: t.tooltipType,
        id: r
    }), d.createElement(VN, Xn({}, t, {
        id: r
    }))))
}
YN.displayName = "Radar";
var Mh = (e, t, r) => {
        var n = r ?? e;
        if (!X(n)) return $e(n, t, 0)
    },
    XN = (e, t, r) => {
        var n = {},
            i = e.filter(lo),
            a = e.filter(s => s.stackId == null),
            o = i.reduce((s, c) => (s[c.stackId] || (s[c.stackId] = []), s[c.stackId].push(c), s), n),
            u = Object.entries(o).map(s => {
                var [c, f] = s, v = f.map(h => h.dataKey), p = Mh(t, r, f[0].barSize);
                return {
                    stackId: c,
                    dataKeys: v,
                    barSize: p
                }
            }),
            l = a.map(s => {
                var c = [s.dataKey].filter(v => v != null),
                    f = Mh(t, r, s.barSize);
                return {
                    stackId: void 0,
                    dataKeys: c,
                    barSize: f
                }
            });
        return [...u, ...l]
    };

function Dh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Bi(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Dh(Object(r), !0).forEach(function(n) {
            ZN(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Dh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function ZN(e, t, r) {
    return (t = JN(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function JN(e) {
    var t = QN(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function QN(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function eR(e, t, r, n, i) {
    var a = n.length;
    if (!(a < 1)) {
        var o = $e(e, r, 0, !0),
            u, l = [];
        if (ae(n[0].barSize)) {
            var s = !1,
                c = r / a,
                f = n.reduce((g, b) => g + (b.barSize || 0), 0);
            f += (a - 1) * o, f >= r && (f -= (a - 1) * o, o = 0), f >= r && c > 0 && (s = !0, c *= .9, f = a * c);
            var v = (r - f) / 2 >> 0,
                p = {
                    offset: v - o,
                    size: 0
                };
            u = n.reduce((g, b) => {
                var x, P = {
                        stackId: b.stackId,
                        dataKeys: b.dataKeys,
                        position: {
                            offset: p.offset + p.size + o,
                            size: s ? c : (x = b.barSize) !== null && x !== void 0 ? x : 0
                        }
                    },
                    w = [...g, P];
                return p = w[w.length - 1].position, w
            }, l)
        } else {
            var h = $e(t, r, 0, !0);
            r - 2 * h - (a - 1) * o <= 0 && (o = 0);
            var m = (r - 2 * h - (a - 1) * o) / a;
            m > 1 && (m >>= 0);
            var y = ae(i) ? Math.min(m, i) : m;
            u = n.reduce((g, b, x) => [...g, {
                stackId: b.stackId,
                dataKeys: b.dataKeys,
                position: {
                    offset: h + (m + o) * x + (m - y) / 2,
                    size: y
                }
            }], l)
        }
        return u
    }
}
var tR = (e, t, r, n, i, a, o) => {
        var u = X(o) ? t : o,
            l = eR(r, n, i !== a ? i : a, e, u);
        return i !== a && l != null && (l = l.map(s => Bi(Bi({}, s), {}, {
            position: Bi(Bi({}, s.position), {}, {
                offset: s.position.offset - i / 2
            })
        }))), l
    },
    rR = (e, t) => {
        var r = uo(t);
        if (!(!e || r == null || t == null)) {
            var {
                stackId: n
            } = t;
            if (n != null) {
                var i = e[n];
                if (i) {
                    var {
                        stackedData: a
                    } = i;
                    if (a) return a.find(o => o.key === r)
                }
            }
        }
    };

function nR(e, t) {
    return e && typeof e == "object" && "zIndex" in e && typeof e.zIndex == "number" && ae(e.zIndex) ? e.zIndex : t
}
var I0 = e => {
        var {
            chartData: t
        } = e, r = te(), n = he();
        return d.useEffect(() => n ? () => {} : (r(Ep(t)), () => {
            r(Ep(void 0))
        }), [t, r, n]), null
    },
    Nh = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    },
    _0 = Ge({
        name: "brush",
        initialState: Nh,
        reducers: {
            setBrushSettings(e, t) {
                return t.payload == null ? Nh : t.payload
            }
        }
    }),
    {
        setBrushSettings: _z
    } = _0.actions,
    iR = _0.reducer;

function aR(e, t, r) {
    return (t = oR(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function oR(e) {
    var t = uR(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function uR(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
class Vs {
    static create(t) {
        return new Vs(t)
    }
    constructor(t) {
        this.scale = t
    }
    get domain() {
        return this.scale.domain
    }
    get range() {
        return this.scale.range
    }
    get rangeMin() {
        return this.range()[0]
    }
    get rangeMax() {
        return this.range()[1]
    }
    get bandwidth() {
        return this.scale.bandwidth
    }
    apply(t) {
        var {
            bandAware: r,
            position: n
        } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (t !== void 0) {
            if (n) switch (n) {
                case "start":
                    return this.scale(t);
                case "middle":
                    {
                        var i = this.bandwidth ? this.bandwidth() / 2 : 0;
                        return this.scale(t) + i
                    }
                case "end":
                    {
                        var a = this.bandwidth ? this.bandwidth() : 0;
                        return this.scale(t) + a
                    }
                default:
                    return this.scale(t)
            }
            if (r) {
                var o = this.bandwidth ? this.bandwidth() / 2 : 0;
                return this.scale(t) + o
            }
            return this.scale(t)
        }
    }
    isInRange(t) {
        var r = this.range(),
            n = r[0],
            i = r[r.length - 1];
        return n <= i ? t >= n && t <= i : t >= i && t <= n
    }
}
aR(Vs, "EPS", 1e-4);

function lR(e) {
    return (e % 180 + 180) % 180
}
var cR = function(t) {
        var {
            width: r,
            height: n
        } = t, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, a = lR(i), o = a * Math.PI / 180, u = Math.atan(n / r), l = o > u && o < Math.PI - u ? n / Math.sin(o) : r / Math.cos(o);
        return Math.abs(l)
    },
    sR = {
        dots: [],
        areas: [],
        lines: []
    },
    k0 = Ge({
        name: "referenceElements",
        initialState: sR,
        reducers: {
            addDot: (e, t) => {
                e.dots.push(t.payload)
            },
            removeDot: (e, t) => {
                var r = ht(e).dots.findIndex(n => n === t.payload);
                r !== -1 && e.dots.splice(r, 1)
            },
            addArea: (e, t) => {
                e.areas.push(t.payload)
            },
            removeArea: (e, t) => {
                var r = ht(e).areas.findIndex(n => n === t.payload);
                r !== -1 && e.areas.splice(r, 1)
            },
            addLine: (e, t) => {
                e.lines.push(t.payload)
            },
            removeLine: (e, t) => {
                var r = ht(e).lines.findIndex(n => n === t.payload);
                r !== -1 && e.lines.splice(r, 1)
            }
        }
    }),
    {
        addDot: kz,
        removeDot: Cz,
        addArea: Tz,
        removeArea: Mz,
        addLine: Dz,
        removeLine: Nz
    } = k0.actions,
    fR = k0.reducer,
    dR = d.createContext(void 0),
    vR = e => {
        var {
            children: t
        } = e, [r] = d.useState("".concat(Rn("recharts"), "-clip")), n = jo();
        if (n == null) return null;
        var {
            x: i,
            y: a,
            width: o,
            height: u
        } = n;
        return d.createElement(dR.Provider, {
            value: r
        }, d.createElement("defs", null, d.createElement("clipPath", {
            id: r
        }, d.createElement("rect", {
            x: i,
            y: a,
            height: u,
            width: o
        }))), t)
    };

function C0(e, t) {
    if (t < 1) return [];
    if (t === 1) return e;
    for (var r = [], n = 0; n < e.length; n += t) {
        var i = e[n];
        i !== void 0 && r.push(i)
    }
    return r
}

function pR(e, t, r) {
    var n = {
        width: e.width + t.width,
        height: e.height + t.height
    };
    return cR(n, r)
}

function hR(e, t, r) {
    var n = r === "width",
        {
            x: i,
            y: a,
            width: o,
            height: u
        } = e;
    return t === 1 ? {
        start: n ? i : a,
        end: n ? i + o : a + u
    } : {
        start: n ? i + o : a + u,
        end: n ? i : a
    }
}

function Zn(e, t, r, n, i) {
    if (e * t < e * n || e * t > e * i) return !1;
    var a = r();
    return e * (t - e * a / 2 - n) >= 0 && e * (t + e * a / 2 - i) <= 0
}

function mR(e, t) {
    return C0(e, t + 1)
}

function yR(e, t, r, n, i) {
    for (var a = (n || []).slice(), {
            start: o,
            end: u
        } = t, l = 0, s = 1, c = o, f = function() {
            var h = n ?.[l];
            if (h === void 0) return {
                v: C0(n, s)
            };
            var m = l,
                y, g = () => (y === void 0 && (y = r(h, m)), y),
                b = h.coordinate,
                x = l === 0 || Zn(e, b, g, c, u);
            x || (l = 0, c = o, s += 1), x && (c = b + e * (g() / 2 + i), l += s)
        }, v; s <= a.length;)
        if (v = f(), v) return v.v;
    return []
}

function gR(e, t, r, n, i) {
    var a = (n || []).slice(),
        o = a.length;
    if (o === 0) return [];
    for (var {
            start: u,
            end: l
        } = t, s = 1; s <= o; s++) {
        for (var c = (o - 1) % s, f = u, v = !0, p = function() {
                var b = n[h],
                    x = h,
                    P, w = () => (P === void 0 && (P = r(b, x)), P),
                    O = b.coordinate,
                    S = h === c || Zn(e, O, w, f, l);
                if (!S) return v = !1, 1;
                S && (f = O + e * (w() / 2 + i))
            }, h = c; h < o && !p(); h += s);
        if (v) {
            for (var m = [], y = c; y < o; y += s) m.push(n[y]);
            return m
        }
    }
    return []
}

function Rh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Ne(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Rh(Object(r), !0).forEach(function(n) {
            bR(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Rh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function bR(e, t, r) {
    return (t = xR(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function xR(e) {
    var t = wR(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function wR(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function PR(e, t, r, n, i) {
    for (var a = (n || []).slice(), o = a.length, {
            start: u
        } = t, {
            end: l
        } = t, s = function(v) {
            var p = a[v],
                h, m = () => (h === void 0 && (h = r(p, v)), h);
            if (v === o - 1) {
                var y = e * (p.coordinate + e * m() / 2 - l);
                a[v] = p = Ne(Ne({}, p), {}, {
                    tickCoord: y > 0 ? p.coordinate - y * e : p.coordinate
                })
            } else a[v] = p = Ne(Ne({}, p), {}, {
                tickCoord: p.coordinate
            });
            if (p.tickCoord != null) {
                var g = Zn(e, p.tickCoord, m, u, l);
                g && (l = p.tickCoord - e * (m() / 2 + i), a[v] = Ne(Ne({}, p), {}, {
                    isShow: !0
                }))
            }
        }, c = o - 1; c >= 0; c--) s(c);
    return a
}

function OR(e, t, r, n, i, a) {
    var o = (n || []).slice(),
        u = o.length,
        {
            start: l,
            end: s
        } = t;
    if (a) {
        var c = n[u - 1],
            f = r(c, u - 1),
            v = e * (c.coordinate + e * f / 2 - s);
        if (o[u - 1] = c = Ne(Ne({}, c), {}, {
                tickCoord: v > 0 ? c.coordinate - v * e : c.coordinate
            }), c.tickCoord != null) {
            var p = Zn(e, c.tickCoord, () => f, l, s);
            p && (s = c.tickCoord - e * (f / 2 + i), o[u - 1] = Ne(Ne({}, c), {}, {
                isShow: !0
            }))
        }
    }
    for (var h = a ? u - 1 : u, m = function(b) {
            var x = o[b],
                P, w = () => (P === void 0 && (P = r(x, b)), P);
            if (b === 0) {
                var O = e * (x.coordinate - e * w() / 2 - l);
                o[b] = x = Ne(Ne({}, x), {}, {
                    tickCoord: O < 0 ? x.coordinate - O * e : x.coordinate
                })
            } else o[b] = x = Ne(Ne({}, x), {}, {
                tickCoord: x.coordinate
            });
            if (x.tickCoord != null) {
                var S = Zn(e, x.tickCoord, w, l, s);
                S && (l = x.tickCoord + e * (w() / 2 + i), o[b] = Ne(Ne({}, x), {}, {
                    isShow: !0
                }))
            }
        }, y = 0; y < h; y++) m(y);
    return o
}

function Ys(e, t, r) {
    var {
        tick: n,
        ticks: i,
        viewBox: a,
        minTickGap: o,
        orientation: u,
        interval: l,
        tickFormatter: s,
        unit: c,
        angle: f
    } = e;
    if (!i || !i.length || !n) return [];
    if (D(l) || ai.isSsr) {
        var v;
        return (v = mR(i, D(l) ? l : 0)) !== null && v !== void 0 ? v : []
    }
    var p = [],
        h = u === "top" || u === "bottom" ? "width" : "height",
        m = c && h === "width" ? Mn(c, {
            fontSize: t,
            letterSpacing: r
        }) : {
            width: 0,
            height: 0
        },
        y = (x, P) => {
            var w = typeof s == "function" ? s(x.value, P) : x.value;
            return h === "width" ? pR(Mn(w, {
                fontSize: t,
                letterSpacing: r
            }), m, f) : Mn(w, {
                fontSize: t,
                letterSpacing: r
            })[h]
        },
        g = i.length >= 2 ? _e(i[1].coordinate - i[0].coordinate) : 1,
        b = hR(a, g, h);
    return l === "equidistantPreserveStart" ? yR(g, b, y, i, o) : l === "equidistantPreserveEnd" ? gR(g, b, y, i, o) : (l === "preserveStart" || l === "preserveStartEnd" ? p = OR(g, b, y, i, o, l === "preserveStartEnd") : p = PR(g, b, y, i, o), p.filter(x => x.isShow))
}
var AR = e => {
        var {
            ticks: t,
            label: r,
            labelGapWithTick: n = 5,
            tickSize: i = 0,
            tickMargin: a = 0
        } = e, o = 0;
        if (t) {
            Array.from(t).forEach(c => {
                if (c) {
                    var f = c.getBoundingClientRect();
                    f.width > o && (o = f.width)
                }
            });
            var u = r ? r.getBoundingClientRect().width : 0,
                l = i + a,
                s = o + l + u + (r ? n : 0);
            return Math.round(s)
        }
        return 0
    },
    SR = ["axisLine", "width", "height", "className", "hide", "ticks", "axisType"];

function ER(e, t) {
    if (e == null) return {};
    var r, n, i = jR(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function jR(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function Rr() {
    return Rr = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Rr.apply(null, arguments)
}

function $h(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function be(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? $h(Object(r), !0).forEach(function(n) {
            IR(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : $h(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function IR(e, t, r) {
    return (t = _R(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function _R(e) {
    var t = kR(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function kR(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var Bt = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    viewBox: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    orientation: "bottom",
    ticks: [],
    stroke: "#666",
    tickLine: !0,
    axisLine: !0,
    tick: !0,
    mirror: !1,
    minTickGap: 5,
    tickSize: 6,
    tickMargin: 2,
    interval: "preserveEnd",
    zIndex: ie.axis
};

function CR(e) {
    var {
        x: t,
        y: r,
        width: n,
        height: i,
        orientation: a,
        mirror: o,
        axisLine: u,
        otherSvgProps: l
    } = e;
    if (!u) return null;
    var s = be(be(be({}, l), re(u)), {}, {
        fill: "none"
    });
    if (a === "top" || a === "bottom") {
        var c = +(a === "top" && !o || a === "bottom" && o);
        s = be(be({}, s), {}, {
            x1: t,
            y1: r + c * i,
            x2: t + n,
            y2: r + c * i
        })
    } else {
        var f = +(a === "left" && !o || a === "right" && o);
        s = be(be({}, s), {}, {
            x1: t + f * n,
            y1: r,
            x2: t + f * n,
            y2: r + i
        })
    }
    return d.createElement("line", Rr({}, s, {
        className: z("recharts-cartesian-axis-line", Cr(u, "className"))
    }))
}

function TR(e, t, r, n, i, a, o, u, l) {
    var s, c, f, v, p, h, m = u ? -1 : 1,
        y = e.tickSize || o,
        g = D(e.tickCoord) ? e.tickCoord : e.coordinate;
    switch (a) {
        case "top":
            s = c = e.coordinate, v = r + +!u * i, f = v - m * y, h = f - m * l, p = g;
            break;
        case "left":
            f = v = e.coordinate, c = t + +!u * n, s = c - m * y, p = s - m * l, h = g;
            break;
        case "right":
            f = v = e.coordinate, c = t + +u * n, s = c + m * y, p = s + m * l, h = g;
            break;
        default:
            s = c = e.coordinate, v = r + +u * i, f = v + m * y, h = f + m * l, p = g;
            break
    }
    return {
        line: {
            x1: s,
            y1: f,
            x2: c,
            y2: v
        },
        tick: {
            x: p,
            y: h
        }
    }
}

function MR(e, t) {
    switch (e) {
        case "left":
            return t ? "start" : "end";
        case "right":
            return t ? "end" : "start";
        default:
            return "middle"
    }
}

function DR(e, t) {
    switch (e) {
        case "left":
        case "right":
            return "middle";
        case "top":
            return t ? "start" : "end";
        default:
            return t ? "end" : "start"
    }
}

function NR(e) {
    var {
        option: t,
        tickProps: r,
        value: n
    } = e, i, a = z(r.className, "recharts-cartesian-axis-tick-value");
    if (d.isValidElement(t)) i = d.cloneElement(t, be(be({}, r), {}, {
        className: a
    }));
    else if (typeof t == "function") i = t(be(be({}, r), {}, {
        className: a
    }));
    else {
        var o = "recharts-cartesian-axis-tick-value";
        typeof t != "boolean" && (o = z(o, t ?.className)), i = d.createElement(hn, Rr({}, r, {
            className: o
        }), n)
    }
    return i
}
var RR = d.forwardRef((e, t) => {
        var {
            ticks: r = [],
            tick: n,
            tickLine: i,
            stroke: a,
            tickFormatter: o,
            unit: u,
            padding: l,
            tickTextProps: s,
            orientation: c,
            mirror: f,
            x: v,
            y: p,
            width: h,
            height: m,
            tickSize: y,
            tickMargin: g,
            fontSize: b,
            letterSpacing: x,
            getTicksConfig: P,
            events: w,
            axisType: O
        } = e, S = Ys(be(be({}, P), {}, {
            ticks: r
        }), b, x), E = MR(c, f), _ = DR(c, f), C = re(P), j = At(n), I = {};
        typeof i == "object" && (I = i);
        var R = be(be({}, C), {}, {
                fill: "none"
            }, I),
            $ = S.map(W => be({
                entry: W
            }, TR(W, v, p, h, m, c, y, f, g))),
            B = $.map(W => {
                var {
                    entry: V,
                    line: L
                } = W;
                return d.createElement(G, {
                    className: "recharts-cartesian-axis-tick",
                    key: "tick-".concat(V.value, "-").concat(V.coordinate, "-").concat(V.tickCoord)
                }, i && d.createElement("line", Rr({}, R, L, {
                    className: z("recharts-cartesian-axis-tick-line", Cr(i, "className"))
                })))
            }),
            q = $.map((W, V) => {
                var {
                    entry: L,
                    tick: Me
                } = W, Le = be(be(be(be({
                    textAnchor: E,
                    verticalAnchor: _
                }, C), {}, {
                    stroke: "none",
                    fill: a
                }, j), Me), {}, {
                    index: V,
                    payload: L,
                    visibleTicksCount: S.length,
                    tickFormatter: o,
                    padding: l
                }, s);
                return d.createElement(G, Rr({
                    className: "recharts-cartesian-axis-tick-label",
                    key: "tick-label-".concat(L.value, "-").concat(L.coordinate, "-").concat(L.tickCoord)
                }, lr(w, L, V)), n && d.createElement(NR, {
                    option: n,
                    tickProps: Le,
                    value: "".concat(typeof o == "function" ? o(L.value, V) : L.value).concat(u || "")
                }))
            });
        return d.createElement("g", {
            className: "recharts-cartesian-axis-ticks recharts-".concat(O, "-ticks")
        }, q.length > 0 && d.createElement(ge, {
            zIndex: ie.label
        }, d.createElement("g", {
            className: "recharts-cartesian-axis-tick-labels recharts-".concat(O, "-tick-labels"),
            ref: t
        }, q)), B.length > 0 && d.createElement("g", {
            className: "recharts-cartesian-axis-tick-lines recharts-".concat(O, "-tick-lines")
        }, B))
    }),
    $R = d.forwardRef((e, t) => {
        var {
            axisLine: r,
            width: n,
            height: i,
            className: a,
            hide: o,
            ticks: u,
            axisType: l
        } = e, s = ER(e, SR), [c, f] = d.useState(""), [v, p] = d.useState(""), h = d.useRef(null);
        d.useImperativeHandle(t, () => ({
            getCalculatedWidth: () => {
                var y;
                return AR({
                    ticks: h.current,
                    label: (y = e.labelRef) === null || y === void 0 ? void 0 : y.current,
                    labelGapWithTick: 5,
                    tickSize: e.tickSize,
                    tickMargin: e.tickMargin
                })
            }
        }));
        var m = d.useCallback(y => {
            if (y) {
                var g = y.getElementsByClassName("recharts-cartesian-axis-tick-value");
                h.current = g;
                var b = g[0];
                if (b) {
                    var x = window.getComputedStyle(b),
                        P = x.fontSize,
                        w = x.letterSpacing;
                    (P !== c || w !== v) && (f(P), p(w))
                }
            }
        }, [c, v]);
        return o || n != null && n <= 0 || i != null && i <= 0 ? null : d.createElement(ge, {
            zIndex: e.zIndex
        }, d.createElement(G, {
            className: z("recharts-cartesian-axis", a)
        }, d.createElement(CR, {
            x: e.x,
            y: e.y,
            width: n,
            height: i,
            orientation: e.orientation,
            mirror: e.mirror,
            axisLine: r,
            otherSvgProps: re(e)
        }), d.createElement(RR, {
            ref: m,
            axisType: l,
            events: s,
            fontSize: c,
            getTicksConfig: e,
            height: e.height,
            letterSpacing: v,
            mirror: e.mirror,
            orientation: e.orientation,
            padding: e.padding,
            stroke: e.stroke,
            tick: e.tick,
            tickFormatter: e.tickFormatter,
            tickLine: e.tickLine,
            tickMargin: e.tickMargin,
            tickSize: e.tickSize,
            tickTextProps: e.tickTextProps,
            ticks: u,
            unit: e.unit,
            width: e.width,
            x: e.x,
            y: e.y
        }), d.createElement(UC, {
            x: e.x,
            y: e.y,
            width: e.width,
            height: e.height,
            lowerWidth: e.width,
            upperWidth: e.width
        }, d.createElement(QC, {
            label: e.label,
            labelRef: e.labelRef
        }), e.children)))
    }),
    Xs = d.forwardRef((e, t) => {
        var r = ee(e, Bt);
        return d.createElement($R, Rr({}, r, {
            ref: t
        }))
    });
Xs.displayName = "CartesianAxis";
var LR = ["x1", "y1", "x2", "y2", "key"],
    BR = ["offset"],
    zR = ["xAxisId", "yAxisId"],
    KR = ["xAxisId", "yAxisId"];

function Lh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Re(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Lh(Object(r), !0).forEach(function(n) {
            WR(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Lh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function WR(e, t, r) {
    return (t = FR(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function FR(e) {
    var t = qR(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function qR(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function Or() {
    return Or = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Or.apply(null, arguments)
}

function ka(e, t) {
    if (e == null) return {};
    var r, n, i = UR(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function UR(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var HR = e => {
    var {
        fill: t
    } = e;
    if (!t || t === "none") return null;
    var {
        fillOpacity: r,
        x: n,
        y: i,
        width: a,
        height: o,
        ry: u
    } = e;
    return d.createElement("rect", {
        x: n,
        y: i,
        ry: u,
        width: a,
        height: o,
        stroke: "none",
        fill: t,
        fillOpacity: r,
        className: "recharts-cartesian-grid-bg"
    })
};

function T0(e) {
    var {
        option: t,
        lineItemProps: r
    } = e, n;
    if (d.isValidElement(t)) n = d.cloneElement(t, r);
    else if (typeof t == "function") n = t(r);
    else {
        var i, {
                x1: a,
                y1: o,
                x2: u,
                y2: l,
                key: s
            } = r,
            c = ka(r, LR),
            f = (i = re(c)) !== null && i !== void 0 ? i : {},
            {
                offset: v
            } = f,
            p = ka(f, BR);
        n = d.createElement("line", Or({}, p, {
            x1: a,
            y1: o,
            x2: u,
            y2: l,
            fill: "none",
            key: s
        }))
    }
    return n
}

function GR(e) {
    var {
        x: t,
        width: r,
        horizontal: n = !0,
        horizontalPoints: i
    } = e;
    if (!n || !i || !i.length) return null;
    var {
        xAxisId: a,
        yAxisId: o
    } = e, u = ka(e, zR), l = i.map((s, c) => {
        var f = Re(Re({}, u), {}, {
            x1: t,
            y1: s,
            x2: t + r,
            y2: s,
            key: "line-".concat(c),
            index: c
        });
        return d.createElement(T0, {
            key: "line-".concat(c),
            option: n,
            lineItemProps: f
        })
    });
    return d.createElement("g", {
        className: "recharts-cartesian-grid-horizontal"
    }, l)
}

function VR(e) {
    var {
        y: t,
        height: r,
        vertical: n = !0,
        verticalPoints: i
    } = e;
    if (!n || !i || !i.length) return null;
    var {
        xAxisId: a,
        yAxisId: o
    } = e, u = ka(e, KR), l = i.map((s, c) => {
        var f = Re(Re({}, u), {}, {
            x1: s,
            y1: t,
            x2: s,
            y2: t + r,
            key: "line-".concat(c),
            index: c
        });
        return d.createElement(T0, {
            option: n,
            lineItemProps: f,
            key: "line-".concat(c)
        })
    });
    return d.createElement("g", {
        className: "recharts-cartesian-grid-vertical"
    }, l)
}

function YR(e) {
    var {
        horizontalFill: t,
        fillOpacity: r,
        x: n,
        y: i,
        width: a,
        height: o,
        horizontalPoints: u,
        horizontal: l = !0
    } = e;
    if (!l || !t || !t.length || u == null) return null;
    var s = u.map(f => Math.round(f + i - i)).sort((f, v) => f - v);
    i !== s[0] && s.unshift(0);
    var c = s.map((f, v) => {
        var p = !s[v + 1],
            h = p ? i + o - f : s[v + 1] - f;
        if (h <= 0) return null;
        var m = v % t.length;
        return d.createElement("rect", {
            key: "react-".concat(v),
            y: f,
            x: n,
            height: h,
            width: a,
            stroke: "none",
            fill: t[m],
            fillOpacity: r,
            className: "recharts-cartesian-grid-bg"
        })
    });
    return d.createElement("g", {
        className: "recharts-cartesian-gridstripes-horizontal"
    }, c)
}

function XR(e) {
    var {
        vertical: t = !0,
        verticalFill: r,
        fillOpacity: n,
        x: i,
        y: a,
        width: o,
        height: u,
        verticalPoints: l
    } = e;
    if (!t || !r || !r.length) return null;
    var s = l.map(f => Math.round(f + i - i)).sort((f, v) => f - v);
    i !== s[0] && s.unshift(0);
    var c = s.map((f, v) => {
        var p = !s[v + 1],
            h = p ? i + o - f : s[v + 1] - f;
        if (h <= 0) return null;
        var m = v % r.length;
        return d.createElement("rect", {
            key: "react-".concat(v),
            x: f,
            y: a,
            width: h,
            height: u,
            stroke: "none",
            fill: r[m],
            fillOpacity: n,
            className: "recharts-cartesian-grid-bg"
        })
    });
    return d.createElement("g", {
        className: "recharts-cartesian-gridstripes-vertical"
    }, c)
}
var ZR = (e, t) => {
        var {
            xAxis: r,
            width: n,
            height: i,
            offset: a
        } = e;
        return xy(Ys(Re(Re(Re({}, Bt), r), {}, {
            ticks: wy(r),
            viewBox: {
                x: 0,
                y: 0,
                width: n,
                height: i
            }
        })), a.left, a.left + a.width, t)
    },
    JR = (e, t) => {
        var {
            yAxis: r,
            width: n,
            height: i,
            offset: a
        } = e;
        return xy(Ys(Re(Re(Re({}, Bt), r), {}, {
            ticks: wy(r),
            viewBox: {
                x: 0,
                y: 0,
                width: n,
                height: i
            }
        })), a.top, a.top + a.height, t)
    },
    QR = {
        horizontal: !0,
        vertical: !0,
        horizontalPoints: [],
        verticalPoints: [],
        stroke: "#ccc",
        fill: "none",
        verticalFill: [],
        horizontalFill: [],
        xAxisId: 0,
        yAxisId: 0,
        syncWithTicks: !1,
        zIndex: ie.grid
    };

function e$(e) {
    var t = Cc(),
        r = Tc(),
        n = Iy(),
        i = Re(Re({}, ee(e, QR)), {}, {
            x: D(e.x) ? e.x : n.left,
            y: D(e.y) ? e.y : n.top,
            width: D(e.width) ? e.width : n.width,
            height: D(e.height) ? e.height : n.height
        }),
        {
            xAxisId: a,
            yAxisId: o,
            x: u,
            y: l,
            width: s,
            height: c,
            syncWithTicks: f,
            horizontalValues: v,
            verticalValues: p
        } = i,
        h = he(),
        m = M(_ => pp(_, "xAxis", a, h)),
        y = M(_ => pp(_, "yAxis", o, h));
    if (!Et(s) || !Et(c) || !D(u) || !D(l)) return null;
    var g = i.verticalCoordinatesGenerator || ZR,
        b = i.horizontalCoordinatesGenerator || JR,
        {
            horizontalPoints: x,
            verticalPoints: P
        } = i;
    if ((!x || !x.length) && typeof b == "function") {
        var w = v && v.length,
            O = b({
                yAxis: y ? Re(Re({}, y), {}, {
                    ticks: w ? v : y.ticks
                }) : void 0,
                width: t ?? s,
                height: r ?? c,
                offset: n
            }, w ? !0 : f);
        na(Array.isArray(O), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof O, "]")), Array.isArray(O) && (x = O)
    }
    if ((!P || !P.length) && typeof g == "function") {
        var S = p && p.length,
            E = g({
                xAxis: m ? Re(Re({}, m), {}, {
                    ticks: S ? p : m.ticks
                }) : void 0,
                width: t ?? s,
                height: r ?? c,
                offset: n
            }, S ? !0 : f);
        na(Array.isArray(E), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof E, "]")), Array.isArray(E) && (P = E)
    }
    return d.createElement(ge, {
        zIndex: i.zIndex
    }, d.createElement("g", {
        className: "recharts-cartesian-grid"
    }, d.createElement(HR, {
        fill: i.fill,
        fillOpacity: i.fillOpacity,
        x: i.x,
        y: i.y,
        width: i.width,
        height: i.height,
        ry: i.ry
    }), d.createElement(YR, Or({}, i, {
        horizontalPoints: x
    })), d.createElement(XR, Or({}, i, {
        verticalPoints: P
    })), d.createElement(GR, Or({}, i, {
        offset: n,
        horizontalPoints: x,
        xAxis: m,
        yAxis: y
    })), d.createElement(VR, Or({}, i, {
        offset: n,
        verticalPoints: P,
        xAxis: m,
        yAxis: y
    }))))
}
e$.displayName = "CartesianGrid";
var t$ = {},
    M0 = Ge({
        name: "errorBars",
        initialState: t$,
        reducers: {
            addErrorBar: (e, t) => {
                var {
                    itemId: r,
                    errorBar: n
                } = t.payload;
                e[r] || (e[r] = []), e[r].push(n)
            },
            replaceErrorBar: (e, t) => {
                var {
                    itemId: r,
                    prev: n,
                    next: i
                } = t.payload;
                e[r] && (e[r] = e[r].map(a => a.dataKey === n.dataKey && a.direction === n.direction ? i : a))
            },
            removeErrorBar: (e, t) => {
                var {
                    itemId: r,
                    errorBar: n
                } = t.payload;
                e[r] && (e[r] = e[r].filter(i => i.dataKey !== n.dataKey || i.direction !== n.direction))
            }
        }
    }),
    {
        addErrorBar: Rz,
        replaceErrorBar: $z,
        removeErrorBar: Lz
    } = M0.actions,
    r$ = M0.reducer,
    n$ = ["children"];

function i$(e, t) {
    if (e == null) return {};
    var r, n, i = a$(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function a$(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var o$ = {
        data: [],
        xAxisId: "xAxis-0",
        yAxisId: "yAxis-0",
        dataPointFormatter: () => ({
            x: 0,
            y: 0,
            value: 0
        }),
        errorBarOffset: 0
    },
    u$ = d.createContext(o$);

function Zs(e) {
    var {
        children: t
    } = e, r = i$(e, n$);
    return d.createElement(u$.Provider, {
        value: r
    }, t)
}

function Oi(e, t) {
    var r, n, i = M(s => Jt(s, e)),
        a = M(s => Qt(s, t)),
        o = (r = i ?.allowDataOverflow) !== null && r !== void 0 ? r : Ee.allowDataOverflow,
        u = (n = a ?.allowDataOverflow) !== null && n !== void 0 ? n : je.allowDataOverflow,
        l = o || u;
    return {
        needClip: l,
        needClipX: o,
        needClipY: u
    }
}

function Io(e) {
    var {
        xAxisId: t,
        yAxisId: r,
        clipPathId: n
    } = e, i = jo(), {
        needClipX: a,
        needClipY: o,
        needClip: u
    } = Oi(t, r);
    if (!u || !i) return null;
    var {
        x: l,
        y: s,
        width: c,
        height: f
    } = i;
    return d.createElement("clipPath", {
        id: "clipPath-".concat(n)
    }, d.createElement("rect", {
        x: a ? l : l - c / 2,
        y: o ? s : s - f / 2,
        width: a ? c : c * 2,
        height: o ? f : f * 2
    }))
}
var D0 = (e, t, r, n) => ct(e, "xAxis", t, n),
    N0 = (e, t, r, n) => lt(e, "xAxis", t, n),
    R0 = (e, t, r, n) => ct(e, "yAxis", r, n),
    $0 = (e, t, r, n) => lt(e, "yAxis", r, n),
    l$ = A([K, D0, R0, N0, $0], (e, t, r, n, i) => yt(e, "xAxis") ? jt(t, n, !1) : jt(r, i, !1)),
    c$ = (e, t, r, n, i) => i;

function s$(e) {
    return e.type === "line"
}
var f$ = A([cn, c$], (e, t) => e.filter(s$).find(r => r.id === t)),
    d$ = A([K, D0, R0, N0, $0, f$, l$, io], (e, t, r, n, i, a, o, u) => {
        var {
            chartData: l,
            dataStartIndex: s,
            dataEndIndex: c
        } = u;
        if (!(a == null || t == null || r == null || n == null || i == null || n.length === 0 || i.length === 0 || o == null || e !== "horizontal" && e !== "vertical")) {
            var {
                dataKey: f,
                data: v
            } = a, p;
            if (v != null && v.length > 0 ? p = v : p = l ?.slice(s, c + 1), p != null) return J$({
                layout: e,
                xAxis: t,
                yAxis: r,
                xAxisTicks: n,
                yAxisTicks: i,
                dataKey: f,
                bandSize: o,
                displayedData: p
            })
        }
    });

function L0(e) {
    var t = At(e),
        r = 3,
        n = 2;
    if (t != null) {
        var {
            r: i,
            strokeWidth: a
        } = t, o = Number(i), u = Number(a);
        return (Number.isNaN(o) || o < 0) && (o = r), (Number.isNaN(u) || u < 0) && (u = n), {
            r: o,
            strokeWidth: u
        }
    }
    return {
        r,
        strokeWidth: n
    }
}
var fl = {
        exports: {}
    },
    dl = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Bh;

function v$() {
    if (Bh) return dl;
    Bh = 1;
    var e = lc();

    function t(l, s) {
        return l === s && (l !== 0 || 1 / l === 1 / s) || l !== l && s !== s
    }
    var r = typeof Object.is == "function" ? Object.is : t,
        n = e.useSyncExternalStore,
        i = e.useRef,
        a = e.useEffect,
        o = e.useMemo,
        u = e.useDebugValue;
    return dl.useSyncExternalStoreWithSelector = function(l, s, c, f, v) {
        var p = i(null);
        if (p.current === null) {
            var h = {
                hasValue: !1,
                value: null
            };
            p.current = h
        } else h = p.current;
        p = o(function() {
            function y(w) {
                if (!g) {
                    if (g = !0, b = w, w = f(w), v !== void 0 && h.hasValue) {
                        var O = h.value;
                        if (v(O, w)) return x = O
                    }
                    return x = w
                }
                if (O = x, r(b, w)) return O;
                var S = f(w);
                return v !== void 0 && v(O, S) ? (b = w, O) : (b = w, x = S)
            }
            var g = !1,
                b, x, P = c === void 0 ? null : c;
            return [function() {
                return y(s())
            }, P === null ? void 0 : function() {
                return y(P())
            }]
        }, [s, c, f, v]);
        var m = n(l, p[0], p[1]);
        return a(function() {
            h.hasValue = !0, h.value = m
        }, [m]), u(m), m
    }, dl
}
var zh;

function p$() {
    return zh || (zh = 1, fl.exports = v$()), fl.exports
}
p$();

function h$(e) {
    e()
}

function m$() {
    let e = null,
        t = null;
    return {
        clear() {
            e = null, t = null
        },
        notify() {
            h$(() => {
                let r = e;
                for (; r;) r.callback(), r = r.next
            })
        },
        get() {
            const r = [];
            let n = e;
            for (; n;) r.push(n), n = n.next;
            return r
        },
        subscribe(r) {
            let n = !0;
            const i = t = {
                callback: r,
                next: null,
                prev: t
            };
            return i.prev ? i.prev.next = i : e = i,
                function() {
                    !n || e === null || (n = !1, i.next ? i.next.prev = i.prev : t = i.prev, i.prev ? i.prev.next = i.next : e = i.next)
                }
        }
    }
}
var Kh = {
    notify() {},
    get: () => []
};

function y$(e, t) {
    let r, n = Kh,
        i = 0,
        a = !1;

    function o(m) {
        c();
        const y = n.subscribe(m);
        let g = !1;
        return () => {
            g || (g = !0, y(), f())
        }
    }

    function u() {
        n.notify()
    }

    function l() {
        h.onStateChange && h.onStateChange()
    }

    function s() {
        return a
    }

    function c() {
        i++, r || (r = e.subscribe(l), n = m$())
    }

    function f() {
        i--, r && i === 0 && (r(), r = void 0, n.clear(), n = Kh)
    }

    function v() {
        a || (a = !0, c())
    }

    function p() {
        a && (a = !1, f())
    }
    const h = {
        addNestedSub: o,
        notifyNestedSubs: u,
        handleChangeWrapper: l,
        isSubscribed: s,
        trySubscribe: v,
        tryUnsubscribe: p,
        getListeners: () => n
    };
    return h
}
var g$ = () => typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u",
    b$ = g$(),
    x$ = () => typeof navigator < "u" && navigator.product === "ReactNative",
    w$ = x$(),
    P$ = () => b$ || w$ ? d.useLayoutEffect : d.useEffect,
    O$ = P$();

function Wh(e, t) {
    return e === t ? e !== 0 || t !== 0 || 1 / e === 1 / t : e !== e && t !== t
}

function A$(e, t) {
    if (Wh(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    const r = Object.keys(e),
        n = Object.keys(t);
    if (r.length !== n.length) return !1;
    for (let i = 0; i < r.length; i++)
        if (!Object.prototype.hasOwnProperty.call(t, r[i]) || !Wh(e[r[i]], t[r[i]])) return !1;
    return !0
}
var S$ = Symbol.for("react-redux-context"),
    E$ = typeof globalThis < "u" ? globalThis : {};

function j$() {
    if (!d.createContext) return {};
    const e = E$[S$] ??= new Map;
    let t = e.get(d.createContext);
    return t || (t = d.createContext(null), e.set(d.createContext, t)), t
}
var I$ = j$();

function _$(e) {
    const {
        children: t,
        context: r,
        serverState: n,
        store: i
    } = e, a = d.useMemo(() => {
        const l = y$(i);
        return {
            store: i,
            subscription: l,
            getServerState: n ? () => n : void 0
        }
    }, [i, n]), o = d.useMemo(() => i.getState(), [i]);
    O$(() => {
        const {
            subscription: l
        } = a;
        return l.onStateChange = l.notifyNestedSubs, l.trySubscribe(), o !== i.getState() && l.notifyNestedSubs(), () => {
            l.tryUnsubscribe(), l.onStateChange = void 0
        }
    }, [a, o]);
    const u = r || I$;
    return d.createElement(u.Provider, {
        value: a
    }, t)
}
var k$ = _$,
    C$ = new Set(["axisLine", "tickLine", "activeBar", "activeDot", "activeLabel", "activeShape", "allowEscapeViewBox", "background", "cursor", "dot", "label", "line", "margin", "padding", "position", "shape", "style", "tick", "wrapperStyle", "radius"]);

function T$(e, t) {
    return e == null && t == null ? !0 : typeof e == "number" && typeof t == "number" ? e === t || e !== e && t !== t : e === t
}

function wn(e, t) {
    var r = new Set([...Object.keys(e), ...Object.keys(t)]);
    for (var n of r)
        if (C$.has(n)) {
            if (e[n] == null && t[n] == null) continue;
            if (!A$(e[n], t[n])) return !1
        } else if (!T$(e[n], t[n])) return !1;
    return !0
}
var M$ = ["id"],
    D$ = ["type", "layout", "connectNulls", "needClip", "shape"],
    N$ = ["activeDot", "animateNewValues", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "hide", "isAnimationActive", "label", "legendType", "xAxisId", "yAxisId", "id"];

function Jn() {
    return Jn = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Jn.apply(null, arguments)
}

function Fh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function bt(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Fh(Object(r), !0).forEach(function(n) {
            R$(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Fh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function R$(e, t, r) {
    return (t = $$(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function $$(e) {
    var t = L$(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function L$(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function Js(e, t) {
    if (e == null) return {};
    var r, n, i = B$(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function B$(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var z$ = e => {
        var {
            dataKey: t,
            name: r,
            stroke: n,
            legendType: i,
            hide: a
        } = e;
        return [{
            inactive: a,
            dataKey: t,
            type: i,
            color: n,
            value: st(r, t),
            payload: e
        }]
    },
    K$ = d.memo(e => {
        var {
            dataKey: t,
            data: r,
            stroke: n,
            strokeWidth: i,
            fill: a,
            name: o,
            hide: u,
            unit: l,
            tooltipType: s,
            id: c
        } = e, f = {
            dataDefinedOnItem: r,
            positions: void 0,
            settings: {
                stroke: n,
                strokeWidth: i,
                fill: a,
                dataKey: t,
                nameKey: void 0,
                name: st(o, t),
                hide: u,
                type: s,
                color: n,
                unit: l,
                graphicalItemId: c
            }
        };
        return d.createElement(bn, {
            tooltipEntrySettings: f
        })
    }),
    B0 = (e, t) => "".concat(t, "px ").concat(e - t, "px");

function W$(e, t) {
    for (var r = e.length % 2 !== 0 ? [...e, 0] : e, n = [], i = 0; i < t; ++i) n = [...n, ...r];
    return n
}
var F$ = (e, t, r) => {
    var n = r.reduce((f, v) => f + v);
    if (!n) return B0(t, e);
    for (var i = Math.floor(e / n), a = e % n, o = t - e, u = [], l = 0, s = 0; l < r.length; s += r[l], ++l)
        if (s + r[l] > a) {
            u = [...r.slice(0, l), a - s];
            break
        }
    var c = u.length % 2 === 0 ? [0, o] : [o];
    return [...W$(r, i), ...u, ...c].map(f => "".concat(f, "px")).join(", ")
};

function q$(e) {
    var {
        clipPathId: t,
        points: r,
        props: n
    } = e, {
        dot: i,
        dataKey: a,
        needClip: o
    } = n, {
        id: u
    } = n, l = Js(n, M$), s = re(l);
    return d.createElement(Hs, {
        points: r,
        dot: i,
        className: "recharts-line-dots",
        dotClassName: "recharts-line-dot",
        dataKey: a,
        baseProps: s,
        needClip: o,
        clipPathId: t
    })
}

function U$(e) {
    var {
        showLabels: t,
        children: r,
        points: n
    } = e, i = d.useMemo(() => n ?.map(a => {
        var o, u, l = {
            x: (o = a.x) !== null && o !== void 0 ? o : 0,
            y: (u = a.y) !== null && u !== void 0 ? u : 0,
            width: 0,
            lowerWidth: 0,
            upperWidth: 0,
            height: 0
        };
        return bt(bt({}, l), {}, {
            value: a.value,
            payload: a.payload,
            viewBox: l,
            parentViewBox: void 0,
            fill: void 0
        })
    }), [n]);
    return d.createElement(Pi, {
        value: t ? i : void 0
    }, r)
}

function qh(e) {
    var {
        clipPathId: t,
        pathRef: r,
        points: n,
        strokeDasharray: i,
        props: a
    } = e, {
        type: o,
        layout: u,
        connectNulls: l,
        needClip: s,
        shape: c
    } = a, f = Js(a, D$), v = bt(bt({}, ye(f)), {}, {
        fill: "none",
        className: "recharts-line-curve",
        clipPath: s ? "url(#clipPath-".concat(t, ")") : void 0,
        points: n,
        type: o,
        layout: u,
        connectNulls: l,
        strokeDasharray: i ?? a.strokeDasharray
    });
    return d.createElement(d.Fragment, null, n ?.length > 1 && d.createElement(Yn, Jn({
        shapeType: "curve",
        option: c
    }, v, {
        pathRef: r
    })), d.createElement(q$, {
        points: n,
        clipPathId: t,
        props: a
    }))
}

function H$(e) {
    try {
        return e && e.getTotalLength && e.getTotalLength() || 0
    } catch {
        return 0
    }
}

function G$(e) {
    var {
        clipPathId: t,
        props: r,
        pathRef: n,
        previousPointsRef: i,
        longestAnimatedLengthRef: a
    } = e, {
        points: o,
        strokeDasharray: u,
        isAnimationActive: l,
        animationBegin: s,
        animationDuration: c,
        animationEasing: f,
        animateNewValues: v,
        width: p,
        height: h,
        onAnimationEnd: m,
        onAnimationStart: y
    } = r, g = i.current, b = fr(o, "recharts-line-"), x = d.useRef(b), [P, w] = d.useState(!1), O = !P, S = d.useCallback(() => {
        typeof m == "function" && m(), w(!1)
    }, [m]), E = d.useCallback(() => {
        typeof y == "function" && y(), w(!0)
    }, [y]), _ = H$(n.current), C = d.useRef(0);
    x.current !== b && (C.current = a.current, x.current = b);
    var j = C.current;
    return d.createElement(U$, {
        points: o,
        showLabels: O
    }, r.children, d.createElement(sr, {
        animationId: b,
        begin: s,
        duration: c,
        isActive: l,
        easing: f,
        onAnimationEnd: S,
        onAnimationStart: E,
        key: b
    }, I => {
        var R = F(j, _ + j, I),
            $ = Math.min(R, _),
            B;
        if (l)
            if (u) {
                var q = "".concat(u).split(/[,\s]+/gim).map(L => parseFloat(L));
                B = F$($, _, q)
            } else B = B0(_, $);
        else B = u == null ? void 0 : String(u);
        if (I > 0 && _ > 0 && (i.current = o, a.current = Math.max(a.current, $)), g) {
            var W = g.length / o.length,
                V = I === 1 ? o : o.map((L, Me) => {
                    var Le = Math.floor(Me * W);
                    if (g[Le]) {
                        var De = g[Le];
                        return bt(bt({}, L), {}, {
                            x: F(De.x, L.x, I),
                            y: F(De.y, L.y, I)
                        })
                    }
                    return v ? bt(bt({}, L), {}, {
                        x: F(p * 2, L.x, I),
                        y: F(h / 2, L.y, I)
                    }) : bt(bt({}, L), {}, {
                        x: L.x,
                        y: L.y
                    })
                });
            return i.current = V, d.createElement(qh, {
                props: r,
                points: V,
                clipPathId: t,
                pathRef: n,
                strokeDasharray: B
            })
        }
        return d.createElement(qh, {
            props: r,
            points: o,
            clipPathId: t,
            pathRef: n,
            strokeDasharray: B
        })
    }), d.createElement(mn, {
        label: r.label
    }))
}

function V$(e) {
    var {
        clipPathId: t,
        props: r
    } = e, n = d.useRef(null), i = d.useRef(0), a = d.useRef(null);
    return d.createElement(G$, {
        props: r,
        clipPathId: t,
        previousPointsRef: n,
        longestAnimatedLengthRef: i,
        pathRef: a
    })
}
var Y$ = (e, t) => {
    var r, n;
    return {
        x: (r = e.x) !== null && r !== void 0 ? r : void 0,
        y: (n = e.y) !== null && n !== void 0 ? n : void 0,
        value: e.value,
        errorVal: H(e.payload, t)
    }
};
class X$ extends d.Component {
    render() {
        var {
            hide: t,
            dot: r,
            points: n,
            className: i,
            xAxisId: a,
            yAxisId: o,
            top: u,
            left: l,
            width: s,
            height: c,
            id: f,
            needClip: v,
            zIndex: p
        } = this.props;
        if (t) return null;
        var h = z("recharts-line", i),
            m = f,
            {
                r: y,
                strokeWidth: g
            } = L0(r),
            b = Us(r),
            x = y * 2 + g,
            P = v ? "url(#clipPath-".concat(b ? "" : "dots-").concat(m, ")") : void 0;
        return d.createElement(ge, {
            zIndex: p
        }, d.createElement(G, {
            className: h
        }, v && d.createElement("defs", null, d.createElement(Io, {
            clipPathId: m,
            xAxisId: a,
            yAxisId: o
        }), !b && d.createElement("clipPath", {
            id: "clipPath-dots-".concat(m)
        }, d.createElement("rect", {
            x: l - x / 2,
            y: u - x / 2,
            width: s + x,
            height: c + x
        }))), d.createElement(Zs, {
            xAxisId: a,
            yAxisId: o,
            data: n,
            dataPointFormatter: Y$,
            errorBarOffset: 0
        }, d.createElement(V$, {
            props: this.props,
            clipPathId: m
        }))), d.createElement(Ia, {
            activeDot: this.props.activeDot,
            points: n,
            mainColor: this.props.stroke,
            itemDataKey: this.props.dataKey,
            clipPath: P
        }))
    }
}
var z0 = {
    activeDot: !0,
    animateNewValues: !0,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: "ease",
    connectNulls: !1,
    dot: !0,
    fill: "#fff",
    hide: !1,
    isAnimationActive: "auto",
    label: !1,
    legendType: "line",
    stroke: "#3182bd",
    strokeWidth: 1,
    xAxisId: 0,
    yAxisId: 0,
    zIndex: ie.line,
    type: "linear"
};

function Z$(e) {
    var t = ee(e, z0),
        {
            activeDot: r,
            animateNewValues: n,
            animationBegin: i,
            animationDuration: a,
            animationEasing: o,
            connectNulls: u,
            dot: l,
            hide: s,
            isAnimationActive: c,
            label: f,
            legendType: v,
            xAxisId: p,
            yAxisId: h,
            id: m
        } = t,
        y = Js(t, N$),
        {
            needClip: g
        } = Oi(p, h),
        b = jo(),
        x = cr(),
        P = he(),
        w = M(C => d$(C, p, h, P, m));
    if (x !== "horizontal" && x !== "vertical" || w == null || b == null) return null;
    var {
        height: O,
        width: S,
        x: E,
        y: _
    } = b;
    return d.createElement(X$, Jn({}, y, {
        id: m,
        connectNulls: u,
        dot: l,
        activeDot: r,
        animateNewValues: n,
        animationBegin: i,
        animationDuration: a,
        animationEasing: o,
        isAnimationActive: c,
        hide: s,
        label: f,
        legendType: v,
        xAxisId: p,
        yAxisId: h,
        points: w,
        layout: x,
        height: O,
        width: S,
        left: E,
        top: _,
        needClip: g
    }))
}

function J$(e) {
    var {
        layout: t,
        xAxis: r,
        yAxis: n,
        xAxisTicks: i,
        yAxisTicks: a,
        dataKey: o,
        bandSize: u,
        displayedData: l
    } = e;
    return l.map((s, c) => {
        var f = H(s, o);
        if (t === "horizontal") {
            var v = Xr({
                    axis: r,
                    ticks: i,
                    bandSize: u,
                    entry: s,
                    index: c
                }),
                p = X(f) ? null : n.scale(f);
            return {
                x: v,
                y: p,
                value: f,
                payload: s
            }
        }
        var h = X(f) ? null : r.scale(f),
            m = Xr({
                axis: n,
                ticks: a,
                bandSize: u,
                entry: s,
                index: c
            });
        return h == null || m == null ? null : {
            x: h,
            y: m,
            value: f,
            payload: s
        }
    }).filter(Boolean)
}

function Q$(e) {
    var t = ee(e, z0),
        r = he();
    return d.createElement(xn, {
        id: t.id,
        type: "line"
    }, n => d.createElement(d.Fragment, null, d.createElement(Ao, {
        legendPayload: z$(t)
    }), d.createElement(K$, {
        dataKey: t.dataKey,
        data: t.data,
        stroke: t.stroke,
        strokeWidth: t.strokeWidth,
        fill: t.fill,
        name: t.name,
        hide: t.hide,
        unit: t.unit,
        tooltipType: t.tooltipType,
        id: n
    }), d.createElement(So, {
        type: "line",
        id: n,
        data: t.data,
        xAxisId: t.xAxisId,
        yAxisId: t.yAxisId,
        zAxisId: 0,
        dataKey: t.dataKey,
        hide: t.hide,
        isPanorama: r
    }), d.createElement(Z$, Jn({}, t, {
        id: n
    }))))
}
var eL = d.memo(Q$, wn);
eL.displayName = "Line";

function kt(e, t) {
    var r, n;
    return (r = (n = e.graphicalItems.cartesianItems.find(i => i.id === t)) === null || n === void 0 ? void 0 : n.xAxisId) !== null && r !== void 0 ? r : O0
}

function Ct(e, t) {
    var r, n;
    return (r = (n = e.graphicalItems.cartesianItems.find(i => i.id === t)) === null || n === void 0 ? void 0 : n.yAxisId) !== null && r !== void 0 ? r : O0
}
var K0 = (e, t, r) => ct(e, "xAxis", kt(e, t), r),
    W0 = (e, t, r) => lt(e, "xAxis", kt(e, t), r),
    F0 = (e, t, r) => ct(e, "yAxis", Ct(e, t), r),
    q0 = (e, t, r) => lt(e, "yAxis", Ct(e, t), r),
    tL = A([K, K0, F0, W0, q0], (e, t, r, n, i) => yt(e, "xAxis") ? jt(t, n, !1) : jt(r, i, !1)),
    rL = (e, t) => t,
    U0 = A([cn, rL], (e, t) => e.filter(r => r.type === "area").find(r => r.id === t)),
    H0 = e => {
        var t = K(e),
            r = yt(t, "xAxis");
        return r ? "yAxis" : "xAxis"
    },
    nL = (e, t) => {
        var r = H0(e);
        return r === "yAxis" ? Ct(e, t) : kt(e, t)
    },
    iL = (e, t, r) => wa(e, H0(e), nL(e, t), r),
    aL = A([U0, iL], (e, t) => {
        var r;
        if (!(e == null || t == null)) {
            var {
                stackId: n
            } = e, i = uo(e);
            if (!(n == null || i == null)) {
                var a = (r = t[n]) === null || r === void 0 ? void 0 : r.stackedData,
                    o = a ?.find(u => u.key === i);
                if (o != null) return o.map(u => [u[0], u[1]])
            }
        }
    }),
    oL = A([K, K0, F0, W0, q0, aL, Sg, tL, U0, Gj], (e, t, r, n, i, a, o, u, l, s) => {
        var {
            chartData: c,
            dataStartIndex: f,
            dataEndIndex: v
        } = o;
        if (!(l == null || e !== "horizontal" && e !== "vertical" || t == null || r == null || n == null || i == null || n.length === 0 || i.length === 0 || u == null)) {
            var {
                data: p
            } = l, h;
            if (p && p.length > 0 ? h = p : h = c ?.slice(f, v + 1), h != null) return SL({
                layout: e,
                xAxis: t,
                yAxis: r,
                xAxisTicks: n,
                yAxisTicks: i,
                dataStartIndex: f,
                areaSettings: l,
                stackedData: a,
                displayedData: h,
                chartBaseValue: s,
                bandSize: u
            })
        }
    }),
    uL = ["id"],
    lL = ["activeDot", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "fill", "fillOpacity", "hide", "isAnimationActive", "legendType", "stroke", "xAxisId", "yAxisId"];

function _r() {
    return _r = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, _r.apply(null, arguments)
}

function G0(e, t) {
    if (e == null) return {};
    var r, n, i = cL(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function cL(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function Uh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Gr(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Uh(Object(r), !0).forEach(function(n) {
            sL(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Uh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function sL(e, t, r) {
    return (t = fL(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function fL(e) {
    var t = dL(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function dL(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function Ca(e, t) {
    return e && e !== "none" ? e : t
}
var vL = e => {
        var {
            dataKey: t,
            name: r,
            stroke: n,
            fill: i,
            legendType: a,
            hide: o
        } = e;
        return [{
            inactive: o,
            dataKey: t,
            type: a,
            color: Ca(n, i),
            value: st(r, t),
            payload: e
        }]
    },
    pL = d.memo(e => {
        var {
            dataKey: t,
            data: r,
            stroke: n,
            strokeWidth: i,
            fill: a,
            name: o,
            hide: u,
            unit: l,
            tooltipType: s,
            id: c
        } = e, f = {
            dataDefinedOnItem: r,
            positions: void 0,
            settings: {
                stroke: n,
                strokeWidth: i,
                fill: a,
                dataKey: t,
                nameKey: void 0,
                name: st(o, t),
                hide: u,
                type: s,
                color: Ca(n, a),
                unit: l,
                graphicalItemId: c
            }
        };
        return d.createElement(bn, {
            tooltipEntrySettings: f
        })
    });

function hL(e) {
    var {
        clipPathId: t,
        points: r,
        props: n
    } = e, {
        needClip: i,
        dot: a,
        dataKey: o
    } = n, u = re(n);
    return d.createElement(Hs, {
        points: r,
        dot: a,
        className: "recharts-area-dots",
        dotClassName: "recharts-area-dot",
        dataKey: o,
        baseProps: u,
        needClip: i,
        clipPathId: t
    })
}

function mL(e) {
    var {
        showLabels: t,
        children: r,
        points: n
    } = e, i = n.map(a => {
        var o, u, l = {
            x: (o = a.x) !== null && o !== void 0 ? o : 0,
            y: (u = a.y) !== null && u !== void 0 ? u : 0,
            width: 0,
            lowerWidth: 0,
            upperWidth: 0,
            height: 0
        };
        return Gr(Gr({}, l), {}, {
            value: a.value,
            payload: a.payload,
            parentViewBox: void 0,
            viewBox: l,
            fill: void 0
        })
    });
    return d.createElement(Pi, {
        value: t ? i : void 0
    }, r)
}

function Hh(e) {
    var {
        points: t,
        baseLine: r,
        needClip: n,
        clipPathId: i,
        props: a
    } = e, {
        layout: o,
        type: u,
        stroke: l,
        connectNulls: s,
        isRange: c
    } = a, {
        id: f
    } = a, v = G0(a, uL), p = re(v), h = ye(v);
    return d.createElement(d.Fragment, null, t ?.length > 1 && d.createElement(G, {
        clipPath: n ? "url(#clipPath-".concat(i, ")") : void 0
    }, d.createElement(Er, _r({}, h, {
        id: f,
        points: t,
        connectNulls: s,
        type: u,
        baseLine: r,
        layout: o,
        stroke: "none",
        className: "recharts-area-area"
    })), l !== "none" && d.createElement(Er, _r({}, p, {
        className: "recharts-area-curve",
        layout: o,
        type: u,
        connectNulls: s,
        fill: "none",
        points: t
    })), l !== "none" && c && d.createElement(Er, _r({}, p, {
        className: "recharts-area-curve",
        layout: o,
        type: u,
        connectNulls: s,
        fill: "none",
        points: r
    }))), d.createElement(hL, {
        points: t,
        props: v,
        clipPathId: i
    }))
}

function yL(e) {
    var t, r, {
            alpha: n,
            baseLine: i,
            points: a,
            strokeWidth: o
        } = e,
        u = (t = a[0]) === null || t === void 0 ? void 0 : t.y,
        l = (r = a[a.length - 1]) === null || r === void 0 ? void 0 : r.y;
    if (!ae(u) || !ae(l)) return null;
    var s = n * Math.abs(u - l),
        c = Math.max(...a.map(f => f.x || 0));
    return D(i) ? c = Math.max(i, c) : i && Array.isArray(i) && i.length && (c = Math.max(...i.map(f => f.x || 0), c)), D(c) ? d.createElement("rect", {
        x: 0,
        y: u < l ? u : u - s,
        width: c + (o ? parseInt("".concat(o), 10) : 1),
        height: Math.floor(s)
    }) : null
}

function gL(e) {
    var t, r, {
            alpha: n,
            baseLine: i,
            points: a,
            strokeWidth: o
        } = e,
        u = (t = a[0]) === null || t === void 0 ? void 0 : t.x,
        l = (r = a[a.length - 1]) === null || r === void 0 ? void 0 : r.x;
    if (!ae(u) || !ae(l)) return null;
    var s = n * Math.abs(u - l),
        c = Math.max(...a.map(f => f.y || 0));
    return D(i) ? c = Math.max(i, c) : i && Array.isArray(i) && i.length && (c = Math.max(...i.map(f => f.y || 0), c)), D(c) ? d.createElement("rect", {
        x: u < l ? u : u - s,
        y: 0,
        width: s,
        height: Math.floor(c + (o ? parseInt("".concat(o), 10) : 1))
    }) : null
}

function bL(e) {
    var {
        alpha: t,
        layout: r,
        points: n,
        baseLine: i,
        strokeWidth: a
    } = e;
    return r === "vertical" ? d.createElement(yL, {
        alpha: t,
        points: n,
        baseLine: i,
        strokeWidth: a
    }) : d.createElement(gL, {
        alpha: t,
        points: n,
        baseLine: i,
        strokeWidth: a
    })
}

function xL(e) {
    var {
        needClip: t,
        clipPathId: r,
        props: n,
        previousPointsRef: i,
        previousBaselineRef: a
    } = e, {
        points: o,
        baseLine: u,
        isAnimationActive: l,
        animationBegin: s,
        animationDuration: c,
        animationEasing: f,
        onAnimationStart: v,
        onAnimationEnd: p
    } = n, h = d.useMemo(() => ({
        points: o,
        baseLine: u
    }), [o, u]), m = fr(h, "recharts-area-"), y = xA(), [g, b] = d.useState(!1), x = !g, P = d.useCallback(() => {
        typeof p == "function" && p(), b(!1)
    }, [p]), w = d.useCallback(() => {
        typeof v == "function" && v(), b(!0)
    }, [v]);
    if (y == null) return null;
    var O = i.current,
        S = a.current;
    return d.createElement(mL, {
        showLabels: x,
        points: o
    }, n.children, d.createElement(sr, {
        animationId: m,
        begin: s,
        duration: c,
        isActive: l,
        easing: f,
        onAnimationEnd: P,
        onAnimationStart: w,
        key: m
    }, E => {
        if (O) {
            var _ = O.length / o.length,
                C = E === 1 ? o : o.map((I, R) => {
                    var $ = Math.floor(R * _);
                    if (O[$]) {
                        var B = O[$];
                        return Gr(Gr({}, I), {}, {
                            x: F(B.x, I.x, E),
                            y: F(B.y, I.y, E)
                        })
                    }
                    return I
                }),
                j;
            return D(u) ? j = F(S, u, E) : X(u) || at(u) ? j = F(S, 0, E) : j = u.map((I, R) => {
                var $ = Math.floor(R * _);
                if (Array.isArray(S) && S[$]) {
                    var B = S[$];
                    return Gr(Gr({}, I), {}, {
                        x: F(B.x, I.x, E),
                        y: F(B.y, I.y, E)
                    })
                }
                return I
            }), E > 0 && (i.current = C, a.current = j), d.createElement(Hh, {
                points: C,
                baseLine: j,
                needClip: t,
                clipPathId: r,
                props: n
            })
        }
        return E > 0 && (i.current = o, a.current = u), d.createElement(G, null, l && d.createElement("defs", null, d.createElement("clipPath", {
            id: "animationClipPath-".concat(r)
        }, d.createElement(bL, {
            alpha: E,
            points: o,
            baseLine: u,
            layout: y,
            strokeWidth: n.strokeWidth
        }))), d.createElement(G, {
            clipPath: "url(#animationClipPath-".concat(r, ")")
        }, d.createElement(Hh, {
            points: o,
            baseLine: u,
            needClip: t,
            clipPathId: r,
            props: n
        })))
    }), d.createElement(mn, {
        label: n.label
    }))
}

function wL(e) {
    var {
        needClip: t,
        clipPathId: r,
        props: n
    } = e, i = d.useRef(null), a = d.useRef();
    return d.createElement(xL, {
        needClip: t,
        clipPathId: r,
        props: n,
        previousPointsRef: i,
        previousBaselineRef: a
    })
}
class PL extends d.PureComponent {
    render() {
        var {
            hide: t,
            dot: r,
            points: n,
            className: i,
            top: a,
            left: o,
            needClip: u,
            xAxisId: l,
            yAxisId: s,
            width: c,
            height: f,
            id: v,
            baseLine: p,
            zIndex: h
        } = this.props;
        if (t) return null;
        var m = z("recharts-area", i),
            y = v,
            {
                r: g,
                strokeWidth: b
            } = L0(r),
            x = Us(r),
            P = g * 2 + b,
            w = u ? "url(#clipPath-".concat(x ? "" : "dots-").concat(y, ")") : void 0;
        return d.createElement(ge, {
            zIndex: h
        }, d.createElement(G, {
            className: m
        }, u && d.createElement("defs", null, d.createElement(Io, {
            clipPathId: y,
            xAxisId: l,
            yAxisId: s
        }), !x && d.createElement("clipPath", {
            id: "clipPath-dots-".concat(y)
        }, d.createElement("rect", {
            x: o - P / 2,
            y: a - P / 2,
            width: c + P,
            height: f + P
        }))), d.createElement(wL, {
            needClip: u,
            clipPathId: y,
            props: this.props
        })), d.createElement(Ia, {
            points: n,
            mainColor: Ca(this.props.stroke, this.props.fill),
            itemDataKey: this.props.dataKey,
            activeDot: this.props.activeDot,
            clipPath: w
        }), this.props.isRange && Array.isArray(p) && d.createElement(Ia, {
            points: p,
            mainColor: Ca(this.props.stroke, this.props.fill),
            itemDataKey: this.props.dataKey,
            activeDot: this.props.activeDot,
            clipPath: w
        }))
    }
}
var V0 = {
    activeDot: !0,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: "ease",
    connectNulls: !1,
    dot: !1,
    fill: "#3182bd",
    fillOpacity: .6,
    hide: !1,
    isAnimationActive: "auto",
    legendType: "line",
    stroke: "#3182bd",
    strokeWidth: 1,
    type: "linear",
    label: !1,
    xAxisId: 0,
    yAxisId: 0,
    zIndex: ie.area
};

function OL(e) {
    var t, r = ee(e, V0),
        {
            activeDot: n,
            animationBegin: i,
            animationDuration: a,
            animationEasing: o,
            connectNulls: u,
            dot: l,
            fill: s,
            fillOpacity: c,
            hide: f,
            isAnimationActive: v,
            legendType: p,
            stroke: h,
            xAxisId: m,
            yAxisId: y
        } = r,
        g = G0(r, lL),
        b = cr(),
        x = Kb(),
        {
            needClip: P
        } = Oi(m, y),
        w = he(),
        {
            points: O,
            isRange: S,
            baseLine: E
        } = (t = M($ => oL($, e.id, w))) !== null && t !== void 0 ? t : {},
        _ = jo();
    if (b !== "horizontal" && b !== "vertical" || _ == null || x !== "AreaChart" && x !== "ComposedChart") return null;
    var {
        height: C,
        width: j,
        x: I,
        y: R
    } = _;
    return !O || !O.length ? null : d.createElement(PL, _r({}, g, {
        activeDot: n,
        animationBegin: i,
        animationDuration: a,
        animationEasing: o,
        baseLine: E,
        connectNulls: u,
        dot: l,
        fill: s,
        fillOpacity: c,
        height: C,
        hide: f,
        layout: b,
        isAnimationActive: v === "auto" ? !ai.isSsr : v,
        isRange: S,
        legendType: p,
        needClip: P,
        points: O,
        stroke: h,
        width: j,
        left: I,
        top: R,
        xAxisId: m,
        yAxisId: y
    }))
}
var AL = (e, t, r, n, i) => {
    var a = r ?? t;
    if (D(a)) return a;
    var o = e === "horizontal" ? i : n,
        u = o.scale.domain();
    if (o.type === "number") {
        var l = Math.max(u[0], u[1]),
            s = Math.min(u[0], u[1]);
        return a === "dataMin" ? s : a === "dataMax" || l < 0 ? l : Math.max(Math.min(u[0], u[1]), 0)
    }
    return a === "dataMin" ? u[0] : a === "dataMax" ? u[1] : u[0]
};

function SL(e) {
    var {
        areaSettings: {
            connectNulls: t,
            baseValue: r,
            dataKey: n
        },
        stackedData: i,
        layout: a,
        chartBaseValue: o,
        xAxis: u,
        yAxis: l,
        displayedData: s,
        dataStartIndex: c,
        xAxisTicks: f,
        yAxisTicks: v,
        bandSize: p
    } = e, h = i && i.length, m = AL(a, o, r, u, l), y = a === "horizontal", g = !1, b = s.map((P, w) => {
        var O, S, E;
        if (h) E = i[c + w];
        else {
            var _ = H(P, n);
            Array.isArray(_) ? (E = _, g = !0) : E = [m, _]
        }
        var C = (O = (S = E) === null || S === void 0 ? void 0 : S[1]) !== null && O !== void 0 ? O : null,
            j = C == null || h && !t && H(P, n) == null;
        return y ? {
            x: Xr({
                axis: u,
                ticks: f,
                bandSize: p,
                entry: P,
                index: w
            }),
            y: j ? null : l.scale(C),
            value: E,
            payload: P
        } : {
            x: j ? null : u.scale(C),
            y: Xr({
                axis: l,
                ticks: v,
                bandSize: p,
                entry: P,
                index: w
            }),
            value: E,
            payload: P
        }
    }), x;
    return h || g ? x = b.map(P => {
        var w = Array.isArray(P.value) ? P.value[0] : null;
        return y ? {
            x: P.x,
            y: w != null && P.y != null ? l.scale(w) : null,
            payload: P.payload
        } : {
            x: w != null ? u.scale(w) : null,
            y: P.y,
            payload: P.payload
        }
    }) : x = y ? l.scale(m) : u.scale(m), {
        points: b,
        baseLine: x,
        isRange: g
    }
}

function EL(e) {
    var t = ee(e, V0),
        r = he();
    return d.createElement(xn, {
        id: t.id,
        type: "area"
    }, n => d.createElement(d.Fragment, null, d.createElement(Ao, {
        legendPayload: vL(t)
    }), d.createElement(pL, {
        dataKey: t.dataKey,
        data: t.data,
        stroke: t.stroke,
        strokeWidth: t.strokeWidth,
        fill: t.fill,
        name: t.name,
        hide: t.hide,
        unit: t.unit,
        tooltipType: t.tooltipType,
        id: n
    }), d.createElement(So, {
        type: "area",
        id: n,
        data: t.data,
        dataKey: t.dataKey,
        xAxisId: t.xAxisId,
        yAxisId: t.yAxisId,
        zAxisId: 0,
        stackId: Py(t.stackId),
        hide: t.hide,
        barSize: void 0,
        baseValue: t.baseValue,
        isPanorama: r,
        connectNulls: t.connectNulls
    }), d.createElement(OL, _r({}, t, {
        id: n
    }))))
}
var jL = d.memo(EL, wn);
jL.displayName = "Area";
var IL = "Invariant failed";

function _L(e, t) {
    throw new Error(IL)
}

function ec() {
    return ec = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, ec.apply(null, arguments)
}

function Ta(e) {
    return d.createElement(Yn, ec({
        shapeType: "rectangle",
        activeClassName: "recharts-active-bar"
    }, e))
}
var kL = function(t) {
        var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        return (n, i) => {
            if (D(t)) return t;
            var a = D(n) || X(n);
            return a ? t(n, i) : (a || _L(), r)
        }
    },
    CL = (e, t, r) => r,
    TL = (e, t) => t,
    Ai = A([cn, TL], (e, t) => e.filter(r => r.type === "bar").find(r => r.id === t)),
    ML = A([Ai], e => e ?.maxBarSize),
    DL = (e, t, r, n) => n,
    NL = A([K, cn, kt, Ct, CL], (e, t, r, n, i) => t.filter(a => e === "horizontal" ? a.xAxisId === r : a.yAxisId === n).filter(a => a.isPanorama === i).filter(a => a.hide === !1).filter(a => a.type === "bar")),
    RL = (e, t, r) => {
        var n = K(e),
            i = kt(e, t),
            a = Ct(e, t);
        if (!(i == null || a == null)) return n === "horizontal" ? wa(e, "yAxis", a, r) : wa(e, "xAxis", i, r)
    },
    $L = (e, t) => {
        var r = K(e),
            n = kt(e, t),
            i = Ct(e, t);
        if (!(n == null || i == null)) return r === "horizontal" ? vp(e, "xAxis", n) : vp(e, "yAxis", i)
    },
    LL = A([NL, Hj, $L], XN),
    BL = (e, t, r) => {
        var n, i, a = Ai(e, t);
        if (a != null) {
            var o = kt(e, t),
                u = Ct(e, t);
            if (!(o == null || u == null)) {
                var l = K(e),
                    s = zg(e),
                    {
                        maxBarSize: c
                    } = a,
                    f = X(c) ? s : c,
                    v, p;
                return l === "horizontal" ? (v = ct(e, "xAxis", o, r), p = lt(e, "xAxis", o, r)) : (v = ct(e, "yAxis", u, r), p = lt(e, "yAxis", u, r)), (n = (i = jt(v, p, !0)) !== null && i !== void 0 ? i : f) !== null && n !== void 0 ? n : 0
            }
        }
    },
    Y0 = (e, t, r) => {
        var n = K(e),
            i = kt(e, t),
            a = Ct(e, t);
        if (!(i == null || a == null)) {
            var o, u;
            return n === "horizontal" ? (o = ct(e, "xAxis", i, r), u = lt(e, "xAxis", i, r)) : (o = ct(e, "yAxis", a, r), u = lt(e, "yAxis", a, r)), jt(o, u)
        }
    },
    zL = A([LL, zg, Uj, Kg, BL, Y0, ML], tR),
    KL = (e, t, r) => {
        var n = kt(e, t);
        if (n != null) return ct(e, "xAxis", n, r)
    },
    WL = (e, t, r) => {
        var n = Ct(e, t);
        if (n != null) return ct(e, "yAxis", n, r)
    },
    FL = (e, t, r) => {
        var n = kt(e, t);
        if (n != null) return lt(e, "xAxis", n, r)
    },
    qL = (e, t, r) => {
        var n = Ct(e, t);
        if (n != null) return lt(e, "yAxis", n, r)
    },
    UL = A([zL, Ai], (e, t) => {
        if (!(e == null || t == null)) {
            var r = e.find(n => n.stackId === t.stackId && t.dataKey != null && n.dataKeys.includes(t.dataKey));
            if (r != null) return r.position
        }
    }),
    HL = A([RL, Ai], rR),
    GL = A([Pe, _c, KL, WL, FL, qL, UL, K, Sg, Y0, HL, Ai, DL], (e, t, r, n, i, a, o, u, l, s, c, f, v) => {
        var {
            chartData: p,
            dataStartIndex: h,
            dataEndIndex: m
        } = l;
        if (!(f == null || o == null || t == null || u !== "horizontal" && u !== "vertical" || r == null || n == null || i == null || a == null || s == null)) {
            var {
                data: y
            } = f, g;
            if (y != null && y.length > 0 ? g = y : g = p ?.slice(h, m + 1), g != null) return P2({
                layout: u,
                barSettings: f,
                pos: o,
                parentViewBox: t,
                bandSize: s,
                xAxis: r,
                yAxis: n,
                xAxisTicks: i,
                yAxisTicks: a,
                stackedData: c,
                displayedData: g,
                offset: e,
                cells: v,
                dataStartIndex: h
            })
        }
    }),
    VL = ["index"];

function tc() {
    return tc = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, tc.apply(null, arguments)
}

function YL(e, t) {
    if (e == null) return {};
    var r, n, i = XL(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function XL(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var X0 = d.createContext(void 0),
    ZL = e => {
        var t = d.useContext(X0);
        if (t != null) return t.stackId;
        if (e != null) return Py(e)
    },
    JL = (e, t) => "recharts-bar-stack-clip-path-".concat(e, "-").concat(t),
    QL = e => {
        var t = d.useContext(X0);
        if (t != null) {
            var {
                stackId: r
            } = t;
            return "url(#".concat(JL(r, e), ")")
        }
    },
    e2 = e => {
        var {
            index: t
        } = e, r = YL(e, VL), n = QL(t);
        return d.createElement(G, tc({
            className: "recharts-bar-stack-layer",
            clipPath: n
        }, r))
    },
    t2 = ["onMouseEnter", "onMouseLeave", "onClick"],
    r2 = ["value", "background", "tooltipPosition"],
    n2 = ["id"],
    i2 = ["onMouseEnter", "onClick", "onMouseLeave"];

function Gt() {
    return Gt = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Gt.apply(null, arguments)
}

function Gh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function Be(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Gh(Object(r), !0).forEach(function(n) {
            a2(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Gh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function a2(e, t, r) {
    return (t = o2(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function o2(e) {
    var t = u2(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function u2(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function Ma(e, t) {
    if (e == null) return {};
    var r, n, i = l2(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function l2(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var c2 = e => {
        var {
            dataKey: t,
            name: r,
            fill: n,
            legendType: i,
            hide: a
        } = e;
        return [{
            inactive: a,
            dataKey: t,
            type: i,
            color: n,
            value: st(r, t),
            payload: e
        }]
    },
    s2 = d.memo(e => {
        var {
            dataKey: t,
            stroke: r,
            strokeWidth: n,
            fill: i,
            name: a,
            hide: o,
            unit: u,
            tooltipType: l,
            id: s
        } = e, c = {
            dataDefinedOnItem: void 0,
            positions: void 0,
            settings: {
                stroke: r,
                strokeWidth: n,
                fill: i,
                dataKey: t,
                nameKey: void 0,
                name: st(a, t),
                hide: o,
                type: l,
                color: i,
                unit: u,
                graphicalItemId: s
            }
        };
        return d.createElement(bn, {
            tooltipEntrySettings: c
        })
    });

function f2(e) {
    var t = M(Ht),
        {
            data: r,
            dataKey: n,
            background: i,
            allOtherBarProps: a
        } = e,
        {
            onMouseEnter: o,
            onMouseLeave: u,
            onClick: l
        } = a,
        s = Ma(a, t2),
        c = wo(o, n, a.id),
        f = Po(u),
        v = Oo(l, n, a.id);
    if (!i || r == null) return null;
    var p = At(i);
    return d.createElement(ge, {
        zIndex: nR(i, ie.barBackground)
    }, r.map((h, m) => {
        var {
            value: y,
            background: g,
            tooltipPosition: b
        } = h, x = Ma(h, r2);
        if (!g) return null;
        var P = c(h, m),
            w = f(h, m),
            O = v(h, m),
            S = Be(Be(Be(Be(Be({
                option: i,
                isActive: String(m) === t
            }, x), {}, {
                fill: "#eee"
            }, g), p), lr(s, h, m)), {}, {
                onMouseEnter: P,
                onMouseLeave: w,
                onClick: O,
                dataKey: n,
                index: m,
                className: "recharts-bar-background-rectangle"
            });
        return d.createElement(Ta, Gt({
            key: "background-bar-".concat(m)
        }, S))
    }))
}

function d2(e) {
    var {
        showLabels: t,
        children: r,
        rects: n
    } = e, i = n ?.map(a => {
        var o = {
            x: a.x,
            y: a.y,
            width: a.width,
            lowerWidth: a.width,
            upperWidth: a.width,
            height: a.height
        };
        return Be(Be({}, o), {}, {
            value: a.value,
            payload: a.payload,
            parentViewBox: a.parentViewBox,
            viewBox: o,
            fill: a.fill
        })
    });
    return d.createElement(Pi, {
        value: t ? i : void 0
    }, r)
}

function v2(e) {
    var {
        shape: t,
        activeBar: r,
        baseProps: n,
        entry: i,
        index: a,
        dataKey: o
    } = e, u = M(Ht), l = M(Ms), s = r && String(a) === u && (l == null || o === l), c = s ? r : t;
    return s ? d.createElement(ge, {
        zIndex: ie.activeBar
    }, d.createElement(Ta, Gt({}, n, {
        name: String(n.name)
    }, i, {
        isActive: s,
        option: c,
        index: a,
        dataKey: o
    }))) : d.createElement(Ta, Gt({}, n, {
        name: String(n.name)
    }, i, {
        isActive: s,
        option: c,
        index: a,
        dataKey: o
    }))
}

function p2(e) {
    var {
        shape: t,
        baseProps: r,
        entry: n,
        index: i,
        dataKey: a
    } = e;
    return d.createElement(Ta, Gt({}, r, {
        name: String(r.name)
    }, n, {
        isActive: !1,
        option: t,
        index: i,
        dataKey: a
    }))
}

function h2(e) {
    var t, {
            data: r,
            props: n
        } = e,
        i = (t = re(n)) !== null && t !== void 0 ? t : {},
        {
            id: a
        } = i,
        o = Ma(i, n2),
        {
            shape: u,
            dataKey: l,
            activeBar: s
        } = n,
        {
            onMouseEnter: c,
            onClick: f,
            onMouseLeave: v
        } = n,
        p = Ma(n, i2),
        h = wo(c, l, a),
        m = Po(v),
        y = Oo(f, l, a);
    return r ? d.createElement(d.Fragment, null, r.map((g, b) => d.createElement(e2, Gt({
        index: b,
        key: "rectangle-".concat(g ?.x, "-").concat(g ?.y, "-").concat(g ?.value, "-").concat(b),
        className: "recharts-bar-rectangle"
    }, lr(p, g, b), {
        onMouseEnter: h(g, b),
        onMouseLeave: m(g, b),
        onClick: y(g, b)
    }), s ? d.createElement(v2, {
        shape: u,
        activeBar: s,
        baseProps: o,
        entry: g,
        index: b,
        dataKey: l
    }) : d.createElement(p2, {
        shape: u,
        baseProps: o,
        entry: g,
        index: b,
        dataKey: l
    })))) : null
}

function m2(e) {
    var {
        props: t,
        previousRectanglesRef: r
    } = e, {
        data: n,
        layout: i,
        isAnimationActive: a,
        animationBegin: o,
        animationDuration: u,
        animationEasing: l,
        onAnimationEnd: s,
        onAnimationStart: c
    } = t, f = r.current, v = fr(t, "recharts-bar-"), [p, h] = d.useState(!1), m = !p, y = d.useCallback(() => {
        typeof s == "function" && s(), h(!1)
    }, [s]), g = d.useCallback(() => {
        typeof c == "function" && c(), h(!0)
    }, [c]);
    return d.createElement(d2, {
        showLabels: m,
        rects: n
    }, d.createElement(sr, {
        animationId: v,
        begin: o,
        duration: u,
        isActive: a,
        easing: l,
        onAnimationEnd: y,
        onAnimationStart: g,
        key: v
    }, b => {
        var x = b === 1 ? n : n ?.map((P, w) => {
            var O = f && f[w];
            if (O) return Be(Be({}, P), {}, {
                x: F(O.x, P.x, b),
                y: F(O.y, P.y, b),
                width: F(O.width, P.width, b),
                height: F(O.height, P.height, b)
            });
            if (i === "horizontal") {
                var S = F(0, P.height, b),
                    E = F(P.stackedBarStart, P.y, b);
                return Be(Be({}, P), {}, {
                    y: E,
                    height: S
                })
            }
            var _ = F(0, P.width, b),
                C = F(P.stackedBarStart, P.x, b);
            return Be(Be({}, P), {}, {
                width: _,
                x: C
            })
        });
        return b > 0 && (r.current = x ?? null), x == null ? null : d.createElement(G, null, d.createElement(h2, {
            props: t,
            data: x
        }))
    }), d.createElement(mn, {
        label: t.label
    }), t.children)
}

function y2(e) {
    var t = d.useRef(null);
    return d.createElement(m2, {
        previousRectanglesRef: t,
        props: e
    })
}
var Z0 = 0,
    g2 = (e, t) => {
        var r = Array.isArray(e.value) ? e.value[1] : e.value;
        return {
            x: e.x,
            y: e.y,
            value: r,
            errorVal: H(e, t)
        }
    };
class b2 extends d.PureComponent {
    render() {
        var {
            hide: t,
            data: r,
            dataKey: n,
            className: i,
            xAxisId: a,
            yAxisId: o,
            needClip: u,
            background: l,
            id: s
        } = this.props;
        if (t || r == null) return null;
        var c = z("recharts-bar", i),
            f = s;
        return d.createElement(G, {
            className: c,
            id: s
        }, u && d.createElement("defs", null, d.createElement(Io, {
            clipPathId: f,
            xAxisId: a,
            yAxisId: o
        })), d.createElement(G, {
            className: "recharts-bar-rectangles",
            clipPath: u ? "url(#clipPath-".concat(f, ")") : void 0
        }, d.createElement(f2, {
            data: r,
            dataKey: n,
            background: l,
            allOtherBarProps: this.props
        }), d.createElement(y2, this.props)))
    }
}
var x2 = {
    activeBar: !1,
    animationBegin: 0,
    animationDuration: 400,
    animationEasing: "ease",
    background: !1,
    hide: !1,
    isAnimationActive: "auto",
    label: !1,
    legendType: "rect",
    minPointSize: Z0,
    xAxisId: 0,
    yAxisId: 0,
    zIndex: ie.bar
};

function w2(e) {
    var {
        xAxisId: t,
        yAxisId: r,
        hide: n,
        legendType: i,
        minPointSize: a,
        activeBar: o,
        animationBegin: u,
        animationDuration: l,
        animationEasing: s,
        isAnimationActive: c
    } = e, {
        needClip: f
    } = Oi(t, r), v = cr(), p = he(), h = xo(e.children, wi), m = M(b => GL(b, e.id, p, h));
    if (v !== "vertical" && v !== "horizontal") return null;
    var y, g = m ?.[0];
    return g == null || g.height == null || g.width == null ? y = 0 : y = v === "vertical" ? g.height / 2 : g.width / 2, d.createElement(Zs, {
        xAxisId: t,
        yAxisId: r,
        data: m,
        dataPointFormatter: g2,
        errorBarOffset: y
    }, d.createElement(b2, Gt({}, e, {
        layout: v,
        needClip: f,
        data: m,
        xAxisId: t,
        yAxisId: r,
        hide: n,
        legendType: i,
        minPointSize: a,
        activeBar: o,
        animationBegin: u,
        animationDuration: l,
        animationEasing: s,
        isAnimationActive: c
    })))
}

function P2(e) {
    var {
        layout: t,
        barSettings: {
            dataKey: r,
            minPointSize: n
        },
        pos: i,
        bandSize: a,
        xAxis: o,
        yAxis: u,
        xAxisTicks: l,
        yAxisTicks: s,
        stackedData: c,
        displayedData: f,
        offset: v,
        cells: p,
        parentViewBox: h,
        dataStartIndex: m
    } = e, y = t === "horizontal" ? u : o, g = c ? y.scale.domain() : null, b = LO({
        numericAxis: y
    }), x = y.scale(b);
    return f.map((P, w) => {
        var O, S, E, _, C, j;
        if (c) {
            var I = c[w + m];
            if (I == null) return null;
            O = MO(I, g)
        } else O = H(P, r), Array.isArray(O) || (O = [b, O]);
        var R = kL(n, Z0)(O[1], w);
        if (t === "horizontal") {
            var $, [B, q] = [u.scale(O[0]), u.scale(O[1])];
            S = Od({
                axis: o,
                ticks: l,
                bandSize: a,
                offset: i.offset,
                entry: P,
                index: w
            }), E = ($ = q ?? B) !== null && $ !== void 0 ? $ : void 0, _ = i.size;
            var W = B - q;
            if (C = at(W) ? 0 : W, j = {
                    x: S,
                    y: v.top,
                    width: _,
                    height: v.height
                }, Math.abs(R) > 0 && Math.abs(C) < Math.abs(R)) {
                var V = _e(C || R) * (Math.abs(R) - Math.abs(C));
                E -= V, C += V
            }
        } else {
            var [L, Me] = [o.scale(O[0]), o.scale(O[1])];
            if (S = L, E = Od({
                    axis: u,
                    ticks: s,
                    bandSize: a,
                    offset: i.offset,
                    entry: P,
                    index: w
                }), _ = Me - L, C = i.size, j = {
                    x: v.left,
                    y: E,
                    width: v.width,
                    height: C
                }, Math.abs(R) > 0 && Math.abs(_) < Math.abs(R)) {
                var Le = _e(_ || R) * (Math.abs(R) - Math.abs(_));
                _ += Le
            }
        }
        if (S == null || E == null || _ == null || C == null) return null;
        var De = Be(Be({}, P), {}, {
            stackedBarStart: x,
            x: S,
            y: E,
            width: _,
            height: C,
            value: c ? O : O[1],
            payload: P,
            background: j,
            tooltipPosition: {
                x: S + _ / 2,
                y: E + C / 2
            },
            parentViewBox: h
        }, p && p[w] && p[w].props);
        return De
    }).filter(Boolean)
}

function O2(e) {
    var t = ee(e, x2),
        r = ZL(t.stackId),
        n = he();
    return d.createElement(xn, {
        id: t.id,
        type: "bar"
    }, i => d.createElement(d.Fragment, null, d.createElement(Ao, {
        legendPayload: c2(t)
    }), d.createElement(s2, {
        dataKey: t.dataKey,
        stroke: t.stroke,
        strokeWidth: t.strokeWidth,
        fill: t.fill,
        name: t.name,
        hide: t.hide,
        unit: t.unit,
        tooltipType: t.tooltipType,
        id: i
    }), d.createElement(So, {
        type: "bar",
        id: i,
        data: void 0,
        xAxisId: t.xAxisId,
        yAxisId: t.yAxisId,
        zAxisId: 0,
        dataKey: t.dataKey,
        stackId: r,
        hide: t.hide,
        barSize: t.barSize,
        minPointSize: t.minPointSize,
        maxBarSize: t.maxBarSize,
        isPanorama: n
    }), d.createElement(ge, {
        zIndex: t.zIndex
    }, d.createElement(w2, Gt({}, t, {
        id: i
    })))))
}
var A2 = d.memo(O2, wn);
A2.displayName = "Bar";
var S2 = ["option", "isActive"];

function Nn() {
    return Nn = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Nn.apply(null, arguments)
}

function E2(e, t) {
    if (e == null) return {};
    var r, n, i = j2(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function j2(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function I2(e) {
    var {
        option: t,
        isActive: r
    } = e, n = E2(e, S2);
    return typeof t == "string" ? d.createElement(Yn, Nn({
        option: d.createElement(Ba, Nn({
            type: t
        }, n)),
        isActive: r,
        shapeType: "symbols"
    }, n)) : d.createElement(Yn, Nn({
        option: t,
        isActive: r,
        shapeType: "symbols"
    }, n))
}
var _2 = (e, t, r, n, i, a, o) => ct(e, "xAxis", t, o),
    k2 = (e, t, r, n, i, a, o) => lt(e, "xAxis", t, o),
    C2 = (e, t, r, n, i, a, o) => ct(e, "yAxis", r, o),
    T2 = (e, t, r, n, i, a, o) => lt(e, "yAxis", r, o),
    M2 = (e, t, r, n) => YI(e, "zAxis", n, !1),
    D2 = (e, t, r, n, i) => i,
    N2 = (e, t, r, n, i, a) => a,
    R2 = (e, t, r, n, i, a, o) => io(e, void 0, void 0, o),
    $2 = A([cn, D2], (e, t) => e.filter(r => r.type === "scatter").find(r => r.id === t)),
    L2 = A([R2, _2, k2, C2, T2, M2, $2, N2], (e, t, r, n, i, a, o, u) => {
        var {
            chartData: l,
            dataStartIndex: s,
            dataEndIndex: c
        } = e;
        if (o != null) {
            var f;
            if (o ?.data != null && o.data.length > 0 ? f = o.data : f = l ?.slice(s, c + 1), !(f == null || t == null || n == null || r == null || i == null || r ?.length === 0 || i ?.length === 0)) return J2({
                displayedData: f,
                xAxis: t,
                yAxis: n,
                zAxis: a,
                scatterSettings: o,
                xAxisTicks: r,
                yAxisTicks: i,
                cells: u
            })
        }
    }),
    B2 = ["id"],
    z2 = ["onMouseEnter", "onClick", "onMouseLeave"],
    K2 = ["animationBegin", "animationDuration", "animationEasing", "hide", "isAnimationActive", "legendType", "lineJointType", "lineType", "shape", "xAxisId", "yAxisId", "zAxisId"];

function rc(e, t) {
    if (e == null) return {};
    var r, n, i = W2(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function W2(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function $r() {
    return $r = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, $r.apply(null, arguments)
}

function Vh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function He(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Vh(Object(r), !0).forEach(function(n) {
            F2(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Vh(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function F2(e, t, r) {
    return (t = q2(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function q2(e) {
    var t = U2(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function U2(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var H2 = e => {
        var {
            dataKey: t,
            name: r,
            fill: n,
            legendType: i,
            hide: a
        } = e;
        return [{
            inactive: a,
            dataKey: t,
            type: i,
            color: n,
            value: st(r, t),
            payload: e
        }]
    },
    G2 = d.memo(e => {
        var {
            dataKey: t,
            points: r,
            stroke: n,
            strokeWidth: i,
            fill: a,
            name: o,
            hide: u,
            tooltipType: l,
            id: s
        } = e, c = {
            dataDefinedOnItem: r ?.map(f => f.tooltipPayload),
            positions: r ?.map(f => f.tooltipPosition),
            settings: {
                stroke: n,
                strokeWidth: i,
                fill: a,
                nameKey: void 0,
                dataKey: t,
                name: st(o, t),
                hide: u,
                type: l,
                color: a,
                unit: "",
                graphicalItemId: s
            }
        };
        return d.createElement(bn, {
            tooltipEntrySettings: c
        })
    });

function V2(e) {
    var {
        points: t,
        props: r
    } = e, {
        line: n,
        lineType: i,
        lineJointType: a
    } = r;
    if (!n) return null;
    var o = re(r),
        u = At(n),
        l, s;
    if (i === "joint") l = t.map(y => {
        var g, b;
        return {
            x: (g = y.cx) !== null && g !== void 0 ? g : null,
            y: (b = y.cy) !== null && b !== void 0 ? b : null
        }
    });
    else if (i === "fitting") {
        var {
            xmin: c,
            xmax: f,
            a: v,
            b: p
        } = vw(t), h = y => v * y + p;
        l = [{
            x: c,
            y: h(c)
        }, {
            x: f,
            y: h(f)
        }]
    }
    var m = He(He(He({}, o), {}, {
        fill: "none",
        stroke: o && o.fill
    }, u), {}, {
        points: l
    });
    return d.isValidElement(n) ? s = d.cloneElement(n, m) : typeof n == "function" ? s = n(m) : s = d.createElement(Er, $r({}, m, {
        type: a
    })), d.createElement(G, {
        className: "recharts-scatter-line",
        key: "recharts-scatter-line"
    }, s)
}

function Y2(e) {
    var {
        showLabels: t,
        points: r,
        children: n
    } = e, i = ii(), a = d.useMemo(() => r ?.map(o => {
        var u, l, s = {
            x: (u = o.x) !== null && u !== void 0 ? u : 0,
            y: (l = o.y) !== null && l !== void 0 ? l : 0,
            width: o.width,
            height: o.height,
            lowerWidth: o.width,
            upperWidth: o.width
        };
        return He(He({}, s), {}, {
            value: void 0,
            payload: o.payload,
            viewBox: s,
            parentViewBox: i,
            fill: void 0
        })
    }), [i, r]);
    return d.createElement(Pi, {
        value: t ? a : void 0
    }, n)
}

function X2(e) {
    var {
        points: t,
        allOtherScatterProps: r
    } = e, {
        shape: n,
        activeShape: i,
        dataKey: a
    } = r, {
        id: o
    } = r, u = rc(r, B2), l = M(Ht), {
        onMouseEnter: s,
        onClick: c,
        onMouseLeave: f
    } = r, v = rc(r, z2), p = wo(s, a, o), h = Po(f), m = Oo(c, a, o);
    if (!Ew(t)) return null;
    var y = re(u);
    return d.createElement(d.Fragment, null, d.createElement(V2, {
        points: t,
        props: u
    }), t.map((g, b) => {
        var x = i != null && i !== !1,
            P = x && l === String(b),
            w = x && P ? i : n,
            O = He(He(He({}, y), g), {}, {
                [jc]: b,
                [Ic]: String(o)
            });
        return d.createElement(ge, {
            key: "symbol-".concat(g ?.cx, "-").concat(g ?.cy, "-").concat(g ?.size, "-").concat(b),
            zIndex: P ? ie.activeDot : void 0
        }, d.createElement(G, $r({
            className: "recharts-scatter-symbol"
        }, lr(v, g, b), {
            onMouseEnter: p(g, b),
            onMouseLeave: h(g, b),
            onClick: m(g, b)
        }), d.createElement(I2, $r({
            option: w,
            isActive: P
        }, O))))
    }))
}

function Z2(e) {
    var {
        previousPointsRef: t,
        props: r
    } = e, {
        points: n,
        isAnimationActive: i,
        animationBegin: a,
        animationDuration: o,
        animationEasing: u
    } = r, l = t.current, s = fr(r, "recharts-scatter-"), [c, f] = d.useState(!1), v = d.useCallback(() => {
        f(!1)
    }, []), p = d.useCallback(() => {
        f(!0)
    }, []), h = !c;
    return d.createElement(Y2, {
        showLabels: h,
        points: n
    }, r.children, d.createElement(sr, {
        animationId: s,
        begin: a,
        duration: o,
        isActive: i,
        easing: u,
        onAnimationEnd: v,
        onAnimationStart: p,
        key: s
    }, m => {
        var y = m === 1 ? n : n ?.map((g, b) => {
            var x = l && l[b];
            return x ? He(He({}, g), {}, {
                cx: g.cx == null ? void 0 : F(x.cx, g.cx, m),
                cy: g.cy == null ? void 0 : F(x.cy, g.cy, m),
                size: F(x.size, g.size, m)
            }) : He(He({}, g), {}, {
                size: F(0, g.size, m)
            })
        });
        return m > 0 && (t.current = y), d.createElement(G, null, d.createElement(X2, {
            points: y,
            allOtherScatterProps: r,
            showLabels: h
        }))
    }), d.createElement(mn, {
        label: r.label
    }))
}

function J2(e) {
    var {
        displayedData: t,
        xAxis: r,
        yAxis: n,
        zAxis: i,
        scatterSettings: a,
        xAxisTicks: o,
        yAxisTicks: u,
        cells: l
    } = e, s = X(r.dataKey) ? a.dataKey : r.dataKey, c = X(n.dataKey) ? a.dataKey : n.dataKey, f = i && i.dataKey, v = i ? i.range : Rt.range, p = v && v[0], h = r.scale.bandwidth ? r.scale.bandwidth() : 0, m = n.scale.bandwidth ? n.scale.bandwidth() : 0;
    return t.map((y, g) => {
        var b = H(y, s),
            x = H(y, c),
            P = !X(f) && H(y, f) || "-",
            w = [{
                name: X(r.dataKey) ? a.name : r.name || String(r.dataKey),
                unit: r.unit || "",
                value: b,
                payload: y,
                dataKey: s,
                type: a.tooltipType
            }, {
                name: X(n.dataKey) ? a.name : n.name || String(n.dataKey),
                unit: n.unit || "",
                value: x,
                payload: y,
                dataKey: c,
                type: a.tooltipType
            }];
        P !== "-" && w.push({
            name: i.name || i.dataKey,
            unit: i.unit || "",
            value: P,
            payload: y,
            dataKey: f,
            type: a.tooltipType
        });
        var O = Xr({
                axis: r,
                ticks: o,
                bandSize: h,
                entry: y,
                index: g,
                dataKey: s
            }),
            S = Xr({
                axis: n,
                ticks: u,
                bandSize: m,
                entry: y,
                index: g,
                dataKey: c
            }),
            E = P !== "-" ? i.scale(P) : p,
            _ = Math.sqrt(Math.max(E, 0) / Math.PI);
        return He(He({}, y), {}, {
            cx: O,
            cy: S,
            x: O == null ? void 0 : O - _,
            y: S == null ? void 0 : S - _,
            width: 2 * _,
            height: 2 * _,
            size: E,
            node: {
                x: b,
                y: x,
                z: P
            },
            tooltipPayload: w,
            tooltipPosition: {
                x: O,
                y: S
            },
            payload: y
        }, l && l[g] && l[g].props)
    })
}
var Q2 = (e, t, r) => ({
    x: e.cx,
    y: e.cy,
    value: Number(r === "x" ? e.node.x : e.node.y),
    errorVal: H(e, t)
});

function eB(e) {
    var {
        hide: t,
        points: r,
        className: n,
        needClip: i,
        xAxisId: a,
        yAxisId: o,
        id: u
    } = e, l = d.useRef(null);
    if (t) return null;
    var s = z("recharts-scatter", n),
        c = u;
    return d.createElement(ge, {
        zIndex: e.zIndex
    }, d.createElement(G, {
        className: s,
        clipPath: i ? "url(#clipPath-".concat(c, ")") : void 0,
        id: u
    }, i && d.createElement("defs", null, d.createElement(Io, {
        clipPathId: c,
        xAxisId: a,
        yAxisId: o
    })), d.createElement(Zs, {
        xAxisId: a,
        yAxisId: o,
        data: r,
        dataPointFormatter: Q2,
        errorBarOffset: 0
    }, d.createElement(G, {
        key: "recharts-scatter-symbols"
    }, d.createElement(Z2, {
        props: e,
        previousPointsRef: l
    })))))
}
var J0 = {
    xAxisId: 0,
    yAxisId: 0,
    zAxisId: 0,
    label: !1,
    line: !1,
    legendType: "circle",
    lineType: "joint",
    lineJointType: "linear",
    shape: "circle",
    hide: !1,
    isAnimationActive: "auto",
    animationBegin: 0,
    animationDuration: 400,
    animationEasing: "linear",
    zIndex: ie.scatter
};

function tB(e) {
    var t = ee(e, J0),
        {
            animationBegin: r,
            animationDuration: n,
            animationEasing: i,
            hide: a,
            isAnimationActive: o,
            legendType: u,
            lineJointType: l,
            lineType: s,
            shape: c,
            xAxisId: f,
            yAxisId: v,
            zAxisId: p
        } = t,
        h = rc(t, K2),
        {
            needClip: m
        } = Oi(f, v),
        y = d.useMemo(() => xo(e.children, wi), [e.children]),
        g = he(),
        b = M(x => L2(x, f, v, p, e.id, y, g));
    return m == null || b == null ? null : d.createElement(d.Fragment, null, d.createElement(G2, {
        dataKey: e.dataKey,
        points: b,
        stroke: e.stroke,
        strokeWidth: e.strokeWidth,
        fill: e.fill,
        name: e.name,
        hide: e.hide,
        tooltipType: e.tooltipType,
        id: e.id
    }), d.createElement(eB, $r({}, h, {
        xAxisId: f,
        yAxisId: v,
        zAxisId: p,
        lineType: s,
        lineJointType: l,
        legendType: u,
        shape: c,
        hide: a,
        isAnimationActive: o,
        animationBegin: r,
        animationDuration: n,
        animationEasing: i,
        points: b,
        needClip: m
    })))
}

function rB(e) {
    var t = ee(e, J0),
        r = he();
    return d.createElement(xn, {
        id: t.id,
        type: "scatter"
    }, n => d.createElement(d.Fragment, null, d.createElement(Ao, {
        legendPayload: H2(t)
    }), d.createElement(So, {
        type: "scatter",
        id: n,
        data: t.data,
        xAxisId: t.xAxisId,
        yAxisId: t.yAxisId,
        zAxisId: t.zAxisId,
        dataKey: t.dataKey,
        hide: t.hide,
        name: t.name,
        tooltipType: t.tooltipType,
        isPanorama: r
    }), d.createElement(tB, $r({}, t, {
        id: n
    }))))
}
var nB = d.memo(rB, wn);
nB.displayName = "Scatter";
var iB = ["domain", "range"],
    aB = ["domain", "range"];

function Yh(e, t) {
    if (e == null) return {};
    var r, n, i = oB(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function oB(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function Xh(e, t) {
    return e === t ? !0 : Array.isArray(e) && e.length === 2 && Array.isArray(t) && t.length === 2 ? e[0] === t[0] && e[1] === t[1] : !1
}

function Q0(e, t) {
    if (e === t) return !0;
    var {
        domain: r,
        range: n
    } = e, i = Yh(e, iB), {
        domain: a,
        range: o
    } = t, u = Yh(t, aB);
    return !Xh(r, a) || !Xh(n, o) ? !1 : wn(i, u)
}
var uB = ["dangerouslySetInnerHTML", "ticks", "scale"],
    lB = ["id", "scale"];

function nc() {
    return nc = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, nc.apply(null, arguments)
}

function Zh(e, t) {
    if (e == null) return {};
    var r, n, i = cB(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function cB(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function sB(e) {
    var t = te(),
        r = d.useRef(null);
    return d.useLayoutEffect(() => {
        r.current === null ? t(tN(e)) : r.current !== e && t(rN({
            prev: r.current,
            next: e
        })), r.current = e
    }, [e, t]), d.useLayoutEffect(() => () => {
        r.current && (t(nN(r.current)), r.current = null)
    }, [t]), null
}
var fB = e => {
        var {
            xAxisId: t,
            className: r
        } = e, n = M(_c), i = he(), a = "xAxis", o = M(g => gb(g, a, t, i)), u = M(g => pb(g, t)), l = M(g => UI(g, t)), s = M(g => Yg(g, t));
        if (u == null || l == null || s == null) return null;
        var {
            dangerouslySetInnerHTML: c,
            ticks: f,
            scale: v
        } = e, p = Zh(e, uB), {
            id: h,
            scale: m
        } = s, y = Zh(s, lB);
        return d.createElement(Xs, nc({}, p, y, {
            x: l.x,
            y: l.y,
            width: u.width,
            height: u.height,
            className: z("recharts-".concat(a, " ").concat(a), r),
            viewBox: n,
            ticks: o,
            axisType: a
        }))
    },
    dB = {
        allowDataOverflow: Ee.allowDataOverflow,
        allowDecimals: Ee.allowDecimals,
        allowDuplicatedCategory: Ee.allowDuplicatedCategory,
        angle: Ee.angle,
        axisLine: Bt.axisLine,
        height: Ee.height,
        hide: !1,
        includeHidden: Ee.includeHidden,
        interval: Ee.interval,
        minTickGap: Ee.minTickGap,
        mirror: Ee.mirror,
        orientation: Ee.orientation,
        padding: Ee.padding,
        reversed: Ee.reversed,
        scale: Ee.scale,
        tick: Ee.tick,
        tickCount: Ee.tickCount,
        tickLine: Bt.tickLine,
        tickSize: Bt.tickSize,
        type: Ee.type,
        xAxisId: 0
    },
    vB = e => {
        var t = ee(e, dB);
        return d.createElement(d.Fragment, null, d.createElement(sB, {
            allowDataOverflow: t.allowDataOverflow,
            allowDecimals: t.allowDecimals,
            allowDuplicatedCategory: t.allowDuplicatedCategory,
            angle: t.angle,
            dataKey: t.dataKey,
            domain: t.domain,
            height: t.height,
            hide: t.hide,
            id: t.xAxisId,
            includeHidden: t.includeHidden,
            interval: t.interval,
            minTickGap: t.minTickGap,
            mirror: t.mirror,
            name: t.name,
            orientation: t.orientation,
            padding: t.padding,
            reversed: t.reversed,
            scale: t.scale,
            tick: t.tick,
            tickCount: t.tickCount,
            tickFormatter: t.tickFormatter,
            ticks: t.ticks,
            type: t.type,
            unit: t.unit
        }), d.createElement(fB, t))
    },
    pB = d.memo(vB, Q0);
pB.displayName = "XAxis";
var hB = ["dangerouslySetInnerHTML", "ticks", "scale"],
    mB = ["id", "scale"];

function ic() {
    return ic = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, ic.apply(null, arguments)
}

function Jh(e, t) {
    if (e == null) return {};
    var r, n, i = yB(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function yB(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function gB(e) {
    var t = te(),
        r = d.useRef(null);
    return d.useLayoutEffect(() => {
        r.current === null ? t(iN(e)) : r.current !== e && t(aN({
            prev: r.current,
            next: e
        })), r.current = e
    }, [e, t]), d.useLayoutEffect(() => () => {
        r.current && (t(oN(r.current)), r.current = null)
    }, [t]), null
}
var bB = e => {
        var {
            yAxisId: t,
            className: r,
            width: n,
            label: i
        } = e, a = d.useRef(null), o = d.useRef(null), u = M(_c), l = he(), s = te(), c = "yAxis", f = M(O => hb(O, t)), v = M(O => GI(O, t)), p = M(O => gb(O, c, t, l)), h = M(O => Xg(O, t));
        if (d.useLayoutEffect(() => {
                if (!(n !== "auto" || !f || Ls(i) || d.isValidElement(i) || h == null)) {
                    var O = a.current;
                    if (O) {
                        var S = O.getCalculatedWidth();
                        Math.round(f.width) !== Math.round(S) && s(sN({
                            id: t,
                            width: S
                        }))
                    }
                }
            }, [p, f, s, i, t, n, h]), f == null || v == null || h == null) return null;
        var {
            dangerouslySetInnerHTML: m,
            ticks: y,
            scale: g
        } = e, b = Jh(e, hB), {
            id: x,
            scale: P
        } = h, w = Jh(h, mB);
        return d.createElement(Xs, ic({}, b, w, {
            ref: a,
            labelRef: o,
            x: v.x,
            y: v.y,
            tickTextProps: n === "auto" ? {
                width: void 0
            } : {
                width: n
            },
            width: f.width,
            height: f.height,
            className: z("recharts-".concat(c, " ").concat(c), r),
            viewBox: u,
            ticks: p,
            axisType: c
        }))
    },
    xB = {
        allowDataOverflow: je.allowDataOverflow,
        allowDecimals: je.allowDecimals,
        allowDuplicatedCategory: je.allowDuplicatedCategory,
        angle: je.angle,
        axisLine: Bt.axisLine,
        hide: !1,
        includeHidden: je.includeHidden,
        interval: je.interval,
        minTickGap: je.minTickGap,
        mirror: je.mirror,
        orientation: je.orientation,
        padding: je.padding,
        reversed: je.reversed,
        scale: je.scale,
        tick: je.tick,
        tickCount: je.tickCount,
        tickLine: Bt.tickLine,
        tickSize: Bt.tickSize,
        type: je.type,
        width: je.width,
        yAxisId: 0
    },
    wB = e => {
        var t = ee(e, xB);
        return d.createElement(d.Fragment, null, d.createElement(gB, {
            interval: t.interval,
            id: t.yAxisId,
            scale: t.scale,
            type: t.type,
            domain: t.domain,
            allowDataOverflow: t.allowDataOverflow,
            dataKey: t.dataKey,
            allowDuplicatedCategory: t.allowDuplicatedCategory,
            allowDecimals: t.allowDecimals,
            tickCount: t.tickCount,
            padding: t.padding,
            includeHidden: t.includeHidden,
            reversed: t.reversed,
            ticks: t.ticks,
            width: t.width,
            orientation: t.orientation,
            mirror: t.mirror,
            hide: t.hide,
            unit: t.unit,
            name: t.name,
            angle: t.angle,
            minTickGap: t.minTickGap,
            tick: t.tick,
            tickFormatter: t.tickFormatter
        }), d.createElement(bB, t))
    },
    PB = d.memo(wB, Q0);
PB.displayName = "YAxis";

function OB(e) {
    var t = te(),
        r = d.useRef(null);
    return d.useLayoutEffect(() => {
        r.current === null ? t(uN(e)) : r.current !== e && t(lN({
            prev: r.current,
            next: e
        })), r.current = e
    }, [e, t]), d.useLayoutEffect(() => () => {
        r.current && (t(cN(r.current)), r.current = null)
    }, [t]), null
}
var AB = {
    zAxisId: 0,
    range: Rt.range,
    scale: Rt.scale,
    type: Rt.type
};

function SB(e) {
    var t = ee(e, AB);
    return d.createElement(OB, {
        domain: t.domain,
        id: t.zAxisId,
        dataKey: t.dataKey,
        name: t.name,
        unit: t.unit,
        range: t.range,
        scale: t.scale,
        type: t.type,
        allowDuplicatedCategory: Rt.allowDuplicatedCategory,
        allowDataOverflow: Rt.allowDataOverflow,
        reversed: Rt.reversed,
        includeHidden: Rt.includeHidden
    })
}
SB.displayName = "ZAxis";
var EB = (e, t) => t,
    Qs = A([EB, K, on, Ae, Nb, er, uk, Pe], pk),
    ef = e => {
        var t = e.currentTarget.getBoundingClientRect(),
            r = t.width / e.currentTarget.offsetWidth,
            n = t.height / e.currentTarget.offsetHeight;
        return {
            chartX: Math.round((e.clientX - t.left) / r),
            chartY: Math.round((e.clientY - t.top) / n)
        }
    },
    ex = ot("mouseClick"),
    tx = ri();
tx.startListening({
    actionCreator: ex,
    effect: (e, t) => {
        var r = e.payload,
            n = Qs(t.getState(), ef(r));
        n ?.activeIndex != null && t.dispatch(o_({
            activeIndex: n.activeIndex,
            activeDataKey: void 0,
            activeCoordinate: n.activeCoordinate
        }))
    }
});
var ac = ot("mouseMove"),
    rx = ri(),
    zi = null;
rx.startListening({
    actionCreator: ac,
    effect: (e, t) => {
        var r = e.payload;
        zi !== null && cancelAnimationFrame(zi);
        var n = ef(r);
        zi = requestAnimationFrame(() => {
            var i = t.getState(),
                a = js(i, i.tooltip.settings.shared);
            if (a === "axis") {
                var o = Qs(i, n);
                o ?.activeIndex != null ? t.dispatch(jb({
                    activeIndex: o.activeIndex,
                    activeDataKey: void 0,
                    activeCoordinate: o.activeCoordinate
                })) : t.dispatch(Eb())
            }
            zi = null
        })
    }
});

function jB(e, t) {
    return t instanceof HTMLElement ? "HTMLElement <".concat(t.tagName, ' class="').concat(t.className, '">') : t === window ? "global.window" : e === "children" && typeof t == "object" && t !== null ? "<<CHILDREN>>" : t
}
var Qh = {
        accessibilityLayer: !0,
        barCategoryGap: "10%",
        barGap: 4,
        barSize: void 0,
        className: void 0,
        maxBarSize: void 0,
        stackOffset: "none",
        syncId: void 0,
        syncMethod: "index",
        baseValue: void 0,
        reverseStackOrder: !1
    },
    nx = Ge({
        name: "rootProps",
        initialState: Qh,
        reducers: {
            updateOptions: (e, t) => {
                var r;
                e.accessibilityLayer = t.payload.accessibilityLayer, e.barCategoryGap = t.payload.barCategoryGap, e.barGap = (r = t.payload.barGap) !== null && r !== void 0 ? r : Qh.barGap, e.barSize = t.payload.barSize, e.maxBarSize = t.payload.maxBarSize, e.stackOffset = t.payload.stackOffset, e.syncId = t.payload.syncId, e.syncMethod = t.payload.syncMethod, e.className = t.payload.className, e.baseValue = t.payload.baseValue, e.reverseStackOrder = t.payload.reverseStackOrder
            }
        }
    }),
    IB = nx.reducer,
    {
        updateOptions: _B
    } = nx.actions,
    ix = Ge({
        name: "polarOptions",
        initialState: null,
        reducers: {
            updatePolarOptions: (e, t) => t.payload
        }
    }),
    {
        updatePolarOptions: kB
    } = ix.actions,
    CB = ix.reducer,
    ax = ot("keyDown"),
    ox = ot("focus"),
    tf = ri();
tf.startListening({
    actionCreator: ax,
    effect: (e, t) => {
        var r = t.getState(),
            n = r.rootProps.accessibilityLayer !== !1;
        if (n) {
            var {
                keyboardInteraction: i
            } = r.tooltip, a = e.payload;
            if (!(a !== "ArrowRight" && a !== "ArrowLeft" && a !== "Enter")) {
                var o = Is(i, vn(r), hi(r), bi(r)),
                    u = o == null ? -1 : Number(o);
                if (!(!Number.isFinite(u) || u < 0)) {
                    var l = er(r);
                    if (a === "Enter") {
                        var s = Oa(r, "axis", "hover", String(i.index));
                        t.dispatch(Vl({
                            active: !i.active,
                            activeIndex: i.index,
                            activeCoordinate: s
                        }));
                        return
                    }
                    var c = XI(r),
                        f = c === "left-to-right" ? 1 : -1,
                        v = a === "ArrowRight" ? 1 : -1,
                        p = u + v * f;
                    if (!(l == null || p >= l.length || p < 0)) {
                        var h = Oa(r, "axis", "hover", String(p));
                        t.dispatch(Vl({
                            active: !0,
                            activeIndex: p.toString(),
                            activeCoordinate: h
                        }))
                    }
                }
            }
        }
    }
});
tf.startListening({
    actionCreator: ox,
    effect: (e, t) => {
        var r = t.getState(),
            n = r.rootProps.accessibilityLayer !== !1;
        if (n) {
            var {
                keyboardInteraction: i
            } = r.tooltip;
            if (!i.active && i.index == null) {
                var a = "0",
                    o = Oa(r, "axis", "hover", String(a));
                t.dispatch(Vl({
                    active: !0,
                    activeIndex: a,
                    activeCoordinate: o
                }))
            }
        }
    }
});
var rt = ot("externalEvent"),
    ux = ri(),
    vl = new Map;
ux.startListening({
    actionCreator: rt,
    effect: (e, t) => {
        var {
            handler: r,
            reactEvent: n
        } = e.payload;
        if (r != null) {
            n.persist();
            var i = n.type,
                a = vl.get(i);
            a !== void 0 && cancelAnimationFrame(a);
            var o = requestAnimationFrame(() => {
                try {
                    var u = t.getState(),
                        l = {
                            activeCoordinate: H_(u),
                            activeDataKey: Ms(u),
                            activeIndex: Ht(u),
                            activeLabel: Lb(u),
                            activeTooltipIndex: Ht(u),
                            isTooltipActive: G_(u)
                        };
                    r(l, n)
                } finally {
                    vl.delete(i)
                }
            });
            vl.set(i, o)
        }
    }
});
var TB = A([fn], e => e.tooltipItemPayloads),
    MB = A([TB, gi, (e, t) => t, (e, t, r) => r], (e, t, r, n) => {
        var i = e.find(u => u.settings.graphicalItemId === n);
        if (i != null) {
            var {
                positions: a
            } = i;
            if (a != null) {
                var o = t(a, r);
                return o
            }
        }
    }),
    lx = ot("touchMove"),
    cx = ri();
cx.startListening({
    actionCreator: lx,
    effect: (e, t) => {
        var r = e.payload;
        if (!(r.touches == null || r.touches.length === 0)) {
            var n = t.getState(),
                i = js(n, n.tooltip.settings.shared);
            if (i === "axis") {
                var a = r.touches[0];
                if (a == null) return;
                var o = Qs(n, ef({
                    clientX: a.clientX,
                    clientY: a.clientY,
                    currentTarget: r.currentTarget
                }));
                o ?.activeIndex != null && t.dispatch(jb({
                    activeIndex: o.activeIndex,
                    activeDataKey: void 0,
                    activeCoordinate: o.activeCoordinate
                }))
            } else if (i === "item") {
                var u, l = r.touches[0];
                if (document.elementFromPoint == null || l == null) return;
                var s = document.elementFromPoint(l.clientX, l.clientY);
                if (!s || !s.getAttribute) return;
                var c = s.getAttribute(jc),
                    f = (u = s.getAttribute(Ic)) !== null && u !== void 0 ? u : void 0,
                    v = dn(n).find(m => m.id === f);
                if (c == null || v == null || f == null) return;
                var {
                    dataKey: p
                } = v, h = MB(n, c, f);
                t.dispatch(Sb({
                    activeDataKey: p,
                    activeIndex: c,
                    activeCoordinate: h,
                    activeGraphicalItemId: f
                }))
            }
        }
    }
});
var DB = Vm({
        brush: iR,
        cartesianAxis: fN,
        chartData: Uk,
        errorBars: r$,
        graphicalItems: hD,
        layout: jO,
        legend: AA,
        options: zk,
        polarAxis: eM,
        polarOptions: CB,
        referenceElements: fR,
        rootProps: IB,
        tooltip: u_,
        zIndex: Ik
    }),
    NB = function(t) {
        var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Chart";
        return JP({
            reducer: DB,
            preloadedState: t,
            middleware: n => {
                var i;
                return n({
                    serializableCheck: !1,
                    immutableCheck: !["commonjs", "es6", "production"].includes((i = "es6") !== null && i !== void 0 ? i : "")
                }).concat([tx.middleware, rx.middleware, tf.middleware, ux.middleware, cx.middleware])
            },
            enhancers: n => {
                var i = n;
                return typeof n == "function" && (i = n()), i.concat(oy({
                    type: "raf"
                }))
            },
            devTools: {
                serialize: {
                    replacer: jB
                },
                name: "recharts-".concat(r)
            }
        })
    };

function sx(e) {
    var {
        preloadedState: t,
        children: r,
        reduxStoreName: n
    } = e, i = he(), a = d.useRef(null);
    if (i) return r;
    a.current == null && (a.current = NB(t, n));
    var o = wc;
    return d.createElement(k$, {
        context: o,
        store: a.current
    }, r)
}

function RB(e) {
    var {
        layout: t,
        margin: r
    } = e, n = te(), i = he();
    return d.useEffect(() => {
        i || (n(AO(t)), n(OO(r)))
    }, [n, i, t, r]), null
}
var fx = d.memo(RB, wn);

function dx(e) {
    var t = te();
    return d.useEffect(() => {
        t(_B(e))
    }, [t, e]), null
}

function em(e) {
    var {
        zIndex: t,
        isPanorama: r
    } = e, n = d.useRef(null), i = te();
    return d.useLayoutEffect(() => (n.current && i(Ek({
        zIndex: t,
        element: n.current,
        isPanorama: r
    })), () => {
        i(jk({
            zIndex: t,
            isPanorama: r
        }))
    }), [i, t, r]), d.createElement("g", {
        tabIndex: -1,
        ref: n
    })
}

function tm(e) {
    var {
        children: t,
        isPanorama: r
    } = e, n = M(mk);
    if (!n || n.length === 0) return t;
    var i = n.filter(o => o < 0),
        a = n.filter(o => o > 0);
    return d.createElement(d.Fragment, null, i.map(o => d.createElement(em, {
        key: o,
        zIndex: o,
        isPanorama: r
    })), t, a.map(o => d.createElement(em, {
        key: o,
        zIndex: o,
        isPanorama: r
    })))
}
var $B = ["children"];

function LB(e, t) {
    if (e == null) return {};
    var r, n, i = BB(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function BB(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}

function Da() {
    return Da = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Da.apply(null, arguments)
}
var zB = {
        width: "100%",
        height: "100%",
        display: "block"
    },
    KB = d.forwardRef((e, t) => {
        var r = Cc(),
            n = Tc(),
            i = My();
        if (!Et(r) || !Et(n)) return null;
        var {
            children: a,
            otherAttributes: o,
            title: u,
            desc: l
        } = e, s, c;
        return o != null && (typeof o.tabIndex == "number" ? s = o.tabIndex : s = i ? 0 : void 0, typeof o.role == "string" ? c = o.role : c = i ? "application" : void 0), d.createElement(fc, Da({}, o, {
            title: u,
            desc: l,
            role: c,
            tabIndex: s,
            width: r,
            height: n,
            style: zB,
            ref: t
        }), a)
    }),
    WB = e => {
        var {
            children: t
        } = e, r = M(Xa);
        if (!r) return null;
        var {
            width: n,
            height: i,
            y: a,
            x: o
        } = r;
        return d.createElement(fc, {
            width: n,
            height: i,
            x: o,
            y: a
        }, t)
    },
    rm = d.forwardRef((e, t) => {
        var {
            children: r
        } = e, n = LB(e, $B), i = he();
        return i ? d.createElement(WB, null, d.createElement(tm, {
            isPanorama: !0
        }, r)) : d.createElement(KB, Da({
            ref: t
        }, n), d.createElement(tm, {
            isPanorama: !1
        }, r))
    });

function FB() {
    var e = te(),
        [t, r] = d.useState(null),
        n = M(qO);
    return d.useEffect(() => {
        if (t != null) {
            var i = t.getBoundingClientRect(),
                a = i.width / t.offsetWidth;
            ae(a) && a !== n && e(EO(a))
        }
    }, [t, e, n]), r
}

function nm(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function qB(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? nm(Object(r), !0).forEach(function(n) {
            UB(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : nm(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function UB(e, t, r) {
    return (t = HB(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function HB(e) {
    var t = GB(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function GB(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function Lr() {
    return Lr = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, Lr.apply(null, arguments)
}
var VB = () => (eC(), null);

function Na(e) {
    if (typeof e == "number") return e;
    if (typeof e == "string") {
        var t = parseFloat(e);
        if (!Number.isNaN(t)) return t
    }
    return 0
}
var YB = d.forwardRef((e, t) => {
        var r, n, i = d.useRef(null),
            [a, o] = d.useState({
                containerWidth: Na((r = e.style) === null || r === void 0 ? void 0 : r.width),
                containerHeight: Na((n = e.style) === null || n === void 0 ? void 0 : n.height)
            }),
            u = d.useCallback((s, c) => {
                o(f => {
                    var v = Math.round(s),
                        p = Math.round(c);
                    return f.containerWidth === v && f.containerHeight === p ? f : {
                        containerWidth: v,
                        containerHeight: p
                    }
                })
            }, []),
            l = d.useCallback(s => {
                if (typeof t == "function" && t(s), s != null && typeof ResizeObserver < "u") {
                    var {
                        width: c,
                        height: f
                    } = s.getBoundingClientRect();
                    u(c, f);
                    var v = h => {
                            var {
                                width: m,
                                height: y
                            } = h[0].contentRect;
                            u(m, y)
                        },
                        p = new ResizeObserver(v);
                    p.observe(s), i.current = p
                }
            }, [t, u]);
        return d.useEffect(() => () => {
            var s = i.current;
            s ?.disconnect()
        }, [u]), d.createElement(d.Fragment, null, d.createElement(Za, {
            width: a.containerWidth,
            height: a.containerHeight
        }), d.createElement("div", Lr({
            ref: l
        }, e)))
    }),
    XB = d.forwardRef((e, t) => {
        var {
            width: r,
            height: n
        } = e, [i, a] = d.useState({
            containerWidth: Na(r),
            containerHeight: Na(n)
        }), o = d.useCallback((l, s) => {
            a(c => {
                var f = Math.round(l),
                    v = Math.round(s);
                return c.containerWidth === f && c.containerHeight === v ? c : {
                    containerWidth: f,
                    containerHeight: v
                }
            })
        }, []), u = d.useCallback(l => {
            if (typeof t == "function" && t(l), l != null) {
                var {
                    width: s,
                    height: c
                } = l.getBoundingClientRect();
                o(s, c)
            }
        }, [t, o]);
        return d.createElement(d.Fragment, null, d.createElement(Za, {
            width: i.containerWidth,
            height: i.containerHeight
        }), d.createElement("div", Lr({
            ref: u
        }, e)))
    }),
    ZB = d.forwardRef((e, t) => {
        var {
            width: r,
            height: n
        } = e;
        return d.createElement(d.Fragment, null, d.createElement(Za, {
            width: r,
            height: n
        }), d.createElement("div", Lr({
            ref: t
        }, e)))
    }),
    JB = d.forwardRef((e, t) => {
        var {
            width: r,
            height: n
        } = e;
        return zt(r) || zt(n) ? d.createElement(XB, Lr({}, e, {
            ref: t
        })) : d.createElement(ZB, Lr({}, e, {
            ref: t
        }))
    });

function QB(e) {
    return e === !0 ? YB : JB
}
var ez = d.forwardRef((e, t) => {
        var {
            children: r,
            className: n,
            height: i,
            onClick: a,
            onContextMenu: o,
            onDoubleClick: u,
            onMouseDown: l,
            onMouseEnter: s,
            onMouseLeave: c,
            onMouseMove: f,
            onMouseUp: v,
            onTouchEnd: p,
            onTouchMove: h,
            onTouchStart: m,
            style: y,
            width: g,
            responsive: b,
            dispatchTouchEvents: x = !0
        } = e, P = d.useRef(null), w = te(), [O, S] = d.useState(null), [E, _] = d.useState(null), C = FB(), j = kc(), I = j ?.width > 0 ? j.width : g, R = j ?.height > 0 ? j.height : i, $ = d.useCallback(k => {
            C(k), typeof t == "function" && t(k), S(k), _(k), k != null && (P.current = k)
        }, [C, t, S, _]), B = d.useCallback(k => {
            w(ex(k)), w(rt({
                handler: a,
                reactEvent: k
            }))
        }, [w, a]), q = d.useCallback(k => {
            w(ac(k)), w(rt({
                handler: s,
                reactEvent: k
            }))
        }, [w, s]), W = d.useCallback(k => {
            w(Eb()), w(rt({
                handler: c,
                reactEvent: k
            }))
        }, [w, c]), V = d.useCallback(k => {
            w(ac(k)), w(rt({
                handler: f,
                reactEvent: k
            }))
        }, [w, f]), L = d.useCallback(() => {
            w(ox())
        }, [w]), Me = d.useCallback(k => {
            w(ax(k.key))
        }, [w]), Le = d.useCallback(k => {
            w(rt({
                handler: o,
                reactEvent: k
            }))
        }, [w, o]), De = d.useCallback(k => {
            w(rt({
                handler: u,
                reactEvent: k
            }))
        }, [w, u]), Tt = d.useCallback(k => {
            w(rt({
                handler: l,
                reactEvent: k
            }))
        }, [w, l]), Qe = d.useCallback(k => {
            w(rt({
                handler: v,
                reactEvent: k
            }))
        }, [w, v]), hr = d.useCallback(k => {
            w(rt({
                handler: m,
                reactEvent: k
            }))
        }, [w, m]), Pn = d.useCallback(k => {
            x && w(lx(k)), w(rt({
                handler: h,
                reactEvent: k
            }))
        }, [w, x, h]), Ke = d.useCallback(k => {
            w(rt({
                handler: p,
                reactEvent: k
            }))
        }, [w, p]), ko = QB(b);
        return d.createElement(Hb.Provider, {
            value: O
        }, d.createElement(fm.Provider, {
            value: E
        }, d.createElement(ko, {
            width: I ?? y ?.width,
            height: R ?? y ?.height,
            className: z("recharts-wrapper", n),
            style: qB({
                position: "relative",
                cursor: "default",
                width: I,
                height: R
            }, y),
            onClick: B,
            onContextMenu: Le,
            onDoubleClick: De,
            onFocus: L,
            onKeyDown: Me,
            onMouseDown: Tt,
            onMouseEnter: q,
            onMouseLeave: W,
            onMouseMove: V,
            onMouseUp: Qe,
            onTouchEnd: Ke,
            onTouchMove: Pn,
            onTouchStart: hr,
            ref: $
        }, d.createElement(VB, null), r)))
    }),
    tz = ["width", "height", "responsive", "children", "className", "style", "compact", "title", "desc"];

function rz(e, t) {
    if (e == null) return {};
    var r, n, i = nz(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function nz(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var vx = d.forwardRef((e, t) => {
    var {
        width: r,
        height: n,
        responsive: i,
        children: a,
        className: o,
        style: u,
        compact: l,
        title: s,
        desc: c
    } = e, f = rz(e, tz), v = re(f);
    return l ? d.createElement(d.Fragment, null, d.createElement(Za, {
        width: r,
        height: n
    }), d.createElement(rm, {
        otherAttributes: v,
        title: s,
        desc: c
    }, a)) : d.createElement(ez, {
        className: o,
        style: u,
        width: r,
        height: n,
        responsive: i ?? !1,
        onClick: e.onClick,
        onMouseLeave: e.onMouseLeave,
        onMouseEnter: e.onMouseEnter,
        onMouseMove: e.onMouseMove,
        onMouseDown: e.onMouseDown,
        onMouseUp: e.onMouseUp,
        onContextMenu: e.onContextMenu,
        onDoubleClick: e.onDoubleClick,
        onTouchStart: e.onTouchStart,
        onTouchMove: e.onTouchMove,
        onTouchEnd: e.onTouchEnd
    }, d.createElement(rm, {
        otherAttributes: v,
        title: s,
        desc: c,
        ref: t
    }, d.createElement(vR, null, a)))
});

function oc() {
    return oc = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, oc.apply(null, arguments)
}
var iz = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    },
    az = {
        accessibilityLayer: !0,
        barCategoryGap: "10%",
        barGap: 4,
        layout: "horizontal",
        margin: iz,
        responsive: !1,
        reverseStackOrder: !1,
        stackOffset: "none",
        syncMethod: "index"
    },
    _o = d.forwardRef(function(t, r) {
        var n, i = ee(t.categoricalChartProps, az),
            {
                chartName: a,
                defaultTooltipEventType: o,
                validateTooltipEventTypes: u,
                tooltipPayloadSearcher: l,
                categoricalChartProps: s
            } = t,
            c = {
                chartName: a,
                defaultTooltipEventType: o,
                validateTooltipEventTypes: u,
                tooltipPayloadSearcher: l,
                eventEmitter: void 0
            };
        return d.createElement(sx, {
            preloadedState: {
                options: c
            },
            reduxStoreName: (n = s.id) !== null && n !== void 0 ? n : a
        }, d.createElement(I0, {
            chartData: s.data
        }), d.createElement(fx, {
            layout: i.layout,
            margin: i.margin
        }), d.createElement(dx, {
            baseValue: i.baseValue,
            accessibilityLayer: i.accessibilityLayer,
            barCategoryGap: i.barCategoryGap,
            maxBarSize: i.maxBarSize,
            stackOffset: i.stackOffset,
            barGap: i.barGap,
            barSize: i.barSize,
            syncId: i.syncId,
            syncMethod: i.syncMethod,
            className: i.className,
            reverseStackOrder: i.reverseStackOrder
        }), d.createElement(vx, oc({}, i, {
            ref: r
        })))
    }),
    oz = ["axis"],
    Bz = d.forwardRef((e, t) => d.createElement(_o, {
        chartName: "LineChart",
        defaultTooltipEventType: "axis",
        validateTooltipEventTypes: oz,
        tooltipPayloadSearcher: pn,
        categoricalChartProps: e,
        ref: t
    })),
    uz = ["axis", "item"],
    zz = d.forwardRef((e, t) => d.createElement(_o, {
        chartName: "BarChart",
        defaultTooltipEventType: "axis",
        validateTooltipEventTypes: uz,
        tooltipPayloadSearcher: pn,
        categoricalChartProps: e,
        ref: t
    }));

function lz(e) {
    var t = te();
    return d.useEffect(() => {
        t(kB(e))
    }, [t, e]), null
}
var cz = ["layout"];

function uc() {
    return uc = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)({}).hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
    }, uc.apply(null, arguments)
}

function sz(e, t) {
    if (e == null) return {};
    var r, n, i = fz(e, t);
    if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
    }
    return i
}

function fz(e, t) {
    if (e == null) return {};
    var r = {};
    for (var n in e)
        if ({}.hasOwnProperty.call(e, n)) {
            if (t.indexOf(n) !== -1) continue;
            r[n] = e[n]
        }
    return r
}
var dz = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    },
    rf = {
        accessibilityLayer: !0,
        stackOffset: "none",
        barCategoryGap: "10%",
        barGap: 4,
        margin: dz,
        reverseStackOrder: !1,
        syncMethod: "index",
        layout: "radial",
        responsive: !1,
        cx: "50%",
        cy: "50%",
        innerRadius: 0,
        outerRadius: "80%"
    },
    px = d.forwardRef(function(t, r) {
        var n, i = ee(t.categoricalChartProps, rf),
            {
                layout: a
            } = i,
            o = sz(i, cz),
            {
                chartName: u,
                defaultTooltipEventType: l,
                validateTooltipEventTypes: s,
                tooltipPayloadSearcher: c
            } = t,
            f = {
                chartName: u,
                defaultTooltipEventType: l,
                validateTooltipEventTypes: s,
                tooltipPayloadSearcher: c,
                eventEmitter: void 0
            };
        return d.createElement(sx, {
            preloadedState: {
                options: f
            },
            reduxStoreName: (n = i.id) !== null && n !== void 0 ? n : u
        }, d.createElement(I0, {
            chartData: i.data
        }), d.createElement(fx, {
            layout: a,
            margin: i.margin
        }), d.createElement(dx, {
            baseValue: void 0,
            accessibilityLayer: i.accessibilityLayer,
            barCategoryGap: i.barCategoryGap,
            maxBarSize: i.maxBarSize,
            stackOffset: i.stackOffset,
            barGap: i.barGap,
            barSize: i.barSize,
            syncId: i.syncId,
            syncMethod: i.syncMethod,
            className: i.className,
            reverseStackOrder: i.reverseStackOrder
        }), d.createElement(lz, {
            cx: i.cx,
            cy: i.cy,
            startAngle: i.startAngle,
            endAngle: i.endAngle,
            innerRadius: i.innerRadius,
            outerRadius: i.outerRadius
        }), d.createElement(vx, uc({}, o, {
            ref: r
        })))
    });

function im(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function am(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? im(Object(r), !0).forEach(function(n) {
            vz(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : im(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function vz(e, t, r) {
    return (t = pz(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function pz(e) {
    var t = hz(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function hz(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var mz = ["item"],
    yz = am(am({}, rf), {}, {
        layout: "centric",
        startAngle: 0,
        endAngle: 360
    }),
    Kz = d.forwardRef((e, t) => {
        var r = ee(e, yz);
        return d.createElement(px, {
            chartName: "PieChart",
            defaultTooltipEventType: "item",
            validateTooltipEventTypes: mz,
            tooltipPayloadSearcher: pn,
            categoricalChartProps: r,
            ref: t
        })
    });

function om(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function(i) {
            return Object.getOwnPropertyDescriptor(e, i).enumerable
        })), r.push.apply(r, n)
    }
    return r
}

function um(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? om(Object(r), !0).forEach(function(n) {
            gz(e, n, r[n])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : om(Object(r)).forEach(function(n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n))
        })
    }
    return e
}

function gz(e, t, r) {
    return (t = bz(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function bz(e) {
    var t = xz(e, "string");
    return typeof t == "symbol" ? t : t + ""
}

function xz(e, t) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var n = r.call(e, t);
        if (typeof n != "object") return n;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}
var wz = ["axis"],
    Pz = um(um({}, rf), {}, {
        layout: "centric",
        startAngle: 90,
        endAngle: -270
    }),
    Wz = d.forwardRef((e, t) => {
        var r = ee(e, Pz);
        return d.createElement(px, {
            chartName: "RadarChart",
            defaultTooltipEventType: "axis",
            validateTooltipEventTypes: wz,
            tooltipPayloadSearcher: pn,
            categoricalChartProps: r,
            ref: t
        })
    }),
    Oz = ["item"],
    Fz = d.forwardRef((e, t) => d.createElement(_o, {
        chartName: "ScatterChart",
        defaultTooltipEventType: "item",
        validateTooltipEventTypes: Oz,
        tooltipPayloadSearcher: pn,
        categoricalChartProps: e,
        ref: t
    })),
    Az = ["axis"],
    qz = d.forwardRef((e, t) => d.createElement(_o, {
        chartName: "AreaChart",
        defaultTooltipEventType: "axis",
        validateTooltipEventTypes: Az,
        tooltipPayloadSearcher: pn,
        categoricalChartProps: e,
        ref: t
    }));
export {
    qz as A, zz as B, e$ as C, LA as L, Kz as P, Ez as R, Fz as S, Iz as T, pB as X, PB as Y, SB as Z, jL as a, A2 as b, WD as c, wi as d, nB as e, z as f, Wz as g, LT as h, MM as i, mM as j, YN as k, Bz as l, eL as m
};