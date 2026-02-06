export interface UserInterface {
  id: number;
  name: string;
  email: string;
  photo?: string;
  tasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}