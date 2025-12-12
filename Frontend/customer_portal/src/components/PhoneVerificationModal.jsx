import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { customerPortalAPI } from '../services/customerPortalApi';
import GlobalButton from './ui/GlobalButton';
import AnimatedSpinner from './ui/AnimatedSpinner';
import AnimatedNotification from './ui/AnimatedNotification';
import { Phone as PhoneIcon } from '@mui/icons-material';

const PhoneVerificationModal = ({ open, onClose, onVerified, packageId }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, verifying, verified, failed
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleVerify = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');
    setVerificationStatus('verifying');

    try {
      // Check if phone is registered
      const response = await customerPortalAPI.checkPhone(phoneNumber);
      
      if (response?.data?.isRegistered) {
        // Phone is registered, allow payment
        setVerificationStatus('verified');
        setNotification({
          open: true,
          message: 'Phone number verified! Proceeding to payment...',
          severity: 'success',
        });
        setTimeout(() => {
          onVerified(phoneNumber);
          onClose();
        }, 1500);
      } else {
        // Phone not registered, force signup
        setVerificationStatus('failed');
        setNotification({
          open: true,
          message: 'Phone number not registered. Please sign up first.',
          severity: 'warning',
        });
        setTimeout(() => {
          onClose();
          // Redirect to signup with phone pre-filled
          window.location.href = `/signup/phone?phone=${encodeURIComponent(phoneNumber)}`;
        }, 2000);
      }
    } catch (err) {
      setVerificationStatus('failed');
      setError(err?.response?.data?.message || 'Failed to verify phone number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
            Verify Phone Number
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666', mt: 1 }}>
            Please verify your phone number before purchasing
          </Typography>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setError('');
              setVerificationStatus('idle');
            }}
            placeholder="+255 742 844 024"
            disabled={loading}
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: <PhoneIcon sx={{ mr: 1, color: '#666666' }} />,
            }}
          />
          
          {/* Progress Bar Indicator */}
          {verificationStatus !== 'idle' && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {verificationStatus === 'verifying' && (
                  <>
                    <CircularProgress size={16} sx={{ color: '#FFCC00' }} />
                    <Typography variant="caption" sx={{ color: '#666666' }}>
                      Verifying phone number...
                    </Typography>
                  </>
                )}
                {verificationStatus === 'verified' && (
                  <>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#FFFFFF', fontSize: '10px' }}>
                        ✓
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>
                      Phone verified!
                    </Typography>
                  </>
                )}
                {verificationStatus === 'failed' && (
                  <>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#FFFFFF', fontSize: '10px' }}>
                        ✕
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600 }}>
                      Not registered - Please sign up
                    </Typography>
                  </>
                )}
              </Box>
              <LinearProgress
                variant={verificationStatus === 'verifying' ? 'indeterminate' : 'determinate'}
                value={verificationStatus === 'verified' ? 100 : verificationStatus === 'failed' ? 100 : 0}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 
                      verificationStatus === 'verified' ? '#10B981' :
                      verificationStatus === 'failed' ? '#EF4444' : '#FFCC00',
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <GlobalButton
            variant="outlined"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </GlobalButton>
          <GlobalButton
            icon={<PhoneIcon />}
            variant="contained"
            onClick={handleVerify}
            disabled={loading || !phoneNumber.trim()}
          >
            Verify & Continue
          </GlobalButton>
        </DialogActions>
      </Dialog>

      <AnimatedNotification
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
        severity={notification.severity}
      />
    </>
  );
};

export default PhoneVerificationModal;
