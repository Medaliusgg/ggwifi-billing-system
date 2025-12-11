import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { VpnKey as VoucherIcon, ShoppingBag as ShoppingBagIcon } from '@mui/icons-material';
import GlobalButton from './ui/GlobalButton';

const AnimatedStickyFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showVoucherFooter, setShowVoucherFooter] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const current = latest;
    const previous = lastScrollY;
    
    if (current > previous && current > 100) {
      // Scrolling down
      setScrollDirection('down');
      setShowVoucherFooter(false);
    } else if (current < previous) {
      // Scrolling up
      setScrollDirection('up');
      if (current > 200) {
        setShowVoucherFooter(true);
      }
    }
    
    setLastScrollY(current);
  });

  return (
    <>
      {/* Normal Footer (always at bottom) */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          py: 4,
          mt: 'auto',
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
            <Typography variant="body2" sx={{ color: '#666666' }}>
              © 2025 GG Wi-Fi. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Social icons can be added here */}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Animated Sticky Footer (on scroll up) */}
      <AnimatePresence>
        {showVoucherFooter && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
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
                        variant="outlined"
                        onClick={() => navigate('/packages')}
                        sx={{
                          borderColor: '#000000',
                          color: '#000000',
                          '&:hover': {
                            borderColor: '#000000',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        View Packages
                      </GlobalButton>
                    )}
                    <GlobalButton
                      icon={<VoucherIcon />}
                      variant="contained"
                      onClick={() => navigate('/voucher-login')}
                      sx={{
                        backgroundColor: '#000000',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: '#1A1A1A',
                        },
                      }}
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
