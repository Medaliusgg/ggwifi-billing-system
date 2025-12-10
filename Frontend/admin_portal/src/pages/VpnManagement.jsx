import React, { useState } from 'react';
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
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Security as SecurityIcon,
  Router as RouterIcon,
  Cloud as CloudIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  VpnKey as VpnKeyIcon,
  NetworkCheck as NetworkCheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import { vpnAPI, vpnProvisionAPI } from '/src/services/api.js';

/**
 * VPN Management Page
 * Module J: VPN Module - WireGuard Management
 * Manages VPN servers, peers, and router provisioning
 */
const VpnManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser, hasPermission } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(0);
  const [openPeerDialog, setOpenPeerDialog] = useState(false);
  const [openServerDialog, setOpenServerDialog] = useState(false);
  const [editingPeer, setEditingPeer] = useState(null);
  const [editingServer, setEditingServer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedServer, setSelectedServer] = useState(null);

  // Form state for peer
  const [peerFormData, setPeerFormData] = useState({
    routerId: '',
    vpnServerId: '',
    allowedIp: '',
    persistentKeepalive: 25,
  });

  // Form state for server
  const [serverFormData, setServerFormData] = useState({
    name: '',
    publicEndpoint: '',
    listenPort: 51820,
    networkCidr: '10.77.0.0/16',
    status: 'ACTIVE',
  });

  // Fetch VPN peers
  const { data: peersData, isLoading: peersLoading, refetch: refetchPeers } = useQuery({
    queryKey: ['vpn-peers', page, rowsPerPage, statusFilter, selectedServer],
    queryFn: async () => {
      const params = {
        page,
        size: rowsPerPage,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        serverId: selectedServer || undefined,
      };
      const response = await vpnAPI.getAllPeers(params);
      return response?.data || response;
    },
  });

  // Fetch VPN servers
  const { data: serversData, isLoading: serversLoading, refetch: refetchServers } = useQuery({
    queryKey: ['vpn-servers'],
    queryFn: async () => {
      const response = await vpnAPI.getAllServers();
      return response?.data || response;
    },
  });

  // Fetch VPN statistics
  const { data: statisticsData } = useQuery({
    queryKey: ['vpn-statistics'],
    queryFn: async () => {
      const response = await vpnAPI.getStatistics();
      return response?.data || response;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const peers = peersData?.content || peersData?.peers || [];
  const servers = serversData?.servers || serversData || [];
  const statistics = statisticsData || {};

  // Create peer mutation
  const createPeerMutation = useMutation({
    mutationFn: (data) => vpnAPI.createPeer(data),
    onSuccess: () => {
      enqueueSnackbar('VPN Peer created successfully', { variant: 'success' });
      queryClient.invalidateQueries(['vpn-peers']);
      setOpenPeerDialog(false);
      resetPeerForm();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to create VPN peer', { variant: 'error' });
    },
  });

  // Update peer mutation
  const updatePeerMutation = useMutation({
    mutationFn: ({ peerId, data }) => vpnAPI.updatePeer(peerId, data),
    onSuccess: () => {
      enqueueSnackbar('VPN Peer updated successfully', { variant: 'success' });
      queryClient.invalidateQueries(['vpn-peers']);
      setOpenPeerDialog(false);
      resetPeerForm();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to update VPN peer', { variant: 'error' });
    },
  });

  // Delete peer mutation
  const deletePeerMutation = useMutation({
    mutationFn: (peerId) => vpnAPI.deletePeer(peerId),
    onSuccess: () => {
      enqueueSnackbar('VPN Peer deleted successfully', { variant: 'success' });
      queryClient.invalidateQueries(['vpn-peers']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to delete VPN peer', { variant: 'error' });
    },
  });

  // Revoke peer mutation
  const revokePeerMutation = useMutation({
    mutationFn: (peerId) => vpnAPI.revokePeer(peerId),
    onSuccess: () => {
      enqueueSnackbar('VPN Peer revoked successfully', { variant: 'success' });
      queryClient.invalidateQueries(['vpn-peers']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to revoke VPN peer', { variant: 'error' });
    },
  });

  // Create server mutation
  const createServerMutation = useMutation({
    mutationFn: (data) => vpnAPI.createServer(data),
    onSuccess: () => {
      enqueueSnackbar('VPN Server created successfully', { variant: 'success' });
      queryClient.invalidateQueries(['vpn-servers']);
      setOpenServerDialog(false);
      resetServerForm();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to create VPN server', { variant: 'error' });
    },
  });

  // Generate peer for router mutation
  const generatePeerMutation = useMutation({
    mutationFn: (routerId) => vpnProvisionAPI.generatePeerForRouter(routerId),
    onSuccess: (data) => {
      enqueueSnackbar('VPN Peer generated successfully', { variant: 'success' });
      queryClient.invalidateQueries(['vpn-peers']);
      // Show peer config in dialog
      console.log('Generated peer config:', data);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to generate VPN peer', { variant: 'error' });
    },
  });

  const resetPeerForm = () => {
    setPeerFormData({
      routerId: '',
      vpnServerId: '',
      allowedIp: '',
      persistentKeepalive: 25,
    });
    setEditingPeer(null);
  };

  const resetServerForm = () => {
    setServerFormData({
      name: '',
      publicEndpoint: '',
      listenPort: 51820,
      networkCidr: '10.77.0.0/16',
      status: 'ACTIVE',
    });
    setEditingServer(null);
  };

  const handleCreatePeer = () => {
    setEditingPeer(null);
    resetPeerForm();
    setOpenPeerDialog(true);
  };

  const handleEditPeer = (peer) => {
    setEditingPeer(peer);
    setPeerFormData({
      routerId: peer.routerId || '',
      vpnServerId: peer.vpnServerId || '',
      allowedIp: peer.allowedIp || '',
      persistentKeepalive: peer.persistentKeepalive || 25,
    });
    setOpenPeerDialog(true);
  };

  const handleSavePeer = () => {
    if (editingPeer) {
      updatePeerMutation.mutate({ peerId: editingPeer.id, data: peerFormData });
    } else {
      createPeerMutation.mutate(peerFormData);
    }
  };

  const handleDeletePeer = (peerId) => {
    if (window.confirm('Are you sure you want to delete this VPN peer?')) {
      deletePeerMutation.mutate(peerId);
    }
  };

  const handleRevokePeer = (peerId) => {
    if (window.confirm('Are you sure you want to revoke this VPN peer?')) {
      revokePeerMutation.mutate(peerId);
    }
  };

  const handleCreateServer = () => {
    setEditingServer(null);
    resetServerForm();
    setOpenServerDialog(true);
  };

  const handleSaveServer = () => {
    createServerMutation.mutate(serverFormData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'SUSPENDED':
        return 'error';
      case 'REVOKED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            VPN Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Module J: WireGuard VPN Server and Peer Management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              refetchPeers();
              refetchServers();
            }}
          >
            Refresh
          </Button>
          {activeTab === 0 && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreatePeer}>
              Add Peer
            </Button>
          )}
          {activeTab === 1 && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateServer}>
              Add Server
            </Button>
          )}
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Servers
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {statistics.totalServers || servers.length}
                  </Typography>
                </Box>
                <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Peers
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {statistics.totalPeers || peers.length}
                  </Typography>
                </Box>
                <VpnKeyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Peers
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {statistics.activePeers || peers.filter(p => p.status === 'ACTIVE').length}
                  </Typography>
                </Box>
                <NetworkCheckIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending Peers
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {statistics.pendingPeers || peers.filter(p => p.status === 'PENDING').length}
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="VPN Peers" icon={<VpnKeyIcon />} iconPosition="start" />
            <Tab label="VPN Servers" icon={<CloudIcon />} iconPosition="start" />
            <Tab label="Statistics" icon={<NetworkCheckIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* VPN Peers Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search peers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                  <MenuItem value="REVOKED">Revoked</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Server</InputLabel>
                <Select
                  value={selectedServer || ''}
                  label="Server"
                  onChange={(e) => setSelectedServer(e.target.value || null)}
                >
                  <MenuItem value="">All Servers</MenuItem>
                  {servers.map((server) => (
                    <MenuItem key={server.id} value={server.id}>
                      {server.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Peers Table */}
            {peersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Peer ID</TableCell>
                        <TableCell>Router</TableCell>
                        <TableCell>Server</TableCell>
                        <TableCell>Allowed IP</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last Handshake</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {peers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No VPN peers found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        peers.map((peer) => (
                          <TableRow key={peer.id} hover>
                            <TableCell>{peer.id}</TableCell>
                            <TableCell>{peer.routerId || 'N/A'}</TableCell>
                            <TableCell>{peer.vpnServerId || 'N/A'}</TableCell>
                            <TableCell>{peer.allowedIp || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip
                                label={peer.status}
                                color={getStatusColor(peer.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {peer.lastHandshake
                                ? new Date(peer.lastHandshake).toLocaleString()
                                : 'Never'}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton size="small" onClick={() => handleEditPeer(peer)}>
                                    <ViewIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {peer.status === 'ACTIVE' && (
                                  <Tooltip title="Revoke">
                                    <IconButton
                                      size="small"
                                      color="warning"
                                      onClick={() => handleRevokePeer(peer.id)}
                                    >
                                      <CancelIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeletePeer(peer.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={peersData?.totalElements || peers.length}
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
          </Box>
        )}

        {/* VPN Servers Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {serversLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {servers.length === 0 ? (
                  <Grid item xs={12}>
                    <Alert severity="info">No VPN servers configured</Alert>
                  </Grid>
                ) : (
                  servers.map((server) => (
                    <Grid item xs={12} md={6} key={server.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">{server.name}</Typography>
                            <Chip
                              label={server.status}
                              color={getStatusColor(server.status)}
                              size="small"
                            />
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2">
                              <strong>Endpoint:</strong> {server.publicEndpoint}:{server.listenPort}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Network:</strong> {server.networkCidr}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Created:</strong>{' '}
                              {server.createdAt
                                ? new Date(server.createdAt).toLocaleString()
                                : 'N/A'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            )}
          </Box>
        )}

        {/* Statistics Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Server Statistics
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Total Servers: {statistics.totalServers || 0}
                      </Typography>
                      <Typography variant="body2">
                        Active Servers: {statistics.activeServers || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Peer Statistics
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Total Peers: {statistics.totalPeers || 0}
                      </Typography>
                      <Typography variant="body2">
                        Active Peers: {statistics.activePeers || 0}
                      </Typography>
                      <Typography variant="body2">
                        Pending Peers: {statistics.pendingPeers || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>

      {/* Create/Edit Peer Dialog */}
      <Dialog open={openPeerDialog} onClose={() => setOpenPeerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPeer ? 'Edit VPN Peer' : 'Create VPN Peer'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Router ID"
              value={peerFormData.routerId}
              onChange={(e) => setPeerFormData({ ...peerFormData, routerId: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>VPN Server</InputLabel>
              <Select
                value={peerFormData.vpnServerId}
                label="VPN Server"
                onChange={(e) => setPeerFormData({ ...peerFormData, vpnServerId: e.target.value })}
              >
                {servers.map((server) => (
                  <MenuItem key={server.id} value={server.id}>
                    {server.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Allowed IP"
              value={peerFormData.allowedIp}
              onChange={(e) => setPeerFormData({ ...peerFormData, allowedIp: e.target.value })}
              fullWidth
              placeholder="10.77.1.10/32"
            />
            <TextField
              label="Persistent Keepalive"
              type="number"
              value={peerFormData.persistentKeepalive}
              onChange={(e) =>
                setPeerFormData({ ...peerFormData, persistentKeepalive: parseInt(e.target.value) })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPeerDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSavePeer}
            disabled={createPeerMutation.isPending || updatePeerMutation.isPending}
          >
            {editingPeer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Server Dialog */}
      <Dialog open={openServerDialog} onClose={() => setOpenServerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create VPN Server</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Server Name"
              value={serverFormData.name}
              onChange={(e) => setServerFormData({ ...serverFormData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Public Endpoint"
              value={serverFormData.publicEndpoint}
              onChange={(e) =>
                setServerFormData({ ...serverFormData, publicEndpoint: e.target.value })
              }
              fullWidth
              required
              placeholder="vpn.ggwifi.co.tz or IP address"
            />
            <TextField
              label="Listen Port"
              type="number"
              value={serverFormData.listenPort}
              onChange={(e) =>
                setServerFormData({ ...serverFormData, listenPort: parseInt(e.target.value) })
              }
              fullWidth
              required
            />
            <TextField
              label="Network CIDR"
              value={serverFormData.networkCidr}
              onChange={(e) => setServerFormData({ ...serverFormData, networkCidr: e.target.value })}
              fullWidth
              required
              placeholder="10.77.0.0/16"
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={serverFormData.status}
                label="Status"
                onChange={(e) => setServerFormData({ ...serverFormData, status: e.target.value })}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenServerDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveServer}
            disabled={createServerMutation.isPending}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VpnManagement;
