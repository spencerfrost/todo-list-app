import { Request, Response } from "express";
import db from "../db";

// Define a custom interface for the request with userId
interface RequestWithUserId extends Request {
  userId?: number;
}

export const getAllTasks = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const tasks = await db("tasks").where({ user_id: req.userId }).select("*");
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
};

export const createTask = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const taskData = { ...req.body, user_id: req.userId };
    // Remove id from taskData if it exists
    delete taskData.id;
    const [result] = await db("tasks").insert(taskData).returning("id");
    const taskId = result.id;
    const newTask = await db("tasks").where({ id: taskId }).first();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the task" });
  }
};

export const getTask = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const task = await db("tasks")
      .where({ id: req.params.id, user_id: req.userId })
      .first();
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the task" });
  }
};

export const updateTask = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const updated = await db("tasks")
      .where({ id: req.params.id, user_id: req.userId })
      .update(req.body);
    if (updated === 0) {
      return res
        .status(404)
        .json({
          error: "Task not found or you don't have permission to update it",
        });
    }
    const updatedTask = await db("tasks").where({ id: req.params.id }).first();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the task" });
  }
};

export const deleteTask = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const deleted = await db("tasks")
      .where({ id: req.params.id, user_id: req.userId })
      .delete();
    if (deleted === 0) {
      return res
        .status(404)
        .json({
          error: "Task not found or you don't have permission to delete it",
        });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the task" });
  }
};

export const completeTask = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const updated = await db("tasks")
      .where({ id: req.params.id, user_id: req.userId })
      .update({ completed: true });
    if (updated === 0) {
      return res
        .status(404)
        .json({
          error: "Task not found or you don't have permission to complete it",
        });
    }
    const updatedTask = await db("tasks").where({ id: req.params.id }).first();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while completing the task" });
  }
};
