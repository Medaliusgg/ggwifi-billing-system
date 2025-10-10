package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing voucher series for bulk voucher generation
 * This entity manages series-based voucher creation and tracking
 */
@Entity
@Table(name = "voucher_series")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class VoucherSeries extends BaseEntity {
    
    @Column(name = "series_name", nullable = false, length = 255)
    private String seriesName;
    
    @Column(name = "series_code", unique = true, length = 50)
    private String seriesCode;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "series_type", nullable = false)
    private SeriesType seriesType;
    
    @Column(name = "data_plan_id")
    private Long dataPlanId;
    
    @Column(name = "location_id")
    private Long locationId;
    
    @Column(name = "router_id")
    private Long routerId;
    
    @Column(name = "voucher_prefix", length = 10)
    private String voucherPrefix;
    
    @Column(name = "voucher_length")
    private Integer voucherLength;
    
    @Column(name = "quantity")
    private Integer quantity;
    
    @Column(name = "generated_count")
    private Integer generatedCount;
    
    @Column(name = "used_count")
    private Integer usedCount;
    
    @Column(name = "expired_count")
    private Integer expiredCount;
    
    @Column(name = "price_per_voucher", precision = 10, scale = 2)
    private BigDecimal pricePerVoucher;
    
    @Column(name = "total_value", precision = 10, scale = 2)
    private BigDecimal totalValue;
    
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
    
    @Column(name = "usage_limit")
    private Integer usageLimit;
    
    @Column(name = "concurrent_use")
    private Integer concurrentUse;
    
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
    
    @Column(name = "valid_from")
    private LocalDateTime validFrom;
    
    @Column(name = "valid_until")
    private LocalDateTime validUntil;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SeriesStatus status;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "is_roaming_enabled")
    private Boolean isRoamingEnabled;
    
    @Column(name = "allow_multiple_devices")
    private Boolean allowMultipleDevices;
    
    @Column(name = "check_mac_address")
    private Boolean checkMacAddress;
    
    @Column(name = "auto_generate")
    private Boolean autoGenerate;
    
    @Column(name = "batch_size")
    private Integer batchSize;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    public enum SeriesType {
        HOTSPOT,
        PPPOE,
        GUEST,
        PROMOTIONAL,
        BUSINESS,
        RESIDENTIAL,
        TESTING
    }
    
    public enum SeriesStatus {
        DRAFT,
        ACTIVE,
        PAUSED,
        COMPLETED,
        EXPIRED,
        CANCELLED
    }
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
        if (status == null) {
            status = SeriesStatus.DRAFT;
        }
        if (isActive == null) {
            isActive = true;
        }
        if (isUnlimitedData == null) {
            isUnlimitedData = false;
        }
        if (isRoamingEnabled == null) {
            isRoamingEnabled = false;
        }
        if (allowMultipleDevices == null) {
            allowMultipleDevices = false;
        }
        if (checkMacAddress == null) {
            checkMacAddress = true;
        }
        if (autoGenerate == null) {
            autoGenerate = false;
        }
        if (batchSize == null) {
            batchSize = 100;
        }
        if (voucherLength == null) {
            voucherLength = 8;
        }
        if (concurrentUse == null) {
            concurrentUse = 1;
        }
        if (usageLimit == null) {
            usageLimit = 1;
        }
        if (generatedCount == null) {
            generatedCount = 0;
        }
        if (usedCount == null) {
            usedCount = 0;
        }
        if (expiredCount == null) {
            expiredCount = 0;
        }
    }
} 