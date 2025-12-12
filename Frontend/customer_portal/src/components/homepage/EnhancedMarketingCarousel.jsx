import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const EnhancedMarketingCarousel = ({ campaigns = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (campaigns.length <= 1) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [campaigns.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
    }
  };

  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '200px', md: '400px' },
        borderRadius: '16px',
        overflow: 'hidden',
        mb: 4,
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          {campaigns[currentIndex]?.videoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            >
              <source src={campaigns[currentIndex].videoUrl} type="video/mp4" />
            </video>
          ) : (
            <Box
              component="img"
              src={campaigns[currentIndex]?.imageUrl || campaigns[currentIndex]?.bannerUrl}
              alt={campaigns[currentIndex]?.title || 'Campaign'}
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
            onClick={() => paginate(-1)}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() => paginate(1)}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      {/* Dot Indicators with Focus Ring */}
      {campaigns.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2,
            alignItems: 'center',
          }}
        >
          {campaigns.map((_, index) => {
            const isActive = currentIndex === index;
            return (
              <motion.div
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{ cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    width: isActive ? 24 : 8,
                    height: 8,
                    borderRadius: '4px',
                    backgroundColor: isActive ? '#FFCC00' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                >
                  {isActive && (
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(255, 204, 0, 0.7)',
                          '0 0 0 8px rgba(255, 204, 0, 0)',
                          '0 0 0 0 rgba(255, 204, 0, 0.7)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      style={{
                        position: 'absolute',
                        top: -4,
                        left: -4,
                        right: -4,
                        bottom: -4,
                        borderRadius: '8px',
                        border: '2px solid #FFCC00',
                      }}
                    />
                  )}
                </Box>
              </motion.div>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default EnhancedMarketingCarousel;
