import React, { useEffect } from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

const AnimatedNotification = ({ 
  open, 
  onClose, 
  message, 
  title, 
  severity = 'success',
  duration = 3000 
}) => {
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  const icons = {
    success: <CheckCircleIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
    warning: <WarningIcon />,
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <Box
          sx={{
            position: 'fixed',
            top: 80,
            right: 16,
            zIndex: 9999,
            maxWidth: { xs: 'calc(100% - 32px)', sm: 400 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            <Alert
              severity={severity}
              icon={icons[severity]}
              onClose={onClose}
              sx={{
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                '& .MuiAlert-icon': {
                  fontSize: 28,
                },
              }}
            >
              {title && <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>}
              {message}
            </Alert>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default AnimatedNotification;
