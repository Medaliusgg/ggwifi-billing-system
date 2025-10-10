package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "sms_campaigns")
public class SmsCampaign extends BaseEntity {

    @NotBlank(message = "Campaign name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Message content is required")
    @Column(name = "message_content", nullable = false, columnDefinition = "TEXT")
    private String messageContent;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CampaignStatus status = CampaignStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CampaignType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_audience", nullable = false)
    private TargetAudience targetAudience;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "total_recipients")
    private Integer totalRecipients = 0;

    @Column(name = "sent_count")
    private Integer sentCount = 0;

    @Column(name = "delivered_count")
    private Integer deliveredCount = 0;

    @Column(name = "failed_count")
    private Integer failedCount = 0;

    @Column(name = "opened_count")
    private Integer openedCount = 0;

    @Column(name = "clicked_count")
    private Integer clickedCount = 0;

    @Column(name = "cost_per_sms", precision = 10, scale = 4)
    private BigDecimal costPerSms;

    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "sender_id")
    private String senderId;

    @Column(name = "template_id")
    private String templateId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_urgent")
    private Boolean isUrgent = false;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "max_retries")
    private Integer maxRetries = 3;

    public enum CampaignStatus {
        DRAFT, SCHEDULED, SENDING, COMPLETED, FAILED, CANCELLED, PAUSED
    }

    public enum CampaignType {
        PROMOTIONAL, TRANSACTIONAL, NOTIFICATION, SURVEY, REMINDER, WELCOME
    }

    public enum TargetAudience {
        ALL_CUSTOMERS, HOTSPOT_USERS, PPPOE_USERS, NEW_CUSTOMERS, OLD_CUSTOMERS,
        INACTIVE_CUSTOMERS, PREMIUM_CUSTOMERS, LOCATION_BASED, CUSTOM_LIST
    }

    public boolean isScheduled() {
        return status == CampaignStatus.SCHEDULED;
    }

    public boolean isActive() {
        return status == CampaignStatus.SENDING;
    }

    public boolean isCompleted() {
        return status == CampaignStatus.COMPLETED;
    }

    public boolean isFailed() {
        return status == CampaignStatus.FAILED;
    }

    public boolean canBeSent() {
        return status == CampaignStatus.DRAFT || status == CampaignStatus.SCHEDULED;
    }

    public double getDeliveryRate() {
        if (sentCount == 0) return 0.0;
        return (double) deliveredCount / sentCount * 100;
    }

    public double getSuccessRate() {
        if (totalRecipients == 0) return 0.0;
        return (double) deliveredCount / totalRecipients * 100;
    }
} 