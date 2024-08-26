import axios from "axios";
import { Task, UserSettings } from "services/types";

const API_URL = process.env.REACT_APP_API_URL ?? '/api';

console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_URL);

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
  const response = await axiosInstance.get("/settings");
  return response.data;
};

export const updateSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  const response = await axiosInstance.put("/settings", settings);
  return response.data;
};