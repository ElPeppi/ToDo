import type { GroupInterface } from "../../interface/GroupInterface";

interface Props {
    group: GroupInterface;
    onEdit: () => void;
    onDelete: () => void;
    onAddMembers: () => void;
    onDeleteMembers: () => void;
}

export default function GroupCard({ group, onEdit, onDelete, onAddMembers, onDeleteMembers }: Props) {
    const handleClick = () => {
        console.log("Group card clicked" + group);
    };
    const handelHover = () => {
        // Handle hover event
    }

    return (
        <div onClick={handleClick} onMouseOver={handelHover} className="group-card">
            <div className="group-id">{group.id}</div>
            <div className="group-header">
                <h3>{group.name}</h3>
            </div>
            <div className="group-body">
                <p>{group.description}</p>
            </div>
            <div className="group-actions">
                <button className="add-members">add members</button>
                <button className="delete-members">delete members</button>
                <button className="edit-btn">edit</button>
                <button className="delete-btn">delete</button>
            </div>
        </div>
    );
}