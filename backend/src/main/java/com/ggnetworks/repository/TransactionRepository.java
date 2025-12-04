package com.ggnetworks.repository;

import com.ggnetworks.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionId(String transactionId);
    
    Optional<Transaction> findByGatewayTransactionId(String gatewayTransactionId);
    
    Optional<Transaction> findByGatewayReference(String gatewayReference);
    
    List<Transaction> findByCustomer_Id(Long customerId);

    default List<Transaction> findByCustomerId(Long customerId) {
        return findByCustomer_Id(customerId);
    }
    
    List<Transaction> findByStatus(Transaction.TransactionStatus status);
    
    List<Transaction> findByTransactionType(Transaction.TransactionType transactionType);
    
    List<Transaction> findByPaymentMethod(Transaction.PaymentMethod paymentMethod);
    
    List<Transaction> findByPaymentGateway(String paymentGateway);
    
    List<Transaction> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Transaction> findByProcessedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Transaction> findByConfirmedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Transaction> findByStatusAndCreatedAtBetween(Transaction.TransactionStatus status, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Transaction> findByCurrency(String currency);
    
    boolean existsByTransactionId(String transactionId);
    
    boolean existsByGatewayTransactionId(String gatewayTransactionId);
    
    boolean existsByGatewayReference(String gatewayReference);
    
    @Query("SELECT t FROM Transaction t WHERE t.customer.id = :customerId AND t.status = :status ORDER BY t.createdAt DESC")
    List<Transaction> findByCustomerIdAndStatusOrderByCreatedAtDesc(@Param("customerId") Long customerId, @Param("status") Transaction.TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.status = :status AND t.createdAt >= :startDate ORDER BY t.createdAt DESC")
    List<Transaction> findByStatusAndCreatedAtAfterOrderByCreatedAtDesc(@Param("status") Transaction.TransactionStatus status, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = :status AND t.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByStatusAndCreatedAtBetween(@Param("status") Transaction.TransactionStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status AND t.createdAt BETWEEN :startDate AND :endDate")
    long countByStatusAndCreatedAtBetween(@Param("status") Transaction.TransactionStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.paymentGateway = :gateway AND t.status = :status ORDER BY t.createdAt DESC")
    List<Transaction> findByPaymentGatewayAndStatusOrderByCreatedAtDesc(@Param("gateway") String gateway, @Param("status") Transaction.TransactionStatus status);
    
    // Find by customer ID
    List<Transaction> findByCustomer_IdOrderByCreatedAtDesc(Long customerId);

    default List<Transaction> findByCustomerIdOrderByCreatedAtDesc(Long customerId) {
        return findByCustomer_IdOrderByCreatedAtDesc(customerId);
    }
    
    // Additional methods needed by services
    long countByStatus(Transaction.TransactionStatus status);
    
    @Query("SELECT AVG(t.amount) FROM Transaction t WHERE t.status = :status")
    BigDecimal getAverageAmount(@Param("status") Transaction.TransactionStatus status);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.createdAt >= :date")
    long countByCreatedAtAfter(@Param("date") LocalDateTime date);
}