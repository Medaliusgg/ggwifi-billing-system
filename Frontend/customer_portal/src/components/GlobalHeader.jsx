import React from 'react';
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
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  AccountCircle as AccountIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GlobalHeader = ({ isAuthenticated, user, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [accountMenuAnchor, setAccountMenuAnchor] = React.useState(null);

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
    handleAccountMenuClose();
    navigate('/home');
  };

  const handleAccount = () => {
    navigate('/dashboard');
    handleAccountMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#48C7F2', // Sky Blue header
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 3 } }}>
        {/* Logo */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/home')}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#FFFFFF',
              fontSize: { xs: '18px', md: '24px' },
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
              color: '#FFFFFF',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            <WhatsAppIcon />
          </IconButton>

          {/* Phone */}
          <IconButton
            onClick={handlePhoneCall}
            sx={{
              color: '#FFFFFF',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            <PhoneIcon />
          </IconButton>

          {/* Account/Login */}
          <IconButton
            onClick={handleAccountMenuOpen}
            sx={{
              color: '#FFFFFF',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            {isAuthenticated ? (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#FFFFFF',
                  color: '#48C7F2',
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
