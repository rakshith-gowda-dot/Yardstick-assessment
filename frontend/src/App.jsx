import React from 'react';
import { AuthProvider, useAuth } from './utils/authContext.jsx';
import Login from './components/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? <Dashboard /> : <Login />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;