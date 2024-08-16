import React from 'react';

import Landing from 'components/Landing';
import MainLayout from 'components/layouts/Main';
import { AuthProvider, useAuth } from 'context/AuthContext';
import TodoApp from 'pages/ToDoApp';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      {isAuthenticated ? <TodoApp /> : <Landing />}
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;