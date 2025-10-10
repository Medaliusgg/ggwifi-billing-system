import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar,
  Tooltip,
  Fab,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { voucherAPI, packageAPI } from '../services/api';

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('single'); // 'single' or 'bulk'
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [statistics, setStatistics] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    packageId: '',
    quantity: 1,
    expirationDays: 30,
    prefix: 'G',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [vouchersResponse, packagesResponse, statsResponse] = await Promise.all([
        voucherAPI.getVoucherStatistics(),
        packageAPI.getAllPackages(),
        voucherAPI.getVoucherStatistics(),
      ]);

      setVouchers(vouchersResponse.data?.vouchers || []);
      setPackages(packagesResponse.data?.packages || []);
      setStatistics(statsResponse.data);
    } catch (err) {
      setError('Failed to load voucher data');
      console.error('Voucher error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type = 'single', voucher = null) => {
    setDialogType(type);
    setSelectedVoucher(voucher);
    setOpenDialog(true);
    
    if (voucher) {
      setFormData({
        packageId: voucher.packageId || '',
        quantity: 1,
        expirationDays: voucher.expirationDays || 30,
        prefix: voucher.prefix || 'G',
        notes: voucher.notes || '',
      });
    } else {
      setFormData({
        packageId: '',
        quantity: 1,
        expirationDays: 30,
        prefix: 'G',
        notes: '',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVoucher(null);
    setFormData({
      packageId: '',
      quantity: 1,
      expirationDays: 30,
      prefix: 'G',
      notes: '',
    });
  };

  const handleGenerateVouchers = async () => {
    try {
      setLoading(true);
      
      if (dialogType === 'single') {
        const response = await voucherAPI.generateVoucher(formData);
        setSnackbar({
          open: true,
          message: 'Voucher generated successfully!',
          severity: 'success',
        });
      } else {
        const response = await voucherAPI.generateBulkVouchers(formData);
        setSnackbar({
          open: true,
          message: `${formData.quantity} vouchers generated successfully!`,
          severity: 'success',
        });
      }
      
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to generate vouchers',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = async (voucherId) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      try {
        await voucherAPI.deleteVoucher(voucherId);
        setSnackbar({
          open: true,
          message: 'Voucher deleted successfully!',
          severity: 'success',
        });
        fetchData();
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Failed to delete voucher',
          severity: 'error',
        });
      }
    }
  };

  const handleCopyVoucherCode = (voucherCode) => {
    navigator.clipboard.writeText(voucherCode);
    setSnackbar({
      open: true,
      message: 'Voucher code copied to clipboard!',
      severity: 'success',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
        return 'success';
      case 'used':
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !vouchers.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Voucher Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate and manage hotspot vouchers
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('single')}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                },
              }}
            >
              Generate Single
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('bulk')}
              sx={{
                background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                },
              }}
            >
              Generate Bulk
            </Button>
          </Box>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {statistics.totalVouchers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Vouchers
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {statistics.activeVouchers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Vouchers
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    {statistics.usedVouchers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Used Vouchers
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {statistics.expiredVouchers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expired Vouchers
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      )}

      {/* Vouchers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Voucher List
            </Typography>
            
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Voucher Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Package</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Expires</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Used By</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                            {voucher.voucherCode}
                          </Typography>
                          <Tooltip title="Copy voucher code">
                            <IconButton
                              size="small"
                              onClick={() => handleCopyVoucherCode(voucher.voucherCode)}
                            >
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {voucher.packageName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatCurrency(voucher.packagePrice)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={voucher.status}
                          color={getStatusColor(voucher.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(voucher.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(voucher.expiresAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {voucher.usedBy || 'Not used'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View details">
                            <IconButton size="small" color="primary">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit voucher">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenDialog('single', voucher)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete voucher">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteVoucher(voucher.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generate Voucher Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'single' ? 'Generate Single Voucher' : 'Generate Bulk Vouchers'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Package</InputLabel>
              <Select
                value={formData.packageId}
                onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                label="Package"
              >
                {packages.map((pkg) => (
                  <MenuItem key={pkg.id} value={pkg.id}>
                    {pkg.name} - {formatCurrency(pkg.price)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {dialogType === 'bulk' && (
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                sx={{ mb: 2 }}
                inputProps={{ min: 1, max: 100 }}
              />
            )}

            <TextField
              fullWidth
              label="Expiration Days"
              type="number"
              value={formData.expirationDays}
              onChange={(e) => setFormData({ ...formData, expirationDays: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
              inputProps={{ min: 1, max: 365 }}
            />

            <TextField
              fullWidth
              label="Prefix"
              value={formData.prefix}
              onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              sx={{ mb: 2 }}
              helperText="Optional prefix for voucher codes"
            />

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleGenerateVouchers} 
            variant="contained"
            disabled={loading || !formData.packageId}
          >
            {loading ? <CircularProgress size={20} /> : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Vouchers; 