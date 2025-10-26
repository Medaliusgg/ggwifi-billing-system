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
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Build as TechnicianIcon,
  AttachMoney as FinanceIcon,
  Store as MarketingIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import apiClient from '/src/api/client.js';

const UserManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  // State management
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'
  const [openView, setOpenView] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    staffId: '',
    role: 'TECHNICIAN',
    department: 'IT',
    position: '',
    status: 'ACTIVE',
    isEmailVerified: false,
    isPhoneVerified: false,
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // Fetch users with React Query
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['users', page, rowsPerPage, searchTerm, roleFilter, statusFilter, departmentFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter !== 'ALL') params.append('role', roleFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (departmentFilter !== 'ALL') params.append('department', departmentFilter);

      const response = await apiClient.get(`/admin/users?${params}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await apiClient.post('/admin/users', userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      enqueueSnackbar('User created successfully!', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create user', { variant: 'error' });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }) => {
      const response = await apiClient.put(`/admin/users/${id}`, userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      enqueueSnackbar('User updated successfully!', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update user', { variant: 'error' });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/admin/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      enqueueSnackbar('User deleted successfully!', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete user', { variant: 'error' });
    },
  });

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!editingUser && !formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.role) {
      errors.role = 'Role is required';
    // Credential requirements by role for successful login later
    if (formData.role === 'SUPER_ADMIN' || formData.role === 'ADMIN') {
      if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number is required for admin login';
      }
    } else {
      if (!formData.staffId.trim()) {
        errors.staffId = 'Staff ID is required for staff login';
      }
    }

    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      staffId: formData.staffId,
      role: formData.role,
      department: formData.department,
      position: formData.position,
      status: formData.status,
      isEmailVerified: formData.isEmailVerified,
      isPhoneVerified: formData.isPhoneVerified,
    };

    // Only include password if it's provided
    if (formData.password) {
      userData.password = formData.password;
    }

    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, userData });
    } else {
      createUserMutation.mutate(userData);
    }
  };

  // Handle dialog open/close
  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: '',
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
        staffId: user.staffId || '',
        role: user.role,
        department: user.department || 'IT',
        position: user.position || '',
        status: user.status,
        isEmailVerified: user.isEmailVerified || false,
        isPhoneVerified: user.isPhoneVerified || false,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        staffId: '',
        role: 'TECHNICIAN',
        department: 'IT',
        position: '',
        status: 'ACTIVE',
        isEmailVerified: false,
        isPhoneVerified: false,
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({});
    setFormErrors({});
  };

  // Handle user actions
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Handle menu actions
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleOpenView = () => {
    // persist a stable snapshot for the details dialog
    setViewUser(selectedUser);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setViewUser(null);
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return <AdminIcon />;
      case 'TECHNICIAN':
        return <TechnicianIcon />;
      case 'FINANCE':
        return <FinanceIcon />;
      case 'MARKETING':
      case 'SALES':
        return <MarketingIcon />;
      default:
        return <PersonIcon />;
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'error';
      case 'ADMIN':
        return 'warning';
      case 'TECHNICIAN':
        return 'info';
      case 'FINANCE':
        return 'success';
      case 'MARKETING':
      case 'SALES':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'ACTIVE' ? 'success' : 'error';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Get user initials
  const getUserInitials = (user) => {
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const humanize = (value) => {
    if (!value) return 'N/A';
    return String(value)
      .toLowerCase()
      .split('_')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  };

  const formatPhone = (phone) => {
    if (!phone) return '—';
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length === 10) return `${digits.slice(0,3)} ${digits.slice(3,6)} ${digits.slice(6)}`;
    if (digits.length === 12) return `${digits.slice(0,3)} ${digits.slice(3,6)} ${digits.slice(6,9)} ${digits.slice(9)}`;
    return phone;
  };

  const getDisplayName = (user) => {
    const fn = user.firstName?.trim();
    const ln = user.lastName?.trim();
    const full = [fn, ln].filter(Boolean).join(' ');
    return full || user.username;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const usersRaw = usersData?.data || [];
  const users = [...usersRaw].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'name': {
        const an = getDisplayName(a).toLowerCase();
        const bn = getDisplayName(b).toLowerCase();
        return an > bn ? dir : an < bn ? -dir : 0;
      }
      case 'username': {
        const an = (a.username || '').toLowerCase();
        const bn = (b.username || '').toLowerCase();
        return an > bn ? dir : an < bn ? -dir : 0;
      }
      case 'role': {
        const ar = (a.role || '').toLowerCase();
        const br = (b.role || '').toLowerCase();
        return ar > br ? dir : ar < br ? -dir : 0;
      }
      case 'status': {
        const as = (a.status || '').toLowerCase();
        const bs = (b.status || '').toLowerCase();
        return as > bs ? dir : as < bs ? -dir : 0;
      }
      case 'createdAt': {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return ad > bd ? dir : ad < bd ? -dir : 0;
      }
      default:
        return 0;
    }
  });
  const pagination = usersData?.pagination || {};

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
          <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            color: '#000000', // Black - Main text, headings
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}>
            👥 User Management
            </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage system administrators and staff users
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
            sx={{
            backgroundColor: '#FFC72C', // Golden Yellow - Call-to-action buttons
            color: '#000000', // Black text
              '&:hover': {
              backgroundColor: '#E6B800', // Darker Golden Yellow on hover
              },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
          Add User
          </Button>
        </Box>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
              <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
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
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Roles</MenuItem>
                  <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="TECHNICIAN">Technician</MenuItem>
                  <MenuItem value="FINANCE">Finance</MenuItem>
                  <MenuItem value="MARKETING">Marketing</MenuItem>
                  <MenuItem value="SALES">Sales</MenuItem>
                </Select>
              </FormControl>
        </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  label="Department"
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Departments</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                </Select>
              </FormControl>
        </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => refetch()}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
        </Grid>
              </CardContent>
            </Card>

      {/* Users Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              Failed to load users: {error.message}
            </Alert>
          ) : (
            <>
              <TableContainer sx={{ 
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  },
                },
              }}>
                <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                      <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap', width: '28%' }}>
                        Name / Username {sortBy==='name' ? (sortDir==='asc' ? '▲' : '▼') : ''}
                      </TableCell>
                      <TableCell sx={{ width: '30%' }}>Contact</TableCell>
                      <TableCell onClick={() => handleSort('role')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap', width: '12%' }} align="center">
                        Role {sortBy==='role' ? (sortDir==='asc' ? '▲' : '▼') : ''}
                      </TableCell>
                      <TableCell onClick={() => handleSort('status')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap', width: '10%' }} align="center">
                        Status {sortBy==='status' ? (sortDir==='asc' ? '▲' : '▼') : ''}
                      </TableCell>
                      <TableCell sx={{ width: '12%' }}>Department</TableCell>
                      <TableCell onClick={() => handleSort('createdAt')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap', width: '8%' }} align="right">
                        Created {sortBy==='createdAt' ? (sortDir==='asc' ? '▲' : '▼') : ''}
                      </TableCell>
                      <TableCell align="right" sx={{ width: '6%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <AnimatePresence>
                      {users.map((user) => (
                          <TableRow
                            key={user.id}
                            component={motion.tr}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                          >
                      <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: 'primary.main',
                                    width: 40,
                                    height: 40,
                                  }}
                                >
                                  {getUserInitials(user)}
                          </Avatar>
                          <Box>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {getDisplayName(user)}
                            </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                            <TableCell sx={{ pr: 2 }}>
                        <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" sx={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.email || '—'}
                                  </Typography>
                                  {user.isEmailVerified && (
                                    <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                  )}
                                </Box>
                                {user.phoneNumber && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                      {formatPhone(user.phoneNumber)}
                                    </Typography>
                                    {user.isPhoneVerified && (
                                      <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                    )}
                                  </Box>
                                )}
                                {user.staffId && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BadgeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                      {user.staffId}
                          </Typography>
                        </Box>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                icon={getRoleIcon(user.role)}
                                label={humanize(user.role)}
                                color={getRoleColor(user.role)}
                                size="small"
                              />
                      </TableCell>
                            <TableCell align="center">
                        <Chip
                                label={humanize(user.status)}
                                color={getStatusColor(user.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                              <Typography variant="body2">
                                {humanize(user.department) || 'N/A'}
                              </Typography>
                              {user.position && (
                                <Typography variant="caption" color="text.secondary">
                                  {humanize(user.position)}
                        </Typography>
                              )}
                      </TableCell>
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                              <Typography variant="body2">
                                {formatDate(user.createdAt)}
                        </Typography>
                      </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={(e) => handleMenuOpen(e, user)}
                                size="small"
                              >
                                <MoreVertIcon />
                          </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                    </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>

              {/* Pagination */}
              <TablePagination
                component="div"
                count={pagination.totalElements || 0}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
          </CardContent>
        </Card>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleOpenDialog(selectedUser); handleMenuClose(); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { if (selectedUser) { handleOpenView(); } handleMenuClose(); }}>
          <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleDeleteUser(selectedUser?.id); handleMenuClose(); }}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete User</ListItemText>
        </MenuItem>
      </Menu>

      {/* View Details Dialog */}
      <Dialog
        open={openView}
        onClose={handleCloseView}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          {viewUser ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{getUserInitials(viewUser)}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{getDisplayName(viewUser)}</Typography>
                    <Typography variant="body2" color="text.secondary">@{viewUser.username}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body2">{viewUser.email || '—'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Phone</Typography>
                <Typography variant="body2">{formatPhone(viewUser.phoneNumber) || '—'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Role</Typography>
                <Typography variant="body2">{humanize(viewUser.role)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Typography variant="body2">{humanize(viewUser.status)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Department</Typography>
                <Typography variant="body2">{humanize(viewUser.department) || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Position</Typography>
                <Typography variant="body2">{humanize(viewUser.position) || '—'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Created</Typography>
                <Typography variant="body2">{formatDate(viewUser.createdAt)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Updated</Typography>
                <Typography variant="body2">{formatDate(viewUser.updatedAt)}</Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body2">No user selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { const u=viewUser; handleCloseView(); if(u) handleOpenDialog(u); }} startIcon={<EditIcon />}>Edit</Button>
          <Button onClick={() => { const id=viewUser?.id; handleCloseView(); if(id) handleDeleteUser(id); }} color="error" startIcon={<DeleteIcon />}>Delete</Button>
          <Button onClick={handleCloseView} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  📝 Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username *"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  disabled={!!editingUser} // Username cannot be changed
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={editingUser ? "New Password (leave blank to keep current)" : "Password *"}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                />
              </Grid>

              {/* Personal Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  👤 Personal Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name *"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Staff ID"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                />
              </Grid>

              {/* Work Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  🏢 Work Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth error={!!formErrors.role}>
                  <InputLabel>Role *</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role *"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="TECHNICIAN">Technician</MenuItem>
                    <MenuItem value="FINANCE">Finance</MenuItem>
                    <MenuItem value="MARKETING">Marketing</MenuItem>
                    <MenuItem value="SALES">Sales</MenuItem>
                  </Select>
                  {formErrors.role && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {formErrors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department}
                    label="Department"
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <MenuItem value="IT">IT</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                    <MenuItem value="Support">Support</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </Grid>

              {/* Account Settings */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  ⚙️ Account Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="SUSPENDED">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isEmailVerified}
                      onChange={(e) => setFormData({ ...formData, isEmailVerified: e.target.checked })}
                    />
                  }
                  label="Email Verified"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPhoneVerified}
                      onChange={(e) => setFormData({ ...formData, isPhoneVerified: e.target.checked })}
                    />
                  }
                  label="Phone Verified"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
            >
              {createUserMutation.isPending || updateUserMutation.isPending ? (
                <CircularProgress size={24} />
              ) : editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;