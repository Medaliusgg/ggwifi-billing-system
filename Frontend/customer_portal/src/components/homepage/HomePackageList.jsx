import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Tabs, Tab, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Speed as SpeedIcon, ShoppingCart as ShoppingIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { customerPortalAPI } from '../../services/customerPortalApi';
import GlobalButton from '../ui/GlobalButton';
import AnimatedSpinner from '../ui/AnimatedSpinner';

const HomePackageList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const { data: packagesData, isLoading } = useQuery(
    ['packages'],
    async () => {
      const res = await customerPortalAPI.getPackages();
      return res?.data || {};
    }
  );

  const universalPackages = (packagesData?.packages || []).filter(
    (pkg) => pkg.categoryType === 'UNIVERSAL' || !pkg.categoryType
  );

  const offerPackages = (packagesData?.packages || []).filter(
    (pkg) => pkg.categoryType === 'OFFER' || pkg.packageType === 'TIME_BASED_OFFER'
  );

  const packages = activeTab === 0 ? universalPackages : offerPackages;

  // Auto-focus animation every 3 seconds
  React.useEffect(() => {
    if (packages.length > 0) {
      const interval = setInterval(() => {
        setFocusedIndex((prev) => (prev + 1) % packages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [packages.length]);

  const getAccentColor = (index) => {
    const colors = ['#3A8DFF', '#A855F7', '#10B981', '#FF8A3D'];
    return colors[index % colors.length];
  };

  return (
    <Box sx={{ py: 6, backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 4,
            color: '#000000',
          }}
        >
          Choose Your Package
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue);
              setFocusedIndex(0);
            }}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '16px',
                '&.Mui-selected': {
                  color: '#FFCC00',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFCC00',
              },
            }}
          >
            <Tab label="Universal Packages" />
            <Tab label="Offer Packages" />
          </Tabs>
        </Box>

        {isLoading ? (
          <AnimatedSpinner />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {packages.slice(0, 4).map((pkg, index) => {
                  const isFocused = focusedIndex === index;
                  const accentColor = getAccentColor(index);
                  
                  return (
                    <Grid item xs={12} sm={6} md={3} key={pkg.id || index}>
                      <motion.div
                        animate={{
                          scale: isFocused ? 1.05 : 1,
                          y: isFocused ? -8 : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: 'easeInOut',
                        }}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            border: `2px solid ${isFocused ? accentColor : '#E5E7EB'}`,
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'visible',
                            cursor: 'pointer',
                            '&:hover': {
                              boxShadow: `0 8px 24px ${accentColor}40`,
                            },
                          }}
                          onClick={() => navigate(`/packages?package=${pkg.id}`)}
                        >
                          {isFocused && (
                            <motion.div
                              animate={{
                                boxShadow: [
                                  `0 0 0 0 ${accentColor}40`,
                                  `0 0 0 8px ${accentColor}00`,
                                  `0 0 0 0 ${accentColor}40`,
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                              style={{
                                position: 'absolute',
                                top: -2,
                                left: -2,
                                right: -2,
                                bottom: -2,
                                borderRadius: '16px',
                                border: `2px solid ${accentColor}`,
                                pointerEvents: 'none',
                              }}
                            />
                          )}
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '8px',
                                backgroundColor: `${accentColor}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                              }}
                            >
                              <SpeedIcon sx={{ color: accentColor }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>
                              TZS {pkg.price?.toLocaleString() || '0'}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
                              {pkg.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666666', mb: 2, minHeight: 40 }}>
                              {pkg.description || 'High-speed internet package'}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" sx={{ color: accentColor, display: 'block' }}>
                                Duration: {pkg.duration || pkg.durationDays + ' days' || 'N/A'}
                              </Typography>
                            </Box>
                            <GlobalButton
                              icon={<ShoppingIcon />}
                              variant="contained"
                              backgroundContext="white"
                              fullWidth
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/packages?package=${pkg.id}`);
                              }}
                            >
                              Buy Now
                            </GlobalButton>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            </motion.div>
          </AnimatePresence>
        )}
      </Container>
    </Box>
  );
};

export default HomePackageList;
