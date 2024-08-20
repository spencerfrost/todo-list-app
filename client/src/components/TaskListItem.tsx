import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Task } from "services/types";

interface TaskListItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onChecked: (id: number, checked: boolean) => void;
  onEdit: (task: Task) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onDelete, onChecked, onEdit }) => {
  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={task.completed}
          onCheckedChange={checked => onChecked(task.id, checked as boolean)}
          data-testid={`complete-task-${task.id}`}
        />
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-500">{task.description}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          onClick={() => onEdit(task)} 
          variant="ghost" 
          size="sm"
          data-testid={`edit-task-${task.id}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          onClick={() => onDelete(task.id)} 
          variant="ghost" 
          size="sm"
          data-testid={`delete-task-${task.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskListItem;