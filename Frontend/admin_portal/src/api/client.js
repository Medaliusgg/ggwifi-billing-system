import axios from 'axios';
import useAuthStore from '/src/store/authStore.js';

// Create axios instance - prefer explicit envs, then prod default for Cloudflare, else localhost
const resolvedBaseURL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location?.host?.includes('ggwifi.co.tz')
    ? 'https://api.ggwifi.co.tz/api/v1'
    : 'http://localhost:8080/api/v1')
);
console.log('🔍 Debug: API Base URL configured as:', resolvedBaseURL);

const apiClient = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log('🔍 Debug: Making API request to:', config.baseURL + config.url);
    console.log('🔍 Debug: Request config:', config);
    
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling, token refresh and structured logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('🔍 Debug: API response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url;
    const method = originalRequest?.method;
    const data = error.response?.data;

    // Structured client-side logging for easier backend error visibility during debugging
    console.error('[GGWIFI API ERROR]', {
      method,
      url,
      status,
      message: error.message,
      response: data,
    });

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', {
            refreshToken: refreshToken
          });
          
          const { token, refreshToken: newRefreshToken } = response.data;
          useAuthStore.getState().setTokens(token, newRefreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
