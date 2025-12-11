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

  // Fetch packages
  const { data: packagesData, isLoading } = useQuery(
    ['packages'],
    async () => {
      const res = await customerPortalAPI.getPackages();
      return res?.data || {};
    },
    { enabled: !!token }
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
          ? 'linear-gradient(135deg, #FFF3E6 0%, #FFFFFF 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #F5F9FC 100%)',
        border: isOffer ? '2px solid #F48C06' : '1px solid #EEEEEE',
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
            bgcolor: '#F48C06',
            color: '#FFFFFF',
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
            color: '#0A0A0A',
            mb: 1,
          }}
        >
          TZS {pkg.price?.toLocaleString() || '0'}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#0A0A0A',
            mb: 2,
          }}
        >
          {pkg.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666666',
            mb: 3,
            minHeight: 40,
          }}
        >
          {pkg.description || 'High-speed internet package'}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <SpeedIcon sx={{ fontSize: 18, color: '#48C7F2' }} />
            <Typography variant="body2" sx={{ color: '#666666' }}>
              Duration: {pkg.duration || pkg.durationDays + ' days' || 'N/A'}
            </Typography>
          </Box>
          {pkg.speed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SpeedIcon sx={{ fontSize: 18, color: '#48C7F2' }} />
              <Typography variant="body2" sx={{ color: '#666666' }}>
                Speed: {pkg.speed}
              </Typography>
            </Box>
          )}
          {pkg.dataLimit && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DataIcon sx={{ fontSize: 18, color: '#48C7F2' }} />
              <Typography variant="body2" sx={{ color: '#666666' }}>
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
            backgroundColor: isOffer ? '#F48C06' : '#007BFF',
            color: '#FFFFFF',
            fontWeight: 600,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: isOffer ? '#D97706' : '#0056B3',
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F9FC', pb: { xs: 8, md: 0 } }}>
      <GlobalHeader isAuthenticated={!!token} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: '#0A0A0A',
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
                  color: '#48C7F2',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#48C7F2',
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
                      <Typography variant="body1" sx={{ color: '#666666' }}>
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
                      <Typography variant="body1" sx={{ color: '#666666' }}>
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
