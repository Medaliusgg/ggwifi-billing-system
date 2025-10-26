import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Laptop, 
  Router, 
  Tablet, 
  Watch, 
  Speaker, 
  CameraAlt,
  Tv,
  Gamepad,
  SmartToy,
  Wifi as WifiIcon
} from '@mui/icons-material';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

const AuthLayout = ({ children }) => {
  return (
    <Box
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, ${ggwifiTheme.colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 80% 50%, ${ggwifiTheme.colors.primary} 2px, transparent 2px),
            radial-gradient(circle at 40% 80%, ${ggwifiTheme.colors.primary} 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: '0 0, 50px 50px, 25px 25px',
        }}
      />

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10, padding: '0' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          {/* Auth Form with Header and Footer inside the glass box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: ggwifiTheme.gradients.card,
              borderRadius: ggwifiTheme.borderRadius.xl,
              padding: '2rem',
              boxShadow: ggwifiTheme.shadows.golden,
              border: `1px solid rgba(245, 183, 0, 0.2)`,
              maxWidth: '28rem',
              margin: '0 auto',
            }}
          >
            {/* Auth Form Content */}
            {children}

            {/* Footer - Inside the glass box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: `1px solid rgba(245, 183, 0, 0.2)`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: ggwifiTheme.colors.neutral,
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  fontSize: ggwifiTheme.typography.fontSize.xs,
                }}
              >
                © {new Date().getFullYear()} GG Wi-Fi | The Signal That Cares
              </Typography>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Central Router/Hub */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      >
        <WifiIcon 
          sx={{ 
            fontSize: 60, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.1,
            filter: 'drop-shadow(0 0 10px rgba(245, 183, 0, 0.3))'
          }} 
        />
      </motion.div>

      {/* Phone Devices */}
      <motion.div
        style={{
          position: 'absolute',
          top: '5rem',
          left: '5rem',
          zIndex: 0,
        }}
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0,
        }}
      >
        <Phone 
          sx={{ 
            fontSize: 40, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.6,
            filter: 'drop-shadow(0 0 12px rgba(245, 183, 0, 0.4))'
          }} 
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: '8rem',
          right: '6rem',
          zIndex: 0,
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, -15, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Phone 
          sx={{ 
            fontSize: 35, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.5,
            filter: 'drop-shadow(0 0 10px rgba(245, 183, 0, 0.3))'
          }} 
        />
      </motion.div>

      {/* Laptop Devices */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '8rem',
          left: '4rem',
          zIndex: 0,
        }}
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Laptop 
          sx={{ 
            fontSize: 45, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.6,
            filter: 'drop-shadow(0 0 12px rgba(245, 183, 0, 0.4))'
          }} 
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: '10rem',
          left: '25%',
          zIndex: 0,
        }}
        animate={{
          y: [0, -25, 0],
          x: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Laptop 
          sx={{ 
            fontSize: 38, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.5,
            filter: 'drop-shadow(0 0 10px rgba(245, 183, 0, 0.3))'
          }} 
        />
      </motion.div>

      {/* Tablet Devices */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '5rem',
          right: '4rem',
          zIndex: 0,
        }}
        animate={{
          y: [0, 20, 0],
          x: [0, 15, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <Tablet 
          sx={{ 
            fontSize: 42, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.6,
            filter: 'drop-shadow(0 0 12px rgba(245, 183, 0, 0.4))'
          }} 
        />
      </motion.div>

      {/* IoT Devices */}
      <motion.div
        style={{
          position: 'absolute',
          top: '33%',
          right: '33%',
          zIndex: 0,
        }}
        animate={{
          y: [0, -10, 0],
          x: [0, -20, 0],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Watch 
          sx={{ 
            fontSize: 30, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.25,
            filter: 'drop-shadow(0 0 6px rgba(245, 183, 0, 0.15))'
          }} 
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '33%',
          left: '33%',
          zIndex: 0,
        }}
        animate={{
          y: [0, 15, 0],
          x: [0, 25, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      >
        <Speaker 
          sx={{ 
            fontSize: 35, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.3,
            filter: 'drop-shadow(0 0 7px rgba(245, 183, 0, 0.2))'
          }} 
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: '25%',
          left: '75%',
          zIndex: 0,
        }}
        animate={{
          y: [0, -18, 0],
          x: [0, -12, 0],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <CameraAlt 
          sx={{ 
            fontSize: 32, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.25,
            filter: 'drop-shadow(0 0 6px rgba(245, 183, 0, 0.15))'
          }} 
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          zIndex: 0,
        }}
        animate={{
          y: [0, 22, 0],
          x: [0, -18, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.8,
        }}
      >
        <SmartToy 
          sx={{ 
            fontSize: 28, 
            color: ggwifiTheme.colors.primary, 
            opacity: 0.3,
            filter: 'drop-shadow(0 0 7px rgba(245, 183, 0, 0.2))'
          }} 
        />
      </motion.div>

      {/* Network Connection Lines - Enhanced Real-time Data Flow */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.3 }}>
        {/* Define gradient for data packets */}
        <defs>
          <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={ggwifiTheme.colors.primary} stopOpacity="0.4" />
            <stop offset="50%" stopColor={ggwifiTheme.colors.primary} stopOpacity="0.6" />
            <stop offset="100%" stopColor={ggwifiTheme.colors.primary} stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="reverseDataFlow" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={ggwifiTheme.colors.primary} stopOpacity="0.4" />
            <stop offset="50%" stopColor={ggwifiTheme.colors.primary} stopOpacity="0.6" />
            <stop offset="100%" stopColor={ggwifiTheme.colors.primary} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Primary connection lines */}
        <motion.line
          x1="80"
          y1="80"
          x2="50%"
          y2="50%"
          stroke="url(#dataFlowGradient)"
          strokeWidth="1"
          strokeDasharray="8,4"
          animate={{
            strokeDashoffset: [0, -12],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        
        <motion.line
          x1="75%"
          y1="20%"
          x2="50%"
          y2="50%"
          stroke="url(#reverseDataFlow)"
          strokeWidth="1"
          strokeDasharray="6,3"
          animate={{
            strokeDashoffset: [0, -9],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            strokeDashoffset: { duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.3 },
            opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
        />

        <motion.line
          x1="15%"
          y1="70%"
          x2="50%"
          y2="50%"
          stroke="url(#dataFlowGradient)"
          strokeWidth="1"
          strokeDasharray="10,5"
          animate={{
            strokeDashoffset: [0, -15],
            opacity: [0.25, 0.6, 0.25],
          }}
          transition={{
            strokeDashoffset: { duration: 1.2, repeat: Infinity, ease: "linear", delay: 0.6 },
            opacity: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
          }}
        />

        <motion.line
          x1="85%"
          y1="80%"
          x2="50%"
          y2="50%"
          stroke="url(#reverseDataFlow)"
          strokeWidth="1"
          strokeDasharray="7,3"
          animate={{
            strokeDashoffset: [0, -10],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear", delay: 0.4 },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
          }}
        />

        <motion.line
          x1="25%"
          y1="25%"
          x2="50%"
          y2="50%"
          stroke="url(#dataFlowGradient)"
          strokeWidth="1"
          strokeDasharray="9,4"
          animate={{
            strokeDashoffset: [0, -13],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            strokeDashoffset: { duration: 1.7, repeat: Infinity, ease: "linear", delay: 0.9 },
            opacity: { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
          }}
        />

        <motion.line
          x1="65%"
          y1="65%"
          x2="50%"
          y2="50%"
          stroke="url(#reverseDataFlow)"
          strokeWidth="1"
          strokeDasharray="5,2"
          animate={{
            strokeDashoffset: [0, -7],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            strokeDashoffset: { duration: 1.3, repeat: Infinity, ease: "linear", delay: 1.2 },
            opacity: { duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
          }}
        />
      </svg>
    </Box>
  );
};

export default AuthLayout;