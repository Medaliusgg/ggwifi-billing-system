import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axios before importing
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
    defaults: {
      baseURL: 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {},
    },
  };
  
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
    create: vi.fn(() => mockAxiosInstance),
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('Module: services/api.js', () => {
  describe('Analysis', () => {
    it('should export all API modules', async () => {
      const apiModule = await import('../../services/api.js');
      
      // Check main exports
      expect(apiModule.authAPI).toBeDefined();
      expect(apiModule.userAPI).toBeDefined();
      expect(apiModule.packageAPI).toBeDefined();
      expect(apiModule.voucherAPI).toBeDefined();
      expect(apiModule.routerAPI).toBeDefined();
      expect(apiModule.customerAPI).toBeDefined();
      expect(apiModule.paymentAPI).toBeDefined();
      expect(apiModule.invoiceAPI).toBeDefined();
      expect(apiModule.loyaltyAPI).toBeDefined();
      expect(apiModule.dashboardAPI).toBeDefined();
      expect(apiModule.marketingAPI).toBeDefined();
      expect(apiModule.financeAPI).toBeDefined();
      expect(apiModule.reportsAnalyticsAPI).toBeDefined();
      expect(apiModule.systemSettingsAPI).toBeDefined();
    });

    it('should have authAPI with all methods', async () => {
      const { authAPI } = await import('../../services/api.js');
      
      expect(authAPI.login).toBeDefined();
      expect(authAPI.generateOtp).toBeDefined();
      expect(authAPI.validateOtp).toBeDefined();
      expect(authAPI.resendOtp).toBeDefined();
      expect(authAPI.register).toBeDefined();
      expect(authAPI.refreshToken).toBeDefined();
    });

    it('should have userAPI with all methods', async () => {
      const { userAPI } = await import('../../services/api.js');
      
      expect(userAPI.getAllUsers).toBeDefined();
      expect(userAPI.getUserById).toBeDefined();
      expect(userAPI.createUser).toBeDefined();
      expect(userAPI.updateUser).toBeDefined();
      expect(userAPI.deleteUser).toBeDefined();
    });

    it('should have packageAPI with all methods', async () => {
      const { packageAPI } = await import('../../services/api.js');
      
      expect(packageAPI.getAllPackages).toBeDefined();
      expect(packageAPI.getPackageById).toBeDefined();
      expect(packageAPI.createPackage).toBeDefined();
      expect(packageAPI.updatePackage).toBeDefined();
      expect(packageAPI.deletePackage).toBeDefined();
    });

    it('should have voucherAPI with all methods', async () => {
      const { voucherAPI } = await import('../../services/api.js');
      
      expect(voucherAPI.getAllVouchers).toBeDefined();
      expect(voucherAPI.getVoucherById).toBeDefined();
      expect(voucherAPI.createVoucher).toBeDefined();
      expect(voucherAPI.createBulkVouchers).toBeDefined();
    });

    it('should have routerAPI with all methods', async () => {
      const { routerAPI } = await import('../../services/api.js');
      
      expect(routerAPI.getAllRouters).toBeDefined();
      expect(routerAPI.getRouterStatus).toBeDefined();
      expect(routerAPI.createRouter).toBeDefined();
      expect(routerAPI.updateRouter).toBeDefined();
      expect(routerAPI.deleteRouter).toBeDefined();
    });

    it('should have customerAPI with all methods', async () => {
      const { customerAPI } = await import('../../services/api.js');
      
      expect(customerAPI.getAllCustomers).toBeDefined();
      expect(customerAPI.getCustomerById).toBeDefined();
      expect(customerAPI.createCustomer).toBeDefined();
      expect(customerAPI.updateCustomer).toBeDefined();
    });

    it('should have paymentAPI with all methods', async () => {
      const { paymentAPI } = await import('../../services/api.js');
      
      expect(paymentAPI.getAllPayments).toBeDefined();
      expect(paymentAPI.getPaymentById).toBeDefined();
      expect(paymentAPI.createPayment).toBeDefined();
    });

    it('should have invoiceAPI with all methods', async () => {
      const { invoiceAPI } = await import('../../services/api.js');
      
      expect(invoiceAPI.getAllInvoices).toBeDefined();
      expect(invoiceAPI.getInvoiceById).toBeDefined();
      expect(invoiceAPI.getInvoiceByNumber).toBeDefined();
    });

    it('should have loyaltyAPI with all methods', async () => {
      const { loyaltyAPI } = await import('../../services/api.js');
      
      expect(loyaltyAPI.getCustomerLoyaltyInfo).toBeDefined();
      expect(loyaltyAPI.getAvailableRewards).toBeDefined();
      expect(loyaltyAPI.getAllRewards).toBeDefined();
      expect(loyaltyAPI.createReward).toBeDefined();
    });

    it('should have dashboardAPI with all methods', async () => {
      const { dashboardAPI } = await import('../../services/api.js');
      
      expect(dashboardAPI.getSystemDashboard).toBeDefined();
      expect(dashboardAPI.getDashboardStats).toBeDefined();
      expect(dashboardAPI.getTechnicianDashboard).toBeDefined();
      expect(dashboardAPI.getFinanceDashboard).toBeDefined();
    });

    it('should have marketingAPI with all methods', async () => {
      const { marketingAPI } = await import('../../services/api.js');
      
      expect(marketingAPI.getCampaigns).toBeDefined();
      expect(marketingAPI.createCampaign).toBeDefined();
      expect(marketingAPI.updateCampaign).toBeDefined();
      expect(marketingAPI.deleteCampaign).toBeDefined();
    });

    it('should have financeAPI with all methods', async () => {
      const { financeAPI } = await import('../../services/api.js');
      
      expect(financeAPI.getOverview).toBeDefined();
      expect(financeAPI.getTransactions).toBeDefined();
      expect(financeAPI.createTransaction).toBeDefined();
      expect(financeAPI.getBudgets).toBeDefined();
    });

    it('should have reportsAnalyticsAPI with all methods', async () => {
      const { reportsAnalyticsAPI } = await import('../../services/api.js');
      
      expect(reportsAnalyticsAPI.getReportStats).toBeDefined();
      expect(reportsAnalyticsAPI.getReports).toBeDefined();
      expect(reportsAnalyticsAPI.generateFinancialReport).toBeDefined();
      expect(reportsAnalyticsAPI.generateCustomerReport).toBeDefined();
    });

    it('should have systemSettingsAPI with all methods', async () => {
      const { systemSettingsAPI } = await import('../../services/api.js');
      
      expect(systemSettingsAPI.getAllSettings).toBeDefined();
      expect(systemSettingsAPI.getHotspotSettings).toBeDefined();
      expect(systemSettingsAPI.setHotspotDomain).toBeDefined();
      expect(systemSettingsAPI.getApiKeys).toBeDefined();
    });
  });

  describe('Inspection', () => {
    it('should have utility functions', async () => {
      const { utils } = await import('../../services/api.js');
      
      expect(utils).toBeDefined();
      expect(utils.setAuthToken).toBeDefined();
      expect(utils.getAuthToken).toBeDefined();
      expect(utils.removeAuthToken).toBeDefined();
      expect(utils.isAuthenticated).toBeDefined();
    });
  });
});

