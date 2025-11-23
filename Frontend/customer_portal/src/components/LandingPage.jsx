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
  Avatar,
  Chip,
  Stack,
  Badge,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  ShoppingCart as ShoppingCartIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Timer as TimerIcon,
  VerifiedUser as VerifiedUserIcon,
  FlashOn as FlashOnIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const LandingPage = ({ onNavigateToVoucher, onNavigateToPackages, currentLanguage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const stats = [
    { icon: <PeopleIcon />, value: '50K+', label: 'Active Users', color: '#FFC72C' },
    { icon: <LocationIcon />, value: '8+', label: 'Cities Covered', color: '#0072CE' },
    { icon: <SpeedIcon />, value: '99.9%', label: 'Uptime', color: '#1ABC9C' },
    { icon: <StarIcon />, value: '4.8/5', label: 'User Rating', color: '#FFC72C' },
  ];

  const features = [
    {
      icon: <FlashOnIcon />,
      title: 'Lightning Fast Speed',
      description: 'Experience blazing-fast internet speeds up to 100 Mbps for seamless browsing, streaming, and downloads.',
      color: '#FFC72C',
      gradient: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
    },
    {
      icon: <SecurityIcon />,
      title: 'Military-Grade Security',
      description: 'Bank-level encryption and secure connections to protect your data and privacy at all times.',
      color: '#0072CE',
      gradient: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
    },
    {
      icon: <SupportIcon />,
      title: '24/7 Expert Support',
      description: 'Round-the-clock customer support via phone, WhatsApp, and email. We\'re always here to help.',
      color: '#1ABC9C',
      gradient: 'linear-gradient(135deg, #1ABC9C 0%, #17A689 100%)',
    },
    {
      icon: <LocationIcon />,
      title: 'Nationwide Coverage',
      description: 'Access high-speed WiFi in 8+ major cities across Tanzania. Connect anywhere, anytime.',
      color: '#FFC72C',
      gradient: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
    },
    {
      icon: <TimerIcon />,
      title: 'Instant Activation',
      description: 'Get connected in seconds. No waiting, no complicated setup. Just purchase and connect instantly.',
      color: '#0072CE',
      gradient: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
    },
    {
      icon: <VerifiedUserIcon />,
      title: 'Reliable & Trusted',
      description: 'Trusted by thousands of users. 99.9% uptime guarantee ensures you stay connected when it matters.',
      color: '#1ABC9C',
      gradient: 'linear-gradient(135deg, #1ABC9C 0%, #17A689 100%)',
    },
  ];

  const testimonials = [
    {
      name: 'John Mwangi',
      location: 'Dar es Salaam',
      rating: 5,
      comment: 'Fast and reliable internet! The voucher system is so convenient. I can connect instantly wherever I am. Best WiFi service in Tanzania!',
      avatar: 'JM',
    },
    {
      name: 'Sarah Hassan',
      location: 'Arusha',
      rating: 5,
      comment: 'Excellent service! The connection is stable and the customer support is outstanding. Highly recommend GG Wi-Fi to everyone.',
      avatar: 'SH',
    },
    {
      name: 'David Kimathi',
      location: 'Mwanza',
      rating: 5,
      comment: 'Great value for money. The packages are affordable and the speed is amazing. I\'ve been using it for months without any issues.',
      avatar: 'DK',
    },
  ];

  const benefits = [
    { icon: <CheckCircleIcon />, text: 'No contracts or commitments' },
    { icon: <CheckCircleIcon />, text: 'Pay as you go flexibility' },
    { icon: <CheckCircleIcon />, text: 'Multiple package options' },
    { icon: <CheckCircleIcon />, text: 'Easy voucher-based access' },
    { icon: <CheckCircleIcon />, text: 'Secure and encrypted' },
    { icon: <CheckCircleIcon />, text: '24/7 customer support' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ 
          pt: { xs: 6, md: 10 }, 
          pb: { xs: 8, md: 12 },
          textAlign: 'center',
        }}>
          {/* Logo with Circular Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            style={{ marginBottom: '2rem' }}
          >
            <Avatar
              src="/gg-logo.png"
              alt="GG Wi-Fi Logo"
              sx={{
                width: { xs: 120, sm: 140, md: 160 },
                height: { xs: 120, sm: 140, md: 160 },
                mx: 'auto',
                border: '5px solid #FFC72C',
                boxShadow: '0 8px 40px rgba(255, 199, 44, 0.7), 0 0 60px rgba(255, 199, 44, 0.4)',
                background: 'linear-gradient(135deg, rgba(255, 199, 44, 0.3) 0%, rgba(0, 114, 206, 0.2) 100%)',
                filter: 'brightness(1.15)',
                '& img': {
                  objectFit: 'contain',
                  padding: '6px',
                  filter: 'brightness(1.3) contrast(1.15) drop-shadow(0 2px 8px rgba(255, 199, 44, 0.6))',
                },
              }}
            />
          </motion.div>

          {/* Main Heading with Gradient */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant={isMobile ? "h3" : "h1"}
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                background: 'linear-gradient(135deg, #FFC72C 0%, #FFFFFF 50%, #0072CE 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Welcome to GG Wi-Fi
            </Typography>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant={isMobile ? "h6" : "h4"}
              sx={{
                color: '#FFFFFF',
                mb: 1,
                fontWeight: 500,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              Experience Lightning-Fast, Secure, and Reliable Internet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.7,
              }}
            >
              Connect instantly to high-speed WiFi hotspots across Tanzania. 
              No contracts, no hassle—just fast, secure internet when you need it.
            </Typography>
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          background: 'rgba(255, 255, 255, 0.15)',
                          boxShadow: `0 8px 32px ${stat.color}40`,
                        },
                      }}
                    >
                      <Box sx={{ color: stat.color, mb: 1 }}>
                        {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: '#FFFFFF',
                          mb: 0.5,
                          fontSize: { xs: '1.75rem', md: '2.25rem' },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Central Action Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Grid container spacing={3} justifyContent="center" sx={{ mb: 8 }}>
              <Grid item xs={12} sm={6} md={5}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onNavigateToVoucher}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(0, 114, 206, 0.2) 0%, rgba(0, 114, 206, 0.1) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(0, 114, 206, 0.3)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 12px 40px rgba(0, 114, 206, 0.2)',
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 20px 60px rgba(0, 114, 206, 0.4)',
                      borderColor: 'rgba(0, 114, 206, 0.5)',
                      background: 'linear-gradient(135deg, rgba(0, 114, 206, 0.3) 0%, rgba(0, 114, 206, 0.2) 100%)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 1.2, type: 'spring' }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          boxShadow: '0 8px 24px rgba(0, 114, 206, 0.4)',
                        }}
                      >
                        <WifiIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
                      </Box>
                    </motion.div>
                    
                    <Typography 
                      variant="h5" 
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: '#FFFFFF',
                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                      }}
                    >
                      Connect to Hotspot
                    </Typography>

                    <Typography 
                      variant="body1" 
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        mb: 3,
                        fontSize: { xs: '0.95rem', md: '1.1rem' },
                        lineHeight: 1.6,
                      }}
                    >
                      Have a voucher code? Connect to GG Wi-Fi network instantly and start browsing.
                    </Typography>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      onClick={onNavigateToVoucher}
                      sx={{
                        background: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
                        borderRadius: 3,
                        py: 1.75,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(0, 114, 206, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0056A3 0%, #004080 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(0, 114, 206, 0.5)',
                        },
                      }}
                    >
                      Connect Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={5}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onNavigateToPackages}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255, 199, 44, 0.2) 0%, rgba(255, 199, 44, 0.1) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 199, 44, 0.3)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 12px 40px rgba(255, 199, 44, 0.2)',
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 20px 60px rgba(255, 199, 44, 0.4)',
                      borderColor: 'rgba(255, 199, 44, 0.5)',
                      background: 'linear-gradient(135deg, rgba(255, 199, 44, 0.3) 0%, rgba(255, 199, 44, 0.2) 100%)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 1.4, type: 'spring' }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          boxShadow: '0 8px 24px rgba(255, 199, 44, 0.4)',
                        }}
                      >
                        <ShoppingCartIcon sx={{ fontSize: 40, color: '#000000' }} />
                      </Box>
                    </motion.div>
                    
                    <Typography 
                      variant="h5" 
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: '#FFFFFF',
                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                      }}
                    >
                      Buy Packages
                    </Typography>

                    <Typography 
                      variant="body1" 
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        mb: 3,
                        fontSize: { xs: '0.95rem', md: '1.1rem' },
                        lineHeight: 1.6,
                      }}
                    >
                      Choose from flexible packages. Pay via mobile money and get instant access to high-speed internet.
                    </Typography>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      onClick={onNavigateToPackages}
                      sx={{
                        background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                        color: '#000000',
                        borderRadius: 3,
                        py: 1.75,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(255, 199, 44, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFB300 0%, #FFA000 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(255, 199, 44, 0.5)',
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

          {/* Benefits Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            sx={{ mb: 8 }}
          >
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  textAlign: 'center',
                  color: '#FFFFFF',
                }}
              >
                Why Choose GG Wi-Fi?
              </Typography>
              <Grid container spacing={2}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleIcon sx={{ color: '#1ABC9C', fontSize: 24 }} />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 500,
                        }}
                      >
                        {benefit.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            sx={{ mb: 8 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 5,
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Everything you need for a seamless internet experience
            </Typography>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.0 + index * 0.1 }}
                  >
                    <Paper
                      component={motion.div}
                      whileHover={{ y: -8, scale: 1.02 }}
                      sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                          boxShadow: `0 12px 40px ${feature.color}40`,
                          borderColor: feature.color,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: feature.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          boxShadow: `0 4px 16px ${feature.color}40`,
                        }}
                      >
                        {React.cloneElement(feature.icon, { 
                          sx: { fontSize: 28, color: '#FFFFFF' } 
                        })}
                      </Box>
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 1.5,
                          color: '#FFFFFF',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: 1.7,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Testimonials Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.6 }}
            sx={{ mb: 8 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              What Our Customers Say
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 5,
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Join thousands of satisfied customers across Tanzania
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.8 + index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 3.5,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          background: 'rgba(255, 255, 255, 0.15)',
                          boxShadow: '0 12px 40px rgba(255, 199, 44, 0.2)',
                          borderColor: '#FFC72C',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon
                            key={i}
                            sx={{
                              color: '#FFC72C',
                              fontSize: 20,
                            }}
                          />
                        ))}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#FFFFFF',
                          mb: 3,
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                          fontSize: '1rem',
                        }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                          }}
                        >
                          {testimonial.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              color: '#FFFFFF',
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {testimonial.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Final CTA Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.2 }}
            sx={{ mb: 6 }}
          >
            <Paper
              sx={{
                p: { xs: 4, md: 6 },
                background: 'linear-gradient(135deg, rgba(255, 199, 44, 0.2) 0%, rgba(0, 114, 206, 0.2) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 199, 44, 0.3)',
                borderRadius: 4,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  color: '#FFFFFF',
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                Join thousands of satisfied customers. Get connected in seconds with our easy-to-use platform.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={onNavigateToPackages}
                  sx={{
                    background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                    color: '#000000',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 8px 32px rgba(255, 199, 44, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FFB300 0%, #FFA000 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(255, 199, 44, 0.5)',
                    },
                  }}
                >
                  Buy Package Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={onNavigateToVoucher}
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#FFC72C',
                      background: 'rgba(255, 199, 44, 0.1)',
                      borderWidth: 2,
                    },
                  }}
                >
                  Connect with Voucher
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
