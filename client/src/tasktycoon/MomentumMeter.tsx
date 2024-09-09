import React, { useContext } from 'react';
import { GameContext, GameContextType } from './GameContainer';

const MomentumMeter: React.FC = () => {
  const { momentum } = useContext(GameContext) as GameContextType;
  return (
    <div className="bg-card p-6 rounded-lg mb-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Momentum</h2>
      <p className="text-xl">{momentum.toFixed(1)}x</p>
    </div>
  );
};

export default MomentumMeter;