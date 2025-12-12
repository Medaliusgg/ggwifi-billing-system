import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedSpinner = ({ size = 40, color = '#E6B800' }) => { // Dark golden yellow
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        py: 4,
      }}
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <CircularProgress
          size={size}
          sx={{
            color: color,
          }}
        />
      </motion.div>
    </Box>
  );
};

export default AnimatedSpinner;
