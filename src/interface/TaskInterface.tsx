import type { UserInterface } from "./UserInterface";

export interface TaskInterface {
    id: number;
    title: string;
    createdBy: string;
    description: string;
    createdDate: string;
    dueDate: string;
    status: "pending" | "in-progress" | "completed" | "overdue";
    group_id?: number;
    priority: "low" | "medium" | "high";
    members?: UserInterface[]; // Array of User 
}