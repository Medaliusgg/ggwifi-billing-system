import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Session Status Component
 * Displays active session information and connection status
 */
const SessionStatus = ({ sessionStatus, isConnected, remainingTime, onRefresh, formatRemainingTime }) => {
  if (!sessionStatus) {
    return null;
  }

  const progress = remainingTime && sessionStatus.remainingTimeSeconds
    ? (sessionStatus.remainingTimeSeconds / (sessionStatus.remainingTimeSeconds + sessionStatus.elapsedTimeSeconds)) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isConnected ? 'rgba(26, 188, 156, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`,
          borderRadius: 2,
          mb: 2,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isConnected ? (
                <WifiIcon sx={{ color: '#1ABC9C' }} />
              ) : (
                <WifiOffIcon sx={{ color: '#E74C3C' }} />
              )}
              <Typography variant="h6" fontWeight={600}>
                Session Status
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
                label={isConnected ? 'Connected' : 'Disconnected'}
                color={isConnected ? 'success' : 'error'}
                size="small"
              />
              {onRefresh && (
                <Tooltip title="Refresh Status">
                  <IconButton size="small" onClick={onRefresh}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {remainingTime !== null && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimerIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Remaining Time
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600} color="primary">
                  {formatRemainingTime ? formatRemainingTime(remainingTime) : `${remainingTime}s`}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.max(0, Math.min(100, progress))}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: isConnected ? '#1ABC9C' : '#E74C3C',
                  },
                }}
              />
            </Box>
          )}

          {sessionStatus.voucherCode && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Voucher Code
              </Typography>
              <Typography variant="caption" fontWeight={600} fontFamily="monospace">
                {sessionStatus.voucherCode}
              </Typography>
            </Box>
          )}

          {sessionStatus.macAddress && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                MAC Address
              </Typography>
              <Typography variant="caption" fontFamily="monospace">
                {sessionStatus.macAddress}
              </Typography>
            </Box>
          )}

          {sessionStatus.ipAddress && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                IP Address
              </Typography>
              <Typography variant="caption" fontFamily="monospace">
                {sessionStatus.ipAddress}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SessionStatus;

