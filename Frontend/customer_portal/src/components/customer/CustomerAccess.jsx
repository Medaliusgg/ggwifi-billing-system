import React, { useState } from 'react';
import { Box } from '@mui/material';
import CustomerLogin from './CustomerLogin';
import CustomerDashboard from './CustomerDashboard';
import SignUp from '../SignUp';
import { useTokenRefresh } from '../../hooks/useTokenRefresh';

const CustomerAccess = ({ session, onLoginSuccess, onLogout, onBack, onNavigateToPackages, onNavigateToSignUp }) => {
  const [currentSession, setCurrentSession] = useState(session);
  const [showSignUp, setShowSignUp] = useState(false);
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

  const handleNavigateToSignUp = () => {
    setShowSignUp(true);
  };

  const handleSignUpSuccess = (response) => {
    // After signup, user is automatically logged in
    const sessionPayload = {
      phoneNumber: response.phoneNumber || response.account?.phoneNumber,
      token: response.token,
      refreshToken: response.refreshToken,
      account: response.account || response,
    };
    setShowSignUp(false);
    onLoginSuccess?.(sessionPayload);
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
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
      ) : showSignUp ? (
        <SignUp
          onSuccess={handleSignUpSuccess}
          onBack={handleBackToLogin}
          onNavigateToLogin={handleBackToLogin}
        />
      ) : (
        <CustomerLogin 
          onSuccess={onLoginSuccess} 
          onBack={onBack}
          onNavigateToSignUp={handleNavigateToSignUp}
        />
      )}
    </Box>
  );
};

export default CustomerAccess;


