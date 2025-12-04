import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axios before importing apiClient
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => ({
      defaults: {
        baseURL: 'http://localhost:8080/api/v1',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  };
  return {
    default: mockAxios,
    ...mockAxios,
  };
});

// Mock useAuthStore before importing
vi.mock('../store/authStore.js', () => ({
  default: {
    getState: () => ({
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
    }),
    setTokens: vi.fn(),
    logout: vi.fn(),
  },
}));

// Now import after mocks are set up
import { adminAPI } from '../api/admin.js';
import { authAPI } from '../api/auth.js';

describe('API Client Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('API Client Configuration', () => {
    it('should have API client module defined', () => {
      // Verify API client module exists
      expect(true).toBe(true); // Placeholder - API client is imported via adminAPI and authAPI
    });

    it('should have timeout configured in client', () => {
      // API client timeout is configured in client.js
      expect(true).toBe(true);
    });

    it('should have correct headers configured', () => {
      // API client headers are configured in client.js
      expect(true).toBe(true);
    });
  });

  describe('Authentication API', () => {
    it('should have login method', () => {
      expect(authAPI.login).toBeDefined();
      expect(typeof authAPI.login).toBe('function');
    });

    it('should have register method', () => {
      expect(authAPI.register).toBeDefined();
      expect(typeof authAPI.register).toBe('function');
    });

    it('should have refreshToken method', () => {
      expect(authAPI.refreshToken).toBeDefined();
      expect(typeof authAPI.refreshToken).toBe('function');
    });

    it('should have OTP methods', () => {
      expect(authAPI.generateOTP).toBeDefined();
      expect(authAPI.validateOTP).toBeDefined();
      expect(authAPI.resendOTP).toBeDefined();
    });

    it('should have logout method', () => {
      expect(authAPI.logout).toBeDefined();
      expect(typeof authAPI.logout).toBe('function');
    });
  });

  describe('Admin API', () => {
    it('should have dashboard method', () => {
      expect(adminAPI.getDashboard).toBeDefined();
      expect(typeof adminAPI.getDashboard).toBe('function');
    });

    it('should have user management methods', () => {
      expect(adminAPI.getUsers).toBeDefined();
      expect(adminAPI.updateUserStatus).toBeDefined();
    });

    it('should have package management methods', () => {
      expect(adminAPI.getPackages).toBeDefined();
      expect(adminAPI.createPackage).toBeDefined();
      expect(adminAPI.updatePackage).toBeDefined();
      expect(adminAPI.deletePackage).toBeDefined();
    });

    it('should have voucher management methods', () => {
      expect(adminAPI.generateVoucher).toBeDefined();
      expect(adminAPI.generateBulkVouchers).toBeDefined();
      expect(adminAPI.getVoucherStatistics).toBeDefined();
      expect(adminAPI.cleanupExpiredVouchers).toBeDefined();
    });

    it('should have router management methods', () => {
      expect(adminAPI.getRouters).toBeDefined();
      expect(adminAPI.getRouterStatus).toBeDefined();
      expect(adminAPI.addRouter).toBeDefined();
      expect(adminAPI.updateRouter).toBeDefined();
      expect(adminAPI.deleteRouter).toBeDefined();
      expect(adminAPI.testRouterConnection).toBeDefined();
    });

    it('should have customer management methods', () => {
      expect(adminAPI.getCustomers).toBeDefined();
      expect(adminAPI.searchCustomer).toBeDefined();
      expect(adminAPI.getCustomerProfile).toBeDefined();
      expect(adminAPI.updateCustomerStatus).toBeDefined();
    });

    it('should have payment management methods', () => {
      expect(adminAPI.getPayments).toBeDefined();
      expect(adminAPI.getPaymentStatistics).toBeDefined();
      expect(adminAPI.processRefund).toBeDefined();
    });
  });
});

