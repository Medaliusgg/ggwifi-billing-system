import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { VpnKey as VoucherIcon, ShoppingBag as ShoppingBagIcon } from '@mui/icons-material';
import GlobalButton from './ui/GlobalButton';

const AnimatedStickyFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const [showVoucherFooter, setShowVoucherFooter] = useState(false);

  // Stable scroll detection - only show when near bottom of page
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      
      // Show footer only when:
      // 1. User has scrolled down at least 300px (not at top)
      // 2. User is within 300px of the bottom of the page
      const shouldShow = scrollTop > 300 && distanceFromBottom < 300;
      
      // Only update state if it changed to prevent unnecessary re-renders
      setShowVoucherFooter(prev => prev !== shouldShow ? shouldShow : prev);
    };

    // Throttle scroll events using requestAnimationFrame to prevent excessive updates
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  return (
    <>
      {/* Normal Footer (always at bottom) - Yellow background */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#FFCC00', // Golden Yellow
          borderTop: '2px solid #E6B800',
          py: 4,
          mt: 'auto',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: '#000000', fontWeight: 600 }}>
              © 2025 GG Wi-Fi. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Social icons can be added here */}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Animated Sticky Footer (on scroll up or near bottom) */}
      <AnimatePresence mode="wait">
        {showVoucherFooter && (
          <motion.div
            key="voucher-footer"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
              mass: 0.8,
            }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            }}
          >
            <Box
              sx={{
                backgroundColor: '#FFCC00',
                borderTop: '2px solid #000000',
                py: 2,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              }}
            >
              <Container maxWidth="lg">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#000000',
                      fontSize: { xs: '16px', md: '18px' },
                    }}
                  >
                    Already have a voucher?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {!isHomePage && (
                    <GlobalButton
                      icon={<ShoppingBagIcon />}
                      variant="contained"
                      backgroundContext="yellow"
                      onClick={() => navigate('/packages')}
                    >
                      View Packages
                    </GlobalButton>
                    )}
                    <GlobalButton
                      icon={<VoucherIcon />}
                      variant="contained"
                      backgroundContext="yellow"
                      onClick={() => navigate('/voucher-login')}
                    >
                      Voucher Login
                    </GlobalButton>
                  </Box>
                </Box>
              </Container>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedStickyFooter;
