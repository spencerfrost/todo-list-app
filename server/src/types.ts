export interface Task {
  id: number;
  title: string;
  description?: string;
  priority?: "Low" | "Medium" | "High";
  estimated_time?: number;
  due_date?: string;
  category?: string;
  location?: string;
  energy_level?: "Low" | "Medium" | "High";
  completed: boolean;
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}