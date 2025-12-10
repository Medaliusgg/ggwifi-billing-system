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
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Timer as TimerIcon,
  SignalCellularAlt as SignalIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import { sessionAPI, radiusAPI } from '/src/services/api.js';

const SessionManagement = () => {
  console.log('🔍 Sessions component rendered');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    sessionId: '',
    ipAddress: '',
    macAddress: '',
    nasIpAddress: '',
    startTime: '',
    endTime: '',
    status: 'ACTIVE',
    bytesIn: 0,
    bytesOut: 0,
    packetsIn: 0,
    packetsOut: 0,
    duration: 0,
    serviceType: 'HOTSPOT',
    framedIpAddress: '',
    callingStationId: '',
    calledStationId: '',
  });

  // Fetch sessions with React Query using new sessionAPI
  const { data: sessionsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      try {
        const response = await sessionAPI.getActiveSessions();
        // Active sessions endpoint returns { status, sessions, count }
        if (response?.data?.sessions) return response.data.sessions;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.data?.data)) return response.data.data;
        return [];
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        // Fallback to radiusAPI if sessionAPI fails
        const fallback = await radiusAPI.getActiveSessions();
        if (Array.isArray(fallback?.data)) return fallback.data;
        if (Array.isArray(fallback?.data?.data)) return fallback.data.data;
        return [];
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });

  // Fetch session statistics
  const { data: sessionStats } = useQuery({
    queryKey: ['session-stats'],
    queryFn: async () => {
      try {
        const response = await sessionAPI.getSessionStatistics();
        return response?.data || response;
      } catch (err) {
        console.error('Failed to fetch session stats:', err);
        // Fallback to radiusAPI
        const fallback = await radiusAPI.getStatistics();
        return fallback?.data || fallback;
      }
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

  // Terminate session mutation using new sessionAPI
  const terminateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, reason }) => {
      const response = await sessionAPI.terminateSession(sessionId, reason);
      return response?.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sessions']);
      queryClient.invalidateQueries(['session-stats']);
      enqueueSnackbar('Session terminated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to terminate session', { variant: 'error' });
    },
  });

  // Filter and paginate sessions
  const filteredSessions = React.useMemo(() => {
    if (!sessionsResponse?.length) return [];
    
    let filtered = sessionsResponse;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.macAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }
    
    return filtered;
  }, [sessionsResponse, searchTerm, statusFilter]);

  const paginatedSessions = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredSessions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSessions, page, rowsPerPage]);

  const handleOpenDialog = (session = null) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        username: session.username || '',
        sessionId: session.sessionId || '',
        ipAddress: session.ipAddress || '',
        macAddress: session.macAddress || '',
        nasIpAddress: session.nasIpAddress || '',
        startTime: session.startTime || '',
        endTime: session.endTime || '',
        status: session.status || 'ACTIVE',
        bytesIn: session.bytesIn || 0,
        bytesOut: session.bytesOut || 0,
        packetsIn: session.packetsIn || 0,
        packetsOut: session.packetsOut || 0,
        duration: session.duration || 0,
        serviceType: session.serviceType || 'HOTSPOT',
        framedIpAddress: session.framedIpAddress || '',
        callingStationId: session.callingStationId || '',
        calledStationId: session.calledStationId || '',
      });
    } else {
      setEditingSession(null);
      setFormData({
        username: '',
        sessionId: '',
        ipAddress: '',
        macAddress: '',
        nasIpAddress: '',
        startTime: '',
        endTime: '',
        status: 'ACTIVE',
        bytesIn: 0,
        bytesOut: 0,
        packetsIn: 0,
        packetsOut: 0,
        duration: 0,
        serviceType: 'HOTSPOT',
        framedIpAddress: '',
        callingStationId: '',
        calledStationId: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSession(null);
  };

  const handleTerminateSession = (sessionId) => {
    if (window.confirm('Are you sure you want to terminate this session?')) {
      terminateSessionMutation.mutate({ 
        sessionId, 
        reason: 'Admin-Terminated' 
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return '#4CAF50'; // Green
      case 'TERMINATED':
        return '#F44336'; // Red
      case 'EXPIRED':
        return '#FF9800'; // Orange
      case 'SUSPENDED':
        return '#9C27B0'; // Purple
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const getServiceTypeIcon = (serviceType) => {
    switch (serviceType) {
      case 'HOTSPOT':
        return <WifiIcon />;
      case 'PPPOE':
        return <RouterIcon />;
      default:
        return <WifiIcon />;
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const canManageSessions = hasPermission('MANAGE_SESSIONS');

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load sessions: {error.message}
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
            Session Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage active user sessions
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isLoading}
            sx={{
              borderColor: '#F5B700',
              color: '#F5B700',
              '&:hover': {
                borderColor: '#FFCB00',
                bgcolor: '#F5B70015',
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Session Statistics Cards */}
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
                      {sessionStats?.activeSessions || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Sessions
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#4CAF50', color: '#FFFFFF' }}>
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
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #2196F315, #2196F305)',
              border: '1px solid #2196F320',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                      {sessionsResponse?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sessions
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2196F3', color: '#FFFFFF' }}>
                    <TimerIcon />
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
                      {formatBytes(sessionStats?.totalDataUsage || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Data Usage
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#FF9800', color: '#FFFFFF' }}>
                    <SignalIcon />
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
              background: 'linear-gradient(135deg, #9C27B015, #9C27B005)',
              border: '1px solid #9C27B020',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#9C27B0' }}>
                      {sessionStats?.averageDuration || 0}m
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Duration
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#9C27B0', color: '#FFFFFF' }}>
                    <TimerIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Session Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Sessions" />
          <Tab label="Active Sessions" />
          <Tab label="Terminated Sessions" />
          <Tab label="Hotspot Sessions" />
          <Tab label="PPPoE Sessions" />
        </Tabs>
      </Card>

      {/* Session Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search sessions..."
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
                      <MenuItem value="TERMINATED">Terminated</MenuItem>
                      <MenuItem value="EXPIRED">Expired</MenuItem>
                      <MenuItem value="SUSPENDED">Suspended</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
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

          {/* Sessions Table */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Data Usage</TableCell>
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
                    ) : paginatedSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No sessions found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSessions.map((session, index) => (
                        <motion.tr
                          key={session.id}
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
                                  {session.username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {session.macAddress}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getServiceTypeIcon(session.serviceType)}
                              <Typography variant="body2">
                                {session.serviceType}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {session.ipAddress}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={session.status}
                              sx={{
                                bgcolor: getStatusColor(session.status),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDuration(session.duration)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatBytes(session.bytesIn + session.bytesOut)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="View Details">
                                <IconButton size="small" color="info">
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              {canManageSessions && session.status === 'ACTIVE' && (
                                <Tooltip title="Terminate Session">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleTerminateSession(session.id)}
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                </Tooltip>
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
                count={filteredSessions.length}
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
              {['All Sessions', 'Active Sessions', 'Terminated Sessions', 'Hotspot Sessions', 'PPPoE Sessions'][activeTab]}
            </Typography>
            <Typography color="text.secondary">
              Category-specific session management will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Session Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          Session Details
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Session ID"
                value={formData.sessionId}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IP Address"
                value={formData.ipAddress}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="MAC Address"
                value={formData.macAddress}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Service Type"
                value={formData.serviceType}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                value={formData.status}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={formatDuration(formData.duration)}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Usage"
                value={formatBytes(formData.bytesIn + formData.bytesOut)}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionManagement;