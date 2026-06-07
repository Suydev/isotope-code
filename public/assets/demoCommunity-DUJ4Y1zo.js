import {
    v as o
} from "./App-pJGjDiPw.js";
const m = () => o.getData().community,
    n = t => t ? m().groups.find(e => e.id === t || e.slug === t) ?? null : null,
    a = t => n(t) ?.id ?? t;
export {
    n as a, a as b, m as g
};