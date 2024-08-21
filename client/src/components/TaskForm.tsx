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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
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
      task ?? { id: 0, title: "", description: "", completed: false } as Task
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
        let updatedTask: Task;
        if (editedTask.id === 0) {
          // Create new task
          updatedTask = await createTask(editedTask);
        } else {
          // Update existing task
          updatedTask = await updateTask(editedTask.id, editedTask);
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
      <DialogContent data-testid="task-form-dialog">
        <DialogHeader>
          <DialogTitle>
            {editedTask.id === 0 ? "Create Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="title"
              value={editedTask.title ?? ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Task Title"
              data-testid="task-title-input"
              className={titleError ? "border-red-500" : ""}
            />
            {titleError && (
              <p className="text-red-500 text-sm mt-1">{titleError}</p>
            )}
          </div>
          <Input
            type="text"
            name="description"
            value={editedTask.description ?? ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Description"
            data-testid="task-description-input"
          />
          <Select
            value={editedTask.priority}
            onValueChange={(value: "Low" | "Medium" | "High") =>
              setEditedTask((prev) =>
                prev ? { ...prev, priority: value } : null
              )
            }
          >
            <SelectTrigger>
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
            value={editedTask.estimated_time ?? ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Estimated Time (minutes)"
          />
          <Input
            type="date"
            name="due_date"
            value={editedTask.due_date ?? ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Input
            type="text"
            name="category"
            value={editedTask.category ?? ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Category"
          />
          <Input
            type="text"
            name="location"
            value={editedTask.location ?? ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Location"
          />
          <Select
            value={editedTask.energy_level}
            onValueChange={(value: "Low" | "Medium" | "High") =>
              setEditedTask((prev) =>
                prev ? { ...prev, energy_level: value } : null
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select energy level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </form>
        <DialogFooter className="flex sm:justify-between items-center">
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