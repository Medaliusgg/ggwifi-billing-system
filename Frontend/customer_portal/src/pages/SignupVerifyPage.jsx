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
      const response = await customerPortalAPI.verifyOTP({
        phone,
        otp: otpCode,
      });

      if (response?.data?.verified) {
        localStorage.setItem('signup_verified', 'true');
        navigate('/signup/details');
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F9FC' }}>
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
                  color: '#0A0A0A',
                }}
              >
                Verify OTP
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  color: '#666666',
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
                        backgroundColor: '#FFFFFF',
                        border: '2px solid',
                        borderColor: digit ? '#48C7F2' : '#EEEEEE',
                        '&:hover': {
                          borderColor: '#48C7F2',
                        },
                        '&.Mui-focused': {
                          borderColor: '#48C7F2',
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
                  backgroundColor: isOtpComplete ? '#F48C06' : '#CCCCCC',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '18px',
                  '&:hover': {
                    backgroundColor: isOtpComplete ? '#D97706' : '#CCCCCC',
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
