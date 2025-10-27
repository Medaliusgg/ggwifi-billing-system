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
  getAllVouchers: () => apiClient.get('/admin/vouchers'),
  getVoucherById: (voucherId) => apiClient.get(`/admin/vouchers/${voucherId}`),
  createVoucher: (voucherData) => apiClient.post('/admin/vouchers', voucherData),
  updateVoucher: (voucherId, voucherData) => apiClient.put(`/admin/vouchers/${voucherId}`, voucherData),
  deleteVoucher: (voucherId) => apiClient.delete(`/admin/vouchers/${voucherId}`),
  // Additional voucher operations
  getVoucherByCode: (code) => apiClient.get(`/admin/vouchers/code/${code}`),
};

// Router Management API
export const routerAPI = {
  getAllRouters: () => apiClient.get('/admin/routers'),
  getRouterStatus: () => apiClient.get('/admin/routers/status'),
  getRouterById: (routerId) => apiClient.get(`/admin/routers/${routerId}`),
  updateRouter: (routerId, routerData) => apiClient.put(`/admin/routers/${routerId}`, routerData),
  configureRouter: (routerId) => apiClient.post(`/admin/routers/${routerId}/configure`),
};

// RADIUS Management API
export const radiusAPI = {
  getHealth: () => apiClient.get('/radius/health'),
  getAllUsers: () => apiClient.get('/radius/users'),
  getUserByUsername: (username) => apiClient.get(`/radius/users/${username}`),
  createUser: (userData) => apiClient.post('/radius/users', userData),
  updateUser: (username, userData) => apiClient.put(`/radius/users/${username}`, userData),
  deleteUser: (username) => apiClient.delete(`/radius/users/${username}`),
  getActiveSessions: () => apiClient.get('/radius/sessions/active'),
  disconnectSession: (sessionData) => apiClient.post('/radius/sessions/disconnect', sessionData),
  getSessionById: (sessionId) => apiClient.get(`/radius/sessions/${sessionId}`),
  getSessionStatistics: () => apiClient.get('/radius/statistics'),
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
  getTransactionsByCustomer: (customerId) => apiClient.get(`/admin/transactions/customer/${customerId}`),
  getTransactionsByPayment: (paymentId) => apiClient.get(`/admin/transactions/payment/${paymentId}`),
  createTransaction: (transactionData) => apiClient.post('/admin/transactions', transactionData),
  updateTransaction: (transactionId, transactionData) => apiClient.put(`/admin/transactions/${transactionId}`, transactionData),
  getTransactionStatistics: () => apiClient.get('/admin/transactions/statistics'),
};

// Invoice Management API
export const invoiceAPI = {
  getAllInvoices: () => apiClient.get('/admin/invoices'),
  getInvoiceById: (invoiceId) => apiClient.get(`/admin/invoices/${invoiceId}`),
  getInvoicesByCustomer: (customerId) => apiClient.get(`/admin/invoices/customer/${customerId}`),
  createInvoice: (invoiceData) => apiClient.post('/admin/invoices', invoiceData),
  updateInvoice: (invoiceId, invoiceData) => apiClient.put(`/admin/invoices/${invoiceId}`, invoiceData),
  deleteInvoice: (invoiceId) => apiClient.delete(`/admin/invoices/${invoiceId}`),
  generateInvoice: (invoiceData) => apiClient.post('/admin/invoices/generate', invoiceData),
  downloadInvoice: (invoiceId) => apiClient.get(`/admin/invoices/${invoiceId}/download`, { responseType: 'blob' }),
  getInvoiceStatistics: () => apiClient.get('/admin/invoices/statistics'),
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

// Loyalty Management API - Not implemented in backend yet
export const loyaltyAPI = {
  // Placeholder - will be implemented in future
  getAllLoyaltyPrograms: () => Promise.resolve({ data: [] }),
  getLoyaltyProgramById: (programId) => Promise.resolve({ data: null }),
  createLoyaltyProgram: (programData) => Promise.reject({ message: 'Not implemented yet' }),
  updateLoyaltyProgram: (programId, programData) => Promise.reject({ message: 'Not implemented yet' }),
  deleteLoyaltyProgram: (programId) => Promise.reject({ message: 'Not implemented yet' }),
  getCustomerLoyalty: (customerId) => Promise.resolve({ data: null }),
  updateCustomerLoyalty: (customerId, loyaltyData) => Promise.reject({ message: 'Not implemented yet' }),
  getLoyaltyStatistics: () => Promise.resolve({ data: {} }),
};

// Dashboard API
export const dashboardAPI = {
  getSystemDashboard: () => apiClient.get('/admin/dashboard'),
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  getTechnicianDashboard: () => apiClient.get('/admin/dashboard/technician'),
  getFinanceDashboard: () => apiClient.get('/admin/dashboard/finance'),
  getMarketingDashboard: () => apiClient.get('/admin/dashboard/marketing'),
  getSystemHealth: () => apiClient.get('/admin/health'),
  getSystemMetrics: () => apiClient.get('/admin/metrics'),
  getRecentActivity: () => apiClient.get('/admin/activity'),
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

// Finance Management API - Use dashboard finance endpoint for now
export const financeAPI = {
  getFinancialReports: (params = {}) => apiClient.get('/admin/finance/reports', { params }),
  getRevenueStatistics: () => apiClient.get('/admin/dashboard/finance'),
  getExpenseStatistics: () => apiClient.get('/admin/dashboard/finance'),
  getProfitLossReport: (params = {}) => apiClient.get('/admin/dashboard/finance', { params }),
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