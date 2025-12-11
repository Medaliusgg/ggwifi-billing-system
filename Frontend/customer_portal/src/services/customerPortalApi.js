import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ggwifi.co.tz/api/v1';

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
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
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
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const customerPortalAPI = {
  // Authentication
  login: async (credentials) => {
    const response = await apiClient.post('/customer-auth/login', credentials);
    return response;
  },

  sendOTP: async (data) => {
    const response = await apiClient.post('/customer-auth/request-otp', data);
    return response;
  },

  verifyOTP: async (data) => {
    const response = await apiClient.post('/customer-auth/verify-otp', data);
    return response;
  },

  signup: async (userData) => {
    const response = await apiClient.post('/customer-auth/signup', userData);
    return response;
  },

  // Marketing Campaigns
  getCampaigns: async () => {
    const response = await apiClient.get('/customer-portal/campaigns');
    return response;
  },

  // Packages
  getPackages: async () => {
    const response = await apiClient.get('/customer/packages');
    return response;
  },

  getPackageById: async (id) => {
    const response = await apiClient.get(`/customer/packages/${id}`);
    return response;
  },

  // Sessions
  getActiveSession: async () => {
    const response = await apiClient.get('/customer/sessions/active');
    return response;
  },

  getActiveSessions: async () => {
    const response = await apiClient.get('/customer/sessions/active');
    return response;
  },

  getSessionHistory: async () => {
    const response = await apiClient.get('/customer/sessions/history');
    return response;
  },

  disconnectSession: async (sessionId) => {
    const response = await apiClient.post(`/customer/sessions/${sessionId}/disconnect`);
    return response;
  },

  // Purchases
  getPurchaseHistory: async () => {
    const response = await apiClient.get('/customer/purchases');
    return response;
  },

  getPurchaseById: async (id) => {
    const response = await apiClient.get(`/customer/purchases/${id}`);
    return response;
  },

  // Loyalty & Rewards
  getLoyaltyAccount: async () => {
    const response = await apiClient.get('/customer/loyalty/account');
    return response;
  },

  getLoyaltyProducts: async () => {
    const response = await apiClient.get('/customer/loyalty/products');
    return response;
  },

  getLoyaltyProductById: async (id) => {
    const response = await apiClient.get(`/customer/loyalty/products/${id}`);
    return response;
  },

  redeemProduct: async (productId, data) => {
    const response = await apiClient.post(`/customer/loyalty/products/${productId}/redeem`, data);
    return response;
  },

  getRewardOrders: async () => {
    const response = await apiClient.get('/customer/loyalty/orders');
    return response;
  },

  // Voucher
  voucherLogin: async (voucherCode) => {
    const response = await apiClient.post('/customer-portal/voucher-login', { voucherCode });
    return response;
  },
};

export default customerPortalAPI;
