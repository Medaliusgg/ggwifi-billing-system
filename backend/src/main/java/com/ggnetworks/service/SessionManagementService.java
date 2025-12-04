package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * SessionManagementService
 * Manages voucher sessions to ensure exact duration, handle MAC/IP changes, and prevent disconnections
 */
@Service
public class SessionManagementService {
    
    private static final Logger logger = LoggerFactory.getLogger(SessionManagementService.class);
    
    @Autowired
    private VoucherSessionRepository voucherSessionRepository;
    
    @Autowired
    private VoucherRepository voucherRepository;
    
    @Autowired
    private InternetPackageRepository internetPackageRepository;
    
    @Autowired
    private EnhancedRadiusService enhancedRadiusService;
    
    @Autowired
    private RadiusAcctRepository radiusAcctRepository;
    
    @Autowired
    private RedisSessionService redisSessionService;
    
    @Autowired
    private DeviceFingerprintService deviceFingerprintService;
    
    @Autowired
    private CoAService coAService;
    
    @Autowired
    private FreeRadiusService freeRadiusService;
    
    /**
     * Create a new session when voucher is activated
     */
    @Transactional
    public VoucherSession createSession(String voucherCode, String phoneNumber, 
                                        String macAddress, String ipAddress) {
        try {
            // Check if session already exists
            Optional<VoucherSession> existingSession = voucherSessionRepository
                .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.ACTIVE);
            
            if (existingSession.isPresent()) {
                VoucherSession session = existingSession.get();
                // Update MAC/IP if changed
                session.updateMacAddress(macAddress);
                session.updateIpAddress(ipAddress);
                session.recordReconnection();
                voucherSessionRepository.save(session);
                logger.info("Reconnected existing session for voucher: {}", voucherCode);
                return session;
            }
            
            // Get voucher details
            Voucher voucher = voucherRepository.findByVoucherCode(voucherCode)
                .orElseThrow(() -> new RuntimeException("Voucher not found: " + voucherCode));
            
            // Get package details
            InternetPackage internetPackage = internetPackageRepository.findById(voucher.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found: " + voucher.getPackageId()));
            
            // Calculate exact duration
            Integer durationDays = internetPackage.getDurationDays() != null 
                ? internetPackage.getDurationDays() 
                : 1; // Default to 1 day if not specified
            
            // Generate radius username
            String radiusUsername = enhancedRadiusService.generateRadiusUsername(phoneNumber, voucherCode);
            
            // Create new session
            VoucherSession session = new VoucherSession(
                voucherCode,
                phoneNumber,
                voucher.getPackageId(),
                durationDays,
                macAddress,
                ipAddress,
                radiusUsername
            );
            
            // Set exact expiration time
            session.setExpiresAt(LocalDateTime.now().plusDays(durationDays));
            
            // Enable persistent session for long-term packages (weekly, monthly, semester)
            if (durationDays >= 7) {
                session.setPersistentSession(true);
                session.setNoReauthenticationRequired(true);
                session.setAutoReconnectEnabled(true);
                logger.info("Persistent session enabled for long-term package ({} days)", durationDays);
            }
            
            voucherSessionRepository.save(session);
            
            // Store in Redis for fast lookups
            redisSessionService.storeSession(session);
            
            logger.info("Created new persistent session for voucher: {}, expires at: {}, token: {}", 
                       voucherCode, session.getExpiresAt(), session.getSessionToken());
            
            return session;
            
        } catch (Exception e) {
            logger.error("Failed to create session for voucher {}: {}", voucherCode, e.getMessage());
            throw new RuntimeException("Failed to create session: " + e.getMessage());
        }
    }
    
    /**
     * Update session with new MAC address (handles MAC randomization)
     * Seamlessly handles private MAC address changes without disconnection
     */
    @Transactional
    public boolean updateMacAddress(String voucherCode, String newMacAddress) {
        try {
            Optional<VoucherSession> sessionOpt = voucherSessionRepository
                .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.ACTIVE);
            
            if (sessionOpt.isEmpty()) {
                // Try paused session
                sessionOpt = voucherSessionRepository
                    .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.PAUSED);
            }
            
