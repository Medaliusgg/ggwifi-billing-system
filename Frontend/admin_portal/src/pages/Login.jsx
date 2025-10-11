import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Phone,
  Lock,
  Login as LoginIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/api/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setLoading } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+255|255|0)[0-9]{9}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid Tanzanian phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('🔍 Debug: Form submitted with data:', formData);
    console.log('🔍 Debug: Form validation result:', validateForm());
    
    if (!validateForm()) {
      console.log('🔍 Debug: Form validation failed, not proceeding with login');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      console.log('🔍 Debug: Making login request with:', formData);
      console.log('🔍 Debug: API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api/v1');
      
      const response = await authAPI.login(formData);
      console.log('🔍 Debug: Login response:', response);
      
      if (response.success) {
        // Store user data and tokens
        login(response.user, response.token, response.refreshToken);
        
        enqueueSnackbar('Login successful! Welcome back.', { 
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
        
        // Navigate to intended page or dashboard
        navigate(from, { replace: true });
      } else {
        enqueueSnackbar(response.error || 'Login failed. Please try again.', { 
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      enqueueSnackbar(
        error.response?.data?.error || 
        'Login failed. Please check your credentials and try again.', 
        { 
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        }
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-8 max-w-sm mx-auto">

        {/* Phone Number Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange('phoneNumber')}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            placeholder="+255 123 456 789"
            className="input-primary"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone className="text-gg-gold" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2E2E2E',
                borderRadius: 3,
                '& fieldset': {
                  borderColor: errors.phoneNumber ? '#F44336' : '#FFD70030',
                },
                '&:hover fieldset': {
                  borderColor: errors.phoneNumber ? '#F44336' : '#FFD70050',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                  boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.2)',
                },
                '&.Mui-focused': {
                  '& fieldset': {
                    borderColor: '#FFD700 !important',
                  },
                },
              },
              '& .MuiInputLabel-root': {
                color: '#BFBFBF',
                '&.Mui-focused': {
                  color: '#FFD700',
                },
              },
              '& .MuiInputBase-input': {
                color: '#FFFFFF',
                '&:focus': {
                  color: '#FFFFFF',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: errors.phoneNumber ? '#F44336' : '#FFD70030',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: errors.phoneNumber ? '#F44336' : '#FFD70050',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700 !important',
              },
            }}
          />
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!errors.password}
            helperText={errors.password}
            placeholder="Enter your password"
            className="input-primary"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock className="text-gg-gold" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    className="text-gg-text-secondary hover:text-gg-gold"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2E2E2E',
                borderRadius: 3,
                '& fieldset': {
                  borderColor: errors.password ? '#F44336' : '#FFD70030',
                },
                '&:hover fieldset': {
                  borderColor: errors.password ? '#F44336' : '#FFD70050',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                  boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.2)',
                },
                '&.Mui-focused': {
                  '& fieldset': {
                    borderColor: '#FFD700 !important',
                  },
                },
              },
              '& .MuiInputLabel-root': {
                color: '#BFBFBF',
                '&.Mui-focused': {
                  color: '#FFD700',
                },
              },
              '& .MuiInputBase-input': {
                color: '#FFFFFF',
                '&:focus': {
                  color: '#FFFFFF',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: errors.password ? '#F44336' : '#FFD70030',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: errors.password ? '#F44336' : '#FFD70050',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700 !important',
              },
            }}
          />
        </motion.div>


        {/* Login Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={<LoginIcon />}
            className="btn-primary h-12 text-base font-semibold"
            sx={{
              backgroundColor: '#FFD700',
              color: '#000000',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
              '&:hover': {
                backgroundColor: '#E6C200',
                boxShadow: '0 0 25px rgba(255, 215, 0, 0.5)',
              },
              '&:disabled': {
                backgroundColor: '#666666',
                color: '#999999',
                boxShadow: 'none',
              },
            }}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </motion.div>

    </Box>
  );
};

export default Login; 