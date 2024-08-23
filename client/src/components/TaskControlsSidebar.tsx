import { ArrowDownAZ, ArrowUpAZ, Calendar, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import React from 'react';

import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { Label } from 'components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';

import { Task, UserSettings } from 'services/types';

interface TaskControlsSidebarProps {
  settings: UserSettings;
  priorityFilter: string[];
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onUpdatePriorityFilter: (priorityFilter: string[]) => void;
}

const TaskControlsSidebar: React.FC<TaskControlsSidebarProps> = ({
  settings,
  priorityFilter,
  onUpdateSettings,
  onUpdatePriorityFilter
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleSortByChange = (value: string) => {
    onUpdateSettings({ sort_by: value as keyof Task });
  };

  const handleSortOrderChange = () => {
    onUpdateSettings({ sort_order: settings.sort_order === 'asc' ? 'desc' : 'asc' });
  };

  const handleShowCompletedChange = () => {
    onUpdateSettings({ show_completed: !settings.show_completed });
  };

  const handlePriorityFilterChange = (priority: string) => {
    const newPriorityFilter = priorityFilter.includes(priority)
      ? priorityFilter.filter(p => p !== priority)
      : [...priorityFilter, priority];
    onUpdatePriorityFilter(newPriorityFilter);
  };

  const handleSortCompletedToBottomChange = () => {
    onUpdateSettings({ sort_completed_to_bottom: !settings.sort_completed_to_bottom });
  };

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
              <Select onValueChange={(value) => handleSortByChange(value as keyof Task)} value={settings.sort_by}>
                <SelectTrigger data-testid="sort-by-trigger">
                  <SelectValue placeholder="Select sorting criteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title" data-testid="title-sort">Title</SelectItem>
                  <SelectItem value="due_date" data-testid="due-date-sort">Due Date</SelectItem>
                  <SelectItem value="priority" data-testid="priority-sort">Priority</SelectItem>
                  <SelectItem value="created_at" data-testid="created-at-sort">Created At</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleSortOrderChange}
              >
                {settings.sort_order === 'asc' ? <ArrowUpAZ className="mr-2 h-4 w-4" /> : <ArrowDownAZ className="mr-2 h-4 w-4" />}
                {settings.sort_order === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Display Options</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="show-completed"
                    checked={settings.show_completed}
                    onCheckedChange={handleShowCompletedChange}
                  />
                  <Label htmlFor="show-completed" className="ml-2">
                    Show Completed Tasks
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="sort-completed-bottom"
                    checked={settings.sort_completed_to_bottom}
                    onCheckedChange={handleSortCompletedToBottomChange}
                  />
                  <Label htmlFor="sort-completed-bottom" className="ml-2">
                    Sort Completed to Bottom
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
                      onCheckedChange={() => handlePriorityFilterChange(priority)}
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
        title='Toggle Sidebar'
        role='button'
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