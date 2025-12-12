import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  AccountCircle as AccountIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const GlobalHeader = ({ isAuthenticated, user, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { scrollY } = useScroll();

  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsApp = () => {
    window.open('https://wa.me/255742844024', '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+255742844024';
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleLogin = () => {
    navigate('/login');
    handleAccountMenuClose();
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    handleAccountMenuClose();
    navigate('/home');
  };

  const handleAccount = () => {
    navigate('/dashboard');
    handleAccountMenuClose();
  };

  const handleBack = () => {
    // Navigate back in history, or to home if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  // Always yellow background, but adjust opacity/shadow on scroll
  const boxShadow = scrolled 
    ? '0 2px 8px rgba(0,0,0,0.15)' 
    : '0 1px 4px rgba(0,0,0,0.1)';

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme.palette.primary.main, // Always Golden Yellow #FFCC00
        color: theme.palette.text.primary, // Black text on yellow
        boxShadow: boxShadow,
        borderBottom: `2px solid ${theme.palette.primary.dark}`,
        zIndex: theme.zIndex.drawer + 1,
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 3 } }}>
        {/* Left Side: Back Button (if not home) + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          {/* Back Arrow Button - Only show when NOT on home page */}
          {!isHomePage && (
            <IconButton
              component={motion.button}
              onClick={handleBack}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                color: theme.palette.text.primary, // Black on yellow
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  transform: 'translateX(-2px)',
                },
                transition: 'all 0.2s ease',
                mr: { xs: 0.5, md: 1 },
              }}
              size={isMobile ? 'small' : 'medium'}
              aria-label="Go back"
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          
          {/* Logo */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/home')}
            sx={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5 
            }}
          >
          {/* Circular Logo Avatar */}
          <Box
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
            sx={{
              cursor: 'pointer',
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${theme.palette.primary.dark}`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: logoError ? theme.palette.text.primary : 'transparent',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              },
            }}
          >
            {logoError ? (
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '16px', md: '20px' },
                  color: theme.palette.primary.main,
                }}
              >
                GG
              </Typography>
            ) : (
              <Box
                component="img"
                src="/gg-logo-transparent.png"
                alt="GG Wi-Fi Logo"
                onError={() => setLogoError(true)}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  transform: 'scale(1.5)',
                }}
              />
            )}
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary, // Black on yellow
              fontSize: { xs: '18px', md: '24px' },
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            GG Wi-Fi
          </Typography>
        </Box>
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
          {/* WhatsApp */}
          <IconButton
            onClick={handleWhatsApp}
            sx={{
              color: theme.palette.text.primary, // Black on yellow
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            <WhatsAppIcon />
          </IconButton>

          {/* Phone */}
          <IconButton
            onClick={handlePhoneCall}
            sx={{
              color: theme.palette.text.primary, // Black on yellow
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            <PhoneIcon />
          </IconButton>

          {/* Login/Sign-up Menu (if not authenticated) */}
          {!isAuthenticated && (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              <Button
                component={motion.button}
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  borderRadius: '12px',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#1A1A1A',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Login
              </Button>
              <Button
                component={motion.button}
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/signup/phone')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  borderRadius: '12px',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  borderColor: '#000000',
                  color: '#000000',
                  '&:hover': {
                    borderColor: '#000000',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}

          {/* Account/Login Icon */}
          <IconButton
            onClick={isAuthenticated ? handleAccountMenuOpen : handleLogin}
            sx={{
              color: theme.palette.text.primary, // Black on yellow
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            {isAuthenticated ? (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.text.primary,
                  color: theme.palette.primary.main,
                  fontSize: '14px',
                }}
              >
                {user?.firstName?.[0] || user?.phone?.[0] || 'U'}
              </Avatar>
            ) : (
              <AccountIcon />
            )}
          </IconButton>

          {/* Account Menu */}
          <Menu
            anchorEl={accountMenuAnchor}
            open={Boolean(accountMenuAnchor)}
            onClose={handleAccountMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {isAuthenticated ? (
              <>
                <MenuItem onClick={handleAccount}>
                  <AccountIcon sx={{ mr: 1 }} />
                  My Account
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleLogin}>
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default GlobalHeader;
