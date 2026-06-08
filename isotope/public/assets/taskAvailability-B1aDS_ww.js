import {
    e as t,
    p as o
} from "./useFocusStore-CX_Nyp1h.js";

function s(e, a = new Date) {
    return e.releaseDate ? t(e.releaseDate, a) <= 0 : !0
}

function l(e, a = new Date) {
    const r = t(e, a),
        n = o(e);
    return r < 0 ? "Available" : r === 0 ? "Available today" : r === 1 ? "Unlocks tomorrow" : r <= 7 ? `Unlocks in ${r}d` : `Unlocks ${n.toLocaleDateString(void 0,{month:"short",day:"numeric"})}`
}
export {
    l as f, s as i
};