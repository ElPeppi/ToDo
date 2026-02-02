import type { GroupInterface } from "../../interface/GroupInterface";
import "./groupCard.css";

interface Props {
  group: GroupInterface;
  onEdit: () => void;
  onDelete: () => void;
  onAddMembers?: () => void;
  onDeleteMembers?: () => void;
}

export default function GroupCard({
  group,
  onEdit,
  onDelete,
  onAddMembers,
  onDeleteMembers,
}: Props) {
  const handleClick = () => {
    console.log("Group card clicked:", group); // 👈 mejor log
  };

  return (
    <div onClick={handleClick} className="group-card">
      <div className="group-id">{group.id}</div>

      <div className="group-header">
        <h3>{group.name}</h3>
      </div>

      <div className="group-body">
        <p>{group.description}</p>
        <p>Tasks: {group.task_count ?? 0}</p>
      </div>

      <div className="group-actions">
        <button
          className="add-members"
          onClick={(e) => {
            e.stopPropagation();
            onAddMembers?.();
          }}
        >
          add members
        </button>

        <button
          className="delete-members"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteMembers?.();
          }}
        >
          delete members
        </button>

        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          edit
        </button>

        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          delete
        </button>
      </div>
    </div>
  );
}
