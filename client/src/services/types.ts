export interface UserSettings {
  show_completed: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  notification_frequency: string;
  time_zone: string;
  language: string;
  sort_by: keyof Task;
  sort_order: 'asc' | 'desc';
  sort_completed_to_bottom: boolean;
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
