import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  SignalCellular4Bar as SignalIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ progress = 0, messages = [] }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        background: `linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 50%, rgba(25, 118, 210, 0.1) 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Animated Background with Multiple Layers */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.2) 0%, transparent 70%)',
          animation: 'pulse 3s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.3 },
            '50%': { opacity: 0.6 },
          },
        }}
      />

      {/* Floating Network Icons */}
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            color: theme.palette.primary.main,
            opacity: 0.3,
          }}
          animate={{
            x: [0, Math.random() * 800 - 400],
            y: [0, Math.random() * 600 - 300],
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut",
          }}
        >
          {index % 3 === 0 ? (
            <WifiIcon sx={{ fontSize: 24 }} />
          ) : index % 3 === 1 ? (
            <SignalIcon sx={{ fontSize: 24 }} />
          ) : (
            <CloudIcon sx={{ fontSize: 24 }} />
          )}
        </motion.div>
      ))}

      {/* Main Loading Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            p: 5,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(25px)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            minWidth: 400,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            },
            '@keyframes gradientShift': {
              '0%, 100%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
            },
          }}
        >
          {/* Logo and Brand */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <img 
                src="/logo.svg" 
                alt="GGNetworks Logo" 
                style={{ 
                  height: '80px',
                  width: 'auto',
                  filter: 'drop-shadow(0 6px 12px rgba(0, 209, 255, 0.4))'
                }} 
              />
            </motion.div>
          </Box>
          </motion.div>

          {/* Spinning Progress */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
              <CircularProgress
                size={100}
                thickness={3}
                sx={{
                  color: theme.palette.primary.main,
                  filter: 'drop-shadow(0 6px 12px rgba(25, 118, 210, 0.4))',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <SignalIcon 
                    sx={{ 
                      fontSize: 32, 
                      color: theme.palette.primary.main,
                    }} 
                  />
                </motion.div>
              </Box>
            </Box>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ width: '100%' }}
          >
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(25, 118, 210, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                    boxShadow: '0 2px 4px rgba(25, 118, 210, 0.3)',
                  },
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  display: 'block',
                  mt: 1,
                }}
              >
                {progress}% Complete
              </Typography>
            </Box>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                textAlign: 'center',
                mb: 1,
              }}
            >
              Initializing GGNetworks
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                textAlign: 'center',
                maxWidth: 350,
                lineHeight: 1.6,
              }}
            >
              Setting up your internet experience with high-speed connectivity...
            </Typography>
          </motion.div>

          {/* Loading Messages */}
          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ 
                maxHeight: 120, 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}>
                {messages.slice(-3).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: message.includes('✓') ? theme.palette.success.main : 
                              message.includes('⚠') ? theme.palette.warning.main : 
                              theme.palette.text.secondary,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      {message}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}
        </Box>
      </motion.div>

      {/* Bottom Loading Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        style={{
          position: 'absolute',
          bottom: 40,
          textAlign: 'center',
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 500,
          }}
        >
          Powered by GGNetworks Technology
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoadingSpinner; 