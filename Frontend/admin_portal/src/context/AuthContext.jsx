import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, utils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = utils.getAuthToken();
      const storedUser = utils.getUser();
      
      if (token && storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;
      
      if (response.data.success) {
        utils.setAuthToken(token);
        utils.setUser(userData);
        setUser(userData);
        return { success: true, user: userData };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    utils.removeAuthToken();
    setUser(null);
    setError(null);
    // Redirect to login page
    window.location.href = '/login';
  };

  // Generate OTP
  const generateOtp = async (phoneNumber) => {
    try {
      setError(null);
      const response = await authAPI.generateOtp(phoneNumber);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to generate OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Validate OTP
  const validateOtp = async (otpData) => {
    try {
      setError(null);
      const response = await authAPI.validateOtp(otpData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Invalid OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Resend OTP
  const resendOtp = async (phoneNumber) => {
    try {
      setError(null);
      const response = await authAPI.resendOtp(phoneNumber);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to resend OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Refresh token
  const refreshToken = async (token) => {
    try {
      const response = await authAPI.refreshToken(token);
      const { token: newToken, user: userData } = response.data;
      
      utils.setAuthToken(newToken);
      utils.setUser(userData);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      // If refresh fails, logout user
      logout();
      return { success: false, error: 'Session expired' };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!utils.getAuthToken();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Update user profile
  const updateUser = (userData) => {
    setUser(userData);
    utils.setUser(userData);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    generateOtp,
    validateOtp,
    resendOtp,
    register,
    refreshToken,
    hasRole,
    isAdmin,
    isAuthenticated,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 