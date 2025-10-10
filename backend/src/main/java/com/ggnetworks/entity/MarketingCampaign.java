package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing marketing campaigns for advertisements and promotions
 * This entity manages campaigns, banners, videos, and SMS broadcasts
 */
@Entity
@Table(name = "marketing_campaigns")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MarketingCampaign extends BaseEntity {
    
    @Column(name = "campaign_name", nullable = false, length = 255)
    private String campaignName;
    
    @Column(name = "campaign_code", unique = true, length = 50)
    private String campaignCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "campaign_type", nullable = false)
    private CampaignType campaignType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", nullable = false)
    private MediaType mediaType;
    
    @Column(name = "title", length = 255)
    private String title;
    
    @Column(name = "subtitle", length = 255)
    private String subtitle;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "banner_url", length = 500)
    private String bannerUrl;
    
    @Column(name = "video_url", length = 500)
    private String videoUrl;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;
    
    @Column(name = "call_to_action", length = 255)
    private String callToAction;
    
    @Column(name = "target_url", length = 500)
    private String targetUrl;
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;
    
    @Column(name = "ad_counter")
    private Integer adCounter;
    
    @Column(name = "duration_before_skip")
    private Integer durationBeforeSkip;
    
    @Column(name = "display_duration_seconds")
    private Integer displayDurationSeconds;
    
    @Column(name = "budget", precision = 10, scale = 2)
    private BigDecimal budget;
    
    @Column(name = "spent_amount", precision = 10, scale = 2)
    private BigDecimal spentAmount;
    
    @Column(name = "impression_count")
    private Long impressionCount;
    
    @Column(name = "click_count")
    private Long clickCount;
    
    @Column(name = "conversion_count")
    private Long conversionCount;
    
    @Column(name = "ctr_percentage")
    private Double ctrPercentage;
    
    @Column(name = "conversion_rate")
    private Double conversionRate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "target_audience")
    private TargetAudience targetAudience;
    
    @Column(name = "location_ids")
    private String locationIds;
    
    @Column(name = "router_ids")
    private String routerIds;
    
    @Column(name = "package_ids")
    private String packageIds;
    
    @Column(name = "user_segments")
    private String userSegments;
    
    @Column(name = "device_types")
    private String deviceTypes;
    
    @Column(name = "browser_types")
    private String browserTypes;
    
    @Column(name = "os_types")
    private String osTypes;
    
    @Column(name = "frequency_cap")
    private Integer frequencyCap;
    
    @Column(name = "frequency_period_hours")
    private Integer frequencyPeriodHours;
    
    @Column(name = "priority")
    private Integer priority;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CampaignStatus status;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "is_featured")
    private Boolean isFeatured;
    
    @Column(name = "is_roaming_enabled")
    private Boolean isRoamingEnabled;
    
    @Column(name = "show_on_login")
    private Boolean showOnLogin;
    
    @Column(name = "show_on_package_selection")
    private Boolean showOnPackageSelection;
    
    @Column(name = "show_on_payment")
    private Boolean showOnPayment;
    
    @Column(name = "show_on_success")
    private Boolean showOnSuccess;
    
    @Column(name = "sms_content")
    private String smsContent;
    
    @Column(name = "sms_recipients")
    private String smsRecipients;
    
    @Column(name = "sms_scheduled_time")
    private LocalDateTime smsScheduledTime;
    
    @Column(name = "sms_sent_count")
    private Integer smsSentCount;
    
    @Column(name = "sms_delivered_count")
    private Integer smsDeliveredCount;
    
    @Column(name = "sms_failed_count")
    private Integer smsFailedCount;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    public enum CampaignType {
        BANNER,
        VIDEO,
        POPUP,
        NOTIFICATION,
        SMS_BROADCAST,
        EMAIL_CAMPAIGN,
        SOCIAL_MEDIA,
        SEARCH_ENGINE,
        AFFILIATE,
        REFERRAL
    }
    
    public enum MediaType {
        IMAGE,
        VIDEO,
        TEXT,
        HTML,
        SMS,
        EMAIL
    }
    
    public enum TargetAudience {
        ALL_USERS,
        HOTSPOT_USERS,
        PPPOE_USERS,
        NEW_USERS,
        EXISTING_USERS,
        PREMIUM_USERS,
        BUSINESS_USERS,
        RESIDENTIAL_USERS,
        GUEST_USERS,
        LOYALTY_USERS
    }
    
    public enum CampaignStatus {
        DRAFT,
        SCHEDULED,
        ACTIVE,
        PAUSED,
        COMPLETED,
        CANCELLED,
        EXPIRED
    }
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
        if (status == null) {
            status = CampaignStatus.DRAFT;
        }
        if (isActive == null) {
            isActive = true;
        }
        if (isFeatured == null) {
            isFeatured = false;
        }
        if (isRoamingEnabled == null) {
            isRoamingEnabled = false;
        }
        if (showOnLogin == null) {
            showOnLogin = false;
        }
        if (showOnPackageSelection == null) {
            showOnPackageSelection = false;
        }
        if (showOnPayment == null) {
            showOnPayment = false;
        }
        if (showOnSuccess == null) {
            showOnSuccess = false;
        }
        if (priority == null) {
            priority = 0;
        }
        if (impressionCount == null) {
            impressionCount = 0L;
        }
        if (clickCount == null) {
            clickCount = 0L;
        }
        if (conversionCount == null) {
            conversionCount = 0L;
        }
        if (smsSentCount == null) {
            smsSentCount = 0;
        }
        if (smsDeliveredCount == null) {
            smsDeliveredCount = 0;
        }
        if (smsFailedCount == null) {
            smsFailedCount = 0;
        }
    }
} 