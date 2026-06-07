import {
    r as n
} from "./vendor-react-BfU3Zn2J.js";

function a() {
    const [r, t] = n.useState(navigator.onLine), [e, i] = n.useState(!1);
    return n.useEffect(() => {
        const s = () => {
                t(!0), e && i(!1)
            },
            o = () => {
                t(!1), i(!0)
            };
        return window.addEventListener("online", s), window.addEventListener("offline", o), () => {
            window.removeEventListener("online", s), window.removeEventListener("offline", o)
        }
    }, [e]), {
        isOnline: r,
        wasOffline: e
    }
}
export {
    a as u
};