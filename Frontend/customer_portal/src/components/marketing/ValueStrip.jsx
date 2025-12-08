import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import {
  FlashOn as InstantIcon,
  Security as SecureIcon,
  LocationOn as CoverageIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * ValueStrip Component
 * 4 icons with gold accents showing key value propositions
 */
const ValueStrip = () => {
  const values = [
    {
      icon: <InstantIcon sx={{ fontSize: 32 }} />,
      label: 'Instant',
      description: 'Connect in seconds',
    },
    {
      icon: <SecureIcon sx={{ fontSize: 32 }} />,
      label: 'Secure Payments',
      description: 'Bank-grade security',
    },
    {
      icon: <CoverageIcon sx={{ fontSize: 32 }} />,
      label: 'Wide Coverage',
      description: 'Across the city',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 32 }} />,
      label: '24/7 Support',
      description: 'Always here to help',
    },
  ];

  return (
    <Box
      sx={{
        py: 4,
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #EDEDED',
        mb: 4,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={4}
        justifyContent="space-around"
        alignItems="center"
        sx={{ px: { xs: 2, md: 4 } }}
      >
        {values.map((value, index) => (
          <motion.div
            key={value.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  color: '#0A0A0A',
                  mb: 1,
                  '& svg': {
                    filter: 'drop-shadow(0 2px 4px rgba(242, 201, 76, 0.3))',
                  },
                }}
              >
                {value.icon}
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="#0A0A0A">
                {value.label}
              </Typography>
              <Typography variant="caption" color="#666666">
                {value.description}
              </Typography>
            </Stack>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default ValueStrip;

