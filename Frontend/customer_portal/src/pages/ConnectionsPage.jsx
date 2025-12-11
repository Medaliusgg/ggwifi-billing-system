import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Devices as DevicesIcon,
  History as HistoryIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import GlobalHeader from '../components/GlobalHeader';
import StickyBottomNav from '../components/StickyBottomNav';
import CountdownTimer from '../components/CountdownTimer';
import { customerPortalAPI } from '../services/customerPortalApi';

const ConnectionsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const token = localStorage.getItem('token');
  // ✅ GG Wi-Fi OFFICIAL BRAND COLORS
  const colors = {
    background: theme.palette.background.default, // Clean White
    textPrimary: theme.palette.text.primary, // Deep Black #000000
    textSecondary: theme.palette.text.secondary, // Dark Gray #333333
    primary: theme.palette.primary.main, // Primary Yellow #FFCC00
    // Secondary Accents
    info: theme.palette.info.main, // Blue - Icons
    success: theme.palette.success.main, // Green - Success states
    successLight: theme.palette.success.light,
    error: theme.palette.error.main, // Red - Error states
    errorLight: theme.palette.error.light,
  };

  // Fetch active sessions
  const { data: activeSessions = [] } = useQuery(
    ['active-sessions'],
    async () => {
      const res = await customerPortalAPI.getActiveSessions();
      return res?.data?.sessions || [];
    },
    { enabled: !!token, refetchInterval: 5000 }
  );

  // Fetch session history
  const { data: sessionHistory = [] } = useQuery(
    ['session-history'],
    async () => {
      const res = await customerPortalAPI.getSessionHistory();
      return res?.data?.sessions || [];
    },
    { enabled: !!token }
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, pb: { xs: 8, md: 0 } }}>
      <GlobalHeader isAuthenticated={!!token} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: colors.textPrimary,
          }}
        >
          Connections
        </Typography>

        {/* Active Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FC 100%)',
              border: '1px solid #EEEEEE',
              borderRadius: '16px',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <DevicesIcon sx={{ color: '#48C7F2' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Active Devices
                </Typography>
              </Box>

              {activeSessions.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Device Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>MAC Address</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Start Time</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Remaining Time</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{session.deviceName || 'Unknown Device'}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>
                            {session.macAddress || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>
                            {session.ipAddress || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {session.startedAt
                              ? new Date(session.startedAt).toLocaleString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {session.expiresAt ? (
                              <CountdownTimer targetTime={session.expiresAt} />
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<ActiveIcon />}
                              label="Active"
                              sx={{
                                bgcolor: colors.successLight,
                                color: colors.success,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#666666' }}>
                    No active connections
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Session History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FC 100%)',
              border: '1px solid #EEEEEE',
              borderRadius: '16px',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <HistoryIcon sx={{ color: colors.info }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Session History
                </Typography>
              </Box>

              {sessionHistory.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Device</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Start Time</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>End Time</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Data Used</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sessionHistory.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{session.deviceName || 'Unknown Device'}</TableCell>
                          <TableCell>
                            {session.startedAt
                              ? new Date(session.startedAt).toLocaleString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {session.endedAt
                              ? new Date(session.endedAt).toLocaleString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {session.duration
                              ? `${Math.floor(session.duration / 60)} min`
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {session.dataUsed
                              ? `${(session.dataUsed / 1024 / 1024).toFixed(2)} MB`
                              : '0 MB'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<InactiveIcon />}
                              label="Completed"
                              sx={{
                                bgcolor: colors.errorLight,
                                color: colors.error,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#666666' }}>
                    No session history available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      <StickyBottomNav />
    </Box>
  );
};

export default ConnectionsPage;
