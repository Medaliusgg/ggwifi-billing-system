import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
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

// Customer OTP Authentication API (Customer Portal)
export const customerAuthAPI = {
  requestOtp: ({ phoneNumber }) => apiClient.post('/customer-auth/request-otp', { phoneNumber }),
  verifyOtp: (data) => apiClient.post('/customer-auth/verify-otp', data),
  refreshToken: (data) => apiClient.post('/customer-auth/refresh', data),
};

// Package Discovery API
export const packageAPI = {
  getHotspotPackages: (params = {}) => apiClient.get('/customer/packages/hotspot', { params }),
  getPopularHotspotPackages: () => apiClient.get('/customer/packages/hotspot/popular'),
  getPackageById: (packageId) => apiClient.get(`/customer/packages/${packageId}`),
  getPackagesByType: (type) => apiClient.get(`/customer/packages/type/${type}`),
};

// Voucher Management API
export const voucherAPI = {
  validateVoucher: (voucherData) => apiClient.post('/customer/vouchers/validate', voucherData),
  activateVoucher: (voucherData) => apiClient.post('/customer/vouchers/activate', voucherData),
  purchaseVoucher: (purchaseData) => apiClient.post('/customer/vouchers/purchase', purchaseData),
  getVoucherHistory: (phoneNumber, params = {}) => apiClient.get('/customer/vouchers/history', { 
    params: { phoneNumber, ...params } 
  }),
  getVoucherById: (voucherId) => apiClient.get(`/customer/vouchers/${voucherId}`),
  getVoucherStatus: (voucherCode) => apiClient.get(`/customer/vouchers/${voucherCode}/status`),
};

// Session Management API
export const sessionAPI = {
  getActiveSessions: (phoneNumber) => apiClient.get('/customer/sessions/active', { 
    params: { phoneNumber } 
  }),
  disconnectSession: (sessionData) => apiClient.post('/customer/sessions/disconnect', sessionData),
  getSessionById: (sessionId) => apiClient.get(`/customer/sessions/${sessionId}`),
  getSessionStatistics: (phoneNumber) => apiClient.get('/customer/sessions/statistics', { 
    params: { phoneNumber } 
  }),
};

// Payment Management API
export const paymentAPI = {
  getPaymentHistory: (phoneNumber, params = {}) => apiClient.get('/customer/payments/history', { 
    params: { phoneNumber, ...params } 
  }),
  getPaymentMethods: () => apiClient.get('/customer/payment-methods'),
  verifyPayment: (transactionId) => apiClient.get(`/customer/payments/verify/${transactionId}`),
  getPaymentById: (paymentId) => apiClient.get(`/customer/payments/${paymentId}`),
  initiatePayment: (paymentData) => apiClient.post('/customer/payments/initiate', paymentData),
  getPaymentStatistics: (phoneNumber) => apiClient.get('/customer/payments/statistics', { 
    params: { phoneNumber } 
  }),
};

// User Profile API
export const profileAPI = {
  getUserProfile: (phoneNumber) => apiClient.get('/customer/profile', { 
    params: { phoneNumber } 
  }),
  updateUserProfile: (profileData) => apiClient.put('/customer/profile', profileData),
  updateProfilePicture: (phoneNumber, imageData) => apiClient.put(`/customer/profile/${phoneNumber}/picture`, imageData),
  changePassword: (passwordData) => apiClient.put('/customer/profile/password', passwordData),
  getProfileStatistics: (phoneNumber) => apiClient.get('/customer/profile/statistics', { 
    params: { phoneNumber } 
  }),
};

// System Status API
export const systemAPI = {
  getSystemStatus: () => apiClient.get('/customer/status'),
  getSystemHealth: () => apiClient.get('/customer/health'),
  getSystemMetrics: () => apiClient.get('/customer/metrics'),
  getServiceAvailability: () => apiClient.get('/customer/availability'),
};

// Loyalty Program API
export const loyaltyAPI = {
  getLoyaltyStatus: (phoneNumber) => apiClient.get('/customer/loyalty/status', { 
    params: { phoneNumber } 
  }),
  getLoyaltyHistory: (phoneNumber, params = {}) => apiClient.get('/customer/loyalty/history', { 
    params: { phoneNumber, ...params } 
  }),
  redeemPoints: (redemptionData) => apiClient.post('/customer/loyalty/redeem', redemptionData),
  getAvailableRewards: () => apiClient.get('/customer/loyalty/rewards'),
  getLoyaltyTiers: () => apiClient.get('/customer/loyalty/tiers'),
};

// Notification API
export const notificationAPI = {
  getNotifications: (phoneNumber, params = {}) => apiClient.get('/customer/notifications', { 
    params: { phoneNumber, ...params } 
  }),
  markNotificationAsRead: (notificationId) => apiClient.put(`/customer/notifications/${notificationId}/read`),
  markAllNotificationsAsRead: (phoneNumber) => apiClient.put('/customer/notifications/read-all', { phoneNumber }),
  updateNotificationPreferences: (preferences) => apiClient.put('/customer/notifications/preferences', preferences),
  getNotificationPreferences: (phoneNumber) => apiClient.get('/customer/notifications/preferences', { 
    params: { phoneNumber } 
  }),
};

