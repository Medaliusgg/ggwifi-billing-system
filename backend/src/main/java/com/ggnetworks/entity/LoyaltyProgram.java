package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "loyalty_programs")
public class LoyaltyProgram extends BaseEntity {

    @Column(name = "program_name", nullable = false)
    private String programName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "program_type", nullable = false)
    private ProgramType programType;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_service", nullable = false)
    private TargetService targetService;

    @Column(name = "points_per_currency", precision = 10, scale = 4)
    private BigDecimal pointsPerCurrency = BigDecimal.ONE;

    @Column(name = "minimum_spend_threshold", precision = 10, scale = 2)
    private BigDecimal minimumSpendThreshold = BigDecimal.ZERO;

    @Column(name = "bonus_multiplier", precision = 5, scale = 2)
    private BigDecimal bonusMultiplier = BigDecimal.ONE;

    @Column(name = "expiry_days")
    private Integer expiryDays = 365;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "max_points_per_transaction")
    private Integer maxPointsPerTransaction;

    @Column(name = "daily_points_limit")
    private Integer dailyPointsLimit;

    @Column(name = "monthly_points_limit")
    private Integer monthlyPointsLimit;

    @Column(name = "special_offers_enabled")
    private Boolean specialOffersEnabled = false;

    @Column(name = "priority_support_enabled")
    private Boolean prioritySupportEnabled = false;

    @Column(name = "exclusive_packages_enabled")
    private Boolean exclusivePackagesEnabled = false;

    @Column(name = "birthday_bonus_multiplier", precision = 5, scale = 2)
    private BigDecimal birthdayBonusMultiplier = BigDecimal.valueOf(2.0);

    @Column(name = "referral_bonus_points")
    private Integer referralBonusPoints = 100;

    @Column(name = "anniversary_bonus_points")
    private Integer anniversaryBonusPoints = 500;

    @Column(name = "retention_threshold_days")
    private Integer retentionThresholdDays = 30;

    @Column(name = "high_value_threshold", precision = 10, scale = 2)
    private BigDecimal highValueThreshold = BigDecimal.valueOf(100000.00);

    @Column(name = "vip_threshold", precision = 10, scale = 2)
    private BigDecimal vipThreshold = BigDecimal.valueOf(500000.00);

    @Column(name = "platinum_threshold", precision = 10, scale = 2)
    private BigDecimal platinumThreshold = BigDecimal.valueOf(1000000.00);

    // Program Type Enum
    public enum ProgramType {
        POINTS_BASED,      // Traditional points accumulation
        TIER_BASED,        // Tier-based rewards
        CASHBACK,          // Direct cashback
        HYBRID            // Combination of multiple types
    }

    // Target Service Enum
    public enum TargetService {
        HOTSPOT_ONLY,     // Only hotspot users
        PPPOE_ONLY,       // Only PPPoE users
        BOTH_SERVICES,    // Both hotspot and PPPoE
        ALL_CUSTOMERS     // All customer types
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (startDate == null) {
            startDate = LocalDateTime.now();
        }
    }
} 