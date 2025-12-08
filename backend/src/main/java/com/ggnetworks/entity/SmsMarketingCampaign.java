package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * SMS Marketing Campaign Entity
 * Separate from MediaCampaign - handles SMS broadcasts and automation
 */
@Entity
@Table(name = "sms_marketing_campaigns")
public class SmsMarketingCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id", unique = true, nullable = false, length = 50)
    private String campaignId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "campaign_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private CampaignType campaignType;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CampaignStatus status = CampaignStatus.DRAFT;

    @Column(name = "channel", nullable = false, length = 20)
    private String channel = "SMS";

    @Column(name = "message_template", columnDefinition = "TEXT")
    private String messageTemplate;

    @Column(name = "template_id", length = 50)
    private String templateId; // Reference to SmsTemplate

    @Column(name = "subject", length = 200)
    private String subject;

    @Column(name = "schedule_at")
    private LocalDateTime scheduleAt;

    @Column(name = "target_filters", columnDefinition = "JSON")
    private String targetFilters; // JSON string for audience filters

    @Column(name = "segment_id", length = 50)
    private String segmentId; // Reference to AudienceSegment

    @Column(name = "auto_repeat")
    private Boolean autoRepeat = false;

    @Column(name = "repeat_interval_days")
    private Integer repeatIntervalDays;

    @Column(name = "include_hotspot_customers")
    private Boolean includeHotspotCustomers = true;

    @Column(name = "include_pppoe_customers")
    private Boolean includePppoeCustomers = false;

    @Column(name = "loyalty_point_threshold")
    private Integer loyaltyPointThreshold;

    @Column(name = "inactivity_days_threshold")
    private Integer inactivityDaysThreshold;

    @Column(name = "last_executed_at")
    private LocalDateTime lastExecutedAt;

    @Column(name = "total_sent")
    private Long totalSent = 0L;

    @Column(name = "total_failed")
    private Long totalFailed = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CampaignType {
        SMS_BROADCAST,
        SMS_AUTOMATION,
        SCHEDULED_PROMOTION
    }

    public enum CampaignStatus {
        DRAFT,
        SCHEDULED,
        RUNNING,
        COMPLETED,
        PAUSED,
        CANCELLED
    }

    // Constructors
    public SmsMarketingCampaign() {}

    public SmsMarketingCampaign(String campaignId, String name, CampaignType campaignType) {
        this.campaignId = campaignId;
        this.name = name;
        this.campaignType = campaignType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCampaignId() { return campaignId; }
    public void setCampaignId(String campaignId) { this.campaignId = campaignId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public CampaignType getCampaignType() { return campaignType; }
    public void setCampaignType(CampaignType campaignType) { this.campaignType = campaignType; }

    public CampaignStatus getStatus() { return status; }
    public void setStatus(CampaignStatus status) { this.status = status; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getMessageTemplate() { return messageTemplate; }
    public void setMessageTemplate(String messageTemplate) { this.messageTemplate = messageTemplate; }

    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDateTime getScheduleAt() { return scheduleAt; }
    public void setScheduleAt(LocalDateTime scheduleAt) { this.scheduleAt = scheduleAt; }

    public String getTargetFilters() { return targetFilters; }
    public void setTargetFilters(String targetFilters) { this.targetFilters = targetFilters; }

    public String getSegmentId() { return segmentId; }
    public void setSegmentId(String segmentId) { this.segmentId = segmentId; }

    public Boolean getAutoRepeat() { return autoRepeat; }
    public void setAutoRepeat(Boolean autoRepeat) { this.autoRepeat = autoRepeat; }

    public Integer getRepeatIntervalDays() { return repeatIntervalDays; }
    public void setRepeatIntervalDays(Integer repeatIntervalDays) { this.repeatIntervalDays = repeatIntervalDays; }

    public Boolean getIncludeHotspotCustomers() { return includeHotspotCustomers; }
    public void setIncludeHotspotCustomers(Boolean includeHotspotCustomers) { this.includeHotspotCustomers = includeHotspotCustomers; }

    public Boolean getIncludePppoeCustomers() { return includePppoeCustomers; }
    public void setIncludePppoeCustomers(Boolean includePppoeCustomers) { this.includePppoeCustomers = includePppoeCustomers; }

    public Integer getLoyaltyPointThreshold() { return loyaltyPointThreshold; }
    public void setLoyaltyPointThreshold(Integer loyaltyPointThreshold) { this.loyaltyPointThreshold = loyaltyPointThreshold; }

    public Integer getInactivityDaysThreshold() { return inactivityDaysThreshold; }
    public void setInactivityDaysThreshold(Integer inactivityDaysThreshold) { this.inactivityDaysThreshold = inactivityDaysThreshold; }

    public LocalDateTime getLastExecutedAt() { return lastExecutedAt; }
    public void setLastExecutedAt(LocalDateTime lastExecutedAt) { this.lastExecutedAt = lastExecutedAt; }

    public Long getTotalSent() { return totalSent; }
    public void setTotalSent(Long totalSent) { this.totalSent = totalSent; }

    public Long getTotalFailed() { return totalFailed; }
    public void setTotalFailed(Long totalFailed) { this.totalFailed = totalFailed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

