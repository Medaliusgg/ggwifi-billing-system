package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
}