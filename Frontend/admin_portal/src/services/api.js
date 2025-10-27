import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

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
  login: (credentials) => apiClient.post('/auth/login', credentials),
  generateOtp: (phoneNumber) => apiClient.post('/auth/otp/generate', { phoneNumber }),
  validateOtp: (data) => apiClient.post('/auth/otp/validate', data),
  resendOtp: (phoneNumber) => apiClient.post('/auth/otp/resend', { phoneNumber }),
  register: (userData) => apiClient.post('/auth/register', userData),
  refreshToken: (token) => apiClient.post('/auth/refresh', { token }),
};

// User Management API
export const userAPI = {
  getAllUsers: (params = {}) => apiClient.get('/admin/users', { params }),
  updateUserStatus: (userId, status) => apiClient.put(`/admin/users/${userId}/status`, { status }),
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
  generateVoucher: (voucherData) => apiClient.post('/admin/vouchers/generate', voucherData),
  generateBulkVouchers: (bulkData) => apiClient.post('/admin/vouchers/generate-bulk', bulkData),
  getVoucherStatistics: () => apiClient.get('/admin/vouchers/statistics'),
  cleanupExpiredVouchers: () => apiClient.post('/admin/vouchers/cleanup'),
  getVoucherById: (voucherId) => apiClient.get(`/admin/vouchers/${voucherId}`),
  updateVoucher: (voucherId, voucherData) => apiClient.put(`/admin/vouchers/${voucherId}`, voucherData),
  deleteVoucher: (voucherId) => apiClient.delete(`/admin/vouchers/${voucherId}`),
};

// Router Management API
export const routerAPI = {
  getAllRouters: () => apiClient.get('/admin/mikrotik/routers'),
  getRouterStatus: (routerId) => apiClient.get(`/admin/mikrotik/routers/${routerId}/status`),
  getRouterUsers: (routerId) => apiClient.get(`/admin/mikrotik/routers/${routerId}/users`),
  rebootRouter: (routerId) => apiClient.post(`/admin/mikrotik/routers/${routerId}/reboot`),
  getRouterById: (routerId) => apiClient.get(`/admin/mikrotik/routers/${routerId}`),
  updateRouter: (routerId, routerData) => apiClient.put(`/admin/mikrotik/routers/${routerId}`, routerData),
  testRouterConnection: (routerId) => apiClient.post(`/admin/mikrotik/routers/${routerId}/test`),
};

// RADIUS Management API
export const radiusAPI = {
  getActiveSessions: () => apiClient.get('/admin/radius/sessions'),
  disconnectUser: (userData) => apiClient.post('/admin/radius/disconnect', userData),
  getSessionStatistics: () => apiClient.get('/admin/radius/statistics'),
  getSessionById: (sessionId) => apiClient.get(`/admin/radius/sessions/${sessionId}`),
};

// Payment Management API
export const paymentAPI = {
  getAllPayments: (params = {}) => apiClient.get('/admin/payments', { params }),
  getPaymentStatistics: () => apiClient.get('/admin/payments/statistics'),
  processRefund: (refundData) => apiClient.post('/admin/payments/refund', refundData),
  getPaymentById: (paymentId) => apiClient.get(`/admin/payments/${paymentId}`),
  updatePaymentStatus: (paymentId, status) => apiClient.put(`/admin/payments/${paymentId}/status`, { status }),
};

// Customer Management API
export const customerAPI = {
  getAllCustomers: (params = {}) => apiClient.get('/admin/customers', { params }),
  getCustomerById: (customerId) => apiClient.get(`/admin/customers/${customerId}`),
  updateCustomerStatus: (customerId, status) => apiClient.put(`/admin/customers/${customerId}/status`, { status }),
  getCustomerProfile: (customerId) => apiClient.get(`/admin/customers/${customerId}/profile`),
  updateCustomerProfile: (customerId, profileData) => apiClient.put(`/admin/customers/${customerId}/profile`, profileData),
  getCustomerSessions: (customerId) => apiClient.get(`/admin/customers/${customerId}/sessions`),
  getCustomerPayments: (customerId) => apiClient.get(`/admin/customers/${customerId}/payments`),
};

// Loyalty Management API
export const loyaltyAPI = {
  getAllLoyaltyPrograms: () => apiClient.get('/admin/loyalty/programs'),
  getLoyaltyProgramById: (programId) => apiClient.get(`/admin/loyalty/programs/${programId}`),
  createLoyaltyProgram: (programData) => apiClient.post('/admin/loyalty/programs', programData),
  updateLoyaltyProgram: (programId, programData) => apiClient.put(`/admin/loyalty/programs/${programId}`, programData),
  deleteLoyaltyProgram: (programId) => apiClient.delete(`/admin/loyalty/programs/${programId}`),
  getCustomerLoyalty: (customerId) => apiClient.get(`/admin/loyalty/customers/${customerId}`),
  updateCustomerLoyalty: (customerId, loyaltyData) => apiClient.put(`/admin/loyalty/customers/${customerId}`, loyaltyData),
  getLoyaltyStatistics: () => apiClient.get('/admin/loyalty/statistics'),
};

// Dashboard API
export const dashboardAPI = {
  getSystemDashboard: () => apiClient.get('/admin/dashboard'),
  getSystemHealth: () => apiClient.get('/admin/health'),
  getSystemMetrics: () => apiClient.get('/admin/metrics'),
  getRecentActivity: () => apiClient.get('/admin/activity'),
};

// Application Management API
export const applicationAPI = {
  getAllApplications: (params = {}) => apiClient.get('/admin/applications', { params }),
  getApplicationById: (applicationId) => apiClient.get(`/admin/applications/${applicationId}`),
  updateApplicationStatus: (applicationId, status) => apiClient.put(`/admin/applications/${applicationId}/status`, { status }),
  approveApplication: (applicationId, approvalData) => apiClient.post(`/admin/applications/${applicationId}/approve`, approvalData),
  rejectApplication: (applicationId, rejectionData) => apiClient.post(`/admin/applications/${applicationId}/reject`, rejectionData),
  getApplicationStatistics: () => apiClient.get('/admin/applications/statistics'),
};

// Finance Management API
export const financeAPI = {
  getFinancialReports: (params = {}) => apiClient.get('/admin/finance/reports', { params }),
  getRevenueStatistics: () => apiClient.get('/admin/finance/revenue'),
  getExpenseStatistics: () => apiClient.get('/admin/finance/expenses'),
  getProfitLossReport: (params = {}) => apiClient.get('/admin/finance/profit-loss', { params }),
  createFinancialReport: (reportData) => apiClient.post('/admin/finance/reports', reportData),
  updateFinancialReport: (reportId, reportData) => apiClient.put(`/admin/finance/reports/${reportId}`, reportData),
};

// Marketing Management API
export const marketingAPI = {
  getAllCampaigns: () => apiClient.get('/admin/marketing/campaigns'),
  getCampaignById: (campaignId) => apiClient.get(`/admin/marketing/campaigns/${campaignId}`),
  createCampaign: (campaignData) => apiClient.post('/admin/marketing/campaigns', campaignData),
  updateCampaign: (campaignId, campaignData) => apiClient.put(`/admin/marketing/campaigns/${campaignId}`, campaignData),
  deleteCampaign: (campaignId) => apiClient.delete(`/admin/marketing/campaigns/${campaignId}`),
  sendCampaign: (campaignId) => apiClient.post(`/admin/marketing/campaigns/${campaignId}/send`),
  getCampaignStatistics: (campaignId) => apiClient.get(`/admin/marketing/campaigns/${campaignId}/statistics`),
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