import React, { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Task } from './services/api';



const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const removeEmptyFields = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== '' && v !== undefined)
  );
};

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Omit<Task, 'id'>>>({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTask.title && newTask.title.trim() !== '') {
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(removeEmptyFields(newTask)),
        });

        const data = await response.json();
        setTasks([...tasks, data]);
        setNewTask({});
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <Card className="mb-4">
        <CardHeader>Add New Task</CardHeader>
        <CardContent>
          <Input
            type="text"
            name="title"
            value={newTask.title || ''}
            onChange={handleInputChange}
            placeholder="Task Title"
            className="mb-2"
          />
          <Input
            type="text"
            name="description"
            value={newTask.description || ''}
            onChange={handleInputChange}
            placeholder="Description"
            className="mb-2"
          />
          <Select
            value={newTask.priority}
            onValueChange={(value: 'Low' | 'Medium' | 'High') => setNewTask({ ...newTask, priority: value })}
          >
            <SelectTrigger className="mb-2">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            name="estimated_time"
            value={newTask.estimated_time || ''}
            onChange={handleInputChange}
            placeholder="Estimated Time (minutes)"
            className="mb-2"
          />
          <Input
            type="date"
            name="due_date"
            value={newTask.due_date || ''}
            onChange={handleInputChange}
            className="mb-2"
          />
          <Input
            type="text"
            name="category"
            value={newTask.category || ''}
            onChange={handleInputChange}
            placeholder="Category"
            className="mb-2"
          />
          <Input
            type="text"
            name="location"
            value={newTask.location || ''}
            onChange={handleInputChange}
            placeholder="Location"
            className="mb-2"
          />
          <Select
            value={newTask.energy_level}
            onValueChange={(value: 'Low' | 'Medium' | 'High') => setNewTask({ ...newTask, energy_level: value })}
          >
            <SelectTrigger className="mb-2">
              <SelectValue placeholder="Select energy level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addTask}>Add Task</Button>
        </CardContent>
      </Card>
      <div>
        {tasks.map(task => (
          <Card key={task.id} className="mb-2">
            <CardContent>
              <h3 className="font-bold">{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              {task.priority && <p>Priority: {task.priority}</p>}
              {task.estimated_time && <p>Estimated Time: {task.estimated_time} minutes</p>}
              {task.due_date && <p>Due Date: {task.due_date}</p>}
              {task.category && <p>Category: {task.category}</p>}
              {task.location && <p>Location: {task.location}</p>}
              {task.energy_level && <p>Energy Level: {task.energy_level}</p>}
              <Button onClick={() => deleteTask(task.id)} variant="destructive">Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;