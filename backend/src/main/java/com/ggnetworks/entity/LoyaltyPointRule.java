package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * LoyaltyPointRule
 * Defines how many points are awarded for a specific package type/duration.
 * Rules are fully configurable from the admin panel.
 */
@Entity
@Table(name = "loyalty_point_rules",
        uniqueConstraints = @UniqueConstraint(name = "uk_rule_key", columnNames = {
                "package_type", "min_duration_days", "max_duration_days"
        }))
public class LoyaltyPointRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rule_id", unique = true, nullable = false, length = 40)
    private String ruleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "package_type", nullable = false)
    private InternetPackage.PackageType packageType;

    @Column(name = "min_duration_days")
    private Integer minDurationDays;

    @Column(name = "max_duration_days")
    private Integer maxDurationDays;

    @Column(name = "points_awarded", nullable = false)
    private Integer pointsAwarded;

    @Column(name = "is_default_rule")
    private Boolean isDefaultRule = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public LoyaltyPointRule() {
        this.ruleId = "LPR-" + System.currentTimeMillis();
    }

    // Getters / setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRuleId() {
        return ruleId;
    }

    public void setRuleId(String ruleId) {
        this.ruleId = ruleId;
    }

    public InternetPackage.PackageType getPackageType() {
        return packageType;
    }

    public void setPackageType(InternetPackage.PackageType packageType) {
        this.packageType = packageType;
    }

    public Integer getMinDurationDays() {
        return minDurationDays;
    }

    public void setMinDurationDays(Integer minDurationDays) {
        this.minDurationDays = minDurationDays;
    }

    public Integer getMaxDurationDays() {
        return maxDurationDays;
    }

    public void setMaxDurationDays(Integer maxDurationDays) {
        this.maxDurationDays = maxDurationDays;
    }

    public Integer getPointsAwarded() {
        return pointsAwarded;
    }

    public void setPointsAwarded(Integer pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }

    public Boolean getDefaultRule() {
        return isDefaultRule;
    }

    public void setDefaultRule(Boolean defaultRule) {
        isDefaultRule = defaultRule;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

