import React from 'react';
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Stat Card Component
 * Consistent stat card styling using customer portal theme
 */
const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue,
  color = 'primary',
  delay = 0 
}) => {
  const colorMap = {
    primary: { bg: '#F2C94C', text: '#0A0A0A', light: 'rgba(242, 201, 76, 0.1)' },
    success: { bg: '#10B981', text: '#FFFFFF', light: '#ECFDF5' },
    info: { bg: '#3A8DFF', text: '#FFFFFF', light: '#EAF4FF' },
    warning: { bg: '#FF8A3D', text: '#FFFFFF', light: '#FFF3E6' },
    error: { bg: '#F44336', text: '#FFFFFF', light: '#FFEBEE' },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          border: `1px solid #EEEEEE`,
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Top accent bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: colors.bg,
          }}
        />
        
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#666666',
                  fontWeight: 500,
                  fontSize: '13px',
                  mb: 1,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#0A0A0A',
                  fontSize: { xs: '24px', md: '28px' },
                  mb: 0.5,
                }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666666',
                    fontSize: '12px',
                  }}
                >
                  {subtitle}
                </Typography>
              )}
              {trend && trendValue && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: trend === 'up' ? '#10B981' : '#F44336',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    {trend === 'up' ? '↑' : '↓'} {Math.abs(trendValue)}%
                  </Typography>
                </Box>
              )}
            </Box>
            {icon && (
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: colors.light,
                  color: colors.bg,
                  border: `2px solid ${colors.bg}`,
                }}
              >
                {icon}
              </Avatar>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
