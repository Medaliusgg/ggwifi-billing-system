package com.ggnetworks.repository;

import com.ggnetworks.entity.VoucherSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherSessionRepository extends JpaRepository<VoucherSession, Long> {
    
    Optional<VoucherSession> findByVoucherCode(String voucherCode);
    
    List<VoucherSession> findByPhoneNumber(String phoneNumber);
    
    List<VoucherSession> findByPhoneNumberAndIsConnectedTrue(String phoneNumber);
    
    List<VoucherSession> findByPackageId(Long packageId);
    
    List<VoucherSession> findBySessionStatus(VoucherSession.SessionStatus status);
    
    List<VoucherSession> findByIsConnectedTrue();
    
    List<VoucherSession> findByIsConnectedFalse();
    
    List<VoucherSession> findByExpiresAtBefore(LocalDateTime dateTime);
    
    List<VoucherSession> findByExpiresAtAfter(LocalDateTime dateTime);
    
    List<VoucherSession> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<VoucherSession> findByMacAddress(String macAddress);
    
    List<VoucherSession> findByIpAddress(String ipAddress);
    
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.isConnected = true")
    List<VoucherSession> findActiveSessions();
    
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.phoneNumber = :phoneNumber AND vs.isConnected = true")
    List<VoucherSession> findByPhoneNumberAndIsActiveTrue(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.isConnected = true")
    List<VoucherSession> findByIsActiveTrue();
    
    @Query("SELECT COUNT(vs) FROM VoucherSession vs WHERE vs.isConnected = true")
    long countByIsActiveTrue();
    
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.packageId = :routerId AND vs.isConnected = true")
    List<VoucherSession> findByRouterIdAndIsActiveTrue(@Param("routerId") Long routerId);
    
    @Query("SELECT COUNT(vs) FROM VoucherSession vs WHERE vs.sessionStatus = :status")
    long countBySessionStatus(@Param("status") VoucherSession.SessionStatus status);
    
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.expiresAt < :now AND vs.isConnected = true")
    List<VoucherSession> findExpiredActiveSessions(@Param("now") LocalDateTime now);
}
