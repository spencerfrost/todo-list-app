import axios from "axios";
import { Category, Task, UserSettings } from "services/types";

const API_URL = process.env.NODE_ENV === "production" ? "https://taskmaster.mrspinn.ca/api" : "http://localhost:3221/api";

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

// Existing task-related API calls
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

// New category-related API calls
export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

export const createCategory = async (category: Omit<Category, "id" | "user_id">): Promise<Category> => {
  const response = await axiosInstance.post("/categories", category);
  return response.data;
};

export const updateCategory = async (
  id: number,
  category: Partial<Category>
): Promise<Category> => {
  const response = await axiosInstance.put(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};

// Existing settings-related API calls
export const getSettings = async (): Promise<UserSettings> => {
  const response = await axiosInstance.get("/settings");
  return response.data;
};

export const updateSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  const response = await axiosInstance.put("/settings", settings);
  return response.data;
};