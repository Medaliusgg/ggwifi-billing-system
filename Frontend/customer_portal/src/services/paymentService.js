import apiService from './apiService';

class PaymentService {
  constructor() {
    // Use API service directly, no need for separate base URL
    this.apiService = apiService;
  }

  /**
   * Generate voucher code
   */
  generateVoucherCode() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `VCH${timestamp}${random}`;
  }

  /**
   * Validate payment data
   */
  validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData.customerName || paymentData.customerName.trim() === '') {
      errors.push('Customer name is required');
    }

    if (!paymentData.phoneNumber || paymentData.phoneNumber.trim() === '') {
      errors.push('Phone number is required');
    }

    if (!paymentData.location || paymentData.location.trim() === '') {
      errors.push('Location is required');
    }

    if (!paymentData.packageId) {
      errors.push('Package selection is required');
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Valid amount is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Initiate ZenoPay payment
   */
  async initiateZenoPayPayment(paymentData) {
    try {
      const validation = this.validatePaymentData(paymentData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const formattedPaymentData = {
        customerName: paymentData.customerName.trim(),
        phoneNumber: paymentData.phoneNumber.trim(),
        location: paymentData.location.trim(),
        packageId: paymentData.packageId,
        packageName: paymentData.packageName,
        amount: paymentData.amount,
        currency: paymentData.currency || 'TZS',
        paymentMethod: 'ZENOPAY',
        voucherCode: this.generateVoucherCode()
      };

      console.log('🚀 Initiating ZenoPay Payment:', formattedPaymentData);

      const response = await apiService.initiatePayment(formattedPaymentData);
      
      console.log('🔍 Payment API Response:', response);
      console.log('🔍 Response Status:', response.status);
      console.log('🔍 Response Type:', typeof response.status);
      
      if (response.status === 'success') {
        return {
          status: 'success',
          order_id: response.order_id,
          voucher_code: response.voucher_code,
          message: response.message,
          zenopay_response: response.zenopay_response
        };
      } else {
        throw new Error(response.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('❌ ZenoPay Payment Error:', error);
      throw error;
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(orderId) {
    try {
      console.log(`🔍 Checking payment status for order: ${orderId}`);
      const response = await apiService.checkPaymentStatus(orderId);
      console.log(`🔍 Payment status response:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Error checking payment status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Poll payment status with enhanced tracking
   */
  async pollPaymentStatus(orderId, onStatusUpdate, maxAttempts = 60, interval = 3000) {
    console.log(`🔄 Starting payment status polling for order: ${orderId}`);
    
    // Prevent multiple polling instances for the same order
    if (this.activePolling && this.activePolling.has(orderId)) {
      console.log(`⚠️ Polling already active for order: ${orderId}`);
      return () => {
        console.log(`🛑 Ignoring duplicate polling stop for order: ${orderId}`);
      };
    }
    
    // Track active polling
    if (!this.activePolling) {
      this.activePolling = new Set();
    }
    this.activePolling.add(orderId);
    
    let attempts = 0;
    const pollInterval = setInterval(async () => {
      attempts++;
      console.log(`🔄 Polling attempt ${attempts}/${maxAttempts} for order: ${orderId}`);
      
      try {
        const result = await this.checkPaymentStatus(orderId);
        
        if (result.status === 'success') {
          const paymentStatus = result.payment_status;
          console.log(`📊 Payment status update: ${paymentStatus}`);
          
          // Call the status update callback
          if (onStatusUpdate) {
            onStatusUpdate({
              status: paymentStatus,
              message: result.message,
              orderId: result.order_id,
              voucherCode: result.voucher_code,
              voucherGenerated: result.voucher_generated,
              timestamp: result.timestamp,
              zenopayResponse: result.zenopay_response
            });
          }
          
          // Stop polling if payment is completed or failed
          if (['COMPLETED', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED', 'ERROR'].includes(paymentStatus)) {
            console.log(`✅ Payment polling completed with status: ${paymentStatus}`);
            clearInterval(pollInterval);
            this.activePolling.delete(orderId);
            return;
          }
        } else {
          console.error(`❌ Payment status check failed: ${result.message}`);
          if (onStatusUpdate) {
            onStatusUpdate({
              status: 'ERROR',
              message: result.message || 'Failed to check payment status',
              orderId: orderId
            });
          }
        }
        
        // Stop polling if max attempts reached
        if (attempts >= maxAttempts) {
          console.log(`⏰ Payment polling timeout after ${maxAttempts} attempts`);
          clearInterval(pollInterval);
          this.activePolling.delete(orderId);
          if (onStatusUpdate) {
            onStatusUpdate({
              status: 'TIMEOUT',
              message: 'Payment status check timed out. Please check your payment manually.',
              orderId: orderId
            });
          }
        }
        
      } catch (error) {
        console.error(`❌ Error polling payment status: ${error.message}`);
        attempts++;
        
        if (attempts >= maxAttempts) {
          console.log(`⏰ Payment polling failed after ${maxAttempts} attempts`);
          clearInterval(pollInterval);
          this.activePolling.delete(orderId);
          if (onStatusUpdate) {
            onStatusUpdate({
              status: 'ERROR',
              message: 'Failed to check payment status. Please try again.',
              orderId: orderId
            });
          }
        }
      }
    }, interval);
    
    // Return a function to stop polling
    return () => {
      console.log(`🛑 Stopping payment polling for order: ${orderId}`);
      console.log(`🛑 Active polling before stop:`, this.activePolling);
      clearInterval(pollInterval);
      this.activePolling.delete(orderId);
      console.log(`🛑 Active polling after stop:`, this.activePolling);
    };
  }

  /**
   * Process complete payment flow
   */
  async processPayment(paymentData) {
    try {
      // Step 1: Initiate payment
      const paymentResult = await this.initiateZenoPayPayment(paymentData);
      
      if (paymentResult.status === 'success') {
        // Step 2: Poll for payment completion
        const statusResult = await this.pollPaymentStatus(paymentResult.order_id);
        
        return {
          ...paymentResult,
          final_status: statusResult.status,
          payment_status: statusResult.payment_status,
          final_message: statusResult.message
        };
      } else {
        throw new Error(paymentResult.message);
      }
    } catch (error) {
      console.error('❌ Payment Process Error:', error);
      throw error;
    }
  }
}

const paymentService = new PaymentService();

export default paymentService;