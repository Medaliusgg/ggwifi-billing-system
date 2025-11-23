import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '200px',
        gap: 2,
        background: fullScreen ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' : 'transparent',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#FFC72C',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/gg-logo.png"
              alt="GG Wi-Fi"
              onError={(e) => { e.target.style.display = 'none'; }}
              style={{
                height: '30px',
                width: 'auto',
                filter: 'drop-shadow(0 2px 4px rgba(255, 199, 44, 0.5))',
              }}
            />
          </Box>
        </Box>
      </motion.div>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#FFFFFF',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            {message}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default LoadingSpinner;
