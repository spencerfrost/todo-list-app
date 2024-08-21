import React, { useEffect, useState } from "react";

import { deleteTask, getTasks, updateSettings } from "services/api";
import { Task } from "services/types";

import MainLayout from "components/layouts/MainLayout";
import TaskForm from "components/TaskForm";
import TaskList from "components/TaskList";
import TodoHeader from "components/ToDoHeader";
import TodoSidebar from "components/ToDoSidebar";
import { useToast } from "components/ui/use-toast";
import { useTheme } from "context/ThemeContext";

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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
        // Update existing task
        const newTasks = [...prevTasks];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      } else {
        // Add new task
        return [...prevTasks, updatedTask];
      }
    });
    toast({
      title: "Success",
      description: updatedTask.id === 0 ? "Task created successfully." : "Task updated successfully.",
    });
  };

  const toggleShowCompleted = async () => {
    try {
      const newShowCompleted = !show_completed;
      await updateSettings({ show_completed: newShowCompleted });
      setTheme({ show_completed: newShowCompleted });
      toast({
        title: "Settings Updated",
        description: `${newShowCompleted ? 'Showing' : 'Hiding'} completed tasks.`,
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

  const filteredTasks = show_completed
    ? tasks
    : tasks.filter((task) => !task.completed);

  return (
    <MainLayout>
      <div className="flex h-screen">
        <TodoSidebar />
        <div className="flex-1 overflow-y-auto bg-background">
          <TodoHeader
            onAddTask={() => setEditingTask({ id: 0 } as Task)}
            onToggleShowCompleted={toggleShowCompleted}
            showCompleted={show_completed}
          />
          <TaskList
            tasks={filteredTasks}
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