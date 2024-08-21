import { LogIn, LogOut, Settings, User } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { useAuth } from "context/AuthContext";

interface HeaderProps {
  showAuthButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showAuthButton = true }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <header className="bg-card h-12 flex items-center justify-between px-4">
      <Link to="/" className="text-foreground text-xl font-bold">
        TaskMaster
      </Link>
      <div className="flex items-center">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={handleLogin}
            className="flex items-center"
            variant="ghost"
          >
            <LogIn className="mr-2 h-5 w-5" />
            <span>Login</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
