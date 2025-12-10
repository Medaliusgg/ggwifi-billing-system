// System Settings API
export const systemSettingsAPI = {
  getAllSettings: () => apiClient.get('/system-settings'),
  getHotspotSettings: () => apiClient.get('/system-settings/hotspot'),
  setHotspotDomain: (domain) => apiClient.post('/system-settings/hotspot/domain', null, { params: { domain } }),
  getApiKeys: () => apiClient.get('/system-settings/api-keys'),
  setApiKey: (service, key) => apiClient.post(`/system-settings/api-keys/${service}`, null, { params: { key } }),
  getNotificationTemplates: () => apiClient.get('/system-settings/notifications'),
  setNotificationTemplate: (type, template) => apiClient.post(`/system-settings/notifications/${type}`, null, { params: { template } }),
  getVoucherSettings: () => apiClient.get('/system-settings/voucher'),
  getLoyaltySettings: () => apiClient.get('/system-settings/loyalty'),
  getBrandingSettings: () => apiClient.get('/system-settings/branding'),
  setBrandingSetting: (key, value) => apiClient.post(`/system-settings/branding/${key}`, null, { params: { value } }),
  getConfigValue: (key) => apiClient.get(`/system-settings/config/${key}`),
  setConfigValue: ({ key, value, description }) =>
    apiClient.post('/system-settings/config', null, {
      params: {
        key,
        value,
        description,
      },
    }),
};

// Reports & Analytics API
export const reportsAnalyticsAPI = {
  getReportStats: () => apiClient.get('/admin/reports-analytics/reports/statistics'),
  getReports: (params = {}) => apiClient.get('/admin/reports-analytics/reports', { params }),
  createReport: (payload) => apiClient.post('/admin/reports-analytics/reports', payload),
  updateReport: (reportId, payload) => apiClient.put(`/admin/reports-analytics/reports/${reportId}`, payload),
  deleteReport: (reportId) => apiClient.delete(`/admin/reports-analytics/reports/${reportId}`),
  generateFinancialReport: (params) =>
    apiClient.get('/admin/reports-analytics/reports/generate/financial', { params }),
  generateCustomerReport: (params) =>
    apiClient.get('/admin/reports-analytics/reports/generate/customer', { params }),
  generateNetworkReport: () => apiClient.get('/admin/reports-analytics/reports/generate/network'),
  generateSalesReport: (params) =>
    apiClient.get('/admin/reports-analytics/reports/generate/sales', { params }),
  getUsagePerPlan: (params = {}) => apiClient.get('/admin/reports-analytics/usage-per-plan', { params }),
  getTopCustomersUsage: (params = {}) => apiClient.get('/admin/reports-analytics/top-customers-usage', { params }),
  getRouterUptime: () => apiClient.get('/admin/reports-analytics/router-uptime'),
  getSessionDurationDistribution: () =>
    apiClient.get('/admin/reports-analytics/session-duration-distribution'),
  getPeakUsageTimes: () => apiClient.get('/admin/reports-analytics/peak-usage-times'),
  getFailedLoginTrends: () => apiClient.get('/admin/reports-analytics/failed-login-trends'),
  getDeviceTypeDistribution: () => apiClient.get('/admin/reports-analytics/device-type-distribution'),
};
import axios from 'axios';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location?.host?.includes('ggwifi.co.tz')
    ? 'https://api.ggwifi.co.tz/api/v1'
    : 'http://localhost:8080/api/v1')
);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  adminLogin: (credentials) => apiClient.post('/auth/admin-login', credentials),
  staffLogin: (credentials) => apiClient.post('/auth/staff-login', credentials),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
  revokeToken: (token) => apiClient.post('/auth/revoke-token', { token }),
  requestPasswordReset: (email) => apiClient.post('/auth/request-password-reset', { email }),
  resetPassword: (token, newPassword) => apiClient.post('/auth/reset-password', { token, newPassword }),
  changePassword: (oldPassword, newPassword) => apiClient.post('/auth/change-password', { oldPassword, newPassword }),
  generateOtp: (phoneNumber) => apiClient.post('/auth/otp/generate', { phoneNumber }),
  validateOtp: (data) => apiClient.post('/auth/otp/validate', data),
  resendOtp: (phoneNumber) => apiClient.post('/auth/otp/resend', { phoneNumber }),
  register: (userData) => apiClient.post('/auth/register', userData),
};

