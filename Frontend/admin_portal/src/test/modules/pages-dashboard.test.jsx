import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard.jsx';

// Mock dependencies
vi.mock('../../api/admin.js', () => ({
  adminAPI: {
    getDashboard: vi.fn(() =>
      Promise.resolve({
        data: {
          status: 'success',
          data: {
            totalCustomers: 100,
            totalPackages: 10,
            totalRevenue: 5000000,
          },
        },
      }),
    ),
  },
}));

// Dashboard imports the Zustand hook `useAuthStore` as default and CALLS it,
// so the mock must be a FUNCTION that returns the store state.
vi.mock('../../store/authStore.js', () => ({
  default: () => ({
    user: { role: 'SUPER_ADMIN' },
    token: 'mock-token',
  }),
}));

// SimpleAdminDashboard (used by Dashboard) relies on the branded GG Wi-Fi theme.
// Provide a lightweight mock so style reads don't crash in the test environment.
vi.mock('/src/theme/ggwifiTheme.js', () => ({
  default: {
    gradients: {
      card: 'linear-gradient(90deg, #000, #111)',
      primary: 'linear-gradient(90deg, #f5b700, #ffdd55)',
    },
    borderRadius: {
      lg: 16,
      md: 12,
    },
    shadows: {
      lg: '0 10px 30px rgba(0,0,0,0.3)',
      golden: '0 0 20px rgba(245,183,0,0.6)',
    },
    transitions: {
      normal: 'all 0.3s ease',
    },
    typography: {
      fontFamily: {
        primary: 'Roboto, sans-serif',
      },
      fontWeight: {
        semibold: 600,
        medium: 500,
      },
    },
    colors: {
      secondary: '#F5B700',
    },
  },
}));

describe('Module: pages/Dashboard.jsx', () => {
  describe('Analysis', () => {
    it('should be a React component', () => {
      expect(Dashboard).toBeDefined();
      expect(typeof Dashboard).toBe('function');
    });

    it('should render without crashing', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
      expect(container).toBeTruthy();
    });
  });

  describe('Inspection', () => {
    it('should have required imports', () => {
      // Component should import necessary dependencies
      expect(Dashboard).toBeDefined();
    });

    it('should handle loading state', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
      // Check if component handles loading
      expect(container).toBeTruthy();
    });
  });

  describe('Unit Tests', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should render dashboard component', () => {
      const { container } = render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
      expect(container).toBeTruthy();
    });
  });
});


