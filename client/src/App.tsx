import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { AuthProvider, useAuth } from "context/AuthContext";
import { ThemeProvider } from "context/ThemeContext";

import ComponentShowcase from "pages/ComponentShowcase";
import Landing from "pages/Landing";
import LoginRegister from "pages/LoginRegister";
import Settings from "pages/Settings";
import TodoApp from "pages/ToDoApp";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const homePageElement = isAuthenticated ? (
    <ProtectedRoute>
      <TodoApp />
    </ProtectedRoute>
  ) : (
    <Landing />
  );
  const settingsPageElement = isAuthenticated ? (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  ) : (
    <Navigate to="/login" replace />
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginRegister />} />
      <Route path="/" element={homePageElement} />
      <Route path="/settings" element={settingsPageElement} />
      <Route path="/components" element={<ComponentShowcase />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
