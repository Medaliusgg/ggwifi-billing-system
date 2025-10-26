package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "voucher_code", nullable = false, unique = true, length = 11)
    private String voucherCode;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_location")
    private String customerLocation;

    @Column(name = "package_id")
    private Long packageId;

    @Column(name = "package_name")
    private String packageName;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", length = 3)
    private String currency = "TZS";

    @Column(name = "payment_reference")
    private String paymentReference;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "payment_channel")
    private String paymentChannel;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VoucherStatus status = VoucherStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "usage_status")
    private UsageStatus usageStatus = UsageStatus.UNUSED;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "used_by_ip")
    private String usedByIp;

    @Column(name = "used_by_device")
    private String usedByDevice;

    @Column(name = "activated_at")
    private LocalDateTime activatedAt;

    @Column(name = "activated_by")
    private String activatedBy;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "customer_phone_number")
    private String customerPhoneNumber;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Enums
    public enum VoucherStatus {
        ACTIVE, EXPIRED, CANCELLED, SUSPENDED, GENERATED, USED
    }

    public enum UsageStatus {
        UNUSED, USED, EXPIRED
    }

    // Constructors
    public Voucher() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Voucher(String voucherCode, String orderId, String customerName, String customerPhone,
                   String customerEmail, String customerLocation, Long packageId, String packageName,
                   BigDecimal amount, String paymentReference, String transactionId, String paymentChannel) {
        this();
        this.voucherCode = voucherCode;
        this.orderId = orderId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.customerLocation = customerLocation;
        this.packageId = packageId;
        this.packageName = packageName;
        this.amount = amount;
        this.paymentReference = paymentReference;
        this.transactionId = transactionId;
        this.paymentChannel = paymentChannel;
        this.expiresAt = LocalDateTime.now().plusDays(30); // Default 30 days expiry
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVoucherCode() {
        return voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerLocation() {
        return customerLocation;
    }

    public void setCustomerLocation(String customerLocation) {
        this.customerLocation = customerLocation;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getPaymentChannel() {
        return paymentChannel;
    }

    public void setPaymentChannel(String paymentChannel) {
        this.paymentChannel = paymentChannel;
    }

    public VoucherStatus getStatus() {
        return status;
    }

    public void setStatus(VoucherStatus status) {
        this.status = status;
    }

    public UsageStatus getUsageStatus() {
        return usageStatus;
    }

    public void setUsageStatus(UsageStatus usageStatus) {
        this.usageStatus = usageStatus;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public void setUsedAt(LocalDateTime usedAt) {
        this.usedAt = usedAt;
    }

    public String getUsedByIp() {
        return usedByIp;
    }

    public void setUsedByIp(String usedByIp) {
        this.usedByIp = usedByIp;
    }

    public String getUsedByDevice() {
        return usedByDevice;
    }

    public void setUsedByDevice(String usedByDevice) {
        this.usedByDevice = usedByDevice;
    }

    public LocalDateTime getActivatedAt() {
        return activatedAt;
    }

    public void setActivatedAt(LocalDateTime activatedAt) {
        this.activatedAt = activatedAt;
    }

    public String getActivatedBy() {
        return activatedBy;
    }

    public void setActivatedBy(String activatedBy) {
        this.activatedBy = activatedBy;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getCustomerPhoneNumber() {
        return customerPhoneNumber;
    }

    public void setCustomerPhoneNumber(String customerPhoneNumber) {
        this.customerPhoneNumber = customerPhoneNumber;
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

    // Helper methods
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isUsed() {
        return usageStatus == UsageStatus.USED;
    }

    public boolean isActive() {
        return status == VoucherStatus.ACTIVE && !isExpired() && !isUsed();
    }
    
    // Additional methods needed by services
    public void setIsUsed(boolean isUsed) {
        this.usageStatus = isUsed ? UsageStatus.USED : UsageStatus.UNUSED;
        if (isUsed) {
            this.usedAt = LocalDateTime.now();
        }
    }
    
    public void setIsActive(boolean isActive) {
        this.status = isActive ? VoucherStatus.ACTIVE : VoucherStatus.CANCELLED;
    }
}