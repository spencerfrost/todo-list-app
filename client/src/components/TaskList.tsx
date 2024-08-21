import TaskListItem from "components/TaskListItem";
import React from "react";
import { Task } from "services/types";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onUpdateTask }) => {
  return (
    <div className="mt-4">
      {tasks.map((task) => (
        <TaskListItem
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onUpdate={onUpdateTask}
        />
      ))}
    </div>
  );
};

export default TaskList;