import {
    r as s
} from "./AppAccessGate-B975UtK7.js";
import {
    y as m,
    z as n,
    A as c,
    B as r,
    D as a,
    C as e,
    E as i,
    F as p
} from "./App-pJGjDiPw.js";
import "./vendor-react-BfU3Zn2J.js";
import "./index-BPYJFSVW.js";
import "./useOnlineStatus-BJOTUERN.js";
import "./TaskController-BUyiMYKC.js";
import "./useAIStore-B2cv1FZz.js";
import "./useFocusStore-CX_Nyp1h.js";
import "./useNotificationStore-BS4df28T.js";
import "./index-B45N-99N.js";
import "./endOfDay-CZDDeNMb.js";
import "./useSyncStore-vWs_TdIc.js";
import "./vendor-icons-CqruUz7g.js";
import "./QueryProvider-DusNhG9D.js";
import "./vendor-query-Rjz85D0S.js";
import "./vendor-router-CmoTwRnm.js";
import "./NetworkRequiredState-O9ZdVBEy.js";
import "./utils-D8mZnxMk.js";
import "./vendor-charts-CFLJvnG7.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-motion-Cp_NPzpZ.js";
let o = null;
const l = async () => {
        try {
            const t = await c.getUserProfile();
            r({
                accentColor: t ?.personalization ?.accentColor ?? p,
                dyslexiaFont: t ?.personalization ?.dyslexiaFont ?? i,
                performanceMode: t ?.settings ?.performanceMode ?? e,
                theme: t ?.settings ?.theme ?? a
            })
        } catch {
            r({
                accentColor: p,
                dyslexiaFont: i,
                performanceMode: e,
                theme: a
            })
        }
    },
    S = async () => (o || (o = (async () => {
        await s(), await m(), await n(), await l()
    })()), o);
export {
    S as bootstrapApp
};