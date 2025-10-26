// API Service for GG Wi-Fi Customer Portal
// Handles all backend API calls for voucher login and payment processing

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      console.log('🔍 API Request:', url, config);
      const response = await fetch(url, config);
      
      console.log('🔍 API Response Status:', response.status);
      console.log('🔍 API Response OK:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 API Response Data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Voucher Login API
  async voucherLogin(phoneNumber, voucherCode) {
    return this.makeRequest('/api/v1/customer-portal/voucher-login', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        voucherCode: voucherCode.toUpperCase(),
      }),
    });
  }

  // Payment Initiation API
  async initiatePayment(paymentData) {
    return this.makeRequest('/api/v1/customer-portal/payment', {
      method: 'POST',
      body: JSON.stringify({
        customerName: paymentData.customerName,
        phoneNumber: paymentData.phoneNumber,
        location: paymentData.location,
        packageId: paymentData.packageId,
        packageName: paymentData.packageName,
        amount: paymentData.amount,
        currency: paymentData.currency || 'TZS',
        paymentMethod: paymentData.paymentMethod || 'ZENOPAY',
        voucherCode: paymentData.voucherCode, // Include voucher code if provided
      }),
    });
  }

  // Payment Status Check API
  async checkPaymentStatus(orderId) {
    return this.makeRequest(`/api/v1/customer-portal/payment/status/${orderId}`, {
      method: 'GET',
    });
  }

  // Get Available Packages API
  async getPackages() {
    return this.makeRequest('/api/v1/customer-portal/packages', {
      method: 'GET',
    });
  }

  // Get Customer Dashboard Data
  async getCustomerDashboard(phoneNumber) {
    return this.makeRequest(`/api/v1/customer-portal/dashboard/${phoneNumber}`, {
      method: 'GET',
    });
  }

  // Get Active Sessions
  async getActiveSessions() {
    return this.makeRequest('/api/v1/customer-portal/sessions', {
      method: 'GET',
    });
  }

  // Get Coverage Areas
  async getCoverageAreas() {
    return this.makeRequest('/api/v1/customer-portal/coverage', {
      method: 'GET',
    });
  }

  // ZenoPay Webhook Handler (for testing)
  async handleZenoPayWebhook(webhookData) {
    return this.makeRequest('/api/v1/customer-portal/webhook/zenopay', {
      method: 'POST',
      body: JSON.stringify(webhookData),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  voucherLogin,
  initiatePayment,
  checkPaymentStatus,
  getPackages,
  getCustomerDashboard,
  getActiveSessions,
  getCoverageAreas,
  handleZenoPayWebhook,
} = apiService;





















