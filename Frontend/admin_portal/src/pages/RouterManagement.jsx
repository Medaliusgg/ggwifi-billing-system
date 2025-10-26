import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Router as RouterIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  PowerSettingsNew as PowerIcon,
  SignalWifi4Bar as SignalIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  WifiOff as OfflineIcon,
  Wifi as OnlineIcon,
  Build as MaintenanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  Send as SendIcon
} from '@mui/icons-material';
import apiClient from '@/api/client';

const RouterManagement = () => {
  const [routers, setRouters] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Dialog states
  const [addRouterDialog, setAddRouterDialog] = useState(false);
  const [routerDetailsDialog, setRouterDetailsDialog] = useState(false);
  const [configDialog, setConfigDialog] = useState(false);
  const [selectedRouter, setSelectedRouter] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Form states
  const [routerForm, setRouterForm] = useState({
    name: '',
    type: 'HOTSPOT',
    location: '',
    model: 'MikroTik RB750Gr3',
    technicianPhone: '0742844024'
  });

  // Fetch routers data
  const fetchRouters = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/routers');
      if (response.data.status === 'success') {
        setRouters(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch routers');
      console.error('Error fetching routers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch router statistics
  const fetchStatistics = async () => {
    try {
      const response = await apiClient.get('/routers/statistics');
      if (response.data.status === 'success') {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchRouters();
    fetchStatistics();
  }, []);

  // Handle add router
  const handleAddRouter = async () => {
    try {
      const response = await apiClient.post('/routers/register', routerForm);
      if (response.data.status === 'success') {
        setSnackbar({
          open: true,
          message: 'Router registered successfully',
          severity: 'success'
        });
        setAddRouterDialog(false);
        setRouterForm({
          name: '',
          type: 'HOTSPOT',
          location: '',
          model: 'MikroTik RB750Gr3',
          technicianPhone: '0742844024'
        });
        fetchRouters();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to register router',
        severity: 'error'
      });
    }
  };

  // Handle router restart
  const handleRestartRouter = async (routerId) => {
    try {
      const response = await apiClient.post(`/routers/${routerId}/restart`);
      if (response.data.status === 'success') {
        setSnackbar({
          open: true,
          message: 'Router restarted successfully',
          severity: 'success'
        });
        fetchRouters();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to restart router',
        severity: 'error'
      });
    }
  };

  // Handle send technician alert
  const handleSendAlert = async (routerId) => {
    try {
      const response = await apiClient.post(`/routers/${routerId}/send-alert`);
      if (response.data.status === 'success') {
        setSnackbar({
          open: true,
          message: 'Technician alert sent successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send alert',
        severity: 'error'
      });
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return 'success';
      case 'OFFLINE': return 'error';
      case 'MAINTENANCE': return 'warning';
      case 'UNASSIGNED': return 'info';
      default: return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ONLINE': return <OnlineIcon />;
      case 'OFFLINE': return <OfflineIcon />;
      case 'MAINTENANCE': return <MaintenanceIcon />;
      case 'UNASSIGNED': return <WarningIcon />;
      default: return <RouterIcon />;
    }
  };

  // Filter routers by status
  const getRoutersByStatus = (status) => {
    return routers.filter(router => router.status === status);
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

  // Router card component
  const RouterCard = ({ router }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" gutterBottom>
              {router.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip
                icon={getStatusIcon(router.status)}
                label={router.status}
                color={getStatusColor(router.status)}
                size="small"
              />
              <Chip label={router.type} variant="outlined" size="small" />
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                {router.location}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <RouterIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                {router.model}
              </Typography>
            </Box>
            {router.status === 'ONLINE' && (
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <SignalIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  {router.connectedUsers}/{router.maxUsers} users
                </Typography>
              </Box>
            )}
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={() => {
                setSelectedRouter(router);
                setRouterDetailsDialog(true);
              }}
            >
              <ViewIcon />
            </IconButton>
            {router.status === 'ONLINE' && (
              <IconButton
                size="small"
                onClick={() => handleRestartRouter(router.id)}
              >
                <PowerIcon />
              </IconButton>
            )}
            {router.status === 'OFFLINE' && (
              <IconButton
                size="small"
                onClick={() => handleSendAlert(router.id)}
                color="error"
              >
                <SendIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading routers...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Router Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddRouterDialog(true)}
          sx={{ bgcolor: 'gg.yellow', color: 'black' }}
        >
          Add Router
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Routers"
            value={statistics.totalRouters || 0}
            icon={<RouterIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Online Routers"
            value={statistics.onlineRouters || 0}
            icon={<OnlineIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Offline Routers"
            value={statistics.offlineRouters || 0}
            icon={<OfflineIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={statistics.totalConnectedUsers || 0}
            icon={<SignalIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Tabs for different router categories */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab
              label={
                <Badge badgeContent={getRoutersByStatus('ONLINE').length} color="success">
                  Online Devices
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={getRoutersByStatus('OFFLINE').length} color="error">
                  Offline Devices
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={getRoutersByStatus('MAINTENANCE').length} color="warning">
                  Maintenance
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={getRoutersByStatus('UNASSIGNED').length} color="info">
                  Unassigned Devices
                </Badge>
              }
            />
            <Tab label="All Devices" />
          </Tabs>
        </Box>

        <CardContent>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Online Routers ({getRoutersByStatus('ONLINE').length})
              </Typography>
              {getRoutersByStatus('ONLINE').map(router => (
                <RouterCard key={router.id} router={router} />
              ))}
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Offline Routers ({getRoutersByStatus('OFFLINE').length})
              </Typography>
              {getRoutersByStatus('OFFLINE').map(router => (
                <RouterCard key={router.id} router={router} />
              ))}
            </Box>
          )}
          
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Maintenance Routers ({getRoutersByStatus('MAINTENANCE').length})
              </Typography>
              {getRoutersByStatus('MAINTENANCE').map(router => (
                <RouterCard key={router.id} router={router} />
              ))}
            </Box>
          )}
          
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Unassigned Routers ({getRoutersByStatus('UNASSIGNED').length})
              </Typography>
              {getRoutersByStatus('UNASSIGNED').map(router => (
                <RouterCard key={router.id} router={router} />
              ))}
            </Box>
          )}
          
          {activeTab === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                All Routers ({routers.length})
              </Typography>
              {routers.map(router => (
                <RouterCard key={router.id} router={router} />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add Router Dialog */}
      <Dialog open={addRouterDialog} onClose={() => setAddRouterDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Router</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Router Name"
              value={routerForm.name}
              onChange={(e) => setRouterForm({ ...routerForm, name: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Router Type</InputLabel>
              <Select
                value={routerForm.type}
                onChange={(e) => setRouterForm({ ...routerForm, type: e.target.value })}
              >
                <MenuItem value="HOTSPOT">Hotspot</MenuItem>
                <MenuItem value="PPPOE">PPPoE</MenuItem>
                <MenuItem value="HYBRID">Hybrid</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Location"
              value={routerForm.location}
              onChange={(e) => setRouterForm({ ...routerForm, location: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Model"
              value={routerForm.model}
              onChange={(e) => setRouterForm({ ...routerForm, model: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Technician Phone"
              value={routerForm.technicianPhone}
              onChange={(e) => setRouterForm({ ...routerForm, technicianPhone: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddRouterDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRouter} variant="contained">
            Register Router
          </Button>
        </DialogActions>
      </Dialog>

      {/* Router Details Dialog */}
      <Dialog open={routerDetailsDialog} onClose={() => setRouterDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Router Details</DialogTitle>
        <DialogContent>
          {selectedRouter && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><RouterIcon /></ListItemIcon>
                      <ListItemText primary="Name" secondary={selectedRouter.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><LocationIcon /></ListItemIcon>
                      <ListItemText primary="Location" secondary={selectedRouter.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><PhoneIcon /></ListItemIcon>
                      <ListItemText primary="Technician" secondary={selectedRouter.technicianPhone} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Technical Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Type" secondary={selectedRouter.type} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Model" secondary={selectedRouter.model} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="IP Address" secondary={selectedRouter.ip || 'Not assigned'} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Uptime" secondary={selectedRouter.uptime || 'N/A'} />
                    </ListItem>
                  </List>
                </Grid>
                {selectedRouter.status === 'ONLINE' && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Connection Status
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h4" color="primary">
                              {selectedRouter.connectedUsers}
                            </Typography>
                            <Typography variant="body2">Connected Users</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h4" color="success">
                              {selectedRouter.maxUsers}
                            </Typography>
                            <Typography variant="body2">Max Capacity</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h4" color="info">
                              {selectedRouter.signalStrength}
                            </Typography>
                            <Typography variant="body2">Signal Strength</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRouterDetailsDialog(false)}>Close</Button>
          {selectedRouter?.status === 'ONLINE' && (
            <Button onClick={() => handleRestartRouter(selectedRouter.id)} startIcon={<PowerIcon />}>
              Restart
            </Button>
          )}
          {selectedRouter?.status === 'OFFLINE' && (
            <Button onClick={() => handleSendAlert(selectedRouter.id)} startIcon={<SendIcon />} color="error">
              Send Alert
            </Button>
          )}
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

export default RouterManagement;
