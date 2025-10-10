package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "device_history")
public class DeviceHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "mac_address", nullable = false, length = 17)
    private String macAddress;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "device_name")
    private String deviceName;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "device_fingerprint")
    private String deviceFingerprint;

    @Column(name = "ap_name")
    private String apName;

    @Column(name = "location")
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "device_type")
    private DeviceType deviceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DeviceStatus status = DeviceStatus.ACTIVE;

    @Column(name = "first_seen")
    private LocalDateTime firstSeen;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "total_sessions")
    private Long totalSessions = 0L;

    @Column(name = "total_data_usage_mb")
    private Long totalDataUsageMb = 0L;

    @Column(name = "is_mac_randomized")
    private Boolean isMacRandomized = false;

    @Column(name = "randomization_count")
    private Integer randomizationCount = 0;

    @Column(name = "notes")
    private String notes;

    // Device Type Enum
    public enum DeviceType {
        MOBILE_PHONE,
        TABLET,
        LAPTOP,
        DESKTOP,
        SMART_TV,
        GAMING_CONSOLE,
        IOT_DEVICE,
        UNKNOWN
    }

    // Device Status Enum
    public enum DeviceStatus {
        ACTIVE,         // Currently in use
        INACTIVE,       // Not used recently
        SUSPICIOUS,     // Flagged for MAC randomization
        BANNED,         // Banned device
        WHITELISTED     // Trusted device
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (firstSeen == null) {
            firstSeen = LocalDateTime.now();
        }
        if (lastSeen == null) {
            lastSeen = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
        lastSeen = LocalDateTime.now();
    }
} 