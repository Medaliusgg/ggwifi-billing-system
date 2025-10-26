package com.ggnetworks.service;

import com.ggnetworks.entity.Payment;
import com.ggnetworks.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    /**
     * Get all payments
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    /**
     * Get payment by ID
     */
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }
    
    /**
     * Get payment by payment ID
     */
    public Optional<Payment> getPaymentByPaymentId(String paymentId) {
        return paymentRepository.findByPaymentId(paymentId);
    }
    
    /**
     * Create new payment
     */
    public Payment createPayment(Payment payment) {
        // Generate unique payment ID if not provided
        if (payment.getPaymentId() == null || payment.getPaymentId().isEmpty()) {
            payment.setPaymentId(generatePaymentId());
        }
        
        // Set timestamps
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Update payment
     */
    public Payment updatePayment(Payment payment) {
        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }
    
    /**
     * Delete payment
     */
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
    
    /**
     * Get payments by customer ID
     */
    public List<Payment> getPaymentsByCustomerId(Long customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }
    
    /**
     * Get payments by status
     */
    public List<Payment> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }
    
    /**
     * Get payments by payment gateway
     */
    public List<Payment> getPaymentsByPaymentGateway(String paymentGateway) {
        return paymentRepository.findByPaymentGateway(paymentGateway);
    }
    
    /**
     * Get payments by phone number
     */
    public List<Payment> getPaymentsByPhoneNumber(String phoneNumber) {
        return paymentRepository.findByPhoneNumberOrderByCreatedAtDesc(phoneNumber);
    }
    
    /**
     * Get successful payments by phone number
     */
    public List<Payment> getSuccessfulPaymentsByPhoneNumber(String phoneNumber) {
        return paymentRepository.findByPhoneNumberAndStatusOrderByCreatedAtDesc(phoneNumber, Payment.PaymentStatus.COMPLETED);
    }
    
    /**
     * Get payments by date range
     */
    public List<Payment> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    /**
     * Generate unique payment ID
     */
    private String generatePaymentId() {
        return "PAY_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
    }
    
    /**
     * Get payment statistics
     */
    public Map<String, Object> getPaymentStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total payments
        long totalPayments = paymentRepository.count();
        stats.put("totalPayments", totalPayments);
        
        // Successful payments
        long successfulPayments = paymentRepository.countByStatus(Payment.PaymentStatus.COMPLETED);
        stats.put("successfulPayments", successfulPayments);
        
        // Failed payments
        long failedPayments = paymentRepository.countByStatus(Payment.PaymentStatus.FAILED);
        stats.put("failedPayments", failedPayments);
        
        // Pending payments
        long pendingPayments = paymentRepository.countByStatus(Payment.PaymentStatus.PENDING);
        stats.put("pendingPayments", pendingPayments);
        
        // Success rate
        double successRate = totalPayments > 0 ? (double) successfulPayments / totalPayments * 100 : 0;
        stats.put("successRate", Math.round(successRate * 100.0) / 100.0);
        
        return stats;
    }
}


