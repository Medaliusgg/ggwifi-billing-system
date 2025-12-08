// API Service for GG Wi-Fi Customer Portal
// Handles all backend API calls for voucher login and payment processing

// Production API URL - Update VITE_API_URL in .env for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ggwifi.co.tz/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method with professional error handling
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Only include Content-Type for requests with body (POST, PUT, PATCH)
    // GET requests don't need Content-Type and it causes unnecessary CORS preflight
    const hasBody = options.body !== undefined && options.body !== null;
    const method = (options.method || 'GET').toUpperCase();
    const needsContentType = hasBody && ['POST', 'PUT', 'PATCH'].includes(method);
    
    const defaultHeaders = {
      'Accept': 'application/json',
    };
    
    // Only add Content-Type if there's a body
    if (needsContentType) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const defaultOptions = {
      headers: defaultHeaders,
      mode: 'cors', // Explicitly enable CORS
      credentials: 'include', // Include credentials for CORS
    };

    const config = { ...defaultOptions, ...options };

    try {
      console.log('🔍 API Request:', {
        url,
        method: config.method || 'GET',
        headers: config.headers
      });
      
      const response = await fetch(url, config);
      
      console.log('🔍 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Check for CORS errors
      if (response.status === 0 || response.type === 'opaque') {
        throw new Error('CORS error: Request blocked. Please check backend CORS configuration.');
      }
      
      if (!response.ok) {
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('customerRefreshToken');
          localStorage.removeItem('customer');
          // Could trigger a redirect or show login modal
          throw new Error('Authentication required. Please login.');
        }
        
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Response Data:', data);
      return data;
    } catch (error) {
      // Professional error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('❌ Network Error:', {
          message: error.message,
          url,
          possibleCauses: [
            'Backend server is not running',
            'CORS configuration issue',
            'Network connectivity problem',
            'Backend URL is incorrect'
          ]
        });
        throw new Error('Network error: Unable to connect to server. Please check your connection and ensure the backend is running.');
      } else if (error.message.includes('CORS')) {
        console.error('❌ CORS Error:', {
          message: error.message,
          url,
          origin: window.location.origin,
          suggestion: 'Backend CORS configuration needs to allow this origin'
        });
        throw new Error('CORS error: Request blocked. Please contact support or check backend configuration.');
      } else {
        console.error('❌ API Request Failed:', {
          message: error.message,
          url,
          endpoint
        });
        throw error;
      }
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
    const requestBody = {
      customerName: paymentData.customerName,
      phoneNumber: paymentData.phoneNumber,
      packageId: paymentData.packageId,
      amount: paymentData.amount,
    };
    
    // Include optional fields only if provided
    if (paymentData.packageName) requestBody.packageName = paymentData.packageName;
    if (paymentData.currency) requestBody.currency = paymentData.currency;
    if (paymentData.paymentMethod) requestBody.paymentMethod = paymentData.paymentMethod;
    // Location is no longer required - removed from request
    
    return this.makeRequest('/customer-portal/payment', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  // Payment Status Check API
  // Check payment status from database (updated by webhook)
  async checkPaymentStatus(orderId) {
    try {
      console.log(`🔍 Checking payment status for order: ${orderId}`);
      const response = await this.makeRequest(`/customer-portal/payment/status/${orderId}`, {
        method: 'GET',
      });
      console.log(`✅ Payment status response:`, response);
      console.log(`✅ Payment status: ${response.payment_status || response.paymentStatus || 'N/A'}`);
      console.log(`✅ Response status: ${response.status || 'N/A'}`);
      return response;
    } catch (error) {
      console.error(`❌ Error checking payment status: ${error.message}`);
      console.error(`❌ Error details:`, error);
      throw error;
    }
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





















