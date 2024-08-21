import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { Label } from 'components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { ArrowDownAZ, ArrowUpAZ, Calendar, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Task } from 'services/types';

interface TaskControlsSidebarProps {
  sortBy: keyof Task;
  sortOrder: 'asc' | 'desc';
  showCompleted: boolean;
  priorityFilter: string[];
  onSortChange: (sortBy: keyof Task) => void;
  onSortOrderChange: () => void;
  onShowCompletedChange: () => void;
  onPriorityFilterChange: (priority: string) => void;
}

const TaskControlsSidebar: React.FC<TaskControlsSidebarProps> = ({
  sortBy,
  sortOrder,
  showCompleted,
  priorityFilter,
  onSortChange,
  onSortOrderChange,
  onShowCompletedChange,
  onPriorityFilterChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      setIsCollapsed(true);
    }
  }, [isSmallScreen]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-4' : 'w-64'}`}>
      {!isCollapsed && (
        <div className="flex-grow bg-card/80 border-r border-border overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Task Controls</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Sort By</h3>
              <Select onValueChange={(value) => onSortChange(value as keyof Task)} value={sortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sorting criteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="due_date">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="created_at">Created Date</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={onSortOrderChange}
              >
                {sortOrder === 'asc' ? <ArrowUpAZ className="mr-2 h-4 w-4" /> : <ArrowDownAZ className="mr-2 h-4 w-4" />}
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Filters</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="show-completed"
                    checked={showCompleted}
                    onCheckedChange={onShowCompletedChange}
                  />
                  <Label htmlFor="show-completed" className="ml-2">
                    Show Completed Tasks
                  </Label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Priority</h3>
              <div className="space-y-2">
                {['Low', 'Medium', 'High'].map((priority) => (
                  <div key={priority} className="flex items-center">
                    <Checkbox
                      id={`priority-${priority.toLowerCase()}`}
                      checked={priorityFilter.includes(priority)}
                      onCheckedChange={() => onPriorityFilterChange(priority)}
                    />
                    <Label htmlFor={`priority-${priority.toLowerCase()}`} className="ml-2">
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Due Date Range</h3>
              <Button variant="outline" size="sm" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Set Date Range
              </Button>
            </div>
          </div>
        </div>
      )}
      <div 
        className={`w-4 bg-card/80 flex flex-col items-center justify-center cursor-pointer
          hover:bg-card transition-colors duration-100
          ${isCollapsed ? 'rounded-r' : ''}`
        }
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <>
            <ChevronRight className="h-3 w-3 mb-3 text-primary" />
            <Menu className="h-3 w-3 text-primary" />
            <ChevronRight className="h-3 w-3 mt-3 text-primary" />
          </>
        ) : (
          <>
            <ChevronLeft className="h-3 w-3 mb-3 text-primary" />
            <Menu className="h-3 w-3 text-primary" />
            <ChevronLeft className="h-3 w-3 mt-3 text-primary" />
          </>
        )}
      </div>
    </div>
  );
};

export default TaskControlsSidebar;