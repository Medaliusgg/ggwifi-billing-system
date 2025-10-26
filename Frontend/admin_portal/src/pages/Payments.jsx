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
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  PhoneAndroid as PhoneAndroidIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  QrCode as QrCodeIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Wifi as WifiIcon,
  Router as RouterIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import apiClient from '/src/api/client.js';

const PaymentManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    paymentMethod: 'MOBILE_MONEY',
    gateway: 'ZENOPAY',
    reference: '',
    description: '',
    status: 'PENDING',
    transactionId: '',
    fees: 0,
    currency: 'TZS',
    metadata: {},
  });

  // Fetch payments with React Query
  const { data: paymentsData, isLoading, error, refetch } = useQuery({
    queryKey: ['payments', page, rowsPerPage, searchTerm, statusFilter, methodFilter],
    queryFn: async () => {
      const response = await apiClient.get('/payments');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch customers for dropdown
  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await apiClient.get('/customers');
      return response.data;
    },
  });

  // Fetch payment gateways
  const { data: gatewaysData } = useQuery({
    queryKey: ['payment-gateways'],
    queryFn: async () => {
      const response = await apiClient.get('/payment-gateways');
      return response.data;
    },
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      const response = await apiClient.post('/payments', paymentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      enqueueSnackbar('Payment created successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create payment', { variant: 'error' });
    },
  });

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, paymentData }) => {
      const response = await apiClient.put(`/payments/${id}`, paymentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      enqueueSnackbar('Payment updated successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update payment', { variant: 'error' });
    },
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async (paymentId) => {
      const response = await apiClient.post(`/payments/${paymentId}/process`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      enqueueSnackbar('Payment processed successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to process payment', { variant: 'error' });
    },
  });

  // Refund payment mutation
  const refundPaymentMutation = useMutation({
    mutationFn: async ({ id, refundData }) => {
      const response = await apiClient.post(`/payments/${id}/refund`, refundData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      enqueueSnackbar('Payment refunded successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to refund payment', { variant: 'error' });
    },
  });

  // Filter and paginate payments
  const filteredPayments = React.useMemo(() => {
    if (!paymentsData?.payments) return [];
    
    let filtered = paymentsData.payments;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerId?.toString().includes(searchTerm)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    // Filter by method
    if (methodFilter !== 'ALL') {
      filtered = filtered.filter(payment => payment.paymentMethod === methodFilter);
    }
    
    return filtered;
  }, [paymentsData?.payments, searchTerm, statusFilter, methodFilter]);

  const paginatedPayments = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredPayments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPayments, page, rowsPerPage]);

  const handleOpenDialog = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        customerId: payment.customerId || '',
        amount: payment.amount || '',
        paymentMethod: payment.paymentMethod || 'MOBILE_MONEY',
        gateway: payment.gateway || 'ZENOPAY',
        reference: payment.reference || '',
        description: payment.description || '',
        status: payment.status || 'PENDING',
        transactionId: payment.transactionId || '',
        fees: payment.fees || 0,
        currency: payment.currency || 'TZS',
        metadata: payment.metadata || {},
      });
    } else {
      setEditingPayment(null);
      setFormData({
        customerId: '',
        amount: '',
        paymentMethod: 'MOBILE_MONEY',
        gateway: 'ZENOPAY',
        reference: '',
        description: '',
        status: 'PENDING',
        transactionId: '',
        fees: 0,
        currency: 'TZS',
        metadata: {},
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPayment(null);
    setFormData({
      customerId: '',
      amount: '',
      paymentMethod: 'MOBILE_MONEY',
      gateway: 'ZENOPAY',
      reference: '',
      description: '',
      status: 'PENDING',
      transactionId: '',
      fees: 0,
      currency: 'TZS',
      metadata: {},
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPayment) {
      updatePaymentMutation.mutate({
        id: editingPayment.id,
        paymentData: formData
      });
    } else {
      createPaymentMutation.mutate(formData);
    }
  };

  const handleProcessPayment = (paymentId) => {
    processPaymentMutation.mutate(paymentId);
  };

  const handleRefundPayment = (paymentId) => {
    const refundAmount = window.prompt('Enter refund amount:');
    if (refundAmount) {
      refundPaymentMutation.mutate({
        id: paymentId,
        refundData: { amount: parseFloat(refundAmount) }
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckIcon />;
      case 'PENDING':
        return <ScheduleIcon />;
      case 'FAILED':
        return <CancelIcon />;
      case 'REFUNDED':
        return <ReceiptIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#4CAF50'; // Green
      case 'PENDING':
        return '#FF9800'; // Orange
      case 'FAILED':
        return '#F44336'; // Red
      case 'REFUNDED':
        return '#9C27B0'; // Purple
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'MOBILE_MONEY':
        return <PhoneAndroidIcon />;
      case 'BANK_TRANSFER':
        return <AccountBalanceIcon />;
      case 'CREDIT_CARD':
        return <CreditCardIcon />;
      case 'CASH':
        return <MoneyIcon />;
      default:
        return <PaymentIcon />;
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'MOBILE_MONEY':
        return '#FF9800'; // Orange
      case 'BANK_TRANSFER':
        return '#2196F3'; // Blue
      case 'CREDIT_CARD':
        return '#9C27B0'; // Purple
      case 'CASH':
        return '#4CAF50'; // Green
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const canManagePayments = hasPermission('MANAGE_PAYMENTS');

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load payments: {error.message}
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
            Payment Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage customer payments and transaction processing
          </Typography>
        </Box>
        
        {canManagePayments && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
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
            Add Payment
          </Button>
        )}
      </Box>

      {/* Payment Statistics Cards */}
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
                      {paymentsData?.payments?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Payments
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#F5B700', color: '#000000' }}>
                    <PaymentIcon />
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
                      TZS {paymentsData?.totalAmount?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#4CAF50', color: '#FFFFFF' }}>
                    <MoneyIcon />
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
              background: 'linear-gradient(135deg, #FF980015, #FF980005)',
              border: '1px solid #FF980020',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                      {paymentsData?.payments?.filter(p => p.status === 'PENDING').length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Payments
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#FF9800', color: '#FFFFFF' }}>
                    <ScheduleIcon />
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
                      {paymentsData?.payments?.filter(p => p.status === 'FAILED').length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Failed Payments
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

      {/* Payment Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Payments" />
          <Tab label="Mobile Money" />
          <Tab label="Bank Transfer" />
          <Tab label="Credit Card" />
          <Tab label="Cash Payments" />
        </Tabs>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search payments..."
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
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                  <MenuItem value="REFUNDED">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Method Filter</InputLabel>
                <Select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  label="Method Filter"
                >
                  <MenuItem value="ALL">All Methods</MenuItem>
                  <MenuItem value="MOBILE_MONEY">Mobile Money</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                  <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                  <MenuItem value="CASH">Cash</MenuItem>
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

      {/* Payments Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Gateway</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
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
                ) : paginatedPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No payments found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: getMethodColor(payment.paymentMethod), color: 'white' }}>
                            {getMethodIcon(payment.paymentMethod)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {payment.reference}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {payment.transactionId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Customer #{payment.customerId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payment.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          TZS {payment.amount?.toLocaleString() || '0'}
                        </Typography>
                        {payment.fees > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            Fees: TZS {payment.fees.toLocaleString()}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.paymentMethod.replace('_', ' ')}
                          sx={{
                            bgcolor: getMethodColor(payment.paymentMethod),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.gateway}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          icon={getStatusIcon(payment.status)}
                          sx={{
                            bgcolor: getStatusColor(payment.status),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleTimeString() : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="info">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print Receipt">
                            <IconButton size="small" color="primary">
                              <PrintIcon />
                            </IconButton>
                          </Tooltip>
                          {canManagePayments && (
                            <>
                              {payment.status === 'PENDING' && (
                                <Tooltip title="Process Payment">
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleProcessPayment(payment.id)}
                                  >
                                    <CheckIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {payment.status === 'COMPLETED' && (
                                <Tooltip title="Refund Payment">
                                  <IconButton 
                                    size="small" 
                                    color="warning"
                                    onClick={() => handleRefundPayment(payment.id)}
                                  >
                                    <ReceiptIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Edit Payment">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenDialog(payment)}
                                >
                                  <EditIcon />
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
            count={filteredPayments.length}
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

      {/* Payment Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingPayment ? 'Edit Payment' : 'Add New Payment'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Customer</InputLabel>
                  <Select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    label="Customer"
                  >
                    {customersData?.customers?.map(customer => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName} - {customer.phoneNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount (TZS)"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    label="Payment Method"
                  >
                    <MenuItem value="MOBILE_MONEY">Mobile Money</MenuItem>
                    <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                    <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                    <MenuItem value="CASH">Cash</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Gateway</InputLabel>
                  <Select
                    name="gateway"
                    value={formData.gateway}
                    onChange={handleInputChange}
                    label="Payment Gateway"
                  >
                    <MenuItem value="ZENOPAY">ZenoPay</MenuItem>
                    <MenuItem value="MPESA">M-Pesa</MenuItem>
                    <MenuItem value="TIGOPESA">Tigo Pesa</MenuItem>
                    <MenuItem value="AIRTEL_MONEY">Airtel Money</MenuItem>
                    <MenuItem value="HALOPESA">HaloPesa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., PAY-001"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Transaction ID"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  placeholder="External transaction ID"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fees (TZS)"
                  name="fees"
                  type="number"
                  value={formData.fees}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="FAILED">Failed</MenuItem>
                    <MenuItem value="REFUNDED">Refunded</MenuItem>
                  </Select>
                </FormControl>
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
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createPaymentMutation.isPending || updatePaymentMutation.isPending}
              sx={{
                background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                color: '#000000',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFCB00 30%, #F5B700 90%)',
                }
              }}
            >
              {(createPaymentMutation.isPending || updatePaymentMutation.isPending) ? (
                <CircularProgress size={20} />
              ) : (
                editingPayment ? 'Update Payment' : 'Create Payment'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PaymentManagement;