import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CardGiftcard as GiftIcon,
  Payment as PaymentIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import GlobalHeader from '../components/GlobalHeader';
import Footer from '../components/Footer';
import MarketingCarousel from '../components/MarketingCarousel';
import { customerPortalAPI } from '../services/customerPortalApi';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // GG Color Theme - Use theme colors only
  const colors = {
    background: theme.palette.background.default,
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
    primary: theme.palette.primary.main,
  };

  // Fetch marketing campaigns
  const { data: campaigns = [] } = useQuery(
    ['marketing-campaigns'],
    async () => {
      try {
        const res = await customerPortalAPI.getCampaigns();
        return res?.data?.campaigns || [];
      } catch (error) {
        // Silently fail - campaigns are optional
        if (error?.response?.status !== 404) {
          console.error('Error fetching campaigns:', error);
        }
        return [];
      }
    },
    { 
      refetchInterval: 300000,
      retry: false,
      refetchOnWindowFocus: false,
      // Don't show error for 404 - campaigns endpoint might not be available
      onError: () => {},
    }
  );

  const trustFeatures = [
    { icon: <SecurityIcon />, title: 'Secure Network', desc: 'Encrypted connection' },
    { icon: <SpeedIcon />, title: 'Fast Speeds', desc: 'High-speed internet' },
    { icon: <GiftIcon />, title: 'Reward Points', desc: 'Loyalty system' },
    { icon: <PaymentIcon />, title: 'Safe Payment', desc: 'ZenoPay secure' },
    { icon: <LocationIcon />, title: 'Reliable Coverage', desc: 'Wide network' },
  ];

  const testimonials = [
    { name: 'Ahmed M.', comment: 'Fast and reliable!', rating: 5 },
    { name: 'Fatuma K.', comment: 'Great customer service', rating: 5 },
    { name: 'John D.', comment: 'Best WiFi in town', rating: 5 },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, pb: { xs: 12, md: 10 } }}>
      <GlobalHeader isAuthenticated={false} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: colors.textPrimary,
                mb: 2,
                fontSize: { xs: '28px', md: '40px' },
              }}
            >
              Welcome to GG Wi-Fi
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: colors.textSecondary,
                mb: 1,
                fontSize: { xs: '16px', md: '20px' },
              }}
            >
              Fast. Reliable. Community-driven internet.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colors.info,
                fontWeight: 600,
                fontSize: { xs: '14px', md: '18px' },
              }}
            >
              "The signal that cares."
            </Typography>
          </Box>
        </motion.div>

        {/* Marketing Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ mb: 5 }}>
            <MarketingCarousel campaigns={campaigns} />
          </Box>
        </motion.div>

        {/* Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 3,
              color: '#0A0A0A',
            }}
          >
            Why GG Wi-Fi?
          </Typography>
          <Grid container spacing={2} sx={{ mb: 5 }}>
            {trustFeatures.map((feature, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FC 100%)',
                    border: '1px solid #EEEEEE',
                    borderRadius: '12px',
                    p: 2,
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(72, 199, 242, 0.2)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: colors.info,
                      color: theme.palette.background.paper,
                      width: 48,
                      height: 48,
                      mx: 'auto',
                      mb: 1,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666666' }}>
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 3,
              color: '#0A0A0A',
            }}
          >
            What Our Customers Say
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 2,
              mb: 5,
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 280,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${colors.background} 100%)`,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '12px',
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: colors.info, mr: 1 }}>
                    {testimonial.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: 16, color: '#FFD700' }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  "{testimonial.comment}"
                </Typography>
              </Card>
            ))}
          </Box>
        </motion.div>

      </Container>
      
      {/* Footer with Action Buttons */}
      <Footer />
    </Box>
  );
};

export default LandingPage;
