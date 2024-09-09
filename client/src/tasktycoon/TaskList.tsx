import React, { useContext } from 'react';
import { GameContext, GameContextType, Task } from './GameContainer';

const TaskList: React.FC = () => {
  const { tasks, completeTask } = useContext(GameContext) as GameContextType;
  return (
    <div className="bg-card p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">Tasks</h2>
      {tasks.map((task: Task) => (
        <div 
          key={task.id} 
          onClick={() => completeTask(task.id)}
          className="p-3 mb-2 bg-background rounded cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {task.title}
        </div>
      ))}
    </div>
  );
};

export default TaskList;