
import "../todo/ToDo.css";
import { useNavigate } from "react-router-dom";
import PopupCreateGroup from "../../components/pop-ups/group/PopupCreateGroup";
import { useEffect, useState } from "react";
import Menu from "../../components/menu/Menu";


interface User {
    id: number;
    name: string;
    email: string;
}
function ToDo({ setPopup }: { setPopup: Function }) {
    const [tasks, setTasks] = useState<any[]>([]);
    const [tittle, setTittle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [groups, setGroups] = useState<any[]>([]);
    const fetchGroups = async () => {
        const response = await fetch("http://localhost:4000/api/groups", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        const data = await response.json();
        console.log("Fetched groups:", data);
        if (response.ok) {
            setGroups(data);
        }
    };


    useEffect(() => {
        document.documentElement.setAttribute("data-page", "todo");
        fetchGroups();
        const fetchTasks = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/tasks", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setTasks(data); // 🟢 adapta al nombre exacto en BD
                } else {
                    setPopup({ message: "Error al cargar tareas", type: "error" });
                }
            } catch (error) {
                setPopup({ message: "Error de conexión con el servidor", type: "error" });
            }
        };

        fetchTasks();
    }, []);

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


    const removeTask = async (index: number) => {
        const taskId = tasks[index].id;

        try {
            const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setPopup({ message: data.message || "Error al eliminar tarea", type: "error" });
                return;
            }

            // Quitar tarea del estado
            setTasks(tasks.filter((_, i) => i !== index));
            setPopup({ message: "Tarea eliminada!", type: "success" });

        } catch (error) {
            setPopup({ message: "Error de conexión al eliminar", type: "error" });
        }
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
            {showCreateGroup && (
                <PopupCreateGroup
                    onClose={() => setShowCreateGroup(false)}
                    setPopup={setPopup}
                    onGroupCreated={fetchGroups}  // LO AÑADIREMOS LUEGO
                />
            )}


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
                        {groups.map((g) => (
                            <option key={g.id} value={g.id}>{g.nombre}</option>
                        ))}
                    </select>

                    <button onClick={() => setShowCreateGroup(true)}>Crear Grupo</button>
                    <button onClick={addTask}>+</button>

                </div>

                <ul className="todo-list">
                    {tasks.map((task: any, i: number) => (
                        <li key={i} className="todo-item">
                            <div>
                                <h3>{task.titulo}</h3>
                                <p>{task.descripcion}</p>
                                <small>Vence: {task.fecha_vencimiento?.split("T")[0]}</small>
                            </div>
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