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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Router as RouterIcon,
  Wifi as WifiIcon,
  Speed as SpeedIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Settings as SettingsIcon,
  NetworkCheck as NetworkCheckIcon,
  Security as SecurityIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Power as PowerIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import { routerAPI } from '/src/services/api.js';

const RouterManagement = () => {
  console.log('🔍 Routers component rendered');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [openConfigDialog, setOpenConfigDialog] = useState(false);
  const [editingRouter, setEditingRouter] = useState(null);
  const [selectedRouter, setSelectedRouter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    ipAddress: '',
    macAddress: '',
    location: '',
    latitude: '',
    longitude: '',
    isActive: true,
    description: '',
    firmwareVersion: '',
    lastSeen: '',
    uptime: '',
    cpuUsage: 0,
    memoryUsage: 0,
    temperature: 0,
    connectedUsers: 0,
    maxUsers: 100,
  });

  // Fetch routers with React Query
  const { data: routersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['routers'],
    queryFn: async () => {
      const response = await routerAPI.getAllRouters();
      return response.data?.data || response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch router configurations
  const { data: statusResponse } = useQuery({
    queryKey: ['router-configs'],
    queryFn: async () => {
      const response = await routerAPI.getRouterStatus();
      return response.data?.data || response.data || {};
    },
  });

  // Create router mutation
  const createRouterMutation = useMutation({
    mutationFn: async (routerData) => {
      const response = await routerAPI.createRouter(routerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['routers']);
      enqueueSnackbar('Router created successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create router', { variant: 'error' });
    },
  });

  // Update router mutation
  const updateRouterMutation = useMutation({
    mutationFn: async ({ id, routerData }) => {
      const response = await routerAPI.updateRouter(id, routerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['routers']);
      enqueueSnackbar('Router updated successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update router', { variant: 'error' });
    },
  });

  // Delete router mutation
  const deleteRouterMutation = useMutation({
    mutationFn: async (routerId) => {
      const response = await routerAPI.deleteRouter(routerId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['routers']);
      enqueueSnackbar('Router deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete router', { variant: 'error' });
    },
  });

  // Test router connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: async (routerId) => {
      const response = await routerAPI.testConnection(routerId);
      return response.data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(`Router connection test: ${data.status}`, { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to test router connection', { variant: 'error' });
    },
  });

  // Filter and paginate routers
  const routersList = routersResponse || [];
  const routerStatus = statusResponse || {};

  const filteredRouters = React.useMemo(() => {
    if (!routersList.length) return [];
    
    let filtered = routersList;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(router =>
        router.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        router.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        router.ipAddress?.includes(searchTerm) ||
        router.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(router => router.isActive === (statusFilter === 'ACTIVE'));
    }
    
    // Filter by location
    if (locationFilter !== 'ALL') {
      filtered = filtered.filter(router => router.location === locationFilter);
    }
    
    return filtered;
  }, [routersList, searchTerm, statusFilter, locationFilter]);

  const paginatedRouters = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredRouters.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRouters, page, rowsPerPage]);

  const handleOpenDialog = (router = null) => {
    if (router) {
      setEditingRouter(router);
      setFormData({
        name: router.name || '',
        model: router.model || '',
        serialNumber: router.serialNumber || '',
        ipAddress: router.ipAddress || '',
        macAddress: router.macAddress || '',
        location: router.location || '',
        latitude: router.latitude || '',
        longitude: router.longitude || '',
        isActive: router.isActive !== undefined ? router.isActive : true,
        description: router.description || '',
        firmwareVersion: router.firmwareVersion || '',
        lastSeen: router.lastSeen || '',
        uptime: router.uptime || '',
        cpuUsage: router.cpuUsage || 0,
        memoryUsage: router.memoryUsage || 0,
        temperature: router.temperature || 0,
        connectedUsers: router.connectedUsers || 0,
        maxUsers: router.maxUsers || 100,
      });
    } else {
    setEditingRouter(null);
    setFormData({
      name: '',
      model: '',
        serialNumber: '',
      ipAddress: '',
        macAddress: '',
        location: '',
        latitude: '',
        longitude: '',
        isActive: true,
        description: '',
        firmwareVersion: '',
        lastSeen: '',
        uptime: '',
        cpuUsage: 0,
        memoryUsage: 0,
        temperature: 0,
        connectedUsers: 0,
        maxUsers: 100,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRouter(null);
    setFormData({
      name: '',
      model: '',
      serialNumber: '',
      ipAddress: '',
      macAddress: '',
      location: '',
      latitude: '',
      longitude: '',
      isActive: true,
      description: '',
      firmwareVersion: '',
      lastSeen: '',
      uptime: '',
      cpuUsage: 0,
      memoryUsage: 0,
      temperature: 0,
      connectedUsers: 0,
      maxUsers: 100,
    });
  };

  const handleOpenConfigDialog = (router) => {
    setSelectedRouter(router);
    setOpenConfigDialog(true);
  };

  const handleCloseConfigDialog = () => {
    setOpenConfigDialog(false);
    setSelectedRouter(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
      if (editingRouter) {
      updateRouterMutation.mutate({
        id: editingRouter.id,
        routerData: formData
      });
      } else {
      createRouterMutation.mutate(formData);
    }
  };

  const handleDeleteRouter = (routerId) => {
    if (window.confirm('Are you sure you want to delete this router?')) {
      deleteRouterMutation.mutate(routerId);
    }
  };

  const handleTestConnection = (routerId) => {
    testConnectionMutation.mutate(routerId);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#4CAF50' : '#F44336';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckIcon /> : <CancelIcon />;
  };

  const getPerformanceColor = (usage) => {
    if (usage < 50) return '#4CAF50'; // Green
    if (usage < 80) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const canManageRouters = hasPermission('MANAGE_ROUTERS');

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load routers: {error.message}
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
          Router Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
            Manage MikroTik routers and network infrastructure
        </Typography>
      </Box>

        {canManageRouters && (
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
            Add Router
          </Button>
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
                      {routersList.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                      Total Routers
              </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#F5B700', color: '#000000' }}>
                    <RouterIcon />
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
                      {routersList.filter(r => r.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                      Active Routers
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
                      {routersList.reduce((sum, r) => sum + (r.connectedUsers || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                      Connected Users
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
                      {routersList.filter(r => r.cpuUsage > 80).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                      High CPU Usage
              </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#FF9800', color: '#FFFFFF' }}>
                    <WarningIcon />
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
          placeholder="Search routers..."
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
                <InputLabel>Location Filter</InputLabel>
                <Select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  label="Location Filter"
                >
                  <MenuItem value="ALL">All Locations</MenuItem>
                  {Array.from(new Set(routersList.map(r => r.location).filter(Boolean))).map(location => (
                    <MenuItem key={location} value={location}>
                      {location}
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

      {/* Routers Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Router</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Users</TableCell>
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
                ) : paginatedRouters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No routers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRouters.map((router, index) => (
                    <motion.tr
                      key={router.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#F5B700', color: '#000000' }}>
                            <RouterIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {router.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {router.serialNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {router.model}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          v{router.firmwareVersion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {router.ipAddress}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {router.macAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {router.location || '-'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={router.isActive ? 'Active' : 'Inactive'}
                          icon={getStatusIcon(router.isActive)}
        sx={{
                            bgcolor: getStatusColor(router.isActive),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MemoryIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption">
                              CPU: {router.cpuUsage || 0}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StorageIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption">
                              RAM: {router.memoryUsage || 0}%
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WifiIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {router.connectedUsers || 0}/{router.maxUsers || 100}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="info">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Test Connection">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleTestConnection(router.id)}
                            >
                              <NetworkCheckIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Configuration">
                            <IconButton 
                              size="small" 
                              color="secondary"
                              onClick={() => handleOpenConfigDialog(router)}
                            >
                              <SettingsIcon />
                            </IconButton>
                          </Tooltip>
                          {canManageRouters && (
                            <>
                              <Tooltip title="Edit Router">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenDialog(router)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Router">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteRouter(router.id)}
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
            count={filteredRouters.length}
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

      {/* Router Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
      <DialogTitle>
          {editingRouter ? 'Edit Router' : 'Add New Router'}
      </DialogTitle>
        <form onSubmit={handleSubmit}>
      <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Router Name"
                  name="name"
                value={formData.name}
                  onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="Serial Number"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="IP Address"
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="MAC Address"
                  name="macAddress"
                  value={formData.macAddress}
                  onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="Latitude"
                  name="latitude"
                type="number"
                  value={formData.latitude}
                  onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  name="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Firmware Version"
                  name="firmwareVersion"
                  value={formData.firmwareVersion}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Users"
                  name="maxUsers"
                  type="number"
                  value={formData.maxUsers}
                  onChange={handleInputChange}
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                    />
                  }
                  label="Active Router"
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
              disabled={createRouterMutation.isPending || updateRouterMutation.isPending}
          sx={{
                background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                color: '#000000',
                fontWeight: 700,
            '&:hover': {
                  background: 'linear-gradient(45deg, #FFCB00 30%, #F5B700 90%)',
                }
              }}
            >
              {(createRouterMutation.isPending || updateRouterMutation.isPending) ? (
                <CircularProgress size={20} />
              ) : (
                editingRouter ? 'Update Router' : 'Create Router'
              )}
        </Button>
      </DialogActions>
        </form>
    </Dialog>

      {/* Router Configuration Dialog */}
      <Dialog 
        open={openConfigDialog} 
        onClose={handleCloseConfigDialog}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          Router Configuration - {selectedRouter?.name}
        </DialogTitle>
        <DialogContent>
          {selectedRouter && (
            <Box sx={{ mt: 2 }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="General Info" />
                <Tab label="Network Config" />
                <Tab label="Performance" />
                <Tab label="Configuration Script" />
              </Tabs>
              
              <Box sx={{ mt: 3 }}>
                {activeTab === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>Basic Information</Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon><RouterIcon /></ListItemIcon>
                          <ListItemText primary="Name" secondary={selectedRouter.name} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><MemoryIcon /></ListItemIcon>
                          <ListItemText primary="Model" secondary={selectedRouter.model} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><SecurityIcon /></ListItemIcon>
                          <ListItemText primary="Serial Number" secondary={selectedRouter.serialNumber} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><LocationIcon /></ListItemIcon>
                          <ListItemText primary="Location" secondary={selectedRouter.location} />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>Status Information</Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon><CheckIcon /></ListItemIcon>
                          <ListItemText 
                            primary="Status" 
                            secondary={selectedRouter.isActive ? 'Active' : 'Inactive'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><ScheduleIcon /></ListItemIcon>
                          <ListItemText primary="Last Seen" secondary={selectedRouter.lastSeen || 'Never'} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><PowerIcon /></ListItemIcon>
                          <ListItemText primary="Uptime" secondary={selectedRouter.uptime || 'Unknown'} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><WifiIcon /></ListItemIcon>
                          <ListItemText 
                            primary="Connected Users" 
                            secondary={`${selectedRouter.connectedUsers || 0}/${selectedRouter.maxUsers || 100}`} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                )}
                
                {activeTab === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>Network Configuration</Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon><NetworkCheckIcon /></ListItemIcon>
                          <ListItemText primary="IP Address" secondary={selectedRouter.ipAddress} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><SecurityIcon /></ListItemIcon>
                          <ListItemText primary="MAC Address" secondary={selectedRouter.macAddress} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><CloudDownloadIcon /></ListItemIcon>
                          <ListItemText primary="Firmware Version" secondary={selectedRouter.firmwareVersion} />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>Location Details</Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon><LocationIcon /></ListItemIcon>
                          <ListItemText primary="Latitude" secondary={selectedRouter.latitude || 'Not set'} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><LocationIcon /></ListItemIcon>
                          <ListItemText primary="Longitude" secondary={selectedRouter.longitude || 'Not set'} />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                )}
                
                {activeTab === 2 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>CPU Usage</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress 
                            variant="determinate" 
                            value={selectedRouter.cpuUsage || 0}
                            sx={{ color: getPerformanceColor(selectedRouter.cpuUsage || 0) }}
                          />
                          <Typography variant="h4">
                            {selectedRouter.cpuUsage || 0}%
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Memory Usage</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress 
                            variant="determinate" 
                            value={selectedRouter.memoryUsage || 0}
                            sx={{ color: getPerformanceColor(selectedRouter.memoryUsage || 0) }}
                          />
                          <Typography variant="h4">
                            {selectedRouter.memoryUsage || 0}%
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Temperature</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h4">
                            {selectedRouter.temperature || 0}°C
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                )}
                
                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>MikroTik Configuration Script</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={20}
                      value={`# MikroTik RouterOS Configuration Script
# Generated for ${selectedRouter.name}
# IP: ${selectedRouter.ipAddress}

# Basic System Configuration
/system identity set name="${selectedRouter.name}"
/system clock set time-zone-name=Africa/Dar_es_Salaam

# Interface Configuration
/interface bridge add name=bridge-local
/interface bridge port add bridge=bridge-local interface=ether1

# IP Configuration
/ip address add address=192.168.1.1/24 interface=bridge-local
/ip dhcp-server setup interface=bridge-local
/ip dhcp-server network add address=192.168.1.0/24 gateway=192.168.1.1

# Hotspot Configuration
/ip hotspot setup profile-name=GG-WiFi interface=bridge-local
/ip hotspot user add name=admin password=admin123 profile=default

# Firewall Rules
/ip firewall filter add chain=input action=accept connection-state=established,related
/ip firewall filter add chain=input action=drop

# NAT Configuration
/ip firewall nat add chain=srcnat action=masquerade out-interface=ether1

# Wireless Configuration (if applicable)
/interface wireless set [ find default-name=wlan1 ] disabled=no ssid="GG-WiFi-${selectedRouter.location || 'Location'}"
/interface wireless security-profiles set [ find default=yes ] authentication-types=wpa2-psk wpa2-pre-shared-key="GGWiFi2024"

# Logging
/system logging add topics=info,debug action=memory

# Save Configuration
/system backup save name="${selectedRouter.name}-config"`}
                      InputProps={{
                        readOnly: true,
                        sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
                      }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => {
                          navigator.clipboard.writeText(`# MikroTik RouterOS Configuration Script...`);
                          enqueueSnackbar('Configuration script copied to clipboard', { variant: 'success' });
                        }}
                      >
                        Copy Script
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                          color: '#000000',
                          fontWeight: 700,
                        }}
                      >
                        Download Script
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseConfigDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RouterManagement;