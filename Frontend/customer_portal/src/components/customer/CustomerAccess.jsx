import React, { useState } from 'react';
import { Box } from '@mui/material';
import CustomerLogin from './CustomerLogin';
import CustomerDashboard from './CustomerDashboard';
import { useTokenRefresh } from '../../hooks/useTokenRefresh';

const CustomerAccess = ({ session, onLoginSuccess, onLogout, onBack }) => {
  const [currentSession, setCurrentSession] = useState(session);
  const isAuthenticated = Boolean(currentSession?.token);

  const handleSessionUpdate = (updatedSession) => {
    setCurrentSession(updatedSession);
  };

  useTokenRefresh(currentSession, handleSessionUpdate, onLogout);

  React.useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {isAuthenticated ? (
        <CustomerDashboard session={currentSession} onLogout={onLogout} onBack={onBack} />
      ) : (
        <CustomerLogin onSuccess={onLoginSuccess} onBack={onBack} />
      )}
    </Box>
  );
};

export default CustomerAccess;


