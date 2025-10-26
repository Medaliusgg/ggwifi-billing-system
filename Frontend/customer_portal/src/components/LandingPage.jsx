import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  ShoppingCart as ShoppingCartIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getTranslation } from '../translations';

const LandingPage = ({ onNavigateToVoucher, onNavigateToPackages, currentLanguage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <SpeedIcon />,
      title: 'Fast Hotspot WiFi',
      description: 'High-speed internet access anywhere',
      color: 'primary',
    },
    {
      icon: <SecurityIcon />,
      title: 'Secure Hotspot',
      description: 'Protected WiFi connection',
      color: 'success',
    },
    {
      icon: <SupportIcon />,
      title: 'Instant Support',
      description: 'Quick help when you need it',
      color: 'info',
    },
    {
      icon: <LocationIcon />,
      title: 'Hotspot Coverage',
      description: 'Available in major locations',
      color: 'warning',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.custom.gradients.backgroundPrimary,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
          pointerEvents: 'none',
        },
        '@keyframes gradientShift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.6 },
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ 
          pt: { xs: 4, md: 6 }, 
          pb: { xs: 6, md: 8 },
          textAlign: 'center',
        }}>

          {/* Main Heading */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
                                    <Typography
                          variant={isMobile ? "h3" : "h2"}
                          sx={{
                            fontWeight: 800,
                            mb: 2,
                            background: theme.custom.gradients.primary,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          GGNetworks Hotspot WiFi
                        </Typography>
                      </motion.div>

                      {/* Subtitle */}
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        <Typography
                          variant={isMobile ? "h6" : "h5"}
                          sx={{
                            color: theme.palette.text.secondary,
                            mb: 4,
                            fontWeight: 400,
                            maxWidth: 600,
                            mx: 'auto',
                            lineHeight: 1.6,
                          }}
                        >
                          Connect to high-speed WiFi hotspots across Tanzania with instant access
                        </Typography>
          </motion.div>

          {/* Central Action Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNavigateToVoucher}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(25, 118, 210, 0.3)',
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <WifiIcon sx={{ 
                        fontSize: 48, 
                        color: theme.palette.primary.main,
                        mb: 1.5,
                        filter: 'drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3))',
                      }} />
                    </motion.div>
                    
                                                    <Typography variant="h6" sx={{
                                  fontWeight: 700,
                                  mb: 1.5,
                                  color: theme.palette.text.primary,
                                }}>
                                  Connect to Hotspot
                                </Typography>

                                <Typography variant="body2" sx={{
                                  color: theme.palette.text.secondary,
                                  mb: 2,
                                }}>
                                  Have a voucher? Connect to WiFi hotspot instantly
                                </Typography>

                    <Button
                      variant="contained"
                      size="medium"
                      fullWidth
                      onClick={onNavigateToVoucher}
                      sx={{
                        background: theme.custom.gradients.primary,
                        borderRadius: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                          background: theme.custom.gradients.primary,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(25, 118, 210, 0.4)',
                        },
                      }}
                    >
                      Connect Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNavigateToPackages}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(76, 175, 80, 0.3)',
                      borderColor: theme.palette.success.main,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                    >
                      <ShoppingCartIcon sx={{ 
                        fontSize: 48, 
                        color: theme.palette.success.main,
                        mb: 1.5,
                        filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))',
                      }} />
                    </motion.div>
                    
                                                    <Typography variant="h6" sx={{
                                  fontWeight: 700,
                                  mb: 1.5,
                                  color: theme.palette.text.primary,
                                }}>
                                  Buy Hotspot Packages
                                </Typography>

                                <Typography variant="body2" sx={{
                                  color: theme.palette.text.secondary,
                                  mb: 2,
                                }}>
                                  Purchase WiFi hotspot vouchers for instant access
                                </Typography>

                    <Button
                      variant="contained"
                      size="medium"
                      fullWidth
                      sx={{
                        background: theme.custom.gradients.success,
                        borderRadius: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                        '&:hover': {
                          background: theme.custom.gradients.success,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4)',
                        },
                      }}
                    >
                      View Packages
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
                                    <Typography variant="h5" sx={{
                          fontWeight: 700,
                          mb: 3,
                          textAlign: 'center',
                          color: theme.palette.text.primary,
                        }}>
                          Why Choose Our Hotspot WiFi?
                        </Typography>

            <Grid container spacing={2} justifyContent="center">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 2.5,
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      <Box sx={{ 
                        color: theme.palette[feature.color].main,
                        mb: 1.5,
                      }}>
                        {React.cloneElement(feature.icon, { 
                          sx: { fontSize: 36 } 
                        })}
                      </Box>
                      
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        color: theme.palette.text.primary,
                      }}>
                        {feature.title}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem',
                      }}>
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage; 