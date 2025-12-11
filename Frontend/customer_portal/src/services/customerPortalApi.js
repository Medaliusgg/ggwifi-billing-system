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
    // Handle network errors (CORS, connection issues)
    if (!error.response) {
      // Network error (CORS, timeout, connection refused)
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.error('Network Error:', {
          message: 'Unable to connect to the server. Please check your internet connection or try again later.',
          code: error.code,
          config: error.config?.url,
        });
        
        // Don't redirect on network errors for public routes
        const isPublicRoute = ['/customer-portal/packages', '/customer-portal/marketing/campaigns'].some(
          route => error.config?.url?.includes(route)
        );
        
        if (!isPublicRoute && error.config?.url?.includes('/customer-auth/login')) {
          // Only show error for login attempts
          return Promise.reject({
            ...error,
            isNetworkError: true,
            message: 'Unable to connect to the server. Please check your internet connection.',
          });
        }
        
        // For public routes, return empty data instead of error
        if (isPublicRoute) {
          return Promise.resolve({ data: null, isNetworkError: true });
        }
      }
      
      // Timeout error
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          ...error,
          isTimeoutError: true,
          message: 'Request timed out. Please try again.',
        });
      }
    }
    
    // Handle HTTP errors
    if (error.response) {
      // 401 Unauthorized - clear auth and redirect
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // 502 Bad Gateway - backend might be down
      if (error.response.status === 502) {
        console.error('Backend Error (502):', {
          message: 'The server is temporarily unavailable. Please try again later.',
          url: error.config?.url,
        });
        return Promise.reject({
          ...error,
          isBackendError: true,
          message: 'The server is temporarily unavailable. Please try again later.',
        });
      }
      
      // 503 Service Unavailable
      if (error.response.status === 503) {
        return Promise.reject({
          ...error,
          isServiceUnavailable: true,
          message: 'Service is temporarily unavailable. Please try again later.',
        });
      }
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
    const response = await apiClient.get('/customer-portal/packages');
    return response;
  },

  getPackageById: async (id) => {
    const response = await apiClient.get(`/customer-portal/packages/${id}`);
    return response;
  },

  // Sessions
  getActiveSession: async () => {
    const response = await apiClient.get('/customer-dashboard/sessions');
    return response;
  },

  getActiveSessions: async () => {
    const response = await apiClient.get('/customer-dashboard/sessions');
    return response;
  },

  getSessionHistory: async () => {
    const response = await apiClient.get('/customer-dashboard/sessions');
    return response;
  },

  disconnectSession: async (sessionId) => {
    const response = await apiClient.post(`/customer-dashboard/sessions/${sessionId}/disconnect`);
    return response;
  },

  // Purchases
  getPurchaseHistory: async () => {
    const response = await apiClient.get('/customer-dashboard/transactions');
    return response;
  },

  getPurchaseById: async (id) => {
    const response = await apiClient.get(`/customer-dashboard/transactions/${id}`);
    return response;
  },

  // Loyalty & Rewards
  getLoyaltyAccount: async () => {
    const response = await apiClient.get('/customer-dashboard/loyalty');
    return response;
  },

  getLoyaltyProducts: async () => {
    // This endpoint may need to be created - using placeholder
    const response = await apiClient.get('/customer-portal/rewards/products');
    return response;
  },

  getLoyaltyProductById: async (id) => {
    const response = await apiClient.get(`/customer-portal/rewards/products/${id}`);
    return response;
  },

  redeemProduct: async (productId, data) => {
    const response = await apiClient.post(`/customer-portal/rewards/products/${productId}/redeem`, data);
    return response;
  },

  getRewardOrders: async () => {
    const response = await apiClient.get('/customer-portal/rewards/orders');
    return response;
  },

  // Voucher
  voucherLogin: async (voucherCode) => {
    const response = await apiClient.post('/customer-portal/voucher-login', { voucherCode });
    return response;
  },

  // Phone Verification (for buying packages without login)
  checkPhone: async (phoneNumber) => {
    // Check if phone exists via user-management endpoint
    try {
      const response = await apiClient.get(`/user-management/profile/phone/${phoneNumber}`);
      return { data: { isRegistered: true, user: response.data } };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { isRegistered: false } };
      }
      throw error;
    }
  },

  // Customer Dashboard
  getCustomerDashboard: async (phoneNumber) => {
    const response = await apiClient.get('/customer-dashboard');
    return response;
  },

  getCustomerProfile: async (phoneNumber) => {
    const response = await apiClient.get('/customer-dashboard/profile');
    return response;
  },
};

export default customerPortalAPI;
