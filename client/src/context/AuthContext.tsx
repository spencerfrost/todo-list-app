import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkTokenValidity = useCallback((token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback((newToken: string) => {
    if (checkTokenValidity(newToken)) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setIsAuthenticated(true);
    } else {
      console.error("Invalid or expired token received");
      logout();
    }
  }, [checkTokenValidity, logout]);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && checkTokenValidity(storedToken)) {
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        logout();
      }
      setLoading(false);
    };

    initializeAuth();
  }, [checkTokenValidity, logout]);

  // Periodically check token validity
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && !checkTokenValidity(storedToken)) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [checkTokenValidity, logout]);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    token,
    loading,
    login,
    logout,
  }), [isAuthenticated, token, loading, login, logout]);

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};