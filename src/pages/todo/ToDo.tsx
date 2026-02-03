import "../todo/ToDo.css";
import { useEffect, useState } from "react";

import PopupCreateGroup from "../../components/pop-ups/group/createGroup/PopupCreateGroup";
import PopupEditGroup from "../../components/pop-ups/group/editGorup/PopupEditGroup";
import PopupEditTask from "../../components/pop-ups/editTasks/EditTask";

import UserSelector from "../../components/selector/UserSelector";
import TaskCard from "../../components/task/TaskCard";

import type { UserInterface } from "../../interface/UserInterface";
import type { GroupInterface } from "../../interface/GroupInterface";
import type { TaskInterface } from "../../interface/TaskInterface";

import { fetchWithAuth } from "../../services/authService";
import { handleLogout } from "../../utils/HandelLogout";

function ToDo({ setPopup }: { setPopup: Function }) {
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high" | "">("");

  const [members, setMembers] = useState<UserInterface[]>([]);
  const [groupId, setGroupId] = useState<number | null>(null);

  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupInterface | null>(null);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);

  const fetchGroups = async () => {
    try {
      const response = await fetchWithAuth("/api/groups");
      const data = await response.json();

      if (!response.ok) {
        setPopup({ message: "Error al cargar grupos", type: "error" });
        return;
      }

      // ✅ Soporta 2 formatos:
      // A) data = { groups: GroupInterface[], tasks: TaskInterface[] }
      // B) data = GroupInterface[]
      const groupsFromApi: GroupInterface[] = Array.isArray(data) ? data : (data.groups ?? []);
      const tasksFromApi: TaskInterface[] = Array.isArray(data) ? [] : (data.tasks ?? []);

      // ✅ No mutar estado, y no usar "groups" viejo
      const groupsWithCount = groupsFromApi.map((g) => {
        const count = tasksFromApi.filter((t: any) => t.group_id === g.id).length;
        return { ...g, task_count: count };
      });

      setGroups(groupsWithCount);

      // ✅ Si el usuario ya tenía un groupId seleccionado, refrescamos selectedGroup
      if (groupId !== null) {
        const found = groupsWithCount.find((g) => g.id === groupId) ?? null;
        setSelectedGroup(found);
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
    return () => window.removeEventListener("app:token-refreshed", onTokenRefreshed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-page", "todo");
    fetchGroups();

    const fetchTasks = async () => {
      try {
        const response = await fetchWithAuth("/api/tasks");
        const data = await response.json();

        if (response.ok) setTasks(data);
        else setPopup({ message: "Error al cargar tareas", type: "error" });
      } catch (error) {
        console.error(error);
        setPopup({ message: "Sesión expirada", type: "info" });
        handleLogout();
      }
    };

    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      const msg = e.detail;
      console.log("Mensaje WS recibido en ToDo:", msg);

      if (msg.type === "task:created" && msg.task) {
        const task = msg.task as TaskInterface;
        setTasks((prev) => (prev.some((t) => t.id === task.id) ? prev : [task, ...prev]));
        setPopup({ message: "Te asignaron una nueva tarea", type: "info" });
      }

      if (msg.type === "task:deleted" && msg.taskId) {
        const taskId = msg.taskId as number;
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setPopup({ message: "Una tarea fue eliminada", type: "info" });
      }

      if (msg.type === "task:updated" && msg.task) {
        const updatedTask = msg.task as TaskInterface;
        const taskId = updatedTask.id;

        const newIds = Array.isArray(msg.newCollaboratorIds) ? msg.newCollaboratorIds : [];
        const prevIds = Array.isArray(msg.previousCollaboratorIds) ? msg.previousCollaboratorIds : [];

        const currentUserId = parseInt(localStorage.getItem("userId") || "0", 10);

        const wasInvolvedBefore = prevIds.includes(currentUserId);
        const isInvolvedNow = newIds.includes(currentUserId);

        if (!wasInvolvedBefore && isInvolvedNow) {
          setPopup({ message: "Fuiste agregado a una tarea", type: "info" });
          setTasks((prev) => (prev.some((t) => t.id === taskId) ? prev : [updatedTask, ...prev]));
          return;
        }

        if (wasInvolvedBefore && !isInvolvedNow) {
          setPopup({ message: "Te removieron de una tarea", type: "info" });
          setTasks((prev) => prev.filter((t) => t.id !== taskId));
          return;
        }

        if (isInvolvedNow) {
          setPopup({ message: "Tarea actualizada", type: "info" });
          setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
        }
      }
    };

    window.addEventListener("app:ws-message", handler);
    return () => window.removeEventListener("app:ws-message", handler);
  }, [setPopup]);

  const addTask = async () => {
    if (title.trim() === "") return;

    try {
      const response = await fetchWithAuth("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          dueDate,
          groupId,
          members: members.map((u) => u.id),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTasks((prev) => [...prev, data]);

        setTitle("");
        setDescription("");
        setDueDate("");
        setMembers([]);
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

      setTasks((prev) => prev.filter((_, i) => i !== index));
      setPopup({ message: "Tarea eliminada!", type: "success" });
    } catch (e) {
      console.error(e);
      setPopup({ message: "Sesión expirada", type: "info" });
      handleLogout();
    }
  };

  return (
    <div className="todo-page">
      <h1>To-Do List</h1>

      <button onClick={() => handleLogout()} className="logout-btn">
        Logout
      </button>

      {showCreateGroup && (
        <PopupCreateGroup
          onClose={() => setShowCreateGroup(false)}
          setPopup={setPopup}
          onGroupCreated={fetchGroups}
        />
      )}

      {showEditGroup && selectedGroup && (
        <PopupEditGroup
          onClose={() => setShowEditGroup(false)}
          setPopup={setPopup}
          onGroupUpdated={fetchGroups}
          group={selectedGroup} // ✅ SOLO UN GRUPO
        />
      )}

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
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Descripción de la tarea..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

          <UserSelector selected={members} setSelected={setMembers} />

          <select
            name="Grupos"
            id="GruposSelect"
            value={groupId ?? ""}
            onChange={(e) => {
              const id = e.target.value ? Number(e.target.value) : null;
              setGroupId(id);

              const found = id ? groups.find((g) => g.id === id) ?? null : null;
              setSelectedGroup(found);
            }}
          >
            <option value="">Selecciona un grupo</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select name="priority" id="prioritySelect" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
            <option value="">Selecciona una prioridad</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          

          <button
            onClick={() => {
              if (!selectedGroup) {
                setPopup({ message: "Selecciona un grupo primero", type: "info" });
                return;
              }
              setShowEditGroup(true);
            }}
          >
            Editar Grupo
          </button>

          <button onClick={() => setShowCreateGroup(true)}>Crear Grupo</button>

          <button onClick={addTask}>+</button>
        </div>

        <div className="todo-list">
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
        </div>
      </div>
    </div>
  );
}

export default ToDo;
