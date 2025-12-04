import React, { useMemo, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
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
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Redeem as RedeemIcon,
  WorkspacePremium as TierIcon,
  PersonSearch as PersonSearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { loyaltyAPI } from '/src/services/api';

const rewardCategories = ['DATA', 'TIME', 'VOUCHER', 'GIFT', 'SERVICE'];
const deliveryMethods = ['DIGITAL', 'PICKUP', 'DELIVERY'];
const tierOptions = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];

const defaultTierForm = {
  id: null,
  name: '',
  description: '',
  minPoints: 0,
  multiplier: 1,
  benefits: '',
  expiresInDays: 365,
};

const defaultRewardForm = {
  id: null,
  rewardName: '',
  rewardCode: '',
  pointsRequired: 0,
  rewardTier: 'BRONZE',
  category: 'DATA',
  deliveryMethod: 'DIGITAL',
  description: '',
  imageUrl: '',
};

const defaultInventoryForm = {
  rewardId: '',
  inventoryCount: 0,
  restockThreshold: 0,
  restockAmount: 0,
};

const tierColors = {
  BRONZE: '#CD7F32',
  SILVER: '#C0C0C0',
  GOLD: '#FFD700',
  PLATINUM: '#B7C9E2',
  DIAMOND: '#63E2FF',
};

const extractList = (response) => {
  const data = response?.data ?? response;
  if (!data) return { items: [], total: 0 };
  if (Array.isArray(data)) return { items: data, total: data.length };
  if (Array.isArray(data.items)) return { items: data.items, total: data.total || data.items.length };
  if (Array.isArray(data.data)) return { items: data.data, total: data.total || data.data.length };
  return { items: [], total: 0 };
};

const SectionHeader = ({ icon, title, description, actions }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', md: 'center' },
      mb: 2,
      flexWrap: 'wrap',
      gap: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>{icon}</Avatar>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
    {actions}
  </Box>
);

const renderEmptyRow = (colSpan, label) => (
  <TableRow>
    <TableCell colSpan={colSpan} align="center">
      <Typography color="text.secondary">{label}</Typography>
    </TableCell>
  </TableRow>
);

