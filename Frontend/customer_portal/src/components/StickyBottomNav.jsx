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
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #EEEEEE',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        }}
        elevation={8}
      >
        <BottomNavigation
          value={getActiveTab()}
          onChange={handleChange}
          sx={{
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '8px 4px',
              color: '#666666',
              '&.Mui-selected': {
                color: '#F48C06', // Orange
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.7rem',
                  fontWeight: 600,
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.65rem',
                fontWeight: 500,
                marginTop: '4px',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.4rem',
                marginBottom: '2px',
              },
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            value={0}
          />
          <BottomNavigationAction
            label="Wi-Fi Plans"
            icon={<WifiIcon />}
            value={1}
          />
          <BottomNavigationAction
            label="Connections"
            icon={<DevicesIcon />}
            value={2}
          />
          <BottomNavigationAction
            label="Purchases"
            icon={<ShoppingBagIcon />}
            value={3}
          />
          <BottomNavigationAction
            label="Rewards"
            icon={<GiftIcon />}
            value={4}
          />
        </BottomNavigation>
      </Paper>
    </motion.div>
  );
};

export default StickyBottomNav;
