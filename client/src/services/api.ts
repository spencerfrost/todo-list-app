import axios from "axios";
import { Task, UserSettings } from "services/types";

const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

export const getTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get("/tasks");
  return response.data;
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const response = await axiosInstance.post("/tasks", task);
  return response.data;
};

export const updateTask = async (
  id: number,
  task: Partial<Task>
): Promise<Task> => {
  const response = await axiosInstance.put(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};

// Settings-related API calls
export const getSettings = async (): Promise<UserSettings> => {
  try {
    const response = await axiosInstance.get("/settings");
    if (response.status === 204) {
      console.warn("Received 204 No Content from /settings endpoint");
      // Return default settings
      return {
        primary_color: '#3b82f6',
        secondary_color: '#10b981',
        dark_mode: false,
        default_sorting: 'dueDate',
        sorting_direction: 'asc',
        tasks_per_page: 10,
        show_completed: false,
        email_notifications: true,
        push_notifications: false,
        notification_frequency: 'daily',
        time_zone: 'UTC',
        language: 'en',
      };
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export const updateSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  const response = await axiosInstance.post("/settings", settings);
  return response.data;
};