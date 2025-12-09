import React from 'react';
import { Box } from '@mui/material';
import PinLogin from '../PinLogin';
import SignUp from '../SignUp';

/**
 * CustomerLogin Component
 * Uses PIN-based authentication (phone + 4-digit PIN) instead of OTP
 * Shows signup option for new customers
 */
const CustomerLogin = ({ onSuccess, onBack, onNavigateToSignUp }) => {
  const handleLoginSuccess = (response) => {
    // Transform PinLogin response to match expected format
    const sessionPayload = {
      phoneNumber: response.phoneNumber || response.account?.phoneNumber,
      token: response.token,
      refreshToken: response.refreshToken,
      account: response.account || response,
    };
    onSuccess?.(sessionPayload);
  };

  const handleSignUpSuccess = (response) => {
    // After signup, user is automatically logged in
    // Transform SignUp response to match expected format
    const sessionPayload = {
      phoneNumber: response.phoneNumber || response.account?.phoneNumber,
      token: response.token,
      refreshToken: response.refreshToken,
      account: response.account || response,
    };
    onSuccess?.(sessionPayload);
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 3 },
      }}
    >
      <PinLogin
        onSuccess={handleLoginSuccess}
        onBack={onBack}
        onNavigateToSignUp={onNavigateToSignUp}
      />
    </Box>
  );
};

export default CustomerLogin;
