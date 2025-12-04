package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_rewards")
public class LoyaltyReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reward_id", unique = true, nullable = false)
    private String rewardId;

    @Column(name = "reward_name", nullable = false)
    private String rewardName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "points_required", nullable = false)
    private Integer pointsRequired;

    @Column(name = "sku", unique = true)
    private String sku;

    @Column(name = "max_redemptions_per_customer")
    private Integer maxRedemptionsPerCustomer = 1;

    @Column(name = "reward_value_tzs")
    private Integer rewardValueTzs;

    @Column(name = "delivery_notes", columnDefinition = "TEXT")
    private String deliveryNotes;

    @Column(name = "reward_tier")
    @Enumerated(EnumType.STRING)
    private RewardTier rewardTier;

    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private RewardCategory category;

    @Column(name = "delivery_method")
    @Enumerated(EnumType.STRING)
    private DeliveryMethod deliveryMethod = DeliveryMethod.TECHNICIAN_DELIVERY;

    @Column(name = "inventory_count")
    private Integer inventoryCount = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "redemption_count")
    private Integer redemptionCount = 0;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum RewardTier {
        BRONZE, SILVER, GOLD, PLATINUM, DIAMOND
    }

    public enum RewardCategory {
        CLOTHING, ELECTRONICS, ACCESSORIES, BRANDED_ITEMS, DIGITAL
    }

    public enum DeliveryMethod {
        TECHNICIAN_DELIVERY, OFFICE_PICKUP, COURIER, SELF_SERVICE
    }

    // Constructors
    public LoyaltyReward() {}

    public LoyaltyReward(String rewardId, String rewardName, Integer pointsRequired, RewardTier rewardTier) {
        this.rewardId = rewardId;
        this.rewardName = rewardName;
        this.pointsRequired = pointsRequired;
        this.rewardTier = rewardTier;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRewardId() { return rewardId; }
    public void setRewardId(String rewardId) { this.rewardId = rewardId; }

    public String getRewardName() { return rewardName; }
    public void setRewardName(String rewardName) { this.rewardName = rewardName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getPointsRequired() { return pointsRequired; }
    public void setPointsRequired(Integer pointsRequired) { this.pointsRequired = pointsRequired; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Integer getMaxRedemptionsPerCustomer() { return maxRedemptionsPerCustomer; }
    public void setMaxRedemptionsPerCustomer(Integer maxRedemptionsPerCustomer) {
        this.maxRedemptionsPerCustomer = maxRedemptionsPerCustomer;
    }

    public Integer getRewardValueTzs() { return rewardValueTzs; }
    public void setRewardValueTzs(Integer rewardValueTzs) { this.rewardValueTzs = rewardValueTzs; }

    public String getDeliveryNotes() { return deliveryNotes; }
    public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }

    public RewardTier getRewardTier() { return rewardTier; }
    public void setRewardTier(RewardTier rewardTier) { this.rewardTier = rewardTier; }

    public Integer getInventoryCount() { return inventoryCount; }
    public void setInventoryCount(Integer inventoryCount) { this.inventoryCount = inventoryCount; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getRedemptionCount() { return redemptionCount; }
    public void setRedemptionCount(Integer redemptionCount) { this.redemptionCount = redemptionCount; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper methods
    public boolean isAvailable() {
        return isActive && inventoryCount > 0 && 
               (validFrom == null || LocalDateTime.now().isAfter(validFrom)) &&
               (validUntil == null || LocalDateTime.now().isBefore(validUntil));
    }

    public void incrementRedemption() {
        this.redemptionCount++;
        if (inventoryCount > 0) {
            this.inventoryCount--;
        }
    }

    public RewardCategory getCategory() { return category; }
    public void setCategory(RewardCategory category) { this.category = category; }

    public DeliveryMethod getDeliveryMethod() { return deliveryMethod; }
    public void setDeliveryMethod(DeliveryMethod deliveryMethod) { this.deliveryMethod = deliveryMethod; }
}