            if (sessionOpt.isPresent()) {
                VoucherSession session = sessionOpt.get();
                
                // Check if MAC is already allowed (for MAC randomization)
                if (session.isMacAddressAllowed(newMacAddress)) {
                    // MAC already in allowed list, just update current
                    session.setMacAddress(newMacAddress);
                    session.setLastActivityTime(LocalDateTime.now());
                    session.recordHeartbeat();
                    voucherSessionRepository.save(session);
                    logger.info("MAC address already allowed for voucher {}: {}", voucherCode, newMacAddress);
                    return true;
                }
                
                // New MAC address - add to allowed list and update
                session.updateMacAddress(newMacAddress);
                session.setLastActivityTime(LocalDateTime.now());
                session.recordHeartbeat();
                
                // Ensure session remains active (no disconnection on MAC change)
                if (session.getSessionStatus() != VoucherSession.SessionStatus.ACTIVE) {
                    session.setSessionStatus(VoucherSession.SessionStatus.ACTIVE);
                    session.setIsConnected(true);
                }
                
                voucherSessionRepository.save(session);
                
                logger.info("Updated MAC address for voucher {}: {} -> {} (MAC randomization handled)", 
                           voucherCode, session.getLastMacAddress(), newMacAddress);
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Failed to update MAC address for voucher {}: {}", voucherCode, e.getMessage());
            return false;
        }
    }
    
    /**
     * Update session with new IP address (handles IP changes)
     * Seamlessly handles IP changes without disconnection
     */
    @Transactional
    public boolean updateIpAddress(String voucherCode, String newIpAddress) {
        try {
            Optional<VoucherSession> sessionOpt = voucherSessionRepository
                .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.ACTIVE);
            
            if (sessionOpt.isEmpty()) {
                // Try paused session
                sessionOpt = voucherSessionRepository
                    .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.PAUSED);
            }
            
            if (sessionOpt.isPresent()) {
                VoucherSession session = sessionOpt.get();
                
                // Check if IP is already allowed
                if (session.isIpAddressAllowed(newIpAddress)) {
                    // IP already in allowed list, just update current
                    session.setIpAddress(newIpAddress);
                    session.setLastActivityTime(LocalDateTime.now());
                    session.recordHeartbeat();
                    voucherSessionRepository.save(session);
                    logger.info("IP address already allowed for voucher {}: {}", voucherCode, newIpAddress);
                    return true;
                }
                
                // New IP address - add to allowed list and update
                session.updateIpAddress(newIpAddress);
                session.setLastActivityTime(LocalDateTime.now());
                session.recordHeartbeat();
                
                // Ensure session remains active (no disconnection on IP change)
                if (session.getSessionStatus() != VoucherSession.SessionStatus.ACTIVE) {
                    session.setSessionStatus(VoucherSession.SessionStatus.ACTIVE);
                    session.setIsConnected(true);
                }
                
                voucherSessionRepository.save(session);
                
                logger.info("Updated IP address for voucher {}: {} -> {} (IP change handled)", 
                           voucherCode, session.getLastIpAddress(), newIpAddress);
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Failed to update IP address for voucher {}: {}", voucherCode, e.getMessage());
            return false;
        }
    }
    
    /**
     * Record disconnection (temporary, session remains valid)
     */
    @Transactional
    public boolean recordDisconnection(String voucherCode) {
        try {
            Optional<VoucherSession> sessionOpt = voucherSessionRepository
                .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.ACTIVE);
            
            if (sessionOpt.isPresent()) {
                VoucherSession session = sessionOpt.get();
                session.recordDisconnection();
                voucherSessionRepository.save(session);
                
                logger.info("Recorded disconnection for voucher: {}", voucherCode);
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Failed to record disconnection for voucher {}: {}", voucherCode, e.getMessage());
            return false;
        }
    }
    
    /**
     * Reconnect session after disconnection
     * Seamless reconnection without re-authentication
     */
    @Transactional
    public boolean reconnectSession(String voucherCode, String macAddress, String ipAddress) {
        try {
            Optional<VoucherSession> sessionOpt = voucherSessionRepository
                .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.PAUSED);
            
            if (sessionOpt.isEmpty()) {
                // Try to find active session
                sessionOpt = voucherSessionRepository
                    .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.ACTIVE);
            }
            
            if (sessionOpt.isEmpty()) {
                // Try to find by any status (RECONNECTING, etc.)
                List<VoucherSession> allSessions = voucherSessionRepository.findByVoucherCode(voucherCode);
                sessionOpt = allSessions.stream()
                    .filter(s -> !s.isExpired())
                    .findFirst();
            }
            
            if (sessionOpt.isPresent()) {
                VoucherSession session = sessionOpt.get();
                
                // Check if session is still valid
                if (session.isExpired()) {
                    logger.warn("Cannot reconnect expired session for voucher: {}", voucherCode);
                    return false;
                }
                
                // Update MAC/IP if changed (handles MAC randomization and IP changes)
                if (macAddress != null) {
                    session.updateMacAddress(macAddress);
                }
                if (ipAddress != null) {
                    session.updateIpAddress(ipAddress);
                }
                
                // Reconnect without requiring re-authentication
                session.recordReconnection();
                session.recordHeartbeat();
                session.setSessionStatus(VoucherSession.SessionStatus.ACTIVE);
                session.setIsConnected(true);
                session.setLastActivityTime(LocalDateTime.now());
                
                voucherSessionRepository.save(session);
                
                logger.info("Seamlessly reconnected session for voucher: {} (no re-authentication required)", voucherCode);
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Failed to reconnect session for voucher {}: {}", voucherCode, e.getMessage());
            return false;
        }
    }
    
    /**
     * Record session heartbeat (keeps session alive)
     * Called periodically to maintain session without disconnection
     */
    @Transactional
    public boolean recordHeartbeat(String voucherCode, String macAddress, String ipAddress) {
        try {
            Optional<VoucherSession> sessionOpt = voucherSessionRepository
                .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.ACTIVE);
            
            if (sessionOpt.isEmpty()) {
                sessionOpt = voucherSessionRepository
                    .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.PAUSED);
            }
            
            if (sessionOpt.isPresent()) {
                VoucherSession session = sessionOpt.get();
                
                // Update MAC/IP if changed
                if (macAddress != null) {
                    session.updateMacAddress(macAddress);
                }
                if (ipAddress != null) {
                    session.updateIpAddress(ipAddress);
                }
                
                // Record heartbeat
                session.recordHeartbeat();
                session.setLastActivityTime(LocalDateTime.now());
                
                // Ensure session is active
                if (session.getSessionStatus() != VoucherSession.SessionStatus.ACTIVE) {
                    session.setSessionStatus(VoucherSession.SessionStatus.ACTIVE);
                    session.setIsConnected(true);
                }
                
                voucherSessionRepository.save(session);
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Failed to record heartbeat for voucher {}: {}", voucherCode, e.getMessage());
            return false;
        }
    }
    
    /**
     * Reconnect using session token (no re-authentication required)
     */
    @Transactional
    public boolean reconnectWithToken(String sessionToken, String macAddress, String ipAddress) {
        try {
            // Find session by token
            Optional<VoucherSession> sessionOpt = voucherSessionRepository.findAll().stream()
                .filter(s -> sessionToken.equals(s.getSessionToken()) && !s.isExpired())
                .findFirst();
            
            if (sessionOpt.isPresent()) {
                VoucherSession session = sessionOpt.get();
                
                // Update MAC/IP
                if (macAddress != null) {
                    session.updateMacAddress(macAddress);
                }
                if (ipAddress != null) {
                    session.updateIpAddress(ipAddress);
                }
                
                // Reconnect seamlessly
                session.recordReconnection();
                session.recordHeartbeat();
                session.setSessionStatus(VoucherSession.SessionStatus.ACTIVE);
                session.setIsConnected(true);
                session.setLastActivityTime(LocalDateTime.now());
                
                voucherSessionRepository.save(session);
                
                logger.info("Reconnected session using token for voucher: {} (seamless, no re-auth)", 
                           session.getVoucherCode());
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Failed to reconnect with token: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Get active session by voucher code
     */
    public Optional<VoucherSession> getActiveSession(String voucherCode) {
        return voucherSessionRepository
            .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.ACTIVE);
    }
    
    /**
     * Get session status and remaining time
     */
    public SessionStatusResponse getSessionStatus(String voucherCode) {
        Optional<VoucherSession> sessionOpt = getActiveSession(voucherCode);
        
        if (sessionOpt.isEmpty()) {
            // Check for paused session
            sessionOpt = voucherSessionRepository
                .findByVoucherCodeAndSessionStatus(voucherCode, VoucherSession.SessionStatus.PAUSED);
        }
        
        if (sessionOpt.isPresent()) {
            VoucherSession session = sessionOpt.get();
            SessionStatusResponse response = new SessionStatusResponse();
            response.setActive(session.isActive());
            response.setConnected(session.getIsConnected());
            response.setExpired(session.isExpired());
            response.setRemainingTimeSeconds(session.getRemainingTimeSeconds());
            response.setElapsedTimeSeconds(session.getElapsedTimeSeconds());
            response.setExpiresAt(session.getExpiresAt());
            response.setSessionStatus(session.getSessionStatus());
            response.setMacAddress(session.getMacAddress());
            response.setIpAddress(session.getIpAddress());
            response.setMacChangesCount(session.getMacChangesCount());
            response.setIpChangesCount(session.getIpChangesCount());
            response.setSessionToken(session.getSessionToken());
            response.setPersistentSession(session.getPersistentSession());
            response.setNoReauthenticationRequired(session.getNoReauthenticationRequired());
            response.setHeartbeatIntervalSeconds(session.getHeartbeatIntervalSeconds());
            response.setLastHeartbeatTime(session.getLastHeartbeatTime());
            return response;
        }
        
        return null;
    }
    
    /**
     * Scheduled task: Monitor and maintain sessions to ensure exact duration
     * Runs every minute - ensures no disconnections during valid period
     */
    @Scheduled(fixedRate = 60000) // Every 60 seconds
    @Transactional
    public void monitorSessions() {
        try {
            LocalDateTime now = LocalDateTime.now();
            
            // Find active sessions
            List<VoucherSession> activeSessions = voucherSessionRepository
                .findBySessionStatus(VoucherSession.SessionStatus.ACTIVE);
            
            for (VoucherSession session : activeSessions) {
                // Check if session expired
                if (session.isExpired()) {
                    terminateSession(session.getId());
                    continue;
                }
                
                // Check heartbeat for long-term packages
                if (session.getLastHeartbeatTime() != null && session.getHeartbeatIntervalSeconds() != null) {
                    long secondsSinceHeartbeat = java.time.Duration
                        .between(session.getLastHeartbeatTime(), now).getSeconds();
                    
                    if (secondsSinceHeartbeat > session.getHeartbeatIntervalSeconds()) {
                        // Missed heartbeat - but don't disconnect for persistent sessions
                        if (session.getPersistentSession()) {
                            session.recordMissedHeartbeat();
                            // Only pause if too many missed heartbeats
                            if (session.getMissedHeartbeats() < session.getMaxMissedHeartbeats()) {
                                // Keep session active, just log
                                logger.debug("Missed heartbeat for session {} (persistent session remains active)", 
                                           session.getVoucherCode());
                            }
                        } else {
                            session.recordMissedHeartbeat();
                        }
                    }
                }
                
                // Update last activity time if connected
                if (session.getIsConnected()) {
                    session.setLastActivityTime(now);
                }
                
                // For persistent sessions, don't pause on disconnection
                if (!session.getIsConnected() && session.getPersistentSession()) {
                    // Keep session active even if temporarily disconnected
                    if (session.getSessionStatus() == VoucherSession.SessionStatus.PAUSED) {
                        session.setSessionStatus(VoucherSession.SessionStatus.RECONNECTING);
                        logger.info("Persistent session {} ready for reconnection", session.getVoucherCode());
                    }
                }
                
                voucherSessionRepository.save(session);
            }
            
            // Find and reconnect paused sessions that are still valid
            List<VoucherSession> pausedSessions = voucherSessionRepository
                .findDisconnectedActiveSessions(now);
            
            for (VoucherSession session : pausedSessions) {
                if (session.getAutoReconnectEnabled() && !session.isExpired() && session.getPersistentSession()) {
                    // Attempt to reconnect persistent sessions
                    session.setSessionStatus(VoucherSession.SessionStatus.RECONNECTING);
                    session.setIsConnected(false); // Will be set to true on next heartbeat
                    voucherSessionRepository.save(session);
                    logger.info("Preparing to reconnect persistent session: {}", session.getVoucherCode());
                }
            }
            
        } catch (Exception e) {
            logger.error("Error monitoring sessions: {}", e.getMessage());
        }
    }
    
    /**
     * Scheduled task: Terminate expired sessions
     * Runs every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    @Transactional
    public void terminateExpiredSessions() {
        try {
            LocalDateTime now = LocalDateTime.now();
            List<VoucherSession> expiredSessions = voucherSessionRepository
                .findExpiredSessions(now, VoucherSession.SessionStatus.ACTIVE);
            
            for (VoucherSession session : expiredSessions) {
                terminateSession(session.getId());
            }
            
            logger.info("Terminated {} expired sessions", expiredSessions.size());
            
        } catch (Exception e) {
            logger.error("Error terminating expired sessions: {}", e.getMessage());
        }
    }
    
    /**
     * Terminate a session
     */
    @Transactional
    public boolean terminateSession(Long sessionId) {
        try {
            Optional<VoucherSession> sessionOpt = voucherSessionRepository.findById(sessionId);
            
            if (sessionOpt.isPresent()) {
                VoucherSession session = sessionOpt.get();
                session.setSessionStatus(VoucherSession.SessionStatus.EXPIRED);
                session.setSessionEndTime(LocalDateTime.now());
                session.setIsConnected(false);
                
                // Calculate total session time
                long totalTime = session.getElapsedTimeSeconds();
                session.setTotalSessionTimeSeconds(totalTime);
                
                voucherSessionRepository.save(session);
                
                // Send CoA Disconnect-Request to terminate active RADIUS session
                String radiusUsername = enhancedRadiusService.generateRadiusUsername(
                    session.getPhoneNumber(), session.getVoucherCode());
                
                // Get NAS IP from active RADIUS session
                List<RadiusAcct> activeRadiusSessions = radiusAcctRepository
                    .findActiveSessionsByUsername(radiusUsername);
                Optional<RadiusAcct> activeRadiusSession = activeRadiusSessions.isEmpty() ? 
                    Optional.empty() : Optional.of(activeRadiusSessions.get(0));
                
                if (activeRadiusSession.isPresent()) {
                    String nasIpAddress = activeRadiusSession.get().getNasIpAddress();
                    if (nasIpAddress != null) {
                        // Send CoA to disconnect user immediately
                        coAService.disconnectUser(radiusUsername, nasIpAddress);
                        logger.info("Sent CoA Disconnect-Request for user: {} on NAS: {}", 
                                   radiusUsername, nasIpAddress);
                    }
                }
                
                // Remove RADIUS user
                enhancedRadiusService.removeRadiusUser(session.getPhoneNumber(), session.getVoucherCode());
                
                // Update voucher status
                Optional<Voucher> voucherOpt = voucherRepository.findByVoucherCode(session.getVoucherCode());
                if (voucherOpt.isPresent()) {
                    Voucher voucher = voucherOpt.get();
                    voucher.setStatus(Voucher.VoucherStatus.EXPIRED);
                    voucher.setUsageStatus(Voucher.UsageStatus.EXPIRED);
                    voucherRepository.save(voucher);
                }
                
                logger.info("Terminated session: {}", session.getVoucherCode());
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Failed to terminate session {}: {}", sessionId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Get real-time active sessions from RADIUS accounting table
     */
    public List<Map<String, Object>> getRealTimeActiveSessions() {
        try {
            List<Map<String, Object>> sessions = freeRadiusService.getActiveRadiusSessions();
            
            // Enrich with voucher session data
            for (Map<String, Object> session : sessions) {
                String username = (String) session.get("username");
                if (username != null && username.contains("_")) {
                    // Extract voucher code from username (format: phone_voucher)
                    String[] parts = username.split("_", 2);
                    if (parts.length == 2) {
                        String voucherCode = parts[1];
                        Optional<VoucherSession> voucherSession = getActiveSession(voucherCode);
                        if (voucherSession.isPresent()) {
                            VoucherSession vs = voucherSession.get();
                            session.put("voucherCode", voucherCode);
                            session.put("phoneNumber", vs.getPhoneNumber());
                            session.put("packageId", vs.getPackageId());
                            session.put("remainingTime", vs.getRemainingTimeSeconds());
                            session.put("expiresAt", vs.getExpiresAt());
                        }
                    }
                }
            }
            
            return sessions;
        } catch (Exception e) {
            logger.error("Failed to get real-time active sessions: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Terminate session with CoA (Change of Authorization)
     */
    @Transactional
    public boolean terminateSessionWithCoA(String sessionId, String reason) {
        try {
            // Find session in radacct
            Optional<RadiusAcct> radiusSession = radiusAcctRepository.findByAcctSessionIdAndActive(sessionId);
            
            if (radiusSession.isPresent()) {
                RadiusAcct session = radiusSession.get();
                String username = session.getUsername();
                String nasIpAddress = session.getNasIpAddress();
                
                // Send CoA Disconnect-Request
                boolean coaSent = coAService.disconnectUser(username, nasIpAddress);
                
                if (coaSent) {
                    // Update session status
                    session.setAcctStopTime(LocalDateTime.now());
                    session.setAcctTerminateCause(reason != null ? reason : "Admin-Terminated");
                    radiusAcctRepository.save(session);
                    
                    // Also update voucher session if exists
                    String voucherCode = extractVoucherCodeFromUsername(username);
                    if (voucherCode != null) {
                        Optional<VoucherSession> voucherSession = getActiveSession(voucherCode);
                        if (voucherSession.isPresent()) {
                            terminateSession(voucherSession.get().getId());
                        }
                    }
                    
                    logger.info("Terminated session {} with CoA: {}", sessionId, reason);
                    return true;
                }
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Failed to terminate session with CoA {}: {}", sessionId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Terminate multiple sessions
     */
    @Transactional
    public Map<String, Object> terminateBulkSessions(List<String> sessionIds, String reason) {
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int failCount = 0;
        List<String> failedSessions = new ArrayList<>();
        
        for (String sessionId : sessionIds) {
            boolean success = terminateSessionWithCoA(sessionId, reason);
            if (success) {
                successCount++;
            } else {
                failCount++;
                failedSessions.add(sessionId);
            }
        }
        
        result.put("total", sessionIds.size());
        result.put("success", successCount);
        result.put("failed", failCount);
        result.put("failedSessions", failedSessions);
        
        return result;
    }
    
    /**
     * Extract voucher code from RADIUS username (format: phone_voucher)
     */
    private String extractVoucherCodeFromUsername(String username) {
        if (username != null && username.contains("_")) {
            String[] parts = username.split("_", 2);
            if (parts.length == 2) {
                return parts[1];
            }
        }
        return null;
    }
    
    /**
     * Session status response DTO
     */
    public static class SessionStatusResponse {
        private boolean active;
        private boolean connected;
        private boolean expired;
        private long remainingTimeSeconds;
        private long elapsedTimeSeconds;
        private LocalDateTime expiresAt;
        private VoucherSession.SessionStatus sessionStatus;
        private String macAddress;
        private String ipAddress;
        private int macChangesCount;
        private int ipChangesCount;
        private String sessionToken;
        private boolean persistentSession;
        private boolean noReauthenticationRequired;
        private Integer heartbeatIntervalSeconds;
        private LocalDateTime lastHeartbeatTime;
        
        // Getters and Setters
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
        
        public boolean isConnected() { return connected; }
        public void setConnected(boolean connected) { this.connected = connected; }
        
        public boolean isExpired() { return expired; }
        public void setExpired(boolean expired) { this.expired = expired; }
        
        public long getRemainingTimeSeconds() { return remainingTimeSeconds; }
        public void setRemainingTimeSeconds(long remainingTimeSeconds) { 
            this.remainingTimeSeconds = remainingTimeSeconds; 
        }
        
        public long getElapsedTimeSeconds() { return elapsedTimeSeconds; }
        public void setElapsedTimeSeconds(long elapsedTimeSeconds) { 
            this.elapsedTimeSeconds = elapsedTimeSeconds; 
        }
        
        public LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
        
        public VoucherSession.SessionStatus getSessionStatus() { return sessionStatus; }
        public void setSessionStatus(VoucherSession.SessionStatus sessionStatus) { 
            this.sessionStatus = sessionStatus; 
        }
        
        public String getMacAddress() { return macAddress; }
        public void setMacAddress(String macAddress) { this.macAddress = macAddress; }
        
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
        
        public int getMacChangesCount() { return macChangesCount; }
        public void setMacChangesCount(int macChangesCount) { 
            this.macChangesCount = macChangesCount; 
        }
        
        public int getIpChangesCount() { return ipChangesCount; }
        public void setIpChangesCount(int ipChangesCount) { this.ipChangesCount = ipChangesCount; }
        
        public String getSessionToken() { return sessionToken; }
        public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }
        
        public boolean isPersistentSession() { return persistentSession; }
        public void setPersistentSession(boolean persistentSession) { this.persistentSession = persistentSession; }
        
        public boolean isNoReauthenticationRequired() { return noReauthenticationRequired; }
        public void setNoReauthenticationRequired(boolean noReauthenticationRequired) { 
            this.noReauthenticationRequired = noReauthenticationRequired; 
        }
        
        public Integer getHeartbeatIntervalSeconds() { return heartbeatIntervalSeconds; }
        public void setHeartbeatIntervalSeconds(Integer heartbeatIntervalSeconds) { 
            this.heartbeatIntervalSeconds = heartbeatIntervalSeconds; 
        }
        
        public LocalDateTime getLastHeartbeatTime() { return lastHeartbeatTime; }
        public void setLastHeartbeatTime(LocalDateTime lastHeartbeatTime) { 
            this.lastHeartbeatTime = lastHeartbeatTime; 
        }
    }
}

