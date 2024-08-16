import EditTask from "components/EditTask";
import MainLayout from "components/layouts/MainLayout";
import TaskListItem from "components/TaskListItem";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { deleteTask, getTasks, updateTask } from "services/api";
import { Task } from "services/types";

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCompleteTask = async (id: number) => {
    try {
      const updatedTask = await updateTask(id, { completed: true });
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <MainLayout>
      <div className="flex h-screen">
        <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Filters</h2>
          {/* Add filter options here */}
        </div>
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center p-2 pl-3 mb-4">
            <h1 className="text-2xl font-bold dark:text-white">Todo List</h1>
            <button
              type="button"
              title="Add Task"
              onClick={() => setEditingTask({ id: 0 } as Task)}
              className="p-0 border-none bg-transparent focus:outline-none"
            >
              <PlusCircle size='36px' className="mr-2 h-4 w-4" />
            </button>
          </div>
          <div className="mt-4">
            {tasks.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onComplete={handleCompleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        </div>
      </div>
      <EditTask
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onTaskUpdated={handleTaskUpdated}
      />
    </MainLayout>
  );
};

export default TodoApp;
