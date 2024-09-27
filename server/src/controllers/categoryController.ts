import { Request, Response } from "express";
import db from "../db";
import { Category } from "../types";

interface RequestWithUserId extends Request {
  userId?: number;
}

export const getAllCategories = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const categories = await db<Category>("categories").where({ user_id: req.userId });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching categories" });
  }
};

export const createCategory = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { name, color } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const [newCategory] = await db<Category>("categories")
      .insert({ user_id: req.userId, name, color })
      .returning("*");
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the category" });
  }
};

export const updateCategory = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const { name, color } = req.body;
    const [updatedCategory] = await db<Category>("categories")
      .where({ id: Number(id), user_id: req.userId })
      .update({ name, color })
      .returning("*");
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the category" });
  }
};

export const deleteCategory = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const deletedCount = await db<Category>("categories")
      .where({ id: Number(id), user_id: req.userId })
      .delete();
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the category" });
  }
};