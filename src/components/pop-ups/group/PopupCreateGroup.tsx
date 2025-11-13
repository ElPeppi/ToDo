import "./popupCreateGroup.css";
import UserSelector from "../../selector/UserSelector";
import React , {useState} from "react";

interface PopupCreateGroupProps {
    onClose: () => void;
}
const PopupCreateGroup: React.FC<PopupCreateGroupProps> = ({ onClose }) => {
    const [groupName, setGroupName] = useState("");
    
    const handleCreateGroup = () => {

        onClose();
    }
    return (
        <div className="popup-create-group">
            <button onClick={onClose}>×</button>
            <h2>Crear Nuevo Grupo</h2>
            <input type="text" placeholder="Nombre del grupo" />
            <h2>Añadir Miembros</h2>
            <UserSelector users={[]} selected={[]} setSelected={() => {}} />
            <button onClick={handleCreateGroup}>Crear Grupo</button>
        </div>
    );
};

export default PopupCreateGroup;