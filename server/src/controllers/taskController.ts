import { Request, Response } from "express";
import db from "../db";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await db("tasks").select("*");
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const [taskId] = await db("tasks").insert(req.body).returning("id");
    const newTask = await db("tasks").where({ id: taskId }).first();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the task" });
  }
};

// Add other controller functions (getTask, updateTask, deleteTask) here

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await db("tasks").where({ id: req.params.id }).first();
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

export const updateTask = async (req: Request, res: Response) => {
  try {
    await db("tasks").where({ id: req.params.id }).update(req.body);
    const updatedTask = await db("tasks").where({ id: req.params.id }).first();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await db("tasks").where({ id: req.params.id }).first();
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await db("tasks").where({ id: req.params.id }).delete();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the task" });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  try {
    await db("tasks").where({ id: req.params.id }).update({ completed: true });
    const updatedTask = await db("tasks").where({ id: req.params.id }).first();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while completing the task" });
  }
};