// User Management API
export const userAPI = {
  getAllUsers: (params = {}) => apiClient.get('/admin/users', { params }),
  getUserById: (userId) => apiClient.get(`/admin/users/${userId}`),
  createUser: (userData) => apiClient.post('/admin/users', userData),
  updateUser: (userId, userData) => apiClient.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
};

// Package Management API
export const packageAPI = {
  getAllPackages: (params = {}) => apiClient.get('/admin/packages', { params }),
  getPackageById: (packageId) => apiClient.get(`/admin/packages/${packageId}`),
  createPackage: (packageData) => apiClient.post('/admin/packages', packageData),
  updatePackage: (packageId, packageData) => apiClient.put(`/admin/packages/${packageId}`, packageData),
  deletePackage: (packageId) => apiClient.delete(`/admin/packages/${packageId}`),
  getPackagesByType: (type) => apiClient.get(`/admin/packages/type/${type}`),
};

// Voucher Management API
export const voucherAPI = {
  getAllVouchers: () => apiClient.get('/admin/vouchers'),
  getVoucherById: (voucherId) => apiClient.get(`/admin/vouchers/${voucherId}`),
  createVoucher: (voucherData) => apiClient.post('/admin/vouchers', voucherData),
  updateVoucher: (voucherId, voucherData) => apiClient.put(`/admin/vouchers/${voucherId}`, voucherData),
  deleteVoucher: (voucherId) => apiClient.delete(`/admin/vouchers/${voucherId}`),
  createBulkVouchers: (bulkData) => apiClient.post('/admin/vouchers/bulk', bulkData),
  // Additional voucher operations
  getVoucherByCode: (code) => apiClient.get(`/admin/vouchers/code/${code}`),
};

// Router Management API
export const routerAPI = {
  getAllRouters: (params = {}) => apiClient.get('/admin/routers', { params }),
  getRouterById: (routerId) => apiClient.get(`/admin/routers/${routerId}`),
  getRouterStatus: () => apiClient.get('/admin/routers/status'),
  createRouter: (routerData) => apiClient.post('/admin/routers', routerData),
  updateRouter: (routerId, routerData) => apiClient.put(`/admin/routers/${routerId}`, routerData),
  deleteRouter: (routerId) => apiClient.delete(`/admin/routers/${routerId}`),
  testConnection: (routerId) => apiClient.post(`/admin/routers/${routerId}/test-connection`),
  syncRouter: (routerId) => apiClient.post(`/admin/routers/${routerId}/sync`),
  generateIntegrationScript: (routerId) => apiClient.get(`/admin/routers/${routerId}/integration-script`),
  getRouterHealth: (routerId) => apiClient.get(`/admin/routers/${routerId}/health`),
  // Technician routes
  configureRouter: (routerId) => apiClient.post(`/technician/routers/${routerId}/configure`),
};

// Session Management API
export const sessionAPI = {
  getActiveSessions: () => apiClient.get('/sessions/active'),
  terminateSession: (sessionId, reason) => apiClient.post(`/sessions/${sessionId}/terminate`, null, { params: { reason } }),
  terminateBulkSessions: (sessionIds, reason) => apiClient.post('/sessions/terminate-bulk', { sessionIds, reason }),
  extendSession: (sessionId, additionalMinutes) => apiClient.put(`/sessions/${sessionId}/extend`, null, { params: { additionalMinutes } }),
  getSessionById: (sessionId) => apiClient.get(`/sessions/${sessionId}`),
  getSessionStatistics: () => apiClient.get('/sessions/statistics'),
  getSessionHistory: (params = {}) => apiClient.get('/sessions/history', { params }),
};

// RADIUS Management API
export const radiusAPI = {
  getHealth: () => apiClient.get('/radius/health'),
  getStatistics: () => apiClient.get('/radius/statistics'),
  getActiveUsers: () => apiClient.get('/radius/users/active'),
  disconnectUser: (username, nasIp) => apiClient.post('/radius/disconnect', { username, nasIp }),
};

// Payment Management API
export const paymentAPI = {
  getAllPayments: () => apiClient.get('/admin/payments'),
  getPaymentById: (paymentId) => apiClient.get(`/admin/payments/${paymentId}`),
  createPayment: (paymentData) => apiClient.post('/admin/payments', paymentData),
  updatePayment: (paymentId, paymentData) => apiClient.put(`/admin/payments/${paymentId}`, paymentData),
  getPaymentsByPhoneNumber: (phoneNumber) => apiClient.get(`/admin/payments/phone/${phoneNumber}`),
};

// Transaction Management API
export const transactionAPI = {
  getAllTransactions: () => apiClient.get('/admin/transactions'),
  getTransactionById: (transactionId) => apiClient.get(`/admin/transactions/${transactionId}`),
  getTransactionsByPhone: (phoneNumber) => apiClient.get(`/admin/transactions/phone/${phoneNumber}`),
  getTransactionsByStatus: (status) => apiClient.get(`/admin/transactions/status/${status}`),
  getTransactionStatistics: () => apiClient.get('/admin/transactions/statistics'),
};

// Invoice Management API
export const invoiceAPI = {
  getAllInvoices: () => apiClient.get('/admin/invoices'),
  getInvoiceById: (invoiceId) => apiClient.get(`/admin/invoices/${invoiceId}`),
  getInvoiceByNumber: (invoiceNumber) => apiClient.get(`/admin/invoices/number/${invoiceNumber}`),
  getInvoicesByCustomer: (customerId) => apiClient.get(`/admin/invoices/customer/${customerId}`),
  getInvoicesByStatus: (status) => apiClient.get(`/admin/invoices/status/${status}`),
  getPaidInvoices: () => apiClient.get('/admin/invoices/paid'),
  getUnpaidInvoices: () => apiClient.get('/admin/invoices/unpaid'),
  getInvoiceStatistics: () => apiClient.get('/admin/invoices/statistics'),
};

// Customer Management API
export const customerAPI = {
  getAllCustomers: (params = {}) => apiClient.get('/admin/customers', { params }),
  getCustomerById: (customerId) => apiClient.get(`/admin/customers/${customerId}`),
  getCustomerByPhone: (phoneNumber) => apiClient.get(`/admin/customers/phone/${phoneNumber}`),
  getCustomerByEmail: (email) => apiClient.get(`/admin/customers/email/${email}`),
  getActiveCustomers: () => apiClient.get('/admin/customers/active'),
  getCustomerStatistics: () => apiClient.get('/admin/customers/statistics'),
  createCustomer: (customerData) => apiClient.post('/admin/customers', customerData),
  updateCustomer: (customerId, customerData) => apiClient.put(`/admin/customers/${customerId}`, customerData),
  deleteCustomer: (customerId) => apiClient.delete(`/admin/customers/${customerId}`),
};

// Loyalty Management API
export const loyaltyAPI = {
  getCustomerSnapshotByPhone: (phoneNumber) => apiClient.get(`/loyalty/customer/phone/${phoneNumber}/snapshot`),
  getCustomerLoyaltyInfo: (customerId) => apiClient.get(`/loyalty/customer/${customerId}`),
  getCustomerRewards: (customerId) => apiClient.get(`/loyalty/customer/${customerId}/rewards`),
  redeemReward: (customerId, rewardId) => apiClient.post(`/loyalty/customer/${customerId}/redeem/${rewardId}`),
  redeemRewardWithDelivery: (customerId, payload) => apiClient.post(`/loyalty/customer/${customerId}/redeem`, payload),
  getCustomerProgress: (customerId) => apiClient.get(`/loyalty/customer/${customerId}/progress`),
  getCustomerProgressByPhone: (phoneNumber) => apiClient.get(`/loyalty/progress/${phoneNumber}`),
  getTransactionHistory: (customerId) => apiClient.get(`/loyalty/customer/${customerId}/transactions`),
  getRedemptionHistory: (customerId) => apiClient.get(`/loyalty/customer/${customerId}/redemptions`),
  getCustomerSnapshot: (phoneNumber) => apiClient.get(`/loyalty/customer/phone/${phoneNumber}/snapshot`),
  getAllRewards: (params = {}) => apiClient.get('/loyalty/rewards/all', { params }),
  getAvailableRewards: (params = {}) => apiClient.get('/loyalty/rewards', { params }),
  getRewardById: (rewardId) => apiClient.get(`/loyalty/rewards/${rewardId}`),
  createReward: (reward) => apiClient.post('/loyalty/rewards', reward),
  updateReward: (rewardId, reward) => apiClient.put(`/loyalty/rewards/${rewardId}`, reward),
  deleteReward: (rewardId) => apiClient.delete(`/loyalty/rewards/${rewardId}`),
  getTopCustomers: (limit = 10) => apiClient.get('/loyalty/top-customers', { params: { limit } }),
  getRedemptions: (params = {}) => apiClient.get('/loyalty/redemptions', { params }),
  getPendingRedemptions: (params = {}) => apiClient.get('/loyalty/redemptions/pending', { params }),
  approveRedemption: (redemptionId, technicianAssigned) =>
    apiClient.post(`/loyalty/redemptions/${redemptionId}/approve`, null, {
      params: technicianAssigned ? { technicianAssigned } : {},
    }),
  markRedemptionDelivered: (redemptionId) => apiClient.post(`/loyalty/redemptions/${redemptionId}/deliver`),
  rejectRedemption: (redemptionId, reason) =>
    apiClient.post(`/loyalty/redemptions/${redemptionId}/reject`, { reason }),
  getPointRules: () => apiClient.get('/loyalty/point-rules'),
  savePointRule: (rule) => apiClient.post('/loyalty/point-rules', rule),
  deletePointRule: (ruleId) => apiClient.delete(`/loyalty/point-rules/${ruleId}`),
  getTierConfigs: (params = {}) => apiClient.get('/loyalty/tiers', { params }),
  saveTierConfig: (config) => apiClient.post('/loyalty/tiers', config),
  updateTierConfig: (tierId, config) => apiClient.put(`/loyalty/tiers/${tierId}`, config),
  deleteTierConfig: (tierId) => apiClient.delete(`/loyalty/tiers/${tierId}`),
  getInventory: (params = {}) => apiClient.get('/loyalty/inventory', { params }),
  upsertInventory: (payload) => apiClient.post('/loyalty/inventory', payload),
};

// Dashboard API
export const dashboardAPI = {
  getDashboardMetrics: () => apiClient.get('/dashboard/metrics'),
  getSystemDashboard: () => apiClient.get('/admin/dashboard'),
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  getTechnicianDashboard: () => apiClient.get('/admin/dashboard/technician'),
  getFinanceDashboard: () => apiClient.get('/admin/dashboard/finance'),
  getMarketingDashboard: () => apiClient.get('/admin/dashboard/marketing'),
  getProfile: () => apiClient.get('/admin/profile'),
  getHealth: () => apiClient.get('/admin/health'),
};

// Application Management API - Not implemented in backend yet
export const applicationAPI = {
  getAllApplications: (params = {}) => Promise.resolve({ data: [] }),
  getApplicationById: (applicationId) => Promise.resolve({ data: null }),
  updateApplicationStatus: (applicationId, status) => Promise.reject({ message: 'Not implemented yet' }),
  approveApplication: (applicationId, approvalData) => Promise.reject({ message: 'Not implemented yet' }),
  rejectApplication: (applicationId, rejectionData) => Promise.reject({ message: 'Not implemented yet' }),
  getApplicationStatistics: () => Promise.resolve({ data: {} }),
};

// Finance Management API
export const financeAPI = {
  getOverview: () => apiClient.get('/admin/finance/overview'),
  getTransactions: () => apiClient.get('/admin/finance/transactions'),
  createTransaction: (payload) => apiClient.post('/admin/finance/transactions', payload),
  updateTransaction: (transactionId, payload) => apiClient.put(`/admin/finance/transactions/${transactionId}`, payload),
  deleteTransaction: (transactionId) => apiClient.delete(`/admin/finance/transactions/${transactionId}`),
  getBudgets: () => apiClient.get('/admin/finance/budgets'),
};

