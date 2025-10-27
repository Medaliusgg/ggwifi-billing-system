import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Card,
  CardContent,
  Grid,
  useTheme,
  Stack,
  Chip,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Badge,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Public as PublicIcon,
  FlashOn as FlashOnIcon,
  TrendingUp as TrendingUpIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import paymentService from '../services/paymentService';
import apiService from '../services/apiService';

const BuyPackage = ({ onBack, currentLanguage }) => {
  const theme = useTheme();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phoneNumber: '',
    location: '',
  });
  const [paymentStep, setPaymentStep] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [orderId, setOrderId] = useState('');
  const [pollingStop, setPollingStop] = useState(null);
  const [isUserActive, setIsUserActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [currentPollingStop, setCurrentPollingStop] = useState(null); // pending, processing, success, failed

  // Cleanup polling on unmount and when dialog closes
  useEffect(() => {
    return () => {
      if (currentPollingStop) {
        console.log('🛑 Cleaning up payment polling on unmount');
        currentPollingStop();
      }
    };
  }, [currentPollingStop]);

  // Stop polling when dialog is closed
  useEffect(() => {
    if (!showCustomerForm && currentPollingStop) {
      console.log('🛑 Stopping payment polling - dialog closed');
      currentPollingStop();
      setCurrentPollingStop(null);
    }
  }, [showCustomerForm, currentPollingStop]);

  // Fetch packages from backend API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoadingPackages(true);
        const response = await apiService.getPackages();
        
        if (response.status === 'success' && response.packages) {
          // Transform backend packages to frontend format
          const transformedPackages = response.packages.map((pkg, index) => ({
            id: pkg.id,
            name: pkg.name,
            duration: pkg.duration || `${pkg.durationDays} Days`,
            price: pkg.price,
            description: pkg.description || 'High-speed internet access',
            popular: pkg.isPopular || false,
            featured: pkg.isFeatured || false,
            dataLimit: pkg.dataLimit || 'Unlimited',
            speed: pkg.speed || 'High Speed',
            features: [
              pkg.speed || 'High Speed',
              pkg.dataLimit || 'Unlimited Data',
              'Secure Connection',
              'Easy Setup'
            ],
            icon: index === 0 ? <FlashOnIcon /> : 
                  index === 1 ? <StarIcon /> : 
                  index === 2 ? <PublicIcon /> : <TrendingUpIcon />,
            color: index === 0 ? '#FFC72C' : 
                   index === 1 ? '#0072CE' : 
                   index === 2 ? '#1ABC9C' : '#FFC72C',
          }));
          
          setPackages(transformedPackages);
          toast.success('Packages loaded successfully!');
        } else {
          toast.error('Failed to load packages from server');
          // Fallback to hardcoded packages
          setPackages([
            { 
              id: 1, 
              name: 'Short Plan', 
              duration: '12 Hours', 
              price: 1000, 
              description: 'Perfect for quick browsing and short-term needs.', 
              popular: false,
              features: ['High Speed', 'Secure Connection', 'Easy Setup'],
              icon: <FlashOnIcon />,
              color: '#FFC72C',
            },
            { 
              id: 2, 
              name: 'Daily Plan', 
              duration: '24 Hours', 
              price: 2000, 
              description: 'Ideal for daily usage and extended browsing.', 
              popular: true,
              features: ['Unlimited Data', '24/7 Support', 'Best Value'],
              icon: <StarIcon />,
              color: '#0072CE',
            },
            { 
              id: 3, 
              name: 'Weekly Plan', 
              duration: '7 Days', 
              price: 6000, 
              description: 'Great value for weekly usage and multiple users.', 
              popular: false,
              features: ['Family Friendly', 'Multi-Device', 'Premium Support'],
              icon: <PublicIcon />,
              color: '#1ABC9C',
            },
            { 
              id: 4, 
              name: 'Monthly Plan', 
              duration: '30 Days', 
              price: 20000, 
              description: 'Best value for long-term usage and heavy internet users.', 
              popular: true,
              features: ['Maximum Speed', 'Priority Support', 'Best Deal'],
              icon: <TrendingUpIcon />,
              color: '#FFC72C',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast.error('Failed to load packages. Using default packages.');
        // Fallback to hardcoded packages
        setPackages([
          { 
            id: 1, 
            name: 'Short Plan', 
            duration: '12 Hours', 
            price: 1000, 
            description: 'Perfect for quick browsing and short-term needs.', 
            popular: false,
            features: ['High Speed', 'Secure Connection', 'Easy Setup'],
            icon: <FlashOnIcon />,
            color: '#FFC72C',
          },
          { 
            id: 2, 
            name: 'Daily Plan', 
            duration: '24 Hours', 
            price: 2000, 
            description: 'Ideal for daily usage and extended browsing.', 
            popular: true,
            features: ['Unlimited Data', '24/7 Support', 'Best Value'],
            icon: <StarIcon />,
            color: '#0072CE',
          },
          { 
            id: 3, 
            name: 'Weekly Plan', 
            duration: '7 Days', 
            price: 6000, 
            description: 'Great value for weekly usage and multiple users.', 
            popular: false,
            features: ['Family Friendly', 'Multi-Device', 'Premium Support'],
            icon: <PublicIcon />,
            color: '#1ABC9C',
          },
          { 
            id: 4, 
            name: 'Monthly Plan', 
            duration: '30 Days', 
            price: 20000, 
            description: 'Best value for long-term usage and heavy internet users.', 
            popular: true,
            features: ['Maximum Speed', 'Priority Support', 'Best Deal'],
            icon: <TrendingUpIcon />,
            color: '#FFC72C',
          },
        ]);
      } finally {
        setIsLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowCustomerForm(true);
    setPaymentStep(1);
    toast.success(`${pkg.name} selected! Please fill in your details.`);
  };

  const handleCustomerDetailsChange = (field, value) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProceedToPayment = () => {
    if (!customerDetails.fullName || !customerDetails.phoneNumber || !customerDetails.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    setPaymentStep(2);
    initiateZenoPayPayment();
  };

  const initiateZenoPayPayment = async () => {
    setIsLoading(true);
    setPaymentStatus('processing');
    toast.loading('Initializing ZenoPay payment...');

    try {
      // Validate payment data
      const validation = paymentService.validatePaymentData({
        customerName: customerDetails.fullName,
        phoneNumber: customerDetails.phoneNumber,
        location: customerDetails.location,
        packageId: selectedPackage.id,
        amount: selectedPackage.price,
      });

      if (!validation.isValid) {
        toast.error(validation.errors.join(', '));
        setPaymentStatus('failed');
        setIsLoading(false);
        return;
      }

      // Prepare payment data
      const paymentData = {
        customerName: customerDetails.fullName,
        phoneNumber: customerDetails.phoneNumber,
        location: customerDetails.location,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        amount: selectedPackage.price,
        currency: 'TZS',
        paymentMethod: 'ZENOPAY',
      };

      // Initiate payment using payment service
      const result = await paymentService.initiateZenoPayPayment(paymentData);

      console.log('🔍 Payment Result:', result);
      console.log('🔍 Result Status:', result.status);
      console.log('🔍 Result Type:', typeof result.status);

      if (result.status === 'success') {
        toast.success('Payment initiated successfully! Check your phone for payment instructions.');
        
        // Stop any existing polling before starting new one
        if (currentPollingStop) {
          console.log('🛑 Stopping existing polling before starting new one');
          currentPollingStop();
        }
        
        // Set initial status
        setPaymentStatus('processing');
        setPaymentMessage('Payment initiated. Please complete the payment on your mobile device.');
        setOrderId(result.order_id);
        setPaymentStep(2);
        
        // Start enhanced payment status polling
        const stopPolling = await paymentService.pollPaymentStatus(
          result.order_id,
          (statusData) => {
            console.log('📊 Payment status update received:', statusData);
            
            setPaymentStatus(statusData.status.toLowerCase());
            setPaymentMessage(statusData.message);
            
            // Handle different payment statuses
            switch (statusData.status) {
              case 'PENDING':
                setPaymentStatus('processing');
                setPaymentMessage('Payment is pending. Please complete the payment on your mobile device.');
                break;
              case 'VERIFICATION':
              case 'PROCESSING':
                setPaymentStatus('processing');
                setPaymentMessage('Payment is being processed. Please wait...');
                break;
              case 'COMPLETED':
              case 'SUCCESS':
                setPaymentStatus('success');
                setPaymentMessage('Payment completed successfully! Your voucher code has been generated.');
                if (statusData.voucherCode) {
                  setVoucherCode(statusData.voucherCode);
                  toast.success(`Payment successful! Voucher code: ${statusData.voucherCode}`);
                }
                // Stop polling on success
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - payment successful');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              case 'FAILED':
                setPaymentStatus('failed');
                setPaymentMessage('Payment failed. Please check your mobile money balance and try again.');
                toast.error('Payment failed. Please try again.');
                // Stop polling on failure
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - payment failed');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              case 'INSUFFICIENT_BALANCE':
                setPaymentStatus('failed');
                setPaymentMessage('Insufficient balance in your mobile money account. Please top up and try again.');
                toast.error('Insufficient balance! Please top up your mobile money account.');
                // Stop polling on insufficient balance
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - insufficient balance');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              case 'INVALID_PIN':
                setPaymentStatus('failed');
                setPaymentMessage('Invalid PIN entered. Please try again with the correct PIN.');
                toast.error('Invalid PIN! Please try again with the correct PIN.');
                // Stop polling on invalid PIN
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - invalid PIN');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              case 'USER_CANCELLED':
                setPaymentStatus('failed');
                setPaymentMessage('Payment was cancelled by user. Please try again.');
                toast.error('Payment cancelled. Please try again.');
                // Stop polling on user cancellation
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - user cancelled');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              case 'CANCELLED':
                setPaymentStatus('failed');
                setPaymentMessage('Payment was cancelled. Please try again.');
                toast.error('Payment cancelled. Please try again.');
                // Stop polling on cancellation
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - payment cancelled');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              case 'EXPIRED':
                setPaymentStatus('failed');
                setPaymentMessage('Payment has expired. Please initiate a new payment.');
                toast.error('Payment expired. Please try again.');
                // Stop polling on expiry
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - payment expired');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              case 'TIMEOUT':
                setPaymentStatus('failed');
                setPaymentMessage('Payment timed out. Please try again.');
                toast.error('Payment timed out. Please try again.');
                // Stop polling on timeout
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - payment timeout');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              case 'NETWORK_ERROR':
                setPaymentStatus('failed');
                setPaymentMessage('Network error occurred. Please try again.');
                toast.error('Network error. Please try again.');
                // Stop polling on network error
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - network error');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              case 'ERROR':
                setPaymentStatus(' masteringTime');
                setPaymentMessage(statusData.message);
                toast.error(statusData.message);
                // Stop polling on error
                if (currentPollingStop) {
                  console.log('🛑 Stopping polling - payment error');
                  currentPollingStop();
                  setCurrentPollingStop(null);
                }
                break;
              default:
                setPaymentStatus('processing');
                setPaymentMessage(`Payment status: ${statusData.status}`);
            }
          },
          60, // Max attempts (3 minutes)
          3000 // Interval (3 seconds)
        );
        
        setCurrentPollingStop(stopPolling);
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentStatus('failed');
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulPayment = async (paymentData) => {
    try {
      console.log('Payment successful, connecting user:', paymentData);
      
      // Use payment service to handle successful payment
      const result = await paymentService.handleSuccessfulPayment(paymentData);
      
      if (result.success) {
        toast.success(`You are now connected to GG Wi-Fi! Your voucher code is ${result.voucherCode}`);
        
        // Show success message with voucher code
        setTimeout(() => {
          toast.success('SMS sent with your voucher code. Enjoy your internet access!');
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to activate connection');
      }
    } catch (error) {
      console.error('Error handling successful payment:', error);
      toast.error('Payment successful, but there was an issue activating your connection. Please contact support.');
    }
  };

  const handleBackToPackages = () => {
    // Stop any active polling
    if (currentPollingStop) {
      console.log('🛑 Stopping payment polling - user navigated back');
      currentPollingStop();
      setCurrentPollingStop(null);
    }
    
    setShowCustomerForm(false);
    setSelectedPackage(null);
    setPaymentStep(0);
    setPaymentStatus('pending');
    setPaymentMessage('');
    setVoucherCode('');
    setOrderId('');
    setCustomerDetails({ fullName: '', phoneNumber: '', location: '' });
  };

  const handlePurchase = () => {
    if (!selectedPackage) {
      toast.error('Please select a package first');
      return;
    }
    
    if (!customerDetails.fullName || !customerDetails.phoneNumber || !customerDetails.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Proceed to payment
    handleProceedToPayment();
  };

  // Tanzania locations
  const tanzaniaLocations = [
    'Dar es Salaam',
    'Arusha',
    'Mwanza',
    'Dodoma',
    'Mbeya',
    'Morogoro',
    'Tanga',
    'Kahama',
    'Tabora',
    'Singida',
    'Iringa',
    'Mtwara',
    'Moshi',
    'Shinyanga',
    'Musoma',
    'Bukoba',
    'Kigoma',
    'Mpanda',
    'Lindi',
    'Songea',
    'Same',
    'Korogwe',
    'Bagamoyo',
    'Kilwa',
    'Mafia',
    'Pemba',
    'Zanzibar',
    'Other'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%),
          radial-gradient(circle at 20% 20%, rgba(255, 199, 44, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0, 114, 206, 0.08) 0%, transparent 50%)
        `,
        py: 4,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <IconButton
              onClick={onBack}
              sx={{
                mb: { xs: 2, md: 3 },
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 199, 44, 0.1)',
                  transform: 'translateX(-4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 12px 40px rgba(0, 114, 206, 0.4)',
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
                </Avatar>
              </motion.div>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  mb: 2,
                  background: 'linear-gradient(135deg, #0072CE 0%, #FFC72C 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Choose Your Package
              </Typography>

              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, maxWidth: 600, mx: 'auto' }}>
                Select the perfect internet package for your needs. All packages include high-speed, 
                secure, and reliable internet access.
              </Typography>

              {/* Features */}
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 6 }}>
                {[
                  { icon: <SpeedIcon />, text: 'Lightning Fast', color: '#FFC72C' },
                  { icon: <SecurityIcon />, text: 'Secure & Reliable', color: '#1ABC9C' },
                  { icon: <PublicIcon />, text: 'Wide Coverage', color: '#0072CE' },
                ].map((feature, index) => (
                  <Chip
                    key={index}
                    icon={feature.icon}
                    label={feature.text}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      color: feature.color,
                      border: `1px solid ${feature.color}40`,
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: feature.color,
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </motion.div>

          {/* Packages Grid */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
              {packages.map((pkg) => (
                <Grid item xs={12} sm={6} lg={3} key={pkg.id}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card
                      onClick={() => handleSelectPackage(pkg)}
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: { xs: 3, md: 4 },
                        border: `3px solid ${
                          selectedPackage?.id === pkg.id 
                            ? pkg.color 
                            : 'rgba(255, 255, 255, 0.2)'
                        }`,
                        boxShadow: selectedPackage?.id === pkg.id 
                          ? `0 20px 60px ${pkg.color}40`
                          : '0 8px 32px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease-in-out',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: { xs: 'translateY(-4px)', md: 'translateY(-8px)' },
                          boxShadow: `0 24px 80px ${pkg.color}30`,
                        },
                      }}
                    >
                      {/* Popular Badge */}
                      {pkg.popular && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 1,
                          }}
                        >
                          <Chip
                            icon={<StarIcon />}
                            label="Most Popular"
                            sx={{
                              background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
                              color: '#000000',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              '& .MuiChip-icon': {
                                color: '#000000',
                              },
                            }}
                          />
                        </Box>
                      )}

                      {/* Selected Indicator */}
                      {selectedPackage?.id === pkg.id && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            zIndex: 1,
                          }}
                        >
                          <Avatar
                            sx={{
                              background: pkg.color,
                              width: 32,
                              height: 32,
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                          </Avatar>
                        </Box>
                      )}

                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        {/* Package Icon */}
                        <Avatar
                          sx={{
                            background: pkg.color,
                            width: 60,
                            height: 60,
                            mx: 'auto',
                            mb: 3,
                            boxShadow: `0 8px 24px ${pkg.color}40`,
                          }}
                        >
                          {pkg.icon}
                        </Avatar>

                        {/* Package Name */}
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: 'text.primary',
                            mb: 1,
                          }}
                        >
                          {pkg.name}
                        </Typography>

                        {/* Duration */}
                        <Typography
                          variant="body1"
                          sx={{
                            color: pkg.color,
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {pkg.duration}
                        </Typography>

                        {/* Price */}
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 900,
                            background: `linear-gradient(135deg, ${pkg.color} 0%, ${pkg.color}CC 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                          }}
                        >
                          TZS {pkg.price.toLocaleString()}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            mb: 3,
                            minHeight: 40,
                            lineHeight: 1.5,
                          }}
                        >
                          {pkg.description}
                        </Typography>

                        {/* Features */}
                        <Stack spacing={1} sx={{ mb: 3 }}>
                          {pkg.features.map((feature, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                justifyContent: 'center',
                              }}
                            >
                              <CheckCircleIcon
                                sx={{
                                  fontSize: 16,
                                  color: pkg.color,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.primary',
                                  fontWeight: 500,
                                }}
                              >
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>

                        {/* Select Button */}
                        <Button
                          variant={selectedPackage?.id === pkg.id ? "contained" : "outlined"}
                          fullWidth
                          sx={{
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            ...(selectedPackage?.id === pkg.id ? {
                              background: pkg.color,
                              color: '#FFFFFF',
                              '&:hover': {
                                background: pkg.color,
                                opacity: 0.9,
                              },
                            } : {
                              borderColor: pkg.color,
                              color: pkg.color,
                              '&:hover': {
                                background: `${pkg.color}10`,
                                borderColor: pkg.color,
                              },
                            }),
                          }}
                        >
                          {selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Purchase Section */}
          {selectedPackage && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: `2px solid ${selectedPackage.color}40`,
                  boxShadow: `0 16px 48px ${selectedPackage.color}20`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 2,
                      }}
                    >
                      Ready to Purchase
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      You've selected the {selectedPackage.name} package
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar
                          sx={{
                            background: selectedPackage.color,
                            width: 60,
                            height: 60,
                          }}
                        >
                          {selectedPackage.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {selectedPackage.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {selectedPackage.duration} • {selectedPackage.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            color: selectedPackage.color,
                            mb: 1,
                          }}
                        >
                          TZS {selectedPackage.price.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          One-time payment
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => {
                        setShowCustomerForm(true);
                        setPaymentStep(1);
                      }}
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
                      sx={{
                        borderRadius: 4,
                        px: 6,
                        py: 2.5,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 12px 40px rgba(0, 114, 206, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0056A3 0%, #004080 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 16px 50px rgba(0, 114, 206, 0.5)',
                        },
                        transition: 'all 0.3s ease-in-out',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      {isLoading ? 'Processing...' : 'Continue with Purchase'}
                    </Button>
                  </Box>

                  {/* Payment Methods */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, textAlign: 'center' }}>
                      Payment Methods
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      {['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Halopesa'].map((method) => (
                        <Chip
                          key={method}
                          label={method}
                          size="small"
                          sx={{
                            background: 'rgba(0, 114, 206, 0.1)',
                            color: '#0072CE',
                            border: '1px solid rgba(0, 114, 206, 0.2)',
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Customer Details Form Dialog */}
          <Dialog
            open={showCustomerForm}
            onClose={handleBackToPackages}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <DialogTitle sx={{ textAlign: 'center', pb: 2, fontWeight: 700, color: 'text.primary' }}>
              Complete Your Purchase
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontWeight: 400 }}>
                Fill in your details to proceed with payment
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ px: 4, py: 2 }}>
              {/* Package Summary */}
              {selectedPackage && (
                <Card sx={{ mb: 4, background: 'rgba(255, 199, 44, 0.1)', border: '1px solid rgba(255, 199, 44, 0.2)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ background: selectedPackage.color }}>
                        {selectedPackage.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {selectedPackage.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {selectedPackage.duration}
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: selectedPackage.color }}>
                        TZS {selectedPackage.price.toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Payment Steps */}
              <Stepper activeStep={paymentStep} sx={{ mb: 4 }}>
                <Step>
                  <StepLabel>Package Selected</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Customer Details</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Payment</StepLabel>
                </Step>
              </Stepper>

              {/* Customer Details Form */}
              {paymentStep === 1 && (
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={customerDetails.fullName}
                    onChange={(e) => handleCustomerDetailsChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    value={customerDetails.phoneNumber}
                    onChange={(e) => handleCustomerDetailsChange('phoneNumber', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="+255 XXX XXX XXX"
                    required
                    helperText="Enter your phone number for payment and SMS notifications"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <FormControl fullWidth required>
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={customerDetails.location}
                      onChange={(e) => handleCustomerDetailsChange('location', e.target.value)}
                      label="Location"
                      sx={{
                        borderRadius: 3,
                      }}
                    >
                      {tanzaniaLocations.map((location) => (
                        <MenuItem key={location} value={location}>
                          {location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Payment Method Info */}
                  <Alert severity="info" sx={{ borderRadius: 3 }}>
                    <Typography variant="body2">
                      <strong>Payment Method:</strong> ZenoPay Mobile Money
                      <br />
                      <strong>Supported:</strong> M-Pesa, Tigo Pesa, Airtel Money, Halopesa
                    </Typography>
                  </Alert>
                </Stack>
              )}

              {/* Payment Processing */}
              {paymentStep === 2 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  {paymentStatus === 'processing' && (
                    <>
                      <CircularProgress size={60} sx={{ color: '#0072CE', mb: 3 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Processing Payment...
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {paymentMessage || 'Please check your phone for payment instructions.'}
                      </Typography>
                      {orderId && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Order ID: {orderId}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                        Do not close this window until payment is complete.
                      </Typography>
                      {currentPollingStop && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            console.log('🛑 Manual stop polling requested by user');
                            currentPollingStop();
                            setCurrentPollingStop(null);
                            setPaymentStatus('failed');
                            setPaymentMessage('Payment monitoring stopped by user. Please check your payment manually.');
                          }}
                          sx={{ mt: 2 }}
                        >
                          Stop Monitoring
                        </Button>
                      )}
                    </>
                  )}

                  {paymentStatus === 'success' && (
                    <>
                      <CheckCircleIcon sx={{ fontSize: 60, color: '#1ABC9C', mb: 3 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1ABC9C' }}>
                        Payment Successful!
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {paymentMessage || 'Payment completed successfully! Your voucher code has been generated.'}
                      </Typography>
                      {voucherCode && (
                        <Box sx={{ 
                          background: 'rgba(26, 188, 156, 0.1)', 
                          border: '2px solid #1ABC9C', 
                          borderRadius: 2, 
                          p: 2, 
                          mb: 2 
                        }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1ABC9C', mb: 1 }}>
                            Your Voucher Code:
                          </Typography>
                          <Typography variant="h4" sx={{ 
                            fontWeight: 800, 
                            color: '#1ABC9C', 
                            fontFamily: 'monospace',
                            letterSpacing: 2
                          }}>
                            {voucherCode}
                          </Typography>
                        </Box>
                      )}
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Your internet connection will be activated automatically.
                        <br />
                        You will also receive an SMS with your voucher code.
                      </Typography>
                    </>
                  )}

                  {paymentStatus === 'failed' && (
                    <>
                      <ErrorIcon sx={{ fontSize: 60, color: '#E74C3C', mb: 3 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#E74C3C' }}>
                        Payment Failed
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        {paymentMessage || 'There was an issue processing your payment. Please try again.'}
                      </Typography>
                      {orderId && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                          Order ID: {orderId}
                        </Typography>
                      )}
                      
                      {/* Specific error suggestions */}
                      {paymentMessage && (
                        <Box sx={{ 
                          background: 'rgba(231, 76, 60, 0.1)', 
                          border: '1px solid #E74C3C', 
                          borderRadius: 2, 
                          p: 2, 
                          mb: 2 
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#E74C3C', mb: 1 }}>
                            💡 Suggestions:
                          </Typography>
                          {paymentMessage.includes('Insufficient balance') && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              • Top up your mobile money account<br/>
                              • Check your account balance<br/>
                              • Try a different payment method
                            </Typography>
                          )}
                          {paymentMessage.includes('Invalid PIN') && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              • Double-check your PIN<br/>
                              • Make sure you're entering the correct PIN<br/>
                              • Contact your mobile money provider if PIN is locked
                            </Typography>
                          )}
                          {paymentMessage.includes('cancelled') && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              • Complete the payment process on your phone<br/>
                              • Don't cancel the USSD prompt<br/>
                              • Try again with a stable network connection
                            </Typography>
                          )}
                          {paymentMessage.includes('timeout') && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              • Check your network connection<br/>
                              • Try again during off-peak hours<br/>
                              • Contact support if the issue persists
                            </Typography>
                          )}
                          {paymentMessage.includes('Network error') && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              • Check your internet connection<br/>
                              • Try again in a few minutes<br/>
                              • Contact support if the issue persists
                            </Typography>
                          )}
                        </Box>
                      )}
                      
                      <Button
                        variant="contained"
                        onClick={() => {
                          // Reset payment state and allow retry
                          setPaymentStep(1);
                          setPaymentStatus('pending');
                          setPaymentMessage('');
                          setVoucherCode('');
                          setOrderId('');
                        }}
                        sx={{ 
                          backgroundColor: '#0072CE',
                          '&:hover': { backgroundColor: '#0056A3' }
                        }}
                      >
                        Try Again
                      </Button>
                    </>
                  )}
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ px: 4, pb: 4 }}>
              <Button
                onClick={handleBackToPackages}
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                Back to Packages
              </Button>
              
              {paymentStep === 1 && (
                <Button
                  variant="contained"
                  onClick={handleProceedToPayment}
                  disabled={!customerDetails.fullName || !customerDetails.phoneNumber || !customerDetails.location}
                  sx={{
                    background: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
                    color: '#FFFFFF',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0056A3 0%, #004080 100%)',
                    },
                  }}
                >
                  Proceed to Payment
                </Button>
              )}

              {paymentStatus === 'failed' && (
                <Button
                  variant="contained"
                  onClick={handleProceedToPayment}
                  sx={{
                    background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
                    color: '#FFFFFF',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #C0392B 0%, #A93226 100%)',
                    },
                  }}
                >
                  Try Again
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BuyPackage;