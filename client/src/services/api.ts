import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(new Error(error));
});

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
  }

export const getTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get('/tasks');
  return response.data;
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const response = await axiosInstance.post('/tasks', task);
  return response.data;
}

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
