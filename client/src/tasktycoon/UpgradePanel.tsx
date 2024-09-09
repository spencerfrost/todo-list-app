import React, { useContext } from 'react';
import { GameContext, GameContextType } from './GameContainer';

const UpgradePanel: React.FC = () => {
  const { productivityCoins, cityLevel, upgradeCity } = useContext(GameContext) as GameContextType;
  return (
    <div className="bg-card p-6 rounded-lg mb-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Upgrades</h2>
      <button 
        onClick={upgradeCity} 
        disabled={productivityCoins < cityLevel * 100}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
      >
        Upgrade City (Cost: {cityLevel * 100} PC)
      </button>
    </div>
  );
};

export default UpgradePanel;