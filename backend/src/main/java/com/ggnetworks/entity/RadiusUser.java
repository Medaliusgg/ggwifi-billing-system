package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing FreeRADIUS user entries in radcheck table
 * This entity manages authentication credentials for PPPoE and Hotspot users
 */
@Entity
@Table(name = "radcheck", catalog = "radius")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RadiusUser extends BaseEntity {
    
    @Column(name = "username", nullable = false, length = 64)
    private String username;
    
    @Column(name = "attribute", nullable = false, length = 64)
    private String attribute;
    
    @Column(name = "op", nullable = false, length = 2)
    private String op;
    
    @Column(name = "value", nullable = false, length = 253)
    private String value;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;
    
    @Column(name = "nas_identifier")
    private String nasIdentifier;
    
    @Column(name = "location_id")
    private Long locationId;
    
    @Column(name = "router_id")
    private Long routerId;
    
    @Column(name = "package_id")
    private Long packageId;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "data_limit_mb")
    private Long dataLimitMb;
    
    @Column(name = "time_limit_minutes")
    private Long timeLimitMinutes;
    
    @Column(name = "session_timeout")
    private Long sessionTimeout;
    
    @Column(name = "idle_timeout")
    private Long idleTimeout;
    
    @Column(name = "concurrent_use")
    private Integer concurrentUse;
    
    @Column(name = "mac_address")
    private String macAddress;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "vlan_id")
    private Integer vlanId;
    
    @Column(name = "rate_limit_up")
    private String rateLimitUp;
    
    @Column(name = "rate_limit_down")
    private String rateLimitDown;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "last_logout")
    private LocalDateTime lastLogout;
    
    @Column(name = "total_data_usage_mb")
    private Long totalDataUsageMb;
    
    @Column(name = "total_time_usage_minutes")
    private Long totalTimeUsageMinutes;
    
    @Column(name = "notes")
    private String notes;
    
    public enum UserType {
        PPPOE_USER,
        HOTSPOT_USER,
        ADMIN_USER,
        GUEST_USER
    }
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
        if (isActive == null) {
            isActive = true;
        }
    }
} 