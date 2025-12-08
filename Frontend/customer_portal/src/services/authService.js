// Authentication Service for Customer Portal
// Handles signup, login, and PIN reset

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ggwifi.co.tz/api/v1';

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      headers: defaultHeaders,
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // ==================== SIGNUP ====================

  /**
   * Request OTP for signup
   */
  async requestSignupOTP(phoneNumber) {
    return this.makeRequest('/auth/signup/request-otp', {
      method: 'POST',
      body: { phoneNumber },
    });
  }

  /**
   * Verify OTP for signup
   */
  async verifySignupOTP(phoneNumber, otpCode) {
    return this.makeRequest('/auth/signup/verify-otp', {
      method: 'POST',
      body: { phoneNumber, otpCode },
    });
  }

  /**
   * Create account after OTP verification
   */
  async createAccount(accountData) {
    const response = await this.makeRequest('/auth/signup/create', {
      method: 'POST',
      body: accountData,
    });

    // Store tokens if account creation successful
    if (response.status === 'success' && response.token) {
      localStorage.setItem('authToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('customerRefreshToken', response.refreshToken);
      }
      if (response.customer) {
        localStorage.setItem('customer', JSON.stringify(response.customer));
      }
    }

    return response;
  }

  // ==================== LOGIN ====================

  /**
   * Login with PIN
   */
  async loginWithPin(phoneNumber, pin) {
    const response = await this.makeRequest('/customer-auth/login', {
      method: 'POST',
      body: { phoneNumber, pin },
    });

    // Store tokens if login successful
    if (response.status === 'success' && response.token) {
      localStorage.setItem('authToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('customerRefreshToken', response.refreshToken);
      }
      if (response.customer) {
        localStorage.setItem('customer', JSON.stringify(response.customer));
      }
    }

    return response;
  }

  // ==================== FORGOT PIN ====================

  /**
   * Request OTP for PIN reset
   */
  async requestPinResetOTP(phoneNumber) {
    return this.makeRequest('/auth/forgot-pin/request-otp', {
      method: 'POST',
      body: { phoneNumber },
    });
  }

  /**
   * Verify OTP for PIN reset
   */
  async verifyPinResetOTP(phoneNumber, otpCode) {
    return this.makeRequest('/auth/forgot-pin/verify-otp', {
      method: 'POST',
      body: { phoneNumber, otpCode },
    });
  }

  /**
   * Reset PIN after OTP verification
   */
  async resetPin(phoneNumber, newPin, confirmPin, resetToken) {
    const response = await this.makeRequest('/auth/forgot-pin/reset', {
      method: 'POST',
      body: { phoneNumber, newPin, confirmPin, resetToken },
    });

    // Store tokens if PIN reset successful
    if (response.status === 'success' && response.token) {
      localStorage.setItem('authToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('customerRefreshToken', response.refreshToken);
      }
      if (response.customer) {
        localStorage.setItem('customer', JSON.stringify(response.customer));
      }
    }

    return response;
  }

  // ==================== UTILITIES ====================

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get current customer data
   */
  getCurrentCustomer() {
    const customerStr = localStorage.getItem('customer');
    return customerStr ? JSON.parse(customerStr) : null;
  }

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('customerRefreshToken');
    localStorage.removeItem('customer');
    localStorage.removeItem('customerSession');
  }

  /**
   * Normalize phone number
   */
  normalizePhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    phoneNumber = phoneNumber.trim().replaceAll(/[^0-9+]/g, '');
    
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    } else if (phoneNumber.startsWith('255')) {
      return '+' + phoneNumber;
    } else if (phoneNumber.startsWith('0')) {
      return '+255' + phoneNumber.substring(1);
    } else {
      return '+255' + phoneNumber;
    }
  }
}

export default new AuthService();

