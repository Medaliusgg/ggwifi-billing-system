package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Device Fingerprint Entity
 * Stores device fingerprints for MAC randomization immunity
 */
@Entity
@Table(name = "device_fingerprints", indexes = {
    @Index(name = "idx_fingerprint_hash", columnList = "fingerprint_hash", unique = true),
    @Index(name = "idx_voucher_code", columnList = "voucher_code"),
    @Index(name = "idx_phone_number", columnList = "phone_number")
})
public class DeviceFingerprint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "fingerprint_hash", nullable = false, unique = true, length = 64)
    private String fingerprintHash;
    
    @Column(name = "voucher_code", length = 11)
    private String voucherCode;
    
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    
    @Column(name = "first_mac_address", length = 17)
    private String firstMacAddress;
    
    @Column(name = "last_mac_address", length = 17)
    private String lastMacAddress;
    
    @Column(name = "first_ip_address", length = 45)
    private String firstIpAddress;
    
    @Column(name = "last_ip_address", length = 45)
    private String lastIpAddress;
    
    @Column(name = "mac_changes_count")
    private Integer macChangesCount = 0;
    
    @Column(name = "ip_changes_count")
    private Integer ipChangesCount = 0;
    
    @Column(name = "access_count")
    private Integer accessCount = 0;
    
    @Column(name = "first_seen")
    private LocalDateTime firstSeen;
    
    @Column(name = "last_seen")
    private LocalDateTime lastSeen;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFingerprintHash() { return fingerprintHash; }
    public void setFingerprintHash(String fingerprintHash) { this.fingerprintHash = fingerprintHash; }
    
    public String getVoucherCode() { return voucherCode; }
    public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getFirstMacAddress() { return firstMacAddress; }
    public void setFirstMacAddress(String firstMacAddress) { this.firstMacAddress = firstMacAddress; }
    
    public String getLastMacAddress() { return lastMacAddress; }
    public void setLastMacAddress(String lastMacAddress) { this.lastMacAddress = lastMacAddress; }
    
    public String getFirstIpAddress() { return firstIpAddress; }
    public void setFirstIpAddress(String firstIpAddress) { this.firstIpAddress = firstIpAddress; }
    
    public String getLastIpAddress() { return lastIpAddress; }
    public void setLastIpAddress(String lastIpAddress) { this.lastIpAddress = lastIpAddress; }
    
    public Integer getMacChangesCount() { return macChangesCount; }
    public void setMacChangesCount(Integer macChangesCount) { this.macChangesCount = macChangesCount; }
    
    public Integer getIpChangesCount() { return ipChangesCount; }
    public void setIpChangesCount(Integer ipChangesCount) { this.ipChangesCount = ipChangesCount; }
    
    public Integer getAccessCount() { return accessCount; }
    public void setAccessCount(Integer accessCount) { this.accessCount = accessCount; }
    
    public LocalDateTime getFirstSeen() { return firstSeen; }
    public void setFirstSeen(LocalDateTime firstSeen) { this.firstSeen = firstSeen; }
    
    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

