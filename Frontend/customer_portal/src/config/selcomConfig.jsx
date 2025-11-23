// SELCOM Payment Configuration
// This file contains all SELCOM payment gateway configuration settings

export const SELCOM_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: process.env.REACT_APP_SELCOM_API_URL || 'https://pay.selcom.co.tz',
    MERCHANT_ID: process.env.REACT_APP_SELCOM_MERCHANT_ID || 'GGNETWORKS',
    API_KEY: process.env.REACT_APP_SELCOM_API_KEY || '',
    API_SECRET: process.env.REACT_APP_SELCOM_API_SECRET || '',
    WEBHOOK_SECRET: process.env.REACT_APP_SELCOM_WEBHOOK_SECRET || '',
  },

  // Payment Settings
  PAYMENT: {
    CURRENCY: 'TZS',
    LANGUAGE: 'en',
    TIMEOUT: 300000, // 5 minutes
    REDIRECT_URL: process.env.REACT_APP_PAYMENT_REDIRECT_URL || 'https://connect.ggnetworks.co.tz/payment/callback',
    CANCEL_URL: process.env.REACT_APP_PAYMENT_CANCEL_URL || 'https://connect.ggnetworks.co.tz/payment/cancel',
    WEBHOOK_URL: process.env.REACT_APP_PAYMENT_WEBHOOK_URL || 'https://ggnetworks.co.tz/api/v1/payments/selcom/webhook',
  },

  // Payment Methods
  PAYMENT_METHODS: [
    {
      value: 'mpesa',
      label: 'M-Pesa',
      icon: '💰',
      description: 'Pay with M-Pesa mobile money',
      minAmount: 1000,
      maxAmount: 1000000,
    },
    {
      value: 'airtel',
      label: 'Airtel Money',
      icon: '📱',
      description: 'Pay with Airtel Money',
      minAmount: 1000,
      maxAmount: 1000000,
    },
    {
      value: 'tigo',
      label: 'Tigo Pesa',
      icon: '📞',
      description: 'Pay with Tigo Pesa',
      minAmount: 1000,
      maxAmount: 1000000,
    },
    {
      value: 'halopesa',
      label: 'HaloPesa',
      icon: '💳',
      description: 'Pay with HaloPesa',
      minAmount: 1000,
      maxAmount: 1000000,
    },
    {
      value: 'bank_transfer',
      label: 'Bank Transfer',
      icon: '🏦',
      description: 'Pay via bank transfer',
      minAmount: 10000,
      maxAmount: 10000000,
    },
    {
      value: 'card',
      label: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay with credit or debit card',
      minAmount: 1000,
      maxAmount: 1000000,
    },
  ],

  // Status Codes
  STATUS_CODES: {
    SUCCESS: '000',
    PENDING: '001',
    FAILED: '002',
    CANCELLED: '003',
    TIMEOUT: '004',
    INVALID_AMOUNT: '005',
    INVALID_PHONE: '006',
    INSUFFICIENT_FUNDS: '007',
    NETWORK_ERROR: '008',
    SYSTEM_ERROR: '009',
  },

  // Status Messages
  STATUS_MESSAGES: {
    '000': 'Payment successful',
    '001': 'Payment pending',
    '002': 'Payment failed',
    '003': 'Payment cancelled',
    '004': 'Payment timeout',
    '005': 'Invalid amount',
    '006': 'Invalid phone number',
    '007': 'Insufficient funds',
    '008': 'Network error',
    '009': 'System error',
  },

  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
    TIMEOUT_ERROR: 'Payment request timed out. Please try again.',
    INVALID_PHONE: 'Invalid phone number format. Please use format: 0XXXXXXXXX',
    INVALID_AMOUNT: 'Invalid payment amount. Please check the amount and try again.',
    INSUFFICIENT_FUNDS: 'Insufficient funds in your account. Please top up and try again.',
    PAYMENT_FAILED: 'Payment failed. Please try again or contact support.',
    SYSTEM_ERROR: 'System error occurred. Please try again later.',
    CANCELLED: 'Payment was cancelled by user.',
  },

  // Validation Rules
  VALIDATION: {
    PHONE_NUMBER: {
      PATTERN: /^(0|\+255|255)[0-9]{9}$/,
      MESSAGE: 'Phone number must be in format: 0XXXXXXXXX',
    },
    AMOUNT: {
      MIN: 1000,
      MAX: 1000000,
      MESSAGE: 'Amount must be between TZS 1,000 and TZS 1,000,000',
    },
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z\s]+$/,
      MESSAGE: 'Name must contain only letters and spaces',
    },
  },

  // UI Configuration
  UI: {
    COLORS: {
      PRIMARY: '#667eea',
      SECONDARY: '#764ba2',
      SUCCESS: '#11998e',
      WARNING: '#f093fb',
      ERROR: '#fa709a',
    },
    GRADIENTS: {
      PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      SUCCESS: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      WARNING: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      ERROR: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    ANIMATIONS: {
      DURATION: 300,
      EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Security Settings
  SECURITY: {
    SIGNATURE_ALGORITHM: 'MD5',
    ENCODING: 'UTF-8',
    TIMESTAMP_TOLERANCE: 300000, // 5 minutes
  },

  // Development Settings
  DEVELOPMENT: {
    MOCK_MODE: process.env.REACT_APP_MOCK_PAYMENTS === 'true',
    DEBUG_MODE: process.env.REACT_APP_DEBUG_PAYMENTS === 'true',
    LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
  },
};

// Helper functions
export const selcomHelpers = {
  /**
   * Format currency for display
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Validate phone number
   */
  validatePhoneNumber: (phoneNumber) => {
    if (!phoneNumber) return false;
    return SELCOM_CONFIG.VALIDATION.PHONE_NUMBER.PATTERN.test(phoneNumber);
  },

  /**
   * Format phone number for SELCOM
   */
  formatPhoneForSelcom: (phoneNumber) => {
    if (!phoneNumber) return '';
    
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.startsWith('255')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return `255${cleaned.slice(1)}`;
    } else if (cleaned.length === 9) {
      return `255${cleaned}`;
    }
    
    return phoneNumber;
  },

  /**
   * Validate amount
   */
  validateAmount: (amount) => {
    const numAmount = Number(amount);
    return numAmount >= SELCOM_CONFIG.VALIDATION.AMOUNT.MIN && 
           numAmount <= SELCOM_CONFIG.VALIDATION.AMOUNT.MAX;
  },

  /**
   * Get status message
   */
  getStatusMessage: (statusCode) => {
    return SELCOM_CONFIG.STATUS_MESSAGES[statusCode] || 'Unknown status';
  },

  /**
   * Get error message
   */
  getErrorMessage: (errorCode) => {
    return SELCOM_CONFIG.ERROR_MESSAGES[errorCode] || 'An error occurred';
  },

  /**
   * Generate transaction reference
   */
  generateTransactionReference: () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `GGN-${timestamp}-${random}`;
  },

  /**
   * Get payment method by value
   */
  getPaymentMethod: (value) => {
    return SELCOM_CONFIG.PAYMENT_METHODS.find(method => method.value === value);
  },

  /**
   * Check if payment method is available for amount
   */
  isPaymentMethodAvailable: (method, amount) => {
    const paymentMethod = selcomHelpers.getPaymentMethod(method);
    if (!paymentMethod) return false;
    
    return amount >= paymentMethod.minAmount && amount <= paymentMethod.maxAmount;
  },
};

export default SELCOM_CONFIG; 