import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  IconButton,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Wifi as WifiIcon,
  LocationOn as LocationIcon,
  Analytics as AnalyticsIcon,
  HowToReg as HowToIcon,
  RateReview as TestimonialsIcon,
  QuestionAnswer as FAQIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import VoucherAuthentication from './VoucherAuthentication';
import InternetPackages from './InternetPackages';
import CustomerTestimonials from './CustomerTestimonials';
import FAQSection from './FAQSection';
import HowItWorks from './HowItWorks';

const MobileTabContent = ({ activeTab, currentLanguage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const tabComponents = [
    { component: <VoucherAuthentication />, icon: <WifiIcon /> },
    { component: <InternetPackages />, icon: <LocationIcon /> },
    { component: <HowItWorks />, icon: <HowToIcon /> },
    { component: <CustomerTestimonials />, icon: <TestimonialsIcon /> },
    { component: <FAQSection />, icon: <FAQIcon /> },
  ];

  const tabLabels = [
    'voucherLogin',
    'internetPackages',
    'howItWorks',
    'testimonials',
    'faq',
  ];

  if (!isMobile) {
    return (
      <Box sx={{ p: 4 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {tabComponents[activeTab]?.component}
          </motion.div>
        </AnimatePresence>
      </Box>
    );
  }

  // Mobile-specific layout
  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 140px)', // Account for header and bottom nav
      pb: 2,
      px: 2,
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            mb: 2,
          }}>
            {tabComponents[activeTab]?.component}
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default MobileTabContent; 