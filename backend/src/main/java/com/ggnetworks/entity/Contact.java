package com.ggnetworks.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
public class Contact {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "location")
    private String location;
    
    @Column(name = "source")
    private String source; // PAYMENT_FORM, VOUCHER_LOGIN, etc.
    
    @Column(name = "status")
    private String status; // ACTIVE, INACTIVE
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "last_interaction")
    private LocalDateTime lastInteraction;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "is_marketing_consent")
    private Boolean isMarketingConsent = false;
    
    @Column(name = "is_sms_consent")
    private Boolean isSmsConsent = true; // Default to true for payment notifications
    
    @Column(name = "total_purchases")
    private Integer totalPurchases = 0;
    
    @Column(name = "total_spent")
    private Double totalSpent = 0.0;
    
    @Column(name = "last_purchase_date")
    private LocalDateTime lastPurchaseDate;
    
    @Column(name = "preferred_location")
    private String preferredLocation;
    
    @Column(name = "customer_type")
    private String customerType; // NEW, REGULAR, VIP
    
    @Column(name = "referral_code")
    private String referralCode;
    
    @Column(name = "referred_by")
    private String referredBy;
    
    @Column(name = "device_info")
    private String deviceInfo;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "is_verified")
    private Boolean isVerified = false;
    
    @Column(name = "verification_code")
    private String verificationCode;
    
    @Column(name = "verification_expires")
    private LocalDateTime verificationExpires;
    
    @Column(name = "tags")
    private String tags; // Comma-separated tags for categorization
    
    @Column(name = "custom_fields")
    private String customFields; // JSON string for additional fields
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Contact() {}
    
    public Contact(String phoneNumber, String name, String email, String location) {
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.email = email;
        this.location = location;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getLastInteraction() { return lastInteraction; }
    public void setLastInteraction(LocalDateTime lastInteraction) { this.lastInteraction = lastInteraction; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public Boolean getIsMarketingConsent() { return isMarketingConsent; }
    public void setIsMarketingConsent(Boolean isMarketingConsent) { this.isMarketingConsent = isMarketingConsent; }
    
    public Boolean getIsSmsConsent() { return isSmsConsent; }
    public void setIsSmsConsent(Boolean isSmsConsent) { this.isSmsConsent = isSmsConsent; }
    
    public Integer getTotalPurchases() { return totalPurchases; }
    public void setTotalPurchases(Integer totalPurchases) { this.totalPurchases = totalPurchases; }
    
    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }
    
    public LocalDateTime getLastPurchaseDate() { return lastPurchaseDate; }
    public void setLastPurchaseDate(LocalDateTime lastPurchaseDate) { this.lastPurchaseDate = lastPurchaseDate; }
    
    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }
    
    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }
    
    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }
    
    public String getReferredBy() { return referredBy; }
    public void setReferredBy(String referredBy) { this.referredBy = referredBy; }
    
    public String getDeviceInfo() { return deviceInfo; }
    public void setDeviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    
    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
    
    public LocalDateTime getVerificationExpires() { return verificationExpires; }
    public void setVerificationExpires(LocalDateTime verificationExpires) { this.verificationExpires = verificationExpires; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public String getCustomFields() { return customFields; }
    public void setCustomFields(String customFields) { this.customFields = customFields; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        lastInteraction = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}