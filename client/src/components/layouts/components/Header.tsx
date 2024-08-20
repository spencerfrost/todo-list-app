import { Button } from "components/ui/button";
import { useAuth } from "context/AuthContext";
import { LogIn, LogOut, Settings } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  showAuthButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
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
    <header className="bg-card h-16 flex items-center justify-between px-4">
      <Link to="/" className="text-foreground text-xl font-bold">
        TaskMaster
      </Link>
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-md transition-colors"
          title="Settings"
          variant="ghost"
        >
          <Settings size={24} />
        </Button>
        {showAuthButton && (
          <Button
            onClick={handleAuthAction}
            className="flex items-center"
            title={isAuthenticated ? "Logout" : "Login"}
            variant="ghost"
          >
            {isAuthenticated ? <LogOut size={24} /> : <LogIn size={24} />}
            <span className="ml-2">{isAuthenticated ? "Logout" : "Login"}</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;