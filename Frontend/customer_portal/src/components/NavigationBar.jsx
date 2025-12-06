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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationOnIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Wifi as WifiIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  VpnKey as VpnKeyIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const NavigationBar = ({
  currentView,
  onNavigateToHome,
  onNavigateToPackages,
  onNavigateToVoucher,
  onNavigateToCustomer,
}) => {
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
        background: '#F2C94C',  // Official gold background
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',  // Shadow for gold background
        zIndex: theme.zIndex.drawer + 1,
        height: { xs: '70px', md: '100px' },  // Premium height
        transition: 'height 0.3s ease',
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
                border: '2px solid #0A0A0A',  // Black border on gold navbar
                background: '#FFFFFF',
                '& img': {
                  objectFit: 'contain',
                  padding: '2px',
                },
              }}
            />
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              color: '#0A0A0A',  // Black text on white background
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
                color: '#0A0A0A',  // Black text on gold navbar
                fontWeight: currentView === 'landing' ? 700 : 500,
                borderBottom: currentView === 'landing' ? '3px solid #0A0A0A' : 'none',  // Black accent when active
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#E0B335',  // Darker gold on hover
                  color: '#0A0A0A',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Home
            </Button>
            <Button
              startIcon={<ShoppingCartIcon />}
              onClick={onNavigateToPackages}
              sx={{
                color: '#0A0A0A',
                fontWeight: currentView === 'packages' ? 700 : 500,
                borderBottom: currentView === 'packages' ? '3px solid #0A0A0A' : 'none',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#E0B335',
                  color: '#0A0A0A',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Buy Packages
            </Button>
            <Button
              startIcon={<VpnKeyIcon />}
              onClick={onNavigateToVoucher}
              sx={{
                color: '#0A0A0A',
                fontWeight: currentView === 'voucher' ? 700 : 500,
                borderBottom: currentView === 'voucher' ? '3px solid #0A0A0A' : 'none',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#E0B335',
                  color: '#0A0A0A',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Connect
            </Button>
            <Button
              startIcon={<DashboardIcon />}
              onClick={onNavigateToCustomer}
              sx={{
                color: '#0A0A0A',
                fontWeight: currentView === 'customer' ? 700 : 500,
                borderBottom: currentView === 'customer' ? '3px solid #0A0A0A' : 'none',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#E0B335',
                  color: '#0A0A0A',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Dashboard
            </Button>
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={handleMobileMenuOpen}
            sx={{
              color: '#0A0A0A',  // Black icons on gold navbar
              '&:hover': {
                backgroundColor: '#E0B335',  // Darker gold on hover
                color: '#0A0A0A',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Menu - Full Screen Drawer */}
        <Drawer
          anchor="right"
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              width: { xs: '85%', sm: '320px' },
              maxWidth: '400px',
              background: '#FFFFFF',
              boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
            },
          }}
          transitionDuration={300}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Drawer Header */}
            <Box
              sx={{
                background: '#F2C94C',
                color: '#0A0A0A',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid #0A0A0A',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src="/gg-logo.png"
                  alt="GG Wi-Fi Logo"
                  sx={{
                    width: 48,
                    height: 48,
                    border: '2px solid #F2C94C',
                    background: '#FFFFFF',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A0A0A' }}>
                  Menu
                </Typography>
              </Box>
              <IconButton
                onClick={handleMobileMenuClose}
                sx={{
                  color: '#0A0A0A',
                  '&:hover': {
                    backgroundColor: '#E0B335',
                    color: '#0A0A0A',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Navigation List */}
            <List sx={{ flex: 1, pt: 2, px: 1 }}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleMobileNav(onNavigateToHome)}
                  selected={currentView === 'landing'}
                  sx={{
                    borderRadius: 2,
                    py: 2,
                    px: 2,
                    backgroundColor: currentView === 'landing' ? '#E0B335' : 'transparent',
                    borderLeft: currentView === 'landing' ? '4px solid #0A0A0A' : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: '#E0B335',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#E0B335',
                      '&:hover': {
                        backgroundColor: '#D4A100',
                      },
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <HomeIcon sx={{ color: '#0A0A0A', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Home"
                    primaryTypographyProps={{
                      fontWeight: currentView === 'landing' ? 700 : 500,
                      fontSize: '1.1rem',
                      color: '#0A0A0A',
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleMobileNav(onNavigateToPackages)}
                  selected={currentView === 'packages'}
                  sx={{
                    borderRadius: 2,
                    py: 2,
                    px: 2,
                    backgroundColor: currentView === 'packages' ? '#FFE89C' : 'transparent',
                    borderLeft: currentView === 'packages' ? '4px solid #F5C400' : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: '#FFE89C',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#FFE89C',
                      '&:hover': {
                        backgroundColor: '#FFE89C',
                      },
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ShoppingCartIcon sx={{ color: '#0A0A0A', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Buy Packages"
                    primaryTypographyProps={{
                      fontWeight: currentView === 'packages' ? 700 : 500,
                      fontSize: '1.1rem',
                      color: '#0A0A0A',
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleMobileNav(onNavigateToVoucher)}
                  selected={currentView === 'voucher'}
                  sx={{
                    borderRadius: 2,
                    py: 2,
                    px: 2,
                    backgroundColor: currentView === 'voucher' ? 'rgba(242, 201, 76, 0.1)' : 'transparent',
                    borderLeft: currentView === 'voucher' ? '4px solid #F2C94C' : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(242, 201, 76, 0.1)',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(242, 201, 76, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(242, 201, 76, 0.15)',
                      },
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <VpnKeyIcon sx={{ color: '#0A0A0A', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Voucher Login"
                    primaryTypographyProps={{
                      fontWeight: currentView === 'voucher' ? 700 : 500,
                      fontSize: '1.1rem',
                      color: '#0A0A0A',
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleMobileNav(onNavigateToCustomer)}
                  selected={currentView === 'customer'}
                  sx={{
                    borderRadius: 2,
                    py: 2,
                    px: 2,
                    backgroundColor: currentView === 'customer' ? 'rgba(242, 201, 76, 0.1)' : 'transparent',
                    borderLeft: currentView === 'customer' ? '4px solid #F2C94C' : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(242, 201, 76, 0.1)',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(242, 201, 76, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(242, 201, 76, 0.15)',
                      },
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <DashboardIcon sx={{ color: '#0A0A0A', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    primaryTypographyProps={{
                      fontWeight: currentView === 'customer' ? 700 : 500,
                      fontSize: '1.1rem',
                      color: '#0A0A0A',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>

            {/* Drawer Footer with Contact Info */}
            <Box sx={{ p: 2, borderTop: '1px solid #0A0A0A', background: '#F2C94C' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#0A0A0A' }}>
                Need Help?
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  startIcon={<PhoneIcon />}
                  onClick={handleContactClick}
                  sx={{
                    color: '#0A0A0A',
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#E0B335',
                      color: '#0A0A0A',
                    },
                  }}
                >
                  Call
                </Button>
                <Button
                  size="small"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleWhatsAppClick}
                  sx={{
                    color: '#0A0A0A',
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#E0B335',
                      color: '#0A0A0A',
                    },
                  }}
                >
                  WhatsApp
                </Button>
              </Box>
            </Box>
          </Box>
        </Drawer>

        {/* Contact Icons - Black on gold background */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <Tooltip title="Contact Support">
            <IconButton
              color="inherit"
              onClick={handleContactClick}
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                color: '#0A0A0A',  // Black icons on gold navbar
                '&:hover': {
                  backgroundColor: '#E0B335',  // Darker gold on hover
                  color: '#0A0A0A',
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
                color: '#0A0A0A',  // Black icons on gold navbar
                '&:hover': {
                  backgroundColor: '#E0B335',  // Darker gold on hover
                  color: '#0A0A0A',
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
                color: '#0A0A0A',  // Black icons on gold navbar
                '&:hover': {
                  backgroundColor: '#E0B335',  // Darker gold on hover
                  color: '#0A0A0A',
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


