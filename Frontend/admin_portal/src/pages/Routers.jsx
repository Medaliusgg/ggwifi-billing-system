import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Router as RouterIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { routersAPI } from '../services/api';

const Routers = () => {
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
    status: 'active',
  });

  const loadRouters = useCallback(async () => {
    try {
      setLoading(true);
      const response = await routersAPI.getAll();
      setRouters(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to load routers', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadRouters();
  }, [loadRouters]);

  const handleAdd = () => {
    setEditingRouter(null);
    setFormData({
      name: '',
      model: '',
      location: '',
      ipAddress: '',
      status: 'active',
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
      status: router.status || 'active',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await routersAPI.delete(id);
      enqueueSnackbar('Router deleted successfully', { variant: 'success' });
      loadRouters();
    } catch (error) {
      enqueueSnackbar('Failed to delete router', { variant: 'error' });
    }
  };

  const handleSave = async () => {
    try {
      if (editingRouter) {
        await routersAPI.update(editingRouter.id, formData);
        enqueueSnackbar('Router updated successfully', { variant: 'success' });
      } else {
        await routersAPI.create(formData);
        enqueueSnackbar('Router created successfully', { variant: 'success' });
      }
      setDialogOpen(false);
      loadRouters();
    } catch (error) {
      enqueueSnackbar('Failed to save router', { variant: 'error' });
    }
  };

  const handleReboot = async (id) => {
    try {
      await routersAPI.reboot(id);
      enqueueSnackbar('Router reboot initiated', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to reboot router', { variant: 'error' });
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'online':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
      case 'offline':
        return <ErrorIcon color="error" />;
      default:
        return <RouterIcon color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'online':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'name',
      headerName: 'Router Name',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RouterIcon sx={{ mr: 2, bgcolor: 'primary.main' }} />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.model}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      width: 150,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getStatusIcon(params.value)}
          <Chip
            label={params.value}
            color={getStatusColor(params.value)}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
      ),
    },
    {
      field: 'cpuUsagePercent',
      headerName: 'CPU',
      width: 100,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {params.value || 0}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={params.value || 0}
            color={params.value > 80 ? 'error' : params.value > 60 ? 'warning' : 'success'}
            sx={{ height: 4, borderRadius: 2 }}
          />
        </Box>
      ),
    },
    {
      field: 'memoryUsagePercent',
      headerName: 'Memory',
      width: 100,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {params.value || 0}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={params.value || 0}
            color={params.value > 80 ? 'error' : params.value > 60 ? 'warning' : 'success'}
            sx={{ height: 4, borderRadius: 2 }}
          />
        </Box>
      ),
    },
    {
      field: 'activeConnections',
      headerName: 'Sessions',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || 0}
          size="small"
          color="primary"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="warning"
            onClick={() => handleReboot(params.row.id)}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Router Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage MikroTik routers across all sites
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {routers.filter(r => r.status === 'ACTIVE').length}
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
              <Typography variant="h4" fontWeight={700} color="error">
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
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {routers.filter(r => r.status === 'MAINTENANCE').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Maintenance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="info.main">
                {routers.reduce((sum, r) => sum + (r.activeConnections || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search routers..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flex: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
          }}
        >
          Add Router
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadRouters}
        >
          Refresh
        </Button>
      </Box>

      {/* Data Grid */}
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <DataGrid
          rows={routers}
          columns={columns}
          loading={loading}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
            },
            '& .MuiDataGrid-columnHeaders': {
              background: 'rgba(102, 126, 234, 0.1)',
              borderBottom: '2px solid rgba(102, 126, 234, 0.2)',
            },
          }}
        />
      </Card>

      {/* Router Dialog */}
      <RouterDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        router={editingRouter}
        onSave={handleSave}
      />
    </Box>
  );
};

// Router Dialog Component
const RouterDialog = ({ open, onClose, router, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    model: '',
    location: '',
    username: '',
    password: '',
    port: 8728,
    status: 'ACTIVE',
    type: 'MIKROTIK',
    description: '',
  });

  useEffect(() => {
    if (router) {
      setFormData({
        name: router.name || '',
        ipAddress: router.ipAddress || '',
        model: router.model || '',
        location: router.location || '',
        username: router.username || '',
        password: router.password || '',
        port: router.port || 8728,
        status: router.status || 'ACTIVE',
        type: router.type || 'MIKROTIK',
        description: router.description || '',
      });
    } else {
      setFormData({
        name: '',
        ipAddress: '',
        model: '',
        location: '',
        username: '',
        password: '',
        port: 8728,
        status: 'ACTIVE',
        type: 'MIKROTIK',
        description: '',
      });
    }
  }, [router]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {router ? 'Edit' : 'Add'} Router
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Router Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={router}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IP Address"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                disabled={router}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                disabled={router}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={router}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={router}
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
                disabled={router}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Port"
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                disabled={router}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={router}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                  <MenuItem value="OFFLINE">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  disabled={router}
                >
                  <MenuItem value="MIKROTIK">MikroTik</MenuItem>
                  <MenuItem value="CISCO">Cisco</MenuItem>
                  <MenuItem value="TP_LINK">TP-Link</MenuItem>
                  <MenuItem value="D_LINK">D-Link</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
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
                disabled={router}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
          }}
        >
          {router ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Routers; 