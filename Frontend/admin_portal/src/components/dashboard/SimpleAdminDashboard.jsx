import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Wifi as WifiIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '/src/store/authStore.js';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';
import { dashboardAPI } from '/src/services/api.js';

// Fetch dashboard metrics using the new endpoint
const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await dashboardAPI.getDashboardMetrics();
      return response?.data || response;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

// GG Wi-Fi Branded KPI Card Component
const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  delay = 0 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          height: '100%',
          background: '#FFFFFF',  // White background - ZenoPay Style
          borderRadius: 4,  // 16px
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',  // Soft shadow
          border: `1px solid #FFE89C`,  // Pale yellow border
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
            borderColor: `#F5C400`,  // Yellow border on hover
          },
        }}
      >
        {/* Yellow Accent Border */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: '#F5C400',  // Yellow accent
          }}
        />
        
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: '#F5F5F5',  // Neutral grey background
                  color: '#1A1A1A',  // Charcoal icon
                  border: '1px solid #E0E0E0',  // Light grey border
                  boxShadow: 'none',  // No shadow - clean look
                }}
              >
                {icon}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1A1A1A',  // Charcoal Black text
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                    fontWeight: ggwifiTheme.typography.fontWeight.medium,
                    fontSize: ggwifiTheme.typography.fontSize.sm,
                  }}
                >
                  {title}
                </Typography>
              </Box>
            </Box>
            
            {trend && (
              <Chip
                icon={trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${trendValue}%`}
                size="small"
                sx={{
                  backgroundColor: '#F5F5F5',  // Neutral grey background
                  color: '#1A1A1A',  // Charcoal text
                  border: '1px solid #E0E0E0',  // Light grey border
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                  '& .MuiChip-icon': {
                    color: '#505050',  // Grey icon
                  },
                }}
              />
            )}
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontWeight: ggwifiTheme.typography.fontWeight.bold,
              color: '#1A1A1A',  // Charcoal Black text
              mb: 1,
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: '#505050',  // Label grey
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                fontSize: ggwifiTheme.typography.fontSize.sm,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// GG Wi-Fi Branded Activity Feed Component
const ActivityFeed = ({ activities = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          background: '#FFFFFF',  // White background - ZenoPay Style
          borderRadius: 4,  // 16px
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',  // Soft shadow
          border: `1px solid #FFE89C`,  // Pale yellow border
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Yellow Accent Border */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: '#F5C400',  // Yellow accent
          }}
        />
        
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                color: '#1A1A1A',  // Charcoal Black text
              }}
            >
              Recent Activity
            </Typography>
            <RefreshIcon sx={{ color: '#505050' }} />  {/* Grey icon - neutral */}
          </Box>

          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {activities.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <TimelineIcon sx={{ fontSize: 48, color: '#E0E0E0', mb: 2 }} />  {/* Light grey icon - neutral */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#505050',  // Label grey
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  }}
                >
                  No recent activity
                </Typography>
              </Box>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      mb: 1,
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',  // White background
                      border: '1px solid #FFE89C',  // Pale yellow border
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#FFE89C',  // Pale yellow on hover
                        borderColor: `#F5C400`,  // Yellow border
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: '#F5F5F5',  // Neutral grey background
                        color: '#1A1A1A',  // Charcoal icon
                        fontSize: '0.75rem',
                        border: '1px solid #E0E0E0',  // Light grey border
                      }}
                    >
                      {activity.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: ggwifiTheme.typography.fontFamily.primary,
                          fontWeight: ggwifiTheme.typography.fontWeight.medium,
                          color: '#1A1A1A',  // Charcoal Black text
                          mb: 0.5,
                        }}
                      >
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#505050',  // Label grey
                          fontFamily: ggwifiTheme.typography.fontFamily.primary,
                        }}
                      >
                        {activity.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={activity.status}
                      size="small"
                      sx={{
                        backgroundColor: '#F5F5F5',  // Neutral grey background
                        color: '#1A1A1A',  // Charcoal text
                        border: '1px solid #E0E0E0',  // Light grey border
                        fontFamily: ggwifiTheme.typography.fontFamily.primary,
                        fontWeight: ggwifiTheme.typography.fontWeight.medium,
                      }}
                    />
                  </Box>
                </motion.div>
              ))
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SimpleAdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuthStore();

  console.log('🔍 SimpleAdminDashboard rendered:', { user });

  // Fetch dashboard metrics from backend using new endpoint
  const { data: dashboardMetrics, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      try {
        const response = await dashboardAPI.getDashboardMetrics();
        return response?.data || response;
      } catch (err) {
        console.error('Dashboard metrics error:', err);
        // Fallback to old endpoint if new one fails
        const fallback = await dashboardAPI.getDashboardStats();
        return fallback?.data || fallback;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  // Fallback mock data
  const mockData = {
    kpis: [
      {
        title: 'Total Users',
        value: '1,250',
        subtitle: 'Registered customers',
        icon: <PeopleIcon />,
        trend: 'up',
        trendValue: 12.5,
      },
      {
        title: 'Active Connections',
        value: '890',
        subtitle: 'Currently online',
        icon: <WifiIcon />,
        trend: 'up',
        trendValue: 8.3,
      },
      {
        title: 'Monthly Revenue',
        value: '$125,000',
        subtitle: 'This month',
        icon: <MoneyIcon />,
        trend: 'up',
        trendValue: 15.2,
      },
      {
        title: 'System Uptime',
        value: '99.8%',
        subtitle: 'Last 30 days',
        icon: <SecurityIcon />,
        trend: 'up',
        trendValue: 0.2,
      },
    ],
    activities: [
      {
        title: 'New user registration',
        time: '2 minutes ago',
        status: 'Success',
        icon: 'U',
      },
      {
        title: 'Payment processed',
        time: '5 minutes ago',
        status: 'Success',
        icon: '$',
      },
      {
        title: 'Router configuration updated',
        time: '10 minutes ago',
        status: 'Success',
        icon: 'R',
      },
      {
        title: 'System backup completed',
        time: '1 hour ago',
        status: 'Success',
        icon: 'B',
      },
    ],
  };

  // Process dashboard data from backend or use mock
  const processDashboardData = (data) => {
    if (!data || !data.kpis) {
      return mockData;
    }

    // Map backend KPIs to frontend format
    const kpis = Object.entries(data.kpis || {}).map(([key, kpi]) => ({
      title: kpi.title || key,
      value: kpi.value || '0',
      subtitle: kpi.subtitle || '',
      icon: getIconForKPI(key),
      trend: kpi.trend || 'stable',
      trendValue: kpi.trendValue || 0,
    }));

    return {
      kpis: kpis.length > 0 ? kpis : mockData.kpis,
      activities: data.activities || mockData.activities,
    };
  };

  const getIconForKPI = (key) => {
    const iconMap = {
      totalCustomers: <PeopleIcon />,
      activeCustomers: <WifiIcon />,
      totalRevenue: <MoneyIcon />,
      monthlyRevenue: <MoneyIcon />,
      systemUptime: <SecurityIcon />,
      totalPackages: <WifiIcon />,
      activeSessions: <WifiIcon />,
    };
    return iconMap[key] || <PeopleIcon />;
  };

  const dashboardData = processDashboardData(dashboardResponse);

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Failed to load dashboard data. Using mock data.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#FFFFFF' }}>  {/* Soft White background */}
      {/* GG Wi-Fi Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                fontWeight: ggwifiTheme.typography.fontWeight.bold,
                color: '#1A1A1A',  // Charcoal Black text
                mb: 1,
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#505050',  // Label grey
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
              }}
            >
              Welcome back, {user?.username || 'Admin'}! Here's your system overview.
            </Typography>
          </Box>
          <IconButton
            onClick={() => refetch()}
            sx={{
              color: '#505050',
              '&:hover': {
                color: '#F5C400',
                backgroundColor: 'rgba(245, 196, 0, 0.1)',
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </motion.div>

      {/* KPI Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardData.kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <KPICard
              {...kpi}
              delay={index * 0.1}
            />
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Activity Feed */}
        <Grid item xs={12} lg={8}>
          <ActivityFeed activities={dashboardData.activities} />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card
              sx={{
                height: '100%',
                background: '#FFFFFF',  // White background
                borderRadius: 4,  // 16px
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',  // Soft shadow
                border: `1px solid #FFE89C`,  // Pale yellow border
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Golden Accent Border */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: '#F5C400',  // Primary Golden Yellow
                }}
              />
              
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                    fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                    color: '#1A1A1A',  // Charcoal Black text
                    mb: 3,
                  }}
                >
                  Quick Actions
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { title: 'Add New User', icon: <PeopleIcon /> },
                    { title: 'Create Package', icon: <MoneyIcon /> },
                    { title: 'Configure Router', icon: <WifiIcon /> },
                    { title: 'View Reports', icon: <SecurityIcon /> },
                  ].map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,  // 8px
                          backgroundColor: '#FFFFFF',  // White background
                          border: '1px solid #FFE89C',  // Pale yellow border
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(245, 196, 0, 0.1)',  // Pale yellow on hover
                            borderColor: '#F5C400',  // Yellow border
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            background: '#F5F5F5',  // Light grey background
                            color: '#1A1A1A',  // Charcoal icon
                            border: '1px solid #E0E0E0',  // Light grey border
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: ggwifiTheme.typography.fontFamily.primary,
                            fontWeight: ggwifiTheme.typography.fontWeight.medium,
                            color: '#1A1A1A',  // Charcoal Black text
                          }}
                        >
                          {action.title}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#505050',  // Label grey
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontSize: 12,
            }}
          >
            Last updated: {new Date().toLocaleTimeString()} | 
            Powered by GG Wi-Fi - The Signal That Cares
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default SimpleAdminDashboard;
