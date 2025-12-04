package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * VoucherSession Entity
 * Tracks active voucher sessions to ensure exact duration and handle MAC/IP changes
 */
@Entity
@Table(name = "voucher_sessions", indexes = {
    @Index(name = "idx_voucher_code", columnList = "voucher_code"),
    @Index(name = "idx_phone_number", columnList = "phone_number"),
    @Index(name = "idx_mac_address", columnList = "mac_address"),
    @Index(name = "idx_session_status", columnList = "session_status"),
    @Index(name = "idx_expires_at", columnList = "expires_at")
})
public class VoucherSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "voucher_code", nullable = false, length = 11)
    private String voucherCode;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "package_id", nullable = false)
    private Long packageId;

    @Column(name = "package_duration_days", nullable = false)
    private Integer packageDurationDays;

    @Column(name = "mac_address", length = 17)
    private String macAddress; // Can change due to MAC randomization

    @Column(name = "ip_address", length = 45)
    private String ipAddress; // Can change during session

    @Column(name = "radius_username", nullable = false, length = 64)
    private String radiusUsername;

    @Column(name = "session_start_time", nullable = false)
    private LocalDateTime sessionStartTime;

    @Column(name = "session_end_time")
    private LocalDateTime sessionEndTime;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt; // Exact expiration time based on package duration

    @Column(name = "total_session_time_seconds")
    private Long totalSessionTimeSeconds = 0L; // Cumulative session time

    @Column(name = "last_activity_time")
    private LocalDateTime lastActivityTime;

    @Column(name = "last_mac_address", length = 17)
    private String lastMacAddress; // Track MAC changes

    @Column(name = "last_ip_address", length = 45)
    private String lastIpAddress; // Track IP changes

    @Column(name = "mac_changes_count")
    private Integer macChangesCount = 0; // Count MAC address changes

    @Column(name = "ip_changes_count")
    private Integer ipChangesCount = 0; // Count IP address changes

    @Enumerated(EnumType.STRING)
    @Column(name = "session_status", nullable = false)
    private SessionStatus sessionStatus = SessionStatus.ACTIVE;

    @Column(name = "is_connected", nullable = false)
    private Boolean isConnected = true;

    @Column(name = "disconnection_count")
    private Integer disconnectionCount = 0;

    @Column(name = "last_disconnection_time")
    private LocalDateTime lastDisconnectionTime;

    @Column(name = "auto_reconnect_enabled", nullable = false)
    private Boolean autoReconnectEnabled = true;

    @Column(name = "session_token", length = 64, unique = true)
    private String sessionToken; // Persistent session token for seamless reconnection

    @Column(name = "allowed_mac_addresses", columnDefinition = "TEXT")
    private String allowedMacAddresses; // JSON array of allowed MAC addresses (for MAC randomization)

    @Column(name = "allowed_ip_addresses", columnDefinition = "TEXT")
    private String allowedIpAddresses; // JSON array of allowed IP addresses (for IP changes)

    @Column(name = "heartbeat_interval_seconds")
    private Integer heartbeatIntervalSeconds = 300; // 5 minutes default

    @Column(name = "last_heartbeat_time")
    private LocalDateTime lastHeartbeatTime;

    @Column(name = "missed_heartbeats")
    private Integer missedHeartbeats = 0;

    @Column(name = "max_missed_heartbeats")
    private Integer maxMissedHeartbeats = 3; // Allow 3 missed heartbeats before pausing

    @Column(name = "persistent_session", nullable = false)
    private Boolean persistentSession = true; // Session persists across disconnections

    @Column(name = "no_reauthentication_required", nullable = false)
    private Boolean noReauthenticationRequired = true; // No frequent logins

    @Column(name = "session_extension_count")
    private Integer sessionExtensionCount = 0; // Track session extensions for long packages

    @Column(name = "connection_quality_score")
    private Double connectionQualityScore = 100.0; // Track connection quality

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Enums
    public enum SessionStatus {
        ACTIVE,           // Session is active and connected
        PAUSED,           // Session paused (temporary disconnection)
        EXPIRED,          // Session expired (duration reached)
        TERMINATED,       // Session manually terminated
        SUSPENDED,        // Session suspended (violation detected)
        RECONNECTING      // Session reconnecting after disconnection
    }

    // Constructors
    public VoucherSession() {
        this.sessionStartTime = LocalDateTime.now();
        this.lastActivityTime = LocalDateTime.now();
    }

    public VoucherSession(String voucherCode, String phoneNumber, Long packageId, 
                          Integer packageDurationDays, String macAddress, String ipAddress, 
                          String radiusUsername) {
        this();
        this.voucherCode = voucherCode;
        this.phoneNumber = phoneNumber;
        this.packageId = packageId;
        this.packageDurationDays = packageDurationDays;
        this.macAddress = macAddress;
        this.ipAddress = ipAddress;
        this.radiusUsername = radiusUsername;
        this.lastMacAddress = macAddress;
        this.lastIpAddress = ipAddress;
        
        // Generate persistent session token
        this.sessionToken = generateSessionToken(voucherCode, phoneNumber);
        
        // Initialize allowed MAC/IP lists
        this.allowedMacAddresses = "[]";
        this.allowedIpAddresses = "[]";
        addAllowedMacAddress(macAddress);
        addAllowedIpAddress(ipAddress);
        
        // Calculate exact expiration time based on package duration
        this.expiresAt = LocalDateTime.now().plusDays(packageDurationDays);
        
        // Set heartbeat interval based on package duration (longer packages = longer intervals)
        if (packageDurationDays >= 30) {
            this.heartbeatIntervalSeconds = 1800; // 30 minutes for monthly/semester packages
        } else if (packageDurationDays >= 7) {
            this.heartbeatIntervalSeconds = 900; // 15 minutes for weekly packages
        } else {
            this.heartbeatIntervalSeconds = 300; // 5 minutes for daily packages
        }
        
        this.lastHeartbeatTime = LocalDateTime.now();
    }
    
    private String generateSessionToken(String voucherCode, String phoneNumber) {
        // Generate unique persistent session token for seamless reconnection
        try {
            String uuid = java.util.UUID.randomUUID().toString().replace("-", "");
            String codePrefix = voucherCode.length() >= 4 ? voucherCode.substring(0, 4) : voucherCode;
            return uuid + codePrefix.toUpperCase();
        } catch (Exception e) {
            // Fallback token generation
            return "SESS_" + System.currentTimeMillis() + "_" + voucherCode;
        }
    }
    
    public void addAllowedMacAddress(String macAddress) {
        if (macAddress != null && !macAddress.isEmpty()) {
            try {
                java.util.List<String> macs = new java.util.ArrayList<>();
                if (allowedMacAddresses != null && !allowedMacAddresses.equals("[]")) {
                    macs = new java.util.ArrayList<>(java.util.Arrays.asList(
                        allowedMacAddresses.replace("[", "").replace("]", "").replace("\"", "").split(",")));
                }
                if (!macs.contains(macAddress)) {
                    macs.add(macAddress);
                }
                this.allowedMacAddresses = java.util.Arrays.toString(macs.toArray());
            } catch (Exception e) {
                // Fallback to simple array
                this.allowedMacAddresses = "[\"" + macAddress + "\"]";
            }
        }
    }
    
    public void addAllowedIpAddress(String ipAddress) {
        if (ipAddress != null && !ipAddress.isEmpty()) {
            try {
                java.util.List<String> ips = new java.util.ArrayList<>();
                if (allowedIpAddresses != null && !allowedIpAddresses.equals("[]")) {
                    ips = new java.util.ArrayList<>(java.util.Arrays.asList(
                        allowedIpAddresses.replace("[", "").replace("]", "").replace("\"", "").split(",")));
                }
                if (!ips.contains(ipAddress)) {
                    ips.add(ipAddress);
                }
                this.allowedIpAddresses = java.util.Arrays.toString(ips.toArray());
            } catch (Exception e) {
                // Fallback to simple array
                this.allowedIpAddresses = "[\"" + ipAddress + "\"]";
            }
        }
    }
    
    public boolean isMacAddressAllowed(String macAddress) {
        if (macAddress == null || allowedMacAddresses == null) return false;
        try {
            String[] macs = allowedMacAddresses.replace("[", "").replace("]", "").replace("\"", "").split(",");
            for (String mac : macs) {
                if (mac.trim().equalsIgnoreCase(macAddress)) return true;
            }
        } catch (Exception e) {
            // If parsing fails, check against current MAC
            return this.macAddress != null && this.macAddress.equalsIgnoreCase(macAddress);
        }
        return false;
    }
    
    public boolean isIpAddressAllowed(String ipAddress) {
        if (ipAddress == null || allowedIpAddresses == null) return false;
        try {
            String[] ips = allowedIpAddresses.replace("[", "").replace("]", "").replace("\"", "").split(",");
            for (String ip : ips) {
                if (ip.trim().equals(ipAddress)) return true;
            }
        } catch (Exception e) {
            // If parsing fails, check against current IP
            return this.ipAddress != null && this.ipAddress.equals(ipAddress);
        }
        return false;
    }
    
    public void recordHeartbeat() {
        this.lastHeartbeatTime = LocalDateTime.now();
        this.missedHeartbeats = 0;
        this.isConnected = true;
        if (this.sessionStatus == SessionStatus.PAUSED || this.sessionStatus == SessionStatus.RECONNECTING) {
            this.sessionStatus = SessionStatus.ACTIVE;
        }
    }
    
    public void recordMissedHeartbeat() {
        this.missedHeartbeats++;
        if (this.missedHeartbeats >= maxMissedHeartbeats) {
            this.isConnected = false;
            this.sessionStatus = SessionStatus.PAUSED;
        }
    }

    // Helper methods
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isActive() {
        return sessionStatus == SessionStatus.ACTIVE && !isExpired() && isConnected;
    }

    public long getRemainingTimeSeconds() {
        if (isExpired()) {
            return 0;
        }
        return java.time.Duration.between(LocalDateTime.now(), expiresAt).getSeconds();
    }

    public long getElapsedTimeSeconds() {
        if (sessionEndTime != null) {
            return java.time.Duration.between(sessionStartTime, sessionEndTime).getSeconds();
        }
        return java.time.Duration.between(sessionStartTime, LocalDateTime.now()).getSeconds();
    }

    public void updateMacAddress(String newMacAddress) {
        if (newMacAddress != null && !newMacAddress.equals(this.macAddress)) {
            this.lastMacAddress = this.macAddress;
            this.macAddress = newMacAddress;
            this.macChangesCount++;
            this.lastActivityTime = LocalDateTime.now();
            // Add to allowed MAC addresses (for MAC randomization support)
            addAllowedMacAddress(newMacAddress);
        }
    }

    public void updateIpAddress(String newIpAddress) {
        if (newIpAddress != null && !newIpAddress.equals(this.ipAddress)) {
            this.lastIpAddress = this.ipAddress;
            this.ipAddress = newIpAddress;
            this.ipChangesCount++;
            this.lastActivityTime = LocalDateTime.now();
            // Add to allowed IP addresses (for IP change support)
            addAllowedIpAddress(newIpAddress);
        }
    }

    public void recordDisconnection() {
        this.isConnected = false;
        this.disconnectionCount++;
        this.lastDisconnectionTime = LocalDateTime.now();
        this.sessionStatus = SessionStatus.PAUSED;
    }

    public void recordReconnection() {
        this.isConnected = true;
        this.lastActivityTime = LocalDateTime.now();
        this.sessionStatus = SessionStatus.ACTIVE;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVoucherCode() { return voucherCode; }
    public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public Integer getPackageDurationDays() { return packageDurationDays; }
    public void setPackageDurationDays(Integer packageDurationDays) { 
        this.packageDurationDays = packageDurationDays; 
    }

    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getRadiusUsername() { return radiusUsername; }
    public void setRadiusUsername(String radiusUsername) { this.radiusUsername = radiusUsername; }

    public LocalDateTime getSessionStartTime() { return sessionStartTime; }
    public void setSessionStartTime(LocalDateTime sessionStartTime) { 
        this.sessionStartTime = sessionStartTime; 
    }

    public LocalDateTime getSessionEndTime() { return sessionEndTime; }
    public void setSessionEndTime(LocalDateTime sessionEndTime) { 
        this.sessionEndTime = sessionEndTime; 
    }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Long getTotalSessionTimeSeconds() { return totalSessionTimeSeconds; }
    public void setTotalSessionTimeSeconds(Long totalSessionTimeSeconds) { 
        this.totalSessionTimeSeconds = totalSessionTimeSeconds; 
    }

    public LocalDateTime getLastActivityTime() { return lastActivityTime; }
    public void setLastActivityTime(LocalDateTime lastActivityTime) { 
        this.lastActivityTime = lastActivityTime; 
    }

    public String getLastMacAddress() { return lastMacAddress; }
    public void setLastMacAddress(String lastMacAddress) { this.lastMacAddress = lastMacAddress; }

    public String getLastIpAddress() { return lastIpAddress; }
    public void setLastIpAddress(String lastIpAddress) { this.lastIpAddress = lastIpAddress; }

    public Integer getMacChangesCount() { return macChangesCount; }
    public void setMacChangesCount(Integer macChangesCount) { 
        this.macChangesCount = macChangesCount; 
    }

    public Integer getIpChangesCount() { return ipChangesCount; }
    public void setIpChangesCount(Integer ipChangesCount) { this.ipChangesCount = ipChangesCount; }

    public SessionStatus getSessionStatus() { return sessionStatus; }
    public void setSessionStatus(SessionStatus sessionStatus) { 
        this.sessionStatus = sessionStatus; 
    }

    public Boolean getIsConnected() { return isConnected; }
    public void setIsConnected(Boolean isConnected) { this.isConnected = isConnected; }

    public Integer getDisconnectionCount() { return disconnectionCount; }
    public void setDisconnectionCount(Integer disconnectionCount) { 
        this.disconnectionCount = disconnectionCount; 
    }

    public LocalDateTime getLastDisconnectionTime() { return lastDisconnectionTime; }
    public void setLastDisconnectionTime(LocalDateTime lastDisconnectionTime) { 
        this.lastDisconnectionTime = lastDisconnectionTime; 
    }

    public Boolean getAutoReconnectEnabled() { return autoReconnectEnabled; }
    public void setAutoReconnectEnabled(Boolean autoReconnectEnabled) { 
        this.autoReconnectEnabled = autoReconnectEnabled; 
    }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }

    public String getAllowedMacAddresses() { return allowedMacAddresses; }
    public void setAllowedMacAddresses(String allowedMacAddresses) { this.allowedMacAddresses = allowedMacAddresses; }

    public String getAllowedIpAddresses() { return allowedIpAddresses; }
    public void setAllowedIpAddresses(String allowedIpAddresses) { this.allowedIpAddresses = allowedIpAddresses; }

    public Integer getHeartbeatIntervalSeconds() { return heartbeatIntervalSeconds; }
    public void setHeartbeatIntervalSeconds(Integer heartbeatIntervalSeconds) { this.heartbeatIntervalSeconds = heartbeatIntervalSeconds; }

    public LocalDateTime getLastHeartbeatTime() { return lastHeartbeatTime; }
    public void setLastHeartbeatTime(LocalDateTime lastHeartbeatTime) { this.lastHeartbeatTime = lastHeartbeatTime; }

    public Integer getMissedHeartbeats() { return missedHeartbeats; }
    public void setMissedHeartbeats(Integer missedHeartbeats) { this.missedHeartbeats = missedHeartbeats; }

    public Integer getMaxMissedHeartbeats() { return maxMissedHeartbeats; }
    public void setMaxMissedHeartbeats(Integer maxMissedHeartbeats) { this.maxMissedHeartbeats = maxMissedHeartbeats; }

    public Boolean getPersistentSession() { return persistentSession; }
    public void setPersistentSession(Boolean persistentSession) { this.persistentSession = persistentSession; }

    public Boolean getNoReauthenticationRequired() { return noReauthenticationRequired; }
    public void setNoReauthenticationRequired(Boolean noReauthenticationRequired) { this.noReauthenticationRequired = noReauthenticationRequired; }

    public Integer getSessionExtensionCount() { return sessionExtensionCount; }
    public void setSessionExtensionCount(Integer sessionExtensionCount) { this.sessionExtensionCount = sessionExtensionCount; }

    public Double getConnectionQualityScore() { return connectionQualityScore; }
    public void setConnectionQualityScore(Double connectionQualityScore) { this.connectionQualityScore = connectionQualityScore; }
}

