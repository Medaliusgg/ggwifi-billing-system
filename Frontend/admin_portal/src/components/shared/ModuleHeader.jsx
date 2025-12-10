import React from 'react';
import { Box, Typography, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Module Header Component
 * Consistent header styling across all admin portal modules
 * Uses customer portal theme colors
 */
const ModuleHeader = ({ 
  title, 
  subtitle, 
  icon, 
  badge,
  actions 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
          pb: 2,
          borderBottom: '1px solid #EEEEEE',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon && (
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#F2C94C', // Gold
                color: '#0A0A0A', // Black
                boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
              }}
            >
              {icon}
            </Avatar>
          )}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#0A0A0A', // Black
                  fontSize: { xs: '24px', md: '28px' },
                }}
              >
                {title}
              </Typography>
              {badge && (
                <Chip
                  label={badge}
                  size="small"
                  sx={{
                    bgcolor: '#F2C94C', // Gold
                    color: '#0A0A0A', // Black
                    fontWeight: 600,
                    height: '24px',
                  }}
                />
              )}
            </Box>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: '#666666', // Neutral-600
                  fontSize: '14px',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {actions}
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default ModuleHeader;
