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

export interface UserSettings {
  id: number;
  user_id: number;
  show_completed: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  notification_frequency: string;
  time_zone: string;
  language: string;
  sort_by: string;
  sort_order: 'asc' | 'desc';
  sort_completed_to_bottom: boolean;
}
