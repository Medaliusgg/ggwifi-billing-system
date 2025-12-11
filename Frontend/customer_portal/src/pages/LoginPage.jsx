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
import GlobalHeader from '../components/GlobalHeader';
import { customerPortalAPI } from '../services/customerPortalApi';

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const colors = {
    background: theme.palette.background.default,
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    warningDark: theme.palette.warning.dark,
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
      const response = await customerPortalAPI.login({
        phone: formData.phone,
        password: formData.password,
      });

      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
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
                  sx={{ mb: 3 }}
                  placeholder="+255 742 844 024"
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/otp-login')}
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    mb: 3,
                    color: colors.info,
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Use one-time PIN (OTP)
                </Link>

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
                mb: 2,
                '&:hover': {
                  backgroundColor: colors.warningDark,
                      boxShadow: '0 4px 12px rgba(244, 140, 6, 0.3)',
                    },
                  }}
                >
                  {loading ? 'Logging in...' : 'LOGIN'}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/signup/phone')}
                  sx={{
                borderColor: colors.info,
                color: colors.info,
                fontWeight: 600,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '18px',
                '&:hover': {
                  borderColor: theme.palette.info.dark,
                  backgroundColor: theme.palette.info.light,
                    },
                  }}
                >
                  SIGN UP
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
