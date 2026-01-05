import type { User } from "./UserInterface";

export interface Task {
    id: number;
    title: string;
    createdBy: string;
    description: string;
    createdDate: string;
    dueDate: string;
    status: "pending" | "in-progress" | "completed";
    groupId?: number;
    members?: User[]; // Array of User 
}