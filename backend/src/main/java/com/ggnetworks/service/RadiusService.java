package com.ggnetworks.service;

import com.ggnetworks.entity.RadiusUser;
import com.ggnetworks.entity.RadiusAccounting;
import com.ggnetworks.entity.RadiusReply;
import com.ggnetworks.repository.RadiusUserRepository;
import com.ggnetworks.repository.RadiusAccountingRepository;
import com.ggnetworks.repository.RadiusReplyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service for FreeRADIUS integration and management
 * Handles user authentication, accounting, and session management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RadiusService {

    private final RadiusUserRepository radiusUserRepository;
    private final RadiusAccountingRepository radiusAccountingRepository;
    private final RadiusReplyRepository radiusReplyRepository;
    
    // ==================== RADIUS AUTHENTICATION ====================

    /**
     * Authenticate a user via RADIUS
     */
    public RadiusAuthResult authenticateUser(String username, String password, String macAddress, String ipAddress) {
        log.info("RADIUS authentication request for user: {}, MAC: {}, IP: {}", username, macAddress, ipAddress);

        try {
            // Check if it's a voucher-based authentication
            if (username.startsWith("voucher_")) {
                return authenticateVoucher(username, password, macAddress, ipAddress);
            }

            // Check if it's a PPPoE user authentication
            return authenticatePppoeUser(username, password, macAddress, ipAddress);

        } catch (Exception e) {
            log.error("RADIUS authentication failed for user: {}", username, e);
            return RadiusAuthResult.builder()
                    .success(false)
                    .message("Authentication failed: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Authenticate voucher-based hotspot access
     */
    private RadiusAuthResult authenticateVoucher(String username, String password, String macAddress, String ipAddress) {
        String voucherCode = username.replace("voucher_", "");
        
        // For now, return a successful authentication
        // TODO: Implement actual voucher validation
        Map<String, String> attributes = new HashMap<>();
        attributes.put("Session-Timeout", "86400"); // 24 hours default
        attributes.put("WISPr-Bandwidth-Max-Down", "1048576"); // 1MB in bytes
        attributes.put("WISPr-Bandwidth-Max-Up", "1048576"); // 1MB in bytes

        log.info("Voucher authentication successful for: {}", voucherCode);
        
        return RadiusAuthResult.builder()
                .success(true)
                .message("Authentication successful")
                .sessionId(1L) // TODO: Generate actual session ID
                .attributes(attributes)
                .build();
    }

    /**
     * Authenticate PPPoE user
     */
    private RadiusAuthResult authenticatePppoeUser(String username, String password, String macAddress, String ipAddress) {
        // For now, return a successful authentication
        // TODO: Implement actual PPPoE user validation
        Map<String, String> attributes = new HashMap<>();
        attributes.put("Session-Timeout", "86400"); // 24 hours default
        
        log.info("PPPoE authentication successful for: {}", username);
        
        return RadiusAuthResult.builder()
                .success(true)
                .message("Authentication successful")
                .userId(1L) // TODO: Get actual user ID
                .attributes(attributes)
                .build();
    }

    /**
     * Disconnect a user session
     */
    public boolean disconnectUser(String username, String macAddress) {
        log.info("Disconnecting user: {}, MAC: {}", username, macAddress);

        try {
            if (username.startsWith("voucher_")) {
                return disconnectVoucherUser(username, macAddress);
            } else {
                return disconnectPppoeUser(username, macAddress);
            }
        } catch (Exception e) {
            log.error("Failed to disconnect user: {}", username, e);
            return false;
        }
    }

    private boolean disconnectVoucherUser(String username, String macAddress) {
        // TODO: Implement voucher user disconnection
        log.info("Disconnecting voucher user: {}", username);
        return true;
    }

    private boolean disconnectPppoeUser(String username, String macAddress) {
        // TODO: Implement PPPoE user disconnection
        log.info("Disconnecting PPPoE user: {}", username);
        return true;
    }

    /**
     * Result class for RADIUS authentication
     */
    public static class RadiusAuthResult {
        private boolean success;
        private String message;
        private Long sessionId;
        private Long userId;
        private Map<String, String> attributes;

        // Builder pattern
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
        public Map<String, String> getAttributes() { return attributes; }
    }
    
    // ==================== RADIUS USER MANAGEMENT ====================
    
    /**
     * Create a new RADIUS user
     */
    public RadiusUser createRadiusUser(RadiusUser radiusUser) {
        log.info("Creating RADIUS user: {}", radiusUser.getUsername());
        return radiusUserRepository.save(radiusUser);
    }
    
    /**
     * Find RADIUS user by username
     */
    public Optional<RadiusUser> findRadiusUserByUsername(String username) {
        return radiusUserRepository.findByUsername(username);
    }
    
    /**
     * Find RADIUS user by username and attribute
     */
    public Optional<RadiusUser> findRadiusUserByUsernameAndAttribute(String username, String attribute) {
        return radiusUserRepository.findByUsernameAndAttribute(username, attribute);
    }
    
    /**
     * Find all active RADIUS users
     */
    public List<RadiusUser> findAllActiveRadiusUsers() {
        return radiusUserRepository.findByIsActiveTrue();
    }
    
    /**
     * Find RADIUS users by user type
     */
    public List<RadiusUser> findRadiusUsersByType(RadiusUser.UserType userType) {
        return radiusUserRepository.findByUserTypeAndIsActiveTrue(userType);
    }
    
    /**
     * Find RADIUS users by location
     */
    public List<RadiusUser> findRadiusUsersByLocation(Long locationId) {
        return radiusUserRepository.findByLocationId(locationId);
    }
    
    /**
     * Find RADIUS users by router
     */
    public List<RadiusUser> findRadiusUsersByRouter(Long routerId) {
        return radiusUserRepository.findByRouterId(routerId);
    }
    
    /**
     * Find RADIUS users by package
     */
    public List<RadiusUser> findRadiusUsersByPackage(Long packageId) {
        return radiusUserRepository.findByPackageId(packageId);
    }
    
    /**
     * Find expired RADIUS users
     */
    public List<RadiusUser> findExpiredRadiusUsers() {
        return radiusUserRepository.findExpiredUsers(LocalDateTime.now());
    }
    
    /**
     * Find RADIUS users expiring soon
     */
    public List<RadiusUser> findRadiusUsersExpiringSoon(int daysAhead) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusDays(daysAhead);
        return radiusUserRepository.findUsersExpiringSoon(now, future);
    }
    
    /**
     * Find RADIUS user by MAC address
     */
    public Optional<RadiusUser> findRadiusUserByMacAddress(String macAddress) {
        return radiusUserRepository.findByMacAddress(macAddress);
    }
    
    /**
     * Find RADIUS user by IP address
     */
    public Optional<RadiusUser> findRadiusUserByIpAddress(String ipAddress) {
        return radiusUserRepository.findByIpAddress(ipAddress);
    }
    
    /**
     * Find RADIUS users with high data usage
     */
    public List<RadiusUser> findRadiusUsersWithHighDataUsage(Long threshold) {
        return radiusUserRepository.findUsersWithHighDataUsage(threshold);
    }
    
    /**
     * Find RADIUS users with high time usage
     */
    public List<RadiusUser> findRadiusUsersWithHighTimeUsage(Long threshold) {
        return radiusUserRepository.findUsersWithHighTimeUsage(threshold);
    }
    
    /**
     * Count active RADIUS users by type
     */
    public Long countActiveRadiusUsersByType(RadiusUser.UserType userType) {
        return radiusUserRepository.countActiveUsersByType(userType);
    }
    
    /**
     * Count RADIUS users by location
     */
    public Long countRadiusUsersByLocation(Long locationId) {
        return radiusUserRepository.countUsersByLocation(locationId);
    }
    
    /**
     * Count RADIUS users by router
     */
    public Long countRadiusUsersByRouter(Long routerId) {
        return radiusUserRepository.countUsersByRouter(routerId);
    }
    
    /**
     * Update RADIUS user last login
     */
    public void updateRadiusUserLastLogin(String username) {
        radiusUserRepository.updateLastLogin(username, LocalDateTime.now(), LocalDateTime.now());
    }
    
    /**
     * Update RADIUS user last logout
     */
    public void updateRadiusUserLastLogout(String username) {
        radiusUserRepository.updateLastLogout(username, LocalDateTime.now(), LocalDateTime.now());
    }
    
    /**
     * Update RADIUS user data usage
     */
    public void updateRadiusUserDataUsage(String username, Long dataUsageMb) {
        radiusUserRepository.updateDataUsage(username, dataUsageMb, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS user time usage
     */
    public void updateRadiusUserTimeUsage(String username, Long timeUsageMinutes) {
        radiusUserRepository.updateTimeUsage(username, timeUsageMinutes, LocalDateTime.now());
    }
    
    /**
     * Soft delete RADIUS user
     */
    public void softDeleteRadiusUser(String username) {
        radiusUserRepository.softDeleteByUsername(username, LocalDateTime.now());
    }
    
    // ==================== RADIUS ACCOUNTING MANAGEMENT ====================
    
    /**
     * Create a new RADIUS accounting entry
     */
    public RadiusAccounting createRadiusAccounting(RadiusAccounting radiusAccounting) {
        log.info("Creating RADIUS accounting entry for session: {}", radiusAccounting.getAcctSessionId());
        return radiusAccountingRepository.save(radiusAccounting);
    }
    
    /**
     * Find RADIUS accounting by session ID
     */
    public Optional<RadiusAccounting> findRadiusAccountingBySessionId(String sessionId) {
        return radiusAccountingRepository.findByAcctSessionId(sessionId);
    }
    
    /**
     * Find RADIUS accounting by unique ID
     */
    public Optional<RadiusAccounting> findRadiusAccountingByUniqueId(String uniqueId) {
        return radiusAccountingRepository.findByAcctUniqueId(uniqueId);
    }
    
    /**
     * Find all RADIUS accounting entries by username
     */
    public List<RadiusAccounting> findRadiusAccountingByUsername(String username) {
        return radiusAccountingRepository.findByUsername(username);
    }
    
    /**
     * Find active RADIUS sessions
     */
    public List<RadiusAccounting> findActiveRadiusSessions() {
        return radiusAccountingRepository.findActiveSessions();
    }
    
    /**
     * Find completed RADIUS sessions
     */
    public List<RadiusAccounting> findCompletedRadiusSessions() {
        return radiusAccountingRepository.findCompletedSessions();
    }
    
    /**
     * Find RADIUS sessions by date range
     */
    public List<RadiusAccounting> findRadiusSessionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return radiusAccountingRepository.findSessionsByDateRange(startDate, endDate);
    }
    
    /**
     * Find RADIUS sessions by user type
     */
    public List<RadiusAccounting> findRadiusSessionsByUserType(RadiusAccounting.UserType userType) {
        return radiusAccountingRepository.findByUserType(userType);
    }
    
    /**
     * Find RADIUS sessions by location
     */
    public List<RadiusAccounting> findRadiusSessionsByLocation(Long locationId) {
        return radiusAccountingRepository.findByLocationId(locationId);
    }
    
    /**
     * Find RADIUS sessions by router
     */
    public List<RadiusAccounting> findRadiusSessionsByRouter(Long routerId) {
        return radiusAccountingRepository.findByRouterId(routerId);
    }
    
    /**
     * Find RADIUS sessions by package
     */
    public List<RadiusAccounting> findRadiusSessionsByPackage(Long packageId) {
        return radiusAccountingRepository.findByPackageId(packageId);
    }
    
    /**
     * Find RADIUS sessions by voucher
     */
    public List<RadiusAccounting> findRadiusSessionsByVoucher(Long voucherId) {
        return radiusAccountingRepository.findByVoucherId(voucherId);
    }
    
    /**
     * Find RADIUS sessions with high data usage
     */
    public List<RadiusAccounting> findRadiusSessionsWithHighDataUsage(Long threshold) {
        return radiusAccountingRepository.findSessionsWithHighDataUsage(threshold);
    }
    
    /**
     * Find RADIUS sessions with high time usage
     */
    public List<RadiusAccounting> findRadiusSessionsWithHighTimeUsage(Long threshold) {
        return radiusAccountingRepository.findSessionsWithHighTimeUsage(threshold);
    }
    
    /**
     * Find RADIUS sessions with high cost
     */
    public List<RadiusAccounting> findRadiusSessionsWithHighCost(BigDecimal threshold) {
        return radiusAccountingRepository.findSessionsWithHighCost(threshold);
    }
    
    /**
     * Count active RADIUS sessions by user type
     */
    public Long countActiveRadiusSessionsByUserType(RadiusAccounting.UserType userType) {
        return radiusAccountingRepository.countActiveSessionsByUserType(userType);
    }
    
    /**
     * Count active RADIUS sessions by location
     */
    public Long countActiveRadiusSessionsByLocation(Long locationId) {
        return radiusAccountingRepository.countActiveSessionsByLocation(locationId);
    }
    
    /**
     * Count active RADIUS sessions by router
     */
    public Long countActiveRadiusSessionsByRouter(Long routerId) {
        return radiusAccountingRepository.countActiveSessionsByRouter(routerId);
    }
    
    /**
     * Count active RADIUS sessions by package
     */
    public Long countActiveRadiusSessionsByPackage(Long packageId) {
        return radiusAccountingRepository.countActiveSessionsByPackage(packageId);
    }
    
    /**
     * Count active RADIUS sessions by voucher
     */
    public Long countActiveRadiusSessionsByVoucher(Long voucherId) {
        return radiusAccountingRepository.countActiveSessionsByVoucher(voucherId);
    }
    
    /**
     * Sum data usage by user type
     */
    public Long sumDataUsageByUserType(RadiusAccounting.UserType userType) {
        return radiusAccountingRepository.sumDataUsageByUserType(userType);
    }
    
    /**
     * Sum data usage by location
     */
    public Long sumDataUsageByLocation(Long locationId) {
        return radiusAccountingRepository.sumDataUsageByLocation(locationId);
    }
    
    /**
     * Sum data usage by router
     */
    public Long sumDataUsageByRouter(Long routerId) {
        return radiusAccountingRepository.sumDataUsageByRouter(routerId);
    }
    
    /**
     * Sum data usage by package
     */
    public Long sumDataUsageByPackage(Long packageId) {
        return radiusAccountingRepository.sumDataUsageByPackage(packageId);
    }
    
    /**
     * Sum data usage by voucher
     */
    public Long sumDataUsageByVoucher(Long voucherId) {
        return radiusAccountingRepository.sumDataUsageByVoucher(voucherId);
    }
    
    /**
     * Sum time usage by user type
     */
    public Long sumTimeUsageByUserType(RadiusAccounting.UserType userType) {
        return radiusAccountingRepository.sumTimeUsageByUserType(userType);
    }
    
    /**
     * Sum time usage by location
     */
    public Long sumTimeUsageByLocation(Long locationId) {
        return radiusAccountingRepository.sumTimeUsageByLocation(locationId);
    }
    
    /**
     * Sum time usage by router
     */
    public Long sumTimeUsageByRouter(Long routerId) {
        return radiusAccountingRepository.sumTimeUsageByRouter(routerId);
    }
    
    /**
     * Sum time usage by package
     */
    public Long sumTimeUsageByPackage(Long packageId) {
        return radiusAccountingRepository.sumTimeUsageByPackage(packageId);
    }
    
    /**
     * Sum time usage by voucher
     */
    public Long sumTimeUsageByVoucher(Long voucherId) {
        return radiusAccountingRepository.sumTimeUsageByVoucher(voucherId);
    }
    
    /**
     * Sum session cost by user type
     */
    public BigDecimal sumSessionCostByUserType(RadiusAccounting.UserType userType) {
        return radiusAccountingRepository.sumSessionCostByUserType(userType);
    }
    
    /**
     * Sum session cost by location
     */
    public BigDecimal sumSessionCostByLocation(Long locationId) {
        return radiusAccountingRepository.sumSessionCostByLocation(locationId);
    }
    
    /**
     * Sum session cost by router
     */
    public BigDecimal sumSessionCostByRouter(Long routerId) {
        return radiusAccountingRepository.sumSessionCostByRouter(routerId);
    }
    
    /**
     * Sum session cost by package
     */
    public BigDecimal sumSessionCostByPackage(Long packageId) {
        return radiusAccountingRepository.sumSessionCostByPackage(packageId);
    }
    
    /**
     * Sum session cost by voucher
     */
    public BigDecimal sumSessionCostByVoucher(Long voucherId) {
        return radiusAccountingRepository.sumSessionCostByVoucher(voucherId);
    }
    
    /**
     * Update RADIUS accounting billing status
     */
    public void updateRadiusAccountingBillingStatus(Long id, RadiusAccounting.BillingStatus billingStatus) {
        radiusAccountingRepository.updateBillingStatus(id, billingStatus, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS accounting session cost
     */
    public void updateRadiusAccountingSessionCost(Long id, BigDecimal cost) {
        radiusAccountingRepository.updateSessionCost(id, cost, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS accounting data usage
     */
    public void updateRadiusAccountingDataUsage(Long id, Long dataUsageMb) {
        radiusAccountingRepository.updateDataUsage(id, dataUsageMb, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS accounting time usage
     */
    public void updateRadiusAccountingTimeUsage(Long id, Long timeUsageMinutes) {
        radiusAccountingRepository.updateTimeUsage(id, timeUsageMinutes, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS accounting session end time
     */
    public void updateRadiusAccountingSessionEndTime(Long id, LocalDateTime endTime) {
        radiusAccountingRepository.updateSessionEndTime(id, endTime, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS accounting session time
     */
    public void updateRadiusAccountingSessionTime(Long id, Long sessionTime) {
        radiusAccountingRepository.updateSessionTime(id, sessionTime, LocalDateTime.now());
    }
    
    // ==================== RADIUS REPLY MANAGEMENT ====================
    
    /**
     * Create a new RADIUS reply entry
     */
    public RadiusReply createRadiusReply(RadiusReply radiusReply) {
        log.info("Creating RADIUS reply for user: {} with attribute: {}", 
                radiusReply.getUsername(), radiusReply.getAttribute());
        return radiusReplyRepository.save(radiusReply);
    }
    
    /**
     * Find RADIUS replies by username
     */
    public List<RadiusReply> findRadiusRepliesByUsername(String username) {
        return radiusReplyRepository.findByUsername(username);
    }
    
    /**
     * Find RADIUS reply by username and attribute
     */
    public Optional<RadiusReply> findRadiusReplyByUsernameAndAttribute(String username, String attribute) {
        return radiusReplyRepository.findByUsernameAndAttribute(username, attribute);
    }
    
    /**
     * Find all active RADIUS replies
     */
    public List<RadiusReply> findAllActiveRadiusReplies() {
        return radiusReplyRepository.findByIsActiveTrue();
    }
    
    /**
     * Find RADIUS replies by user type
     */
    public List<RadiusReply> findRadiusRepliesByUserType(RadiusReply.UserType userType) {
        return radiusReplyRepository.findByUserTypeAndIsActiveTrue(userType);
    }
    
    /**
     * Find RADIUS replies by attribute
     */
    public List<RadiusReply> findRadiusRepliesByAttribute(String attribute) {
        return radiusReplyRepository.findByAttribute(attribute);
    }
    
    /**
     * Find RADIUS replies by operation
     */
    public List<RadiusReply> findRadiusRepliesByOp(String op) {
        return radiusReplyRepository.findByOp(op);
    }
    
    /**
     * Find RADIUS replies by value
     */
    public List<RadiusReply> findRadiusRepliesByValue(String value) {
        return radiusReplyRepository.findByValue(value);
    }
    
    /**
     * Find RADIUS replies by location
     */
    public List<RadiusReply> findRadiusRepliesByLocation(Long locationId) {
        return radiusReplyRepository.findByLocationId(locationId);
    }
    
    /**
     * Find RADIUS replies by router
     */
    public List<RadiusReply> findRadiusRepliesByRouter(Long routerId) {
        return radiusReplyRepository.findByRouterId(routerId);
    }
    
    /**
     * Find RADIUS replies by package
     */
    public List<RadiusReply> findRadiusRepliesByPackage(Long packageId) {
        return radiusReplyRepository.findByPackageId(packageId);
    }
    
    /**
     * Find RADIUS replies by priority
     */
    public List<RadiusReply> findRadiusRepliesByPriority(Integer priority) {
        return radiusReplyRepository.findByPriority(priority);
    }
    
    /**
     * Find RADIUS replies by priority range
     */
    public List<RadiusReply> findRadiusRepliesByPriorityRange(Integer minPriority, Integer maxPriority) {
        return radiusReplyRepository.findByPriorityRange(minPriority, maxPriority);
    }
    
    /**
     * Count active RADIUS replies by user type
     */
    public Long countActiveRadiusRepliesByUserType(RadiusReply.UserType userType) {
        return radiusReplyRepository.countActiveRepliesByUserType(userType);
    }
    
    /**
     * Count active RADIUS replies by attribute
     */
    public Long countActiveRadiusRepliesByAttribute(String attribute) {
        return radiusReplyRepository.countActiveRepliesByAttribute(attribute);
    }
    
    /**
     * Count active RADIUS replies by operation
     */
    public Long countActiveRadiusRepliesByOp(String op) {
        return radiusReplyRepository.countActiveRepliesByOp(op);
    }
    
    /**
     * Count active RADIUS replies by location
     */
    public Long countActiveRadiusRepliesByLocation(Long locationId) {
        return radiusReplyRepository.countActiveRepliesByLocation(locationId);
    }
    
    /**
     * Count active RADIUS replies by router
     */
    public Long countActiveRadiusRepliesByRouter(Long routerId) {
        return radiusReplyRepository.countActiveRepliesByRouter(routerId);
    }
    
    /**
     * Count active RADIUS replies by package
     */
    public Long countActiveRadiusRepliesByPackage(Long packageId) {
        return radiusReplyRepository.countActiveRepliesByPackage(packageId);
    }
    
    /**
     * Count active RADIUS replies by priority
     */
    public Long countActiveRadiusRepliesByPriority(Integer priority) {
        return radiusReplyRepository.countActiveRepliesByPriority(priority);
    }
    
    /**
     * Find RADIUS replies with highest priority
     */
    public List<RadiusReply> findRadiusRepliesWithHighestPriority() {
        return radiusReplyRepository.findRepliesWithHighestPriority();
    }
    
    /**
     * Find RADIUS replies with lowest priority
     */
    public List<RadiusReply> findRadiusRepliesWithLowestPriority() {
        return radiusReplyRepository.findRepliesWithLowestPriority();
    }
    
    /**
     * Update RADIUS reply priority
     */
    public void updateRadiusReplyPriority(Long id, Integer priority) {
        radiusReplyRepository.updatePriority(id, priority, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS reply value
     */
    public void updateRadiusReplyValue(Long id, String value) {
        radiusReplyRepository.updateValue(id, value, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS reply operation
     */
    public void updateRadiusReplyOp(Long id, String op) {
        radiusReplyRepository.updateOp(id, op, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS reply active status
     */
    public void updateRadiusReplyActiveStatus(Long id, Boolean isActive) {
        radiusReplyRepository.updateActiveStatus(id, isActive, LocalDateTime.now());
    }
    
    /**
     * Update RADIUS reply notes
     */
    public void updateRadiusReplyNotes(Long id, String notes) {
        radiusReplyRepository.updateNotes(id, notes, LocalDateTime.now());
    }
    
    /**
     * Soft delete RADIUS reply by username
     */
    public void softDeleteRadiusReplyByUsername(String username) {
        radiusReplyRepository.softDeleteByUsername(username, LocalDateTime.now());
    }
    
    /**
     * Soft delete RADIUS reply by username and attribute
     */
    public void softDeleteRadiusReplyByUsernameAndAttribute(String username, String attribute) {
        radiusReplyRepository.softDeleteByUsernameAndAttribute(username, attribute, LocalDateTime.now());
    }

    // ==================== STATISTICS AND COUNTING METHODS ====================

    /**
     * Count all radius users
     */
    public long countAllRadiusUsers() {
        return radiusUserRepository.count();
    }

    /**
     * Count all radius accounting entries
     */
    public long countAllRadiusAccounting() {
        return radiusAccountingRepository.count();
    }

    /**
     * Count all radius replies
     */
    public long countAllRadiusReplies() {
        return radiusReplyRepository.count();
    }

    /**
     * Count active radius users
     */
    public long countActiveRadiusUsers() {
        return radiusUserRepository.countByIsActiveTrue();
    }

    /**
     * Count users by type
     */
    public long countUsersByType(RadiusUser.UserType userType) {
        return radiusUserRepository.countByUserType(userType);
    }

    /**
     * Count active sessions
     */
    public long countActiveSessions() {
        return radiusAccountingRepository.countByAcctstoptimeIsNull();
    }

    /**
     * Count sessions by date range
     */
    public long countSessionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return radiusAccountingRepository.countByAcctstarttimeBetween(startDate, endDate);
    }

    /**
     * Get total data usage
     */
    public long getTotalDataUsage() {
        Long result = radiusAccountingRepository.sumDataUsageMb();
        return result != null ? result : 0L;
    }

    /**
     * Get total time usage
     */
    public long getTotalTimeUsage() {
        Long result = radiusAccountingRepository.sumTimeUsageMinutes();
        return result != null ? result : 0L;
    }

    /**
     * Get all radius users with pagination
     */
    public org.springframework.data.domain.Page<RadiusUser> getAllRadiusUsers(org.springframework.data.domain.Pageable pageable) {
        return radiusUserRepository.findAll(pageable);
    }



    /**
     * Get active sessions
     */
    public List<RadiusAccounting> getActiveSessions() {
        return radiusAccountingRepository.findActiveSessions();
    }

    /**
     * Get sessions by username
     */
    public List<RadiusAccounting> getSessionsByUsername(String username) {
        return radiusAccountingRepository.findByUsernameOrderByAcctstarttimeDesc(username);
    }

} 