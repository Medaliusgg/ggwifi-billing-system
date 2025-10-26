import { Card, CardContent, Typography, Box, Chip, IconButton, LinearProgress, Avatar, Tooltip } from '@mui/material';
import {
  Router as RouterIcon,
  Wifi as WifiIcon,
  People as PeopleIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

const RouterStatusCard = ({ 
  router,
  onRefresh,
  onConfigure,
  onReboot,
  onViewDetails,
  loading = false,
  delay = 0,
  ...props 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return ggwifiTheme.colors.success;
      case 'OFFLINE':
        return ggwifiTheme.colors.error;
      case 'MAINTENANCE':
        return ggwifiTheme.colors.warning;
      case 'ERROR':
        return ggwifiTheme.colors.error;
      default:
        return ggwifiTheme.colors.neutral;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircleIcon />;
      case 'OFFLINE':
        return <ErrorIcon />;
      case 'MAINTENANCE':
        return <BuildIcon />;
      case 'ERROR':
        return <ErrorIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getSignalStrength = (signal) => {
    if (signal >= 80) return { label: 'Excellent', color: ggwifiTheme.colors.success };
    if (signal >= 60) return { label: 'Good', color: ggwifiTheme.colors.info };
    if (signal >= 40) return { label: 'Fair', color: ggwifiTheme.colors.warning };
    return { label: 'Poor', color: ggwifiTheme.colors.error };
  };

  const signalInfo = getSignalStrength(router?.signalStrength || 0);

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
          {/* Header */}
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
                <RouterIcon />
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
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={getStatusIcon(router?.status || 'UNKNOWN')}
                label={router?.status || 'Unknown'}
                size="small"
                sx={{
                  backgroundColor: `rgba(${getStatusColor(router?.status || 'UNKNOWN').replace('#', '')}, 0.1)`,
                  color: getStatusColor(router?.status || 'UNKNOWN'),
                  border: `1px solid ${getStatusColor(router?.status || 'UNKNOWN')}`,
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                }}
              />
              <IconButton
                size="small"
                onClick={onRefresh}
                sx={{
                  color: ggwifiTheme.colors.neutral,
                  '&:hover': {
                    color: ggwifiTheme.colors.primary,
                    backgroundColor: 'rgba(245, 183, 0, 0.1)',
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Connection Stats */}
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

          {/* Performance Metrics */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WifiIcon sx={{ fontSize: 16, color: signalInfo.color }} />
              <Typography
                variant="caption"
                sx={{
                  color: ggwifiTheme.colors.neutral,
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                }}
              >
                Signal: {signalInfo.label}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon sx={{ fontSize: 16, color: ggwifiTheme.colors.primary }} />
              <Typography
                variant="caption"
                sx={{
                  color: ggwifiTheme.colors.neutral,
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                }}
              >
                {router?.speed || 'N/A'} Mbps
              </Typography>
            </Box>
          </Box>

          {/* Uptime */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: ggwifiTheme.colors.neutral,
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
              }}
            >
              Uptime: {router?.uptime || 'N/A'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: ggwifiTheme.colors.neutral,
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
              }}
            >
              Last Update: {router?.lastUpdate || 'N/A'}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="Configure">
              <IconButton
                size="small"
                onClick={onConfigure}
                sx={{
                  color: ggwifiTheme.colors.neutral,
                  '&:hover': {
                    color: ggwifiTheme.colors.primary,
                    backgroundColor: 'rgba(245, 183, 0, 0.1)',
                  },
                }}
              >
                <SecurityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={onViewDetails}
                sx={{
                  color: ggwifiTheme.colors.neutral,
                  '&:hover': {
                    color: ggwifiTheme.colors.primary,
                    backgroundColor: 'rgba(245, 183, 0, 0.1)',
                  },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RouterStatusCard;