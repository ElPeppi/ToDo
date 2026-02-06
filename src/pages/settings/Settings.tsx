import { useEffect } from "react";

function Settings({ setPopup }: { setPopup: Function }) {
    useEffect(() => {
        document.documentElement.setAttribute("data-page", "settings");
        setPopup({ message: "settings", type: "success" });
    }, []);
    return (
        <div>Settings</div>
        
    );
}

export default Settings;