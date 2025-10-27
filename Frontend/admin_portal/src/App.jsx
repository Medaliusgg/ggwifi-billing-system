import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import CustomerManagement from './pages/Customers';
import InternetPackageManagement from './pages/Packages';
import VoucherManagement from './pages/Vouchers';
import RouterManagement from './pages/Routers';
import FinancialManagement from './pages/Finance';
import PaymentManagement from './pages/Payments';
import AnalyticsReports from './pages/Analytics';
import BackendTest from './pages/BackendTest';
import SettingsConfiguration from './pages/Settings';
import SessionManagement from './pages/Sessions';
import TransactionManagement from './pages/Transactions';
import InvoiceManagement from './pages/Invoices';

// Placeholder pages for other routes
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
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Users />} />
      </Route>

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerManagement />} />
      </Route>

      <Route
        path="/routers"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RouterManagement />} />
      </Route>

      <Route
        path="/packages"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<InternetPackageManagement />} />
      </Route>

      <Route
        path="/vouchers"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<VoucherManagement />} />
      </Route>

      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FinancialManagement />} />
      </Route>

      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PaymentManagement />} />
      </Route>

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AnalyticsReports />} />
      </Route>

      <Route
        path="/loyalty"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Loyalty />} />
      </Route>

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SettingsConfiguration />} />
      </Route>

      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SessionManagement />} />
      </Route>

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TransactionManagement />} />
      </Route>

      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<InvoiceManagement />} />
      </Route>

      <Route
        path="/backend-test"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BackendTest />} />
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
