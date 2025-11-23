import React from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  LocationOn as LocationIcon,
  Analytics as AnalyticsIcon,
  HowToReg as HowToIcon,
  RateReview as TestimonialsIcon,
  QuestionAnswer as FAQIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getTranslation } from '../translations';

const MobileBottomNavigation = ({ activeTab, onTabChange, currentLanguage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) return null;

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

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar + 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${theme.custom.effects.glass.primary}`,
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        }}
        elevation={8}
      >
        <BottomNavigation
          value={activeTab}
          onChange={(event, newValue) => {
            onTabChange(event, newValue);
          }}
          sx={{
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '8px 4px',
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  fontWeight: 600,
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                fontWeight: 500,
                marginTop: '4px',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.5rem',
                marginBottom: '2px',
              },
            },
            '& .MuiBottomNavigationAction-root.Mui-selected': {
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.1)',
                transition: 'transform 0.2s ease-in-out',
              },
            },
          }}
        >
          {navigationItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              icon={item.icon}
              value={item.value}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </motion.div>
  );
};

export default MobileBottomNavigation; 