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
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  DateRange as DateRangeIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Speed as SpeedIcon,
  Wifi as WifiIcon,
  Router as RouterIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import { reportsAnalyticsAPI } from '/src/services/api.js';

const AnalyticsReports = () => {
  console.log('🔍 Analytics component rendered');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'FINANCIAL',
    description: '',
    parameters: {},
    schedule: 'MANUAL',
    isActive: true,
    recipients: [],
  });

  const rangeParams = React.useMemo(() => {
    const end = new Date();
    const start = new Date();
    switch (dateRange) {
      case 'LAST_7_DAYS':
        start.setDate(end.getDate() - 7);
        break;
      case 'LAST_30_DAYS':
        start.setDate(end.getDate() - 30);
        break;
      case 'LAST_90_DAYS':
        start.setDate(end.getDate() - 90);
        break;
      case 'LAST_YEAR':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 30);
        break;
    }
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [dateRange]);

  const {
    data: analyticsStatsResponse,
    isLoading: isStatsLoading,
    error,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const response = await reportsAnalyticsAPI.getReportStats();
      return response.data?.data || response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const analyticsStats = analyticsStatsResponse || {};

  const {
    data: reportsResponse,
    isLoading: isReportsLoading,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await reportsAnalyticsAPI.getReports();
      return response.data?.data || response.data || [];
    },
  });
  const reportsList = reportsResponse || [];

  const {
    data: usagePerPlanResponse,
    refetch: refetchUsagePerPlan,
  } = useQuery({
    queryKey: ['usage-per-plan', rangeParams.startDate, rangeParams.endDate],
    queryFn: async () => {
      const response = await reportsAnalyticsAPI.getUsagePerPlan(rangeParams);
      return response.data?.data || response.data || {};
    },
    staleTime: 5 * 60 * 1000,
  });
  const usagePerPlan = usagePerPlanResponse || {};

  const {
    data: topCustomersResponse,
  } = useQuery({
    queryKey: ['top-customers-usage'],
    queryFn: async () => {
      const response = await reportsAnalyticsAPI.getTopCustomersUsage({ limit: 5 });
      return response.data?.data || response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
  const topCustomers = topCustomersResponse || [];

  const {
    data: routerUptimeResponse,
  } = useQuery({
    queryKey: ['router-uptime'],
    queryFn: async () => {
      const response = await reportsAnalyticsAPI.getRouterUptime();
      return response.data?.data || response.data || {};
    },
    staleTime: 5 * 60 * 1000,
  });
  const routerUptime = routerUptimeResponse?.routers || [];

  const {
    data: sessionDistributionResponse,
  } = useQuery({
    queryKey: ['session-duration-distribution'],
    queryFn: async () => {
      const response = await reportsAnalyticsAPI.getSessionDurationDistribution();
      return response.data?.data || response.data || {};
    },
    staleTime: 5 * 60 * 1000,
  });
  const sessionDistribution = sessionDistributionResponse || {};

  const refetchAll = () => {
    refetchStats();
    refetchReports();
    refetchUsagePerPlan();
  };

  const isLoading = isStatsLoading;
  const isRefreshing = isStatsLoading || isReportsLoading;

  const createReportMutation = useMutation({
    mutationFn: async (reportData) => {
      const response = await reportsAnalyticsAPI.createReport(reportData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      enqueueSnackbar('Report saved successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to save report', { variant: 'error' });
    },
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ id, reportData }) => {
      const response = await reportsAnalyticsAPI.updateReport(id, reportData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      enqueueSnackbar('Report updated successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update report', { variant: 'error' });
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (reportId) => {
      const response = await reportsAnalyticsAPI.deleteReport(reportId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      enqueueSnackbar('Report deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete report', { variant: 'error' });
    },
  });

  // Filter and paginate reports
  const filteredReports = React.useMemo(() => {
    if (!reportsList.length) return [];
    
    let filtered = reportsList;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by type
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }
    
    return filtered;
  }, [reportsList, searchTerm, typeFilter]);

  const paginatedReports = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredReports.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredReports, page, rowsPerPage]);

  const handleOpenDialog = (report = null) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        name: report.name || '',
        type: report.type || 'FINANCIAL',
        description: report.description || '',
        parameters: report.parameters || {},
        schedule: report.schedule || 'MANUAL',
        isActive: report.isActive !== undefined ? report.isActive : true,
        recipients: report.recipients || [],
      });
    } else {
      setEditingReport(null);
      setFormData({
        name: '',
        type: 'FINANCIAL',
        description: '',
        parameters: {},
        schedule: 'MANUAL',
        isActive: true,
        recipients: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReport(null);
    setFormData({
      name: '',
      type: 'FINANCIAL',
      description: '',
      parameters: {},
      schedule: 'MANUAL',
      isActive: true,
      recipients: [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingReport) {
      updateReportMutation.mutate({ id: editingReport.id, reportData: formData });
    } else {
      createReportMutation.mutate(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReportMutation.mutate(reportId);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'FINANCIAL':
        return <MoneyIcon />;
      case 'CUSTOMER':
        return <PeopleIcon />;
      case 'NETWORK':
        return <WifiIcon />;
      case 'PERFORMANCE':
        return <SpeedIcon />;
      case 'USAGE':
        return <BarChartIcon />;
      default:
        return <AssessmentIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'FINANCIAL':
        return '#4CAF50'; // Green
      case 'CUSTOMER':
        return '#2196F3'; // Blue
      case 'NETWORK':
        return '#FF9800'; // Orange
      case 'PERFORMANCE':
        return '#9C27B0'; // Purple
      case 'USAGE':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const canManageReports = hasPermission('MANAGE_REPORTS');

  const formatMegabytes = (value) => {
    if (value === undefined || value === null || Number.isNaN(Number(value))) {
      return '0 MB';
    }
    return `${Number(value).toFixed(1)} MB`;
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load analytics data: {error.message}
        </Alert>
        <Button onClick={refetchAll} startIcon={<RefreshIcon />}>
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
            Analytics & Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analytics and automated reporting system
          </Typography>
        </Box>
        
        {canManageReports && (
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
            Generate Report
          </Button>
        )}
      </Box>

      {/* Analytics Overview Cards */}
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
                      {analyticsStats?.totalReports?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Reports
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#F5B700', color: '#000000' }}>
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
                      {analyticsStats?.activeReports?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Reports
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#4CAF50', color: '#FFFFFF' }}>
                    <PeopleIcon />
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
                      {analyticsStats?.scheduledReports?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled Reports
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2196F3', color: '#FFFFFF' }}>
                    <WifiIcon />
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
                      {usagePerPlan?.total?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sessions (Hotspot vs PPPoE)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hotspot: {usagePerPlan?.hotspot || 0} · PPPoE: {usagePerPlan?.pppoe || 0}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#FF9800', color: '#FFFFFF' }}>
                    <SpeedIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Analytics Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Financial Analytics" />
          <Tab label="Customer Analytics" />
          <Tab label="Network Analytics" />
          <Tab label="Performance Analytics" />
          <Tab label="Reports" />
        </Tabs>
      </Card>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Revenue Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Revenue Trend</Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Chart will be implemented here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Growth Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Customer Growth</Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Chart will be implemented here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Customers by Usage */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Top Customers by Usage</Typography>
                {topCustomers.length === 0 ? (
                  <Typography color="text.secondary">Usage data not available.</Typography>
                ) : (
                  <List>
                    {topCustomers.map((customer, index) => (
                      <ListItem key={`${customer.username || 'user'}-${index}`}>
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText 
                          primary={`${index + 1}. ${customer.username || 'Unknown User'}`}
                          secondary={`${formatMegabytes(customer.totalMB ?? (customer.totalBytes || 0) / (1024 * 1024))} consumed`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Network Status */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Network Status</Typography>
                {routerUptime.length === 0 ? (
                  <Typography color="text.secondary">Router health data not available.</Typography>
                ) : (
                  <List>
                    {routerUptime.slice(0, 5).map((router) => (
                      <ListItem key={router.routerId}>
                        <ListItemIcon>
                          {router.status === 'ONLINE' ? (
                            <CheckIcon color="success" />
                          ) : (
                            <WarningIcon color="warning" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={router.routerName || `Router #${router.routerId}`}
                          secondary={`Status: ${router.status || 'UNKNOWN'} · Uptime: ${router.uptime || '—'}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Financial Analytics Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Revenue by Payment Method</Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Pie chart will be implemented here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Monthly Revenue</Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Bar chart will be implemented here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Customer Analytics Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Customer Demographics</Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Demographics chart will be implemented here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Customer Retention</Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Retention chart will be implemented here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Network Analytics Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Bandwidth Usage</Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Bandwidth chart will be implemented here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Router Performance</Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Performance chart will be implemented here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Performance Analytics Tab */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Session Duration Distribution</Typography>
                {Object.keys(sessionDistribution).length === 0 ? (
                  <Typography color="text.secondary">Session analytics not available.</Typography>
                ) : (
                  <List>
                    {Object.entries(sessionDistribution).map(([range, count]) => (
                      <ListItem key={range}>
                        <ListItemIcon><TimelineIcon /></ListItemIcon>
                        <ListItemText 
                          primary={`${range}`}
                          secondary={`${count} sessions`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Uptime Statistics</Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Uptime chart will be implemented here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reports Tab */}
      {activeTab === 5 && (
        <Box>
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search reports..."
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
                      <MenuItem value="FINANCIAL">Financial</MenuItem>
                      <MenuItem value="CUSTOMER">Customer</MenuItem>
                      <MenuItem value="NETWORK">Network</MenuItem>
                      <MenuItem value="PERFORMANCE">Performance</MenuItem>
                      <MenuItem value="USAGE">Usage</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Date Range</InputLabel>
                    <Select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      label="Date Range"
                    >
                      <MenuItem value="LAST_7_DAYS">Last 7 Days</MenuItem>
                      <MenuItem value="LAST_30_DAYS">Last 30 Days</MenuItem>
                      <MenuItem value="LAST_90_DAYS">Last 90 Days</MenuItem>
                      <MenuItem value="LAST_YEAR">Last Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={refetchAll}
                      disabled={isRefreshing}
                    >
                      Refresh
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Report</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Schedule</TableCell>
                      <TableCell>Last Generated</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isReportsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : paginatedReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No reports found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedReports.map((report, index) => (
                        <motion.tr
                          key={report.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: getTypeColor(report.type), color: 'white' }}>
                                {getTypeIcon(report.type)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {report.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {report.description}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={report.type}
                              sx={{
                                bgcolor: getTypeColor(report.type),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {report.schedule}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={report.isActive ? 'Active' : 'Inactive'}
                              sx={{
                                bgcolor: report.isActive ? '#4CAF50' : '#F44336',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="View Report">
                                <IconButton size="small" color="info">
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download Report">
                                <IconButton size="small" color="primary">
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Print Report">
                                <IconButton size="small" color="primary">
                                  <PrintIcon />
                                </IconButton>
                              </Tooltip>
                              {canManageReports && (
                                <>
                                  <Tooltip title="Edit Report">
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => handleOpenDialog(report)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Share Report">
                                    <IconButton size="small" color="secondary">
                                      <ShareIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Report">
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleDeleteReport(report.id)}
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
                count={filteredReports.length}
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

      {/* Report Generation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingReport ? 'Edit Report' : 'Generate New Report'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Report Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Report Type"
                  >
                    <MenuItem value="FINANCIAL">Financial Report</MenuItem>
                    <MenuItem value="CUSTOMER">Customer Report</MenuItem>
                    <MenuItem value="NETWORK">Network Report</MenuItem>
                    <MenuItem value="PERFORMANCE">Performance Report</MenuItem>
                    <MenuItem value="USAGE">Usage Report</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Schedule</InputLabel>
                  <Select
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    label="Schedule"
                  >
                    <MenuItem value="MANUAL">Manual</MenuItem>
                    <MenuItem value="DAILY">Daily</MenuItem>
                    <MenuItem value="WEEKLY">Weekly</MenuItem>
                    <MenuItem value="MONTHLY">Monthly</MenuItem>
                    <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                    />
                  }
                  label="Active Report"
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
                  rows={3}
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
                disabled={createReportMutation.isPending || updateReportMutation.isPending}
              sx={{
                background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                color: '#000000',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFCB00 30%, #F5B700 90%)',
                }
              }}
            >
              {(createReportMutation.isPending || updateReportMutation.isPending) ? (
                <CircularProgress size={20} />
              ) : (
                editingReport ? 'Update Report' : 'Generate Report'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AnalyticsReports;