import apiClient from './client';

export const adminAPI = {
  // Dashboard
  getDashboard: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },

  // User Management
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await apiClient.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  // Package Management
  getPackages: async () => {
    const response = await apiClient.get('/packages');
    return response.data;
  },

  createPackage: async (packageData) => {
    const response = await apiClient.post('/admin/packages', packageData);
    return response.data;
  },

  updatePackage: async (packageId, packageData) => {
    const response = await apiClient.put(`/admin/packages/${packageId}`, packageData);
    return response.data;
  },

  deletePackage: async (packageId) => {
    const response = await apiClient.delete(`/admin/packages/${packageId}`);
    return response.data;
  },

  // Voucher Management
  generateVoucher: async (voucherData) => {
    const response = await apiClient.post('/admin/vouchers/generate', voucherData);
    return response.data;
  },

  generateBulkVouchers: async (bulkData) => {
    const response = await apiClient.post('/admin/vouchers/generate-bulk', bulkData);
    return response.data;
  },

  getVoucherStatistics: async () => {
    const response = await apiClient.get('/admin/vouchers/statistics');
    return response.data;
  },

  cleanupExpiredVouchers: async () => {
    const response = await apiClient.post('/admin/vouchers/cleanup');
    return response.data;
  },

  // Router Management
  getRouters: async () => {
    const response = await apiClient.get('/routers');
    return response.data;
  },

  getRouterStatus: async (routerId) => {
    const response = await apiClient.get(`/admin/mikrotik/routers/${routerId}/status`);
    return response.data;
  },

  getRouterUsers: async (routerId) => {
    const response = await apiClient.get(`/admin/mikrotik/routers/${routerId}/users`);
    return response.data;
  },

  rebootRouter: async (routerId) => {
    const response = await apiClient.post(`/admin/mikrotik/routers/${routerId}/reboot`);
    return response.data;
  },

  // Enhanced Router Management
  addRouter: async (routerData) => {
    const response = await apiClient.post('/admin/routers/add', routerData);
    return response.data;
  },

  updateRouter: async (routerId, routerData) => {
    const response = await apiClient.put(`/admin/routers/${routerId}`, routerData);
    return response.data;
  },

  deleteRouter: async (routerId) => {
    const response = await apiClient.delete(`/admin/routers/${routerId}`);
    return response.data;
  },

  testRouterConnection: async (routerId) => {
    const response = await apiClient.post(`/admin/routers/${routerId}/test`);
    return response.data;
  },

  configureRouter: async (routerId) => {
    const response = await apiClient.post(`/admin/routers/${routerId}/configure`);
    return response.data;
  },

  getRouterConfigScript: async (routerId) => {
    const response = await apiClient.get(`/admin/routers/${routerId}/config-script`);
    return response.data;
  },

  getRoutersByLocation: async (location) => {
    const response = await apiClient.get(`/admin/routers/location/${location}`);
    return response.data;
  },

  // Payment Management
  getPayments: async (params = {}) => {
    const response = await apiClient.get('/admin/payments', { params });
    return response.data;
  },

  getPaymentStatistics: async () => {
    const response = await apiClient.get('/admin/payments/statistics');
    return response.data;
  },

  processRefund: async (refundData) => {
    const response = await apiClient.post('/admin/payments/refund', refundData);
    return response.data;
  },

  // RADIUS Management
  getRadiusStatus: async () => {
    const response = await apiClient.get('/api/v1/radius/status');
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await apiClient.get('/api/v1/radius/sessions/active');
    return response.data;
  },

  disconnectUser: async (username, macAddress) => {
    const response = await apiClient.post(`/api/v1/radius/users/${username}/disconnect`, {
      macAddress
    });
    return response.data;
  },

  getRadiusStatistics: async () => {
    const response = await apiClient.get('/api/v1/radius/statistics');
    return response.data;
  },

  // Customer Management
  getCustomers: async (params = {}) => {
    const response = await apiClient.get('/customers', { params });
    return response.data;
  },

  searchCustomer: async (phoneNumber) => {
    const response = await apiClient.get('/admin/customers/search', {
      params: { phoneNumber }
    });
    return response.data;
  },

  getCustomerProfile: async (customerId) => {
    const response = await apiClient.get(`/admin/customers/${customerId}/profile`);
    return response.data;
  },

  updateCustomerStatus: async (customerId, status) => {
    const response = await apiClient.put(`/admin/customers/${customerId}/status`, { status });
    return response.data;
  },

  // Loyalty Management
  getLoyaltyStatistics: async () => {
    const response = await apiClient.get('/admin/loyalty/statistics');
    return response.data;
  },

  getHighValueCustomers: async (threshold = 100000) => {
    const response = await apiClient.get('/admin/loyalty/high-value-customers', {
      params: { threshold }
    });
    return response.data;
  },

  getVipCustomers: async () => {
    const response = await apiClient.get('/admin/loyalty/vip-customers');
    return response.data;
  },

  // Hotspot Billing
  getBillingSummary: async () => {
    const response = await apiClient.get('/admin/hotspot-billing/dashboard');
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await apiClient.get('/admin/hotspot-billing/sessions/active');
    return response.data;
  },

  disconnectSession: async (sessionId) => {
    const response = await apiClient.post(`/admin/hotspot-billing/sessions/${sessionId}/disconnect`);
    return response.data;
  },

  // System Status
  getSystemStatus: async () => {
    const response = await apiClient.get('/system/status');
    return response.data;
  },

  getSystemConfig: async () => {
    const response = await apiClient.get('/system/config');
    return response.data;
  }
};
