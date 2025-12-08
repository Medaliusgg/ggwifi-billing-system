// SELCOM Payment Service for GGNetworks
// Handles payment initialization and verification only
// Backend handles voucher generation, auto-connection, and SMS delivery

class SelcomPaymentService {
  constructor() {
    // Production API URL - Update VITE_API_URL in .env for different environments
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://api.ggwifi.co.tz/api/v1';
    this.selcomApiUrl = import.meta.env.VITE_SELCOM_API_URL || 'https://api.selcom.co.tz';
    this.selcomApiKey = import.meta.env.VITE_SELCOM_API_KEY || 'your-selcom-api-key';
  }

  // Initialize payment with SELCOM
  async initializePayment(paymentRequest) {
    try {
      console.log('Initializing payment with backend:', paymentRequest);
      
      // Call our backend API for payment initialization
      const response = await fetch(`${this.baseUrl}/payments/c2b/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: paymentRequest.phoneNumber,
          paymentMethod: paymentRequest.paymentMethod,
          fullName: paymentRequest.fullName,
          packageId: paymentRequest.packageId,
          amount: paymentRequest.amount,
          currency: paymentRequest.currency || 'TZS',
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const result = await response.json();
      
      if (result.success) {
      return {
        success: true,
          transactionId: result.transactionId,
          reference: result.reference,
          operator: result.operator,
          message: result.message,
        };
      } else {
        return {
          success: false,
          message: result.error || 'Payment initialization failed',
      };
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      return {
        success: false,
        message: error.message || 'Payment initialization failed',
      };
    }
  }

  // Verify payment with PIN using SELCOM
  async verifyPayment(transactionId, pinCode) {
    try {
      console.log('Verifying payment with backend:', { transactionId, pinCode });
      
      // Call our backend API for payment verification
      const response = await fetch(`${this.baseUrl}/payments/c2b/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transactionId,
          pinCode: pinCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: 'Payment verified successfully',
          voucherCode: result.voucherCode,
          smsSent: result.smsSent,
          autoConnected: result.autoConnected,
        };
      } else {
        return {
          success: false,
          message: result.error || 'Payment verification failed',
        };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        message: error.message || 'Payment verification failed',
      };
    }
  }

  // Notify backend of successful payment for voucher generation and auto-connection
  async notifyBackendOfSuccessfulPayment(transactionId) {
    try {
      console.log('Notifying backend of successful payment:', transactionId);
      
      const response = await fetch(`${this.baseUrl}/payments/success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to notify backend of successful payment');
      }

      const result = await response.json();
      console.log('Backend notification result:', result);
      
      return result;
    } catch (error) {
      console.error('Backend notification error:', error);
      throw error;
    }
  }

  // Get available payment methods from backend
  async getPaymentMethods() {
    try {
      console.log('Loading payment methods from backend...');
      
      // Call our backend API for available payment methods
      const response = await fetch(`${this.baseUrl}/payments/methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load payment methods from backend');
      }

      const result = await response.json();
      
      // Map backend payment methods to our format
      const methods = [];
      if (result.mobile_money) {
        Object.entries(result.mobile_money).forEach(([key, method]) => {
          methods.push({
            value: key,
            label: method.name || method,
            description: method.description || `Mobile money payment via ${method.name || method}`,
            icon: this.getPaymentMethodIcon(key),
          });
        });
      }
      
      return methods;
    } catch (error) {
      console.error('Payment methods loading error:', error);
      // Fallback to default Tanzanian mobile money methods
      return [
        {
          value: 'mpesa',
          label: 'M-Pesa',
          description: 'Mobile money payment via M-Pesa',
          icon: '💰',
        },
        {
          value: 'airtel',
          label: 'Airtel Money',
          description: 'Mobile money payment via Airtel Money',
          icon: '📱',
        },
        {
          value: 'mixx',
          label: 'Mixx',
          description: 'Mobile money payment via Mixx (Tigo)',
          icon: '📞',
        },
        {
          value: 'halopesa',
          label: 'HaloPesa',
          description: 'Mobile money payment via HaloPesa',
          icon: '💳',
        },
        {
          value: 'tpesa',
          label: 'T-Pesa (TTCL)',
          description: 'Mobile money payment via T-Pesa',
          icon: '🏦',
        },
      ];
    }
  }

  // Get payment status from SELCOM
  async getPaymentStatus(transactionId) {
    try {
      const response = await fetch(`${this.selcomApiUrl}/payment/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.selcomApiKey}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get payment status from SELCOM');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Payment status error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get payment status',
      };
    }
  }

  // Validate phone number format for SELCOM
  validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) return false;
    
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid Tanzanian mobile number for SELCOM
    const validPrefixes = ['074', '075', '076', '068', '069', '071', '062'];
    const prefix = cleaned.substring(0, 3);
    
    return validPrefixes.includes(prefix) && cleaned.length === 10;
  }

  // Format phone number for SELCOM API
  formatPhoneForSelcom(phoneNumber) {
    if (!phoneNumber) return '';
    
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // SELCOM expects format: 255XXXXXXXXX
    if (cleaned.startsWith('0')) {
      return `255${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `255${cleaned}`;
    }
    
    return cleaned;
  }

  // Format currency for SELCOM
  formatCurrency(amount, currency = 'TZS') {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Get payment method icon
  getPaymentMethodIcon(method) {
    const icons = {
      'mpesa': '💰',
      'airtel': '📱',
      'tigo': '📞',
      'halopesa': '💳',
      'bank_transfer': '🏦',
      'card': '💳',
      'selcom': '🔐'
    };
    return icons[method] || '💳';
  }

  // Map SELCOM payment status
  mapPaymentStatus(status) {
    const statusMap = {
      'pending': 'Pending',
      'processing': 'Processing',
      'completed': 'Completed',
      'failed': 'Failed',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded',
    };
    return statusMap[status] || status;
  }

  // Map SELCOM error messages
  mapErrorMessage(errorCode) {
    const errorMap = {
      'INSUFFICIENT_FUNDS': 'Insufficient funds in your account',
      'INVALID_PIN': 'Invalid PIN code',
      'TRANSACTION_TIMEOUT': 'Transaction timed out',
      'NETWORK_ERROR': 'Network error, please try again',
      'INVALID_PHONE': 'Invalid phone number format',
      'PAYMENT_METHOD_UNAVAILABLE': 'Payment method not available',
      'SELCOM_API_ERROR': 'SELCOM API error, please try again',
    };
    return errorMap[errorCode] || 'An error occurred during payment';
  }

  // Handle SELCOM payment callback
  async handlePaymentCallback(callbackData) {
    try {
      // Forward callback to backend for processing
      const response = await fetch(`${this.baseUrl}/payments/selcom/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callbackData),
      });

      if (!response.ok) {
        throw new Error('Payment callback handling failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Payment callback error:', error);
      return {
        success: false,
        message: error.message || 'Payment callback handling failed',
      };
    }
  }
}

const selcomPaymentService = new SelcomPaymentService();
export default selcomPaymentService; 