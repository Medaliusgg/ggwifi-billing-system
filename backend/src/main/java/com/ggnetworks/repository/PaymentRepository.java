package com.ggnetworks.repository;

import com.ggnetworks.entity.Payment;
import com.ggnetworks.entity.CustomerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT p FROM Payment p WHERE p.user.id = :userId AND p.deletedAt IS NULL")
    List<Payment> findByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.deletedAt IS NULL")
    List<Payment> findByStatus(@Param("status") Payment.PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.paymentType = :paymentType AND p.deletedAt IS NULL")
    List<Payment> findByPaymentType(@Param("paymentType") Payment.PaymentType paymentType);

    @Query("SELECT p FROM Payment p WHERE p.paymentMethod = :paymentMethod AND p.deletedAt IS NULL")
    List<Payment> findByPaymentMethod(@Param("paymentMethod") Payment.PaymentMethod paymentMethod);

    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.paymentType = :paymentType AND p.deletedAt IS NULL")
    List<Payment> findByStatusAndPaymentType(@Param("status") Payment.PaymentStatus status, 
                                           @Param("paymentType") Payment.PaymentType paymentType);

    @Query("SELECT p FROM Payment p WHERE p.application.id = :applicationId AND p.deletedAt IS NULL")
    List<Payment> findByApplicationId(@Param("applicationId") Long applicationId);

    Optional<Payment> findByTransactionIdAndDeletedAtIsNull(String transactionId);

    @Query("SELECT p FROM Payment p WHERE p.paidAt >= :startDate AND p.deletedAt IS NULL")
    List<Payment> findByPaidAtAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT p FROM Payment p WHERE p.paidAt BETWEEN :startDate AND :endDate AND p.deletedAt IS NULL")
    List<Payment> findByPaidAtBetween(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status AND p.deletedAt IS NULL")
    long countByStatus(@Param("status") Payment.PaymentStatus status);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentType = :paymentType AND p.deletedAt IS NULL")
    long countByPaymentType(@Param("paymentType") Payment.PaymentType paymentType);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.deletedAt IS NULL")
    BigDecimal sumCompletedPayments();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentType = :paymentType AND p.deletedAt IS NULL")
    BigDecimal sumCompletedPaymentsByType(@Param("paymentType") Payment.PaymentType paymentType);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paidAt >= :startDate AND p.deletedAt IS NULL")
    BigDecimal sumCompletedPaymentsAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT p FROM Payment p WHERE p.deletedAt IS NULL")
    Page<Payment> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE p.transactionId LIKE %:transactionId% AND p.deletedAt IS NULL")
    Page<Payment> findByTransactionIdContaining(@Param("transactionId") String transactionId, Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE p.user.phoneNumber = :phoneNumber AND p.deletedAt IS NULL")
    List<Payment> findByUserPhoneNumber(@Param("phoneNumber") String phoneNumber);

    // Add missing methods
    Optional<Payment> findByIdAndDeletedAtIsNull(Long id);
    
    long countByDeletedAtIsNull();
    
    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.deletedAt IS NULL")
    Page<Payment> findByStatus(@Param("status") Payment.PaymentStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Payment p WHERE p.user.phoneNumber = :phoneNumber AND p.deletedAt IS NULL")
    Page<Payment> findByUserPhoneNumber(@Param("phoneNumber") String phoneNumber, Pageable pageable);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.deletedAt IS NULL")
    BigDecimal sumAmountByStatus(@Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate AND p.deletedAt IS NULL")
    List<Payment> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    Optional<Payment> findByTransactionId(String transactionId);

    // Add missing methods for SelcomPaymentService
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status AND p.deletedAt IS NULL")
    long countByStatusAndDeletedAtIsNull(@Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.deletedAt IS NULL")
    BigDecimal sumAmountByStatusAndDeletedAtIsNull(@Param("status") Payment.PaymentStatus status);

    // Note: Payment entity doesn't have a direct customerProfile relationship
    // Use findByUserPhoneNumber instead to find payments by customer phone number
} 