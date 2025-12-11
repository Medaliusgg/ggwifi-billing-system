import React, { useState } from 'react';
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
  Fade,
  Zoom,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Phone, 
  Person, 
  Lock, 
  Security,
  Wifi,
  Speed,
  Shield,
  Login as LoginIcon,
  ArrowForward,
} from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validation
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 50%, #0A0A0A 100%)',
        padding: 2,
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {/* Floating WiFi Icons */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          >
            <Wifi sx={{ fontSize: 40, color: '#F2C94C' }} />
          </motion.div>
        ))}

        {/* Animated Grid Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(242, 201, 76, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(242, 201, 76, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
            '@keyframes gridMove': {
              '0%': { transform: 'translate(0, 0)' },
              '100%': { transform: 'translate(50px, 50px)' },
            },
          }}
        />

        {/* Pulsing Circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            style={{
              position: 'absolute',
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: `2px solid rgba(242, 201, 76, ${0.1 - i * 0.01})`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </Box>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(242, 201, 76, 0.1)',
              background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(242, 201, 76, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Glowing Border Effect */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '16px',
                padding: '2px',
                background: 'linear-gradient(135deg, rgba(242, 201, 76, 0.3), rgba(242, 201, 76, 0.1))',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              animate={{
                opacity: isHovered ? [0.5, 1, 0.5] : 0.3,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <CardContent sx={{ p: 5, position: 'relative', zIndex: 1 }}>
              {/* Logo/Header Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ textAlign: 'center', marginBottom: '2rem' }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ display: 'inline-block', marginBottom: '1rem' }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 30px rgba(242, 201, 76, 0.5)',
                      margin: '0 auto',
                    }}
                  >
                    <Security sx={{ fontSize: 40, color: '#0A0A0A' }} />
                  </Box>
                </motion.div>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                    letterSpacing: '0.05em',
                  }}
                >
                  GG WiFi Admin
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.95rem',
                    letterSpacing: '0.03em',
                  }}
                >
                  Secure Admin Portal Access
                </Typography>
              </motion.div>

              {/* Error Alert */}
              <AnimatePresence>
                {(error || localError) && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        background: 'rgba(211, 47, 47, 0.1)',
                        border: '1px solid rgba(211, 47, 47, 0.3)',
                        color: '#ff6b6b',
                        borderRadius: 2,
                      }}
                    >
                      {localError || error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={handleChange('username')}
                    margin="normal"
                    required
                    autoComplete="username"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
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
                        '&.Mui-focused': {
                          color: '#F2C94C',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#fff',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#F2C94C' }} />
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
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
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
                        '&.Mui-focused': {
                          color: '#F2C94C',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#fff',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: '#F2C94C' }} />
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
                        '&.Mui-focused': {
                          color: '#F2C94C',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#fff',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#F2C94C' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      endIcon={isLoading ? <Speed sx={{ animation: 'spin 1s linear infinite' }} /> : <ArrowForward />}
                      sx={{
                        py: 1.8,
                        background: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
                        color: '#0A0A0A',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        textTransform: 'none',
                        letterSpacing: '0.05em',
                        boxShadow: '0 8px 24px rgba(242, 201, 76, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #E0B335 0%, #F2C94C 100%)',
                          boxShadow: '0 12px 32px rgba(242, 201, 76, 0.5)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          background: 'rgba(242, 201, 76, 0.5)',
                          color: 'rgba(10, 10, 10, 0.5)',
                        },
                        transition: 'all 0.3s ease',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{
                  textAlign: 'center',
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(242, 201, 76, 0.2)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.85rem',
                  }}
                >
                  © {new Date().getFullYear()} GG WiFi | The Signal That Cares
                </Typography>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
