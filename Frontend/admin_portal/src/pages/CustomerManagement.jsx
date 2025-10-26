import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  InputAdornment,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Download,
  Upload,
  Group,
  PersonAdd,
  Phone,
  Email,
  LocationOn,
  Speed,
  AttachMoney,
  MoreVert,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock customer data
const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    phone: '0773404760',
    email: 'john@example.com',
    location: 'Downtown Dar es Salaam',
    plan: 'Premium Hotspot',
    status: 'ACTIVE',
    balance: 25000,
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20',
    totalSpent: 450000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '0773404761',
    email: 'jane@example.com',
    location: 'Uptown Area',
    plan: 'Business PPPoE',
    status: 'ACTIVE',
    balance: 15000,
    joinDate: '2024-01-10',
    lastLogin: '2024-01-19',
    totalSpent: 320000,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    phone: '0773404762',
    email: 'mike@example.com',
    location: 'Mall Area',
    plan: 'Basic Hotspot',
    status: 'SUSPENDED',
    balance: -5000,
    joinDate: '2024-01-05',
    lastLogin: '2024-01-18',
    totalSpent: 180000,
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    phone: '0773404763',
    email: 'sarah@example.com',
    location: 'Airport Area',
    plan: 'Enterprise Static IP',
    status: 'ACTIVE',
    balance: 50000,
    joinDate: '2024-01-01',
    lastLogin: '2024-01-20',
    totalSpent: 650000,
  },
];

const CustomerManagement = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or table

  // Filter customers based on search and filters
  useEffect(() => {
    let filtered = customers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    // Plan filter
    if (planFilter !== 'ALL') {
      filtered = filtered.filter(customer => customer.plan === planFilter);
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, statusFilter, planFilter]);

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setOpenDialog(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#4CAF50';
      case 'SUSPENDED': return '#FF9800';
      case 'INACTIVE': return '#9E9E9E';
      case 'BANNED': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const CustomerCard = ({ customer }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        border: '1px solid #FFD70020',
        '&:hover': {
          border: '1px solid #FFD70040',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease',
        }
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: '#FFD700', color: '#000000', mr: 2 }}>
                {getInitials(customer.name)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
                  {customer.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#BFBFBF' }}>
                  {customer.phone}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={customer.status}
              size="small"
              sx={{
                bgcolor: getStatusColor(customer.status),
                color: '#FFFFFF',
                fontSize: '0.7rem',
              }}
            />
          </Box>

          <Box mb={2}>
            <Typography variant="body2" sx={{ color: '#BFBFBF', mb: 1 }}>
              <Email sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
              {customer.email}
            </Typography>
            <Typography variant="body2" sx={{ color: '#BFBFBF', mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
              {customer.location}
            </Typography>
            <Typography variant="body2" sx={{ color: '#BFBFBF', mb: 1 }}>
              <Speed sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
              {customer.plan}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="body2" sx={{ color: '#BFBFBF' }}>
                Balance
              </Typography>
              <Typography variant="h6" sx={{ 
                color: customer.balance >= 0 ? '#4CAF50' : '#F44336',
                fontWeight: 'bold'
              }}>
                {formatCurrency(customer.balance)}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2" sx={{ color: '#BFBFBF' }}>
                Total Spent
              </Typography>
              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                {formatCurrency(customer.totalSpent)}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Button
              size="small"
              startIcon={<Visibility />}
              sx={{ color: '#2196F3' }}
            >
              View
            </Button>
            <Button
              size="small"
              startIcon={<Edit />}
              sx={{ color: '#FFD700' }}
              onClick={() => handleEditCustomer(customer)}
            >
              Edit
            </Button>
            <Button
              size="small"
              startIcon={<Delete />}
              sx={{ color: '#F44336' }}
              onClick={() => handleDeleteCustomer(customer.id)}
            >
              Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
          Customer Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            sx={{ borderColor: '#FFD700', color: '#FFD700' }}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            sx={{ borderColor: '#FFD700', color: '#FFD700' }}
          >
            Import
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddCustomer}
            sx={{
              backgroundColor: '#FFD700',
              color: '#000000',
              '&:hover': {
                backgroundColor: '#E6C200',
              },
            }}
          >
            Add Customer
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        border: '1px solid #FFD70020',
      }}>
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
                      <Search sx={{ color: '#FFD700' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#000000',
                    '& fieldset': {
                      borderColor: '#FFD70030',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFD70050',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFD700',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#BFBFBF' }}>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD70030',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD70050',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD700',
                    },
                  }}
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="BANNED">Banned</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#BFBFBF' }}>Plan</InputLabel>
                <Select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  sx={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD70030',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD70050',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD700',
                    },
                  }}
                >
                  <MenuItem value="ALL">All Plans</MenuItem>
                  <MenuItem value="Premium Hotspot">Premium Hotspot</MenuItem>
                  <MenuItem value="Business PPPoE">Business PPPoE</MenuItem>
                  <MenuItem value="Basic Hotspot">Basic Hotspot</MenuItem>
                  <MenuItem value="Enterprise Static IP">Enterprise Static IP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box display="flex" gap={1}>
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('grid')}
                  sx={{
                    backgroundColor: viewMode === 'grid' ? '#FFD700' : 'transparent',
                    color: viewMode === 'grid' ? '#000000' : '#FFD700',
                    borderColor: '#FFD700',
                    minWidth: 'auto',
                    px: 2,
                  }}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('table')}
                  sx={{
                    backgroundColor: viewMode === 'table' ? '#FFD700' : 'transparent',
                    color: viewMode === 'table' ? '#000000' : '#FFD700',
                    borderColor: '#FFD700',
                    minWidth: 'auto',
                    px: 2,
                  }}
                >
                  Table
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box mb={2}>
        <Typography variant="body1" sx={{ color: '#BFBFBF' }}>
          Showing {filteredCustomers.length} of {customers.length} customers
        </Typography>
      </Box>

      {/* Customer List */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredCustomers.map((customer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={customer.id}>
              <CustomerCard customer={customer} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid #FFD70020',
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Contact</TableCell>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Plan</TableCell>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Balance</TableCell>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Total Spent</TableCell>
                  <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: '#FFD700', color: '#000000', mr: 2, width: 32, height: 32 }}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#BFBFBF' }}>
                            Joined: {customer.joinDate}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                        {customer.phone}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#BFBFBF' }}>
                        {customer.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#FFD700' }}>
                        {customer.plan}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(customer.status),
                          color: '#FFFFFF',
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        color: customer.balance >= 0 ? '#4CAF50' : '#F44336',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(customer.balance)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                        {formatCurrency(customer.totalSpent)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small" sx={{ color: '#2196F3' }}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Customer">
                          <IconButton size="small" sx={{ color: '#FFD700' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Customer">
                          <IconButton size="small" sx={{ color: '#F44336' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add customer"
        onClick={handleAddCustomer}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#FFD700',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#E6C200',
          },
        }}
      >
        <PersonAdd />
      </Fab>
    </Box>
  );
};

export default CustomerManagement;
