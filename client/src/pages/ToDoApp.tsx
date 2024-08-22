import MainLayout from "components/layouts/MainLayout";
import TaskControlsSidebar from "components/TaskControlsSidebar";
import TaskForm from "components/TaskForm";
import TaskList from "components/TaskList";
import TodoHeader from "components/ToDoHeader";
import { useToast } from "components/ui/use-toast";
import React, { useEffect, useState } from "react";
import {
  deleteTask,
  getSettings,
  getTasks,
  updateSettings,
} from "services/api";
import { Task, UserSettings } from "services/types";

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchSettings();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchSettings = async () => {
    try {
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = await updateSettings(newSettings);
      setSettings(updatedSettings);
      toast({
        title: "Success",
        description: "Settings updated successfully.",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      setEditingTask(null);
      toast({
        title: "Success",
        description: "Task deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex((t) => t.id === updatedTask.id);
      if (taskIndex !== -1) {
        const newTasks = [...prevTasks];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      } else {
        return [...prevTasks, updatedTask];
      }
    });
    toast({
      title: "Success",
      description:
        updatedTask.id === 0
          ? "Task created successfully."
          : "Task updated successfully.",
    });
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      if (!settings) return true;
      if (!settings.show_completed && task.completed) return false;
      if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority || "")) return false;
      return true;
    })
    .sort((a, b) => {
      if (!settings) return 0;
      if (settings.sort_completed_to_bottom) {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
      }
      const aValue = a[settings.sort_by];
      const bValue = b[settings.sort_by];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return settings.sort_order === "asc" ? 1 : -1;
      if (bValue === undefined) return settings.sort_order === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return settings.sort_order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return settings.sort_order === "asc" ? -1 : 1;
      if (aValue > bValue) return settings.sort_order === "asc" ? 1 : -1;
      return 0;
    });

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="flex h-screen">
        <TaskControlsSidebar
          priorityFilter={priorityFilter}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onUpdatePriorityFilter={setPriorityFilter}
        />
        <div className="flex-1 overflow-y-auto bg-background">
          <TodoHeader
            onAddTask={() => setEditingTask({ id: 0 } as Task)}
            onToggleShowCompleted={() =>
              handleUpdateSettings({ show_completed: !settings.show_completed })
            }
            showCompleted={settings.show_completed}
          />
          <TaskList
            tasks={filteredAndSortedTasks}
            onEditTask={handleEditTask}
            onUpdateTask={handleTaskUpdated}
          />
        </div>
      </div>
      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={handleTaskUpdated}
          onDelete={handleDeleteTask}
        />
      )}
    </MainLayout>
  );
};

export default TodoApp;
