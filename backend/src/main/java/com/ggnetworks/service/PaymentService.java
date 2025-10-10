package com.ggnetworks.service;

import com.ggnetworks.entity.CustomerProfile;
import com.ggnetworks.entity.Payment;
import com.ggnetworks.entity.User;
import com.ggnetworks.repository.CustomerProfileRepository;
import com.ggnetworks.repository.PaymentRepository;
import com.ggnetworks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final VoucherService voucherService;

    public Payment createPayment(Payment payment) {
        try {
            payment.setCreatedAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        } catch (Exception e) {
            log.error("Failed to create payment", e);
            throw new RuntimeException("Failed to create payment", e);
        }
    }

    public Payment getPaymentById(Long paymentId) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        return paymentOpt.orElse(null);
    }

    public Payment getPaymentByTransactionId(String transactionId) {
        Optional<Payment> paymentOpt = paymentRepository.findByTransactionId(transactionId);
        return paymentOpt.orElse(null);
    }

    public Page<Payment> getAllPayments(Pageable pageable, String status) {
        if (status != null && !status.trim().isEmpty()) {
            return paymentRepository.findByStatus(Payment.PaymentStatus.valueOf(status.toUpperCase()), pageable);
        }
        return paymentRepository.findAll(pageable);
    }

    public Page<Payment> getPaymentHistoryByUser(String phoneNumber, Pageable pageable) {
        return paymentRepository.findByUserPhoneNumber(phoneNumber, pageable);
    }

    public List<Payment> getPaymentsByUser(String phoneNumber) {
        return paymentRepository.findByUserPhoneNumber(phoneNumber);
    }

    public List<Payment> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    @Transactional
    public Payment updatePaymentStatus(Long paymentId, Payment.PaymentStatus status) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
            if (paymentOpt.isEmpty()) {
                throw new IllegalArgumentException("Payment not found");
            }

            Payment payment = paymentOpt.get();
            payment.setStatus(status);
            payment.setUpdatedAt(LocalDateTime.now());

            if (status == Payment.PaymentStatus.COMPLETED) {
                payment.setPaidAt(LocalDateTime.now());
            }

            return paymentRepository.save(payment);
        } catch (Exception e) {
            log.error("Failed to update payment status", e);
            throw new RuntimeException("Failed to update payment status", e);
        }
    }

    @Transactional
    public Payment updatePaymentStatusByTransactionId(String transactionId, Payment.PaymentStatus status) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findByTransactionId(transactionId);
            if (paymentOpt.isEmpty()) {
                throw new IllegalArgumentException("Payment not found");
            }

            Payment payment = paymentOpt.get();
            payment.setStatus(status);
            payment.setUpdatedAt(LocalDateTime.now());

            if (status == Payment.PaymentStatus.COMPLETED) {
                payment.setPaidAt(LocalDateTime.now());
                
                // Create FreeRADIUS user after successful payment
                if (payment.getPaymentType() == Payment.PaymentType.MONTHLY_PLAN) {
                    try {
                        // For now, we'll use a placeholder since Payment entity doesn't have packageId
                        // In production, you should add packageId field to Payment entity
                        Long packageId = 1L; // Default package ID
                        String phoneNumber = payment.getUser().getPhoneNumber();
                        voucherService.createPppoeUserInRadius(phoneNumber, packageId);
                        log.info("Created FreeRADIUS user for successful payment: {}", transactionId);
                    } catch (Exception e) {
                        log.error("Failed to create FreeRADIUS user for payment: {}", transactionId, e);
                        // Don't fail the payment update if FreeRADIUS creation fails
                    }
                }
            }

            return paymentRepository.save(payment);
        } catch (Exception e) {
            log.error("Failed to update payment status", e);
            throw new RuntimeException("Failed to update payment status", e);
        }
    }

    public Map<String, Object> getPaymentStatistics() {
        try {
            long totalPayments = paymentRepository.count();
            long completedPayments = paymentRepository.countByStatus(Payment.PaymentStatus.COMPLETED);
            long pendingPayments = paymentRepository.countByStatus(Payment.PaymentStatus.PENDING);
            long failedPayments = paymentRepository.countByStatus(Payment.PaymentStatus.FAILED);

            // Calculate total revenue
            BigDecimal totalRevenue = paymentRepository.sumAmountByStatus(Payment.PaymentStatus.COMPLETED);
            if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalPayments", totalPayments);
            stats.put("completedPayments", completedPayments);
            stats.put("pendingPayments", pendingPayments);
            stats.put("failedPayments", failedPayments);
            stats.put("totalRevenue", totalRevenue);
            stats.put("successRate", totalPayments > 0 ? (double) completedPayments / totalPayments * 100 : 0);

            return stats;
        } catch (Exception e) {
            log.error("Failed to get payment statistics", e);
            return new HashMap<>();
        }
    }

    public List<Payment> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<Payment> getPaymentsByPaymentType(Payment.PaymentType paymentType) {
        return paymentRepository.findByPaymentType(paymentType);
    }

    public List<Payment> getPaymentsByPaymentMethod(Payment.PaymentMethod paymentMethod) {
        return paymentRepository.findByPaymentMethod(paymentMethod);
    }

    @Transactional
    public Payment createVoucherPayment(com.ggnetworks.entity.Package packageEntity, String phoneNumber, String paymentMethod) {
        try {
            Payment payment = new Payment();
            payment.setAmount(packageEntity.getPrice());
            payment.setPaymentType(Payment.PaymentType.VOUCHER_PURCHASE);
            payment.setPaymentMethod(Payment.PaymentMethod.valueOf(paymentMethod.toUpperCase()));
            payment.setStatus(Payment.PaymentStatus.PENDING);
            payment.setTransactionId("VOUCHER_" + System.currentTimeMillis());
            
            // Set user if exists
            Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);
            if (userOpt.isPresent()) {
                payment.setUser(userOpt.get());
            }
            
            return createPayment(payment);
        } catch (Exception e) {
            log.error("Failed to create voucher payment", e);
            throw new RuntimeException("Failed to create voucher payment", e);
        }
    }

    // Additional methods for AdminCustomerController
    public Page<Payment> getPaymentsByCustomerId(Long customerId, Pageable pageable) {
        // Find payments through user phone number
        CustomerProfile customerProfile = customerProfileRepository.findById(customerId).orElse(null);
        if (customerProfile == null) {
            return Page.empty(pageable);
        }
        return paymentRepository.findByUserPhoneNumber(customerProfile.getPhoneNumber(), pageable);
    }
} 