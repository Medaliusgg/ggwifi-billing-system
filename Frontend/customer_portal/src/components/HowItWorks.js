import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  useTheme,
  Chip,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
  Sms as SmsIcon,
  Wifi as WifiIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const theme = useTheme();

  const steps = [
    {
      label: 'Choose Your Package',
      description: 'Browse our internet packages and select the one that best fits your needs. We offer daily, weekly, and monthly plans with speeds from 25 Mbps to 200 Mbps.',
      icon: <ShoppingCartIcon />,
      color: 'primary',
      details: [
        'Compare package features and prices',
        'Select your preferred duration',
        'Choose your desired speed tier',
      ],
    },
    {
      label: 'Make Payment',
      description: 'Pay securely using any Tanzanian mobile money service: M-Pesa, Airtel Money, Mixx (Tigo Pesa), HaloPesa, or T-Pesa. All payments are processed through our secure SELCOM gateway.',
      icon: <PaymentIcon />,
      color: 'success',
      details: [
        'Select your payment method',
        'Enter your phone number',
        'Complete USSD payment process',
        'Receive instant confirmation',
      ],
    },
    {
      label: 'Receive Voucher',
      description: 'After successful payment, you\'ll receive an SMS with your unique voucher code. This code is your key to accessing GGNetworks WiFi.',
      icon: <SmsIcon />,
      color: 'info',
      details: [
        'Instant SMS delivery',
        'Unique voucher code',
        'Valid for your selected duration',
        'Can be used immediately',
      ],
    },
    {
      label: 'Connect to WiFi',
      description: 'Connect to GGNetworks WiFi network, enter your voucher code, and enjoy high-speed internet access. The connection is automatic and secure.',
      icon: <WifiIcon />,
      color: 'warning',
      details: [
        'Select GGNetworks from WiFi list',
        'Enter your voucher code',
        'Automatic connection setup',
        'Start browsing immediately',
      ],
    },
    {
      label: 'Enjoy High-Speed Internet',
      description: 'Experience fast, reliable internet with speeds up to 200 Mbps. Monitor your usage, run speed tests, and get support whenever you need it.',
      icon: <SpeedIcon />,
      color: 'secondary',
      details: [
        'High-speed browsing and streaming',
        'Monitor usage in real-time',
        'Run speed tests anytime',
        '24/7 customer support',
      ],
    },
  ];

  const features = [
    {
      title: 'Instant Activation',
      description: 'Get connected immediately after payment',
      icon: <CheckIcon />,
      color: 'success',
    },
    {
      title: 'Secure Connection',
      description: 'Enterprise-grade security protocols',
      icon: <WifiIcon />,
      color: 'primary',
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock technical assistance',
      icon: <SupportIcon />,
      color: 'info',
    },
    {
      title: 'Multiple Devices',
      description: 'Connect all your devices with one voucher',
      icon: <SpeedIcon />,
      color: 'warning',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            How It Works
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Get connected to high-speed internet in just 5 simple steps
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              background: theme.custom.gradients.primary,
              borderRadius: 2,
              mx: 'auto',
              mb: 3,
            }}
          />
        </motion.div>
      </Box>

      {/* Steps */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ 
                  background: theme.custom.gradients.cardBackground,
                  border: `1px solid ${theme.custom.effects.glass.primary}`,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: theme.custom.gradients.primary,
                  },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.custom.effects.shadow.heavy,
                  },
                  transition: 'all 0.3s ease',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ 
                        width: 60, 
                        height: 60, 
                        mr: 2,
                        background: theme.custom.gradients.primary,
                        color: 'white',
                        fontSize: '1.5rem',
                      }}>
                        {index + 1}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                          {step.label}
                        </Typography>
                        <Chip 
                          icon={step.icon}
                          label={`Step ${index + 1}`}
                          color={step.color}
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: 'text.secondary' }}>
                      {step.description}
                    </Typography>
                    
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                        What you'll do:
                      </Typography>
                      {step.details.map((detail, detailIndex) => (
                        <Box key={detailIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CheckIcon sx={{ 
                            fontSize: 16, 
                            color: 'success.main', 
                            mr: 1 
                          }} />
                          <Typography variant="body2" color="text.secondary">
                            {detail}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" fontWeight={600} sx={{ textAlign: 'center', mb: 4 }}>
          Why Choose GGNetworks?
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ 
                  background: theme.custom.gradients.cardBackground,
                  border: `1px solid ${theme.custom.effects.glass.primary}`,
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.custom.effects.shadow.heavy,
                  },
                }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: theme.custom.gradients.primary,
                    mx: 'auto',
                    mb: 2,
                  }}>
                    <Box sx={{ color: 'white', fontSize: 32 }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card sx={{ 
          background: theme.custom.gradients.primary,
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}>
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Join thousands of satisfied customers enjoying high-speed internet across Tanzania
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255,255,255,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Browse Packages
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Contact Support
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default HowItWorks; 