import "./popupEditGroup.css";
import { useEffect, useState } from "react";
import UserSelector from "../../../selector/UserSelector";
import type { UserInterface } from "../../../../interface/UserInterface";
import type { GroupInterface } from "../../../../interface/GroupInterface";
import { fetchWithAuth } from "../../../../services/authService";

type EditGroupProps = {
  onClose: () => void;
  setPopup: Function;
  onGroupUpdated: () => Promise<void>;
  group: GroupInterface;
};

export default function PopupEditGroup({ onClose, setPopup, onGroupUpdated, group }: EditGroupProps) {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);

  useEffect(() => {
    setName(group.name);
    setDescription(group.description);
    setSelectedUsers([]); // opcional: limpia selección cuando cambias de grupo
  }, [group]);

  const handleEditGroup = async () => {
    try {
      const response = await fetchWithAuth(`/api/groups/${group.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          description,
          members: selectedUsers.map((u) => u.id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPopup({ message: data.message || "Error al editar el grupo", type: "error" });
        return;
      }

      setPopup({ message: "Grupo editado con éxito!", type: "success" });
      await onGroupUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      setPopup({ message: "Error al editar el grupo", type: "error" });
    }
  };

  return (
    <div className="popup-edit-group">
      <button onClick={onClose}>×</button>
      <h2>Editar Grupo</h2>

      <input
        type="text"
        placeholder="Nombre del grupo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      

      <h2>Modificar Miembros</h2>

      <UserSelector selected={selectedUsers} setSelected={setSelectedUsers} />

      <button onClick={handleEditGroup}>Guardar Cambios</button>
    </div>
  );
}
