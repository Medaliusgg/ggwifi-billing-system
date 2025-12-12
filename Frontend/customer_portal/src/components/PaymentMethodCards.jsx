import React from 'react';
import { Box, Card, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import {
  AccountBalance as MpesaIcon,
  PhoneAndroid as AirtelIcon,
  Payment as YASIcon,
  CreditCard as HalopesaIcon,
} from '@mui/icons-material';

const PaymentMethodCards = ({ selectedMethod, onSelect }) => {
  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      color: '#00A859', // M-Pesa green
      icon: <MpesaIcon />,
      description: 'Mobile Money',
    },
    {
      id: 'yas',
      name: 'YAS',
      color: '#0066CC', // YAS blue
      icon: <YASIcon />,
      description: 'Mobile Money',
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      color: '#E60000', // Airtel red
      icon: <AirtelIcon />,
      description: 'Mobile Money',
    },
    {
      id: 'halopesa',
      name: 'Halopesa',
      color: '#FF6B00', // Halopesa orange
      icon: <HalopesaIcon />,
      description: 'Mobile Money',
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>
        Select Payment Method
      </Typography>
      <Grid container spacing={2}>
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          
          return (
            <Grid item xs={6} sm={3} key={method.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(method.id)}
                style={{ cursor: 'pointer' }}
              >
                <Card
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    border: `2px solid ${isSelected ? method.color : '#E5E7EB'}`,
                    borderRadius: '12px',
                    backgroundColor: isSelected ? `${method.color}10` : '#FFFFFF',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      borderColor: method.color,
                      boxShadow: `0 4px 12px ${method.color}30`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: method.color,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 1,
                    }}
                  >
                    {method.icon}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', mb: 0.5 }}>
                    {method.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666666', fontSize: '10px' }}>
                    {method.description}
                  </Typography>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: method.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#FFFFFF', fontSize: '12px' }}>
                        ✓
                      </Typography>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PaymentMethodCards;
