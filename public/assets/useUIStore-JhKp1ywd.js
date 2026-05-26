import {
    d as e
} from "./App-pJGjDiPw.js";
const n = e((s, o) => ({
    isQuickChatOpen: !1,
    toggleQuickChat: a => {
        const i = a !== void 0 ? a : !o().isQuickChatOpen;
        s({
            isQuickChatOpen: i
        })
    },
    isTaskModalOpen: !1,
    toggleTaskModal: a => {
        const i = a !== void 0 ? a : !o().isTaskModalOpen;
        s({
            isTaskModalOpen: i
        })
    },
    isExamModalOpen: !1,
    toggleExamModal: a => {
        const i = a !== void 0 ? a : !o().isExamModalOpen;
        s({
            isExamModalOpen: i
        })
    },
    isQuickActionsOpen: !1,
    toggleQuickActions: a => {
        const i = a !== void 0 ? a : !o().isQuickActionsOpen;
        s({
            isQuickActionsOpen: i
        })
    }
}));
export {
    n as u
};