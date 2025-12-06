import React, { useState, useEffect } from 'react';
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
  IconButton,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationIcon,
  FlashOn as FlashOnIcon,
  Payment as PaymentIcon,
  CardGiftcard as GiftIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Wifi as WifiIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { customerPortalAPI } from '../services/customerPortalApi';

const LandingPage = ({ onNavigateToVoucher, onNavigateToPackages, currentLanguage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const testimonials = [
    {
      name: 'John Mwangi',
      location: 'Dar es Salaam',
      rating: 5,
      comment: 'Fast and reliable internet! The voucher system is so convenient. Best WiFi service in Tanzania!',
      avatar: 'JM',
    },
    {
      name: 'Sarah Hassan',
      location: 'Arusha',
      rating: 5,
      comment: 'Excellent service! The connection is stable and customer support is outstanding.',
      avatar: 'SH',
    },
    {
      name: 'David Kimathi',
      location: 'Mwanza',
      rating: 5,
      comment: 'Great value for money. The packages are affordable and the speed is amazing.',
      avatar: 'DK',
    },
  ];

  const handleContactClick = () => {
    window.open('tel:+255742844024', '_self');
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I need help with GG Wi-Fi services.');
    window.open(`https://wa.me/255742844024?text=${message}`, '_blank');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        background: '#FFFFFF',
        pt: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 2, md: 4 } }}>
        {/* ============================================
            HERO SECTION (Big, Bold, Emotional)
            ============================================ */}
        <Box
          sx={{
            pt: { xs: 4, md: 6 },
            pb: { xs: 6, md: 8 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Left Section - Text */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant={isMobile ? "h3" : "h1"}
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                    color: '#0A0A0A',
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Fast, Reliable, Everywhere Wi-Fi.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666666',
                    mb: 4,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.7,
                    maxWidth: { xs: '100%', md: '90%' },
                  }}
                >
                  Stay connected across all GG WiFi zones with instant hotspot access and secure payments.
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ mb: 4 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={onNavigateToPackages}
                    sx={{
                      backgroundColor: '#F2C94C',
                      color: '#0A0A0A',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#E0B335',
                        boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
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
                      borderColor: '#F2C94C',
                      color: '#0A0A0A',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#E0B335',
                        backgroundColor: 'rgba(242, 201, 76, 0.1)',
                      },
                    }}
                  >
                    Connect With Voucher
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right Section - Floating Card */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card
                  sx={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                    p: 4,
                    border: '1px solid #EEEEEE',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: '#F2C94C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <LocationIcon sx={{ color: '#0A0A0A', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>
                        Your Location
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#0A0A0A', fontWeight: 600 }}>
                        Tanzania
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                      Available Networks
                    </Typography>
                    <Chip
                      label="GG-WiFi"
                      sx={{
                        backgroundColor: '#ECFDF5',
                        color: '#10B981',
                        fontWeight: 600,
                        mr: 1,
                      }}
                    />
                    <Chip
                      label="GG-WiFi-5G"
                      sx={{
                        backgroundColor: '#EAF4FF',
                        color: '#3A8DFF',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#10B981',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2">Live connection available</Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* ============================================
            FEATURE STRIP (Horizontal 3-Item Highlights)
            ============================================ */}
        <Box sx={{ py: { xs: 4, md: 6 }, background: '#FFFFFF' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    border: '1px solid #EEEEEE',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: '#F2C94C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <FlashOnIcon sx={{ color: '#0A0A0A', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0A0A0A' }}>
                    Instant Connection
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666666' }}>
                    Get connected in seconds with our fast activation system
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    border: '1px solid #EEEEEE',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: '#F2C94C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <PaymentIcon sx={{ color: '#0A0A0A', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0A0A0A' }}>
                    Secure Mobile Payments
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666666' }}>
                    Pay safely with SELCOM/ZenoPay mobile money integration
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    border: '1px solid #EEEEEE',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: '#F2C94C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <GiftIcon sx={{ color: '#0A0A0A', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0A0A0A' }}>
                    Earn GG Points
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666666' }}>
                    Get loyalty points on every purchase and redeem rewards
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* ============================================
            TESTIMONIALS (Elegant, Minimal, Trust-Building)
            ============================================ */}
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              textAlign: 'center',
              color: '#0A0A0A',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            What Our Customers Say
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666666',
              mb: 4,
              textAlign: 'center',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Join thousands of satisfied users across Tanzania
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      border: '1px solid #EEEEEE',
                      p: 3,
                      height: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          sx={{
                            color: '#F2C94C',
                            fontSize: 20,
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#0A0A0A',
                        mb: 3,
                        fontStyle: 'italic',
                        lineHeight: 1.7,
                      }}
                    >
                      "{testimonial.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          background: '#F2C94C',
                          color: '#0A0A0A',
                          fontWeight: 700,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: '#0A0A0A',
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#666666',
                          }}
                        >
                          {testimonial.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ============================================
            CALL TO ACTION (Premium, Clean, High-Contrast)
            ============================================ */}
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Card
            sx={{
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.10)',
              border: '1px solid #EEEEEE',
              p: { xs: 4, md: 6 },
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#0A0A0A',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
              }}
            >
              Ready to Get Connected?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Join thousands of users enjoying fast, reliable Wi-Fi across Tanzania.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={onNavigateToPackages}
                sx={{
                  backgroundColor: '#F2C94C',
                  color: '#0A0A0A',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#E0B335',
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
                  borderColor: '#F2C94C',
                  color: '#0A0A0A',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#E0B335',
                    backgroundColor: 'rgba(242, 201, 76, 0.1)',
                  },
                }}
              >
                Connect With Voucher
              </Button>
            </Stack>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
