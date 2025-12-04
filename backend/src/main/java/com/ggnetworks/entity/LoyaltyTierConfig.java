package com.ggnetworks.entity;

import com.ggnetworks.entity.Customer.LoyaltyTier;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * LoyaltyTierConfig
 * Stores configurable loyalty tiers (Bronze/Silver/Gold/Platinum etc)
 * along with thresholds and benefits.
 */
@Entity
@Table(name = "loyalty_tier_configs")
public class LoyaltyTierConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tier_key", unique = true, nullable = false, length = 40)
    private String tierKey;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(name = "tier_enum", nullable = false)
    private LoyaltyTier mappedTier = LoyaltyTier.BRONZE;

    @Column(name = "min_points", nullable = false)
    private Integer minPoints;

    @Column(name = "max_points")
    private Integer maxPoints;

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "badge_color")
    private String badgeColor;

    @Column(name = "bonus_multiplier")
    private Double bonusMultiplier = 0.0; // Percentage boost on points

    @Column(name = "priority_support")
    private Boolean prioritySupport = false;

    @Column(name = "enable_auto_upgrade")
    private Boolean enableAutoUpgrade = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public LoyaltyTierConfig() {
        this.tierKey = "TIER-" + System.currentTimeMillis();
    }

    // Getters / setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTierKey() {
        return tierKey;
    }

    public void setTierKey(String tierKey) {
        this.tierKey = tierKey;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public LoyaltyTier getMappedTier() {
        return mappedTier;
    }

    public void setMappedTier(LoyaltyTier mappedTier) {
        this.mappedTier = mappedTier;
    }

    public Integer getMinPoints() {
        return minPoints;
    }

    public void setMinPoints(Integer minPoints) {
        this.minPoints = minPoints;
    }

    public Integer getMaxPoints() {
        return maxPoints;
    }

    public void setMaxPoints(Integer maxPoints) {
        this.maxPoints = maxPoints;
    }

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getBadgeColor() {
        return badgeColor;
    }

    public void setBadgeColor(String badgeColor) {
        this.badgeColor = badgeColor;
    }

    public Double getBonusMultiplier() {
        return bonusMultiplier;
    }

    public void setBonusMultiplier(Double bonusMultiplier) {
        this.bonusMultiplier = bonusMultiplier;
    }

    public Boolean getPrioritySupport() {
        return prioritySupport;
    }

    public void setPrioritySupport(Boolean prioritySupport) {
        this.prioritySupport = prioritySupport;
    }

    public Boolean getEnableAutoUpgrade() {
        return enableAutoUpgrade;
    }

    public void setEnableAutoUpgrade(Boolean enableAutoUpgrade) {
        this.enableAutoUpgrade = enableAutoUpgrade;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

