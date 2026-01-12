import type { TaskInterface } from "../../interface/TaskInterface";
import type { GroupInterface } from "../../interface/GroupInterface";
import "./TaskCard.css";

type Props = {
  task: TaskInterface;
  groups: GroupInterface[];
  onEdit: () => void;
  onDelete: () => void;
};


export default function TaskCard({ task, groups, onEdit, onDelete }: Props) {
  const groupName = groups.find(g => g.id === task.group_id)?.name ?? ""; 

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>

        <div className="task-actions">
          <button onClick={onEdit} className="edit-btn">✏️</button>
          <button onClick={onDelete} className="delete-btn">✖</button>
        </div>
      </div>
      <p>{task.createdBy}</p>
      <p>{task.description}</p>

      {groupName && <p>{groupName}</p>}

      {task.members?.length ? (
        <div>
          <strong>Miembros:</strong>
          <ul>
            {task.members.map((m) => (
              <li key={m.id}>
                {m.name} <small>({m.email})</small>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p>{task.status}</p>
      <small>Vence: {task.dueDate?.split("T")[0]}</small>
      
    </div>
  );
}
