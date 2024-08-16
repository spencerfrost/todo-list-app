import { useAuth } from "context/AuthContext";
import { LogIn, LogOut, Menu } from "lucide-react";
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
    <header className="bg-blue-600 h-16 flex items-center justify-between px-4">
      {showSidebarToggle && toggleSidebar && (
        <button
          title="Toggle Sidebar"
          onClick={toggleSidebar}
          className="text-white hover:bg-blue-700 p-2 rounded-md transition-colors"
        >
          <Menu size={24} />
        </button>
      )}
      <Link to="/" className="text-white text-xl font-bold">
        TaskMaster
      </Link>
      {showAuthButton && (
        <button
          onClick={handleAuthAction}
          className="text-white hover:bg-blue-700 p-2 rounded-md transition-colors flex items-center"
          title={isAuthenticated ? "Logout" : "Login"}
        >
          {isAuthenticated ? <LogOut size={24} /> : <LogIn size={24} />}
          <span className="ml-2">{isAuthenticated ? "Logout" : "Login"}</span>
        </button>
      )}
    </header>
  );
};

export default Header;
