package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Voucher Entity
 * Represents a Wi-Fi access voucher purchased by a customer
 */
@Entity
@Table(name = "vouchers", indexes = {
    @Index(name = "idx_voucher_code", columnList = "voucher_code", unique = true),
    @Index(name = "idx_order_id", columnList = "order_id"),
    @Index(name = "idx_customer_phone", columnList = "customer_phone"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_usage_status", columnList = "usage_status")
})
public class Voucher {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "voucher_code", unique = true, nullable = false, length = 11)
    private String voucherCode;
    
    @Column(name = "order_id", length = 64)
    private String orderId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private InternetPackage internetPackage;
    
    @Column(name = "package_name", length = 200)
    private String packageName;
    
    @Column(name = "customer_name", length = 200)
    private String customerName;
    
    @Column(name = "customer_phone", length = 20)
    private String customerPhone;
    
    @Column(name = "customer_phone_number", length = 20)
    private String customerPhoneNumber;
    
    @Column(name = "customer_email", length = 200)
    private String customerEmail;
    
    @Column(name = "customer_location", length = 200)
    private String customerLocation;
    
    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "currency", length = 3)
    private String currency = "TZS";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VoucherStatus status = VoucherStatus.ACTIVE;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "usage_status", nullable = false)
    private UsageStatus usageStatus = UsageStatus.UNUSED;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @Column(name = "used_at")
    private LocalDateTime usedAt;
    
    @Column(name = "activated_at")
    private LocalDateTime activatedAt;
    
    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
    
    @Column(name = "payment_reference", length = 128)
    private String paymentReference;
    
    @Column(name = "transaction_id", length = 128)
    private String transactionId;
    
    @Column(name = "payment_channel", length = 50)
    private String paymentChannel;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum VoucherStatus {
        ACTIVE, EXPIRED, CANCELLED, GENERATED
    }
    
    public enum UsageStatus {
        UNUSED, USED, EXPIRED
    }
    
    // Constructors
    public Voucher() {}
    
    public Voucher(String voucherCode, String orderId) {
        this.voucherCode = voucherCode;
        this.orderId = orderId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getVoucherCode() { return voucherCode; }
    public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }
    
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    
    public InternetPackage getInternetPackage() { return internetPackage; }
    public void setInternetPackage(InternetPackage internetPackage) { this.internetPackage = internetPackage; }
    
    public Long getPackageId() {
        return internetPackage != null ? internetPackage.getId() : null;
    }
    
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    
    public String getCustomerPhoneNumber() { return customerPhoneNumber; }
    public void setCustomerPhoneNumber(String customerPhoneNumber) { this.customerPhoneNumber = customerPhoneNumber; }
    
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    
    public String getCustomerLocation() { return customerLocation; }
    public void setCustomerLocation(String customerLocation) { this.customerLocation = customerLocation; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public VoucherStatus getStatus() { return status; }
    public void setStatus(VoucherStatus status) { this.status = status; }
    
    public UsageStatus getUsageStatus() { return usageStatus; }
    public void setUsageStatus(UsageStatus usageStatus) { this.usageStatus = usageStatus; }
    
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    
    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }
    
    public LocalDateTime getActivatedAt() { return activatedAt; }
    public void setActivatedAt(LocalDateTime activatedAt) { this.activatedAt = activatedAt; }
    
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    
    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public String getPaymentChannel() { return paymentChannel; }
    public void setPaymentChannel(String paymentChannel) { this.paymentChannel = paymentChannel; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
