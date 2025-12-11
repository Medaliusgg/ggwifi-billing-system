import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Star as StarIcon } from '@mui/icons-material';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    { 
      name: 'Ahmed M.', 
      comment: 'Fast and reliable! Best WiFi service in town.', 
      rating: 5,
      image: null,
    },
    { 
      name: 'Fatuma K.', 
      comment: 'Great customer service and excellent speeds.', 
      rating: 5,
      image: null,
    },
    { 
      name: 'John D.', 
      comment: 'Best WiFi in town. Highly recommended!', 
      rating: 5,
      image: null,
    },
    { 
      name: 'Sarah A.', 
      comment: 'Affordable packages with great coverage.', 
      rating: 5,
      image: null,
    },
  ];

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <Box sx={{ py: 6, backgroundColor: '#FFFFFF' }}>
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
          What Our Customers Say
        </Typography>

        <Box
          sx={{
            position: 'relative',
            height: { xs: '300px', md: '350px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            {testimonials.map((testimonial, index) => {
              if (index !== currentIndex) return null;
              
              const isCenter = true;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, x: 100 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isCenter ? 1.1 : 0.9,
                    x: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -100 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    maxWidth: '600px',
                  }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #FFCC00',
                      borderRadius: '20px',
                      p: 4,
                      boxShadow: '0 12px 36px rgba(255, 204, 0, 0.2)',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: '#FFCC00',
                        color: '#000000',
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        fontSize: '32px',
                        fontWeight: 700,
                      }}
                    >
                      {testimonial.name[0]}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
                      {testimonial.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: 20, color: '#FFCC00' }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ color: '#333333', fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>

        {/* Dot Indicators */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: 4,
          }}
        >
          {testimonials.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: '4px',
                backgroundColor: currentIndex === index ? '#FFCC00' : '#E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
