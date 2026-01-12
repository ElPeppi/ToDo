import type { TaskInterface } from "../../interface/TaskInterface";
import type { GroupInterface } from "../../interface/GroupInterface";

interface Props {
    task: TaskInterface;
    groups: GroupInterface[];
}

export default function GroupCard({ task, groups }: Props) {
    const handleClick = () => {
        console.log("Group card clicked" + group);
    };
    const handelHover = () => {
        // Handle hover event
    }
    const group = groups.find(g => g.id === task.group_id) ?? null;

    return (
        <div onClick={handleClick} onMouseOver={handelHover} className="group-card">
            <div className="group-header">

            </div>
        </div>
    );
}