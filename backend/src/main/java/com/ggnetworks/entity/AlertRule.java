package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "alert_rules")
public class AlertRule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false)
    private AlertType alertType;
    
    @Column(name = "metric_name", nullable = false)
    private String metricName; // e.g., "router_offline", "payment_failed", "low_balance"
    
    @Column(name = "threshold_value")
    private Double thresholdValue;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "condition_type")
    private Condition condition; // GREATER_THAN, LESS_THAN, EQUALS, NOT_EQUALS
    
    @Column(name = "notification_channels", columnDefinition = "TEXT")
    private String notificationChannels; // Comma-separated: SMS,EMAIL,PUSH
    
    @Column(name = "recipients", columnDefinition = "TEXT")
    private String recipients; // Comma-separated email/phone
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "escalation_enabled")
    private Boolean escalationEnabled = false;
    
    @Column(name = "escalation_delay_minutes")
    private Integer escalationDelayMinutes = 30;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "last_triggered_at")
    private LocalDateTime lastTriggeredAt;
    
    @Column(name = "trigger_count")
    private Long triggerCount = 0L;
    
    public enum AlertType {
        SYSTEM, NETWORK, FINANCIAL, SECURITY, CUSTOM
    }
    
    public enum Condition {
        GREATER_THAN, LESS_THAN, EQUALS, NOT_EQUALS, CONTAINS
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public AlertType getAlertType() { return alertType; }
    public void setAlertType(AlertType alertType) { this.alertType = alertType; }
    
    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }
    
    public Double getThresholdValue() { return thresholdValue; }
    public void setThresholdValue(Double thresholdValue) { this.thresholdValue = thresholdValue; }
    
    public Condition getCondition() { return condition; }
    public void setCondition(Condition condition) { this.condition = condition; }
    
    public String getNotificationChannels() { return notificationChannels; }
    public void setNotificationChannels(String notificationChannels) { this.notificationChannels = notificationChannels; }
    
    public String getRecipients() { return recipients; }
    public void setRecipients(String recipients) { this.recipients = recipients; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Boolean getEscalationEnabled() { return escalationEnabled; }
    public void setEscalationEnabled(Boolean escalationEnabled) { this.escalationEnabled = escalationEnabled; }
    
    public Integer getEscalationDelayMinutes() { return escalationDelayMinutes; }
    public void setEscalationDelayMinutes(Integer escalationDelayMinutes) { this.escalationDelayMinutes = escalationDelayMinutes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getLastTriggeredAt() { return lastTriggeredAt; }
    public void setLastTriggeredAt(LocalDateTime lastTriggeredAt) { this.lastTriggeredAt = lastTriggeredAt; }
    
    public Long getTriggerCount() { return triggerCount; }
    public void setTriggerCount(Long triggerCount) { this.triggerCount = triggerCount; }
}


