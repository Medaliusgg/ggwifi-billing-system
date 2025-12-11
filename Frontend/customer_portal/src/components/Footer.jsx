import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag as ShoppingBagIcon, VpnKey as VoucherIcon } from '@mui/icons-material';
import GlobalButton from './ui/GlobalButton';

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const colors = {
    background: theme.palette.background.paper, // Clean White
    textPrimary: theme.palette.text.primary, // Deep Black
    textSecondary: theme.palette.text.secondary, // Dark Gray
    primary: theme.palette.primary.main, // Primary Yellow #FFCC00
    primaryDark: theme.palette.primary.dark, // Darker yellow
    info: theme.palette.info.main, // Blue - for package buttons
    warning: theme.palette.warning.main, // Orange - for voucher buttons
    warningDark: theme.palette.warning.dark,
    infoDark: theme.palette.info.dark,
  };

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.palette.primary.main, // Always Golden Yellow #FFCC00
        borderTop: `2px solid ${theme.palette.primary.dark}`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        zIndex: theme.zIndex.appBar,
        py: 2.5,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row', // Always horizontal
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' }, // Wrap on very small screens only
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlobalButton
              icon={<ShoppingBagIcon />}
              variant="contained"
              size="large"
              backgroundContext="yellow"
              onClick={() => navigate('/plans')}
              sx={{
                px: { xs: 3, md: 4 },
                fontSize: { xs: '14px', md: '16px' },
                minWidth: { xs: 'auto', sm: '200px' },
                flex: { xs: '1 1 auto', sm: '0 0 auto' },
              }}
            >
              BUY PACKAGE
            </GlobalButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <GlobalButton
              icon={<VoucherIcon />}
              variant="contained"
              size="large"
              backgroundContext="yellow"
              onClick={() => navigate('/voucher-login')}
              sx={{
                px: { xs: 3, md: 4 },
                fontSize: { xs: '14px', md: '16px' },
                minWidth: { xs: 'auto', sm: '200px' },
                flex: { xs: '1 1 auto', sm: '0 0 auto' },
              }}
            >
              ENTER VOUCHER
            </GlobalButton>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
