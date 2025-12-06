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
  const [cardStyle, setCardStyle] = useState('detailed'); // 'detailed' or 'colorful' - card style toggle
  const paymentStartTimeRef = React.useRef(null); // Track when payment was initiated

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

  // Independent timer to update elapsed time every second when payment is processing
  // This ensures UI updates even if polling doesn't provide elapsed time
  useEffect(() => {
    let elapsedTimer = null;
    
    console.log(`🔍 Timer useEffect triggered: paymentStep=${paymentStep}, paymentStatus=${paymentStatus}, paymentStartTimeRef=${paymentStartTimeRef.current}`);
    
    // Only start timer when payment is processing
    if (paymentStep === 2 && paymentStatus === 'processing') {
      // Wait a bit for paymentStartTimeRef to be set if it's not set yet
      const checkAndStartTimer = () => {
        if (!paymentStartTimeRef.current) {
          console.warn('⚠️ Timer condition met but paymentStartTimeRef is null, retrying in 100ms');
          setTimeout(checkAndStartTimer, 100);
          return;
        }
        
        console.log('⏰ Starting independent elapsed time timer, startTime:', paymentStartTimeRef.current);
        elapsedTimer = setInterval(() => {
          if (!paymentStartTimeRef.current) {
            console.log('⚠️ No payment start time, stopping timer');
            clearInterval(elapsedTimer);
            return;
          }
          
          const currentElapsed = Math.floor((Date.now() - paymentStartTimeRef.current) / 1000);
          console.log(`⏱️ Timer update: ${currentElapsed}s elapsed`);
          
          // Always update state to trigger re-render
          setPaymentElapsedTime(currentElapsed);
          
          // Progressive warnings (only show once per second)
          if (currentElapsed === 10) {
            toast.warning('📱 Check your phone for the USSD prompt!', { duration: 4000 });
          } else if (currentElapsed === 20) {
            toast.warning('🔐 Please enter your mobile money PIN on your phone!', { duration: 4000 });
          } else if (currentElapsed === 30) {
            toast.warning('⏳ Payment processing... Please wait for confirmation.', { duration: 4000 });
          } else if (currentElapsed === 40) {
            toast.error('⚠️ 20 seconds remaining! Please complete payment now!', { duration: 5000 });
          } else if (currentElapsed === 50) {
            toast.error('🚨 10 seconds left! Complete payment immediately!', { duration: 5000 });
          } else if (currentElapsed === 55) {
            toast.error('🚨 CRITICAL: 5 seconds remaining!', { duration: 5000 });
          }
          
          // Stop timer at 60 seconds
          if (currentElapsed >= 60) {
            console.log('⏰ Timer reached 60s, stopping');
            clearInterval(elapsedTimer);
            elapsedTimer = null;
          }
        }, 1000); // Update every second for smooth UI updates
      };
      
      checkAndStartTimer();
    } else {
      console.log(`⏸️ Timer not started: paymentStep=${paymentStep}, paymentStatus=${paymentStatus}`);
    }
    
    return () => {
      if (elapsedTimer) {
        console.log('🛑 Cleaning up elapsed time timer');
        clearInterval(elapsedTimer);
        elapsedTimer = null;
      }
    };
  }, [paymentStep, paymentStatus]); // Removed paymentElapsedTime - it was causing timer to restart

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
              color: '#F2C94C',  // Official Gold
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
              color: '#F2C94C',  // Official Gold
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
            color: '#F2C94C',  // Official Gold
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
            color: '#F2C94C',  // Official Gold
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
        
        // Set initial status with clear instructions
        setPaymentStatus('processing');
        setPaymentMessage('Payment request sent! Check your phone for the USSD prompt and enter your mobile money PIN.');
        setOrderId(result.order_id);
        setPaymentStep(2);
        setPaymentElapsedTime(0);
        setPaymentPollingAttempts(0);
        
        // Store payment start time for fallback elapsed time calculation
        paymentStartTimeRef.current = Date.now();
        console.log('⏰ Payment start time recorded:', paymentStartTimeRef.current);
        
        // Show initial instruction toast
        toast('📱 Check your phone for payment instructions!', {
          duration: 5000,
          position: 'top-center',
          icon: '📱'
        });
        
        // Start enhanced payment status polling with optimized settings
        // Use 2s interval initially, will auto-increase to 500ms after 5s for faster webhook detection
        const stopPolling = await paymentService.pollPaymentStatus(
          result.order_id,
          (statusData) => {
            console.log('📊 Payment status update received:', statusData);
            
            // Update elapsed time and attempts
            // CRITICAL: Always update elapsed time to ensure UI updates
            let elapsedToUse = statusData.elapsedSeconds;
            
            // Fallback: Calculate elapsed time if not provided or if it's 0 and we have a start time
            if (elapsedToUse === undefined || elapsedToUse === null || (elapsedToUse === 0 && paymentStartTimeRef.current)) {
              if (paymentStartTimeRef.current) {
                elapsedToUse = Math.floor((Date.now() - paymentStartTimeRef.current) / 1000);
                console.log(`⏱️ Fallback: Calculated elapsed time: ${elapsedToUse}s (from payment start, was: ${statusData.elapsedSeconds})`);
              } else {
                console.warn('⚠️ elapsedSeconds not provided and no payment start time available');
                elapsedToUse = statusData.elapsedSeconds || paymentElapsedTime; // Use provided or keep current
              }
            }
            
            // Always update elapsed time (even if same value, to ensure React re-renders)
            console.log(`⏱️ Setting paymentElapsedTime to: ${elapsedToUse}s (previous: ${paymentElapsedTime}s, statusData provided: ${statusData.elapsedSeconds})`);
            if (elapsedToUse !== paymentElapsedTime || elapsedToUse === 0) {
              setPaymentElapsedTime(elapsedToUse);
            }
            
            // Progressive warnings with toast notifications
            if (elapsedToUse === 10) {
              toast.warning('📱 Check your phone for the USSD prompt!', { duration: 4000 });
            } else if (elapsedToUse === 20) {
              toast.warning('🔐 Please enter your mobile money PIN on your phone!', { duration: 4000 });
            } else if (elapsedToUse === 30) {
              toast.warning('⏳ Payment processing... Please wait for confirmation.', { duration: 4000 });
            } else if (elapsedToUse === 40) {
              toast.error('⚠️ 20 seconds remaining! Please complete payment now!', { duration: 5000 });
            } else if (elapsedToUse === 50) {
              toast.error('🚨 10 seconds left! Complete payment immediately!', { duration: 5000 });
            } else if (elapsedToUse === 55) {
              toast.error('🚨 CRITICAL: 5 seconds remaining!', { duration: 5000 });
            }
            if (statusData.attempt !== undefined) {
              setPaymentPollingAttempts(statusData.attempt);
            }
            
            // Normalize status to uppercase for consistent comparison
            const normalizedStatus = (statusData.status || '').toUpperCase();
            
            // Map status to UI state (keep original status for display)
            // Handle ALL possible statuses from backend enum and webhook
            let uiStatus = 'processing';
            if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'SUCCESS' || normalizedStatus === 'SUCCESSFUL') {
              uiStatus = 'success';
            } else if (['FAILED', 'CANCELLED', 'REFUNDED', 'INSUFFICIENT_BALANCE', 'INVALID_PIN', 
                        'USER_CANCELLED', 'EXPIRED', 'TIMEOUT', 'NETWORK_ERROR', 'ERROR'].includes(normalizedStatus)) {
              uiStatus = 'failed';
            } else if (normalizedStatus === 'PENDING' || normalizedStatus === 'PROCESSING') {
              uiStatus = 'processing';
            }
            
            setPaymentStatus(uiStatus);
            setPaymentMessage(statusData.message);
            
            // Handle success - support COMPLETED, SUCCESSFUL, and SUCCESS from backend enum
            if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'SUCCESS' || normalizedStatus === 'SUCCESSFUL') {
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
            } else if (['FAILED', 'CANCELLED', 'REFUNDED', 'INSUFFICIENT_BALANCE', 'INVALID_PIN', 
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
          30, // Max attempts (60 seconds with 2s interval) - Matches USSD timeout
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

  // Package color mapping (secondary palette) - for colorful card style
  const packageColors = [
    { bg: '#EAF4FF', color: '#3A8DFF', name: 'Blue' },      // sec-blue-light / sec-blue
    { bg: '#ECFDF5', color: '#10B981', name: 'Green' },     // sec-green-light / sec-green
    { bg: '#F5E8FF', color: '#A855F7', name: 'Purple' },   // sec-purple-light / sec-purple
    { bg: '#FFF3E6', color: '#FF8A3D', name: 'Orange' },    // sec-orange-light / sec-orange
  ];

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
                  borderColor: '#F2C94C',  // Official Gold border
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
                    border: '4px solid #F2C94C',  // Official Gold
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
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                {[
                  { icon: <SpeedIcon />, text: 'Lightning Fast', color: '#F2C94C' },  // Official Gold
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

              {/* Card Style Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, gap: 2 }}>
                <Button
                  variant={cardStyle === 'detailed' ? 'contained' : 'outlined'}
                  onClick={() => setCardStyle('detailed')}
                  sx={{
                    backgroundColor: cardStyle === 'detailed' ? '#F2C94C' : 'transparent',
                    color: cardStyle === 'detailed' ? '#0A0A0A' : '#666666',
                    borderColor: '#F2C94C',
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: cardStyle === 'detailed' ? '#E0B335' : 'rgba(242, 201, 76, 0.1)',
                    },
                  }}
                >
                  Detailed View
                </Button>
                <Button
                  variant={cardStyle === 'colorful' ? 'contained' : 'outlined'}
                  onClick={() => setCardStyle('colorful')}
                  sx={{
                    backgroundColor: cardStyle === 'colorful' ? '#F2C94C' : 'transparent',
                    color: cardStyle === 'colorful' ? '#0A0A0A' : '#666666',
                    borderColor: '#F2C94C',
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: cardStyle === 'colorful' ? '#E0B335' : 'rgba(242, 201, 76, 0.1)',
                    },
                  }}
                >
                  Colorful View
                </Button>
              </Box>
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
                  packages.map((pkg, index) => {
                    // Get color scheme for colorful style
                    const colorScheme = packageColors[index % 4];
                    const isColorfulStyle = cardStyle === 'colorful';
                    
                    return (
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
                            // Colorful style: secondary color background, Detailed style: white background
                            background: isColorfulStyle ? colorScheme.bg : '#FFFFFF',
                            borderRadius: isColorfulStyle ? '16px' : 4,
                            border: isColorfulStyle 
                              ? `2px solid ${colorScheme.color}`  // Colorful: 2px solid secondary color
                              : selectedPackage?.id === pkg.id 
                                ? `3px solid ${pkg.color}`  // Detailed: Package color border when selected
                                : `1px solid #FFE89C`,  // Detailed: Pale yellow border
                            boxShadow: isColorfulStyle
                              ? '0 4px 12px rgba(0,0,0,0.06)'  // Colorful: Soft shadow
                              : selectedPackage?.id === pkg.id 
                                ? `0 8px 24px ${pkg.color}40`  // Detailed: Colored shadow when selected
                                : '0 2px 8px rgba(0, 0, 0, 0.08)',  // Detailed: Soft shadow
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: isColorfulStyle
                                ? '0 8px 24px rgba(0,0,0,0.12)'  // Colorful: Deeper shadow
                                : `0 8px 24px ${pkg.color}30`,  // Detailed: Colored shadow on hover
                              borderColor: isColorfulStyle ? colorScheme.color : pkg.color,
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
                              background: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',  // Official gold gradient
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

                      <CardContent sx={{ flex: 1, p: isColorfulStyle ? 3 : 4, textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                        {/* Package Icon - Only show in detailed style */}
                        {!isColorfulStyle && (
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
                        )}

                        {/* Package Name */}
                        <Typography
                          variant={isColorfulStyle ? "h6" : "h5"}
                          sx={{
                            fontWeight: 700,
                            color: isColorfulStyle ? '#0A0A0A' : pkg.color,
                            mb: 1,
                            fontSize: isColorfulStyle ? { xs: '1rem', md: '1.125rem' } : { xs: '1.25rem', md: '1.5rem' },
                          }}
                        >
                          {pkg.name}
                        </Typography>

                        {/* Duration */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: isColorfulStyle ? '#666666' : '#505050',
                            mb: 2,
                          }}
                        >
                          {pkg.duration || `${pkg.durationDays || 0} Days`}
                        </Typography>

                        {/* Price with Discount */}
                        <Box sx={{ mb: 2 }}>
                          {pkg.originalPrice && pkg.originalPrice > pkg.price ? (
                            <>
                              <Typography
                                variant={isColorfulStyle ? "body2" : "h6"}
                                sx={{
                                  textDecoration: 'line-through',
                                  color: '#666666',
                                  opacity: 0.8,
                                  mb: 0.5,
                                }}
                              >
                                TZS {pkg.originalPrice.toLocaleString()}
                              </Typography>
                              <Typography
                                variant={isColorfulStyle ? "h5" : "h3"}
                                sx={{
                                  fontWeight: 700,
                                  color: isColorfulStyle ? colorScheme.color : pkg.color,
                                  mb: 0.5,
                                  fontSize: isColorfulStyle ? { xs: '1.5rem', md: '1.75rem' } : { xs: '2rem', md: '2.5rem' },
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
                              variant={isColorfulStyle ? "h5" : "h3"}
                              sx={{
                                fontWeight: 700,
                                color: isColorfulStyle ? colorScheme.color : '#1A1A1A',
                                fontSize: isColorfulStyle ? { xs: '1.5rem', md: '1.75rem' } : { xs: '2rem', md: '2.5rem' },
                              }}
                            >
                              TZS {pkg.price.toLocaleString()}
                            </Typography>
                          )}
                        </Box>

                        {/* GG Points - Only in colorful style */}
                        {isColorfulStyle && pkg.loyaltyPoints && (
                          <Chip
                            label={`+${pkg.loyaltyPoints} GG Points`}
                            size="small"
                            sx={{
                              backgroundColor: '#F2C94C',
                              color: '#0A0A0A',
                              fontWeight: 600,
                              mb: 2,
                            }}
                          />
                        )}

                        {/* Time-Based Offer Info - Only in detailed style */}
                        {!isColorfulStyle && pkg.isTimeBasedOffer && pkg.offerDescription && (
                          <Alert
                            severity="info"
                            sx={{
                              mb: 2,
                              borderRadius: 2,
                              background: '#FFFFFF',  // White background
                              border: '2px solid #F2C94C',  // Official Gold border
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

                        {/* Description - Only in detailed style */}
                        {!isColorfulStyle && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#1A1A1A',  // Charcoal Black for description
                              mb: 3,
                              minHeight: 40,
                              lineHeight: 1.5,
                              fontWeight: 400,
                            }}
                          >
                            {pkg.description}
                          </Typography>
                        )}

                        {/* Features - Only in detailed style */}
                        {!isColorfulStyle && (
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
                        )}

                        {/* Select/Buy Button */}
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleSelectPackage(pkg)}
                          sx={{
                            backgroundColor: '#F2C94C',
                            color: '#0A0A0A',
                            borderRadius: isColorfulStyle ? '12px' : 3,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            mt: 'auto',  // Push button to bottom
                            '&:hover': {
                              backgroundColor: '#E0B335',
                              boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
                            },
                          }}
                        >
                          {isColorfulStyle ? 'Buy Now' : (selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package')}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
                    );
                  })
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
                    background: 'linear-gradient(90deg, #F2C94C 0%, #E0B335 100%)',
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
                        '&.Mui-active': { color: '#F2C94C' },
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
                        '&.Mui-active': { color: '#F2C94C' },
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
                        '&.Mui-active': { color: '#F2C94C' },
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
                      <CircularProgress size={60} sx={{ color: '#F2C94C', mb: 3 }} />
                      
                      {/* Dynamic Status Title */}
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0B0B0B' }}>
                        {paymentElapsedTime < 10 && '📱 Payment Request Sent'}
                        {paymentElapsedTime >= 10 && paymentElapsedTime < 30 && '⏳ Waiting for Your Response'}
                        {paymentElapsedTime >= 30 && paymentElapsedTime < 50 && '🔄 Processing Payment'}
                        {paymentElapsedTime >= 50 && paymentElapsedTime < 60 && '⚠️ Almost Timeout - Please Complete'}
                        {paymentElapsedTime >= 60 && '⏰ Payment Timeout'}
                      </Typography>
                      
                      {/* Countdown Timer - Prominent 30 Second Warning */}
                      {paymentElapsedTime >= 30 && paymentElapsedTime < 60 && (
                        <Box sx={{ 
                          mb: 4, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          animation: paymentElapsedTime >= 50 ? 'pulse 1s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.05)' }
                          }
                        }}>
                          <Typography variant="caption" sx={{ color: '#8D8D8D', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                            ⏰ Time Remaining
                          </Typography>
                          <Box sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: paymentElapsedTime >= 55 ? 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)' :
                                       paymentElapsedTime >= 50 ? 'linear-gradient(135deg, #FF8A3D 0%, #FF6B1A 100%)' :
                                       'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: paymentElapsedTime >= 50 ? '0 0 30px rgba(231, 76, 60, 0.6)' : '0 4px 20px rgba(242, 201, 76, 0.3)',
                            border: '4px solid',
                            borderColor: paymentElapsedTime >= 55 ? '#E74C3C' :
                                        paymentElapsedTime >= 50 ? '#FF8A3D' : '#F2C94C',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              border: '4px solid',
                              borderColor: paymentElapsedTime >= 55 ? 'rgba(231, 76, 60, 0.3)' :
                                          paymentElapsedTime >= 50 ? 'rgba(255, 138, 61, 0.3)' : 'rgba(242, 201, 76, 0.3)',
                              animation: paymentElapsedTime >= 50 ? 'ripple 2s infinite' : 'none',
                              '@keyframes ripple': {
                                '0%': { transform: 'scale(1)', opacity: 1 },
                                '100%': { transform: 'scale(1.3)', opacity: 0 }
                              }
                            }
                          }}>
                            <Typography 
                              variant="h2" 
                              sx={{ 
                                color: '#FFFFFF',
                                fontWeight: 700,
                                fontSize: '3rem',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                fontFamily: 'monospace',
                                letterSpacing: 2
                              }}
                            >
                              {60 - paymentElapsedTime}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: paymentElapsedTime >= 55 ? '#E74C3C' :
                                    paymentElapsedTime >= 50 ? '#FF8A3D' : '#F2C94C',
                              fontWeight: 700,
                              mt: 1.5,
                              textTransform: 'uppercase',
                              letterSpacing: 1
                            }}
                          >
                            {paymentElapsedTime >= 55 ? '🚨 CRITICAL!' :
                             paymentElapsedTime >= 50 ? '⚠️ URGENT!' : '⏰ HURRY!'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#505050', mt: 0.5, fontWeight: 600 }}>
                            {paymentElapsedTime >= 55 ? 'Complete payment NOW!' :
                             paymentElapsedTime >= 50 ? 'Enter PIN immediately!' : 'Seconds remaining'}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Progress Bar */}
                      <Box sx={{ mb: 3, px: 2 }}>
                        <Box sx={{ 
                          width: '100%', 
                          height: 8, 
                          backgroundColor: '#EDEDED', 
                          borderRadius: 4,
                          overflow: 'hidden',
                          mb: 1
                        }}>
                          <Box sx={{
                            width: `${Math.min((paymentElapsedTime / 60) * 100, 100)}%`,
                            height: '100%',
                            backgroundColor: paymentElapsedTime < 30 ? '#10B981' : 
                                            paymentElapsedTime < 50 ? '#F2C94C' : 
                                            paymentElapsedTime < 60 ? '#FF8A3D' : '#E74C3C',
                            transition: 'width 0.3s ease, background-color 0.3s ease',
                            borderRadius: 4
                          }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" sx={{ color: '#8D8D8D', fontWeight: 600 }}>
                            {paymentElapsedTime}s / 60s
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#8D8D8D' }}>
                            {paymentElapsedTime < 30 ? `${30 - paymentElapsedTime}s until countdown starts` :
                             paymentElapsedTime < 60 ? `${60 - paymentElapsedTime}s remaining` : 'Timeout reached'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Step-by-Step Instructions */}
                      <Box sx={{ mb: 3, textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
                        <Typography variant="body2" sx={{ color: '#0B0B0B', fontWeight: 600, mb: 1.5 }}>
                          📋 What's Happening:
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" sx={{ color: paymentElapsedTime >= 0 ? '#10B981' : '#8D8D8D', mb: 0.5, display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: 8 }}>{paymentElapsedTime >= 0 ? '✅' : '⏳'}</span>
                            Payment request sent to your phone
                          </Typography>
                          <Typography variant="body2" sx={{ color: paymentElapsedTime >= 5 ? '#10B981' : '#8D8D8D', mb: 0.5, display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: 8 }}>{paymentElapsedTime >= 5 ? '✅' : '⏳'}</span>
                            USSD prompt received on your phone
                          </Typography>
                          <Typography variant="body2" sx={{ color: paymentElapsedTime >= 15 ? '#10B981' : '#8D8D8D', mb: 0.5, display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: 8 }}>{paymentElapsedTime >= 15 ? '✅' : '⏳'}</span>
                            Enter your mobile money PIN
                          </Typography>
                          <Typography variant="body2" sx={{ color: paymentElapsedTime >= 25 ? '#10B981' : '#8D8D8D', mb: 0.5, display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: 8 }}>{paymentElapsedTime >= 25 ? '✅' : '⏳'}</span>
                            Payment being processed
                          </Typography>
                          <Typography variant="body2" sx={{ color: paymentElapsedTime >= 35 ? '#10B981' : '#8D8D8D', mb: 0.5, display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: 8 }}>{paymentElapsedTime >= 35 ? '✅' : '⏳'}</span>
                            Confirming payment status
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Progressive Warnings */}
                      <Alert 
                        severity={
                          paymentElapsedTime < 10 ? 'info' :
                          paymentElapsedTime < 30 ? 'info' :
                          paymentElapsedTime < 50 ? 'warning' :
                          paymentElapsedTime < 60 ? 'warning' : 'error'
                        }
                        sx={{ 
                          mb: 2, 
                          borderRadius: 2, 
                          background: paymentElapsedTime < 30 ? '#F0F7FF' :
                                     paymentElapsedTime < 50 ? '#FFF9E6' :
                                     paymentElapsedTime < 60 ? '#FFF3E6' : '#FFEBEE',
                          border: paymentElapsedTime < 30 ? '1px solid #3A8DFF' :
                                 paymentElapsedTime < 50 ? '1px solid #F2C94C' :
                                 paymentElapsedTime < 60 ? '1px solid #FF8A3D' : '1px solid #E74C3C'
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#0B0B0B', fontWeight: 600, mb: 0.5 }}>
                          {paymentElapsedTime < 10 && '📱 Step 1: Check Your Phone'}
                          {paymentElapsedTime >= 10 && paymentElapsedTime < 20 && '📱 Step 2: Look for USSD Prompt'}
                          {paymentElapsedTime >= 20 && paymentElapsedTime < 30 && '🔐 Step 3: Enter Your PIN'}
                          {paymentElapsedTime >= 30 && paymentElapsedTime < 40 && '⏳ Step 4: Payment Processing'}
                          {paymentElapsedTime >= 40 && paymentElapsedTime < 50 && '⚠️ Step 5: Almost Timeout - Complete Now'}
                          {paymentElapsedTime >= 50 && paymentElapsedTime < 55 && '⏰ Step 6: 10 Seconds Left!'}
                          {paymentElapsedTime >= 55 && paymentElapsedTime < 60 && '🚨 Step 7: 5 Seconds Left - Complete Immediately!'}
                          {paymentElapsedTime >= 60 && '⏰ Payment Timeout'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#505050', mb: 1 }}>
                          {paymentElapsedTime < 10 && 'A payment request has been sent to your phone. Please check for the USSD prompt.'}
                          {paymentElapsedTime >= 10 && paymentElapsedTime < 20 && 'You should see a USSD prompt on your phone. If not, check your phone\'s notification or dial *150*00# to check pending transactions.'}
                          {paymentElapsedTime >= 20 && paymentElapsedTime < 30 && 'Please enter your mobile money PIN on your phone to complete the payment. The prompt will expire in ' + (60 - paymentElapsedTime) + ' seconds.'}
                          {paymentElapsedTime >= 30 && paymentElapsedTime < 40 && 'If you\'ve already entered your PIN, the payment is being processed. Please wait for confirmation. Time remaining: ' + (60 - paymentElapsedTime) + ' seconds.'}
                          {paymentElapsedTime >= 40 && paymentElapsedTime < 50 && '⚠️ Payment is taking longer than expected. Please check your phone immediately and complete the payment. Only ' + (60 - paymentElapsedTime) + ' seconds remaining!'}
                          {paymentElapsedTime >= 50 && paymentElapsedTime < 55 && '🚨 URGENT: Only ' + (60 - paymentElapsedTime) + ' seconds left! Please complete the payment on your phone NOW or it will expire!'}
                          {paymentElapsedTime >= 55 && paymentElapsedTime < 60 && '🚨 CRITICAL: Only ' + (60 - paymentElapsedTime) + ' seconds remaining! Complete the payment immediately!'}
                          {paymentElapsedTime >= 60 && 'The USSD prompt has expired after 60 seconds. Please initiate a new payment to try again.'}
                        </Typography>
                        
                        {/* Action Items */}
                        {paymentElapsedTime < 30 && (
                          <Box sx={{ mt: 1.5, p: 1.5, background: 'rgba(58, 141, 255, 0.1)', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: '#0B0B0B', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              ✅ What to do now:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#505050', display: 'block' }}>
                              1. Check your phone for the USSD prompt<br/>
                              2. Enter your mobile money PIN when prompted<br/>
                              3. Confirm the payment amount<br/>
                              4. Wait for confirmation (this page will update automatically)
                            </Typography>
                          </Box>
                        )}
                        
                        {paymentElapsedTime >= 30 && paymentElapsedTime < 50 && (
                          <Box sx={{ mt: 1.5, p: 1.5, background: 'rgba(242, 201, 76, 0.1)', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: '#0B0B0B', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              ⚠️ If you haven't completed payment:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#505050', display: 'block' }}>
                              1. Check your phone immediately<br/>
                              2. Look for the USSD prompt<br/>
                              3. Enter your PIN quickly<br/>
                              4. Only {60 - paymentElapsedTime} seconds remaining!
                            </Typography>
                          </Box>
                        )}
                        
                        {paymentElapsedTime >= 50 && (
                          <Box sx={{ mt: 1.5, p: 1.5, background: 'rgba(255, 138, 61, 0.15)', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: '#E74C3C', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              🚨 URGENT ACTION REQUIRED:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#505050', display: 'block' }}>
                              Complete the payment on your phone NOW!<br/>
                              Only {60 - paymentElapsedTime} seconds left before timeout!
                            </Typography>
                          </Box>
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
                      <Alert severity="warning" sx={{ borderRadius: 2, background: '#FFF9E6', border: '1px solid #F2C94C' }}>
                        <Typography variant="body2" sx={{ color: '#0B0B0B' }}>
                          ⚠️ Do not close this window until payment is complete.
                        </Typography>
                      </Alert>
                      
                      {/* Manual Status Check Button */}
                      <Button
                        variant="outlined"
                        onClick={async () => {
                          if (orderId) {
                            console.log('🔄 Manual status check triggered for order:', orderId);
                            try {
                              const statusResponse = await customerPortalAPI.checkPaymentStatus(orderId);
                              const statusData = statusResponse.data || statusResponse;
                              const paymentStatus = (statusData.payment_status || statusData.paymentStatus || '').toUpperCase();
                              
                              console.log('📊 Manual status check result:', paymentStatus, statusData);
                              
                              if (paymentStatus === 'COMPLETED' || paymentStatus === 'SUCCESS' || paymentStatus === 'SUCCESSFUL') {
                                setPaymentStatus('success');
                                if (statusData.voucher_code || statusData.voucherCode) {
                                  setVoucherCode(statusData.voucher_code || statusData.voucherCode);
                                  toast.success(`✅ Payment successful! Voucher: ${statusData.voucher_code || statusData.voucherCode}`);
                                }
                                if (currentPollingStop) {
                                  currentPollingStop();
                                  setCurrentPollingStop(null);
                                }
                              } else if (['FAILED', 'CANCELLED', 'REFUNDED', 'INSUFFICIENT_BALANCE', 'INVALID_PIN', 
                                         'USER_CANCELLED', 'EXPIRED', 'TIMEOUT', 'NETWORK_ERROR', 'ERROR'].includes(paymentStatus.toUpperCase())) {
                                setPaymentStatus('failed');
                                setPaymentMessage(statusData.message || 'Payment failed');
                                toast.error(statusData.message || 'Payment failed');
                                if (currentPollingStop) {
                                  currentPollingStop();
                                  setCurrentPollingStop(null);
                                }
                              } else {
                                toast(`Status: ${paymentStatus || 'PENDING'}. Still processing...`, {
                                  icon: 'ℹ️'
                                });
                              }
                            } catch (error) {
                              console.error('❌ Manual status check failed:', error);
                              toast.error('Failed to check payment status. Please try again.');
                            }
                          }
                        }}
                        sx={{
                          mt: 2,
                          borderColor: '#F2C94C',
                          color: '#0A0A0A',
                          '&:hover': {
                            borderColor: '#E0B335',
                            backgroundColor: 'rgba(242, 201, 76, 0.1)',
                          },
                        }}
                      >
                        🔄 Check Payment Status
                      </Button>
                      
                      {currentPollingStop && (
                        <Button
                          variant="text"
                          onClick={() => {
                            if (currentPollingStop) {
                              currentPollingStop();
                              setCurrentPollingStop(null);
                              toast('Polling stopped. Click "Check Payment Status" to manually check.', {
                                icon: 'ℹ️'
                              });
                            }
                          }}
                          sx={{
                            mt: 1,
                            color: '#666666',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            },
                          }}
                        >
                          Stop Auto-Check
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
                          border: '1px solid #F2C94C', 
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
                    backgroundColor: '#F2C94C',
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
                      backgroundColor: '#F2C94C',
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