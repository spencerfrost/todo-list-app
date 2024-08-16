import { Request, Response } from "express";
import db from "../db";

interface RequestWithUserId extends Request {
  userId?: number;
}

export const getSettings = async (req: RequestWithUserId, res: Response) => {
  try {
    console.log("Getting settings for user:", req.userId);
    if (!req.userId) {
      console.log("Unauthorized: No user ID");
      return res.status(401).json({ error: "Unauthorized" });
    }

    let settings = await db("user_settings")
      .where({ user_id: req.userId })
      .first();

    if (!settings) {
      console.log("No settings found, creating default settings");

      const defaultSettings = {
        user_id: req.userId,
        primary_color: "#3b82f6",
        secondary_color: "#10b981",
        dark_mode: false,
        default_sorting: "dueDate",
        sorting_direction: "asc",
        tasks_per_page: 10,
        show_completed: false,
        email_notifications: true,
        push_notifications: false,
        notification_frequency: "daily",
        time_zone: "UTC",
        language: "en",
      };

      [settings] = await db("user_settings")
        .insert(defaultSettings)
        .returning("*");
      
      console.log("Created default settings:", settings);
    }

    console.log("Sending response:", settings);
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "An error occurred while fetching settings" });
  }
};

export const updateSettings = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedSettings = await db("user_settings")
      .where({ user_id: req.userId })
      .update(req.body)
      .returning("*");

    if (updatedSettings.length === 0) {
      return res.status(404).json({ error: "Settings not found" });
    }

    res.json(updatedSettings[0]);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "An error occurred while updating settings" });
  }
};