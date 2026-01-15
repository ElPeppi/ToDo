import "./editTask.css";
import React, { useState } from "react";
import { fetchWithAuth } from "../../../services/authService";
import UserSelector from "../../selector/UserSelector";
import type { UserInterface } from "../../../interface/UserInterface";

interface EditTaskProps {
    taskId: number;
    onClose: () => void;
    setPopup: Function;
    onTastkUpdated: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ taskId, onClose, setPopup, onTastkUpdated }) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDueDate, setTaskDueDate] = useState("");
    const [members, setMembers] = useState<UserInterface[]>([]);

    const handleEditTask = async () => {
        console.log("Editing task:", taskId, taskTitle, taskDescription, taskDueDate);
        try {
            const response = await fetchWithAuth(`/api/tasks/${taskId}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: taskTitle,
                    description: taskDescription,
                    dueDate: taskDueDate,
                    estado: "pending",
                    members: members.map((member) => member.id),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPopup({ message: data.message || "Error al editar la tarea", type: "error" });
                return;
            }

            setPopup({ message: "Tarea editada con éxito!", type: "success" });
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
            <UserSelector
                selected={members}
                setSelected={setMembers}
            />
            <button onClick={handleEditTask}>Guardar Cambios</button>
        </div>
    );
};

export default EditTask;