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
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Phone, Person, Lock, Badge } from '@mui/icons-material';
import useAuthStore from '../../../store/authStore';
import { motion } from 'framer-motion';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'staff'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: '',
    staffId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

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

    if (loginType === 'admin' && !formData.phoneNumber) {
      setLocalError('Phone number is required for admin login');
      return;
    }

    if (loginType === 'staff' && !formData.staffId) {
      setLocalError('Staff ID is required for staff login');
      return;
    }

    try {
      const credentials = {
        username: formData.username,
        password: formData.password,
        loginType,
        ...(loginType === 'admin' ? { phoneNumber: formData.phoneNumber } : { staffId: formData.staffId }),
      };

      const result = await login(credentials);
      
      if (result?.success) {
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
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 50%, #2d2d2d 100%)',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            maxWidth: 450,
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0A0A0A', mb: 1 }}>
                GG WiFi Admin
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                Sign in to access the admin portal
              </Typography>
            </Box>

            <Tabs
              value={loginType}
              onChange={(e, newValue) => {
                setLoginType(newValue);
                setFormData({ username: '', password: '', phoneNumber: '', staffId: '' });
                setLocalError('');
              }}
              sx={{ mb: 3 }}
            >
              <Tab label="Admin" value="admin" />
              <Tab label="Staff" value="staff" />
            </Tabs>

            {(error || localError) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {localError || error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={handleChange('username')}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#F2C94C' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {loginType === 'admin' ? (
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange('phoneNumber')}
                  margin="normal"
                  required
                  placeholder="+255712345678"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#F2C94C' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              ) : (
                <TextField
                  fullWidth
                  label="Staff ID"
                  value={formData.staffId}
                  onChange={handleChange('staffId')}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: '#F2C94C' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                margin="normal"
                required
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
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  backgroundColor: '#F2C94C',
                  color: '#0A0A0A',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#E0B335',
                  },
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default LoginForm;
