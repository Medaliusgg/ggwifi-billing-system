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
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Scroll detection - show voucher footer when scrolling, hide at bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      
      // Check if at the very bottom (within 50px)
      const atBottom = distanceFromBottom <= 50;
      setIsAtBottom(atBottom);
      
      // Show voucher footer when:
      // 1. User has scrolled down at least 200px (not at top)
      // 2. User is NOT at the bottom (so real footer shows at bottom)
      const shouldShow = scrollTop > 200 && !atBottom;
      
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
      {/* Normal Footer (only at bottom of page) - Yellow background */}
      {isAtBottom && (
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
      )}

      {/* Animated Sticky Footer (voucher login button when scrolling, not at bottom) */}
      <AnimatePresence mode="wait">
        {showVoucherFooter && !isAtBottom && (
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
                    justifyContent: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <GlobalButton
                    icon={<VoucherIcon />}
                    variant="contained"
                    backgroundContext="yellow"
                    onClick={() => navigate('/voucher-login')}
                    sx={{
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Already have a voucher? Login
                  </GlobalButton>
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
