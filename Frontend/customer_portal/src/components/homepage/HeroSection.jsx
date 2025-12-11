import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Login as LoginIcon, ShoppingBag as ShoppingIcon } from '@mui/icons-material';
import GlobalButton from '../ui/GlobalButton';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: { xs: '60vh', md: '70vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Parallax Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 204, 0, 0.1) 0%, rgba(255, 204, 0, 0.05) 100%)',
            top: '10%',
            left: '10%',
          }}
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 204, 0, 0.08) 0%, rgba(255, 204, 0, 0.03) 100%)',
            bottom: '15%',
            right: '15%',
          }}
        />
      </motion.div>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '32px', md: '56px' },
              textAlign: 'center',
              mb: 2,
              color: '#000000',
            }}
          >
            GG Wi-Fi
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '20px', md: '28px' },
              textAlign: 'center',
              mb: 1,
              color: '#333333',
            }}
          >
            The Signal That Cares
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '14px', md: '18px' },
              textAlign: 'center',
              mb: 4,
              color: '#666666',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Experience fast, reliable, and community-driven internet. 
            Connect with confidence and enjoy seamless browsing.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <GlobalButton
              icon={<LoginIcon />}
              variant="contained"
              backgroundContext="white"
              onClick={() => navigate('/login')}
            >
              Get Started
            </GlobalButton>
            <GlobalButton
              icon={<ShoppingIcon />}
              variant="outlined"
              backgroundContext="white"
              onClick={() => navigate('/packages')}
            >
              View Packages
            </GlobalButton>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