// Support & Feedback API
export const supportAPI = {
  submitTicket: (ticketData) => apiClient.post('/customer/support/tickets', ticketData),
  getTickets: (phoneNumber, params = {}) => apiClient.get('/customer/support/tickets', { 
    params: { phoneNumber, ...params } 
  }),
  getTicketById: (ticketId) => apiClient.get(`/customer/support/tickets/${ticketId}`),
  updateTicket: (ticketId, ticketData) => apiClient.put(`/customer/support/tickets/${ticketId}`, ticketData),
  submitFeedback: (feedbackData) => apiClient.post('/customer/support/feedback', feedbackData),
  getFAQ: () => apiClient.get('/customer/support/faq'),
  getSupportCategories: () => apiClient.get('/customer/support/categories'),
};

// Coverage & Location API
export const coverageAPI = {
  getCoverageAreas: () => apiClient.get('/customer/coverage/areas'),
  getCoverageByLocation: (locationData) => apiClient.post('/customer/coverage/check', locationData),
  getCoverageByCity: (city) => apiClient.get(`/customer/coverage/city/${city}`),
  getCoverageById: (coverageId) => apiClient.get(`/customer/coverage/${coverageId}`),
  getInstallationAvailability: (locationData) => apiClient.post('/customer/coverage/installation', locationData),
};

// Application Status API
export const applicationAPI = {
  getApplicationStatus: (applicationId) => apiClient.get(`/customer/applications/${applicationId}/status`),
  getApplicationHistory: (phoneNumber, params = {}) => apiClient.get('/customer/applications/history', { 
    params: { phoneNumber, ...params } 
  }),
  updateApplication: (applicationId, applicationData) => apiClient.put(`/customer/applications/${applicationId}`, applicationData),
  cancelApplication: (applicationId) => apiClient.post(`/customer/applications/${applicationId}/cancel`),
  getApplicationById: (applicationId) => apiClient.get(`/customer/applications/${applicationId}`),
};

// Usage Analytics API
export const analyticsAPI = {
  getUsageStatistics: (phoneNumber, params = {}) => apiClient.get('/customer/analytics/usage', { 
    params: { phoneNumber, ...params } 
  }),
  getDataUsage: (phoneNumber, params = {}) => apiClient.get('/customer/analytics/data-usage', { 
    params: { phoneNumber, ...params } 
  }),
  getSessionHistory: (phoneNumber, params = {}) => apiClient.get('/customer/analytics/sessions', { 
    params: { phoneNumber, ...params } 
  }),
  getSpendingAnalytics: (phoneNumber, params = {}) => apiClient.get('/customer/analytics/spending', { 
    params: { phoneNumber, ...params } 
  }),
  getLoyaltyAnalytics: (phoneNumber, params = {}) => apiClient.get('/customer/analytics/loyalty', { 
    params: { phoneNumber, ...params } 
  }),
};

// Public Information API
export const publicAPI = {
  getCompanyInfo: () => apiClient.get('/public/company-info'),
  getActivePackages: () => apiClient.get('/public/packages/active'),
  getPackagesByType: (type) => apiClient.get(`/public/packages/${type}`),
  getAllPackages: () => apiClient.get('/public/packages'),
  getPromotions: () => apiClient.get('/public/promotions'),
  getBlogPosts: (params = {}) => apiClient.get('/public/blog', { params }),
  getBlogPostById: (postId) => apiClient.get(`/public/blog/${postId}`),
  submitContactMessage: (messageData) => apiClient.post('/public/contact', messageData),
  submitFeedback: (feedbackData) => apiClient.post('/public/feedback', feedbackData),
  submitApplicationForm: (applicationData) => apiClient.post('/public/application', applicationData),
  getApplicationStatus: (applicationId) => apiClient.get(`/public/application/${applicationId}/status`),
  generateRegistrationOtp: (phoneNumber) => apiClient.post('/public/otp/generate', { phoneNumber }),
  validateRegistrationOtp: (otpData) => apiClient.post('/public/otp/validate', otpData),
  getAllCoverageAreas: () => apiClient.get('/public/coverage-areas'),
  getCoverageAreasByCity: (city) => apiClient.get(`/public/coverage-areas/city/${city}`),
  getCoverageAreaById: (id) => apiClient.get(`/public/coverage-areas/${id}`),
  checkCoverageAvailability: (locationData) => apiClient.post('/public/coverage-areas/check', locationData),
};

// SELCOM Payment Integration API
export const selcomAPI = {
  initiatePayment: (paymentData) => apiClient.post('/customer/selcom/initiate', paymentData),
  verifyPayment: (transactionId) => apiClient.get(`/customer/selcom/verify/${transactionId}`),
  getPaymentStatus: (transactionId) => apiClient.get(`/customer/selcom/status/${transactionId}`),
  getPaymentMethods: () => apiClient.get('/customer/selcom/methods'),
  getPaymentHistory: (phoneNumber, params = {}) => apiClient.get('/customer/selcom/history', { 
    params: { phoneNumber, ...params } 
  }),
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
  formatPhoneNumber: (phoneNumber) => {
    // Format phone number for display
    if (phoneNumber.startsWith('0')) {
      return phoneNumber;
    }
    if (phoneNumber.startsWith('+255')) {
      return '0' + phoneNumber.substring(4);
    }
    return phoneNumber;
  },
  formatCurrency: (amount, currency = 'TZS') => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
      currency: currency,
  }).format(amount);
  },
  formatDate: (date) => {
    return new Intl.DateTimeFormat('en-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },
  formatDuration: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  },
  formatDataUsage: (bytes) => {
    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;
    
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    } else {
      return `${mb.toFixed(2)} MB`;
    }
  },
};

export default apiClient; 