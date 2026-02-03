import {useEffect, useState } from "react";
import type { UserInterface } from "../../interface/UserInterface";

function Porfile({ setPopup }: { setPopup: Function }) {
    const [user, setUser] = useState<UserInterface | null>(null);
    useEffect(() => {
        document.documentElement.setAttribute("data-page", "porfile");
    }, []);
    useEffect(() => {
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        } 
        
    }, [setPopup]);


        return (
            <div className="porfile-page">
                <h1>{user?.name}</h1>
                <p>Email: {user?.email}</p>
            
            </div>
        );
    }

export default Porfile;