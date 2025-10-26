import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CustomerPortalHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleContactClick = () => {
    window.open('tel:+255742844024', '_self');
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I need help with GG Wi-Fi services.');
    window.open(`https://wa.me/255742844024?text=${message}`, '_blank');
  };

  const handleServiceAreasClick = () => {
    alert('Service Areas:\n• Dar es Salaam\n• Arusha\n• Mwanza\n• Dodoma\n• Morogoro\n• Tanga\n• Mbeya\n• Iringa');
  };

  const handleLogoClick = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: '#000000', // Black background
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        borderBottom: `1px solid #FFC72C`, // Golden yellow border
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Branding */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleLogoClick}
        >
          <img
            src="/logo.svg"
            alt="GG Wi-Fi Logo"
            style={{ height: isMobile ? '30px' : '40px', marginRight: theme.spacing(1) }}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              color: '#FFFFFF', // White text
              display: { xs: 'none', sm: 'block' },
            }}
          >
            GG Wi-Fi
          </Typography>
        </Box>

        {/* Contact Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <Tooltip title="Contact Support">
            <IconButton
              color="inherit"
              onClick={handleContactClick}
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                color: '#FFFFFF', // White icon
                '&:hover': {
                  color: '#FFC72C', // Golden yellow on hover
                  backgroundColor: 'rgba(255, 199, 44, 0.1)',
                },
              }}
            >
              <PhoneIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="WhatsApp Chat">
            <IconButton
              color="inherit"
              onClick={handleWhatsAppClick}
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                color: '#FFFFFF', // White icon
                '&:hover': {
                  color: '#FFC72C', // Golden yellow on hover
                  backgroundColor: 'rgba(255, 199, 44, 0.1)',
                },
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Service Areas">
            <IconButton
              color="inherit"
              onClick={handleServiceAreasClick}
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                color: '#FFFFFF', // White icon
                '&:hover': {
                  color: '#FFC72C', // Golden yellow on hover
                  backgroundColor: 'rgba(255, 199, 44, 0.1)',
                },
              }}
            >
              <LocationOnIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomerPortalHeader;
