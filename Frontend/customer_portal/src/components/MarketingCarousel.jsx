import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MarketingCarousel = ({ campaigns = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isPlaying || campaigns.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, campaigns.length]);

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % campaigns.length);
  };

  const handleSlideClick = (index) => {
    setIsPlaying(false);
    setCurrentIndex(index);
  };

  if (!campaigns || campaigns.length === 0) {
    return (
      <Box
        sx={{
          height: { xs: 200, md: 300 },
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center', color: '#666666' }}>
          <PlayIcon sx={{ fontSize: 48, mb: 1 }} />
          <Box>No campaigns available</Box>
        </Box>
      </Box>
    );
  }

  const currentCampaign = campaigns[currentIndex];

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Card
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'relative',
          height: { xs: 200, md: 300 },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            {currentCampaign.mediaType === 'VIDEO' ? (
              <Box
                component="video"
                src={currentCampaign.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <CardMedia
                component="img"
                image={currentCampaign.mediaUrl || currentCampaign.imageUrl}
                alt={currentCampaign.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {campaigns.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                zIndex: 2,
              }}
              size="small"
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                zIndex: 2,
              }}
              size="small"
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </>
        )}

        {/* Indicators */}
        {campaigns.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 2,
            }}
          >
            {campaigns.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleSlideClick(index)}
                sx={{
                  width: currentIndex === index ? 24 : 8,
                  height: 8,
                  borderRadius: '4px',
                  backgroundColor:
                    currentIndex === index
                      ? '#FFFFFF'
                      : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default MarketingCarousel;
