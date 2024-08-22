import { Request, Response } from "express";
import db from "../db";
import { UserSettings } from "../types";

interface RequestWithUserId extends Request {
  userId?: number;
}

export const getSettings = async (req: RequestWithUserId, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let settings = await db<UserSettings>("user_settings")
      .where({ user_id: req.userId })
      .first();

    if (!settings) {
      const defaultSettings: Partial<UserSettings> = {
        user_id: req.userId,
        show_completed: false,
        email_notifications: true,
        push_notifications: false,
        notification_frequency: "daily",
        time_zone: "UTC",
        language: "en",
        sort_by: "due_date",
        sort_order: "asc",
        sort_completed_to_bottom: false,
      };

      [settings] = await db<UserSettings>("user_settings")
        .insert(defaultSettings)
        .returning("*");
    }

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

    let settingsToUpdate = { ...req.body };

    const updatedSettings = await db<UserSettings>("user_settings")
      .where({ user_id: req.userId })
      .update(settingsToUpdate)
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