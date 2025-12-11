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
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../components/GlobalHeader';
import { customerPortalAPI } from '../services/customerPortalApi';

const SignupVerifyPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const colors = {
    background: theme.palette.background.default,
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    warningDark: theme.palette.warning.dark,
  };
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const phone = localStorage.getItem('signup_phone');

  const handleInputChange = (index, value) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      setError('Please enter the 4-digit OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await customerPortalAPI.signupVerifyOTP(phone, otpCode);

      if (response?.data?.status === 'success') {
        localStorage.setItem('signup_verified', 'true');
        // Store signup token if provided
        if (response?.data?.signupToken) {
          localStorage.setItem('signup_token', response.data.signupToken);
        }
        navigate('/signup/details');
      } else {
        setError(response?.data?.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!phone) {
    navigate('/signup/phone');
    return null;
  }

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
                Verify OTP
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  color: colors.textSecondary,
                }}
              >
                Step 2 of 3: Enter the 4-digit OTP sent to {phone}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 4,
                }}
              >
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 700,
                      },
                    }}
                    sx={{
                      width: 60,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: theme.palette.background.paper,
                        border: '2px solid',
                        borderColor: digit ? colors.info : theme.palette.divider,
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
                size="large"
                onClick={handleSubmit}
                disabled={!isOtpComplete || loading}
                sx={{
                backgroundColor: isOtpComplete ? colors.warning : theme.palette.text.disabled,
                color: theme.palette.background.paper,
                fontWeight: 600,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '18px',
                '&:hover': {
                  backgroundColor: isOtpComplete ? colors.warningDark : theme.palette.text.disabled,
                  },
                }}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignupVerifyPage;
