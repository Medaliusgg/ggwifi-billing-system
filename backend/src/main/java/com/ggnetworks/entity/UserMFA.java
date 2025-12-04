package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * User MFA Entity
 * Stores MFA configuration for users
 */
@Entity
@Table(name = "user_mfa", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id", unique = true)
})
public class UserMFA {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;
    
    @Column(name = "secret_key", nullable = false, length = 32)
    private String secretKey;
    
    @Column(name = "enabled", nullable = false)
    private Boolean enabled = false;
    
    @Column(name = "backup_codes", columnDefinition = "TEXT")
    private String backupCodes; // JSON array of backup codes
    
    @Column(name = "last_used_backup_code")
    private String lastUsedBackupCode;
    
    @Column(name = "setup_completed_at")
    private LocalDateTime setupCompletedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getSecretKey() { return secretKey; }
    public void setSecretKey(String secretKey) { this.secretKey = secretKey; }
    
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    
    public String getBackupCodes() { return backupCodes; }
    public void setBackupCodes(String backupCodes) { this.backupCodes = backupCodes; }
    
    public String getLastUsedBackupCode() { return lastUsedBackupCode; }
    public void setLastUsedBackupCode(String lastUsedBackupCode) { this.lastUsedBackupCode = lastUsedBackupCode; }
    
    public LocalDateTime getSetupCompletedAt() { return setupCompletedAt; }
    public void setSetupCompletedAt(LocalDateTime setupCompletedAt) { this.setupCompletedAt = setupCompletedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

