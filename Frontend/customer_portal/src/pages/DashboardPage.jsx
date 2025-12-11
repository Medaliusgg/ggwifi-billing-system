import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  VpnKey as VoucherIcon,
  Lock as AccessIcon,
  Speed as SpeedIcon,
  CloudDownload as DownloadIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import GlobalHeader from '../components/GlobalHeader';
import StickyBottomNav from '../components/StickyBottomNav';
import CountdownTimer from '../components/CountdownTimer';
import { customerPortalAPI } from '../services/customerPortalApi';

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const colors = {
    background: theme.palette.background.default,
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    info: theme.palette.info.main,
    infoDark: theme.palette.info.dark,
    warning: theme.palette.warning.main,
    warningDark: theme.palette.warning.dark,
    success: theme.palette.success.main,
    successLight: theme.palette.success.light,
    infoLight: theme.palette.info.light,
  };

  // Check if user is authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch active session
  const { data: activeSession, refetch: refetchSession } = useQuery(
    ['active-session'],
    async () => {
      const res = await customerPortalAPI.getActiveSession();
      return res?.data?.session || null;
    },
    { enabled: !!token, refetchInterval: 5000 }
  );

  // Fetch suggested packages
  const { data: packages = [] } = useQuery(
    ['suggested-packages'],
    async () => {
      const res = await customerPortalAPI.getPackages();
      return (res?.data?.packages || []).slice(0, 4);
    },
    { enabled: !!token }
  );

  const handleDisconnect = async () => {
    if (activeSession?.id) {
      try {
        await customerPortalAPI.disconnectSession(activeSession.id);
        refetchSession();
      } catch (err) {
        console.error('Failed to disconnect:', err);
      }
    }
  };

  // Show welcome message if coming from signup
  const showWelcome = location.state?.welcome;
  const rewards = location.state?.rewards;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, pb: { xs: 8, md: 0 } }}>
      <GlobalHeader isAuthenticated={!!token} user={user} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Welcome Message */}
        {showWelcome && rewards && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: '12px',
              backgroundColor: colors.successLight,
              color: colors.success,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome to GG Wi-Fi! 🎉
            </Typography>
            <Typography variant="body2">
              You've received: {rewards.voucher} and {rewards.points} GG Points!
            </Typography>
          </Alert>
        )}

        {/* Welcome Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #48C7F2 0%, #38B2D0 100%)',
              borderRadius: '16px',
              mb: 3,
              color: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: colors.info,
                    width: 56,
                    height: 56,
                    fontSize: '24px',
                    fontWeight: 700,
                  }}
                >
                  {user?.firstName?.[0] || user?.phone?.[0] || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Welcome back, {user?.firstName?.toUpperCase() || 'USER'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Enjoy the fast and reliable GG Wi-Fi network
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/voucher-login')}
                sx={{
                backgroundColor: colors.warning,
                color: theme.palette.background.paper,
                fontWeight: 600,
                py: 2,
                borderRadius: '12px',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: colors.warningDark,
                    boxShadow: '0 4px 12px rgba(244, 140, 6, 0.3)',
                  },
                }}
                startIcon={<VoucherIcon />}
              >
                VOUCHER CODE
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/voucher-login')}
                sx={{
                backgroundColor: colors.info,
                color: theme.palette.background.paper,
                fontWeight: 600,
                py: 2,
                borderRadius: '12px',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: colors.infoDark,
                    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
                  },
                }}
                startIcon={<AccessIcon />}
              >
                ACCESS CODE
              </Button>
            </Grid>
          </Grid>
        </motion.div>

        {/* Active Session Card */}
        {activeSession && (
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
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Active Session
                    </Typography>
                    <Chip
                      label={activeSession.sessionType || 'Hotspot'}
                      sx={{
                        bgcolor: colors.success,
                        color: theme.palette.background.paper,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Button
                    size="small"
                    onClick={handleDisconnect}
                    sx={{
                      color: theme.palette.error.main,
                      minWidth: 'auto',
                    }}
                  >
                    <CloseIcon />
                  </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                    Remaining Time
                  </Typography>
                  <CountdownTimer
                    targetTime={activeSession.expiresAt}
                    onExpire={() => refetchSession()}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        backgroundColor: colors.infoLight,
                        borderRadius: '8px',
                      }}
                    >
                      <DownloadIcon sx={{ color: colors.info }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666666', display: 'block' }}>
                          Download
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {activeSession.downloadUsage || '0 MB'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        backgroundColor: colors.successLight,
                        borderRadius: '8px',
                      }}
                    >
                      <UploadIcon sx={{ color: colors.success }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666666', display: 'block' }}>
                          Upload
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {activeSession.uploadUsage || '0 MB'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Suggested Packages */}
        {packages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Suggested Packages
              </Typography>
              <Button
                onClick={() => navigate('/plans')}
                sx={{
                  color: colors.info,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
                endIcon={<SpeedIcon />}
              >
                VIEW ALL PLANS →
              </Button>
            </Box>
            <Grid container spacing={2}>
              {packages.map((pkg, index) => (
                <Grid item xs={6} sm={3} key={pkg.id || index}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FC 100%)',
                      border: '1px solid #EEEEEE',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(72, 199, 242, 0.2)',
                      },
                    }}
                    onClick={() => navigate(`/plans?package=${pkg.id}`)}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        TZS {pkg.price?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                        {pkg.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#48C7F2' }}>
                        {pkg.duration || 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </Container>

      <StickyBottomNav />
    </Box>
  );
};

export default DashboardPage;
