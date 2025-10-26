import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  ShoppingCart as ShoppingCartIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  FlashOn as FlashOnIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const HeroSection = ({ 
  onNavigateToVoucher, 
  onNavigateToPackages, 
  currentLanguage = 'en' 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    float: {
      y: [-20, 20, -20],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    { icon: <SpeedIcon />, text: "Lightning Fast", color: "#FFC72C" },
    { icon: <SecurityIcon />, text: "Secure & Reliable", color: "#1ABC9C" },
    { icon: <PublicIcon />, text: "Wide Coverage", color: "#0072CE" },
    { icon: <SupportIcon />, text: "24/7 Support", color: "#FFC72C" },
  ];

  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "50+", label: "Locations" },
    { number: "10K+", label: "Happy Users" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%),
          radial-gradient(circle at 20% 20%, rgba(255, 199, 44, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0, 114, 206, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(26, 188, 156, 0.05) 0%, transparent 50%)
        `,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFC72C' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Content */}
          <Grid container spacing={6} alignItems="center">
            {/* Left Column - Content */}
            <Grid item xs={12} lg={6}>
              <motion.div variants={itemVariants}>
                {/* Badge */}
                <Box sx={{ mb: 3 }}>
                  <Chip
                    icon={<StarIcon />}
                    label="Tanzania's #1 WiFi Provider"
                    sx={{
                      background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                      color: '#000000',
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      '& .MuiChip-icon': {
                        color: '#000000',
                      },
                    }}
                  />
                </Box>

                {/* Main Heading */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: isMobile ? '3rem' : '4.5rem',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    mb: 3,
                    background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 50%, #0072CE 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  GG Wi-Fi
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    fontSize: isMobile ? '1.8rem' : '2.5rem',
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 2,
                    lineHeight: 1.3,
                  }}
                >
                  Seamless, Fast, Reliable Internet
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: isMobile ? '1.1rem' : '1.3rem',
                    lineHeight: 1.7,
                    color: 'text.secondary',
                    mb: 4,
                    maxWidth: '600px',
                    fontWeight: 400,
                  }}
                >
                  Experience lightning-fast internet speeds with our premium hotspot service. 
                  Connecting communities across Tanzania with reliable, secure, and affordable WiFi solutions.
                </Typography>
              </motion.div>

              {/* Features Grid */}
              <motion.div variants={itemVariants}>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {features.map((feature, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 3,
                          p: 2,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            background: feature.color,
                            width: 40,
                            height: 40,
                            mx: 'auto',
                            mb: 1,
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {feature.text}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 6 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<WifiIcon />}
                    onClick={onNavigateToVoucher}
                    sx={{
                      borderRadius: 4,
                      px: 6,
                      py: 2.5,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                      color: '#000000',
                      boxShadow: '0 12px 40px rgba(255, 199, 44, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFB300 0%, #FFA000 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 16px 50px rgba(255, 199, 44, 0.5)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    Connect Now
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={onNavigateToPackages}
                    sx={{
                      borderRadius: 4,
                      px: 6,
                      py: 2.5,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderColor: '#0072CE',
                      color: '#0072CE',
                      borderWidth: 3,
                      '&:hover': {
                        backgroundColor: '#0072CE',
                        color: 'white',
                        borderColor: '#0072CE',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 40px rgba(0, 114, 206, 0.4)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    Buy Package
                  </Button>
                </Stack>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants}>
                <Grid container spacing={3}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: isMobile ? '2rem' : '2.5rem',
                            fontWeight: 800,
                            color: '#FFC72C',
                            mb: 0.5,
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>

            {/* Right Column - Animated Illustration */}
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: isMobile ? '500px' : '600px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Main WiFi Icon */}
                  <motion.div
                    variants={floatingVariants}
                    animate="float"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                        borderRadius: '50%',
                        width: 120,
                        height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 60px rgba(255, 199, 44, 0.4)',
                      }}
                    >
                      <WifiIcon sx={{ fontSize: 60, color: '#000000' }} />
                    </Box>
                  </motion.div>

                  {/* Floating Feature Icons */}
                  {[
                    { icon: <SpeedIcon />, color: '#0072CE', position: { top: '15%', right: '20%' } },
                    { icon: <SecurityIcon />, color: '#1ABC9C', position: { bottom: '25%', left: '15%' } },
                    { icon: <FlashOnIcon />, color: '#FFC72C', position: { top: '30%', left: '10%' } },
                    { icon: <PublicIcon />, color: '#0072CE', position: { bottom: '15%', right: '10%' } },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={floatingVariants}
                      animate="float"
                      transition={{ delay: index * 0.5 }}
                      style={{
                        position: 'absolute',
                        ...item.position,
                      }}
                    >
                      <Avatar
                        sx={{
                          background: item.color,
                          width: 50,
                          height: 50,
                          boxShadow: `0 8px 32px ${item.color}40`,
                        }}
                      >
                        {item.icon}
                      </Avatar>
                    </motion.div>
                  ))}

                  {/* Animated Connection Lines */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '300px',
                      height: '300px',
                      borderRadius: '50%',
                      border: '2px dashed rgba(255, 199, 44, 0.3)',
                      animation: 'rotate 20s linear infinite',
                      '@keyframes rotate': {
                        '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                        '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
                      },
                    }}
                  />

                  {/* Connection Dots */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                    <motion.div
                      key={index}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-150px)`,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                        boxShadow: '0 4px 12px rgba(255, 199, 44, 0.4)',
                      }}
                    />
                  ))}

                  {/* Success Indicators */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '10%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      {[1, 2, 3].map((i) => (
                        <CheckCircleIcon
                          key={i}
                          sx={{
                            color: '#1ABC9C',
                            fontSize: 24,
                            filter: 'drop-shadow(0 2px 4px rgba(26, 188, 156, 0.3))',
                          }}
                        />
                      ))}
                    </Stack>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;