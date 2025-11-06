
import "../todo/ToDo.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ToDo() {
    useEffect(() => {
        document.documentElement.setAttribute("data-page", "todo");
    }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
    };

    return (<>

        <div>
            <h1>To-Do List</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    </>);
}

export default ToDo;