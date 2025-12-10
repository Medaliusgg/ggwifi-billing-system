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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Speed as SpeedIcon,
  Wifi as WifiIcon,
  Router as RouterIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Block as BlockIcon,
  CheckCircleOutline as UnblockIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import { customerAPI, transactionAPI } from '/src/services/api.js';

const CustomerManagement = () => {
  console.log('🔍 Customers component rendered');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    address: '',
    city: '',
    region: '',
    customerType: 'INDIVIDUAL',
    isActive: true,
    notes: '',
  });

  // Fetch customers with React Query
  const { data: customersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await customerAPI.getAllCustomers();
      return response.data?.data || response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch customer transactions
  const { data: transactionsResponse } = useQuery({
    queryKey: ['customer-transactions'],
    queryFn: async () => {
      const response = await transactionAPI.getAllTransactions();
      return response.data?.data || response.data || [];
    },
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData) => {
      const response = await customerAPI.createCustomer(customerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      enqueueSnackbar('Customer created successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create customer', { variant: 'error' });
    },
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async ({ id, customerData }) => {
      const response = await customerAPI.updateCustomer(id, customerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      enqueueSnackbar('Customer updated successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update customer', { variant: 'error' });
    },
  });

  // Block/Unblock customer mutation
  const toggleCustomerStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      const status = isActive ? 'ACTIVE' : 'INACTIVE';
      const response = await customerAPI.updateCustomer(id, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['customers']);
      enqueueSnackbar(
        variables.isActive ? 'Customer unblocked successfully' : 'Customer blocked successfully', 
        { variant: 'success' }
      );
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update customer status', { variant: 'error' });
    },
  });

  // Filter and paginate customers
  const customersList = customersResponse || [];
  const transactionsList = transactionsResponse || [];

  const filteredCustomers = React.useMemo(() => {
    if (!customersList.length) return [];
    
    let filtered = customersList;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber?.includes(searchTerm)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(customer => customer.isActive === (statusFilter === 'ACTIVE'));
    }
    
    // Filter by type
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(customer => customer.customerType === typeFilter);
    }
    
    return filtered;
  }, [customersList, searchTerm, statusFilter, typeFilter]);

  const paginatedCustomers = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCustomers, page, rowsPerPage]);

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phoneNumber: customer.phoneNumber || '',
        alternatePhoneNumber: customer.alternatePhoneNumber || '',
        address: customer.address || '',
        city: customer.city || '',
        region: customer.region || '',
        customerType: customer.customerType || 'INDIVIDUAL',
        isActive: customer.isActive !== undefined ? customer.isActive : true,
        notes: customer.notes || '',
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        alternatePhoneNumber: '',
        address: '',
        city: '',
        region: '',
        customerType: 'INDIVIDUAL',
        isActive: true,
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCustomer(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      alternatePhoneNumber: '',
      address: '',
      city: '',
      region: '',
      customerType: 'INDIVIDUAL',
      isActive: true,
      notes: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCustomer) {
      updateCustomerMutation.mutate({
        id: editingCustomer.id,
        customerData: formData
      });
    } else {
      createCustomerMutation.mutate(formData);
    }
  };

  const handleToggleStatus = (customerId, currentStatus) => {
    toggleCustomerStatusMutation.mutate({
      id: customerId,
      isActive: !currentStatus
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getCustomerTransactions = (customerId) => {
    return transactionsList.filter(t => t.customerId === customerId);
  };

  const getTotalSpent = (customerId) => {
    const transactions = getCustomerTransactions(customerId);
    return transactions.reduce((total, t) => total + (t.amount || 0), 0);
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#4CAF50' : '#F44336';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'INDIVIDUAL':
        return '#2196F3'; // Blue
      case 'BUSINESS':
        return '#FF9800'; // Orange
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const canManageCustomers = hasPermission('MANAGE_CUSTOMERS');

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load customers: {error.message}
        </Alert>
        <Button onClick={() => refetch()} startIcon={<RefreshIcon />}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3, backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header with Module Header Component */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2,
        pb: 2,
        borderBottom: '1px solid #EEEEEE',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: '#F2C94C', // Gold
              color: '#0A0A0A', // Black
              boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#0A0A0A', // Black
                fontSize: { xs: '24px', md: '28px' },
                mb: 0.5,
              }}
            >
              Customer Management
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666666', // Neutral-600
                fontSize: '14px',
              }}
            >
              Module B: Manage customer accounts, profiles, sessions, and notes
            </Typography>
          </Box>
        </Box>
        
        {canManageCustomers && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#F2C94C', // Gold
              color: '#0A0A0A', // Black
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#E0B335', // Gold Strong
                boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
              },
            }}
          >
            Add Customer
          </Button>
        )}
      </Box>

      {/* Module Tabs for Sub-modules */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                minHeight: 48,
                '&.Mui-selected': {
                  color: '#F2C94C', // Gold
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#F2C94C', // Gold indicator
                height: 3,
              },
            }}
          >
            <Tab label="Customer List" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Customer Profiles" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Customer Sessions" icon={<WifiIcon />} iconPosition="start" />
            <Tab label="Account Notes" icon={<ReceiptIcon />} iconPosition="start" />
          </Tabs>
        </Box>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ 
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              border: '1px solid #EEEEEE',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: '#F2C94C', // Gold
                }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0A0A0A' }}>
                      {customersList.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666' }}>
                      Total Customers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(242, 201, 76, 0.1)', color: '#F2C94C' }}>
                    <PersonIcon />
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
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              border: '1px solid #EEEEEE',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: '#10B981', // Success Green
                }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0A0A0A' }}>
                      {customersList.filter(c => c.isActive).length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666' }}>
                      Active Customers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#ECFDF5', color: '#10B981' }}>
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
                      {customersList.filter(c => c.customerType === 'INDIVIDUAL').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Individual Customers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2196F3', color: '#FFFFFF' }}>
                    <PersonIcon />
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
              background: 'linear-gradient(135deg, #FF980015, #FF980005)',
              border: '1px solid #FF980020',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                      {customersList.filter(c => c.customerType === 'BUSINESS').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Business Customers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#FF9800', color: '#FFFFFF' }}>
                    <PersonIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search customers..."
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
                      <MenuItem value="INACTIVE">Inactive</MenuItem>
                    </Select>
                  </FormControl>
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
                      <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                      <MenuItem value="BUSINESS">Business</MenuItem>
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
                      sx={{
                        borderColor: '#F2C94C',
                        color: '#0A0A0A',
                        '&:hover': {
                          borderColor: '#E0B335',
                          backgroundColor: 'rgba(242, 201, 76, 0.1)',
                        },
                      }}
                    >
                      Refresh
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Spent</TableCell>
                  <TableCell>Transactions</TableCell>
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
                ) : paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No customers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#F5B700', color: '#000000' }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {customer.firstName} {customer.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {customer.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 14 }} />
                            {customer.phoneNumber}
                          </Typography>
                          {customer.email && (
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EmailIcon sx={{ fontSize: 14 }} />
                              {customer.email}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.customerType}
                          sx={{
                            bgcolor: customer.customerType === 'INDIVIDUAL' ? '#EAF4FF' : '#FFF3E6',
                            color: customer.customerType === 'INDIVIDUAL' ? '#3A8DFF' : '#FF8A3D',
                            fontWeight: 600,
                            border: `1px solid ${customer.customerType === 'INDIVIDUAL' ? '#3A8DFF' : '#FF8A3D'}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.isActive ? 'Active' : 'Blocked'}
                          icon={customer.isActive ? <CheckIcon /> : <CancelIcon />}
                          sx={{
                            bgcolor: customer.isActive ? '#ECFDF5' : '#FFEBEE',
                            color: customer.isActive ? '#10B981' : '#F44336',
                            fontWeight: 600,
                            border: `1px solid ${customer.isActive ? '#10B981' : '#F44336'}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          TZS {getTotalSpent(customer.id).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getCustomerTransactions(customer.id).length} transactions
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="info">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Transaction History">
                            <IconButton size="small" color="primary">
                              <HistoryIcon />
                            </IconButton>
                          </Tooltip>
                          {canManageCustomers && (
                            <>
                              <Tooltip title={customer.isActive ? 'Block Customer' : 'Unblock Customer'}>
                                <IconButton 
                                  size="small" 
                                  color={customer.isActive ? 'error' : 'success'}
                                  onClick={() => handleToggleStatus(customer.id, customer.isActive)}
                                >
                                  {customer.isActive ? <BlockIcon /> : <UnblockIcon />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Customer">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenDialog(customer)}
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
            count={filteredCustomers.length}
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
        </>
      )}

      {/* Customer Profiles Tab (B.2) */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Profiles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              View detailed customer profiles with personal details, account status, linked devices, loyalty information, purchase history, session history, and referral codes.
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Click on a customer in the Customer List tab to view their detailed profile.
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Select a customer from the Customer List to view their profile details.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Customer Sessions Tab (B.3) */}
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Sessions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              View and manage active customer sessions, remaining time, disconnect sessions, renew sessions, and device change logs.
            </Typography>
            <Alert severity="info">
              Customer session management is available in the Session Management module. 
              <Button 
                variant="text" 
                size="small" 
                onClick={() => window.location.href = '/sessions'}
                sx={{ ml: 1, textTransform: 'none' }}
              >
                Go to Session Management →
              </Button>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Account Notes Tab (B.4) */}
      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Notes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage customer service notes, flags (fraud, abuse, refund history), and account annotations.
            </Typography>
            <Alert severity="info">
              Account notes feature will be available in the customer detail view. 
              This allows you to add notes, flags, and track customer service interactions.
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Customer Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Phone"
                  name="alternatePhoneNumber"
                  value={formData.alternatePhoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Customer Type</InputLabel>
                  <Select
                    name="customerType"
                    value={formData.customerType}
                    onChange={handleInputChange}
                    label="Customer Type"
                  >
                    <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                    <MenuItem value="BUSINESS">Business</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
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
                  rows={3}
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
                  label="Active Customer"
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
              disabled={createCustomerMutation.isPending || updateCustomerMutation.isPending}
              sx={{
                backgroundColor: '#F2C94C', // Gold
                color: '#0A0A0A', // Black
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#E0B335', // Gold Strong
                  boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
                },
              }}
            >
              {(createCustomerMutation.isPending || updateCustomerMutation.isPending) ? (
                <CircularProgress size={20} />
              ) : (
                editingCustomer ? 'Update Customer' : 'Create Customer'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CustomerManagement;