// Marketing Management API
export const marketingAPI = {
  // Admin Marketing Campaigns (CRUD)
  getAllCampaigns: () => apiClient.get('/admin/marketing/campaigns'),
  createCampaign: (campaignData) => apiClient.post('/admin/marketing/campaigns', campaignData),
  updateCampaign: (campaignId, campaignData) => apiClient.put(`/admin/marketing/campaigns/${campaignId}`, campaignData),
  deleteCampaign: (campaignId) => apiClient.delete(`/admin/marketing/campaigns/${campaignId}`),
  getCampaignById: (campaignId) => apiClient.get(`/admin/marketing/campaigns/${campaignId}`),
  
  // Marketing Automation (SMS, Segments, Templates)
  getCampaigns: () => apiClient.get('/marketing/campaigns'),
  sendCampaign: (campaignId) => apiClient.post(`/marketing/campaigns/${campaignId}/send`),
  processScheduledCampaigns: () => apiClient.post('/marketing/campaigns/process-scheduled'),
  getLogs: (campaignId) => apiClient.get('/marketing/logs', {
    params: campaignId ? { campaignId } : {},
  }),

  // Audience segments
  getSegments: () => apiClient.get('/marketing/segments'),
  saveSegment: (segment) => apiClient.post('/marketing/segments', segment),
  deleteSegment: (segmentId) => apiClient.delete(`/marketing/segments/${segmentId}`),

  // SMS templates
  getTemplates: () => apiClient.get('/marketing/templates'),
  saveTemplate: (template) => apiClient.post('/marketing/templates', template),
  deleteTemplate: (templateId) => apiClient.delete(`/marketing/templates/${templateId}`),

  // Portal media campaigns
  getMediaCampaigns: () => apiClient.get('/marketing/media'),
  saveMediaCampaign: (mediaCampaign) => apiClient.post('/marketing/media', mediaCampaign),
  getActiveMedia: (device = 'generic') => apiClient.get('/marketing/media/active', { params: { device } }),
  recordImpression: (payload) => apiClient.post('/marketing/media/impressions', payload),

  // Scheduler config
  getSchedules: () => apiClient.get('/marketing/schedules'),
  saveSchedule: (config) => apiClient.post('/marketing/schedules', config),
  pauseSchedule: (scheduleId) => apiClient.post(`/marketing/schedules/${scheduleId}/pause`),

  // Automation triggers
  getAutomationTriggers: () => apiClient.get('/marketing/automation'),
  saveAutomationTrigger: (trigger) => apiClient.post('/marketing/automation', trigger),
  deleteAutomationTrigger: (triggerId) => apiClient.delete(`/marketing/automation/${triggerId}`),
};

// Blog Management API
export const blogAPI = {
  getAllPosts: (params = {}) => apiClient.get('/admin/blog/posts', { params }),
  getPostById: (postId) => apiClient.get(`/admin/blog/posts/${postId}`),
  createPost: (postData) => apiClient.post('/admin/blog/posts', postData),
  updatePost: (postId, postData) => apiClient.put(`/admin/blog/posts/${postId}`, postData),
  deletePost: (postId) => apiClient.delete(`/admin/blog/posts/${postId}`),
  publishPost: (postId) => apiClient.post(`/admin/blog/posts/${postId}/publish`),
  unpublishPost: (postId) => apiClient.post(`/admin/blog/posts/${postId}/unpublish`),
};

// Location Management API
export const locationAPI = {
  getAllLocations: () => apiClient.get('/admin/locations'),
  getLocationById: (locationId) => apiClient.get(`/admin/locations/${locationId}`),
  createLocation: (locationData) => apiClient.post('/admin/locations', locationData),
  updateLocation: (locationId, locationData) => apiClient.put(`/admin/locations/${locationId}`, locationData),
  deleteLocation: (locationId) => apiClient.delete(`/admin/locations/${locationId}`),
  getLocationsByCity: (city) => apiClient.get(`/admin/locations/city/${city}`),
  checkCoverageAvailability: (locationData) => apiClient.post('/admin/locations/check-coverage', locationData),
};

// VPN Management API (Module J)
export const vpnAPI = {
  // VPN Peers
  getAllPeers: (params = {}) => apiClient.get('/admin/vpn/peers', { params }),
  getPeerDetails: (peerId) => apiClient.get(`/admin/vpn/peers/${peerId}`),
  createPeer: (peerData) => apiClient.post('/admin/vpn/peers', peerData),
  updatePeer: (peerId, peerData) => apiClient.put(`/admin/vpn/peers/${peerId}`, peerData),
  deletePeer: (peerId) => apiClient.delete(`/admin/vpn/peers/${peerId}`),
  revokePeer: (peerId) => apiClient.post(`/admin/vpn/peers/${peerId}/revoke`),
  
  // VPN Servers
  getAllServers: () => apiClient.get('/admin/vpn/servers'),
  getServerDetails: (serverId) => apiClient.get(`/admin/vpn/servers/${serverId}`),
  createServer: (serverData) => apiClient.post('/admin/vpn/servers', serverData),
  updateServer: (serverId, serverData) => apiClient.put(`/admin/vpn/servers/${serverId}`, serverData),
  updateServerStatus: (serverId, status) => apiClient.put(`/admin/vpn/servers/${serverId}/status`, null, { params: { status } }),
  deleteServer: (serverId) => apiClient.delete(`/admin/vpn/servers/${serverId}`),
  
  // VPN Statistics
  getStatistics: () => apiClient.get('/admin/vpn/statistics'),
  getPeerStatistics: (peerId) => apiClient.get(`/admin/vpn/peers/${peerId}/statistics`),
};

