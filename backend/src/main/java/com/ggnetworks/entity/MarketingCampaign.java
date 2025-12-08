package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Marketing Campaign Entity
 * Stores video/image campaigns for customer portal
 */
@Entity
@Table(name = "marketing_campaigns")
public class MarketingCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id", unique = true, nullable = false, length = 50)
    private String campaignId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CampaignType type; // VIDEO, IMAGE

    @Column(name = "media_url", nullable = false, length = 500)
    private String mediaUrl;

    @Column(name = "badge", length = 50)
    private String badge; // e.g., "New", "Limited Time"

    @Column(name = "cta_text", length = 100)
    private String ctaText; // Call-to-action text

    @Column(name = "cta_url", length = 500)
    private String ctaUrl; // Where to navigate on click

    @Column(name = "duration_seconds")
    private Integer durationSeconds; // For video campaigns

    @Column(name = "skip_after_seconds")
    private Integer skipAfterSeconds = 2; // Auto-advance after N seconds

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "priority", nullable = false)
    private Integer priority = 0; // Higher = shown first

    @Column(name = "target_audience", length = 50)
    private String targetAudience; // ALL, NEW_USER, RETURNING_USER, etc.

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "impression_count")
    private Long impressionCount = 0L;

    @Column(name = "click_count")
    private Long clickCount = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CampaignType {
        VIDEO, IMAGE
    }

    // Constructors
    public MarketingCampaign() {}

    public MarketingCampaign(String campaignId, String title, CampaignType type, String mediaUrl) {
        this.campaignId = campaignId;
        this.title = title;
        this.type = type;
        this.mediaUrl = mediaUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCampaignId() { return campaignId; }
    public void setCampaignId(String campaignId) { this.campaignId = campaignId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public CampaignType getType() { return type; }
    public void setType(CampaignType type) { this.type = type; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getCtaText() { return ctaText; }
    public void setCtaText(String ctaText) { this.ctaText = ctaText; }

    public String getCtaUrl() { return ctaUrl; }
    public void setCtaUrl(String ctaUrl) { this.ctaUrl = ctaUrl; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public Integer getSkipAfterSeconds() { return skipAfterSeconds; }
    public void setSkipAfterSeconds(Integer skipAfterSeconds) { this.skipAfterSeconds = skipAfterSeconds; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Long getImpressionCount() { return impressionCount; }
    public void setImpressionCount(Long impressionCount) { this.impressionCount = impressionCount; }

    public Long getClickCount() { return clickCount; }
    public void setClickCount(Long clickCount) { this.clickCount = clickCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
