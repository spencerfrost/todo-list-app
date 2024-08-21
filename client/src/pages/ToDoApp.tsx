import { Ellipsis, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useTheme } from "context/ThemeContext";
import { deleteTask, getTasks, updateSettings } from "services/api";
import { Task } from "services/types";

import MainLayout from "components/layouts/MainLayout";
import TaskForm from "components/TaskForm";
import TaskListItem from "components/TaskListItem";

import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { useToast } from "components/ui/use-toast";

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
      setEditingTask(null); // Close the edit form after deletion
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
    setTasks((prevTasks) => 
      prevTasks.map((task) => task.id === updatedTask.id ? updatedTask : task)
    );
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
        <div className="w-64 bg-card/60 p-4">
          <h2 className="text-xl font-bold mb-4 text-foreground">Filters</h2>
          {/* Add filter options here */}
        </div>
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="flex justify-between items-center p-2 pl-3 mb-4">
            <h1 className="text-2xl font-bold text-primary">Todo List</h1>
            <div>
              <Button
                title="Add Task"
                variant="ghost"
                size="icon"
                onClick={() => setEditingTask({ id: 0 } as Task)}
                data-testid="add-task-button"
              >
                <PlusCircle className="h-5 w-5 text-primary" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger tabIndex={-1}>
                  <Button variant="ghost" size="icon">
                    <Ellipsis className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={toggleShowCompleted}>
                    {show_completed ? 'Hide' : 'Show'} Completed Tasks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-4">
            {filteredTasks.map((task) => (
              <TaskListItem
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onUpdate={handleTaskUpdated}
            />
          ))}
        </div>
      </div>
    </div>
    {editingTask && (
      <TaskForm
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onTaskUpdated={(updatedTask) => {
          handleTaskUpdated(updatedTask);
          setEditingTask(null);
        }}
        onDelete={handleDeleteTask}
      />
    )}
  </MainLayout>
);
};

export default TodoApp;