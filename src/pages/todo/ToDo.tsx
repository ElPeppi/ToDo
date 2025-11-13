
import "../todo/ToDo.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Menu from "../../components/menu/Menu";



function ToDo({ setPopup }: { setPopup: Function }) {
    const [tasks, setTasks] = useState<string[]>([]);
    const [tittle, setTittle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const addTask = async () => {
        if (tittle.trim() === "") return;
        try {
            const response = await fetch("http://localhost:4000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    title: tittle,         // 👈 debe coincidir con el backend
                    description: description,
                    dueDate: dueDate,
                }),

            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {

                setTasks([...tasks, tittle]);
                setTittle("");
                setDescription("");
                setDueDate("");
                setPopup({ message: "Tarea agregada exitosamente!", type: "success" });
            } else {
                setPopup({ message: data.message || "Error al agregar tarea", type: "error" });
            }
        } catch (error) {
            setPopup({ message: "Error al agregar tarea", type: "error" });
        }
    };


    const removeTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };
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

        <div className="todo-page">
            <header className="todo-header">
                <h1>To-Do List</h1>
                <button
                    onClick={() => { handleLogout(); }}
                    className="logout-btn"
                >
                    Logout
                </button>
            </header>
            <Menu />
            <div className="todo-container">
                <div className="todo-input-box">

                    <input
                        type="text"
                        placeholder="Titulo de la tarea..."
                        value={tittle}
                        onChange={e => setTittle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Descripción de la tarea..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                    />
                    <select name="Grupos" id="GruposSelect">
                        <option value="">Selecciona un grupo</option>
                    </select>
                    <button>Crear Grupo</button>
                    <button onClick={addTask}>+</button>

                </div>

                <ul className="todo-list">
                    {tasks.map((task, i) => (
                        <li key={i} className="todo-item">
                            <span>{task}</span>
                            <button onClick={() => removeTask(i)} className="delete-btn">
                                ✖
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </>);
}

export default ToDo;