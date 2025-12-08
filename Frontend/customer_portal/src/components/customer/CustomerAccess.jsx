import React, { useState } from 'react';
import { Box } from '@mui/material';
import CustomerLogin from './CustomerLogin';
import CustomerDashboard from './CustomerDashboard';
import { useTokenRefresh } from '../../hooks/useTokenRefresh';

const CustomerAccess = ({ session, onLoginSuccess, onLogout, onBack, onNavigateToPackages }) => {
  const [currentSession, setCurrentSession] = useState(session);
  const isAuthenticated = Boolean(currentSession?.token);

  const handleSessionUpdate = (updatedSession) => {
    setCurrentSession(updatedSession);
  };

  useTokenRefresh(currentSession, handleSessionUpdate, onLogout);

  React.useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  const handleNavigateToPackages = (packageId) => {
    if (onNavigateToPackages) {
      onNavigateToPackages(packageId);
    } else {
      // Fallback: try to navigate using window location or show message
      console.log('Navigate to packages', packageId);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {isAuthenticated ? (
        <CustomerDashboard 
          session={currentSession} 
          onLogout={onLogout} 
          onBack={onBack}
          onNavigateToPackages={handleNavigateToPackages}
        />
      ) : (
        <CustomerLogin onSuccess={onLoginSuccess} onBack={onBack} />
      )}
    </Box>
  );
};

export default CustomerAccess;


