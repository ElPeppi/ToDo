import { closeWS } from "../realtime/ws";

export const handleLogout = () => {
        closeWS();
        window.dispatchEvent(new Event("app:logout"));
    };