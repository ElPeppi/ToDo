import type { TaskInterface } from "./TaskInterface";
import type { UserInterface } from "./UserInterface";

export interface GroupInterface {
  id: number;
  name: string;
  description?: string;
  members: UserInterface[];
  tasks: TaskInterface[];
  task_count: number;
}