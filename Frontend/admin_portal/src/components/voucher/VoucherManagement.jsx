import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  Avatar,
  Badge,
  Tooltip,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText as ListItemTextMUI
} from '@mui/material';
import {
  Add,
  Print,
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  GetApp,
  Share,
  QrCode,
  Receipt,
  People,
  CheckCircle,
  Cancel,
  Schedule,
  Warning,
  TrendingUp,
  Assessment,
  Refresh,
  Download,
  Upload,
  Settings,
  Person,
  Group,
  LocalOffer,
  MonetizationOn,
  Timeline,
  PieChart,
  BarChart
} from '@mui/icons-material';
import apiClient from '/src/api/client.js';

const VoucherManagement = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stats, setStats] = useState({});

  // Dropdown menu items for voucher management
  const voucherMenuItems = [
    { id: 'all-vouchers', label: 'All Vouchers', icon: Receipt, path: '/vouchers/all' },
    { id: 'add-vouchers', label: 'Add Vouchers', icon: Add, path: '/vouchers/add' },
    { id: 'print-vouchers', label: 'Print Vouchers', icon: Print, path: '/vouchers/print' },
    { id: 'unused-vouchers', label: 'Unused Vouchers', icon: Schedule, path: '/vouchers/unused' },
    { id: 'used-vouchers', label: 'Used Vouchers', icon: CheckCircle, path: '/vouchers/used' },
    { id: 'voucher-customers', label: 'Voucher Customers', icon: People, path: '/vouchers/customers' },
    { id: 'voucher-analytics', label: 'Voucher Analytics', icon: Assessment, path: '/vouchers/analytics' },
    { id: 'bulk-generation', label: 'Bulk Generation', icon: Upload, path: '/vouchers/bulk' },
    { id: 'refund-management', label: 'Refund Management', icon: Cancel, path: '/vouchers/refunds' },
    { id: 'voucher-settings', label: 'Voucher Settings', icon: Settings, path: '/vouchers/settings' }
  ];

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/vouchers');
      if (response.status === 'success') {
        setVouchers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
      showSnackbar('Failed to fetch vouchers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/vouchers/stats');
      if (response.status === 'success') {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch voucher stats:', error);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchStats();
  }, []);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event, voucher) => {
    setAnchorEl(event.currentTarget);
    setSelectedVoucher(voucher);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVoucher(null);
  };

  const handleDialogOpen = (type, voucher = null) => {
    setDialogType(type);
    setSelectedVoucher(voucher);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogType('');
    setSelectedVoucher(null);
  };

  const handlePrintVoucher = (voucher) => {
    // Implement print functionality
    showSnackbar(`Printing voucher: ${voucher.voucherCode}`, 'success');
  };

  const handleBulkPrint = () => {
    if (selectedVouchers.length === 0) {
      showSnackbar('Please select vouchers to print', 'warning');
      return;
    }
    showSnackbar(`Printing ${selectedVouchers.length} vouchers`, 'success');
  };

  const handleDeleteVoucher = async (voucher) => {
    try {
      const response = await apiClient.delete(`/vouchers/${voucher.id}`);
      if (response.status === 'success') {
        showSnackbar('Voucher deleted successfully', 'success');
        fetchVouchers();
      }
    } catch (error) {
      showSnackbar('Failed to delete voucher', 'error');
    }
    handleDialogClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'USED': return 'info';
      case 'EXPIRED': return 'warning';
      case 'REFUNDED': return 'error';
      case 'VOID': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle />;
      case 'USED': return <Person />;
      case 'EXPIRED': return <Schedule />;
      case 'REFUNDED': return <Cancel />;
      case 'VOID': return <Warning />;
      default: return <Schedule />;
    }
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (voucher.usedBy && voucher.usedBy.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || voucher.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || voucher.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const StatCard = ({ title, value, icon, color, change, suffix = '' }) => {
    const IconComponent = icon;
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color={color}>
                {value}{suffix}
              </Typography>
              {change && (
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
                  <Typography variant="body2" color="success.main" fontWeight="medium">
                    {change}% from last month
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar sx={{ bgcolor: alpha(theme.palette[color].main, 0.1), width: 56, height: 56 }}>
              <IconComponent sx={{ color: theme.palette[color].main, fontSize: 28 }} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const VoucherRow = ({ voucher }) => (
    <TableRow hover>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Checkbox
            checked={selectedVouchers.includes(voucher.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedVouchers([...selectedVouchers, voucher.id]);
              } else {
                setSelectedVouchers(selectedVouchers.filter(id => id !== voucher.id));
              }
            }}
          />
          <Box ml={1}>
            <Typography variant="body2" fontWeight="medium">
              {voucher.voucherCode}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {voucher.packageName}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          icon={getStatusIcon(voucher.status)}
          label={voucher.status}
          color={getStatusColor(voucher.status)}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>{voucher.type}</TableCell>
      <TableCell>TZS {voucher.amount?.toLocaleString()}</TableCell>
      <TableCell>{voucher.duration} min</TableCell>
      <TableCell>
        {voucher.usedBy ? (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {voucher.usedBy}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {voucher.usedAt ? new Date(voucher.usedAt).toLocaleDateString() : ''}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not used
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Badge badgeContent={voucher.printCount} color="primary">
            <IconButton
              size="small"
              onClick={() => handlePrintVoucher(voucher)}
              sx={{ color: theme.palette.primary.main }}
            >
              <Print />
            </IconButton>
          </Badge>
          <IconButton
            size="small"
            onClick={(e) => handleMenuClick(e, voucher)}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );

  const tabs = [
    { label: 'All Vouchers', icon: Receipt },
    { label: 'Add Vouchers', icon: Add },
    { label: 'Print Vouchers', icon: Print },
    { label: 'Unused Vouchers', icon: Schedule },
    { label: 'Used Vouchers', icon: CheckCircle },
    { label: 'Voucher Customers', icon: People },
    { label: 'Analytics', icon: Assessment }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Voucher Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage vouchers, printing, and customer assignments
          </Typography>
        </Box>
        
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchVouchers}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen('create')}
          >
            Add Voucher
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vouchers"
            value={stats.totalVouchers || 0}
            icon={Receipt}
            color="primary"
            change={12.5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Vouchers"
            value={stats.activeVouchers || 0}
            icon={CheckCircle}
            color="success"
            change={8.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Used Today"
            value={stats.usedToday || 0}
            icon={Person}
            color="info"
            change={15.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={stats.revenue || 0}
            icon={MonetizationOn}
            color="warning"
            suffix=" TZS"
            change={22.1}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Sidebar - Dropdown Navigation */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Voucher Management
              </Typography>
              <List>
                {voucherMenuItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={activeTab === index}
                        onClick={() => setActiveTab(index)}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                            }
                          }
                        }}
                      >
                        <ListItemIcon>
                          <item.icon color={activeTab === index ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemTextMUI
                          primary={item.label}
                          primaryTypographyProps={{
                            color: activeTab === index ? 'primary' : 'inherit',
                            fontWeight: activeTab === index ? 'bold' : 'normal'
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < voucherMenuItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} md={9}>
          {/* Filters and Search */}
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
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="ALL">All Status</MenuItem>
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="USED">Used</MenuItem>
                      <MenuItem value="EXPIRED">Expired</MenuItem>
                      <MenuItem value="REFUNDED">Refunded</MenuItem>
                      <MenuItem value="VOID">Void</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      label="Type"
                    >
                      <MenuItem value="ALL">All Types</MenuItem>
                      <MenuItem value="AUTOMATIC">Automatic</MenuItem>
                      <MenuItem value="BULK">Bulk</MenuItem>
                      <MenuItem value="REFUND">Refund</MenuItem>
                      <MenuItem value="WELCOME">Welcome</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('ALL');
                      setTypeFilter('ALL');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Voucher Table */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Vouchers ({filteredVouchers.length})
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Print />}
                    onClick={handleBulkPrint}
                    disabled={selectedVouchers.length === 0}
                  >
                    Print Selected ({selectedVouchers.length})
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                  >
                    Export
                  </Button>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedVouchers.length === filteredVouchers.length && filteredVouchers.length > 0}
                          indeterminate={selectedVouchers.length > 0 && selectedVouchers.length < filteredVouchers.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVouchers(filteredVouchers.map(v => v.id));
                            } else {
                              setSelectedVouchers([]);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>Voucher Code</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Used By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredVouchers.map((voucher) => (
                      <VoucherRow key={voucher.id} voucher={voucher} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleDialogOpen('view', selectedVoucher)}>
          <ListItemIcon><Visibility /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDialogOpen('edit', selectedVoucher)}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText>Edit Voucher</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handlePrintVoucher(selectedVoucher)}>
          <ListItemIcon><Print /></ListItemIcon>
          <ListItemText>Print Voucher</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDialogOpen('qr', selectedVoucher)}>
          <ListItemIcon><QrCode /></ListItemIcon>
          <ListItemText>Generate QR Code</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDialogOpen('delete', selectedVoucher)}>
          <ListItemIcon><Delete color="error" /></ListItemIcon>
          <ListItemText>Delete Voucher</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'create' && 'Create New Voucher'}
          {dialogType === 'edit' && 'Edit Voucher'}
          {dialogType === 'view' && 'Voucher Details'}
          {dialogType === 'delete' && 'Delete Voucher'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' && (
            <DialogContentText>
              Are you sure you want to delete voucher "{selectedVoucher?.voucherCode}"? 
              This action cannot be undone.
            </DialogContentText>
          )}
          {/* Add form content for other dialog types */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {dialogType === 'delete' && (
            <Button onClick={() => handleDeleteVoucher(selectedVoucher)} color="error">
              Delete
            </Button>
          )}
          {dialogType === 'create' && (
            <Button onClick={handleDialogClose} variant="contained">
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => handleDialogOpen('create')}
      >
        <Add />
      </Fab>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoucherManagement;
