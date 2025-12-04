package com.ggnetworks.repository;

import com.ggnetworks.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    // Find by voucher code
    Optional<Voucher> findByVoucherCode(String voucherCode);

    // Find by order ID
    List<Voucher> findByOrderId(String orderId);

    // Find by customer phone
    List<Voucher> findByCustomerPhone(String customerPhone);

    // Find by customer phone number (alternative field name)
    List<Voucher> findByCustomerPhoneNumber(String customerPhoneNumber);

    // Find by customer email
    List<Voucher> findByCustomerEmail(String customerEmail);

    // Find by package ID (primary relation-aware)
    List<Voucher> findByInternetPackage_Id(Long packageId);

    // Backward-compatible helper
    default List<Voucher> findByPackageId(Long packageId) {
        return findByInternetPackage_Id(packageId);
    }

    // Find by status
    List<Voucher> findByStatus(Voucher.VoucherStatus status);

    // Find by usage status
    List<Voucher> findByUsageStatus(Voucher.UsageStatus usageStatus);

    // Find active vouchers
    List<Voucher> findByStatusAndUsageStatus(Voucher.VoucherStatus status, Voucher.UsageStatus usageStatus);

    // Find expired vouchers
    @Query("SELECT v FROM Voucher v WHERE v.expiresAt < :now AND v.status = 'ACTIVE'")
    List<Voucher> findExpiredVouchers(@Param("now") LocalDateTime now);

    // Find vouchers by date range
    List<Voucher> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Find vouchers by customer name (case insensitive)
    List<Voucher> findByCustomerNameContainingIgnoreCase(String customerName);

    // Find vouchers by payment reference
    List<Voucher> findByPaymentReference(String paymentReference);

    // Find vouchers by transaction ID
    List<Voucher> findByTransactionId(String transactionId);

    // Count vouchers by status
    long countByStatus(Voucher.VoucherStatus status);

    // Count vouchers by usage status
    long countByUsageStatus(Voucher.UsageStatus usageStatus);

    // Count active vouchers
    @Query("SELECT COUNT(v) FROM Voucher v WHERE v.status = 'ACTIVE' AND v.usageStatus = 'UNUSED' AND (v.expiresAt IS NULL OR v.expiresAt > :now)")
    long countActiveVouchers(@Param("now") LocalDateTime now);

    // Find unused vouchers
    @Query("SELECT v FROM Voucher v WHERE v.status = 'ACTIVE' AND v.usageStatus = 'UNUSED' AND (v.expiresAt IS NULL OR v.expiresAt > :now)")
    List<Voucher> findUnusedVouchers(@Param("now") LocalDateTime now);

    // Check if voucher code exists
    boolean existsByVoucherCode(String voucherCode);

    // Find vouchers by payment channel
    List<Voucher> findByPaymentChannel(String paymentChannel);

    // Find vouchers by amount range
    @Query("SELECT v FROM Voucher v WHERE v.amount BETWEEN :minAmount AND :maxAmount")
    List<Voucher> findByAmountRange(@Param("minAmount") java.math.BigDecimal minAmount, @Param("maxAmount") java.math.BigDecimal maxAmount);

    // Find recent vouchers (last 24 hours)
    @Query("SELECT v FROM Voucher v WHERE v.createdAt >= :since")
    List<Voucher> findRecentVouchers(@Param("since") LocalDateTime since);

    // Find vouchers by customer location
    List<Voucher> findByCustomerLocationContainingIgnoreCase(String location);

    // Analytics queries
    @Query("SELECT COUNT(v) FROM Voucher v WHERE v.createdAt >= :startDate AND v.createdAt <= :endDate")
    long countVouchersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(v.amount) FROM Voucher v WHERE v.status = 'ACTIVE' AND v.createdAt >= :startDate AND v.createdAt <= :endDate")
    java.math.BigDecimal getTotalAmountByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT AVG(v.amount) FROM Voucher v WHERE v.status = 'ACTIVE' AND v.createdAt >= :startDate AND v.createdAt <= :endDate")
    java.math.BigDecimal getAverageAmountByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Dashboard methods
    long countByUsedAtAfter(LocalDateTime date);
    
    // Additional methods needed by services (removed - use existing methods instead)
}