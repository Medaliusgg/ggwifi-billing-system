import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  IconButton,
  useTheme,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Wifi as WifiIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';
import { customerPortalAPI } from '../services/customerPortalApi';
import { generateDeviceFingerprint, getStoredFingerprintHash } from '../utils/deviceFingerprint';
import { useSessionManager } from '../hooks/useSessionManager';
import SessionStatus from './SessionStatus';

const VoucherLogin = ({ onBack, currentLanguage }) => {
  const theme = useTheme();
  const [voucherCode, setVoucherCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Session management
  const {
    sessionStatus,
    isConnected,
    remainingTime,
    isReconnecting,
    checkSessionStatus,
    reconnectSession,
    startHeartbeat,
    startStatusMonitoring,
    formatRemainingTime,
    getStoredSession,
  } = useSessionManager();

  const handleLogin = async () => {
    if (!voucherCode || !phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate voucher code format (6-8 alphanumeric: A-Z, a-z, 0-9)
    if (voucherCode.length < 6 || voucherCode.length > 8) {
      toast.error('Voucher code must be 6-8 characters long');
      return;
    }
    
    // Validate alphanumeric format
    if (!/^[A-Za-z0-9]{6,8}$/.test(voucherCode)) {
      toast.error('Voucher code must contain only letters and numbers (A-Z, a-z, 0-9)');
      return;
    }

    if (phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    toast.loading('Connecting to GG Wi-Fi...');

    try {
      // Format phone number for API
      const formattedPhone = phoneNumber.startsWith('+255') ? phoneNumber : `+255${phoneNumber}`;
      
      // Generate device fingerprint (for MAC randomization immunity)
      const fingerprint = await generateDeviceFingerprint();
      const fingerprintHash = fingerprint.hash;
      
      // Get client MAC and IP (simplified - in production, get from network)
      const macAddress = '00:00:00:00:00:00'; // Will be detected by backend
      const ipAddress = '0.0.0.0'; // Will be detected by backend
      
      // Activate voucher with device fingerprinting
      const activationData = {
        phoneNumber: formattedPhone,
        macAddress: macAddress,
        ipAddress: ipAddress,
        deviceFingerprintHash: fingerprintHash
      };
      
      const apiResponse = await customerPortalAPI.activateVoucher(
        voucherCode.toUpperCase(), 
        activationData
      );
      
      const response = apiResponse.data || apiResponse;

      if (response.status === 'success') {
        // Store session token for seamless reconnection
        if (response.sessionToken) {
          localStorage.setItem('ggwifi_session_token', response.sessionToken);
          localStorage.setItem('ggwifi_voucher_code', voucherCode.toUpperCase());
        }
        
        toast.success('Connected successfully! Enjoy your internet access.');
        console.log('Voucher activated successfully:', response);
        
        // Start heartbeat and status monitoring
        if (response.heartbeatIntervalSeconds) {
          startHeartbeat(voucherCode.toUpperCase(), response.heartbeatIntervalSeconds);
        }
        startStatusMonitoring(voucherCode.toUpperCase());
        
        // Check session status immediately
        await checkSessionStatus(voucherCode.toUpperCase());
      } else {
        toast.error(response.message || 'Failed to activate voucher. Please check your voucher code.');
      }
    } catch (error) {
      console.error('Voucher activation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to connect. Please check your voucher code and try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };
  
  // Check for existing session on mount
  useEffect(() => {
    const { voucherCode: storedCode } = getStoredSession();
    if (storedCode) {
      setVoucherCode(storedCode);
      checkSessionStatus(storedCode);
    }
  }, [getStoredSession, checkSessionStatus]);

  const handleVoucherCodeChange = (event) => {
    // Allow 6-8 alphanumeric characters (A-Z, a-z, 0-9)
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 8) {
      setVoucherCode(value);
    }
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 15) {
      setPhoneNumber(value);
    }
  };

  const features = [
    { icon: <SpeedIcon />, text: 'Lightning Fast', color: '#FFC72C' },
    { icon: <SecurityIcon />, text: 'Secure Connection', color: '#1ABC9C' },
    { icon: <StarIcon />, text: 'Premium Quality', color: '#0072CE' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(26, 26, 26, 0.3) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <IconButton
              onClick={onBack}
              sx={{
                mb: 3,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 199, 44, 0.1)',
                  transform: 'translateX(-4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>

          {/* Main Card */}
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 199, 44, 0.3)',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 6 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}
                  >
                    <Avatar
                      src="/gg-logo.png"
                      alt="GG Wi-Fi Logo"
                      onError={(e) => { e.target.src = '/logo.svg'; }}
                      sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        border: '4px solid #FFC72C',
                        boxShadow: '0 8px 30px rgba(255, 199, 44, 0.6), 0 0 40px rgba(255, 199, 44, 0.3)',
                        background: 'linear-gradient(135deg, rgba(255, 199, 44, 0.3) 0%, rgba(0, 114, 206, 0.2) 100%)',
                        filter: 'brightness(1.1)',
                        '& img': {
                          objectFit: 'contain',
                          padding: '4px',
                          filter: 'brightness(1.25) contrast(1.1) drop-shadow(0 2px 6px rgba(255, 199, 44, 0.5))',
                        },
                      }}
                    />
                  </motion.div>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: 'text.primary',
                      mb: 2,
                      background: 'linear-gradient(135deg, #FFC72C 0%, #0072CE 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Connect to GG Wi-Fi
                  </Typography>

                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                    Enter your voucher code and phone number to access our high-speed internet
                  </Typography>

                  {/* Features */}
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
                    {features.map((feature, index) => (
                      <Chip
                        key={index}
                        icon={feature.icon}
                        label={feature.text}
                        size="small"
                        sx={{
                          background: 'rgba(0, 0, 0, 0.6)',
                          color: feature.color,
                          border: `1px solid ${feature.color}60`,
                          backdropFilter: 'blur(10px)',
                          '& .MuiChip-icon': {
                            color: feature.color,
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Session Status */}
                {sessionStatus && (
                  <Box sx={{ mb: 3 }}>
                    <SessionStatus
                      sessionStatus={sessionStatus}
                      isConnected={isConnected}
                      remainingTime={remainingTime}
                      onRefresh={() => checkSessionStatus(voucherCode.toUpperCase())}
                      formatRemainingTime={formatRemainingTime}
                    />
                  </Box>
                )}

                {/* Form */}
                <Stack spacing={3}>
                  {/* Voucher Code */}
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Voucher Code"
                      variant="outlined"
                      value={voucherCode}
                      onChange={handleVoucherCodeChange}
                      placeholder="Enter 6-8 character code"
                      inputProps={{ 
                        maxLength: 8,
                        style: { 
                          textAlign: 'center', 
                          fontSize: '1.5rem', 
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.15)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#FFC72C',
                            },
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.15)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#FFC72C',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#FFC72C',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#FFFFFF',
                        },
                      }}
                    />
                  </motion.div>

                  {/* Phone Number */}
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="+255 XXX XXX XXX"
                      inputProps={{ 
                        maxLength: 15,
                        style: { 
                          fontSize: '1.2rem', 
                          fontWeight: 500,
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.15)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#0072CE',
                            },
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.15)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#0072CE',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-focused': {
                            color: '#0072CE',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#FFFFFF',
                        },
                      }}
                    />
                  </motion.div>

                  {/* Connect Button */}
                  <motion.div variants={itemVariants}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleLogin}
                      disabled={isLoading || !voucherCode || !phoneNumber}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <WifiIcon />}
                      sx={{
                        borderRadius: 4,
                        py: 2.5,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                        color: '#000000',
                        boxShadow: '0 12px 40px rgba(255, 199, 44, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFB300 0%, #FFA000 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 16px 50px rgba(255, 199, 44, 0.5)',
                        },
                        '&:disabled': {
                          background: 'rgba(0, 0, 0, 0.12)',
                          color: 'rgba(0, 0, 0, 0.26)',
                          boxShadow: 'none',
                        },
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      {isLoading ? 'Connecting...' : 'Connect Now'}
                    </Button>
                  </motion.div>

                  {/* Info Alert */}
                  <motion.div variants={itemVariants}>
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: 3,
                        background: 'rgba(0, 114, 206, 0.1)',
                        border: '1px solid rgba(0, 114, 206, 0.2)',
                        '& .MuiAlert-icon': {
                          color: '#0072CE',
                        },
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Need help?</strong> Contact our 24/7 support team via WhatsApp or phone call.
                      </Typography>
                    </Alert>
                  </motion.div>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VoucherLogin;