import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, Avatar, Grid } from '@mui/material';
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
  const [positions, setPositions] = useState([0, 1, 2, 3, 4, 5]);

  const trustFeatures = [
    { icon: <SecurityIcon />, title: 'Reliability', desc: '99.9% uptime guarantee' },
    { icon: <SpeedIcon />, title: 'Fast Speeds', desc: 'High-speed internet' },
    { icon: <GiftIcon />, title: 'Customer Rewards', desc: 'Loyalty system' },
    { icon: <PaymentIcon />, title: 'Secure Network', desc: 'Encrypted connection' },
    { icon: <LockIcon />, title: 'Privacy & Encryption', desc: 'Your data is safe' },
    { icon: <LocationIcon />, title: 'Support', desc: '24/7 customer service' },
  ];

  // Auto-cycle focus and rearrange
  useEffect(() => {
    const interval = setInterval(() => {
      setFocusedIndex((prev) => {
        const nextFocused = (prev + 1) % trustFeatures.length;
        // Rearrange positions - move focused to center
        setPositions((currentPos) => {
          const newPos = [...currentPos];
          const focused = newPos.indexOf(nextFocused);
          if (focused !== 2) {
            [newPos[focused], newPos[2]] = [newPos[2], newPos[focused]];
          }
          return newPos;
        });
        return nextFocused;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [trustFeatures.length]);

  const cardColors = [
    { bg: '#FFCC00', text: '#000000' },
    { bg: '#3B82F6', text: '#FFFFFF' },
    { bg: '#10B981', text: '#FFFFFF' },
    { bg: '#8B5CF6', text: '#FFFFFF' },
    { bg: '#F59E0B', text: '#FFFFFF' },
    { bg: '#EF4444', text: '#FFFFFF' },
  ];

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

        {/* 3x2 Grid Layout */}
        <Grid container spacing={2} sx={{ maxWidth: '900px', mx: 'auto' }}>
          {trustFeatures.slice(0, 6).map((feature, index) => {
            const isFocused = focusedIndex === index;
            const color = cardColors[index];
            const gridOrder = positions.indexOf(index);
            
            return (
              <Grid item xs={6} sm={4} key={index}>
                <motion.div
                  layout
                  animate={{
                    scale: isFocused ? 1.1 : 1,
                    zIndex: isFocused ? 10 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    layout: { duration: 0.5 },
                  }}
                  style={{ order: gridOrder }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      backgroundColor: color.bg,
                      border: `2px solid ${isFocused ? '#000000' : 'transparent'}`,
                      borderRadius: '16px',
                      p: 2,
                      height: '100%',
                      minHeight: '140px',
                      boxShadow: isFocused 
                        ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
                        : '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: isFocused ? 1.2 : 1,
                        rotate: isFocused ? [0, -5, 5, 0] : 0,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: color.text,
                          color: color.bg,
                          width: 48,
                          height: 48,
                          mx: 'auto',
                          mb: 1.5,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                    </motion.div>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5, 
                        color: color.text,
                        fontSize: '14px',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: color.text,
                        opacity: 0.9,
                        fontSize: '11px',
                      }}
                    >
                      {feature.desc}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default TrustSection;
