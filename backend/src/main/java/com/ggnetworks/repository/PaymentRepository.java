package com.ggnetworks.repository;

import com.ggnetworks.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByPaymentId(String paymentId);
    
    Optional<Payment> findByGatewayTransactionId(String gatewayTransactionId);
    
    Optional<Payment> findByGatewayReference(String gatewayReference);
    
    List<Payment> findByInvoiceId(Long invoiceId);
    
    List<Payment> findByCustomerId(Long customerId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod);
    
    List<Payment> findByPaymentGateway(String paymentGateway);
    
    List<Payment> findByPhoneNumber(String phoneNumber);
    
    List<Payment> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Payment> findByProcessedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Payment> findByConfirmedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Payment> findByCurrency(String currency);
    
    boolean existsByPaymentId(String paymentId);
    
    boolean existsByGatewayTransactionId(String gatewayTransactionId);
    
    boolean existsByGatewayReference(String gatewayReference);
    
    long countByStatus(Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.customerId = :customerId AND p.status = :status ORDER BY p.createdAt DESC")
    List<Payment> findByCustomerIdAndStatusOrderByCreatedAtDesc(@Param("customerId") Long customerId, @Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.createdAt >= :startDate ORDER BY p.createdAt DESC")
    List<Payment> findByStatusAndCreatedAtAfterOrderByCreatedAtDesc(@Param("status") Payment.PaymentStatus status, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByStatusAndCreatedAtBetween(@Param("status") Payment.PaymentStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate")
    long countByStatusAndCreatedAtBetween(@Param("status") Payment.PaymentStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.paymentGateway = :gateway AND p.status = :status ORDER BY p.createdAt DESC")
    List<Payment> findByPaymentGatewayAndStatusOrderByCreatedAtDesc(@Param("gateway") String gateway, @Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.phoneNumber = :phoneNumber ORDER BY p.createdAt DESC")
    List<Payment> findByPhoneNumberOrderByCreatedAtDesc(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT p FROM Payment p WHERE p.phoneNumber = :phoneNumber AND p.status = :status ORDER BY p.createdAt DESC")
    List<Payment> findByPhoneNumberAndStatusOrderByCreatedAtDesc(@Param("phoneNumber") String phoneNumber, @Param("status") Payment.PaymentStatus status);
    
    // Additional methods needed by services
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal getTotalAmountByDateRange(@Param("status") Payment.PaymentStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}