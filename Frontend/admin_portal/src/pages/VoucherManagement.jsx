import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import VoucherPrintComponent from '../components/VoucherPrintComponent';
import apiClient from '@/api/client';

const VoucherManagement = () => {
  const { user } = useAuthStore();
  const [vouchers, setVouchers] = useState([]);
  const [voucherStats, setVoucherStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Dialog states
  const [bulkGenerateDialog, setBulkGenerateDialog] = useState(false);
  const [printDialog, setPrintDialog] = useState(false);
  const [generatedVouchers, setGeneratedVouchers] = useState([]);
  
  // Form states
  const [bulkForm, setBulkForm] = useState({
    adminUsername: '',
    quantity: 5,
    amount: 10000,
    validityDays: 30,
    type: 'HOTSPOT_CREDIT',
    packageName: '',
    speed: '',
    duration: ''
  });

  // Fetch vouchers data
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/vouchers');
      if (response.data.status === 'success') {
        setVouchers(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch vouchers');
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch voucher statistics
  const fetchVoucherStats = async () => {
    try {
      const response = await apiClient.get('/vouchers/statistics');
      if (response.data.status === 'success') {
        setVoucherStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching voucher stats:', error);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchVoucherStats();
  }, []);

  // Handle bulk voucher generation
  const handleBulkGenerate = async () => {
    try {
      const response = await apiClient.post('/vouchers/generate/bulk', bulkForm);
      if (response.data.status === 'success') {
        setGeneratedVouchers(response.data.data);
        setSnackbar({
          open: true,
          message: `Successfully generated ${response.data.count} vouchers`,
          severity: 'success'
        });
        setBulkGenerateDialog(false);
        setPrintDialog(true);
        fetchVouchers();
        fetchVoucherStats();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to generate vouchers',
        severity: 'error'
      });
    }
  };

  // Handle voucher usage
  const handleUseVoucher = async (voucherCode, usedBy) => {
    try {
      const response = await apiClient.post('/vouchers/use', {
        voucherCode,
        usedBy
      });
      if (response.data.status === 'success') {
        setSnackbar({
          open: true,
          message: 'Voucher used successfully',
          severity: 'success'
        });
        fetchVouchers();
        fetchVoucherStats();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to use voucher',
        severity: 'error'
      });
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'USED': return 'info';
      case 'EXPIRED': return 'error';
      default: return 'default';
    }
  };

  // Statistics cards
  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Voucher Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => setPrintDialog(true)}
            sx={{ mr: 2 }}
          >
            Print Active Vouchers
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setBulkGenerateDialog(true)}
            sx={{ bgcolor: 'gg.yellow', color: 'black' }}
          >
            Generate Bulk Vouchers
          </Button>
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vouchers"
            value={voucherStats.totalVouchers || 0}
            icon={<ReceiptIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Vouchers"
            value={voucherStats.activeVouchers || 0}
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Used Vouchers"
            value={voucherStats.usedVouchers || 0}
            icon={<WalletIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`TZS ${voucherStats.totalRevenue || 0}`}
            icon={<MonetizationOnIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Vouchers Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Vouchers
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Voucher Code</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Generated By</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vouchers.map((voucher) => (
                  <TableRow key={voucher.voucherCode}>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {voucher.voucherCode}
                      </Typography>
                    </TableCell>
                    <TableCell>{voucher.type}</TableCell>
                    <TableCell>TZS {voucher.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={voucher.status}
                        color={getStatusColor(voucher.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{voucher.generatedBy}</TableCell>
                    <TableCell>{new Date(voucher.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {voucher.status === 'ACTIVE' && (
                        <Tooltip title="Use Voucher">
                          <IconButton
                            size="small"
                            onClick={() => handleUseVoucher(voucher.voucherCode, user?.username)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Bulk Generate Dialog */}
      <Dialog open={bulkGenerateDialog} onClose={() => setBulkGenerateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Bulk Vouchers</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Admin Username"
              value={bulkForm.adminUsername}
              onChange={(e) => setBulkForm({ ...bulkForm, adminUsername: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={bulkForm.quantity}
              onChange={(e) => setBulkForm({ ...bulkForm, quantity: parseInt(e.target.value) })}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Amount (TZS)"
              value={bulkForm.amount}
              onChange={(e) => setBulkForm({ ...bulkForm, amount: parseInt(e.target.value) })}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Validity Days"
              value={bulkForm.validityDays}
              onChange={(e) => setBulkForm({ ...bulkForm, validityDays: parseInt(e.target.value) })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Package Name"
              value={bulkForm.packageName}
              onChange={(e) => setBulkForm({ ...bulkForm, packageName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Speed"
              value={bulkForm.speed}
              onChange={(e) => setBulkForm({ ...bulkForm, speed: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Duration"
              value={bulkForm.duration}
              onChange={(e) => setBulkForm({ ...bulkForm, duration: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Voucher Type</InputLabel>
              <Select
                value={bulkForm.type}
                onChange={(e) => setBulkForm({ ...bulkForm, type: e.target.value })}
              >
                <MenuItem value="HOTSPOT_CREDIT">Hotspot Credit</MenuItem>
                <MenuItem value="PPPOE_CREDIT">PPPoE Credit</MenuItem>
                <MenuItem value="PACKAGE_VOUCHER">Package Voucher</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkGenerateDialog(false)}>Cancel</Button>
          <Button onClick={handleBulkGenerate} variant="contained">
            Generate Vouchers
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={printDialog} onClose={() => setPrintDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Print Vouchers</DialogTitle>
        <DialogContent>
          <VoucherPrintComponent 
            vouchers={generatedVouchers.length > 0 ? generatedVouchers : vouchers.filter(v => v.status === 'ACTIVE')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrintDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoucherManagement;
