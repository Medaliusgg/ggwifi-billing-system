package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", unique = true, nullable = false)
    private String customerId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "primary_phone_number", unique = true, nullable = false)
    private String primaryPhoneNumber;

    @Column(name = "secondary_phone_number")
    private String secondaryPhoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private CustomerStatus status;

    @Column(name = "account_type")
    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    @Column(name = "phone_verified")
    private Boolean phoneVerified = false;

    @Column(name = "current_balance")
    private Double currentBalance = 0.0;

    @Column(name = "total_spent")
    private Double totalSpent = 0.0;

    @Column(name = "currency")
    private String currency = "TZS";

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @Column(name = "loyalty_status")
    @Enumerated(EnumType.STRING)
    private LoyaltyStatus loyaltyStatus;

    @Column(name = "loyalty_tier")
    @Enumerated(EnumType.STRING)
    private LoyaltyTier loyaltyTier = LoyaltyTier.BRONZE;

    @Column(name = "total_points_earned")
    private Integer totalPointsEarned = 0; // Lifetime points earned

    @Column(name = "total_points_redeemed")
    private Integer totalPointsRedeemed = 0; // Lifetime points redeemed

    @Column(name = "last_points_earned_at")
    private LocalDateTime lastPointsEarnedAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "last_activity_at")
    private LocalDateTime lastActivityAt;

    // Relationships
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<com.ggnetworks.entity.Payment> payments = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<com.ggnetworks.entity.Invoice> invoices = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<com.ggnetworks.entity.Transaction> transactions = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<com.ggnetworks.entity.HotspotUser> hotspotUsers = new java.util.ArrayList<>();

    // Enterprise enhancements
    @Column(name = "device_mac_history", columnDefinition = "TEXT")
    private String deviceMacHistory; // JSON array of all MAC addresses used

    @Column(name = "blacklist_reason")
    private String blacklistReason;

    @Column(name = "total_sessions")
    private Integer totalSessions = 0;

    @Column(name = "last_device_mac", length = 17)
    private String lastDeviceMac;

    @Column(name = "installation_status")
    @Enumerated(EnumType.STRING)
    private InstallationStatus installationStatus; // For PPPoE customers

    @Column(name = "technician_assigned")
    private String technicianAssigned; // For PPPoE installation

    @Column(name = "address")
    private String address; // For PPPoE customers

    @Column(name = "contract_duration_months")
    private Integer contractDurationMonths; // For PPPoE customers

    // Enums
    public enum CustomerStatus {
        ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION, 
        EXPIRED, CANCELLED, BLACKLISTED, VIP
    }

    public enum AccountType {
        INDIVIDUAL, BUSINESS, ENTERPRISE, STUDENT, SENIOR_CITIZEN
    }

    public enum LoyaltyStatus {
        NEW_CUSTOMER, REGULAR_CUSTOMER, LOYAL_CUSTOMER, VIP_CUSTOMER, 
        AT_RISK_CUSTOMER, UNLOYAL_CUSTOMER, CHURNED_CUSTOMER
    }

    public enum LoyaltyTier {
        BRONZE,    // 0-50 points
        SILVER,    // 51-150 points
        GOLD,      // 151-400 points
        PLATINUM   // 400+ points
    }

    public enum InstallationStatus {
        REQUEST_RECEIVED, SURVEY_SCHEDULED, SURVEY_COMPLETED, 
        INSTALLATION_SCHEDULED, INSTALLATION_IN_PROGRESS, 
        INSTALLATION_COMPLETED, ACTIVATED, CANCELLED
    }

    // Constructors
    public Customer() {}

    public Customer(String customerId, String firstName, String lastName, 
                   String email, String primaryPhoneNumber) {
        this.customerId = customerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.primaryPhoneNumber = primaryPhoneNumber;
        this.status = CustomerStatus.PENDING_VERIFICATION;
        this.registrationDate = LocalDateTime.now();
        this.accountType = AccountType.INDIVIDUAL;
        this.loyaltyStatus = LoyaltyStatus.NEW_CUSTOMER;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPrimaryPhoneNumber() { return primaryPhoneNumber; }
    public void setPrimaryPhoneNumber(String primaryPhoneNumber) { this.primaryPhoneNumber = primaryPhoneNumber; }

    public String getSecondaryPhoneNumber() { return secondaryPhoneNumber; }
    public void setSecondaryPhoneNumber(String secondaryPhoneNumber) { this.secondaryPhoneNumber = secondaryPhoneNumber; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public CustomerStatus getStatus() { return status; }
    public void setStatus(CustomerStatus status) { this.status = status; }

    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType accountType) { this.accountType = accountType; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public Boolean getPhoneVerified() { return phoneVerified; }
    public void setPhoneVerified(Boolean phoneVerified) { this.phoneVerified = phoneVerified; }

    public Double getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(Double currentBalance) { this.currentBalance = currentBalance; }

    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getLoyaltyPoints() { return loyaltyPoints; }
    public void setLoyaltyPoints(Integer loyaltyPoints) { this.loyaltyPoints = loyaltyPoints; }

    public LoyaltyStatus getLoyaltyStatus() { return loyaltyStatus; }
    public void setLoyaltyStatus(LoyaltyStatus loyaltyStatus) { this.loyaltyStatus = loyaltyStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public LocalDateTime getLastActivityAt() { return lastActivityAt; }
    public void setLastActivityAt(LocalDateTime lastActivityAt) { this.lastActivityAt = lastActivityAt; }

    public String getPhoneNumber() { return primaryPhoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.primaryPhoneNumber = phoneNumber; }

    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public boolean isActive() {
        return status == CustomerStatus.ACTIVE;
    }

    public boolean isNewCustomer() {
        return loyaltyStatus == LoyaltyStatus.NEW_CUSTOMER;
    }

    // Enterprise helper methods
    public void addDeviceMac(String macAddress) {
        if (macAddress == null || macAddress.isEmpty()) return;
        try {
            java.util.List<String> macs = new java.util.ArrayList<>();
            if (deviceMacHistory != null && !deviceMacHistory.equals("[]")) {
                String[] existing = deviceMacHistory.replace("[", "").replace("]", "").replace("\"", "").split(",");
                macs = new java.util.ArrayList<>(java.util.Arrays.asList(existing));
            }
            if (!macs.contains(macAddress)) {
                macs.add(macAddress);
            }
            this.deviceMacHistory = java.util.Arrays.toString(macs.toArray());
            this.lastDeviceMac = macAddress;
        } catch (Exception e) {
            this.deviceMacHistory = "[\"" + macAddress + "\"]";
            this.lastDeviceMac = macAddress;
        }
    }

    public java.util.List<String> getDeviceMacList() {
        if (deviceMacHistory == null || deviceMacHistory.equals("[]")) {
            return new java.util.ArrayList<>();
        }
        try {
            String[] macs = deviceMacHistory.replace("[", "").replace("]", "").replace("\"", "").split(",");
            return new java.util.ArrayList<>(java.util.Arrays.asList(macs));
        } catch (Exception e) {
            return new java.util.ArrayList<>();
        }
    }

    // Getters and Setters for new fields
    public String getDeviceMacHistory() { return deviceMacHistory; }
    public void setDeviceMacHistory(String deviceMacHistory) { this.deviceMacHistory = deviceMacHistory; }

    public String getBlacklistReason() { return blacklistReason; }
    public void setBlacklistReason(String blacklistReason) { this.blacklistReason = blacklistReason; }

    public Integer getTotalSessions() { return totalSessions; }
    public void setTotalSessions(Integer totalSessions) { this.totalSessions = totalSessions; }

    public String getLastDeviceMac() { return lastDeviceMac; }
    public void setLastDeviceMac(String lastDeviceMac) { this.lastDeviceMac = lastDeviceMac; }

    public InstallationStatus getInstallationStatus() { return installationStatus; }
    public void setInstallationStatus(InstallationStatus installationStatus) { this.installationStatus = installationStatus; }

    public String getTechnicianAssigned() { return technicianAssigned; }
    public void setTechnicianAssigned(String technicianAssigned) { this.technicianAssigned = technicianAssigned; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Integer getContractDurationMonths() { return contractDurationMonths; }
    public void setContractDurationMonths(Integer contractDurationMonths) { this.contractDurationMonths = contractDurationMonths; }

    public LoyaltyTier getLoyaltyTier() { return loyaltyTier; }
    public void setLoyaltyTier(LoyaltyTier loyaltyTier) { this.loyaltyTier = loyaltyTier; }

    // Relationship getters and setters
    public java.util.List<com.ggnetworks.entity.Payment> getPayments() { return payments; }
    public void setPayments(java.util.List<com.ggnetworks.entity.Payment> payments) { this.payments = payments; }

    public java.util.List<com.ggnetworks.entity.Invoice> getInvoices() { return invoices; }
    public void setInvoices(java.util.List<com.ggnetworks.entity.Invoice> invoices) { this.invoices = invoices; }

    public java.util.List<com.ggnetworks.entity.Transaction> getTransactions() { return transactions; }
    public void setTransactions(java.util.List<com.ggnetworks.entity.Transaction> transactions) { this.transactions = transactions; }

    public java.util.List<com.ggnetworks.entity.HotspotUser> getHotspotUsers() { return hotspotUsers; }
    public void setHotspotUsers(java.util.List<com.ggnetworks.entity.HotspotUser> hotspotUsers) { this.hotspotUsers = hotspotUsers; }

    public Integer getTotalPointsEarned() { return totalPointsEarned; }
    public void setTotalPointsEarned(Integer totalPointsEarned) { this.totalPointsEarned = totalPointsEarned; }

    public Integer getTotalPointsRedeemed() { return totalPointsRedeemed; }
    public void setTotalPointsRedeemed(Integer totalPointsRedeemed) { this.totalPointsRedeemed = totalPointsRedeemed; }

    public LocalDateTime getLastPointsEarnedAt() { return lastPointsEarnedAt; }
    public void setLastPointsEarnedAt(LocalDateTime lastPointsEarnedAt) { this.lastPointsEarnedAt = lastPointsEarnedAt; }

    /**
     * Update loyalty tier based on current points
     */
    public void updateLoyaltyTier() {
        if (loyaltyPoints >= 400) {
            this.loyaltyTier = LoyaltyTier.PLATINUM;
        } else if (loyaltyPoints >= 151) {
            this.loyaltyTier = LoyaltyTier.GOLD;
        } else if (loyaltyPoints >= 51) {
            this.loyaltyTier = LoyaltyTier.SILVER;
        } else {
            this.loyaltyTier = LoyaltyTier.BRONZE;
        }
    }
}