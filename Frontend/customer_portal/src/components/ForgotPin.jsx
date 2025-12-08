import React, { useState, useEffect } from 'react';
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
  LinearProgress,
  Alert,
  Link,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';

const ForgotPin = ({ onSuccess, onBack, onNavigateToLogin }) => {
  const [step, setStep] = useState(1); // 1: Phone + OTP Request, 2: OTP Verify, 3: Reset PIN
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Step 1: Request OTP
  const handleRequestOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const normalizedPhone = authService.normalizePhoneNumber(phoneNumber);
      const response = await authService.requestPinResetOTP(normalizedPhone);

      if (response.status === 'success') {
        setStep(2);
        setCountdown(60);
        toast.success('OTP sent to your phone!');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit OTP code');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const normalizedPhone = authService.normalizePhoneNumber(phoneNumber);
      const response = await authService.verifyPinResetOTP(normalizedPhone, otpCode);

      if (response.status === 'success' && response.resetToken) {
        setResetToken(response.resetToken);
        setStep(3);
        toast.success('OTP verified! Please set your new PIN.');
      } else {
        setError(response.message || 'Invalid OTP code');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
      toast.error(err.message || 'Invalid OTP code');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Reset PIN
  const handleResetPin = async () => {
    // Validation
    if (!newPin || !newPin.match(/^\d{4}$/)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const normalizedPhone = authService.normalizePhoneNumber(phoneNumber);
      const response = await authService.resetPin(normalizedPhone, newPin, confirmPin, resetToken);

      if (response.status === 'success') {
        toast.success('PIN reset successfully! You are now logged in.');
        onSuccess?.(response);
      } else {
        setError(response.message || 'Failed to reset PIN');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset PIN');
      toast.error(err.message || 'Failed to reset PIN');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    setOtpCode('');
    handleRequestOTP();
  };

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
              Reset PIN
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Step {step} of 3
            </Typography>
            <LinearProgress variant="determinate" value={(step / 3) * 100} sx={{ mt: 2, height: 6, borderRadius: 3 }} />
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Phone Number */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
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
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleRequestOTP}
                    disabled={isSubmitting || !phoneNumber}
                    sx={{
                      backgroundColor: '#F2C94C',
                      color: '#0A0A0A',
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#E0B335' },
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send OTP'}
                  </Button>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Remember your PIN?{' '}
                      <Link component="button" onClick={onNavigateToLogin} sx={{ color: '#F2C94C', fontWeight: 600 }}>
                        Login
                      </Link>
                    </Typography>
                  </Box>
                </Stack>
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Stack spacing={3}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="body1" sx={{ color: '#666', mb: 1 }}>
                      Enter the 6-digit code sent to
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {phoneNumber}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="OTP Code"
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleVerifyOTP}
                    disabled={isSubmitting || otpCode.length !== 6}
                    sx={{
                      backgroundColor: '#F2C94C',
                      color: '#0A0A0A',
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#E0B335' },
                    }}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <Box sx={{ textAlign: 'center' }}>
                    {countdown > 0 ? (
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Resend OTP in {countdown}s
                      </Typography>
                    ) : (
                      <Button variant="text" onClick={handleResendOTP} sx={{ color: '#F2C94C' }}>
                        Resend OTP
                      </Button>
                    )}
                  </Box>
                  <Button variant="text" onClick={() => setStep(1)} sx={{ color: '#666' }}>
                    Change phone number
                  </Button>
                </Stack>
              </motion.div>
            )}

            {/* Step 3: Reset PIN */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="New 4-Digit PIN"
                    placeholder="0000"
                    type={showPin ? 'text' : 'password'}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
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
                  <TextField
                    fullWidth
                    label="Confirm PIN"
                    placeholder="0000"
                    type={showConfirmPin ? 'text' : 'password'}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#666' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPin(!showConfirmPin)} edge="end">
                            {showConfirmPin ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      inputProps: { maxLength: 4, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } },
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleResetPin}
                    disabled={isSubmitting || newPin.length !== 4 || confirmPin.length !== 4}
                    sx={{
                      backgroundColor: '#F2C94C',
                      color: '#0A0A0A',
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#E0B335' },
                    }}
                  >
                    {isSubmitting ? 'Resetting PIN...' : 'Reset PIN'}
                  </Button>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPin;

