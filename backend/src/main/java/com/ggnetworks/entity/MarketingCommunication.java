package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "marketing_communications")
public class MarketingCommunication extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "communication_type", nullable = false)
    private CommunicationType communicationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "channel", nullable = false)
    private Channel channel;

    @Column(name = "subject")
    private String subject;

    @Column(name = "message_content", columnDefinition = "TEXT")
    private String messageContent;

    @Column(name = "template_id")
    private String templateId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CommunicationStatus status = CommunicationStatus.PENDING;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "clicked_at")
    private LocalDateTime clickedAt;

    @Column(name = "delivery_status")
    private String deliveryStatus;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "cost")
    private Double cost = 0.0;

    @Column(name = "campaign_id")
    private String campaignId;

    @Column(name = "customer_type")
    @Enumerated(EnumType.STRING)
    private CustomerProfile.CustomerType customerType;

    @Column(name = "notes")
    private String notes;

    // Communication Type Enum
    public enum CommunicationType {
        WELCOME_MESSAGE,
        BIRTHDAY_GREETING,
        LOYALTY_REWARD,
        PROMOTIONAL_OFFER,
        SERVICE_REMINDER,
        PAYMENT_REMINDER,
        WINBACK_CAMPAIGN,
        REFERRAL_INCENTIVE,
        NEW_SERVICE_ANNOUNCEMENT,
        MAINTENANCE_NOTICE,
        CUSTOM_MESSAGE
    }

    // Channel Enum
    public enum Channel {
        SMS,
        EMAIL,
        WHATSAPP,
        PUSH_NOTIFICATION,
        IN_APP_MESSAGE
    }

    // Communication Status Enum
    public enum CommunicationStatus {
        PENDING,        // Scheduled but not sent
        SENDING,        // Currently being sent
        SENT,           // Successfully sent
        DELIVERED,      // Delivered to recipient
        READ,           // Read by recipient
        CLICKED,        // Clicked (for emails/links)
        FAILED,         // Failed to send
        CANCELLED       // Cancelled before sending
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (scheduledAt == null) {
            scheduledAt = LocalDateTime.now();
        }
    }
} 