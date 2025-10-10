package com.ggnetworks.repository;

import com.ggnetworks.entity.Finance;
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
public interface FinanceRepository extends JpaRepository<Finance, Long> {

    Optional<Finance> findByReferenceNumberAndDeletedAtIsNull(String referenceNumber);

    @Query("SELECT f FROM Finance f WHERE f.type = :type AND f.deletedAt IS NULL")
    List<Finance> findByType(@Param("type") Finance.FinanceType type);

    @Query("SELECT f FROM Finance f WHERE f.category = :category AND f.deletedAt IS NULL")
    List<Finance> findByCategory(@Param("category") Finance.FinanceCategory category);

    @Query("SELECT f FROM Finance f WHERE f.status = :status AND f.deletedAt IS NULL")
    List<Finance> findByStatus(@Param("status") Finance.FinanceStatus status);

    @Query("SELECT f FROM Finance f WHERE f.user.id = :userId AND f.deletedAt IS NULL")
    List<Finance> findByUserId(@Param("userId") Long userId);

    @Query("SELECT f FROM Finance f WHERE f.payment.id = :paymentId AND f.deletedAt IS NULL")
    List<Finance> findByPaymentId(@Param("paymentId") Long paymentId);

    @Query("SELECT f FROM Finance f WHERE f.type = :type AND f.category = :category AND f.deletedAt IS NULL")
    List<Finance> findByTypeAndCategory(@Param("type") Finance.FinanceType type, 
                                      @Param("category") Finance.FinanceCategory category);

    @Query("SELECT f FROM Finance f WHERE f.transactionDate >= :startDate AND f.deletedAt IS NULL")
    List<Finance> findByTransactionDateAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT f FROM Finance f WHERE f.transactionDate BETWEEN :startDate AND :endDate AND f.deletedAt IS NULL")
    List<Finance> findByTransactionDateBetween(@Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);

    @Query("SELECT f FROM Finance f WHERE f.amount >= :minAmount AND f.deletedAt IS NULL")
    List<Finance> findByMinimumAmount(@Param("minAmount") BigDecimal minAmount);

    @Query("SELECT f FROM Finance f WHERE f.amount <= :maxAmount AND f.deletedAt IS NULL")
    List<Finance> findByMaximumAmount(@Param("maxAmount") BigDecimal maxAmount);

    @Query("SELECT COUNT(f) FROM Finance f WHERE f.type = :type AND f.deletedAt IS NULL")
    long countByType(@Param("type") Finance.FinanceType type);

    @Query("SELECT COUNT(f) FROM Finance f WHERE f.category = :category AND f.deletedAt IS NULL")
    long countByCategory(@Param("category") Finance.FinanceCategory category);

    @Query("SELECT COUNT(f) FROM Finance f WHERE f.status = :status AND f.deletedAt IS NULL")
    long countByStatus(@Param("status") Finance.FinanceStatus status);

    @Query("SELECT SUM(f.amount) FROM Finance f WHERE f.type = 'INCOME' AND f.status = 'COMPLETED' AND f.deletedAt IS NULL")
    BigDecimal sumTotalIncome();

    @Query("SELECT SUM(f.amount) FROM Finance f WHERE f.type = 'EXPENSE' AND f.status = 'COMPLETED' AND f.deletedAt IS NULL")
    BigDecimal sumTotalExpenses();

    @Query("SELECT SUM(f.amount) FROM Finance f WHERE f.type = :type AND f.status = 'COMPLETED' AND f.deletedAt IS NULL")
    BigDecimal sumByType(@Param("type") Finance.FinanceType type);

    @Query("SELECT SUM(f.amount) FROM Finance f WHERE f.category = :category AND f.status = 'COMPLETED' AND f.deletedAt IS NULL")
    BigDecimal sumByCategory(@Param("category") Finance.FinanceCategory category);

    @Query("SELECT SUM(f.amount) FROM Finance f WHERE f.type = :type AND f.transactionDate >= :startDate AND f.deletedAt IS NULL")
    BigDecimal sumByTypeAndDateAfter(@Param("type") Finance.FinanceType type, 
                                   @Param("startDate") LocalDateTime startDate);

    @Query("SELECT f FROM Finance f WHERE f.deletedAt IS NULL")
    Page<Finance> findAllActive(Pageable pageable);

    @Query("SELECT f FROM Finance f WHERE f.referenceNumber LIKE %:referenceNumber% AND f.deletedAt IS NULL")
    Page<Finance> findByReferenceNumberContaining(@Param("referenceNumber") String referenceNumber, Pageable pageable);

    @Query("SELECT f FROM Finance f WHERE f.description LIKE %:description% AND f.deletedAt IS NULL")
    Page<Finance> findByDescriptionContaining(@Param("description") String description, Pageable pageable);

    @Query("SELECT f FROM Finance f WHERE f.invoiceNumber LIKE %:invoiceNumber% AND f.deletedAt IS NULL")
    Page<Finance> findByInvoiceNumberContaining(@Param("invoiceNumber") String invoiceNumber, Pageable pageable);

    @Query("SELECT f FROM Finance f WHERE f.receiptNumber LIKE %:receiptNumber% AND f.deletedAt IS NULL")
    Page<Finance> findByReceiptNumberContaining(@Param("receiptNumber") String receiptNumber, Pageable pageable);

    @Query("SELECT f FROM Finance f WHERE f.user.phoneNumber = :phoneNumber AND f.deletedAt IS NULL")
    List<Finance> findByUserPhoneNumber(@Param("phoneNumber") String phoneNumber);
} 