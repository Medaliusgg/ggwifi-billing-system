import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Star as StarIcon,
  LocalOffer as OfferIcon,
  LocalOffer as LocalOfferIcon,
  CheckCircle as CheckCircleIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Enhanced PackageCard Component
 * Professional package card with GG Points badges, better design
 * Follows GG WiFi brand guidelines: white, black, gold
 */
const EnhancedPackageCard = ({
  pkg,
  isSelected = false,
  onClick,
  onBuyClick,
  style = 'detailed', // 'detailed' or 'colorful'
}) => {
  const formatCurrency = (amount) => {
    if (!amount) return 'TZS 0';
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate GG Points (if not provided, estimate based on price)
  const ggPoints = pkg.ggPoints || pkg.loyaltyPointsAwarded || Math.floor((pkg.price || 0) / 200);
  
  // Scarcity indicator for offer packages
  const remainingCount = pkg.remainingCount;
  const isLowStock = pkg.isLowStock || (remainingCount !== undefined && remainingCount <= 10);

  // Color scheme based on package type
  const getPackageColor = () => {
    if (pkg.color) return pkg.color;
    const name = (pkg.name || '').toLowerCase();
    if (name.includes('daily') || name.includes('day')) return '#3A8DFF'; // Blue
    if (name.includes('weekly') || name.includes('week')) return '#10B981'; // Green
    if (name.includes('monthly') || name.includes('month')) return '#A855F7'; // Purple
    if (name.includes('semester') || name.includes('long')) return '#FF8A3D'; // Orange
    return '#3A8DFF'; // Default blue
  };

  const packageColor = getPackageColor();
  const isColorfulStyle = style === 'colorful';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={onClick}
        sx={{
          height: '100%',
          cursor: 'pointer',
          background: isColorfulStyle 
            ? `linear-gradient(135deg, ${packageColor}15 0%, ${packageColor}05 100%)`
            : '#FFFFFF',
          borderRadius: '18px',
          border: isSelected
            ? `2px solid ${packageColor}`
            : `1px solid ${isColorfulStyle ? packageColor : '#FFE89C'}`,
          boxShadow: isSelected
            ? `0 8px 24px ${packageColor}30`
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${packageColor}30`,
            borderColor: packageColor,
          },
        }}
      >
        {/* Popular Badge */}
        {pkg.popular && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
            }}
          >
            <Chip
              icon={<StarIcon />}
              label="Most Popular"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
                color: '#0A0A0A',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 28,
                '& .MuiChip-icon': {
                  color: '#0A0A0A',
                },
              }}
            />
          </Box>
        )}

        {/* GG Points Badge */}
        {ggPoints > 0 && !isLowStock && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
            }}
          >
            <Chip
              icon={<FavoriteIcon sx={{ fontSize: 16 }} />}
              label={`${ggPoints} GG Points`}
              size="small"
              sx={{
                background: '#FFFFFF',
                color: '#F2C94C',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 28,
                border: '2px solid #F2C94C',
                '& .MuiChip-icon': {
                  color: '#F2C94C',
                },
              }}
            />
          </Box>
        )}

        {/* Scarcity Badge (for offer packages) */}
        {isLowStock && remainingCount !== undefined && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Chip
                icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                label={`Only ${remainingCount} left!`}
                size="small"
                sx={{
                  background: '#E74C3C',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  height: 28,
                  boxShadow: '0 4px 12px rgba(231, 76, 60, 0.4)',
                  '& .MuiChip-icon': {
                    color: '#FFFFFF',
                  },
                }}
              />
            </motion.div>
          </Box>
        )}

        {/* Discount Badge */}
        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
          <Box
            sx={{
              position: 'absolute',
              top: pkg.popular ? 48 : 12,
              right: 12,
              zIndex: 2,
            }}
          >
            <Chip
              icon={<OfferIcon sx={{ fontSize: 16 }} />}
              label={`${Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF`}
              size="small"
              sx={{
                background: '#10B981',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 28,
                '& .MuiChip-icon': {
                  color: '#FFFFFF',
                },
              }}
            />
          </Box>
        )}

        {/* Selected Indicator */}
        {isSelected && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: pkg.ggPoints ? 100 : 12,
              zIndex: 2,
            }}
          >
            <Avatar
              sx={{
                background: packageColor,
                width: 32,
                height: 32,
                border: '2px solid #FFFFFF',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
            </Avatar>
          </Box>
        )}

        <CardContent sx={{ flex: 1, p: 3, pt: pkg.popular || ggPoints > 0 ? 5 : 3, textAlign: 'center' }}>
          {/* Package Icon */}
          {!isColorfulStyle && pkg.icon && (
            <Avatar
              sx={{
                background: `${packageColor}15`,
                width: 72,
                height: 72,
                mx: 'auto',
                mb: 2,
                border: `2px solid ${packageColor}40`,
                '& .MuiSvgIcon-root': {
                  fontSize: 36,
                  color: packageColor,
                },
              }}
            >
              {pkg.icon}
            </Avatar>
          )}

          {/* Package Name */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#0A0A0A',
              mb: 1,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            {pkg.name}
          </Typography>

          {/* Duration */}
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              mb: 2,
            }}
          >
            {pkg.duration || `${pkg.durationDays || 0} Days`}
          </Typography>

          {/* Price */}
          <Box sx={{ mb: 2 }}>
            {pkg.originalPrice && pkg.originalPrice > pkg.price ? (
              <Stack spacing={0.5} alignItems="center">
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: 'line-through',
                    color: '#999999',
                    fontSize: '0.875rem',
                  }}
                >
                  {formatCurrency(pkg.originalPrice)}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: packageColor,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  {formatCurrency(pkg.price)}
                </Typography>
              </Stack>
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: packageColor,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                {formatCurrency(pkg.price)}
              </Typography>
            )}
          </Box>

          {/* Features List */}
          {pkg.features && pkg.features.length > 0 && (
            <Stack spacing={1} sx={{ mb: 2, textAlign: 'left' }}>
              {pkg.features.slice(0, 3).map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: packageColor }} />
                  <Typography variant="body2" color="#666666">
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}

          {/* Data Limit & Speed */}
          {(pkg.dataLimit || pkg.speed) && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              {pkg.dataLimit && (
                <Chip
                  label={pkg.dataLimit}
                  size="small"
                  sx={{
                    background: `${packageColor}15`,
                    color: packageColor,
                    fontWeight: 600,
                  }}
                />
              )}
              {pkg.speed && (
                <Chip
                  label={pkg.speed}
                  size="small"
                  sx={{
                    background: `${packageColor}15`,
                    color: packageColor,
                    fontWeight: 600,
                  }}
                />
              )}
            </Stack>
          )}
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              if (onBuyClick) onBuyClick(pkg);
            }}
            sx={{
              background: isSelected
                ? packageColor
                : 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
              color: '#0A0A0A',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
              '&:hover': {
                background: isSelected
                  ? packageColor
                  : 'linear-gradient(135deg, #E0B335 0%, #D4A32A 100%)',
                boxShadow: '0 6px 16px rgba(242, 201, 76, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {isSelected ? 'Selected' : 'Buy Now'}
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default EnhancedPackageCard;

