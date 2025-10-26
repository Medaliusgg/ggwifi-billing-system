import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  CheckCircle as CheckIcon,
  ArrowBack as ArrowBackIcon,
  Speed as SpeedIcon,
  Timer as TimerIcon,
  SignalCellular4Bar as SignalIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { mockValidateVoucher, mockConnectWithVoucher } from '../services/mockApi';

const QuickConnect = ({ onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [voucherCode, setVoucherCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus on first input when component mounts
  useEffect(() => {
    if (inputRef.current && inputRef.current[0]) {
      inputRef.current[0].focus();
    }
  }, []);

  // Connect mutation
  const connectMutation = useMutation(
    async (code) => {
      // Validate voucher
      const validation = await mockValidateVoucher(code);
      if (!validation.isValid) {
        throw new Error(validation.message || 'Invalid voucher code');
      }

      // Connect with voucher
      const connection = await mockConnectWithVoucher({
        voucherCode: code,
        phoneNumber: 'auto', // Auto-detect from voucher
      });

      return { validation, connection };
    },
    {
      onSuccess: (data) => {
        setConnectionResult(data);
        setShowSuccessModal(true);
        toast.success('Connected successfully!');
      },
      onError: (error) => {
        toast.error(error.message || 'Connection failed');
      },
      onSettled: () => {
        setIsConnecting(false);
      },
    }
  );

  const handleConnect = () => {
    try {
      console.log('Connect button clicked. Voucher code:', voucherCode);
      
      if (!voucherCode || voucherCode.length !== 6) {
        toast.error('Please enter a complete 6-character voucher code');
        return;
      }

      // Validate hexadecimal format
      if (!/^[0-9A-F]{6}$/.test(voucherCode)) {
        toast.error('Voucher code must be 6 hexadecimal characters (0-9, A-F)');
        return;
      }

      console.log('Validating voucher code:', voucherCode);
      setIsConnecting(true);
      connectMutation.mutate(voucherCode);
    } catch (error) {
      console.error('Error in handleConnect:', error);
      toast.error('An error occurred while connecting. Please try again.');
      setIsConnecting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <WifiIcon sx={{ 
              fontSize: 64, 
              color: theme.palette.primary.main,
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3))',
            }} />
          </motion.div>
          
          <Typography variant="h4" sx={{ 
            mb: 2, 
            fontWeight: 700,
            background: theme.custom.gradients.primary,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Hotspot Quick Connect
          </Typography>
          
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary,
            mb: 3,
          }}>
            Enter your voucher code to connect to WiFi hotspot instantly
          </Typography>
        </Box>

        {/* Voucher Input */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          mb: 3,
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              Enter Voucher Code
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              justifyContent: 'center',
              mb: 2,
            }}>
              {Array.from({ length: 6 }, (_, index) => (
                <TextField
                  key={index}
                  inputRef={el => {
                    if (!inputRef.current) inputRef.current = [];
                    inputRef.current[index] = el;
                  }}
                  value={voucherCode[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (/^[0-9A-Fa-f]$/.test(value) || value === '') {
                      const newCode = voucherCode.split('');
                      newCode[index] = value;
                      setVoucherCode(newCode.join(''));
                      
                      // Auto-navigate to next field
                      if (value && index < 5) {
                        inputRef.current[index + 1]?.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !voucherCode[index] && index > 0) {
                      inputRef.current[index - 1]?.focus();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData.getData('text').toUpperCase();
                    const hexChars = pastedData.match(/[0-9A-F]/g) || [];
                    const newCode = Array(6).fill('');
                    hexChars.slice(0, 6).forEach((char, i) => {
                      newCode[i] = char;
                    });
                    setVoucherCode(newCode.join(''));
                    
                    // Focus on next empty field or last field
                    const nextEmptyIndex = newCode.findIndex(char => !char);
                    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
                    inputRef.current[focusIndex]?.focus();
                  }}
                  variant="outlined"
                  size="large"
                  autoComplete="off"
                  inputProps={{
                    maxLength: 1,
                    style: {
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontFamily: 'monospace',
                    }
                  }}
                  sx={{
                    width: '60px',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.text.primary,
                      padding: '16px 8px',
                    },
                  }}
                />
              ))}
            </Box>
            
            <Typography variant="body2" sx={{ 
              mt: 1.5, 
              textAlign: 'center',
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
            }}>
              Enter 6 hexadecimal characters (0-9, A-F)
            </Typography>
          </CardContent>
        </Card>

        {/* Connect Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleConnect}
            disabled={!voucherCode || voucherCode.length !== 6 || isConnecting}
            startIcon={isConnecting ? <CircularProgress size={20} /> : <WifiIcon />}
            sx={{
              background: theme.custom.gradients.primary,
              borderRadius: 3,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: theme.custom.gradients.primary,
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(25, 118, 210, 0.4)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {isConnecting ? 'Connecting...' : 'Connect Now'}
          </Button>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              mt: 2,
              borderRadius: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: theme.palette.text.secondary,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              },
            }}
          >
            Back to Home
          </Button>
        </motion.div>

        {/* Success Modal */}
        <Dialog
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckIcon sx={{ color: 'success.main', fontSize: 28 }} />
              <Typography variant="h6" fontWeight={600}>
                Connected Successfully!
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent>
            {connectionResult && (
              <Box>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  You are now connected to GGNetworks WiFi and can start browsing the internet.
                </Typography>
                
                <Box sx={{ 
                  background: 'rgba(76, 175, 80, 0.1)', 
                  p: 3, 
                  borderRadius: 3,
                  mb: 3,
                }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Connection Details
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SpeedIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">
                      <strong>Speed:</strong> {connectionResult.validation.packageDetails?.speed || 'High Speed'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SignalIcon sx={{ color: 'success.main' }} />
                    <Typography variant="body2">
                      <strong>Status:</strong> Connected
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TimerIcon sx={{ color: 'info.main' }} />
                    <Typography variant="body2">
                      <strong>Valid Until:</strong> {connectionResult.validation.packageDetails?.validity || '30 days'}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Enjoy your high-speed internet connection! You can now browse, stream, and work without interruptions.
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setShowSuccessModal(false)}
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Got it!
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default QuickConnect; 