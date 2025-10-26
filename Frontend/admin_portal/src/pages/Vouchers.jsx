import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Grid,
  Alert,
  CircularProgress,
  TablePagination,
  InputAdornment,
  Switch,
  FormControlLabel,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  QrCode as QrCodeIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Speed as SpeedIcon,
  Wifi as WifiIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import apiClient from '/src/api/client.js';

const VoucherManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [packageFilter, setPackageFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeStep, setActiveStep] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    voucherCode: '',
    packageId: '',
    price: '',
    duration: '',
    isActive: true,
    expiresAt: '',
    maxUses: 1,
    description: '',
  });

  // Bulk generation form
  const [bulkFormData, setBulkFormData] = useState({
    quantity: 10,
    packageId: '',
    prefix: 'GG',
    price: '',
    duration: '',
    expiresAt: '',
    description: '',
  });

  // Fetch vouchers with React Query
  const { data: vouchersData, isLoading, error, refetch } = useQuery({
    queryKey: ['vouchers', page, rowsPerPage, searchTerm, statusFilter, packageFilter],
    queryFn: async () => {
      const response = await apiClient.get('/vouchers');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch packages for dropdown
  const { data: packagesData } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const response = await apiClient.get('/packages');
      return response.data;
    },
  });

  // Create voucher mutation
  const createVoucherMutation = useMutation({
    mutationFn: async (voucherData) => {
      const response = await apiClient.post('/vouchers', voucherData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vouchers']);
      enqueueSnackbar('Voucher created successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create voucher', { variant: 'error' });
    },
  });

  // Bulk voucher generation mutation
  const bulkCreateVoucherMutation = useMutation({
    mutationFn: async (bulkData) => {
      const response = await apiClient.post('/vouchers/bulk', bulkData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vouchers']);
      enqueueSnackbar('Bulk vouchers created successfully', { variant: 'success' });
      handleCloseBulkDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create bulk vouchers', { variant: 'error' });
    },
  });

  // Update voucher mutation
  const updateVoucherMutation = useMutation({
    mutationFn: async ({ id, voucherData }) => {
      const response = await apiClient.put(`/vouchers/${id}`, voucherData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vouchers']);
      enqueueSnackbar('Voucher updated successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update voucher', { variant: 'error' });
    },
  });

  // Delete voucher mutation
  const deleteVoucherMutation = useMutation({
    mutationFn: async (voucherId) => {
      const response = await apiClient.delete(`/vouchers/${voucherId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vouchers']);
      enqueueSnackbar('Voucher deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete voucher', { variant: 'error' });
    },
  });

  // Filter and paginate vouchers
  const filteredVouchers = React.useMemo(() => {
    if (!vouchersData?.vouchers) return [];
    
    let filtered = vouchersData.vouchers;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(voucher =>
        voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(voucher => voucher.status === statusFilter);
    }
    
    // Filter by package
    if (packageFilter !== 'ALL') {
      filtered = filtered.filter(voucher => voucher.packageId === packageFilter);
    }
    
    return filtered;
  }, [vouchersData?.vouchers, searchTerm, statusFilter, packageFilter]);

  const paginatedVouchers = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredVouchers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredVouchers, page, rowsPerPage]);

  const handleOpenDialog = (voucher = null) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        voucherCode: voucher.voucherCode || '',
        packageId: voucher.packageId || '',
        price: voucher.price || '',
        duration: voucher.duration || '',
        isActive: voucher.isActive !== undefined ? voucher.isActive : true,
        expiresAt: voucher.expiresAt || '',
        maxUses: voucher.maxUses || 1,
        description: voucher.description || '',
      });
    } else {
      setEditingVoucher(null);
      setFormData({
        voucherCode: '',
        packageId: '',
        price: '',
        duration: '',
        isActive: true,
        expiresAt: '',
        maxUses: 1,
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVoucher(null);
    setFormData({
      voucherCode: '',
      packageId: '',
      price: '',
      duration: '',
      isActive: true,
      expiresAt: '',
      maxUses: 1,
      description: '',
    });
  };

  const handleOpenBulkDialog = () => {
    setBulkFormData({
      quantity: 10,
      packageId: '',
      prefix: 'GG',
      price: '',
      duration: '',
      expiresAt: '',
      description: '',
    });
    setOpenBulkDialog(true);
    setActiveStep(0);
  };

  const handleCloseBulkDialog = () => {
    setOpenBulkDialog(false);
    setActiveStep(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVoucher) {
      updateVoucherMutation.mutate({
        id: editingVoucher.id,
        voucherData: formData
      });
    } else {
      createVoucherMutation.mutate(formData);
    }
  };

  const handleBulkSubmit = () => {
    bulkCreateVoucherMutation.mutate(bulkFormData);
  };

  const handleDeleteVoucher = (voucherId) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      deleteVoucherMutation.mutate(voucherId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBulkInputChange = (e) => {
    const { name, value } = e.target;
    setBulkFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckIcon />;
      case 'USED':
        return <CheckIcon />;
      case 'EXPIRED':
        return <CancelIcon />;
      case 'INACTIVE':
        return <CancelIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return '#4CAF50'; // Green
      case 'USED':
        return '#2196F3'; // Blue
      case 'EXPIRED':
        return '#F44336'; // Red
      case 'INACTIVE':
        return '#9E9E9E'; // Gray
      default:
        return '#FF9800'; // Orange
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Copied to clipboard', { variant: 'success' });
  };

  const canManageVouchers = hasPermission('MANAGE_VOUCHERS');

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load vouchers: {error.message}
        </Alert>
        <Button onClick={() => refetch()} startIcon={<RefreshIcon />}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Voucher Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage hotspot vouchers and bulk generation
          </Typography>
        </Box>
        
        {canManageVouchers && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderColor: '#F5B700',
                color: '#F5B700',
                '&:hover': {
                  borderColor: '#FFCB00',
                  bgcolor: '#F5B70015',
                }
              }}
            >
              Add Voucher
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleOpenBulkDialog}
              sx={{
                background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                color: '#000000',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(245, 183, 0, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFCB00 30%, #F5B700 90%)',
                  boxShadow: '0 6px 20px rgba(245, 183, 0, 0.4)',
                }
              }}
            >
              Bulk Generate
            </Button>
          </Box>
        )}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #F5B70015, #FFCB0005)',
              border: '1px solid #F5B70020',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#F5B700' }}>
                      {vouchersData?.vouchers?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Vouchers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#F5B700', color: '#000000' }}>
                    <ReceiptIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4CAF5015, #4CAF5005)',
              border: '1px solid #4CAF5020',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                      {vouchersData?.vouchers?.filter(v => v.status === 'ACTIVE').length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Vouchers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#4CAF50', color: '#FFFFFF' }}>
                    <CheckIcon />
                  </Avatar>
                </Box>
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
            <Card sx={{ 
              background: 'linear-gradient(135deg, #2196F315, #2196F305)',
              border: '1px solid #2196F320',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                      {vouchersData?.vouchers?.filter(v => v.status === 'USED').length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Used Vouchers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2196F3', color: '#FFFFFF' }}>
                    <CheckIcon />
                  </Avatar>
                </Box>
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
            <Card sx={{ 
              background: 'linear-gradient(135deg, #F4433615, #F4433605)',
              border: '1px solid #F4433620',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#F44336' }}>
                      {vouchersData?.vouchers?.filter(v => v.status === 'EXPIRED').length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expired Vouchers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#F44336', color: '#FFFFFF' }}>
                    <CancelIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search vouchers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="USED">Used</MenuItem>
                  <MenuItem value="EXPIRED">Expired</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Package Filter</InputLabel>
                <Select
                  value={packageFilter}
                  onChange={(e) => setPackageFilter(e.target.value)}
                  label="Package Filter"
                >
                  <MenuItem value="ALL">All Packages</MenuItem>
                  {packagesData?.packages?.map(pkg => (
                    <MenuItem key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Vouchers Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Voucher Code</TableCell>
                  <TableCell>Package</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Uses</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : paginatedVouchers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No vouchers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVouchers.map((voucher, index) => (
                    <motion.tr
                      key={voucher.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#F5B700', color: '#000000' }}>
                            <ReceiptIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                              {voucher.voucherCode}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {voucher.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {packagesData?.packages?.find(p => p.id === voucher.packageId)?.name || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          TZS {voucher.price?.toLocaleString() || '0'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {voucher.duration || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={voucher.status}
                          icon={getStatusIcon(voucher.status)}
                          sx={{
                            bgcolor: getStatusColor(voucher.status),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {voucher.expiresAt ? new Date(voucher.expiresAt).toLocaleDateString() : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {voucher.usedCount || 0}/{voucher.maxUses || 1}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Copy Code">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => copyToClipboard(voucher.voucherCode)}
                            >
                              <CopyIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print QR">
                            <IconButton size="small" color="info">
                              <QrCodeIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="info">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          {canManageVouchers && (
                            <>
                              <Tooltip title="Edit Voucher">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenDialog(voucher)}
                                >
                                  <EditIcon />
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
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredVouchers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Single Voucher Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingVoucher ? 'Edit Voucher' : 'Add New Voucher'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Voucher Code"
                  name="voucherCode"
                  value={formData.voucherCode}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., GG123456"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Package</InputLabel>
                  <Select
                    name="packageId"
                    value={formData.packageId}
                    onChange={handleInputChange}
                    label="Package"
                  >
                    {packagesData?.packages?.map(pkg => (
                      <MenuItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - TZS {pkg.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (TZS)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 day, 1 week"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Uses"
                  name="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expires At"
                  name="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                    />
                  }
                  label="Active Voucher"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createVoucherMutation.isPending || updateVoucherMutation.isPending}
              sx={{
                background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                color: '#000000',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFCB00 30%, #F5B700 90%)',
                }
              }}
            >
              {(createVoucherMutation.isPending || updateVoucherMutation.isPending) ? (
                <CircularProgress size={20} />
              ) : (
                editingVoucher ? 'Update Voucher' : 'Create Voucher'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Bulk Generation Dialog */}
      <Dialog 
        open={openBulkDialog} 
        onClose={handleCloseBulkDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Bulk Voucher Generation</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Generation Settings</StepLabel>
                <StepContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={bulkFormData.quantity}
                        onChange={handleBulkInputChange}
                        required
                        inputProps={{ min: 1, max: 1000 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Prefix"
                        name="prefix"
                        value={bulkFormData.prefix}
                        onChange={handleBulkInputChange}
                        placeholder="e.g., GG"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Package</InputLabel>
                        <Select
                          name="packageId"
                          value={bulkFormData.packageId}
                          onChange={handleBulkInputChange}
                          label="Package"
                        >
                          {packagesData?.packages?.map(pkg => (
                            <MenuItem key={pkg.id} value={pkg.id}>
                              {pkg.name} - TZS {pkg.price}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(1)}
                      sx={{
                        background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                        color: '#000000',
                        fontWeight: 700,
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Voucher Details</StepLabel>
                <StepContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Price (TZS)"
                        name="price"
                        type="number"
                        value={bulkFormData.price}
                        onChange={handleBulkInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Duration"
                        name="duration"
                        value={bulkFormData.duration}
                        onChange={handleBulkInputChange}
                        placeholder="e.g., 1 day, 1 week"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Expires At"
                        name="expiresAt"
                        type="datetime-local"
                        value={bulkFormData.expiresAt}
                        onChange={handleBulkInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={bulkFormData.description}
                        onChange={handleBulkInputChange}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleBulkSubmit}
                      disabled={bulkCreateVoucherMutation.isPending}
                      sx={{
                        background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                        color: '#000000',
                        fontWeight: 700,
                      }}
                    >
                      {bulkCreateVoucherMutation.isPending ? (
                        <CircularProgress size={20} />
                      ) : (
                        `Generate ${bulkFormData.quantity} Vouchers`
                      )}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseBulkDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoucherManagement;