import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Chip,
} from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { motion } from 'framer-motion';
import { customerAuthAPI } from '../../services/api';
import { getDeviceFingerprint } from '../../utils/deviceFingerprint';
import { toast } from 'react-hot-toast';

const RESEND_TIMEOUT = 60;

const CustomerLogin = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState('PHONE'); // PHONE | OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [fingerprint, setFingerprint] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  useEffect(() => {
    (async () => {
      const fp = await getDeviceFingerprint();
      setFingerprint(fp);
    })();
  }, []);

  const maskedPhone = useMemo(() => {
    if (!phoneNumber) return '';
    const suffix = phoneNumber.slice(-4);
    return `****${suffix}`;
  }, [phoneNumber]);

  const handleRequestOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number with country code.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await customerAuthAPI.requestOtp({ phoneNumber, deviceFingerprint: fingerprint });
      setStep('OTP');
      setCountdown(RESEND_TIMEOUT);
      toast.success('OTP sent successfully');
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const { data } = await customerAuthAPI.verifyOtp({
        phoneNumber,
        otpCode,
        deviceFingerprint: fingerprint,
      });

      if (data?.status !== 'success') {
        throw new Error(data?.message || 'Verification failed');
      }

      const sessionPayload = {
        phoneNumber,
        token: data?.token,
        refreshToken: data?.refreshToken,
        account: data?.account,
      };

      onSuccess?.(sessionPayload);
      toast.success('Welcome back!');
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Verification failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await handleRequestOtp();
  };

  const handleBackToPhone = () => {
    setStep('PHONE');
    setOtpCode('');
    setCountdown(0);
    setError('');
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 520 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
        >
          Back to Home
        </Button>
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            borderRadius: 4,
            border: '1px solid rgba(255, 199, 76, 0.25)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
            background: 'rgba(15, 15, 15, 0.92)',
            color: '#fff',
          }}
        >
          {isSubmitting && <LinearProgress color="warning" />}
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Box>
                <Chip
                  icon={<ShieldRoundedIcon />}
                  label="Secure OTP Login"
                  color="warning"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Access your customer portal
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  Use your registered phone number to receive a one-time password (OTP). No password
                  needed.
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

              {step === 'PHONE' ? (
                <Stack spacing={2}>
                  <TextField
                    label="Phone Number"
                    placeholder="+255 712 345 678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,199,76,0.7)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFC72C' },
                      },
                    }}
                  />
                  {error && (
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleRequestOtp}
                    disabled={isSubmitting}
                    startIcon={<LockOpenIcon />}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #FFC72C, #F5A623)',
                      color: '#1a1a1a',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFD56A, #FFB347)',
                      },
                    }}
                  >
                    Request OTP
                  </Button>
                  <Typography variant="caption" color="rgba(255,255,255,0.65)" align="center">
                    By continuing you agree to our Terms of Service and Privacy Policy.
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" onClick={handleBackToPhone} color="inherit">
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="body2" color="rgba(255,255,255,0.75)">
                      Enter the code sent to <strong>{maskedPhone}</strong>
                    </Typography>
                  </Stack>
                  <TextField
                    label="6-digit OTP"
                    value={otpCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                      setOtpCode(value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        letterSpacing: '0.5rem',
                        fontSize: '1.5rem',
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,199,76,0.7)' },
                        '&.Mui-focused fieldset': { borderColor: '#00B4D8' },
                      },
                    }}
                  />
                  {error && (
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleVerifyOtp}
                    disabled={isSubmitting}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #00C9A7, #00B4D8)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #29E7CD, #00D4FF)',
                      },
                    }}
                  >
                    Verify & Continue
                  </Button>
                  <Button
                    variant="text"
                    startIcon={<ReplayIcon />}
                    onClick={handleResend}
                    disabled={countdown > 0 || isSubmitting}
                    sx={{ color: '#FFC72C', textTransform: 'none' }}
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                  </Button>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default CustomerLogin;