// VPN Provision API
export const vpnProvisionAPI = {
  generatePeerForRouter: (routerId) => apiClient.post(`/vpn/routers/${routerId}/generate-peer`),
  provisionRouter: (routerId) => apiClient.post(`/vpn/routers/${routerId}/provision`),
  getJobStatus: (jobId) => apiClient.get(`/vpn/jobs/${jobId}`),
};

// Audit Logs API
export const auditLogAPI = {
  getAuditLogs: (params = {}) => apiClient.get('/admin/audit-logs', { params }),
  getSecurityEvents: (hours = 24) => apiClient.get('/admin/audit-logs/security-events', { params: { hours } }),
  getAuditStatistics: (params = {}) => apiClient.get('/admin/audit-logs/statistics', { params }),
};

// System Logs API
export const systemLogAPI = {
  getApiLogs: (params = {}) => apiClient.get('/admin/system/logs/api', { params }),
  getRouterLogs: (params = {}) => apiClient.get('/admin/system/logs/router', { params }),
  getRadiusLogs: (params = {}) => apiClient.get('/admin/system/logs/radius', { params }),
  getLoginLogs: (params = {}) => apiClient.get('/admin/system/logs/login', { params }),
  getEmailSmsLogs: (params = {}) => apiClient.get('/admin/system/logs/email-sms', { params }),
  getErrorLogs: (params = {}) => apiClient.get('/admin/system/logs/error', { params }),
};

// Cache Management API
export const cacheAPI = {
  getCacheStatistics: () => apiClient.get('/admin/cache/statistics'),
  evictCache: (cacheName) => apiClient.delete(`/admin/cache/${cacheName}`),
  evictAllCaches: () => apiClient.delete('/admin/cache'),
  getCacheNames: () => apiClient.get('/admin/cache/names'),
};

// Two-Factor Authentication API
export const twoFactorAPI = {
  setup2FA: () => apiClient.post('/auth/2fa/setup'),
  enable2FA: (code) => apiClient.post('/auth/2fa/enable', { code }),
  verify2FA: (code) => apiClient.post('/auth/2fa/verify', { code }),
  disable2FA: (code) => apiClient.post('/auth/2fa/disable', { code }),
  get2FAStatus: () => apiClient.get('/auth/2fa/status'),
  generateBackupCodes: () => apiClient.post('/auth/2fa/backup-codes'),
};

// Voucher Batch API
export const voucherBatchAPI = {
  getAllBatches: (params = {}) => apiClient.get('/admin/voucher-batches', { params }),
  getBatchById: (batchId) => apiClient.get(`/admin/voucher-batches/${batchId}`),
  createBatch: (batchData) => apiClient.post('/admin/voucher-batches', batchData),
  updateBatch: (batchId, batchData) => apiClient.put(`/admin/voucher-batches/${batchId}`, batchData),
  deleteBatch: (batchId) => apiClient.delete(`/admin/voucher-batches/${batchId}`),
  generateVouchers: (batchId) => apiClient.post(`/admin/voucher-batches/${batchId}/generate`),
  getBatchStatistics: (batchId) => apiClient.get(`/admin/voucher-batches/${batchId}/statistics`),
};

// Product Management API (Loyalty Products)
export const productAPI = {
  getAllProducts: (params = {}) => apiClient.get('/admin/loyalty/products', { params }),
  getProductById: (productId) => apiClient.get(`/admin/loyalty/products/${productId}`),
  createProduct: (productData) => apiClient.post('/admin/loyalty/products', productData),
  updateProduct: (productId, productData) => apiClient.put(`/admin/loyalty/products/${productId}`, productData),
  deleteProduct: (productId) => apiClient.delete(`/admin/loyalty/products/${productId}`),
  updateProductStock: (productId, stock) => apiClient.put(`/admin/loyalty/products/${productId}/stock`, null, { params: { stock } }),
};

// Utility functions
export const utils = {
  setAuthToken: (token) => {
    localStorage.setItem('authToken', token);
  },
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },
  removeAuthToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
};

export default apiClient; 