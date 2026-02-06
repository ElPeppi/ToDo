import {useEffect, useState } from "react";
import type { UserInterface } from "../../interface/UserInterface";

function Profile({ setPopup }: { setPopup: Function }) {
    const [user, setUser] = useState<UserInterface | null>(null);
    useEffect(() => {
        document.documentElement.setAttribute("data-page", "profile");
    }, []);
    useEffect(() => {
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        } 
        
    }, [setPopup]);


        return (
            <div className="porfile-page">
                <div className="photo">
                    {user && user.photo ? (
                        <img src={user.photo
} alt="User Profile" />
                    ) : (
                        <div className="placeholder-photo">{user ? user.name.charAt(0).toUpperCase() : "U"}</div>
                    )}
                </div>
                <div className="tasks-info">
                    <div className="total-task">
                        <p>{user ? user.tasks : 0}</p>
                        <h3>Total de Tareas</h3>
                    </div>
                    <div className="completed-task">
                        <p>{user ? user.completedTasks : 0}</p>
                        <h3>Tareas Completadas</h3>
                    </div>
                    <div className="pending-task">
                        <p>{user ? user.pendingTasks : 0}</p>
                        <h3>Tareas Pendientes</h3>
                    </div>
                    <div className="completed-rate">
                        <p>{user ? user.completionRate : 0}%</p>
                        <h3>Tasa de Completación</h3>
                    </div>
                </div>
                <div className="account-information"></div>
            
            </div>
        );
    }

export default Profile;