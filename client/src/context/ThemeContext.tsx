import React, { createContext, useContext, useEffect, useState } from "react";
import { getSettings, updateSettings } from "services/api";
import { UserSettings } from "services/types";
import { useAuth } from "./AuthContext";

interface ThemeContextType extends UserSettings {
  setTheme: (settings: Partial<UserSettings>) => Promise<void>;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
        // Keep the default settings
      }
    };

    fetchSettings();
  }, [token]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      settings.primary_color
    );
    document.documentElement.style.setProperty(
      "--secondary",
      settings.secondary_color
    );
    if (settings.dark_mode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings]);

  const setTheme = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = await updateSettings(newSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const toggleDarkMode = () => {
    setTheme({ dark_mode: !settings.dark_mode });
  };

  return (
    <ThemeContext.Provider value={{ ...settings, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};