import "../todo/ToDo.css";
import PopupCreateGroup from "../../components/pop-ups/group/createGroup/PopupCreateGroup";
import PopupEditGroup from "../../components/pop-ups/group/editGorup/PopupEditGroup";
import PopupEditTask from "../../components/pop-ups/editTasks/EditTask";
import { useEffect, useState } from "react";
import UserSelector from "../../components/selector/UserSelector";
import type { UserInterface } from "../../interface/UserInterface";
import type { GroupInterface } from "../../interface/GroupInterface";
import type { TaskInterface } from "../../interface/TaskInterface";
import TaskCard from "../../components/task/TaskCard";
import { fetchWithAuth } from "../../services/authService";
import { handleLogout } from "../../utils/HandelLogout";



function ToDo({ setPopup }: { setPopup: Function }) {
    const [tasks, setTasks] = useState<TaskInterface[]>([]);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [members, setMembers] = useState<UserInterface[]>([]);
    const [groupId, setGroupId] = useState<number | null>(null);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showEditGroup, setShowEditGroup] = useState(false);
    const [showEditTask, setShowEditTask] = useState(false);
    const [groups, setGroups] = useState<GroupInterface[]>([]);

    const fetchGroups = async () => {
        try {
            const response = await fetchWithAuth("/api/groups");
            const data = await response.json();
            if (response.ok) {
                setGroups(data);
            } else {
                setPopup({ message: "Error al cargar grupos", type: "error" });
            }
        } catch (e) {
            console.error(e);
            setPopup({ message: "Sesión expirada", type: "info" });
            handleLogout();
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
            handleLogout();
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
                handleLogout();
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
            handleLogout();
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
            handleLogout();
        }
    };

    return (<>

        <div className="todo-page">
            <h1>To-Do List</h1>
            <button
                onClick={() => { handleLogout(); }}
                className="logout-btn"
            >
                Logout
            </button>

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
            {showEditTask && editingTaskId !== null && (
                <PopupEditTask
                    onClose={() => {
                        setShowEditTask(false);
                        setEditingTaskId(null);
                    }}
                    setPopup={setPopup}
                    onTastkUpdated={fetchUpdateTask}
                    taskId={editingTaskId}
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
                            <TaskCard
                                task={task}
                                groups={groups}
                                onEdit={() => {
                                    setEditingTaskId(task.id);
                                    setShowEditTask(true);
                                }}
                                onDelete={() => removeTask(i)}
                            />
                        </li>

                    ))}
                </ul>

            </div>
        </div>
    </>);
}

export default ToDo;