import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';

// Components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Packages from './pages/Packages';
import Vouchers from './pages/Vouchers';
import Payments from './pages/Payments';
import Routers from './pages/Routers';
import Sessions from './pages/Sessions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import Blog from './pages/Blog';
import Installations from './pages/Installations';
import MainLayout from './components/Layout/MainLayout';
import LoadingOverlay from './components/shared/LoadingOverlay';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Theme
import theme from './theme';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingOverlay />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/users" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Users />} />
      </Route>
      <Route path="/packages" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Packages />} />
      </Route>
      <Route path="/vouchers" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Vouchers />} />
      </Route>
      <Route path="/payments" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Payments />} />
      </Route>
      <Route path="/routers" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Routers />} />
      </Route>
      <Route path="/sessions" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Sessions />} />
      </Route>
      <Route path="/analytics" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Analytics />} />
      </Route>
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Settings />} />
      </Route>
      <Route path="/feedback" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Feedback />} />
      </Route>
      <Route path="/blog" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Blog />} />
      </Route>
      <Route path="/installations" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Installations />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <AuthProvider>
            <LoadingProvider>
              <Router>
                <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                  <AppRoutes />
                </Box>
              </Router>
            </LoadingProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 