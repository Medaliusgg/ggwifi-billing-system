import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CardGiftcard as GiftIcon,
  Payment as PaymentIcon,
  LocationOn as LocationIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

const TrustSection = () => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const trustFeatures = [
    { icon: <SecurityIcon />, title: 'Reliability', desc: '99.9% uptime guarantee' },
    { icon: <SpeedIcon />, title: 'Fast Speeds', desc: 'High-speed internet' },
    { icon: <GiftIcon />, title: 'Customer Rewards', desc: 'Loyalty system' },
    { icon: <PaymentIcon />, title: 'Secure Network', desc: 'Encrypted connection' },
    { icon: <LockIcon />, title: 'Privacy & Encryption', desc: 'Your data is safe' },
    { icon: <LocationIcon />, title: 'Support', desc: '24/7 customer service' },
  ];

  // Auto-cycle focus
  useEffect(() => {
    const interval = setInterval(() => {
      setFocusedIndex((prev) => (prev + 1) % trustFeatures.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [trustFeatures.length]);

  return (
    <Box sx={{ py: 6, backgroundColor: '#FAFAFA' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 4,
            color: '#000000',
          }}
        >
          Trust & Security
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#F0F0F0',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#FFCC00',
              borderRadius: 4,
            },
          }}
        >
          {trustFeatures.map((feature, index) => {
            const isFocused = focusedIndex === index;
            
            return (
              <Box
                key={index}
                sx={{
                  minWidth: { xs: 200, sm: 250 },
                  scrollSnapAlign: 'start',
                }}
              >
                <motion.div
                  animate={{
                    scale: isFocused ? 1.1 : 1,
                    brightness: isFocused ? 1.2 : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      backgroundColor: '#FFFFFF',
                      border: `2px solid ${isFocused ? '#FFCC00' : '#E5E7EB'}`,
                      borderRadius: '16px',
                      p: 3,
                      height: '100%',
                      boxShadow: isFocused ? '0 8px 24px rgba(255, 204, 0, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: isFocused ? 1.2 : 1,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: isFocused ? '#FFCC00' : '#3A8DFF',
                          color: '#FFFFFF',
                          width: 64,
                          height: 64,
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                    </motion.div>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666' }}>
                      {feature.desc}
                    </Typography>
                  </Card>
                </motion.div>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default TrustSection;
