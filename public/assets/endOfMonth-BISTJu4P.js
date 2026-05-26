import {
    t as r
} from "./useFocusStore-CX_Nyp1h.js";

function a(e, o) {
    const t = r(e, o ?.in),
        n = t.getMonth();
    return t.setFullYear(t.getFullYear(), n + 1, 0), t.setHours(23, 59, 59, 999), t
}
export {
    a as e
};