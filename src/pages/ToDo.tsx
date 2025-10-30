
import "../styles/todo/ToDo.css";
import { useNavigate } from "react-router-dom";

function ToDo() {
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