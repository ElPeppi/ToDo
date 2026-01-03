export interface Task {
    id: number;
    tittle: string;
    description: string;
    createdDate: string;
    dueDate: string;
    status: "pending" | "in-progress" | "completed";
    groupId?: number;
    members?: number[]; // Array of User IDs
}