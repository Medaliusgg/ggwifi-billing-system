import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Link,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';

const PinLogin = ({ onSuccess, onBack, onNavigateToSignUp, onNavigateToForgotPin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!pin || !pin.match(/^\d{4}$/)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const normalizedPhone = authService.normalizePhoneNumber(phoneNumber);
      const response = await authService.loginWithPin(normalizedPhone, pin);

      if (response.status === 'success') {
        toast.success('Login successful!');
        if (rememberMe) {
          // Store phone number for "remember me" (not PIN for security)
          localStorage.setItem('rememberedPhone', normalizedPhone);
        }
        onSuccess?.(response);
      } else {
        setError(response.message || 'Invalid phone number or PIN');
        toast.error(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      toast.error(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load remembered phone number
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberedPhone');
    if (remembered) {
      setPhoneNumber(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            {onBack && (
              <IconButton onClick={onBack} sx={{ position: 'absolute', left: 16, top: 16 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#0A0A0A' }}>
              Login
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Enter your phone number and 4-digit PIN
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="+255 658 823 944"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="4-Digit PIN"
              placeholder="0000"
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPin(!showPin)} edge="end">
                      {showPin ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                inputProps: { maxLength: 4, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label="Remember me"
              />
              {onNavigateToForgotPin && (
                <Link component="button" onClick={onNavigateToForgotPin} sx={{ color: '#F2C94C', fontWeight: 600 }}>
                  Forgot PIN?
                </Link>
              )}
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={isSubmitting || !phoneNumber || pin.length !== 4}
              sx={{
                backgroundColor: '#F2C94C',
                color: '#0A0A0A',
                py: 1.5,
                fontWeight: 600,
                '&:hover': { backgroundColor: '#E0B335' },
              }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Don't have an account?{' '}
                <Link component="button" onClick={onNavigateToSignUp} sx={{ color: '#F2C94C', fontWeight: 600 }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component="button" onClick={() => {/* Navigate to OTP login */}} sx={{ color: '#666', fontSize: '0.875rem' }}>
                Login with OTP instead
              </Link>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PinLogin;

