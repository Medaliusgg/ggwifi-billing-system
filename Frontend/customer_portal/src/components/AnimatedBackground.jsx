import React from 'react';
import { Box } from '@mui/material';

const AnimatedBackground = ({ children, variant = 'default' }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: variant === 'light' 
            ? 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)'
            : 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #000000 50%, #0a0a0a 75%, #000000 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          zIndex: -2,
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: variant === 'light'
            ? 'radial-gradient(circle at 20% 30%, rgba(255, 199, 44, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 114, 206, 0.08) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 30%, rgba(255, 199, 44, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 114, 206, 0.15) 0%, transparent 50%)',
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
          position: 'fixed',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 199, 44, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float1 20s ease-in-out infinite',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: '60%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 114, 206, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float2 25s ease-in-out infinite',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
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
