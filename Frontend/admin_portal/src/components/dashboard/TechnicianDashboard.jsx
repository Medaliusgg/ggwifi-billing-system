import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Chip,
  LinearProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Router,
  Wifi,
  WifiOff,
  Speed,
  TrendingUp,
  TrendingDown,
  Refresh,
  Schedule,
  Warning,
  CheckCircle,
  Error,
  Build,
  NetworkCheck,
  SignalWifi4Bar,
  SignalWifiOff,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import useAuthStore from '/src/store/authStore.js';
import apiClient from '/src/api/client.js';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

// GG Wi-Fi Branded Router Status Card
const RouterStatusCard = ({ router, loading = false, delay = 0 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return ggwifiTheme.colors.success;
      case 'offline': return ggwifiTheme.colors.error;
      case 'maintenance': return ggwifiTheme.colors.warning;
      default: return ggwifiTheme.colors.neutral;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle />;
      case 'offline': return <Error />;
      case 'maintenance': return <Build />;
      default: return <Warning />;
    }
  };

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
                <Router />
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
                  {router?.name || 'Router'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: ggwifiTheme.colors.neutral,
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  }}
                >
                  {router?.location || 'Location'}
                </Typography>
              </Box>
            </Box>
            
            <Chip
              icon={getStatusIcon(router?.status || 'unknown')}
              label={router?.status || 'Unknown'}
              size="small"
              sx={{
                backgroundColor: `rgba(${getStatusColor(router?.status || 'unknown').replace('#', '')}, 0.1)`,
                color: getStatusColor(router?.status || 'unknown'),
                border: `1px solid ${getStatusColor(router?.status || 'unknown')}`,
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                fontWeight: ggwifiTheme.typography.fontWeight.semibold,
              }}
            />
          </Box>

          {loading ? (
            <Skeleton variant="rectangular" height={60} />
          ) : (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: ggwifiTheme.colors.neutral,
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  }}
                >
                  Connected Users
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: ggwifiTheme.colors.secondary,
                    fontFamily: ggwifiTheme.typography.fontFamily.primary,
                    fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                  }}
                >
                  {router?.connectedUsers || 0}/{router?.maxUsers || 100}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(router?.connectedUsers || 0) / (router?.maxUsers || 100) * 100}
                sx={{
                  height: 8,
                  borderRadius: ggwifiTheme.borderRadius.sm,
                  backgroundColor: 'rgba(245, 183, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: ggwifiTheme.gradients.primary,
                    borderRadius: ggwifiTheme.borderRadius.sm,
                  },
                }}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SignalWifi4Bar sx={{ fontSize: 16, color: ggwifiTheme.colors.primary }} />
              <Typography
                variant="caption"
                sx={{
                  color: ggwifiTheme.colors.neutral,
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                }}
              >
                Signal: {router?.signalStrength || 'N/A'}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: ggwifiTheme.colors.neutral,
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
              }}
            >
              {router?.uptime || 'N/A'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// GG Wi-Fi Branded Network Performance Card
const NetworkPerformanceCard = ({ performance, loading = false, delay = 0 }) => {
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
              Network Performance
            </Typography>
            <IconButton size="small" sx={{ color: ggwifiTheme.colors.primary }}>
              <Refresh />
            </IconButton>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={40} />
              ))}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'Download Speed', value: '45.2 Mbps', icon: <TrendingUp />, color: ggwifiTheme.colors.success },
                { label: 'Upload Speed', value: '12.8 Mbps', icon: <TrendingUp />, color: ggwifiTheme.colors.success },
                { label: 'Latency', value: '23ms', icon: <Speed />, color: ggwifiTheme.colors.info },
                { label: 'Packet Loss', value: '0.1%', icon: <NetworkCheck />, color: ggwifiTheme.colors.success },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: ggwifiTheme.borderRadius.md,
                      backgroundColor: 'rgba(245, 183, 0, 0.05)',
                      border: '1px solid rgba(245, 183, 0, 0.1)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: ggwifiTheme.gradients.primary,
                          color: ggwifiTheme.colors.secondary,
                          fontSize: '0.75rem',
                        }}
                      >
                        {metric.icon}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: ggwifiTheme.typography.fontFamily.primary,
                          fontWeight: ggwifiTheme.typography.fontWeight.medium,
                          color: ggwifiTheme.colors.secondary,
                        }}
                      >
                        {metric.label}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: ggwifiTheme.typography.fontFamily.primary,
                        fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                        color: metric.color,
                      }}
                    >
                      {metric.value}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TechnicianDashboard = () => {
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
      const response = await apiClient.get('/dashboard/technician/stats');
      
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
    routers: [
      {
        id: 1,
        name: 'Main Router',
        location: 'Building A',
        status: 'online',
        connectedUsers: 45,
        maxUsers: 100,
        signalStrength: 'Strong',
        uptime: '99.8%',
      },
      {
        id: 2,
        name: 'Secondary Router',
        location: 'Building B',
        status: 'online',
        connectedUsers: 32,
        maxUsers: 80,
        signalStrength: 'Good',
        uptime: '98.5%',
      },
      {
        id: 3,
        name: 'Backup Router',
        location: 'Building C',
        status: 'maintenance',
        connectedUsers: 0,
        maxUsers: 60,
        signalStrength: 'Weak',
        uptime: '95.2%',
      },
    ],
    performance: {
      downloadSpeed: '45.2 Mbps',
      uploadSpeed: '12.8 Mbps',
      latency: '23ms',
      packetLoss: '0.1%',
    },
    alerts: [
      {
        id: 1,
        type: 'warning',
        message: 'Router 3 requires maintenance',
        time: '2 hours ago',
        priority: 'medium',
      },
      {
        id: 2,
        type: 'info',
        message: 'Network performance is optimal',
        time: '4 hours ago',
        priority: 'low',
      },
    ],
  };

  const data = dashboardData || mockData;

  return (
    <Box sx={{ p: 0 }}>
      {/* GG Wi-Fi Technician Dashboard Header */}
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
            Technician Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: ggwifiTheme.colors.neutral,
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
            }}
          >
            Network monitoring and router management for {user?.username}
          </Typography>
        </Box>
      </motion.div>

      {/* Alerts */}
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
                  backgroundColor: `rgba(${alert.type === 'warning' ? '255, 152, 0' : '33, 150, 243'}, 0.1)`,
                  border: `1px solid rgba(${alert.type === 'warning' ? '255, 152, 0' : '33, 150, 243'}, 0.2)`,
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

      {/* Router Status Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {data.routers.map((router, index) => (
          <Grid item xs={12} sm={6} md={4} key={router.id}>
            <RouterStatusCard
              router={router}
              loading={loading}
              delay={index * 0.1}
            />
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Network Performance */}
        <Grid item xs={12} lg={8}>
          <NetworkPerformanceCard 
            performance={data.performance} 
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
                    { title: 'Configure Router', icon: <Router />, color: ggwifiTheme.colors.primary },
                    { title: 'Check Network', icon: <NetworkCheck />, color: ggwifiTheme.colors.info },
                    { title: 'View Logs', icon: <TimelineIcon />, color: ggwifiTheme.colors.success },
                    { title: 'System Maintenance', icon: <Build />, color: ggwifiTheme.colors.warning },
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

export default TechnicianDashboard;