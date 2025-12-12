import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from '@mui/material';
import {
  FlashOn as FlashIcon,
  Speed as SpeedIcon,
  DataUsage as DataIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import GlobalHeader from '../components/GlobalHeader';
import StickyBottomNav from '../components/StickyBottomNav';
import { customerPortalAPI } from '../services/customerPortalApi';

const PlansPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const token = localStorage.getItem('token');
  // ✅ GG Wi-Fi OFFICIAL BRAND COLORS
  const colors = {
    background: theme.palette.background.default, // Clean White
    textPrimary: theme.palette.text.primary, // Deep Black #000000
    textSecondary: theme.palette.text.secondary, // Dark Gray #333333
    primary: theme.palette.primary.main, // Primary Yellow #FFCC00
    primaryDark: theme.palette.primary.dark,
    // Secondary Accents
    info: theme.palette.info.main, // Blue - Universal packages
    infoDark: theme.palette.info.dark,
    warning: theme.palette.warning.main, // Orange - Offer packages
    warningDark: theme.palette.warning.dark,
    purple: '#8B5CF6', // Purple - Premium plans
  };

  // Fetch packages (public endpoint - no token required)
  const { data: packagesData, isLoading, error: packagesError } = useQuery(
    ['packages'],
    async () => {
      try {
        const res = await customerPortalAPI.getPackages();
        // Handle different response structures
        const packages = res?.data?.packages || res?.data?.data?.packages || res?.data || [];
        console.log('PlansPage - Packages fetched:', packages);
        return Array.isArray(packages) ? { packages } : { packages: packages.packages || [] };
      } catch (error) {
        console.error('PlansPage - Error fetching packages:', error);
        return { packages: [] };
      }
    },
    { 
      enabled: true, // Always enabled since packages are public
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const universalPackages = (packagesData?.packages || []).filter(
    (pkg) => pkg.categoryType === 'UNIVERSAL' || !pkg.categoryType
  );

  const offerPackages = (packagesData?.packages || []).filter(
    (pkg) => pkg.categoryType === 'OFFER' || pkg.packageType === 'TIME_BASED_OFFER'
  );

  const handleBuyPackage = (pkg) => {
    // Navigate to purchase flow
    navigate(`/purchases/new?package=${pkg.id}`);
  };

  const PackageCard = ({ pkg, isOffer = false }) => (
    <Card
      sx={{
        background: isOffer
          ? `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.background.paper} 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${colors.background} 100%)`,
        border: isOffer ? `2px solid ${colors.warning}` : `1px solid ${theme.palette.divider}`,
        borderRadius: '16px',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease',
        },
      }}
    >
      {isOffer && (
        <Chip
          label="LIMITED OFFER"
          icon={<FlashIcon />}
          sx={{
            position: 'absolute',
            top: -12,
            right: 16,
            bgcolor: colors.warning,
            color: theme.palette.background.paper,
            fontWeight: 700,
            fontSize: '10px',
            height: 24,
          }}
        />
      )}
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: colors.textPrimary,
            mb: 1,
          }}
        >
          TZS {pkg.price?.toLocaleString() || '0'}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: colors.textPrimary,
            mb: 2,
          }}
        >
          {pkg.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.textSecondary,
            mb: 3,
            minHeight: 40,
          }}
        >
          {pkg.description || 'High-speed internet package'}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <SpeedIcon sx={{ fontSize: 18, color: colors.info }} /> {/* Blue - secondary accent */}
            <Typography variant="body2" sx={{ color: cardColors.textSecondary }}>
              Duration: {pkg.duration || pkg.durationDays + ' days' || 'N/A'}
            </Typography>
          </Box>
          {pkg.speed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SpeedIcon sx={{ fontSize: 18, color: colors.info }} /> {/* Blue - secondary accent */}
              <Typography variant="body2" sx={{ color: cardColors.textSecondary }}>
                Speed: {pkg.speed}
              </Typography>
            </Box>
          )}
          {pkg.dataLimit && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DataIcon sx={{ fontSize: 18, color: colors.info }} />
              <Typography variant="body2" sx={{ color: cardColors.textSecondary }}>
                Data: {pkg.dataLimit}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={() => handleBuyPackage(pkg)}
          sx={{
            backgroundColor: isOffer ? colors.warning : colors.info, // Orange for offers, Blue for universal
            color: theme.palette.background.paper, // Clean White
            fontWeight: 600,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: isOffer ? colors.warningDark : colors.infoDark,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
          }}
        >
          BUY
        </Button>
      </CardContent>
    </Card>
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
          Wi-Fi Plans
        </Typography>

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
                  color: colors.info, // Blue - secondary accent
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.info, // Blue - secondary accent
              },
            }}
          >
            <Tab label="Universal Packages" />
            <Tab label="Offer Packages" />
          </Tabs>
        </Box>

        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" sx={{ color: '#666666' }}>
              Loading packages...
            </Typography>
          </Box>
        ) : (
          <>
            {activeTab === 0 && (
              <Grid container spacing={3}>
                {universalPackages.length > 0 ? (
                  universalPackages.map((pkg) => (
                    <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PackageCard pkg={pkg} />
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                        No universal packages available
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}

            {activeTab === 1 && (
              <Grid container spacing={3}>
                {offerPackages.length > 0 ? (
                  offerPackages.map((pkg) => (
                    <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PackageCard pkg={pkg} isOffer={true} />
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                        No offer packages available
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </>
        )}
      </Container>

      <StickyBottomNav />
    </Box>
  );
};

export default PlansPage;
