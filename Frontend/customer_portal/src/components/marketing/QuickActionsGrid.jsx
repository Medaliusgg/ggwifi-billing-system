import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Wifi as WifiIcon,
  CardGiftcard as GiftIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * QuickActionsGrid Component
 * 2x2 grid of quick action cards
 */
const QuickActionsGrid = ({
  onBuyPackages,
  onVoucherConnect,
  onRewards,
  onSupport,
}) => {
  const actions = [
    {
      id: 'buy',
      icon: <ShoppingCartIcon sx={{ fontSize: 32 }} />,
      title: 'Buy Packages',
      description: 'Choose your plan',
      color: '#3A8DFF',
      onClick: onBuyPackages,
    },
    {
      id: 'voucher',
      icon: <WifiIcon sx={{ fontSize: 32 }} />,
      title: 'Voucher Connect',
      description: 'Enter voucher code',
      color: '#10B981',
      onClick: onVoucherConnect,
    },
    {
      id: 'rewards',
      icon: <GiftIcon sx={{ fontSize: 32 }} />,
      title: 'Rewards',
      description: 'Redeem points',
      color: '#A855F7',
      onClick: onRewards,
    },
    {
      id: 'support',
      icon: <SupportIcon sx={{ fontSize: 32 }} />,
      title: 'Support',
      description: 'Get help',
      color: '#FF8A3D',
      onClick: onSupport,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {actions.map((action, index) => (
        <Grid item xs={6} key={action.id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              onClick={action.onClick}
              sx={{
                borderRadius: '16px',
                background: '#FFFFFF',
                border: '1px solid #FFE89C',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                  borderColor: action.color,
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Stack spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      background: `${action.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: action.color,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="#0A0A0A">
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="#666666">
                    {action.description}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickActionsGrid;

