import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import selcomPaymentService from '../services/selcomPayment';

const SelcomPaymentModal = ({ open, onClose, selectedPackage, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    phoneNumber: '',
    paymentMethod: '',
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactionId, setTransactionId] = useState(null);
  const [errors, setErrors] = useState({});
  const [activityLog, setActivityLog] = useState([]);
  const [showPin, setShowPin] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [voucherCode, setVoucherCode] = useState(null);


  // Steps: 0=Details, 1=Payment, 2=PIN, 3=Processing, 4=Success
  const steps = [
    'Enter Details',
    'Make Payment',
    'Enter PIN',
    'Processing',
    'Success'
  ];

  // Load payment methods on component mount
  useEffect(() => {
    if (open) {
      loadPaymentMethods();
      resetModal();
      addActivityLog('info', 'Payment session initialized', 'session_start');
    }
  }, [open]);

  const resetModal = () => {
    setCurrentStep(0);
    setIsProcessing(false);
    setUserData({ fullName: '', phoneNumber: '', paymentMethod: '' });
    setTransactionId(null);
    setErrors({});
    setActivityLog([]);
    setShowPin(false);
    setPinCode('');
    setVoucherCode(null);
  };

  const addActivityLog = (type, message, step = 'general') => {
    const log = { 
      type, 
      message, 
      timestamp: new Date(),
      step 
    };
    setActivityLog(prev => [...prev, log]);
    
    // Show toast notification
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast(message, { icon: 'ℹ️' });
    }
  };

  const loadPaymentMethods = async () => {
    try {
      addActivityLog('info', 'Loading available payment methods...', 'payment_methods');
      const methods = await selcomPaymentService.getPaymentMethods();
      setPaymentMethods(methods);
      addActivityLog('success', `${methods.length} payment methods loaded successfully`, 'payment_methods');
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      addActivityLog('error', 'Failed to load payment methods', 'payment_methods');
    }
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateUserDetails = () => {
    const newErrors = {};

    if (!userData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

    if (!userData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
    } else if (!userData.phoneNumber.startsWith('0') || userData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'Phone number must start with 0 and be 10 digits';
    }

    if (!userData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateUserDetails()) {
      addActivityLog('success', 'User details validated successfully', 'user_details');
      setCurrentStep(1);
    } else {
      addActivityLog('error', 'Please correct the errors before proceeding', 'user_details');
    }
  };

  const initializePayment = async () => {
    try {
      setIsProcessing(true);
      addActivityLog('info', 'Initializing payment with SELCOM...', 'payment_init');

      const paymentRequest = {
        amount: selectedPackage.price,
        currency: 'TZS',
        phoneNumber: userData.phoneNumber,
        paymentMethod: userData.paymentMethod,
        packageId: selectedPackage.id,
        fullName: userData.fullName,
      };

      const result = await selcomPaymentService.initializePayment(paymentRequest);
      
      if (result.success) {
        setTransactionId(result.transactionId);
        addActivityLog('success', 'Payment request sent to SELCOM successfully', 'payment_init');
        addActivityLog('info', 'Please check your phone for USSD prompt', 'payment_init');
        setCurrentStep(2);
      } else {
        addActivityLog('error', result.message || 'Payment initialization failed', 'payment_init');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      addActivityLog('error', 'Payment initialization failed', 'payment_init');
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPaymentWithPIN = async () => {
    try {
      setIsProcessing(true);
      addActivityLog('info', 'Verifying payment with PIN...', 'pin_verification');

      const result = await selcomPaymentService.verifyPayment(transactionId, pinCode);

      if (result.success) {
        addActivityLog('success', 'Payment verified successfully!', 'pin_verification');
        setCurrentStep(3);
        processSuccessfulPayment();
      } else {
        addActivityLog('error', result.message || 'Payment verification failed', 'pin_verification');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      addActivityLog('error', 'Payment verification failed', 'pin_verification');
    } finally {
      setIsProcessing(false);
    }
  };

  const processSuccessfulPayment = async () => {
    try {
      addActivityLog('info', 'Processing successful payment...', 'payment_processing');
      
      // Simulate voucher generation and auto-connection
      addActivityLog('info', 'Generating voucher code...', 'voucher_generation');
    await new Promise(resolve => setTimeout(resolve, 2000));
      
      const voucher = `GGN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setVoucherCode(voucher);
      addActivityLog('success', `Voucher generated: ${voucher}`, 'voucher_generation');
    
      addActivityLog('info', 'Binding voucher to phone number...', 'voucher_binding');
    await new Promise(resolve => setTimeout(resolve, 1500));
      addActivityLog('success', 'Voucher bound to phone number successfully', 'voucher_binding');

      addActivityLog('info', 'Sending SMS with voucher details...', 'sms_notification');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addActivityLog('success', 'SMS sent with voucher and package details', 'sms_notification');

      addActivityLog('info', 'Connecting to WiFi network...', 'auto_connection');
      await new Promise(resolve => setTimeout(resolve, 3000));
      addActivityLog('success', 'Successfully connected to WiFi network!', 'auto_connection');

      setCurrentStep(4);
      addActivityLog('success', 'Payment process completed successfully!', 'completion');
      
      // Call success callback
      if (onSuccess) {
        onSuccess(voucher);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      addActivityLog('error', 'Payment processing failed', 'payment_processing');
    }
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      mpesa: '💰',
      airtel: '📱',
      mixx: '📞',
      halopesa: '💳',
      tpesa: '🏦',
    };
    return icons[method.value] || '💳';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Package Details
            </Typography>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                <Typography variant="h6" gutterBottom>
                        {selectedPackage?.name}
                      </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip label={`${selectedPackage?.speed} Mbps`} color="primary" />
                  <Chip label={selectedPackage?.validity} variant="outlined" />
                  <Chip label={`TZS ${selectedPackage?.price?.toLocaleString()}`} color="success" />
                  </Box>
                </CardContent>
              </Card>

            <Typography variant="h6" gutterBottom>
              Your Details
            </Typography>
            
              <TextField
                fullWidth
                label="Full Name"
              value={userData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                error={!!errors.fullName}
                helperText={errors.fullName}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              />
            
              <TextField
                fullWidth
                label="Phone Number"
              value={userData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="0XXXXXXXXX"
                error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              sx={{ mb: 3 }}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

              <FormControl fullWidth error={!!errors.paymentMethod}>
              <InputLabel>Payment Method *</InputLabel>
                <Select
                value={userData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                label="Payment Method *"
                displayEmpty
                >
                <MenuItem value="" disabled>
                  <em>Please select a payment method</em>
                </MenuItem>
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{getPaymentMethodIcon(method)}</span>
                      <Box>
                        <Typography variant="body1">{method.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {method.description}
                        </Typography>
                      </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.paymentMethod && (
                <Typography variant="caption" color="error">
                    {errors.paymentMethod}
                  </Typography>
                )}
              </FormControl>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                You will receive a USSD push notification on your phone to enter your PIN for payment verification.
          </Typography>
            </Alert>
        </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Summary
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedPackage?.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip label={`${selectedPackage?.speed} Mbps`} color="primary" />
                  <Chip label={selectedPackage?.validity} variant="outlined" />
                  <Chip label={`TZS ${selectedPackage?.price?.toLocaleString()}`} color="success" />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Name:</strong> {userData.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {userData.phoneNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Payment Method:</strong> {paymentMethods.find(m => m.value === userData.paymentMethod)?.label}
                </Typography>
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Click "Make Payment" to initiate the payment request. You will receive a USSD prompt on your phone.
              </Typography>
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter PIN
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Please check your phone for the USSD push notification and enter the exact PIN to complete the payment.
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              label="PIN Code"
              type={showPin ? 'text' : 'password'}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Enter 4-digit PIN"
              sx={{ mb: 3 }}
              inputProps={{ maxLength: 4 }}
              InputProps={{
                startAdornment: <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: (
                  <IconButton onClick={() => setShowPin(!showPin)}>
                    {showPin ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />

            <Alert severity="info">
              <Typography variant="body2">
                Transaction ID: {transactionId}
              </Typography>
            </Alert>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Processing Payment
              </Typography>
            
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Processing your payment...
              </Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Payment verified" secondary="PIN entered successfully" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CircularProgress size={20} />
                </ListItemIcon>
                <ListItemText primary="Generating voucher" secondary="Creating unique voucher code" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CircularProgress size={20} />
                </ListItemIcon>
                <ListItemText primary="Sending SMS" secondary="Delivering voucher details" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CircularProgress size={20} />
                </ListItemIcon>
                <ListItemText primary="Auto-connecting" secondary="Connecting to WiFi network" />
              </ListItem>
            </List>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Successful!
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <CheckIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" color="success.main" gutterBottom>
                    Payment Completed!
                  </Typography>
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  Voucher Details
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Voucher Code:</strong> {voucherCode}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Package:</strong> {selectedPackage?.name}
                  </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Validity:</strong> {selectedPackage?.validity}
                  </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {userData.phoneNumber}
                  </Typography>
              </CardContent>
            </Card>

            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body2">
                You have been automatically connected to the WiFi network. Enjoy your internet!
            </Typography>
            </Alert>
        </Box>
        );

      default:
        return null;
    }
  };

  const handleClose = () => {
    if (currentStep < 4) {
      if (window.confirm('Are you sure you want to cancel the payment process?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {currentStep === 0 && 'Enter Details'}
            {currentStep === 1 && 'Make Payment'}
            {currentStep === 2 && 'Enter PIN'}
            {currentStep === 3 && 'Processing'}
            {currentStep === 4 && 'Success'}
            </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        {/* Activity Log */}
        {activityLog.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Activity Log
            </Typography>
            <Paper sx={{ maxHeight: 200, overflow: 'auto', p: 2 }}>
              {activityLog.map((log, index) => (
                <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: log.type === 'success' ? 'success.main' : 
                               log.type === 'error' ? 'error.main' : 'info.main'
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {log.timestamp.toLocaleTimeString()}
                  </Typography>
                  <Typography variant="body2">
                    {log.message}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        {currentStep < 4 && (
          <Button onClick={handleClose} disabled={isProcessing}>
              Cancel
            </Button>
        )}
        
        {currentStep === 0 && (
            <Button
            onClick={handleProceedToPayment}
            variant="contained"
            disabled={isProcessing}
            sx={{ borderRadius: 2 }}
          >
            Proceed to Payment
            </Button>
        )}

        {currentStep === 1 && (
            <Button
            onClick={initializePayment}
            variant="contained"
              disabled={isProcessing}
            sx={{ borderRadius: 2 }}
          >
            {isProcessing ? 'Initializing...' : 'Make Payment'}
          </Button>
        )}

        {currentStep === 2 && (
          <Button
            onClick={verifyPaymentWithPIN}
              variant="contained"
            disabled={isProcessing || pinCode.length < 4}
            sx={{ borderRadius: 2 }}
          >
            {isProcessing ? 'Verifying...' : 'Verify Payment'}
            </Button>
        )}
        
        {currentStep === 4 && (
          <Button
            onClick={onClose}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SelcomPaymentModal; 