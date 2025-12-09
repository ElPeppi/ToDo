import { useEffect } from "react";

function Settings({setPopup}: {setPopup: Function}){
    useEffect(() =>{
        document.documentElement.setAttribute("data-page", "settings");
    },[]);
    return <div>Settings Page</div>;
}

export default Settings;