import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Divider,
  useTheme,
  alpha,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Receipt,
  AccountBalance,
  Payment,
  CreditCard,
  Savings,
  Refresh,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Assessment,
  MonetizationOn,
  BarChart,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import apiClient from '/src/api/client.js';
import useAuthStore from '/src/store/authStore.js';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

// GG Wi-Fi Branded Financial Metric Card
const FinancialMetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  loading = false,
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
          background: ggwifiTheme.gradients.card,
          borderRadius: ggwifiTheme.borderRadius.lg,
          boxShadow: ggwifiTheme.shadows.lg,
          border: `1px solid rgba(245, 183, 0, 0.1)`,
          transition: ggwifiTheme.transitions.normal,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: ggwifiTheme.shadows.golden,
            transform: 'translateY(-4px)',
            borderColor: `rgba(245, 183, 0, 0.3)`,
          },
        }}
      >
        {/* Golden Accent Border */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: ggwifiTheme.gradients.primary,
          }}
        />
        
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: ggwifiTheme.gradients.primary,
                  color: ggwifiTheme.colors.secondary,
                  boxShadow: ggwifiTheme.shadows.golden,
                }}
              >
                {icon}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: ggwifiTheme.colors.neutral,
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
                icon={trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                label={`${trendValue}%`}
                size="small"
                sx={{
                  backgroundColor: trend === 'up' 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(244, 67, 54, 0.1)',
                  color: trend === 'up' 
                    ? ggwifiTheme.colors.success 
                    : ggwifiTheme.colors.error,
                  border: `1px solid ${trend === 'up' 
                    ? ggwifiTheme.colors.success 
                    : ggwifiTheme.colors.error}`,
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                }}
              />
            )}
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontWeight: ggwifiTheme.typography.fontWeight.bold,
              color: ggwifiTheme.colors.secondary,
              mb: 1,
              background: ggwifiTheme.gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: ggwifiTheme.colors.neutral,
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

// GG Wi-Fi Branded Transaction History Card
const TransactionHistoryCard = ({ transactions = [], loading = false, delay = 0 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        sx={{
          height: '100%',
          background: ggwifiTheme.gradients.card,
          borderRadius: ggwifiTheme.borderRadius.lg,
          boxShadow: ggwifiTheme.shadows.lg,
          border: `1px solid rgba(245, 183, 0, 0.1)`,
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
            height: 4,
            background: ggwifiTheme.gradients.primary,
          }}
        />
        
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                color: ggwifiTheme.colors.secondary,
              }}
            >
              Recent Transactions
            </Typography>
            <IconButton size="small" sx={{ color: ggwifiTheme.colors.primary }}>
              <Refresh />
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" height={60} />
                </Box>
              ))
            ) : transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Receipt sx={{ fontSize: 48, color: ggwifiTheme.colors.neutral, mb: 2 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: ggwifiTheme.colors.neutral,
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  }}
                >
                  No recent transactions
                </Typography>
              </Box>
            ) : (
              transactions.map((transaction, index) => (
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
                      borderRadius: ggwifiTheme.borderRadius.md,
                      backgroundColor: 'rgba(245, 183, 0, 0.05)',
                      border: '1px solid rgba(245, 183, 0, 0.1)',
                      transition: ggwifiTheme.transitions.normal,
                      '&:hover': {
                        backgroundColor: 'rgba(245, 183, 0, 0.1)',
                        borderColor: `rgba(245, 183, 0, 0.2)`,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: ggwifiTheme.gradients.primary,
                        color: ggwifiTheme.colors.secondary,
                        fontSize: '0.75rem',
                      }}
                    >
                      {transaction.type === 'payment' ? <Payment /> : <Receipt />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: ggwifiTheme.typography.fontFamily.primary,
                          fontWeight: ggwifiTheme.typography.fontWeight.medium,
                          color: ggwifiTheme.colors.secondary,
                          mb: 0.5,
                        }}
                      >
                        {transaction.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: ggwifiTheme.colors.neutral,
                          fontFamily: ggwifiTheme.typography.fontFamily.primary,
                        }}
                      >
                        {transaction.time}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: ggwifiTheme.typography.fontFamily.primary,
                          fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                          color: transaction.amount > 0 ? ggwifiTheme.colors.success : ggwifiTheme.colors.error,
                        }}
                      >
                        {transaction.amount > 0 ? '+' : ''}${transaction.amount}
                      </Typography>
                      <Chip
                        label={transaction.status}
                        size="small"
                        sx={{
                          backgroundColor: transaction.status === 'Completed' 
                            ? 'rgba(76, 175, 80, 0.1)' 
                            : 'rgba(255, 152, 0, 0.1)',
                          color: transaction.status === 'Completed' 
                            ? ggwifiTheme.colors.success 
                            : ggwifiTheme.colors.warning,
                          border: `1px solid ${transaction.status === 'Completed' 
                            ? ggwifiTheme.colors.success 
                            : ggwifiTheme.colors.warning}`,
                          fontFamily: ggwifiTheme.typography.fontFamily.primary,
                          fontWeight: ggwifiTheme.typography.fontWeight.medium,
                        }}
                      />
                    </Box>
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

const FinanceDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthStore();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/dashboard/finance/stats');
      
      if (response.status === 'success') {
        setDashboardData(response.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Mock data for demonstration
  const mockData = {
    metrics: [
      {
        title: 'Total Revenue',
        value: '$125,000',
        subtitle: 'This month',
        icon: <AttachMoney />,
        trend: 'up',
        trendValue: 15.2,
      },
      {
        title: 'Active Subscriptions',
        value: '1,250',
        subtitle: 'Current customers',
        icon: <AccountBalance />,
        trend: 'up',
        trendValue: 8.3,
      },
      {
        title: 'Pending Payments',
        value: '$12,500',
        subtitle: 'Awaiting collection',
        icon: <Payment />,
        trend: 'down',
        trendValue: 5.1,
      },
      {
        title: 'Profit Margin',
        value: '68%',
        subtitle: 'Operating efficiency',
        icon: <Savings />,
        trend: 'up',
        trendValue: 2.4,
      },
    ],
    transactions: [
      {
        id: 1,
        description: 'Monthly subscription payment',
        amount: 25.00,
        time: '2 minutes ago',
        status: 'Completed',
        type: 'payment',
      },
      {
        id: 2,
        description: 'Package upgrade fee',
        amount: 15.00,
        time: '15 minutes ago',
        status: 'Completed',
        type: 'payment',
      },
      {
        id: 3,
        description: 'Refund processed',
        amount: -10.00,
        time: '1 hour ago',
        status: 'Completed',
        type: 'refund',
      },
      {
        id: 4,
        description: 'New customer registration',
        amount: 30.00,
        time: '2 hours ago',
        status: 'Pending',
        type: 'payment',
      },
    ],
    alerts: [
      {
        id: 1,
        type: 'success',
        message: 'Monthly revenue target exceeded by 15%',
        time: '1 hour ago',
        priority: 'high',
      },
      {
        id: 2,
        type: 'warning',
        message: '5 payments pending collection',
        time: '3 hours ago',
        priority: 'medium',
      },
    ],
  };

  const data = dashboardData || mockData;

  return (
    <Box sx={{ p: 0 }}>
      {/* GG Wi-Fi Finance Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontWeight: ggwifiTheme.typography.fontWeight.bold,
              background: ggwifiTheme.gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1,
            }}
          >
            Finance Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: ggwifiTheme.colors.neutral,
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
            }}
          >
            Financial overview and payment management for {user?.username}
          </Typography>
        </Box>
      </motion.div>

      {/* Financial Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ mb: 3 }}>
            {data.alerts.map((alert, index) => (
              <Alert
                key={index}
                severity={alert.type}
                sx={{
                  mb: 1,
                  borderRadius: ggwifiTheme.borderRadius.md,
                  backgroundColor: `rgba(${alert.type === 'success' ? '76, 175, 80' : '255, 152, 0'}, 0.1)`,
                  border: `1px solid rgba(${alert.type === 'success' ? '76, 175, 80' : '255, 152, 0'}, 0.2)`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  }}
                >
                  {alert.message}
                </Typography>
              </Alert>
            ))}
          </Box>
        </motion.div>
      )}

      {/* Financial Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {data.metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <FinancialMetricCard
              {...metric}
              loading={loading}
              delay={index * 0.1}
            />
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Transaction History */}
        <Grid item xs={12} lg={8}>
          <TransactionHistoryCard 
            transactions={data.transactions} 
            loading={loading} 
            delay={0.3} 
          />
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
                background: ggwifiTheme.gradients.card,
                borderRadius: ggwifiTheme.borderRadius.lg,
                boxShadow: ggwifiTheme.shadows.lg,
                border: `1px solid rgba(245, 183, 0, 0.1)`,
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
                  height: 4,
                  background: ggwifiTheme.gradients.primary,
                }}
              />
              
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                    fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                    color: ggwifiTheme.colors.secondary,
                    mb: 3,
                  }}
                >
                  Quick Actions
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { title: 'Process Payments', icon: <Payment />, color: ggwifiTheme.colors.primary },
                    { title: 'Generate Reports', icon: <Assessment />, color: ggwifiTheme.colors.info },
                    { title: 'View Analytics', icon: <BarChart />, color: ggwifiTheme.colors.success },
                    { title: 'Manage Subscriptions', icon: <AccountBalance />, color: ggwifiTheme.colors.warning },
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
                          borderRadius: ggwifiTheme.borderRadius.md,
                          backgroundColor: 'rgba(245, 183, 0, 0.05)',
                          border: '1px solid rgba(245, 183, 0, 0.1)',
                          cursor: 'pointer',
                          transition: ggwifiTheme.transitions.normal,
                          '&:hover': {
                            backgroundColor: 'rgba(245, 183, 0, 0.1)',
                            borderColor: `rgba(245, 183, 0, 0.3)`,
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            background: ggwifiTheme.gradients.primary,
                            color: ggwifiTheme.colors.secondary,
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: ggwifiTheme.typography.fontFamily.primary,
                            fontWeight: ggwifiTheme.typography.fontWeight.medium,
                            color: ggwifiTheme.colors.secondary,
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
              color: ggwifiTheme.colors.neutral,
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontSize: ggwifiTheme.typography.fontSize.xs,
            }}
          >
            Last updated: {lastUpdated.toLocaleTimeString()} | 
            Powered by GG Wi-Fi - The Signal That Cares
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default FinanceDashboard;