import "./editTask.css";
import React, { useState } from "react";

interface EditTaskProps {
    onClose: () => void;
    setPopup: Function;
    onTastkUpdated: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ onClose, setPopup, onTastkUpdated }) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDueDate, setTaskDueDate] = useState("");
    const handleEditTask = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    title: taskTitle,
                    description: taskDescription,
                    dueDate: taskDueDate
                })
            });
            const data = await response.json();

            if (!response.ok) {
                setPopup({ message: data.message || "Error al editar la tarea", type: "error" });
                return;
            }
            // ✔️ Mostrar popup
            setPopup({ message: "Tarea editada con éxito!", type: "success" });
            // ✔️ Refrescar la lista de tareas en ToDo
            onTastkUpdated();
            onClose();
        } catch (error) {
            setPopup({ message: "Error al editar la tarea", type: "error" });
        }
    };

    return (
        <div className="edit-task-popup">
            <button onClick={onClose}>×</button>
            <h2>Editar Tarea</h2>
            <input
                type="text"
                placeholder="Título de la tarea"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
            />
            <textarea
                placeholder="Descripción de la tarea"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
            />
            <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <button onClick={handleEditTask}>Guardar Cambios</button>
        </div>
    );
};

export default EditTask;