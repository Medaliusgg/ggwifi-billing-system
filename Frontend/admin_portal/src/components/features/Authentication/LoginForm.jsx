import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Divider,
  Link,
  Avatar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Login as LoginIcon,
  Security as SecurityIcon,
  Wifi as WifiIcon,
  Phone,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

const LoginForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate admin login fields
    if (!formData.username || !formData.phoneNumber || !formData.password) {
      enqueueSnackbar('Please fill in all fields', { variant: 'error' });
      return;
    }

    try {
      console.log('🔍 Debug: Attempting admin login with credentials:', { 
        username: formData.username, 
        rememberMe 
      });
      
      const credentials = {
        username: formData.username,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        rememberMe: rememberMe,
        loginType: 'admin'
      };
      
      const result = await login(credentials);
      console.log('🔍 Debug: Login result:', result);
      
      if (result.success) {
        console.log('🔍 Debug: Login successful, navigating to dashboard');
        console.log('🔍 Debug: Current auth state:', {
          isAuthenticated: result.user ? true : false,
          user: result.user?.username,
          role: result.user?.role
        });
        
        // Get the intended destination or default to dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        console.log('🔍 Debug: Navigating to:', from);
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
        
        enqueueSnackbar('Welcome back, Admin!', { variant: 'success' });
      } else {
        console.log('🔍 Debug: Login failed:', result.error);
        enqueueSnackbar(result.error || 'Login failed', { variant: 'error' });
      }
    } catch (err) {
      console.error('🔍 Debug: Login error:', err);
      enqueueSnackbar('Login failed. Please try again.', { variant: 'error' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ width: '100%' }}
    >
      {/* GG Wi-Fi Logo and Branding */}
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 32 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: ggwifiTheme.gradients.primary,
              color: ggwifiTheme.colors.secondary,
              fontSize: '2rem',
              fontWeight: 'bold',
              boxShadow: ggwifiTheme.shadows.golden,
            }}
          >
            GG
          </Avatar>
        </Box>
        
        <Typography
          variant="h4"
          sx={{
            fontFamily: ggwifiTheme.typography.fontFamily.primary,
            fontWeight: ggwifiTheme.typography.fontWeight.bold,
            background: ggwifiTheme.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1,
          }}
        >
          GG Wi-Fi
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: ggwifiTheme.colors.neutral,
            fontStyle: 'italic',
            fontSize: ggwifiTheme.typography.fontSize.sm,
          }}
        >
          The Signal That Cares
        </Typography>
      </motion.div>


      {/* Login Card */}
      <motion.div variants={cardVariants}>
        <Card
          sx={{
            background: ggwifiTheme.gradients.card,
            borderRadius: ggwifiTheme.borderRadius.lg,
            boxShadow: ggwifiTheme.shadows.golden,
            border: `1px solid rgba(245, 183, 0, 0.2)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Card Header Accent */}
          <Box
            sx={{
              height: 4,
              background: ggwifiTheme.gradients.primary,
              width: '100%',
            }}
          />
          
          <CardContent sx={{ p: 4 }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                  color: ggwifiTheme.colors.secondary,
                  textAlign: 'center',
                  mb: 3,
                }}
              >
                Admin Portal Login
              </Typography>
            </motion.div>

            {error && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: ggwifiTheme.borderRadius.md,
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.2)',
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: ggwifiTheme.colors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: ggwifiTheme.borderRadius.md,
                      backgroundColor: ggwifiTheme.colors.contrast,
                      '& fieldset': {
                        borderColor: ggwifiTheme.colors.neutral,
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: ggwifiTheme.colors.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: ggwifiTheme.colors.primary,
                        boxShadow: `0 0 0 3px rgba(245, 183, 0, 0.1)`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: ggwifiTheme.colors.neutral,
                      '&.Mui-focused': {
                        color: ggwifiTheme.colors.primary,
                      },
                    },
                  }}
                />
              </motion.div>

              {/* Phone Number Field */}
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="e.g., 0742844024"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: ggwifiTheme.colors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: ggwifiTheme.borderRadius.md,
                      backgroundColor: ggwifiTheme.colors.contrast,
                      '& fieldset': {
                        borderColor: ggwifiTheme.colors.neutral,
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: ggwifiTheme.colors.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: ggwifiTheme.colors.primary,
                        boxShadow: `0 0 0 3px rgba(245, 183, 0, 0.1)`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: ggwifiTheme.colors.neutral,
                      '&.Mui-focused': {
                        color: ggwifiTheme.colors.primary,
                      },
                    },
                  }}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: ggwifiTheme.colors.primary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{ color: ggwifiTheme.colors.neutral }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: ggwifiTheme.borderRadius.md,
                      backgroundColor: ggwifiTheme.colors.contrast,
                      '& fieldset': {
                        borderColor: ggwifiTheme.colors.neutral,
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: ggwifiTheme.colors.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: ggwifiTheme.colors.primary,
                        boxShadow: `0 0 0 3px rgba(245, 183, 0, 0.1)`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: ggwifiTheme.colors.neutral,
                      '&.Mui-focused': {
                        color: ggwifiTheme.colors.primary,
                      },
                    },
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                  sx={{
                    background: ggwifiTheme.gradients.primary,
                    color: ggwifiTheme.colors.secondary,
                    borderRadius: ggwifiTheme.borderRadius.full,
                    padding: `${ggwifiTheme.spacing.md} ${ggwifiTheme.spacing.xl}`,
                    fontSize: ggwifiTheme.typography.fontSize.base,
                    fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                    boxShadow: ggwifiTheme.shadows.golden,
                    textTransform: 'none',
                    '&:hover': {
                      background: ggwifiTheme.gradients.primaryHover,
                      boxShadow: ggwifiTheme.shadows.goldenHover,
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&:disabled': {
                      background: ggwifiTheme.colors.neutral,
                      color: ggwifiTheme.colors.contrast,
                      boxShadow: 'none',
                    },
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In as Admin'}
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: ggwifiTheme.colors.neutral,
                    fontSize: ggwifiTheme.typography.fontSize.sm,
                  }}
                >
                  Secure connection powered by{' '}
                  <SecurityIcon sx={{ fontSize: 16, verticalAlign: 'middle', mx: 0.5 }} />
                  GG Wi-Fi
                </Typography>
              </Box>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;