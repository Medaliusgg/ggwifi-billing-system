import React, { useMemo, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Skeleton,
  LinearProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import RouterIcon from '@mui/icons-material/Router';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useQuery, useQueryClient } from 'react-query';
import { customerPortalAPI } from '../../services/customerPortalApi';
import { loyaltyAPI, analyticsAPI, sessionAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const InfoChip = ({ icon, label, value, color = 'primary' }) => (
  <Card sx={{ borderRadius: 3, background: 'rgba(12, 14, 24, 0.85)', border: '1px solid rgba(255,255,255,0.05)' }}>
    <CardContent>
      <Stack spacing={1}>
        <Chip icon={icon} label={label} color={color} variant="outlined" size="small" sx={{ width: 'fit-content', fontWeight: 600 }} />
        <Typography variant="h4" fontWeight={700}>
          {value ?? '--'}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const SectionCard = ({ title, action, children }) => (
  <Card sx={{ borderRadius: 4, background: 'rgba(10, 12, 20, 0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
    </CardContent>
  </Card>
);

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'TZS 0';
  try {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(amount);
  } catch (error) {
    return `TZS ${amount}`;
  }
};

const ensureArray = (value, limit = 5) => {
  if (!Array.isArray(value)) return [];
  return value.slice(0, limit);
};

const CustomerDashboard = ({ session, onLogout, onBack }) => {
  const queryClient = useQueryClient();
  const phoneNumber = session?.phoneNumber || session?.account?.phoneNumber;
  const [dismissedNotifications, setDismissedNotifications] = React.useState(new Set());

  const dashboardQuery = useQuery(
    ['customer-dashboard', phoneNumber],
    async () => {
      const res = await customerPortalAPI.getCustomerDashboard(phoneNumber);
      return res?.data || res;
    },
    { enabled: !!phoneNumber, refetchInterval: 30000 }
  );

  const profileQuery = useQuery(
    ['customer-profile', phoneNumber],
    async () => {
      const res = await customerPortalAPI.getCustomerProfile(phoneNumber);
      return res?.data || res;
    },
    { enabled: !!phoneNumber }
  );

  const loyaltyQuery = useQuery(
    ['customer-loyalty', phoneNumber],
    async () => {
      const res = await loyaltyAPI.getLoyaltyStatus(phoneNumber);
      return res?.data || res;
    },
    { enabled: !!phoneNumber, refetchInterval: 60000 }
  );

  const analyticsQuery = useQuery(
    ['customer-analytics', phoneNumber],
    async () => {
      const [usage, sessions, spending] = await Promise.all([
        analyticsAPI.getUsageStatistics(phoneNumber).catch(() => null),
        sessionAPI.getSessionStatistics(phoneNumber).catch(() => null),
        analyticsAPI.getSpendingAnalytics(phoneNumber).catch(() => null),
      ]);
      return {
        usage: usage?.data || usage,
        sessions: sessions?.data || sessions,
        spending: spending?.data || spending,
      };
    },
    { enabled: !!phoneNumber, refetchInterval: 60000 }
  );

  const isLoading = dashboardQuery.isLoading || profileQuery.isLoading || loyaltyQuery.isLoading;
  const customerInfo = dashboardQuery.data?.customer || profileQuery.data?.data || {};
  const stats = dashboardQuery.data?.statistics || {};
  const vouchers = ensureArray(dashboardQuery.data?.vouchers);
  const transactions = ensureArray(dashboardQuery.data?.transactions);
  const payments = ensureArray(dashboardQuery.data?.payments);
  const activeSessions = dashboardQuery.data?.activeSessions || [];
  const loyaltyInfo = loyaltyQuery.data?.data || loyaltyQuery.data || {};
  const analytics = analyticsQuery.data || {};

  const prevLoyaltyRef = React.useRef(loyaltyInfo);
  const [loyaltyNotifications, setLoyaltyNotifications] = React.useState([]);

  useEffect(() => {
    const notifications = [];
    const prevLoyalty = prevLoyaltyRef.current;
    
    if (prevLoyalty && loyaltyInfo) {
      if (loyaltyInfo.availablePoints > prevLoyalty.availablePoints) {
        const pointsGained = loyaltyInfo.availablePoints - prevLoyalty.availablePoints;
        notifications.push({
          id: `points-${Date.now()}`,
          type: 'success',
          message: `🎉 You earned ${pointsGained} GG Points!`,
        });
      }
      if (loyaltyInfo.tier !== prevLoyalty.tier && loyaltyInfo.tier) {
        notifications.push({
          id: `tier-${Date.now()}`,
          type: 'info',
          message: `⭐ You've reached ${loyaltyInfo.tier} tier!`,
        });
      }
    }
    
    if (notifications.length > 0) {
      setLoyaltyNotifications(prev => [...prev, ...notifications]);
    }
    
    prevLoyaltyRef.current = loyaltyInfo;
  }, [loyaltyInfo]);

  const dismissNotification = (id) => {
    setDismissedNotifications(prev => new Set([...prev, id]));
  };

  const heroStats = useMemo(
    () => [
      { icon: <FavoriteIcon fontSize="small" />, label: 'GG Points', value: loyaltyInfo?.availablePoints ?? loyaltyInfo?.points ?? 0, color: 'warning' },
      { icon: <MonetizationOnIcon fontSize="small" />, label: 'Lifetime Spend', value: formatCurrency(loyaltyInfo?.lifetimeSpend || stats?.totalPayments || 0), color: 'success' },
      { icon: <WifiIcon fontSize="small" />, label: 'Active Sessions', value: activeSessions.length, color: 'info' },
      { icon: <ReceiptLongIcon fontSize="small" />, label: 'Redeemed Rewards', value: loyaltyInfo?.totalRedemptions || 0, color: 'secondary' },
    ],
    [loyaltyInfo, stats, activeSessions.length]
  );

  const refreshAll = () => {
    queryClient.invalidateQueries(['customer-dashboard', phoneNumber]);
    queryClient.invalidateQueries(['customer-profile', phoneNumber]);
    queryClient.invalidateQueries(['customer-loyalty', phoneNumber]);
    queryClient.invalidateQueries(['customer-analytics', phoneNumber]);
    toast.success('Dashboard refreshed');
  };

  const handleLogout = () => {
    localStorage.removeItem('customerSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('customerRefreshToken');
    onLogout?.();
  };

  if (dashboardQuery.error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" gutterBottom>
          Failed to load dashboard: {dashboardQuery.error.message}
        </Typography>
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={refreshAll}>
          Retry
        </Button>
      </Box>
    );
  }

  const formatDataUsage = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    return `${mb.toFixed(2)} MB`;
  };

  const formatUptime = (seconds) => {
    if (!seconds) return '0h';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: 'calc(100vh - 80px)' }}>
      <Stack spacing={3}>
        {/* Loyalty Notifications */}
        {loyaltyNotifications.filter(n => !dismissedNotifications.has(n.id)).length > 0 && (
          <Stack spacing={1}>
            {loyaltyNotifications.filter(n => !dismissedNotifications.has(n.id)).map((notification) => (
              <Alert
                key={notification.id}
                severity={notification.type}
                action={
                  <IconButton
                    size="small"
                    onClick={() => dismissNotification(notification.id)}
                    color="inherit"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
                icon={<NotificationsActiveIcon />}
              >
                {notification.message}
              </Alert>
            ))}
          </Stack>
        )}

        <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(7,11,25,0.9))', border: '1px solid rgba(255,199,76,0.2)', color: '#fff' }}>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'warning.main', color: '#111', fontWeight: 700 }}>
                    {customerInfo?.firstName?.[0] || 'G'}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {customerInfo?.firstName || 'GG Customer'} {customerInfo?.lastName || ''}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIphoneIcon fontSize="small" />
                      <Typography variant="body2">{phoneNumber}</Typography>
                    </Stack>
                    <Typography variant="caption" color="rgba(255,255,255,0.7)">
                      Loyalty tier: {loyaltyInfo?.tier || 'Unassigned'}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button startIcon={<ArrowBackIcon />} variant="outlined" color="inherit" onClick={onBack}>
                    Back
                  </Button>
                  <Button startIcon={<RefreshIcon />} variant="contained" color="warning" onClick={refreshAll}>
                    Refresh
                  </Button>
                  <Button startIcon={<LogoutIcon />} variant="contained" color="error" onClick={handleLogout}>
                    Logout
                  </Button>
                </Stack>
              </Stack>

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress color="warning" />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {heroStats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                      <InfoChip {...stat} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        {!analyticsQuery.isLoading && (analytics.usage || analytics.sessions) && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, background: 'rgba(12, 14, 24, 0.85)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SpeedIcon fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight={600}>
                        Data Usage
                      </Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight={700}>
                      {formatDataUsage(analytics.usage?.totalDataUsed || analytics.usage?.dataUsed)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      This month
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, background: 'rgba(12, 14, 24, 0.85)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <RouterIcon fontSize="small" color="success" />
                      <Typography variant="body2" fontWeight={600}>
                        Router Uptime
                      </Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight={700}>
                      {analytics.sessions?.averageUptime ? formatUptime(analytics.sessions.averageUptime) : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Average session duration
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, background: 'rgba(12, 14, 24, 0.85)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TrendingUpIcon fontSize="small" color="warning" />
                      <Typography variant="body2" fontWeight={600}>
                        Session Quality
                      </Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight={700}>
                      {analytics.sessions?.qualityScore ? `${analytics.sessions.qualityScore}%` : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Connection reliability
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SectionCard title="Active Sessions" action={<Chip label={`${activeSessions.length} live`} color="info" />}>
              {dashboardQuery.isLoading ? (
                <Stack spacing={1}>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
                  ))}
                </Stack>
              ) : activeSessions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <WifiIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    No active hotspot sessions.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Connect to a hotspot to see your active sessions here.
                  </Typography>
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Device</TableCell>
                      <TableCell>IP</TableCell>
                      <TableCell>Uptime</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.sessionId || session.username}>
                        <TableCell>{session.username || 'GG Device'}</TableCell>
                        <TableCell>{session.ipAddress || session.framedIpAddress || '—'}</TableCell>
                        <TableCell>{session.sessionTime ? `${Math.floor(session.sessionTime / 60)} mins` : '—'}</TableCell>
                        <TableCell align="right">
                          <Chip size="small" label="Active" color="success" icon={<CheckCircleIcon />} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard title="Recent Payments" action={<Chip icon={<CreditCardIcon />} label="Payments" variant="outlined" color="success" />}>
              {dashboardQuery.isLoading ? (
                <Stack spacing={1}>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
                  ))}
                </Stack>
              ) : payments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CreditCardIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    No payments recorded yet.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your payment history will appear here.
                  </Typography>
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Reference</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id || payment.paymentId}>
                        <TableCell>{payment.paymentId || payment.reference || '—'}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={payment.status}
                            color={payment.status === 'COMPLETED' || payment.status === 'SUCCESSFUL' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard title="Recent Transactions" action={<Chip icon={<ReceiptLongIcon />} label="History" variant="outlined" />}>
              {dashboardQuery.isLoading ? (
                <Stack spacing={1}>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
                  ))}
                </Stack>
              ) : transactions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ReceiptLongIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    No transactions recorded.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Transaction history will appear here.
                  </Typography>
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id || txn.transactionId}>
                        <TableCell>{txn.description || txn.type}</TableCell>
                        <TableCell>{formatCurrency(txn.amount)}</TableCell>
                        <TableCell>
                          <Chip size="small" label={txn.status} color={txn.status === 'COMPLETED' ? 'success' : 'warning'} />
                        </TableCell>
                        <TableCell align="right">
                          {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard
              title="Voucher & Rewards"
              action={<Chip icon={<PendingIcon />} label={`Active vouchers: ${stats?.activeVouchers || 0}`} color="info" />}
            >
              {dashboardQuery.isLoading ? (
                <Stack spacing={1}>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
                  ))}
                </Stack>
              ) : vouchers.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PendingIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    No vouchers found.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Purchase a package to receive vouchers.
                  </Typography>
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Voucher Code</TableCell>
                      <TableCell>Package</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Expires</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vouchers.map((voucher) => (
                      <TableRow key={voucher.id || voucher.voucherCode}>
                        <TableCell>{voucher.voucherCode}</TableCell>
                        <TableCell>{voucher.packageName || voucher.package?.name || '—'}</TableCell>
                        <TableCell>
                          <Chip size="small" label={voucher.status} color={voucher.status === 'ACTIVE' ? 'success' : 'warning'} />
                        </TableCell>
                        <TableCell align="right">
                          {voucher.expiresAt ? new Date(voucher.expiresAt).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </SectionCard>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default CustomerDashboard;
