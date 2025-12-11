import React, { useState } from 'react';
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

const SignupDetailsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const colors = {
    background: theme.palette.background.default,
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    warning: theme.palette.warning.main,
    warningDark: theme.palette.warning.dark,
  };
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const phone = localStorage.getItem('signup_phone');
  const verified = localStorage.getItem('signup_verified');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('PINs do not match');
      return;
    }

    // PIN must be exactly 4 digits
    if (formData.password.length !== 4 || !/^\d{4}$/.test(formData.password)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    setLoading(true);

    try {
      const signupToken = localStorage.getItem('signup_token');
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const response = await customerPortalAPI.signupCreate({
        phone,
        fullName: fullName,
        email: formData.email || null,
        pin: formData.password,
        confirmPin: formData.confirmPassword,
        signupToken: signupToken,
      });

      if (response?.data?.status === 'success' && response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
        // Clear signup flow data
        localStorage.removeItem('signup_phone');
        localStorage.removeItem('signup_verified');
        localStorage.removeItem('signup_token');
        
        // Show welcome message with rewards
        navigate('/dashboard', {
          state: {
            welcome: true,
            rewards: {
              voucher: 'Free 20-minute GG Offer voucher',
              points: 50,
            },
          },
        });
      } else {
        setError(response?.data?.message || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!phone || !verified) {
    navigate('/signup/phone');
    return null;
  }

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
                Complete Registration
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  color: colors.textSecondary,
                }}
              >
                Step 3 of 3: Fill in your details
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Email (Optional)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="PIN (4 digits)"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  inputProps={{ maxLength: 4, pattern: '[0-9]*' }}
                  sx={{ mb: 2 }}
                  helperText="Create a 4-digit PIN for login"
                />

                <TextField
                  fullWidth
                  label="Confirm PIN"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  inputProps={{ maxLength: 4, pattern: '[0-9]*' }}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={loading}
                  sx={{
                backgroundColor: colors.warning,
                color: theme.palette.background.paper,
                fontWeight: 600,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '18px',
                '&:hover': {
                  backgroundColor: colors.warningDark,
                      boxShadow: '0 4px 12px rgba(244, 140, 6, 0.3)',
                    },
                  }}
                >
                  {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignupDetailsPage;
