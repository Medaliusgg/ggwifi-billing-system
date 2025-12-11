import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Phone, 
  Person, 
  Lock, 
  Security,
  ArrowForward,
} from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useReducedMotion();
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.username || !formData.password) {
      setLocalError('Username and password are required');
      return;
    }

    if (!formData.phoneNumber) {
      setLocalError('Phone number is required');
      return;
    }

    try {
      const credentials = {
        username: formData.username,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        loginType: 'admin',
      };

      const result = await login(credentials);
      
      if (result?.success) {
        const user = result.user || result.data?.user;
        if (user && user.role !== 'SUPER_ADMIN') {
          setLocalError('Access denied. Only Super Admin can access this portal.');
          return;
        }
        navigate('/dashboard');
      } else {
        setLocalError(result?.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setLocalError(err.message || 'An error occurred during login');
    }
  };

  // Reduced animations for mobile and accessibility
  const animationConfig = prefersReducedMotion || isMobile 
    ? { duration: 0.1 } 
    : { duration: 0.6 };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: isMobile 
          ? 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 50%, #0A0A0A 100%)',
        padding: isMobile ? 1.5 : 2,
      }}
    >
      {/* Lightweight Background - Only on Desktop */}
      {!isMobile && !prefersReducedMotion && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: 0,
            opacity: 0.05,
          }}
        >
          {/* Minimal grid pattern */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(242, 201, 76, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(242, 201, 76, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </Box>
      )}

      {/* Main Content */}
      <Container 
        maxWidth="sm" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          width: '100%',
          px: isMobile ? 1 : 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 0 : 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={animationConfig}
        >
          <Card
            sx={{
              borderRadius: isMobile ? 2 : 3,
              boxShadow: isMobile 
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(242, 201, 76, 0.1)',
              background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.98) 0%, rgba(10, 10, 10, 0.99) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(242, 201, 76, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: isMobile ? 3 : 4, position: 'relative', zIndex: 1 }}>
              {/* Logo/Header Section */}
              <Box
                sx={{
                  textAlign: 'center',
                  marginBottom: isMobile ? '1.5rem' : '2rem',
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 60 : 80,
                    height: isMobile ? 60 : 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(242, 201, 76, 0.4)',
                    margin: '0 auto',
                    mb: 2,
                  }}
                >
                  <Security sx={{ fontSize: isMobile ? 30 : 40, color: '#0A0A0A' }} />
                </Box>

                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 0.5,
                    letterSpacing: '0.02em',
                  }}
                >
                  GG WiFi Admin
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: isMobile ? '0.85rem' : '0.95rem',
                  }}
                >
                  Secure Admin Portal Access
                </Typography>
              </Box>

              {/* Error Alert */}
              <AnimatePresence>
                {(error || localError) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert
                      severity="error"
                      sx={{
                        mb: 2,
                        background: 'rgba(211, 47, 47, 0.1)',
                        border: '1px solid rgba(211, 47, 47, 0.3)',
                        color: '#ff6b6b',
                        borderRadius: 2,
                        fontSize: isMobile ? '0.875rem' : '1rem',
                      }}
                    >
                      {localError || error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={handleChange('username')}
                  margin="normal"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      fontSize: isMobile ? '16px' : undefined, // Prevents zoom on iOS
                      '& fieldset': {
                        borderColor: 'rgba(242, 201, 76, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(242, 201, 76, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#F2C94C',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      '&.Mui-focused': {
                        color: '#F2C94C',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                      padding: isMobile ? '12px 14px' : '14px 14px',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#F2C94C', fontSize: isMobile ? 20 : 24 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange('phoneNumber')}
                  margin="normal"
                  required
                  placeholder="+255712345678"
                  autoComplete="tel"
                  type="tel"
                  inputMode="tel"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      fontSize: isMobile ? '16px' : undefined, // Prevents zoom on iOS
                      '& fieldset': {
                        borderColor: 'rgba(242, 201, 76, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(242, 201, 76, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#F2C94C',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      '&.Mui-focused': {
                        color: '#F2C94C',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                      padding: isMobile ? '12px 14px' : '14px 14px',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#F2C94C', fontSize: isMobile ? 20 : 24 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  margin="normal"
                  required
                  autoComplete="current-password"
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      fontSize: isMobile ? '16px' : undefined, // Prevents zoom on iOS
                      '& fieldset': {
                        borderColor: 'rgba(242, 201, 76, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(242, 201, 76, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#F2C94C',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      '&.Mui-focused': {
                        color: '#F2C94C',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                      padding: isMobile ? '12px 14px' : '14px 14px',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#F2C94C', fontSize: isMobile ? 20 : 24 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            padding: isMobile ? '8px' : '12px',
                          }}
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  endIcon={!isLoading && <ArrowForward />}
                  sx={{
                    py: isMobile ? 1.5 : 1.8,
                    background: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
                    color: '#0A0A0A',
                    fontWeight: 700,
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 16px rgba(242, 201, 76, 0.3)',
                    minHeight: isMobile ? '48px' : '56px', // Better touch target
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E0B335 0%, #F2C94C 100%)',
                      boxShadow: '0 6px 20px rgba(242, 201, 76, 0.4)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                    '&:disabled': {
                      background: 'rgba(242, 201, 76, 0.5)',
                      color: 'rgba(10, 10, 10, 0.5)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              {/* Footer */}
              <Box
                sx={{
                  textAlign: 'center',
                  marginTop: isMobile ? '1.5rem' : '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(242, 201, 76, 0.2)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: isMobile ? '0.75rem' : '0.85rem',
                  }}
                >
                  © {new Date().getFullYear()} GG WiFi | The Signal That Cares
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
