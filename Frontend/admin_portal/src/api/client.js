import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Create axios instance
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8082/api/v1';
console.log('🔍 Debug: API Base URL configured as:', baseURL);

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('🔍 Debug: API response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.log('🔍 Debug: API error:', error.message, error.code, error.config?.url);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
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
