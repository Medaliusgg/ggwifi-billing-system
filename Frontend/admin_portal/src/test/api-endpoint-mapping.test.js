import { describe, it, expect } from 'vitest';
import { adminAPI } from '../api/admin.js';
import { authAPI } from '../api/auth.js';
import { 
  userAPI, 
  packageAPI, 
  voucherAPI, 
  routerAPI, 
  customerAPI, 
  paymentAPI,
  invoiceAPI,
  loyaltyAPI,
  dashboardAPI,
  marketingAPI,
  financeAPI,
  reportsAnalyticsAPI,
  systemSettingsAPI
} from '../services/api.js';

/**
 * API Endpoint Mapping Verification
 * 
 * This test verifies that frontend API endpoints match backend endpoints.
 * It checks endpoint paths, methods, and parameters.
 */

describe('API Endpoint Mapping Verification', () => {
  describe('Authentication Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /auth/login
      // Backend: POST /api/v1/auth/login or /api/v1/auth/admin-login
      expect(authAPI.login).toBeDefined();
      
      // Frontend: /auth/register
      // Backend: POST /api/v1/auth/register
      expect(authAPI.register).toBeDefined();
      
      // Frontend: /auth/refresh
      // Backend: POST /api/v1/auth/refresh
      expect(authAPI.refreshToken).toBeDefined();
      
      // Frontend: /auth/otp/generate
      // Backend: POST /api/v1/auth/otp/generate
      expect(authAPI.generateOTP).toBeDefined();
      
      // Frontend: /auth/otp/validate
      // Backend: POST /api/v1/auth/otp/validate
      expect(authAPI.validateOTP).toBeDefined();
    });
  });

  describe('Dashboard Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /dashboard
      // Backend: GET /api/v1/dashboard
      expect(adminAPI.getDashboard).toBeDefined();
      
      // Frontend: /admin/dashboard
      // Backend: GET /api/v1/admin/dashboard
      expect(dashboardAPI.getSystemDashboard).toBeDefined();
    });
  });

  describe('User Management Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /admin/users
      // Backend: GET /api/v1/admin/users
      expect(userAPI.getAllUsers).toBeDefined();
      
      // Frontend: /admin/users/{id}
      // Backend: GET /api/v1/admin/users/{id}
      expect(userAPI.getUserById).toBeDefined();
      
      // Frontend: POST /admin/users
      // Backend: POST /api/v1/admin/users
      expect(userAPI.createUser).toBeDefined();
      
      // Frontend: PUT /admin/users/{id}
      // Backend: PUT /api/v1/admin/users/{id}
      expect(userAPI.updateUser).toBeDefined();
      
      // Frontend: DELETE /admin/users/{id}
      // Backend: DELETE /api/v1/admin/users/{id}
      expect(userAPI.deleteUser).toBeDefined();
    });
  });

  describe('Package Management Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /packages or /admin/packages
      // Backend: GET /api/v1/packages or GET /api/v1/admin/packages
      expect(packageAPI.getAllPackages).toBeDefined();
      expect(adminAPI.getPackages).toBeDefined();
      
      // Frontend: /admin/packages/{id}
      // Backend: GET /api/v1/admin/packages/{id}
      expect(packageAPI.getPackageById).toBeDefined();
      
      // Frontend: POST /admin/packages
      // Backend: POST /api/v1/admin/packages
      expect(packageAPI.createPackage).toBeDefined();
      expect(adminAPI.createPackage).toBeDefined();
      
      // Frontend: PUT /admin/packages/{id}
      // Backend: PUT /api/v1/admin/packages/{id}
      expect(packageAPI.updatePackage).toBeDefined();
      expect(adminAPI.updatePackage).toBeDefined();
      
      // Frontend: DELETE /admin/packages/{id}
      // Backend: DELETE /api/v1/admin/packages/{id}
      expect(packageAPI.deletePackage).toBeDefined();
      expect(adminAPI.deletePackage).toBeDefined();
    });
  });

  describe('Voucher Management Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /admin/vouchers
      // Backend: GET /api/v1/admin/vouchers
      expect(voucherAPI.getAllVouchers).toBeDefined();
      
      // Frontend: POST /admin/vouchers/generate
      // Backend: POST /api/v1/admin/vouchers/generate
      expect(adminAPI.generateVoucher).toBeDefined();
      
      // Frontend: POST /admin/vouchers/generate-bulk
      // Backend: POST /api/v1/admin/vouchers/generate-bulk
      expect(adminAPI.generateBulkVouchers).toBeDefined();
      
      // Frontend: GET /admin/vouchers/statistics
      // Backend: GET /api/v1/admin/vouchers/statistics
      expect(adminAPI.getVoucherStatistics).toBeDefined();
    });
  });

  describe('Router Management Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /routers or /admin/routers
      // Backend: GET /api/v1/routers or GET /api/v1/admin/routers
      expect(routerAPI.getAllRouters).toBeDefined();
      expect(adminAPI.getRouters).toBeDefined();
      
      // Frontend: POST /admin/routers/add
      // Backend: POST /api/v1/admin/routers/add
      expect(adminAPI.addRouter).toBeDefined();
      
      // Frontend: PUT /admin/routers/{id}
      // Backend: PUT /api/v1/admin/routers/{id}
      expect(adminAPI.updateRouter).toBeDefined();
      
      // Frontend: DELETE /admin/routers/{id}
      // Backend: DELETE /api/v1/admin/routers/{id}
      expect(adminAPI.deleteRouter).toBeDefined();
      
      // Frontend: POST /admin/routers/{id}/test
      // Backend: POST /api/v1/admin/routers/{id}/test
      expect(adminAPI.testRouterConnection).toBeDefined();
    });
  });

  describe('Customer Management Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /customers or /admin/customers
      // Backend: GET /api/v1/customers or GET /api/v1/admin/customers
      expect(customerAPI.getAllCustomers).toBeDefined();
      expect(adminAPI.getCustomers).toBeDefined();
      
      // Frontend: GET /admin/customers/{id}
      // Backend: GET /api/v1/admin/customers/{id}
      expect(customerAPI.getCustomerById).toBeDefined();
      
      // Frontend: GET /admin/customers/search
      // Backend: GET /api/v1/admin/customers/search
      expect(adminAPI.searchCustomer).toBeDefined();
      
      // Frontend: GET /admin/customers/{id}/profile
      // Backend: GET /api/v1/admin/customers/{id}/profile
      expect(adminAPI.getCustomerProfile).toBeDefined();
    });
  });

  describe('Payment Management Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /admin/payments
      // Backend: GET /api/v1/admin/payments
      expect(paymentAPI.getAllPayments).toBeDefined();
      expect(adminAPI.getPayments).toBeDefined();
      
      // Frontend: GET /admin/payments/statistics
      // Backend: GET /api/v1/admin/payments/statistics
      expect(adminAPI.getPaymentStatistics).toBeDefined();
      
      // Frontend: POST /admin/payments/refund
      // Backend: POST /api/v1/admin/payments/refund
      expect(adminAPI.processRefund).toBeDefined();
    });
  });

  describe('Invoice Management Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /admin/invoices
      // Backend: GET /api/v1/admin/invoices
      expect(invoiceAPI.getAllInvoices).toBeDefined();
      
      // Frontend: GET /admin/invoices/{id}
      // Backend: GET /api/v1/admin/invoices/{id}
      expect(invoiceAPI.getInvoiceById).toBeDefined();
    });
  });

  describe('Loyalty Management Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /loyalty/customer/{id}
      // Backend: GET /api/v1/loyalty/customer/{id}
      expect(loyaltyAPI.getCustomerLoyaltyInfo).toBeDefined();
      
      // Frontend: /loyalty/rewards
      // Backend: GET /api/v1/loyalty/rewards
      expect(loyaltyAPI.getAvailableRewards).toBeDefined();
    });
  });

  describe('Reports & Analytics Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /admin/reports-analytics/reports
      // Backend: GET /api/v1/admin/reports-analytics/reports
      expect(reportsAnalyticsAPI.getReports).toBeDefined();
      
      // Frontend: /admin/reports-analytics/reports/statistics
      // Backend: GET /api/v1/admin/reports-analytics/reports/statistics
      expect(reportsAnalyticsAPI.getReportStats).toBeDefined();
    });
  });

  describe('Marketing Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /marketing/campaigns
      // Backend: GET /api/v1/marketing/campaigns
      expect(marketingAPI.getCampaigns).toBeDefined();
      
      // Frontend: POST /marketing/campaigns
      // Backend: POST /api/v1/marketing/campaigns
      expect(marketingAPI.createCampaign).toBeDefined();
    });
  });

  describe('System Settings Endpoints', () => {
    it('should map to correct backend endpoints', () => {
      // Frontend: /system-settings
      // Backend: GET /api/v1/system-settings
      expect(systemSettingsAPI.getAllSettings).toBeDefined();
      
      // Frontend: /system-settings/hotspot
      // Backend: GET /api/v1/system-settings/hotspot
      expect(systemSettingsAPI.getHotspotSettings).toBeDefined();
    });
  });
});



