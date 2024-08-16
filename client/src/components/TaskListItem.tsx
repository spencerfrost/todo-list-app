import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Task } from "services/types";

interface TaskListItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onDelete, onComplete, onEdit }) => {
  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 pl-1">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onComplete(task.id)}
        />
        <div>
          <h3 className="font-semibold dark:text-white">{task.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => onEdit(task)} variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button onClick={() => onDelete(task.id)} variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskListItem;