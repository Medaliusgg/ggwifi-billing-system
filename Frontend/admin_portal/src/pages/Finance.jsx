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
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  Savings as SavingsIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocalHospital as HospitalIcon,
  Restaurant as RestaurantIcon,
  Store as StoreIcon,
  DirectionsCar as CarIcon,
  Flight as FlightIcon,
  ShoppingCart as ShoppingIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import apiClient from '/src/api/client.js';

const FinancialManagement = () => {
  console.log('🔍 Finance component rendered');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
    reference: '',
    tags: [],
    isRecurring: false,
    recurringInterval: 'MONTHLY',
    notes: '',
  });

  // Fetch financial data with React Query
  const { data: financialData, isLoading, error, refetch } = useQuery({
    queryKey: ['financial-data', page, rowsPerPage, searchTerm, typeFilter, categoryFilter],
    queryFn: async () => {
      const response = await apiClient.get('/financial');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch expenses
  const { data: expensesData } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/finance/expenses');  // or use finance dashboard
      return response.data;
    },
  });

  // Fetch budgets
  const { data: budgetsData } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/finance/budgets');  // or use finance dashboard
      return response.data;
    },
  });

  // Fetch employees
  const { data: employeesData } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/users');  // or employees endpoint
      return response.data;
    },
  });

  // Fetch rent places
  const { data: rentPlacesData } = useQuery({
    queryKey: ['rent-places'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/locations');  // or rent places endpoint
      return response.data;
    },
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (transactionData) => {
      const response = await apiClient.post('/financial/transactions', transactionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['financial-data']);
      enqueueSnackbar('Transaction created successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create transaction', { variant: 'error' });
    },
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, transactionData }) => {
      const response = await apiClient.put(`/financial/transactions/${id}`, transactionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['financial-data']);
      enqueueSnackbar('Transaction updated successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update transaction', { variant: 'error' });
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId) => {
      const response = await apiClient.delete(`/financial/transactions/${transactionId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['financial-data']);
      enqueueSnackbar('Transaction deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete transaction', { variant: 'error' });
    },
  });

  // Filter and paginate transactions
  const filteredTransactions = React.useMemo(() => {
    if (!financialData?.transactions) return [];
    
    let filtered = financialData.transactions;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by type
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }
    
    // Filter by category
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(transaction => transaction.category === categoryFilter);
    }
    
    return filtered;
  }, [financialData?.transactions, searchTerm, typeFilter, categoryFilter]);

  const paginatedTransactions = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTransactions, page, rowsPerPage]);

  const handleOpenDialog = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type || 'EXPENSE',
        category: transaction.category || '',
        amount: transaction.amount || '',
        description: transaction.description || '',
        date: transaction.date || new Date().toISOString().split('T')[0],
        paymentMethod: transaction.paymentMethod || 'CASH',
        reference: transaction.reference || '',
        tags: transaction.tags || [],
        isRecurring: transaction.isRecurring || false,
        recurringInterval: transaction.recurringInterval || 'MONTHLY',
        notes: transaction.notes || '',
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'EXPENSE',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'CASH',
        reference: '',
        tags: [],
        isRecurring: false,
        recurringInterval: 'MONTHLY',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
    setFormData({
      type: 'EXPENSE',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH',
      reference: '',
      tags: [],
      isRecurring: false,
      recurringInterval: 'MONTHLY',
      notes: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTransaction) {
      updateTransactionMutation.mutate({
        id: editingTransaction.id,
        transactionData: formData
      });
    } else {
      createTransactionMutation.mutate(formData);
    }
  };

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransactionMutation.mutate(transactionId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'INCOME':
        return <TrendingUpIcon />;
      case 'EXPENSE':
        return <TrendingDownIcon />;
      case 'INVESTMENT':
        return <SavingsIcon />;
      default:
        return <MoneyIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'INCOME':
        return '#4CAF50'; // Green
      case 'EXPENSE':
        return '#F44336'; // Red
      case 'INVESTMENT':
        return '#2196F3'; // Blue
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'SALARY':
        return <WorkIcon />;
      case 'RENT':
        return <HomeIcon />;
      case 'UTILITIES':
        return <BusinessIcon />;
      case 'MARKETING':
        return <AssessmentIcon />;
      case 'EQUIPMENT':
        return <ShoppingIcon />;
      case 'MAINTENANCE':
        return <BusinessIcon />;
      case 'TRAVEL':
        return <FlightIcon />;
      case 'FOOD':
        return <RestaurantIcon />;
      case 'HEALTHCARE':
        return <HospitalIcon />;
      case 'EDUCATION':
        return <SchoolIcon />;
      case 'TRANSPORT':
        return <CarIcon />;
      default:
        return <MoneyIcon />;
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'CASH':
        return '#4CAF50'; // Green
      case 'BANK_TRANSFER':
        return '#2196F3'; // Blue
      case 'MOBILE_MONEY':
        return '#FF9800'; // Orange
      case 'CREDIT_CARD':
        return '#9C27B0'; // Purple
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const canManageFinance = hasPermission('MANAGE_FINANCE');

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load financial data: {error.message}
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
            Financial Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track income, expenses, budgets, and financial performance
          </Typography>
        </Box>
        
        {canManageFinance && (
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
            Add Transaction
          </Button>
        )}
      </Box>

      {/* Financial Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4CAF5015, #4CAF5005)',
              border: '1px solid #4CAF5020',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                      TZS {financialData?.totalIncome?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Income
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#4CAF50', color: '#FFFFFF' }}>
                    <TrendingUpIcon />
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
              background: 'linear-gradient(135deg, #F4433615, #F4433605)',
              border: '1px solid #F4433620',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#F44336' }}>
                      TZS {financialData?.totalExpenses?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Expenses
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#F44336', color: '#FFFFFF' }}>
                    <TrendingDownIcon />
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
              background: 'linear-gradient(135deg, #F5B70015, #FFCB0005)',
              border: '1px solid #F5B70020',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#F5B700' }}>
                      TZS {financialData?.netProfit?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net Profit
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#F5B700', color: '#000000' }}>
                    <AccountBalanceIcon />
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
              background: 'linear-gradient(135deg, #2196F315, #2196F305)',
              border: '1px solid #2196F320',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                      TZS {financialData?.budgetUtilization?.toLocaleString() || '0'}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Budget Utilization
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2196F3', color: '#FFFFFF' }}>
                    <AssessmentIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Financial Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Transactions" />
          <Tab label="Expenses" />
          <Tab label="Budgets" />
          <Tab label="Employees" />
          <Tab label="Rent Places" />
        </Tabs>
      </Card>

      {/* Transactions Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search transactions..."
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
                    <InputLabel>Type Filter</InputLabel>
                    <Select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      label="Type Filter"
                    >
                      <MenuItem value="ALL">All Types</MenuItem>
                      <MenuItem value="INCOME">Income</MenuItem>
                      <MenuItem value="EXPENSE">Expense</MenuItem>
                      <MenuItem value="INVESTMENT">Investment</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category Filter</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      label="Category Filter"
                    >
                      <MenuItem value="ALL">All Categories</MenuItem>
                      <MenuItem value="SALARY">Salary</MenuItem>
                      <MenuItem value="RENT">Rent</MenuItem>
                      <MenuItem value="UTILITIES">Utilities</MenuItem>
                      <MenuItem value="MARKETING">Marketing</MenuItem>
                      <MenuItem value="EQUIPMENT">Equipment</MenuItem>
                      <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
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

          {/* Transactions Table */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No transactions found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTransactions.map((transaction, index) => (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: getTypeColor(transaction.type), color: 'white' }}>
                                {getTypeIcon(transaction.type)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {transaction.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {transaction.reference}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.type}
                              sx={{
                                bgcolor: getTypeColor(transaction.type),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getCategoryIcon(transaction.category)}
                              <Typography variant="body2">
                                {transaction.category}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                color: transaction.type === 'INCOME' ? '#4CAF50' : '#F44336'
                              }}
                            >
                              {transaction.type === 'EXPENSE' ? '-' : '+'}TZS {transaction.amount?.toLocaleString() || '0'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.paymentMethod}
                              size="small"
                              sx={{
                                bgcolor: getPaymentMethodColor(transaction.paymentMethod),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {transaction.date ? new Date(transaction.date).toLocaleDateString() : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="View Details">
                                <IconButton size="small" color="info">
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              {canManageFinance && (
                                <>
                                  <Tooltip title="Edit Transaction">
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => handleOpenDialog(transaction)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Transaction">
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleDeleteTransaction(transaction.id)}
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
                count={filteredTransactions.length}
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
        </Box>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Expenses Management</Typography>
            <Typography color="text.secondary">
              Detailed expense tracking and categorization will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Budget Management</Typography>
            <Typography color="text.secondary">
              Budget planning and monitoring will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Employee Management</Typography>
            <Typography color="text.secondary">
              Employee salary and payroll management will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {activeTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Rent Places Management</Typography>
            <Typography color="text.secondary">
              Rent place management and tracking will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Transaction Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Transaction Type"
                  >
                    <MenuItem value="INCOME">Income</MenuItem>
                    <MenuItem value="EXPENSE">Expense</MenuItem>
                    <MenuItem value="INVESTMENT">Investment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="SALARY">Salary</MenuItem>
                    <MenuItem value="RENT">Rent</MenuItem>
                    <MenuItem value="UTILITIES">Utilities</MenuItem>
                    <MenuItem value="MARKETING">Marketing</MenuItem>
                    <MenuItem value="EQUIPMENT">Equipment</MenuItem>
                    <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                    <MenuItem value="TRAVEL">Travel</MenuItem>
                    <MenuItem value="FOOD">Food</MenuItem>
                    <MenuItem value="HEALTHCARE">Healthcare</MenuItem>
                    <MenuItem value="EDUCATION">Education</MenuItem>
                    <MenuItem value="TRANSPORT">Transport</MenuItem>
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
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    label="Payment Method"
                  >
                    <MenuItem value="CASH">Cash</MenuItem>
                    <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                    <MenuItem value="MOBILE_MONEY">Mobile Money</MenuItem>
                    <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
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
                  placeholder="e.g., Invoice #12345"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isRecurring}
                      onChange={handleInputChange}
                      name="isRecurring"
                    />
                  }
                  label="Recurring Transaction"
                />
              </Grid>
              {formData.isRecurring && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Recurring Interval</InputLabel>
                    <Select
                      name="recurringInterval"
                      value={formData.recurringInterval}
                      onChange={handleInputChange}
                      label="Recurring Interval"
                    >
                      <MenuItem value="WEEKLY">Weekly</MenuItem>
                      <MenuItem value="MONTHLY">Monthly</MenuItem>
                      <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                      <MenuItem value="YEARLY">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createTransactionMutation.isPending || updateTransactionMutation.isPending}
              sx={{
                background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                color: '#000000',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFCB00 30%, #F5B700 90%)',
                }
              }}
            >
              {(createTransactionMutation.isPending || updateTransactionMutation.isPending) ? (
                <CircularProgress size={20} />
              ) : (
                editingTransaction ? 'Update Transaction' : 'Create Transaction'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default FinancialManagement;

