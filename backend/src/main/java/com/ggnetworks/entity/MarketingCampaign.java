package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "marketing_campaigns", indexes = {
        @Index(name = "idx_campaign_type", columnList = "campaign_type"),
        @Index(name = "idx_campaign_status", columnList = "status")
})
public class MarketingCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id", unique = true, nullable = false)
    private String campaignId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "campaign_type", nullable = false)
    private CampaignType campaignType = CampaignType.BROADCAST;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CampaignStatus status = CampaignStatus.DRAFT;

    @Column(name = "channel", nullable = false)
    private String channel = "SMS";

    @Column(name = "message_template", columnDefinition = "TEXT")
    private String messageTemplate;

    @Column(name = "subject")
    private String subject;

    @Column(name = "schedule_at")
    private LocalDateTime scheduleAt;

    @Column(name = "last_executed_at")
    private LocalDateTime lastExecutedAt;

    @Column(name = "target_filters", columnDefinition = "TEXT")
    private String targetFilters;

    @Column(name = "auto_repeat")
    private Boolean autoRepeat = false;

    @Column(name = "repeat_interval_days")
    private Integer repeatIntervalDays;

    @Column(name = "include_hotspot_customers")
    private Boolean includeHotspotCustomers = true;

    @Column(name = "include_pppoe_customers")
    private Boolean includePppoeCustomers = true;

    @Column(name = "loyalty_point_threshold")
    private Integer loyaltyPointThreshold;

    @Column(name = "inactivity_days_threshold")
    private Integer inactivityDaysThreshold;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum CampaignType {
        BROADCAST,
        BIRTHDAY,
        FLASH_PROMOTION,
        UPSELL,
        WIN_BACK,
        LOYALTY_REMINDER
    }

    public enum CampaignStatus {
        DRAFT,
        SCHEDULED,
        RUNNING,
        COMPLETED,
        CANCELLED
    }

    public MarketingCampaign() {
        this.campaignId = "MC-" + System.currentTimeMillis();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CampaignType getCampaignType() {
        return campaignType;
    }

    public void setCampaignType(CampaignType campaignType) {
        this.campaignType = campaignType;
    }

    public CampaignStatus getStatus() {
        return status;
    }

    public void setStatus(CampaignStatus status) {
        this.status = status;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getMessageTemplate() {
        return messageTemplate;
    }

    public void setMessageTemplate(String messageTemplate) {
        this.messageTemplate = messageTemplate;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public LocalDateTime getScheduleAt() {
        return scheduleAt;
    }

    public void setScheduleAt(LocalDateTime scheduleAt) {
        this.scheduleAt = scheduleAt;
    }

    public LocalDateTime getLastExecutedAt() {
        return lastExecutedAt;
    }

    public void setLastExecutedAt(LocalDateTime lastExecutedAt) {
        this.lastExecutedAt = lastExecutedAt;
    }

    public String getTargetFilters() {
        return targetFilters;
    }

    public void setTargetFilters(String targetFilters) {
        this.targetFilters = targetFilters;
    }

    public Boolean getAutoRepeat() {
        return autoRepeat;
    }

    public void setAutoRepeat(Boolean autoRepeat) {
        this.autoRepeat = autoRepeat;
    }

    public Integer getRepeatIntervalDays() {
        return repeatIntervalDays;
    }

    public void setRepeatIntervalDays(Integer repeatIntervalDays) {
        this.repeatIntervalDays = repeatIntervalDays;
    }

    public Boolean getIncludeHotspotCustomers() {
        return includeHotspotCustomers;
    }

    public void setIncludeHotspotCustomers(Boolean includeHotspotCustomers) {
        this.includeHotspotCustomers = includeHotspotCustomers;
    }

    public Boolean getIncludePppoeCustomers() {
        return includePppoeCustomers;
    }

    public void setIncludePppoeCustomers(Boolean includePppoeCustomers) {
        this.includePppoeCustomers = includePppoeCustomers;
    }

    public Integer getLoyaltyPointThreshold() {
        return loyaltyPointThreshold;
    }

    public void setLoyaltyPointThreshold(Integer loyaltyPointThreshold) {
        this.loyaltyPointThreshold = loyaltyPointThreshold;
    }

    public Integer getInactivityDaysThreshold() {
        return inactivityDaysThreshold;
    }

    public void setInactivityDaysThreshold(Integer inactivityDaysThreshold) {
        this.inactivityDaysThreshold = inactivityDaysThreshold;
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
}

