export interface UserSettings {
  primary_color: string;
  secondary_color: string;
  dark_mode: boolean;
  default_sorting: string;
  sorting_direction: "asc" | "desc";
  tasks_per_page: number;
  show_completed: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  notification_frequency: string;
  time_zone: string;
  language: string;
}

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
  created_at: string;
}
