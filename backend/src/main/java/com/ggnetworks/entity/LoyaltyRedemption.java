package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * LoyaltyRedemption Entity
 * Tracks reward redemption requests and delivery status
 */
@Entity
@Table(name = "loyalty_redemptions", indexes = {
    @Index(name = "idx_customer_id", columnList = "customer_id"),
    @Index(name = "idx_reward_id", columnList = "reward_id"),
    @Index(name = "idx_status", columnList = "status")
})
public class LoyaltyRedemption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "redemption_id", unique = true, nullable = false)
    private String redemptionId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "reward_id", nullable = false)
    private String rewardId;

    @Column(name = "reward_name", nullable = false)
    private String rewardName;

    @Column(name = "points_used", nullable = false)
    private Integer pointsUsed;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private RedemptionStatus status = RedemptionStatus.PENDING;

    @Column(name = "delivery_method")
    @Enumerated(EnumType.STRING)
    private DeliveryMethod deliveryMethod;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "location_code")
    private String locationCode;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "technician_assigned")
    private String technicianAssigned;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum RedemptionStatus {
        PENDING,        // Customer requested, awaiting admin approval
        APPROVED,       // Admin approved, preparing for delivery
        IN_TRANSIT,     // Being delivered
        DELIVERED,      // Successfully delivered
        CANCELLED,      // Cancelled by customer or admin
        REJECTED        // Rejected by admin
    }

    public enum DeliveryMethod {
        TECHNICIAN_DELIVERY,  // Delivered by technician
        OFFICE_PICKUP,        // Customer picks up at office
        COURIER,              // Sent via courier
        SELF_SERVICE          // Digital reward (voucher, etc.)
    }

    // Constructors
    public LoyaltyRedemption() {
        this.redemptionId = "RED_" + System.currentTimeMillis() + "_" + 
                           (int)(Math.random() * 10000);
        this.requestedAt = LocalDateTime.now();
    }

    public LoyaltyRedemption(Long customerId, String phoneNumber, String rewardId, 
                           String rewardName, Integer pointsUsed) {
        this();
        this.customerId = customerId;
        this.phoneNumber = phoneNumber;
        this.rewardId = rewardId;
        this.rewardName = rewardName;
        this.pointsUsed = pointsUsed;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRedemptionId() { return redemptionId; }
    public void setRedemptionId(String redemptionId) { this.redemptionId = redemptionId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getRewardId() { return rewardId; }
    public void setRewardId(String rewardId) { this.rewardId = rewardId; }

    public String getRewardName() { return rewardName; }
    public void setRewardName(String rewardName) { this.rewardName = rewardName; }

    public Integer getPointsUsed() { return pointsUsed; }
    public void setPointsUsed(Integer pointsUsed) { this.pointsUsed = pointsUsed; }

    public RedemptionStatus getStatus() { return status; }
    public void setStatus(RedemptionStatus status) { this.status = status; }

    public DeliveryMethod getDeliveryMethod() { return deliveryMethod; }
    public void setDeliveryMethod(DeliveryMethod deliveryMethod) { this.deliveryMethod = deliveryMethod; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getLocationCode() { return locationCode; }
    public void setLocationCode(String locationCode) { this.locationCode = locationCode; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getTechnicianAssigned() { return technicianAssigned; }
    public void setTechnicianAssigned(String technicianAssigned) { this.technicianAssigned = technicianAssigned; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper methods
    public void approve() {
        this.status = RedemptionStatus.APPROVED;
        this.approvedAt = LocalDateTime.now();
    }

    public void markAsDelivered() {
        this.status = RedemptionStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = RedemptionStatus.CANCELLED;
    }
}





