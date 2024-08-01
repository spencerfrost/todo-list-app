import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

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
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (
  id: number,
  task: Partial<Task>
): Promise<Task> => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/tasks/${id}`);
};
