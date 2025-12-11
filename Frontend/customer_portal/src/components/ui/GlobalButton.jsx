import React from 'react';
import { Button, useTheme } from '@mui/material';
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
  backgroundContext = 'white', // 'white' or 'yellow' - determines button colors
  ...props
}) => {
  const theme = useTheme();
  
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

  // Smart color logic based on background context
  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: '12px',
      fontWeight: 600,
      textTransform: 'none',
      px: 3,
      py: 1.5,
      fontSize: '14px',
      transition: 'all 0.2s ease',
    };

    // If background is white → button should be golden yellow with black text
    if (backgroundContext === 'white') {
      if (variant === 'contained') {
        return {
          ...baseStyles,
          backgroundColor: '#FFCC00', // Golden Yellow
          color: '#000000', // Black text
          '&:hover': {
            backgroundColor: '#E6B800', // Darker yellow
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(255, 204, 0, 0.3)',
          },
        };
      } else if (variant === 'outlined') {
        return {
          ...baseStyles,
          borderColor: '#FFCC00',
          color: '#000000',
          '&:hover': {
            borderColor: '#E6B800',
            backgroundColor: 'rgba(255, 204, 0, 0.1)',
            transform: 'scale(1.05)',
          },
        };
      }
    }
    
    // If background is yellow → button should be black with white text
    if (backgroundContext === 'yellow') {
      if (variant === 'contained') {
        return {
          ...baseStyles,
          backgroundColor: '#000000', // Black
          color: '#FFFFFF', // White text
          '&:hover': {
            backgroundColor: '#1A1A1A', // Darker black
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        };
      } else if (variant === 'outlined') {
        return {
          ...baseStyles,
          borderColor: '#000000',
          color: '#000000',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#000000',
            color: '#FFFFFF',
            transform: 'scale(1.05)',
          },
        };
      }
    }

    return baseStyles;
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
          ...getButtonStyles(),
          ...sx, // Allow override via sx prop
        }}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default GlobalButton;
