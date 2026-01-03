import "./popupCreateGroup.css";
import UserSelector from "../../../selector/UserSelector";
import React, { useState } from "react";
import type {User}  from "../../../../interface/UserInterface";

interface PopupCreateGroupProps {
    onClose: () => void;
}

interface PopupCreateGroupProps {
    onClose: () => void;
    setPopup: Function;
    onGroupCreated: () => void;
}

const PopupCreateGroup: React.FC<PopupCreateGroupProps> = ({ onClose, setPopup, onGroupCreated }) => {
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const handleCreateGroup = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    name: groupName,
                    members: selectedUsers.map(user => user.id)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setPopup({ message: data.message || "Error al crear el grupo", type: "error" });
                return;
            }

            // ✔️ Mostrar popup
            setPopup({ message: "Grupo creado con éxito!", type: "success" });

            // ✔️ Refrescar la lista de grupos en ToDo
            onGroupCreated();

            onClose();

        } catch (error) {
            setPopup({ message: "Error al crear el grupo", type: "error" });
        }
    };

    return (
        <div className="popup-create-group">
            <button onClick={onClose}>×</button>
            <h2>Crear Nuevo Grupo :D</h2>

            <input
                type="text"
                placeholder="Nombre del grupo"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />

            <h2>Añadir Miembros</h2>

            <UserSelector
                selected={selectedUsers}
                setSelected={setSelectedUsers}
            />

            <button onClick={handleCreateGroup}>Crear Grupo</button>
        </div>
    );
};


export default PopupCreateGroup;