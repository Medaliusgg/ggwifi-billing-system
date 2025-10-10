package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "feedback")
public class Feedback extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank(message = "Name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @Email(message = "Email should be valid")
    @Column(name = "email")
    private String email;

    @Pattern(regexp = "^0[0-9]{8,9}$", message = "Phone number must start with 0 and be 9-10 digits")
    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @NotBlank(message = "Subject is required")
    @Column(name = "subject", nullable = false)
    private String subject;

    @NotBlank(message = "Message is required")
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(name = "rating")
    private Integer rating;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FeedbackStatus status = FeedbackStatus.PENDING;

    public enum FeedbackStatus {
        PENDING, READ, RESPONDED
    }

    public boolean isPending() {
        return status == FeedbackStatus.PENDING;
    }

    public boolean isRead() {
        return status == FeedbackStatus.READ;
    }

    public boolean isResponded() {
        return status == FeedbackStatus.RESPONDED;
    }

    public void markAsRead() {
        this.status = FeedbackStatus.READ;
    }

    public void markAsResponded() {
        this.status = FeedbackStatus.RESPONDED;
    }
} 