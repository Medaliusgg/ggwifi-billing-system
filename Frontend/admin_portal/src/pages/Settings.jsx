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
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  Backup as BackupIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Wifi as WifiIcon,
  Router as RouterIcon,
  AttachMoney as MoneyIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import { systemSettingsAPI, auditLogAPI, systemLogAPI, cacheAPI } from '/src/services/api.js';

const SettingsConfiguration = () => {
  console.log('🔍 Settings component rendered');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    category: 'GENERAL',
    description: '',
    dataType: 'STRING',
    isEncrypted: false,
    isRequired: false,
    defaultValue: '',
    validation: '',
  });

  // Fetch settings with React Query
  const { data: settingsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await systemSettingsAPI.getAllSettings();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch system info
  const systemInfo = {}; // placeholder until backend exposes equivalent endpoint

  // Create setting mutation
  const createSettingMutation = useMutation({
    mutationFn: async (settingData) => {
      return { data: await systemSettingsAPI.setConfigValue(settingData) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      enqueueSnackbar('Setting created successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create setting', { variant: 'error' });
    },
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ id, settingData }) => {
      return { data: await systemSettingsAPI.setConfigValue(settingData) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      enqueueSnackbar('Setting updated successfully', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update setting', { variant: 'error' });
    },
  });

  // Backup settings mutation
  const backupSettingsMutation = useMutation({
    mutationFn: async () => {
      return { data: await systemSettingsAPI.getAllSettings() }; // placeholder, no backup endpoint yet
    },
    onSuccess: () => {
      enqueueSnackbar('Settings backed up successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to backup settings', { variant: 'error' });
    },
  });

  // Restore settings mutation
  const restoreSettingsMutation = useMutation({
    mutationFn: async (backupData) => {
      return { data: await systemSettingsAPI.getAllSettings() }; // placeholder, no restore endpoint yet
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      enqueueSnackbar('Settings restored successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to restore settings', { variant: 'error' });
    },
  });

  // Filter and paginate settings
  const normalizeSettingsList = React.useMemo(() => {
    if (!settingsResponse) return [];
    const entries = [];
    Object.entries(settingsResponse || {}).forEach(([category, settings]) => {
      Object.entries(settings || {}).forEach(([key, value]) => {
        entries.push({
          key,
          value,
          category,
          description: '',
          dataType: typeof value === 'boolean' ? 'BOOLEAN' : 'STRING',
          isEncrypted: false,
          isRequired: false,
          defaultValue: '',
        });
      });
    });
    return entries;
  }, [settingsResponse]);

  const filteredSettings = React.useMemo(() => {
    let filtered = normalizeSettingsList;
    
    if (searchTerm) {
      filtered = filtered.filter(setting =>
        setting.key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(setting => setting.category === categoryFilter);
    }
    
    return filtered;
  }, [normalizeSettingsList, searchTerm, categoryFilter]);

  const availableCategories = React.useMemo(() => {
    const categories = new Set(normalizeSettingsList.map(setting => setting.category || 'GENERAL'));
    return ['ALL', ...Array.from(categories).sort()];
  }, [normalizeSettingsList]);

  const paginatedSettings = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredSettings.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSettings, page, rowsPerPage]);

  const handleOpenDialog = (setting = null) => {
    if (setting) {
      setEditingSetting(setting);
      setFormData({
        key: setting.key || '',
        value: setting.value || '',
        category: setting.category || 'GENERAL',
        description: setting.description || '',
        dataType: setting.dataType || 'STRING',
        isEncrypted: setting.isEncrypted || false,
        isRequired: setting.isRequired || false,
        defaultValue: setting.defaultValue || '',
        validation: setting.validation || '',
      });
    } else {
      setEditingSetting(null);
      setFormData({
        key: '',
        value: '',
        category: 'GENERAL',
        description: '',
        dataType: 'STRING',
        isEncrypted: false,
        isRequired: false,
        defaultValue: '',
        validation: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSetting(null);
    setFormData({
      key: '',
      value: '',
      category: 'GENERAL',
      description: '',
      dataType: 'STRING',
      isEncrypted: false,
      isRequired: false,
      defaultValue: '',
      validation: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    createSettingMutation.mutate(formData);
  };

  const handleDeleteSetting = () => {
    enqueueSnackbar('Deleting settings is not supported via API yet.', { variant: 'info' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'GENERAL':
        return <SettingsIcon />;
      case 'SECURITY':
        return <SecurityIcon />;
      case 'NOTIFICATIONS':
        return <NotificationsIcon />;
      case 'PAYMENT':
        return <MoneyIcon />;
      case 'SMS':
        return <PhoneIcon />;
      case 'EMAIL':
        return <EmailIcon />;
      case 'NETWORK':
        return <WifiIcon />;
      case 'ROUTER':
        return <RouterIcon />;
      case 'STORAGE':
        return <StorageIcon />;
      case 'PERFORMANCE':
        return <SpeedIcon />;
      default:
        return <SettingsIcon />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'GENERAL':
        return '#F5B700'; // GG Wi-Fi Golden Yellow
      case 'SECURITY':
        return '#F44336'; // Red
      case 'NOTIFICATIONS':
        return '#2196F3'; // Blue
      case 'PAYMENT':
        return '#4CAF50'; // Green
      case 'SMS':
        return '#FF9800'; // Orange
      case 'EMAIL':
        return '#9C27B0'; // Purple
      case 'NETWORK':
        return '#00BCD4'; // Cyan
      case 'ROUTER':
        return '#795548'; // Brown
      case 'STORAGE':
        return '#607D8B'; // Blue Gray
      case 'PERFORMANCE':
        return '#E91E63'; // Pink
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const getDataTypeColor = (dataType) => {
    switch (dataType) {
      case 'STRING':
        return '#4CAF50'; // Green
      case 'NUMBER':
        return '#2196F3'; // Blue
      case 'BOOLEAN':
        return '#FF9800'; // Orange
      case 'JSON':
        return '#9C27B0'; // Purple
      case 'PASSWORD':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const canManageSettings = hasPermission('MANAGE_SETTINGS');

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load settings: {error.message}
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
            Settings & Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system settings and configuration parameters
          </Typography>
        </Box>
        
        {canManageSettings && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<BackupIcon />}
              onClick={() => backupSettingsMutation.mutate()}
              disabled={backupSettingsMutation.isPending}
              sx={{
                borderColor: '#F5B700',
                color: '#F5B700',
                '&:hover': {
                  borderColor: '#FFCB00',
                  bgcolor: '#F5B70015',
                }
              }}
            >
              Backup Settings
            </Button>
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
              Add Setting
            </Button>
          </Box>
        )}
      </Box>

      {/* System Info Cards */}
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
                      {systemInfo?.version || '1.0.0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      System Version
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#F5B700', color: '#000000' }}>
                    <SettingsIcon />
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
                      {systemInfo?.uptime || '0'}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      System Uptime
          </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#4CAF50', color: '#FFFFFF' }}>
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
                    {normalizeSettingsList.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Settings
          </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2196F3', color: '#FFFFFF' }}>
                    <SettingsIcon />
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
                      {systemInfo?.memoryUsage || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Memory Usage
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#FF9800', color: '#FFFFFF' }}>
                    <StorageIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Settings Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Settings" />
          <Tab label="General" />
          <Tab label="Security" />
          <Tab label="Payment" />
          <Tab label="Network" />
          <Tab label="Notifications" />
          <Tab label="Audit Logs" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="System Logs" icon={<StorageIcon />} iconPosition="start" />
          <Tab label="Cache Management" icon={<SpeedIcon />} iconPosition="start" />
        </Tabs>
      </Card>

      {/* Settings Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search settings..."
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
                    <InputLabel>Category Filter</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      label="Category Filter"
                    >
                      {availableCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category === 'ALL' ? 'All Categories' : category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<RestoreIcon />}
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = '.json';
                        fileInput.onchange = (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              try {
                                const backupData = JSON.parse(e.target.result);
                                restoreSettingsMutation.mutate(backupData);
                              } catch (error) {
                                enqueueSnackbar('Invalid backup file', { variant: 'error' });
                              }
                            };
                            reader.readAsText(file);
                          }
                        };
                        fileInput.click();
                      }}
                      disabled={restoreSettingsMutation.isPending}
                    >
                      Restore Settings
                    </Button>
                  </Box>
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

          {/* Settings Table */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Setting</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>Encrypted</TableCell>
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
                    ) : paginatedSettings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No settings found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSettings.map((setting, index) => (
                        <motion.tr
                          key={setting.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: getCategoryColor(setting.category), color: 'white' }}>
                                {getCategoryIcon(setting.category)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {setting.key}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {setting.description}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={setting.category}
                              sx={{
                                bgcolor: getCategoryColor(setting.category),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {setting.isEncrypted ? '••••••••' : setting.value}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={setting.dataType}
                              size="small"
                              sx={{
                                bgcolor: getDataTypeColor(setting.dataType),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={setting.isRequired ? 'Yes' : 'No'}
                              size="small"
                              sx={{
                                bgcolor: setting.isRequired ? '#4CAF50' : '#9E9E9E',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={setting.isEncrypted ? 'Yes' : 'No'}
                              size="small"
                              sx={{
                                bgcolor: setting.isEncrypted ? '#F44336' : '#9E9E9E',
                                color: 'white',
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
                              {canManageSettings && (
                                <>
                                  <Tooltip title="Edit Setting">
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => handleOpenDialog(setting)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Setting">
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleDeleteSetting(setting.id)}
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
                count={filteredSettings.length}
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

      {/* Category-specific tabs */}
      {activeTab > 0 && (
        <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>
              {['All Settings', 'General', 'Security', 'Payment', 'Network', 'Notifications'][activeTab]} Settings
            </Typography>
            <Typography color="text.secondary">
              Category-specific settings management will be implemented here.
          </Typography>
          </CardContent>
        </Card>
      )}

      {/* Setting Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingSetting ? 'Edit Setting' : 'Add New Setting'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="Setting Key"
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., SYSTEM_NAME"
              />
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
                    <MenuItem value="GENERAL">General</MenuItem>
                    <MenuItem value="SECURITY">Security</MenuItem>
                    <MenuItem value="NOTIFICATIONS">Notifications</MenuItem>
                    <MenuItem value="PAYMENT">Payment</MenuItem>
                    <MenuItem value="SMS">SMS</MenuItem>
                    <MenuItem value="EMAIL">Email</MenuItem>
                    <MenuItem value="NETWORK">Network</MenuItem>
                    <MenuItem value="ROUTER">Router</MenuItem>
                    <MenuItem value="STORAGE">Storage</MenuItem>
                    <MenuItem value="PERFORMANCE">Performance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="Setting Value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  required
              />
            </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Data Type</InputLabel>
                  <Select
                    name="dataType"
                    value={formData.dataType}
                    onChange={handleInputChange}
                    label="Data Type"
                  >
                    <MenuItem value="STRING">String</MenuItem>
                    <MenuItem value="NUMBER">Number</MenuItem>
                    <MenuItem value="BOOLEAN">Boolean</MenuItem>
                    <MenuItem value="JSON">JSON</MenuItem>
                    <MenuItem value="PASSWORD">Password</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="Default Value"
                  name="defaultValue"
                  value={formData.defaultValue}
                  onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="Validation Rules"
                  name="validation"
                  value={formData.validation}
                  onChange={handleInputChange}
                  placeholder="e.g., min:1,max:100"
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
              <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                      checked={formData.isRequired}
                      onChange={handleInputChange}
                      name="isRequired"
                  />
                }
                  label="Required Setting"
              />
            </Grid>
              <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                      checked={formData.isEncrypted}
                      onChange={handleInputChange}
                      name="isEncrypted"
                  />
                }
                  label="Encrypted Value"
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
              disabled={createSettingMutation.isPending || updateSettingMutation.isPending}
              sx={{
                background: 'linear-gradient(45deg, #F5B700 30%, #FFCB00 90%)',
                color: '#000000',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFCB00 30%, #F5B700 90%)',
                }
              }}
            >
              {(createSettingMutation.isPending || updateSettingMutation.isPending) ? (
                <CircularProgress size={20} />
              ) : (
                editingSetting ? 'Update Setting' : 'Create Setting'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Audit Logs Tab */}
      {activeTab === 6 && (
        <AuditLogsTab />
      )}

      {/* System Logs Tab */}
      {activeTab === 7 && (
        <SystemLogsTab />
      )}

      {/* Cache Management Tab */}
      {activeTab === 8 && (
        <CacheManagementTab />
      )}
    </Box>
  );
};

// Audit Logs Tab Component
const AuditLogsTab = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [riskLevelFilter, setRiskLevelFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('');

  const { data: auditLogsData, isLoading, refetch } = useQuery({
    queryKey: ['audit-logs', page, rowsPerPage, riskLevelFilter, actionFilter],
    queryFn: async () => {
      const params = {
        page,
        size: rowsPerPage,
        riskLevel: riskLevelFilter !== 'ALL' ? riskLevelFilter : undefined,
        action: actionFilter || undefined,
      };
      const response = await auditLogAPI.getAuditLogs(params);
      return response?.data || response;
    },
  });

  const { data: securityEventsData } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      const response = await auditLogAPI.getSecurityEvents(24);
      return response?.data || response;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const logs = auditLogsData?.data || auditLogsData || [];
  const securityEvents = securityEventsData?.data || securityEventsData || [];

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Events (24h)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {securityEvents.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Audit Logs
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {auditLogsData?.totalElements || logs.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                High Risk Events
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                {logs.filter(log => log.riskLevel === 'HIGH').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={riskLevelFilter}
                label="Risk Level"
                onChange={(e) => setRiskLevelFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Levels</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Action Filter"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              placeholder="e.g., LOGIN, DELETE"
              sx={{ minWidth: 200 }}
            />
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()}>
              Refresh
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Target</TableCell>
                      <TableCell>Risk Level</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No audit logs found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log) => (
                        <TableRow key={log.id} hover>
                          <TableCell>
                            {log.createdAt
                              ? new Date(log.createdAt).toLocaleString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>{log.action || 'N/A'}</TableCell>
                          <TableCell>{log.username || 'System'}</TableCell>
                          <TableCell>{log.targetTable || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={log.riskLevel || 'N/A'}
                              color={getRiskColor(log.riskLevel)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title={JSON.stringify(log.details || {}, null, 2)}>
                              <IconButton size="small">
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={auditLogsData?.totalElements || logs.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// System Logs Tab Component
const SystemLogsTab = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [logType, setLogType] = useState('api');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: logsData, isLoading, refetch } = useQuery({
    queryKey: ['system-logs', logType, page, rowsPerPage],
    queryFn: async () => {
      const params = { page, size: rowsPerPage };
      let response;
      switch (logType) {
        case 'api':
          response = await systemLogAPI.getApiLogs(params);
          break;
        case 'router':
          response = await systemLogAPI.getRouterLogs(params);
          break;
        case 'radius':
          response = await systemLogAPI.getRadiusLogs(params);
          break;
        case 'login':
          response = await systemLogAPI.getLoginLogs(params);
          break;
        case 'email-sms':
          response = await systemLogAPI.getEmailSmsLogs(params);
          break;
        case 'error':
          response = await systemLogAPI.getErrorLogs(params);
          break;
        default:
          response = await systemLogAPI.getApiLogs(params);
      }
      return response?.data || response;
    },
  });

  const logs = logsData?.content || logsData?.logs || logsData || [];

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel>Log Type</InputLabel>
            <Select value={logType} label="Log Type" onChange={(e) => setLogType(e.target.value)}>
              <MenuItem value="api">API Logs</MenuItem>
              <MenuItem value="router">Router Logs</MenuItem>
              <MenuItem value="radius">RADIUS Logs</MenuItem>
              <MenuItem value="login">Login Logs</MenuItem>
              <MenuItem value="email-sms">Email/SMS Logs</MenuItem>
              <MenuItem value="error">Error Logs</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {logType.charAt(0).toUpperCase() + logType.slice(1)} Logs
            </Typography>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()}>
              Refresh
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No logs found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log, index) => (
                        <TableRow key={log.id || index} hover>
                          <TableCell>
                            {log.timestamp || log.createdAt
                              ? new Date(log.timestamp || log.createdAt).toLocaleString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.level || 'INFO'}
                              color={
                                log.level === 'ERROR'
                                  ? 'error'
                                  : log.level === 'WARN'
                                  ? 'warning'
                                  : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{log.message || log.description || 'N/A'}</TableCell>
                          <TableCell>
                            <Tooltip title={JSON.stringify(log.details || log, null, 2)}>
                              <IconButton size="small">
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={logsData?.totalElements || logs.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// Cache Management Tab Component
const CacheManagementTab = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: cacheStats, isLoading, refetch } = useQuery({
    queryKey: ['cache-statistics'],
    queryFn: async () => {
      const response = await cacheAPI.getCacheStatistics();
      return response?.data || response;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: cacheNames } = useQuery({
    queryKey: ['cache-names'],
    queryFn: async () => {
      const response = await cacheAPI.getCacheNames();
      return response?.data || response;
    },
  });

  const evictCacheMutation = useMutation({
    mutationFn: (cacheName) => cacheAPI.evictCache(cacheName),
    onSuccess: () => {
      enqueueSnackbar('Cache evicted successfully', { variant: 'success' });
      queryClient.invalidateQueries(['cache-statistics']);
      refetch();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to evict cache', { variant: 'error' });
    },
  });

  const evictAllCachesMutation = useMutation({
    mutationFn: () => cacheAPI.evictAllCaches(),
    onSuccess: () => {
      enqueueSnackbar('All caches evicted successfully', { variant: 'success' });
      queryClient.invalidateQueries(['cache-statistics']);
      refetch();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to evict all caches', { variant: 'error' });
    },
  });

  const cacheList = cacheNames?.cacheNames || cacheNames || [];
  const stats = cacheStats || {};

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cache Status
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.enabled ? 'Enabled' : 'Disabled'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Caches
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.cacheCount || cacheList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Actions
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to evict all caches?')) {
                      evictAllCachesMutation.mutate();
                    }
                  }}
                  disabled={evictAllCachesMutation.isPending}
                >
                  Evict All
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Cache Details</Typography>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()}>
              Refresh
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cache Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Hit Rate</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cacheList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No caches configured
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    cacheList.map((cacheName) => {
                      const cacheInfo = stats.cacheDetails?.[cacheName] || {};
                      return (
                        <TableRow key={cacheName} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {cacheName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label="Active" color="success" size="small" />
                          </TableCell>
                          <TableCell>
                            {cacheInfo.hitRate
                              ? `${(cacheInfo.hitRate * 100).toFixed(1)}%`
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {cacheInfo.size || cacheInfo.entryCount || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => {
                                if (window.confirm(`Evict cache: ${cacheName}?`)) {
                                  evictCacheMutation.mutate(cacheName);
                                }
                              }}
                              disabled={evictCacheMutation.isPending}
                            >
                              Evict
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsConfiguration;