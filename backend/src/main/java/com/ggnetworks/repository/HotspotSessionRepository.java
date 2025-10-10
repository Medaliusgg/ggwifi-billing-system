package com.ggnetworks.repository;

import com.ggnetworks.entity.HotspotSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HotspotSessionRepository extends JpaRepository<HotspotSession, Long> {

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.voucher.id = :voucherId AND hs.deletedAt IS NULL")
    List<HotspotSession> findByVoucherId(@Param("voucherId") Long voucherId);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.macAddress = :macAddress AND hs.status = 'ONLINE' AND hs.deletedAt IS NULL")
    Optional<HotspotSession> findActiveSessionByMacAddress(@Param("macAddress") String macAddress);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.voucher.id = :voucherId AND hs.status = 'ONLINE' AND hs.deletedAt IS NULL")
    List<HotspotSession> findActiveSessionsByVoucherId(@Param("voucherId") Long voucherId);

    // Add missing method
    @Query("SELECT hs FROM HotspotSession hs WHERE hs.voucher.id = :voucherId AND hs.macAddress = :macAddress AND hs.deletedAt IS NULL")
    Optional<HotspotSession> findByVoucherIdAndMacAddressAndDeletedAtIsNull(@Param("voucherId") Long voucherId, @Param("macAddress") String macAddress);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.voucher.id = :voucherId AND hs.status = :status AND hs.deletedAt IS NULL")
    Optional<HotspotSession> findByVoucherIdAndStatusAndDeletedAtIsNull(@Param("voucherId") Long voucherId, @Param("status") HotspotSession.SessionStatus status);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.status = :status AND hs.deletedAt IS NULL")
    List<HotspotSession> findByStatus(@Param("status") HotspotSession.SessionStatus status);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.startTime >= :startDate AND hs.deletedAt IS NULL")
    List<HotspotSession> findByStartTimeAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.startTime BETWEEN :startDate AND :endDate AND hs.deletedAt IS NULL")
    List<HotspotSession> findByStartTimeBetween(@Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(hs) FROM HotspotSession hs WHERE hs.status = 'ONLINE' AND hs.deletedAt IS NULL")
    long countActiveSessions();

    @Query("SELECT COUNT(hs) FROM HotspotSession hs WHERE hs.voucher.id = :voucherId AND hs.deletedAt IS NULL")
    long countByVoucherId(@Param("voucherId") Long voucherId);

    @Query("SELECT SUM(hs.dataUsageMb) FROM HotspotSession hs WHERE hs.voucher.id = :voucherId AND hs.deletedAt IS NULL")
    Long sumDataUsageByVoucherId(@Param("voucherId") Long voucherId);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.deletedAt IS NULL")
    Page<HotspotSession> findAllActive(Pageable pageable);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.macAddress LIKE %:macAddress% AND hs.deletedAt IS NULL")
    Page<HotspotSession> findByMacAddressContaining(@Param("macAddress") String macAddress, Pageable pageable);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.ipAddress = :ipAddress AND hs.deletedAt IS NULL")
    List<HotspotSession> findByIpAddress(@Param("ipAddress") String ipAddress);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.endTime IS NULL AND hs.deletedAt IS NULL")
    List<HotspotSession> findSessionsWithoutEndTime();

    // Additional methods for HotspotSessionService
    @Query("SELECT hs FROM HotspotSession hs WHERE hs.voucher.voucherCode = :voucherCode AND hs.macAddress = :macAddress AND hs.deletedAt IS NULL")
    Optional<HotspotSession> findByVoucherVoucherCodeAndMacAddress(@Param("voucherCode") String voucherCode, @Param("macAddress") String macAddress);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.voucher.id = :voucherId AND hs.status = :status AND hs.deletedAt IS NULL")
    Optional<HotspotSession> findByVoucherIdAndStatus(@Param("voucherId") Long voucherId, @Param("status") HotspotSession.SessionStatus status);

    @Query("SELECT COUNT(hs) FROM HotspotSession hs WHERE hs.status = :status AND hs.deletedAt IS NULL")
    long countByStatus(@Param("status") HotspotSession.SessionStatus status);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.voucher.assignedTo = :assignedTo AND hs.deletedAt IS NULL")
    List<HotspotSession> findByVoucherAssignedToAndDeletedAtIsNull(@Param("assignedTo") String assignedTo);

    @Query("SELECT hs FROM HotspotSession hs WHERE hs.voucher.assignedTo = :assignedTo AND hs.deletedAt IS NULL")
    Page<HotspotSession> findByVoucherAssignedToAndDeletedAtIsNull(@Param("assignedTo") String assignedTo, Pageable pageable);
} 