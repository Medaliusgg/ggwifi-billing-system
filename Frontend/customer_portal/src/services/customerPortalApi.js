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
    // Backend expects phoneNumber and pin (not phone and password)
    const response = await apiClient.post('/customer-auth/login', {
      phoneNumber: credentials.phone || credentials.phoneNumber,
      pin: credentials.pin || credentials.password,
    });
    return response;
  },

  sendOTP: async (phoneNumber) => {
    // Backend expects phoneNumber in request body
    const response = await apiClient.post('/customer-auth/request-otp', {
      phoneNumber: phoneNumber,
    });
    return response;
  },

  verifyOTP: async (phoneNumber, otpCode) => {
    // Backend expects phoneNumber and otpCode
    const response = await apiClient.post('/customer-auth/verify-otp', {
      phoneNumber: phoneNumber,
      otpCode: otpCode,
    });
    return response;
  },

  // Signup flow (different endpoints)
  signupRequestOTP: async (phoneNumber) => {
    const response = await apiClient.post('/auth/signup/request-otp', {
      phoneNumber: phoneNumber,
    });
    return response;
  },

  signupVerifyOTP: async (phoneNumber, otpCode) => {
    const response = await apiClient.post('/auth/signup/verify-otp', {
      phoneNumber: phoneNumber,
      otpCode: otpCode,
    });
    return response;
  },

  signupCreate: async (userData) => {
    // Backend expects: phoneNumber, fullName, email, pin, confirmPin, referralCode, signupToken
    const response = await apiClient.post('/auth/signup/create', {
      phoneNumber: userData.phone || userData.phoneNumber,
      fullName: userData.fullName || `${userData.firstName} ${userData.lastName}`.trim(),
      email: userData.email || null,
      pin: userData.pin || userData.password,
      confirmPin: userData.confirmPin || userData.password,
      referralCode: userData.referralCode || null,
      signupToken: userData.signupToken || null,
    });
    return response;
  },

  // Marketing Campaigns
  getCampaigns: async () => {
    const response = await apiClient.get('/customer-portal/marketing/campaigns');
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

  // Phone Verification (for buying packages without login)
  checkPhone: async (phoneNumber) => {
    const response = await apiClient.post('/customer/check-phone', { phoneNumber });
    return response;
  },
};

export default customerPortalAPI;
