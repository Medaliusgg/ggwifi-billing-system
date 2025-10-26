import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  QrCode as QrCodeIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { voucherAPI, packageAPI, paymentAPI, utils } from '../services/api';

const VoucherAuthentication = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Voucher validation states
  const [voucherCode, setVoucherCode] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  
  // Purchase states
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchaseData, setPurchaseData] = useState({
    phoneNumber: '',
    paymentMethod: 'MOBILE_MONEY',
  });
  const [purchaseResult, setPurchaseResult] = useState(null);
  
  // Dialog states
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  useEffect(() => {
    fetchPackages();
    getClientInfo();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await packageAPI.getHotspotPackages();
      setPackages(response.data?.packages || []);
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    }
  };

  const getClientInfo = async () => {
    try {
      // Get client IP and MAC address (simplified for demo)
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIpAddress(data.ip);
      
      // For demo purposes, generate a random MAC address
      const mac = '00:1B:44:11:3A:B7';
      setMacAddress(mac);
    } catch (err) {
      console.error('Failed to get client info:', err);
    }
  };

  const handleValidateVoucher = async () => {
    if (!voucherCode.trim()) {
      setError('Please enter a voucher code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const validationData = {
        voucherCode: voucherCode.trim(),
        macAddress,
        ipAddress,
      };

      const response = await voucherAPI.validateVoucher(validationData);
      
      if (response.data.success) {
        setValidationResult(response.data);
        setSuccess('Voucher validated successfully!');
        setActiveStep(1);
      } else {
        setError(response.data.message || 'Invalid voucher code');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to validate voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateVoucher = async () => {
    if (!validationResult) {
      setError('Please validate a voucher first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const activationData = {
        voucherCode: voucherCode.trim(),
        macAddress,
        ipAddress,
      };

      const response = await voucherAPI.activateVoucher(activationData);
      
      if (response.data.success) {
        setSuccess('Voucher activated successfully! You can now connect to the hotspot.');
        setActiveStep(2);
      } else {
        setError(response.data.message || 'Failed to activate voucher');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to activate voucher');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseVoucher = async () => {
    if (!selectedPackage) {
      setError('Please select a package');
      return;
    }

    if (!purchaseData.phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const purchaseRequest = {
        packageId: selectedPackage.id,
        phoneNumber: purchaseData.phoneNumber.trim(),
        paymentMethod: purchaseData.paymentMethod,
        macAddress,
        ipAddress,
      };

      const response = await voucherAPI.purchaseVoucher(purchaseRequest);
      
      if (response.data.success) {
        setPurchaseResult(response.data);
        setOpenPaymentDialog(true);
      } else {
        setError(response.data.message || 'Failed to initiate purchase');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process purchase');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCallback = async (transactionId) => {
    try {
      setLoading(true);
      
      const response = await paymentAPI.verifyPayment(transactionId);
      
      if (response.data.success) {
        setSuccess('Payment successful! Your voucher has been generated.');
        setOpenPaymentDialog(false);
        setActiveStep(3);
        
        // Auto-fill the voucher code if provided
        if (response.data.voucherCode) {
          setVoucherCode(response.data.voucherCode);
        }
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      setError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyVoucherCode = () => {
    if (validationResult?.voucherCode) {
      navigator.clipboard.writeText(validationResult.voucherCode);
      setSuccess('Voucher code copied to clipboard!');
    }
  };

  const formatCurrency = (amount) => {
    return utils.formatCurrency(amount);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const steps = [
    {
      label: 'Validate Voucher',
      description: 'Enter your voucher code to validate',
    },
    {
      label: 'Activate Voucher',
      description: 'Activate the voucher to connect',
    },
    {
      label: 'Connected',
      description: 'You are now connected to the hotspot',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <WifiIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Hotspot Authentication
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your voucher code or purchase a new voucher to connect
          </Typography>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Voucher Validation */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Validate Voucher
                </Typography>
                
                <TextField
                  fullWidth
                  label="Voucher Code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Enter your voucher code"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleCopyVoucherCode} disabled={!validationResult?.voucherCode}>
                        <CopyIcon />
                      </IconButton>
                    ),
                  }}
                />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Client Information:
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    MAC: {macAddress}
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    IP: {ipAddress}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleValidateVoucher}
                  disabled={loading || !voucherCode.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                    },
                  }}
                >
                  {loading ? 'Validating...' : 'Validate Voucher'}
                </Button>

                {validationResult && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={600} color="success.dark">
                      Voucher Validated Successfully!
                    </Typography>
                    <Typography variant="body2" color="success.dark">
                      Package: {validationResult.packageName}
                    </Typography>
                    <Typography variant="body2" color="success.dark">
                      Duration: {formatDuration(validationResult.timeLimit)}
                    </Typography>
                    <Typography variant="body2" color="success.dark">
                      Data Limit: {validationResult.dataLimit} MB
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Purchase Voucher */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Purchase Voucher
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Package</InputLabel>
                  <Select
                    value={selectedPackage?.id || ''}
                    onChange={(e) => {
                      const pkg = packages.find(p => p.id === e.target.value);
                      setSelectedPackage(pkg);
                    }}
                    label="Select Package"
                  >
                    {packages.map((pkg) => (
                      <MenuItem key={pkg.id} value={pkg.id}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {pkg.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDuration(pkg.timeLimit)} • {pkg.dataLimit}MB • {formatCurrency(pkg.price)}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={purchaseData.phoneNumber}
                  onChange={(e) => setPurchaseData({ ...purchaseData, phoneNumber: e.target.value })}
                  placeholder="Enter your phone number"
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={purchaseData.paymentMethod}
                    onChange={(e) => setPurchaseData({ ...purchaseData, paymentMethod: e.target.value })}
                    label="Payment Method"
                  >
                    <MenuItem value="MOBILE_MONEY">Mobile Money</MenuItem>
                    <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                    <MenuItem value="CASH">Cash</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handlePurchaseVoucher}
                  disabled={loading || !selectedPackage || !purchaseData.phoneNumber.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <CartIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                    },
                  }}
                >
                  {loading ? 'Processing...' : `Purchase for ${selectedPackage ? formatCurrency(selectedPackage.price) : ''}`}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Progress Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card sx={{ mt: 4, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Connection Progress
            </Typography>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                    {index === 1 && validationResult && (
                      <Button
                        variant="contained"
                        onClick={handleActivateVoucher}
                        disabled={loading}
                        sx={{ mt: 1 }}
                      >
                        {loading ? 'Activating...' : 'Activate Voucher'}
                      </Button>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          {purchaseResult && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Please complete your payment to receive your voucher.
              </Typography>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Payment Details:
                </Typography>
                <Typography variant="body2">
                  Amount: {formatCurrency(purchaseResult.amount)}
                </Typography>
                <Typography variant="body2">
                  Transaction ID: {purchaseResult.transactionId}
                </Typography>
                <Typography variant="body2">
                  Payment Method: {purchaseResult.paymentMethod}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2 }}>
                You will receive an SMS with your voucher code once payment is confirmed.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => handlePaymentCallback(purchaseResult?.transactionId)}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Check Payment Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoucherAuthentication; 