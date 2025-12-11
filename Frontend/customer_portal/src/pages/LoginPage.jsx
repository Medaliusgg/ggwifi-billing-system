import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Login as LoginIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import GlobalHeader from '../components/GlobalHeader';
import GlobalButton from '../components/ui/GlobalButton';
import { customerPortalAPI } from '../services/customerPortalApi';

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  // ✅ GG Wi-Fi OFFICIAL BRAND COLORS
  const colors = {
    background: theme.palette.background.default, // Clean White
    textPrimary: theme.palette.text.primary, // Deep Black #000000
    textSecondary: theme.palette.text.secondary, // Dark Gray #333333
    primary: theme.palette.primary.main, // Primary Yellow #FFCC00
    primaryDark: theme.palette.primary.dark,
    warning: theme.palette.warning.main, // Orange - for buttons (secondary accent)
    warningDark: theme.palette.warning.dark,
    info: theme.palette.info.main, // Blue - secondary accent
  };
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      // Backend expects phoneNumber and pin
      const response = await customerPortalAPI.login({
        phone: formData.phone,
        password: formData.password, // Will be mapped to 'pin' in API service
      });

      if (response?.data?.status === 'success' && response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
        navigate('/dashboard');
      } else {
        setError(response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                  color: colors.textPrimary,
                }}
              >
                Login
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  color: colors.textSecondary,
                }}
              >
                Enter your credentials to access your account
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  sx={{ mb: 3 }}
                  placeholder="+255 742 844 024"
                />

                <TextField
                  fullWidth
                  label="PIN (4 digits)"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  inputProps={{ maxLength: 4, pattern: '[0-9]*' }}
                  sx={{ mb: 2 }}
                  helperText="Enter your 4-digit PIN"
                />

                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/otp-login')}
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    mb: 3,
                    color: colors.primary, // Primary Yellow
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Use one-time PIN (OTP)
                </Link>

                <GlobalButton
                  icon={<LoginIcon />}
                  variant="contained"
                  backgroundContext="white"
                  fullWidth
                  type="submit"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '18px',
                    mb: 2,
                  }}
                >
                  {loading ? 'Logging in...' : 'LOGIN'}
                </GlobalButton>

                <GlobalButton
                  icon={<PersonAddIcon />}
                  variant="outlined"
                  backgroundContext="white"
                  fullWidth
                  onClick={() => navigate('/signup/phone')}
                  sx={{
                    py: 1.5,
                    fontSize: '18px',
                  }}
                >
                  SIGN UP
                </GlobalButton>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
