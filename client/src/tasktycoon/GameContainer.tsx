import React, { createContext, useEffect, useState } from 'react';
import AchievementsDisplay from './AchievementsDisplay';
import CityView from './CityView';
import MomentumMeter from './MomentumMeter';
import TaskList from './TaskList';
import UpgradePanel from './UpgradePanel';
import './style.css';

export interface Task {
  id: number;
  title: string;
}

export interface GameContextType {
  productivityCoins: number;
  momentum: number;
  cityLevel: number;
  tasks: Task[];
  completeTask: (taskId: number) => void;
  upgradeCity: () => void;
}

export const GameContext = createContext<GameContextType | null>(null);

const GameContainer: React.FC = () => {
  const [productivityCoins, setProductivityCoins] = useState(0);
  const [momentum, setMomentum] = useState(1);
  const [cityLevel, setCityLevel] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Initialize game state, load saved data, etc.
  }, []);

  useEffect(() => {
    const momentumDecayInterval = setInterval(() => {
      setMomentum(prevMomentum => Math.max(1, prevMomentum - 0.1));
    }, 60000);

    return () => clearInterval(momentumDecayInterval);
  }, []);

  const completeTask = (taskId: number) => {
    setProductivityCoins(prev => prev + 10 * momentum);
    setMomentum(prev => Math.min(5, prev + 0.2));
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const upgradeCity = () => {
    if (productivityCoins >= cityLevel * 100) {
      setProductivityCoins(prev => prev - cityLevel * 100);
      setCityLevel(prev => prev + 1);
    }
  };

  const gameContextValue: GameContextType = {
    productivityCoins,
    momentum,
    cityLevel,
    tasks,
    completeTask,
    upgradeCity,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="max-w-4xl mx-auto p-6 bg-background text-foreground">
        <h1 className="text-3xl font-bold mb-6 text-primary">TaskTycoon</h1>
        <div className="flex justify-between mb-6 p-4 bg-card rounded-lg">
          <p>Productivity Coins: {productivityCoins}</p>
          <p>Momentum: {momentum.toFixed(1)}x</p>
          <p>City Level: {cityLevel}</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3">
            <CityView />
          </div>
          <div className="col-span-2">
            <TaskList />
          </div>
          <div className="col-span-1">
            <MomentumMeter />
            <UpgradePanel />
            <AchievementsDisplay />
          </div>
        </div>
      </div>
    </GameContext.Provider>
  );
};

export default GameContainer;