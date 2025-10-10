package com.ggnetworks.repository;

import com.ggnetworks.entity.HotspotVoucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HotspotVoucherRepository extends JpaRepository<HotspotVoucher, Long> {

    Optional<HotspotVoucher> findByVoucherCodeAndDeletedAtIsNull(String voucherCode);

    @Query("SELECT hv FROM HotspotVoucher hv WHERE hv.status = :status AND hv.deletedAt IS NULL")
    List<HotspotVoucher> findByStatus(@Param("status") HotspotVoucher.VoucherStatus status);

    @Query("SELECT hv FROM HotspotVoucher hv WHERE hv.packageEntity.id = :packageId AND hv.deletedAt IS NULL")
    List<HotspotVoucher> findByPackageId(@Param("packageId") Long packageId);

    @Query("SELECT hv FROM HotspotVoucher hv WHERE hv.status = :status AND hv.packageEntity.id = :packageId AND hv.deletedAt IS NULL")
    List<HotspotVoucher> findByStatusAndPackageId(@Param("status") HotspotVoucher.VoucherStatus status, 
                                                 @Param("packageId") Long packageId);

    @Query("SELECT hv FROM HotspotVoucher hv WHERE hv.expiresAt < :now AND hv.status = 'GENERATED' AND hv.deletedAt IS NULL")
    List<HotspotVoucher> findExpiredVouchers(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(hv) FROM HotspotVoucher hv WHERE hv.status = :status AND hv.deletedAt IS NULL")
    long countByStatus(@Param("status") HotspotVoucher.VoucherStatus status);

    @Query("SELECT COUNT(hv) FROM HotspotVoucher hv WHERE hv.packageEntity.id = :packageId AND hv.status = :status AND hv.deletedAt IS NULL")
    long countByPackageIdAndStatus(@Param("packageId") Long packageId, 
                                  @Param("status") HotspotVoucher.VoucherStatus status);

    @Query("SELECT hv FROM HotspotVoucher hv WHERE hv.assignedTo = :phoneNumber AND hv.deletedAt IS NULL")
    List<HotspotVoucher> findByAssignedTo(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT hv FROM HotspotVoucher hv WHERE hv.deletedAt IS NULL")
    Page<HotspotVoucher> findAllActive(Pageable pageable);

    @Query("SELECT hv FROM HotspotVoucher hv WHERE hv.voucherCode LIKE %:voucherCode% AND hv.deletedAt IS NULL")
    Page<HotspotVoucher> findByVoucherCodeContaining(@Param("voucherCode") String voucherCode, Pageable pageable);

    @Modifying
    @Query("UPDATE HotspotVoucher hv SET hv.status = 'EXPIRED' WHERE hv.expiresAt < :now AND hv.status = 'GENERATED'")
    void expireVouchers(@Param("now") LocalDateTime now);

    @Query("SELECT hv FROM HotspotVoucher hv WHERE hv.createdAt >= :startDate AND hv.deletedAt IS NULL")
    List<HotspotVoucher> findByCreatedAtAfter(@Param("startDate") LocalDateTime startDate);

    boolean existsByVoucherCodeAndDeletedAtIsNull(String voucherCode);
    
    @Query("SELECT hv FROM HotspotVoucher hv WHERE hv.assignedTo = :phoneNumber AND hv.deletedAt IS NULL")
    org.springframework.data.domain.Page<HotspotVoucher> findByAssignedToAndDeletedAtIsNull(@Param("phoneNumber") String phoneNumber, org.springframework.data.domain.Pageable pageable);
} 