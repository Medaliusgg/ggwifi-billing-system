package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * LoyaltyTransaction Entity
 * Tracks all loyalty point transactions (earned, redeemed, expired)
 */
@Entity
@Table(name = "loyalty_transactions", indexes = {
    @Index(name = "idx_customer_id", columnList = "customer_id"),
    @Index(name = "idx_phone_number", columnList = "phone_number"),
    @Index(name = "idx_transaction_type", columnList = "transaction_type"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class LoyaltyTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", unique = true, nullable = false)
    private String transactionId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "transaction_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column(name = "points", nullable = false)
    private Integer points; // Positive for earned, negative for redeemed

    @Column(name = "balance_after", nullable = false)
    private Integer balanceAfter; // Customer's point balance after this transaction

    @Column(name = "package_id")
    private Long packageId; // If earned from package purchase

    @Column(name = "package_name")
    private String packageName;

    @Column(name = "reward_id")
    private String rewardId; // If redeemed for reward

    @Column(name = "reward_name")
    private String rewardName;

    @Column(name = "payment_id")
    private Long paymentId; // Link to payment transaction

    @Column(name = "voucher_code")
    private String voucherCode; // Link to voucher if applicable

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt; // When points expire (if earned)

    @Column(name = "is_expired")
    private Boolean isExpired = false;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum TransactionType {
        EARNED,      // Points earned from purchase
        REDEEMED,    // Points redeemed for reward
        EXPIRED,     // Points expired
        ADJUSTED,    // Manual adjustment by admin
        BONUS        // Bonus points (promotions)
    }

    // Constructors
    public LoyaltyTransaction() {
        this.transactionId = "LTX_" + System.currentTimeMillis() + "_" + 
                            (int)(Math.random() * 10000);
    }

    public LoyaltyTransaction(Long customerId, String phoneNumber, TransactionType transactionType, 
                             Integer points, Integer balanceAfter) {
        this();
        this.customerId = customerId;
        this.phoneNumber = phoneNumber;
        this.transactionType = transactionType;
        this.points = points;
        this.balanceAfter = balanceAfter;
        
        // Set expiry for earned points (3 months)
        if (transactionType == TransactionType.EARNED) {
            this.expiresAt = LocalDateTime.now().plusMonths(3);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public Integer getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(Integer balanceAfter) { this.balanceAfter = balanceAfter; }

    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public String getRewardId() { return rewardId; }
    public void setRewardId(String rewardId) { this.rewardId = rewardId; }

    public String getRewardName() { return rewardName; }
    public void setRewardName(String rewardName) { this.rewardName = rewardName; }

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public String getVoucherCode() { return voucherCode; }
    public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Boolean getIsExpired() { return isExpired; }
    public void setIsExpired(Boolean isExpired) { this.isExpired = isExpired; }

    public LocalDateTime getExpiredAt() { return expiredAt; }
    public void setExpiredAt(LocalDateTime expiredAt) { this.expiredAt = expiredAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper methods
    public boolean isExpired() {
        return isExpired || (expiresAt != null && LocalDateTime.now().isAfter(expiresAt));
    }

    public void markAsExpired() {
        this.isExpired = true;
        this.expiredAt = LocalDateTime.now();
    }
}

