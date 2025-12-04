package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Customer Device Registry Entity
 * Enables device auto-connection and persistent sessions
 */
@Entity
@Table(name = "customer_device_registry",
       uniqueConstraints = @UniqueConstraint(columnNames = {"phone_number", "device_token"}),
       indexes = {
           @Index(name = "idx_phone", columnList = "phone_number"),
           @Index(name = "idx_device_token", columnList = "device_token"),
           @Index(name = "idx_mac", columnList = "mac_address")
       })
public class CustomerDeviceRegistry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "device_token", nullable = false, unique = true)
    private String deviceToken; // hashed(MAC + UserID + DeviceSignature)

    @Column(name = "mac_address", nullable = false, length = 17)
    private String macAddress;

    @Column(name = "device_name")
    private String deviceName;

    @Column(name = "device_type")
    @Enumerated(EnumType.STRING)
    private DeviceType deviceType;

    @Column(name = "device_fingerprint")
    private String deviceFingerprint;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    @Column(name = "is_trusted", nullable = false)
    private Boolean isTrusted = false;

    @Column(name = "auto_connect_enabled", nullable = false)
    private Boolean autoConnectEnabled = true;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @Column(name = "last_ip_address")
    private String lastIpAddress;

    @Column(name = "session_count")
    private Integer sessionCount = 0;

    @Column(name = "total_usage_hours")
    private Long totalUsageHours = 0L;

    @Column(name = "voucher_id")
    private Long voucherId; // Current active voucher

    @Column(name = "session_id")
    private Long sessionId; // Current active session

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum DeviceType {
        MOBILE, DESKTOP, TABLET, LAPTOP, OTHER
    }

    // Constructors
    public CustomerDeviceRegistry() {}

    public CustomerDeviceRegistry(String phoneNumber, String deviceToken, String macAddress) {
        this.phoneNumber = phoneNumber;
        this.deviceToken = deviceToken;
        this.macAddress = macAddress;
        this.autoConnectEnabled = true;
    }

    // Helper methods
    public void incrementSessionCount() {
        this.sessionCount++;
        this.lastUsedAt = LocalDateTime.now();
    }

    public void updateUsage(Long hours) {
        this.totalUsageHours += hours;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getDeviceToken() { return deviceToken; }
    public void setDeviceToken(String deviceToken) { this.deviceToken = deviceToken; }

    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }

    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }

    public DeviceType getDeviceType() { return deviceType; }
    public void setDeviceType(DeviceType deviceType) { this.deviceType = deviceType; }

    public String getDeviceFingerprint() { return deviceFingerprint; }
    public void setDeviceFingerprint(String deviceFingerprint) { this.deviceFingerprint = deviceFingerprint; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

    public Boolean getIsTrusted() { return isTrusted; }
    public void setIsTrusted(Boolean isTrusted) { this.isTrusted = isTrusted; }

    public Boolean getAutoConnectEnabled() { return autoConnectEnabled; }
    public void setAutoConnectEnabled(Boolean autoConnectEnabled) { this.autoConnectEnabled = autoConnectEnabled; }

    public LocalDateTime getLastUsedAt() { return lastUsedAt; }
    public void setLastUsedAt(LocalDateTime lastUsedAt) { this.lastUsedAt = lastUsedAt; }

    public String getLastIpAddress() { return lastIpAddress; }
    public void setLastIpAddress(String lastIpAddress) { this.lastIpAddress = lastIpAddress; }

    public Integer getSessionCount() { return sessionCount; }
    public void setSessionCount(Integer sessionCount) { this.sessionCount = sessionCount; }

    public Long getTotalUsageHours() { return totalUsageHours; }
    public void setTotalUsageHours(Long totalUsageHours) { this.totalUsageHours = totalUsageHours; }

    public Long getVoucherId() { return voucherId; }
    public void setVoucherId(Long voucherId) { this.voucherId = voucherId; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}



