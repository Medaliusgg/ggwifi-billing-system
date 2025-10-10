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
  SmartToy
} from '@mui/icons-material';

const AuthLayout = ({ children }) => {
  return (
    <Box
      minHeight="100vh"
      className="bg-gg-black flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Pattern */}
      <Box
        className="absolute inset-0 opacity-5"
        sx={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #FFD700 2px, transparent 2px),
            radial-gradient(circle at 80% 50%, #FFD700 2px, transparent 2px),
            radial-gradient(circle at 40% 80%, #FFD700 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: '0 0, 50px 50px, 25px 25px',
        }}
      />

      {/* Main Content */}
      <Container maxWidth="md" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Auth Form with Header and Footer inside the glass box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-3xl p-8 shadow-2xl max-w-md mx-auto"
          >
            {/* Logo/Brand - Inside the glass box */}
            <Box className="mb-6">
              <Typography
                variant="h1"
                className="gradient-text text-5xl font-bold mb-2"
                sx={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFF176 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                GGWiFi
              </Typography>
              <Typography
                variant="h6"
                className="text-gg-text-secondary font-medium"
              >
                Admin Portal
              </Typography>
            </Box>

            {/* Auth Form Content */}
            {children}

            {/* Footer - Inside the glass box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-6 pt-4 border-t border-gg-gold/20"
            >
              <Typography
                variant="body2"
                className="text-gg-text-muted"
              >
                © {new Date().getFullYear()} GGWiFi. All rights reserved.
              </Typography>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Network Devices Animation */}
      
      {/* Central Router/Hub */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      >
        <Router 
          sx={{ 
            fontSize: 60, 
            color: '#FFD700', 
            opacity: 0.3,
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'
          }} 
        />
      </motion.div>

      {/* Phone Devices */}
      <motion.div
        className="absolute top-20 left-20 z-0"
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
            color: '#FFD700', 
            opacity: 0.6,
            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))'
          }} 
        />
      </motion.div>

      <motion.div
        className="absolute top-32 right-24 z-0"
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
            color: '#FFD700', 
            opacity: 0.5,
            filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.3))'
          }} 
        />
      </motion.div>

      {/* Laptop Devices */}
      <motion.div
        className="absolute bottom-32 left-16 z-0"
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
            color: '#FFD700', 
            opacity: 0.6,
            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))'
          }} 
        />
      </motion.div>

      <motion.div
        className="absolute top-40 left-1/4 z-0"
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
            color: '#FFD700', 
            opacity: 0.5,
            filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.3))'
          }} 
        />
      </motion.div>

      {/* Tablet Devices */}
      <motion.div
        className="absolute bottom-20 right-16 z-0"
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
            color: '#FFD700', 
            opacity: 0.6,
            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))'
          }} 
        />
      </motion.div>

      {/* IoT Devices */}
      <motion.div
        className="absolute top-1/3 right-1/3 z-0"
        animate={{
          y: [0, -10, 0],
          x: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
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
            color: '#FFD700', 
            opacity: 0.5,
            filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.3))'
          }} 
        />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-1/3 z-0"
        animate={{
          y: [0, 15, 0],
          x: [0, 25, 0],
          opacity: [0.4, 0.7, 0.4],
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
            color: '#FFD700', 
            opacity: 0.6,
            filter: 'drop-shadow(0 0 7px rgba(255, 215, 0, 0.4))'
          }} 
        />
      </motion.div>

      <motion.div
        className="absolute top-1/4 left-3/4 z-0"
        animate={{
          y: [0, -18, 0],
          x: [0, -12, 0],
          opacity: [0.3, 0.6, 0.3],
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
            color: '#FFD700', 
            opacity: 0.5,
            filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.3))'
          }} 
        />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 z-0"
        animate={{
          y: [0, 22, 0],
          x: [0, -18, 0],
          opacity: [0.4, 0.7, 0.4],
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
            color: '#FFD700', 
            opacity: 0.6,
            filter: 'drop-shadow(0 0 7px rgba(255, 215, 0, 0.4))'
          }} 
        />
      </motion.div>

      {/* Network Connection Lines - Enhanced Real-time Data Flow */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.6 }}>
        {/* Define gradient for data packets */}
        <defs>
          <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="reverseDataFlow" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Primary connection lines */}
        <motion.line
          x1="80"
          y1="80"
          x2="50%"
          y2="50%"
          stroke="url(#dataFlowGradient)"
          strokeWidth="2"
          strokeDasharray="8,4"
          animate={{
            strokeDashoffset: [0, -12],
            opacity: [0.4, 0.9, 0.4],
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
          strokeWidth="2"
          strokeDasharray="6,3"
          animate={{
            strokeDashoffset: [0, -9],
            opacity: [0.3, 0.8, 0.3],
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
          strokeWidth="2"
          strokeDasharray="10,5"
          animate={{
            strokeDashoffset: [0, -15],
            opacity: [0.5, 1, 0.5],
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
          strokeWidth="2"
          strokeDasharray="7,3"
          animate={{
            strokeDashoffset: [0, -10],
            opacity: [0.4, 0.9, 0.4],
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
          strokeWidth="2"
          strokeDasharray="9,4"
          animate={{
            strokeDashoffset: [0, -13],
            opacity: [0.3, 0.8, 0.3],
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
          strokeWidth="2"
          strokeDasharray="5,2"
          animate={{
            strokeDashoffset: [0, -7],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            strokeDashoffset: { duration: 1.3, repeat: Infinity, ease: "linear", delay: 1.2 },
            opacity: { duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
          }}
        />

        {/* Additional data packet indicators */}
        <motion.circle
          r="3"
          fill="#FFD700"
          opacity="0.8"
          animate={{
            cx: ["80", "80"],
            cy: ["80", "80"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0,
          }}
        />

        <motion.circle
          r="2.5"
          fill="#FFD700"
          opacity="0.9"
          animate={{
            cx: ["75%", "50%"],
            cy: ["20%", "50%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
            delay: 0.3,
          }}
        />

        <motion.circle
          r="3.5"
          fill="#FFD700"
          opacity="0.7"
          animate={{
            cx: ["15%", "50%"],
            cy: ["70%", "50%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.6,
          }}
        />

        <motion.circle
          r="2"
          fill="#FFD700"
          opacity="0.8"
          animate={{
            cx: ["85%", "50%"],
            cy: ["80%", "50%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.4,
          }}
        />

        <motion.circle
          r="2.8"
          fill="#FFD700"
          opacity="0.6"
          animate={{
            cx: ["25%", "50%"],
            cy: ["25%", "50%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
            ease: "linear",
            delay: 0.9,
          }}
        />

        <motion.circle
          r="3.2"
          fill="#FFD700"
          opacity="0.9"
          animate={{
            cx: ["65%", "50%"],
            cy: ["65%", "50%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "linear",
            delay: 1.2,
          }}
        />
      </svg>
    </Box>
  );
};

export default AuthLayout;
