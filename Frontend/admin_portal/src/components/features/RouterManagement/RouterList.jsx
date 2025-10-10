import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  IconButton,
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
  LinearProgress,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Router as RouterIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

const RouterList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [routers, setRouters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRouter, setEditingRouter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    location: '',
    ipAddress: '',
    username: '',
    password: '',
    port: '8728',
    status: 'ACTIVE',
    type: 'MIKROTIK',
    description: '',
  });

  const loadRouters = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      const mockRouters = [
        {
          id: 1,
          name: 'Main Office Router',
          model: 'RB4011iGS+RM',
          location: 'Main Office',
          ipAddress: '192.168.1.1',
          status: 'ONLINE',
          type: 'MIKROTIK',
          connectedUsers: 15,
          cpuUsage: 45,
          memoryUsage: 60,
          uptime: '15 days',
          lastSeen: new Date(),
        },
        {
          id: 2,
          name: 'Branch Router 1',
          model: 'hAP ac²',
          location: 'Branch Office 1',
          ipAddress: '192.168.2.1',
          status: 'ONLINE',
          type: 'MIKROTIK',
          connectedUsers: 8,
          cpuUsage: 30,
          memoryUsage: 45,
          uptime: '8 days',
          lastSeen: new Date(),
        },
        {
          id: 3,
          name: 'Branch Router 2',
          model: 'RB951G-2HnD',
          location: 'Branch Office 2',
          ipAddress: '192.168.3.1',
          status: 'OFFLINE',
          type: 'MIKROTIK',
          connectedUsers: 0,
          cpuUsage: 0,
          memoryUsage: 0,
          uptime: '0 days',
          lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
        },
      ];
      
      setRouters(mockRouters);
    } catch (error) {
      enqueueSnackbar('Failed to load routers', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadRouters();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadRouters, 60000);
    return () => clearInterval(interval);
  }, [loadRouters]);

  const handleAdd = () => {
    setEditingRouter(null);
    setFormData({
      name: '',
      model: '',
      location: '',
      ipAddress: '',
      username: '',
      password: '',
      port: '8728',
      status: 'ACTIVE',
      type: 'MIKROTIK',
      description: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (router) => {
    setEditingRouter(router);
    setFormData({
      name: router.name || '',
      model: router.model || '',
      location: router.location || '',
      ipAddress: router.ipAddress || '',
      username: router.username || '',
      password: router.password || '',
      port: router.port || '8728',
      status: router.status || 'ACTIVE',
      type: router.type || 'MIKROTIK',
      description: router.description || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (routerId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRouters(routers.filter(r => r.id !== routerId));
      enqueueSnackbar('Router deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete router', { variant: 'error' });
    }
  };

  const handleSave = async () => {
    try {
      if (editingRouter) {
        // Update existing router
        setRouters(routers.map(r => 
          r.id === editingRouter.id 
            ? { ...r, ...formData, lastSeen: new Date() }
            : r
        ));
        enqueueSnackbar('Router updated successfully', { variant: 'success' });
      } else {
        // Add new router
        const newRouter = {
          id: Date.now(),
          ...formData,
          connectedUsers: 0,
          cpuUsage: 0,
          memoryUsage: 0,
          uptime: '0 days',
          lastSeen: new Date(),
        };
        setRouters([...routers, newRouter]);
        enqueueSnackbar('Router added successfully', { variant: 'success' });
      }
      setDialogOpen(false);
    } catch (error) {
      enqueueSnackbar('Failed to save router', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'success';
      case 'OFFLINE':
        return 'error';
      case 'WARNING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircleIcon color="success" />;
      case 'OFFLINE':
        return <ErrorIcon color="error" />;
      case 'WARNING':
        return <WarningIcon color="warning" />;
      default:
        return <RouterIcon color="action" />;
    }
  };

  const RouterCard = ({ router }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, #1976d2 0%, #1565c0 100%)`,
                mr: 2,
              }}
            >
              <RouterIcon sx={{ color: 'white' }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {router.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {router.model} • {router.location}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon(router.status)}
              <Chip
                label={router.status}
                color={getStatusColor(router.status)}
                size="small"
              />
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                IP Address
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {router.ipAddress}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Connected Users
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {router.connectedUsers}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                CPU Usage
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={router.cpuUsage}
                  sx={{ flex: 1, height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption">
                  {router.cpuUsage}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Memory Usage
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={router.memoryUsage}
                  sx={{ flex: 1, height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption">
                  {router.memoryUsage}%
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Uptime: {router.uptime}
            </Typography>
            <Box>
              <Tooltip title="View Details">
                <IconButton size="small">
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Router">
                <IconButton size="small" onClick={() => handleEdit(router)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Configure">
                <IconButton size="small">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Router">
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleDelete(router.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Router Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage MikroTik routers across all locations
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadRouters}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              },
            }}
          >
            Add Router
          </Button>
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {routers.filter(r => r.status === 'ONLINE').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Online Routers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="error.main">
                {routers.filter(r => r.status === 'OFFLINE').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Offline Routers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {routers.reduce((sum, r) => sum + r.connectedUsers, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Connected Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="info.main">
                {routers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Routers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Router Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {routers.map((router) => (
            <Grid item xs={12} sm={6} md={4} key={router.id}>
              <RouterCard router={router} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Router Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRouter ? 'Edit Router' : 'Add New Router'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Router Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IP Address"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Port"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              },
            }}
          >
            {editingRouter ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RouterList; 