import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Wifi as WifiIcon,
  AttachMoney as MoneyIcon,
  Router as RouterIcon,
  Speed as SpeedIcon,
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

const DashboardOverview = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    totalRouters: 0,
    onlineRouters: 0,
    activeSessions: 0,
    totalVouchers: 0,
    dataUsage: 0,
    avgSpeed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      const mockData = {
        totalRevenue: 1250000,
        activeUsers: 342,
        totalRouters: 15,
        onlineRouters: 13,
        activeSessions: 89,
        totalVouchers: 156,
        dataUsage: 2.4, // TB
        avgSpeed: 45.2, // Mbps
      };
      
      setStats(mockData);
      setLastUpdated(new Date());
    } catch (error) {
      enqueueSnackbar('Failed to load dashboard statistics', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadDashboardStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardStats, 30000);
    return () => clearInterval(interval);
  }, [loadDashboardStats]);

  const StatCard = ({ title, value, subtitle, icon, color, trend, trendValue, loading: cardLoading }) => (
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
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                mr: 2,
              }}
            >
              {icon}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                {cardLoading ? (
                  <LinearProgress sx={{ width: '60%', height: 8 }} />
                ) : (
                  value
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
            </Box>
            {trend && (
              <Chip
                icon={trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${trendValue}%`}
                color={trend === 'up' ? 'success' : 'error'}
                size="small"
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const QuickActionCard = ({ title, description, icon, color, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
          },
          transition: 'all 0.3s ease',
        }}
        onClick={onClick}
      >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              mx: 'auto',
              mb: 2,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
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
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time statistics and system status
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={loadDashboardStats} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`TZS ${stats.totalRevenue.toLocaleString()}`}
            subtitle="All time earnings"
            icon={<MoneyIcon sx={{ color: 'white' }} />}
            color="#1976d2"
            trend="up"
            trendValue={12}
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            subtitle="Current subscribers"
            icon={<PeopleIcon sx={{ color: 'white' }} />}
            color="#2e7d32"
            trend="up"
            trendValue={8}
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Online Routers"
            value={`${stats.onlineRouters}/${stats.totalRouters}`}
            subtitle="System health"
            icon={<RouterIcon sx={{ color: 'white' }} />}
            color={stats.onlineRouters === stats.totalRouters ? "#2e7d32" : "#ed6c02"}
            trend={stats.onlineRouters === stats.totalRouters ? "up" : "down"}
            trendValue={Math.round((stats.onlineRouters / stats.totalRouters) * 100)}
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Sessions"
            value={stats.activeSessions}
            subtitle="Current connections"
            icon={<WifiIcon sx={{ color: 'white' }} />}
            color="#9c27b0"
            trend="up"
            trendValue={15}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Data Usage"
            value={`${stats.dataUsage} TB`}
            subtitle="Monthly bandwidth"
            icon={<SpeedIcon sx={{ color: 'white' }} />}
            color="#ff9800"
            trend="up"
            trendValue={23}
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StatCard
            title="Average Speed"
            value={`${stats.avgSpeed} Mbps`}
            subtitle="Network performance"
            icon={<SpeedIcon sx={{ color: 'white' }} />}
            color="#2196f3"
            trend="up"
            trendValue={5}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Add Router"
              description="Register new MikroTik router"
              icon={<RouterIcon sx={{ color: 'white' }} />}
              color="#1976d2"
              onClick={() => enqueueSnackbar('Navigate to Router Management', { variant: 'info' })}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Generate Vouchers"
              description="Create hotspot vouchers"
              icon={<ReceiptIcon sx={{ color: 'white' }} />}
              color="#2e7d32"
              onClick={() => enqueueSnackbar('Navigate to Voucher Management', { variant: 'info' })}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="View Analytics"
              description="Detailed reports and insights"
              icon={<VisibilityIcon sx={{ color: 'white' }} />}
              color="#9c27b0"
              onClick={() => enqueueSnackbar('Navigate to Analytics', { variant: 'info' })}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="System Settings"
              description="Configure system parameters"
              icon={<SpeedIcon sx={{ color: 'white' }} />}
              color="#ff9800"
              onClick={() => enqueueSnackbar('Navigate to Settings', { variant: 'info' })}
            />
          </Grid>
        </Grid>
      </Box>

      {/* System Status */}
      <Box>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          System Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    Authentication Service
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Online - All systems operational
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    RADIUS Server
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Online - Processing connections
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    Database
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Online - Data synchronized
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    Payment Gateway
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Online - Transactions enabled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardOverview; 