import React from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Wifi as WifiIcon,
  LocationOn as LocationIcon,
  Analytics as AnalyticsIcon,
  HowToReg as HowToIcon,
  RateReview as TestimonialsIcon,
  QuestionAnswer as FAQIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getTranslation } from '../translations';

const ResponsiveLayout = ({ 
  children, 
  activeTab, 
  onTabChange, 
  currentLanguage,
  isDarkMode,
  onThemeToggle,
  onLanguageChange,
  onPhoneCall,
  onWhatsApp,
  onCoverageClick,
  showCoverageModal,
  onCloseCoverageModal,
  coverageAreas,
  isLoadingCoverage,
  coverageError,
  refetchCoverage,
  getCityIcon,
  getCityGradient,
  handlePhoneCall,
  handleWhatsApp,
  handleEmail,
  handleThemeToggle,
  handleLanguageChange,
  handleCoverageClick,
  handleCloseCoverageModal,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    {
      label: getTranslation(currentLanguage, 'voucherLogin'),
      icon: <WifiIcon />,
      value: 0,
    },
    {
      label: getTranslation(currentLanguage, 'internetPackages'),
      icon: <LocationIcon />,
      value: 1,
    },
    {
      label: getTranslation(currentLanguage, 'usageAnalytics'),
      icon: <AnalyticsIcon />,
      value: 2,
    },
    {
      label: getTranslation(currentLanguage, 'howItWorks'),
      icon: <HowToIcon />,
      value: 3,
    },
    {
      label: getTranslation(currentLanguage, 'testimonials'),
      icon: <TestimonialsIcon />,
      value: 4,
    },
    {
      label: getTranslation(currentLanguage, 'faq'),
      icon: <FAQIcon />,
      value: 5,
    },
  ];

  // Mobile Layout
  if (isMobile) {
    return (
      <Box sx={{ minHeight: '100vh', pb: 7 }}>
        {/* Mobile Header */}
        <AppBar 
          position="fixed" 
          sx={{ 
            background: theme.custom.gradients.backgroundSecondary,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.custom.effects.shadow.heavy,
            borderBottom: `1px solid ${theme.custom.effects.glass.primary}`,
            zIndex: theme.zIndex.appBar,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="/logo.svg" 
                  alt="GGNetworks Logo" 
                  style={{ 
                    height: '32px',
                    width: 'auto',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                  }} 
                />
              </motion.div>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ 
                  color: theme.palette.primary.main,
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Content */}
        <Box sx={{ pt: 8, px: 2 }}>
          {children}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: {
              width: 280,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderLeft: `1px solid ${theme.custom.effects.glass.primary}`,
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Menu
              </Typography>
              <IconButton onClick={() => setMobileMenuOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {navigationItems.map((item) => (
                <ListItem
                  key={item.value}
                  button
                  selected={activeTab === item.value}
                  onClick={() => {
                    onTabChange(null, item.value);
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiListItemText-primary': {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    );
  }

  // Tablet Layout
  if (isTablet) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        {/* Tablet Header */}
        <AppBar 
          position="fixed" 
          sx={{ 
            background: theme.custom.gradients.backgroundSecondary,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.custom.effects.shadow.heavy,
            borderBottom: `1px solid ${theme.custom.effects.glass.primary}`,
            zIndex: theme.zIndex.appBar,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="/logo.svg" 
                  alt="GGNetworks Logo" 
                  style={{ 
                    height: '36px',
                    width: 'auto',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                  }} 
                />
              </motion.div>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="medium"
                onClick={() => handlePhoneCall('0742844024')}
                sx={{ 
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: 'white',
                  width: 44,
                  height: 44,
                  '&:hover': { 
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                  },
                }}
              >
                <WifiIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Tablet Content */}
        <Box sx={{ pt: 8, px: 3 }}>
          {children}
        </Box>
      </Box>
    );
  }

  // Desktop Layout (original)
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {children}
    </Box>
  );
};

export default ResponsiveLayout; 