import React, { useEffect, useState } from "react";

import MainLayout from "components/layouts/MainLayout";
import TaskControlsSidebar from "components/TaskControlsSidebar";
import TaskForm from "components/TaskForm";
import TaskList from "components/TaskList";
import TodoHeader from "components/ToDoHeader";
import { useToast } from "components/ui/use-toast";
import { useTheme } from "context/ThemeContext";
import { deleteTask, getTasks, updateSettings } from "services/api";
import { Task } from "services/types";

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<keyof Task>("due_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [sortCompletedToBottom, setSortCompletedToBottom] = useState(false);
  const { show_completed, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
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

  const toggleShowCompleted = async () => {
    try {
      const newShowCompleted = !show_completed;
      await updateSettings({ show_completed: newShowCompleted });
      setTheme({ show_completed: newShowCompleted });
      toast({
        title: "Settings Updated",
        description: `${
          newShowCompleted ? "Showing" : "Hiding"
        } completed tasks.`,
      });
    } catch (error) {
      console.error("Error updating show completed setting:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSortChange = (newSortBy: keyof Task) => {
    setSortBy(newSortBy);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handlePriorityFilterChange = (priority: string) => {
    setPriorityFilter((prevFilter) =>
      prevFilter.includes(priority)
        ? prevFilter.filter((p) => p !== priority)
        : [...prevFilter, priority]
    );
  };

  const handleSortCompletedToBottomChange = () => {
    setSortCompletedToBottom((prev) => !prev);
  };

  const filteredAndSortedTasks = tasks
    .filter(
      (task) =>
        (show_completed || !task.completed) &&
        (priorityFilter.length === 0 ||
          priorityFilter.includes(task.priority || ""))
    )
    .sort((a, b) => {
      if (sortCompletedToBottom) {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
      }

      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === "asc" ? 1 : -1;
      if (bValue == null) return sortOrder === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <MainLayout>
      <div className="flex h-screen">
        <TaskControlsSidebar
          sortBy={sortBy}
          sortOrder={sortOrder}
          showCompleted={show_completed}
          priorityFilter={priorityFilter}
          sortCompletedToBottom={sortCompletedToBottom}
          onSortChange={handleSortChange}
          onSortOrderChange={handleSortOrderChange}
          onShowCompletedChange={toggleShowCompleted}
          onPriorityFilterChange={handlePriorityFilterChange}
          onSortCompletedToBottomChange={handleSortCompletedToBottomChange}
        />
        <div className="flex-1 overflow-y-auto bg-background">
          <TodoHeader
            onAddTask={() => setEditingTask({ id: 0 } as Task)}
            onToggleShowCompleted={toggleShowCompleted}
            showCompleted={show_completed}
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
