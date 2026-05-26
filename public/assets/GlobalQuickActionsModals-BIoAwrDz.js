import {
    j as o
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as m
} from "./useUIStore-JhKp1ywd.js";
import {
    T as a
} from "./TaskCardModal-DZvd1GWt.js";
import {
    E as e
} from "./ExamCreateEditModal-BdlzfeFO.js";
import {
    A as p
} from "./vendor-motion-Cp_NPzpZ.js";
import "./App-pJGjDiPw.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-icons-CqruUz7g.js";
import "./vendor-router-CmoTwRnm.js";
import "./useFocusStore-CX_Nyp1h.js";
import "./useNotificationStore-BS4df28T.js";
import "./useAIStore-B2cv1FZz.js";
import "./utils-D8mZnxMk.js";
import "./vendor-charts-CFLJvnG7.js";
import "./timeFormat-CMPo-BX2.js";
import "./taskAvailability-B1aDS_ww.js";
const I = () => {
    const {
        isTaskModalOpen: t,
        toggleTaskModal: s,
        isExamModalOpen: r,
        toggleExamModal: i
    } = m();
    return o.jsxs(o.Fragment, {
        children: [o.jsx(a, {
            isOpen: t,
            onClose: () => s(!1),
            taskId: null
        }), o.jsx(p, {
            children: r && o.jsx(e, {
                isOpen: r,
                onClose: () => i(!1),
                prefillType: "mock"
            })
        })]
    })
};
export {
    I as GlobalQuickActionsModals, I as
    default
};