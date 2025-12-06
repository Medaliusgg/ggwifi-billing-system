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
    { icon: <SpeedIcon />, text: 'Lightning Fast', color: '#F2C94C' },
    { icon: <SecurityIcon />, text: 'Secure Connection', color: '#10B981' },
    { icon: <StarIcon />, text: 'Premium Quality', color: '#3A8DFF' },
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
        py: 1,
        background: '#FFFFFF',  // Official white background
        pt: 0,
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
                mb: 2,
                background: '#FFFFFF',
                border: '1px solid #EEEEEE',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                color: '#0A0A0A',
                '&:hover': {
                  background: 'rgba(242, 201, 76, 0.1)',
                  borderColor: '#F2C94C',
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
                background: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                border: '1px solid #EEEEEE',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: '#F2C94C',  // Official gold accent bar
                  borderRadius: '16px 16px 0 0',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 4, md: 6 } }}>
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
                        border: '3px solid #F2C94C',
                        boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
                        background: '#FFFFFF',
                        '& img': {
                          objectFit: 'contain',
                          padding: '4px',
                        },
                      }}
                    />
                  </motion.div>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: '#0A0A0A',
                      mb: 2,
                      fontSize: { xs: '1.75rem', md: '2rem' },
                    }}
                  >
                    Connect to GG Wi-Fi
                  </Typography>

                  <Typography variant="body1" sx={{ color: '#666666', mb: 3 }}>
                    Enter your voucher code and phone number to access our high-speed internet
                  </Typography>

                  {/* Features */}
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4, flexWrap: 'wrap' }}>
                    {features.map((feature, index) => (
                      <Chip
                        key={index}
                        icon={feature.icon}
                        label={feature.text}
                        size="small"
                        sx={{
                          background: '#FFFFFF',
                          color: '#0A0A0A',
                          border: `1px solid ${feature.color}`,
                          '& .MuiChip-icon': {
                            color: feature.color,
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ mb: 4, borderColor: '#EEEEEE' }} />

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
                          borderRadius: '12px',
                          background: '#FFFFFF',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#F2C94C',
                          },
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#F2C94C',
                              borderWidth: '2px',
                            },
                            boxShadow: '0 0 0 3px rgba(242, 201, 76, 0.35)',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E0E0E0',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666666',
                          '&.Mui-focused': {
                            color: '#F2C94C',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#0A0A0A',
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
                          borderRadius: '12px',
                          background: '#FFFFFF',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#F2C94C',
                          },
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#F2C94C',
                              borderWidth: '2px',
                            },
                            boxShadow: '0 0 0 3px rgba(242, 201, 76, 0.35)',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E0E0E0',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666666',
                          '&.Mui-focused': {
                            color: '#F2C94C',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#0A0A0A',
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
                        borderRadius: '12px',
                        py: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        backgroundColor: '#F2C94C',
                        color: '#0A0A0A',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#E0B335',
                          boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
                        },
                        '&:disabled': {
                          background: '#EEEEEE',
                          color: '#666666',
                          boxShadow: 'none',
                        },
                        transition: 'all 0.3s ease',
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
                        borderRadius: '12px',
                        background: '#EAF4FF',
                        border: '1px solid #3A8DFF',
                        '& .MuiAlert-icon': {
                          color: '#3A8DFF',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#0A0A0A' }}>
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
