import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { LogIn, LogOut, Moon, Settings, Sun } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  showAuthButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  showSidebarToggle = true,
  showAuthButton = true,
}) => {
  const { isAuthenticated, logout } = useAuth();
  const { dark_mode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="bg-blue-600 dark:bg-gray-800 h-16 flex items-center justify-between px-4">
      <Link to="/" className="text-white text-xl font-bold">
        TaskMaster
      </Link>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="text-white hover:bg-primary-dark dark:hover:bg-gray-700 p-2 rounded-md transition-colors"
          title={dark_mode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {dark_mode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="text-white hover:bg-primary-dark dark:hover:bg-gray-700 p-2 rounded-md transition-colors"
          title="Settings"
        >
          <Settings size={24} />
        </button>
        {showAuthButton && (
          <button
            onClick={handleAuthAction}
            className="text-white hover:bg-primary-dark dark:hover:bg-gray-700 p-2 rounded-md transition-colors flex items-center"
            title={isAuthenticated ? "Logout" : "Login"}
          >
            {isAuthenticated ? <LogOut size={24} /> : <LogIn size={24} />}
            <span className="ml-2">{isAuthenticated ? "Logout" : "Login"}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;