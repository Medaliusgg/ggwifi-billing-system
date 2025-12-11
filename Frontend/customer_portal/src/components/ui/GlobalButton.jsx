import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const GlobalButton = ({
  children,
  icon,
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  onClick,
  disabled = false,
  size = 'medium',
  sx = {},
  ...props
}) => {
  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 17,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      <Button
        variant={variant}
        color={color}
        fullWidth={fullWidth}
        onClick={onClick}
        disabled={disabled}
        size={size}
        startIcon={icon}
        sx={{
          borderRadius: '12px',
          fontWeight: 600,
          textTransform: 'none',
          px: 3,
          py: 1.5,
          fontSize: '14px',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default GlobalButton;
