import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Timer as TimerIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

const VoucherGenerator = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    duration: 24, // hours
    dataLimit: 1, // GB
    price: 1000, // TZS
    quantity: 1,
    prefix: 'GG',
    status: 'ACTIVE',
  });

  const [bulkData, setBulkData] = useState({
    quantity: 10,
    prefix: 'GG',
    duration: 24,
    dataLimit: 1,
    price: 1000,
  });

  const loadVouchers = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      const mockVouchers = [
        {
          id: 1,
          code: 'GG001234',
          description: '24h Internet Access',
          duration: 24,
          dataLimit: 1,
          price: 1000,
          status: 'ACTIVE',
          createdAt: new Date(),
          usedBy: null,
          usedAt: null,
        },
        {
          id: 2,
          code: 'GG001235',
          description: '7 Days Internet',
          duration: 168,
          dataLimit: 5,
          price: 5000,
          status: 'USED',
          createdAt: new Date(Date.now() - 86400000),
          usedBy: 'John Doe',
          usedAt: new Date(Date.now() - 3600000),
        },
      ];
      
      setVouchers(mockVouchers);
    } catch (error) {
      enqueueSnackbar('Failed to load vouchers', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  const generateVoucherCode = (prefix = 'GG') => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handleGenerateSingle = async () => {
    try {
      setLoading(true);
      
      const newVoucher = {
        id: Date.now(),
        code: generateVoucherCode(formData.prefix),
        description: formData.description,
        duration: formData.duration,
        dataLimit: formData.dataLimit,
        price: formData.price,
        status: 'ACTIVE',
        createdAt: new Date(),
        usedBy: null,
        usedAt: null,
      };

      setVouchers([newVoucher, ...vouchers]);
      setDialogOpen(false);
      enqueueSnackbar('Voucher generated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to generate voucher', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGenerate = async () => {
    try {
      setLoading(true);
      
      const newVouchers = [];
      for (let i = 0; i < bulkData.quantity; i++) {
        newVouchers.push({
          id: Date.now() + i,
          code: generateVoucherCode(bulkData.prefix),
          description: `${bulkData.duration}h Internet Access`,
          duration: bulkData.duration,
          dataLimit: bulkData.dataLimit,
          price: bulkData.price,
          status: 'ACTIVE',
          createdAt: new Date(),
          usedBy: null,
          usedAt: null,
        });
      }

      setVouchers([...newVouchers, ...vouchers]);
      setBulkDialogOpen(false);
      enqueueSnackbar(`${bulkData.quantity} vouchers generated successfully`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to generate vouchers', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = async (voucherId) => {
    try {
      setVouchers(vouchers.filter(v => v.id !== voucherId));
      enqueueSnackbar('Voucher deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete voucher', { variant: 'error' });
    }
  };

  const handleShowQR = (voucher) => {
    setSelectedVoucher(voucher);
    setQrDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'USED':
        return 'warning';
      case 'EXPIRED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Voucher Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate and manage hotspot vouchers
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadVouchers}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              },
            }}
          >
            Generate Voucher
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setBulkDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
              },
            }}
          >
            Bulk Generate
          </Button>
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {vouchers.filter(v => v.status === 'ACTIVE').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Vouchers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {vouchers.filter(v => v.status === 'USED').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Used Vouchers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {vouchers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Vouchers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="info.main">
                TZS {vouchers.reduce((sum, v) => sum + v.price, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Vouchers Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {vouchers.map((voucher) => (
            <Grid item xs={12} sm={6} md={4} key={voucher.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ReceiptIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {voucher.code}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {voucher.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={voucher.status}
                        color={getStatusColor(voucher.status)}
                        size="small"
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {voucher.duration}h
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Data Limit
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {voucher.dataLimit} GB
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Price
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          TZS {voucher.price.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Created
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {new Date(voucher.createdAt).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {voucher.usedBy ? `Used by: ${voucher.usedBy}` : 'Not used'}
                      </Typography>
                      <Box>
                        <Tooltip title="Show QR Code">
                          <IconButton size="small" onClick={() => handleShowQR(voucher)}>
                            <QrCodeIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Voucher">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteVoucher(voucher.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Single Voucher Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate Single Voucher</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prefix"
                value={formData.prefix}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (hours)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Limit (GB)"
                type="number"
                value={formData.dataLimit}
                onChange={(e) => setFormData({ ...formData, dataLimit: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (TZS)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateSingle}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              },
            }}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Generation Dialog */}
      <Dialog open={bulkDialogOpen} onClose={() => setBulkDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Generate Vouchers</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={bulkData.quantity}
                onChange={(e) => setBulkData({ ...bulkData, quantity: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prefix"
                value={bulkData.prefix}
                onChange={(e) => setBulkData({ ...bulkData, prefix: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (hours)"
                type="number"
                value={bulkData.duration}
                onChange={(e) => setBulkData({ ...bulkData, duration: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Limit (GB)"
                type="number"
                value={bulkData.dataLimit}
                onChange={(e) => setBulkData({ ...bulkData, dataLimit: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (TZS)"
                type="number"
                value={bulkData.price}
                onChange={(e) => setBulkData({ ...bulkData, price: parseInt(e.target.value) })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBulkGenerate}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
              },
            }}
          >
            Generate {bulkData.quantity} Vouchers
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>QR Code - {selectedVoucher?.code}</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box
              sx={{
                width: 200,
                height: 200,
                border: '2px solid #e0e0e0',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                QR Code Placeholder
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={600}>
              {selectedVoucher?.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedVoucher?.description}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              },
            }}
          >
            Download QR
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoucherGenerator; 