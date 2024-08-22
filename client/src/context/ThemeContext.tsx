import React, { createContext, useContext, useEffect, useState } from "react";
import { getSettings, updateSettings } from "services/api";
import { UserSettings } from "services/types";
import { useAuth } from "./AuthContext";

export interface ThemeContextType {
  settings: UserSettings;
  setTheme: (settings: Partial<UserSettings>) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>({
    show_completed: false,
    email_notifications: true,
    push_notifications: false,
    notification_frequency: "daily",
    time_zone: "UTC",
    language: "en",
    sort_by: "due_date",
    sort_order: "asc",
    sort_completed_to_bottom: false,
  });
  const { token } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      try {
        const fetchedSettings = await getSettings();
        if (fetchedSettings && Object.keys(fetchedSettings).length > 0) {
          setSettings(fetchedSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        // If there's an error, we'll keep the default settings
      }
    };

    fetchSettings();
  }, [token]);

  const setTheme = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = await updateSettings(newSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ settings, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};