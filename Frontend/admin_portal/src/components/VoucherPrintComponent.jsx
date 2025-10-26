import React from 'react';
import { Box, Typography, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import { Print as PrintIcon, Close as CloseIcon } from '@mui/icons-material';

const VoucherPrintComponent = ({ vouchers }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Print styles
  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      .voucher-print, .voucher-print * {
        visibility: visible;
      }
      .voucher-print {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .no-print {
        display: none !important;
      }
    }
  `;

  return (
    <Box>
      <style>{printStyles}</style>
      
      {/* Print Button */}
      <Box className="no-print" sx={{ mb: 2, textAlign: 'center' }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ bgcolor: 'gg.yellow', color: 'black' }}
        >
          Print Vouchers
        </Button>
      </Box>

      {/* Voucher Print Layout */}
      <Box className="voucher-print">
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}>
          GGWiFi Voucher System
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 3,
          '@media print': {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            pageBreakInside: 'avoid'
          }
        }}>
          {vouchers.map((voucher, index) => (
            <Box
              key={voucher.voucherCode || index}
              sx={{
                border: '2px solid #000',
                borderRadius: 2,
                p: 2,
                backgroundColor: '#fff',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '@media print': {
                  border: '2px solid #000',
                  pageBreakInside: 'avoid',
                  marginBottom: '10px'
                }
              }}
            >
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                  GGWiFi
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#666' }}>
                  Internet Voucher
                </Typography>
              </Box>

              {/* Voucher Code */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  Voucher Code
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    color: '#000'
                  }}
                >
                  {voucher.voucherCode || `GG${String(index + 1).padStart(6, '0')}`}
                </Typography>
              </Box>

              {/* Package Details */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Package:</Typography>
                  <Typography variant="body2">{voucher.packageName || 'Premium Plan'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Speed:</Typography>
                  <Typography variant="body2">{voucher.speed || '10 Mbps'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Duration:</Typography>
                  <Typography variant="body2">{voucher.duration || '30 Days'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Amount:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                    {formatCurrency(voucher.amount || 10000)}
                  </Typography>
                </Box>
              </Box>

              {/* Instructions */}
              <Box sx={{ 
                borderTop: '1px solid #ddd', 
                pt: 1, 
                textAlign: 'center' 
              }}>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Present this voucher to redeem your internet package
                </Typography>
                <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
                  Valid until: {formatDate(voucher.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}
                </Typography>
              </Box>

              {/* Logo Placeholder */}
              <Box sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                width: 40,
                height: 40,
                backgroundColor: '#FFD700',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000' }}>
                  GG
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: 4, 
          pt: 2, 
          borderTop: '1px solid #ddd',
          '@media print': {
            pageBreakInside: 'avoid'
          }
        }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Generated on: {new Date().toLocaleDateString('en-TZ')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            GGWiFi - Your Internet, Your Way
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VoucherPrintComponent;
