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
          {/* Logo Image - Using transparent PNG if available */}
          <Box
            component="img"
            src="/logo.png"
            alt="GG Wi-Fi Logo"
            onError={(e) => {
              // Fallback if logo not found
              e.target.style.display = 'none';
            }}
            sx={{
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
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

          {/* Login Button (if not authenticated) */}
          {!isAuthenticated && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                px: 2,
              }}
            >
              Login
            </Button>
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
