import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HouseProvider, useHouse } from './contexts/HouseContext';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { HouseSetup } from './components/house/HouseSetup';
import { Dashboard } from './components/dashboard/Dashboard';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, userData, loading: authLoading } = useAuth();
  const { loading: houseLoading } = useHouse();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (authLoading || houseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return authMode === 'login' 
      ? <Login onToggle={() => setAuthMode('signup')} />
      : <Signup onToggle={() => setAuthMode('login')} />;
  }

  if (!userData?.houseId) {
    return <HouseSetup />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <HouseProvider>
        <AppContent />
      </HouseProvider>
    </AuthProvider>
  );
}

export default App;
