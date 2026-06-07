import {
    r as t
} from "./vendor-react-BfU3Zn2J.js";
import {
    h as s
} from "./useFocusStore-CX_Nyp1h.js";
import "./index-BPYJFSVW.js";
import "./App-pJGjDiPw.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-motion-Cp_NPzpZ.js";
import "./vendor-icons-CqruUz7g.js";
import "./vendor-router-CmoTwRnm.js";
import "./useNotificationStore-BS4df28T.js";
const k = () => {
    const {
        timerState: e,
        tick: n,
        restoreTimerState: o
    } = s(), r = t.useRef(null), i = t.useRef(0);
    return t.useEffect(() => {
        o()
    }, [o]), t.useEffect(() => ((e === "running" || e === "break") && (r.current = setInterval(() => {
        n(), i.current = Date.now()
    }, 1e3)), () => {
        r.current && (clearInterval(r.current), r.current = null)
    }), [e, n]), null
};
export {
    k as
    default
};