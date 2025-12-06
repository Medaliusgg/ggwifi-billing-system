import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Customer Portal API - Matching Backend Endpoints EXACTLY
export const customerPortalAPI = {
  // Test endpoint
  test: () => apiClient.get('/customer-portal/test'),

  // Package endpoints
  getPackages: () => apiClient.get('/customer-portal/packages'),

  // Payment endpoints
  processPayment: (paymentData) => apiClient.post('/customer-portal/payment', paymentData),
  
  // Webhook endpoints (for payment gateway callbacks)
  handleZenoPayWebhook: (webhookData) => apiClient.post('/customer-portal/webhook/zenopay', webhookData),

  // Customer profile endpoints
  getCustomerProfile: (phoneNumber) => apiClient.get(`/customer-portal/customer/${phoneNumber}/profile`),
  getCustomerDashboard: (phoneNumber) => apiClient.get(`/customer-portal/customer/${phoneNumber}/dashboard`),
  getCustomerUsage: (phoneNumber) => apiClient.get(`/customer-portal/customer/${phoneNumber}/usage`),
  getCustomerPayments: (phoneNumber) => apiClient.get(`/customer-portal/customer/${phoneNumber}/payments`),

  // Voucher endpoints
  validateVoucher: (voucherCode) => apiClient.get(`/customer-portal/voucher/${voucherCode}/validate`),
  activateVoucher: (voucherCode, activationData) => apiClient.post(`/customer-portal/voucher/${voucherCode}/activate`, activationData),
  
  // Session endpoints
  getSessionStatus: (voucherCode) => apiClient.get(`/customer-portal/voucher/${voucherCode}/session/status`),
  recordHeartbeat: (voucherCode, heartbeatData) => apiClient.post(`/customer-portal/voucher/${voucherCode}/session/heartbeat`, heartbeatData),
  reconnectSession: (voucherCode, reconnectData) => apiClient.post(`/customer-portal/voucher/${voucherCode}/session/reconnect`, reconnectData),
  reconnectWithToken: (reconnectData) => apiClient.post(`/customer-portal/session/reconnect-token`, reconnectData),
};

export default customerPortalAPI;
