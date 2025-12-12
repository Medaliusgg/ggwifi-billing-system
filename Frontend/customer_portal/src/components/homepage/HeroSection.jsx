import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PersonAdd as PersonAddIcon, ShoppingBag as ShoppingIcon } from '@mui/icons-material';
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
      {/* Parallax Background Elements with Networked Lines */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Device nodes */}
        {[0, 1, 2, 3, 4].map((i) => {
          const positions = [
            { top: '15%', left: '10%' },
            { top: '25%', right: '15%' },
            { bottom: '20%', left: '20%' },
            { bottom: '30%', right: '10%' },
            { top: '50%', left: '50%' },
          ];
          return (
            <motion.div
              key={i}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
              style={{
                position: 'absolute',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 204, 0, 0.3) 0%, rgba(255, 204, 0, 0.1) 100%)',
                border: '2px solid rgba(255, 204, 0, 0.5)',
                ...positions[i],
              }}
            />
          );
        })}
        
        {/* Networked lines connecting devices */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.line
              key={i}
              x1={`${20 + i * 20}%`}
              y1={`${15 + i * 10}%`}
              x2={`${60 + i * 10}%`}
              y2={`${70 - i * 15}%`}
              stroke="rgba(255, 204, 0, 0.2)"
              strokeWidth="2"
              strokeDasharray="5,5"
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.8,
              }}
            />
          ))}
        </svg>
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
            component={motion.h2}
            sx={{
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: { xs: '20px', md: '28px' },
              textAlign: 'center',
              mb: 1,
              color: '#333333',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
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
              icon={<PersonAddIcon />}
              variant="contained"
              backgroundContext="white"
              onClick={() => navigate('/signup/phone')}
            >
              Are you new? Create account
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
