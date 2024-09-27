import { Request, Response } from "express";
import db from "../db";

// Define a custom interface for the request with userId
interface RequestWithUserId extends Request {
  userId?: number;
}

// Utility function to check authorization
const checkAuthorization = (req: RequestWithUserId, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
};

// Get all tasks
export const getAllTasks = async (req: RequestWithUserId, res: Response) => {
  if (!checkAuthorization(req, res)) return;
  try {
    const tasks = await db("tasks").where({ user_id: req.userId }).select("*");
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
};

// Create a new task
export const createTask = async (req: RequestWithUserId, res: Response) => {
  if (!checkAuthorization(req, res)) return;
  try {
    const taskData = { ...req.body, user_id: req.userId };
    if (!taskData.title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const [newTask] = await db("tasks").insert(taskData).returning("*");
    res.status(201).json(newTask);
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({
      error: "An error occurred while creating the task",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// Get a single task by ID
export const getTask = async (req: RequestWithUserId, res: Response) => {
  if (!checkAuthorization(req, res)) return;
  try {
    const task = await db("tasks")
      .where({ id: req.params.id, user_id: req.userId })
      .first();
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the task" });
  }
};

// Update a task
export const updateTask = async (req: RequestWithUserId, res: Response) => {
  if (!checkAuthorization(req, res)) return;
  try {
    const updated = await db("tasks")
      .where({ id: req.params.id, user_id: req.userId })
      .update(req.body);
    if (!updated) {
      return res.status(404).json({ error: "Task not found or you don't have permission to update it" });
    }
    const updatedTask = await db("tasks").where({ id: req.params.id }).first();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the task" });
  }
};

// Delete a task
export const deleteTask = async (req: RequestWithUserId, res: Response) => {
  if (!checkAuthorization(req, res)) return;
  try {
    const deleted = await db("tasks")
      .where({ id: req.params.id, user_id: req.userId })
      .delete();
    if (!deleted) {
      return res.status(404).json({ error: "Task not found or you don't have permission to delete it" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the task" });
  }
};

// Mark a task as complete
export const completeTask = async (req: RequestWithUserId, res: Response) => {
  if (!checkAuthorization(req, res)) return;
  try {
    const updated = await db("tasks")
      .where({ id: req.params.id, user_id: req.userId })
      .update({ completed: true });
    if (!updated) {
      return res.status(404).json({ error: "Task not found or you don't have permission to complete it" });
    }
    const completedTask = await db("tasks").where({ id: req.params.id }).first();
    res.json(completedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while completing the task" });
  }
};
