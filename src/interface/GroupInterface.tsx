import type { Task } from "./TaskInterface";
import type { User } from "./UserInterface";

export interface Group {
  id: number;
  name: string;
  description?: string;
  members: User[];
  taks: Task[];
}