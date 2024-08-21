import React from "react";
import { Ellipsis, PlusCircle } from "lucide-react";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";

interface TodoHeaderProps {
  onAddTask: () => void;
  onToggleShowCompleted: () => void;
  showCompleted: boolean;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({
  onAddTask,
  onToggleShowCompleted,
  showCompleted,
}) => {
  return (
    <div className="flex justify-between items-center p-2 pl-3 mb-4">
      <h1 className="text-2xl font-bold text-primary">Todo List</h1>
      <div>
        <Button
          title="Add Task"
          variant="ghost"
          size="icon"
          onClick={onAddTask}
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
            <DropdownMenuItem onClick={onToggleShowCompleted}>
              {showCompleted ? 'Hide' : 'Show'} Completed Tasks
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TodoHeader;