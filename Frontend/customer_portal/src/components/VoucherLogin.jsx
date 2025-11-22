import React, { useState } from 'react';
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

const VoucherLogin = ({ onBack, currentLanguage }) => {
  const theme = useTheme();
  const [voucherCode, setVoucherCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    toast.loading('Validating voucher code...');

    try {
      // Format phone number for API
      const formattedPhone = phoneNumber.startsWith('+255') ? phoneNumber : `+255${phoneNumber}`;
      
      // Use correct API endpoint: /voucher/{code}/validate (GET)
      // Using customerPortalAPI for exact endpoint match
      const apiResponse = await customerPortalAPI.validateVoucher(voucherCode.toUpperCase());
      // Axios returns response.data, extract the actual response
      const response = apiResponse.data || apiResponse;

      if (response.status === 'success') {
        const voucherData = response.data;
        
        // Check if voucher is valid and active
        if (voucherData.isActive && !voucherData.isUsed) {
          toast.success('Voucher is valid! You can now connect to GG Wi-Fi network.');
          console.log('Voucher validated successfully:', voucherData);
          // TODO: Redirect to connection page or show connection success
        } else if (voucherData.isUsed) {
          toast.error('This voucher has already been used.');
        } else if (!voucherData.isActive) {
          toast.error('This voucher is not active.');
        } else {
          toast.error('Voucher validation failed.');
        }
      } else {
        toast.error(response.message || 'Failed to validate voucher. Please check your voucher code.');
      }
    } catch (error) {
      console.error('Voucher validation failed:', error);
      toast.error('Failed to validate voucher. Please check your voucher code and try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

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
        background: `
          linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%),
          radial-gradient(circle at 20% 20%, rgba(255, 199, 44, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0, 114, 206, 0.08) 0%, transparent 50%)
        `,
        py: 4,
        position: 'relative',
      }}
    >
      <Container maxWidth="sm">
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
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 6 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 12px 40px rgba(255, 199, 44, 0.4)',
                      }}
                    >
                      <WifiIcon sx={{ fontSize: 40, color: '#000000' }} />
                    </Avatar>
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
                          background: 'rgba(255, 255, 255, 0.8)',
                          color: feature.color,
                          border: `1px solid ${feature.color}40`,
                          '& .MuiChip-icon': {
                            color: feature.color,
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ mb: 4 }} />

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
                          background: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#FFC72C',
                            },
                          },
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#FFC72C',
                              borderWidth: 2,
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 600,
                          '&.Mui-focused': {
                            color: '#FFC72C',
                          },
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
                          background: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#0072CE',
                            },
                          },
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#0072CE',
                              borderWidth: 2,
                            },
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 600,
                          '&.Mui-focused': {
                            color: '#0072CE',
                          },
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
        </motion.div>
      </Container>
    </Box>
  );
};

export default VoucherLogin;