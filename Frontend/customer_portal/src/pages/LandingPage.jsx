import React from 'react';
import { Box, Container } from '@mui/material';
import GlobalHeader from '../components/GlobalHeader';
import AnimatedStickyFooter from '../components/AnimatedStickyFooter';
import HeroSection from '../components/homepage/HeroSection';
import EnhancedMarketingCarousel from '../components/homepage/EnhancedMarketingCarousel';
import HomePackageList from '../components/homepage/HomePackageList';
import TrustSection from '../components/homepage/TrustSection';
import TestimonialsSection from '../components/homepage/TestimonialsSection';
import { useQuery } from 'react-query';
import { customerPortalAPI } from '../services/customerPortalApi';

const LandingPage = () => {
  // Fetch marketing campaigns
  const { data: campaigns = [] } = useQuery(
    ['marketing-campaigns'],
    async () => {
      try {
        const res = await customerPortalAPI.getCampaigns();
        return res?.data?.campaigns || [];
      } catch (error) {
        if (error?.response?.status !== 404) {
          console.error('Error fetching campaigns:', error);
        }
        return [];
      }
    },
    { 
      refetchInterval: 300000,
      retry: false,
      refetchOnWindowFocus: false,
      onError: () => {},
    }
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <GlobalHeader isAuthenticated={false} />

      {/* Section 1: Hero Section */}
      <HeroSection />

      {/* Section 2: Marketing Campaign Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: 4, px: { xs: 2, md: 0 } }}>
          <EnhancedMarketingCarousel campaigns={campaigns} />
        </Box>
      </Container>

      {/* Section 3: Package List Section */}
      <HomePackageList />

      {/* Section 4: Trust & Security Section */}
      <TrustSection />

      {/* Section 5: Testimonials Section */}
      <TestimonialsSection />

      {/* Animated Sticky Footer */}
      <AnimatedStickyFooter />
    </Box>
  );
};

export default LandingPage;
