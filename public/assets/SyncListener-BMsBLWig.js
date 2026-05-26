import {
    r as h
} from "./vendor-react-BfU3Zn2J.js";
import {
    j as S,
    u,
    h as b,
    k
} from "./useFocusStore-CX_Nyp1h.js";
import {
    h as p
} from "./App-pJGjDiPw.js";
import {
    a as l,
    b as g
} from "./useAIStore-B2cv1FZz.js";
import "./index-BPYJFSVW.js";
import "./useNotificationStore-BS4df28T.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-motion-Cp_NPzpZ.js";
import "./vendor-icons-CqruUz7g.js";
import "./vendor-router-CmoTwRnm.js";
const v = () => {
    const r = S(e => e.refreshFromStorage),
        t = u(e => e.refreshFromStorage),
        o = b(e => e.refreshFromStorage),
        a = p(e => e.refreshFromStorage),
        c = l(e => e.refreshFromStorage),
        s = k(e => e.refreshFromStorage),
        i = g(e => e.refreshFromStorage);
    return h.useEffect(() => {
        const e = n => {
            const f = n.detail,
                {
                    collection: m
                } = f || {};
            switch (m) {
                case "tasks":
                    r();
                    break;
                case "subjects":
                    t();
                    break;
                case "focus_sessions":
                    o();
                    break;
                case "profile":
                    a();
                    break;
                case "habits":
                    c();
                    break;
                case "exams":
                    s("exams");
                    break;
                case "tests":
                    s("tests");
                    break;
                case "mock_tests":
                    s("mockTests");
                    break;
                case "daily_logs":
                    i();
                    break;
                default:
                    r(), t(), o();
                    break
            }
        };
        return window.addEventListener("isotope:sync_refresh", e), () => window.removeEventListener("isotope:sync_refresh", e)
    }, [r, t, o, a, c, s, i]), null
};
export {
    v as SyncListener
};