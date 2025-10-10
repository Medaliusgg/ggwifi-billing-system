import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import CustomerPortal from './components/CustomerPortal';
import LoadingSpinner from './components/LoadingSpinner';
import { DataProvider, useData } from './context/DataContext';
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

// Wrapper component to handle data loading
const AppContent = () => {
  const { isDataLoaded, loadingProgress, loadingMessages, isLoading } = useData();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Show app loading for 1 second, then show data loading
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return <LoadingSpinner />;
  }

  if (!isDataLoaded || isLoading) {
    return <LoadingSpinner progress={loadingProgress} messages={loadingMessages} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerPortal />} />
        <Route path="*" element={<CustomerPortal />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DataProvider>
          <AppContent />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#f44336',
                secondary: '#fff',
              },
            },
          }}
        />
        </DataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 