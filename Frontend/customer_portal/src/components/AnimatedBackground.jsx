import React from 'react';
import { Box } from '@mui/material';

const AnimatedBackground = ({ children, variant = 'default' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: variant === 'light' 
            ? 'linear-gradient(135deg, #FFFFFF 0%, #F6F6F6 50%, #FFFFFF 100%)'  // Premium soft white gradient
            : 'linear-gradient(135deg, #FFFFFF 0%, #F6F6F6 50%, #FFFFFF 100%)',  // Always light for premium design
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          zIndex: -2,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: variant === 'light'
            ? 'radial-gradient(circle at 20% 30%, rgba(245, 196, 0, 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(245, 196, 0, 0.04) 0%, transparent 50%)'  // Premium gold accents
            : 'radial-gradient(circle at 20% 30%, rgba(245, 196, 0, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(245, 196, 0, 0.06) 0%, transparent 50%)',  // Premium gold accents
          animation: 'pulse 8s ease-in-out infinite',
          zIndex: -1,
        },
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      }}
    >
      {/* Animated Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 196, 0, 0.12) 0%, transparent 70%)',  // Premium gold
          filter: 'blur(60px)',
          animation: 'float1 20s ease-in-out infinite',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 196, 0, 0.1) 0%, transparent 70%)',  // Premium gold
          filter: 'blur(80px)',
          animation: 'float2 25s ease-in-out infinite',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 199, 44, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float3 18s ease-in-out infinite',
          zIndex: -1,
        }}
      />
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 40px) scale(1.2); }
          66% { transform: translate(30px, -30px) scale(0.8); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -40px) scale(1.15); }
        }
      `}</style>
      {children}
    </Box>
  );
};

export default AnimatedBackground;
