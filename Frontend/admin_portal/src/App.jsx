import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import BackendTest from '@/pages/BackendTest';

// Placeholder pages for other routes
const Customers = () => (
  <div className="text-gg-text-primary">
    <h1>Customers Page</h1>
    <p>Customer management will be implemented here.</p>
  </div>
);

const Routers = () => (
  <div className="text-gg-text-primary">
    <h1>Routers Page</h1>
    <p>Router management will be implemented here.</p>
  </div>
);

const Packages = () => (
  <div className="text-gg-text-primary">
    <h1>Packages Page</h1>
    <p>Package management will be implemented here.</p>
  </div>
);

const Vouchers = () => (
  <div className="text-gg-text-primary">
    <h1>Vouchers Page</h1>
    <p>Voucher management will be implemented here.</p>
  </div>
);

const Finance = () => (
  <div className="text-gg-text-primary">
    <h1>Finance Page</h1>
    <p>Financial management will be implemented here.</p>
  </div>
);

const Loyalty = () => (
  <div className="text-gg-text-primary">
    <h1>Loyalty Page</h1>
    <p>Loyalty program management will be implemented here.</p>
  </div>
);

const Settings = () => (
  <div className="text-gg-text-primary">
    <h1>Settings Page</h1>
    <p>System settings will be implemented here.</p>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen bg-gg-black flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gg-gold mb-4">403</h1>
      <p className="text-gg-text-secondary">You don't have permission to access this page.</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-gg-black flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gg-gold mb-4">404</h1>
      <p className="text-gg-text-secondary">The page you're looking for doesn't exist.</p>
    </div>
  </div>
);

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Navigate to="/dashboard" replace />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Customers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/routers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/packages"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Packages />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/vouchers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Vouchers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Finance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/loyalty"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Loyalty />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/backend-test"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BackendTest />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
