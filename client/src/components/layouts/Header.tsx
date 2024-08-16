import { LogIn, LogOut, Menu } from 'lucide-react';
import React from 'react';

import { useAuth } from 'context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <header className="bg-blue-600 h-16 flex items-center justify-between px-4">
      <button
        title="Toggle Sidebar"
        onClick={toggleSidebar}
        className="text-white hover:bg-blue-700 p-2 rounded-md transition-colors"
      >
        <Menu size={24} />
      </button>
      <h1 className="text-white text-xl font-bold">TaskMaster</h1>
      <button 
        onClick={isAuthenticated ? logout : login}
        className="text-white hover:bg-blue-700 p-2 rounded-md transition-colors flex items-center"
        title='Login/Logout'
      >
        {isAuthenticated ? <LogOut size={24} /> : <LogIn size={24} />}
        <span className="ml-2">{isAuthenticated ? 'Logout' : 'Login'}</span>
      </button>
    </header>
  );
};

export default Header;
