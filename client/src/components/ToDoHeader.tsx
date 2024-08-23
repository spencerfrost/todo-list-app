import { Ellipsis, PlusCircle } from "lucide-react";
import React from "react";

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
      <div className="flex items-center space-x-3 pr-1">
        <PlusCircle 
          className="h-5 w-5 text-primary cursor-pointer hover:text-primary-600"
          onClick={onAddTask}
          data-testid="add-task-button"
        />
        <DropdownMenu>
          <DropdownMenuTrigger tabIndex={-1} data-testid="todo-header-options">
              <Ellipsis className="h-5 w-5 text-primary cursor-pointer hover:text-primary-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onToggleShowCompleted} data-testid="toggle-show-completed">
              {showCompleted ? 'Hide' : 'Show'} Completed Tasks
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TodoHeader;