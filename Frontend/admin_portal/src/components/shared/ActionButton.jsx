import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Action Button Component
 * Consistent button styling using customer portal theme
 */
const ActionButton = ({ 
  children, 
  variant = 'contained',
  color = 'primary',
  startIcon,
  endIcon,
  onClick,
  disabled = false,
  size = 'medium',
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = {
    borderRadius: '12px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '14px',
    boxShadow: 'none',
    transition: 'all 0.2s ease',
  };

  const variantStyles = {
    contained: {
      primary: {
        backgroundColor: '#F2C94C', // Gold
        color: '#0A0A0A', // Black
        '&:hover': {
          backgroundColor: '#E0B335', // Gold Strong
          boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
        },
      },
      secondary: {
        backgroundColor: '#0A0A0A', // Black
        color: '#FFFFFF', // White
        '&:hover': {
          backgroundColor: '#1A1A1A',
          boxShadow: '0 4px 12px rgba(10, 10, 10, 0.2)',
        },
      },
    },
    outlined: {
      primary: {
        borderColor: '#F2C94C',
        color: '#0A0A0A',
        '&:hover': {
          borderColor: '#E0B335',
          backgroundColor: 'rgba(242, 201, 76, 0.1)',
        },
      },
    },
  };

  const styles = {
    ...baseStyles,
    ...(variantStyles[variant]?.[color] || variantStyles[variant]?.primary),
  };

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Button
        variant={variant}
        color={color}
        startIcon={startIcon}
        endIcon={endIcon}
        onClick={onClick}
        disabled={disabled}
        size={size}
        fullWidth={fullWidth}
        sx={styles}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default ActionButton;
