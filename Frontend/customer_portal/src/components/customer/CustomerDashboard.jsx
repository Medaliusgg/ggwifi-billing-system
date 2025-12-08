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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import PublicIcon from '@mui/icons-material/Public';
import IconButton from '@mui/material/IconButton';
import { useQuery, useQueryClient } from 'react-query';
import { customerPortalAPI } from '../../services/customerPortalApi';
import { loyaltyAPI, analyticsAPI, sessionAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import ReferralCard from '../referral/ReferralCard';

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
  <Card sx={{ 
    borderRadius: 4, 
    background: '#FFFFFF',  // White background - ZenoPay Style
    border: '1px solid #FFE89C',  // Pale yellow border
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',  // Soft shadow
  }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600} color="#1A1A1A">  {/* Charcoal Black */}
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

const CustomerDashboard = ({ session, onLogout, onBack, onNavigateToPackages }) => {
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

  const packagesQuery = useQuery(
    ['available-packages'],
    async () => {
      const res = await customerPortalAPI.getPackages();
      const response = res?.data || res;
      if (response.status === 'success' && response.packages) {
        return response.packages;
      } else if (Array.isArray(response)) {
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    { refetchInterval: 300000 } // Refetch every 5 minutes
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

  // Free trial status
  const isTrialUsed = customerInfo?.isTrialUsed ?? false;
  const trialVoucherCode = customerInfo?.trialVoucherCode;
  const hasActiveTrial = trialVoucherCode && !isTrialUsed;

  const refreshAll = () => {
    queryClient.invalidateQueries(['customer-dashboard', phoneNumber]);
    queryClient.invalidateQueries(['customer-profile', phoneNumber]);
    queryClient.invalidateQueries(['customer-loyalty', phoneNumber]);
    queryClient.invalidateQueries(['customer-analytics', phoneNumber]);
    queryClient.invalidateQueries(['available-packages']);
    toast.success('Dashboard refreshed');
  };

  const availablePackages = packagesQuery.data || [];
  const isLoadingPackages = packagesQuery.isLoading;

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
    <Box sx={{ p: { xs: 1.5, md: 2 }, pt: { xs: 1, md: 1.5 }, minHeight: 'calc(100vh - 80px)' }}>
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

        {/* Free Trial Status */}
        {hasActiveTrial && (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon />}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
              border: '1px solid #4CAF50',
            }}
          >
            <Stack spacing={1}>
              <Typography variant="h6" fontWeight={600} color="#1A1A1A">
                🎁 Free 20-Minute Trial Active!
              </Typography>
              <Typography variant="body2" color="#1A1A1A">
                Your free trial voucher <strong>{trialVoucherCode}</strong> is ready to use. Connect to GG WiFi hotspot to start browsing!
              </Typography>
            </Stack>
          </Alert>
        )}

        {!hasActiveTrial && isTrialUsed && (
          <Alert 
            severity="info" 
            icon={<CheckCircleIcon />}
            sx={{ 
              borderRadius: 2,
              background: '#E3F2FD',
              border: '1px solid #2196F3',
            }}
          >
            <Typography variant="body2" color="#1A1A1A">
              Your free 20-minute trial has been used. Purchase a package to continue enjoying GG WiFi!
            </Typography>
          </Alert>
        )}

        <Card sx={{ borderRadius: 2, background: '#FFFFFF', border: '1px solid #EDEDED', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ 
                    width: { xs: 64, md: 80 }, 
                    height: { xs: 64, md: 80 }, 
                    bgcolor: '#FFE89C',  // Pale yellow background
                    color: '#1A1A1A',  // Black text
                    fontWeight: 700,
                    border: '4px solid #F5C400',  // Yellow ring (4px)
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',  // Soft outer shadow
                  }}>
                    {customerInfo?.firstName?.[0] || 'G'}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="#1A1A1A">  {/* Charcoal Black */}
                      {customerInfo?.firstName || 'GG Customer'} {customerInfo?.lastName || ''}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIphoneIcon fontSize="small" />
                      <Typography variant="body2" color="#1A1A1A">{phoneNumber}</Typography>  {/* Charcoal Black */}
                    </Stack>
                    <Typography variant="caption" color="#505050">  {/* Label grey */}
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
              <Card sx={{ borderRadius: 3, background: '#FFFFFF', border: '1px solid #FFE89C', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SpeedIcon fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight={600}>
                        Data Usage
                      </Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight={700} color="#1A1A1A">  {/* Charcoal Black */}
                      {formatDataUsage(analytics.usage?.totalDataUsed || analytics.usage?.dataUsed)}
                    </Typography>
                    <Typography variant="caption" color="#505050">  {/* Label grey */}
                      This month
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, background: '#FFFFFF', border: '1px solid #FFE89C', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <RouterIcon fontSize="small" color="success" />
                      <Typography variant="body2" fontWeight={600}>
                        Router Uptime
                      </Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight={700} color="#1A1A1A">  {/* Charcoal Black */}
                      {analytics.sessions?.averageUptime ? formatUptime(analytics.sessions.averageUptime) : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="#505050">  {/* Label grey */}
                      Average session duration
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, background: '#FFFFFF', border: '1px solid #FFE89C', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TrendingUpIcon fontSize="small" color="warning" />
                      <Typography variant="body2" fontWeight={600}>
                        Session Quality
                      </Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight={700} color="#1A1A1A">  {/* Charcoal Black */}
                      {analytics.sessions?.qualityScore ? `${analytics.sessions.qualityScore}%` : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="#505050">  {/* Label grey */}
                      Connection reliability
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={3}>
          {/* Referral Card */}
          <Grid item xs={12}>
            <ReferralCard />
          </Grid>

          {/* Free Trial Voucher Card */}
          {trialVoucherCode && (
            <Grid item xs={12}>
              <SectionCard 
                title="Free Trial Voucher" 
                action={
                  <Chip 
                    label={isTrialUsed ? "Used" : "Available"} 
                    color={isTrialUsed ? "default" : "success"} 
                  />
                }
              >
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: isTrialUsed ? '#F5F5F5' : 'linear-gradient(135deg, #FFF9C4 0%, #FFE89C 100%)',
                    border: '1px solid #FFE89C',
                  }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="h4" fontWeight={700} color="#1A1A1A" fontFamily="monospace">
                          {trialVoucherCode}
                        </Typography>
                        <Typography variant="body2" color="#505050" mt={1}>
                          {isTrialUsed 
                            ? "This trial voucher has been used" 
                            : "20 minutes of free internet access"}
                        </Typography>
                      </Box>
                      {!isTrialUsed && (
                        <Chip 
                          icon={<CheckCircleIcon />} 
                          label="Ready to Use" 
                          color="success" 
                          variant="filled"
                        />
                      )}
                    </Stack>
                  </Box>
                  {!isTrialUsed && (
                    <Typography variant="caption" color="#505050" sx={{ fontStyle: 'italic' }}>
                      Connect to GG WiFi hotspot and use this voucher code to activate your free trial.
                    </Typography>
                  )}
                </Stack>
              </SectionCard>
            </Grid>
          )}

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

          {/* Available Packages Section */}
          <Grid item xs={12}>
            <SectionCard
              title="Available Packages"
              action={
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => onNavigateToPackages?.()}
                  size="small"
                >
                  View All
                </Button>
              }
            >
              {isLoadingPackages ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress color="warning" />
                </Box>
              ) : availablePackages.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    No packages available at the moment.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {availablePackages.slice(0, 3).map((pkg) => (
                    <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          background: '#FFFFFF',
                          border: '1px solid #FFE89C',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                          },
                        }}
                      >
                        <CardContent>
                          <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box>
                                <Typography variant="h6" fontWeight={700} color="#1A1A1A">
                                  {pkg.name}
                                </Typography>
                                <Typography variant="caption" color="#505050">
                                  {pkg.duration || `${pkg.durationDays || 0} Days`}
                                </Typography>
                              </Box>
                              {pkg.isPopular && (
                                <Chip
                                  icon={<StarIcon />}
                                  label="Popular"
                                  color="warning"
                                  size="small"
                                  sx={{ height: 24 }}
                                />
                              )}
                            </Stack>
                            
                            <Box>
                              <Stack direction="row" alignItems="baseline" spacing={1}>
                                <Typography variant="h5" fontWeight={700} color="#1A1A1A">
                                  {formatCurrency(pkg.price)}
                                </Typography>
                                {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      textDecoration: 'line-through',
                                      color: '#999',
                                    }}
                                  >
                                    {formatCurrency(pkg.originalPrice)}
                                  </Typography>
                                )}
                              </Stack>
                              {pkg.discountPercentage && (
                                <Chip
                                  label={`${pkg.discountPercentage}% OFF`}
                                  color="success"
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                />
                              )}
                            </Box>

                            <Stack spacing={0.5}>
                              {pkg.dataLimit && (
                                <Typography variant="caption" color="#505050">
                                  📊 {pkg.dataLimit}
                                </Typography>
                              )}
                              {pkg.speed && (
                                <Typography variant="caption" color="#505050">
                                  ⚡ {pkg.speed}
                                </Typography>
                              )}
                            </Stack>

                            <Button
                              variant="contained"
                              color="warning"
                              fullWidth
                              startIcon={<ShoppingCartIcon />}
                              onClick={() => onNavigateToPackages?.(pkg.id)}
                              sx={{
                                mt: 1,
                                fontWeight: 600,
                                textTransform: 'none',
                              }}
                            >
                              Buy Now
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
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