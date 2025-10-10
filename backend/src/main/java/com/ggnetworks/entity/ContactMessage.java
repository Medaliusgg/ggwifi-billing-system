package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "contact_messages")
public class ContactMessage extends BaseEntity {

    @NotBlank(message = "Name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(name = "email", nullable = false)
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

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MessageStatus status = MessageStatus.PENDING;

    public enum MessageStatus {
        PENDING, READ, RESPONDED
    }

    public boolean isPending() {
        return status == MessageStatus.PENDING;
    }

    public boolean isRead() {
        return status == MessageStatus.READ;
    }

    public boolean isResponded() {
        return status == MessageStatus.RESPONDED;
    }

    public void markAsRead() {
        this.status = MessageStatus.READ;
    }

    public void markAsResponded() {
        this.status = MessageStatus.RESPONDED;
    }
} 