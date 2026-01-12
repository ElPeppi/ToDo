import "./popupEditGroup.css";
import React, { useEffect, useState } from "react";
import UserSelector from "../../../selector/UserSelector";
import type {UserInterface}  from "../../../../interface/UserInterface";

interface EditGroupProps {
    onClose: () => void;
    setPopup: Function;
    onGroupUpdated: () => void;
    groups: any[];
}

const PopupEditGroup: React.FC<EditGroupProps> = ({ onClose, setPopup, onGroupUpdated,groups }) => {
    const [groupss, setGroups] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);
    useEffect(() => {
        setGroups(groups);
    }, [groups]);
    const handleEditGroup = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/groups/${ (document.getElementById("groupsSelectEdit") as HTMLSelectElement).value}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    name: (document.getElementById("groupNameEdit") as HTMLSelectElement).value,
                    description: (document.getElementById("groupDescriptionEdit") as HTMLTextAreaElement).value,
                    members : selectedUsers.map(user => user.id),
                })
                
            });

            const data = await response.json();

            if (!response.ok) {
                setPopup({ message: data.message || "Error al editar el grupo", type: "error" });
                return;
            }
            // ✔️ Mostrar popup
            setPopup({ message: "Grupo editado con éxito!", type: "success" });
            // ✔️ Refrescar la lista de grupos en ToDo
            onGroupUpdated();
            onClose();
        } catch (error) {
            setPopup({ message: "Error al editar el grupo", type: "error" });
            console.error(error);
        }
    };

    return (
        <div className="popup-edit-group">
            <button onClick={onClose}>×</button>
            <h2>Editar Grupo</h2>
            <select name="groups" id="groupsSelectEdit">
                <option value="" disabled selected>Selecciona un grupo</option>
                {
                    groupss.map((group) => (
                        <option key={group.id} value={group.id}>{group.nombre}</option>
                    ))
                }
            </select>
            <input type="text"
                id="groupNameEdit"
                placeholder="Nombre del grupo"
            />
            <textarea name="desciption" id="groupDescriptionEdit"></textarea>
            <h2>Modificar Miembros</h2>

            <UserSelector
                selected={selectedUsers}
                setSelected={setSelectedUsers}
            />
            <button onClick={handleEditGroup}>Guardar Cambios</button>
        </div>
    );
}
export default PopupEditGroup;