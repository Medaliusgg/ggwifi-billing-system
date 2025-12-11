import React from 'react';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  Wifi as WifiIcon,
  Devices as DevicesIcon,
  ShoppingBag as ShoppingBagIcon,
  CardGiftcard as GiftIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const StickyBottomNav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // Only show after login
  if (!token) return null;

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/home') return 0;
    if (path === '/plans') return 1;
    if (path === '/connections') return 2;
    if (path === '/purchases') return 3;
    if (path === '/rewards') return 4;
    return -1;
  };

  const handleChange = (event, newValue) => {
    const routes = ['/dashboard', '/plans', '/connections', '/purchases', '/rewards'];
    if (routes[newValue]) {
      navigate(routes[newValue]);
    }
  };

  if (!isMobile) return null; // Only show on mobile

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar + 1,
          backgroundColor: theme.palette.primary.main, // Golden Yellow #FFCC00
          borderTop: `2px solid ${theme.palette.primary.dark}`,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        }}
        elevation={8}
      >
        <BottomNavigation
          value={getActiveTab()}
          onChange={handleChange}
          sx={{
            backgroundColor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '8px 4px',
              color: theme.palette.text.primary, // Black text on yellow
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
              '&.Mui-selected': {
                color: theme.palette.text.primary, // Black when selected
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.7rem',
                  fontWeight: 700,
                },
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.15)',
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.65rem',
                fontWeight: 500,
                marginTop: '4px',
                transition: 'all 0.2s ease',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.5rem',
                marginBottom: '2px',
                transition: 'all 0.2s ease',
              },
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            value={0}
            showLabel
          />
          <BottomNavigationAction
            label="Plans"
            icon={<WifiIcon />}
            value={1}
            showLabel
          />
          <BottomNavigationAction
            label="Connections"
            icon={<DevicesIcon />}
            value={2}
            showLabel
          />
          <BottomNavigationAction
            label="Purchases"
            icon={<ShoppingBagIcon />}
            value={3}
            showLabel
          />
          <BottomNavigationAction
            label="Rewards"
            icon={<GiftIcon />}
            value={4}
            showLabel
          />
        </BottomNavigation>
      </Paper>
    </motion.div>
  );
};

export default StickyBottomNav;
