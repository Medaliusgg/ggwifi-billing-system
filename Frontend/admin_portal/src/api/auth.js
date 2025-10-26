import apiClient from './client.js';

export const authAPI = {
  // Login admin user
  login: async (credentials) => {
    console.log('🔍 Debug: authAPI.login called with:', credentials);
    console.log('🔍 Debug: Making POST request to /auth/login');
    const response = await apiClient.post('/auth/login', credentials);
    console.log('🔍 Debug: authAPI.login response:', response.data);
    return response.data;
  },

  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Generate OTP
  generateOTP: async (phoneNumber, type) => {
    const response = await apiClient.post('/auth/otp/generate', {
      phoneNumber,
      type
    });
    return response.data;
  },

  // Validate OTP
  validateOTP: async (phoneNumber, otpCode, type) => {
    const response = await apiClient.post('/auth/otp/validate', {
      phoneNumber,
      otpCode,
      type
    });
    return response.data;
  },

  // Resend OTP
  resendOTP: async (phoneNumber, type) => {
    const response = await apiClient.post('/auth/otp/resend', {
      phoneNumber,
      type
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', {
      refreshToken
    });
    return response.data;
  },

  // Logout (clear server-side session if needed)
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors, client-side cleanup is sufficient
      console.warn('Logout request failed:', error);
    }
  }
};
