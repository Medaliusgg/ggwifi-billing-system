import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../components/GlobalHeader';
import { customerPortalAPI } from '../services/customerPortalApi';

const SignupPhonePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const colors = {
    background: theme.palette.background.default,
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    warning: theme.palette.warning.main,
    warningDark: theme.palette.warning.dark,
  };
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Normalize phone number before sending
  const normalizePhone = (phoneNumber) => {
    if (!phoneNumber) return '';
    // Remove all non-digit characters except +
    let normalized = phoneNumber.trim().replace(/[^\d+]/g, '');
    
    // If starts with +, keep it
    if (normalized.startsWith('+')) {
      return normalized;
    }
    // If starts with 255, add +
    if (normalized.startsWith('255')) {
      return '+' + normalized;
    }
    // If starts with 0, replace with +255
    if (normalized.startsWith('0')) {
      return '+255' + normalized.substring(1);
    }
    // Otherwise, add +255
    return '+255' + normalized;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!phone || phone.trim().length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      // Normalize phone number before sending
      const normalizedPhone = normalizePhone(phone);
      const response = await customerPortalAPI.signupRequestOTP(normalizedPhone);
      
      if (response?.data?.status === 'success') {
        // Store normalized phone number
        localStorage.setItem('signup_phone', normalizedPhone);
        // Store signup token if provided
        if (response?.data?.signupToken) {
          localStorage.setItem('signup_token', response.data.signupToken);
        }
        navigate('/signup/verify');
      } else {
        const errorMessage = response?.data?.message || 'Failed to send OTP. Please try again.';
        // Handle account exists error
        if (response?.data?.error_code === 'ACCOUNT_EXISTS') {
          setError(errorMessage + ' Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      // Handle different error scenarios
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (err?.response?.status === 500) {
        errorMessage = 'Server error occurred. Please contact support or try again later.';
        console.error('Signup OTP 500 Error:', err?.response?.data || err);
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Signup OTP Error Details:', {
        status: err?.response?.status,
        message: err?.response?.data?.message,
        error: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <GlobalHeader isAuthenticated={false} />

      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FC 100%)',
              border: '1px solid #EEEEEE',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 1,
                  color: colors.textPrimary,
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  color: colors.textSecondary,
                }}
              >
                Step 1 of 3: Enter your phone number
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                  placeholder="+255 742 844 024"
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={loading}
                  sx={{
                backgroundColor: colors.warning,
                color: theme.palette.background.paper,
                fontWeight: 600,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '18px',
                '&:hover': {
                  backgroundColor: colors.warningDark,
                      boxShadow: '0 4px 12px rgba(244, 140, 6, 0.3)',
                    },
                  }}
                >
                  {loading ? 'Sending OTP...' : 'Continue'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignupPhonePage;
