import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  LinearProgress,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';

import { mockPurchasePackage } from '../services/mockApi';
import { useData } from '../context/DataContext';
import SelcomPaymentModal from './SelcomPaymentModal';

const InternetPackages = () => {
  const theme = useTheme();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSelcomPaymentModal, setShowSelcomPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Use preloaded packages data
  const { 
    packages, 
    isLoadingPackages, 
    packagesError,
    refetchPackages 
  } = useData();

  // Purchase package mutation
  const purchaseMutation = useMutation(mockPurchasePackage, {
    onSuccess: (data) => {
      setIsProcessing(false);
      toast.success('Package purchased successfully! You will receive a voucher code via SMS.');
      setShowPurchaseModal(false);
      setSelectedPackage(null);
      setPhoneNumber('');
      setPaymentMethod('');
    },
    onError: (error) => {
      setIsProcessing(false);
      toast.error(error.response?.data?.message || 'Failed to purchase package');
    },
  });

  const handleBuyNow = (pkg) => {
    setSelectedPackage(pkg);
    setShowSelcomPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPurchaseModal(false);
    setSelectedPackage(null);
    setPhoneNumber('');
    setPaymentMethod('');
  };

  const handlePurchase = () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!phoneNumber.startsWith('0')) {
      toast.error('Phone number must start with 0');
      return;
    }

    setIsProcessing(true);
    purchaseMutation.mutate({
      packageId: selectedPackage.id,
      phoneNumber,
      paymentMethod,
    });
  };



  const getSpeedGradient = (speed) => {
    if (speed >= 100) return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    if (speed >= 50) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (speed >= 25) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
  };

  const getPopularBadge = (isPopular) => {
    if (!isPopular) return null;
    return (
      <Chip
        label="Most Popular"
        color="primary"
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontWeight: 600,
        }}
      />
    );
  };

  if (isLoadingPackages) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading packages...
        </Typography>
      </Box>
    );
  }

  if (packagesError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load packages. Please try again.
        <Button 
          onClick={() => refetchPackages()} 
          sx={{ ml: 2 }}
          size="small"
        >
          Retry
        </Button>
      </Alert>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <Alert severity="info">
        No packages available at the moment. Please check back later.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Choose Your Internet Package
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
            mb: 3,
          }}
        >
          Select from our range of high-speed internet packages designed to meet your connectivity needs
        </Typography>
        <Box
          sx={{
            width: 60,
            height: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            mx: 'auto',
            mb: 3,
          }}
        />
      </Box>

      <Grid container spacing={2}>
        {packages.map((pkg, index) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
                              <Card
                  sx={{
                  height: 480, // Increased height to ensure button visibility
                    position: 'relative',
                    transition: 'all 0.3s ease-in-out',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                    border: pkg.isPopular 
                      ? `2px solid ${theme.palette.primary.main}` 
                    : `1px solid rgba(255, 255, 255, 0.1)`,
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
                    borderColor: theme.palette.primary.main,
                  },
                    display: 'flex',
                    flexDirection: 'column',
                  overflow: 'hidden',
                  }}
                >
                {getPopularBadge(pkg.isPopular)}
                
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                  {/* Package Name */}
                  <Typography variant="h5" fontWeight={700} sx={{ 
                    color: theme.palette.primary.main,
                    mb: 2,
                    background: pkg.isPopular 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {pkg.name}
                  </Typography>
                  
                  {/* Speed - Main Feature */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <SpeedIcon sx={{ 
                      background: getSpeedGradient(pkg.speed),
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                        fontSize: 24 
                    }} />
                    <Typography 
                        variant="h4" 
                        fontWeight={800}
                      sx={{
                        background: getSpeedGradient(pkg.speed),
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {pkg.speed} Mbps
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      High-Speed Internet
                    </Typography>
                  </Box>
                  
                  {/* Duration */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <TimeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="h6" fontWeight={600} color="text.primary">
                      {pkg.validity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                  </Box>
                  
                  {/* Price - Prominent Display */}
                  <Box sx={{ 
                    mb: 3,
                    p: 2,
                    background: 'rgba(76, 175, 80, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                  }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Price
                    </Typography>
                    <Typography 
                      variant="h4" 
                      fontWeight={800}
                      sx={{
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      TZS {pkg.price?.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0, mt: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleBuyNow(pkg)}
                    startIcon={<MoneyIcon />}
                    sx={{
                      py: 3,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      background: pkg.isPopular 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        background: pkg.isPopular 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                      '&:active': {
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    🛒 Buy Now - TZS {pkg.price?.toLocaleString()}
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Purchase Modal */}
      <Dialog
        open={showPurchaseModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              Purchase Package
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedPackage && (
            <Box sx={{ 
              mb: 4,
              p: 3,
              background: 'rgba(25, 118, 210, 0.05)',
              borderRadius: 3,
              border: '1px solid rgba(25, 118, 210, 0.1)',
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2,
              }}>
                {selectedPackage.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${selectedPackage.speed} Mbps`} 
                  color="primary" 
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={selectedPackage.validity} 
                  variant="outlined" 
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={`TZS ${selectedPackage.price?.toLocaleString()}`} 
                  color="success" 
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          )}
          
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0XXXXXXXXX"
            variant="outlined"
            size="large"
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            inputProps={{ 
              maxLength: 10,
              style: { fontSize: '1rem' }
            }}
          />
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ 
              color: theme.palette.text.secondary,
              '&.Mui-focused': {
                color: theme.palette.primary.main,
              },
            }}>
              Payment Method *
            </InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method *"
              displayEmpty
              variant="outlined"
              size="large"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiSelect-icon': {
                  color: theme.palette.primary.main,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  }
                }
              }}
            >
              <MenuItem value="" disabled sx={{ 
                fontStyle: 'italic',
                color: theme.palette.text.secondary,
              }}>
                Please select a payment method
              </MenuItem>
              <MenuItem value="mpesa" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                py: 1.5,
              }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #00C851 0%, #007E33 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  M
                </Box>
                M-Pesa
              </MenuItem>
              <MenuItem value="airtel" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                py: 1.5,
              }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #FF6B35 0%, #CC5500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  A
                </Box>
                Airtel Money
              </MenuItem>
              <MenuItem value="mixx" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                py: 1.5,
              }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  M
                </Box>
                Mixx
              </MenuItem>
              <MenuItem value="halopesa" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                py: 1.5,
              }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  H
                </Box>
                HaloPesa
              </MenuItem>
              <MenuItem value="tpesa" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                py: 1.5,
              }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  T
                </Box>
                T-Pesa (TTCL)
              </MenuItem>
            </Select>
          </FormControl>
          
          <Alert severity="info" sx={{ 
            mb: 3,
            borderRadius: 2,
            background: 'rgba(25, 118, 210, 0.1)',
            border: '1px solid rgba(25, 118, 210, 0.2)',
            '& .MuiAlert-icon': {
              color: theme.palette.primary.main,
            },
          }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Please enter your PIN to complete the payment transaction. 
            </Typography>
          </Alert>
          
          {isProcessing && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Processing payment...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseModal} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            variant="contained"
            disabled={isProcessing || !phoneNumber || !paymentMethod}
            sx={{ borderRadius: 2 }}
          >
            {isProcessing ? 'Processing...' : !paymentMethod ? 'Select Payment Method' : 'Purchase Package'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SELCOM Payment Modal */}
      <SelcomPaymentModal
        open={showSelcomPaymentModal}
        onClose={() => setShowSelcomPaymentModal(false)}
        selectedPackage={selectedPackage}
        onSuccess={(voucherCode) => {
          setShowSelcomPaymentModal(false);
          setSelectedPackage(null);
          toast.success(`Payment successful! Voucher code: ${voucherCode}`);
        }}
      />
    </Box>
  );
};