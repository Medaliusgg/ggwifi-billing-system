package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing data plans/packages for ISP services
 * This entity manages WiFi packages with comprehensive configuration options
 */
@Entity
@Table(name = "data_plans")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DataPlan extends BaseEntity {
    
    @Column(name = "plan_title", nullable = false, length = 255)
    private String planTitle;
    
    @Column(name = "plan_code", unique = true, length = 50)
    private String planCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false)
    private PlanType planType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ServiceType serviceType;
    
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Column(name = "duration_days")
    private Integer durationDays;
    
    @Column(name = "duration_hours")
    private Integer durationHours;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "data_limit_mb")
    private Long dataLimitMb;
    
    @Column(name = "data_limit_gb")
    private Long dataLimitGb;
    
    @Column(name = "is_unlimited_data")
    private Boolean isUnlimitedData;
    
    @Column(name = "upload_speed_mbps")
    private Integer uploadSpeedMbps;
    
    @Column(name = "download_speed_mbps")
    private Integer downloadSpeedMbps;
    
    @Column(name = "voucher_prefix", length = 10)
    private String voucherPrefix;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "features", columnDefinition = "TEXT")
    private String features;
    
    @Column(name = "is_popular")
    private Boolean isPopular;
    
    @Column(name = "is_featured")
    private Boolean isFeatured;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "sort_order")
    private Integer sortOrder;
    
    @Column(name = "max_concurrent_users")
    private Integer maxConcurrentUsers;
    
    @Column(name = "session_timeout_minutes")
    private Integer sessionTimeoutMinutes;
    
    @Column(name = "idle_timeout_minutes")
    private Integer idleTimeoutMinutes;
    
    @Column(name = "rate_limit_up")
    private String rateLimitUp;
    
    @Column(name = "rate_limit_down")
    private String rateLimitDown;
    
    @Column(name = "vlan_id")
    private Integer vlanId;
    
    @Column(name = "nas_identifier")
    private String nasIdentifier;
    
    @Column(name = "router_id")
    private Long routerId;
    
    @Column(name = "location_id")
    private Long locationId;
    
    @Column(name = "valid_from")
    private LocalDateTime validFrom;
    
    @Column(name = "valid_until")
    private LocalDateTime validUntil;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    public enum PlanType {
        HOTSPOT,
        PPPOE,
        DEDICATED,
        BUSINESS,
        RESIDENTIAL,
        PREPAID,
        POSTPAID
    }
    
    public enum ServiceType {
        INTERNET,
        VOIP,
        IPTV,
        VPN,
        CLOUD_STORAGE,
        BACKUP_SERVICE
    }
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
        if (isActive == null) {
            isActive = true;
        }
        if (isUnlimitedData == null) {
            isUnlimitedData = false;
        }
        if (isPopular == null) {
            isPopular = false;
        }
        if (isFeatured == null) {
            isFeatured = false;
        }
        if (sortOrder == null) {
            sortOrder = 0;
        }
        if (maxConcurrentUsers == null) {
            maxConcurrentUsers = 1;
        }
    }
} 