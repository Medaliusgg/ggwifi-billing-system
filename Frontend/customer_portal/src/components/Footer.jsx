import React from 'react';
import { Box, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
        backgroundColor: theme.palette.primary.main, // Main Golden Yellow #F2C94C
        borderTop: `1px solid ${theme.palette.primary.dark}`,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: theme.zIndex.appBar,
        py: 2,
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
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/plans')}
              fullWidth={false}
              sx={{
                backgroundColor: colors.info,
                color: theme.palette.background.paper,
                fontWeight: 600,
                px: { xs: 3, md: 4 },
                py: 1.5,
                borderRadius: '12px',
                fontSize: { xs: '14px', md: '16px' },
                minWidth: { xs: 'auto', sm: '200px' },
                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                '&:hover': {
                  backgroundColor: colors.infoDark,
                  boxShadow: '0 4px 12px rgba(72, 199, 242, 0.3)',
                },
              }}
            >
              BUY PACKAGE
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/voucher-login')}
              fullWidth={false}
              sx={{
                backgroundColor: theme.palette.text.primary, // Deep Black
                color: theme.palette.background.paper, // Clean White
                fontWeight: 600,
                px: { xs: 3, md: 4 },
                py: 1.5,
                borderRadius: '12px',
                fontSize: { xs: '14px', md: '16px' },
                minWidth: { xs: 'auto', sm: '200px' },
                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                '&:hover': {
                  backgroundColor: '#1A1A1A', // Darker black
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              ENTER VOUCHER
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
