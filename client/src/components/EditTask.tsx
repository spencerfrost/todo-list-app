import { Button } from "components/ui/button";
import {
    Dialog,
    DialogContent,
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
import React, { useEffect, useState } from "react";
import { updateTask } from "services/api";
import { Task } from "services/types";

interface EditTaskProps {
  task: Task | null;
  onClose: () => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const EditTask: React.FC<EditTaskProps> = ({ task, onClose, onTaskUpdated }) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
    if (editedTask) {
      try {
        const updatedTask = await updateTask(editedTask.id, editedTask);
        onTaskUpdated(updatedTask);
        onClose();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  if (!editedTask) return null;

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleInputChange}
            placeholder="Task Title"
          />
          <Input
            type="text"
            name="description"
            value={editedTask.description || ""}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <Select
            value={editedTask.priority}
            onValueChange={(value: "Low" | "Medium" | "High") =>
              setEditedTask((prev) => (prev ? { ...prev, priority: value } : null))
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
            value={editedTask.estimated_time || ""}
            onChange={handleInputChange}
            placeholder="Estimated Time (minutes)"
          />
          <Input
            type="date"
            name="due_date"
            value={editedTask.due_date || ""}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="category"
            value={editedTask.category || ""}
            onChange={handleInputChange}
            placeholder="Category"
          />
          <Input
            type="text"
            name="location"
            value={editedTask.location || ""}
            onChange={handleInputChange}
            placeholder="Location"
          />
          <Select
            value={editedTask.energy_level}
            onValueChange={(value: "Low" | "Medium" | "High") =>
              setEditedTask((prev) => (prev ? { ...prev, energy_level: value } : null))
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
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;