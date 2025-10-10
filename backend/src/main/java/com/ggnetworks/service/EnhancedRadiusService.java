package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Enhanced FreeRADIUS integration service for WiFi hotspot billing
 * Handles authentication, accounting, and session management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EnhancedRadiusService {

    private final RadiusUserRepository radiusUserRepository;
    private final RadiusAccountingRepository radiusAccountingRepository;
    private final RadiusReplyRepository radiusReplyRepository;
    private final HotspotVoucherRepository voucherRepository;
    private final HotspotSessionRepository sessionRepository;
    private final PackageRepository packageRepository;
    private final CustomerProfileRepository customerProfileRepository;

    /**
     * Authenticate voucher for hotspot access
     */
    public RadiusAuthResult authenticateVoucher(String voucherCode, String macAddress, String ipAddress, String nasIp) {
        log.info("Authenticating voucher: {} from MAC: {} IP: {} NAS: {}", voucherCode, macAddress, ipAddress, nasIp);

        try {
            // Find voucher in database
            Optional<HotspotVoucher> voucherOpt = voucherRepository.findByVoucherCodeAndDeletedAtIsNull(voucherCode);
            
            if (voucherOpt.isEmpty()) {
                return RadiusAuthResult.builder()
                        .success(false)
                        .message("Invalid voucher code")
                        .build();
            }

            HotspotVoucher voucher = voucherOpt.get();

            // Check voucher status
            if (voucher.getStatus() != HotspotVoucher.VoucherStatus.GENERATED) {
                return RadiusAuthResult.builder()
                        .success(false)
                        .message("Voucher is not available for use")
                        .build();
            }

            // Check expiration
            if (voucher.getExpiresAt().isBefore(LocalDateTime.now())) {
                voucher.setStatus(HotspotVoucher.VoucherStatus.EXPIRED);
                voucherRepository.save(voucher);
                
                return RadiusAuthResult.builder()
                        .success(false)
                        .message("Voucher has expired")
                        .build();
            }

            // Check if voucher is already in use (if MAC binding is enabled)
            if (voucher.getAssignedTo() != null && !voucher.getAssignedTo().equals(macAddress)) {
                return RadiusAuthResult.builder()
                        .success(false)
                        .message("Voucher is already assigned to another device")
                        .build();
            }

            // Get package details
            Package packageEntity = voucher.getPackageEntity();
            if (packageEntity == null) {
                return RadiusAuthResult.builder()
                        .success(false)
                        .message("Voucher package not found")
                        .build();
            }

            // Create RADIUS user entry
            RadiusUser radiusUser = createRadiusUserForVoucher(voucher, macAddress, ipAddress, nasIp);
            radiusUserRepository.save(radiusUser);

            // Create RADIUS reply attributes
            RadiusReply radiusReply = createRadiusReplyForVoucher(voucher, packageEntity);
            radiusReplyRepository.save(radiusReply);

            // Update voucher status
            voucher.setStatus(HotspotVoucher.VoucherStatus.ASSIGNED);
            voucher.setAssignedTo(macAddress);
            voucher.setUsedAt(LocalDateTime.now());
            voucherRepository.save(voucher);

            // Create session record
            HotspotSession session = createHotspotSession(voucher, macAddress, ipAddress, nasIp);
            sessionRepository.save(session);

            // Prepare RADIUS response attributes
            Map<String, String> attributes = new HashMap<>();
            attributes.put("Session-Timeout", String.valueOf(packageEntity.getDurationDays() * 24 * 60 * 60)); // Convert days to seconds
            
            if (packageEntity.getBandwidthLimitMb() != null) {
                attributes.put("WISPr-Bandwidth-Max-Down", String.valueOf(packageEntity.getBandwidthLimitMb() * 1024 * 1024)); // Convert MB to bytes
                attributes.put("WISPr-Bandwidth-Max-Up", String.valueOf(packageEntity.getBandwidthLimitMb() * 1024 * 1024));
            }

            attributes.put("Reply-Message", "Welcome to GGWIFI WiFi");
            attributes.put("Service-Type", "Framed-User");
            attributes.put("Framed-Protocol", "PPP");

            log.info("Voucher authentication successful: {} for MAC: {}", voucherCode, macAddress);

            return RadiusAuthResult.builder()
                    .success(true)
                    .message("Authentication successful")
                    .sessionId(session.getId())
                    .voucherId(voucher.getId())
                    .attributes(attributes)
                    .build();

        } catch (Exception e) {
            log.error("Failed to authenticate voucher: {}", voucherCode, e);
            return RadiusAuthResult.builder()
                    .success(false)
                    .message("Authentication failed: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Authenticate PPPoE user
     */
    public RadiusAuthResult authenticatePppoeUser(String username, String password, String macAddress, String ipAddress, String nasIp) {
        log.info("Authenticating PPPoE user: {} from MAC: {} IP: {} NAS: {}", username, macAddress, ipAddress, nasIp);

        try {
            // Find user in RADIUS database
            Optional<RadiusUser> radiusUserOpt = radiusUserRepository.findByUsernameAndUserType(username, RadiusUser.UserType.PPPOE_USER);
            
            if (radiusUserOpt.isEmpty()) {
                return RadiusAuthResult.builder()
                        .success(false)
                        .message("User not found")
                        .build();
            }

            RadiusUser radiusUser = radiusUserOpt.get();

            // Check if user is active
            if (!Boolean.TRUE.equals(radiusUser.getIsActive())) {
                return RadiusAuthResult.builder()
                        .success(false)
                        .message("User account is inactive")
                        .build();
            }

            // Check expiration
            if (radiusUser.getExpiresAt() != null && radiusUser.getExpiresAt().isBefore(LocalDateTime.now())) {
                return RadiusAuthResult.builder()
                        .success(false)
                        .message("User account has expired")
                        .build();
            }

            // Verify password (in production, use proper password hashing)
            if (!password.equals(radiusUser.getValue())) {
                return RadiusAuthResult.builder()
                        .success(false)
                        .message("Invalid password")
                        .build();
            }

            // Prepare RADIUS response attributes
            Map<String, String> attributes = new HashMap<>();
            attributes.put("Service-Type", "Framed-User");
            attributes.put("Framed-Protocol", "PPP");
            attributes.put("Framed-IP-Address", "192.168.10.1"); // Default PPPoE IP
            attributes.put("Reply-Message", "Welcome to GGWIFI PPPoE");

            if (radiusUser.getDataLimitMb() != null) {
                attributes.put("WISPr-Bandwidth-Max-Down", String.valueOf(radiusUser.getDataLimitMb() * 1024 * 1024));
                attributes.put("WISPr-Bandwidth-Max-Up", String.valueOf(radiusUser.getDataLimitMb() * 1024 * 1024));
            }

            if (radiusUser.getSessionTimeout() != null) {
                attributes.put("Session-Timeout", String.valueOf(radiusUser.getSessionTimeout() * 60)); // Convert minutes to seconds
            }

            log.info("PPPoE user authentication successful: {}", username);

            return RadiusAuthResult.builder()
                    .success(true)
                    .message("Authentication successful")
                    .userId(radiusUser.getId())
                    .attributes(attributes)
                    .build();

        } catch (Exception e) {
            log.error("Failed to authenticate PPPoE user: {}", username, e);
            return RadiusAuthResult.builder()
                    .success(false)
                    .message("Authentication failed: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Handle RADIUS accounting start
     */
    public void handleAccountingStart(RadiusAccounting accounting) {
        try {
            log.info("Accounting start for user: {} session: {}", accounting.getUsername(), accounting.getAcctSessionId());

            // Create or update accounting record
            RadiusAccounting existing = radiusAccountingRepository
                    .findByAcctSessionIdAndAcctStatusType(accounting.getAcctSessionId(), "Start")
                    .orElse(null);

            if (existing != null) {
                // Update existing record
                existing.setAcctStatusType("Start");
                existing.setAcctStartTime(LocalDateTime.now());
                existing.setAcctSessionTime(0L);
                existing.setAcctInputOctets(0L);
                existing.setAcctOutputOctets(0L);
                radiusAccountingRepository.save(existing);
            } else {
                // Create new record
                accounting.setAcctStatusType("Start");
                accounting.setAcctStartTime(LocalDateTime.now());
                accounting.setAcctSessionTime(0L);
                accounting.setAcctInputOctets(0L);
                accounting.setAcctOutputOctets(0L);
                radiusAccountingRepository.save(accounting);
            }

            // Update hotspot session if it's a voucher-based session
            if (accounting.getUsername().startsWith("voucher_")) {
                updateHotspotSessionStart(accounting);
            }

        } catch (Exception e) {
            log.error("Failed to handle accounting start", e);
        }
    }

    /**
     * Handle RADIUS accounting interim update
     */
    public void handleAccountingInterimUpdate(RadiusAccounting accounting) {
        try {
            log.info("Accounting interim update for user: {} session: {}", accounting.getUsername(), accounting.getAcctSessionId());

            // Update accounting record
            Optional<RadiusAccounting> existingOpt = radiusAccountingRepository
                    .findByAcctSessionIdAndAcctStatusType(accounting.getAcctSessionId(), "Start");

            if (existingOpt.isPresent()) {
                RadiusAccounting existing = existingOpt.get();
                existing.setAcctStatusType("Interim-Update");
                existing.setAcctSessionTime(accounting.getAcctSessionTime());
                existing.setAcctInputOctets(accounting.getAcctInputOctets());
                existing.setAcctOutputOctets(accounting.getAcctOutputOctets());
                existing.setAcctLastUpdateTime(LocalDateTime.now());
                radiusAccountingRepository.save(existing);

                // Update hotspot session
                updateHotspotSessionUsage(accounting);
            }

        } catch (Exception e) {
            log.error("Failed to handle accounting interim update", e);
        }
    }

    /**
     * Handle RADIUS accounting stop
     */
    public void handleAccountingStop(RadiusAccounting accounting) {
        try {
            log.info("Accounting stop for user: {} session: {}", accounting.getUsername(), accounting.getAcctSessionId());

            // Update accounting record
            Optional<RadiusAccounting> existingOpt = radiusAccountingRepository
                    .findByAcctSessionIdAndAcctStatusType(accounting.getAcctSessionId(), "Start");

            if (existingOpt.isPresent()) {
                RadiusAccounting existing = existingOpt.get();
                existing.setAcctStatusType("Stop");
                existing.setAcctStopTime(LocalDateTime.now());
                existing.setAcctSessionTime(accounting.getAcctSessionTime());
                existing.setAcctInputOctets(accounting.getAcctInputOctets());
                existing.setAcctOutputOctets(accounting.getAcctOutputOctets());
                radiusAccountingRepository.save(existing);

                // Update hotspot session
                updateHotspotSessionEnd(accounting);
            }

        } catch (Exception e) {
            log.error("Failed to handle accounting stop", e);
        }
    }

    /**
     * Disconnect user session
     */
    public boolean disconnectUser(String username, String macAddress, String nasIp) {
        try {
            log.info("Disconnecting user: {} MAC: {} NAS: {}", username, macAddress, nasIp);

            // Find active session
            Optional<HotspotSession> sessionOpt = sessionRepository
                    .findByMacAddressAndStatusAndDeletedAtIsNull(macAddress, HotspotSession.SessionStatus.ONLINE);

            if (sessionOpt.isPresent()) {
                HotspotSession session = sessionOpt.get();
                session.setStatus(HotspotSession.SessionStatus.OFFLINE);
                session.setEndTime(LocalDateTime.now());
                sessionRepository.save(session);

                // Update voucher if it's voucher-based
                if (session.getVoucher() != null) {
                    HotspotVoucher voucher = session.getVoucher();
                    voucher.setStatus(HotspotVoucher.VoucherStatus.USED);
                    voucherRepository.save(voucher);
                }

                log.info("User disconnected successfully: {}", username);
                return true;
            }

            return false;
        } catch (Exception e) {
            log.error("Failed to disconnect user: {}", username, e);
            return false;
        }
    }

    /**
     * Get active sessions count
     */
    public long getActiveSessionsCount() {
        return sessionRepository.countByStatusAndDeletedAtIsNull(HotspotSession.SessionStatus.ONLINE);
    }

    /**
     * Get active sessions by router/location
     */
    public List<HotspotSession> getActiveSessionsByLocation(String location) {
        return sessionRepository.findByStatusAndDeletedAtIsNull(HotspotSession.SessionStatus.ONLINE)
                .stream()
                .filter(session -> {
                    // Filter by location if router information is available
                    // This would need to be enhanced based on your router-location mapping
                    return true; // Placeholder
                })
                .toList();
    }

    /**
     * Cleanup expired sessions
     */
    @Transactional
    public void cleanupExpiredSessions() {
        try {
            LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);
            
            List<HotspotSession> expiredSessions = sessionRepository
                    .findByStatusAndLastUpdateTimeBeforeAndDeletedAtIsNull(HotspotSession.SessionStatus.ONLINE, cutoffTime);

            for (HotspotSession session : expiredSessions) {
                session.setStatus(HotspotSession.SessionStatus.OFFLINE);
                session.setEndTime(LocalDateTime.now());
                sessionRepository.save(session);

                // Update voucher status
                if (session.getVoucher() != null) {
                    HotspotVoucher voucher = session.getVoucher();
                    voucher.setStatus(HotspotVoucher.VoucherStatus.USED);
                    voucherRepository.save(voucher);
                }
            }

            log.info("Cleaned up {} expired sessions", expiredSessions.size());
        } catch (Exception e) {
            log.error("Failed to cleanup expired sessions", e);
        }
    }

    // Private helper methods
    private RadiusUser createRadiusUserForVoucher(HotspotVoucher voucher, String macAddress, String ipAddress, String nasIp) {
        RadiusUser radiusUser = new RadiusUser();
        radiusUser.setUsername("voucher_" + voucher.getVoucherCode());
        radiusUser.setAttribute("User-Password");
        radiusUser.setOp("==");
        radiusUser.setValue(""); // No password for vouchers
        radiusUser.setUserType(RadiusUser.UserType.HOTSPOT_USER);
        radiusUser.setNasIdentifier("GGNetworks-Hotspot");
        radiusUser.setMacAddress(macAddress);
        radiusUser.setIpAddress(ipAddress);
        radiusUser.setExpiresAt(voucher.getExpiresAt());
        radiusUser.setIsActive(true);
        radiusUser.setPackageId(voucher.getPackageEntity().getId());
        
        return radiusUser;
    }

    private RadiusReply createRadiusReplyForVoucher(HotspotVoucher voucher, Package packageEntity) {
        RadiusReply radiusReply = new RadiusReply();
        radiusReply.setUsername("voucher_" + voucher.getVoucherCode());
        radiusReply.setAttribute("Service-Type");
        radiusReply.setOp(":=");
        radiusReply.setValue("Framed-User");
        
        return radiusReply;
    }

    private HotspotSession createHotspotSession(HotspotVoucher voucher, String macAddress, String ipAddress, String nasIp) {
        HotspotSession session = new HotspotSession();
        session.setVoucher(voucher);
        session.setMacAddress(macAddress);
        session.setIpAddress(ipAddress);
        session.setStatus(HotspotSession.SessionStatus.ONLINE);
        session.setDataUsageMb(0L);
        session.setStartTime(LocalDateTime.now());
        
        return session;
    }

    private void updateHotspotSessionStart(RadiusAccounting accounting) {
        try {
            String voucherCode = accounting.getUsername().replace("voucher_", "");
            Optional<HotspotVoucher> voucherOpt = voucherRepository.findByVoucherCodeAndDeletedAtIsNull(voucherCode);
            
            if (voucherOpt.isPresent()) {
                Optional<HotspotSession> sessionOpt = sessionRepository
                        .findByVoucherAndStatusAndDeletedAtIsNull(voucherOpt.get(), HotspotSession.SessionStatus.ONLINE);
                
                if (sessionOpt.isPresent()) {
                    HotspotSession session = sessionOpt.get();
                    session.setStartTime(LocalDateTime.now());
                    sessionRepository.save(session);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to update hotspot session start", e);
        }
    }

    private void updateHotspotSessionUsage(RadiusAccounting accounting) {
        try {
            String voucherCode = accounting.getUsername().replace("voucher_", "");
            Optional<HotspotVoucher> voucherOpt = voucherRepository.findByVoucherCodeAndDeletedAtIsNull(voucherCode);
            
            if (voucherOpt.isPresent()) {
                Optional<HotspotSession> sessionOpt = sessionRepository
                        .findByVoucherAndStatusAndDeletedAtIsNull(voucherOpt.get(), HotspotSession.SessionStatus.ONLINE);
                
                if (sessionOpt.isPresent()) {
                    HotspotSession session = sessionOpt.get();
                    long totalBytes = (accounting.getAcctInputOctets() != null ? accounting.getAcctInputOctets() : 0) +
                                    (accounting.getAcctOutputOctets() != null ? accounting.getAcctOutputOctets() : 0);
                    session.setDataUsageMb(totalBytes / (1024 * 1024)); // Convert bytes to MB
                    session.setLastUpdateTime(LocalDateTime.now());
                    sessionRepository.save(session);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to update hotspot session usage", e);
        }
    }

    private void updateHotspotSessionEnd(RadiusAccounting accounting) {
        try {
            String voucherCode = accounting.getUsername().replace("voucher_", "");
            Optional<HotspotVoucher> voucherOpt = voucherRepository.findByVoucherCodeAndDeletedAtIsNull(voucherCode);
            
            if (voucherOpt.isPresent()) {
                Optional<HotspotSession> sessionOpt = sessionRepository
                        .findByVoucherAndStatusAndDeletedAtIsNull(voucherOpt.get(), HotspotSession.SessionStatus.ONLINE);
                
                if (sessionOpt.isPresent()) {
                    HotspotSession session = sessionOpt.get();
                    session.setStatus(HotspotSession.SessionStatus.OFFLINE);
                    session.setEndTime(LocalDateTime.now());
                    
                    long totalBytes = (accounting.getAcctInputOctets() != null ? accounting.getAcctInputOctets() : 0) +
                                    (accounting.getAcctOutputOctets() != null ? accounting.getAcctOutputOctets() : 0);
                    session.setDataUsageMb(totalBytes / (1024 * 1024));
                    
                    sessionRepository.save(session);

                    // Update voucher status
                    HotspotVoucher voucher = voucherOpt.get();
                    voucher.setStatus(HotspotVoucher.VoucherStatus.USED);
                    voucherRepository.save(voucher);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to update hotspot session end", e);
        }
    }

    // Result class for RADIUS authentication
    public static class RadiusAuthResult {
        private boolean success;
        private String message;
        private Long sessionId;
        private Long userId;
        private Long voucherId;
        private Map<String, String> attributes;

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private RadiusAuthResult result = new RadiusAuthResult();

            public Builder success(boolean success) {
                result.success = success;
                return this;
            }

            public Builder message(String message) {
                result.message = message;
                return this;
            }

            public Builder sessionId(Long sessionId) {
                result.sessionId = sessionId;
                return this;
            }

            public Builder userId(Long userId) {
                result.userId = userId;
                return this;
            }

            public Builder voucherId(Long voucherId) {
                result.voucherId = voucherId;
                return this;
            }

            public Builder attributes(Map<String, String> attributes) {
                result.attributes = attributes;
                return this;
            }

            public RadiusAuthResult build() {
                return result;
            }
        }

        // Getters
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public Long getSessionId() { return sessionId; }
        public Long getUserId() { return userId; }
        public Long getVoucherId() { return voucherId; }
        public Map<String, String> getAttributes() { return attributes; }
    }
}
