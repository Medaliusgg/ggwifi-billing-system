import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CardGiftcard as GiftIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import GlobalHeader from '../components/GlobalHeader';
import StickyBottomNav from '../components/StickyBottomNav';
import { customerPortalAPI } from '../services/customerPortalApi';

const RewardsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
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
    warningLight: theme.palette.warning.light,
  };

  // Fetch loyalty account (points, tier)
  const { data: loyaltyAccount } = useQuery(
    ['loyalty-account'],
    async () => {
      const res = await customerPortalAPI.getLoyaltyAccount();
      return res?.data || {};
    },
    { enabled: !!token }
  );

  // Fetch products
  const { data: products = [] } = useQuery(
    ['loyalty-products'],
    async () => {
      const res = await customerPortalAPI.getLoyaltyProducts();
      return res?.data?.products || [];
    },
    { enabled: !!token }
  );

  // Fetch reward orders
  const { data: orders = [] } = useQuery(
    ['reward-orders'],
    async () => {
      const res = await customerPortalAPI.getRewardOrders();
      return res?.data?.orders || [];
    },
    { enabled: !!token }
  );

  const points = loyaltyAccount?.points || 0;
  const currentTier = loyaltyAccount?.tier || 'BRONZE';
  const nextTier = loyaltyAccount?.nextTier || 'SILVER';
  const pointsToNextTier = loyaltyAccount?.pointsToNextTier || 1000;
  const progress = Math.min((points / pointsToNextTier) * 100, 100);

  const tierColors = {
    BRONZE: { color: '#CD7F32', bgcolor: '#FFF3E6' },
    SILVER: { color: '#C0C0C0', bgcolor: '#F5F5F5' },
    GOLD: { color: '#FFD700', bgcolor: '#FFF9E6' },
    PLATINUM: { color: '#E5E4E2', bgcolor: '#F8F8F8' },
  };

  const tierInfo = tierColors[currentTier] || tierColors.BRONZE;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, pb: { xs: 8, md: 0 } }}>
      <GlobalHeader isAuthenticated={!!token} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <GiftIcon sx={{ color: colors.info, fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.textPrimary,
            }}
          >
            Rewards
          </Typography>
        </Box>

        {/* Points Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${colors.background} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '16px',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: colors.info, mb: 0.5 }}>
                    {points.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666666' }}>
                    GG Points
                  </Typography>
                </Box>
                <Chip
                  label={currentTier}
                  sx={{
                    bgcolor: tierInfo.bgcolor,
                    color: tierInfo.color,
                    fontWeight: 700,
                    fontSize: '14px',
                    px: 2,
                    py: 1,
                  }}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666666' }}>
                    Progress to {nextTier}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {pointsToNextTier - points} pts needed
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: '4px',
                    backgroundColor: theme.palette.divider,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors.info,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '16px',
                '&.Mui-selected': {
                  color: colors.info,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.info,
              },
            }}
          >
            <Tab label="Product Catalog" />
            <Tab label="My Orders" />
          </Tabs>
        </Box>

        {/* Product Catalog */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {products.length > 0 ? (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
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
                      onClick={() => navigate(`/rewards/product/${product.id}`)}
                    >
                      {product.imageUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.imageUrl}
                          alt={product.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: colors.textSecondary, mb: 2, minHeight: 40 }}
                        >
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box>
                            {product.pointsCost > 0 && (
                              <Typography variant="body2" sx={{ color: colors.info, fontWeight: 600 }}>
                                {product.pointsCost} Points
                              </Typography>
                            )}
                            {product.cashPrice > 0 && (
                              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                + TZS {product.cashPrice?.toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            backgroundColor: '#F48C06',
                            color: '#FFFFFF',
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: '#D97706',
                            },
                          }}
                        >
                          {product.pointsCost > 0 ? 'Redeem' : 'Buy'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <GiftIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                  <Typography variant="body1" sx={{ color: '#666666' }}>
                    No products available
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        {/* My Orders */}
        {activeTab === 1 && (
          <Grid container spacing={2}>
            {orders.length > 0 ? (
              orders.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order.id}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FC 100%)',
                      border: '1px solid #EEEEEE',
                      borderRadius: '16px',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {order.productName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                        Order #{order.id}
                      </Typography>
                      <Chip
                        label={order.status}
                        sx={{
                          bgcolor: order.status === 'FULFILLED' ? colors.successLight : colors.warningLight,
                          color: order.status === 'FULFILLED' ? colors.success : colors.warning,
                          fontWeight: 600,
                          mb: 2,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#666666' }}>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <ShoppingBagIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                  <Typography variant="body1" sx={{ color: '#666666' }}>
                    No orders yet
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      <StickyBottomNav />
    </Box>
  );
};

export default RewardsPage;
