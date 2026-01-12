import type { UserInterface } from "./UserInterface";

export interface TaskInterface {
    id: number;
    title: string;
    createdBy: string;
    description: string;
    createdDate: string;
    dueDate: string;
    status: "pending" | "in-progress" | "completed";
    group_id?: number;
    members?: UserInterface[]; // Array of User 
}