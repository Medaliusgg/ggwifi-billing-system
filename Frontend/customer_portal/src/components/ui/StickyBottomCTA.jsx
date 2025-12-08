import React from 'react';
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, FlashOn as FlashOnIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * StickyBottomCTA Component
 * Gold full-width CTA bar that sticks to bottom of viewport
 * "Buy Now — Fast Connect" button
 */
const StickyBottomCTA = ({
  onBuyClick,
  onConnectClick,
  showBuy = true,
  showConnect = false,
  buyText = 'Buy Now',
  connectText = 'Fast Connect',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AnimatePresence>
      {(showBuy || showConnect) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: isMobile ? '12px 16px' : '16px 24px',
            background: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
            boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.15)',
            borderTop: '2px solid #D4A32A',
          }}
        >
          <Box
            sx={{
              maxWidth: '1200px',
              mx: 'auto',
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showBuy && (
              <Button
                variant="contained"
                fullWidth={!showConnect}
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={onBuyClick}
                sx={{
                  background: '#0A0A0A',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  py: isMobile ? 1.5 : 2,
                  px: 4,
                  fontWeight: 700,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    background: '#1A1A1A',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {buyText}
              </Button>
            )}

            {showConnect && (
              <Button
                variant="contained"
                fullWidth={!showBuy}
                size="large"
                startIcon={<FlashOnIcon />}
                onClick={onConnectClick}
                sx={{
                  background: '#FFFFFF',
                  color: '#0A0A0A',
                  borderRadius: '12px',
                  py: isMobile ? 1.5 : 2,
                  px: 4,
                  fontWeight: 700,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  border: '2px solid #0A0A0A',
                  '&:hover': {
                    background: '#F5F5F5',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {connectText}
              </Button>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBottomCTA;

