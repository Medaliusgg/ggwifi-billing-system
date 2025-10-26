import React from 'react';
import { Box, CircularProgress, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { Security as SecurityIcon } from '@mui/icons-material';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

const LoadingOverlay = ({ message = 'Loading...', showLogo = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: ggwifiTheme.gradients.background,
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
        }}
      >
        {/* GG Wi-Fi Logo */}
        {showLogo && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: ggwifiTheme.gradients.primary,
                color: ggwifiTheme.colors.secondary,
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: ggwifiTheme.shadows.golden,
                mb: 2,
              }}
            >
              GG
            </Avatar>
          </motion.div>
        )}

        {/* Loading Spinner */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CircularProgress
            size={60}
            sx={{
              color: ggwifiTheme.colors.primary,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        </motion.div>

        {/* Loading Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontWeight: ggwifiTheme.typography.fontWeight.medium,
              color: ggwifiTheme.colors.secondary,
              textAlign: 'center',
            }}
          >
            {message}
          </Typography>
        </motion.div>

        {/* GG Wi-Fi Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: ggwifiTheme.colors.neutral,
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            The Signal That Cares
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default LoadingOverlay;