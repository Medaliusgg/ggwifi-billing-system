import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import CustomerPortalHeader from './components/CustomerPortalHeader';
import LandingPage from './components/LandingPage';
import VoucherLogin from './components/VoucherLogin';
import BuyPackage from './components/BuyPackage';
import theme from './theme';

// Enhanced GGNetworks theme is now imported from theme/index.js

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App Content Component
const AppContent = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleNavigateToVoucher = () => {
    setCurrentView('voucher');
  };

  const handleNavigateToPackages = () => {
    setCurrentView('packages');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Fixed Header */}
      <CustomerPortalHeader />
      
      {/* Main Content with top padding to account for fixed header */}
      <Box sx={{ pt: { xs: '56px', md: '64px' } }}>
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage
                onNavigateToVoucher={handleNavigateToVoucher}
                onNavigateToPackages={handleNavigateToPackages}
                currentLanguage={currentLanguage}
              />
            </motion.div>
          )}

          {currentView === 'voucher' && (
            <motion.div
              key="voucher"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VoucherLogin
                onBack={handleBackToLanding}
                currentLanguage={currentLanguage}
              />
            </motion.div>
          )}

          {currentView === 'packages' && (
            <motion.div
              key="packages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BuyPackage
                onBack={handleBackToLanding}
                currentLanguage={currentLanguage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#000000',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontWeight: 500,
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#1ABC9C',
                secondary: '#FFFFFF',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#E74C3C',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;