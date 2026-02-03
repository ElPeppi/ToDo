import type { UserInterface } from "./UserInterface";

export interface TaskInterface {
    id: number;
    title: string;
    createdBy: string;
    description: string;
    createdDate: string;
    dueDate: string;
    status: "pending" | "in-progress" | "completed" | "overdue";
    priority: "low" | "medium" | "high";
    group_id?: number;
    members?: UserInterface[]; // Array of User 
}