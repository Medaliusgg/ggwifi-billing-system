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
    { icon: <PeopleIcon />, value: '50K+', label: 'Active Users', color: '#F5C400' },  // Gold Prime
    { icon: <LocationIcon />, value: '8+', label: 'Cities Covered', color: '#0072CE' },
    { icon: <SpeedIcon />, value: '99.9%', label: 'Uptime', color: '#1ABC9C' },
    { icon: <StarIcon />, value: '4.8/5', label: 'User Rating', color: '#F5C400' },  // Gold Prime
  ];

  const features = [
    {
      icon: <FlashOnIcon />,
      title: 'Lightning Fast Speed',
      description: 'Experience blazing-fast internet speeds up to 100 Mbps for seamless browsing, streaming, and downloads.',
      color: '#F5C400',  // Gold Prime
      gradient: 'linear-gradient(135deg, #F5C400 0%, #D4A100 100%)',  // Premium gold gradient
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
      color: '#F5C400',  // Gold Prime
      gradient: 'linear-gradient(135deg, #F5C400 0%, #D4A100 100%)',  // Premium gold gradient
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
        background: '#FFFFFF',  // Soft White background - Premium design
        pt: 0,  // No padding-top - App.jsx already accounts for fixed navbar
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 1, md: 2 }, pt: 0 }}>
        {/* Hero Section */}
        <Box sx={{ 
          pt: 0,
          pb: { xs: 4, md: 6 },
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
                border: '5px solid #F5C400',  // Gold Prime
                boxShadow: '0 0 32px rgba(245, 196, 0, 0.6), 0 8px 40px rgba(245, 196, 0, 0.4)',  // Premium gold glow
                background: 'linear-gradient(135deg, rgba(245, 196, 0, 0.2) 0%, rgba(245, 196, 0, 0.1) 100%)',  // Premium gold
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
                background: 'linear-gradient(135deg, #F5C400 0%, #0B0B0B 50%, #F5C400 100%)',  // Premium gold to black gradient
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
                color: '#0B0B0B',  // Carbon Black - Premium design
                mb: 1,
                fontWeight: 600,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Experience Lightning-Fast, Secure, and Reliable Internet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#8D8D8D',  // Slate Grey - Premium design
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
                        p: { xs: 2.5, md: 3.5 },
                        textAlign: 'center',
                        background: '#FFFFFF',
                        border: 'none',
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <Box sx={{ color: '#F5C400', mb: 1.5, display: 'flex', justifyContent: 'center' }}>
                        {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 28, md: 32 } } })}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: '#0B0B0B',
                          mb: 0.5,
                          fontSize: { xs: '2rem', md: '2.5rem' },
                          lineHeight: 1.2,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#8D8D8D',
                          fontWeight: 500,
                          fontSize: { xs: '0.875rem', md: '0.9375rem' },
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
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNavigateToVoucher}
                  sx={{
                    background: '#FFFFFF',
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: { xs: 64, md: 72 },
                        height: { xs: 64, md: 72 },
                        borderRadius: '50%',
                        background: '#F5C400',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2.5,
                      }}
                    >
                      <WifiIcon sx={{ fontSize: { xs: 32, md: 36 }, color: '#0B0B0B' }} />
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: '#0B0B0B',
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                      }}
                    >
                      Connect to Hotspot
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{
                        color: '#8D8D8D',
                        mb: 3,
                        fontSize: { xs: '0.875rem', md: '0.9375rem' },
                        lineHeight: 1.6,
                      }}
                    >
                      Have a voucher code? Connect to GG Wi-Fi network instantly.
                    </Typography>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      onClick={onNavigateToVoucher}
                      sx={{
                        background: '#F5C400',
                        color: '#0B0B0B',
                        borderRadius: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          background: '#D4A100',
                          boxShadow: '0 2px 8px rgba(245, 196, 0, 0.3)',
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
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNavigateToPackages}
                  sx={{
                    background: '#FFFFFF',
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: { xs: 64, md: 72 },
                        height: { xs: 64, md: 72 },
                        borderRadius: '50%',
                        background: '#F5C400',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2.5,
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: { xs: 32, md: 36 }, color: '#0B0B0B' }} />
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: '#0B0B0B',
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                      }}
                    >
                      Buy Packages
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{
                        color: '#8D8D8D',
                        mb: 3,
                        fontSize: { xs: '0.875rem', md: '0.9375rem' },
                        lineHeight: 1.6,
                      }}
                    >
                      Choose from flexible packages. Pay via mobile money and get instant access.
                    </Typography>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      onClick={onNavigateToPackages}
                      sx={{
                        background: '#F5C400',
                        color: '#0B0B0B',
                        borderRadius: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          background: '#D4A100',
                          boxShadow: '0 2px 8px rgba(245, 196, 0, 0.3)',
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
                background: '#FFFFFF',
                border: 'none',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
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
                  color: '#0B0B0B',  // Carbon Black
                }}
              >
                Why Choose GG Wi-Fi?
              </Typography>
              <Grid container spacing={2}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleIcon sx={{ color: '#F5C400', fontSize: 24 }} />  {/* Gold Prime */}
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#0B0B0B',  // Carbon Black
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
                color: '#0B0B0B',  // Carbon Black
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#8D8D8D',  // Slate Grey
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
                      whileHover={{ y: -4 }}
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        height: '100%',
                        background: '#FFFFFF',
                        border: 'none',
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 48, md: 56 },
                          height: { xs: 48, md: 56 },
                          borderRadius: '50%',
                          background: feature.color === '#F5C400' ? '#F5C400' : feature.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        {React.cloneElement(feature.icon, { 
                          sx: { 
                            fontSize: { xs: 24, md: 28 }, 
                            color: feature.color === '#F5C400' ? '#0B0B0B' : '#FFFFFF' 
                          }
                        })}
                      </Box>
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 1,
                          color: '#0B0B0B',
                          fontSize: { xs: '1rem', md: '1.125rem' },
                        }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#8D8D8D',
                          lineHeight: 1.6,
                          fontSize: { xs: '0.8125rem', md: '0.875rem' },
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
                color: '#0B0B0B',  // Carbon Black
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              What Our Customers Say
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#8D8D8D',  // Slate Grey
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
                        p: { xs: 2.5, md: 3 },
                        height: '100%',
                        background: '#FFFFFF',
                        border: 'none',
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon
                            key={i}
                            sx={{
                              color: '#F5C400',  // Gold Prime
                              fontSize: 20,
                            }}
                          />
                        ))}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#0B0B0B',  // Carbon Black
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
                            background: 'linear-gradient(135deg, #F5C400 0%, #D4A100 100%)',  // Premium gold gradient
                            color: '#0B0B0B',  // Carbon Black text
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
                              color: '#0B0B0B',  // Carbon Black
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#8D8D8D',  // Slate Grey
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
                p: { xs: 4, md: 5 },
                background: '#FFFFFF',
                border: 'none',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  color: '#0B0B0B',  // Carbon Black
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#8D8D8D',  // Slate Grey
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
                    background: '#F5C400',
                    color: '#0B0B0B',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      background: '#D4A100',
                      boxShadow: '0 2px 8px rgba(245, 196, 0, 0.3)',
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
                    borderColor: '#EDEDED',
                    color: '#0B0B0B',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderWidth: 1,
                    '&:hover': {
                      borderColor: '#F5C400',
                      background: 'rgba(245, 196, 0, 0.05)',
                      borderWidth: 1,
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