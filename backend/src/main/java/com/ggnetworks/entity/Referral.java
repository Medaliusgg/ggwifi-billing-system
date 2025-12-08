package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Referral Entity
 * Tracks referral relationships and rewards
 */
@Entity
@Table(name = "referrals")
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "referrer_phone_number", nullable = false, length = 20)
    private String referrerPhoneNumber;

    @Column(name = "referrer_account_id")
    private Long referrerAccountId;

    @Column(name = "referred_phone_number", nullable = false, length = 20)
    private String referredPhoneNumber;

    @Column(name = "referred_account_id")
    private Long referredAccountId;

    @Column(name = "referral_code", nullable = false, length = 20)
    private String referralCode;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReferralStatus status = ReferralStatus.PENDING;

    @Column(name = "referrer_reward_points")
    private Integer referrerRewardPoints = 0;

    @Column(name = "referred_reward_points")
    private Integer referredRewardPoints = 0;

    @Column(name = "referrer_reward_claimed")
    private Boolean referrerRewardClaimed = false;

    @Column(name = "referred_reward_claimed")
    private Boolean referredRewardClaimed = false;

    @Column(name = "first_purchase_date")
    private LocalDateTime firstPurchaseDate;

    @Column(name = "reward_eligible")
    private Boolean rewardEligible = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ReferralStatus {
        PENDING,    // Referral code used but no purchase yet
        ACTIVE,     // Referred user made first purchase
        COMPLETED,  // Both parties received rewards
        EXPIRED     // Referral expired (e.g., no purchase within 30 days)
    }

    // Constructors
    public Referral() {}

    public Referral(String referrerPhoneNumber, String referredPhoneNumber, String referralCode) {
        this.referrerPhoneNumber = referrerPhoneNumber;
        this.referredPhoneNumber = referredPhoneNumber;
        this.referralCode = referralCode;
        this.status = ReferralStatus.PENDING;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReferrerPhoneNumber() { return referrerPhoneNumber; }
    public void setReferrerPhoneNumber(String referrerPhoneNumber) { this.referrerPhoneNumber = referrerPhoneNumber; }

    public Long getReferrerAccountId() { return referrerAccountId; }
    public void setReferrerAccountId(Long referrerAccountId) { this.referrerAccountId = referrerAccountId; }

    public String getReferredPhoneNumber() { return referredPhoneNumber; }
    public void setReferredPhoneNumber(String referredPhoneNumber) { this.referredPhoneNumber = referredPhoneNumber; }

    public Long getReferredAccountId() { return referredAccountId; }
    public void setReferredAccountId(Long referredAccountId) { this.referredAccountId = referredAccountId; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public ReferralStatus getStatus() { return status; }
    public void setStatus(ReferralStatus status) { this.status = status; }

    public Integer getReferrerRewardPoints() { return referrerRewardPoints; }
    public void setReferrerRewardPoints(Integer referrerRewardPoints) { this.referrerRewardPoints = referrerRewardPoints; }

    public Integer getReferredRewardPoints() { return referredRewardPoints; }
    public void setReferredRewardPoints(Integer referredRewardPoints) { this.referredRewardPoints = referredRewardPoints; }

    public Boolean getReferrerRewardClaimed() { return referrerRewardClaimed; }
    public void setReferrerRewardClaimed(Boolean referrerRewardClaimed) { this.referrerRewardClaimed = referrerRewardClaimed; }

    public Boolean getReferredRewardClaimed() { return referredRewardClaimed; }
    public void setReferredRewardClaimed(Boolean referredRewardClaimed) { this.referredRewardClaimed = referredRewardClaimed; }

    public LocalDateTime getFirstPurchaseDate() { return firstPurchaseDate; }
    public void setFirstPurchaseDate(LocalDateTime firstPurchaseDate) { this.firstPurchaseDate = firstPurchaseDate; }

    public Boolean getRewardEligible() { return rewardEligible; }
    public void setRewardEligible(Boolean rewardEligible) { this.rewardEligible = rewardEligible; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

