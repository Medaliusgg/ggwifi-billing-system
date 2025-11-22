// API Service for GG Wi-Fi Customer Portal
// Handles all backend API calls for voucher login and payment processing

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

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
    return this.makeRequest('/customer-portal/voucher-login', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        voucherCode: voucherCode.toUpperCase(),
      }),
    });
  }

  // Payment Initiation API
  async initiatePayment(paymentData) {
    return this.makeRequest('/customer-portal/payment', {
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
  // NOTE: This endpoint doesn't exist in backend - payment status comes from webhook
  // For now, we'll remove this or implement polling differently
  async checkPaymentStatus(orderId) {
    // This endpoint doesn't exist in backend - webhook handles payment status
    // Return a mock response or handle differently
    console.warn('⚠️ Payment status endpoint not available - webhook handles status updates');
    return {
      status: 'info',
      message: 'Payment status is updated via webhook. Please wait for confirmation.',
      order_id: orderId
    };
  }

  // Get Available Packages API
  async getPackages() {
    return this.makeRequest('/customer-portal/packages', {
      method: 'GET',
    });
  }

  // Get Customer Dashboard Data (matches backend endpoint)
  async getCustomerDashboard(phoneNumber) {
    return this.makeRequest(`/customer-portal/customer/${phoneNumber}/dashboard`, {
      method: 'GET',
    });
  }

  // Get Customer Profile (matches backend endpoint)
  async getCustomerProfile(phoneNumber) {
    return this.makeRequest(`/customer-portal/customer/${phoneNumber}/profile`, {
      method: 'GET',
    });
  }

  // Get Customer Usage History (matches backend endpoint)
  async getCustomerUsage(phoneNumber) {
    return this.makeRequest(`/customer-portal/customer/${phoneNumber}/usage`, {
      method: 'GET',
    });
  }

  // Get Customer Payment History (matches backend endpoint)
  async getCustomerPayments(phoneNumber) {
    return this.makeRequest(`/customer-portal/customer/${phoneNumber}/payments`, {
      method: 'GET',
    });
  }

  // Validate Voucher (matches backend endpoint)
  async validateVoucher(voucherCode) {
    return this.makeRequest(`/customer-portal/voucher/${voucherCode}/validate`, {
      method: 'GET',
    });
  }

  // Test endpoint (matches backend)
  async testEndpoint() {
    return this.makeRequest('/customer-portal/test', {
      method: 'GET',
    });
  }

  // Note: The following endpoints are not in backend - they will fail if called
  // Consider removing or implementing them in backend:
  // - /customer-portal/voucher-login (line 44)
  // - /customer-portal/payment/status/{orderId} (line 73)
  // - /customer-portal/sessions (removed - not in backend)
  // - /customer-portal/coverage (removed - not in backend)

  // ZenoPay Webhook Handler (for testing) - matches backend
  async handleZenoPayWebhook(webhookData) {
    return this.makeRequest('/customer-portal/webhook/zenopay', {
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
  voucherLogin, // ⚠️ WARNING: Endpoint not in backend - will fail
  initiatePayment,
  checkPaymentStatus, // ⚠️ WARNING: Endpoint not in backend - will fail
  getPackages,
  getCustomerDashboard,
  getCustomerProfile,
  getCustomerUsage,
  getCustomerPayments,
  validateVoucher,
  testEndpoint, // ✅ Added - matches backend
  handleZenoPayWebhook,
} = apiService;





















