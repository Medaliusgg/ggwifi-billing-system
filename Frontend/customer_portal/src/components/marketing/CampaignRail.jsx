import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeOff as VolumeOffIcon,
  VolumeUp as VolumeUpIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { customerPortalAPI } from '../../services/customerPortalApi';

/**
 * CampaignRail Component
 * Horizontal swipeable campaign rail with video/image support
 * Tracks impressions and handles autoplay
 */
const CampaignRail = ({ campaigns = [], onCampaignClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [impressions, setImpressions] = useState(new Set());
  const videoRefs = useRef({});
  const containerRef = useRef(null);
  const impressionTimerRef = useRef(null);

  // Auto-advance campaigns every 7 seconds
  useEffect(() => {
    if (campaigns.length <= 1) return;

    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentIndex((prev) => (prev + 1) % campaigns.length);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [campaigns.length, isPlaying]);

  // Track impression after 2 seconds of visibility
  useEffect(() => {
    const currentCampaign = campaigns[currentIndex];
    if (!currentCampaign) return;

    // Clear previous timer
    if (impressionTimerRef.current) {
      clearTimeout(impressionTimerRef.current);
    }

    // Check if already tracked
    if (impressions.has(currentCampaign.id)) return;

    // Track impression after 2 seconds
    impressionTimerRef.current = setTimeout(() => {
      trackImpression(currentCampaign.id);
      setImpressions((prev) => new Set([...prev, currentCampaign.id]));
    }, 2000);

    return () => {
      if (impressionTimerRef.current) {
        clearTimeout(impressionTimerRef.current);
      }
    };
  }, [currentIndex, campaigns, impressions]);

  // Handle video autoplay
  useEffect(() => {
    const currentCampaign = campaigns[currentIndex];
    if (!currentCampaign || currentCampaign.type !== 'video') return;

    const video = videoRefs.current[currentCampaign.id];
    if (!video) return;

    if (isPlaying) {
      video.play().catch((err) => {
        console.warn('Video autoplay failed:', err);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }

    video.muted = isMuted;
  }, [currentIndex, isPlaying, isMuted, campaigns]);

  const trackImpression = async (campaignId) => {
    try {
      await customerPortalAPI.trackCampaignImpression(campaignId);
    } catch (error) {
      console.error('Failed to track impression:', error);
    }
  };

  const handleCampaignClick = (campaign) => {
    if (onCampaignClick) {
      onCampaignClick(campaign);
    } else {
      // Default: open campaign details or navigate
      if (campaign.ctaUrl) {
        window.open(campaign.ctaUrl, '_blank');
      }
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % campaigns.length);
  };

  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  const currentCampaign = campaigns[currentIndex];

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: '18px',
        overflow: 'hidden',
        mb: 3,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Campaign Card */}
      <Card
        sx={{
          position: 'relative',
          borderRadius: '18px',
          overflow: 'hidden',
          cursor: 'pointer',
          background: '#FFFFFF',
        }}
        onClick={() => handleCampaignClick(currentCampaign)}
      >
        {currentCampaign.type === 'video' ? (
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
            <Box
              component="video"
              ref={(el) => {
                if (el) videoRefs.current[currentCampaign.id] = el;
              }}
              src={currentCampaign.mediaUrl}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Video Controls Overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                  sx={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#FFFFFF',
                    '&:hover': { background: 'rgba(0, 0, 0, 0.8)' },
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  sx={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#FFFFFF',
                    '&:hover': { background: 'rgba(0, 0, 0, 0.8)' },
                  }}
                >
                  {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
              </Stack>
            </Box>
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={currentCampaign.mediaUrl}
            alt={currentCampaign.title}
            sx={{
              width: '100%',
              height: { xs: 200, md: 300 },
              objectFit: 'cover',
            }}
          />
        )}

        {/* Content Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
            p: 3,
            color: '#FFFFFF',
          }}
        >
          <Stack spacing={1}>
            {currentCampaign.badge && (
              <Chip
                label={currentCampaign.badge}
                size="small"
                sx={{
                  backgroundColor: '#F2C94C',
                  color: '#0A0A0A',
                  fontWeight: 600,
                  width: 'fit-content',
                }}
              />
            )}
            <Typography variant="h5" fontWeight={700} sx={{ color: '#FFFFFF' }}>
              {currentCampaign.title}
            </Typography>
            {currentCampaign.description && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {currentCampaign.description}
              </Typography>
            )}
            {currentCampaign.ctaText && (
              <Box
                sx={{
                  mt: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#F2C94C',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {currentCampaign.ctaText}
                <NextIcon />
              </Box>
            )}
          </Stack>
        </Box>
      </Card>

      {/* Navigation Arrows */}
      {campaigns.length > 1 && (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#0A0A0A',
              '&:hover': { background: '#FFFFFF' },
              zIndex: 2,
            }}
          >
            <PrevIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#0A0A0A',
              '&:hover': { background: '#FFFFFF' },
              zIndex: 2,
            }}
          >
            <NextIcon />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {campaigns.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          {campaigns.map((_, index) => (
            <Box
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: index === currentIndex ? '#F2C94C' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CampaignRail;

