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
    
    // Find active session by voucher code
    Optional<VoucherSession> findByVoucherCodeAndSessionStatus(String voucherCode, VoucherSession.SessionStatus status);
    
    // Find active session by phone number
    List<VoucherSession> findByPhoneNumberAndSessionStatus(String phoneNumber, VoucherSession.SessionStatus status);
    
    // Find active session by MAC address
    Optional<VoucherSession> findByMacAddressAndSessionStatus(String macAddress, VoucherSession.SessionStatus status);
    
    // Find active session by IP address
    Optional<VoucherSession> findByIpAddressAndSessionStatus(String ipAddress, VoucherSession.SessionStatus status);
    
    // Find active session by radius username
    Optional<VoucherSession> findByRadiusUsernameAndSessionStatus(String radiusUsername, VoucherSession.SessionStatus status);
    
    // Find all active sessions
    List<VoucherSession> findBySessionStatus(VoucherSession.SessionStatus status);
    
    // Find sessions expiring soon
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.expiresAt <= :expiryTime AND vs.sessionStatus = :status")
    List<VoucherSession> findSessionsExpiringBefore(@Param("expiryTime") LocalDateTime expiryTime, 
                                                      @Param("status") VoucherSession.SessionStatus status);
    
    // Find expired sessions
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.expiresAt < :now AND vs.sessionStatus = :status")
    List<VoucherSession> findExpiredSessions(@Param("now") LocalDateTime now, 
                                             @Param("status") VoucherSession.SessionStatus status);
    
    // Find sessions by voucher code (all statuses)
    List<VoucherSession> findByVoucherCode(String voucherCode);
    
    // Find sessions by phone number (all statuses)
    List<VoucherSession> findByPhoneNumber(String phoneNumber);
    
    // Find active sessions that need reconnection
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.sessionStatus = 'RECONNECTING' AND vs.autoReconnectEnabled = true")
    List<VoucherSession> findSessionsNeedingReconnection();
    
    // Find disconnected sessions that can be reconnected
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.isConnected = false AND vs.sessionStatus = 'PAUSED' AND vs.expiresAt > :now")
    List<VoucherSession> findDisconnectedActiveSessions(@Param("now") LocalDateTime now);
    
    // Find session by token
    Optional<VoucherSession> findBySessionToken(String sessionToken);
    
    // Find persistent sessions
    @Query("SELECT vs FROM VoucherSession vs WHERE vs.persistentSession = true AND vs.sessionStatus = :status")
    List<VoucherSession> findPersistentSessions(@Param("status") VoucherSession.SessionStatus status);
}

