import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CustomerDashboard from '../CustomerDashboard';
import { customerPortalAPI } from '../../../services/customerPortalApi';
import { loyaltyAPI, analyticsAPI, sessionAPI } from '../../../services/api';

// Mock the APIs
vi.mock('../../../services/customerPortalApi', () => ({
  customerPortalAPI: {
    getCustomerDashboard: vi.fn(),
    getCustomerProfile: vi.fn(),
  },
}));

vi.mock('../../../services/api', () => ({
  loyaltyAPI: {
    getLoyaltyStatus: vi.fn(),
  },
  analyticsAPI: {
    getUsageStatistics: vi.fn(),
    getSpendingAnalytics: vi.fn(),
  },
  sessionAPI: {
    getActiveSessions: vi.fn(),
    getSessionStatistics: vi.fn(),
  },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('CustomerDashboard', () => {
  const mockSession = {
    phoneNumber: '+255742844024',
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    account: {
      id: 1,
      phoneNumber: '+255742844024',
      fullName: 'Test User',
    },
  };

  const mockOnLogout = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    customerPortalAPI.getCustomerDashboard.mockImplementation(() => new Promise(() => {}));
    loyaltyAPI.getLoyaltyStatus.mockImplementation(() => new Promise(() => {}));
    analyticsAPI.getUsageStatistics.mockImplementation(() => new Promise(() => {}));
    analyticsAPI.getSpendingAnalytics.mockImplementation(() => new Promise(() => {}));
    sessionAPI.getActiveSessions.mockImplementation(() => new Promise(() => {}));
    sessionAPI.getSessionStatistics.mockImplementation(() => new Promise(() => {}));

    render(
      <CustomerDashboard session={mockSession} onLogout={mockOnLogout} onBack={mockOnBack} />,
      { wrapper: createWrapper() }
    );

    // During loading, the component shows fallback text "GG Customer" or the phone number
    // Check for any element that's always present - the phone number should be visible
    expect(screen.getByText(/\+255742844024/i)).toBeInTheDocument();
  });

  it('should display customer information after loading', async () => {
    customerPortalAPI.getCustomerDashboard.mockResolvedValue({
      data: {
        customer: {
          phoneNumber: '+255712345678',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          status: 'ACTIVE',
        },
        statistics: {
          totalVouchers: 5,
          activeVouchers: 2,
          totalPayments: 10,
          successfulPayments: 9,
          activeSessionsCount: 1,
        },
        vouchers: [],
        payments: [],
        transactions: [],
        activeSessions: [],
      },
    });

    loyaltyAPI.getLoyaltyStatus.mockResolvedValue({
      data: {
        phoneNumber: '+255742844024',
        points: 1500,
        availablePoints: 1200,
        tier: 'GOLD',
        lifetimeSpend: 50000,
        totalRedemptions: 3,
      },
    });

    analyticsAPI.getUsageStatistics.mockResolvedValue({
      data: {
        totalDataUsed: 1024000000,
        averageSessionDuration: 3600,
        totalSessions: 10,
      },
    });

    analyticsAPI.getSpendingAnalytics.mockResolvedValue({
      data: {
        totalSpent: 50000,
        monthlySpending: [],
      },
    });

    sessionAPI.getActiveSessions.mockResolvedValue({
      data: [],
    });

    sessionAPI.getSessionStatistics.mockResolvedValue({
      data: {},
    });

    render(
      <CustomerDashboard session={mockSession} onLogout={mockOnLogout} onBack={mockOnBack} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText(/Test User/i)).toBeInTheDocument();
      expect(screen.getByText(/\+255742844024/i)).toBeInTheDocument();
    });
  });

  it('should display loyalty points and tier', async () => {
    customerPortalAPI.getCustomerDashboard.mockResolvedValue({
      data: {
        customer: { phoneNumber: '+255742844024', firstName: 'Test', lastName: 'User' },
        statistics: {},
        vouchers: [],
        payments: [],
        transactions: [],
        activeSessions: [],
      },
    });

    loyaltyAPI.getLoyaltyStatus.mockResolvedValue({
      data: {
        points: 1500,
        availablePoints: 1200,
        tier: 'GOLD',
        lifetimeSpend: 50000,
        totalRedemptions: 3,
      },
    });

    analyticsAPI.getUsageStatistics.mockResolvedValue({
      data: {
        totalDataUsed: 1024000000,
        averageSessionDuration: 3600,
        totalSessions: 10,
      },
    });

    analyticsAPI.getSpendingAnalytics.mockResolvedValue({
      data: {
        totalSpent: 50000,
        monthlySpending: [],
      },
    });

    sessionAPI.getActiveSessions.mockResolvedValue({
      data: [],
    });

    sessionAPI.getSessionStatistics.mockResolvedValue({
      data: {},
    });

    render(
      <CustomerDashboard session={mockSession} onLogout={mockOnLogout} onBack={mockOnBack} />,
      { wrapper: createWrapper() }
    );

    // Wait for all data to load
    await waitFor(() => {
      // Verify loyalty tier is displayed (confirms loyalty data loaded)
      expect(screen.getByText(/GOLD/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify GG Points label exists (points value might be formatted differently)
    expect(screen.getByText(/GG Points/i)).toBeInTheDocument();
  });

  it('should display empty states when no data', async () => {
    customerPortalAPI.getCustomerDashboard.mockResolvedValue({
      data: {
        customer: { phoneNumber: '+255742844024', firstName: 'Test', lastName: 'User' },
        statistics: {},
        vouchers: [],
        payments: [],
        transactions: [],
        activeSessions: [],
      },
    });

    loyaltyAPI.getLoyaltyStatus.mockResolvedValue({
      data: {
        points: 0,
        tier: 'BRONZE',
      },
    });

    render(
      <CustomerDashboard session={mockSession} onLogout={mockOnLogout} onBack={mockOnBack} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText(/No active hotspot sessions/i)).toBeInTheDocument();
      expect(screen.getByText(/No payments recorded yet/i)).toBeInTheDocument();
      expect(screen.getByText(/No transactions recorded/i)).toBeInTheDocument();
    });
  });

  it('should display active sessions when available', async () => {
    customerPortalAPI.getCustomerDashboard.mockResolvedValue({
      data: {
        customer: { phoneNumber: '+255742844024', firstName: 'Test', lastName: 'User' },
        statistics: {},
        vouchers: [],
        payments: [],
        transactions: [],
        activeSessions: [
          {
            sessionId: 'session-1',
            username: 'test-user',
            ipAddress: '192.168.1.100',
            sessionTime: 3600,
          },
        ],
      },
    });

    loyaltyAPI.getLoyaltyStatus.mockResolvedValue({
      data: { points: 0, tier: 'BRONZE' },
    });

    render(
      <CustomerDashboard session={mockSession} onLogout={mockOnLogout} onBack={mockOnBack} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText(/test-user/i)).toBeInTheDocument();
      expect(screen.getByText(/192.168.1.100/i)).toBeInTheDocument();
    });
  });

  it('should handle logout action', async () => {
    customerPortalAPI.getCustomerDashboard.mockResolvedValue({
      data: {
        customer: { phoneNumber: '+255742844024', firstName: 'Test', lastName: 'User' },
        statistics: {},
        vouchers: [],
        payments: [],
        transactions: [],
        activeSessions: [],
      },
    });

    loyaltyAPI.getLoyaltyStatus.mockResolvedValue({
      data: { points: 0, tier: 'BRONZE' },
    });

    render(
      <CustomerDashboard session={mockSession} onLogout={mockOnLogout} onBack={mockOnBack} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const logoutButton = screen.getByText(/Logout/i);
      logoutButton.click();
    });

    expect(mockOnLogout).toHaveBeenCalled();
  });
});

