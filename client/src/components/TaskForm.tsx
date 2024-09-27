import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

import CategoryManager from "components/CategoryManager";

import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createTask, updateTask } from "services/api";
import { Task } from "services/types";

interface TaskFormProps {
  task: Task | null;
  onClose: () => void;
  onTaskUpdated: (updatedTask: Task) => void;
  onDelete: (id: number) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onClose,
  onTaskUpdated,
  onDelete,
}) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    setEditedTask(
      task ?? ({ id: 0, title: "", description: "", completed: false } as Task)
    );
  }, [task]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => (prev ? { ...prev, [name]: value } : null));
    if (name === "title") {
      setTitleError(null);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editedTask) {
      if (!editedTask.title || !editedTask.title.trim()) {
        setTitleError("Title is required");
        return;
      }
      try {
        // Create a new object without category_name and category_color
        const { category_name, category_color, ...taskToSubmit } = editedTask;
  
        let updatedTask: Task;
        if (editedTask.id === 0) {
          // Create new task
          updatedTask = await createTask(taskToSubmit);
        } else {
          // Update existing task
          updatedTask = await updateTask(editedTask.id, taskToSubmit);
        }
        onTaskUpdated(updatedTask);
        onClose();
      } catch (error) {
        console.error("Error saving task:", error);
      }
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!editedTask) return null;

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        data-testid="task-form-dialog"
      >
        <DialogHeader>
          <DialogTitle>
            {editedTask.id === 0 ? "Create Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details of your task below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              name="title"
              value={editedTask.title ?? ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Task Title"
              data-testid="task-title-input"
              className={titleError ? "border-red-500" : ""}
            />
            {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              name="description"
              value={editedTask.description ?? ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Description"
              data-testid="task-description-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={editedTask.priority}
              onValueChange={(value: "Low" | "Medium" | "High") =>
                setEditedTask((prev) =>
                  prev ? { ...prev, priority: value } : null
                )
              }
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimated_time">Estimated Time (minutes)</Label>
            <Input
              id="estimated_time"
              type="number"
              name="estimated_time"
              value={editedTask.estimated_time ?? ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Estimated Time"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              name="due_date"
              value={editedTask.due_date ?? ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <CategoryManager
              onCategorySelect={(categoryId) =>
                setEditedTask((prev) =>
                  prev ? { ...prev, category_id: categoryId } : null
                )
              }
              selectedCategoryId={editedTask.category_id}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              name="location"
              value={editedTask.location ?? ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="energy_level">Energy Level</Label>
            <Select
              value={editedTask.energy_level}
              onValueChange={(value: "Low" | "Medium" | "High") =>
                setEditedTask((prev) =>
                  prev ? { ...prev, energy_level: value } : null
                )
              }
            >
              <SelectTrigger id="energy_level">
                <SelectValue placeholder="Select energy level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter className="sm:justify-between">
          {editedTask.id !== 0 && (
            <Button
              onClick={() => onDelete(editedTask.id)}
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              data-testid="delete-task-button"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={handleSubmit} data-testid="save-task-button">
            {editedTask.id === 0 ? "Create" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
