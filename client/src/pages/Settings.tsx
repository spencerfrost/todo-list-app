import React, { useEffect, useState } from "react";

import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Switch } from "components/ui/switch";

import MainLayout from "components/layouts/MainLayout";
import { getSettings, updateSettings } from "services/api";
import { UserSettings } from "services/types";

// Default settings using the UserSettings type partially
const defaultSettings: UserSettings = {
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

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);
      setError(null);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to fetch settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      await updateSettings(settings);
      setError(null);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    name: keyof UserSettings,
    value: string | number | boolean
  ) => {
    setSettings((prevSettings) => ({ ...prevSettings, [name]: value }));
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Notification Settings</h2>
          <div className="flex items-center mb-4">
            <Label htmlFor="email-notifications" className="flex items-center">
              <span className="mr-4">Email Notifications:</span>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications}
                onCheckedChange={(checked) =>
                  handleChange("email_notifications", checked)
                }
              />
            </Label>
          </div>
          <div className="flex items-center mb-4">
            <Label htmlFor="push-notifications" className="flex items-center">
              <span className="mr-4">Push Notifications:</span>
              <Switch
                id="push-notifications"
                checked={settings.push_notifications}
                onCheckedChange={(checked) =>
                  handleChange("push_notifications", checked)
                }
              />
            </Label>
          </div>
          <div className="flex items-center">
            <Label htmlFor="notification-frequency" className="mr-4">Notification Frequency:</Label>
            <Select
              value={settings.notification_frequency}
              onValueChange={(value) =>
                handleChange("notification_frequency", value)
              }
            >
              <SelectTrigger id="notification-frequency" data-testid="notification-frequency-trigger">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily" data-testid="daily-notification">Daily</SelectItem>
                <SelectItem value="weekly" data-testid="weekly-notification">Weekly</SelectItem>
                <SelectItem value="monthly" data-testid="monthly-notification">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Time and Language</h2>
          <div className="flex items-center mb-4">
            <Label htmlFor="time-zone" className="mr-4">Time Zone:</Label>
            <Select
              value={settings.time_zone}
              onValueChange={(value) => handleChange("time_zone", value)}
            >
              <SelectTrigger id="time-zone">
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Label htmlFor="language" className="mr-4">Language:</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleChange("language", value)}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
        <Button
          onClick={saveSettings}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </MainLayout>
  );
};

export default Settings;