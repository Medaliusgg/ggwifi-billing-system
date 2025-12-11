import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ggwifiOfficialTheme } from './theme/ggwifiOfficialTheme';

// Pages
import LandingPage from './pages/LandingPage';
import VoucherLoginPage from './pages/VoucherLoginPage';
import LoginPage from './pages/LoginPage';
import OTPLoginPage from './pages/OTPLoginPage';
import SignupPhonePage from './pages/SignupPhonePage';
import SignupVerifyPage from './pages/SignupVerifyPage';
import SignupDetailsPage from './pages/SignupDetailsPage';
import DashboardPage from './pages/DashboardPage';
import PlansPage from './pages/PlansPage';
import ConnectionsPage from './pages/ConnectionsPage';
import PurchasesPage from './pages/PurchasesPage';
import RewardsPage from './pages/RewardsPage';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={ggwifiOfficialTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<LandingPage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/index.html" element={<Navigate to="/home" replace />} />
            <Route path="/voucher-login" element={<VoucherLoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp-login" element={<OTPLoginPage />} />
            <Route path="/forgot-password" element={<OTPLoginPage />} /> {/* Reuse OTP login for forgot password */}
            <Route path="/verify-otp" element={<SignupVerifyPage />} />
            
            {/* Signup Flow */}
            <Route path="/signup" element={<Navigate to="/signup/phone" replace />} />
            <Route path="/signup/phone" element={<SignupPhonePage />} />
            <Route path="/signup/verify" element={<SignupVerifyPage />} />
            <Route path="/signup/details" element={<SignupDetailsPage />} />
            
            {/* Public Package Page (can buy without login) */}
            <Route path="/packages" element={<PlansPage />} />

            {/* Protected Routes (After Login) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <PlansPage />
                </ProtectedRoute>
              }
            />
            {/* /packages is public (no protection) - see above */}
            <Route
              path="/connections"
              element={
                <ProtectedRoute>
                  <ConnectionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases"
              element={
                <ProtectedRoute>
                  <PurchasesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases/new"
              element={<PurchasesPage />} // Public route - phone verification handles auth
            />
            <Route
              path="/purchases/:orderId"
              element={
                <ProtectedRoute>
                  <PurchasesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <ProtectedRoute>
                  <RewardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards/product/:id"
              element={
                <ProtectedRoute>
                  <RewardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards/orders"
              element={
                <ProtectedRoute>
                  <RewardsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
