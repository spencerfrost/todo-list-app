import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { useToast } from "components/ui/use-toast";
import { Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { updateTask } from "services/api";
import { Task } from "services/types";

interface TaskListItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onUpdate: (task: Task) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onEdit, onUpdate }) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editingTitle && titleRef.current) {
      titleRef.current.focus();
    }
    if (editingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, [editingTitle, editingDescription]);

  const handleInlineUpdate = async (field: 'title' | 'description', value: string) => {
    try {
      const updatedTask = await updateTask(task.id, { [field]: value });
      onUpdate(updatedTask);
      toast({
        title: "Success",
        description: `Task ${field} updated successfully.`,
      });
    } catch (error) {
      console.error(`Error updating task ${field}:`, error);
      toast({
        title: "Error",
        description: `Failed to update task ${field}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleTitleChange = () => {
    if (titleRef.current) {
      const newTitle = titleRef.current.textContent || "";
      handleInlineUpdate('title', newTitle);
    }
    setEditingTitle(false);
  };

  const handleDescriptionChange = () => {
    if (descriptionRef.current) {
      const newDescription = descriptionRef.current.textContent || "";
      handleInlineUpdate('description', newDescription);
    }
    setEditingDescription(false);
  };

  const handleCheckedChange = async (checked: boolean) => {
    try {
      const updatedTask = await updateTask(task.id, { completed: checked });
      onUpdate(updatedTask);
      toast({
        title: "Success",
        description: `Task marked as ${checked ? 'completed' : 'incomplete'}.`,
      });
    } catch (error) {
      console.error("Error updating task completion status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    field: "title" | "description"
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "title") {
        handleTitleChange();
      } else {
        handleDescriptionChange();
      }
    }
  };

  return (
    <li className={`group p-2 border-b border-border transition-colors duration-200 hover:bg-accent/10 ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleCheckedChange}
            data-testid={`complete-task-${task.id}`}
          />
          <div>
            <h3
              ref={titleRef}
              contentEditable={editingTitle}
              onBlur={handleTitleChange}
              onKeyDown={(e) => handleKeyDown(e, "title")}
              onClick={() => setEditingTitle(true)}
              className={`font-semibold text-foreground outline-none ${task.completed ? 'line-through' : ''}`}
              suppressContentEditableWarning
            >
              {task.title}
            </h3>
            <p
              ref={descriptionRef}
              contentEditable={editingDescription}
              onBlur={handleDescriptionChange}
              onKeyDown={(e) => handleKeyDown(e, "description")}
              onClick={() => setEditingDescription(true)}
              className="text-sm text-muted-foreground outline-none"
              suppressContentEditableWarning
            >
              {task.description}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            onClick={() => onEdit(task)} 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-primary"
            data-testid={`edit-task-${task.id}`}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit task</span>
          </Button>
        </div>
      </div>
    </li>
  );
};

export default TaskListItem;