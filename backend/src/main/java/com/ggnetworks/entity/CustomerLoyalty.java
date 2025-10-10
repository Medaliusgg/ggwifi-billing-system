package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "customer_loyalty")
public class CustomerLoyalty extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loyalty_program_id", nullable = false)
    private LoyaltyProgram loyaltyProgram;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "tier_level", nullable = false)
    private TierLevel tierLevel = TierLevel.BRONZE;

    @Column(name = "current_points")
    private Integer currentPoints = 0;

    @Column(name = "total_points_earned")
    private Integer totalPointsEarned = 0;

    @Column(name = "total_points_redeemed")
    private Integer totalPointsRedeemed = 0;

    @Column(name = "total_points_expired")
    private Integer totalPointsExpired = 0;

    @Column(name = "lifetime_spend", precision = 15, scale = 2)
    private BigDecimal lifetimeSpend = BigDecimal.ZERO;

    @Column(name = "monthly_spend", precision = 15, scale = 2)
    private BigDecimal monthlySpend = BigDecimal.ZERO;

    @Column(name = "average_transaction_value", precision = 10, scale = 2)
    private BigDecimal averageTransactionValue = BigDecimal.ZERO;

    @Column(name = "total_transactions")
    private Integer totalTransactions = 0;

    @Column(name = "consecutive_months_active")
    private Integer consecutiveMonthsActive = 0;

    @Column(name = "last_transaction_date")
    private LocalDateTime lastTransactionDate;

    @Column(name = "first_transaction_date")
    private LocalDateTime firstTransactionDate;

    @Column(name = "membership_start_date")
    private LocalDateTime membershipStartDate;

    @Column(name = "membership_end_date")
    private LocalDateTime membershipEndDate;

    @Column(name = "is_vip_customer")
    private Boolean isVipCustomer = false;

    @Column(name = "is_high_value_customer")
    private Boolean isHighValueCustomer = false;

    @Column(name = "is_platinum_member")
    private Boolean isPlatinumMember = false;

    @Column(name = "retention_score", precision = 5, scale = 2)
    private BigDecimal retentionScore = BigDecimal.ZERO;

    @Column(name = "engagement_score", precision = 5, scale = 2)
    private BigDecimal engagementScore = BigDecimal.ZERO;

    @Column(name = "lifetime_value_score", precision = 5, scale = 2)
    private BigDecimal lifetimeValueScore = BigDecimal.ZERO;

    @Column(name = "special_offers_count")
    private Integer specialOffersCount = 0;

    @Column(name = "referrals_count")
    private Integer referralsCount = 0;

    @Column(name = "referral_earnings", precision = 10, scale = 2)
    private BigDecimal referralEarnings = BigDecimal.ZERO;

    @Column(name = "birthday_bonus_claimed")
    private Boolean birthdayBonusClaimed = false;

    @Column(name = "anniversary_bonus_claimed")
    private Boolean anniversaryBonusClaimed = false;

    @Column(name = "welcome_bonus_claimed")
    private Boolean welcomeBonusClaimed = false;

    @Column(name = "priority_support_enabled")
    private Boolean prioritySupportEnabled = false;

    @Column(name = "exclusive_packages_enabled")
    private Boolean exclusivePackagesEnabled = false;

    @Column(name = "custom_discount_percentage", precision = 5, scale = 2)
    private BigDecimal customDiscountPercentage = BigDecimal.ZERO;

    @Column(name = "notes")
    private String notes;

    // Tier Level Enum with enhanced tiers
    public enum TierLevel {
        BRONZE(0, "Bronze", 0.0, "Basic tier"),
        SILVER(1000, "Silver", 5.0, "Silver tier with 5% bonus"),
        GOLD(5000, "Gold", 10.0, "Gold tier with 10% bonus"),
        PLATINUM(10000, "Platinum", 15.0, "Platinum tier with 15% bonus"),
        DIAMOND(25000, "Diamond", 20.0, "Diamond tier with 20% bonus"),
        VIP(50000, "VIP", 25.0, "VIP tier with 25% bonus"),
        ELITE(100000, "Elite", 30.0, "Elite tier with 30% bonus");

        private final int pointsRequired;
        private final String displayName;
        private final double bonusPercentage;
        private final String description;

        TierLevel(int pointsRequired, String displayName, double bonusPercentage, String description) {
            this.pointsRequired = pointsRequired;
            this.displayName = displayName;
            this.bonusPercentage = bonusPercentage;
            this.description = description;
        }

        public int getPointsRequired() { return pointsRequired; }
        public String getDisplayName() { return displayName; }
        public double getBonusPercentage() { return bonusPercentage; }
        public String getDescription() { return description; }
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (membershipStartDate == null) {
            membershipStartDate = LocalDateTime.now();
        }
        if (firstTransactionDate == null) {
            firstTransactionDate = LocalDateTime.now();
        }
        if (lastTransactionDate == null) {
            lastTransactionDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
        // Update tier level based on current points
        updateTierLevel();
        // Update customer status flags
        updateCustomerStatus();
    }

    /**
     * Update tier level based on current points
     */
    private void updateTierLevel() {
        if (currentPoints >= TierLevel.ELITE.getPointsRequired()) {
            tierLevel = TierLevel.ELITE;
        } else if (currentPoints >= TierLevel.VIP.getPointsRequired()) {
            tierLevel = TierLevel.VIP;
        } else if (currentPoints >= TierLevel.DIAMOND.getPointsRequired()) {
            tierLevel = TierLevel.DIAMOND;
        } else if (currentPoints >= TierLevel.PLATINUM.getPointsRequired()) {
            tierLevel = TierLevel.PLATINUM;
        } else if (currentPoints >= TierLevel.GOLD.getPointsRequired()) {
            tierLevel = TierLevel.GOLD;
        } else if (currentPoints >= TierLevel.SILVER.getPointsRequired()) {
            tierLevel = TierLevel.SILVER;
        } else {
            tierLevel = TierLevel.BRONZE;
        }
    }

    /**
     * Update customer status flags based on spending
     */
    private void updateCustomerStatus() {
        // Update high value customer flag
        isHighValueCustomer = lifetimeSpend.compareTo(BigDecimal.valueOf(100000.00)) >= 0;
        
        // Update VIP customer flag
        isVipCustomer = lifetimeSpend.compareTo(BigDecimal.valueOf(500000.00)) >= 0;
        
        // Update platinum member flag
        isPlatinumMember = lifetimeSpend.compareTo(BigDecimal.valueOf(1000000.00)) >= 0;
        
        // Update priority support based on tier
        prioritySupportEnabled = tierLevel.ordinal() >= TierLevel.GOLD.ordinal();
        
        // Update exclusive packages based on tier
        exclusivePackagesEnabled = tierLevel.ordinal() >= TierLevel.PLATINUM.ordinal();
    }

    /**
     * Calculate retention score based on activity
     */
    public BigDecimal calculateRetentionScore() {
        if (lastTransactionDate == null) {
            return BigDecimal.ZERO;
        }
        
        long daysSinceLastTransaction = java.time.Duration.between(lastTransactionDate, LocalDateTime.now()).toDays();
        
        if (daysSinceLastTransaction <= 7) {
            return BigDecimal.valueOf(1.0);
        } else if (daysSinceLastTransaction <= 30) {
            return BigDecimal.valueOf(0.8);
        } else if (daysSinceLastTransaction <= 90) {
            return BigDecimal.valueOf(0.6);
        } else if (daysSinceLastTransaction <= 180) {
            return BigDecimal.valueOf(0.4);
        } else {
            return BigDecimal.valueOf(0.2);
        }
    }

    /**
     * Calculate engagement score based on transaction frequency
     */
    public BigDecimal calculateEngagementScore() {
        if (totalTransactions == 0) {
            return BigDecimal.ZERO;
        }
        
        long daysSinceFirstTransaction = java.time.Duration.between(firstTransactionDate, LocalDateTime.now()).toDays();
        if (daysSinceFirstTransaction == 0) {
            return BigDecimal.valueOf(1.0);
        }
        
        double transactionsPerDay = (double) totalTransactions / daysSinceFirstTransaction;
        
        if (transactionsPerDay >= 0.1) { // 3+ transactions per month
            return BigDecimal.valueOf(1.0);
        } else if (transactionsPerDay >= 0.05) { // 1-2 transactions per month
            return BigDecimal.valueOf(0.8);
        } else if (transactionsPerDay >= 0.02) { // 1 transaction every 2 months
            return BigDecimal.valueOf(0.6);
        } else {
            return BigDecimal.valueOf(0.4);
        }
    }

    /**
     * Calculate lifetime value score
     */
    public BigDecimal calculateLifetimeValueScore() {
        if (lifetimeSpend.compareTo(BigDecimal.valueOf(1000000.00)) >= 0) {
            return BigDecimal.valueOf(1.0);
        } else if (lifetimeSpend.compareTo(BigDecimal.valueOf(500000.00)) >= 0) {
            return BigDecimal.valueOf(0.9);
        } else if (lifetimeSpend.compareTo(BigDecimal.valueOf(100000.00)) >= 0) {
            return BigDecimal.valueOf(0.7);
        } else if (lifetimeSpend.compareTo(BigDecimal.valueOf(50000.00)) >= 0) {
            return BigDecimal.valueOf(0.5);
        } else {
            return BigDecimal.valueOf(0.3);
        }
    }
} 