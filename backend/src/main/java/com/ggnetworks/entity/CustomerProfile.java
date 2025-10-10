package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "customer_profiles")
public class CustomerProfile extends BaseEntity {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+255[0-9]{8}$", message = "Phone number must be in format +255XXXXXXXX")
    @Column(name = "phone_number", unique = true, nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "customer_type", nullable = false)
    private CustomerType customerType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CustomerStatus status = CustomerStatus.ACTIVE;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;

    @Column(name = "last_activity_date")
    private LocalDateTime lastActivityDate;

    @Column(name = "total_sessions")
    private Long totalSessions = 0L;

    @Column(name = "total_data_usage_mb")
    private Long totalDataUsageMb = 0L;

    @Column(name = "total_spent")
    private Double totalSpent = 0.0;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "loyalty_tier")
    private LoyaltyTier loyaltyTier = LoyaltyTier.BRONZE;

    @Column(name = "referral_code")
    private String referralCode;

    @Column(name = "referred_by")
    private String referredBy;

    @Column(name = "birthday")
    private LocalDateTime birthday;

    @Column(name = "marketing_consent")
    private Boolean marketingConsent = false;

    @Column(name = "sms_consent")
    private Boolean smsConsent = false;

    @Column(name = "email_consent")
    private Boolean emailConsent = false;

    @Column(name = "notes")
    private String notes;

    // Customer Type Enum
    public enum CustomerType {
        HOTSPOT_USER,    // Voucher-based, temporary access
        PPPOE_USER,      // Subscription-based, permanent access
        BOTH             // Uses both services
    }

    // Customer Status Enum
    public enum CustomerStatus {
        ACTIVE,         // Currently using services
        INACTIVE,       // Not using services but account exists
        SUSPENDED,      // Temporarily suspended
        BANNED,         // Permanently banned
        PENDING         // Awaiting activation
    }

    // Loyalty Tier Enum
    public enum LoyaltyTier {
        BRONZE(0, "Bronze"),
        SILVER(1000, "Silver"),
        GOLD(5000, "Gold"),
        PLATINUM(10000, "Platinum"),
        DIAMOND(25000, "Diamond");

        private final int pointsRequired;
        private final String displayName;

        LoyaltyTier(int pointsRequired, String displayName) {
            this.pointsRequired = pointsRequired;
            this.displayName = displayName;
        }

        public int getPointsRequired() { return pointsRequired; }
        public String getDisplayName() { return displayName; }
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (registrationDate == null) {
            registrationDate = LocalDateTime.now();
        }
        if (lastActivityDate == null) {
            lastActivityDate = LocalDateTime.now();
        }
    }
} 