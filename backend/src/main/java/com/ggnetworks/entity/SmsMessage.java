package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "sms_messages")
public class SmsMessage extends BaseEntity {

    @NotBlank(message = "Phone number is required")
    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @NotBlank(message = "Message content is required")
    @Column(name = "message_content", nullable = false, columnDefinition = "TEXT")
    private String messageContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private SmsCampaign campaign;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MessageStatus status = MessageStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private MessageType type;

    @Column(name = "message_id")
    private String messageId;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "delivery_status")
    private String deliveryStatus;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "cost", precision = 10, scale = 4)
    private BigDecimal cost;

    @Column(name = "sender_id")
    private String senderId;

    @Column(name = "template_id")
    private String templateId;

    @Column(name = "is_urgent")
    private Boolean isUrgent = false;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public enum MessageStatus {
        PENDING, SENDING, SENT, DELIVERED, FAILED, CANCELLED, EXPIRED
    }

    public enum MessageType {
        PROMOTIONAL, TRANSACTIONAL, NOTIFICATION, OTP, REMINDER, WELCOME, SURVEY
    }

    public boolean isPending() {
        return status == MessageStatus.PENDING;
    }

    public boolean isSent() {
        return status == MessageStatus.SENT;
    }

    public boolean isDelivered() {
        return status == MessageStatus.DELIVERED;
    }

    public boolean isFailed() {
        return status == MessageStatus.FAILED;
    }

    public boolean canBeRetried() {
        return status == MessageStatus.FAILED && retryCount < 3;
    }

    public void markAsSent() {
        this.status = MessageStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }

    public void markAsDelivered() {
        this.status = MessageStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }

    public void markAsFailed(String errorMessage) {
        this.status = MessageStatus.FAILED;
        this.errorMessage = errorMessage;
        this.retryCount++;
    }
} 