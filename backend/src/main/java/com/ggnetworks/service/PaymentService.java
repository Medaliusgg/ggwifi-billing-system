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
    
    /**
     * Reconcile payments with payment gateway (ZenoPay) for hotspot billing
     */
    public Map<String, Object> reconcilePayments(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> result = new HashMap<>();
        
        List<Payment> payments = paymentRepository.findByCreatedAtBetween(startDate, endDate);
        
        long totalPayments = payments.size();
        long reconciled = 0;
        long discrepancies = 0;
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal reconciledAmount = BigDecimal.ZERO;
        
        // Count by gateway
        Map<String, Long> gatewayCounts = new HashMap<>();
        Map<String, BigDecimal> gatewayAmounts = new HashMap<>();
        
        for (Payment payment : payments) {
            totalAmount = totalAmount.add(payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO);
            
            String gateway = payment.getPaymentGateway() != null ? payment.getPaymentGateway() : "UNKNOWN";
            gatewayCounts.put(gateway, gatewayCounts.getOrDefault(gateway, 0L) + 1);
            gatewayAmounts.put(gateway, gatewayAmounts.getOrDefault(gateway, BigDecimal.ZERO)
                .add(payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO));
            
            // Check if payment has gateway confirmation
            if (payment.getGatewayTransactionId() != null && !payment.getGatewayTransactionId().isEmpty() 
                && payment.getConfirmedAt() != null) {
                reconciled++;
                reconciledAmount = reconciledAmount.add(payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO);
            } else if (payment.getStatus() == Payment.PaymentStatus.COMPLETED 
                && (payment.getGatewayTransactionId() == null || payment.getGatewayTransactionId().isEmpty())) {
                discrepancies++;
            }
        }
        
        result.put("period", Map.of("start", startDate.toString(), "end", endDate.toString()));
        result.put("totalPayments", totalPayments);
        result.put("reconciled", reconciled);
        result.put("discrepancies", discrepancies);
        result.put("unreconciled", totalPayments - reconciled);
        result.put("totalAmount", totalAmount);
        result.put("reconciledAmount", reconciledAmount);
        result.put("reconciliationRate", totalPayments > 0 ? 
            Math.round((double) reconciled / totalPayments * 10000.0) / 100.0 : 0);
        result.put("byGateway", gatewayCounts);
        result.put("amountByGateway", gatewayAmounts);
        result.put("generatedAt", LocalDateTime.now().toString());
        
        return result;
    }
    
    /**
     * Get payments requiring reconciliation for hotspot billing
     */
    public List<Payment> getPaymentsRequiringReconciliation() {
        return paymentRepository.findAll().stream()
            .filter(payment -> payment.getStatus() == Payment.PaymentStatus.COMPLETED 
                && (payment.getGatewayTransactionId() == null || payment.getGatewayTransactionId().isEmpty()))
            .toList();
    }
    
    /**
     * Get payment analytics dashboard for hotspot billing
     */
    public Map<String, Object> getPaymentAnalytics(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> analytics = new HashMap<>();
        
        List<Payment> payments = paymentRepository.findByCreatedAtBetween(startDate, endDate);
        
        // Revenue analytics
        BigDecimal totalRevenue = payments.stream()
            .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
            .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Payment method breakdown
        Map<String, Long> methodCounts = new HashMap<>();
        Map<String, BigDecimal> methodAmounts = new HashMap<>();
        
        // Payment gateway breakdown
        Map<String, Long> gatewayCounts = new HashMap<>();
        Map<String, BigDecimal> gatewayAmounts = new HashMap<>();
        
        // Daily revenue trend
        Map<String, BigDecimal> dailyRevenue = new HashMap<>();
        
        for (Payment payment : payments) {
            if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
                String method = payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : "UNKNOWN";
                String gateway = payment.getPaymentGateway() != null ? payment.getPaymentGateway() : "UNKNOWN";
                String date = payment.getCreatedAt() != null ? payment.getCreatedAt().toLocalDate().toString() : "UNKNOWN";
                
                methodCounts.put(method, methodCounts.getOrDefault(method, 0L) + 1);
                methodAmounts.put(method, methodAmounts.getOrDefault(method, BigDecimal.ZERO)
                    .add(payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO));
                
                gatewayCounts.put(gateway, gatewayCounts.getOrDefault(gateway, 0L) + 1);
                gatewayAmounts.put(gateway, gatewayAmounts.getOrDefault(gateway, BigDecimal.ZERO)
                    .add(payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO));
                
                dailyRevenue.put(date, dailyRevenue.getOrDefault(date, BigDecimal.ZERO)
                    .add(payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO));
            }
        }
        
        // Success rate by gateway
        Map<String, Double> gatewaySuccessRates = new HashMap<>();
        for (String gateway : gatewayCounts.keySet()) {
            long total = payments.stream()
                .filter(p -> gateway.equals(p.getPaymentGateway()))
                .count();
            long successful = payments.stream()
                .filter(p -> gateway.equals(p.getPaymentGateway()) && p.getStatus() == Payment.PaymentStatus.COMPLETED)
                .count();
            gatewaySuccessRates.put(gateway, total > 0 ? Math.round((double) successful / total * 10000.0) / 100.0 : 0.0);
        }
        
        analytics.put("period", Map.of("start", startDate.toString(), "end", endDate.toString()));
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("totalTransactions", payments.size());
        analytics.put("successfulTransactions", payments.stream().filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED).count());
        analytics.put("failedTransactions", payments.stream().filter(p -> p.getStatus() == Payment.PaymentStatus.FAILED).count());
        analytics.put("byPaymentMethod", Map.of("counts", methodCounts, "amounts", methodAmounts));
        analytics.put("byGateway", Map.of("counts", gatewayCounts, "amounts", gatewayAmounts, "successRates", gatewaySuccessRates));
        analytics.put("dailyRevenue", dailyRevenue);
        analytics.put("averageTransactionAmount", payments.size() > 0 ? 
            totalRevenue.divide(BigDecimal.valueOf(payments.size()), 2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO);
        analytics.put("generatedAt", LocalDateTime.now().toString());
        
        return analytics;
    }
}


