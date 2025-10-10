import { Card, CardContent, Typography, Box, Chip, IconButton, LinearProgress } from '@mui/material';
import {
  Router as RouterIcon,
  Wifi as WifiIcon,
  People as PeopleIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatStatus, formatDuration } from '@/utils/formatters';

const RouterStatusCard = ({ 
  router,
  onRefresh,
  onConfigure,
  onReboot,
  onViewDetails,
  ...props 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'success';
      case 'OFFLINE':
        return 'error';
      case 'MAINTENANCE':
        return 'warning';
      case 'ERROR':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ONLINE':
        return '🟢';
      case 'OFFLINE':
        return '🔴';
      case 'MAINTENANCE':
        return '🟡';
      case 'ERROR':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const formatUptime = (uptimeSeconds) => {
    if (!uptimeSeconds) return 'Unknown';
    return formatDuration(uptimeSeconds);
  };

  const formatBandwidth = (usage) => {
    if (!usage) return '0 Mbps';
    return `${usage} Mbps`;
  };

  const formatTemperature = (temp) => {
    if (!temp) return 'N/A';
    return `${temp}°C`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="card hover:shadow-gg-glow cursor-pointer transition-all duration-300"
        sx={{
          backgroundColor: '#1E1E1E',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          borderRadius: 3,
          '&:hover': {
            borderColor: 'rgba(255, 215, 0, 0.3)',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
          },
        }}
        {...props}
      >
        <CardContent className="p-6">
          {/* Header */}
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center space-x-3">
              <Box className="w-12 h-12 bg-gg-gold bg-opacity-20 rounded-2xl flex items-center justify-center">
                <RouterIcon className="text-gg-gold" sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" className="text-gg-text-primary font-semibold">
                  {router.name}
                </Typography>
                <Typography variant="body2" className="text-gg-text-secondary">
                  {router.ipAddress}
                </Typography>
              </Box>
            </Box>
            
            <Box className="flex items-center space-x-2">
              <Chip
                icon={<span className="text-sm">{getStatusIcon(router.status)}</span>}
                label={router.status}
                color={getStatusColor(router.status)}
                variant="outlined"
                size="small"
              />
              <IconButton
                size="small"
                className="text-gg-text-muted hover:text-gg-gold"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle menu actions
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Router Info */}
          <Box className="grid grid-cols-2 gap-4 mb-4">
            <Box>
              <Typography variant="caption" className="text-gg-text-muted">
                Model
              </Typography>
              <Typography variant="body2" className="text-gg-text-primary font-medium">
                {router.model || 'Unknown'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" className="text-gg-text-muted">
                Location
              </Typography>
              <Typography variant="body2" className="text-gg-text-primary font-medium">
                {router.location || 'Unknown'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" className="text-gg-text-muted">
                Uptime
              </Typography>
              <Typography variant="body2" className="text-gg-text-primary font-medium">
                {formatUptime(router.uptimeSeconds)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" className="text-gg-text-muted">
                Temperature
              </Typography>
              <Typography variant="body2" className="text-gg-text-primary font-medium">
                {formatTemperature(router.temperatureCelsius)}
              </Typography>
            </Box>
          </Box>

          {/* Performance Metrics */}
          <Box className="space-y-3">
            {/* CPU Usage */}
            <Box>
              <Box className="flex items-center justify-between mb-1">
                <Box className="flex items-center space-x-2">
                  <SpeedIcon className="text-gg-gold" sx={{ fontSize: 16 }} />
                  <Typography variant="caption" className="text-gg-text-muted">
                    CPU Usage
                  </Typography>
                </Box>
                <Typography variant="caption" className="text-gg-text-primary font-medium">
                  {router.cpuUsagePercent || 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={router.cpuUsagePercent || 0}
                sx={{
                  backgroundColor: '#2E2E2E',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: router.cpuUsagePercent > 80 ? '#F44336' : 
                                   router.cpuUsagePercent > 60 ? '#FF9800' : '#FFD700',
                  },
                }}
              />
            </Box>

            {/* Memory Usage */}
            <Box>
              <Box className="flex items-center justify-between mb-1">
                <Box className="flex items-center space-x-2">
                  <MemoryIcon className="text-gg-gold" sx={{ fontSize: 16 }} />
                  <Typography variant="caption" className="text-gg-text-muted">
                    Memory Usage
                  </Typography>
                </Box>
                <Typography variant="caption" className="text-gg-text-primary font-medium">
                  {router.memoryUsagePercent || 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={router.memoryUsagePercent || 0}
                sx={{
                  backgroundColor: '#2E2E2E',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: router.memoryUsagePercent > 80 ? '#F44336' : 
                                   router.memoryUsagePercent > 60 ? '#FF9800' : '#FFD700',
                  },
                }}
              />
            </Box>

            {/* Bandwidth Usage */}
            <Box>
              <Box className="flex items-center justify-between mb-1">
                <Box className="flex items-center space-x-2">
                  <WifiIcon className="text-gg-gold" sx={{ fontSize: 16 }} />
                  <Typography variant="caption" className="text-gg-text-muted">
                    Bandwidth
                  </Typography>
                </Box>
                <Typography variant="caption" className="text-gg-text-primary font-medium">
                  {formatBandwidth(router.bandwidthUsageMbps)}
                </Typography>
              </Box>
            </Box>

            {/* Active Connections */}
            <Box>
              <Box className="flex items-center justify-between">
                <Box className="flex items-center space-x-2">
                  <PeopleIcon className="text-gg-gold" sx={{ fontSize: 16 }} />
                  <Typography variant="caption" className="text-gg-text-muted">
                    Active Users
                  </Typography>
                </Box>
                <Typography variant="caption" className="text-gg-text-primary font-medium">
                  {router.activeConnections || 0}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box className="flex items-center justify-between mt-4 pt-4 border-t border-gg-gold border-opacity-20">
            <Box className="flex items-center space-x-2">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefresh?.(router);
                }}
                className="text-gg-text-muted hover:text-gg-gold"
              >
                <RefreshIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            
            <Box className="flex items-center space-x-1">
              <Typography
                variant="caption"
                className="text-gg-text-muted cursor-pointer hover:text-gg-gold transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.(router);
                }}
              >
                View Details
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RouterStatusCard;
