import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Wifi as WifiIcon,
  Speed as SpeedIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { packagesAPI } from '../services/api';

const Packages = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    speed: '',
    price: '',
    dataLimit: '',
    type: 'internet',
  });

  const loadPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await packagesAPI.getAll();
      setPackages(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to load packages', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  const handleAdd = () => {
    setEditingPackage(null);
    setDialogOpen(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await packagesAPI.delete(id);
      enqueueSnackbar('Package deleted successfully', { variant: 'success' });
      loadPackages();
    } catch (error) {
      enqueueSnackbar('Failed to delete package', { variant: 'error' });
    }
  };

  const handleSave = async (packageData) => {
    try {
      if (editingPackage) {
        await packagesAPI.update(editingPackage.id, packageData);
        enqueueSnackbar('Package updated successfully', { variant: 'success' });
      } else {
        await packagesAPI.create(packageData);
        enqueueSnackbar('Package created successfully', { variant: 'success' });
      }
      setDialogOpen(false);
      loadPackages();
    } catch (error) {
      enqueueSnackbar('Failed to save package', { variant: 'error' });
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
      headerName: 'Package Name',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SpeedIcon sx={{ mr: 2, bgcolor: 'primary.main' }} />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.description}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'speed',
      headerName: 'Speed',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={<SpeedIcon />}
          label={`${params.value} Mbps`}
          color="primary"
          size="small"
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MoneyIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" fontWeight={600}>
            TZS {params.value?.toLocaleString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'validity',
      headerName: 'Duration',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ScheduleIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'packageType',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'HOTSPOT' ? 'success' : 'info'}
          size="small"
          icon={params.value === 'HOTSPOT' ? <WifiIcon /> : <RouterIcon />}
        />
      ),
    },
    {
      field: 'isPopular',
      headerName: 'Popular',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'warning' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'ACTIVE' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => handleView(params.row)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Package Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage internet packages for hotspot and PPPoE services
        </Typography>
      </Box>

      {/* Search and Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search packages..."
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
          Add Package
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
          rows={packages}
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

      {/* Package Dialog */}
      <PackageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        package={editingPackage}
        type={editingPackage ? 'edit' : 'add'}
        onSave={handleSave}
      />
    </Box>
  );
};

// Package Dialog Component
const PackageDialog = ({ open, onClose, package: pkg, type, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    speed: '',
    price: '',
    validity: '',
    packageType: 'HOTSPOT',
    isPopular: false,
    status: 'ACTIVE',
    dataLimit: '',
    downloadSpeed: '',
    uploadSpeed: '',
  });

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || '',
        description: pkg.description || '',
        speed: pkg.speed || '',
        price: pkg.price || '',
        validity: pkg.validity || '',
        packageType: pkg.packageType || 'HOTSPOT',
        isPopular: pkg.isPopular || false,
        status: pkg.status || 'ACTIVE',
        dataLimit: pkg.dataLimit || '',
        downloadSpeed: pkg.downloadSpeed || '',
        uploadSpeed: pkg.uploadSpeed || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        speed: '',
        price: '',
        validity: '',
        packageType: 'HOTSPOT',
        isPopular: false,
        status: 'ACTIVE',
        dataLimit: '',
        downloadSpeed: '',
        uploadSpeed: '',
      });
    }
  }, [pkg]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {type === 'add' ? 'Add' : type === 'edit' ? 'Edit' : 'View'} Package
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Package Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={type === 'view'}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Speed (Mbps)"
                type="number"
                value={formData.speed}
                onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                disabled={type === 'view'}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={type === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (TZS)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={type === 'view'}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.validity}
                onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                disabled={type === 'view'}
                placeholder="e.g., 30 days"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Package Type</InputLabel>
                <Select
                  value={formData.packageType}
                  onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                  disabled={type === 'view'}
                >
                  <MenuItem value="HOTSPOT">Hotspot</MenuItem>
                  <MenuItem value="PPPOE">PPPoE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={type === 'view'}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Limit (GB)"
                type="number"
                value={formData.dataLimit}
                onChange={(e) => setFormData({ ...formData, dataLimit: e.target.value })}
                disabled={type === 'view'}
                placeholder="Unlimited"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    disabled={type === 'view'}
                  />
                }
                label="Popular Package"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {type !== 'view' && (
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
            {type === 'add' ? 'Create' : 'Update'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Packages; 