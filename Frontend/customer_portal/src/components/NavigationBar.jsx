import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationOnIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Wifi as WifiIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const NavigationBar = ({ currentView, onNavigateToHome, onNavigateToPackages, onNavigateToVoucher }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);

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
    if (onNavigateToHome) {
      onNavigateToHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleMobileNav = (navFunction) => {
    navFunction();
    handleMobileMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderBottom: `2px solid #FFC72C`,
        zIndex: theme.zIndex.drawer + 1,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        {/* Logo and Branding */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }}
          onClick={handleLogoClick}
        >
          <Avatar
            src="/gg-logo.png"
            alt="GG Wi-Fi Logo"
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              border: '3px solid #FFC72C',
              boxShadow: '0 4px 20px rgba(255, 199, 44, 0.6), 0 0 30px rgba(255, 199, 44, 0.3)',
              background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
              filter: 'brightness(1.1)',
              '& img': {
                objectFit: 'contain',
                padding: '2px',
                filter: 'brightness(1.2) contrast(1.1)',
              },
            }}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FFC72C 0%, #FFFFFF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' },
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            GG Wi-Fi
          </Typography>
        </Box>

        {/* Navigation Buttons - Desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<HomeIcon />}
              onClick={onNavigateToHome}
              sx={{
                color: currentView === 'landing' ? '#FFC72C' : '#FFFFFF',
                fontWeight: currentView === 'landing' ? 700 : 500,
                borderBottom: currentView === 'landing' ? '2px solid #FFC72C' : 'none',
                borderRadius: 0,
                '&:hover': {
                  color: '#FFC72C',
                  backgroundColor: 'rgba(255, 199, 44, 0.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Home
            </Button>
            <Button
              startIcon={<ShoppingCartIcon />}
              onClick={onNavigateToPackages}
              sx={{
                color: currentView === 'packages' ? '#FFC72C' : '#FFFFFF',
                fontWeight: currentView === 'packages' ? 700 : 500,
                borderBottom: currentView === 'packages' ? '2px solid #FFC72C' : 'none',
                borderRadius: 0,
                '&:hover': {
                  color: '#FFC72C',
                  backgroundColor: 'rgba(255, 199, 44, 0.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Buy Packages
            </Button>
            <Button
              startIcon={<WifiIcon />}
              onClick={onNavigateToVoucher}
              sx={{
                color: currentView === 'voucher' ? '#FFC72C' : '#FFFFFF',
                fontWeight: currentView === 'voucher' ? 700 : 500,
                borderBottom: currentView === 'voucher' ? '2px solid #FFC72C' : 'none',
                borderRadius: 0,
                '&:hover': {
                  color: '#FFC72C',
                  backgroundColor: 'rgba(255, 199, 44, 0.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Voucher Login
            </Button>
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={handleMobileMenuOpen}
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                color: '#FFC72C',
                backgroundColor: 'rgba(255, 199, 44, 0.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          sx={{
            '& .MuiPaper-root': {
              background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
              border: '1px solid #FFC72C',
              borderRadius: 2,
              minWidth: 200,
            },
          }}
        >
          <MenuItem
            onClick={() => handleMobileNav(onNavigateToHome)}
            sx={{
              color: currentView === 'landing' ? '#FFC72C' : '#FFFFFF',
              fontWeight: currentView === 'landing' ? 700 : 500,
              '&:hover': {
                backgroundColor: 'rgba(255, 199, 44, 0.1)',
                color: '#FFC72C',
              },
            }}
          >
            <HomeIcon sx={{ mr: 1 }} />
            Home
          </MenuItem>
          <MenuItem
            onClick={() => handleMobileNav(onNavigateToPackages)}
            sx={{
              color: currentView === 'packages' ? '#FFC72C' : '#FFFFFF',
              fontWeight: currentView === 'packages' ? 700 : 500,
              '&:hover': {
                backgroundColor: 'rgba(255, 199, 44, 0.1)',
                color: '#FFC72C',
              },
            }}
          >
            <ShoppingCartIcon sx={{ mr: 1 }} />
            Buy Packages
          </MenuItem>
          <MenuItem
            onClick={() => handleMobileNav(onNavigateToVoucher)}
            sx={{
              color: currentView === 'voucher' ? '#FFC72C' : '#FFFFFF',
              fontWeight: currentView === 'voucher' ? 700 : 500,
              '&:hover': {
                backgroundColor: 'rgba(255, 199, 44, 0.1)',
                color: '#FFC72C',
              },
            }}
          >
            <WifiIcon sx={{ mr: 1 }} />
            Voucher Login
          </MenuItem>
        </Menu>

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
                color: '#FFFFFF',
                '&:hover': {
                  color: '#FFC72C',
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
                color: '#FFFFFF',
                '&:hover': {
                  color: '#25D366',
                  backgroundColor: 'rgba(37, 211, 102, 0.1)',
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
                color: '#FFFFFF',
                '&:hover': {
                  color: '#FFC72C',
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

export default NavigationBar;


