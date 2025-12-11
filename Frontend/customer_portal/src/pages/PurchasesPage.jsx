import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  CheckCircle as PaidIcon,
  Pending as PendingIcon,
  Cancel as FailedIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import GlobalHeader from '../components/GlobalHeader';
import StickyBottomNav from '../components/StickyBottomNav';
import { customerPortalAPI } from '../services/customerPortalApi';

const PurchasesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  // ✅ GG Wi-Fi OFFICIAL BRAND COLORS
  const colors = {
    background: theme.palette.background.default, // Clean White
    textPrimary: theme.palette.text.primary, // Deep Black #000000
    textSecondary: theme.palette.text.secondary, // Dark Gray #333333
    primary: theme.palette.primary.main, // Primary Yellow #FFCC00
    // Secondary Accents
    info: theme.palette.info.main, // Blue - Amount display, buttons
    infoDark: theme.palette.info.dark,
    infoLight: theme.palette.info.light,
    warning: theme.palette.warning.main, // Orange - Pending status
    warningLight: theme.palette.warning.light,
    success: theme.palette.success.main, // Green - Paid status
    successLight: theme.palette.success.light,
  };

  // Fetch purchase history
  const { data: purchases = [], isLoading } = useQuery(
    ['purchases'],
    async () => {
      const res = await customerPortalAPI.getPurchaseHistory();
      return res?.data?.purchases || [];
    },
    { enabled: !!token }
  );

  const getStatusChip = (status) => {
    const statusMap = {
      PAID: {
        icon: <PaidIcon />,
        label: 'Paid',
        color: colors.success,
        bgcolor: colors.successLight,
      },
      PENDING: {
        icon: <PendingIcon />,
        label: 'Pending',
        color: colors.warning,
        bgcolor: colors.warningLight,
      },
      FAILED: {
        icon: <FailedIcon />,
        label: 'Failed',
        color: theme.palette.error.main,
        bgcolor: theme.palette.error.light,
      },
    };

    const statusInfo = statusMap[status] || statusMap.PENDING;

    return (
      <Chip
        icon={statusInfo.icon}
        label={statusInfo.label}
        sx={{
          bgcolor: statusInfo.bgcolor,
          color: statusInfo.color,
          fontWeight: 600,
        }}
      />
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, pb: { xs: 8, md: 0 } }}>
      <GlobalHeader isAuthenticated={!!token} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <ShoppingBagIcon sx={{ color: colors.info, fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.textPrimary,
            }}
          >
            Purchases
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" sx={{ color: colors.textSecondary }}>
              Loading purchases...
            </Typography>
          </Box>
        ) : purchases.length > 0 ? (
          <Grid container spacing={2}>
            {purchases.map((purchase) => (
              <Grid item xs={12} sm={6} md={4} key={purchase.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FC 100%)',
                      border: '1px solid #EEEEEE',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(72, 199, 242, 0.2)',
                      },
                    }}
                    onClick={() => navigate(`/purchases/${purchase.id}`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {purchase.packageName || 'Package'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666666' }}>
                            {purchase.reference || purchase.id}
                          </Typography>
                        </Box>
                        {getStatusChip(purchase.status)}
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>
                          Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {purchase.createdAt
                            ? new Date(purchase.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>
                          Amount
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.info }}>
                          TZS {purchase.amount?.toLocaleString() || '0'}
                        </Typography>
                      </Box>

                      {purchase.voucherCode && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>
                            Voucher Code
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 600,
                              color: colors.info,
                            }}
                          >
                            {purchase.voucherCode}
                          </Typography>
                        </Box>
                      )}

                      <Button
                        fullWidth
                        variant="outlined"
                        endIcon={<ArrowIcon />}
                        sx={{
                          borderColor: '#48C7F2',
                          color: colors.info,
                          fontWeight: 600,
                          mt: 2,
                          '&:hover': {
                            borderColor: '#38B2D0',
                            backgroundColor: 'rgba(72, 199, 242, 0.1)',
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingBagIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#666666', mb: 1 }}>
              No purchases yet
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/plans')}
              sx={{
                backgroundColor: colors.warning,
                color: theme.palette.background.paper,
                fontWeight: 600,
                mt: 2,
                '&:hover': {
                  backgroundColor: theme.palette.warning.dark,
                },
              }}
            >
              Browse Packages
            </Button>
          </Box>
        )}
      </Container>

      <StickyBottomNav />
    </Box>
  );
};

export default PurchasesPage;
