import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../components/GlobalHeader';

const VoucherLoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...voucherCode];
    newCode[index] = value.toUpperCase();
    setVoucherCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !voucherCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).toUpperCase();
    const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setVoucherCode(newCode.slice(0, 6));
    if (pastedData.length >= 6) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleConnect = () => {
    const code = voucherCode.join('');
    if (code.length === 6) {
      // TODO: Implement voucher authentication
      console.log('Connecting with voucher:', code);
      // Navigate to dashboard or handle connection
    }
  };

  const isCodeComplete = voucherCode.every((char) => char !== '');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F9FC' }}>
      <GlobalHeader isAuthenticated={false} />

      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FC 100%)',
              border: '1px solid #EEEEEE',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 1,
                  color: '#0A0A0A',
                }}
              >
                Enter Voucher Code
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  color: '#666666',
                }}
              >
                Enter your 6-digit voucher code to connect
              </Typography>

              {/* Voucher Input Boxes */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1.5,
                  mb: 4,
                }}
              >
                {voucherCode.map((char, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={char}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      },
                    }}
                    sx={{
                      width: { xs: 45, md: 60 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid',
                        borderColor: char ? '#48C7F2' : '#EEEEEE',
                        '&:hover': {
                          borderColor: '#48C7F2',
                        },
                        '&.Mui-focused': {
                          borderColor: '#48C7F2',
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Connect Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleConnect}
                disabled={!isCodeComplete}
                sx={{
                  backgroundColor: isCodeComplete ? '#48BB78' : '#CCCCCC',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '18px',
                  mb: 3,
                  '&:hover': {
                    backgroundColor: isCodeComplete ? '#38A169' : '#CCCCCC',
                  },
                }}
              >
                CONNECT NOW
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 4,
            justifyContent: 'center',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate('/plans')}
            sx={{
              borderColor: '#007BFF',
              color: '#007BFF',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '12px',
              '&:hover': {
                borderColor: '#0056B3',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
              },
            }}
          >
            BUY PACKAGES
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/home')}
            sx={{
              borderColor: '#48C7F2',
              color: '#48C7F2',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '12px',
              '&:hover': {
                borderColor: '#38B2D0',
                backgroundColor: 'rgba(72, 199, 242, 0.1)',
              },
            }}
          >
            HOME
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default VoucherLoginPage;
