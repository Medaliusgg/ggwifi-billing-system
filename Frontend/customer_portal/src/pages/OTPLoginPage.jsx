import React, { useState, useRef } from 'react';
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
  Link,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../components/GlobalHeader';
import { customerPortalAPI } from '../services/customerPortalApi';

const OTPLoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  // ✅ GG Wi-Fi OFFICIAL BRAND COLORS
  const colors = {
    background: theme.palette.background.default, // Clean White
    textPrimary: theme.palette.text.primary, // Deep Black #000000
    textSecondary: theme.palette.text.secondary, // Dark Gray #333333
    primary: theme.palette.primary.main, // Primary Yellow #FFCC00
    primaryDark: theme.palette.primary.dark,
    warning: theme.palette.warning.main, // Orange - for buttons (secondary accent)
    warningDark: theme.palette.warning.dark,
    info: theme.palette.info.main, // Blue - for OTP input borders (secondary accent)
  };
  
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const inputRefs = useRef([]);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setError('');
  };

  const handleOtpInputChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, ''); // Only digits
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp.slice(0, 6));
    if (pastedData.length >= 6) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

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

  const handleRequestOTP = async () => {
    if (!phone || phone.trim() === '') {
      setError('Please enter your phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Normalize phone number before sending
      const normalizedPhone = normalizePhone(phone);
      const response = await customerPortalAPI.sendOTP(normalizedPhone);
      
      if (response?.data?.status === 'success') {
        setOtpSent(true);
        setStep(2);
        setError('');
        // Update phone state with normalized version
        setPhone(normalizedPhone);
      } else {
        setError(response?.data?.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to send OTP. Please check your phone number and try again.';
      setError(errorMessage);
      console.error('OTP Request Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Use normalized phone number
      const normalizedPhone = normalizePhone(phone);
      const response = await customerPortalAPI.verifyOTP(normalizedPhone, otpCode);
      
      if (response?.data?.status === 'success' && response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
        navigate('/dashboard');
      } else {
        setError(response?.data?.message || 'Invalid OTP. Please try again.');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

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
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${colors.background} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
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
                {step === 1 ? 'Login with OTP' : 'Enter OTP Code'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  color: colors.textSecondary,
                }}
              >
                {step === 1
                  ? 'Enter your phone number to receive a one-time PIN'
                  : `We sent a 6-digit code to ${phone}`}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {step === 1 ? (
                <>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    autoComplete="tel"
                    sx={{ mb: 3 }}
                    placeholder="+255 742 844 024"
                    disabled={loading}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleRequestOTP}
                    size="large"
                    disabled={loading || !phone.trim()}
                    sx={{
                backgroundColor: colors.primary, // Primary Yellow #FFCC00
                color: colors.textPrimary, // Deep Black
                fontWeight: 600,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '18px',
                mb: 2,
                '&:hover': {
                  backgroundColor: colors.primaryDark,
                  boxShadow: '0 4px 12px rgba(255, 204, 0, 0.3)',
                },
              }}
            >
              {loading ? 'Sending OTP...' : 'SEND OTP'}
            </Button>

                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate('/login')}
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      color: colors.info,
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Use PIN instead
                  </Link>
                </>
              ) : (
                <>
                  {/* OTP Input Boxes */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1.5,
                      mb: 4,
                    }}
                  >
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        inputRef={(el) => (inputRefs.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleOtpInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        inputProps={{
                          maxLength: 1,
                          style: {
                            textAlign: 'center',
                            fontSize: '24px',
                            fontWeight: 700,
                          },
                        }}
                        sx={{
                          width: { xs: 45, md: 60 },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: theme.palette.background.paper,
                            border: '2px solid',
                            borderColor: digit ? colors.primary : theme.palette.divider,
                            '&:hover': {
                              borderColor: colors.info,
                            },
                            '&.Mui-focused': {
                              borderColor: colors.info,
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyOTP}
                    size="large"
                    disabled={loading || !isOtpComplete}
                    sx={{
                    backgroundColor: isOtpComplete ? colors.primary : theme.palette.text.disabled,
                    color: colors.textPrimary, // Deep Black
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: '18px',
                    mb: 2,
                    '&:hover': {
                      backgroundColor: isOtpComplete ? colors.primaryDark : theme.palette.text.disabled,
                      boxShadow: isOtpComplete ? '0 4px 12px rgba(255, 204, 0, 0.3)' : 'none',
                    },
                  }}
                >
                  {loading ? 'Verifying...' : 'VERIFY & LOGIN'}
                </Button>

                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Link
                      component="button"
                      type="button"
                      onClick={handleRequestOTP}
                      disabled={loading}
                      sx={{
                        color: colors.info,
                        textDecoration: 'none',
                        fontSize: '14px',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                        '&:disabled': {
                          opacity: 0.5,
                        },
                      }}
                    >
                      Resend OTP
                    </Link>
                  </Box>

                  <Link
                    component="button"
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      color: colors.textSecondary,
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Change phone number
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OTPLoginPage;
