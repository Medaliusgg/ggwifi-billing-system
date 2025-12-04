import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Stop as StopIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
} from '@mui/icons-material';
import { useWebSocket } from '../hooks/useWebSocket';
import apiClient from '../api/client';

/**
 * Live Session Monitor Component
 * Real-time monitoring and control of active voucher sessions
 */
const LiveSessionMonitor = () => {
  const { connected, sessions, error, terminateSession } = useWebSocket();
  const [terminating, setTerminating] = useState(new Set());

  const handleTerminate = async (voucherCode) => {
    if (!window.confirm(`Terminate session for voucher ${voucherCode}?`)) {
      return;
    }

    setTerminating(prev => new Set(prev).add(voucherCode));

    try {
      // Also call REST API for termination
      await apiClient.post(`/customer-portal/voucher/${voucherCode}/session/end`);
      
      // WebSocket will broadcast the termination
      terminateSession(voucherCode);
    } catch (err) {
      console.error('Failed to terminate session:', err);
    } finally {
      setTerminating(prev => {
        const next = new Set(prev);
        next.delete(voucherCode);
        return next;
      });
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Live Session Monitor
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={connected ? <WifiIcon /> : <WifiOffIcon />}
              label={connected ? 'Connected' : 'Disconnected'}
              color={connected ? 'success' : 'error'}
              size="small"
            />
            <IconButton size="small" onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!connected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            WebSocket disconnected. Session updates will not be real-time.
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Voucher Code</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Remaining</TableCell>
                <TableCell>MAC Address</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {connected ? (
                      <Typography color="text.secondary">
                        No active sessions
                      </Typography>
                    ) : (
                      <CircularProgress size={24} />
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow key={session.voucherCode || session.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {session.voucherCode}
                      </Typography>
                    </TableCell>
                    <TableCell>{session.phoneNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={session.sessionStatus || 'ACTIVE'}
                        color={session.isConnected ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDuration(session.elapsedTimeSeconds)}</TableCell>
                    <TableCell>{formatDuration(session.remainingTimeSeconds)}</TableCell>
                    <TableCell>
                      <Typography variant="caption" fontFamily="monospace">
                        {session.macAddress || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" fontFamily="monospace">
                        {session.ipAddress || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Terminate Session">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleTerminate(session.voucherCode)}
                          disabled={terminating.has(session.voucherCode)}
                        >
                          {terminating.has(session.voucherCode) ? (
                            <CircularProgress size={16} />
                          ) : (
                            <StopIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default LiveSessionMonitor;


