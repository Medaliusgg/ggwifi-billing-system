package com.ggnetworks.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_interactions")
public class ContactInteraction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;
    
    @Column(name = "interaction_type", nullable = false)
    private String interactionType; // PAYMENT_INITIATED, VOUCHER_USED, SMS_SENT, etc.
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "voucher_code")
    private String voucherCode;
    
    @Column(name = "location")
    private String location;
    
    @Column(name = "amount")
    private Double amount;
    
    @Column(name = "package_id")
    private String packageId;
    
    @Column(name = "package_name")
    private String packageName;
    
    @Column(name = "payment_status")
    private String paymentStatus;
    
    @Column(name = "order_id")
    private String orderId;
    
    @Column(name = "transaction_id")
    private String transactionId;
    
    @Column(name = "sms_message")
    private String smsMessage;
    
    @Column(name = "email_subject")
    private String emailSubject;
    
    @Column(name = "email_content")
    private String emailContent;
    
    @Column(name = "is_successful")
    private Boolean isSuccessful = true;
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "system_generated")
    private Boolean systemGenerated = false;
    
    @Column(name = "metadata")
    private String metadata; // JSON string for additional data
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "data_used_mb")
    private Long dataUsedMb;
    
    @Column(name = "session_start")
    private LocalDateTime sessionStart;
    
    @Column(name = "session_end")
    private LocalDateTime sessionEnd;
    
    @Column(name = "device_mac")
    private String deviceMac;
    
    @Column(name = "device_ip")
    private String deviceIp;
    
    @Column(name = "router_id")
    private String routerId;
    
    @Column(name = "notes")
    private String notes;
    
    // Constructors
    public ContactInteraction() {}
    
    public ContactInteraction(Contact contact, String interactionType, String description) {
        this.contact = contact;
        this.interactionType = interactionType;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Contact getContact() { return contact; }
    public void setContact(Contact contact) { this.contact = contact; }
    
    public String getInteractionType() { return interactionType; }
    public void setInteractionType(String interactionType) { this.interactionType = interactionType; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getVoucherCode() { return voucherCode; }
    public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getPackageId() { return packageId; }
    public void setPackageId(String packageId) { this.packageId = packageId; }
    
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public String getSmsMessage() { return smsMessage; }
    public void setSmsMessage(String smsMessage) { this.smsMessage = smsMessage; }
    
    public String getEmailSubject() { return emailSubject; }
    public void setEmailSubject(String emailSubject) { this.emailSubject = emailSubject; }
    
    public String getEmailContent() { return emailContent; }
    public void setEmailContent(String emailContent) { this.emailContent = emailContent; }
    
    public Boolean getIsSuccessful() { return isSuccessful; }
    public void setIsSuccessful(Boolean isSuccessful) { this.isSuccessful = isSuccessful; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public Boolean getSystemGenerated() { return systemGenerated; }
    public void setSystemGenerated(Boolean systemGenerated) { this.systemGenerated = systemGenerated; }
    
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public Long getDataUsedMb() { return dataUsedMb; }
    public void setDataUsedMb(Long dataUsedMb) { this.dataUsedMb = dataUsedMb; }
    
    public LocalDateTime getSessionStart() { return sessionStart; }
    public void setSessionStart(LocalDateTime sessionStart) { this.sessionStart = sessionStart; }
    
    public LocalDateTime getSessionEnd() { return sessionEnd; }
    public void setSessionEnd(LocalDateTime sessionEnd) { this.sessionEnd = sessionEnd; }
    
    public String getDeviceMac() { return deviceMac; }
    public void setDeviceMac(String deviceMac) { this.deviceMac = deviceMac; }
    
    public String getDeviceIp() { return deviceIp; }
    public void setDeviceIp(String deviceIp) { this.deviceIp = deviceIp; }
    
    public String getRouterId() { return routerId; }
    public void setRouterId(String routerId) { this.routerId = routerId; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}