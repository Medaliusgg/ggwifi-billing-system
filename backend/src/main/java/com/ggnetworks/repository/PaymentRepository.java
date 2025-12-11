package com.ggnetworks.repository;

import com.ggnetworks.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByPaymentId(String paymentId);
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    Optional<Payment> findByReferenceNumber(String referenceNumber);
    
    List<Payment> findByPhoneNumberAndStatusOrderByCreatedAtDesc(String phoneNumber, Payment.PaymentStatus status);
    
    List<Payment> findByCustomerId(Long customerId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod);
    
    List<Payment> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Payment> findByCustomerIdAndStatus(Long customerId, Payment.PaymentStatus status);
    
    List<Payment> findByPhoneNumber(String phoneNumber);
    
    List<Payment> findByPhoneNumberOrderByCreatedAtDesc(String phoneNumber);
    
    List<Payment> findByPaymentGateway(String paymentGateway);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate")
    Double sumAmountByStatusAndDateRange(@Param("status") Payment.PaymentStatus status, 
                                         @Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    long countByStatus(@Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentMethod = :method")
    long countByPaymentMethod(@Param("method") Payment.PaymentMethod method);
}
