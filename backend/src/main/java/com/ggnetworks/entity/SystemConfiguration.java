package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_configurations")
public class SystemConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "config_key", unique = true, nullable = false)
    private String configKey;

    @Column(name = "config_value", nullable = false, columnDefinition = "TEXT")
    private String configValue;

    @Column(name = "description")
    private String description;

    @Column(name = "category", nullable = false)
    @Enumerated(EnumType.STRING)
    private ConfigCategory category;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_encrypted")
    private Boolean isEncrypted = false;

    @Column(name = "default_value")
    private String defaultValue;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum ConfigCategory {
        PAYMENT_GATEWAY, SMS_GATEWAY, SYSTEM_SETTINGS, INTEGRATION, NOTIFICATION, SECURITY
    }

    // Constructors
    public SystemConfiguration() {}

    public SystemConfiguration(String configKey, String configValue, String description, ConfigCategory category) {
        this.configKey = configKey;
        this.configValue = configValue;
        this.description = description;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getConfigKey() { return configKey; }
    public void setConfigKey(String configKey) { this.configKey = configKey; }

    public String getConfigValue() { return configValue; }
    public void setConfigValue(String configValue) { this.configValue = configValue; }
    
    public String getValue() { return configValue; }
    public void setValue(String value) { this.configValue = value; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ConfigCategory getCategory() { return category; }
    public void setCategory(ConfigCategory category) { this.category = category; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsEncrypted() { return isEncrypted; }
    public void setIsEncrypted(Boolean isEncrypted) { this.isEncrypted = isEncrypted; }

    public String getDefaultValue() { return defaultValue; }
    public void setDefaultValue(String defaultValue) { this.defaultValue = defaultValue; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
