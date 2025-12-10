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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Speed as SpeedIcon,
  Wifi as WifiIcon,
  Router as RouterIcon,
  AttachMoney as MoneyIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  DataUsage as DataUsageIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import { packageAPI } from '/src/services/api.js';

const InternetPackageManagement = () => {
  console.log('🔍 Packages component rendered');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'HOTSPOT',
    price: '',
    duration: '',
    speed: '',
    dataLimit: '',
    isActive: true,
    targetAudience: 'INDIVIDUAL',
    features: [],
  });

  const extractPayload = (response) => response?.data?.data ?? response?.data ?? response;

  const mapFormToPayload = (data) => ({
    name: data.name,
    description: data.description,
    packageType: data.type,
    price: data.price ? Number(data.price) : 0,
    durationDays: data.duration ? Number(data.duration) : null,
    duration: data.duration || null,
    dataLimitMb: data.dataLimit ? Number(data.dataLimit) : null,
    dataLimit: data.dataLimit || null,
    downloadSpeedMbps: data.speed ? Number(data.speed) : null,
    uploadSpeedMbps: data.speed ? Number(data.speed) : null,
    isActive: data.isActive,
    targetAudience: data.targetAudience,
    status: data.isActive ? 'ACTIVE' : 'INACTIVE',
  });

  // Fetch packages with React Query
  const { data: packagesData, isLoading, error, refetch } = useQuery({
    queryKey: ['packages', page, rowsPerPage, searchTerm, typeFilter, statusFilter],
    queryFn: async () => {
      const response = await packageAPI.getAllPackages({
        page,
        size: rowsPerPage,
      });
      const payload = extractPayload(response) || {};
      return {
        packages: payload.packages || [],
        pagination: {
          totalElements: payload.totalElements ?? payload.packages?.length ?? 0,
          totalPages: payload.totalPages ?? 1,
          currentPage: payload.currentPage ?? page,
          size: payload.size ?? rowsPerPage,
        },
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create package mutation
  const createPackageMutation = useMutation({
    mutationFn: async (packageData) => {
      const response = await packageAPI.createPackage(packageData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['packages']);
      enqueueSnackbar('Package created successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create package', { variant: 'error' });
    },
  });

  // Update package mutation
  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, packageData }) => {
      const response = await packageAPI.updatePackage(id, packageData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['packages']);
      enqueueSnackbar('Package updated successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update package', { variant: 'error' });
    },
  });

  // Delete package mutation
  const deletePackageMutation = useMutation({
    mutationFn: async (packageId) => {
      const response = await packageAPI.deletePackage(packageId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['packages']);
      enqueueSnackbar('Package deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete package', { variant: 'error' });
    },
  });

  // Filter and paginate packages
  const filteredPackages = React.useMemo(() => {
    if (!packagesData?.packages) return [];
    
    let filtered = packagesData.packages;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by type
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(pkg => pkg.type === typeFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(pkg => pkg.isActive === (statusFilter === 'ACTIVE'));
    }
    
    return filtered;
  }, [packagesData?.packages, searchTerm, typeFilter, statusFilter]);

  const paginatedPackages = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredPackages.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPackages, page, rowsPerPage]);

  const handleOpenDialog = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name || '',
        description: pkg.description || '',
        type: pkg.type || 'HOTSPOT',
        price: pkg.price || '',
        duration: pkg.duration || '',
        speed: pkg.speed || '',
        dataLimit: pkg.dataLimit || '',
        isActive: pkg.isActive !== undefined ? pkg.isActive : true,
        targetAudience: pkg.targetAudience || 'INDIVIDUAL',
        features: pkg.features || [],
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        description: '',
        type: 'HOTSPOT',
        price: '',
        duration: '',
        speed: '',
        dataLimit: '',
        isActive: true,
        targetAudience: 'INDIVIDUAL',
        features: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPackage(null);
    setFormData({
      name: '',
      description: '',
      type: 'HOTSPOT',
      price: '',
      duration: '',
      speed: '',
      dataLimit: '',
      isActive: true,
      targetAudience: 'INDIVIDUAL',
      features: [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPackage) {
      updatePackageMutation.mutate({
        id: editingPackage.id,
        packageData: mapFormToPayload(formData)
      });
    } else {
      createPackageMutation.mutate(mapFormToPayload(formData));
    }
  };

  const handleDeletePackage = (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      deletePackageMutation.mutate(packageId);
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
      case 'HOTSPOT':
        return <WifiIcon />;
      case 'PPPOE':
        return <RouterIcon />;
      default:
        return <SpeedIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'HOTSPOT':
        return '#F5B700'; // GG Wi-Fi Golden Yellow
      case 'PPPOE':
        return '#2196F3'; // Blue
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#4CAF50' : '#F44336';
  };

  const canManagePackages = hasPermission('MANAGE_PACKAGES');

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load packages: {error.message}
        </Alert>
        <Button onClick={() => refetch()} startIcon={<RefreshIcon />}>
          Retry
        </Button>
          </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3, backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header */}
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
            <SpeedIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0A0A0A', fontSize: { xs: '24px', md: '28px' }, mb: 0.5 }}>
              Package Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666666', fontSize: '14px' }}>
              Module C: Create and manage Universal & Offer packages with router sync
            </Typography>
          </Box>
        </Box>

        {canManagePackages && (
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
            Add Package
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
            <Tab label="Package List" icon={<SpeedIcon />} iconPosition="start" />
            <Tab label="Universal Packages" icon={<WifiIcon />} iconPosition="start" />
            <Tab label="Offer Packages" icon={<MoneyIcon />} iconPosition="start" />
            <Tab label="Router Sync" icon={<RouterIcon />} iconPosition="start" />
          </Tabs>
        </Box>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
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
                      {packagesData?.packages?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666' }}>
                      Total Packages
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(242, 201, 76, 0.1)', color: '#F2C94C' }}>
                    <SpeedIcon />
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
                      {packagesData?.packages?.filter(p => p.isActive).length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Packages
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
                      {packagesData?.packages?.filter(p => p.type === 'HOTSPOT').length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hotspot Packages
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
                      {packagesData?.packages?.filter(p => p.type === 'PPPOE').length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      PPPoE Packages
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#FF9800', color: '#FFFFFF' }}>
                    <RouterIcon />
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
          placeholder="Search packages..."
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
                  <MenuItem value="HOTSPOT">Hotspot</MenuItem>
                  <MenuItem value="PPPOE">PPPoE</MenuItem>
                </Select>
              </FormControl>
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

      {/* Packages Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Package</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Speed</TableCell>
                  <TableCell>Data Limit</TableCell>
                  <TableCell>Status</TableCell>
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
                ) : paginatedPackages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No packages found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPackages.map((pkg, index) => (
                    <motion.tr
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: getTypeColor(pkg.type), color: 'white' }}>
                            {getTypeIcon(pkg.type)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {pkg.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {pkg.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pkg.type}
                          sx={{
                            bgcolor: getTypeColor(pkg.type),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          TZS {pkg.price?.toLocaleString() || '0'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {pkg.duration || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SpeedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {pkg.speed || '-'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DataUsageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {pkg.dataLimit || 'Unlimited'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pkg.isActive ? 'Active' : 'Inactive'}
                          sx={{
                            bgcolor: pkg.isActive ? '#ECFDF5' : '#FFEBEE',
                            color: pkg.isActive ? '#10B981' : '#F44336',
                            border: `1px solid ${pkg.isActive ? '#10B981' : '#F44336'}`,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="info">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          {canManagePackages && (
                            <>
                              <Tooltip title="Edit Package">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenDialog(pkg)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Package">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeletePackage(pkg.id)}
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
            count={filteredPackages.length}
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

      {/* Package Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
      <DialogTitle>
          {editingPackage ? 'Edit Package' : 'Add New Package'}
      </DialogTitle>
        <form onSubmit={handleSubmit}>
      <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Package Name"
                  name="name"
                value={formData.name}
                  onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Package Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Package Type"
                  >
                    <MenuItem value="HOTSPOT">Hotspot</MenuItem>
                    <MenuItem value="PPPOE">PPPoE</MenuItem>
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
                  rows={3}
              />
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
                  placeholder="e.g., 1 day, 1 week, 1 month"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Speed"
                  name="speed"
                  value={formData.speed}
                  onChange={handleInputChange}
                  placeholder="e.g., 25 Mbps, 50 Mbps"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data Limit"
                  name="dataLimit"
                  value={formData.dataLimit}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 GB, 5 GB, Unlimited"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                  <InputLabel>Target Audience</InputLabel>
                <Select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    label="Target Audience"
                  >
                    <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                    <MenuItem value="BUSINESS">Business</MenuItem>
                    <MenuItem value="BOTH">Both</MenuItem>
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
                  label="Active Package"
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
              disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
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
              {(createPackageMutation.isPending || updatePackageMutation.isPending) ? (
                <CircularProgress size={20} />
              ) : (
                editingPackage ? 'Update Package' : 'Create Package'
              )}
          </Button>
      </DialogActions>
        </form>
    </Dialog>
    </Box>
  );
};

export default InternetPackageManagement;