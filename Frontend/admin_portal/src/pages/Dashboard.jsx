import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Router as RouterIcon,
  AttachMoney as MoneyIcon,
  Wifi as WifiIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import StatCard from '@/components/ui/StatCard';
import RouterStatusCard from '@/components/ui/RouterStatusCard';
import { adminAPI } from '@/api/admin';
import { formatCurrency, formatNumber } from '@/utils/formatters';

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: adminAPI.getDashboard,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch router data
  const { data: routersData } = useQuery({
    queryKey: ['routers'],
    queryFn: adminAPI.getRouters,
  });

  // Fetch recent activities (mock data for now)
  const recentActivities = [
    {
      id: 1,
      type: 'success',
      message: 'New customer registered',
      user: 'John Doe',
      time: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: 2,
      type: 'warning',
      message: 'Router connection lost',
      user: 'Router-01',
      time: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: 3,
      type: 'info',
      message: 'Payment received',
      user: 'Jane Smith',
      time: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: 4,
      type: 'success',
      message: 'Voucher generated',
      user: 'Admin',
      time: new Date(Date.now() - 45 * 60 * 1000),
    },
  ];

  // Mock chart data
  const revenueData = [
    { name: 'Jan', revenue: 2400, users: 400 },
    { name: 'Feb', revenue: 1398, users: 300 },
    { name: 'Mar', revenue: 9800, users: 500 },
    { name: 'Apr', revenue: 3908, users: 600 },
    { name: 'May', revenue: 4800, users: 700 },
    { name: 'Jun', revenue: 3800, users: 650 },
  ];

  const packageDistributionData = [
    { name: 'Premium', value: 35, color: '#FFD700' },
    { name: 'Standard', value: 45, color: '#E6C200' },
    { name: 'Basic', value: 20, color: '#FFF176' },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="text-green-400" />;
      case 'warning':
        return <WarningIcon className="text-yellow-400" />;
      case 'error':
        return <ErrorIcon className="text-red-400" />;
      default:
        return <NotificationsIcon className="text-blue-400" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex items-center justify-between">
        <Box>
          <Typography
            variant="h4"
            className="text-gg-text-primary font-bold mb-2"
          >
            Dashboard Overview
          </Typography>
          <Typography
            variant="body2"
            className="text-gg-text-secondary"
          >
            Welcome back! Here's what's happening with your network today.
          </Typography>
        </Box>
        
        <Box className="flex items-center space-x-2">
          <Chip
            label={refreshing ? 'Refreshing...' : 'Auto-refresh'}
            variant="outlined"
            size="small"
            className="border-gg-gold text-gg-gold"
          />
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-gg-gold hover:bg-gg-gold hover:bg-opacity-10"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatCard
              title="Total Customers"
              value={dashboardData?.totalCustomers || 0}
              change="+12%"
              changeType="positive"
              icon={PeopleIcon}
              color="primary"
              loading={isLoading}
            />
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatCard
              title="Active Routers"
              value={dashboardData?.activeRouters || 0}
              change="-2%"
              changeType="negative"
              icon={RouterIcon}
              color="secondary"
              loading={isLoading}
            />
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatCard
              title="Today's Revenue"
              value={formatCurrency(dashboardData?.todaysRevenue || 0)}
              change="+8%"
              changeType="positive"
              icon={MoneyIcon}
              color="primary"
              loading={isLoading}
            />
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <StatCard
              title="Active Sessions"
              value={dashboardData?.activeSessions || 0}
              change="+5%"
              changeType="positive"
              icon={WifiIcon}
              color="secondary"
              loading={isLoading}
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card
              className="card"
              sx={{
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 215, 0, 0.1)',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  className="text-gg-text-primary font-semibold mb-4"
                >
                  Revenue & Users Trend
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#BFBFBF"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#BFBFBF"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#2E2E2E',
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                          borderRadius: 8,
                          color: '#FFFFFF',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stackId="1"
                        stroke="#FFD700"
                        fill="rgba(255, 215, 0, 0.2)"
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stackId="1"
                        stroke="#E6C200"
                        fill="rgba(230, 194, 0, 0.2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Package Distribution */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card
              className="card"
              sx={{
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 215, 0, 0.1)',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  className="text-gg-text-primary font-semibold mb-4"
                >
                  Package Distribution
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={packageDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {packageDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#2E2E2E',
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                          borderRadius: 8,
                          color: '#FFFFFF',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Router Status & Recent Activities */}
      <Grid container spacing={3}>
        {/* Router Status */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Typography
              variant="h6"
              className="text-gg-text-primary font-semibold mb-4"
            >
              Router Status
            </Typography>
            <Grid container spacing={2}>
              {routersData?.slice(0, 4).map((router, index) => (
                <Grid item xs={12} sm={6} key={router.id}>
                  <RouterStatusCard
                    router={router}
                    onRefresh={(router) => console.log('Refresh router:', router)}
                    onConfigure={(router) => console.log('Configure router:', router)}
                    onReboot={(router) => console.log('Reboot router:', router)}
                    onViewDetails={(router) => console.log('View details:', router)}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card
              className="card"
              sx={{
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 215, 0, 0.1)',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  className="text-gg-text-primary font-semibold mb-4"
                >
                  Recent Activities
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ListItem className="px-0">
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              backgroundColor: getActivityColor(activity.type),
                              width: 32,
                              height: 32,
                            }}
                          >
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              className="text-gg-text-primary"
                            >
                              {activity.message}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              className="text-gg-text-muted"
                            >
                              {activity.user} • {activity.time.toLocaleTimeString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && (
                        <Divider sx={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }} />
                      )}
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;