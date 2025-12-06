import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
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
  Tabs,
  Tab,
  Paper,
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
  AllInclusive as AllInclusiveIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import paymentService from '../services/paymentService';
import apiService from '../services/apiService';
import { customerPortalAPI } from '../services/customerPortalApi';

const BuyPackage = ({ onBack, currentLanguage }) => {
  const theme = useTheme();
  const [packages, setPackages] = useState([]);
  const [universalPackages, setUniversalPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phoneNumber: '',
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
  const packagesLoadedRef = React.useRef(false); // Track if packages have been loaded
  const [paymentElapsedTime, setPaymentElapsedTime] = useState(0); // Track elapsed time in seconds
  const [paymentPollingAttempts, setPaymentPollingAttempts] = useState(0); // Track polling attempts

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

  // Fetch packages from backend API - Only once when component mounts
  useEffect(() => {
    // Prevent multiple loads - only load if not already loaded
    if (packagesLoadedRef.current) {
      console.log('📦 Packages already loaded, skipping fetch');
      return;
    }

    const fetchPackages = async () => {
      try {
        setIsLoadingPackages(true);
        // Use customerPortalAPI for exact endpoint match
        const apiResponse = await customerPortalAPI.getPackages();
        // Axios returns response.data, extract the actual response
        const response = apiResponse.data || apiResponse;
        
        console.log('📦 Packages API Response:', response);
        
        // Handle different response structures
        let packagesList = null;
        if (response.status === 'success' && response.packages) {
          packagesList = response.packages;
        } else if (response.status === 'success' && response.data) {
          packagesList = response.data;
        } else if (Array.isArray(response)) {
          packagesList = response;
        } else if (response.data && Array.isArray(response.data)) {
          packagesList = response.data;
        }
        
        if (packagesList && packagesList.length > 0) {
          console.log('✅ Found packages:', packagesList.length);
          // Transform backend packages to frontend format with time-based offers
          const transformedPackages = packagesList.map((pkg, index) => ({
            id: pkg.id,
            name: pkg.name,
            duration: pkg.duration || `${pkg.durationDays} Days`,
            price: pkg.price,
            originalPrice: pkg.originalPrice || null,
            discountPercentage: pkg.discountPercentage || null,
            description: pkg.description || 'High-speed internet access',
            popular: pkg.isPopular || false,
            featured: pkg.isFeatured || false,
            dataLimit: pkg.dataLimit || 'Unlimited',
            speed: pkg.speed || 'High Speed',
            // Time-based offer fields
            isTimeBasedOffer: pkg.isTimeBasedOffer || false,
            offerType: pkg.offerType || null,
            offerDescription: pkg.offerDescription || null,
            offerStartTime: pkg.offerStartTime || null,
            offerEndTime: pkg.offerEndTime || null,
            availableDays: pkg.availableDays || null,
            features: [
              pkg.speed || 'High Speed',
              pkg.dataLimit || 'Unlimited Data',
              'Secure Connection',
              'Easy Setup'
            ],
            icon: index === 0 ? <FlashOnIcon /> : 
                  index === 1 ? <StarIcon /> : 
                  index === 2 ? <PublicIcon /> : <TrendingUpIcon />,
            // Assign unique colors per package type (ZenoPay-style colorful cards)
            color: (() => {
              const name = (pkg.name || '').toLowerCase();
              if (name.includes('daily') || name.includes('day')) return '#007BFF';  // Blue - Daily
              if (name.includes('weekly') || name.includes('week')) return '#28A745';  // Green - Weekly
              if (name.includes('monthly') || name.includes('month')) return '#6F42C1';  // Purple - Monthly
              if (name.includes('semester') || name.includes('long') || name.includes('year')) return '#FF8C00';  // Orange - Long-term
              // Default colors by index
              return index === 0 ? '#007BFF' :  // Blue
                     index === 1 ? '#28A745' :  // Green
                     index === 2 ? '#6F42C1' :  // Purple
                     '#FF8C00';  // Orange
            })(),
          }));
          
          // Categorize packages: Universal vs Offer
          const universal = transformedPackages.filter(pkg => !pkg.isTimeBasedOffer);
          const offers = transformedPackages.filter(pkg => pkg.isTimeBasedOffer);
          
          setPackages(transformedPackages);
          setUniversalPackages(universal);
          setOfferPackages(offers);
          packagesLoadedRef.current = true; // Mark as loaded
          console.log('✅ Packages loaded and cached');
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
              color: '#F5C400',  // Gold Prime
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
              color: '#F5C400',  // Gold Prime
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        packagesLoadedRef.current = true; // Mark as loaded even on error to prevent retries
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
            color: '#F5C400',  // Gold Prime
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
            color: '#F5C400',  // Gold Prime
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

  const handleProceedToPayment = async () => {
    // Client-side validation
    if (!customerDetails.fullName || !customerDetails.phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(\+255|0)?[0-9]{9}$/;
    const cleanPhone = customerDetails.phoneNumber.replace(/[^0-9]/g, '');
    if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 9) {
      toast.error('Please enter a valid Tanzanian phone number (e.g., 0773404760)');
      return;
    }

    // Validate name
    if (customerDetails.fullName.trim().length < 3) {
      toast.error('Please enter your full name (at least 3 characters)');
      return;
    }


    // Validate package selection
    if (!selectedPackage || !selectedPackage.id) {
      toast.error('Please select a package first');
      return;
    }

    // All validations passed, proceed to payment
    setPaymentStep(2);
    initiateZenoPayPayment();
  };

  const initiateZenoPayPayment = async () => {
    setIsLoading(true);
    setPaymentStatus('processing');
    toast.loading('Initializing ZenoPay payment...');

    try {
      // Format phone number for backend
      let formattedPhone = customerDetails.phoneNumber.replace(/[^0-9]/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '255' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('255')) {
        formattedPhone = '255' + formattedPhone;
      }
      formattedPhone = '+' + formattedPhone;

      // Validate payment data
      const validation = paymentService.validatePaymentData({
        customerName: customerDetails.fullName.trim(),
        phoneNumber: formattedPhone,
        packageId: selectedPackage.id,
        amount: selectedPackage.price,
      });

      if (!validation.isValid) {
        toast.error(validation.errors.join(', '));
        setPaymentStatus('failed');
        setIsLoading(false);
        return;
      }

      // Prepare payment data with formatted phone
      // Ensure all numeric values are converted to strings for backend compatibility
      const paymentData = {
        customerName: customerDetails.fullName.trim(),
        phoneNumber: formattedPhone,
        packageId: String(selectedPackage.id),  // Convert to string
        packageName: selectedPackage.name,
        amount: String(selectedPackage.price),  // Convert to string
        currency: 'TZS',
        paymentMethod: 'ZENOPAY',
      };

      // Initiate payment using customerPortalAPI for exact endpoint match
      const paymentResponse = await customerPortalAPI.processPayment(paymentData);
      
      // Axios returns response.data, extract the actual response
      const responseData = paymentResponse.data || paymentResponse;
      
      // Transform response to match expected format
      // Ensure status is always a string to avoid backend type casting errors
      const result = {
        status: String(responseData.status || (paymentResponse.status === 200 ? 'success' : 'error')),  // Ensure string
        order_id: responseData.order_id ? String(responseData.order_id) : null,  // Convert to string if exists
        voucher_code: responseData.voucher_code || null,
        message: responseData.message || 'Payment initiated successfully',
        zenopay_response: responseData.zenopay_response || null
      };

      console.log('🔍 Payment Result:', result);
      console.log('🔍 Result Status:', result.status);
      console.log('🔍 Result Type:', typeof result.status);
      console.log('🔍 Full Response Data:', responseData);

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
        setPaymentElapsedTime(0);
        setPaymentPollingAttempts(0);
        
        // Start enhanced payment status polling with optimized settings
        const stopPolling = await paymentService.pollPaymentStatus(
          result.order_id,
          (statusData) => {
            console.log('📊 Payment status update received:', statusData);
            
            // Update elapsed time and attempts
            if (statusData.elapsedSeconds !== undefined) {
              setPaymentElapsedTime(statusData.elapsedSeconds);
            }
            if (statusData.attempt !== undefined) {
              setPaymentPollingAttempts(statusData.attempt);
            }
            
            // Normalize status to uppercase for consistent comparison
            const normalizedStatus = (statusData.status || '').toUpperCase();
            
            // Map status to UI state (keep original status for display)
            let uiStatus = 'processing';
            if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'SUCCESS') {
              uiStatus = 'success';
            } else if (['FAILED', 'CANCELLED', 'INSUFFICIENT_BALANCE', 'INVALID_PIN', 
                        'USER_CANCELLED', 'EXPIRED', 'TIMEOUT', 'NETWORK_ERROR', 'ERROR'].includes(normalizedStatus)) {
              uiStatus = 'failed';
            }
            
            setPaymentStatus(uiStatus);
            setPaymentMessage(statusData.message);
            
            // Handle success
            if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'SUCCESS') {
              if (statusData.voucherCode) {
                setVoucherCode(statusData.voucherCode);
                toast.success(`✅ Payment successful! Voucher code: ${statusData.voucherCode}`);
              }
              // Stop polling on success
              if (currentPollingStop) {
                console.log(`🛑 Stopping polling - payment successful after ${statusData.elapsedSeconds}s`);
                currentPollingStop();
                setCurrentPollingStop(null);
              }
            } else if (['FAILED', 'CANCELLED', 'INSUFFICIENT_BALANCE', 'INVALID_PIN', 
                        'USER_CANCELLED', 'EXPIRED', 'TIMEOUT', 'NETWORK_ERROR', 'ERROR'].includes(normalizedStatus)) {
              // All failure states
              // Show appropriate toast based on failure type
              if (normalizedStatus === 'INSUFFICIENT_BALANCE') {
                toast.error('💳 Insufficient balance! Please top up your mobile money account.');
              } else if (normalizedStatus === 'INVALID_PIN') {
                toast.error('🔐 Invalid PIN! Please try again with the correct PIN.');
              } else if (normalizedStatus === 'USER_CANCELLED' || normalizedStatus === 'CANCELLED') {
                toast.error('❌ Payment cancelled. Please try again.');
              } else if (normalizedStatus === 'EXPIRED') {
                toast.error('⏰ Payment expired. Please initiate a new payment.');
              } else if (normalizedStatus === 'TIMEOUT') {
                toast.error('⏱️ Payment timed out. Please try again.');
              } else if (normalizedStatus === 'NETWORK_ERROR') {
                toast.error('🌐 Network error. Please check your connection and try again.');
              } else {
                toast.error('❌ Payment failed. Please try again.');
              }
              
              // Stop polling on failure
              if (currentPollingStop) {
                console.log(`🛑 Stopping polling - payment ${normalizedStatus} after ${statusData.elapsedSeconds}s`);
                currentPollingStop();
                setCurrentPollingStop(null);
              }
            }
          },
          90, // Max attempts (3 minutes with 2s interval)
          2000 // Interval (2 seconds - more responsive)
        );
        
        setCurrentPollingStop(stopPolling);
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentStatus('failed');
      
      // Better error messages based on error type
      if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        setPaymentMessage('Unable to connect to payment service. Please check your internet connection and try again.');
        toast.error('Connection error. Please check your internet and try again.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        setPaymentMessage('Network error. Please check your internet connection and try again.');
        toast.error('Network error. Please check your connection.');
      } else if (error.message?.includes('validation') || error.message?.includes('required')) {
        setPaymentMessage(error.message || 'Please check your information and try again.');
        toast.error(error.message || 'Invalid information. Please check your details.');
      } else {
        setPaymentMessage(error.message || 'Payment initiation failed. Please try again.');
        toast.error(error.message || 'Payment failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      toast.dismiss();
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
    setPaymentElapsedTime(0);
    setPaymentPollingAttempts(0);
    setCustomerDetails({ fullName: '', phoneNumber: '' });
  };

  const handlePurchase = () => {
    if (!selectedPackage) {
      toast.error('Please select a package first');
      return;
    }
    
    if (!customerDetails.fullName || !customerDetails.phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Proceed to payment
    handleProceedToPayment();
  };

  // Location dropdown removed - no longer needed
  // const tanzaniaLocations = [
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
        position: 'relative',
        overflow: 'hidden',
        py: 1,
        pt: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'transparent',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 64px)', pt: 0 }}>
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
                mb: { xs: 1.5, md: 2 },
                background: '#FFFFFF',  // White background
                border: '1px solid #EDEDED',  // Subtle border
                color: '#1A1A1A',  // Charcoal text
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',  // Subtle shadow
                '&:hover': {
                  background: 'rgba(245, 196, 0, 0.1)',  // Gold glass on hover
                  borderColor: '#F5C400',  // Yellow border
                  transform: 'translateX(-4px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: '1.5rem' }}
              >
                <Avatar
                  src="/gg-logo.png"
                  alt="GG Wi-Fi Logo"
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    mx: 'auto',
                    border: '4px solid #F5C400',  // Gold Prime
                    boxShadow: '0 0 32px rgba(245, 196, 0, 0.6), 0 8px 30px rgba(245, 196, 0, 0.4)',  // Premium gold glow
                    background: 'linear-gradient(135deg, rgba(245, 196, 0, 0.2) 0%, rgba(245, 196, 0, 0.1) 100%)',  // Premium gold
                    filter: 'brightness(1.1)',
                    '& img': {
                      objectFit: 'contain',
                      padding: '4px',
                      filter: 'brightness(1.25) contrast(1.1) drop-shadow(0 2px 6px rgba(255, 199, 44, 0.5))',
                    },
                  }}
                />
              </motion.div>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#1A1A1A',  // Charcoal Black text
                  mb: 2,
                }}
              >
                Choose Your Package
              </Typography>

              <Typography variant="h6" sx={{ color: '#505050', mb: 4, maxWidth: 600, mx: 'auto' }}>  {/* Label grey */}
                Select the perfect internet package for your needs. All packages include high-speed, 
                secure, and reliable internet access.
              </Typography>

              {/* Features */}
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 6 }}>
                {[
                  { icon: <SpeedIcon />, text: 'Lightning Fast', color: '#F5C400' },  // Gold Prime
                  { icon: <SecurityIcon />, text: 'Secure & Reliable', color: '#1ABC9C' },
                  { icon: <PublicIcon />, text: 'Wide Coverage', color: '#0072CE' },
                ].map((feature, index) => (
                  <Chip
                    key={index}
                    icon={feature.icon}
                    label={feature.text}
                    sx={{
                      background: '#FFFFFF',  // White background
                      color: feature.color,  // Feature color text
                      border: `1px solid ${feature.color}`,  // Feature color border
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: feature.color,
                      },
                      '&:hover': {
                        background: '#FFE89C',  // Pale yellow on hover
                        borderColor: '#F2C94C',  // Yellow border
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </motion.div>

          {/* Loading State */}
          {isLoadingPackages && (
            <LoadingSpinner message="Loading packages..." fullScreen={false} />
          )}

          {/* Packages Grid */}
          {!isLoadingPackages && (
            <motion.div variants={itemVariants}>
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
                {packages.length === 0 ? (
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ borderRadius: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No packages available
                      </Typography>
                      <Typography variant="body2">
                        Please check back later or contact support for assistance.
                      </Typography>
                    </Alert>
                  </Grid>
                ) : (
                  packages.map((pkg) => (
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
                        background: '#FFFFFF',  // White background - ZenoPay Style
                        borderRadius: 4,  // 16px rounded corners
                        border: selectedPackage?.id === pkg.id 
                          ? `3px solid ${pkg.color}`  // Package color border when selected
                          : `1px solid #FFE89C`,  // Pale yellow border
                        boxShadow: selectedPackage?.id === pkg.id 
                          ? `0 8px 24px ${pkg.color}40`  // Colored shadow when selected
                          : '0 2px 8px rgba(0, 0, 0, 0.08)',  // Soft shadow
                        transition: 'all 0.2s ease-in-out',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: { xs: 'translateY(-4px)', md: 'translateY(-6px)' },
                          boxShadow: `0 8px 24px ${pkg.color}30`,  // Colored shadow on hover
                          borderColor: pkg.color,  // Package color border on hover
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
                              background: 'linear-gradient(135deg, #F5C400 0%, #D4A100 100%)',  // Premium gold gradient
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

                      {/* Time-Based Offer Badge */}
                      {pkg.isTimeBasedOffer && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            zIndex: 1,
                          }}
                        >
                          <Chip
                            icon={<LocalOfferIcon />}
                            label="Limited Offer"
                            sx={{
                              background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              '& .MuiChip-icon': {
                                color: '#FFFFFF',
                              },
                            }}
                          />
                        </Box>
                      )}

                      {/* Discount Badge */}
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: pkg.isTimeBasedOffer ? 60 : 16,
                            left: 16,
                            zIndex: 1,
                          }}
                        >
                          <Chip
                            label={`Save ${pkg.discountPercentage || Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%`}
                            sx={{
                              background: '#FFFFFF',  // White background
                              color: '#1ABC9C',  // Green text
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              border: '2px solid #1ABC9C',  // Green border
                              '&:hover': {
                                background: '#1ABC9C',  // Green background on hover
                                color: '#FFFFFF',  // White text
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
                            background: `${pkg.color}15`,  // Light tint of package color
                            width: 80,  // Big icon
                            height: 80,
                            mx: 'auto',
                            mb: 3,
                            boxShadow: `0 4px 12px ${pkg.color}20`,
                            border: `2px solid ${pkg.color}40`,
                            '& .MuiSvgIcon-root': {
                              fontSize: 40,
                              color: pkg.color,  // Package color icon
                            },
                          }}
                        >
                          {pkg.icon}
                        </Avatar>

                        {/* Package Name - Colored by Package Type */}
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: pkg.color,  // Package color for name (Blue/Green/Purple/Orange)
                            mb: 1,
                            fontSize: { xs: '1.25rem', md: '1.5rem' },
                          }}
                        >
                          {pkg.name}
                        </Typography>

                        {/* Duration */}
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#505050',  // Label grey for duration
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {pkg.duration}
                        </Typography>

                        {/* Price with Discount */}
                        <Box sx={{ mb: 2 }}>
                          {pkg.originalPrice && pkg.originalPrice > pkg.price ? (
                            <>
                              <Typography
                                variant="h6"
                                sx={{
                                  textDecoration: 'line-through',
                                  color: '#8D8D8D',  // Slate grey on white background
                                  opacity: 0.8,
                                  mb: 0.5,
                                }}
                              >
                                TZS {pkg.originalPrice.toLocaleString()}
                              </Typography>
                              <Typography
                                variant="h3"
                                sx={{
                                  fontWeight: 900,
                                  color: pkg.color,  // Package color for discounted price
                                  fontSize: { xs: '2rem', md: '2.5rem' },
                                }}
                              >
                                TZS {pkg.price.toLocaleString()}
                              </Typography>
                              {pkg.discountPercentage && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#1ABC9C',
                                    fontWeight: 700,
                                    display: 'block',
                                    mt: 0.5,
                                  }}
                                >
                                  Save {pkg.discountPercentage}%!
                                </Typography>
                              )}
                            </>
                          ) : (
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 900,
                                color: '#1A1A1A',  // Charcoal Black on white background
                                fontSize: { xs: '2rem', md: '2.5rem' },
                              }}
                            >
                              TZS {pkg.price.toLocaleString()}
                            </Typography>
                          )}
                        </Box>

                        {/* Time-Based Offer Info */}
                        {pkg.isTimeBasedOffer && pkg.offerDescription && (
                          <Alert
                            severity="info"
                            sx={{
                              mb: 2,
                              borderRadius: 2,
                              background: '#FFFFFF',  // White background
                              border: '2px solid #F5C400',  // Yellow border
                              '& .MuiAlert-icon': {
                                color: '#F2C94C',  // Yellow icon
                              },
                              '& .MuiAlert-message': {
                                color: '#1A1A1A',  // Charcoal text
                              },
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                              ⚡ Limited Time Offer
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              {pkg.offerDescription}
                            </Typography>
                            {pkg.offerStartTime && pkg.offerEndTime && (
                              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                                Available: {pkg.offerStartTime} - {pkg.offerEndTime}
                              </Typography>
                            )}
                          </Alert>
                        )}

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#1A1A1A',  // Charcoal Black for description (different from name)
                            mb: 3,
                            minHeight: 40,
                            lineHeight: 1.5,
                            fontWeight: 400,
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
                                  color: '#1A1A1A',  // Charcoal Black text
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
                              background: pkg.color,  // Package color background when selected
                              color: '#FFFFFF',  // White text
                              border: `2px solid ${pkg.color}`,
                              boxShadow: `0 4px 12px ${pkg.color}40`,
                              '&:hover': {
                                background: pkg.color,
                                opacity: 0.9,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 16px ${pkg.color}50`,
                              },
                            } : {
                              background: '#FFFFFF',  // White button
                              color: pkg.color,  // Package color text
                              border: `2px solid ${pkg.color}`,  // Package color border
                              '&:hover': {
                                background: `${pkg.color}10`,  // Light package color tint
                                color: pkg.color,  // Package color text
                                border: `2px solid ${pkg.color}`,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 4px 12px ${pkg.color}30`,
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
                  ))
                )}
              </Grid>
            </motion.div>
          )}

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
                  background: '#FFFFFF',
                  borderRadius: 2,
                  border: `2px solid ${selectedPackage.color}`,
                  boxShadow: `0 4px 12px ${selectedPackage.color}30`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#0B0B0B',
                        mb: 2,
                      }}
                    >
                      Ready to Purchase
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#8D8D8D' }}>
                      You've selected the <strong>{selectedPackage.name}</strong> package
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 4, borderColor: '#EDEDED' }} />

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
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0B0B0B' }}>
                            {selectedPackage.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#8D8D8D' }}>
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
                        <Typography variant="body2" sx={{ color: '#8D8D8D' }}>
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
                borderRadius: 2,
                background: '#FFFFFF',
                border: '1px solid #EDEDED',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            <DialogTitle sx={{ textAlign: 'center', pb: 2, fontWeight: 700, color: '#0B0B0B', borderBottom: '1px solid #EDEDED' }}>
              Complete Your Purchase
              <Typography variant="body2" sx={{ color: '#8D8D8D', mt: 1, fontWeight: 400 }}>
                Fill in your details to proceed with payment
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ px: 4, py: 2 }}>
              {/* Package Summary */}
              {selectedPackage && (
                <Card sx={{ mb: 4, background: '#FFFFFF', border: '1px solid #EDEDED', boxShadow: '0 2px 16px rgba(0, 0, 0, 0.14)', position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #F5C400 0%, #D4A100 100%)',
                    borderRadius: '4px 4px 0 0',
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ background: selectedPackage.color }}>
                        {selectedPackage.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0B0B0B' }}>
                          {selectedPackage.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#8D8D8D' }}>
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
                  <StepLabel 
                    StepIconProps={{
                      sx: {
                        '&.Mui-active': { color: '#F5C400' },
                        '&.Mui-completed': { color: '#1ABC9C' },
                      }
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>Package Selected</Typography>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '&.Mui-active': { color: '#F5C400' },
                        '&.Mui-completed': { color: '#1ABC9C' },
                      }
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>Customer Details</Typography>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '&.Mui-active': { color: '#F5C400' },
                        '&.Mui-completed': { color: '#1ABC9C' },
                      }
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>Payment</Typography>
                  </StepLabel>
                </Step>
              </Stepper>
              
              {/* Step Indicator Message */}
              {paymentStep === 1 && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2, background: '#F0F7FF', border: '1px solid #0072CE' }}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    Step 2 of 3: Enter Your Details
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#505050' }}>
                    Please provide your information to complete the purchase. All fields are required.
                  </Typography>
                </Alert>
              )}
              
              {paymentStep === 2 && (
                <Alert 
                  severity={paymentStatus === 'processing' ? 'info' : paymentStatus === 'success' ? 'success' : 'error'} 
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    Step 3 of 3: {paymentStatus === 'processing' ? 'Processing Payment' : paymentStatus === 'success' ? 'Payment Complete' : 'Payment Issue'}
                  </Typography>
                  <Typography variant="caption">
                    {paymentStatus === 'processing' && 'Please wait while we process your payment...'}
                    {paymentStatus === 'success' && 'Your payment was successful!'}
                    {paymentStatus === 'failed' && 'There was an issue with your payment. Please try again.'}
                  </Typography>
                </Alert>
              )}

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
                    error={!!(customerDetails.fullName && customerDetails.fullName.trim().length < 3)}
                    helperText={customerDetails.fullName && customerDetails.fullName.trim().length < 3 
                      ? 'Name must be at least 3 characters' 
                      : 'Enter your full name as it appears on your ID'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: '#FFFFFF',
                        border: '1px solid #EDEDED',
                        '&:hover': {
                          borderColor: '#F2C94C',
                        },
                        '&.Mui-focused': {
                          borderColor: '#F2C94C',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#EDEDED',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#8D8D8D',
                        '&.Mui-focused': {
                          color: '#F2C94C',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#0B0B0B',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    value={customerDetails.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9+]/g, '');
                      handleCustomerDetailsChange('phoneNumber', value);
                    }}
                    placeholder="0773404760 or +255773404760"
                    required
                    error={!!(customerDetails.phoneNumber && customerDetails.phoneNumber.replace(/[^0-9]/g, '').length < 9)}
                    helperText={customerDetails.phoneNumber && customerDetails.phoneNumber.replace(/[^0-9]/g, '').length < 9
                      ? 'Please enter a valid Tanzanian phone number (9-10 digits)'
                      : 'Enter your phone number for payment and SMS notifications'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: '#FFFFFF',
                        border: '1px solid #EDEDED',
                        '&:hover': {
                          borderColor: '#F2C94C',
                        },
                        '&.Mui-focused': {
                          borderColor: '#F2C94C',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#EDEDED',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#8D8D8D',
                        '&.Mui-focused': {
                          color: '#F2C94C',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#0B0B0B',
                      },
                    }}
                  />


                  {/* Payment Method Info */}
                  <Alert severity="info" sx={{ borderRadius: 2, background: '#F0F7FF', border: '1px solid #0072CE' }}>
                    <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                      <strong>Payment Method:</strong> ZenoPay Mobile Money
                      <br />
                      <strong>Supported:</strong> M-Pesa, Tigo Pesa, Airtel Money, Halopesa
                      <br />
                      <Typography variant="caption" sx={{ color: '#505050', display: 'block', mt: 0.5 }}>
                        💡 You'll receive a payment prompt on your phone after clicking "Proceed to Payment"
                      </Typography>
                    </Typography>
                  </Alert>
                </Stack>
              )}

              {/* Payment Processing */}
              {paymentStep === 2 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  {paymentStatus === 'processing' && (
                    <>
                      <CircularProgress size={60} sx={{ color: '#F5C400', mb: 3 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0B0B0B' }}>
                        Processing Payment...
                      </Typography>
                      
                      {/* Progress Indicator */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ color: '#8D8D8D', mb: 1 }}>
                          {paymentElapsedTime > 0 ? `⏱️ Waiting for payment confirmation... (${paymentElapsedTime}s)` : '⏱️ Waiting for payment confirmation...'}
                        </Typography>
                        {paymentPollingAttempts > 0 && (
                          <Typography variant="caption" sx={{ color: '#8D8D8D' }}>
                            Checking status... (Attempt {paymentPollingAttempts})
                          </Typography>
                        )}
                      </Box>
                      
                      <Alert severity="info" sx={{ mb: 2, borderRadius: 2, background: '#F0F7FF' }}>
                        <Typography variant="body2" sx={{ color: '#0B0B0B', fontWeight: 600, mb: 0.5 }}>
                          📱 Check Your Phone
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#505050' }}>
                          {paymentMessage || 'Please check your phone for payment instructions. Complete the payment on your mobile device.'}
                        </Typography>
                        {paymentElapsedTime > 30 && (
                          <Typography variant="caption" sx={{ color: '#505050', display: 'block', mt: 1, fontStyle: 'italic' }}>
                            💡 If you've already entered your PIN, the payment is being processed. Please wait...
                          </Typography>
                        )}
                      </Alert>
                      {orderId && (
                        <Box sx={{ 
                          background: '#F6F6F6', 
                          borderRadius: 2, 
                          p: 1.5, 
                          mb: 2,
                          border: '1px solid #EDEDED'
                        }}>
                          <Typography variant="caption" sx={{ color: '#8D8D8D', display: 'block', mb: 0.5 }}>
                            Order ID:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#0B0B0B', fontWeight: 600, fontFamily: 'monospace' }}>
                            {orderId}
                          </Typography>
                        </Box>
                      )}
                      <Alert severity="warning" sx={{ borderRadius: 2, background: '#FFF9E6', border: '1px solid #F5C400' }}>
                        <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                          ⚠️ Do not close this window until payment is complete.
                        </Typography>
                      </Alert>
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
                        ✅ Payment Successful!
                      </Typography>
                      <Alert severity="success" sx={{ mb: 2, borderRadius: 2, background: '#E8F8F5', border: '1px solid #1ABC9C' }}>
                        <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                          {paymentMessage || 'Payment completed successfully! Your voucher code has been generated and sent to your phone.'}
                        </Typography>
                      </Alert>
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
                        ❌ Payment Failed
                      </Typography>
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2, background: '#FEE', border: '1px solid #E74C3C' }}>
                        <Typography variant="body2" sx={{ color: '#0B0B0B', mb: 1 }}>
                          {paymentMessage || 'There was an issue processing your payment. Please try again.'}
                        </Typography>
                        {orderId && (
                          <Box sx={{ mt: 1, p: 1, background: '#FFFFFF', borderRadius: 1, border: '1px solid #EDEDED' }}>
                            <Typography variant="caption" sx={{ color: '#8D8D8D', display: 'block', mb: 0.5 }}>
                              Order ID:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#0B0B0B', fontWeight: 600, fontFamily: 'monospace' }}>
                              {orderId}
                            </Typography>
                          </Box>
                        )}
                      </Alert>
                      
                      {/* Specific error suggestions */}
                      {paymentMessage && (
                        <Box sx={{ 
                          background: '#FFF9E6', 
                          border: '1px solid #F5C400', 
                          borderRadius: 2, 
                          p: 2, 
                          mb: 2 
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0B0B0B', mb: 1 }}>
                            💡 What to do next:
                          </Typography>
                          {(paymentMessage.toLowerCase().includes('insufficient') || paymentMessage.toLowerCase().includes('balance')) && (
                            <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                              • Top up your mobile money account<br/>
                              • Check your account balance<br/>
                              • Try a different payment method<br/>
                              • Contact your mobile money provider for assistance
                            </Typography>
                          )}
                          {(paymentMessage.toLowerCase().includes('invalid pin') || paymentMessage.toLowerCase().includes('pin')) && (
                            <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                              • Double-check your PIN<br/>
                              • Make sure you're entering the correct PIN<br/>
                              • Contact your mobile money provider if PIN is locked<br/>
                              • Wait a few minutes before trying again
                            </Typography>
                          )}
                          {(paymentMessage.toLowerCase().includes('cancelled') || paymentMessage.toLowerCase().includes('cancel')) && (
                            <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                              • Complete the payment process on your phone<br/>
                              • Don't cancel the USSD prompt<br/>
                              • Try again with a stable network connection<br/>
                              • Make sure you have sufficient balance before retrying
                            </Typography>
                          )}
                          {(paymentMessage.toLowerCase().includes('timeout') || paymentMessage.toLowerCase().includes('timed out')) && (
                            <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                              • Check your network connection<br/>
                              • Try again during off-peak hours<br/>
                              • Ensure your phone has good signal strength<br/>
                              • Contact support if the issue persists
                            </Typography>
                          )}
                          {(paymentMessage.toLowerCase().includes('network error') || paymentMessage.toLowerCase().includes('network')) && (
                            <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                              • Check your internet connection<br/>
                              • Try again in a few minutes<br/>
                              • Switch to a different network if available<br/>
                              • Contact support if the issue persists
                            </Typography>
                          )}
                          {paymentMessage.toLowerCase().includes('expired') && (
                            <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                              • The payment session has expired<br/>
                              • Please initiate a new payment<br/>
                              • Complete the payment within the time limit<br/>
                              • Contact support if you need assistance
                            </Typography>
                          )}
                          {!paymentMessage.toLowerCase().includes('insufficient') && 
                           !paymentMessage.toLowerCase().includes('pin') &&
                           !paymentMessage.toLowerCase().includes('cancelled') &&
                           !paymentMessage.toLowerCase().includes('timeout') &&
                           !paymentMessage.toLowerCase().includes('network') &&
                           !paymentMessage.toLowerCase().includes('expired') && (
                            <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                              • Please try again<br/>
                              • Check your mobile money account<br/>
                              • Ensure you have sufficient balance<br/>
                              • Contact support if the problem continues
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
                          setPaymentElapsedTime(0);
                          setPaymentPollingAttempts(0);
                        }}
                        sx={{ 
                          backgroundColor: '#F2C94C',
                          color: '#0B0B0B',
                          fontWeight: 600,
                          '&:hover': { 
                            backgroundColor: '#D4A100',
                            boxShadow: '0 2px 8px rgba(245, 196, 0, 0.3)'
                          }
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
                  color: '#8D8D8D',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#0B0B0B',
                    background: '#F6F6F6',
                  },
                }}
              >
                Back to Packages
              </Button>
              
              {paymentStep === 1 && (
                <Button
                  variant="contained"
                  onClick={handleProceedToPayment}
                  disabled={!customerDetails.fullName || !customerDetails.phoneNumber}
                  sx={{
                    background: '#F5C400',
                    color: '#0B0B0B',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      background: '#D4A100',
                      boxShadow: '0 2px 8px rgba(245, 196, 0, 0.3)',
                    },
                    '&:disabled': {
                      background: '#EDEDED',
                      color: '#8D8D8D',
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
                      background: '#F5C400',
                      color: '#0B0B0B',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        background: '#D4A100',
                        boxShadow: '0 2px 8px rgba(245, 196, 0, 0.3)',
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