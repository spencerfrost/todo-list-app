import React, { useContext } from 'react';
import { GameContext, GameContextType } from './GameContainer';

const CityView: React.FC = () => {
  const { cityLevel } = useContext(GameContext) as GameContextType;
  return (
    <div className="bg-card p-6 rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-primary">City View</h2>
      <p className="text-xl">Level {cityLevel}</p>
    </div>
  );
};

export default CityView;