const LoyaltyManagement = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(0);
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);

  const [tierForm, setTierForm] = useState(defaultTierForm);
  const [rewardForm, setRewardForm] = useState(defaultRewardForm);
  const [inventoryForm, setInventoryForm] = useState(defaultInventoryForm);
  const [auditPayload, setAuditPayload] = useState(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [activityLog, setActivityLog] = useState([]);

  const [tierPage, setTierPage] = useState(0);
  const [tierRows, setTierRows] = useState(10);
  const [rewardPage, setRewardPage] = useState(0);
  const [rewardRows, setRewardRows] = useState(10);
  const [inventoryPage, setInventoryPage] = useState(0);
  const [inventoryRows, setInventoryRows] = useState(10);
  const [redemptionPage, setRedemptionPage] = useState(0);
  const [redemptionRows, setRedemptionRows] = useState(10);
  const [rewardSearch, setRewardSearch] = useState('');
  const [rewardCategoryFilter, setRewardCategoryFilter] = useState('');
  const [rewardTierFilter, setRewardTierFilter] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [redemptionStatusFilter, setRedemptionStatusFilter] = useState('PENDING');

  const tiersQuery = useQuery({
    queryKey: ['loyalty-tiers', tierPage, tierRows],
    queryFn: () => loyaltyAPI.getTierConfigs({ page: tierPage + 1, size: tierRows }),
    keepPreviousData: true,
  });

  const rewardsQuery = useQuery({
    queryKey: ['loyalty-rewards', rewardPage, rewardRows],
    queryFn: () => loyaltyAPI.getAllRewards({ page: rewardPage + 1, size: rewardRows }),
    keepPreviousData: true,
  });

  const inventoryQuery = useQuery({
    queryKey: ['loyalty-inventory', inventoryPage, inventoryRows],
    queryFn: () => loyaltyAPI.getInventory({ page: inventoryPage + 1, size: inventoryRows }),
    keepPreviousData: true,
  });

  const redemptionsQuery = useQuery({
    queryKey: ['loyalty-redemptions', redemptionPage, redemptionRows],
    queryFn: () => loyaltyAPI.getRedemptions({ page: redemptionPage + 1, size: redemptionRows }),
    keepPreviousData: true,
  });

  const customerQuery = useQuery({
    queryKey: ['loyalty-customer', customerPhone],
    queryFn: () => loyaltyAPI.getCustomerSnapshotByPhone(customerPhone),
    enabled: false,
  });

  const tiers = useMemo(() => extractList(tiersQuery.data), [tiersQuery.data]);
  const rewards = useMemo(() => extractList(rewardsQuery.data), [rewardsQuery.data]);
  const filteredRewards = useMemo(() => {
    return rewards.items
      .filter((reward) => (rewardSearch ? reward.rewardName?.toLowerCase().includes(rewardSearch.toLowerCase()) || reward.rewardCode?.toLowerCase().includes(rewardSearch.toLowerCase()) : true))
      .filter((reward) => (rewardCategoryFilter ? reward.category === rewardCategoryFilter : true))
      .filter((reward) => (rewardTierFilter ? reward.rewardTier === rewardTierFilter : true));
  }, [rewards.items, rewardSearch, rewardCategoryFilter, rewardTierFilter]);
  const paginatedRewards = useMemo(() => {
    const start = rewardPage * rewardRows;
    return filteredRewards.slice(start, start + rewardRows);
  }, [filteredRewards, rewardPage, rewardRows]);
  const inventory = useMemo(() => extractList(inventoryQuery.data), [inventoryQuery.data]);
  const filteredInventory = useMemo(() => {
    return inventory.items.filter((record) => {
      if (!inventorySearch) return true;
      const needle = inventorySearch.toLowerCase();
      return (
        record.reward?.rewardName?.toLowerCase().includes(needle) ||
        record.reward?.rewardCode?.toLowerCase().includes(needle) ||
        record.rewardName?.toLowerCase().includes(needle) ||
        record.rewardCode?.toLowerCase().includes(needle)
      );
    });
  }, [inventory.items, inventorySearch]);
  const redemptions = useMemo(() => extractList(redemptionsQuery.data), [redemptionsQuery.data]);
  const paginatedInventory = useMemo(() => {
    const start = inventoryPage * inventoryRows;
    return filteredInventory.slice(start, start + inventoryRows);
  }, [filteredInventory, inventoryPage, inventoryRows]);
  const filteredRedemptions = useMemo(() => redemptions.items.filter((item) => (redemptionStatusFilter ? item.status === redemptionStatusFilter : true)), [redemptions.items, redemptionStatusFilter]);
  const paginatedRedemptions = useMemo(() => {
    const start = redemptionPage * redemptionRows;
    return filteredRedemptions.slice(start, start + redemptionRows);
  }, [redemptions.items, redemptionStatusFilter]);
  const customerData = customerQuery.data?.data;

  const toastError = (error, fallback) => {
    enqueueSnackbar(error?.response?.data?.message || fallback, { variant: 'error' });
  };

  const recordActivity = (title, message, payload) => {
    setActivityLog((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        title,
        message,
        payload,
      },
      ...prev,
    ].slice(0, 20));
  };

  const applyOptimisticList = (key, updater) => {
    queryClient.setQueryData(key, (oldData) => {
      if (!oldData) return oldData;
      const { items } = extractList(oldData);
      const updatedItems = updater(items || []);
      return { items: updatedItems, total: updatedItems.length };
    });
  };

  const saveTierMutation = useMutation({
    mutationFn: (payload) => (payload.id ? loyaltyAPI.updateTierConfig(payload.id, payload) : loyaltyAPI.saveTierConfig(payload)),
    onSuccess: () => {
      enqueueSnackbar('Tier saved successfully', { variant: 'success' });
      setTierDialogOpen(false);
      tiersQuery.refetch();
    },
    onError: (error) => toastError(error, 'Failed to save tier'),
  });

  const deleteTierMutation = useMutation({
    mutationFn: (tierId) => loyaltyAPI.deleteTierConfig(tierId),
    onSuccess: () => {
      enqueueSnackbar('Tier deleted', { variant: 'info' });
      tiersQuery.refetch();
    },
    onError: (error) => toastError(error, 'Failed to delete tier'),
  });

  const rewardListKey = ['loyalty-rewards', rewardPage, rewardRows];
  const inventoryListKey = ['loyalty-inventory', inventoryPage, inventoryRows];
  const redemptionListKey = ['loyalty-redemptions', redemptionPage, redemptionRows];

  const saveRewardMutation = useMutation({
    mutationFn: (payload) => (payload.id ? loyaltyAPI.updateReward(payload.id, payload) : loyaltyAPI.createReward(payload)),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: rewardListKey });
      const previous = queryClient.getQueryData(rewardListKey);
      applyOptimisticList(rewardListKey, (items) => {
        if (payload.id) {
          return items.map((item) => (item.id === payload.id ? { ...item, ...payload } : item));
        }
        return [{ ...payload, id: payload.id || `temp-${Date.now()}`, rewardCode: payload.rewardCode || 'TEMP' }, ...items];
      });
      recordActivity(
        payload.id ? 'Reward updated' : 'Reward created',
        payload.id ? `Queued update for ${payload.rewardName}` : `Queued creation for ${payload.rewardName}`,
        payload
      );
      return { previous };
    },
    onSuccess: () => {
      enqueueSnackbar('Reward saved successfully', { variant: 'success' });
      setRewardDialogOpen(false);
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(rewardListKey, context.previous);
      }
      toastError(error, 'Failed to save reward');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-inventory'] });
    },
  });

  const deleteRewardMutation = useMutation({
    mutationFn: (rewardId) => loyaltyAPI.deleteReward(rewardId),
    onMutate: async (rewardId) => {
      await queryClient.cancelQueries({ queryKey: rewardListKey });
      const previous = queryClient.getQueryData(rewardListKey);
      applyOptimisticList(rewardListKey, (items) => items.filter((item) => item.id !== rewardId));
      recordActivity('Reward deleted', `Queued deletion for reward ${rewardId}`, { rewardId });
      return { previous };
    },
    onSuccess: () => {
      enqueueSnackbar('Reward deleted', { variant: 'info' });
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(rewardListKey, context.previous);
      }
      toastError(error, 'Failed to delete reward');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-inventory'] });
    },
  });

  const saveInventoryMutation = useMutation({
    mutationFn: (payload) => loyaltyAPI.upsertInventory(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: inventoryListKey });
      const previous = queryClient.getQueryData(inventoryListKey);
      applyOptimisticList(inventoryListKey, (items) =>
        items.map((item) => {
          const rewardId = item.reward?.id || item.rewardId;
          if (rewardId === payload.rewardId) {
            return {
              ...item,
              inventoryCount: payload.inventoryCount,
              restockAmount: payload.restockAmount,
              restockThreshold: payload.restockThreshold,
            };
          }
          return item;
        })
      );
      recordActivity('Inventory updated', `Adjusted inventory for reward ${payload.rewardId}`, payload);
      return { previous };
    },
    onSuccess: () => {
      enqueueSnackbar('Inventory updated', { variant: 'success' });
      setInventoryDialogOpen(false);
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(inventoryListKey, context.previous);
      }
      toastError(error, 'Failed to update inventory');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-inventory'] });
    },
  });

  const approveRedemptionMutation = useMutation({
    mutationFn: ({ id, technician }) => loyaltyAPI.approveRedemption(id, technician),
    onMutate: async ({ id, technician }) => {
      await queryClient.cancelQueries({ queryKey: redemptionListKey });
      const previous = queryClient.getQueryData(redemptionListKey);
      applyOptimisticList(redemptionListKey, (items) =>
        items.map((item) =>
          item.id === id ? { ...item, status: 'APPROVED', technicianAssigned: technician } : item
        )
      );
      recordActivity('Redemption approved', `Assigned ${technician || 'technician TBD'} for redemption ${id}`, { id, technician });
      return { previous };
    },
    onSuccess: () => {
      enqueueSnackbar('Redemption approved', { variant: 'success' });
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(redemptionListKey, context.previous);
      }
      toastError(error, 'Failed to approve redemption');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-redemptions'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-inventory'] });
    },
  });

  const completeRedemptionMutation = useMutation({
    mutationFn: (id) => loyaltyAPI.markRedemptionDelivered(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: redemptionListKey });
      const previous = queryClient.getQueryData(redemptionListKey);
      applyOptimisticList(redemptionListKey, (items) =>
        items.map((item) => (item.id === id ? { ...item, status: 'DELIVERED', deliveredAt: new Date().toISOString() } : item))
      );
      recordActivity('Redemption delivered', `Marked redemption ${id} as delivered`, { id });
      return { previous };
    },
    onSuccess: () => {
      enqueueSnackbar('Redemption marked delivered', { variant: 'success' });
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(redemptionListKey, context.previous);
      }
      toastError(error, 'Failed to mark delivered');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-redemptions'] });
    },
  });

  const rejectRedemptionMutation = useMutation({
    mutationFn: ({ id, reason }) => loyaltyAPI.rejectRedemption(id, reason),
    onMutate: async ({ id, reason }) => {
      await queryClient.cancelQueries({ queryKey: redemptionListKey });
      const previous = queryClient.getQueryData(redemptionListKey);
      applyOptimisticList(redemptionListKey, (items) =>
        items.map((item) => (item.id === id ? { ...item, status: 'REJECTED', rejectionReason: reason } : item))
      );
      recordActivity('Redemption rejected', `Rejected redemption ${id}`, { id, reason });
      return { previous };
    },
    onSuccess: () => {
      enqueueSnackbar('Redemption rejected', { variant: 'info' });
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(redemptionListKey, context.previous);
      }
      toastError(error, 'Failed to reject redemption');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-redemptions'] });
    },
  });

  const handleCustomerLookup = () => {
    if (!customerPhone) {
      enqueueSnackbar('Enter a phone number first', { variant: 'info' });
      return;
    }
    customerQuery.refetch();
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString();
  };

  const renderAuditDetails = (payload) => {
    if (!payload) {
      return <Typography variant="body2">No payload selected.</Typography>;
    }
    return (
      <Stack spacing={1} sx={{ maxHeight: 360, overflow: 'auto', pr: 1 }}>
        {Object.entries(payload).map(([key, value]) => (
          <Box
            key={key}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1.5,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {key}
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </Typography>
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Loyalty Program Management
          </Typography>
          <Typography color="text.secondary">
            Manage tiers, rewards, inventory, redemptions, and customer loyalty insights.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => {
            tiersQuery.refetch();
            rewardsQuery.refetch();
            inventoryQuery.refetch();
            redemptionsQuery.refetch();
            if (customerPhone) customerQuery.refetch();
          }}
        >
          Refresh All
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Tiers Configured
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {tiers.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Across all loyalty levels
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Rewards Catalog
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {rewards.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active incentives available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Inventory Records
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {inventory.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Trackable stock entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Pending Redemptions
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {redemptions.items.filter((item) => item.status === 'PENDING').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Awaiting manual action
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<TierIcon />} iconPosition="start" label="Tiers" />
          <Tab icon={<RedeemIcon />} iconPosition="start" label="Rewards" />
          <Tab icon={<InventoryIcon />} iconPosition="start" label="Inventory" />
          <Tab icon={<RedeemIcon />} iconPosition="start" label="Redemptions" />
          <Tab icon={<PersonSearchIcon />} iconPosition="start" label="Customer Loyalty" />
        </Tabs>
      </Card>

      {/* Tiers */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <SectionHeader
              icon={<TierIcon />}
              title="Tier Management"
              description="Define loyalty tiers, their thresholds, multipliers, and benefit messaging."
              actions={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setTierForm(defaultTierForm);
                    setTierDialogOpen(true);
                  }}
                >
                  Add Tier
                </Button>
              }
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tier</TableCell>
                    <TableCell>Min Points</TableCell>
                    <TableCell>Multiplier</TableCell>
                    <TableCell>Expires (Days)</TableCell>
                    <TableCell>Benefits</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tiersQuery.isLoading
                    ? renderEmptyRow(6, 'Loading tiers...')
                    : tiers.items.length === 0
                      ? renderEmptyRow(6, 'No tiers configured.')
                      : tiers.items.map((tier) => (
                          <TableRow key={tier.id}>
                            <TableCell>
                              <Chip
                                label={tier.name}
                                sx={{
                                  backgroundColor: tierColors[tier.name?.toUpperCase()] || '#E0E0E0',
                                  color: '#0A0A0A',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell>{tier.minPoints?.toLocaleString() || 0}</TableCell>
                            <TableCell>{tier.multiplier || 1}x</TableCell>
                            <TableCell>{tier.expiresInDays || 0}</TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {tier.benefits || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="View audit snapshot">
                                  <IconButton
                                    onClick={() => {
                                      setAuditPayload(tier);
                                      setAuditDialogOpen(true);
                                    }}
                                    size="small"
                                  >
                                    <VisibilityIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit tier">
                                  <IconButton
                                    onClick={() => {
                                      setTierForm(tier);
                                      setTierDialogOpen(true);
                                    }}
                                    size="small"
                                    color="primary"
                                  >
                                    <EditIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete tier">
                                  <IconButton onClick={() => deleteTierMutation.mutate(tier.id)} size="small" color="error">
                                    <DeleteIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={tiers.total}
              page={tierPage}
              onPageChange={(_, page) => setTierPage(page)}
              rowsPerPage={tierRows}
              onRowsPerPageChange={(event) => {
                setTierRows(parseInt(event.target.value, 10));
                setTierPage(0);
              }}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <SectionHeader
              icon={<RedeemIcon />}
              title="Rewards Catalog"
              description="Manage loyalty products, categories, delivery modes, and point costs."
              actions={
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setRewardForm(defaultRewardForm); setRewardDialogOpen(true); }}>
                  Add Reward
                </Button>
              }
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                label="Search rewards"
                placeholder="Search by name or code"
                value={rewardSearch}
                onChange={(e) => {
                  setRewardSearch(e.target.value);
                  setRewardPage(0);
                }}
                fullWidth
              />
              <TextField
                select
                label="Category"
                value={rewardCategoryFilter}
                onChange={(e) => {
                  setRewardCategoryFilter(e.target.value);
                  setRewardPage(0);
                }}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">All</MenuItem>
                {rewardCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Tier"
                value={rewardTierFilter}
                onChange={(e) => {
                  setRewardTierFilter(e.target.value);
                  setRewardPage(0);
                }}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">All</MenuItem>
                {tierOptions.map((tier) => (
                  <MenuItem key={tier} value={tier}>
                    {tier}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reward</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Tier</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Delivery</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rewardsQuery.isLoading
                    ? renderEmptyRow(6, 'Loading rewards...')
                    : filteredRewards.length === 0
                      ? renderEmptyRow(6, 'No rewards configured.')
                      : paginatedRewards.map((reward) => (
                          <TableRow key={reward.id}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {reward.rewardName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {reward.rewardCode}
                              </Typography>
                            </TableCell>
                            <TableCell>{reward.pointsRequired?.toLocaleString() || 0}</TableCell>
                            <TableCell>
                              <Chip label={reward.rewardTier || 'ANY'} size="small" />
                            </TableCell>
                            <TableCell>{reward.category}</TableCell>
                            <TableCell>{reward.deliveryMethod}</TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="View record snapshot">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setAuditPayload(reward);
                                      setAuditDialogOpen(true);
                                    }}
                                  >
                                    <VisibilityIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit reward">
                                  <IconButton onClick={() => { setRewardForm(reward); setRewardDialogOpen(true); }} size="small" color="primary">
                                    <EditIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete reward">
                                  <IconButton onClick={() => deleteRewardMutation.mutate(reward.id)} size="small" color="error">
                                    <DeleteIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredRewards.length}
              page={rewardPage}
              onPageChange={(_, page) => setRewardPage(page)}
              rowsPerPage={rewardRows}
              onRowsPerPageChange={(event) => {
                setRewardRows(parseInt(event.target.value, 10));
                setRewardPage(0);
              }}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <SectionHeader
              icon={<InventoryIcon />}
              title="Reward Inventory"
              description="Track physical stock levels, restock thresholds, and replenishment batches."
              actions={
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setInventoryForm(defaultInventoryForm); setInventoryDialogOpen(true); }}>
                  Adjust Inventory
                </Button>
              }
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                label="Search inventory"
                placeholder="Search by reward name or code"
                value={inventorySearch}
                onChange={(e) => {
                  setInventorySearch(e.target.value);
                  setInventoryPage(0);
                }}
                fullWidth
              />
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reward</TableCell>
                    <TableCell>Available</TableCell>
                    <TableCell>Restock Threshold</TableCell>
                    <TableCell>Restock Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryQuery.isLoading
                    ? renderEmptyRow(6, 'Loading inventory...')
                    : filteredInventory.length === 0
                      ? renderEmptyRow(6, 'No inventory records.')
                      : paginatedInventory.map((record) => (
                          <TableRow key={`${record.reward?.id || record.rewardId}-${record.id || record.rewardId}`}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {record.reward?.rewardName || record.rewardName || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {record.reward?.rewardCode || record.rewardCode || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell>{record.inventoryCount ?? '—'}</TableCell>
                            <TableCell>{record.restockThreshold ?? '—'}</TableCell>
                            <TableCell>{record.restockAmount ?? '—'}</TableCell>
                            <TableCell>
                              <Chip
                                label={record.inventoryCount <= record.restockThreshold ? 'Needs restock' : 'Healthy'}
                                color={record.inventoryCount <= record.restockThreshold ? 'warning' : 'success'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setInventoryForm({
                                    rewardId: record.reward?.id || record.rewardId || '',
                                    inventoryCount: record.inventoryCount || 0,
                                    restockThreshold: record.restockThreshold || 0,
                                    restockAmount: record.restockAmount || 0,
                                  });
                                  setInventoryDialogOpen(true);
                                }}
                              >
                                Adjust
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setAuditPayload(record);
                                  setAuditDialogOpen(true);
                                }}
                              >
                                <VisibilityIcon fontSize="inherit" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredInventory.length}
              page={inventoryPage}
              onPageChange={(_, page) => setInventoryPage(page)}
              rowsPerPage={inventoryRows}
              onRowsPerPageChange={(event) => {
                setInventoryRows(parseInt(event.target.value, 10));
                setInventoryPage(0);
              }}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 3 && (
        <Card>
          <CardContent>
            <SectionHeader
              icon={<RedeemIcon />}
              title="Redemption Queue"
              description="Approve, assign, and deliver customer reward claims."
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                select
                label="Status"
                value={redemptionStatusFilter}
                onChange={(e) => {
                  setRedemptionStatusFilter(e.target.value);
                  setRedemptionPage(0);
                }}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="DELIVERED">Delivered</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="">All</MenuItem>
              </TextField>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Reward</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Requested</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {redemptionsQuery.isLoading
                    ? renderEmptyRow(6, 'Loading redemptions...')
                    : filteredRedemptions.length === 0
                      ? renderEmptyRow(6, 'No redemptions in queue.')
                      : paginatedRedemptions.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.customer?.name || item.customerName || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.customer?.phoneNumber || item.phoneNumber || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.reward?.rewardName || item.rewardName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.reward?.category || item.category}
                              </Typography>
                            </TableCell>
                            <TableCell>{item.pointsSpent?.toLocaleString() || item.points || 0}</TableCell>
                            <TableCell>
                              <Chip
                                label={item.status || 'PENDING'}
                                size="small"
                                color={
                                  item.status === 'APPROVED'
                                    ? 'success'
                                    : item.status === 'REJECTED'
                                      ? 'error'
                                      : 'warning'
                                }
                              />
                            </TableCell>
                            <TableCell>{formatDate(item.requestedAt || item.createdAt)}</TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="View record snapshot">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setAuditPayload(item);
                                      setAuditDialogOpen(true);
                                    }}
                                  >
                                    <VisibilityIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Approve & assign technician">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => {
                                      const technician = window.prompt('Assign technician (optional)') || undefined;
                                      approveRedemptionMutation.mutate({ id: item.id, technician });
                                    }}
                                  >
                                    <ApproveIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Mark delivered">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => completeRedemptionMutation.mutate(item.id)}
                                  >
                                    <VisibilityIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject redemption">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                      const reason = window.prompt('Reason for rejection?') || 'Manual review';
                                      rejectRedemptionMutation.mutate({ id: item.id, reason });
                                    }}
                                  >
                                    <RejectIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredRedemptions.length}
              page={redemptionPage}
              onPageChange={(_, page) => setRedemptionPage(page)}
              rowsPerPage={redemptionRows}
              onRowsPerPageChange={(event) => {
                setRedemptionRows(parseInt(event.target.value, 10));
                setRedemptionPage(0);
              }}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 4 && (
        <Card>
          <CardContent>
            <SectionHeader
              icon={<PersonSearchIcon />}
              title="Customer Loyalty Snapshot"
              description="Investigate points, tiers, sessions, and redemption history per phone number."
            />
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+2557XXXXXXXX"
                />
              </Grid>
              <Grid item xs={12} md="auto">
                <Button
                  variant="contained"
                  sx={{ height: '100%' }}
                  onClick={handleCustomerLookup}
                  disabled={!customerPhone || customerQuery.isFetching}
                  startIcon={customerQuery.isFetching ? <CircularProgress size={20} /> : <PersonSearchIcon />}
                >
                  Lookup
                </Button>
              </Grid>
            </Grid>
            {customerData ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Customer
                        </Typography>
                        <Typography variant="h6">{customerData.customerName || 'N/A'}</Typography>
                        <Typography variant="body2">{customerData.phoneNumber}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          GG Points & Tier
                        </Typography>
                        <Typography variant="h6">{customerData.points || 0} pts</Typography>
                        <Typography variant="body2">Tier: {customerData.tier || 'N/A'}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Redemptions
                        </Typography>
                        <Typography variant="h6">{customerData.totalRedemptions || 0}</Typography>
                        <Typography variant="body2">
                          Pending: {customerData.pendingRedemptions || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Recent Loyalty Activity
                </Typography>
                {customerData.recentActivity?.length ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerData.recentActivity.map((activity, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{formatDate(activity.date)}</TableCell>
                          <TableCell>{activity.type}</TableCell>
                          <TableCell>{activity.description}</TableCell>
                          <TableCell>{activity.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert severity="info">No recent loyalty activity recorded.</Alert>
                )}
              </Box>
            ) : (
              <Alert severity="info">Enter a phone number and click lookup to view loyalty profile.</Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <SectionHeader
            icon={<VisibilityIcon />}
            title="Recent Activity"
            description="Live summary of optimistic updates applied while API requests settle."
            actions={
              <Button size="small" onClick={() => setActivityLog([])} disabled={activityLog.length === 0}>
                Clear
              </Button>
            }
          />
          {activityLog.length === 0 ? (
            <Alert severity="info">No pending actions recorded yet.</Alert>
          ) : (
            <Stack spacing={1.5}>
              {activityLog.map((entry) => (
                <Card key={entry.id} variant="outlined">
                  <CardContent sx={{ py: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {entry.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {entry.message}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(entry.timestamp)}
                      </Typography>
                    </Stack>
                    {entry.payload && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Payload: {JSON.stringify(entry.payload)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Placeholder dialogs to be filled incrementally */}
      <Dialog open={tierDialogOpen} onClose={() => setTierDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{tierForm.id ? 'Edit Tier' : 'Create Tier'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tier Name"
              value={tierForm.name}
              onChange={(e) => setTierForm((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={tierForm.description}
              onChange={(e) => setTierForm((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Minimum Points"
                type="number"
                value={tierForm.minPoints}
                onChange={(e) => setTierForm((prev) => ({ ...prev, minPoints: Number(e.target.value) }))}
                fullWidth
                required
              />
              <TextField
                label="Multiplier"
                type="number"
                value={tierForm.multiplier}
                onChange={(e) => setTierForm((prev) => ({ ...prev, multiplier: Number(e.target.value) }))}
                fullWidth
                required
              />
            </Stack>
            <TextField
              label="Benefits"
              value={tierForm.benefits}
              onChange={(e) => setTierForm((prev) => ({ ...prev, benefits: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Expires In (Days)"
              type="number"
              value={tierForm.expiresInDays}
              onChange={(e) => setTierForm((prev) => ({ ...prev, expiresInDays: Number(e.target.value) }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTierDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => saveTierMutation.mutate(tierForm)}
            variant="contained"
            disabled={saveTierMutation.isLoading}
          >
            {saveTierMutation.isLoading ? <CircularProgress size={18} /> : 'Save Tier'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={rewardDialogOpen} onClose={() => setRewardDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{rewardForm.id ? 'Edit Reward' : 'Create Reward'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Reward Name"
              value={rewardForm.rewardName}
              onChange={(e) => setRewardForm((prev) => ({ ...prev, rewardName: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Reward Code"
              value={rewardForm.rewardCode}
              onChange={(e) => setRewardForm((prev) => ({ ...prev, rewardCode: e.target.value }))}
              fullWidth
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Points Required"
                type="number"
                value={rewardForm.pointsRequired}
                onChange={(e) => setRewardForm((prev) => ({ ...prev, pointsRequired: Number(e.target.value) }))}
                fullWidth
                required
              />
              <TextField
                select
                label="Tier Eligibility"
                value={rewardForm.rewardTier}
                onChange={(e) => setRewardForm((prev) => ({ ...prev, rewardTier: e.target.value }))}
                fullWidth
              >
                {tierOptions.map((tier) => (
                  <MenuItem key={tier} value={tier}>
                    {tier}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                select
                label="Category"
                value={rewardForm.category}
                onChange={(e) => setRewardForm((prev) => ({ ...prev, category: e.target.value }))}
                fullWidth
              >
                {rewardCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Delivery Method"
                value={rewardForm.deliveryMethod}
                onChange={(e) => setRewardForm((prev) => ({ ...prev, deliveryMethod: e.target.value }))}
                fullWidth
              >
                {deliveryMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Description"
              value={rewardForm.description}
              onChange={(e) => setRewardForm((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Image URL"
              value={rewardForm.imageUrl}
              onChange={(e) => setRewardForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRewardDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => saveRewardMutation.mutate(rewardForm)}
            variant="contained"
            disabled={saveRewardMutation.isLoading}
          >
            {saveRewardMutation.isLoading ? <CircularProgress size={18} /> : 'Save Reward'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={inventoryDialogOpen} onClose={() => setInventoryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adjust Inventory</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Reward ID"
              value={inventoryForm.rewardId}
              onChange={(e) => setInventoryForm((prev) => ({ ...prev, rewardId: e.target.value }))}
              fullWidth
              helperText="Enter the reward identifier or scan from catalog."
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Inventory Count"
                type="number"
                value={inventoryForm.inventoryCount}
                onChange={(e) => setInventoryForm((prev) => ({ ...prev, inventoryCount: Number(e.target.value) }))}
                fullWidth
              />
              <TextField
                label="Restock Threshold"
                type="number"
                value={inventoryForm.restockThreshold}
                onChange={(e) => setInventoryForm((prev) => ({ ...prev, restockThreshold: Number(e.target.value) }))}
                fullWidth
              />
            </Stack>
            <TextField
              label="Restock Amount"
              type="number"
              value={inventoryForm.restockAmount}
              onChange={(e) => setInventoryForm((prev) => ({ ...prev, restockAmount: Number(e.target.value) }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInventoryDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => saveInventoryMutation.mutate(inventoryForm)}
            variant="contained"
            disabled={saveInventoryMutation.isLoading}
          >
            {saveInventoryMutation.isLoading ? <CircularProgress size={18} /> : 'Save Inventory'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={auditDialogOpen} onClose={() => setAuditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Snapshot</DialogTitle>
        <DialogContent dividers>{renderAuditDetails(auditPayload)}</DialogContent>
        <DialogActions>
          <Button onClick={() => setAuditDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoyaltyManagement;
