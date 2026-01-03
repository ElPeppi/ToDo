import "../todo/ToDo.css";
import PopupCreateGroup from "../../components/pop-ups/group/createGroup/PopupCreateGroup";
import PopupEditGroup from "../../components/pop-ups/group/editGorup/PopupEditGroup";
import PopupEditTask from "../../components/pop-ups/tasks/editTasks/EditTask";
import { useEffect, useState } from "react";
import UserSelector from "../../components/selector/UserSelector";
import type { User } from "../../interface/UserInterface";
import type { Group } from "../../interface/GroupInterface";
import type { Task } from "../../interface/TaskInterface";
import { fetchWithAuth } from "../../services/authService";



function ToDo({ setPopup }: { setPopup: Function }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [members, setMembers] = useState<User[]>([]);
    const [groupId, setGroupId] = useState<number | null>(null);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showEditGroup, setShowEditGroup] = useState(false);
    const [showEditTask, setShowEditTask] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);

    const fetchGroups = async () => {
        try {
            const response = await fetchWithAuth("/api/groups");
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setGroups(data);
            } else {
                setPopup({ message: "Error al cargar grupos", type: "error" });
            }
        } catch (e) {
            console.error(e);
            setPopup({ message: "Sesión expirada", type: "info" });
        }
    };

    const fetchUpdateTask = async () => {
        try {
            const response = await fetchWithAuth("/api/tasks");
            const data = await response.json();

            if (response.ok) {
                setTasks(data);
            } else {
                setPopup({ message: "Error al cargar tareas", type: "error" });
            }
        } catch (e) {
            console.error(e);
            setPopup({ message: "Sesión expirada", type: "info" });
        }
    };

    useEffect(() => {
        const onTokenRefreshed = () => {
            fetchGroups();
            fetchUpdateTask();
        };

        window.addEventListener("app:token-refreshed", onTokenRefreshed);

        return () => {
            window.removeEventListener("app:token-refreshed", onTokenRefreshed);
        };
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-page", "todo");
        fetchGroups();

        const fetchTasks = async () => {
            try {
                const response = await fetchWithAuth("/api/tasks");

                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setTasks(data);
                } else {
                    setPopup({ message: "Error al cargar tareas", type: "error" });
                }
            } catch (error) {
                // ⬇️ aquí entra si el refresh falló → logout automático
                console.error(error);
                setPopup({ message: "Sesión expirada", type: "info" });
            }
        };

        fetchTasks();
    }, []);

    const addTask = async () => {
        if (title.trim() === "") return;

        try {
            const response = await fetchWithAuth("/api/tasks", {
                method: "POST",
                body: JSON.stringify({
                    title: title,
                    description,
                    dueDate,
                    groupId,
                    members: members.map(u => u.id),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setTasks(prev => [...prev, data]);
                setTitle("");
                setDescription("");
                setDueDate("");
                setPopup({ message: "Tarea agregada exitosamente!", type: "success" });
            } else {
                setPopup({ message: data.message || "Error al agregar tarea", type: "error" });
            }
        } catch (e) {
            console.error(e);
            setPopup({ message: "Sesión expirada", type: "info" });
        }
    };

    const removeTask = async (index: number) => {
        const taskId = tasks[index].id;

        try {
            const response = await fetchWithAuth(`/api/tasks/${taskId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                setPopup({ message: data.message || "Error al eliminar tarea", type: "error" });
                return;
            }

            setTasks(tasks.filter((_, i) => i !== index));
            setPopup({ message: "Tarea eliminada!", type: "success" });
        } catch (e) {
            console.error(e);
            setPopup({ message: "Sesión expirada", type: "info" });
        }
    };

    const handleLogout = () => {
        window.dispatchEvent(new Event("app:logout"));
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
            {showCreateGroup && (
                <PopupCreateGroup
                    onClose={() => setShowCreateGroup(false)}
                    setPopup={setPopup}
                    onGroupCreated={fetchGroups}  // LO AÑADIREMOS LUEGO
                />
            )}
            {
                showEditGroup && (
                    <PopupEditGroup
                        onClose={() => setShowEditGroup(false)}
                        setPopup={setPopup}
                        onGroupUpdated={fetchGroups}  // LO AÑADIREMOS LUEGO
                        groups={groups}
                    />
                )
            }
            {showEditTask && (
                <PopupEditTask
                    onClose={() => setShowEditTask(false)}
                    setPopup={setPopup}
                    onTastkUpdated={fetchUpdateTask}
                />
            )}


            <div className="todo-container">
                <div className="todo-input-box">

                    <input
                        type="text"
                        placeholder="Titulo de la tarea..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Descripción de la tarea..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                    />
                    <UserSelector
                        selected={members}
                        setSelected={setMembers}
                    />
                    <select
                        name="Grupos"
                        id="GruposSelect"
                        onChange={e => setGroupId(Number(e.target.value))}>
                        <option value="">Selecciona un grupo</option>
                        {groups.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                    <button onClick={() => setShowEditGroup(true)}>Editar Grupo</button>
                    <button onClick={() => setShowCreateGroup(true)}>Crear Grupo</button>
                    <button onClick={addTask}>+</button>

                </div>

                <ul className="todo-list">
                    {tasks.map((task: any, i: number) => (
                        <li key={task.id} className="todo-item">
                            <div>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>{groups.map((g) => (
                                    g.id == task.group_id ? g.name : ""
                                ))}</p>
                                <p>{task.status}</p>
                                <small>Vence: {task.dueDate?.split("T")[0]}</small>
                            </div>
                            <button onClick={() => setShowEditTask(true)} className="edit-btn">

                            </button>
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